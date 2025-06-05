import { Exam } from "../utils/types";
import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";

const ExamService = {
    create: async (exam: Partial<Exam>) => {
        try {
            const res = await axiosInstance.post(`/Exam`, exam);
            console.log("המבחן נוסף בהצלחה");
            
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "הוספת המבחן נכשלה");
            throw e;
        }
    },

    getBySubjectAndDate: async (dateAndSubject: { dateExam: string, subject: string; }) => {
        try {
            const res = await axiosInstance.get(`/Exam/BySubjectAndDate/${dateAndSubject.dateExam}/${dateAndSubject.subject}`);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "getBySubjectAndDate error");
            throw e;
        }
    },

    delete: async (id: number | undefined) => {
        try {
            console.log("------------")
            const res = await axiosInstance.delete(`/Exam/${id}`);
            console.log("המבחן נמחק בהצלחה");
            
            return res.data;
        } catch (e: any) {
            console.log("------------")
            handleAxiosError(e, "המחיקה נכשלה");
            throw e;
        }
    },
    getAll: async () => {
        try {
            const res = await axiosInstance.get(`/Exam`);
            //console.log(res.data)
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "קבלת כל המבחנים נכשלו");
            throw e;
        }
    },
    getCorrectAnswers: async (exam: Exam) => {
        try {
            const res = await axiosInstance.get(`/Answer`, { params: { exam_id: exam.id } })
            console.log(res.data);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "Error getCorrectAnswers");
            throw e;
        }
    },
    addExam: async (classs: string, dateExam: string, subject: string, urlNewExam: string) => {
        const response = await axiosInstance.post(`/Exam`, { class: classs, dateExam, subject, file_Url: urlNewExam })
        return response
    },

    addCorrectAnswers: async (examId: number, questionNumber: string, correctAnswer: number) => {
        await axiosInstance.post(`/Answer`, { examId, questionNumber, correctAnswer })
    }

};


export default ExamService