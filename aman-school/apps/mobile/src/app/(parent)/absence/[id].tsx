import { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../../lib/api";

const MODES = [
  { value: "tomorrow", label: "غداً فقط" },
  { value: "period", label: "فترة محددة" },
  { value: "today", label: "غياب اليوم" },
];
const REASONS = ["مرض", "سفر", "ظرف عائلي", "أخرى"];

/* ---- OP-4: pre-announced absence ---- */
export default function AbsenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: absences } = useQuery({ queryKey: ["absences", id], queryFn: () => api.parent.absences(id) as Promise<any[]> });

  const [mode, setMode] = useState("tomorrow");
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(tomorrow);
  const [toDate, setToDate] = useState(tomorrow);
  const [reason, setReason] = useState(REASONS[0]);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => {
      const from = mode === "today" ? today : mode === "tomorrow" ? tomorrow : fromDate;
      const to = mode === "period" ? toDate : from;
      return api.parent.createAbsence(id, { fromDate: new Date(from).toISOString(), toDate: new Date(to).toISOString(), reason });
    },
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["absences", id] });
    },
    onError: (e) => setError(e instanceof HttpError ? String((e.body as any)?.error ?? "تعذر الإبلاغ") : "تعذر الاتصال بالخادم"),
  });

  const cancelMutation = useMutation({
    mutationFn: (absenceId: string) => api.parent.cancelAbsence(id, absenceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["absences", id] }),
  });

  return (
    <ScreenContainer>
      <Text style={styles.label}>تاريخ الغياب</Text>
      <View style={styles.chipsRow}>
        {MODES.map((m) => (
          <TouchableOpacity key={m.value} style={[styles.chip, mode === m.value && styles.chipActive]} onPress={() => setMode(m.value)}>
            <Text style={[styles.chipText, mode === m.value && styles.chipTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === "period" ? (
        <>
          <TextInput style={styles.input} value={fromDate} onChangeText={setFromDate} placeholder="من (YYYY-MM-DD)" />
          <TextInput style={styles.input} value={toDate} onChangeText={setToDate} placeholder="إلى (YYYY-MM-DD)" />
        </>
      ) : null}

      <Text style={styles.label}>السبب (اختياري)</Text>
      <View style={styles.chipsRow}>
        {REASONS.map((r) => (
          <TouchableOpacity key={r} style={[styles.chip, reason === r && styles.chipActive]} onPress={() => setReason(r)}>
            <Text style={[styles.chipText, reason === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="✅ تأكيد الإبلاغ" onPress={() => createMutation.mutate()} loading={createMutation.isPending} color={colors.greenMid} />

      <Text style={[styles.label, { marginTop: 20 }]}>الإبلاغات النشطة</Text>
      {absences?.filter((a) => a.status === "active").length ? (
        absences.filter((a) => a.status === "active").map((a) => (
          <Card key={a.id} accentColor={colors.blueMid}>
            <Text style={styles.itemText}>
              🟢 {new Date(a.fromDate).toLocaleDateString("ar-YE")}
              {a.fromDate !== a.toDate ? ` — ${new Date(a.toDate).toLocaleDateString("ar-YE")}` : ""}
              {a.reason ? ` (${a.reason})` : ""}
            </Text>
            <Text style={styles.cancelLink} onPress={() => Alert.alert("إلغاء الإبلاغ", "هل تريد إلغاء هذا الإبلاغ؟", [{ text: "لا" }, { text: "نعم", onPress: () => cancelMutation.mutate(a.id) }])}>
              إلغاء الإبلاغ
            </Text>
          </Card>
        ))
      ) : (
        <EmptyState icon="📅" title="لا توجد إبلاغات غياب نشطة" />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.greenMid}22`, borderColor: colors.greenMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.greenMid, fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  error: { color: colors.red, fontSize: 12, marginBottom: 8, textAlign: "center" },
  itemText: { color: colors.navy, fontSize: 13 },
  cancelLink: { color: colors.red, fontSize: 11, marginTop: 8, fontWeight: "700" },
});
