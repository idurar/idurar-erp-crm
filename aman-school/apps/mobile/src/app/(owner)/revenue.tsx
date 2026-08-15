import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

export default function RevenueScreen() {
  const { data } = useQuery({
    queryKey: ["owner-revenue"],
    queryFn: () => api.owner.revenueSummary() as Promise<{ monthlyRevenue: number; annualRevenue: number; activeSchools: number }>,
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.purpleMid}>
        <View style={styles.row}><Text style={styles.label}>الإيراد الشهري</Text><Text style={styles.value}>{data?.monthlyRevenue ?? "-"} ر.ي</Text></View>
        <View style={styles.row}><Text style={styles.label}>الإيراد السنوي المقدّر</Text><Text style={styles.value}>{data?.annualRevenue ?? "-"} ر.ي</Text></View>
        <View style={styles.row}><Text style={styles.label}>المدارس النشطة</Text><Text style={styles.value}>{data?.activeSchools ?? "-"}</Text></View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
});
