import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'https://localhost:7083/api',
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: import.meta.env.VITE_API_URL
});
console.log("env:", import.meta.env);
console.log("Base URL:", import.meta.env.VITE_API_URL);

// Interceptor לפני שליחת הבקשה (כמו Angular interceptor)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor לתשובה מהשרת (error handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirecting to login");
      // אפשר כאן להפנות ל־login או להפעיל logout
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
