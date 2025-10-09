// services/paymentModeService.js
import api, { authHeader } from '@/api/api';

export const paymentModeService = {
  getAll: async () => {
    try {
      const response = await api.get('/paymentmode', { headers: authHeader() });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};