"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { Card, EmptyState, LoadingState } from "@/components/ui";
import { ROLE_LABELS_AR, type Role } from "@aman-school/types";

const ROLE_FILTERS: Array<Role | ""> = ["", "owner", "sysadmin", "partner", "school_admin", "ops_room", "supervisor", "parent", "driver", "regulator"];

export default function OwnerUsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role | "">("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["owner-users", role, q],
    queryFn: () => {
      const params = new URLSearchParams();
      if (role) params.set("role", role);
      if (q) params.set("q", q);
      const qs = params.toString();
      return api.owner.users(qs ? `?${qs}` : "") as Promise<any[]>;
    },
  });

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو البريد"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-4 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role | "")}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r} value={r}>{r ? ROLE_LABELS_AR[r] : "كل الأدوار"}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !users?.length ? (
        <EmptyState icon="👥" title="لا يوجد مستخدمون مطابقون" />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-gray-400 text-xs font-bold border-b border-gray-100">
                <th className="pb-2">الاسم</th>
                <th className="pb-2">الصفة</th>
                <th className="pb-2">التواصل</th>
                <th className="pb-2">المدرسة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 font-bold text-gray-800">{u.name}</td>
                  <td className="py-2.5 text-gray-500">{ROLE_LABELS_AR[u.role as Role]}</td>
                  <td className="py-2.5 text-gray-500">{u.email ?? u.phone ?? "—"}</td>
                  <td className="py-2.5 text-gray-500">{u.schoolName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
