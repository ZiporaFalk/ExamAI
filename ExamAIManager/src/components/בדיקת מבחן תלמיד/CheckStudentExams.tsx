import React, { useEffect, useRef, useState } from "react";
import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";
import ExamUploader from "../העלאת קובץ ל-AWS/ExamUploader";

const apiUrl = 'https://localhost:7083/api';

const CheckStudentExams = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  // const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const subjectRef = useRef<string>("");
  const nameRef = useRef<string>("");
  const dateRef = useRef<string>("");
  const [finalData, setFinalData] = useState<{ subject: string, name: string, date: string } | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      setFiles(fileArray);

      // במקרה של תמונה, המרתה ל-Base64
      const file = fileArray[0];
      if (file && file.type.startsWith("image")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(",")[1] || "";
          setSelectedImage(base64String);
        };
      }
    }
  };
  // }
  //לא לשכוח לטפל בכפילות הקוד של שתי הפונקציות הבאות!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const extractHebrewLettersWithDot = (data: any[]) => { //מחלץ את מספרי השאלות(אותיות)
    const hebrewLettersWithDot: string[] = [];

    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i].description;
      const next = data[i + 1].description;

      if (/^[א-ת]$/.test(current) && next === '.') {
        hebrewLettersWithDot.push(current);
      }
    }
    return hebrewLettersWithDot;
  };
  const extractAnswersAfterHu = (data: any[]) => { //מחלץ את מספרי התשובות הנכונות.
    const answers: string[] = [];

    for (let i = 0; i < data.length - 2; i++) {
      const current = data[i].description;
      const next = data[i + 1].description;

      if (current === "הוא" && next === ":") {
        const answer = data[i + 2]?.description;
        if (answer) {
          if (answer == '/' || answer == '|') answers.push('1');
          else if (answer == 'S' || answer == 's') answers.push('5');
          else answers.push(answer);
        }
      }
    }
    return answers;
  };
  // const GetStudentId = async (data: any[]) => {
  //   const studentName = data.findIndex((myname: any) => myname.description.includes("שם"))
  //   const studentClass = data.findIndex((myname: any) => myname.description.includes("כיתה"))
  //   const studentbyclassandname = await axios.get(`${apiUrl}/Student/classandname/${studentClass}/${studentName}`)
  //   setStudent(studentbyclassandname.data)
  //   console.log(student);

  // }
  const GetName = (data: any[]) => {
    const nameIndex = data.findIndex((myname: any) => myname.description.includes("שם"))
    const name = data[nameIndex + 2].description + ' ' + data[nameIndex + 3].description
    // setName(name)
    nameRef.current = name
    return name
  }
  const GetSubject = (data: any[]) => {
    const subjectIndex = data.findIndex((myname: any) => myname.description.includes("מקצוע"))
    const subject = data[subjectIndex + 2].description + ' ' + data[subjectIndex + 3].description
    // setSubject(subject)
    subjectRef.current = subject
    return subject
  }
  const GetDate = (data: any[]) => {
    const dateIndex = data.findIndex((myname: any) => myname.description.includes("תאריך"))
    const dateExam = data[dateIndex + 2].description + data[dateIndex + 3].description + ' ' + data[dateIndex + 4].description + ' ' + data[dateIndex + 5].description
    // setDate(dateExam)
    dateRef.current = dateExam
    return dateExam
  }
  const SaveStudentExam = async (data: any[]) => {
    const name = GetName(data);
    const subject = GetSubject(data);
    const date = GetDate(data);

    setFinalData({ name, subject, date });
    console.log(subjectRef);
    console.log(nameRef);
    console.log(dateRef);

  }
  const handleAnalyze = async () => {
    const exam_id = 1027//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (selectedImage) {
      const result = await analyzeImage(selectedImage);
      console.log(result);

      const letters = extractHebrewLettersWithDot(result)
      const numbersAnswer = extractAnswersAfterHu(result)
      const CorrectAnswers = await axios.get(`${apiUrl}/Answer`, { params: { exam_id } });
      console.log(CorrectAnswers.data);
      console.log(letters);
      console.log(numbersAnswer);

      let count = 0;
      for (let i = 0; i < letters.length && i < numbersAnswer.length; i++) {
        const letter = letters[i];
        const number = Number(numbersAnswer[i]);
        const match = CorrectAnswers.data.find((item: any) => item.questionNumber === letter && item.correctValue === number);
        if (match) {
          count++;
        }
      }
      console.log(count);
      console.log(`הציון:${count * (100 / letters.length)}`);
      ////הוספת הגשת התלמיד לטבלת ההגשות
      ////העלאה ושמירה ב AWS
      SaveStudentExam(result)
      // const date = GetDate(result)
      // const name = GetName(result)
      // const subject = GetSubject(result)
    }
  };


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Google Vision OCR & File Uploader</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>

      {files.length > 0 && finalData && (
        <ExamUploader
          subject={finalData.subject}
          date={finalData.date}
          name={finalData.name}
          IsExampleExam={false}
          fileExam={files[0]}
        />
      )}

      {/* {files.map((file) => (
        <div key={file.name}>
          {file.name}: {progress[file.name] || 0}%
        </div>
      ))} */}
    </div>
  );
};

export default CheckStudentExams;



// useState } from "react";
// import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
// import axios from "axios";
// import ExamUploader from "../העלאת קובץ ל-AWS/ExamUploader";
// import { Student } from "../types";

// const apiUrl = 'https://localhost:7083/api';

// const CheckStudentExams = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   // const [files, setFiles] = useState<File[]>([]);
//   const [file, setFile] = useState<File>(null);
//   const [progress, setProgress] = useState<{ [key: string]: number }>({});
//   // const [student, setStudent] = useState<Student>()
//   const [name, setName] = useState<string>("")
//   const [date, setDate] = useState<string>("")
//   const [subject, setSubject] = useState<string>("")


//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       const fileArray = Array.from(event.target.files);
//       setFile(fileArray);

//       // במקרה של תמונה, המרתה ל-Base64
//       const file = fileArray[0];
//       if (file && file.type.startsWith("image")) {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = () => {
//           const base64String = reader.result?.toString().split(",")[1] || "";
//           setSelectedImage(base64String);
//         };
//       }
//     }
//   };
//   //לא לשכוח לטפל בכפילות הקוד של שתי הפונקציות הבאות!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
//   //   const studentbyclassandname = await axios.get(${apiUrl}/Student/classandname/${studentClass}/${studentName})
//   //   setStudent(studentbyclassandname.data)
//   //   console.log(student);

//   // }
//   const GetName = (data: any[]) => {
//     const nameIndex = data.findIndex((myname: any) => myname.description.includes("שם"))
//     const name = data[nameIndex + 2].description + ' ' + data[nameIndex + 3].description
//     setName(name)
//     return name
//   }
//   const GetSubject = (data: any[]) => {
//     const subjectIndex = data.findIndex((myname: any) => myname.description.includes("מקצוע"))
//     const subject = data[subjectIndex + 2].description + ' ' + data[subjectIndex + 3].description
//     setSubject(subject)
//     return subject
//   }
//   const GetDate = (data: any[]) => {
//     const dateIndex = data.findIndex((myname: any) => myname.description.includes("תאריך"))
//     const dateExam = data[dateIndex + 2].description + data[dateIndex + 3].description + ' ' + data[dateIndex + 4].description + ' ' + data[dateIndex + 5].description
//     setDate(dateExam)
//     return dateExam
//   }
//   const SaveStudentExam = async (data: any[]) => {
//     //     element: <ExamUploader studentId={1} IsExampleExam={false} />
//     GetDate(data)
//     GetName(data)
//     GetSubject(data)
//     console.log(subject);
//     console.log(name);
//     console.log(date);

//   }
  // const handleAnalyze = async () => {
  //   const exam_id = 1027//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   if (selectedImage) {
  //     const result = await analyzeImage(selectedImage);
  //     console.log(result);

  //     const letters = extractHebrewLettersWithDot(result)
  //     const numbersAnswer = extractAnswersAfterHu(result)
  //     const CorrectAnswers = await axios.get(${apiUrl}/Answer, { params: { exam_id } });
  //     console.log(CorrectAnswers.data);
  //     console.log(letters);
  //     console.log(numbersAnswer);

  //     let count = 0;
  //     for (let i = 0; i < letters.length && i < numbersAnswer.length; i++) {
  //       const letter = letters[i];
  //       const number = Number(numbersAnswer[i]);
  //       const match = CorrectAnswers.data.find((item: any) => item.questionNumber === letter && item.correctValue === number);
  //       if (match) {
  //         count++;
  //       }
  //     }
  //     console.log(count);
  //     console.log(הציון:${count * (100 / letters.length)});
  //     ////הוספת הגשת התלמיד לטבלת ההגשות
  //     ////העלאה ושמירה ב AWS
  //     SaveStudentExam(result)
  //     // const date = GetDate(result)
  //     // const name = GetName(result)
  //     // const subject = GetSubject(result)
  //   }
  // };


  // return (
  //   <div style={{ textAlign: "center", marginTop: "50px" }}>
  //     <h1>Google Vision OCR & File Uploader</h1>
  //     {/* <input type="file" multiple onChange={handleFileChange} /> */}
  //     <input type="file"  onChange={handleFileChange} />
  //     <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>
  //     <ExamUploader subject={subject} date={date} name={name} IsExampleExam={false} fileExam={file}></ExamUploader>
  //     {files.map((file) => (
  //       <div key={file.name}>
  //         {file.name}: {progress[file.name] || 0}%
  //       </div>
  //     ))}
  //   </div>
