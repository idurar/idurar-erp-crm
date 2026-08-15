import { Text, View, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ErrorState, LoadingState, ScreenContainer, SectionHeader, colors, formatPackagePrice, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/** Partner-03: per-school commission breakdown + running total — computed
 * client-side from the same dashboard payload (active schools only earn
 * commission on their monthly package price). */
export default function PartnerCommissionsScreen() {
  const user = useSessionStore((s) => s.user)!;
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["partner-dashboard", user.partnerId],
    queryFn: () => api.partner.dashboard(user.partnerId!) as Promise<{
      partner: { commissionPercent: number; schools: Array<{ id: string; name: string; subscriptionStatus: string; package: { name: string; priceMonthly: number } | null }> };
      monthlyRevenue: number; commission: number;
    }>,
    enabled: !!user.partnerId,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const pct = data?.partner.commissionPercent ?? 0;
  const earning = data?.partner.schools
    .filter((s) => s.subscriptionStatus === "active" && s.package)
    .map((s) => ({ ...s, commission: (s.package!.priceMonthly * pct) / 100 })) ?? [];

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <Card accentColor={roleGradients.partner[0]}>
        <View style={styles.row}><Text style={styles.label}>الإيراد الشهري الإجمالي لمدارسه</Text><Text style={styles.value}>{data?.monthlyRevenue ?? 0} ر.ي</Text></View>
        <View style={styles.row}><Text style={styles.label}>نسبة العمولة</Text><Text style={styles.value}>{pct}%</Text></View>
        <View style={styles.row}><Text style={[styles.label, styles.total]}>إجمالي العمولة الشهرية</Text><Text style={[styles.value, styles.total, { color: colors.greenMid }]}>{data?.commission ?? 0} ر.ي</Text></View>
      </Card>

      <SectionHeader title="تفصيل العمولة حسب المدرسة" />
      {!earning.length ? (
        <EmptyState icon="💰" title="لا توجد عمولات نشطة حالياً" />
      ) : (
        <FlatList
          data={earning}
          keyExtractor={(s) => s.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card accentColor={roleGradients.partner[0]} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.commission}>{item.commission.toFixed(0)} ر.ي</Text>
              </View>
              <Text style={styles.meta}>{item.package?.name} · {formatPackagePrice(item.package?.priceMonthly ?? 0)}</Text>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
  total: { fontWeight: "800", fontSize: 15 },
  card: { marginBottom: 10 },
  name: { fontWeight: "800", color: colors.navy, fontSize: 14 },
  commission: { fontWeight: "800", color: colors.greenMid, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
});
