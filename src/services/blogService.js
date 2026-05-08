import api from "@/lib/axios";

/* ===============================
   📰 BLOG SERVICE
   =============================== */

/* ---------- 🧑‍💼 ADMIN SIDE ---------- */

// 👉 Get all blogs (Admin — includes inactive blogs)
export const getAllBlogsAdmin = () => api.get("/blogs/admin/all");

// 👉 Get a single blog by ID (Admin)
export const getBlogById = (id) => api.get(`/blogs/admin/${id}`);

// 👉 Add a new blog
export const createBlog = (data) => api.post("/blogs", data);

// 👉 Update blog by ID (Admin)
export const updateBlog = (id, data) => api.put(`/blogs/admin/${id}`, data);

// 👉 Delete a blog
export const deleteBlog = (id) => api.delete(`/blogs/admin/${id}`);

// 👉 Toggle blog active/inactive
export const toggleBlogStatus = (id) => api.patch(`/blogs/admin/${id}/toggle`);


/* ---------- 🌐 PUBLIC SIDE ---------- */

// 👉 Get all active blogs with pagination (User)
export const getPublicBlogs = (page = 1, limit = 10) =>
  api.get(`/blogs?page=${page}&limit=${limit}`);

// 👉 Get single active blog by slug
export const getPublicBlogBySlug = (slug) =>
  api.get(`/blogs/${slug}`);

// 🚀 ISR Fetch for Server Components
export const fetchPublicBlogsISR = async (page = 1, limit = 10) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { data: { blogs: [] } };
    const data = await res.json();
    return { data };
  } catch (err) {
    return { data: { blogs: [] } };
  }
};
