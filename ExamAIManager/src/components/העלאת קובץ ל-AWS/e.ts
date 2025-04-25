import React, { useState } from 'react';
import axios from 'axios';
type PropsExamUploader = {
    studentId: number
    IsExampleExam: boolean
}
const ExamUploader = ({ studentId, IsExampleExam }: PropsExamUploader) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("נא לבחור קובץ");
        console.log(studentId);

        try {
            // שלב 1: קבלת Presigned URL מהשרת
            const response = await axios.get("https://localhost:7083/api/ExamUpload/presigned-url", {
                params: { fileName: file.name }
            });

            const presignedUrl = response.data.url;
            console.log(presignedUrl);
            // שלב 2: העלאת הקובץ ישירות ל-S3
            await axios.put(presignedUrl, file, {
                // headers: {
                //     'Content-Type': file.type,
                // },
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'bucket-owner-full-control'  // <-- חשוב!
                    // 'x-amz-acl': 'public-read'
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percent);
                },
            });

            alert('✅  המבחן הועלה בהצלחה!');
        } catch (error) {
            console.error('שגיאה בהעלאה:', error);
            alert('❌ אירעה שגיאה בהעלאה');
            console.log(file.name);
        }
    };

    // return (
    //     <div>
    //         <input type="file" onChange={handleFileChange} />
    //         <button onClick={handleUpload} disabled={!file}>העלה מבחן</button>
    //         {progress > 0 && <div>התקדמות: {progress}%</div>}
    //     </div>
    // );
};

export default ExamUploader;
