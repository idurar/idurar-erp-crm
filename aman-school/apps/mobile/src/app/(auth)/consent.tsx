import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";
import { ROLE_HOME } from "../../features/shared/roleHome";

function ConsentCheckbox({ checked, onPress, label }: { checked: boolean; onPress: () => void; label: string }) {
  return (
    <TouchableOpacity style={styles.checkboxRow} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---- SF-1: mandatory, once-per-policy-version consent gate ---- */
export default function ConsentScreen() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const logout = useLogout();
  const queryClient = useQueryClient();

  const [trackingConsent, setTrackingConsent] = useState(false);
  const [medicalConsent, setMedicalConsent] = useState(false);
  const [policyConsent, setPolicyConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const allChecked = trackingConsent && medicalConsent && policyConsent;

  const mutation = useMutation({
    mutationFn: () => api.consent.record({ trackingConsent, medicalConsent, policyConsent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consent-status"] });
      router.replace((ROLE_HOME[user!.role] ?? "/(auth)/role-select") as never);
    },
  });

  if (showPolicy) {
    return (
      <ScreenContainer backgroundColor={colors.navy}>
        <ScrollView>
          <Text style={styles.policyTitle}>سياسة الخصوصية</Text>
          <Text style={styles.policyBody}>
            يجمع تطبيق أمان سكول موقع طفلك أثناء رحلة الباص المدرسي فقط، ويُستخدم هذا الموقع
            حصراً لتتبع الرحلة وإرسال إشعارات الصعود والنزول والوصول. لا تُشارك بيانات الموقع
            مع أي جهة خارج مدرسة طفلك ومنصة أمان سكول.
            {"\n\n"}
            كما يحتفظ التطبيق بالبيانات الطبية التي يُدخلها ولي الأمر (فصيلة الدم، الحساسية،
            الأدوية، الحالات المزمنة) لاستخدامها حصراً في حالات الطوارئ من قبل مشرف الباص، مع
            تسجيل كامل لكل عملية اطّلاع على هذه البيانات.
            {"\n\n"}
            يمكن لولي الأمر سحب موافقته في أي وقت من إعدادات الحساب، مع العلم أن سحب الموافقة
            يوقف الحساب تلقائياً حتى إعادة الموافقة.
          </Text>
          <Button title="عودة" onPress={() => setShowPolicy(false)} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.navy}>
      <View style={styles.header}>
        <Text style={styles.icon}>🛡️</Text>
        <Text style={styles.title}>موافقتك مطلوبة قبل المتابعة</Text>
        <Text style={styles.subtitle}>
          نستخدم موقع طفلك أثناء رحلة الباص فقط، ونحتفظ ببياناته الطبية لحالات الطوارئ فقط.
        </Text>
      </View>

      <View style={styles.card}>
        <ConsentCheckbox checked={trackingConsent} onPress={() => setTrackingConsent((v) => !v)} label="أوافق على تتبع موقع ابني/ابنتي أثناء رحلة الباص فقط" />
        <View style={styles.divider} />
        <ConsentCheckbox checked={medicalConsent} onPress={() => setMedicalConsent((v) => !v)} label="أوافق على تخزين البيانات الطبية للاستخدام في حالات الطوارئ" />
        <View style={styles.divider} />
        <ConsentCheckbox checked={policyConsent} onPress={() => setPolicyConsent((v) => !v)} label="اطّلعت على سياسة الخصوصية" />
        <TouchableOpacity onPress={() => setShowPolicy(true)}>
          <Text style={styles.policyLink}>عرض السياسة كاملة ←</Text>
        </TouchableOpacity>
      </View>

      <Button title="✅ أوافق وأتابع" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!allChecked} />
      <Text style={styles.footnote}>لن تُشارَك بياناتك مع أي جهة خارج مدرسة طفلك وأمان سكول</Text>

      <Button
        title="تسجيل الخروج"
        variant="outline"
        color={colors.white}
        onPress={async () => {
          await logout();
          router.replace("/(auth)/role-select");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginTop: 12, marginBottom: 20, gap: 8 },
  icon: { fontSize: 40 },
  title: { fontSize: 18, fontWeight: "800", color: colors.white, textAlign: "center" },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", textAlign: "center", paddingHorizontal: 8 },
  card: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, marginBottom: 20 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: colors.greenMid, borderColor: colors.greenMid },
  checkboxMark: { color: colors.white, fontSize: 13, fontWeight: "800" },
  checkboxLabel: { flex: 1, color: colors.white, fontSize: 13 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 4 },
  policyLink: { color: colors.blueMid, fontSize: 12, marginTop: 8 },
  footnote: { color: "rgba(255,255,255,0.6)", fontSize: 11, textAlign: "center", marginTop: 12, marginBottom: 20 },
  policyTitle: { fontSize: 18, fontWeight: "800", color: colors.white, marginBottom: 12 },
  policyBody: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 22, marginBottom: 20 },
});
