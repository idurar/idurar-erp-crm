import { Text, View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ErrorState, LoadingState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const SOON_MS = 30 * 24 * 60 * 60 * 1000; // flag anything expiring within 30 days

function expiryTone(date: string | null): "success" | "warning" | "danger" | "neutral" {
  if (!date) return "neutral";
  const diff = new Date(date).getTime() - Date.now();
  if (diff < 0) return "danger";
  if (diff < SOON_MS) return "warning";
  return "success";
}

function expiryLabel(date: string | null): string {
  if (!date) return "غير محدد";
  const diff = new Date(date).getTime() - Date.now();
  if (diff < 0) return `منتهٍ منذ ${Math.abs(Math.round(diff / 86400000))} يوم`;
  return new Date(date).toLocaleDateString("ar-YE");
}

/** school_admin-maintenance: fleet-wide maintenance overview — every bus's
 * out-of-service state + last service date + inspection/insurance expiry at
 * once, flagging anything due within 30 days. Per-bus history lives at
 * bus-maintenance/[id] (linked from here). */
export default function FleetMaintenanceScreen() {
  const router = useRouter();
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const { data: buses, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["school-buses", schoolId],
    queryFn: () => api.school.buses(schoolId) as Promise<any[]>,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      {!buses?.length ? (
        <EmptyState icon="🔧" title="لا توجد باصات بعد" />
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(b) => b.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card
              accentColor={item.outOfService ? colors.red : colors.amber}
              style={styles.card}
              onPress={() => router.push(`/(school)/bus-maintenance/${item.id}`)}
            >
              <View style={styles.row}>
                <Text style={styles.title}>باص {item.busNumber} — {item.plateNumber}</Text>
                {item.outOfService ? <StatusPill label="خارج الخدمة" tone="danger" /> : null}
              </View>
              <Text style={styles.meta}>آخر صيانة: {item.lastMaintenanceAt ? new Date(item.lastMaintenanceAt).toLocaleDateString("ar-YE") : "لا يوجد سجل"}</Text>
              <View style={styles.chipsRow}>
                <StatusPill label={`الفحص الفني: ${expiryLabel(item.inspectionExpiresAt)}`} tone={expiryTone(item.inspectionExpiresAt)} />
                <StatusPill label={`التأمين: ${expiryLabel(item.insuranceExpiresAt)}`} tone={expiryTone(item.insuranceExpiresAt)} />
              </View>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontWeight: "800", color: colors.navy, fontSize: 13, flex: 1 },
  meta: { fontSize: 12, color: colors.gray600, marginTop: 4, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
