"use client";

import { useQuery } from "@tanstack/react-query";
import { School, Users, Bus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { Card, ErrorState, LoadingState, SectionHeader, StatCard } from "@/components/ui";

type Overview = {
  totalSchools: number; totalStudents: number; totalBuses: number;
  activeIncidents: number; resolvedIncidents30d: number;
};

export default function RegulatorOverviewPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["regulator-overview"],
    queryFn: () => api.regulator.overview() as Promise<Overview>,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  return (
    <div>
      <SectionHeader title="مؤشرات الرقابة الشاملة" accent="#4F46E5" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="إجمالي المدارس المرخّصة" value={<span className="inline-flex items-center gap-2"><School size={18} />{data.totalSchools}</span>} />
        <StatCard label="الطلاب المسجّلون" value={<span className="inline-flex items-center gap-2"><Users size={18} />{data.totalStudents}</span>} />
        <StatCard label="الباصات العاملة" value={<span className="inline-flex items-center gap-2"><Bus size={18} />{data.totalBuses}</span>} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="حوادث نشطة الآن"
          value={<span className="inline-flex items-center gap-2"><AlertTriangle size={18} />{data.activeIncidents}</span>}
          accent={data.activeIncidents > 0 ? "text-red-600" : "text-green-600"}
        />
        <StatCard
          label="حوادث تمت معالجتها (٣٠ يوم)"
          value={<span className="inline-flex items-center gap-2"><CheckCircle2 size={18} />{data.resolvedIncidents30d}</span>}
          accent="text-green-600"
        />
      </div>

      <SectionHeader title="حول هذه اللوحة" accent="#4F46E5" />
      <Card>
        <p className="text-sm text-gray-600 leading-7">
          هذه لوحة رقابة وامتثال للجهات التنظيمية — عرض شامل عبر جميع المدارس المشتركة في المنصة، بصلاحية قراءة فقط
          دون أي إمكانية للتعديل. للاطلاع على تفاصيل كل مدرسة وحالتها التشغيلية، انتقل إلى{" "}
          <span className="font-bold text-indigo-700">المدارس والامتثال</span>. لسجل الحوادث الكامل عبر المنصة، انتقل
          إلى <span className="font-bold text-indigo-700">سجل الحوادث</span>.
        </p>
      </Card>
    </div>
  );
}
