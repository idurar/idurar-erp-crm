"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { Card, EmptyState, LoadingState, StatusPill } from "@/components/ui";
import { formatPackagePrice } from "@/lib/format";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = {
  active: "success", trial: "info", suspended: "warning", expired: "danger",
};
const STATUS_LABEL: Record<string, string> = { active: "نشط", trial: "تجريبي", suspended: "معلّق", expired: "منتهي" };

export default function OwnerSchoolsPage() {
  const [query, setQuery] = useState("");
  const { data: schools, isLoading } = useQuery({ queryKey: ["owner-schools"], queryFn: () => api.owner.schools() as Promise<any[]> });

  const filtered = useMemo(() => {
    if (!schools) return schools;
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q));
  }, [schools, query]);

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالاسم أو المعرّف"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-4 text-sm outline-none focus:border-gray-400"
        />
      </div>

      {!filtered?.length ? (
        <EmptyState icon="🏫" title={query ? "لا نتائج مطابقة" : "لا توجد مدارس مسجّلة بعد"} />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-extrabold text-gray-900">{s.name}</p>
                <StatusPill label={STATUS_LABEL[s.subscriptionStatus] ?? s.subscriptionStatus} tone={STATUS_TONE[s.subscriptionStatus] ?? "info"} />
              </div>
              <p className="text-xs text-gray-500">{s.address ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-1">
                {s.package ? `${s.package.name} · ${formatPackagePrice(s.package.priceMonthly)}` : "بدون باقة"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
