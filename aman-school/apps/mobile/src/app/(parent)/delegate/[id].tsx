import { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, SectionHeader, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

const TYPES = [
  { value: "single_day", label: "ليوم واحد" },
  { value: "period", label: "لفترة محددة" },
  { value: "permanent", label: "دائم" },
];

const RELATIONS = ["عم", "خال", "جد", "جدة", "أخ", "أخت", "سائق عائلي", "أخرى"];

/* ---- SF-3: pickup delegation ---- */
export default function DelegateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: delegates } = useQuery({ queryKey: ["delegates", id], queryFn: () => api.parent.delegates(id) as Promise<any[]> });

  const [type, setType] = useState<"single_day" | "period" | "permanent">("single_day");
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [relation, setRelation] = useState("عم");
  const [phone, setPhone] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      api.parent.createDelegate(id, {
        type, name, nationalId, relation, phone,
        fromDate: type !== "permanent" ? new Date(fromDate).toISOString() : undefined,
        toDate: type === "period" ? new Date(toDate).toISOString() : undefined,
      }),
    onSuccess: () => {
      setName(""); setNationalId(""); setPhone("");
      queryClient.invalidateQueries({ queryKey: ["delegates", id] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (delegateId: string) => api.parent.cancelDelegate(id, delegateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["delegates", id] }),
  });

  return (
    <ScreenContainer>
      <SectionHeader title="نوع التفويض" accentColor={colors.greenMid} />
      <View style={styles.chipsRow}>
        {TYPES.map((t) => (
          <TouchableOpacity key={t.value} style={[styles.chip, type === t.value && styles.chipActive]} onPress={() => setType(t.value as any)}>
            <Text style={[styles.chipText, type === t.value && styles.chipTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {type !== "permanent" ? (
        <>
          <Text style={styles.label}>التاريخ</Text>
          <TextInput style={styles.input} value={fromDate} onChangeText={setFromDate} placeholder="YYYY-MM-DD" />
        </>
      ) : null}
      {type === "period" ? (
        <>
          <Text style={styles.label}>إلى</Text>
          <TextInput style={styles.input} value={toDate} onChangeText={setToDate} placeholder="YYYY-MM-DD" />
        </>
      ) : null}

      <SectionHeader title="بيانات الشخص المفوَّض" accentColor={colors.greenMid} />
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="الاسم الكامل" />
      <TextInput style={styles.input} value={nationalId} onChangeText={setNationalId} placeholder="رقم الهوية" keyboardType="number-pad" />
      <View style={styles.chipsRow}>
        {RELATIONS.map((r) => (
          <TouchableOpacity key={r} style={[styles.chip, relation === r && styles.chipActive]} onPress={() => setRelation(r)}>
            <Text style={[styles.chipText, relation === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+967 77xxxxxxx" keyboardType="phone-pad" />

      <Card accentColor={colors.amber}>
        <Text style={styles.warning}>⚠️ سيُطلب من المشرف التحقق من هوية الشخص المُفوَّض قبل تسليم طفلك.</Text>
      </Card>

      <Button
        title="💾 حفظ التفويض"
        onPress={() => createMutation.mutate()}
        loading={createMutation.isPending}
        disabled={!name || !nationalId || !phone}
        color={colors.greenMid}
      />

      <SectionHeader title="التفويضات النشطة حالياً" accentColor={colors.greenMid} />
      {delegates?.filter((d) => d.status === "active").length ? (
        delegates.filter((d) => d.status === "active").map((d) => (
          <Card key={d.id} accentColor={colors.greenMid}>
            <View style={styles.row}>
              <Text style={styles.delegateName}>👤 {d.name} ({d.relation})</Text>
              <StatusPill label={TYPES.find((t) => t.value === d.type)?.label ?? d.type} tone="info" />
            </View>
            <Text style={styles.meta}>{d.phone}</Text>
            <Text style={styles.cancelLink} onPress={() => cancelMutation.mutate(d.id)}>إلغاء التفويض</Text>
          </Card>
        ))
      ) : (
        <EmptyState icon="👤" title="لا توجد تفويضات نشطة" />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray700, marginBottom: 4, fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.greenMid}22`, borderColor: colors.greenMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.greenMid, fontWeight: "700" },
  warning: { fontSize: 12, color: colors.amber },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  delegateName: { fontWeight: "700", color: colors.navy, fontSize: 13 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  cancelLink: { color: colors.red, fontSize: 11, marginTop: 8, fontWeight: "700" },
});
