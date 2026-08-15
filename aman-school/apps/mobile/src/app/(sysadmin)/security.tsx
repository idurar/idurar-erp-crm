import { Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type SecurityInfo = {
  otpValidityMinutes: number;
  maxLoginAttempts: number;
  accessTokenTtl: string;
  refreshTokenTtl: string;
  twoFactorRequiredFor: string[];
};

const ROWS: Array<{ key: keyof SecurityInfo; label: string }> = [
  { key: "otpValidityMinutes", label: "صلاحية رمز التحقق (دقائق)" },
  { key: "maxLoginAttempts", label: "الحد الأقصى لمحاولات الدخول" },
  { key: "accessTokenTtl", label: "صلاحية رمز الدخول" },
  { key: "refreshTokenTtl", label: "صلاحية رمز التجديد" },
];

export default function SysadminSecurityScreen() {
  const { data } = useQuery({
    queryKey: ["sysadmin-security"],
    queryFn: () => api.sysadmin.security() as Promise<SecurityInfo>,
  });

  return (
    <ScreenContainer>
      {ROWS.map((r) => (
        <Card key={r.key} accentColor={colors.navy}>
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.value}>{data ? String(data[r.key]) : "-"}</Text>
        </Card>
      ))}
      <Card accentColor={colors.navy}>
        <Text style={styles.label}>التحقق الثنائي مطلوب لـ</Text>
        <Text style={styles.value}>{data?.twoFactorRequiredFor.join("، ") ?? "-"}</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray600, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "700", color: colors.navy },
});
