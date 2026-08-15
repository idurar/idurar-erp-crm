import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, Linking, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Button, ScreenContainer, colors } from "@aman-school/shared-ui";
import { YEMEN_EMERGENCY_NUMBERS } from "@aman-school/types";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

export default function SosScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId);
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  async function sendSos() {
    setSending(true);
    try {
      let lat = 12.7797; // عدن (fallback if location permission is denied)
      let lng = 45.0369;
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status === "granted") {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
      await api.supervisor.sos({ tripId, lat, lng, description: description || undefined });
      Alert.alert("تم الإرسال", "تم إرسال تنبيه الطوارئ لغرفة العمليات مع موقعك.");
      router.back();
    } catch {
      Alert.alert("تعذر الإرسال", "تحقق من الاتصال بالإنترنت وحاول مرة أخرى، أو اتصل مباشرة بغرفة العمليات.");
    } finally {
      setSending(false);
    }
  }

  function confirmAndSend() {
    Alert.alert("هل أنت في حالة طوارئ؟", "سيتم إرسال موقعك فوراً لغرفة العمليات", [
      { text: "إلغاء", style: "cancel" },
      { text: "نعم، أرسل الآن", style: "destructive", onPress: sendSos },
    ]);
  }

  return (
    <ScreenContainer backgroundColor={colors.redLight}>
      <View style={styles.icon}><Text style={{ fontSize: 56 }}>🆘</Text></View>
      <Text style={styles.title}>طوارئ SOS</Text>
      <Text style={styles.subtitle}>يرسل تنبيهاً فورياً لغرفة العمليات مع موقعك الحالي</Text>

      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="وصف الطوارئ (اختياري)"
        multiline
      />

      <Button title="إرسال تنبيه الطوارئ" onPress={confirmAndSend} loading={sending} color={colors.red} />
      <Button title="إلغاء" variant="outline" onPress={() => router.back()} />

      <Text style={styles.emergencyTitle}>أرقام الطوارئ الرسمية في اليمن</Text>
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: "center", marginVertical: 16 },
  title: { fontSize: 20, fontWeight: "800", color: colors.red, textAlign: "center" },
  subtitle: { fontSize: 12, color: colors.gray700, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: colors.red, borderRadius: 10, padding: 12, minHeight: 80,
    textAlignVertical: "top", backgroundColor: colors.white, marginBottom: 16,
  },
  emergencyTitle: { fontSize: 12, fontWeight: "700", color: colors.gray700, textAlign: "center", marginTop: 24, marginBottom: 10 },
  emergencyRow: { flexDirection: "row", gap: 10 },
  emergencyCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.gray200,
    alignItems: "center", paddingVertical: 14,
  },
  emergencyIcon: { fontSize: 22 },
  emergencyLabel: { fontSize: 11, color: colors.gray700, marginTop: 4 },
  emergencyNumber: { fontSize: 16, fontWeight: "800", color: colors.red, marginTop: 2 },
});
