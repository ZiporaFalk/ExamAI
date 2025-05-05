
import { useState } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { Answer, Exam, Student } from "../types";
import SignatureSection, { createImageFromDataURL } from "../יצירת פידבק/SignatureSection";

const apiUrl = 'https://localhost:7083/api';

type WordProps = {
    students: Student[];
    exams: Exam[];
    scores: number[];
    answerss: Answer[][];
};
const WordFeadbackUploader = ({ students, exams, scores, answerss }: WordProps) => {
    const [teacherNote, setTeacherNote] = useState("");
    const [signature, setSignature] = useState<string | null>(null);
    // const studentName = student.name
    const grades = [
        { min: 90, text: 'ציון מצוין' },
        { min: 80, text: 'ציון מעולה' },
        { min: 70, text: 'נפלא' },
        { min: 50, text: 'טוב' },
        { min: 0, text: 'טעון שיפור' }
    ];

    const createText = (text: string, options?: Partial<{ bold: boolean, break: number }>) => {
        return new TextRun({ text, font: "Calibri Light", size: 48, bold: options?.bold, break: options?.break });
    };

    const createParagraph = (children: TextRun[], options?: Partial<{ alignment: "left" | "center" | "right"; bidirectional: boolean }>) => {
        return new Paragraph({
            spacing: { line: 276, lineRule: "auto" },
            alignment: options?.alignment,
            bidirectional: options?.bidirectional,
            children,
        });
    };
    const createWordFile = async (
        studentName: string, 
        grade: number,
        feedback: string,
        answers: Answer[],
        teacherNote: string,
        signature: string | null,
        exam: Exam
    ): Promise<Blob> => {
        const answerParagraphs = answers.map(answer => {
            const baseText = `שאלה ${answer.questionNumber}`;
            const answerText = answer.isCorrect ? `✅    ${baseText} •` : `${baseText}    ❌  התשובה הנכונה: ${answer.correctAnswer} •`;
            return createParagraph([createText(answerText)]);
        });
        const children: Paragraph[] = [
            createParagraph([createText("בס\"ד\n", { bold: true })], { alignment: "center" }),
            createParagraph([createText("🎊 דף משוב לתלמיד", { bold: true })], { alignment: "center" }),
            createParagraph([createText(`${studentName} - ${exam.subject}`)], { alignment: "center" }),
            createParagraph([
                createText(`🎉`), createText("הציון שלך: ", { bold: true }), createText(` ${grade} – ${feedback} `)
            ], { alignment: "center" }),
            createParagraph([createText(":התשובות\n", { bold: true })], { alignment: "left" }),
            ...answerParagraphs,
            new Paragraph({ text: "", spacing: { after: 200 } }),
            createParagraph([
                createText("הערות: ", { bold: true }),
                createText(teacherNote || "לא הוזנה הערה")
            ], { alignment: AlignmentType.CENTER, bidirectional: true, }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
        ];

        if (signature) {
            const imageRun = await createImageFromDataURL(signature);
            children.push(
                new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, children: [createText(":חתימה  ", { bold: true })] }),
                new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [imageRun] })
            );
        }

        const doc = new Document({
            sections: [{ properties: {}, children }],
        });
        return await Packer.toBlob(doc);
    };

    const handleUploadWord = async () => {
        students.forEach(async (student, i) => {
            try {
                const fileName = `${student.name.replace(/\s/g, "_")}_feedback.docx`;
                const matchedGrade = grades.find(g => scores[i] >= g.min);
                const feedback = matchedGrade?.text ?? 'ציון לא חוקי';
                const wordBlob = await createWordFile(student.name, scores[i], feedback, answerss[i], teacherNote, signature,exams[i]);
                const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
                    params: {
                        fileName,
                        IsStudentTest: true,
                        subject: exams[i].subject,
                        date: exams[i].dateExam,
                        class: student.studentClass,
                        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
        });

    };
    /////////////////////////////////////////// הורדת קובץ הפידבק///////////////////////////////////////////////////////////
    // const handleDownload = async () => {
    //     try {
    //         const fileName = `${studentName.replace(/\s/g, "_")}_feedback.docx`;
    //         const response = await axios.get(`${apiUrl}/ExamUpload/download-url`, {
    //             params: {
    //                 fileName,
    //                 IsStudentTest: true,
    //                 subject: exam.subject,
    //                 date: exam.dateExam,
    //                 class: student.studentClass,
    //             }
    //         });
    //         const url = response.data.url; // גישה נכונה לנתון מתוך התגובה
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = fileName; // שם הקובץ שיישמר בהורדה
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } catch (error) {
    //         console.error("שגיאה בהורדת הקובץ:", error);
    //     }
    // }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div>
            <h2>העלאת משוב ב-Word</h2>
            <div>
                <label>הערה מהמורה:</label><br />
                <textarea
                    value={teacherNote}
                    onChange={(e) => setTeacherNote(e.target.value)}
                    rows={4}
                    cols={50}
                    placeholder="הקלידי כאן את ההערה..." />
            </div>
            <SignatureSection onSave={setSignature} signature={signature} />

            <button onClick={handleUploadWord}>צור קובץ feedback</button>
            {/* <button onClick={handleDownload}>הורד קובץ</button> */}
        </div>
    );
}
export default WordFeadbackUploader;







// import { useState } from "react";
// import axios from "axios";
// import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
// import { Answer, Exam, Student } from "../types";
// import SignatureSection, { createImageFromDataURL } from "../יצירת פידבק/SignatureSection";

// const apiUrl = 'https://localhost:7083/api';

// type WordProps = {
//     student: Student;
//     exam: Exam;
//     score: number;
//     answers: Answer[];
// };
// const WordFeadbackUploader = ({ student, exam, score, answers }: WordProps) => {
//     const [teacherNote, setTeacherNote] = useState("");
//     const [signature, setSignature] = useState<string | null>(null);
//     const studentName = student.name
//     const grades = [
//         { min: 90, text: 'ציון מצוין' },
//         { min: 80, text: 'ציון מעולה' },
//         { min: 70, text: 'נפלא' },
//         { min: 50, text: 'טוב' },
//         { min: 0, text: 'טעון שיפור' }
//     ];

//     const createText = (text: string, options?: Partial<{ bold: boolean, break: number }>) => {
//         return new TextRun({ text, font: "Calibri Light", size: 48, bold: options?.bold, break: options?.break });
//     };

//     const createParagraph = (children: TextRun[], options?: Partial<{ alignment: "left" | "center" | "right"; bidirectional: boolean }>) => {
//         return new Paragraph({
//             spacing: { line: 276, lineRule: "auto" },
//             alignment: options?.alignment,
//             bidirectional: options?.bidirectional,
//             children,
//         });
//     };
//     const createWordFile = async (
//         studentName: string,
//         grade: number,
//         feedback: string,
//         answers: Answer[],
//         teacherNote: string,
//         signature: string | null
//     ): Promise<Blob> => {
//         const answerParagraphs = answers.map(answer => {
//             const baseText = `שאלה ${answer.questionNumber}`;
//             const answerText = answer.isCorrect ? `✅    ${baseText} •` : `${baseText}    ❌  התשובה הנכונה: ${answer.correctAnswer} •`;
//             return createParagraph([createText(answerText)]);
//         });
//         const children: Paragraph[] = [
//             createParagraph([createText("בס\"ד\n", { bold: true })], { alignment: "center" }),
//             createParagraph([createText("🎊 דף משוב לתלמיד", { bold: true })], { alignment: "center" }),
//             createParagraph([createText(`${studentName} - ${exam.subject}`)], { alignment: "center" }),
//             createParagraph([
//                 createText(`🎉`), createText("הציון שלך: ", { bold: true }), createText(` ${grade} – ${feedback} `)
//             ], { alignment: "center" }),
//             createParagraph([createText(":התשובות\n", { bold: true })], { alignment: "left" }),
//             ...answerParagraphs,
//             new Paragraph({ text: "", spacing: { after: 200 } }),
//             createParagraph([
//                 createText("הערות: ", { bold: true }),
//                 createText(teacherNote || "לא הוזנה הערה")
//             ], { alignment: AlignmentType.CENTER, bidirectional: true, }),
//             new Paragraph({ text: "", spacing: { after: 200 } }),
//             new Paragraph({ text: "", spacing: { after: 200 } }),
//         ];

//         if (signature) {
//             const imageRun = await createImageFromDataURL(signature);
//             children.push(
//                 new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, children: [createText(":חתימה  ", { bold: true })] }),
//                 new Paragraph({ alignment: AlignmentType.RIGHT, bidirectional: true, children: [imageRun] })
//             );
//         }

//         const doc = new Document({
//             sections: [{ properties: {}, children }],
//         });
//         return await Packer.toBlob(doc);
//     };

//     const handleUploadWord = async () => {
//         try {
//             const fileName = `${studentName.replace(/\s/g, "_")}_feedback.docx`;
//             const matchedGrade = grades.find(g => score >= g.min);
//             const feedback = matchedGrade?.text ?? 'ציון לא חוקי';
//             const wordBlob = await createWordFile(studentName, score, feedback, answers, teacherNote, signature);
//             const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
//                 params: {
//                     fileName,
//                     IsStudentTest: true,
//                     subject: exam.subject,
//                     date: exam.dateExam,
//                     class: student.studentClass,
//                     contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                 },
//             });
//             const uploadUrl = response.data.url;

//             await axios.put(uploadUrl, wordBlob, {
//                 headers: {
//                     "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                     "x-amz-acl": "bucket-owner-full-control",
//                 },
//             });
//             alert("הקובץ הועלה בהצלחה ל־S3!");
//         } catch (error) {
//             console.error(error);
//             alert("אירעה שגיאה בהעלאת הקובץ.");
//         }
//     };
//     /////////////////////////////////////////// הורדת קובץ הפידבק///////////////////////////////////////////////////////////
//     // const handleDownload = async () => {
//     //     try {
//     //         const fileName = `${studentName.replace(/\s/g, "_")}_feedback.docx`;
//     //         const response = await axios.get(`${apiUrl}/ExamUpload/download-url`, {
//     //             params: {
//     //                 fileName,
//     //                 IsStudentTest: true,
//     //                 subject: exam.subject,
//     //                 date: exam.dateExam,
//     //                 class: student.studentClass,
//     //             }
//     //         });
//     //         const url = response.data.url; // גישה נכונה לנתון מתוך התגובה
//     //         const link = document.createElement('a');
//     //         link.href = url;
//     //         link.download = fileName; // שם הקובץ שיישמר בהורדה
//     //         document.body.appendChild(link);
//     //         link.click();
//     //         document.body.removeChild(link);
//     //     } catch (error) {
//     //         console.error("שגיאה בהורדת הקובץ:", error);
//     //     }
//     // }
//     ////////////////////////////////////////////////////////////////////////////////////////////////////
//     return (
//         <div>
//             <h2>העלאת משוב ב-Word</h2>
//             <div>
//                 <label>הערה מהמורה:</label><br />
//                 <textarea
//                     value={teacherNote}
//                     onChange={(e) => setTeacherNote(e.target.value)}
//                     rows={4}
//                     cols={50}
//                     placeholder="הקלידי כאן את ההערה..." />
//             </div>
//             <SignatureSection onSave={setSignature} signature={signature} />

//             <button onClick={handleUploadWord}>צור קובץ feedback</button>
//             {/* <button onClick={handleDownload}>הורד קובץ</button> */}
//         </div>
//     );
// }
// export default WordFeadbackUploader;
