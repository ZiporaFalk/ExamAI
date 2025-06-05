import { useContext, useState } from "react";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { Answer, Exam } from "../../utils/types";
import SignatureSection, { createImageFromDataURL } from "../Creating feedback/SignatureSection";
import StepperDataContext from "../Stepper/StepperDataContext";
import "../../stylies/WordFeedbackUploader.css"
import ExamUploadService from "../../services/ExamUploadService";
const WordFeedbackUploader = () => {
    const { students, exams, scores, answersList, setIsAbleNext } = useContext(StepperDataContext)! 
    const [teacherNote, ] = useState("");
    const [signature, setSignature] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

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
        setIsGenerating(true);
        setIsSuccess(false);
        for (let i = 0; i < students.length; i++) {
            try {
                const student = students[i];
                const exam = exams[i];
                const score = scores[i];

                const matchedGrade = grades.find(g => score >= g.min);
                const feedback = matchedGrade?.text ?? 'ציון לא חוקי';

                const wordBlob = await createWordFile(
                    student.name,
                    score,
                    feedback,
                    answersList[i],
                    teacherNote,
                    signature,
                    exam
                );
                
                await ExamUploadService.uploadStudentWordFeedback(student, exam, wordBlob);
                console.log("✔️ קובץ הועלה בהצלחה");
            } catch (error) {
                console.error("❌ שגיאה בהעלאת הקובץ:", error);
                console.log("אירעה שגיאה בהעלאת הקובץ.");
            }
        }
        setIsAbleNext(true);
        setIsGenerating(false);  
    };

    const studentCards = students && students.length > 0 ? (
        <div className="students-grid">
            {students.map((student, index) => (
                <div key={index} className="student-card">
                    <h3>{`${student.name}`}</h3>
                    <div className="student-details">
                        <div>
                            <span>Subject:</span>
                            <span>{exams?.[index]?.subject || "N/A"}</span>
                        </div>
                        <div>
                            <span>Date:</span>
                            <span>{exams?.[index]?.dateExam || "N/A"}</span>
                        </div>
                        <div>
                            <span>Score:</span>
                            <span className="score">{scores[index]}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ) : null;

    return (
        <div className="word-uploader-container">
            <h1>WordFeedbackUploader</h1>
            <div className="word-uploader-header">
                <h1>Create Feedback Files</h1>
                <p>Generate Word files with detailed feedback for each student</p>
            </div>
            {studentCards}
            <div className="signature-container">
                <SignatureSection onSave={setSignature} signature={signature} />
            </div>
            <div className="actions-container">
                <button
                    className={`create-button ${isGenerating ? 'generating' : ''}`}
                    onClick={handleUploadWord}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <span className="spinner"></span>
                            Generating files...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Create Feedback Files
                        </>
                    )}
                </button>


            </div>
            {isSuccess && (
                <div className="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Feedback files created successfully
                </div>
            )}
        </div>
    );
}
export default WordFeedbackUploader;




