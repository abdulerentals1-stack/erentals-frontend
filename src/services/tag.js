// services/tag.js
import api from "@/lib/axios";

// ➕ Create Tag
export const createTag = (data) => api.post("/tags", data);

// ✏️ Update Tag
export const updateTag = (id, data) => api.put(`/tags/${id}`, data);

// ❌ Delete Tag
export const deleteTag = (id) => api.delete(`/tags/${id}`);

// 📃 Get All Tags
export const getAllTags = () => api.get("/tags");

// 🔍 Get Single Tag (optional - if needed later)
export const getTagById = (id) => api.get(`/tags/${id}`);
