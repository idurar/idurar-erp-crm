import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Shield } from "lucide-react-native";
import { Card, ErrorState, GradientHeader, ScreenContainer, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useLogout } from "../../features/shared/RoleGuardLayout";

const LINKS = [
  { href: "/(owner)/schools", label: "المدارس", icon: "🏫" },
  { href: "/(owner)/partners", label: "الشركاء", icon: "🤝" },
  { href: "/(owner)/packages", label: "الباقات", icon: "📦" },
  { href: "/(owner)/revenue", label: "الإيرادات", icon: "💰" },
  { href: "/(owner)/sub-lifecycle", label: "سياسة الاشتراكات", icon: "⏳" },
  { href: "/(owner)/refunds", label: "طلبات الاسترداد", icon: "💸" },
  { href: "/(owner)/partner-tiers", label: "مستويات الشركاء", icon: "🏅" },
  { href: "/(owner)/analytics", label: "التحليلات", icon: "📈" },
  { href: "/(owner)/features", label: "الميزات التجريبية", icon: "🧪" },
  { href: "/(owner)/impersonate", label: "الدخول بحساب مدرسة", icon: "🕵️" },
  { href: "/(owner)/users", label: "المستخدمون", icon: "👥" },
  { href: "/(owner)/notifications", label: "الإشعارات", icon: "🔔" },
  { href: "/(owner)/settings", label: "الإعدادات", icon: "⚙️" },
  { href: "/(owner)/contact", label: "الدعم الفني", icon: "💬" },
  { href: "/(owner)/profile", label: "حسابي", icon: "👤" },
];

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const logout = useLogout();
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["owner-platform-summary"],
    queryFn: () => api.owner.platformSummary() as Promise<{
      totalSchools: number; activeSchools: number; totalStudents: number; monthlyRevenue: number;
    }>,
  });

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.owner}
          title="ZASTECH One"
          subtitle={isLoading ? "جاري تحميل الإيرادات..." : `الإيراد الشهري: ${data?.monthlyRevenue ?? 0} ر.ي`}
          icon={<Shield size={20} color="#F59E0B" />}
          right={
            <TouchableOpacity style={styles.logoutBtn} onPress={async () => { await logout(); router.replace("/(auth)/role-select"); }}>
              <LogOut size={20} color={colors.white} />
            </TouchableOpacity>
          }
        />
      </View>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <View style={styles.statsGrid}>
          {[
            { label: "إجمالي المدارس", value: data?.totalSchools },
            { label: "مدارس نشطة", value: data?.activeSchools },
            { label: "الطلاب النشطون", value: data?.totalStudents },
            { label: "الإيراد الشهري", value: data ? `${data.monthlyRevenue} ر.ي` : undefined },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{isLoading ? "…" : s.value ?? "-"}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>
      )}

      <View style={styles.linksGrid}>
        {LINKS.map((l) => (
          <Card key={l.href} style={styles.linkCard} accentColor={colors.purpleMid} onPress={() => router.push(l.href as never)}>
            <Text style={styles.linkIcon}>{l.icon}</Text>
            <Text style={styles.linkLabel}>{l.label}</Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBleed: { marginHorizontal: -16, marginTop: -16, marginBottom: 20 },
  logoutBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statCard: { width: "47%", alignItems: "center", paddingVertical: 16 },
  statValue: { fontSize: 20, fontWeight: "800", color: colors.purpleMid },
  statLabel: { fontSize: 11, color: colors.gray600, marginTop: 4 },
  linksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  linkCard: { width: "31%", alignItems: "center", paddingVertical: 16 },
  linkIcon: { fontSize: 24 },
  linkLabel: { fontSize: 11, color: colors.navy, fontWeight: "700", marginTop: 6, textAlign: "center" },
});
