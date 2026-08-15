import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, SectionHeader, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";
import { useSessionStore } from "../../../store/session";

/* ---- OP-1 / a-supervisor-edit: edit supervisor, reassign bus, reset PIN, end service ---- */
export default function SupervisorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: supervisors } = useQuery({ queryKey: ["school-supervisors", schoolId], queryFn: () => api.school.supervisors(schoolId) as Promise<any[]> });
  const { data: buses } = useQuery({ queryKey: ["school-buses", schoolId], queryFn: () => api.school.buses(schoolId) as Promise<any[]> });
  const supervisor = supervisors?.find((s) => s.id === id);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busId, setBusId] = useState<string | null>(null);

  useEffect(() => {
    if (supervisor) {
      setName(supervisor.name);
      setPhone(supervisor.phone);
      setBusId(supervisor.busId ?? null);
    }
  }, [supervisor]);

  const updateMutation = useMutation({
    mutationFn: () => api.school.updateSupervisor(schoolId, id, { name, phone, busId }),
    onSuccess: () => {
      Alert.alert("تم الحفظ", "تم تحديث بيانات المشرف");
      queryClient.invalidateQueries({ queryKey: ["school-supervisors", schoolId] });
    },
  });

  const resetPinMutation = useMutation({
    mutationFn: () => api.school.resetSupervisorPin(schoolId, id),
    onSuccess: (res: any) => Alert.alert("تم إعادة تعيين الرمز", `PIN الجديد: ${res.devPin}`),
  });

  const endServiceMutation = useMutation({
    mutationFn: () => api.school.endSupervisorService(schoolId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-supervisors", schoolId] });
      router.back();
    },
  });

  function confirmEndService() {
    Alert.alert("إنهاء خدمة المشرف", "سيتم إلغاء تعيينه من الباص وتعطيل دخوله. هل أنت متأكد؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "إنهاء الخدمة", style: "destructive", onPress: () => endServiceMutation.mutate() },
    ]);
  }

  return (
    <ScreenContainer>
      <Card>
        <SectionHeader title="بيانات المشرف" />
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="الاسم" />
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="الجوال" keyboardType="phone-pad" />

        <Text style={styles.label}>الباص المخصص</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity style={[styles.chip, !busId && styles.chipActive]} onPress={() => setBusId(null)}>
            <Text style={[styles.chipText, !busId && styles.chipTextActive]}>بدون</Text>
          </TouchableOpacity>
          {buses?.map((b) => (
            <TouchableOpacity key={b.id} style={[styles.chip, busId === b.id && styles.chipActive]} onPress={() => setBusId(b.id)}>
              <Text style={[styles.chipText, busId === b.id && styles.chipTextActive]}>باص {b.busNumber}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="حفظ التغييرات" onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} disabled={!name || !phone} />
      </Card>

      <Card>
        <SectionHeader title="إجراءات الحساب" accentColor={colors.amber} />
        <Button title="🔑 إعادة تعيين رمز الدخول (PIN)" variant="outline" onPress={() => resetPinMutation.mutate()} loading={resetPinMutation.isPending} />
        <View style={{ height: 8 }} />
        <Button title="🚫 إنهاء الخدمة" color={colors.red} onPress={confirmEndService} loading={endServiceMutation.isPending} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.blueMid}22`, borderColor: colors.blueMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.blueMid, fontWeight: "700" },
});
