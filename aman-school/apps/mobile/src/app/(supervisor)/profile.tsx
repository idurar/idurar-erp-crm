import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/* ---- s-profile: supervisor profile + rolling safety rating (OP-7) ---- */
export default function SupervisorProfileScreen() {
  const user = useSessionStore((s) => s.user)!;
  const { data: profile } = useQuery({
    queryKey: ["supervisor-profile", user.id],
    queryFn: () => api.supervisor.profile(user.id) as Promise<any>,
  });

  return (
    <ScreenContainer>
      <SectionHeader title="بيانات المشرف" accentColor={colors.blueMid} />
      <Card accentColor={colors.blueMid}>
        <Text style={styles.name}>{profile?.name ?? user.name}</Text>
        <Text style={styles.meta}>رمز الموظف: {profile?.employeeCode ?? user.employeeCode}</Text>
        <Text style={styles.meta}>الهاتف: {profile?.phone ?? "-"}</Text>
        <Text style={styles.meta}>الباص المعيّن: {profile?.supervisedBus?.busNumber ?? "غير معيّن"}</Text>
      </Card>

      <SectionHeader title="⭐ تقييم السلامة" accentColor={colors.blueMid} />
      <Card accentColor={colors.amber}>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingValue}>{profile?.rating != null ? `⭐ ${profile.rating}` : "لا يوجد تقييم بعد"}</Text>
          <Text style={styles.ratingNote}>متوسط آخر 30 رحلة مقيَّمة من أولياء الأمور</Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 15, fontWeight: "800", color: colors.navy },
  meta: { fontSize: 12, color: colors.gray600, marginTop: 4 },
  ratingRow: { alignItems: "center" },
  ratingValue: { fontSize: 20, fontWeight: "800", color: colors.amber },
  ratingNote: { fontSize: 11, color: colors.gray600, marginTop: 4, textAlign: "center" },
});
