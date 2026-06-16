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
export const getTagById = (slug) => api.get(`/tags/${slug}`);

// 🚀 ISR Fetch for Server Components
export const fetchTagsISR = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
      next: { revalidate: 3600 }, // Revalidate tags every hour
    });
    if (!res.ok) return { data: { tags: [] } };
    const data = await res.json();
    return { data };
  } catch (err) {
    console.error("fetchTagsISR failed:", err);
    return { data: { tags: [] } };
  }
};
