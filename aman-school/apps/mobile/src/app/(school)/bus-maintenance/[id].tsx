import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";

import { api } from "../../../lib/api";
import { useSessionStore } from "../../../store/session";

const TYPES = [
  { value: "routine", label: "دورية" },
  { value: "emergency", label: "طارئة" },
];

/* ---- OP-6 / a-maintenance: fleet maintenance records + inspection/insurance dates ---- */
export default function BusMaintenanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const queryClient = useQueryClient();

  const { data: buses } = useQuery({ queryKey: ["school-buses", schoolId], queryFn: () => api.school.buses(schoolId) as Promise<any[]> });
  const bus = buses?.find((b) => b.id === id);
  const { data: records } = useQuery({ queryKey: ["bus-maintenance", id], queryFn: () => api.school.maintenanceRecords(id) as Promise<any[]> });

  const [type, setType] = useState<"routine" | "emergency">("routine");
  const [cost, setCost] = useState("");
  const [workshop, setWorkshop] = useState("");
  const [notes, setNotes] = useState("");

  const [inspectionExpiresAt, setInspectionExpiresAt] = useState("");
  const [insuranceExpiresAt, setInsuranceExpiresAt] = useState("");

  const addMutation = useMutation({
    mutationFn: () =>
      api.school.addMaintenanceRecord(id, { type, cost: cost ? Number(cost) : undefined, workshop: workshop || undefined, notes: notes || undefined }),
    onSuccess: () => {
      setCost(""); setWorkshop(""); setNotes("");
      queryClient.invalidateQueries({ queryKey: ["bus-maintenance", id] });
    },
  });

  const datesMutation = useMutation({
    mutationFn: () =>
      api.school.setMaintenanceDates(id, {
        inspectionExpiresAt: inspectionExpiresAt || undefined,
        insuranceExpiresAt: insuranceExpiresAt || undefined,
      }),
    onSuccess: () => {
      Alert.alert("تم الحفظ", "تم تحديث تواريخ الفحص والتأمين");
      queryClient.invalidateQueries({ queryKey: ["school-buses", schoolId] });
    },
  });

  return (
    <ScreenContainer>
      <Card>
        <SectionHeader title={`تواريخ الفحص والتأمين — باص ${bus?.busNumber ?? ""}`} />
        <Text style={styles.hint}>الفحص الفني الحالي: {bus?.inspectionExpiresAt ? new Date(bus.inspectionExpiresAt).toLocaleDateString("ar-YE") : "غير محدد"}</Text>
        <TextInput style={styles.input} value={inspectionExpiresAt} onChangeText={setInspectionExpiresAt} placeholder="تاريخ انتهاء الفحص (YYYY-MM-DD)" />
        <Text style={styles.hint}>التأمين الحالي: {bus?.insuranceExpiresAt ? new Date(bus.insuranceExpiresAt).toLocaleDateString("ar-YE") : "غير محدد"}</Text>
        <TextInput style={styles.input} value={insuranceExpiresAt} onChangeText={setInsuranceExpiresAt} placeholder="تاريخ انتهاء التأمين (YYYY-MM-DD)" />
        <Button title="حفظ التواريخ" variant="outline" onPress={() => datesMutation.mutate()} loading={datesMutation.isPending} />
      </Card>

      <Card>
        <SectionHeader title="إضافة سجل صيانة" accentColor={colors.amber} />
        <View style={styles.chipsRow}>
          {TYPES.map((t) => (
            <TouchableOpacity key={t.value} style={[styles.chip, type === t.value && styles.chipActive]} onPress={() => setType(t.value as any)}>
              <Text style={[styles.chipText, type === t.value && styles.chipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput style={styles.input} value={workshop} onChangeText={setWorkshop} placeholder="الورشة" />
        <TextInput style={styles.input} value={cost} onChangeText={setCost} placeholder="التكلفة (ر.ي)" keyboardType="decimal-pad" />
        <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="ملاحظات" multiline />
        <Button title="حفظ السجل" onPress={() => addMutation.mutate()} loading={addMutation.isPending} color={colors.amber} />
      </Card>

      <SectionHeader title="سجل الصيانة" />
      {!records?.length ? (
        <EmptyState icon="🔧" title="لا توجد سجلات صيانة بعد" />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(r: any) => r.id}
          scrollEnabled={false}
          renderItem={({ item }: any) => (
            <Card accentColor={item.type === "emergency" ? colors.red : colors.blueMid}>
              <Text style={styles.recordTitle}>{item.type === "emergency" ? "🚨 طارئة" : "🔧 دورية"} — {item.workshop ?? "—"}</Text>
              <Text style={styles.recordMeta}>{new Date(item.date).toLocaleDateString("ar-YE")}{item.cost ? ` · ${item.cost} ر.ي` : ""}</Text>
              {item.notes ? <Text style={styles.recordNotes}>{item.notes}</Text> : null}
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 11, color: colors.gray600, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.amber}22`, borderColor: colors.amber },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.amber, fontWeight: "700" },
  recordTitle: { fontWeight: "700", color: colors.navy, fontSize: 13 },
  recordMeta: { color: colors.gray600, fontSize: 11, marginTop: 4 },
  recordNotes: { color: colors.gray700, fontSize: 12, marginTop: 6 },
});
