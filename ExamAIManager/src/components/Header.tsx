import { notification } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { FaRegLightbulb, FaTachometerAlt, FaChartBar, FaClipboardCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoginModal from './Login';
import { authService } from '../services/AuthService';
import { observer } from 'mobx-react';
// import { AuthService } from '../services/AuthService';

const Header = observer(() => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [scrolled, ] = useState(false);
    const navigate = useNavigate()
    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0px 8px 15px rgba(128, 224, 213, 0.4)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.95 }
    };

    const showLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const handleLoginCancel = () => {
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        authService.setLoginStatus(false); // התנתקות
        localStorage.removeItem('token')
        console.log(authService.isLogin);
    };
    return (
        <>
            {contextHolder}
            <motion.div
                className={`nav-container ${scrolled ? 'scrolled' : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                <div className="logo-container">
                    <div className="logo-glow"></div>
                    <motion.div
                        className="logo"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaRegLightbulb className="logo-icon" />
                        ExamAI
                    </motion.div>
                </div>
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="main-nav"
                >
                    <ul>
                        <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }} onClick={() => navigate('/')}>
                            <FaHome className="nav-icon" />
                            Home
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }} onClick={() => navigate('/dashboard')}>
                            <FaTachometerAlt className="nav-icon" />
                            Dashboard
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }} onClick={() => navigate('/statistics')}>
                            <FaChartBar className="nav-icon" />
                            Statistics
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }} onClick={() => { navigate('/tests') }} >
                            <FaClipboardCheck className="nav-icon" />
                            Tests
                        </motion.li>
                    </ul>
                </motion.nav>

                {authService.isLogin ?
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="auth-buttons">
                        <motion.button
                            className="sign-in-btn"
                            onClick={handleLogout}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap">
                            Sign Out
                        </motion.button>
                    </motion.div>
                    :
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="auth-buttons">
                        <motion.button
                            className="sign-in-btn"
                            onClick={showLoginModal}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap" >
                            Sign In
                        </motion.button>
                    </motion.div>

                }

            </motion.div>
            {isLoginModalOpen && (
                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={handleLoginCancel}
                    onSuccessLogin={(email, messageType, message) => {
                        setIsLoginModalOpen(false);
                        messageType === 'success' ?
                            api.success({
                                message: "!You have successfully connected",
                                description: `!Welcome to the system, ${email}`,
                                // description: 'ברוך הבא למערכת! ',
                                placement: 'topRight',
                                className: 'rtl-notification',
                            })
                            : api.error({
                                message: '!Login failed',
                                description: message,
                                placement: 'topRight',
                                className: 'rtl-notification',
                            });
                    }}
                />
            )}
        </>)
})


export default Header