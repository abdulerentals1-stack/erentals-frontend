import api from "@/lib/axios";

// New enterprise checkout API calls
export const initiateCheckout = (payload) => api.post('/checkout/initiate', payload);
export const verifyPayment = (payload) => api.post('/checkout/verify-payment', payload);
export const reportPaymentFailure = (payload) => api.post('/checkout/payment-failed', payload);
export const retryPayment = (payload) => api.post('/checkout/retry-payment', payload);
export const verifyRemainingPayment = (payload) => api.post('/checkout/verify-remaining-payment', payload);

// Backward compatibility mappings
export const placeOrder = (payload) => api.post('/checkout/initiate', payload);
export const createAdvancePayment = (payload) => api.post('/checkout/initiate', payload);
export const verifyRazorpayPayment = (payload) => api.post('/checkout/verify-payment', payload);
