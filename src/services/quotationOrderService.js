import api from "@/lib/axios"; // your axios instance with baseURL + credentials

// 🔒 User: Get all their quotations
export const getMyQuotations = async () => {
  const res = await api.get("/quotation-order/my-quotations");
  return res.data;
};

// 🔒 User: Get single quotation by ID
export const getQuotationById = async (quotationId) => {
  const res = await api.get(`/quotation-order/${quotationId}`);
  return res.data;
};

// 🔒 Admin: Get all quotations (with optional status filter)
export const getAllQuotations = async (status = "pending") => {
  const res = await api.get(`/quotation-order?status=${status}`);
  return res.data;
};

// 🔒 Admin: Update quotation details (items, charges etc.)
export const adminUpdateQuotation = async (quotationId, payload) => {
  const res = await api.put(`/quotation-order/${quotationId}`, payload);
  return res.data;
};

// 🔒 Admin: Generate invoice for quotation
export const generateQuotationInvoice = async (quotationId) => {
  const res = await api.post(`/quotation-order/generate-invoice/${quotationId}`);
  return res.data;
};

// 🔒 Admin/User: Update quotation status (responded/cancelled)
export const updateQuotationStatus = async (quotationId, status) => {
  const res = await api.put(`/quotation-order/${quotationId}/status`, { status });
  return res.data;
};
