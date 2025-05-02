import { Outlet } from "react-router"
// import NavBar from "./NavBar"
import NavBar from "./NavBar"


const AppLayuot = () => {

    return (<>
        <header>
            <NavBar></NavBar>
        </header>
        <div >
            <Outlet />
        </div>
    </>)
}

export default AppLayuot


