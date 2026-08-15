"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, EmptyState, LoadingState, StatusPill } from "@/components/ui";

type RegulatorIncident = {
  id: string; type: string; priority: string; status: string; message: string | null;
  createdAt: string; resolvedAt: string | null; resolutionReason: string | null;
  school?: { name: string } | null; bus?: { busNumber: string } | null;
};

const PRIORITY_LABEL: Record<string, string> = { urgent_critical: "حرجة", urgent: "عاجلة", notice: "تنبيه" };
const PRIORITY_TONE: Record<string, "danger" | "warning" | "info"> = { urgent_critical: "danger", urgent: "warning", notice: "info" };
const STATUS_LABEL: Record<string, string> = { active: "نشطة", acknowledged: "قيد المتابعة", resolved: "تمت المعالجة" };
const STATUS_TONE: Record<string, "danger" | "warning" | "success"> = { active: "danger", acknowledged: "warning", resolved: "success" };
const TYPE_LABEL: Record<string, string> = {
  sos: "طوارئ SOS", delay: "تأخير", incident: "حادثة", exception: "استثناء",
  student_not_collected: "عدم استلام طالب", route_deviation: "انحراف عن المسار", maintenance_due: "استحقاق صيانة",
};

export default function RegulatorIncidentsPage() {
  const [status, setStatus] = useState<string>("");
  const { data: incidents, isLoading } = useQuery({
    queryKey: ["regulator-incidents", status],
    queryFn: () => api.regulator.incidents(status || undefined) as Promise<RegulatorIncident[]>,
  });

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {["", "active", "acknowledged", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              status === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {s === "" ? "الكل" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !incidents?.length ? (
        <EmptyState icon="📋" title="لا توجد حوادث مطابقة" />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-gray-400 text-xs font-bold border-b border-gray-100">
                <th className="pb-2">النوع</th>
                <th className="pb-2">المدرسة / الباص</th>
                <th className="pb-2">الأولوية</th>
                <th className="pb-2">الحالة</th>
                <th className="pb-2">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {incidents.map((i) => (
                <tr key={i.id}>
                  <td className="py-3">
                    <p className="font-bold text-gray-800">{TYPE_LABEL[i.type] ?? i.type}</p>
                    {i.message ? <p className="text-xs text-gray-400 max-w-xs truncate">{i.message}</p> : null}
                  </td>
                  <td className="py-3 text-gray-600">{i.school?.name ?? "—"}{i.bus ? ` · باص ${i.bus.busNumber}` : ""}</td>
                  <td className="py-3"><StatusPill label={PRIORITY_LABEL[i.priority] ?? i.priority} tone={PRIORITY_TONE[i.priority] ?? "info"} /></td>
                  <td className="py-3"><StatusPill label={STATUS_LABEL[i.status] ?? i.status} tone={STATUS_TONE[i.status] ?? "info"} /></td>
                  <td className="py-3 text-gray-400 text-xs">{new Date(i.createdAt).toLocaleString("ar-YE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
