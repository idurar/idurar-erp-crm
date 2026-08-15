import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

/** OWN-07: platform-wide analytics — retention snapshot + package distribution. */
export default function OwnerAnalyticsScreen() {
  const { data } = useQuery({
    queryKey: ["owner-analytics"],
    queryFn: () => api.owner.analytics() as Promise<{
      totalSchools: number; activeSchools: number; schoolsByPackage: Record<string, number>;
    }>,
  });

  const total = data?.totalSchools ?? 0;
  const retentionPct = total > 0 ? Math.round(((data?.activeSchools ?? 0) / total) * 100) : 0;

  return (
    <ScreenContainer>
      <Card accentColor={colors.purpleMid}>
        <View style={styles.row}><Text style={styles.label}>إجمالي المدارس</Text><Text style={styles.value}>{data?.totalSchools ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>المدارس النشطة</Text><Text style={styles.value}>{data?.activeSchools ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>معدل الاحتفاظ (Retention)</Text><Text style={styles.value}>{retentionPct}%</Text></View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>توزيع المدارس حسب الباقة</Text>
        {data?.schoolsByPackage &&
          Object.entries(data.schoolsByPackage).map(([pkg, count]) => (
            <View style={styles.row} key={pkg}>
              <Text style={styles.label}>{pkg}</Text>
              <Text style={styles.value}>{count}</Text>
            </View>
          ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
  sectionTitle: { fontWeight: "700", color: colors.navy, marginBottom: 8, fontSize: 13 },
});
