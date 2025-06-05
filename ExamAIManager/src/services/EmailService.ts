import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";

const EmailService = {
    async sendMail(body: string, subject: string, email: string): Promise<void> {

        try {
            await axiosInstance.post(`/Email/send`, {
                // to: email,
                to: `z0548498935@gmail.com`,
                subject: subject,
                body: body
            });
            console.log(" הדוא״ל נשלח בהצלחה!");
        } catch (err) {
            handleAxiosError(err, email + "שליחת הדוא״ל נכשלה.");
        }
    }
}

export default EmailService;