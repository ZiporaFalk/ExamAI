
// interface FileIconProps {
//     type: 'pdf' | 'image' | 'doc' | 'file';
// }

// interface StepperContextType {
//     files: FileWithProgress[] | null;
//     exams: Exam[] | null;
//     students: Student[] | null;
// }

// const ExamUploader = () => {
//     const { students, exams, isStudentTest, files } = useContext(StepperDataContext)!
//     const [progress, setProgress] = useState(0);
//     // const [progress, setProgress] = useState<{ [key: string]: number }>({});

//     const renameFile = (originalFile: File, newName: string): File => {
//         return new File([originalFile], newName, {
//             type: originalFile.type,
//             lastModified: originalFile.lastModified,
//         });
//     };
//     const handleUpload = async () => {

//         if (!files.length) return alert("נא לבחור קבצים");

//         for (let i = 0; i < students.length; i++) {
//             const nameFile: string = isStudentTest ? students[i].name : `${exams[i].subject}-${exams[i].dateExam}`;
//             // const renamedFile = renameFile(files[i], `${nameFile}.jpg`); // שם ייחודי לכל קובץ
//             const renamedFile = renameFile(files[i]?.file!, `${nameFile}.jpg`); // שם ייחודי לכל קובץ
//             try {
//                 const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
//                     params: {
//                         fileName: renamedFile.name,
//                         subject: exams[i].subject,
//                         class: isStudentTest ? students[i].studentClass : "null",
//                         date: exams[i].dateExam,
//                         isStudentTest,
//                         contentType: "image/jpeg"
//                     }
//                 });
//                 const presignedUrl = response.data.url;

//                 await axios.put(presignedUrl, renamedFile, {
//                     headers: {
//                         'Content-Type': renamedFile.type,
//                         'x-amz-acl': 'bucket-owner-full-control'
//                     },
//                     onUploadProgress: (progressEvent) => {
//                         const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
//                         setProgress(percent);
//                     },
//                 });
//                 isStudentTest && sendMail(students[i], exams[i])
//                 console.log(`✔️ ${renamedFile.name} הועלה בהצלחה`);
//             } catch (error) {
//                 console.error(`❌ שגיאה בהעלאת הקובץ ${renamedFile.name}:`, error);
//             }
//         }
//         alert("✅ כל הקבצים הועלו!");
//     };
//     const sendMail = async (student: Student, exam: Exam) => {
//         try {
//             console.log(student);
//             await axios.post(`${apiUrl}/Email/send`, {
//                 // to: `${student.email}`,
//                 to: `z0548498935@gmail.com`,
//                 subject: `שלום לך ${student.name}!`,
//                 body: `📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!
//                 רצינו לעדכן שהמבחן שעשית ב:${exam.subject} נבדק ונכנס למערכת😂
//                 את מוזמנת להיכנס ולצפות בו🔭🔭
//                 בהצלחה!!!🎉`,
//             });
//             alert(student.email + " הדוא״ל נשלח בהצלחה!");
//         } catch (err) {
//             console.error(err);
//             alert(student.email + "שליחת הדוא״ל נכשלה.");
//         }
//     };
//     const getFileIcon = (fileName: string): FileIconProps['type'] => {
//         const extension = fileName.split('.').pop()?.toLowerCase() || '';

//         if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
//             return "image";
//         } else if (['pdf'].includes(extension)) {
//             return "pdf";
//         } else if (['doc', 'docx'].includes(extension)) {
//             return "doc";
//         } else {
//             return "file";
//         }
//     };
//     ////////////////////////


//     return (
//         // <div>
//         //     <button onClick={handleUpload} disabled={!files}>העלה מבחן</button>
//         //     {progress > 0 && <div>התקדמות: {progress}%</div>}
//         //     {files.map((fileExam, index) => (
//         //         <div key={index}>{fileExam?.file.name}</div>
//         //     ))}
//         // </div>
//         <>
//             <Outlet />
//             <div className="upload-container rtl">
//                 <div className="upload-header">
//                     <h1 className="upload-title">העלאת קבצים</h1>
//                     <p className="upload-subtitle">העלה קבצים למערכת</p>
//                 </div>
//                 {/* {fileWithProgress&&} */}
//                 <div className="files-container">
//                     {files?.filter(Boolean).map((fileWithProgress) => (
//                         <div key={fileWithProgress.file.name} className="file-item">
//                             <div className={`file-icon file-icon-${getFileIcon(fileWithProgress.file.name)}`}>
//                                 <FileIcon type={getFileIcon(fileWithProgress.file.name)} />
//                             </div>

//                             <div className="file-info">
//                                 <div className="file-name">{fileWithProgress.file.name}</div>
//                                 <div className="file-size">{(fileWithProgress.file.size / 1024).toFixed(2)} KB</div>
//                                 <div className="progress-container">
//                                     <div
//                                         className={`progress-bar ${progress[fileWithProgress.file.name] === 100 ? 'complete' : ''}`}
//                                         style={{ width: `${progress[fileWithProgress.file.name] || 0}%` }}
//                                     ></div>
//                                 </div>
//                                 <div className="progress-text">
//                                     {progress[fileWithProgress.file.name] ? `${progress[fileWithProgress.file.name]}%` : 'ממתין להעלאה...'}
//                                 </div>
//                             </div>

//                             <div className="file-meta">
//                                 {exams && students && exams[files.indexOf(fileWithProgress)] && students[files.indexOf(fileWithProgress)] ?
//                                     `${exams[files.indexOf(fileWithProgress)].subject} - ${students[files.indexOf(fileWithProgress)]?.name}` :
//                                     'טוען מידע...'}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {files?.filter(Boolean).length === 0 && (
//                     <div className="no-files">
//                         <EmptyStateIcon />
//                         <p>לא נבחרו קבצים להעלאה</p>
//                     </div>
//                 )}

//                 <button
//                     className={`upload-button ${isUploading ? 'uploading' : ''} ${uploadComplete ? 'complete' : ''}`}
//                     onClick={handleUpload}
//                     disabled={!files || files.filter(Boolean).length === 0 || isUploading}
//                 >
//                     {isUploading ? (
//                         <>
//                             <div className="spinner"></div>
//                             <span>מעלה...</span>
//                         </>
//                     ) : uploadComplete ? (
//                         <>
//                             <CheckIcon />
//                             <span>הושלם בהצלחה</span>
//                         </>
//                     ) : (
//                         <>
//                             <UploadIcon />
//                             <span>העלה קבצים</span>
//                         </>
//                     )}
//                 </button>
//             </div></>
//     );
// };

// // SVG Icon Components
// const FileIcon: React.FC<FileIconProps> = ({ type }) => {
//     switch (type) {
//         case 'pdf':
//             return (
//                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M9 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//             );
//         case 'image':
//             return (
//                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//             );
//         case 'doc':
//             return (
//                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//             );
//         default:
//             return (
//                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//             );
//     }
// };

// const UploadIcon: React.FC = () => (
//     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );

// const CheckIcon: React.FC = () => (
//     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );

// const EmptyStateIcon: React.FC = () => (
//     <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );
// export default ExamUploader;




import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Exam, FileWithProgress, Student } from "../../utils/types";
import StepperDataContext from '../Stepper/StepperDataContext';
import "../../stylies/ExamUploader.css"
import EmailService from "../../services/EmailService";
import ExamUploadService from "../../services/ExamUploadService";
// import ExamUploadService from "../../services/ExamUploadService";


// interface StepperContextType {
//     files: FileWithProgress[] | null;
//     exams: Exam[] | null;
//     students: Student[] | null;
// }

interface FileIconProps {
    type: 'pdf' | 'image' | 'doc' | 'file';
}

const ExamUploader: React.FC = () => {
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);
    const { students, exams, isStudentTest, files, setIsAbleNext } = useContext(StepperDataContext)!

    // קבלת המידע מהקונטקסט
    // const { files, exams, students } = useContext(StepperDataContext) as StepperContextType;
    const sendMail = async (student: Student, exam: Exam) => {
        const body = `📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!
                 רצינו לעדכן שהמבחן שעשית ב:${exam.subject} נבדק ונכנס למערכת😂
                 את מוזמנת להיכנס ולצפות בו🔭🔭
                 בהצלחה!!!🎉`;
        const subject = `שלום לך ${student.name}!`
        const email=student.email!
        // await EmailService.sendMail(student, exam)
        await EmailService.sendMail(body,subject,email)
        // try {
        //     console.log(student);
        //     await axios.post(`${apiUrl}/Email/send`, {
        //         // to: `${student.email}`,
        //         to: `z0548498935@gmail.com`,
        //         subject: `שלום לך ${student.name}!`,
        //         body: `📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!
        //         רצינו לעדכן שהמבחן שעשית ב:${exam.subject} נבדק ונכנס למערכת😂
        //         את מוזמנת להיכנס ולצפות בו🔭🔭
        //         בהצלחה!!!🎉`,
        //     });
        //     alert(student.email + " הדוא״ל נשלח בהצלחה!");
        // } catch (err) {
        //     console.error(err);
        //     alert(student.email + "שליחת הדוא״ל נכשלה.");
        // }
    };
    // const renameFile = (originalFile: File, newName: string): File => {
    //     return new File([originalFile], newName, {
    //         type: originalFile.type,
    //         lastModified: originalFile.lastModified,
    //     });
    // };
    const handleUpload = async () => {

        if (!files.length) return alert("נא לבחור קבצים");
        console.log("uploadAll");

        await ExamUploadService.uploadAll(
            files,
            students,
            exams,
            isStudentTest,
            setProgress,
            sendMail
        );

        // for (let i = 0; i < students.length; i++) {
        //     const nameFile: string = isStudentTest ? students[i].name : `${exams[i].subject}-${exams[i].dateExam}`;
        //     // const renamedFile = renameFile(files[i], `${nameFile}.jpg`); // שם ייחודי לכל קובץ
        //     const renamedFile = renameFile(files[i]?.file!, `${nameFile}.jpg`); // שם ייחודי לכל קובץ
        //     // await ExamUploadService.uploadFile(renamedFile, exams[i], students[i], isStudentTest,setProgress)
        //     try {
        //         const response = await axios.get(`${apiUrl}/ExamUpload/presigned-url`, {
        //             params: {
        //                 fileName: renamedFile.name,
        //                 subject: exams[i].subject,
        //                 class: isStudentTest ? students[i].studentClass : "null",
        //                 date: exams[i].dateExam,
        //                 isStudentTest,
        //                 contentType: "image/jpeg"
        //             }
        //         });
        //         const presignedUrl = response.data.url;

        //         await axios.put(presignedUrl, renamedFile, {
        //             headers: {
        //                 'Content-Type': renamedFile.type,
        //                 'x-amz-acl': 'bucket-owner-full-control'
        //             },
        //             onUploadProgress: (progressEvent) => {
        //                 const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        //                 setProgress({ [renamedFile.name]: percent });
        //             },
        //         });
        //         isStudentTest && sendMail(students[i], exams[i])
        //         console.log(`✔️ ${renamedFile.name} הועלה בהצלחה`);

        //     } catch (error) {
        //         console.error(`❌ שגיאה בהעלאת הקובץ ${renamedFile.name}:`, error);
        //     }
        // }
        alert("✅ כל הקבצים הועלו!");
        setIsAbleNext(true)

    };
    // const handleUpload = async (): Promise<void> => {
    //     if (!files || files.length === 0 || !exams) return;

    //     setIsUploading(true);
    //     setUploadComplete(false);

    //     try {
    //         const uploadPromises = files.map(async (fileWithProgress, i) => {
    //             // if (!fileWithProgress) return null;

    //             const exam = exams[i];
    //             const student = students?.[i];

    //             // שולח את file.file שהוא ה-File המקורי
    //             return uploadFileToS3(
    //                 fileWithProgress.file,
    //                 exam,
    //                 student,
    //                 (percent: number) => {
    //                     setProgress((prev) => ({
    //                         ...prev,
    //                         [fileWithProgress.file.name]: percent,
    //                     }));
    //                 }
    //             );
    //         });

    //         await Promise.all(uploadPromises.filter(Boolean));
    //         setUploadComplete(true);
    //         setTimeout(() => {
    //             alert("✅ כל הקבצים הועלו בהצלחה!");
    //         }, 500);
    //     } catch (error) {
    //         console.error("❌ שגיאה בהעלאה:", error);
    //         alert("אירעה שגיאה במהלך ההעלאה.");
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

    const getFileIcon = (fileName: string): FileIconProps['type'] => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';

        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
            return "image";
        } else if (['pdf'].includes(extension)) {
            return "pdf";
        } else if (['doc', 'docx'].includes(extension)) {
            return "doc";
        } else {
            return "file";
        }
    };

    return (
        <>
            <h1>ExamUploader</h1>
            <Outlet />
            <div className="upload-container rtl">
                <div className="upload-header">
                    <h1 className="upload-title2">העלאת קבצים</h1>
                    <p className="upload-subtitle2">העלה קבצים למערכת</p>
                </div>

                <div className="files-container">
                    {files?.filter((f): f is FileWithProgress => f !== null).map((fileWithProgress) => (
                        <div key={fileWithProgress.file.name} className="file-item2">
                            <div className={`file-icon file-icon-${getFileIcon(fileWithProgress.file.name)}`}>
                                <FileIcon type={getFileIcon(fileWithProgress.file.name)} />
                            </div>

                            <div className="file-info2">
                                <div className="file-name2">{fileWithProgress.file.name}</div>
                                <div className="file-size2">{(fileWithProgress.file.size / 1024).toFixed(2)} KB</div>
                                <div className="progress-container">
                                    <div
                                        className={`progress-bar ${progress[fileWithProgress.file.name] === 100 ? 'complete' : ''}`}
                                        style={{ width: `${progress[fileWithProgress.file.name] || 0}%` }}
                                    ></div>
                                </div>
                                <div className="progress-text2">
                                    {progress[fileWithProgress.file.name] ? `${progress[fileWithProgress.file.name]}%` : 'ממתין להעלאה...'}
                                </div>
                            </div>

                            <div className="file-meta">
                                {exams && students && exams[files.indexOf(fileWithProgress)] && students[files.indexOf(fileWithProgress)] ?
                                    `${exams[files.indexOf(fileWithProgress)].subject} - ${students[files.indexOf(fileWithProgress)]?.name}` :
                                    'טוען מידע...'}
                            </div>
                        </div>
                    ))}
                </div>

                {files?.filter(Boolean).length === 0 && (
                    <div className="no-files">
                        <EmptyStateIcon />
                        <p>לא נבחרו קבצים להעלאה</p>
                    </div>
                )}

                <button
                    className={`upload-button ${isUploading ? 'uploading' : ''} ${uploadComplete ? 'complete' : ''}`}
                    onClick={handleUpload}
                    disabled={!files || files.filter(Boolean).length === 0 || isUploading}
                >
                    {isUploading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Uploads files...</span>
                        </>
                    ) : uploadComplete ? (
                        <>
                            <CheckIcon />
                            <span>Completed successfully</span>
                        </>
                    ) : (
                        <>
                            <UploadIcon />
                            <span>Upload files</span>
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

// SVG Icon Components
const FileIcon: React.FC<FileIconProps> = ({ type }) => {
    switch (type) {
        case 'pdf':
            return (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'image':
            return (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'doc':
            return (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
    }
};

const UploadIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EmptyStateIcon: React.FC = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ExamUploader;