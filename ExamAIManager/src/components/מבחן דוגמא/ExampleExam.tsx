import { useContext, useState } from "react";
import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
import axios from "axios";
import { extractAnswersAfterHu, extractHebrewLettersWithDot } from "../../utils/DataExtraction";
import { Exam } from "../types";
import StepperDataContext from "../StepperDataContext";

const apiUrl = 'https://localhost:7083/api';

const ExampleExam = () => {
    const { selectedImages, setExams, files } = useContext(StepperDataContext)!
    const [progress, setProgress] = useState<{ [key: string]: number }>({});

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
        return response.data
    };

    const AddNewAnswers = async (DecodedExam: any, examId: number) => { //מוסיף את התשובות הנכונות למאגר התשובות

        const hebrewLetters = extractHebrewLettersWithDot(DecodedExam)
        const answers = extractAnswersAfterHu(DecodedExam)
        for (let i = 0; i < answers.length; i++) {
            await axios.post(`${apiUrl}/Answer`, { examId, questionNumber: hebrewLetters[i], correctAnswer: answers[i] })
        }
        console.log(hebrewLetters);
        console.log(answers);
    }
    const handleAnalyze = async () => {
        const allExams: Exam[] = [];
        for (const image of selectedImages) {
            try {
                const result = await analyzeImage(image);
                console.log("פלט OCR:", result);

                const newExam = await AddNewExam(result);
                console.log("נוצר מבחן חדש עם ID:", newExam.id);

                await AddNewAnswers(result, newExam.id);
                allExams.push(newExam);

            } catch (error) {
                console.error("שגיאה בפענוח מבחן:", error);
            }
        }
        setExams(allExams);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>ExampleExam</h1>
            <button onClick={handleAnalyze}>פענח את כל המבחנים</button>
            {files.map((file) => (
                <div key={file.name}>
                    {file.name}: {progress[file.name] || 0}%
                </div>
            ))}
        </div>
    );
};

export default ExampleExam;



