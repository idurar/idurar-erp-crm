import { Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type BackupInfo = { lastBackupAt: string | null; schedule: string; storage: string };

export default function SysadminBackupScreen() {
  const { data } = useQuery({
    queryKey: ["sysadmin-backup"],
    queryFn: () => api.sysadmin.backup() as Promise<BackupInfo>,
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.navy}>
        <Text style={styles.label}>آخر نسخة احتياطية</Text>
        <Text style={styles.value}>{data?.lastBackupAt ? new Date(data.lastBackupAt).toLocaleString("ar-YE") : "لا توجد بعد"}</Text>
      </Card>
      <Card accentColor={colors.navy}>
        <Text style={styles.label}>جدول النسخ الاحتياطي</Text>
        <Text style={styles.value}>{data?.schedule}</Text>
      </Card>
      <Card accentColor={colors.navy}>
        <Text style={styles.label}>مكان التخزين</Text>
        <Text style={styles.value}>{data?.storage}</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray600, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "700", color: colors.navy },
});
