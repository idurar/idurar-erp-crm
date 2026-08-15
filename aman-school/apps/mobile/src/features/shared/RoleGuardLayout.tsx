import { PropsWithChildren } from "react";
import { Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { Role } from "@aman-school/types";
import { useSessionStore } from "../../store/session";
import { api } from "../../lib/api";

/** Wrap every role route-group's _layout with this so each role's screens are
 * fully independent — a session for a different role (or no session at all)
 * bounces back to the role picker instead of ever rendering this group's UI.
 * Also enforces SF-1: a stale/missing privacy consent bounces to the
 * mandatory consent screen before any role's UI renders. */
export function RoleGuardLayout({ allow, children }: PropsWithChildren<{ allow: Role[] }>) {
  const user = useSessionStore((s) => s.user);
  const { data: consent, isLoading } = useQuery({
    queryKey: ["consent-status", user?.id],
    queryFn: () => api.consent.status(),
    enabled: !!user,
    staleTime: 60000,
  });

  if (!user || !allow.includes(user.role)) {
    return <Redirect href="/(auth)/role-select" />;
  }
  if (isLoading) return null;
  if (consent?.required) return <Redirect href="/(auth)/consent" />;
  return <>{children}</>;
}

export function useLogout() {
  const clear = useSessionStore((s) => s.clear);
  return clear;
}
