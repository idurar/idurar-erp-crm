// services/paymentService.js
import api, { authHeader } from '@/api/api';

export const paymentService = {
  create: async (paymentData) => {
    try {
      const response = await api.post('/payment', paymentData, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload', formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    const response = await api.get('/payment', { headers: authHeader() });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/payment/${id}`, { headers: authHeader() });
    return response.data;
  },
};