import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { UserProvider } from "./UserContext";
type PropsTestType = {
    whichType: (e: boolean) => void
}
const TestType = ({ whichType }: PropsTestType) => {
    // const [IsStudentTest, setIsStudentTest] = useState(false)

    // const navigate = useNavigate();
    // const CheckFile = () => {
    //     navigate('/Decoding', { state: { IsStudentTest: IsStudentTest } })
    // }

    return (
        <>
            {/* <UserProvider> */}
            <h1>2</h1>
            <h1>TestType</h1>
            {/* <button onClick={() => { setIsStudentTest(true);  }}>Student</button> */}
            <button onClick={() => { whichType(true); }}>Student</button>
            <button onClick={() => { whichType(false); }}>Example</button>
            {/* </UserProvider> */}
        </>
    )
}
export default TestType