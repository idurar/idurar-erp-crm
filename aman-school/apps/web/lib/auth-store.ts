"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@aman-school/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (session: { accessToken: string; refreshToken: string; user: User }) => void;
  clear: () => void;
  setHydrated: () => void;
}

/** Web admin session — desktop-only roles (owner/school_admin/sysadmin/
 * ops_room/partner), persisted to localStorage since there's no SecureStore
 * equivalent on web (this mirrors apps/mobile's session store 1:1). */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setSession: (session) => set({ ...session }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "aman-school-web-session",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
