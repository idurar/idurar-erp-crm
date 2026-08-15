import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/* ---- OP-2 / driver roster: distinct 8th role, separate from supervisor ---- */
export default function DriversScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [busId, setBusId] = useState<string | null>(null);

  const { data: drivers } = useQuery({ queryKey: ["school-drivers", schoolId], queryFn: () => api.school.drivers(schoolId) as Promise<any[]> });
  const { data: buses } = useQuery({ queryKey: ["school-buses", schoolId], queryFn: () => api.school.buses(schoolId) as Promise<any[]> });

  const createMutation = useMutation({
    mutationFn: () =>
      api.school.createDriver(schoolId, {
        name, phone, licenseNumber,
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
        busId: busId ?? undefined,
      }),
    onSuccess: (res: any) => {
      setName(""); setPhone(""); setLicenseNumber(""); setYearsExperience(""); setBusId(null);
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["school-drivers", schoolId] });
      if (res.devEmployeeCode) Alert.alert("تم الإنشاء", `رمز الموظف: ${res.devEmployeeCode}\nPIN: ${res.devPin}`);
    },
  });

  return (
    <ScreenContainer>
      <FlatList
        data={drivers}
        keyExtractor={(d) => d.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card accentColor={colors.tealMid}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.employeeCode} · {item.phone}{(item as any).busNumber ? ` · باص ${(item as any).busNumber}` : ""}
            </Text>
            <Text style={styles.meta}>الرخصة: {item.licenseNumber ?? "-"} · الخبرة: {item.yearsExperience ?? 0} سنة</Text>
          </Card>
        )}
      />

      {showAdd ? (
        <View style={{ marginTop: 8 }}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم السائق" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="رقم الجوال" keyboardType="phone-pad" />
          <TextInput style={styles.input} value={licenseNumber} onChangeText={setLicenseNumber} placeholder="رقم رخصة القيادة" />
          <TextInput style={styles.input} value={yearsExperience} onChangeText={setYearsExperience} placeholder="سنوات الخبرة" keyboardType="number-pad" />

          <Text style={styles.label}>تعيين باص (اختياري)</Text>
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

          <Button
            title="حفظ"
            onPress={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!name || !phone || !licenseNumber}
          />
        </View>
      ) : (
        <Button title="+ إضافة سائق" onPress={() => setShowAdd(true)} color={colors.tealMid} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.tealMid}22`, borderColor: colors.tealMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.tealMid, fontWeight: "700" },
});
