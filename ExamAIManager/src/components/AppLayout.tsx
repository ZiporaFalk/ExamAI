import { Outlet } from "react-router"
import Footer from "./Footer"
import Header from "./Header"
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { authService } from "../services/AuthService";

const AppLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    useEffect(() => {
        console.log(isHome);
        
        if (localStorage.getItem('token'))
            authService.setLoginStatus(true)
    }, [])

    return (
        <>
            {!isHome && (
                <div style={{ width: "100%", height: "100px" }}></div>
            )}
            <Header />
            <div >
                { isHome || authService.isLogin ? <Outlet /> : <>אתה צריך להתחבר!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</>}
            </div>
            <Footer />
        </>)
}

export default AppLayout



