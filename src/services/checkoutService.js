import api from "@/lib/axios";

export const placeOrder = (payload) => api.post('/checkout', payload);
