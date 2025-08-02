import api from '@/lib/axios';

// ➕ Add or Update Quotation Cart Item
export const addOrUpdateQuotationCartItem = async (payload) => {
  const { data } = await api.post('/quotation-cart', payload);
  return data;
};

// 📦 Get Current User's Quotation Cart
export const getQuotationCart = async () => {
  const { data } = await api.get('/quotation-cart');
  return data;
};

// ❌ Remove Item from Quotation Cart
export const removeQuotationCartItem = async (itemId) => {
  const { data } = await api.delete(`/quotation-cart/item/${itemId}`);
  return data;
};

// 🎟️ Apply Coupon to Quotation Cart
export const applyQuotationCoupon = (code) => api.post('/quotation-cart/apply-coupon', { code });

// 🗑️ Remove Coupon from Quotation Cart
export const removeQuotationCoupon = () => api.post('/quotation-cart/remove-coupon');
