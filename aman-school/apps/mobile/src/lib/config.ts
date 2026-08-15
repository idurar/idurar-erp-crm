import Constants from "expo-constants";

/**
 * Backend base URL. Override via the EXPO_PUBLIC_API_URL env var when running
 * `expo start` (e.g. `EXPO_PUBLIC_API_URL=http://192.168.1.20:4000 npx expo start`)
 * so a phone running Expo Go on the same Wi-Fi/LAN can reach your machine's
 * backend — "localhost" only resolves to the phone itself, never your dev
 * machine. For a standalone EAS build (APK/production), this must point to a
 * publicly reachable deployment of `aman-school/backend` — see
 * apps/mobile/README.md.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  "http://localhost:4000";

export const SOCKET_URL = API_BASE_URL;
