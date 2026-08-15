import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, User, Smartphone, Truck, ShieldCheck, Activity, DollarSign, Server, Handshake, ShieldQuestion } from "lucide-react-native";
import { colors, roleGradients, ScreenContainer } from "@aman-school/shared-ui";
import { ROLE_LABELS_AR, type Role } from "@aman-school/types";

/** `regulator` is a web-only oversight role (see apps/web) — it never appears
 * in the mobile app's role picker. */
type MobileRole = Exclude<Role, "regulator">;

const ROLE_ROUTES: Record<MobileRole, string> = {
  supervisor: "/(auth)/supervisor-login",
  parent: "/(auth)/parent-login",
  school_admin: "/(auth)/school-login",
  ops_room: "/(auth)/ops-login",
  owner: "/(auth)/owner-login",
  sysadmin: "/(auth)/sysadmin-login",
  partner: "/(auth)/partner-login",
  driver: "/(auth)/driver-login",
};

const ROLE_DESCRIPTIONS: Record<MobileRole, string> = {
  parent: "تتبع الرحلة، إشعارات، استئذان",
  supervisor: "إدارة الطلاب، صعود ونزول (NFC)",
  driver: "القيادة وإبلاغ أعطال المركبة",
  school_admin: "إدارة الأسطول، التقويم، الطلاب",
  ops_room: "مراقبة حية وإدارة الأزمات",
  owner: "SaaS، إيرادات، ميزات تجريبية",
  sysadmin: "بنية النظام، السجلات، الأمان",
  partner: "المدارس، العمولات، التسويق",
};

const ROLE_ICONS: Record<MobileRole, any> = {
  parent: User,
  supervisor: Smartphone,
  driver: Truck,
  school_admin: ShieldCheck,
  ops_room: Activity,
  owner: DollarSign,
  sysadmin: Server,
  partner: Handshake,
};

const ROLE_ORDER: MobileRole[] = ["parent", "supervisor", "driver", "school_admin", "ops_room", "owner", "sysadmin", "partner"];

export default function RoleSelectScreen() {
  const router = useRouter();

  return (
    <ScreenContainer backgroundColor={colors.gray900}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <ShieldQuestion size={28} color={colors.blueMid} />
        </View>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>الرجاء تحديد صفتك للوصول إلى النظام المخصص لك</Text>
      </View>

      <View style={styles.list}>
        {ROLE_ORDER.map((role) => {
          const Icon = ROLE_ICONS[role];
          return (
            <TouchableOpacity
              key={role}
              style={styles.row}
              onPress={() => router.push(ROLE_ROUTES[role] as never)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={roleGradients[role]} style={styles.iconChip}>
                <Icon size={24} color={colors.white} />
              </LinearGradient>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{ROLE_LABELS_AR[role]}</Text>
                <Text style={styles.rowDesc}>{ROLE_DESCRIPTIONS[role]}</Text>
              </View>
              <ChevronLeft size={20} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: 16, marginBottom: 28, gap: 8 },
  iconBadge: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  title: { fontSize: 26, fontWeight: "800", color: colors.white },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center", paddingHorizontal: 24, fontWeight: "600" },
  list: { gap: 12 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 24, padding: 14,
  },
  iconChip: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  rowTitle: { color: colors.white, fontWeight: "800", fontSize: 15, marginBottom: 2 },
  rowDesc: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "600" },
});
