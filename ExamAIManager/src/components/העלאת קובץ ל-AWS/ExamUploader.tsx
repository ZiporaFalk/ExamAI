import React, { useState } from 'react';
import axios from 'axios';
import { Exam, Student } from '../types';
type PropsExamUploader = {
    students: Student[],
    exams: Exam[],
    IsStudentTest: boolean,
    fileExams: File[]
    // fileExam: File | null
}


const apiUrl = 'https://localhost:7083/api';

const ExamUploader = ({ students, exams, IsStudentTest, fileExams }: PropsExamUploader) => {

    // const [file, setFile] = useState<File | null>(fileExam);
    const [files, setFiles] = useState<File[]>(fileExams);

    const [progress, setProgress] = useState(0);

    const renameFile = (originalFile: File, newName: string): File => {

        return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
        });
    };
    const handleUpload = async () => {
        if (!files.length) return alert("נא לבחור קבצים");



        students.forEach(async (student, i) => {
            const nameFile: string = IsStudentTest ? student.name : `${exams[i].subject}-${exams[i].dateExam}`;
            const renamedFile = renameFile(files[i], `${nameFile}.jpg`); // שם ייחודי לכל קובץ

            try {
                const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
                    params: {
                        fileName: renamedFile.name,
                        subject: exams[i].subject,
                        class: IsStudentTest ? student.studentClass : "null",
                        date: exams[i].dateExam,
                        IsStudentTest,
                        // contentType: renamedFile.type,
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
        })

        alert("✅ כל הקבצים הועלו!");
    };

    // const handleUpload = async () => {
    //     if (!file) return alert("נא לבחור קובץ");
    //     // const renamedFile = {}
    //     const nameFile: string = IsStudentTest ? student.name : exam.subject + '-' + exam.dateExam
    //     const renamedFile = renameFile(file, `${nameFile}.jpg`); // כאן שימי את השם שאת רוצה

    //     try {
    //         // שלב 1: קבלת Presigned URL מהשרת
    //         // const params: any = {
    //         //     fileName: renamedFile.name,
    //         //     subject: exam.subject,
    //         //     date: exam.dateExam,
    //         // };
    //         // if (IsStudentTest && student.studentClass) {
    //         //     params.class = student.studentClass;
    //         // }
    //         // const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, { params });

    //         const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
    //             params: {
    //                 fileName: renamedFile.name,
    //                 subject: exam.subject,
    //                 class: IsStudentTest ? student.studentClass : "null",
    //                 date: exam.dateExam,
    //                 IsStudentTest,
    //                 contentType: "image/jpeg"
    //             }
    //         });

    //         const presignedUrl = response.data.url;
    //         console.log(presignedUrl);
    //         // שלב 2: העלאת הקובץ ישירות ל-S3
    //         await axios.put(presignedUrl, renamedFile, {
    //             headers: {
    //                 'Content-Type': renamedFile.type,
    //                 'x-amz-acl': 'bucket-owner-full-control'  // <-- חשוב!
    //                 // 'x-amz-acl': 'public-read'
    //             },
    //             onUploadProgress: (progressEvent) => {
    //                 const percent = Math.round(
    //                     (progressEvent.loaded * 100) / (progressEvent.total || 1)
    //                 );
    //                 setProgress(percent);
    //             },
    //         });
    //         alert('✅  המבחן הועלה בהצלחה!');
    //     } catch (error) {
    //         console.error('שגיאה בהעלאה:', error);
    //         alert('❌ אירעה שגיאה בהעלאה');
    //         console.log(renamedFile.name);
    //     }
    // };

    return (
        <div>
            <button onClick={handleUpload} disabled={!files}>העלה מבחן</button>
            {progress > 0 && <div>התקדמות: {progress}%</div>}
            {files.map((file, index) => (
                <div key={index}>{file.name}</div>
            ))}
        </div>

    );
};

export default ExamUploader;



// ....לפני קבצים רבים

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Exam, Student } from '../types';
// type PropsExamUploader = {
//     student: Student
//     exam: Exam
//     IsStudentTest: boolean
//     fileExam: File | null
// }
// const apiUrl = 'https://localhost:7083/api';

// const ExamUploader = ({ student, exam, IsStudentTest, fileExam }: PropsExamUploader) => {
//     // const ExamUploader = ({ exam, }: PropsExamUploader) => {
//     // const ExamUploader = ({ dat: PropsExamUploader }) => {
//     // const ExamUploader = ({ fileExam }: PropsExamUploader) => {
//     const [file, setFile] = useState<File | null>(fileExam);
//     const [progress, setProgress] = useState(0);

//     const renameFile = (originalFile: File, newName: string): File => {

//         return new File([originalFile], newName, {
//             type: originalFile.type,
//             lastModified: originalFile.lastModified,
//         });
//     };

//     const handleUpload = async () => {
//         if (!file) return alert("נא לבחור קובץ");
//         // const renamedFile = {}
//         const nameFile: string = IsStudentTest ? student.name : exam.subject + '-' + exam.dateExam
//         const renamedFile = renameFile(file, `${nameFile}.jpg`); // כאן שימי את השם שאת רוצה

//         try {
//             // שלב 1: קבלת Presigned URL מהשרת
//             // const params: any = {
//             //     fileName: renamedFile.name,
//             //     subject: exam.subject,
//             //     date: exam.dateExam,
//             // };
//             // if (IsStudentTest && student.studentClass) {
//             //     params.class = student.studentClass;
//             // }
//             // const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, { params });

//             const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
//                 params: {
//                     fileName: renamedFile.name,
//                     subject: exam.subject,
//                     class: IsStudentTest ? student.studentClass : "null",
//                     date: exam.dateExam,
//                     IsStudentTest,
//                     contentType: "image/jpeg"
//                 }
//             });

//             const presignedUrl = response.data.url;
//             console.log(presignedUrl);
//             // שלב 2: העלאת הקובץ ישירות ל-S3
//             await axios.put(presignedUrl, renamedFile, {
//                 // headers: {
//                 //     'Content-Type': file.type,
//                 // },
//                 headers: {
//                     'Content-Type': renamedFile.type,
//                     'x-amz-acl': 'bucket-owner-full-control'  // <-- חשוב!
//                     // 'x-amz-acl': 'public-read'
//                 },
//                 onUploadProgress: (progressEvent) => {
//                     const percent = Math.round(
//                         (progressEvent.loaded * 100) / (progressEvent.total || 1)
//                     );
//                     setProgress(percent);
//                 },
//             });
//             alert('✅  המבחן הועלה בהצלחה!');
//         } catch (error) {
//             console.error('שגיאה בהעלאה:', error);
//             alert('❌ אירעה שגיאה בהעלאה');
//             console.log(renamedFile.name);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleUpload} disabled={!file}>העלה מבחן</button>
//             {progress > 0 && <div>התקדמות: {progress}%</div>}
//         </div>

//     );
// };

// export default ExamUploader;
