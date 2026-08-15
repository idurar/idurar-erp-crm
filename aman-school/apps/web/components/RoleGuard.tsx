"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import type { WebRole } from "@/lib/roles";

/** Mirrors apps/mobile's RoleGuardLayout: a session for a different role (or
 * no session at all) bounces back to /login instead of ever rendering this
 * section's UI. */
export function RoleGuard({ allow, children }: PropsWithChildren<{ allow: WebRole[] }>) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || !(allow as string[]).includes(user.role)) {
      router.replace("/login");
    }
  }, [hydrated, user, allow, router]);

  if (!hydrated || !user || !(allow as string[]).includes(user.role)) return null;
  return <>{children}</>;
}
