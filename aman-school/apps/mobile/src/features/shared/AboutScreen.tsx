import { Text, View, StyleSheet, Linking } from "react-native";
import { Bus, ShieldCheck, FileText, Mail } from "lucide-react-native";
import { Card, ScreenContainer, SectionHeader, colors, roleColors } from "@aman-school/shared-ui";
import { useSessionStore } from "../../store/session";

const APP_VERSION = "1.0.0";

/** shared-about: static "about the platform" screen reused across every role
 * via a thin per-role wrapper (same pattern as SupportContactScreen). */
export function AboutScreen() {
  const user = useSessionStore((s) => s.user);
  const accent = (user && roleColors[user.role]) ?? colors.navy;

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={[styles.iconBadge, { backgroundColor: colors.amberLight }]}>
          <Bus size={32} color={colors.amber} />
        </View>
        <Text style={styles.appName}>أمان سكول</Text>
        <Text style={styles.tagline}>سلامة أبنائك، رحلة بعد رحلة</Text>
        <Text style={styles.version}>الإصدار {APP_VERSION}</Text>
      </View>

      <SectionHeader title="عن المنصة" accentColor={accent} />
      <Card accentColor={accent}>
        <Text style={styles.body}>
          أمان سكول منصة SaaS متعددة المستأجرين لتتبع باصات المدارس لحظياً وحماية الطلاب، تخدم مدارس اليمن
          بدءاً من عدن. تربط أولياء الأمور والمشرفين والسائقين وإدارات المدارس وغرف العمليات في نظام واحد متكامل.
        </Text>
      </Card>

      <SectionHeader title="الشركة المطوّرة" accentColor={accent} />
      <Card accentColor={accent}>
        <View style={styles.row}>
          <ShieldCheck size={18} color={accent} />
          <Text style={styles.rowText}>ZASTECH One — عدن، اليمن</Text>
        </View>
      </Card>

      <SectionHeader title="روابط قانونية" accentColor={accent} />
      <Card accentColor={accent} onPress={() => Linking.openURL("mailto:support@amanschool.ye")}>
        <View style={styles.row}>
          <FileText size={18} color={accent} />
          <Text style={styles.rowText}>سياسة الخصوصية وشروط الاستخدام</Text>
        </View>
      </Card>
      <Card accentColor={accent} onPress={() => Linking.openURL("mailto:support@amanschool.ye")}>
        <View style={styles.row}>
          <Mail size={18} color={accent} />
          <Text style={styles.rowText}>support@amanschool.ye</Text>
        </View>
      </Card>

      <Text style={styles.copyright}>© {new Date().getFullYear()} أمان سكول. جميع الحقوق محفوظة.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 20, gap: 4 },
  iconBadge: { width: 72, height: 72, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  appName: { fontSize: 22, fontWeight: "800", color: colors.navy },
  tagline: { fontSize: 12, color: colors.gray600, fontWeight: "600" },
  version: { fontSize: 11, color: colors.gray400, marginTop: 6, fontWeight: "700" },
  body: { fontSize: 13, color: colors.gray700, lineHeight: 21 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowText: { fontSize: 13, fontWeight: "700", color: colors.navy },
  copyright: { textAlign: "center", fontSize: 11, color: colors.gray400, marginTop: 20, marginBottom: 8 },
});
