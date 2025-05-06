import { createContext, useState, ReactNode } from "react";
import { Exam, Student, Answer } from "./types";

type StepperDataContextType = {
    exams: Exam[];
    setExams: (exams: Exam[]) => void;
    students: Student[];
    setStudents: (students: Student[]) => void;
    isStudentTest: boolean;
    setIsStudentTest: (value: boolean) => void;
    files: File[];
    setFiles: (files: File[]) => void;
    scores: number[];
    setScores: (scores: number[]) => void;
    answersList: Answer[][];
    setAnswersList: (answers: Answer[][]) => void;
    selectedImages: string[];
    setSelectedImages: (images: string[]) => void;
};

const StepperDataContext = createContext<StepperDataContextType | undefined>(undefined);

export const StepperDataProvider = ({ children }: { children: ReactNode }) => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isStudentTest, setIsStudentTest] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [answersList, setAnswersList] = useState<Answer[][]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    return (
        <StepperDataContext.Provider value={{
            exams, setExams,
            students, setStudents,
            isStudentTest, setIsStudentTest,
            files, setFiles,
            scores, setScores,
            answersList, setAnswersList,
            selectedImages, setSelectedImages
        }}>
            {children}
        </StepperDataContext.Provider>
    );
};

export default StepperDataContext
