import { useContext, useState } from "react";
import Decoding from "./Decoding";
import TestType from "./TestType";
import ExampleExam from "./ExampleExam";
import CheckStudentExams from "./CheckStudentExams";
import StepperDataContext from "./StepperDataContext";
import ExamUploader from "../Uploading files to AWS/ExamUploader";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import "../../stylies/Steps.css"
import { useNavigate } from "react-router-dom";
import WordFeedbackUploader from "../Uploading files to AWS/WordFeedbackUploader";

const Stepper_upload = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { isStudentTest, isAbleNext, setIsAbleNext, setFiles } = useContext(StepperDataContext)!;
    const navigate = useNavigate()
    const steps = [
        {
            label: "Select test type",
            component: <TestType />,
        },
        {
            label: "Upload a file",
            component: <Decoding />,
        },
        {
            label: isStudentTest ? "Test Check" : "Decoding Answers",
            component: isStudentTest ? <CheckStudentExams /> : <ExampleExam />, 
        },
        ...(isStudentTest ? [ 
            {
                label: "Create Feedback",
                component: <WordFeedbackUploader />
            }
        ] : []),
        {
            label: "Confirm and send",
            component: <ExamUploader />
        }
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
        else {
            setFiles([])
            navigate('/')
        }
        setIsAbleNext(false)
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prev) => prev - 1);
    };

    return (
        <div className="stepper-container">
            <div className="stepper-wrapper">
                <div className="stepper-progress">
                    {steps.map((step, index) => (
                        <div key={index} className={`step-item ${activeStep === index ? 'active' : ''} ${activeStep > index ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {activeStep > index ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className="step-label">
                                <div className="step-label-main">{step.label}</div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`step-connector ${activeStep > index ? 'completed' : ''}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="step-content">
                    {steps[activeStep].component}
                </div>

                <div className="stepper-actions">
                    <button
                        className={`stepper-btn stepper-btn-secondary ${activeStep === 0 ? 'disabled' : ''}`}
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        <ArrowLeft size={16} />
                        Previous
                    </button>
                    <button
                        className={`stepper-btn stepper-btn-primary ${!isAbleNext ? 'disabled' : ''}`}
                        disabled={!isAbleNext}
                        onClick={handleNext}
                    >
                        {activeStep < steps.length - 1 ? "Next" : "Finish"}
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Stepper_upload;


