import axios from "axios";
import { Exam } from "../components/types";

const apiUrl = 'https://localhost:7083/api';

// const extractExam = (words: any[]): Exam => { //מחלץ תאריך ומקצוע
export const extractDateAndSubject = (words: any[]) => {

    const getText = (start: number, count: number) =>
        words.slice(start, start + count).map(w => w.description).join(" ");

    const dateIdx = words.findIndex(w => w.description === "תאריך");
    const subjectIdx = words.findIndex(w => w.description === "מקצוע");
    console.log(dateIdx);
    console.log(subjectIdx);

    if (dateIdx === -1 || subjectIdx === -1) throw new Error("שדות חיוניים חסרים");

    return {
        dateExam: getText(dateIdx + 2, 4).replace(/([א-ת])\s'/, "$1'"),
        subject: getText(subjectIdx + 2, 2),
    };
};
export const extractStudent = (DecodedExam: any[]) => {
    const classIndex = DecodedExam.findIndex(myclass => myclass.description.includes("כיתה"))
    const classs = DecodedExam[classIndex + 2].description + DecodedExam[classIndex + 3].description + '';
    const nameIndex = DecodedExam.findIndex(myname => myname.description.includes("שם"))
    const name = DecodedExam[nameIndex + 2].description + ' ' + DecodedExam[nameIndex + 3].description;
    return { studentClass: classs, name }
}
// const AddNewExam = async (DecodedExam: any) => {// מוסיף מבחן דוגמא חדש
//     const classIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("כיתה"))
//     const classs = DecodedExam[classIndex + 2].description + DecodedExam[classIndex + 3].description;
//     const dateIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("תאריך"))
//     const dateExam = DecodedExam[dateIndex + 2].description + DecodedExam[dateIndex + 3].description + ' ' + DecodedExam[dateIndex + 4].description + ' ' + DecodedExam[dateIndex + 5].description
//     const subjectIndex = DecodedExam.findIndex((myname: any) => myname.description.includes("מקצוע"))
//     const subject = DecodedExam[subjectIndex + 2].description + ' ' + DecodedExam[subjectIndex + 3].description

//     const response = await axios.post(`${apiUrl}/Exam`, { class: classs, dateExam, subject })

//     console.log(response);
//     console.log("תאריך:" + dateExam)
//     console.log("מקצוע:" + subject)
//     console.log("כיתה:" + classs);

//     return response.data.id
// };
export const extractHebrewLettersWithDot = (data: any[]) => { //מחלץ את מספרי השאלות(אותיות)
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
export const extractAnswersAfterHu = (data: any[]) => { //מחלץ את מספרי התשובות הנכונות.
    const answers: string[] = [];

    for (let i = 0; i < data.length - 5; i++) {
        // if (data.slice(i, i + 5).join(" ") === "מספר התשובה הנכונה הוא :") {
        if (data.slice(i, i + 5).map(i => i.description).join(" ") === "מספר התשובה הנכונה הוא :") {
            let correctAnswer = data[i + 5].description;
            console.log(correctAnswer);
            if (['/', '^', '\\', '|'].includes(correctAnswer)) correctAnswer = '1';
            if (['s', 'S'].includes(correctAnswer)) correctAnswer = '5';
            answers.push(correctAnswer)
        };
    }
    // for (let i = 0; i < data.length - 2; i++) {
    //     const current = data[i].description;
    //     const next = data[i + 1].description;
    //     if (current === "הוא" && next === ":") {
    //         const answer = data[i + 2]?.description;
    //         if (answer) {
    //             if (answer == '/' || answer == '|') answers.push('1');
    //             else if (answer == 'S' || answer == 's') answers.push('5');
    //             else answers.push(answer);
    //         }
    //     }
    return answers;
}
export const GetStudentId = async (data: any[]) => {
    const studentNameIndex = data.findIndex(myname => myname.description.includes("שם"))
    const studentClassIndex = data.findIndex(myclass => myclass.description.includes("כיתה"))
    const studentName = data[studentNameIndex + 2].description + " " + data[studentNameIndex + 3].description
    const studentClass = data[studentClassIndex + 2].description + data[studentClassIndex + 3].description
    console.log(studentName + " " + studentClass);

    const studentbyclassandname = await axios.get(`${apiUrl}/Student/classandname/${studentClass}/${studentName}`)
    console.log(studentbyclassandname.data.id);
    return studentbyclassandname.data.id
}
// const AddNewAnswers = async (DecodedExam: any, examId: number) => { //מוסיף את התשובות הנכונות למאגר התשובות

//     const hebrewLetters = extractHebrewLettersWithDot(DecodedExam)

//     const answers = extractAnswersAfterHu(DecodedExam)
//     for (let i = 0; i < answers.length; i++) {
//         await axios.post(`${apiUrl}/Answer`, { examId, questionNumber: hebrewLetters[i], correctAnswer: answers[i] })
//     }

//     console.log(hebrewLetters);
//     console.log(answers);
// }


// שולף אותיות
const findSectionLetter = (arr: string[], from: number) => arr.slice(0, from + 1).reverse().find(val => /^[א-ת]$/.test(val)) || "?";
// יוצר מערך תשובות מלאות
export const extractAnswers = (words: any[], exam: Exam | undefined) => {
    const textArray = words.map(w => w.description);
    const results = [];

    for (let i = 0; i < textArray.length - 5; i++) {
        if (textArray.slice(i, i + 5).join(" ") === "מספר התשובה הנכונה הוא :") {
            let correctAnswer = textArray[i + 5];
            if (['/', '^', '\\', '|'].includes(correctAnswer)) correctAnswer = '1';
            if (correctAnswer === 's') correctAnswer = '5';
            const examId = exam?.id
            results.push({
                examId,
                section: findSectionLetter(textArray, i),
                correctAnswer,
            });
        }
    }
    return results;
};
const GetSubject = (data: any[]) => {
    const subjectIndex = data.findIndex(mysubject => mysubject.description.includes("מקצוע"))
    const subject = data[subjectIndex + 2].description + ' ' + data[subjectIndex + 3].description
    return subject
}