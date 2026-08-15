import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, SectionHeader, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const SCOPES = [
  { value: "all", label: "يوم كامل" },
  { value: "morning", label: "الفترة الصباحية فقط" },
  { value: "evening", label: "الفترة المسائية فقط" },
];

/* ---- OP-3 / a-calendar: holiday calendar — disables trips school-wide/per-shift ---- */
export default function CalendarScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const queryClient = useQueryClient();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [scope, setScope] = useState<"all" | "morning" | "evening">("all");

  const { data: holidays } = useQuery({ queryKey: ["school-holidays", schoolId], queryFn: () => api.school.holidays(schoolId) as Promise<any[]> });
  const { data: todayStatus } = useQuery({ queryKey: ["school-today-status", schoolId], queryFn: () => api.school.todayStatus(schoolId) });

  const createMutation = useMutation({
    mutationFn: () => api.school.createHoliday(schoolId, { date, reason, scope }),
    onSuccess: () => {
      setDate(""); setReason("");
      queryClient.invalidateQueries({ queryKey: ["school-holidays", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-today-status", schoolId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (holidayId: string) => api.school.deleteHoliday(schoolId, holidayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-holidays", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-today-status", schoolId] });
    },
  });

  function confirmDelete(id: string) {
    Alert.alert("حذف العطلة", "سيتم إشعار جميع أولياء الأمور والمشرفين بإلغاء العطلة. متابعة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);
  }

  return (
    <ScreenContainer>
      {(todayStatus as any)?.disabled ? (
        <Card accentColor={colors.red}>
          <StatusPill label="اليوم عطلة — لا رحلات" tone="danger" />
        </Card>
      ) : null}

      <Card>
        <SectionHeader title="إضافة عطلة/إجازة" />
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="التاريخ (YYYY-MM-DD)" />
        <TextInput style={styles.input} value={reason} onChangeText={setReason} placeholder="السبب (مثال: إجازة عيد الفطر)" />
        <View style={styles.chipsRow}>
          {SCOPES.map((s) => (
            <TouchableOpacity key={s.value} style={[styles.chip, scope === s.value && styles.chipActive]} onPress={() => setScope(s.value as any)}>
              <Text style={[styles.chipText, scope === s.value && styles.chipTextActive]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="إضافة" onPress={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!date || !reason} color={colors.amber} />
      </Card>

      <SectionHeader title="العطل المجدولة" />
      {!holidays?.length ? (
        <EmptyState icon="📅" title="لا توجد عطل مجدولة" />
      ) : (
        <FlatList
          data={holidays}
          keyExtractor={(h: any) => h.id}
          scrollEnabled={false}
          renderItem={({ item }: any) => (
            <Card>
              <View style={styles.row}>
                <Text style={styles.holidayDate}>{new Date(item.date).toLocaleDateString("ar-YE")}</Text>
                <Text style={styles.deleteLink} onPress={() => confirmDelete(item.id)}>حذف</Text>
              </View>
              <Text style={styles.holidayReason}>{item.reason}</Text>
              <StatusPill label={SCOPES.find((s) => s.value === item.scope)?.label ?? item.scope} tone="info" />
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.amber}22`, borderColor: colors.amber },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.amber, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  holidayDate: { fontWeight: "700", color: colors.navy, fontSize: 13 },
  holidayReason: { color: colors.gray700, fontSize: 12, marginTop: 4, marginBottom: 8 },
  deleteLink: { color: colors.red, fontSize: 12, fontWeight: "700" },
});
