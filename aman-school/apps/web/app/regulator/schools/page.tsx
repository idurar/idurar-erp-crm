"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, EmptyState, LoadingState, StatusPill } from "@/components/ui";

type RegulatorSchool = {
  id: string; name: string; address: string | null; licenseNumber: string | null;
  subscriptionStatus: string; studentsCount: number; busesCount: number; incidents90d: number; createdAt: string;
};

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = {
  active: "success", trial: "info", suspended: "warning", expired: "danger",
};
const STATUS_LABEL: Record<string, string> = { active: "نشط", trial: "تجريبي", suspended: "معلّق", expired: "منتهي" };

export default function RegulatorSchoolsPage() {
  const { data: schools, isLoading } = useQuery({
    queryKey: ["regulator-schools"],
    queryFn: () => api.regulator.schools() as Promise<RegulatorSchool[]>,
  });

  if (isLoading) return <LoadingState />;
  if (!schools?.length) return <EmptyState icon="🏫" title="لا توجد مدارس مسجّلة على المنصة" />;

  return (
    <Card>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-right text-gray-400 text-xs font-bold border-b border-gray-100">
            <th className="pb-2">المدرسة</th>
            <th className="pb-2">رقم الترخيص</th>
            <th className="pb-2">الحالة</th>
            <th className="pb-2">الطلاب</th>
            <th className="pb-2">الباصات</th>
            <th className="pb-2">حوادث (٩٠ يوم)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {schools.map((s) => (
            <tr key={s.id}>
              <td className="py-3">
                <p className="font-bold text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-400">{s.address ?? "—"}</p>
              </td>
              <td className="py-3 font-mono text-xs text-gray-600">{s.licenseNumber ?? "—"}</td>
              <td className="py-3"><StatusPill label={STATUS_LABEL[s.subscriptionStatus] ?? s.subscriptionStatus} tone={STATUS_TONE[s.subscriptionStatus] ?? "info"} /></td>
              <td className="py-3 text-gray-600">{s.studentsCount}</td>
              <td className="py-3 text-gray-600">{s.busesCount}</td>
              <td className="py-3">
                <span className={s.incidents90d > 5 ? "text-red-600 font-bold" : s.incidents90d > 0 ? "text-amber-600 font-bold" : "text-green-600 font-bold"}>
                  {s.incidents90d}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
