// /services/orderService.js
import api from "@/lib/axios"; // your pre-configured axios instance (with baseURL + withCredentials)

export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`); // ✅ CORRECT
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data;
};



export const adminUpdateOrder = async (orderId, payload) => {
  // payload = { items: [...], transportationCharge }
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


export const createRemainingPayment = async (orderId) => {
  const res = await api.post(`/payments/create-remaining-payment/${orderId}`);
  return res.data;
};
