import api from "@/lib/axios";

export const getAllTransactions = async (params = {}) => {
  const res = await api.get("/transactions", { params });
  return res.data;
};

export const getTransactionByPaymentId = async (paymentId) => {
  const res = await api.get(`/transactions/payment/${paymentId}`);
  return res.data;
};

export const getAllAuditLogs = async (params = {}) => {
  const res = await api.get("/audit", { params });
  return res.data;
};
