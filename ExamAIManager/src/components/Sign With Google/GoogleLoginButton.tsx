import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
const apiUrl = 'https://localhost:7083/api';

const GoogleLoginButton = () => {
  const handleLogin = async (credentialResponse: any) => {
    // console.log("window.location.href:+replace", window.location.href.replace(/\/$/, ""));  // כאן, אם יש סלאש בסוף - יוסר
    // const origin = window.location.origin.replace(/\/$/, "");  // אם יש סלאש בסוף, הוא יוסר
    // const o=window.location.href.replace(/\/$/, "")
    // console.log("window.location.href:+replace", window.location.href.replace(/\/$/, ""));  // כאן, אם יש סלאש בסוף - יוסר
    const tokenId = credentialResponse.credential;
    console.log("window.origin:", window.origin);
    console.log("window.location.origin:" + window.location.origin);
    console.log("window.location.href:", window.location.href);  // כאן, אם יש סלאש בסוף - יוסר
    try {
      const response = await axios.post(`${apiUrl}/auth/google`, {
        token: tokenId,
      });

      const jwt = response.data.token;
      localStorage.setItem('jwt', jwt);

      alert("התחברת בהצלחה!");
      window.location.href = "/";
    } catch (error) {
      console.error("Login with Google failed", error);
      alert("ההתחברות נכשלה");
    }
  };

  return (
    <div>
      <h3>התחברות עם Google</h3>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Google login error")}
      />
    </div>
  );
};

export default GoogleLoginButton;
