import api from "@/lib/axios";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/signup", data);
export const resendVerification = (data) => api.post("/auth/resend-verification", data);
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);
export const refreshToken = () => api.get("/auth/refresh-token");
export const logoutUser = () => api.post("/auth/logout");
