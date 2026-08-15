import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

export default function DailyReportScreen() {
  const { data } = useQuery({
    queryKey: ["ops-daily-report"],
    queryFn: () => api.operations.dailyReport() as Promise<{
      tripsCompleted: number; tripsActive: number; tripsCancelled: number;
      studentsTransported: number; alertsTotal: number;
      alertsByPriority: Record<string, number>;
    }>,
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.blueMid}>
        <View style={styles.row}><Text style={styles.label}>رحلات مكتملة</Text><Text style={styles.value}>{data?.tripsCompleted ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>رحلات جارية</Text><Text style={styles.value}>{data?.tripsActive ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>طلاب تم نقلهم</Text><Text style={styles.value}>{data?.studentsTransported ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>إجمالي التنبيهات</Text><Text style={styles.value}>{data?.alertsTotal ?? "-"}</Text></View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
});
