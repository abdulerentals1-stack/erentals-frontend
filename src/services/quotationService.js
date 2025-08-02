// services/quotationService.js
import api from '@/lib/axios';

// 📝 Submit Quotation Request from Cart
export const submitQuotationRequest = async (payload) => {
  const { data } = await api.post('/quotation/request', payload);
  return data;
};
