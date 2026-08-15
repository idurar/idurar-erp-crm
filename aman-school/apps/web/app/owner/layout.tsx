"use client";

import type { PropsWithChildren } from "react";
import { LayoutDashboard, School, Package, Handshake, DollarSign, FlaskConical, Users2 } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";

const NAV: NavItem[] = [
  { href: "/owner", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/owner/schools", label: "المدارس", icon: School },
  { href: "/owner/packages", label: "الباقات", icon: Package },
  { href: "/owner/partners", label: "الشركاء", icon: Handshake },
  { href: "/owner/revenue", label: "الإيرادات", icon: DollarSign },
  { href: "/owner/features", label: "الميزات التجريبية", icon: FlaskConical },
  { href: "/owner/users", label: "المستخدمون", icon: Users2 },
];

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard allow={["owner"]}>
      <DashboardShell role="owner" nav={NAV} title="لوحة تحكم المالك">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
