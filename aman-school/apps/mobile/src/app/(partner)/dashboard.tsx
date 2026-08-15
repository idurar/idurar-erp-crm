import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Handshake, School2, Wallet, Megaphone, User, Users } from "lucide-react-native";
import { Card, ErrorState, GradientHeader, LoadingState, ScreenContainer, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";

/** Partner-01: partner portal home — independent of the owner role group,
 * with its own cyan brand identity per the exact gradient spec. */
export default function PartnerDashboardScreen() {
  const router = useRouter();
  const logout = useLogout();
  const user = useSessionStore((s) => s.user)!;
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["partner-dashboard", user.partnerId],
    queryFn: () => api.partner.dashboard(user.partnerId!) as Promise<{
      partner: { name: string; region: string; commissionPercent: number; tier: { labelAr: string } | null; schools: any[] };
      monthlyRevenue: number; commission: number; schoolsCount: number;
    }>,
    enabled: !!user.partnerId,
  });

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.partner}
          title="لوحة الشريك"
          subtitle={data?.partner ? `${data.partner.name} · ${data.partner.region}` : "تحميل..."}
          icon={<Handshake size={20} color={colors.white} />}
          right={
            <TouchableOpacity style={styles.logoutBtn} onPress={async () => { await logout(); router.replace("/(auth)/role-select"); }}>
              <LogOut size={20} color={colors.white} />
            </TouchableOpacity>
          }
        />
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{data?.schoolsCount ?? "-"}</Text>
            <Text style={styles.statLabel}>عدد المدارس</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.greenMid }]}>{data?.commission ?? "-"}</Text>
            <Text style={styles.statLabel}>عمولته الشهرية (ر.ي)</Text>
          </Card>
        </View>
      )}

      <Card accentColor={roleGradients.partner[0]}>
        <View style={styles.row}><Text style={styles.label}>الإيراد الشهري لمدارسه</Text><Text style={styles.value}>{data?.monthlyRevenue ?? "-"} ر.ي</Text></View>
        <View style={styles.row}><Text style={styles.label}>نسبة العمولة</Text><Text style={styles.value}>{data?.partner?.commissionPercent ?? "-"}%</Text></View>
        <View style={styles.row}><Text style={styles.label}>مستوى الشراكة</Text><Text style={styles.value}>{data?.partner?.tier?.labelAr ?? "—"}</Text></View>
      </Card>

      <TouchableOpacity onPress={() => router.push("/(partner)/schools")}>
        <Card accentColor={roleGradients.partner[0]}>
          <View style={styles.linkRow}><School2 size={18} color={colors.navy} /><Text style={styles.linkText}>مدارسي المُحالة</Text></View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(partner)/commissions")}>
        <Card accentColor={roleGradients.partner[0]}>
          <View style={styles.linkRow}><Wallet size={18} color={colors.navy} /><Text style={styles.linkText}>العمولات والأرباح</Text></View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(partner)/leads")}>
        <Card accentColor={roleGradients.partner[0]}>
          <View style={styles.linkRow}><Users size={18} color={colors.navy} /><Text style={styles.linkText}>العملاء المحتملون</Text></View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(partner)/marketing")}>
        <Card accentColor={roleGradients.partner[0]}>
          <View style={styles.linkRow}><Megaphone size={18} color={colors.navy} /><Text style={styles.linkText}>حقيبة التسويق</Text></View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(partner)/profile")}>
        <Card accentColor={roleGradients.partner[0]}>
          <View style={styles.linkRow}><User size={18} color={colors.navy} /><Text style={styles.linkText}>حسابي</Text></View>
        </Card>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBleed: { marginHorizontal: -16, marginTop: -16, marginBottom: 20 },
  logoutBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  statsGrid: { flexDirection: "row", gap: 10, marginBottom: 12 },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 18 },
  statValue: { fontSize: 24, fontWeight: "800", color: colors.navy },
  statLabel: { fontSize: 11, color: colors.gray600, marginTop: 4, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  linkText: { fontWeight: "700", color: colors.navy, fontSize: 14 },
});
