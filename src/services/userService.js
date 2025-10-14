// /services/userService.js
import api from "@/lib/axios";

/* ===============================
   👤 USER SIDE API
   =============================== */

// 👉 Get current user profile
export const getUserProfile = () => api.get("/users/me");

// 👉 Update current user profile
export const updateUserProfile = (data) => api.put("/users/me", data);


/* ===============================
   🛠️ ADMIN SIDE API
   =============================== */

// 👉 Get all users (Admin only)
export const getAllUsers = () => api.get("/users");

// 👉 Get single user by ID (Admin)
export const getUserById = (id) => api.get(`/users/${id}`);

// 👉 Update user by ID (Admin)
export const updateUserByAdmin = (id, data) => api.put(`/users/${id}`, data);

