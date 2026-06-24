// /services/orderService.js
import api from "@/lib/axios"; // pre-configured axios instance (with baseURL + withCredentials)

export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const getAllOrders = async (params = {}) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

export const updateOrderStatus = async (orderId, status, reason = "") => {
  const res = await api.put(`/orders/${orderId}/status`, { status, reason });
  return res.data;
};

export const adminUpdateOrder = async (orderId, payload) => {
  const res = await api.put(`/orders/${orderId}`, payload);
  return res.data;
};

export const generateInvoice = async (orderId) => {
  const res = await api.post(`/orders/generate-invoice/${orderId}`);
  return res.data;
};

export const fetchOrdersByStatus = async (status = "placed") => {
  const res = await api.get(`/orders?status=${status}`);
  return res.data.orders;
};

export const createRemainingPayment = async ({ orderId }) => {
  const res = await api.post("/payments/create-remaining-payment", { orderId });
  return res.data;
};

export const verifyRemainingPayment = (payload) =>
  api.post('/checkout/verify-remaining-payment', payload);

// Audit & Transaction retrieval APIs (Admin Panel)
export const getOrderAuditLog = async (orderId) => {
  const res = await api.get(`/audit/order/${orderId}`);
  return res.data;
};

export const getOrderTransactions = async (orderId) => {
  const res = await api.get(`/transactions/order/${orderId}`);
  return res.data;
};
