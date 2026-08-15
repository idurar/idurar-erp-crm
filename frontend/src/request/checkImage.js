import api from '@/request/httpTokenClient';

export default async function checkImage(path) {
  try {
    const response = await api.get(path);
    return response?.status === 200;
  } catch {
    return false;
  }
}
