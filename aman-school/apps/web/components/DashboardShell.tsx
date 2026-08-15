"use client";

import { type PropsWithChildren, type ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Bus } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import type { WebRole } from "@/lib/roles";
import { WEB_ROLE_LABELS } from "@/lib/roles";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const ROLE_GRADIENT_CLASS: Record<WebRole, string> = {
  owner: "role-gradient-owner",
  school_admin: "role-gradient-school_admin",
  ops_room: "role-gradient-ops_room",
  partner: "role-gradient-partner",
  sysadmin: "role-gradient-sysadmin",
  regulator: "role-gradient-regulator",
};

export function DashboardShell({ role, nav, title, children }: PropsWithChildren<{ role: WebRole; nav: NavItem[]; title: string }>) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  function logout() {
    clear();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 bg-gray-900 text-white flex flex-col">
        <div className={`flex items-center gap-3 px-5 py-6 ${ROLE_GRADIENT_CLASS[role]}`}>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Bus size={20} />
          </div>
          <div>
            <p className="font-extrabold text-sm leading-tight">أمان سكول</p>
            <p className="text-[11px] text-white/70 font-semibold">{WEB_ROLE_LABELS[role]}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email ?? user?.phone}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 shrink-0">
          <h1 className="font-extrabold text-gray-900 text-lg">{title}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
