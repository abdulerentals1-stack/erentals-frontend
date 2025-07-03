// /services/image.js
import api from "@/lib/axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload", formData);
  return res.data; // { imageUrl }
};

export const deleteImage = async (public_id) => {
  const res = await api.delete("/upload/delete", {
    data: { public_id },
  });
  return res.data;
};
