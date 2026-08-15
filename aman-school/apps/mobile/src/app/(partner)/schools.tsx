import { Text, View, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ErrorState, LoadingState, ScreenContainer, StatusPill, colors, formatPackagePrice, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const STATUS_TONE: Record<string, "success" | "warning" | "info" | "danger" | "neutral"> = {
  active: "success",
  trial: "info",
  grace: "warning",
  suspended: "danger",
  cancelled: "neutral",
};
const STATUS_LABEL: Record<string, string> = {
  active: "نشط", trial: "تجريبي", grace: "فترة سماح", suspended: "موقوف", cancelled: "ملغى",
};

/** Partner-02: the schools this partner referred/manages, with each school's
 * subscription state and package — read straight off the shared dashboard
 * payload so no extra backend route is needed. */
export default function PartnerSchoolsScreen() {
  const user = useSessionStore((s) => s.user)!;
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["partner-dashboard", user.partnerId],
    queryFn: () => api.partner.dashboard(user.partnerId!) as Promise<{
      partner: { schools: Array<{ id: string; name: string; address: string | null; subscriptionStatus: string; package: { name: string; priceMonthly: number } | null }> };
    }>,
    enabled: !!user.partnerId,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  const schools = data?.partner.schools ?? [];

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      {!schools.length ? (
        <EmptyState icon="🏫" title="لا توجد مدارس مُحالة بعد" />
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(s) => s.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card accentColor={roleGradients.partner[0]} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <StatusPill label={STATUS_LABEL[item.subscriptionStatus] ?? item.subscriptionStatus} tone={STATUS_TONE[item.subscriptionStatus] ?? "neutral"} />
              </View>
              {item.address ? <Text style={styles.meta}>{item.address}</Text> : null}
              <Text style={styles.meta}>{item.package ? `${item.package.name} · ${formatPackagePrice(item.package.priceMonthly)}` : "بدون باقة"}</Text>
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
  name: { fontWeight: "800", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
});
