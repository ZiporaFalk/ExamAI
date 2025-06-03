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
    },
    // async sendMail(student: Student, exam: Exam): Promise<void> {
    //     try {
    //         console.log(student);
    //         await axiosInstance.post(`/Email/send`, {
    //             // to: `${student.email}`,
    //             to: `z0548498935@gmail.com`,
    //             subject: `שלום לך ${student.name}!`,
    //             body: `📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!
    //             רצינו לעדכן שהמבחן שעשית ב:${exam.subject} נבדק ונכנס למערכת😂
    //             את מוזמנת להיכנס ולצפות בו🔭🔭
    //             בהצלחה!!!🎉`,
    //         });
    //         console.log(student.email + " הדוא״ל נשלח בהצלחה!");
    //     } catch (err) {
    //         handleAxiosError(err, student.email + "שליחת הדוא״ל נכשלה.");
    //     }
    // },
}

export default EmailService;