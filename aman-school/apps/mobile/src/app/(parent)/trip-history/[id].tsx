import { useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

const STATUS_LABEL: Record<string, string> = { scheduled: "مجدولة", active: "جارية", completed: "مكتملة", cancelled: "ملغاة" };
const DIRECTION_LABEL: Record<string, string> = { to_school: "ذهاب", to_home: "عودة" };
const STARS = [1, 2, 3, 4, 5];

/* ---- OP-9 / p-rate-trip: parent rates a completed trip (1-5 stars + note) ---- */
function RateTripRow({ trip }: { trip: any }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(0);
  const existing = trip.ratings?.[0];

  const rateMutation = useMutation({
    mutationFn: (stars: number) => api.parent.rateTrip(trip.id, stars),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-trips"] }),
  });

  if (existing) {
    return <Text style={styles.ratedText}>تقييمك: {"⭐".repeat(existing.stars)}</Text>;
  }

  return (
    <View style={styles.starsRow}>
      {STARS.map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => {
            setSelected(n);
            rateMutation.mutate(n);
          }}
        >
          <Text style={styles.star}>{n <= selected ? "⭐" : "☆"}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function TripHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const from = new Date(Date.now() - 30 * 86400000).toISOString();
  const to = new Date().toISOString();
  const { data: trips } = useQuery({
    queryKey: ["student-trips", id],
    queryFn: () => api.parent.studentTrips(id, from, to) as Promise<any[]>,
  });

  return (
    <ScreenContainer>
      {!trips?.length ? (
        <EmptyState icon="🗓️" title="لا يوجد رحلات مسجلة" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ fontWeight: "700", color: colors.navy }}>
                {new Date(item.scheduledAt).toLocaleDateString("ar-SA")} · {DIRECTION_LABEL[item.direction] ?? item.direction}
              </Text>
              <StatusPill label={STATUS_LABEL[item.status] ?? item.status} tone={item.status === "completed" ? "success" : "info"} />
              {item.status === "completed" ? <RateTripRow trip={item} /> : null}
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  starsRow: { flexDirection: "row", gap: 4, marginTop: 10 },
  star: { fontSize: 20 },
  ratedText: { color: colors.gray600, fontSize: 12, marginTop: 8, fontWeight: "700" },
});
