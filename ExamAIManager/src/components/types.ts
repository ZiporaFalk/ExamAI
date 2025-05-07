
export interface Student {
    id?: number;
    name: string;
    email?: string;
    studentClass: string;
    password?: string;
}

export interface Exam {
    id?: number;
    subject: string;
    dateExam:string;
}

export interface Submission {
    id?: number;
    studentId: number;
    score: number;
    // urlFile: string;
    file_Url: string;
    // urlFeedback: string;
    file_Url_FeedBack: string;
}

export interface StudentScoresModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (student: Student) => Promise<void>;
    student?: Student | null;
}

export interface StudentModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (student: Student) => void;
    student?: Student | null;
}

export interface Answer {
    id?: number;
    examId?: number;
    questionNumber?: string//מספר שאלה
    correctAnswer?: number//התשובה הנכונה
    isCorrect?: boolean;
}

