import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Exam, Student, Answer, FileWithProgress } from "../../utils/types";

type StepperDataContextType = {
    exams: Exam[];
    setExams: Dispatch<SetStateAction<Exam[]>>
    students: Student[];
    setStudents: Dispatch<SetStateAction<Student[]>>
    isStudentTest: boolean;
    setIsStudentTest: Dispatch<SetStateAction<boolean>>
    files: (FileWithProgress | null)[];
    setFiles: React.Dispatch<SetStateAction<(FileWithProgress | null)[]>>
    scores: number[];
    setScores: Dispatch<SetStateAction<number[]>>
    answersList: Answer[][];
    setAnswersList: Dispatch<SetStateAction<Answer[][]>>
    selectedImages: string[];
    setSelectedImages: Dispatch<SetStateAction<string[]>>
    isAbleNext: boolean;
    setIsAbleNext: Dispatch<SetStateAction<boolean>>
};

const StepperDataContext = createContext<StepperDataContextType | undefined>(undefined);

export const StepperDataProvider = ({ children }: { children: ReactNode }) => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isStudentTest, setIsStudentTest] = useState(false);
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
