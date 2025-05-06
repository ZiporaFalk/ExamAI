import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";
import { GetStudentId, extractAnswersAfterHu, extractDateAndSubject, extractHebrewLettersWithDot, extractStudent } from "../../utils/DataExtraction";
import { Answer, Exam, Student } from "../types";
import { useContext } from "react";
import StepperDataContext from "../StepperDataContext";

const apiUrl = 'https://localhost:7083/api';

// type CheckStudentExamsProps = {
//   selectedImages: string[];
//   setDataForStudents: (exam: Exam[], student: Student[], score: number[], answersStudent: Answer[][]) => void;
// };

// const CheckStudentExams = ({ selectedImages, setDataForStudents }: CheckStudentExamsProps) => {
const CheckStudentExams = () => {
  // const { selectedImages, setDataForStudents } = useStepperDataContext()
  const { selectedImages, setExams, setAnswersList, setStudents, setScores } =  useContext(StepperDataContext)!
  const SaveStudentExam = async (score: number, exam_id: number, feadback: string, file: string, data: any[]) => {
    console.log(data);
    const studentId = await GetStudentId(data);
    await axios.post(`${apiUrl}/Submission`, {
      studentId,
      score,
      examId: exam_id,
      file_Url: file,
      file_Url_FeedBack: feadback
    });
  };

  const CheckTheTest = async (data: any[]) => {
    console.log(data);
    const dateAndSubject = extractDateAndSubject(data);
    console.log(dateAndSubject);
    const exam = (await axios.get(`${apiUrl}/Exam/BySubjectAndDate/${dateAndSubject.dateExam}/${dateAndSubject.subject}`)).data;
    console.log(exam);
    const letters = extractHebrewLettersWithDot(data);
    const numbersAnswer = extractAnswersAfterHu(data);
    const CorrectAnswers = (await axios.get(`${apiUrl}/Answer`, { params: { exam_id: exam.id } })).data;
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
    return { score, exam_id: exam.id, answersStudent };
  };

  const CreateFeadback = () => {
    return 'feadback כרגע';
  };

  const handleAnalyze = async () => {
    const exams: Exam[] = []
    const students: Student[] = []
    const scores: number[] = []
    const answersStudents: Answer[][] = []
    for (const image of selectedImages) {
      try {
        const result = await analyzeImage(image);
        const { score, exam_id, answersStudent } = await CheckTheTest(result);
        const feadback = CreateFeadback();
        const file = image; // תוכל לשנות את זה לקישור ל־S3 אם אתה מעלה לשם
        console.log(exam_id);
        await SaveStudentExam(score, exam_id, feadback, file, result);
        const exam = await extractDateAndSubject(result)
        const student = await extractStudent(result)
        exams.push(exam)
        students.push(student)
        scores.push(score)
        answersStudents.push(answersStudent)
      } catch (err) {
        console.error("שגיאה בניתוח תמונה:", err);
      }
    }
    // setDataForStudents(exams, students, scores, answersStudents)
    setExams(exams)
    setAnswersList(answersStudents)
    setStudents(students)
    setScores(scores)
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>בדיקת מבחנים</h1>
      <button onClick={handleAnalyze}>בדוק את כל התמונות</button>
    </div>
  );
};

export default CheckStudentExams;

