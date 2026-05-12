import api from "@/lib/axios";

/* ===============================
   🛠️ EVENT SERVICES API SERVICE
   =============================== */

/* ---------- 🧑‍💼 ADMIN SIDE ---------- */

// 👉 Get all services (Admin — includes inactive services)
export const getAllServicesAdmin = () => api.get("/services/admin/all");

// 👉 Get a single service by ID (Admin)
export const getServiceById = (id) => api.get(`/services/admin/${id}`);

// 👉 Add a new service
export const createService = (data) => api.post("/services", data);

// 👉 Update service by ID (Admin)
export const updateService = (id, data) => api.put(`/services/admin/${id}`, data);

// 👉 Delete a service
export const deleteService = (id) => api.delete(`/services/admin/${id}`);

// 👉 Toggle service active/inactive
export const toggleServiceStatus = (id) => api.patch(`/services/admin/${id}/toggle`);


/* ---------- 🌐 PUBLIC SIDE ---------- */

// 👉 Get all active services with pagination (User)
export const getPublicServices = (page = 1, limit = 10) =>
  api.get(`/services?page=${page}&limit=${limit}`);

// 👉 Get single active service by slug
export const getPublicServiceBySlug = async (slug) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`, {
      next: { revalidate: 3600 }, // ✅ Cache for 1 hour on server
    });
    if (!res.ok) throw new Error(`Failed to fetch service slug: ${slug}`);
    const data = await res.json();
    return { data }; // ✅ Shape to match Axios res.data
  } catch (err) {
    console.error("Failed to fetch public service by slug ISR:", err);
    throw err;
  }
};

// 🚀 ISR Fetch for Server Components
export const fetchPublicServicesISR = async (page = 1, limit = 10) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { data: { services: [] } };
    const data = await res.json();
    return { data };
  } catch (err) {
    return { data: { services: [] } };
  }
};
