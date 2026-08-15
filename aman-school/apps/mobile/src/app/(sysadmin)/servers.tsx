import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type ServersResponse = {
  apiServer: { status: string; uptimeSeconds: number };
  database: { status: string; latencyMs: number; activeConnections: number; studentsStored: number };
  webSocket: { status: string };
  smsGateway: { status: string; note: string };
};

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} س ${m} د`;
}

export default function SysadminServersScreen() {
  const { data } = useQuery({
    queryKey: ["sysadmin-servers"],
    queryFn: () => api.sysadmin.servers() as Promise<ServersResponse>,
    refetchInterval: 10000,
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.navy}>
        <View style={styles.row}>
          <Text style={styles.label}>خادم API</Text>
          <StatusPill label={data?.apiServer.status === "up" ? "يعمل" : "متوقف"} tone={data?.apiServer.status === "up" ? "success" : "danger"} />
        </View>
        <Text style={styles.meta}>وقت التشغيل: {data ? formatUptime(data.apiServer.uptimeSeconds) : "-"}</Text>
      </Card>

      <Card accentColor={colors.navy}>
        <View style={styles.row}>
          <Text style={styles.label}>قاعدة البيانات</Text>
          <StatusPill label={data?.database.status === "up" ? "تعمل" : "متوقفة"} tone={data?.database.status === "up" ? "success" : "danger"} />
        </View>
        <Text style={styles.meta}>زمن الاستجابة: {data?.database.latencyMs ?? "-"} مللي‌ثانية</Text>
        <Text style={styles.meta}>اتصالات نشطة: {data?.database.activeConnections ?? "-"}</Text>
        <Text style={styles.meta}>عدد الطلاب المخزّنين: {data?.database.studentsStored ?? "-"}</Text>
      </Card>

      <Card accentColor={colors.navy}>
        <View style={styles.row}>
          <Text style={styles.label}>WebSocket</Text>
          <StatusPill label={data?.webSocket.status === "up" ? "يعمل" : "متوقف"} tone={data?.webSocket.status === "up" ? "success" : "danger"} />
        </View>
      </Card>

      <Card accentColor={colors.amber}>
        <View style={styles.row}>
          <Text style={styles.label}>بوابة الرسائل النصية</Text>
          <StatusPill label="وضع تجريبي" tone="warning" />
        </View>
        <Text style={styles.meta}>{data?.smsGateway.note}</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
});
