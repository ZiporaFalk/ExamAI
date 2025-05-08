import { useContext } from "react";
import StepperDataContext from "./StepperDataContext";
////////////////////////////////
import axios from "axios";
const apiUrl = 'https://localhost:7083/api';


const TestType = () => {
    const { setIsStudentTest } = useContext(StepperDataContext)!;
    const sendMail = async () => {
        try {
            // "https://localhost:5001/api/email/send"

            await axios.post(`${apiUrl}/Email/send`, {
                to: "z0548498935@gmail.com",
                subject: "ברוך הבא!",
                body: "שלום וברוך הבא למערכת שלנו!",
            });
            alert("הדוא״ל נשלח בהצלחה!");
        } catch (err) {
            console.error(err);
            alert("שליחת הדוא״ל נכשלה.");
        }
    };
    return (
        <>
         {/* sendMail()  */}
            <h1>2</h1>
            <h1>TestType</h1>
            <button onClick={() => { setIsStudentTest(true);}}>Student</button>
            <button onClick={() => { setIsStudentTest(false); }}>Example</button>
        </>
    )
}
export default TestType