/** Backend base URL — override via NEXT_PUBLIC_API_URL at build time for a
 * different environment (staging/local). Defaults to the production backend
 * so a bare `next build && next start` works out of the box. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-production-c37ef.up.railway.app";
export const SOCKET_URL = API_BASE_URL;
