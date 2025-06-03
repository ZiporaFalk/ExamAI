// const apiUrl = 'https://localhost:7083/api';

import { makeAutoObservable } from "mobx";
import axiosInstance from "../utils/axiosInstance";

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
            console.log()
            const response = await axiosInstance.post(`/Auth/login`, {
                email,
                password,
            });
            if (response.status === 200) {
                console.log("pppppppppppppppppppppppppp");
                
                localStorage.setItem('token', response.data.token)
                this.setLoginStatus(true);
                return { success: true, message: "Login successful" };
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

