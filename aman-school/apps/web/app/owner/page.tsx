"use client";

import { useQuery } from "@tanstack/react-query";
import { School, Users, TrendingUp, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { Card, ErrorState, LoadingState, SectionHeader, StatCard } from "@/components/ui";

export default function OwnerDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["owner-platform-summary"],
    queryFn: () => api.owner.platformSummary() as Promise<{
      totalSchools: number; activeSchools: number; totalStudents: number; monthlyRevenue: number;
      recentSchools: Array<{ id: string; name: string; createdAt: string }>;
    }>,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  return (
    <div>
      <SectionHeader title="مؤشرات المنصة" accent="#D97706" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="إجمالي المدارس" value={<span className="inline-flex items-center gap-2"><School size={18} />{data.totalSchools}</span>} />
        <StatCard label="مدارس نشطة" value={data.activeSchools} accent="text-green-600" />
        <StatCard label="الطلاب النشطون" value={<span className="inline-flex items-center gap-2"><Users size={18} />{data.totalStudents}</span>} />
        <StatCard label="الإيراد الشهري" value={<span className="inline-flex items-center gap-2"><Wallet size={18} />{data.monthlyRevenue.toLocaleString("en-US")} ر.ي</span>} accent="text-amber-600" />
      </div>

      <SectionHeader title="أحدث المدارس المسجّلة" accent="#D97706" />
      <Card>
        {!data.recentSchools?.length ? (
          <p className="text-gray-400 text-sm text-center py-6">لا توجد مدارس بعد</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.recentSchools.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3">
                <span className="font-bold text-sm text-gray-800 flex items-center gap-2"><TrendingUp size={14} className="text-green-500" /> {s.name}</span>
                <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString("ar-YE")}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
