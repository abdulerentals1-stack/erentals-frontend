import api from "@/lib/axios";

// 💡 Use custom config only where needed
export const loginUser = (data) => api.post("/auth/login", data, {
  withCredentials: true, // 🔥 CRUCIAL for setting refresh token
});

export const logoutUser = () => api.post("/auth/logout", {}, {
  withCredentials: true, // 🔥 CRUCIAL for clearing refresh token
});

export const registerUser = (data) => api.post("/auth/signup", data);

export const resendVerification = (data) => api.post("/auth/resend-verification", data);

export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);

export const refreshToken = () => api.get("/auth/refresh-token", {
  withCredentials: true, // 🔥 CRUCIAL for sending cookie to get new access token
});
