// import { Link } from "react-router"
// import studentStore from "./StudentStore"

// const NavBar = observer(()  => {
//     const handleLogout = () => {
//         studentStore.IsLogin = false;
//         localStorage.removeItem("isLogin");
//         // להפנות לעמוד ההתחברות!
//     };

//     return (<>
//         <nav style={{ position: "fixed", top: "0", right: "0", padding: "20px" }}>

//             <Link to="/login" >Login </Link>
//             <Link to="/"  >| home </Link>
//             {studentStore.IsLogin && (<>
//                 <Link to="/students"> | students </Link>
//                 <button onClick={handleLogout}> | Logout </button></>)}

//             {/* {studentStore.IsLogin && < Link to="/students" > | students </Link>} */}
//         </nav >
//     </>)
// }

// export default NavBar

import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import studentStore from "./טבלת תלמידים/StudentStore";

const NavBar = observer(() => {
    const handleLogout = () => {
        studentStore.IsLogin = false; // התנתקות
    };

    return (
        <nav style={{ position: "fixed", top: "0", right: "0", padding: "20px" }}>
            <Link to="/login">Login</Link>
            <Link to="/">| Home</Link>
            {/* {studentStore.IsLogin && <Link to="/students">| Students</Link>} */}
            <Link to="/UploadAWS">       <button> | Upload file for AWS</button></Link>
            <Link to="/CheckStudentExams"> <button>| Check Student Exams</button> </Link>
            {studentStore.IsLogin && <>
                <button onClick={handleLogout}>התנתק</button>
                {/* <Link to="/UploadSampleTest"> <button >להעלאת מבחן לבדיקה | </button></Link>
                <Link to="/UploadSampleTest">  <button >להעלאת מבחן דוגמא  | </button></Link> */}
                <Link to="/students"> <button>| ניהול תלמידים</button></Link>
                <Link to="/ExampleExam"> <button>|ExampleExam</button></Link>
                <Link to="/Decoding"> <button>|Decoding</button></Link>
                <Link to="/GetStarted"> <button>|GetStarted</button></Link>
            </>}
        </nav>
    );
});

export default NavBar;

