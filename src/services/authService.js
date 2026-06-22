import api from "@/lib/axios";

export const logoutUser = () => api.post("/auth/logout", {}, {
  withCredentials: true,
});

export const refreshToken = () => api.get("/auth/refresh-token", {
  withCredentials: true,
});

// ⚠️ DEPRECATED: The functions below call backend endpoints that DO NOT EXIST.
// They are leftover from an older email/password auth system.
// The pages that import them (/forgot, /reset-password, /verify, /resend-email)
// are also dead code and should be removed in a future cleanup.
/** @deprecated No matching backend route */
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
/** @deprecated No matching backend route */
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);
/** @deprecated No matching backend route */
export const resendVerification = (data) => api.post("/auth/resend-verification", data);
/** @deprecated No matching backend route */
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
