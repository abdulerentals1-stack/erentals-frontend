// services/publicService.js
import api from "@/lib/axios";

// 📩 Send Enquiry
export const sendProductEnquiry = (data) => api.post("/enquiry", data);

// 📞 Send Contact
export const sendContactMessage = (data) => api.post("/enquiry", data);
