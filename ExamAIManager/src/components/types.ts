
export interface Student {
    id: number;
    name: string;
    email: string;
    class: string;
    password: string;
}

export interface Exam {
    id: number;
    subject: string;
}

export interface Submission {
    id: number;
    studentId: number;
    score: number;
    urlFile: string;
    urlFeedback: string;
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