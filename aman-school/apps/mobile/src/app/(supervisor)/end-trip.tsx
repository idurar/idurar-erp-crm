import { useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

export default function EndTripScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const [pending, setPending] = useState<Array<{ id: string; name: string; code: string }> | null>(null);
  const [loading, setLoading] = useState(false);

  async function onEnd() {
    setLoading(true);
    setPending(null);
    try {
      await api.supervisor.endTrip(tripId);
      router.replace("/(supervisor)/report");
    } catch (e) {
      if (e instanceof HttpError) {
        const details = e.body as { details?: { studentsStillOnBus?: typeof pending } };
        setPending(details.details?.studentsStillOnBus ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>هل جميع الطلاب نزلوا؟</Text>

      {pending && pending.length > 0 ? (
        <>
          <View style={styles.warning}>
            <Text style={styles.warningText}>لا يزال {pending.length} طالب لم يُسجل نزوله — لا يمكن إنهاء الرحلة</Text>
          </View>
          <FlatList
            data={pending}
            keyExtractor={(s) => s.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Card accentColor={colors.red}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.code}>{item.code}</Text>
              </Card>
            )}
          />
          <Button title="العودة للمسح لتسجيل النزول" onPress={() => router.push("/(supervisor)/scan")} color={colors.red} />
        </>
      ) : (
        <Button title="إنهاء الرحلة" onPress={onEnd} loading={loading} color={colors.navy} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "800", color: colors.navy, marginBottom: 16, textAlign: "center" },
  warning: { backgroundColor: colors.redLight, borderRadius: 10, padding: 12, marginBottom: 12 },
  warningText: { color: colors.red, fontWeight: "700", textAlign: "center", fontSize: 12 },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  code: { color: colors.gray600, fontSize: 12, fontFamily: "monospace" },
});
