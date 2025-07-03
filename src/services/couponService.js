import api from "@/lib/axios";

export const createCoupon = (data) => api.post('/coupons', data);
export const getAllCoupons = () => api.get('/coupons');
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);
export const applyCoupon = (data) => api.post('/coupons/apply-coupon', data);
