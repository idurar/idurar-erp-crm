import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, LogOut } from "lucide-react-native";
import { Card, GradientHeader, ScreenContainer, StatusPill, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useLogout } from "../../features/shared/RoleGuardLayout";

/** OPS-01, adapted from the original 1920x1080 dark-mode control-room design
 * to a mobile-friendly dark layout — same live data, denser desktop-style
 * grid isn't practical on a phone screen. */
const LINKS = [
  { href: "/(operations)/map", label: "🗺️ الخريطة المباشرة", accent: colors.greenMid },
  { href: "/(operations)/alerts", label: "🔔 إدارة التنبيهات", accent: colors.redMid },
  { href: "/(operations)/daily-report", label: "📊 تقرير اليوم", accent: colors.blueMid },
  { href: "/(operations)/communications", label: "💬 التواصل", accent: colors.tealMid },
  { href: "/(operations)/incidents", label: "📋 سجل الحوادث", accent: colors.amberMid },
  { href: "/(operations)/not-collected", label: "🚨 حالات عدم استلام الطلاب", accent: colors.red },
  { href: "/(operations)/profile", label: "👤 حسابي", accent: colors.purpleMid },
  { href: "/(operations)/settings", label: "⚙️ الإعدادات", accent: colors.gray400 },
  { href: "/(operations)/contact", label: "💬 الدعم الفني", accent: colors.greenMid },
] as const;

export default function ControlRoomScreen() {
  const router = useRouter();
  const logout = useLogout();
  const {
    data: trips,
    isLoading: tripsLoading,
    refetch: refetchTrips,
    isRefetching: tripsRefetching,
  } = useQuery({ queryKey: ["active-trips"], queryFn: () => api.operations.activeTrips(), refetchInterval: 6000 });
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["active-alerts"],
    queryFn: () => api.operations.alerts("active"),
    refetchInterval: 6000,
  });

  return (
    <ScreenContainer backgroundColor={colors.navy} refreshing={tripsRefetching} onRefresh={refetchTrips}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.ops_room}
          title="عمليات المراقبة"
          subtitle="غرفة العمليات المباشرة"
          icon={<Activity size={20} color={colors.redMid} />}
          right={
            <TouchableOpacity style={styles.iconBtn} onPress={async () => { await logout(); router.replace("/(auth)/role-select"); }}>
              <LogOut size={20} color={colors.white} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{tripsLoading ? "…" : trips?.length ?? 0}</Text>
          <Text style={styles.statLabel}>رحلات جارية</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.redMid }]}>{alertsLoading ? "…" : alerts?.length ?? 0}</Text>
          <Text style={styles.statLabel}>تنبيهات نشطة</Text>
        </View>
      </View>

      {LINKS.map((l) => (
        <Card key={l.href} style={{ backgroundColor: "rgba(255,255,255,0.06)" }} accentColor={l.accent} onPress={() => router.push(l.href as never)}>
          <Text style={styles.linkTitle}>{l.label}</Text>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>الرحلات الجارية الآن</Text>
      {trips?.map((t: any) => (
        <Card key={t.id} style={{ backgroundColor: "rgba(255,255,255,0.06)" }} accentColor={colors.greenMid}>
          <View style={styles.row}>
            <Text style={styles.tripText}>باص {t.bus?.busNumber}</Text>
            <StatusPill label="جارية" tone="success" />
          </View>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBleed: { marginHorizontal: -16, marginTop: -16, marginBottom: 20 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  stat: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, alignItems: "center" },
  statValue: { fontSize: 28, fontWeight: "800", color: colors.greenMid },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  linkTitle: { color: colors.white, fontWeight: "700" },
  sectionTitle: { color: colors.white, fontWeight: "700", fontSize: 13, marginTop: 12, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tripText: { color: colors.white, fontWeight: "600" },
});
