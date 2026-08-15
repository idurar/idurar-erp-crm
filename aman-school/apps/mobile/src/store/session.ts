import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import type { Role, User } from "@aman-school/types";

const STORAGE_KEY = "aman-school-session";

type OwnerBackup = { accessToken: string; refreshToken: string; user: User };

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrated: boolean;
  // owner-impersonate (§13): set only while impersonating another user —
  // never persisted to SecureStore, so the *real* session underneath is left
  // untouched on disk and simply reloads on its own if the app restarts
  // mid-impersonation.
  impersonationBackup: OwnerBackup | null;
  impersonationExpiresAt: string | null;
  hydrate: () => Promise<void>;
  setSession: (session: { accessToken: string; refreshToken: string; user: User }) => Promise<void>;
  clear: () => Promise<void>;
  startImpersonation: (accessToken: string, user: User, expiresAt: string) => void;
  endImpersonation: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,
  impersonationBackup: null,
  impersonationExpiresAt: null,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { accessToken: string; refreshToken: string; user: User };
        set({ ...parsed, hydrated: true });
        return;
      }
    } catch {
      /* corrupt/missing session — fall through to signed-out state */
    }
    set({ hydrated: true });
  },

  setSession: async (session) => {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
    set({ ...session });
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    set({ accessToken: null, refreshToken: null, user: null, impersonationBackup: null, impersonationExpiresAt: null });
  },

  startImpersonation: (accessToken, user, expiresAt) => {
    const { accessToken: ownerAccessToken, refreshToken: ownerRefreshToken, user: ownerUser } = get();
    if (!ownerAccessToken || !ownerRefreshToken || !ownerUser) return;
    set({
      impersonationBackup: { accessToken: ownerAccessToken, refreshToken: ownerRefreshToken, user: ownerUser },
      impersonationExpiresAt: expiresAt,
      accessToken, refreshToken: null, user,
    });
  },

  endImpersonation: () => {
    const backup = get().impersonationBackup;
    if (!backup) return;
    set({ ...backup, impersonationBackup: null, impersonationExpiresAt: null });
  },
}));

export function useRole(): Role | null {
  return useSessionStore((s) => s.user?.role ?? null);
}
