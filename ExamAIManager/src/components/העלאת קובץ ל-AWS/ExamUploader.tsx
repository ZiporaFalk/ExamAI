import { useContext, useState } from 'react';
import axios from 'axios';
import StepperDataContext from '../StepperDataContext';
import { Exam, Student } from '../types';

const apiUrl = 'https://localhost:7083/api';

const ExamUploader = () => {
    const { students, exams, isStudentTest, files } = useContext(StepperDataContext)!
    const [progress, setProgress] = useState(0);

    const renameFile = (originalFile: File, newName: string): File => {

        return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
        });
    };
    const handleUpload = async () => {

        if (!files.length) return alert("נא לבחור קבצים");

        for (let i = 0; i < students.length; i++) {

            const nameFile: string = isStudentTest ? students[i].name : `${exams[i].subject}-${exams[i].dateExam}`;
            const renamedFile = renameFile(files[i], `${nameFile}.jpg`); // שם ייחודי לכל קובץ

            try {
                const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
                    params: {
                        fileName: renamedFile.name,
                        subject: exams[i].subject,
                        class: isStudentTest ? students[i].studentClass : "null",
                        date: exams[i].dateExam,
                        isStudentTest,
                        contentType: "image/jpeg"
                    }
                });
                const presignedUrl = response.data.url;

                await axios.put(presignedUrl, renamedFile, {
                    headers: {
                        'Content-Type': renamedFile.type,
                        'x-amz-acl': 'bucket-owner-full-control'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setProgress(percent);
                    },
                });
                isStudentTest && sendMail(students[i], exams[i])
                console.log(`✔️ ${renamedFile.name} הועלה בהצלחה`);
            } catch (error) {
                console.error(`❌ שגיאה בהעלאת הקובץ ${renamedFile.name}:`, error);
            }
        }
        alert("✅ כל הקבצים הועלו!");
    };
    const sendMail = async (student: Student, exam: Exam) => {
        try {
            console.log(student);
            await axios.post(`${apiUrl}/Email/send`, {
                // to: `${student.email}`,
                // to: `ruti8588@gmail.com`,
                // to: `maof5728@gmail.com`,
                // to: `z5799888@gmail.com`,
                to: `z0548498935@gmail.com`,
                subject: `שלום לך ${student.name}!`,
                body: `📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!
                רצינו לעדכן שהמבחן שעשית ב:${exam.subject} נבדק ונכנס למערכת😂
                את מוזמנת להיכנס ולצפות בו🔭🔭
                בהצלחה!!!🎉`,
            });
            alert(student.email + " הדוא״ל נשלח בהצלחה!");
        } catch (err) {
            console.error(err);
            alert(student.email + "שליחת הדוא״ל נכשלה.");
        }
    };
    return (
        <div>
            <button onClick={handleUpload} disabled={!files}>העלה מבחן</button>
            {progress > 0 && <div>התקדמות: {progress}%</div>}
            {files.map((fileExam, index) => (
                <div key={index}>{fileExam.name}</div>
            ))}
        </div>
    );
};

export default ExamUploader;

