import { Text, View, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ErrorState, LoadingState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const DIRECTION_LABEL: Record<string, string> = { to_school: "ذهاب", to_home: "عودة" };
const STATUS_LABEL: Record<string, string> = { completed: "مكتملة", cancelled: "ملغاة" };

/** supervisor-history: this supervisor's own past completed/cancelled trips. */
export default function SupervisorHistoryScreen() {
  const { data: trips, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["supervisor-trip-history"],
    queryFn: () => api.supervisor.tripHistory() as Promise<any[]>,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      {!trips?.length ? (
        <EmptyState icon="🗓️" title="لا توجد رحلات سابقة" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const boarded = item.events?.filter((e: any) => e.type === "board").length ?? 0;
            const alighted = item.events?.filter((e: any) => e.type === "alight").length ?? 0;
            return (
              <Card style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.title}>
                    {new Date(item.scheduledAt).toLocaleDateString("ar-YE")} · {DIRECTION_LABEL[item.direction] ?? item.direction}
                  </Text>
                  <StatusPill label={STATUS_LABEL[item.status] ?? item.status} tone={item.status === "completed" ? "success" : "danger"} />
                </View>
                <Text style={styles.meta}>الباص: {item.bus?.busNumber ?? "-"} ({item.bus?.plateNumber ?? "-"})</Text>
                {item.status === "completed" ? (
                  <Text style={styles.meta}>صعود: {boarded} · نزول: {alighted}</Text>
                ) : null}
              </Card>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  title: { fontWeight: "800", color: colors.navy, fontSize: 13, flex: 1 },
  meta: { fontSize: 12, color: colors.gray600, marginTop: 2 },
});
