import { useState } from "react";
import { Text, View, StyleSheet, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";

/* ---- D-04 / driver settings: notification prefs + logout ---- */
export default function DriverSettingsScreen() {
  const router = useRouter();
  const logout = useLogout();
  const user = useSessionStore((s) => s.user)!;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const saveMutation = useMutation({
    mutationFn: () => api.notifications.updatePrefs({ soundEnabled, vibrationEnabled }),
    onSuccess: () => Alert.alert("تم الحفظ", "تم حفظ إعداداتك بنجاح"),
  });

  return (
    <ScreenContainer>
      <SectionHeader title="معلومات السائق" accentColor={colors.tealMid} />
      <Text style={styles.info}>{user.name}</Text>
      <Text style={styles.infoSub}>رمز الموظف: {user.employeeCode}</Text>
      <Button title="عرض الملف الشخصي الكامل" variant="outline" onPress={() => router.push("/(driver)/profile")} />

      <SectionHeader title="الصوت والاهتزاز" accentColor={colors.tealMid} />
      <View style={styles.row}>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
        <Text style={styles.rowLabel}>صوت التنبيهات</Text>
      </View>
      <View style={styles.row}>
        <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} />
        <Text style={styles.rowLabel}>الاهتزاز عند التنبيهات</Text>
      </View>
      <Button title="حفظ الإعدادات" variant="outline" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} />
      <Button title="💬 الدعم الفني" variant="outline" onPress={() => router.push("/(driver)/contact")} />
      <Button title="عن النظام" variant="outline" onPress={() => router.push("/(driver)/about")} />

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
  info: { fontSize: 15, fontWeight: "700", color: colors.navy },
  infoSub: { fontSize: 12, color: colors.gray600, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  rowLabel: { fontSize: 13, color: colors.gray700 },
});
