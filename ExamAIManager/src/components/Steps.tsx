import { useContext, useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import Decoding from "./Decoding";
// import ExamUploader from "./העלאת קובץ ל-AWS/ExamUploader";
import TestType from "./TestType";
import ExampleExam from "./מבחן דוגמא/ExampleExam";
import WordFeadbackUploader from "./העלאת קובץ ל-AWS/WordFeadbackUploader";
import CheckStudentExams from "./בדיקת מבחן תלמיד/CheckStudentExams";
import StepperDataContext from "./StepperDataContext";
import ExamUploader from "./העלאת קובץ ל-AWS/ExamUploader";

const Stepper_upload = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { isStudentTest } = useContext(StepperDataContext)!;

    const steps = [
        {
            label: "בחר סוג מבחן",
            component: <TestType />,
        },
        {
            label: "העלה קובץ",
            component: <Decoding />,
        },
        {
            label: isStudentTest ? "בדיקת מבחן" : "פיענוח תשובות",
            component: isStudentTest ? <CheckStudentExams /> : <ExampleExam />,//הוספה לשרת 
        },
        ...(isStudentTest ? [
            {
                label: "צור פידבק",
                component: <WordFeadbackUploader />///פה מעלה פידבק לAWS
            }
        ] : []),
        {
            label: "אישור ושליחה",
            component: <ExamUploader />//פה מעלה קובץ מבחן תלמיד או דוגמא 
        }
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
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


