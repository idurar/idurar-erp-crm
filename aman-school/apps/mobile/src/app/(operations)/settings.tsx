import { useState } from "react";
import { Text, View, StyleSheet, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";

/* ---- OPS settings: notification prefs + logout ---- */
export default function OpsSettingsScreen() {
  const router = useRouter();
  const logout = useLogout();
  const user = useSessionStore((s) => s.user)!;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);

  const saveMutation = useMutation({
    mutationFn: () => api.notifications.updatePrefs({ soundEnabled, criticalOnly }),
    onSuccess: () => Alert.alert("تم الحفظ", "تم حفظ إعداداتك بنجاح"),
  });

  return (
    <ScreenContainer backgroundColor={colors.navy}>
      <SectionHeader title="معلومات الحساب" accentColor={colors.redMid} />
      <Text style={styles.info}>{user.name}</Text>
      <Text style={styles.infoSub}>{user.email}</Text>

      <SectionHeader title="تنبيهات غرفة العمليات" accentColor={colors.redMid} />
      <View style={styles.row}>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
        <Text style={styles.rowLabel}>صوت التنبيهات الجديدة</Text>
      </View>
      <View style={styles.row}>
        <Switch value={criticalOnly} onValueChange={setCriticalOnly} />
        <Text style={styles.rowLabel}>الحرجة فقط (تجاهل الإشعارية)</Text>
      </View>
      <Button title="حفظ الإعدادات" variant="outline" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} />

      <View style={{ height: 16 }} />
      <Button
        title="تسجيل الخروج"
        color={colors.red}
        onPress={async () => {
          await logout();
          router.replace("/(auth)/role-select");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  info: { fontSize: 15, fontWeight: "700", color: colors.white },
  infoSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  rowLabel: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
});
