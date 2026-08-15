import { useState } from "react";
import { Text, View, StyleSheet, Switch, Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Button, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const NOTIFICATION_TYPES = [
  { key: "boarding", label: "صعد الباص" },
  { key: "arrivedSchool", label: "وصل المدرسة" },
  { key: "leftSchool", label: "نزل من المدرسة" },
  { key: "arrivedHome", label: "وصل المنزل" },
  { key: "delay", label: "تأخير الرحلة" },
  { key: "emergency", label: "طوارئ (لا يمكن إيقافه)" },
];

/** P-10: per-type toggles + quiet hours. */
export default function NotificationSettingsScreen() {
  const user = useSessionStore((s) => s.user)!;
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    boarding: true, arrivedSchool: true, leftSchool: true, arrivedHome: true, delay: true, emergency: true,
  });
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietTo, setQuietTo] = useState("06:00");
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.parent.updateNotificationPrefs(user.id, { types: enabled, quietHoursEnabled, quietFrom, quietTo }),
    onSuccess: () => Alert.alert("تم الحفظ", "تم حفظ إعدادات الإشعارات"),
  });

  return (
    <ScreenContainer>
      <SectionHeader title="أنواع الإشعارات" accentColor={colors.greenMid} />
      {NOTIFICATION_TYPES.map((t) => (
        <View style={styles.row} key={t.key}>
          <Switch
            value={enabled[t.key]}
            disabled={t.key === "emergency"}
            onValueChange={(v) => setEnabled((prev) => ({ ...prev, [t.key]: v }))}
          />
          <Text style={styles.rowLabel}>{t.label}</Text>
        </View>
      ))}

      <SectionHeader title="ساعات الهدوء" accentColor={colors.greenMid} />
      <View style={styles.row}>
        <Switch value={quietHoursEnabled} onValueChange={setQuietHoursEnabled} />
        <Text style={styles.rowLabel}>تفعيل ساعات الهدوء (لا إشعارات عادية خلالها)</Text>
      </View>
      {quietHoursEnabled ? (
        <Text style={styles.quietText}>من {quietFrom} إلى {quietTo} — الإشعارات العاجلة تصل دائماً</Text>
      ) : null}

      <Button title="حفظ" onPress={() => mutation.mutate()} loading={mutation.isPending} color={colors.greenMid} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  rowLabel: { fontSize: 13, color: colors.gray700, flex: 1 },
  quietText: { fontSize: 12, color: colors.gray600, marginBottom: 12 },
});
