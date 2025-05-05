import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import Decoding from "./Decoding";
import ExamUploader from "./העלאת קובץ ל-AWS/ExamUploader";
import TestType from "./TestType";
import ExampleExam from "./מבחן דוגמא/ExampleExam";
import { Answer, Exam, Student } from "./types";
import WordFeadbackUploader from "./העלאת קובץ ל-AWS/WordFeadbackUploader";
import CheckStudentExams from "./בדיקת מבחן תלמיד/CheckStudentExams";

const Stepper_upload = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [files, setFiles] = useState<File[] | null>(null);
    // const [selectedImage, setSelectedImage] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [IsStudentTest, setIsStudentTest] = useState(false)
    // const [exam, setExam] = useState<Exam>({ dateExam: "", subject: " " })
    // const [student, setStudent] = useState<Student>({ name: " ", studentClass: " " })
    // const [score, setScore] = useState(0)
    // const [answersStudent, setanswersStudent] = useState<Answer[]>([])
    const [students, setStudents] = useState<Student[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [answersList, setAnswersList] = useState<Answer[][]>([]);

    // const handleselectedImage = (selectedImage: string) => {
    //     setSelectedImage(selectedImage);
    // };
    const handleselectedImages = (images: string[]) => {
        setSelectedImages(images);
    };

    const handleFiles = (files: File[]) => {
        console.log(files.length)
        setFiles(files)
    }
    // (exam: Exam, student: Student, score: number, answersStudent: Answer[])
    const dataForStudents = (exams: Exam[], students: Student[], scores: number[], answersStudents: Answer[][] ) => {
      
        setExams(exams)
        setStudents(students)
        setScores(scores)
        setAnswersList(answersStudents)
    };

    const setNewExams = (exams: Exam[]) => {
        exams.forEach(exam => console.log("נוסף מבחן:", exam));
    };

    const steps = [
        {
            label: "בחר סוג מבחן",
            component: <TestType whichType={setIsStudentTest} />,
        },
        {
            label: "העלה קובץ",
            component: <Decoding onSelectedImages={handleselectedImages} onChangedFiles={handleFiles} />,
        },
        {
            label: IsStudentTest ? "בדיקת מבחן" : "פיענוח תשובות",
            component: IsStudentTest ? <CheckStudentExams selectedImages={selectedImages} setDataForStudents={dataForStudents} />
                : <ExampleExam selectedImages={selectedImages} setNewExams={setNewExams} />,
        },
        ...(IsStudentTest ? [
            {
                label: "צור פידבק",
                component: <WordFeadbackUploader students={students} exams={exams} scores={scores} answerss={answersList} />
            }
        ] : []),
        {
            label: "אישור ושליחה",
            // component: <ExamUploader student={student} exam={exam} IsStudentTest={IsStudentTest} fileExam={files && files[0]} />
            component: <ExamUploader students={students} exams={exams} IsStudentTest={IsStudentTest} fileExams={files ?? []}
            />
        }
    ];


    const handleNext = () => {
        if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
        // console.log(answersStudent);
        console.log("answersStudent");

    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prev) => prev - 1);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 4 }}>
                {steps[activeStep].component}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    הקודם
                </Button>
                <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
                    הבא
                </Button>
            </Box>
        </Box>
    );
};

export default Stepper_upload;











// import { useState } from "react";
// import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
// import Decoding from "./Decoding";
// import ExamUploader from "./העלאת קובץ ל-AWS/ExamUploader";
// import TestType from "./TestType";
// import ExampleExam from "./מבחן דוגמא/ExampleExam";
// import { Answer, Exam, Student } from "./types";
// import WordFeadbackUploader from "./העלאת קובץ ל-AWS/WordFeadbackUploader";
// import CheckStudentExams from "./בדיקת מבחן תלמיד/CheckStudentExams";

// const Stepper_upload = () => {
//     const [activeStep, setActiveStep] = useState(0);
//     const [files, setFiles] = useState<File[] | null>(null);
//     const [selectedImage, setSelectedImage] = useState("");
//     const [IsStudentTest, setIsStudentTest] = useState(false)
//     const [exam, setExam] = useState<Exam>({ dateExam: "", subject: " " })
//     const [student, setStudent] = useState<Student>({ name: " ", studentClass: " " })
//     const [score, setScore] = useState(0)
//     const [answersStudent, setanswersStudent] = useState<Answer[]>([])
//     answersStudent
//     const handleselectedImage = (selectedImage: string) => {
//         setSelectedImage(selectedImage);
//     };
//     const handleFiles = (files: File[]) => {
//         console.log(files.length)
//         setFiles(files)
//     }
//     const dataForStudent = (exam: Exam, student: Student, score: number, answersStudent: Answer[]) => {
//         setExam(exam)
//         setStudent(student)
//         setScore(score)
//         setanswersStudent(answersStudent)
//     }
//     const setNewExam = (exam: Exam) => {
//         setExam(exam)
//     }
//     const steps = [
//         {
//             label: "בחר סוג מבחן",
//             component: <TestType whichType={setIsStudentTest} />,
//         },
//         {
//             label: "העלה קובץ",
//             component: <Decoding onSelectedImage={handleselectedImage} onChangedFiles={handleFiles} />,
//         },
//         {
//             label: IsStudentTest ? "בדיקת מבחן" : "פיענוח תשובות",
//             component: IsStudentTest ? <CheckStudentExams selectedImage={selectedImage} setDataForStudent={dataForStudent} />
//                 : <ExampleExam selectedImage={selectedImage} setNewExam={setNewExam} />,
//         },
//         ...(IsStudentTest ? [
//             {
//                 label: "צור פידבק",
//                 component: <WordFeadbackUploader student={student} exam={exam} score={score} answers={answersStudent} />
//             }
//         ] : []),
//         {
//             label: "אישור ושליחה",
//             component: <ExamUploader student={student} exam={exam} IsStudentTest={IsStudentTest} fileExam={files && files[0]} />
//         }
//     ];

//     const handleNext = () => {
//         if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
//         console.log(answersStudent);
//         console.log("answersStudent");

//     };

//     const handleBack = () => {
//         if (activeStep > 0) setActiveStep((prev) => prev - 1);
//     };

//     return (
//         <Box sx={{ width: "100%" }}>
//             <Stepper activeStep={activeStep} alternativeLabel>
//                 {steps.map((step, index) => (
//                     <Step key={index}>
//                         <StepLabel>{step.label}</StepLabel>
//                     </Step>
//                 ))}
//             </Stepper>
//             <Box sx={{ mt: 4 }}>
//                 {steps[activeStep].component}
//             </Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//                 <Button disabled={activeStep === 0} onClick={handleBack}>
//                     הקודם
//                 </Button>
//                 <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
//                     הבא
//                 </Button>
//             </Box>
//         </Box>
//     );
// };

// export default Stepper_upload;
