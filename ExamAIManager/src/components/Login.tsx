
import { useState } from 'react';
import { Alert } from '@mui/material';
import GoogleLoginButton from './Sign With Google/GoogleLoginButton';
import { Modal } from 'antd';
import { motion } from 'framer-motion';
import "../stylies/LoginModal.css"
import { authService } from '../services/AuthService';
import { observer } from 'mobx-react';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (email: string, messageType: string, message: string) => void; // ✅ הוספנו פרופס
}

const LoginModal = observer(({ isOpen, onClose, onSuccessLogin }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(128, 90, 213, 0.3)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessageType("error");
      setMessage("Please fill in all fields");
      return;
    }

    const result = await authService.login(email, password);
    onSuccessLogin(email, result.success ? "success" : "error", result.message);
    onClose();
  };

  return (
    <Modal
      title="Sign In to ExamAI"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className="login-modal"
    >
      <div className="login-form">
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <motion.button
          className="login-btn"
          onClick={handleLogin}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Login
        </motion.button>
        {message && (
          <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ marginTop: 2 }}>
            {message}
          </Alert>)}

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login-container">
          <GoogleLoginButton />

        </div>
      </div>
    </Modal>
  );
});

export default LoginModal;


