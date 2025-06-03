import { FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Exam, FileWithProgress, Student } from "../../utils/types";
import StepperDataContext from '../Stepper/StepperDataContext';
import "../../stylies/ExamUploader.css"
import EmailService from "../../services/EmailService";
import ExamUploadService from "../../services/ExamUploadService";

interface FileIconProps {
    type: 'pdf' | 'image' | 'doc' | 'file';
}

const ExamUploader: React.FC = () => {
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [isUploading,] = useState<boolean>(false);
    const [uploadComplete, ] = useState<boolean>(false);
    const { students, exams, isStudentTest, files, setIsAbleNext } = useContext(StepperDataContext)!

    const sendMail = async (student: Student, exam: Exam) => {
        const body = `📑שלום וברוך הבא למערכת בדיקת המבחנים שלנו!
                 רצינו לעדכן שהמבחן שעשית ב:${exam.subject} נבדק ונכנס למערכת😂
                 את מוזמנת להיכנס ולצפות בו🔭🔭
                 בהצלחה!!!🎉`;
        const subject = `שלום לך ${student.name}!`
        const email=student.email!
        await EmailService.sendMail(body,subject,email)
    };

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
    
        alert("✅ כל הקבצים הועלו!");
        setIsAbleNext(true)
    };
            

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

const FileIcon: FC<FileIconProps> = ({ type }) => {
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

const UploadIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EmptyStateIcon: FC = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ExamUploader;