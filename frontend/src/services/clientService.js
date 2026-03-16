// services/clientService.js
import api, { authHeader } from '@/api/api';

export const clientService = {
  getAll: async () => {
    try {
      const response = await api.get('/client', { headers: authHeader() });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};