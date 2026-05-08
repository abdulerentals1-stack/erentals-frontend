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

// 🚀 ISR Fetch for Server Components (Cached for Performance)
export const fetchBannersISR = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { data: { banners: [] } };
    const data = await res.json();
    return { data };
  } catch (err) {
    return { data: { banners: [] } };
  }
};
