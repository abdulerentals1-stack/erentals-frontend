// /services/category.js

import api from "@/lib/axios";

// ✅ Get all categories
export const getAllCategories = () => api.get("/categories");

// ✅ Get single category by slug
export const getCategoryBySlug = (slug) => api.get(`/categories/${slug}`);

// ➕ Create category
export const createCategory = (data) => api.post("/categories", data);

// ✏️ Update category
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);

// ❌ Delete category
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
