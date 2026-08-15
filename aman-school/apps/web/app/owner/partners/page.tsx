"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button, Card, EmptyState, LoadingState } from "@/components/ui";

type Partner = { id: string; name: string; region: string; commissionPercent: number; tier?: { labelAr: string } | null; schools?: unknown[] };

export default function OwnerPartnersPage() {
  const queryClient = useQueryClient();
  const { data: partners, isLoading } = useQuery({ queryKey: ["owner-partners"], queryFn: () => api.owner.partners() as Promise<Partner[]> });
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("15");

  const createMutation = useMutation({
    mutationFn: () => api.owner.registerPartner({ name, region, commissionPercent: Number(commissionPercent) }),
    onSuccess: () => {
      setName(""); setRegion(""); setCommissionPercent("15"); setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["owner-partners"] });
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div>
      {!partners?.length ? (
        <EmptyState icon="🤝" title="لا يوجد شركاء بعد" />
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {partners.map((p) => (
            <Card key={p.id}>
              <p className="font-extrabold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-500 mt-1">{p.region} · عمولة {p.commissionPercent}%</p>
              <p className="text-xs text-gray-500 mt-1">{p.tier?.labelAr ?? "—"} · {p.schools?.length ?? 0} مدرسة</p>
            </Card>
          ))}
        </div>
      )}

      {showAdd ? (
        <Card className="max-w-md">
          <div className="flex flex-col gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الشريك" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="المنطقة" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            <input value={commissionPercent} onChange={(e) => setCommissionPercent(e.target.value)} placeholder="نسبة العمولة %" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!name || !region} color="#D97706">تسجيل الشريك</Button>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setShowAdd(true)} color="#D97706">+ تسجيل شريك جديد</Button>
      )}
    </div>
  );
}
