
import { useContext, useState } from "react";
import { extractAnswersAfterHu, extractHebrewLettersWithDot } from "../../utils/DataExtraction";
import { Exam } from "../../utils/types";
import StepperDataContext from "./StepperDataContext";
import { Outlet } from "react-router-dom";
// import "../../stylies/ExampleExam.css"
import ExamService from "../../services/examService";
import "../../stylies/ExampleExam.css"
import AnalyzeImageService from "../../services/AnalyzeImagService";
const ExampleExam = () => {
    // .....
    // const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [processedCount, setProcessedCount] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    // const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
    // .....
    const { selectedImages, setExams ,setIsAbleNext} = useContext(StepperDataContext)!
    // const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // useEffect(() => {
    //     if (selectedImages.length === 0) return;
    //     setIsLoading(true);
    //     setTotalCount(selectedImages.length);
    //     setProgress(0);
    //     setProcessedCount(0);
    // },[])
 
    const AddNewExam = async (DecodedExam: any) => {// מוסיף מבחן דוגמא חדש
        const classIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("כיתה"))
        const classs = DecodedExam[classIndex + 2].description + DecodedExam[classIndex + 3].description;
        const dateIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("תאריך"))
        const dateExam = DecodedExam[dateIndex + 2].description + DecodedExam[dateIndex + 3].description + ' ' + DecodedExam[dateIndex + 4].description + ' ' + DecodedExam[dateIndex + 5].description
        const subjectIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("מקצוע"))
        const subject = DecodedExam[subjectIndex + 2].description + ' ' + DecodedExam[subjectIndex + 3].description
        ///הוספת ניתוב למבחן דוגמא : `${exams[i].subject}-${exams[i].dateExam}`;
        const urlNewExam = `exams/Results/${subject}/${subject}-${dateExam}.jpg`
        // const response = await axios.post(`${apiUrl}/Exam`, { class: classs, dateExam, subject, file_Url: urlNewExam })
        const response = await ExamService.addExam( classs, dateExam, subject,  urlNewExam )
        console.log(response);
        console.log("תאריך:" + dateExam)
        console.log("מקצוע:" + subject)
        console.log("כיתה:" + classs);
        return response.data
    };

    const AddNewAnswers = async (DecodedExam: any, examId: number) => { //מוסיף את התשובות הנכונות למאגר התשובות

        const hebrewLetters = extractHebrewLettersWithDot(DecodedExam)
        const answers = extractAnswersAfterHu(DecodedExam)
        for (let i = 0; i < answers.length; i++) {
            // await axios.post(`${apiUrl}/Answer`, { examId, questionNumber: hebrewLetters[i], correctAnswer: answers[i] })
          await ExamService.addCorrectAnswers(examId,hebrewLetters[i], answers[i] )
        }
        console.log(hebrewLetters);
        console.log(answers);
    }
    const handleAnalyze = async () => {
        setIsLoading(true);
        setIsFinished(false);
                setTotalCount(selectedImages.length);
        setProgress(0);
        setProcessedCount(0);
        const allExams: Exam[] = [];
        // for (const image of selectedImages) {
            selectedImages.map(async(image,index)=>{
            try {
                const result = await AnalyzeImageService.analyzeImage(image);
                console.log("פלט OCR:", result);
                const newExam = await AddNewExam(result);
                console.log("נוצר מבחן חדש עם ID:", newExam.id);
                await AddNewAnswers(result, newExam.id);
                allExams.push(newExam);
                const newProcessedCount = index+1;
                setProcessedCount(newProcessedCount);
                setProgress((newProcessedCount / selectedImages.length) * 100);
            } catch (error) {
                console.error("שגיאה בפענוח מבחן:", error);
                const newProcessedCount = index+1;
                setProcessedCount(newProcessedCount);
                setProgress((newProcessedCount / selectedImages.length) * 100);
            }
        })
        setExams(allExams);
        setTimeout(() => {
        setIsLoading(false);
        setIsFinished(true);
        setIsAbleNext(true)
        }, 5000);
    };

    return (
        // <div style={{ textAlign: "center", marginTop: "50px" }}>
        //     <h1>ExampleExam</h1>
        //     {/* <button onClick={handleAnalyze}>פענח את כל המבחנים</button> */}

        //     {isLoading ? (
        //         <Stack direction="column" alignItems="center" spacing={2}>
        //             <Typography>קורא מבחן...</Typography>
        //             <CircularProgress />
        //         </Stack>
        //     ) : isFinished ? (
        //         <Typography color="success.main" fontWeight="bold">
        //             ✔ המבחנים נבדקו!
        //         </Typography>
        //     ) : (
        //         <Button variant="contained" onClick={handleAnalyze}>פענח את כל המבחנים</Button>)}

        //     {files.map((file) => (
        //         <div key={file?.file.name}>
        //             {file?.file.name}: {progress[file?.file.name] || 0}%
        //         </div>
        //     ))}
        // </div>
        <>
<h1>ExampleExam</h1>
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
                    // <div className="empty-state">
                    //     <div className="empty-icon">
                    //         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    //             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    //             <polyline points="14,2 14,8 20,8" />
                    //             <line x1="16" y1="13" x2="8" y2="13" />
                    //             <line x1="16" y1="17" x2="8" y2="17" />
                    //             <polyline points="10,9 9,9 8,9" />
                    //         </svg>
                    //     </div>
                    //     <h3 className="empty-title">Ready to process exams</h3>
                    //     <p className="empty-subtitle">Upload exam files to begin processing</p>
                    // </div>
                // <Button variant="contained" /Button>
                // ...................................
                <div className="container">
                <div className="decode-section">
                  {/* Icon */}
                  <div className="icon-container">
                    <svg className="document-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <h2 className="section-title">Automated test analysis</h2>
                  
                  <p className="section-description">
                  The system will analyze all the tests submitted and provide detailed results.
                  </p>
                  
                  <button onClick={handleAnalyze} className="buttonClikc">Decipher all the tests</button>
                  <div className="info-box">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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






// import { Outlet } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import { ExamService } from "../services/examService";
// import { AnswerService } from "../services/answerService";
// import { Analyze, extractAnswers, extractExam } from "../utils/ocr";
// import StepperContext from "./context/StepperContext";
// import "../styles/ResultTests.css";
// import { Exam } from "../types";

// const ResultTests = () => {
//     const { selectedImages, setExams } = useContext(StepperContext)!;
//     const [isProcessing, setIsProcessing] = useState<boolean>(false);
//     const [progress, setProgress] = useState<number>(0);
//     const [processedCount, setProcessedCount] = useState<number>(0);
//     const [totalCount, setTotalCount] = useState<number>(0);
//     const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
//     useEffect(() => {
//       const processAllExams = async () => {
//         if (selectedImages.length === 0) return;
  
//         setIsProcessing(true);
//         setTotalCount(selectedImages.length);
//         setProgress(0);
//         setProcessedCount(0);
  
//         const results = await Promise.all(
//           selectedImages.map(async (image, index) => {
//             try {
//               const words = await Analyze(image);
//               const exam = extractExam(words);
  
//               const savedExam = await ExamService.create(exam);
  
//               const answers = extractAnswers(words, savedExam);
//               await Promise.all(
//                 answers.map((a) =>
//                   AnswerService.create(a).catch((e) => {
//                     console.error("שגיאה ביצירת תשובה:", e);
//                     return null;
//                   })
//                 )
//               );
//               const savedAnswers = await AnswerService.getByExamId(savedExam.id);
  
//               if (savedAnswers.length !== answers.length) {
//                 console.warn("מספר תשובות לא תואם, מוחק מבחן...");
//                 await AnswerService.deleteByExamId(savedExam.id);
//                 await ExamService.delete(savedExam.id);
//                 return null;
//               }
  
//               // Update progress
//               const newProcessedCount = index + 1;
//               setProcessedCount(newProcessedCount);
//               setProgress((newProcessedCount / selectedImages.length) * 100);
  
//               return savedExam;
//             } catch (err) {
//               console.error("שגיאה בעיבוד מבחן:", err);
              
//               // Update progress even on error
//               const newProcessedCount = index + 1;
//               setProcessedCount(newProcessedCount);
//               setProgress((newProcessedCount / selectedImages.length) * 100);
              
//               return null;
//             }
//           })
//         );
  
//         const filteredExams = results.filter((exam): exam is Exam => exam !== null);
//         setExams(filteredExams);
//         console.log("מבחנים שנשמרו:", filteredExams);
        
//         setTimeout(() => {
//           setIsProcessing(false);
//           setIsCompleted(true);
//         }, 1000);
//       };
  
//       if (selectedImages.length > 0) {
//         processAllExams();
//       }
//     }, [selectedImages, setExams]);