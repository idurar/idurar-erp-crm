import { useState } from "react";
import { Text, TextInput, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ErrorState, LoadingState, ScreenContainer, StatusPill, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const STAGES = [
  { value: "contacted", label: "تم التواصل", tone: "info" as const },
  { value: "interested", label: "مهتمة", tone: "info" as const },
  { value: "proposal", label: "تم إرسال عرض", tone: "warning" as const },
  { value: "negotiation", label: "قيد التفاوض", tone: "warning" as const },
  { value: "won", label: "فاز 🎉", tone: "success" as const },
  { value: "lost", label: "خسر", tone: "danger" as const },
];

/** partner-leads (§11): the partner's own sales pipeline of prospective schools. */
export default function PartnerLeadsScreen() {
  const user = useSessionStore((s) => s.user)!;
  const partnerId = user.partnerId!;
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: leads, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["partner-leads", partnerId],
    queryFn: () => api.partner.leads(partnerId) as Promise<any[]>,
  });

  const createMutation = useMutation({
    mutationFn: () => api.partner.createLead(partnerId, { schoolName, contactName, phone }),
    onSuccess: () => {
      setSchoolName(""); setContactName(""); setPhone(""); setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["partner-leads", partnerId] });
    },
  });

  const stageMutation = useMutation({
    mutationFn: ({ leadId, stage }: { leadId: string; stage: string }) => api.partner.updateLead(partnerId, leadId, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partner-leads", partnerId] }),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      {!leads?.length ? (
        <EmptyState icon="📇" title="لا يوجد عملاء محتملون بعد" />
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(l) => l.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const stage = STAGES.find((s) => s.value === item.stage) ?? STAGES[0];
            return (
              <Card accentColor={roleGradients.partner[0]} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.title}>{item.schoolName}</Text>
                  <StatusPill label={stage.label} tone={stage.tone} />
                </View>
                <Text style={styles.meta}>{item.contactName} · {item.phone}</Text>
                <View style={styles.stagesRow}>
                  {STAGES.map((s) => (
                    <TouchableOpacity
                      key={s.value}
                      style={[styles.stageChip, item.stage === s.value && styles.stageChipActive]}
                      onPress={() => stageMutation.mutate({ leadId: item.id, stage: s.value })}
                    >
                      <Text style={[styles.stageText, item.stage === s.value && styles.stageTextActive]}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            );
          }}
        />
      )}

      {showAdd ? (
        <Card accentColor={roleGradients.partner[0]}>
          <TextInput style={styles.input} value={schoolName} onChangeText={setSchoolName} placeholder="اسم المدرسة" />
          <TextInput style={styles.input} value={contactName} onChangeText={setContactName} placeholder="اسم المسؤول" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="رقم الهاتف" keyboardType="phone-pad" />
          <Button
            title="إضافة عميل محتمل"
            onPress={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!schoolName || !contactName || !phone}
            color={roleGradients.partner[0]}
          />
        </Card>
      ) : (
        <Button title="+ عميل محتمل جديد" onPress={() => setShowAdd(true)} color={roleGradients.partner[0]} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontWeight: "800", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4, marginBottom: 10 },
  stagesRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  stageChip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  stageChipActive: { backgroundColor: `${roleGradients.partner[0]}22`, borderColor: roleGradients.partner[0] },
  stageText: { fontSize: 11, color: colors.gray700 },
  stageTextActive: { color: roleGradients.partner[0], fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
});
