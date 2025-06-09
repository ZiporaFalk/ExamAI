
export interface Student {
    id?: number;
    name: string;
    email?: string;
    studentClass: string;
    password?: string;
    Created_at?: Date
}

export interface Exam {
    id?: number;
    subject: string;
    dateExam: string;
    file_Url?:string;
    created_at?:string;
}

export interface Submission {
    id?: number;
    studentId: number;
    examId?:number;
    score: number;
    file_Url: string;
    file_Url_FeedBack: string;
}

export interface Answer {
    id?: number;
    examId?: number;
    questionNumber?: string//מספר שאלה
    correctAnswer?: number//התשובה הנכונה
    isCorrect?: boolean;
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



export interface FileWithProgress {
    file: File;
    progress: number;
    uploading: boolean;
}