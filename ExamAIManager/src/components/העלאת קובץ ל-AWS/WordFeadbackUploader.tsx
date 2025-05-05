
import { useState } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { Answer, Exam, Student } from "../types";
import SignatureSection, { createImageFromDataURL } from "../יצירת פידבק/SignatureSection";
// import SignatureSection, { createImageFromDataURL } from "../יצירת פידבק/SignatureSection";
// import SignatureSection, { createImageFromDataURL } from "../SignatureSection";

const apiUrl = 'https://localhost:7083/api';

type WordProps = {
    student: Student;
    exam: Exam;
    score: number;
    answers: Answer[];
};
const WordFeadbackUploader = ({ student, exam,score, answers }: WordProps) => {
    const [studentName, setStudentName] = useState(student.name);
    const [grade, setGrade] = useState(score);
    const [teacherNote, setTeacherNote] = useState("");
    const [signature, setSignature] = useState<string | null>(null);

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
        signature: string | null
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
        try {
            const fileName = `${studentName.replace(/\s/g, "_")}_feedback.docx`;
            const matchedGrade = grades.find(g => grade >= g.min);
            const feedback = matchedGrade?.text ?? 'ציון לא חוקי';
            const wordBlob = await createWordFile(studentName, grade, feedback, answers, teacherNote, signature);
            const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
                params: {
                    fileName,
                    IsStudentTest: true,
                    subject: exam.subject,
                    date: exam.dateExam,
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
    };

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
        </div>
    );
};

export default WordFeadbackUploader;



// ......................בלי חתימה

// // 4 עם רווחים בין השורות
// import { useState } from "react";
// import axios from "axios";
// import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
// import { Answer, Exam, Student } from "../types";

// const apiUrl = 'https://localhost:7083/api';

// type WordProps = {
//     student: Student
//     exam: Exam
//     score: number
//     answers: Answer[]
// }

// const WordFeadbackUploader = ({ student, exam, score, answers }: WordProps) => {
//     const [studentName, setStudentName] = useState(student.name);
//     const [grade, setGrade] = useState(score);
//     const [teacherNote, setTeacherNote] = useState("");

//     const grades = [
//         { min: 90, text: 'ציון מצוין' },
//         { min: 80, text: 'ציון מעולה' },
//         { min: 70, text: 'נפלא' },
//         { min: 50, text: 'טוב' },
//         { min: 0, text: 'טעון שיפור' }
//     ];

//     const createText = (text: string, options?: Partial<{ bold: boolean, break: number }>) => {
//         return new TextRun({
//             text,
//             font: "Calibri Light",
//             size: 48,
//             bold: options?.bold,
//             break: options?.break,
//         });
//     };

//     const createParagraph = (children: TextRun[], options?: Partial<{ alignment: "left" | "center" | "right"; bidirectional: boolean }>
//     ) => {
//         return new Paragraph({
//             spacing: {
//                 line: 276,
//                 lineRule: "auto",
//             },
//             alignment: options?.alignment,
//             bidirectional: options?.bidirectional,
//             children,
//         });
//     };

//     const createWordFile = async (studentName: string, grade: number, feedback: string, answers: Answer[], teacherNote: string)
//         : Promise<Blob> => {
//         const answerParagraphs = answers.map(answer => {
//             const baseText = `שאלה ${answer.questionNumber}`;
//             const answerText = answer.isCorrect
//                 ? `✅    ${baseText} •` : `${baseText}    ❌  התשובה הנכונה: ${answer.correctAnswer} •`;
//             return createParagraph([createText(answerText)]);
//         });

//         const doc = new Document({
//             sections: [
//                 {
//                     properties: {},
//                     children: [
//                         createParagraph([createText("בס\"ד\n", { bold: true })], { alignment: "center" }),
//                         createParagraph([createText("🎊 דף משוב לתלמיד", { bold: true })], { alignment: "center" }),
//                         createParagraph([createText(`${studentName} - ${exam.subject}`)], { alignment: "center" }),
//                         createParagraph([
//                             createText(`🎉`),
//                             createText("הציון שלך: ", { bold: true }),
//                             createText(` ${grade} – ${feedback} `)
//                         ], { alignment: "center" }),
//                         createParagraph([createText(":התשובות\n", { bold: true })], { alignment: "left" }),
//                         ...answerParagraphs,
//                         new Paragraph({ text: "", spacing: { after: 200 } }),
//                         createParagraph([
//                             createText("הערות: ", { bold: true }),
//                             createText(teacherNote || "לא הוזנה הערה")
//                         ], { alignment: AlignmentType.RIGHT, bidirectional: true, }),
//                         new Paragraph({ text: "", spacing: { after: 200 } }),
//                         new Paragraph({ text: "", spacing: { after: 200 } }),
//                         createParagraph([createText("________:חתימה", { bold: true })], { alignment: "right" }),
//                     ],
//                 },
//             ],
//         });

//         return await Packer.toBlob(doc);
//     };

//     const handleUploadWord = async () => {
//         try {
//             const fileName = `${studentName.replace(/\s/g, "_")}_feedback.docx`;
//             const matchedGrade = grades.find(g => grade >= g.min);
//             const feedback = matchedGrade?.text ?? 'ציון לא חוקי';

//             const wordBlob = await createWordFile(studentName, grade, feedback, answers, teacherNote);

//             const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
//                 params: {
//                     fileName,
//                     IsStudentTest: true,
//                     subject: "feedback",
//                     date: exam.dateExam,
//                     class: studentName,
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
//                     placeholder="הקלידי כאן את ההערה..."
//                 />
//             </div>
//             <button onClick={handleUploadWord}>צור קובץ feedback</button>
//         </div>
//     );
// };

// export default WordFeadbackUploader;


