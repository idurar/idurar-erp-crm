import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, SectionHeader, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";
import { useSessionStore } from "../../../store/session";

/* ---- OP-1 / a-bus-edit: edit bus, assign supervisor/driver, out-of-service toggle ---- */
export default function BusDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: buses } = useQuery({ queryKey: ["school-buses", schoolId], queryFn: () => api.school.buses(schoolId) as Promise<any[]> });
  const { data: supervisors } = useQuery({ queryKey: ["school-supervisors", schoolId], queryFn: () => api.school.supervisors(schoolId) as Promise<any[]> });
  const { data: drivers } = useQuery({ queryKey: ["school-drivers", schoolId], queryFn: () => api.school.drivers(schoolId) as Promise<any[]> });
  const bus = buses?.find((b) => b.id === id);

  const [busNumber, setBusNumber] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [supervisorId, setSupervisorId] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [oosReason, setOosReason] = useState("");

  useEffect(() => {
    if (bus) {
      setBusNumber(bus.busNumber);
      setPlateNumber(bus.plateNumber);
      setCapacity(String(bus.capacity));
      setSupervisorId(bus.supervisorId ?? null);
      setDriverId(bus.driverId ?? null);
    }
  }, [bus]);

  const updateMutation = useMutation({
    mutationFn: () => api.school.updateBus(id, { busNumber, plateNumber, capacity: Number(capacity), supervisorId, driverId }),
    onSuccess: () => {
      Alert.alert("تم الحفظ", "تم تحديث بيانات الباص");
      queryClient.invalidateQueries({ queryKey: ["school-buses", schoolId] });
    },
  });

  const serviceMutation = useMutation({
    mutationFn: (outOfService: boolean) => api.school.setBusServiceStatus(id, outOfService, outOfService ? oosReason : undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["school-buses", schoolId] }),
  });

  return (
    <ScreenContainer>
      <Card>
        <View style={styles.row}>
          <Text style={styles.title}>باص {bus?.busNumber}</Text>
          <StatusPill label={bus?.outOfService ? "خارج الخدمة" : "نشط"} tone={bus?.outOfService ? "danger" : "success"} />
        </View>

        <SectionHeader title="البيانات الأساسية" />
        <TextInput style={styles.input} value={busNumber} onChangeText={setBusNumber} placeholder="رقم الباص" />
        <TextInput style={styles.input} value={plateNumber} onChangeText={setPlateNumber} placeholder="رقم اللوحة" />
        <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} placeholder="السعة" keyboardType="number-pad" />

        <Text style={styles.label}>المشرف</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity style={[styles.chip, !supervisorId && styles.chipActive]} onPress={() => setSupervisorId(null)}>
            <Text style={[styles.chipText, !supervisorId && styles.chipTextActive]}>بدون</Text>
          </TouchableOpacity>
          {supervisors?.map((s) => (
            <TouchableOpacity key={s.id} style={[styles.chip, supervisorId === s.id && styles.chipActive]} onPress={() => setSupervisorId(s.id)}>
              <Text style={[styles.chipText, supervisorId === s.id && styles.chipTextActive]}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>السائق</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity style={[styles.chip, !driverId && styles.chipActive]} onPress={() => setDriverId(null)}>
            <Text style={[styles.chipText, !driverId && styles.chipTextActive]}>بدون</Text>
          </TouchableOpacity>
          {drivers?.map((d) => (
            <TouchableOpacity key={d.id} style={[styles.chip, driverId === d.id && styles.chipActive]} onPress={() => setDriverId(d.id)}>
              <Text style={[styles.chipText, driverId === d.id && styles.chipTextActive]}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="حفظ التغييرات" onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} color={colors.amber} />
      </Card>

      <Card>
        <SectionHeader title="حالة الخدمة" accentColor={colors.red} />
        {bus?.outOfService ? (
          <Button title="✅ إعادة الباص للخدمة" color={colors.greenMid} onPress={() => serviceMutation.mutate(false)} loading={serviceMutation.isPending} />
        ) : (
          <>
            <TextInput style={styles.input} value={oosReason} onChangeText={setOosReason} placeholder="سبب الإخراج من الخدمة" />
            <Button
              title="⛔ إخراج الباص من الخدمة"
              color={colors.red}
              onPress={() => serviceMutation.mutate(true)}
              loading={serviceMutation.isPending}
              disabled={!oosReason}
            />
          </>
        )}
      </Card>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button title="🔧 سجل الصيانة" variant="outline" onPress={() => router.push(`/(school)/bus-maintenance/${id}`)} />
        <Button title="🛣️ المسار والـ Geofence" variant="outline" onPress={() => router.push("/(school)/routes")} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "800", color: colors.navy },
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.amber}22`, borderColor: colors.amber },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.amber, fontWeight: "700" },
});
