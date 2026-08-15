import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, ScreenContainer, SectionHeader, colors, roleColors } from "@aman-school/shared-ui";
import { ROLE_LABELS_AR } from "@aman-school/types";
import { useSessionStore } from "../../store/session";
import { useLogout } from "./RoleGuardLayout";
import { ROLE_GROUP } from "./roleHome";

/** Reusable personal-account screen (name/phone/email/role + logout) shared
 * across roles that don't already have a dedicated settings screen covering it.
 * Accent defaults to the signed-in user's own role color so a single wrapper
 * page works for route groups shared by two roles (e.g. owner + partner). */
export function ProfileScreen({ accentColor }: { accentColor?: string }) {
  const router = useRouter();
  const logout = useLogout();
  const user = useSessionStore((s) => s.user)!;
  const accent = accentColor ?? roleColors[user.role] ?? colors.navy;

  return (
    <ScreenContainer>
      <SectionHeader title="بيانات الحساب" accentColor={accent} />
      <Card accentColor={accent}>
        <View style={styles.row}>
          <Text style={styles.label}>الاسم</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>الصفة</Text>
          <Text style={styles.value}>{ROLE_LABELS_AR[user.role]}</Text>
        </View>
        {user.email ? (
          <View style={styles.row}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        ) : null}
        {user.phone ? (
          <View style={styles.row}>
            <Text style={styles.label}>الهاتف</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        ) : null}
      </Card>

      <View style={{ height: 12 }} />
      <Button title="عن النظام" variant="outline" onPress={() => router.push(`${ROLE_GROUP[user.role]}/about` as never)} />

      <View style={{ height: 12 }} />
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
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  label: { fontSize: 12, color: colors.gray600 },
  value: { fontSize: 13, fontWeight: "700", color: colors.navy },
});
