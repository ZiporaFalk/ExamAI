import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../utils/axiosInstance';

const GoogleLoginButton = () => {
  const handleLogin = async (credentialResponse: any) => {
    const tokenId = credentialResponse.credential;
    console.log("window.origin:", window.origin);
    console.log("window.location.origin:" + window.location.origin);
    console.log("window.location.href:", window.location.href);
    try {
      const response = await axiosInstance.post(`/auth/google`, {
        token: tokenId,
      });
      const jwt = response.data.token;
      localStorage.setItem('token', jwt);
      console.log(jwt);
      alert("התחברת בהצלחה!");
      window.location.href = "/";
    } catch (error) {
      console.error("Login with Google failed", error);
      alert("ההתחברות נכשלה");
    }
  };

  return (
    <div>
      <br></br>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Google login error")}
      />
    </div>
  );
};

export default GoogleLoginButton;
