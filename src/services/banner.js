import api from "@/lib/axios";

// ➕ Create
export const createBanner = (data) => api.post("/banners", data);

// ✏️ Update
export const updateBanner = (id, data) => api.put(`/banners/${id}`, data);

// ❌ Delete
export const deleteBanner = (id) => api.delete(`/banners/${id}`);

// 📃 Get all
export const getAllBanners = () => api.get("/banners");

// 🔍 Get single
export const getBannerById = (id) => api.get(`/banners/${id}`);
