import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

const REASONS = ["اليوم صباحاً", "أمس", "خلال هذا الأسبوع", "لا أعرف بالتحديد"];

/* ---- SF-4: report a lost NFC bracelet — revokes it immediately ---- */
export default function LostNfcScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: student } = useQuery({ queryKey: ["student-details", id], queryFn: () => api.parent.studentDetails(id) as Promise<any> });
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.parent.reportLostNfc(id, note ? `${reason} — ${note}` : reason),
    onSuccess: () => setConfirmed(true),
  });

  if (confirmed) {
    return (
      <ScreenContainer>
        <View style={styles.resultCard}>
          <Text style={styles.resultLine}>✅ تم إبطال السوار القديم فوراً</Text>
          <Text style={styles.resultLine}>📩 تم إشعار المدرسة لإصدار بديل</Text>
          <Text style={styles.resultLine}>⏳ سيستخدم المشرف "إدخال يدوي" مؤقتاً حتى استلام السوار الجديد</Text>
        </View>
        <Button title="عودة" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>إبلاغ فقدان سوار — {student?.name}</Text>
        <Text style={styles.subtitle}>
          السوار الحالي: {student?.code}. سيتم إبطاله فوراً عند التأكيد ولن يعمل بعد الآن حتى لو عُثر عليه.
        </Text>
      </View>

      <Text style={styles.label}>متى فُقد السوار؟</Text>
      <View style={styles.chipsRow}>
        {REASONS.map((r) => (
          <Text key={r} style={[styles.chip, reason === r && styles.chipActive]} onPress={() => setReason(r)}>{r}</Text>
        ))}
      </View>

      <Text style={styles.label}>ملاحظة إضافية (اختياري)</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="ملاحظة" multiline />

      <Button
        title="🚫 تأكيد الإبلاغ وإبطال السوار"
        color={colors.red}
        onPress={() =>
          Alert.alert("تأكيد", "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.", [
            { text: "إلغاء", style: "cancel" },
            { text: "تأكيد", style: "destructive", onPress: () => mutation.mutate() },
          ])
        }
        loading={mutation.isPending}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 20, gap: 8 },
  icon: { fontSize: 40 },
  title: { fontSize: 16, fontWeight: "800", color: colors.navy, textAlign: "center" },
  subtitle: { fontSize: 12, color: colors.gray600, textAlign: "center" },
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 12, color: colors.gray700, overflow: "hidden",
  },
  chipActive: { backgroundColor: `${colors.red}22`, borderColor: colors.red, color: colors.red, fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, padding: 12, minHeight: 70,
    textAlignVertical: "top", backgroundColor: colors.white, marginBottom: 20,
  },
  resultCard: { backgroundColor: colors.greenLight, borderRadius: 12, padding: 16, marginBottom: 20, gap: 8 },
  resultLine: { fontSize: 13, color: colors.greenMid, fontWeight: "600" },
});
