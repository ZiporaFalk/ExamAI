import analyzeImage from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";
import { GetStudentId, extractAnswersAfterHu, extractDateAndSubject, extractHebrewLettersWithDot, extractStudent } from "../../utils/DataExtraction";
import { Answer, Exam, Student } from "../types";
import { useContext, useState } from "react";
import StepperDataContext from "../StepperDataContext";
import { Button, CircularProgress, Typography, Stack } from "@mui/material";

const apiUrl = 'https://localhost:7083/api';

const CheckStudentExams = () => {
  const { selectedImages, setExams, setAnswersList, setStudents, setScores } = useContext(StepperDataContext)!
  const [isLoading, setIsLoading] = useState(false); // <-- סטייט חדש
  const [isFinished, setIsFinished] = useState(false);
  const SaveStudentExam = async (score: number, exam_id: number, feedback: string, file: string, studentId: number) => {
    await axios.post(`${apiUrl}/Submission`, {
      studentId,
      score,
      examId: exam_id,
      file_Url: file,
      file_Url_FeedBack: feedback
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
    // if (letters.length !== numbersAnswer.length) {
    //   console.error("אי התאמה בין מספר השאלות למספר התשובות");
    //   return ;
    // }

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
    setIsLoading(true); // מתחיל ריענון
    setIsFinished(false);
    const exams: Exam[] = []
    const students: Student[] = []
    const scores: number[] = []
    const answersStudents: Answer[][] = []
    for (const image of selectedImages) {
      try {
        const result = await analyzeImage(image);
        const { score, exam_id, answersStudent } = await CheckTheTest(result);
        console.log(exam_id);
        const exam = await extractDateAndSubject(result)
        const student: Student = await extractStudent(result)
        const url = `exams/Students/${exam.subject}-${exam.dateExam}/${student.studentClass}/`
        const fileNamefeedback = `${student.name.replace(/\s/g, "_")}_feedback.docx`;
        const feedbackurl = url + fileNamefeedback
        const fileurl = url + student.name + `.jpg`
        console.log(feedbackurl);
        console.log(fileurl);
        const studentId = await GetStudentId(result);
        const email = (await axios.get(`${apiUrl}/Student/${studentId}`)).data.email
        console.log(email);
        student.email = email
        await SaveStudentExam(score, exam_id, feedbackurl, fileurl, studentId);
        exams.push(exam)
        students.push(student)
        scores.push(score)
        answersStudents.push(answersStudent)
      } catch (err) {
        console.error("שגיאה בניתוח תמונה:", err);
      }
    }
    setExams(exams)
    setAnswersList(answersStudents)
    setStudents(students)
    setScores(scores)
    setIsLoading(false);
    setIsFinished(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>בדיקת מבחנים</h1>
      {isLoading ? (
        <Stack direction="column" alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>מחשב ציון...</Typography>
        </Stack>
      ) : isFinished ? (
        <Typography color="success.main" fontWeight="bold">
          ✔ המבחנים נבדקו!
        </Typography>
      ) : (
        <Button variant="contained" onClick={handleAnalyze}>
          בדוק את כל המבחנים
        </Button>
      )}
    </div>
  );
};

export default CheckStudentExams;

