// import { useState } from "react";
// import axios from "axios";

// const ExamUploader = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const uploadFile = async () => {
//     if (!file) {
//       setMessage("אנא בחרי קובץ קודם.");
//       return;
//     }

//     setUploading(true);
//     setMessage("");

//     try {
//       // שליחת בקשה ל-API לקבלת Pre-Signed URL
//     //   const response = await axios.get("/api/ExamUpload/presigned-url", {
//         console.log(file.name);

//         const response = await axios.get( "https://localhost:7083/api/ExamUpload/presigned-url",{
//         params: {
//           fileName: file.name,
//           contentType: file.type,
//         },
//       });
//       console.log(response.data.url);
//       const { url } = response.data;
//     // const url="https://exam-app-files.s3.eu-north-1.amazonaws.com/exams/numerology-concept-composition.jpg?X-Amz-Expires=600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVFIWI33A5YAS75WM%2F20250319%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250319T003143Z&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Signature=212601a0008a8115069bfc8a3886d0c0641c9f71299b07d8eb411b0187589bd0"

//       console.log("Uploading to URL:", url); // הדפסת ה-URL כדי לבדוק שהוא תקין

//       // שליחת הקובץ ישירות ל-S3 באמצעות ה-URL
//       await axios.put(url, file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       setMessage("✅ קובץ הועלה בהצלחה!");
//     } catch (error) {
//       setMessage("❌ שגיאה בהעלאת הקובץ ל-S3");
//       console.error(error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={uploadFile} disabled={uploading}>
//         {uploading ? "מעלה..." : "העלה קובץ"}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };
// // export default FileUploader;
// export default ExamUploader;



// '''''''''''''''''''''''''''''
import React, { useState } from 'react';
import axios from 'axios';

const ExamUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("נא לבחור קובץ");

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

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>העלה מבחן</button>
            {progress > 0 && <div>התקדמות: {progress}%</div>}
        </div>
    );
};

export default ExamUploader;
