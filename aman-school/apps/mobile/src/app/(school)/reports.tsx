import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

export default function ReportsScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const { data } = useQuery({
    queryKey: ["school-reports", schoolId],
    queryFn: () => api.school.reports(schoolId) as Promise<{
      tripsScheduled: number; tripsCompleted: number; tripsCancelled: number;
      alertsByType: Record<string, number>;
    }>,
  });

  return (
    <ScreenContainer>
      <Text style={styles.title}>آخر 30 يوماً</Text>
      <Card accentColor={colors.amber}>
        <View style={styles.row}><Text style={styles.label}>رحلات مجدولة</Text><Text style={styles.value}>{data?.tripsScheduled ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>رحلات مكتملة</Text><Text style={styles.value}>{data?.tripsCompleted ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>رحلات ملغاة</Text><Text style={styles.value}>{data?.tripsCancelled ?? "-"}</Text></View>
      </Card>
      <Card accentColor={colors.red}>
        <Text style={styles.subtitle}>التنبيهات حسب النوع</Text>
        {data?.alertsByType && Object.entries(data.alertsByType).map(([k, v]) => (
          <View style={styles.row} key={k}><Text style={styles.label}>{k}</Text><Text style={styles.value}>{v}</Text></View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 14, fontWeight: "700", color: colors.navy, marginBottom: 10 },
  subtitle: { fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  label: { color: colors.gray600, fontSize: 12 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 12 },
});
