// services/invoiceService.js
import api, { authHeader } from '@/api/api';

export const invoiceService = {
  getAll: async () => {
    try {
      const response = await api.get('/invoice', { headers: authHeader() });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};