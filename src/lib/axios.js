import axios from 'axios';
import { getAccessToken, setAccessToken } from './tokenManager'; // token stored temporarily

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = getAccessToken(); // from memory
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (auto-refresh if 401)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            withCredentials: true,
            });
        const newToken = res.data.accessToken;
        setAccessToken(newToken); // store in memory
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // retry original
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
