import api from '@/lib/axios';

// ➕ Add or Update Cart Item
export const addOrUpdateCartItem = async (payload) => {

  const { data } = await api.post('/cart', payload);
  return data;
};

// 📦 Get Current User's Cart
export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

// ❌ Remove Item from Cart
export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/item/${productId}`);
  return data;
};

// 🎟️ Apply Coupon
export const applyCoupon = (code) => api.post('/cart/apply-coupon', { code });


// 🗑️ Remove Coupon
export const removeCoupon = () => api.post('/cart/remove-coupon');
