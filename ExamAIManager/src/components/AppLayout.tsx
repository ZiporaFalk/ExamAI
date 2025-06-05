import { Outlet } from "react-router"
import Footer from "./Footer"
import Header from "./Header"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/AuthService";

const AppLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            authService.setLoginStatus(true);
            setIsLoggedIn(true);
        }
        ///
        if (!token && !isHome) {
            console.log("navigating")
            navigate("/", { state: { showLoginMessage: true } });
        }
//},[]
    }, [location.pathname]); // <-- חשוב!

    return (
        <>
            {!isHome && (
                <div style={{ width: "100%", height: "100px" }}></div>
            )}
            <Header />
            <div >
                {isHome || isLoggedIn ? <Outlet /> : <>אתה צריך להתחבר!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</>}
            </div>
            <Footer />
        </>)
}

export default AppLayout



