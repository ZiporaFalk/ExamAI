import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
// const apiUrl = 'https://localhost:7083/api';

const SubmissionService = {

    async saveStudentExam(score: number, examId: number, feedbackUrl: string, fileUrl: string, studentId: number): Promise<void> {
        console.log(examId);
        console.log("examId");
        if (!examId)
            handleAxiosError('', "מבחן זה לא קיים במערכת!, נא הכנס קודם המבחן עם התשובות אחכ בדוק המבחנים!!!!")
        else {
            try {
                await axiosInstance.post('/Submission', {
                    studentId,
                    score,
                    examId,
                    file_Url: fileUrl,
                    file_Url_FeedBack: feedbackUrl
                });
            }
            catch (e: any) {
                handleAxiosError(e, "save Submission Student  error")
            }
        }

    },


}

export default SubmissionService;