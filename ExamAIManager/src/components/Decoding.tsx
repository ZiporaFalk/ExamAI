import React, { useState } from "react";
const apiUrl = 'https://localhost:7083/api';

type DecodingProps = {
    onSelectedImage: (imageBase64: string) => void;
    onChangedFiles: (files: File[]) => void;
};

// const Decoding = ({ sourceComponent, onAnswersExtracted }: Props) => {
const Decoding = ({ onSelectedImage, onChangedFiles }: DecodingProps) => {

    // const navigate = useNavigate();
    // const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setFiles(fileArray);
            onChangedFiles(fileArray)//////////////////////////////////////////////////האם כאן זה צריך להיות
            const file = fileArray[0];
            if (file && file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    const base64String = reader.result?.toString().split(",")[1] || "";
                    // setSelectedImage(base64String);
                    onSelectedImage(base64String)/////////////////////////////////////////////////////////////האם כאן זה צריך להיות
                };
            }
        } 
    };
    // const handleAnalyze = async () => {// מפענח המבחן
    //     if (selectedImage) {
    //         const result = await analyzeImage(selectedImage);
    //         console.log(result)
    //         navigate('/CheckStudentExams', { state: { data: result } })
    //     }
    //     // const IdnewExam = await AddNewExam(result)
    //     // console.log("id:" + IdnewExam);
    //     // await AddNewAnswers(result, IdnewExam) 
    // };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>3</h1>
            <h1>Decoding</h1>
            <h3>בחירת מבחן</h3>
            <input type="file" multiple onChange={handleFileChange} />
            {/* <button onClick={handleAnalyze} disabled={!selectedImage}>(הבא)לבדיקת מבחן</button> */}

            {files.map((file) => (
                <div key={file.name}>
                    {file.name}: {progress[file.name] || 0}%
                </div>
            ))}
        </div>
    );
};

export default Decoding;


// import { useState } from "react";
// import { analyzeImage } from "./פיענוח מבחן/AnalyzeImag";

// const apiUrl = 'https://localhost:7083/api';

// const Decoding = () => {
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [files, setFiles] = useState<File[]>([]);
//     const [progress, setProgress] = useState<{ [key: string]: number }>({});

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             const fileArray = Array.from(event.target.files);
//             setFiles(fileArray);

//             // במקרה של תמונה, המרתה ל-Base64
//             const file = fileArray[0];
//             if (file && file.type.startsWith("image")) {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(file);
//                 reader.onloadend = () => {
//                     const base64String = reader.result?.toString().split(",")[1] || "";
//                     setSelectedImage(base64String);
//                 };
//             }
//         }
//     };

//     const handleAnalyze = async () => {// מפענח המבחן
//         if (selectedImage) {
//             const result = await analyzeImage(selectedImage);
//             console.log(result)

//             // const IdnewExam = await AddNewExam(result)
//             // console.log("id:" + IdnewExam);

//             // await AddNewAnswers(result, IdnewExam)
//         }
//     };

//     return (
//         <>
//             <input type="file" multiple onChange={handleFileChange} />
//             <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>
//         </>
//     );
// };

// export default Decoding;
//לפני הsteper

// import React, { useState } from "react";
// import { analyzeImage } from '../components/פיענוח מבחן/AnalyzeImag';
// // import axios from "axios";
// import { Exam } from "./types";
// import { useLocation, useNavigate } from "react-router-dom";

// const apiUrl = 'https://localhost:7083/api';

// // type Props = {
// //     sourceComponent: string;
// //     // onExamReady: (exam: Exam | undefined) => void;
// //     onAnswersExtracted?: (exam: Exam | undefined, answers: any[]) => void;
// // };
// // const Decoding = ({ sourceComponent, onAnswersExtracted }: Props) => {
// const Decoding = () => {
//     const location = useLocation();
//     const IsStudentTest = location.state?.IsStudentTest;

//     const navigate = useNavigate();
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [files, setFiles] = useState<File[]>([]);
//     const [progress, setProgress] = useState<{ [key: string]: number }>({});

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             const fileArray = Array.from(event.target.files);
//             setFiles(fileArray);
//             // במקרה של תמונה, המרתה ל-Base64
//             const file = fileArray[0];
//             if (file && file.type.startsWith("image")) {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(file);
//                 reader.onloadend = () => {
//                     const base64String = reader.result?.toString().split(",")[1] || "";
//                     setSelectedImage(base64String);
//                 };
//             }
//         }
//     };
//     const handleAnalyze = async () => {// מפענח המבחן
//         if (selectedImage) {
//             const result = await analyzeImage(selectedImage);
//             console.log(result)
//             navigate('/CheckStudentExams', { state: { data: result } })
//         }
//         // const IdnewExam = await AddNewExam(result)
//         // console.log("id:" + IdnewExam);
//         // await AddNewAnswers(result, IdnewExam)
//     };

//     return (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//             <h1>3</h1>
//             <h1>Decoding</h1>
//             <h3>בחירת מבחן</h3>
//             <input type="file" multiple onChange={handleFileChange} />
//             <button onClick={handleAnalyze} disabled={!selectedImage}>(הבא)לבדיקת מבחן</button>

//             {files.map((file) => (
//                 <div key={file.name}>
//                     {file.name}: {progress[file.name] || 0}%
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Decoding;


// // import { useState } from "react";
// // import { analyzeImage } from "./פיענוח מבחן/AnalyzeImag";

// // const apiUrl = 'https://localhost:7083/api';

// // const Decoding = () => {
// //     const [selectedImage, setSelectedImage] = useState<string | null>(null);
// //     const [files, setFiles] = useState<File[]>([]);
// //     const [progress, setProgress] = useState<{ [key: string]: number }>({});

// //     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //         if (event.target.files) {
// //             const fileArray = Array.from(event.target.files);
// //             setFiles(fileArray);

// //             // במקרה של תמונה, המרתה ל-Base64
// //             const file = fileArray[0];
// //             if (file && file.type.startsWith("image")) {
// //                 const reader = new FileReader();
// //                 reader.readAsDataURL(file);
// //                 reader.onloadend = () => {
// //                     const base64String = reader.result?.toString().split(",")[1] || "";
// //                     setSelectedImage(base64String);
// //                 };
// //             }
// //         }
// //     };

// //     const handleAnalyze = async () => {// מפענח המבחן
// //         if (selectedImage) {
// //             const result = await analyzeImage(selectedImage);
// //             console.log(result)

// //             // const IdnewExam = await AddNewExam(result)
// //             // console.log("id:" + IdnewExam);

// //             // await AddNewAnswers(result, IdnewExam)
// //         }
// //     };

// //     return (
// //         <>
// //             <input type="file" multiple onChange={handleFileChange} />
// //             <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>
// //         </>
// //     );
// // };

// // export default Decoding;