import { Submission } from "../utils/types";
import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";


// export const DashBoardService = {
export const DashBoardService = {
    /**
     * מקבל את ממוצע הכיתה לפי שם כיתה ונושא (אופציונלי)
     * @param className שם הכיתה
     * @param subject נושא (אופציונלי)
     */
    async getClassAverage(className?: string, subject?: string): Promise<number> {
        try {
            const response = await axiosInstance.get<number>(`/DashBoard/class-avg`, {
                params: {
                    _class: className,
                    sub: subject || null,
                },
            });

            return response.data;
        } catch (e) {
            handleAxiosError(e, "שגיאה בשליפת ממוצע כיתה");
            return 0;
        }
    },

    /**
     * מקבל את ממוצע תלמיד לפי מזהה
     * @param studentId מזהה תלמיד
     */
    async getStudentAverage(studentId: number): Promise<number> {
        try {
            const response = await axiosInstance.get<number>(`/DashBoard/${studentId}`);
            return response.data;
        } catch (e) {
            handleAxiosError(e, "שגיאה בשליפת ממוצע תלמיד");
            return 0;
        }
    },
    /**
   * מחזיר את אחוז התלמידים שעברו (ציון >= 60)
   * @param className שם כיתה (אופציונלי)
   * @param subject מקצוע (אופציונלי)
   */
    async getPassRate(className?: string, subject?: string): Promise<number> {
        try {
            const response = await axiosInstance.get<number>(`/DashBoard/pass-rate`, {
                params: {
                    _class: className,
                    sub: subject || null,
                },
            });
            return response.data;
        } catch (e) {
            handleAxiosError(e, "שגיאה בשליפת אחוז מעבר");
            return 0;
        }
    },
    /**
   * מחזיר את רשימת ההגשות לפי כיתה ומקצוע (אופציונלי)
   * @param className שם כיתה (אופציונלי)
   * @param subject מקצוע (אופציונלי)
   */
    async getExamsByClassAndSubject(className?: string, subject?: string): Promise<Submission[]> {
        console.log(className);
        console.log(subject);
        console.log("=-=-=-==-=-=-=-");
        try {
            const response = await axiosInstance.get<Submission[]>(`/DashBoard/exams`, {
                params: {
                    _class: className,
                    sub: subject || null,
                },
            });
            return response.data;
        } catch (e) {
            handleAxiosError(e, "שגיאה בשליפת הגשות לפי כיתה ומקצוע");
            return [];
        }
    },
};