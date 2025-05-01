import { useNavigate } from "react-router-dom";

const GetStarted = () => {
    const navigate = useNavigate();

    const ChooseTestType = () => {
        navigate('/Stepper');
    }

    return (
        <>
            <h1>1</h1>
            <button onClick={ChooseTestType}>Get Started</button>
        </>
    )
}
export default GetStarted