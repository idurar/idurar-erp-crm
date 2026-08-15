import { createApiClient, createSocket } from "@aman-school/api-client";
import { API_BASE_URL, SOCKET_URL } from "./config";
import { useAuthStore } from "./auth-store";

export const api = createApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => {
    useAuthStore.getState().clear();
  },
});

export function connectSocket() {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;
  return createSocket(SOCKET_URL, token);
}
