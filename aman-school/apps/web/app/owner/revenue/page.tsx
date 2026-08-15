"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, EmptyState, LoadingState, SectionHeader, StatCard } from "@/components/ui";

type RevenueSummary = { monthlyRevenue: number; annualRevenue: number; activeSchools: number };
type Invoice = { id: string; invoiceNumber: string; amount: number; status: string; issuedAt: string; school?: { name: string } | null };

export default function OwnerRevenuePage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["owner-revenue-summary"],
    queryFn: () => api.owner.revenueSummary() as Promise<RevenueSummary>,
  });
  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ["owner-invoices"],
    queryFn: () => api.owner.invoices() as Promise<Invoice[]>,
  });

  if (loadingSummary) return <LoadingState />;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="الإيراد الشهري" value={`${summary?.monthlyRevenue.toLocaleString("en-US")} ر.ي`} accent="text-amber-600" />
        <StatCard label="الإيراد السنوي المتوقع" value={`${summary?.annualRevenue.toLocaleString("en-US")} ر.ي`} />
        <StatCard label="مدارس نشطة مدفوعة" value={summary?.activeSchools} accent="text-green-600" />
      </div>

      <SectionHeader title="الفواتير الرسمية" accent="#D97706" />
      <Card>
        {loadingInvoices ? (
          <LoadingState />
        ) : !invoices?.length ? (
          <EmptyState icon="🧾" title="لا توجد فواتير بعد" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-gray-400 text-xs font-bold border-b border-gray-100">
                <th className="pb-2">رقم الفاتورة</th>
                <th className="pb-2">المدرسة</th>
                <th className="pb-2">المبلغ</th>
                <th className="pb-2">الحالة</th>
                <th className="pb-2">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-2.5 font-mono text-xs">{inv.invoiceNumber}</td>
                  <td className="py-2.5 font-semibold">{inv.school?.name ?? "—"}</td>
                  <td className="py-2.5">{inv.amount.toLocaleString("en-US")} ر.ي</td>
                  <td className="py-2.5">
                    <span className={inv.status === "paid" ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                      {inv.status === "paid" ? "مدفوعة" : "غير مدفوعة"}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-400">{new Date(inv.issuedAt).toLocaleDateString("ar-YE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
