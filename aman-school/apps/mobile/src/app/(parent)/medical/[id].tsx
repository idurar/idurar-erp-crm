import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "غير معروف"];

/* ---- SF-2: medical profile — parent-managed, emergency-only for supervisors ---- */
export default function MedicalProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile } = useQuery({
    queryKey: ["medical-profile", id],
    queryFn: () => api.parent.medicalProfile(id) as Promise<any>,
  });

  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    if (profile) {
      setBloodType(profile.bloodType ?? "");
      setAllergies(profile.allergies ?? []);
      setMedications(profile.medications ?? []);
      setChronicConditions(profile.chronicConditions ?? "");
      setEmergencyContactName(profile.emergencyContactName ?? "");
      setEmergencyContactPhone(profile.emergencyContactPhone ?? "");
      setDoctorName(profile.doctorName ?? "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.parent.updateMedicalProfile(id, {
        bloodType: bloodType || undefined, allergies, medications, chronicConditions: chronicConditions || undefined,
        emergencyContactName, emergencyContactPhone, doctorName: doctorName || undefined,
      }),
    onSuccess: () => Alert.alert("تم الحفظ", "تم تحديث الملف الطبي"),
  });

  return (
    <ScreenContainer>
      <SectionHeader title="🩸 فصيلة الدم" accentColor={colors.greenMid} />
      <View style={styles.chipsRow}>
        {BLOOD_TYPES.map((bt) => (
          <Text
            key={bt}
            style={[styles.chip, bloodType === bt && styles.chipActive]}
            onPress={() => setBloodType(bt)}
          >
            {bt}
          </Text>
        ))}
      </View>

      <SectionHeader title="⚠️ الحساسية" accentColor={colors.greenMid} />
      {allergies.map((a, i) => (
        <Card key={i}>
          <Text style={styles.itemText}>{a}</Text>
          <Text style={styles.removeLink} onPress={() => setAllergies((prev) => prev.filter((_, idx) => idx !== i))}>إزالة</Text>
        </Card>
      ))}
      <View style={styles.addRow}>
        <TextInput style={[styles.input, { flex: 1 }]} value={newAllergy} onChangeText={setNewAllergy} placeholder="أضف حساسية" />
        <Button title="+" variant="outline" onPress={() => { if (newAllergy.trim()) { setAllergies((p) => [...p, newAllergy.trim()]); setNewAllergy(""); } }} />
      </View>

      <SectionHeader title="💊 أدوية دائمة" accentColor={colors.greenMid} />
      {medications.map((m, i) => (
        <Card key={i}>
          <Text style={styles.itemText}>{m}</Text>
          <Text style={styles.removeLink} onPress={() => setMedications((prev) => prev.filter((_, idx) => idx !== i))}>إزالة</Text>
        </Card>
      ))}
      <View style={styles.addRow}>
        <TextInput style={[styles.input, { flex: 1 }]} value={newMedication} onChangeText={setNewMedication} placeholder="أضف دواء" />
        <Button title="+" variant="outline" onPress={() => { if (newMedication.trim()) { setMedications((p) => [...p, newMedication.trim()]); setNewMedication(""); } }} />
      </View>

      <SectionHeader title="🏥 حالات مزمنة" accentColor={colors.greenMid} />
      <TextInput style={styles.input} value={chronicConditions} onChangeText={setChronicConditions} placeholder="مثل الربو، السكري" />

      <SectionHeader title="📞 رقم طوارئ إضافي (غير ولي الأمر)" accentColor={colors.greenMid} />
      <TextInput style={styles.input} value={emergencyContactName} onChangeText={setEmergencyContactName} placeholder="الاسم" />
      <TextInput style={styles.input} value={emergencyContactPhone} onChangeText={setEmergencyContactPhone} placeholder="+967 77xxxxxxx" keyboardType="phone-pad" />

      <SectionHeader title="⚕️ اسم الطبيب المتابع (اختياري)" accentColor={colors.greenMid} />
      <TextInput style={styles.input} value={doctorName} onChangeText={setDoctorName} placeholder="اسم الطبيب" />

      <Card accentColor={colors.amber}>
        <Text style={styles.accessNote}>🔒 من يرى هذه البيانات؟</Text>
        <Text style={styles.accessItem}>• مدير المدرسة وغرفة العمليات: دائماً</Text>
        <Text style={styles.accessItem}>• مشرف الباص: فقط عند ضغط "طوارئ طبية" (مُسجَّل)</Text>
      </Card>

      <Button
        title="💾 حفظ التحديثات"
        onPress={() => saveMutation.mutate()}
        loading={saveMutation.isPending}
        disabled={!emergencyContactName || !emergencyContactPhone}
        color={colors.greenMid}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 12, color: colors.gray700, overflow: "hidden",
  },
  chipActive: { backgroundColor: `${colors.greenMid}22`, borderColor: colors.greenMid, color: colors.greenMid, fontWeight: "700" },
  itemText: { color: colors.navy, fontSize: 13 },
  removeLink: { color: colors.red, fontSize: 11, marginTop: 4 },
  addRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 12,
  },
  accessNote: { fontSize: 12, fontWeight: "700", color: colors.amber, marginBottom: 4 },
  accessItem: { fontSize: 11, color: colors.gray700, marginTop: 2 },
});
