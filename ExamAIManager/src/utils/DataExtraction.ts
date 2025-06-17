import { Exam } from "./types";
import studentStore from "../components/Dashboard/StudentStore";

type Word = { description: string };
 
export const extractDateAndSubject = (words: Word[]) => {
    const dateIdx = words.findIndex(w => w.description === "תאריך");
    const subjectIdx = words.findIndex(w => w.description === "מקצוע");

    if (dateIdx === -1 || subjectIdx === -1) {
        throw new Error("שדות חיוניים חסרים");
    }

    const subjectStart = subjectIdx + 2;
    const subjectEnd = dateIdx; 
    const subjectWords = words.slice(subjectStart, subjectEnd).map(w => w.description).join(" ");
    const dateWords = words.slice(dateIdx + 2, dateIdx + 6).map(w => w.description).join(" ");
    const formattedDate = dateWords.replace(/([א-ת])\s'/, "$1'");
    console.log(formattedDate);
    console.log(subjectWords);
    console.log(subjectWords.trim());
    return {
        dateExam: formattedDate,
        subject: subjectWords.trim()
    };
};

export const extractStudent = async (DecodedExam: any[]) => {
    const classIndex = DecodedExam.findIndex(myclass => myclass.description.includes("כיתה"))
    const classs = DecodedExam[classIndex + 2].description + DecodedExam[classIndex + 3].description + '';
    const nameIndex = DecodedExam.findIndex(myname => myname.description.includes("שם"))
    const name = DecodedExam[nameIndex + 2].description + ' ' + DecodedExam[nameIndex + 3].description;
    return { studentClass: classs, name }
}

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
    return answers;
}
export const GetStudentId = async (data: any[]) => {
    const studentNameIndex = data.findIndex(myname => myname.description.includes("שם"))
    const studentClassIndex = data.findIndex(myclass => myclass.description.includes("כיתה"))
    const studentName = data[studentNameIndex + 2].description + " " + data[studentNameIndex + 3].description
    const studentClass = data[studentClassIndex + 2].description + data[studentClassIndex + 3].description
    console.log(studentName + " " + studentClass);
    const studentbyclassandname = await studentStore.getStudentByClassAndName(studentClass, studentName)
    console.log(studentbyclassandname.data.id);
    return studentbyclassandname.data.id
}


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
