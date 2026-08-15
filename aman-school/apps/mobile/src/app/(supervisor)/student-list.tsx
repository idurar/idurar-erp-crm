import { useState } from "react";
import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

/** S-03 (roster review) + S-04 (start trip) combined into one screen. */
export default function StudentListScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: students, isLoading } = useQuery({
    queryKey: ["trip-students", tripId],
    queryFn: () => api.supervisor.tripStudents(tripId),
  });

  async function onStart() {
    setError(null);
    setStarting(true);
    try {
      await api.supervisor.startTrip(tripId);
      router.replace("/(supervisor)/scan");
    } catch (e) {
      setError(e instanceof HttpError ? String((e.body as any)?.error ?? "تعذر بدء الرحلة") : "تعذر بدء الرحلة — تحقق من GPS والاتصال");
    } finally {
      setStarting(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.header}>{isLoading ? "..." : `${students?.length ?? 0} طالب متوقع`}</Text>
      <FlatList
        data={students}
        keyExtractor={(s) => s.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text>👤</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.grade}>{item.grade} · {item.code}</Text>
              </View>
            </View>
          </Card>
        )}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="بدء الرحلة الآن" onPress={onStart} loading={starting} color={colors.blueMid} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 15, fontWeight: "700", color: colors.navy, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: { backgroundColor: colors.gray100, alignItems: "center", justifyContent: "center" },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  grade: { color: colors.gray600, fontSize: 12 },
  error: { color: colors.red, fontSize: 12, marginBottom: 8, textAlign: "center" },
});
