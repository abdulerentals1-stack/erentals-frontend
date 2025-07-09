import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenManager";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 🔥 Required for sending cookies (refreshToken)
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // Token stored in memory
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor with Auto-Refresh Logic
api.interceptors.response.use(
  (response) => response, // On success, just return
  async (error) => {
    const originalRequest = error.config;

    // 🔁 Auto-refresh logic only if 401 and not retried before
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            withCredentials: true, // Send cookies with request
          }
        );

        const newToken = res?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // 🔁 Retry original
        }
      } catch (refreshErr) {
        // Optional: Clear token & redirect to login
        setAccessToken(null);
        // window.location.href = "/login"; // uncomment if you want auto-redirect
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error); // fallback
  }
);

export default api;
