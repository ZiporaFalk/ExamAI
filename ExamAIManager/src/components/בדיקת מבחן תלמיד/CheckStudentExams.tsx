import { useState } from "react";
import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";
import { GetStudentId, extractAnswersAfterHu, extractDateAndSubject, extractHebrewLettersWithDot, extractStudent } from "../../utils/DataExtraction";
import { Answer, Exam, Student } from "../types";

const apiUrl = 'https://localhost:7083/api';
type CheckStudentExamsProps = {
  selectedImage: string;
  setDataForStudent: (exam: Exam, student: Student, score: number, answersStudent: Answer[]) => void
};

const CheckStudentExams = ({ selectedImage, setDataForStudent }: CheckStudentExamsProps) => {

  const [files, setFiles] = useState<File[]>([]);

  const SaveStudentExam = async (score: number, exam_id: number, feadback: string, file: string, data: any[]) => {
    console.log(data);
    const studentId = await GetStudentId(data)
    const response = await axios.post(`${apiUrl}/Submission`, { studentId, score, examId: exam_id, file_Url: file, file_Url_FeedBack: feadback })

  }
  const CheckTheTest = async (data: any[]) => {
    console.log(data);
    const dateAndSubject = extractDateAndSubject(data);
    console.log(dateAndSubject);

    const exam = (await axios.get(`${apiUrl}/Exam/BySubjectAndDate/${dateAndSubject.dateExam}/${dateAndSubject.subject}`)).data
    console.log(exam);
    const letters = extractHebrewLettersWithDot(data)
    const numbersAnswer = extractAnswersAfterHu(data)
    const CorrectAnswers = (await axios.get(`${apiUrl}/Answer`, { params: { exam_id: exam.id } })).data;
    console.log(CorrectAnswers);
    console.log(letters);
    console.log(numbersAnswer);
    let count = 0;
    const answersStudent: Answer[] = []
    letters.forEach((letter, i) => {
      const answer: Answer = {}; // יצירת אובייקט חדש כל פעם
      answer.questionNumber = letter
      answer.correctAnswer = CorrectAnswers[i].correctAnswer
      const number = Number(numbersAnswer?.[i]);
      if (CorrectAnswers.some((item: any) =>
        item.questionNumber === letter && item.correctAnswer === number)) {
        count++;
        answer.isCorrect = true
      }
      else answer.isCorrect = false
      answersStudent.push(answer)
    });
    console.log(answersStudent);
    console.log(count);
    const score = count * (100 / letters.length)
    console.log(`הציון:${score}`);
    return { score: score, exam_id: exam.id, answersStudent }
  }

  const CreateFeadback = () => {
    return 'feadback כרגע'
  }
  const handleAnalyze = async () => {
    if (selectedImage) {
      const result = await analyzeImage(selectedImage);
      const { score, exam_id, answersStudent } = await CheckTheTest(result)
      const feadback = CreateFeadback()
      const file = 'לעשות פה feadback על הקובץ ועל הבוליאני'
      console.log(exam_id);
      SaveStudentExam(score, exam_id, feadback, file, result)

      const exam = await extractDateAndSubject(result)
      const student = await extractStudent(result)

      setDataForStudent(exam, student, score, answersStudent)
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>4</h1>
      <h1>בדיקת מבחן</h1>
      <button onClick={handleAnalyze}>בדיקת המבחן</button>

      {/* תעשה זאת עבור כל הקבצים */}
      {/* {files.length > 0 && finalData && (
        <ExamUploader
          subject={finalData.subject}
          date={finalData.date}
          name={finalData.name}
          IsExampleExam={false}
          fileExam={files[0]}
        />
      )} */}
      {/* {files.map((file) => (
        <div key={file.name}>
          {file.name}: {progress[file.name] || 0}%
        </div>
      ))} */}
    </div>
  );
};

export default CheckStudentExams;

