import api from "@/lib/axios";
import qs from "query-string";

// ✅ Create, Update, Delete
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ✅ Pricing Logic
export const calculatePrice = (data) => api.post("/products/calculate-price", data);

// ✅ Basic Gets
export const getAllProducts = () => api.get("/products");
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);

// ✅ Get Flagged Products (like hotdeal / featured)
export const getFlaggedProducts = (type) => api.get(`/products/flagged?type=${type}`);

// ✅ ✅ ✅ Search + Filtered Products (Pagination, Filters, etc.)
export const getFilteredProducts = async (params) => {
  const query = qs.stringify(params);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { data: { products: [], total: 0 } };
  }

  return res.json();
};


export const getAllFilteredProducts = async (params) => {
  const query = qs.stringify(params);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/all?${query}`, {
    cache: "no-store", // SSR: always fresh
  });

  if (!res.ok) {
    return { data: { products: [], total: 0 } };
  }

  return res.json();
};