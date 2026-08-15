import { Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const PRIORITY_TONE: Record<string, "danger" | "warning" | "info"> = {
  urgent_critical: "danger",
  urgent: "warning",
  notice: "info",
};
const PRIORITY_LABEL: Record<string, string> = { urgent_critical: "عاجل جداً", urgent: "عاجل", notice: "تنبيه" };

export default function SchoolAlertsScreen() {
  const { data: alerts } = useQuery({ queryKey: ["school-alerts"], queryFn: () => api.operations.alerts("active") });

  if (!alerts?.length) return <ScreenContainer><EmptyState icon="✅" title="لا توجد تنبيهات نشطة" /></ScreenContainer>;

  return (
    <ScreenContainer>
      {alerts.map((a) => (
        <Card key={a.id} accentColor={colors.red}>
          <StatusPill label={PRIORITY_LABEL[a.priority] ?? a.priority} tone={PRIORITY_TONE[a.priority] ?? "info"} />
          <Text style={{ marginTop: 6, color: colors.navy, fontWeight: "600" }}>{a.message}</Text>
          <Text style={{ color: colors.gray400, fontSize: 10, marginTop: 4 }}>{new Date(a.createdAt).toLocaleString("ar-SA")}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}
