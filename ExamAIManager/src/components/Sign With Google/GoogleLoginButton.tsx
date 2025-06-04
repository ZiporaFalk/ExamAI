import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../services/AuthService';
// import { useState } from 'react';
// import MyAlert from '../My-Alert';
// import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  // const [islogin, setIsLogin] = useState(false)
  // const [message, setMessage] = useState("")
  // const [typeMessage, setTypeMessage] = useState<'success' | 'error'>()
  // const navigate = useNavigate()
  const handleLogin = async (credentialResponse: any) => {
    const tokenId = credentialResponse.credential;
    console.log("window.origin:", window.origin);
    console.log("window.location.origin:" + window.location.origin);
    console.log("window.location.href:", window.location.href);
    try {
      const response = await axiosInstance.post(`/auth/google`, {
        token: tokenId,
      });
      const token = response.data.token;

      const decoded: any = jwtDecode(token);
      const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log(token);

      if (role === "Admin") {
        localStorage.setItem("token", token);
        authService.setLoginStatus(true);
        window.location.href = "/";
        alert("התחברת בהצלחה!");
        // setIsLogin(true)
        // setMessage("Login successful With Google")
        // setTypeMessage('success')
      } else {
        // setMessage("Unauthorized: Admin access required.")
        // setTypeMessage('error')
      }

    } catch (error) {
      console.error("Login with Google failed", error);
      // setTypeMessage('error')
      // setMessage("Login with Google failed.")
    }
  };

  return (
    <div>
      <br></br>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Google login error")}
      />

      {/* {islogin &&

        <MyAlert message={message} type={typeMessage!} onClose={() => navigate('/')} duration={3000} isVisible={true}/>} */}
    </div>
  );
};

export default GoogleLoginButton;
