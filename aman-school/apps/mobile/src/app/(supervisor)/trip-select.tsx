import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Settings, Smartphone } from "lucide-react-native";
import { Button, Card, GradientHeader, ScreenContainer, StatusPill, colors, roleGradients, EmptyState, ErrorState, LoadingState } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";
import { useSessionStore } from "../../store/session";

const DIRECTION_LABEL: Record<string, string> = { to_school: "ذهاب إلى المدرسة", to_home: "عودة إلى المنزل" };
const SHIFT_LABEL: Record<string, string> = { morning: "🌅 صباحية", evening: "🌇 مسائية" };
const STATUS_TONE: Record<string, "info" | "success" | "warning" | "neutral"> = {
  scheduled: "info",
  active: "warning",
  completed: "success",
  cancelled: "neutral",
};
const STATUS_LABEL: Record<string, string> = { scheduled: "مجدولة", active: "جارية", completed: "مكتملة", cancelled: "ملغاة" };

export default function TripSelectScreen() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user)!;
  const setTripId = useActiveTripStore((s) => s.setTripId);
  const { data: trips, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["supervisor", "trips-today"],
    queryFn: () => api.supervisor.todayTrips(),
  });

  function selectTrip(tripId: string, status: string) {
    setTripId(tripId);
    if (status === "active") router.push("/(supervisor)/scan");
    else router.push("/(supervisor)/student-list");
  }

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.supervisor}
          title={user.name}
          subtitle="رحلات اليوم"
          icon={<Smartphone size={20} color={colors.white} />}
          right={
            <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push("/(supervisor)/settings")}>
              <Settings size={20} color={colors.white} />
            </TouchableOpacity>
          }
        />
      </View>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !trips?.length ? (
        <EmptyState icon="🗓️" title="لا توجد رحلات مجدولة اليوم" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card accentColor={colors.blueMid}>
              <View style={styles.row}>
                <Text style={styles.direction}>{DIRECTION_LABEL[item.direction] ?? item.direction}</Text>
                <StatusPill label={STATUS_LABEL[item.status] ?? item.status} tone={STATUS_TONE[item.status] ?? "neutral"} />
              </View>
              <Text style={styles.shiftLabel}>{SHIFT_LABEL[(item as any).shift] ?? ""}</Text>
              <Text style={styles.time}>{new Date(item.scheduledAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</Text>
              <Button title="اختر هذه الرحلة" onPress={() => selectTrip(item.id, item.status)} color={colors.blueMid} />
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBleed: { marginHorizontal: -16, marginTop: -16, marginBottom: 20 },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  muted: { color: colors.gray600, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  direction: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  shiftLabel: { color: colors.blueMid, fontSize: 11, fontWeight: "700", marginBottom: 2 },
  time: { color: colors.gray600, fontSize: 12, marginBottom: 10 },
});
