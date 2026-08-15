import { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useLogout } from "../../features/shared/RoleGuardLayout";

/** parent-settings: general app settings — language/currency (read-only for
 * now), quick links to notification prefs / support / about, right-to-erasure
 * request (§14), and logout. Distinct from notification-settings.tsx (P-10,
 * per-notification-type toggles) and profile.tsx (personal account info). */
export default function ParentSettingsScreen() {
  const router = useRouter();
  const logout = useLogout();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const deleteRequestMutation = useMutation({
    mutationFn: () => api.support.contact({ message: "طلب حذف الحساب وجميع البيانات المرتبطة به (حق الحذف)", channel: "account_deletion_request" }),
    onSuccess: () => {
      setConfirmingDelete(false);
      Alert.alert("تم استلام الطلب", "سيتواصل معك فريق الدعم لإتمام حذف حسابك خلال الأيام القادمة، وفق سياسة الاحتفاظ بالبيانات.");
    },
  });

  return (
    <ScreenContainer>
      <SectionHeader title="اللغة والعملة" accentColor={colors.greenMid} />
      <Card accentColor={colors.greenMid}>
        <View style={styles.row}><Text style={styles.label}>اللغة</Text><Text style={styles.value}>العربية</Text></View>
        <View style={styles.row}><Text style={styles.label}>العملة</Text><Text style={styles.value}>الريال اليمني (YER)</Text></View>
      </Card>

      <SectionHeader title="روابط سريعة" accentColor={colors.greenMid} />
      <Button
        title="إعدادات الإشعارات"
        variant="outline"
        onPress={() => router.push("/(parent)/notification-settings")}
      />
      <Button title="💬 التواصل والدعم" variant="outline" onPress={() => router.push("/(parent)/contact")} />
      <Button title="عن النظام" variant="outline" onPress={() => router.push("/(parent)/about")} />

      <SectionHeader title="الخصوصية والبيانات" accentColor={colors.red} />
      {!confirmingDelete ? (
        <Button title="حذف حسابي وبياناتي" variant="outline" color={colors.red} onPress={() => setConfirmingDelete(true)} />
      ) : (
        <Card accentColor={colors.red}>
          <Text style={styles.warnText}>
            سيؤدي هذا إلى تقديم طلب حذف نهائي لحسابك وكل بيانات أبنائك المرتبطة به. لا يمكن التراجع بعد المراجعة.
          </Text>
          <View style={styles.confirmRow}>
            <Button title="تأكيد الطلب" color={colors.red} onPress={() => deleteRequestMutation.mutate()} loading={deleteRequestMutation.isPending} />
            <Button title="إلغاء" variant="outline" onPress={() => setConfirmingDelete(false)} />
          </View>
        </Card>
      )}

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
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
  warnText: { fontSize: 12, color: colors.gray700, lineHeight: 19, marginBottom: 12 },
  confirmRow: { gap: 8 },
});
