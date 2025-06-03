
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
  const [messageType, setMessageType] = useState('success'); // success or error
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
      // setMessage("אנא מלא את כל השדות");
      setMessage("Please fill in all fields");
      return;
    }

    const result = await authService.login(email, password);
    onSuccessLogin(email, result.success ? "success" : "error", result.message);
    onClose();

    // try {
    //   const response = await axios.post(`${apiUrl}/Auth/login`, {
    //     email,
    //     password,
    //   });
    //   if (response.status === 200) {
    //     authService.setLoginStatus(true);
    //     localStorage.setItem('token', response.data.token)
    //     // onSuccessLogin(email, "success", "התחברת בהצלחה!"); 
    //     onSuccessLogin(email, "success", "Login successful");
    //     onClose();
    //   }
    // } catch (error: any) {
    //   if (error.response) {
    //     // onSuccessLogin(email, "error", error.response.data || "ההתחברות נכשלה"); 
    //     onSuccessLogin(email, "error", error.response.data || "Connection failed");
    //     onClose();
    //   } else {
    //     // onSuccessLogin(email, "error", "הייתה שגיאה בתקשורת"); 
    //     onSuccessLogin(email, "error", "Communication error");
    //     onClose();
    //     console.log("שגיאה!");
    //   }
    // }
  };
  // const responseGoogle = (response: any) => {
  //   console.log("Google login response:", response);
  //   onClose();
  // };
  return (
    // הקודם שלי
    // <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, boxShadow: 3, borderRadius: 2 }}>
    //   <Typography variant="h5" gutterBottom align="center">
    //     התחבר לחשבון שלך
    //   </Typography>
    //   <TextField label="מייל" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
    //   <TextField label="סיסמה" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
    //   <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: 2 }}>התחבר</Button>
    //   {message && (
    //     <Alert severity={messageType === 'success' ? 'success' : 'error'} sx={{ marginTop: 2 }}>
    //       {message}
    //     </Alert>
    //   )}
    //   <GoogleLoginButton />
    // </Box>
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
          {/* <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => console.log('Google Login Failed')}
          /> */}
          <GoogleLoginButton />

        </div>
      </div>
    </Modal>
  );
});

export default LoginModal;


