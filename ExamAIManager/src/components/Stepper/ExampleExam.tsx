import { useContext, useState } from "react";
import { extractAnswersAfterHu, extractHebrewLettersWithDot } from "../../utils/DataExtraction";
import { Exam } from "../../utils/types";
import StepperDataContext from "./StepperDataContext";
import { Outlet } from "react-router-dom";
import ExamService from "../../services/examService";
import "../../stylies/ExampleExam.css"
import AnalyzeImageService from "../../services/AnalyzeImagService";
const ExampleExam = () => {
    const [progress, setProgress] = useState<number>(0);
    const [processedCount, setProcessedCount] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const { selectedImages, setExams, setIsAbleNext } = useContext(StepperDataContext)!
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const AddNewExam = async (DecodedExam: any) => {
        const classIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("כיתה"))
        const classs = DecodedExam[classIndex + 2].description + DecodedExam[classIndex + 3].description;
        const dateIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("תאריך"))
        const dateExam = DecodedExam[dateIndex + 2].description + DecodedExam[dateIndex + 3].description + ' ' + DecodedExam[dateIndex + 4].description + ' ' + DecodedExam[dateIndex + 5].description
        const subjectIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("מקצוע"))
        const subject = DecodedExam[subjectIndex + 2].description + ' ' + DecodedExam[subjectIndex + 3].description
        const urlNewExam = `exams/Results/${subject}/${subject}-${dateExam}.jpg`
        const response = await ExamService.addExam(classs, dateExam, subject, urlNewExam)
        console.log(response);
        console.log("תאריך:" + dateExam)
        console.log("מקצוע:" + subject)
        console.log("כיתה:" + classs);
        return response.data
    };

    const AddNewAnswers = async (DecodedExam: any, examId: number) => {

        const hebrewLetters = extractHebrewLettersWithDot(DecodedExam)
        const answers = extractAnswersAfterHu(DecodedExam)
        console.log(hebrewLetters);
        console.log(answers);
        for (let i = 0; i < answers.length; i++) {
            await ExamService.addCorrectAnswers(examId, hebrewLetters[i], Number(answers[i]))
        }
    }
    const handleAnalyze = async () => {
        setIsLoading(true);
        setIsFinished(false);
        setTotalCount(selectedImages.length);
        setProgress(0);
        // setProcessedCount(0);
        const allExams: Exam[] = [];
        selectedImages.map(async (image, index) => {
            try {
                const result = await AnalyzeImageService.analyzeImage(image);
                console.log("פלט OCR:", result);
                const newExam = await AddNewExam(result);
                console.log("נוצר מבחן חדש עם ID:", newExam.id);
                await AddNewAnswers(result, newExam.id);
                allExams.push(newExam);
                const newProcessedCount = index + 1;
                setProcessedCount(newProcessedCount);
                setProgress((newProcessedCount / selectedImages.length) * 100);
            } catch (error) {
                console.error("שגיאה בפענוח מבחן:", error);
                const newProcessedCount = index + 1;
                setProcessedCount(newProcessedCount);
                setProgress((newProcessedCount / selectedImages.length) * 100);
            }
        })
        setExams(allExams);
        setTimeout(() => {
            setIsLoading(false)
            setIsFinished(true)
            setIsAbleNext(true)
        }, 5000);
    };

    return (

        <>
            <Outlet />
            <div className="result-tests-container">
                {isLoading ? (
                    <div className="processing-container">
                        <div className="processing-card">
                            <div className="processing-header">
                                <h2 className="processing-title">Processing exams...</h2>
                                <div className="processing-counter">
                                    {processedCount} of {totalCount} exams processed
                                </div>
                            </div>

                            <div className="progress-section">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="progress-text">
                                    {Math.round(progress)}% complete
                                </div>
                            </div>

                            <div className="processing-animation">
                                <div className="processing-dots">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isFinished ? (
                    <div className="completion-container">
                        <div className="success-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h2 className="completion-title">Exam processing completed successfully</h2>
                        <p className="completion-subtitle">
                            All processable exams have been saved to the system.
                        </p>
                        <div className="stats-container">
                            <div className="stat-item">
                                <span className="stat-value">{processedCount}</span>
                                <span className="stat-label">Exams Processed</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="container">
                        <div className="decode-section">
                            <div className="icon-container">
                                <svg className="document-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <h2 className="section-title">Automated test analysis</h2>

                            <p className="section-description">
                                The system will analyze all the tests submitted and provide detailed results.
                            </p>

                            <button onClick={handleAnalyze} className="buttonClikc">Decipher all the tests</button>
                            <div className="info-box">
                                <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>The analysis will be performed on all files uploaded to the system.</span>
                            </div>
                        </div>
                    </div>
                )}
            </div></>
    );
};

export default ExampleExam;
