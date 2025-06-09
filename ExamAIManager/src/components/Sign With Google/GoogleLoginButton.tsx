import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../services/AuthService';
import { notification } from 'antd';

interface GoogleJwtPayload {
  id: number;
  name: string;
  email: string;
  picture: string;
}
const GoogleLoginButton = () => {

  const [api, contextHolder] = notification.useNotification();
  const handleLogin = async (credentialResponse: any) => {
    const tokenId = credentialResponse.credential;
    console.log("window.origin:", window.origin);
    console.log("window.location.origin:" + window.location.origin);
    console.log("window.location.href:", window.location.href);
    const decodedToken: GoogleJwtPayload = jwtDecode(tokenId);
    console.log(decodedToken);

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
        const profile = {
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture
        }
        localStorage.setItem("profile", JSON.stringify(profile));
        // window.location.href = "/";

        api.success({
          message: 'Sign With Google success',
          description: `!Welcome to the system, ${decodedToken.name}`,
          placement: 'topRight',
          className: 'rtl-notification',
        });
      } else {
        api.error({
          message: 'Sign With Google faild',
          description: 'Check with your administrator if you are allowed to connect.',
          placement: 'topRight',
          className: 'rtl-notification',
        });
      }

    } catch (error) {
      console.error("Login with Google failed", error);
    }

  };

  return (
    <div>
      {contextHolder}
      <br></br>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Google login error")}
      />

    </div>
  );
};

export default GoogleLoginButton;
