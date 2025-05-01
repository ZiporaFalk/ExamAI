import { useState } from "react";
import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";
import { GetStudentId, extractAnswersAfterHu, extractDateAndSubject, extractHebrewLettersWithDot, extractStudent } from "../../utils/DataExtraction";
import { Exam, Student } from "../types";

const apiUrl = 'https://localhost:7083/api';
type CheckStudentExamsProps = {
  selectedImage: string;
  setDataForStudent: (exam: Exam, student: Student) => void
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
    const CorrectAnswers = await axios.get(`${apiUrl}/Answer`, { params: { exam_id: exam.id } });
    console.log(CorrectAnswers.data);
    console.log(letters);
    console.log(numbersAnswer);
    let count = 0;
    letters.forEach((letter, i) => {
      const number = Number(numbersAnswer?.[i]);
      if (CorrectAnswers.data.some((item: any) =>
        item.questionNumber === letter && item.correctValue === number)) {
        count++;
      }
    });
    console.log(count);
    const score = count * (100 / letters.length)
    console.log(`הציון:${score}`);
    return { score: score, exam_id: exam.id }
  }

  const CreateFeadback = () => {
    return 'feadback כרגע'
  }
  const handleAnalyze = async () => {
    if (selectedImage) {
      const result = await analyzeImage(selectedImage);
      const { score, exam_id } = await CheckTheTest(result)
      const feadback = CreateFeadback()
      const file = 'לעשות פה feadback על הקובץ ועל הבוליאני'
      console.log(exam_id);
      SaveStudentExam(score, exam_id, feadback, file, result)

      const exam = await extractDateAndSubject(result)
      const student = await extractStudent(result)

      setDataForStudent(exam, student)
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


// import React, { useEffect, useRef, useState } from "react";
// import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
// import axios from "axios";
// import ExamUploader from "../העלאת קובץ ל-AWS/ExamUploader";

// const apiUrl = 'https://localhost:7083/api';

// const CheckStudentExams = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [files, setFiles] = useState<File[]>([]);
//   // const [progress, setProgress] = useState<{ [key: string]: number }>({});
//   const subjectRef = useRef<string>("");
//   const nameRef = useRef<string>("");
//   const dateRef = useRef<string>("");
//   const [finalData, setFinalData] = useState<{ subject: string, name: string, date: string } | null>(null);


//   // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (event.target.files) {
//   //     const fileArray = Array.from(event.target.files);
//   //     setFiles(fileArray);
//   //     // במקרה של תמונה, המרתה ל-Base64
//   //     const file = fileArray[0];
//   //     if (file && file.type.startsWith("image")) {
//   //       const reader = new FileReader();
//   //       reader.readAsDataURL(file);
//   //       reader.onloadend = () => {
//   //         const base64String = reader.result?.toString().split(",")[1] || "";
//   //         setSelectedImage(base64String);
//   //       };
//   //     }
//   //   }
//   // };
//   // }

//   const extractHebrewLettersWithDot = (data: any[]) => { //מחלץ את מספרי השאלות(אותיות)
//     const hebrewLettersWithDot: string[] = [];

//     for (let i = 0; i < data.length - 1; i++) {
//       const current = data[i].description;
//       const next = data[i + 1].description;

//       if (/^[א-ת]$/.test(current) && next === '.') {
//         hebrewLettersWithDot.push(current);
//       }
//     }
//     return hebrewLettersWithDot;
//   };
//   const extractAnswersAfterHu = (data: any[]) => { //מחלץ את מספרי התשובות הנכונות.
//     const answers: string[] = [];

//     for (let i = 0; i < data.length - 2; i++) {
//       const current = data[i].description;
//       const next = data[i + 1].description;

//       if (current === "הוא" && next === ":") {
//         const answer = data[i + 2]?.description;
//         if (answer) {
//           if (answer == '/' || answer == '|') answers.push('1');
//           else if (answer == 'S' || answer == 's') answers.push('5');
//           else answers.push(answer);
//         }
//       }
//     }
//     return answers;
//   };
//   // const GetStudentId = async (data: any[]) => {
//   //   const studentName = data.findIndex((myname: any) => myname.description.includes("שם"))
//   //   const studentClass = data.findIndex((myname: any) => myname.description.includes("כיתה"))
//   //   const studentbyclassandname = await axios.get(`${apiUrl}/Student/classandname/${studentClass}/${studentName}`)
//   //   setStudent(studentbyclassandname.data)
//   //   console.log(student);
//   // }
//   const GetName = (data: any[]) => {
//     const nameIndex = data.findIndex((myname: any) => myname.description.includes("שם"))
//     const name = data[nameIndex + 2].description + ' ' + data[nameIndex + 3].description
//     // setName(name)
//     nameRef.current = name
//     return name
//   }
//   const GetSubject = (data: any[]) => {
//     const subjectIndex = data.findIndex((myname: any) => myname.description.includes("מקצוע"))
//     const subject = data[subjectIndex + 2].description + ' ' + data[subjectIndex + 3].description
//     // setSubject(subject)
//     subjectRef.current = subject
//     return subject
//   }
//   const GetDate = (data: any[]) => {
//     const dateIndex = data.findIndex((myname: any) => myname.description.includes("תאריך"))
//     const dateExam = data[dateIndex + 2].description + data[dateIndex + 3].description + ' ' + data[dateIndex + 4].description + ' ' + data[dateIndex + 5].description
//     // setDate(dateExam)
//     dateRef.current = dateExam
//     return dateExam
//   }
//   const SaveStudentExam = async (data: any[]) => {
//     const name = GetName(data);
//     const subject = GetSubject(data);
//     const date = GetDate(data);

//     setFinalData({ name, subject, date });
//     console.log(subjectRef);
//     console.log(nameRef);
//     console.log(dateRef);
//   }
//   const handleAnalyze = async () => {
//     const exam_id = 1027//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     if (selectedImage) {
//       const result = await analyzeImage(selectedImage);
//       console.log(result);

//       const letters = extractHebrewLettersWithDot(result)
//       const numbersAnswer = extractAnswersAfterHu(result)
//       const CorrectAnswers = await axios.get(`${apiUrl}/Answer`, { params: { exam_id } });
//       console.log(CorrectAnswers.data);
//       console.log(letters);
//       console.log(numbersAnswer);

//       let count = 0;
//       for (let i = 0; i < letters.length && i < numbersAnswer.length; i++) {
//         const letter = letters[i];
//         const number = Number(numbersAnswer[i]);
//         const match = CorrectAnswers.data.find((item: any) => item.questionNumber === letter && item.correctValue === number);
//         if (match) {
//           count++;
//         }
//       }
//       console.log(count);
//       console.log(`הציון:${count * (100 / letters.length)}`);
//       ////הוספת הגשת התלמיד לטבלת ההגשות
//       ////העלאה ושמירה ב AWS
//       SaveStudentExam(result)
//       // const date = GetDate(result)
//       // const name = GetName(result)
//       // const subject = GetSubject(result)
//     }
//   };


//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Google Vision OCR & File Uploader</h1>
//       {/* <input type="file" multiple onChange={handleFileChange} />
//       <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button> */}
//       <button onClick={handleAnalyze} disabled={!selectedImage}>בדיקת המבחן</button>

//       {/* תעשה זאת עבור כל הקבצים */}
//       {files.length > 0 && finalData && (
//         <ExamUploader
//           subject={finalData.subject}
//           date={finalData.date}
//           name={finalData.name}
//           IsExampleExam={false}
//           fileExam={files[0]}
//         />
//       )}

//       {/* {files.map((file) => (
//         <div key={file.name}>
//           {file.name}: {progress[file.name] || 0}%
//         </div>
//       ))} */}
//     </div>
//   );
// };

// export default CheckStudentExams;

