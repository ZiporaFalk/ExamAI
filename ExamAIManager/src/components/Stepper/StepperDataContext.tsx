import { createContext, useState, ReactNode } from "react";
import { Exam, Student, Answer, FileWithProgress } from "../../utils/types";

type StepperDataContextType = {
    exams: Exam[];
    // setExams: (exams: Exam[]) => void;
    setExams: React.Dispatch<React.SetStateAction<Exam[]>>
    students: Student[];
    // setStudents: (students: Student[]) => void;
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>
    isStudentTest: boolean;
    // setIsStudentTest: (value: boolean) => void;
    setIsStudentTest: React.Dispatch<React.SetStateAction<boolean>>
    // files: File[];
    files: (FileWithProgress | null)[];
    // setFiles: (files: File[]) => void;
    // setFiles: (files: (FileWithProgress | null)[]) => void;
    setFiles: React.Dispatch<React.SetStateAction<(FileWithProgress | null)[]>>
    scores: number[];
    // setScores: (scores: number[]) => void;
    setScores: React.Dispatch<React.SetStateAction<number[]>>
    answersList: Answer[][];
    // setAnswersList: (answers: Answer[][]) => void;
    setAnswersList: React.Dispatch<React.SetStateAction<Answer[][]>>
    selectedImages: string[];
    // setSelectedImages: (images: string[]) => void;
    setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>
    isAbleNext: boolean;
    setIsAbleNext: React.Dispatch<React.SetStateAction<boolean>>
};

const StepperDataContext = createContext<StepperDataContextType | undefined>(undefined);

export const StepperDataProvider = ({ children }: { children: ReactNode }) => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isStudentTest, setIsStudentTest] = useState(false);
    // const [files, setFiles] = useState<File[]>([]);
    const [files, setFiles] = useState<(FileWithProgress | null)[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [answersList, setAnswersList] = useState<Answer[][]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isAbleNext, setIsAbleNext] = useState(false)
    return (
        <StepperDataContext.Provider value={{
            exams, setExams,
            students, setStudents,
            isStudentTest, setIsStudentTest,
            files, setFiles,
            scores, setScores,
            answersList, setAnswersList,
            selectedImages, setSelectedImages,
            isAbleNext, setIsAbleNext,
        }}>
            {children}
        </StepperDataContext.Provider>
    );
};

export default StepperDataContext
