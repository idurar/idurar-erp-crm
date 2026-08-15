import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const SENSITIVITY = [
  { value: "low", label: "منخفضة" },
  { value: "medium", label: "متوسطة" },
  { value: "high", label: "عالية" },
];

/** SCH-07 / a-route-editor: define a bus's route stops + geofence radius per
 * stop + route-deviation sensitivity (SF-8). Real map-drag editing needs a
 * dedicated native maps SDK feature beyond this build's scope — stations are
 * entered as coordinates + radius, matching the rest of this screen's
 * manual-entry pattern. */
export default function RoutesScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const queryClient = useQueryClient();
  const { data: buses } = useQuery({ queryKey: ["school-buses", schoolId], queryFn: () => api.school.buses(schoolId) });
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const selectedBus = buses?.find((b) => b.id === selectedBusId);
  const [stops, setStops] = useState<Array<{ name: string; lat: string; lng: string; radius: string }>>([]);
  const [sensitivity, setSensitivity] = useState("medium");

  function selectBus(busId: string) {
    setSelectedBusId(busId);
    const bus = buses?.find((b) => b.id === busId);
    setStops(
      bus?.route?.stops
        ?.slice()
        .sort((a, b) => a.order - b.order)
        .map((s: any) => ({ name: s.name, lat: String(s.lat), lng: String(s.lng), radius: String(s.radius ?? 150) })) ??
        [{ name: "المدرسة", lat: "12.7797", lng: "45.0369", radius: "150" }]
    );
    setSensitivity((bus?.route as any)?.deviationSensitivity ?? "medium");
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      await api.school.createRoute(selectedBusId!, {
        stops: stops.map((s) => ({ name: s.name, lat: Number(s.lat), lng: Number(s.lng), radius: Number(s.radius) })) as any,
      });
      return api.school.setRouteSettings(selectedBusId!, { deviationSensitivity: sensitivity });
    },
    onSuccess: () => {
      Alert.alert("تم الحفظ", "تم حفظ مسار الباص ونطاقات الـ Geofence");
      queryClient.invalidateQueries({ queryKey: ["school-buses", schoolId] });
    },
  });

  if (!selectedBusId) {
    return (
      <ScreenContainer>
        <Text style={styles.hint}>اختر باصاً لتعديل مساره</Text>
        <FlatList
          data={buses}
          keyExtractor={(b) => b.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectBus(item.id)}>
              <Card accentColor={colors.amber}>
                <Text style={styles.busName}>باص {item.busNumber}</Text>
                <Text style={styles.busMeta}>{item.route?.stops?.length ?? 0} محطة معرّفة</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.hint}>مسار باص {selectedBus?.busNumber} — رتّب المحطات من المدرسة إلى آخر نقطة</Text>
      {stops.map((stop, i) => (
        <Card key={i}>
          <Text style={styles.stopLabel}>محطة {i + 1}</Text>
          <TextInput
            style={styles.input}
            value={stop.name}
            onChangeText={(v) => setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, name: v } : s)))}
            placeholder="اسم المحطة"
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={stop.lat}
              onChangeText={(v) => setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, lat: v } : s)))}
              placeholder="خط العرض"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={stop.lng}
              onChangeText={(v) => setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, lng: v } : s)))}
              placeholder="خط الطول"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.radiusLabel}>◯ نطاق Geofence (متر)</Text>
          <TextInput
            style={styles.input}
            value={stop.radius}
            onChangeText={(v) => setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, radius: v } : s)))}
            placeholder="150"
            keyboardType="numeric"
          />
        </Card>
      ))}
      <Button
        title="+ إضافة محطة"
        variant="outline"
        onPress={() => setStops((prev) => [...prev, { name: "", lat: "12.7797", lng: "45.0369", radius: "150" }])}
      />

      <Text style={styles.sensitivityLabel}>حساسية تنبيه الانحراف</Text>
      <View style={styles.chipsRow}>
        {SENSITIVITY.map((s) => (
          <TouchableOpacity key={s.value} style={[styles.chip, sensitivity === s.value && styles.chipActive]} onPress={() => setSensitivity(s.value)}>
            <Text style={[styles.chipText, sensitivity === s.value && styles.chipTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="حفظ المسار" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} color={colors.amber} />
      <Button title="اختيار باص آخر" variant="outline" onPress={() => setSelectedBusId(null)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, color: colors.gray600, marginBottom: 12, textAlign: "center" },
  busName: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  busMeta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  stopLabel: { fontSize: 11, fontWeight: "700", color: colors.amber, marginBottom: 6 },
  radiusLabel: { fontSize: 11, color: colors.gray600, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 8, paddingHorizontal: 10,
    paddingVertical: 8, fontSize: 13, backgroundColor: colors.white, marginBottom: 6,
  },
  sensitivityLabel: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginTop: 8, marginBottom: 8 },
  chipsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.amber}22`, borderColor: colors.amber },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.amber, fontWeight: "700" },
});
