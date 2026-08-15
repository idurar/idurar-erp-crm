"use client";

import type { PropsWithChildren } from "react";
import { LayoutDashboard, School, AlertTriangle } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";

const NAV: NavItem[] = [
  { href: "/regulator", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/regulator/schools", label: "المدارس والامتثال", icon: School },
  { href: "/regulator/incidents", label: "سجل الحوادث", icon: AlertTriangle },
];

export default function RegulatorLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard allow={["regulator"]}>
      <DashboardShell role="regulator" nav={NAV} title="لوحة الرقابة والامتثال">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
