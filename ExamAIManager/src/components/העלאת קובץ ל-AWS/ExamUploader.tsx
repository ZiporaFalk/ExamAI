import { useContext, useState } from 'react';
import axios from 'axios';
import StepperDataContext from '../StepperDataContext';

const apiUrl = 'https://localhost:7083/api';

const ExamUploader = () => {
    const { students, exams, isStudentTest, files } =  useContext(StepperDataContext)!
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
                console.log(`✔️ ${renamedFile.name} הועלה בהצלחה`);
            } catch (error) {
                console.error(`❌ שגיאה בהעלאת הקובץ ${renamedFile.name}:`, error);
            }
        }
        alert("✅ כל הקבצים הועלו!");
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

