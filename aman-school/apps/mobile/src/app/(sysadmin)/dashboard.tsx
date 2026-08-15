import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Server } from "lucide-react-native";
import { Card, ErrorState, GradientHeader, ScreenContainer, StatusPill, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useLogout } from "../../features/shared/RoleGuardLayout";

const LINKS = [
  { href: "/(sysadmin)/users", label: "المستخدمون", icon: "👥" },
  { href: "/(sysadmin)/roles", label: "الأدوار", icon: "🔐" },
  { href: "/(sysadmin)/servers", label: "الخوادم", icon: "🖥️" },
  { href: "/(sysadmin)/logs", label: "السجلات", icon: "📜" },
  { href: "/(sysadmin)/backup", label: "النسخ الاحتياطي", icon: "💾" },
  { href: "/(sysadmin)/security", label: "الأمان", icon: "🛡️" },
  { href: "/(sysadmin)/config", label: "الإعدادات", icon: "⚙️" },
  { href: "/(sysadmin)/contact", label: "الدعم الفني", icon: "💬" },
  { href: "/(sysadmin)/profile", label: "حسابي", icon: "👤" },
];

type Dashboard = {
  services: { apiServer: boolean; database: boolean; webSocket: boolean };
  uptimeSeconds: number;
  dbLatencyMs: number;
  last24h: { requests: number; errors: number; avgResponseMs: number; errorRatePct: number };
  totals: { users: number; schools: number; buses: number };
};

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} س ${m} د`;
}

export default function SysadminDashboardScreen() {
  const router = useRouter();
  const logout = useLogout();
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["sysadmin-dashboard"],
    queryFn: () => api.sysadmin.dashboard() as Promise<Dashboard>,
    refetchInterval: 15000,
  });

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.sysadmin}
          title="مدير النظام"
          subtitle={isLoading ? "جاري فحص الخدمات..." : `وقت التشغيل: ${formatUptime(data?.uptimeSeconds ?? 0)}`}
          icon={<Server size={20} color={colors.white} />}
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
        <>
          <View style={styles.servicesRow}>
            <StatusPill
              label={isLoading ? "API …" : `API ${data?.services.apiServer ? "يعمل" : "متوقف"}`}
              tone={isLoading ? "neutral" : data?.services.apiServer ? "success" : "danger"}
            />
            <StatusPill
              label={isLoading ? "قاعدة البيانات …" : `قاعدة البيانات ${data?.services.database ? "تعمل" : "متوقفة"}`}
              tone={isLoading ? "neutral" : data?.services.database ? "success" : "danger"}
            />
            <StatusPill
              label={isLoading ? "WebSocket …" : `WebSocket ${data?.services.webSocket ? "يعمل" : "متوقف"}`}
              tone={isLoading ? "neutral" : data?.services.webSocket ? "success" : "danger"}
            />
          </View>

          <View style={styles.statsGrid}>
            {[
              { label: "وقت التشغيل", value: data ? formatUptime(data.uptimeSeconds) : undefined },
              { label: "زمن استجابة قاعدة البيانات", value: data ? `${data.dbLatencyMs} مللي‌ثانية` : undefined },
              { label: "طلبات آخر 24 ساعة", value: data?.last24h.requests },
              { label: "معدل الأخطاء", value: data ? `${data.last24h.errorRatePct}%` : undefined },
              { label: "إجمالي المستخدمين", value: data?.totals.users },
              { label: "إجمالي المدارس", value: data?.totals.schools },
            ].map((s) => (
              <Card key={s.label} style={styles.statCard}>
                <Text style={styles.statValue}>{isLoading ? "…" : s.value ?? "-"}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </Card>
            ))}
          </View>
        </>
      )}

      <View style={styles.linksGrid}>
        {LINKS.map((l) => (
          <Card key={l.href} style={styles.linkCard} accentColor={colors.navy} onPress={() => router.push(l.href as never)}>
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
  servicesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statCard: { width: "47%", alignItems: "center", paddingVertical: 16 },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.navy },
  statLabel: { fontSize: 11, color: colors.gray600, marginTop: 4, textAlign: "center" },
  linksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  linkCard: { width: "31%", alignItems: "center", paddingVertical: 16 },
  linkIcon: { fontSize: 24 },
  linkLabel: { fontSize: 11, color: colors.navy, fontWeight: "700", marginTop: 6, textAlign: "center" },
});
