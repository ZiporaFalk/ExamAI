import { extractAnswersAfterHu, extractDateAndSubject, extractHebrewLettersWithDot, extractStudent } from "../../utils/DataExtraction";
import { Answer, Exam, Student } from "../../utils/types";
import { useContext, useEffect, useState } from "react";
import StepperDataContext from "./StepperDataContext";
import { Outlet } from "react-router-dom";
import "../../stylies/CheckStudentExam.css"
import SubmissionService from "../../services/SubmissionService";
import ExamService from "../../services/examService";
import studentStore from "../Dashboard/StudentStore";
import EmailService from "../../services/EmailService";
import StudentSheetService from "../../services/StudentSheetService";
import AnalyzeImageService from "../../services/AnalyzeImagService";
import UnregisteredStudentMessage from "../../components/AuxiliaryComponents/UnregisteredStudentMessage"
import EnhancedEmptyState from "../AuxiliaryComponents/EnhancedEmptyState";
const CheckStudentExams = () => {
  const { selectedImages, files, setFiles, setExams, setAnswersList, setStudents, setScores, setIsAbleNext } = useContext(StepperDataContext)!
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [averageMark, setAverageMark] = useState<number | null>(null);
  const [currentProcessing, setCurrentProcessing] = useState<string>("");
  const [unregisteredStudents, setUnregisteredStudents] = useState<{ name: string }[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [click, setClick] = useState(false)

  useEffect(() => {
    if (isFinished) {
      setIsAbleNext(true);
    }
  }, [isFinished]);


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
    setUnregisteredStudents([])
    setIsLoading(true);
    setIsFinished(false);
    setProgress(0)
    const exams: Exam[] = []
    const students: Student[] = []
    const scores: number[] = []
    const answersStudents: Answer[][] = []
    const updatedFiles = [...files]
    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
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
      try {
        student.name = 'hgovl'
        student.studentClass = 'hgovl'
        const studentByName: Student = await studentStore.getStudentByClassAndName(student.studentClass, student.name);
        await SaveStudentExam(score, exam_id, feedbackurl, fileurl, studentByName.id!);
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
        setHasError(true);
        console.error("the pupil is not exist" + err);
        unregisteredStudents.push({ name: student.name })
        console.log(unregisteredStudents);
        console.log("unregisteredStudents");
        updatedFiles[i] = null;
        const email = await StudentSheetService.getStudentEmail(student.name, student.studentClass);
        await EmailService.sendMail(
          " :לרישום נא להיכנס ללינק הבא : \nעליך להרשם בהקדם\n 📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!",
          `שלום לך ${student.name}!`,
          email,
        );
        setHasError(true);
        // setHasError(err)
      }
    }
    setExams(exams)
    console.log(averageMark);
    console.log(exams);
    setAnswersList(answersStudents)
    setStudents(students)
    setScores(scores)
    setFiles(updatedFiles)
    setIsFinished(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
 
  return (
    <>
      <Outlet />
      <div className="student-tests-container">
        {files.length === 0 ? (<EnhancedEmptyState />) :
          !click &&
          <div className="exam-check-container">
            <div className="exam-check-content">
              <div className="icon-wrapper">
                <div className="icon-background2">
                  <div className="check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3 8-8" />
                      <path d="M21 12c0 1.66-.046 3.32-.14 4.92a5 5 0 01-4.78 4.78c-8.8.3-16.04.182-20.84-.14a5 5 0 01-4.78-4.78c-.32-4.8-.47-12.04-.14-20.84A5 5 0 015.06.86c1.6-.094 3.26-.14 4.92-.14" />
                    </svg>
                  </div>
                </div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring-delayed"></div>
              </div>
              <h2 className="exam-check-title">Test The checking</h2>
              <p className="exam-check-description">Click to review and analyze all uploaded tests</p>
              <button className="exam-check-button" onClick={handleAnalyze}>
                <span className="button-content">
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.395 0 4.575.927 6.188 2.438" />
                  </svg>
                  <span className="button-text">Check all tests Now</span>
                </span>
                <div className="button-ripple"></div>
              </button>
              <div className="decorative-elements">
                <div className="floating-dot dot-1"></div>
                <div className="floating-dot dot-2"></div>
                <div className="floating-dot dot-3"></div>
                <div className="floating-dot dot-4"></div>
              </div>
            </div>
          </div>  }
        {isLoading ? (
          <div className="processing-container">
            <div className="processing-card">
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}>
                  </div>
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
        ) : click && files.length === 0 ? (<EnhancedEmptyState />) : <></>
        }
      </div>
    </>
  );
};

export default CheckStudentExams;
