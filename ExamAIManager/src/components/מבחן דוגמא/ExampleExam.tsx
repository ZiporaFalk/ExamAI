import React, { useState } from "react";
import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";

const apiUrl = 'https://localhost:7083/api';

const ExampleExam: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});


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
    const AddNewExam = async (DecodedExam: any) => {// מוסיף מבחן דוגמא חדש
        const classIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("כיתה"))
        const classs = DecodedExam[classIndex + 2].description + DecodedExam[classIndex + 3].description;
        const dateIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("תאריך"))
        const dateExam = DecodedExam[dateIndex + 2].description + DecodedExam[dateIndex + 3].description + ' ' + DecodedExam[dateIndex + 4].description + ' ' + DecodedExam[dateIndex + 5].description
        const subjectIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("מקצוע"))
        const subject = DecodedExam[subjectIndex + 2].description + ' ' + DecodedExam[subjectIndex + 3].description

        const response = await axios.post(`${apiUrl}/Exam`, { class: classs, dateExam, subject })

        console.log(response);
        console.log("תאריך:" + dateExam)
        console.log("מקצוע:" + subject)
        console.log("כיתה:" + classs);

        return response.data.id
    };
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

    const AddNewAnswers = async (DecodedExam: any, examId: number) => { //מוסיף את התשובות הנכונות למאגר התשובות

        const hebrewLetters = extractHebrewLettersWithDot(DecodedExam)

        const answers = extractAnswersAfterHu(DecodedExam)
        for (let i = 0; i < answers.length; i++) {
            await axios.post(`${apiUrl}/Answer`, { examId, questionNumber: hebrewLetters[i], correctValue: answers[i] })
        }

        console.log(hebrewLetters);
        console.log(answers);
    }
    const handleAnalyze = async () => {// מפענח המבחן
        if (selectedImage) {
            const result = await analyzeImage(selectedImage);
            console.log(result)

            const IdnewExam = await AddNewExam(result)
            console.log("id:" + IdnewExam);

            await AddNewAnswers(result, IdnewExam)
        }
    };

    return (

        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>ExampleExam</h1>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>

            {files.map((file) => (
                <div key={file.name}>
                    {file.name}: {progress[file.name] || 0}%
                </div>
            ))}
        </div>
    );
};

export default ExampleExam;