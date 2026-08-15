import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Alert, Linking, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, ScreenContainer, colors, roleColors } from "@aman-school/shared-ui";
import { YEMEN_EMERGENCY_NUMBERS } from "@aman-school/types";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/** Reusable "contact platform support" screen shared across every role that
 * doesn't already have a bespoke one (parent has its own richer contact.tsx
 * with SOS context — this covers school_admin/ops_room/supervisor/driver/
 * sysadmin/owner). */
export function SupportContactScreen() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user)!;
  const accent = roleColors[user.role] ?? colors.navy;
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: () => api.support.contact({ message, channel: "app" }),
    onSuccess: () => {
      Alert.alert("تم الإرسال", "سيتواصل معك فريق الدعم قريباً");
      router.back();
    },
  });

  return (
    <ScreenContainer>
      <Text style={styles.intro}>للطوارئ الفورية اتصل مباشرة بالأرقام أدناه، وإلا أرسل رسالتك لفريق الدعم الفني.</Text>

      <View style={styles.emergencyRow}>
        <TouchableOpacity style={styles.emergencyCard} onPress={() => Linking.openURL(`tel:${YEMEN_EMERGENCY_NUMBERS.ambulance}`)}>
          <Text style={styles.emergencyIcon}>🚑</Text>
          <Text style={styles.emergencyLabel}>الإسعاف</Text>
          <Text style={styles.emergencyNumber}>{YEMEN_EMERGENCY_NUMBERS.ambulance}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyCard} onPress={() => Linking.openURL(`tel:${YEMEN_EMERGENCY_NUMBERS.police}`)}>
          <Text style={styles.emergencyIcon}>🚓</Text>
          <Text style={styles.emergencyLabel}>الشرطة</Text>
          <Text style={styles.emergencyNumber}>{YEMEN_EMERGENCY_NUMBERS.police}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="اكتب رسالتك إلى فريق الدعم الفني"
        placeholderTextColor={colors.gray400}
        multiline
      />
      <Button title="إرسال" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!message} color={accent} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 12, color: colors.gray600, marginBottom: 14, textAlign: "center" },
  emergencyRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  emergencyCard: { flex: 1, backgroundColor: colors.redLight, borderRadius: 12, alignItems: "center", paddingVertical: 14 },
  emergencyIcon: { fontSize: 20 },
  emergencyLabel: { fontSize: 11, color: colors.gray700, marginTop: 4 },
  emergencyNumber: { fontSize: 16, fontWeight: "800", color: colors.red },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, padding: 12, minHeight: 100,
    textAlignVertical: "top", backgroundColor: colors.white, marginBottom: 14,
  },
});
