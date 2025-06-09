import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaChevronDown, FaSignInAlt } from 'react-icons/fa';
//  import '../styles/UserProfileMenuProps .css';
import "../stylies/UserProfileMenu.css"
import { authService } from '../services/AuthService';
import { notification } from 'antd';
import LoginModal from './Login';
interface UserProfileMenuProps {
    onSignOut: () => void;
    onProfileClick: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
    onSignOut,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState("אנונימי");
    const [userEmail, setUserEmail] = useState("student@example.com");
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    //////////////////////
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [, setUserInfo] = useState({
        name: 'Anonymous',
        email: 'teacher@example.com',
        avatar: undefined
    });
    useEffect(() => {
        try {
            const profileStr = localStorage.getItem("profile");
            if (profileStr) {
                const profile = JSON.parse(profileStr);
                setUserName(profile.name || "Anonymous");
                setUserEmail(profile.email || "student@example.com");
                setUserAvatar(profile.picture || null);
            }
        } catch (err) {
            console.error("שגיאה בקריאת נתוני פרופיל:", err);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSignOut = () => {
        setIsOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        onSignOut();
    };

    const showLoginModal = () => {
        setIsOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleLoginCancel = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className="user-profile-menu" ref={menuRef}>
            {/* Profile Button */}
            {contextHolder}
            <motion.button
                className="profile-button"
                onClick={toggleMenu}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="profile-avatar">
                    {userAvatar ? (
                        <img src={userAvatar} alt="Profile" className="avatar-image" />
                    ) : (
                        <div className="avatar-placeholder">
                            {authService.isLogin ? userName[0] : <FaUser />}
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <span className="user-name">{userName}</span>
                    <span className="user-role">Teacher</span>
                </div>
                <motion.div
                    className="chevron-icon"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaChevronDown />
                </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="user-info-section">
                            <div className="user-avatar-large">
                                {userAvatar ? (
                                    <img src={userAvatar} alt="Profile" className="avatar-image-large" />
                                ) : (
                                    <div className="avatar-placeholder-large">
                                        <FaUser />
                                    </div>
                                )}
                            </div>
                            <div className="user-details">
                                <h3 className="user-name-large">{userName}</h3>
                                <p className="user-email">{userEmail}</p>
                            </div>
                        </div>

                        <div className="menu-items">
                            <motion.button
                                className="menu-item sign-out"
                                onClick={handleSignOut}
                                whileHover={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaSignOutAlt className="menu-icon" />
                                <span>Sign Out</span>
                            </motion.button>
                            <motion.button
                                className="menu-item sign-in"
                                onClick={showLoginModal}
                                whileHover={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaSignInAlt className="menu-icon" />
                                <span>Sign In</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {isLoginModalOpen && (
                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={handleLoginCancel}
                    onSuccessLogin={(email, messageType, message) => {
                        setIsLoginModalOpen(false);
                        if (messageType === 'success') {
                            // setIsLoggedIn(true);
                            authService.setLoginStatus(true)
                            setUserInfo({
                                name: 'משתמש',
                                email: email,
                                avatar: undefined
                            });

                            api.success({
                                message: "!You have successfully connected",
                                description: `!Welcome to the system, ${email}`,
                                placement: 'topRight',
                                className: 'rtl-notification',
                            })
                        }
                        else {
                            api.error({
                                message: '!Login failed',
                                description: message,
                                placement: 'topRight',
                                className: 'rtl-notification',
                            });
                        }
                    }}
                />
            )}
        </div>

    );
};

export default UserProfileMenu;
