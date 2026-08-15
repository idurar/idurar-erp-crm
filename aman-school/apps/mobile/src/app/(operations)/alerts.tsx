import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const PRIORITY_TONE: Record<string, "danger" | "warning" | "info"> = {
  urgent_critical: "danger",
  urgent: "warning",
  notice: "info",
};
const PRIORITY_LABEL: Record<string, string> = { urgent_critical: "عاجل جداً", urgent: "عاجل", notice: "تنبيه" };

export default function OpsAlertsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: alerts } = useQuery({ queryKey: ["active-alerts"], queryFn: () => api.operations.alerts("active"), refetchInterval: 6000 });

  const ackMutation = useMutation({
    mutationFn: (id: string) => api.operations.acknowledgeAlert(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["active-alerts"] }),
  });

  if (!alerts?.length) return <ScreenContainer><EmptyState icon="✅" title="لا توجد تنبيهات نشطة" /></ScreenContainer>;

  return (
    <ScreenContainer>
      {alerts.map((a) => (
        <Card key={a.id} accentColor={colors.red}>
          <View style={styles.row}>
            <StatusPill label={PRIORITY_LABEL[a.priority] ?? a.priority} tone={PRIORITY_TONE[a.priority] ?? "info"} />
            <Text style={styles.time}>{new Date(a.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</Text>
          </View>
          <Text style={styles.message}>{a.message}</Text>
          <View style={styles.actions}>
            {a.status === "active" ? (
              <Button title="تلقيت وأتخذ إجراء" onPress={() => ackMutation.mutate(a.id)} color={colors.blueMid} />
            ) : null}
            <TouchableOpacity onPress={() => router.push(`/(operations)/incident/${a.id}`)}>
              <Text style={styles.detailLink}>عرض التفاصيل ›</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  time: { color: colors.gray400, fontSize: 11 },
  message: { color: colors.navy, fontWeight: "600", marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailLink: { color: colors.blueMid, fontWeight: "700", fontSize: 12 },
});
