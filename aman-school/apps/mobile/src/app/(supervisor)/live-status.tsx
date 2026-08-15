import { Text, View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

export default function LiveStatusScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const { data: roster } = useQuery({ queryKey: ["trip-students", tripId], queryFn: () => api.supervisor.tripStudents(tripId) });
  const { data: live } = useQuery({
    queryKey: ["trip-live-status", tripId],
    queryFn: () => api.supervisor.liveStatus(tripId),
    refetchInterval: 4000,
  });

  const boarded = new Set((live?.events ?? []).filter((e) => e.type === "board").map((e) => e.studentId));
  const alighted = new Set((live?.events ?? []).filter((e) => e.type === "alight").map((e) => e.studentId));

  return (
    <ScreenContainer>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{boarded.size} صعدوا · {(roster?.length ?? 0) - boarded.size} لم يصعدوا بعد · {roster?.length ?? 0} الإجمالي</Text>
      </View>

      <FlatList
        data={roster}
        keyExtractor={(s) => s.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <StatusPill
                label={alighted.has(item.id) ? "نزل" : boarded.has(item.id) ? "على متن الباص" : "لم يصعد بعد"}
                tone={alighted.has(item.id) ? "neutral" : boarded.has(item.id) ? "success" : "warning"}
              />
            </View>
          </Card>
        )}
      />

      <Button title="العودة للمسح" onPress={() => router.push("/(supervisor)/scan")} />
      <Button title="تسجيل حالة استثنائية" variant="outline" color={colors.amber} onPress={() => router.push("/(supervisor)/exception")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: { backgroundColor: colors.blueLight, borderRadius: 10, padding: 12, marginBottom: 12 },
  summaryText: { color: colors.blueMid, fontWeight: "700", textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
});
