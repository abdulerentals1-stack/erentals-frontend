import api from "@/lib/axios";

// ✅ Add Product
export const createProduct = (data) => api.post("/products", data);
export const calculatePrice = (data) => api.post("/products/calculate-price", data);

// ✅ (Optional - for later)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getAllProducts = () => api.get("/products");
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);



export const getFlaggedProducts = (type) => api.get(`/products/flagged?type=${type}`);

