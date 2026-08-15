"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button, Card, LoadingState } from "@/components/ui";
import { formatPackagePrice } from "@/lib/format";

type Package = { id: string; name: string; priceMonthly: number; studentLimit: number; features: string[] };

export default function OwnerPackagesPage() {
  const queryClient = useQueryClient();
  const { data: packages, isLoading } = useQuery({ queryKey: ["owner-packages"], queryFn: () => api.owner.packages() as Promise<Package[]> });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [limit, setLimit] = useState("");

  const updateMutation = useMutation({
    mutationFn: () => api.owner.updatePackage(editingId!, { priceMonthly: Number(price), studentLimit: Number(limit) }),
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["owner-packages"] });
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {packages?.map((p) => (
        <Card key={p.id}>
          <p className="font-extrabold text-gray-900 text-lg">{p.name}</p>
          <p className="text-sm text-gray-500 mt-1">{formatPackagePrice(p.priceMonthly)}{p.priceMonthly > 0 ? " / شهرياً" : ""} · حتى {p.studentLimit.toLocaleString("en-US")} طالب</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.features.map((f) => (
              <span key={f} className="text-[11px] bg-purple-50 text-purple-700 rounded-full px-2 py-1 font-semibold">{f}</span>
            ))}
          </div>

          {editingId === p.id ? (
            <div className="mt-4 flex flex-col gap-2">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="السعر الشهري (ر.ي)"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              <input
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="الحد الأقصى للطلاب"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              <Button onClick={() => updateMutation.mutate()} loading={updateMutation.isPending} color="#9333EA">حفظ</Button>
            </div>
          ) : (
            <button
              className="mt-4 text-xs font-bold text-purple-700"
              onClick={() => {
                setEditingId(p.id);
                setPrice(String(p.priceMonthly));
                setLimit(String(p.studentLimit));
              }}
            >
              تعديل السعر ›
            </button>
          )}
        </Card>
      ))}
    </div>
  );
}
