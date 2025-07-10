import api from "@/lib/axios";

export const placeOrder = (payload) => api.post('/checkout', payload);


export const createAdvancePayment = (payload) =>
  api.post('/checkout/create-advance-payment', payload);

// 👇 After Razorpay payment success (frontend calls this to place order)
export const verifyRazorpayPayment = (payload) =>
  api.post('/checkout/verify-razorpay-payment', payload);
