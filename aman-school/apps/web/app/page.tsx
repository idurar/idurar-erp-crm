"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { WEB_ROLE_HOME, isWebRole } from "@/lib/roles";

export default function Home() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (user && isWebRole(user.role)) {
      router.replace(WEB_ROLE_HOME[user.role]);
    } else {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  return null;
}
