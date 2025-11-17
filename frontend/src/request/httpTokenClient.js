import axios from "axios";
import { API_BASE_URL } from "@/config/serverApiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

let refreshing = false;

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !refreshing) {
      refreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      const res = await axios.post(`${API_BASE_URL}refresh-token`, { refreshToken });
      
      localStorage.setItem("accessToken", res.data.accessToken);
      original.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
      refreshing = false;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
