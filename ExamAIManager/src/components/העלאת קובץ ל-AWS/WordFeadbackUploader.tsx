// components/WordUploader.tsx
import React, { useState } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Exam, Student } from "../types";

const apiUrl = 'https://localhost:7083/api';

type WordProps = {
    student: Student
    exam: Exam
    score: number
}
const WordFeadbackUploader = ({ student, exam, score }: WordProps) => {
    // const [studentName, setStudentName] = useState("ריקי קראוס");
    // const [grade, setGrade] = useState(100);
    // const [feedback, setFeedback] = useState("עבודה מושלמת! כל הכבוד 🎉"); 
    const [studentName, setStudentName] = useState(student.name);
    const [grade, setGrade] = useState(score);
    const [feedback, setFeedback] = useState("עבודה מושלמת! כל הכבוד 🎉");
    const createWordFile = async (studentName: string, grade: number, feedback: string): Promise<Blob> => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `שם התלמיד: ${studentName}`, bold: true }),
                                new TextRun({ text: `\nציון: ${grade}`, break: 1 }),
                                new TextRun({ text: `\nהערה מהמורה:\n${feedback}`, break: 2 }),
                            ],
                        }),
                    ],
                },
            ],
        });
        const buffer = await Packer.toBlob(doc);
        return buffer;
    };
    const handleUploadWord = async () => {
        try {
            const fileName = `feedback_${studentName.replace(/\s/g, "_")}.docx`;
            const wordBlob = await createWordFile(studentName, grade, feedback);

            const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
                params: {
                    fileName,
                    IsStudentTest: true,
                    subject: "feedback",
                    date:exam.dateExam,
                    class: studentName,
                    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // 👈 זה חסר אצלך
                },
            });

            const uploadUrl = response.data.url;

            await axios.put(uploadUrl, wordBlob, {
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "x-amz-acl": "bucket-owner-full-control",
                },
            });

            alert("הקובץ הועלה בהצלחה ל־S3!");
        } catch (error) {
            console.error(error);
            alert("אירעה שגיאה בהעלאת הקובץ.");
        }
    };

    return (
        <div>
            <h2>העלאת משוב ב-Word</h2>
            <button onClick={handleUploadWord}>צור קובץ feadback</button>
        </div>
    );
};

export default WordFeadbackUploader;



