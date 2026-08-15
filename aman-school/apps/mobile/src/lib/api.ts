import { createApiClient, createSocket } from "@aman-school/api-client";
import { API_BASE_URL, SOCKET_URL } from "./config";
import { useSessionStore } from "../store/session";

export const api = createApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => useSessionStore.getState().accessToken,
  onUnauthorized: () => {
    // If this 401 came from an expired impersonation token, fall back to the
    // owner's own session instead of signing them out entirely.
    if (useSessionStore.getState().impersonationBackup) {
      useSessionStore.getState().endImpersonation();
      return;
    }
    useSessionStore.getState().clear();
  },
});

export function connectSocket() {
  const token = useSessionStore.getState().accessToken;
  if (!token) return null;
  return createSocket(SOCKET_URL, token);
}
