import { useContext } from "react";
import StepperDataContext from "./StepperDataContext";


const TestType = () => {
    const { setIsStudentTest } = useContext(StepperDataContext)!;

    return (
        <>
            <h1>2</h1>
            <h1>TestType</h1>
            <button onClick={() => { setIsStudentTest(true); }}>Student</button>
            <button onClick={() => { setIsStudentTest(false); }}>Example</button>
        </>
    )
}
export default TestType