// const apiUrl = 'https://localhost:7083/api';

import { makeAutoObservable } from "mobx";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from 'jwt-decode';

class AuthService {
    isLogin = false;

    constructor() {
        makeAutoObservable(this);
    }

    setLoginStatus(status: boolean) {
        this.isLogin = status;
    }

    async login(email: string, password: string) {
        try {
            const response = await axiosInstance.post(`/Auth/login`, {
                email,
                password,
            });
            if (response.status === 200) {
                const token = response.data.token
                const decoded: any = jwtDecode(token);
                const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                if (role === "Admin") {
                    localStorage.setItem("token", token);
                    this.setLoginStatus(true);
                    return { success: true, message: "Login successful" };
                } else {
                    return { success: false, error: "Unauthorized: Admin access required." };
                }
            }
            return { success: false, message: "Unexpected response from server" };
        } catch (error: any) {
            if (error.response) {
                return { success: false, message: error.response.data || "Connection failed" };
            }
            return { success: false, message: "Communication error" };

        }

    }
}
export const authService = new AuthService()

