import {  extractAnswersAfterHu, extractDateAndSubject, extractHebrewLettersWithDot, extractStudent } from "../../utils/DataExtraction";
import { Answer, Exam, Student } from "../../utils/types";
import { useContext, useState } from "react";
import StepperDataContext from "./StepperDataContext";
import { Link, Outlet } from "react-router-dom";
import "../../stylies/CheckStudentExam.css"
import { ClipboardList } from 'lucide-react';
import "../../stylies/UnregisteredStudentMessage.css"
import SubmissionService from "../../services/SubmissionService";
import ExamService from "../../services/examService";
import studentStore from "../Dashboard/StudentStore";
import EmailService from "../../services/EmailService";
import StudentSheetService from "../../services/StudentSheetService";
import AnalyzeImageService from "../../services/AnalyzeImagService";
const CheckStudentExams = () => {
  const { selectedImages, setExams, setAnswersList, setStudents, setScores, setIsAbleNext } = useContext(StepperDataContext)!
  const [isLoading, setIsLoading] = useState(false); 
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [averageMark, setAverageMark] = useState<number | null>(null);
  const [currentProcessing, setCurrentProcessing] = useState<string>("");
  const [unregisteredStudents, ] = useState<{ name: string }[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [click, setClick] = useState(false)

  const SaveStudentExam = async (score: number, examId: number, feedbackUrl: string, fileUrl: string, studentId: number) => {
    try {
      await SubmissionService.saveStudentExam(score, examId, feedbackUrl, fileUrl, studentId);
    } catch (error) {
      console.error("Failed to save student exam", error);
    }
  };

  const CheckTheTest = async (data: any[]) => {
    console.log(data);
    const dateAndSubject = extractDateAndSubject(data);
    console.log(dateAndSubject);
    const exam = await ExamService.getBySubjectAndDate(dateAndSubject)
    console.log(exam);
    const letters = extractHebrewLettersWithDot(data);
    const numbersAnswer = extractAnswersAfterHu(data);
    const CorrectAnswers = await ExamService.getCorrectAnswers(exam);
    console.log(CorrectAnswers);
    console.log(letters);
    console.log(numbersAnswer);
    let count = 0;
    const answersStudent: Answer[] = [];
    letters.forEach((letter, i) => {
      const answer: Answer = {
        questionNumber: letter,
        correctAnswer: CorrectAnswers[i]?.correctAnswer,
        isCorrect: CorrectAnswers.some((item: any) =>
          item.questionNumber === letter && item.correctAnswer === Number(numbersAnswer?.[i])
        )
      };
      if (answer.isCorrect) count++;
      answersStudent.push(answer);
    });
    console.log(answersStudent);
    console.log(count);
    const score = count * (100 / letters.length);
    console.log(`הציון:${score}`);
    return { score, exam_id: exam.id, answersStudent, dateAndSubject };
  };

  const handleAnalyze = async () => {
    setClick(true)
    setIsLoading(true); 
    setIsFinished(false);
    const exams: Exam[] = []
    const students: Student[] = []
    const scores: number[] = []
    const answersStudents: Answer[][] = []
    selectedImages.forEach(async (image, i) => {
      const progressPercentage = Math.round(((i + 1) / selectedImages.length) * 100);
      setProgress(progressPercentage);
      setCurrentProcessing(`Processing exam ${i + 1} of ${selectedImages.length}...`);
      const result = await AnalyzeImageService.analyzeImage(image);
      const { score, exam_id, answersStudent } = await CheckTheTest(result);
      const exam = await extractDateAndSubject(result)
      const student: Student = await extractStudent(result)
      console.log(student);
      const url = `exams/Students/${exam.subject}-${exam.dateExam}/${student.studentClass}/`
      const fileNamefeedback = `${student.name.replace(/\s/g, "_")}_feedback.docx`;
      const feedbackurl = url + fileNamefeedback
      const fileurl = url + student.name + `.jpg`
      console.log(feedbackurl);
      console.log(fileurl);
      // const studentId = await GetStudentId(result);
      // const email = (await axios.get(`${apiUrl}/Student/${studentId}`)).data.email
      // const email = await studentStore.getEmailByStudentId(studentId)
      // student.email = email
      // ....................................................................................................
      //   try {
      // const studentByName = await studentStore.getStudentByClassAndName(student.studentClass, student.name);
      //     await SubmissionService.create({
      //       studentId: studentByName.id,
      //       examId: exam.id,
      //       score: newMark,
      //       fileUrl: fileExamUrl,
      //       fileUrlFeedback: fileFeedbackUrl
      //     });
      //     allExams.push(exam);
      //     allMarks.push(newMark);
      //     allAnswers.push(answer);
      //     allStudents.push(student);
      //   }
      //   catch (e: any) {
      //     console.log("the pupil is not exist");
      //     // הסר את הקובץ מהקבצים בצורה תקינה
      //     updatedFiles[i] = null;
      //     // הוסף לסטודנטים שלא רשומים
      //     notRegisteredStudents.push({
      //       firstName: student.firstName,
      //       lastName: student.lastName
      //     });
      //     // שלח מייל
      //     const email = await StudentSheetService.getStudentEmail(student.firstName, student.lastName, student.class);
      //     await EmailService.sendAnEmail(
      //       `${student.firstName} ${student.lastName}`,
      //       email,
      //       " לרישום נה להכנס ללינק הבא : \nעליך להרשם בהקדם\n 📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!"
      //     );
      //     setHasError(true);
      //   }
      // }
      // ....................................................................................................
      // בודקת אם נמצא בנתונים=בטרי....
      // אם נפל בקטש
      // ..ושולחת מייל
      // בקטש: 1 2 שליחת מייל
      // ....על פי שם וכיתה שולפת המייל מהגוגל שיט

      try {
        const studentByName: Student = await studentStore.getStudentByClassAndName(student.studentClass, student.name);
        await SaveStudentExam(score, exam_id, feedbackurl, fileurl, studentByName.id!);
        // const email = await studentStore.getEmailByStudentId(studentId)
        const email = await studentStore.getEmailByStudentId(studentByName.id!)
        student.email = email
        exams.push(exam)
        students.push(student)
        scores.push(score)
        answersStudents.push(answersStudent)
        const avg = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)) : null;
        setAverageMark(avg);
        setProgress(100);
        setCurrentProcessing("Processing completed successfully!");
      } catch (err: any) {
        console.error("the pupil is not exist" + err);
        unregisteredStudents.push({ name: student.name })//////////////////////////////////////////////////////////////
        console.log(unregisteredStudents);
        console.log("unregisteredStudents");
        // updatedFiles[i] = null;
        const email = await StudentSheetService.getStudentEmail(student.name, student.studentClass);
        await EmailService.sendMail(
          " :לרישום נא להיכנס ללינק הבא : \nעליך להרשם בהקדם\n 📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!",
          `שלום לך ${student.name}!`,
          email,
        );
        setHasError(true);
        setHasError(err)
      }
      finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    })
    setExams(exams)
    console.log(averageMark);
    console.log(exams);
    setAnswersList(answersStudents)
    setStudents(students)
    setScores(scores)
    // setIsLoading(false);
    setIsFinished(true);
    setIsAbleNext(true)
  };
  const UnregisteredStudentMessage = ({ students }: { students: { name: string }[] }) => (
    <div className="error-container" style={{
      padding: "24px",
      backgroundColor: "#fef2f2",
      borderRadius: "8px",
      border: "1px solid #fecaca",
      marginBottom: "20px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "20px auto"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "16px"
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginRight: "8px" }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#b91c1c",
        marginBottom: "12px"
      }}>
        Registration Error
      </h3>
      {students.map((student, index) => (
        <div key={index} id="exam">
          <p id="exam_p"> The student <strong>{student.name}</strong> is not registered.<br />
            An email with a registration link has been sent to the student.</p>
          <p id="error-msg">A reminder will be sent to you.</p> </div>))}
      <div style={{ marginTop: "20px" }}>
        <Link id="return-home-link" to="/" onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }} >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Return to homepage
        </Link>
      </div>
    </div>
  );
  const EnhancedEmptyState = () => (
    <div className="empty-state"   >
      <div className="empty-icon" >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      </div>
      <h3 className="empty-title">No exams submitted for processing</h3>
      <p className="empty-subtitle"  >Upload exam files to begin processing</p>
      <Link id="upload-exams-link" to="/upload" onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "10px" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload Exams
      </Link>
    </div>
  );

  return (
    // <div style={{ textAlign: "center", marginTop: "50px" }}>
    //   <h1>בדיקת מבחנים</h1>
    //   {isLoading ? (
    //     <Stack direction="column" alignItems="center" spacing={2}>
    //       <CircularProgress />
    //       <Typography>מחשב ציון...</Typography>
    //     </Stack>
    //   ) : isFinished ? (
    //     <Typography color="success.main" fontWeight="bold">
    //       ✔ המבחנים נבדקו!
    //     </Typography>
    //   ) : (
    //     <Button variant="contained" onClick={handleAnalyze}>
    //       בדוק את כל המבחנים
    //     </Button>
    //   )}
    // </div>
    <>
      <h1>CheckStudentExams</h1>
      <Outlet />
      <div className="student-tests-container">
        {!click &&
          <div className="divButton">
            <ClipboardList size={150} className="iconCheck" />
            <button className="buttonCheck" onClick={handleAnalyze}>בדוק את כל המבחנים</button>
          </div>
        }
        {isLoading ? (
          <div className="processing-container">
            <div className="processing-card">
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {currentProcessing} {progress}%
                </div>
              </div>
              <div className="loading-animation">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
        ) : hasError && unregisteredStudents.length > 0 ? (
          <UnregisteredStudentMessage students={unregisteredStudents} />
        ) : isFinished && averageMark !== null ? (
          <div className="completion-container">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="completion-title">Exam processing completed successfully</h2>
            <div className="average-score">
              <span className="score-label">Average Score:</span>
              <span className="score-value">{averageMark}%</span>
            </div>
          </div>
        ) : click ? (<EnhancedEmptyState />) : <></>
        }
      </div>
    </>
  );
};

export default CheckStudentExams;

// import { useEffect, useState } from "react"
// import UpdateFileCV from "./UpdateCV"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import "../styles/CVs.css"

// const CVs = () => {
//   const baseUrl = process.env.REACT_APP_API_BASE_URL
//   const navigate = useNavigate()
//   const [files, setFiles] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedFileData, setSelectedFileData] = useState<any | null>(null)
//   const [selectedPdf, setSelectedPdf] = useState<string | null>(null)

//   const checkIfBlocked = async () => {
//     const userId = localStorage.getItem("userId")
//     if (!userId) {
//       console.warn("⚠️ אין userId - מניחים שהמשתמש חסום")
//       return true
//     }
//     try {
//       const response = await axios.get(`${baseUrl}/api/Users/is-blocked/${userId}`)
//       return response.data === true
//     } catch (err) {
//       return true
//     }
//   }

//   const fetchUserFiles = async () => {
//     const token = localStorage.getItem("token")
//     const userId = localStorage.getItem("userId")
//     if (!token || !userId) {
//       setError("לא נמצא אסימון התחברות או userId")
//       setLoading(false)
//       navigate("/")
//       return
//     }
//     try {
//       const response = await axios.get(`${baseUrl}/file-cv/user-files`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 5000,
//       })
//       setFiles(response.data)
//     } catch (err: any) {
//       setError("שגיאה בטעינת הקבצים")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUserFiles()
//   }, [])

//   const handleCreateNewCV = async () => {
//     const isBlocked = await checkIfBlocked()
//     if (isBlocked) {
//       alert("הגישה נחסמה. אינך יכול ליצור קבצים מכיוון שאתה חסום על ידי המערכת.")
//       return
//     }
//     if (files.length >= 5) {
//       alert("ניתן ליצור עד 5 קבצי קורות חיים בלבד.")
//       return
//     }
//     navigate("/all-templates")
//   }

//   return (
//     <>
//       <div className="cvs-container">
//         <div className="geometric-decoration square"></div>
//         <div className="geometric-decoration rectangle"></div>
//         <div className="geometric-decoration triangle"></div>

//         <div className="cvs-header">
//           <h2 className="cvs-title">קורות החיים שלי</h2>
//           <button className="create-cv-button" onClick={handleCreateNewCV}>
//             יצירת קו"ח חדשים <span>+</span>
//           </button>
//         </div>

//         {selectedFileData ? (
//           <div className="update-section">
//             <UpdateFileCV file={selectedFileData} onClose={() => setSelectedFileData(null)} onUpdate={fetchUserFiles} />
//           </div>
//         ) : (
//           <div>
//             {loading ? (
//               <div className="loading-container">
//                 <div className="loading-spinner"></div>
//                 <p>טוען קבצים...</p>
//               </div>
//             ) : error ? (
//               <div className="error-container">שגיאה: {error}</div>
//             ) : (
//               <div className="files-section">
//                 <h3>קבצים שלך:</h3>
//                 {files.length > 0 ? (
//                   <ul className="files-list">
//                     {files.map((file) => (
//                       <li key={file.id ?? file.path} className="file-item">
//                         <p className="file-path">{file.path}</p>
//                         <div className="file-actions">
//                           <button
//                             className="update-button"
//                             onClick={async () => {
//                               const isBlocked = await checkIfBlocked()
//                               if (isBlocked) {
//                                 alert("הגישה נחסמה. אינך יכול לעדכן קבצים מכיוון שאתה חסום על ידי המערכת.")
//                                 return
//                               }
//                               console.log("נבחר קובץ לעדכון:", file)
//                               setSelectedFileData(file)
//                             }}
//                           >
//                             עדכן
//                           </button>
//                           <button
//                             className="delete-button"
//                             onClick={async () => {
//                               const isBlocked = await checkIfBlocked()
//                               if (isBlocked) {
//                                 alert("הגישה נחסמה. אינך יכול למחוק קבצים מכיוון שאתה חסום על ידי המערכת.")
//                                 return
//                               }
//                               navigate(`/delete/${file.id}`)
//                             }}
//                           >
//                             🗑 מחק
//                           </button>
//                         </div>
//                         <img
//                           src={`https://cvfilebuilder.s3.amazonaws.com/${file.path}`}
//                           alt={`תצוגה מקדימה של ${file.path}`}
//                           className="small-preview-image"
//                         />
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="no-files">אין קבצים זמינים</div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {selectedPdf && (
//           <div className="pdf-viewer">
//             <h3>הצגת PDF:</h3>
//             <iframe
//               src={`https://cvfilebuilder.s3.amazonaws.com/${selectedPdf}`}
//               className="file-preview-frame"
//               title={`Preview of ${selectedPdf}`}
//               width="400"
//               height="300"
//             ></iframe>
//             <button className="close-button" onClick={() => setSelectedPdf(null)}>
//               סגור
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default CVs

