"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { Button, Card, EmptyState, LoadingState } from "@/components/ui";

type FeatureFlag = {
  id: string; key: string; labelAr: string; description: string | null;
  enabledGlobally: boolean; enabledForSchoolIds: string[];
};

export default function OwnerFeaturesPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [key, setKey] = useState("");
  const [labelAr, setLabelAr] = useState("");
  const [description, setDescription] = useState("");

  const { data: flags, isLoading } = useQuery({ queryKey: ["owner-feature-flags"], queryFn: () => api.owner.featureFlags() as Promise<FeatureFlag[]> });
  const { data: schools } = useQuery({ queryKey: ["owner-schools"], queryFn: () => api.owner.schools() as Promise<any[]> });

  const createMutation = useMutation({
    mutationFn: () => api.owner.createFeatureFlag({ key, labelAr, description: description || undefined }),
    onSuccess: () => {
      setKey(""); setLabelAr(""); setDescription(""); setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ["owner-feature-flags"] });
    },
  });

  const toggleGlobalMutation = useMutation({
    mutationFn: ({ id, enabledGlobally }: { id: string; enabledGlobally: boolean }) => api.owner.updateFeatureFlag(id, { enabledGlobally }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-feature-flags"] }),
  });

  const toggleSchoolMutation = useMutation({
    mutationFn: ({ id, schoolId, enabled }: { id: string; schoolId: string; enabled: boolean }) => api.owner.setFeatureFlagForSchool(id, schoolId, enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-feature-flags"] }),
  });

  if (isLoading) return <LoadingState />;

  return (
    <div>
      {!flags?.length ? (
        <EmptyState icon="🧪" title="لا توجد ميزات تجريبية بعد" />
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {flags.map((flag) => (
            <Card key={flag.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-gray-900 text-sm">{flag.labelAr}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{flag.key}</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flag.enabledGlobally}
                    onChange={(e) => toggleGlobalMutation.mutate({ id: flag.id, enabledGlobally: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 relative transition after:content-[''] after:absolute after:top-0.5 after:right-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:after:-translate-x-5" />
                </label>
              </div>
              {flag.description ? <p className="text-xs text-gray-500 mt-2">{flag.description}</p> : null}
              <p className="text-[11px] font-bold text-purple-700 mt-2">
                {flag.enabledGlobally ? "مفعّلة لجميع المدارس" : `مفعّلة لـ ${flag.enabledForSchoolIds.length} مدرسة محددة`}
              </p>

              {!flag.enabledGlobally ? (
                <button
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 mt-2"
                  onClick={() => setExpandedId(expandedId === flag.id ? null : flag.id)}
                >
                  عرض المدارس المشمولة {expandedId === flag.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              ) : null}

              {!flag.enabledGlobally && expandedId === flag.id ? (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                  {schools?.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={flag.enabledForSchoolIds.includes(s.id)}
                        onChange={(e) => toggleSchoolMutation.mutate({ id: flag.id, schoolId: s.id, enabled: e.target.checked })}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      {showCreate ? (
        <Card className="max-w-md">
          <div className="flex flex-col gap-2">
            <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="المفتاح (بالإنجليزية، مثال: live_chat)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            <input value={labelAr} onChange={(e) => setLabelAr(e.target.value)} placeholder="الاسم بالعربية" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف مختصر (اختياري)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!key || !labelAr} color="#9333EA">إنشاء الميزة</Button>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setShowCreate(true)} color="#9333EA">+ ميزة تجريبية جديدة</Button>
      )}
    </div>
  );
}
