import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

export default function ReportScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const setTripId = useActiveTripStore((s) => s.setTripId);
  const { data } = useQuery({
    queryKey: ["trip-report", tripId],
    queryFn: () => api.supervisor.tripReport(tripId) as Promise<{
      totalBoarded: number; totalAlighted: number; durationMinutes: number | null; exceptions: unknown[];
    }>,
  });

  return (
    <ScreenContainer>
      <Text style={styles.title}>ملخص الرحلة</Text>
      <Card accentColor={colors.greenMid}>
        <View style={styles.row}><Text style={styles.label}>إجمالي الصاعدين</Text><Text style={styles.value}>{data?.totalBoarded ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>إجمالي النازلين</Text><Text style={styles.value}>{data?.totalAlighted ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>مدة الرحلة</Text><Text style={styles.value}>{data?.durationMinutes != null ? `${data.durationMinutes} دقيقة` : "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>الاستثناءات</Text><Text style={styles.value}>{data?.exceptions?.length ?? 0}</Text></View>
      </Card>
      <Button
        title="العودة لاختيار الرحلة"
        onPress={() => {
          setTripId(null);
          router.replace("/(supervisor)/trip-select");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "800", color: colors.navy, marginBottom: 16, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
});
