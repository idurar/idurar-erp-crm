import { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

const TYPES = ["تأخير", "حادث", "غياب", "أخرى"];

export default function ExceptionScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const [type, setType] = useState(TYPES[0]);
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: () => api.supervisor.recordException(tripId, { type, description }),
    onSuccess: () => router.back(),
  });

  return (
    <ScreenContainer>
      <Text style={styles.label}>نوع الاستثناء</Text>
      <View style={styles.typeRow}>
        {TYPES.map((t) => (
          <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeChip, type === t && styles.typeChipActive]}>
            <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>الوصف</Text>
      <TextInput style={styles.textarea} value={description} onChangeText={setDescription} multiline placeholder="اكتب التفاصيل هنا..." />
      <Button title="إرسال لغرفة العمليات" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!description} color={colors.amber} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 6 },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  typeChip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  typeChipActive: { backgroundColor: colors.amberLight, borderColor: colors.amber },
  typeText: { fontSize: 12, color: colors.gray700 },
  typeTextActive: { color: colors.amber, fontWeight: "700" },
  textarea: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, padding: 12, minHeight: 100,
    textAlignVertical: "top", backgroundColor: colors.white, marginBottom: 14,
  },
});
