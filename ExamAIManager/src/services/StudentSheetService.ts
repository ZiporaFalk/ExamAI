import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
// const apiUrl = 'https://localhost:7083/api';

const StudentSheetService = {

    async getStudentEmail(name: string, studentClass: string) {
        try {
            const response = await axiosInstance.get(`/GoogleSheets/email?name=${encodeURIComponent(name)}&className=${encodeURIComponent(studentClass)}`, {
            });
            console.log(response);
            console.log(response.data);
            return response.data

        } catch (err) {
            handleAxiosError(err, "");
        }
    }
}

export default StudentSheetService;