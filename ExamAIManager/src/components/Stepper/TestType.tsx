import { useContext } from "react";
import StepperDataContext from "./StepperDataContext";
import { useNavigate } from "react-router-dom";
import "../../stylies/TestType.css"

const TestType = () => {
    const { setIsStudentTest, setIsAbleNext } = useContext(StepperDataContext)!;
 
    const navigate = useNavigate()
    // const sendMail = async () => {
    //     try {
    //         await axios.post(`${apiUrl}/Email/send`, {
    //             to: "z0548498935@gmail.com",
    //             subject: "ברוך הבא!",
    //             body: "שלום וברוך הבא למערכת שלנו!",
    //         });
    //         alert("הדוא״ל נשלח בהצלחה!");
    //     } catch (err) {
    //         console.error(err);
    //         alert("שליחת הדוא״ל נכשלה.");
    //     }
    // };
    return (
        <>
            <div id="upload-container">
                <h1>TestType</h1>
                <h1 className="title">Choose Your Action</h1>
                <p className="subtitle">
                    Our system allows you to check exams and view results quickly and efficiently
                </p>

                <div className="options-container">
                    <div
                        className="option-card"
                        // onClick={() => navigate('students-test')}
                        onClick={() => { setIsStudentTest(true); setIsAbleNext(true); }}
                    >
                        <div className="icon-circle">
                            <div className="icon-background"></div>
                            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="card-title">Student Exam Check</h2>
                        <p className="card-description">Upload and check student exams</p>
                    </div>

                    <div
                        className="option-card"
                        // onClick={() => navigate('test-results')}
                        onClick={() => { setIsStudentTest(false); setIsAbleNext(true); }}
                    >
                        <div className="icon-circle">
                            <div className="icon-background"></div>
                            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="card-title">Exam Results</h2>
                        <p className="card-description">View and edit exam results</p>
                    </div>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                >
                    <svg className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </button>
            </div>

        </>
    )
}
export default TestType