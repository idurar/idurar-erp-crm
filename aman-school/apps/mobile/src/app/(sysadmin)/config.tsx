import { Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type ConfigInfo = {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  gpsUpdateIntervalSeconds: number;
  smsProvider: string;
};

const ROWS: Array<{ key: keyof ConfigInfo; label: string }> = [
  { key: "nodeEnv", label: "بيئة التشغيل" },
  { key: "port", label: "المنفذ" },
  { key: "corsOrigin", label: "مصدر CORS" },
  { key: "gpsUpdateIntervalSeconds", label: "فاصل تحديث GPS (ثوانٍ)" },
  { key: "smsProvider", label: "مزوّد الرسائل النصية" },
];

export default function SysadminConfigScreen() {
  const { data } = useQuery({
    queryKey: ["sysadmin-config"],
    queryFn: () => api.sysadmin.config() as Promise<ConfigInfo>,
  });

  return (
    <ScreenContainer>
      {ROWS.map((r) => (
        <Card key={r.key} accentColor={colors.navy}>
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.value}>{data ? String(data[r.key]) : "-"}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray600, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "700", color: colors.navy },
});
