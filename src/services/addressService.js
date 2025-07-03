// services/addressService.js
import api from "@/lib/axios";

export const getUserAddresses = () => api.get("/addresses");
export const addAddress = (data) => api.post("/addresses", data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
