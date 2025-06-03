

import { useNavigate } from "react-router-dom";

const GetStarted = () => {
    const navigate = useNavigate();

    const ChooseTestType = () => {
        navigate('/Stepper');
    }

    return (
        <>
            <button onClick={ChooseTestType}>Get Started</button>
        </>
    )
}
export default GetStarted