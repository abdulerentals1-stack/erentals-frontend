import api from "@/lib/axios";

// -----------------------------
// OTP-Based Auth Services
// -----------------------------

// Signup: Request OTP
export const requestSignupOtp = (data) =>
  api.post("/auth/signup/request-otp", data, { withCredentials: true });

// Signup: Verify OTP
export const verifySignupOtp = (data) =>
  api.post("/auth/signup/verify-otp", data, { withCredentials: true });

// Login: Request OTP
export const requestLoginOtp = (data) =>
  api.post("/auth/login/request-otp", data, { withCredentials: true });

// Login: Verify OTP
export const verifyLoginOtp = (data) =>
  api.post("/auth/login/verify-otp", data, { withCredentials: true });

// Resend OTP
export const resendOTP = (data) =>
  api.post("/auth/resend-otp", data, { withCredentials: true });

// Logout
export const logoutUser = () =>
  api.post("/auth/logout", {}, { withCredentials: true });

// Refresh access token
export const refreshToken = () =>
  api.get("/auth/refresh-token", { withCredentials: true });

// -----------------------------
// Optional Email Verification Services
// export const resendVerification = (data) => api.post("/auth/resend-verification", data);
// export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
