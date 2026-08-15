import { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors, formatPackagePrice } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../lib/api";

const STEPS = ["بيانات المدرسة", "الباقة والشريك", "حساب المدير", "الإعداد التقني", "التأكيد"];

/* ---- BC-1 / ow-onboarding: 5-step new-school wizard ---- */
export default function OwnerOnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [region, setRegion] = useState("خور مكسر — عدن");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [packageId, setPackageId] = useState<string | null>(null);
  const [usePartner, setUsePartner] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [contractCycle, setContractCycle] = useState<"monthly" | "yearly">("monthly");

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const { data: packages } = useQuery({ queryKey: ["owner-packages"], queryFn: () => api.owner.packages() as Promise<any[]> });
  const { data: partners } = useQuery({ queryKey: ["owner-partners"], queryFn: () => api.owner.partners() as Promise<any[]> });

  const selectedPackage = packages?.find((p) => p.id === packageId);
  const selectedPartner = partners?.find((p) => p.id === partnerId);

  const submitMutation = useMutation({
    mutationFn: () =>
      api.owner.onboardSchool({
        name, slug, region, licenseNumber: licenseNumber || undefined, phone: phone || undefined, email: email || undefined,
        adminName, adminEmail, packageId: packageId!, partnerId: usePartner ? partnerId ?? undefined : undefined, contractCycle,
      }),
    onSuccess: (res) => {
      Alert.alert("تم الإطلاق 🚀", `كلمة مرور المدير المؤقتة: ${res.devTempPassword}`, [
        { text: "حسناً", onPress: () => router.replace("/(owner)/schools") },
      ]);
    },
    onError: (e) => setError(e instanceof HttpError ? String((e.body as any)?.error ?? "تعذر إنشاء المدرسة") : "تعذر الاتصال بالخادم"),
  });

  function next() {
    setError(null);
    if (step === 0 && (!name || !slug)) return setError("اسم المدرسة والمعرّف مطلوبان");
    if (step === 1 && !packageId) return setError("اختر باقة");
    if (step === 2 && (!adminName || !adminEmail)) return setError("اسم المدير وبريده مطلوبان");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <ScreenContainer>
      <View style={styles.progressRow}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.progressItem}>
            <View style={[styles.progressDot, i <= step && styles.progressDotActive]} />
            {i < STEPS.length - 1 ? <View style={[styles.progressLine, i < step && styles.progressDotActive]} /> : null}
          </View>
        ))}
      </View>
      <Text style={styles.stepTitle}>الخطوة {step + 1}/{STEPS.length}: {STEPS[step]}</Text>

      {step === 0 ? (
        <>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم المدرسة" />
          <TextInput style={styles.input} value={slug} onChangeText={setSlug} placeholder="المعرّف (slug), مثال: noor2" autoCapitalize="none" />
          <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="المنطقة/المحافظة" />
          <TextInput style={styles.input} value={licenseNumber} onChangeText={setLicenseNumber} placeholder="رقم الترخيص (وزارة التربية)" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="هاتف المدرسة +967 2-xxxxxx" keyboardType="phone-pad" />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="بريد المدرسة" autoCapitalize="none" keyboardType="email-address" />
        </>
      ) : null}

      {step === 1 ? (
        <>
          <Text style={styles.label}>الباقة</Text>
          <View style={styles.chipsRow}>
            {packages?.map((p) => (
              <TouchableOpacity key={p.id} style={[styles.chip, packageId === p.id && styles.chipActive]} onPress={() => setPackageId(p.id)}>
                <Text style={[styles.chipText, packageId === p.id && styles.chipTextActive]}>{p.name} — {formatPackagePrice(p.priceMonthly)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.checkboxRow} onPress={() => setUsePartner((v) => !v)}>
            <Text style={styles.checkbox}>{usePartner ? "☑" : "☐"}</Text>
            <Text style={styles.checkboxLabel}>تم عبر شريك؟</Text>
          </TouchableOpacity>
          {usePartner ? (
            <View style={styles.chipsRow}>
              {partners?.map((p) => (
                <TouchableOpacity key={p.id} style={[styles.chip, partnerId === p.id && styles.chipActive]} onPress={() => setPartnerId(p.id)}>
                  <Text style={[styles.chipText, partnerId === p.id && styles.chipTextActive]}>{p.name} ({p.commissionPercent}%)</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <Text style={styles.label}>مدة العقد</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity style={[styles.chip, contractCycle === "monthly" && styles.chipActive]} onPress={() => setContractCycle("monthly")}>
              <Text style={[styles.chipText, contractCycle === "monthly" && styles.chipTextActive]}>شهري</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, contractCycle === "yearly" && styles.chipActive]} onPress={() => setContractCycle("yearly")}>
              <Text style={[styles.chipText, contractCycle === "yearly" && styles.chipTextActive]}>سنوي (خصم 10%)</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <TextInput style={styles.input} value={adminName} onChangeText={setAdminName} placeholder="اسم مدير المدرسة" />
          <TextInput style={styles.input} value={adminEmail} onChangeText={setAdminEmail} placeholder="بريد المدير" autoCapitalize="none" keyboardType="email-address" />
          <Card>
            <Text style={styles.note}>سيُنشأ تلقائياً: 🔑 كلمة مرور مؤقتة، 📧 رسالة ترحيب بخطوات الدخول الأولى</Text>
          </Card>
        </>
      ) : null}

      {step === 3 ? (
        <Card>
          <Text style={styles.setupLine}>✅ Schema منفصل في قاعدة البيانات</Text>
          <Text style={styles.setupLine}>✅ Tenant ID: school_{slug || "..."}</Text>
          <Text style={styles.setupLine}>✅ مساحة تخزين مخصصة</Text>
          <Text style={styles.setupLine}>✅ نطاق فرعي: {slug || "..."}.amanschool.ye</Text>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card accentColor={colors.purpleMid}>
          <Text style={styles.summaryTitle}>ملخص</Text>
          <Text style={styles.summaryLine}>{name} | {region}</Text>
          <Text style={styles.summaryLine}>الباقة: {selectedPackage?.name ?? "-"}{usePartner && selectedPartner ? ` | عبر شريك: ${selectedPartner.name}` : ""}</Text>
          <Text style={styles.summaryLine}>المدير: {adminName} ({adminEmail})</Text>
        </Card>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.navRow}>
        {step > 0 ? <Button title="◀ رجوع" variant="outline" onPress={() => setStep((s) => s - 1)} /> : <View style={{ flex: 1 }} />}
        {step < STEPS.length - 1 ? (
          <Button title="التالي ←" onPress={next} color={colors.purpleMid} />
        ) : (
          <Button title="🚀 تأكيد وإطلاق المدرسة" onPress={() => submitMutation.mutate()} loading={submitMutation.isPending} color={colors.purpleMid} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  progressItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gray200 },
  progressDotActive: { backgroundColor: colors.purpleMid },
  progressLine: { flex: 1, height: 2, backgroundColor: colors.gray200, marginHorizontal: 2 },
  stepTitle: { fontSize: 14, fontWeight: "800", color: colors.navy, marginBottom: 14, textAlign: "center" },
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.purpleMid}22`, borderColor: colors.purpleMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.purpleMid, fontWeight: "700" },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  checkbox: { fontSize: 18, color: colors.purpleMid },
  checkboxLabel: { fontSize: 13, color: colors.navy },
  note: { fontSize: 12, color: colors.gray700 },
  setupLine: { fontSize: 13, color: colors.greenMid, marginBottom: 6, fontWeight: "600" },
  summaryTitle: { fontSize: 14, fontWeight: "800", color: colors.navy, marginBottom: 8 },
  summaryLine: { fontSize: 13, color: colors.gray700, marginBottom: 4 },
  error: { color: colors.red, fontSize: 12, marginBottom: 8, textAlign: "center" },
  navRow: { flexDirection: "row", gap: 10, marginTop: 8 },
});
