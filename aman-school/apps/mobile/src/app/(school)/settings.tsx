import { useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, SectionHeader, colors, formatPackagePrice } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";

const METHODS = [
  { value: "ecash", label: "إي كاش" },
  { value: "bank_transfer", label: "تحويل بنكي" },
  { value: "cash", label: "نقداً" },
  { value: "yemenpay", label: "يمن باي (قريباً)" },
];

/** SCH-11: school profile settings + subscription info + logout. */
export default function SchoolSettingsScreen() {
  const router = useRouter();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;

  const { data: school } = useQuery({ queryKey: ["school-detail", schoolId], queryFn: () => api.school.get(schoolId) });
  const { data: payments } = useQuery({ queryKey: ["school-payments", schoolId], queryFn: () => api.school.payments(schoolId) as Promise<any[]> });
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("ecash");
  const [receiptUrl, setReceiptUrl] = useState("");

  useEffect(() => {
    if (school) {
      setName(school.name);
      setAddress(school.address ?? "");
    }
  }, [school]);

  const saveMutation = useMutation({
    mutationFn: () => api.school.updateSettings(schoolId, { name, address }),
    onSuccess: () => Alert.alert("تم الحفظ", "تم حفظ بيانات المدرسة"),
  });

  const paymentMutation = useMutation({
    mutationFn: () => {
      const pkg = (school as any)?.package;
      return api.subscriptions.submitPayment({
        subjectType: "school",
        subjectId: schoolId,
        packageName: pkg?.name ?? "غير محدد",
        cycle: "monthly",
        amount: pkg?.priceMonthly ?? 0,
        method,
        receiptUrl: receiptUrl || undefined,
      });
    },
    onSuccess: () => {
      Alert.alert("تم", "تم تسجيل الدفعة، بانتظار المراجعة من المالك");
      setReceiptUrl("");
      queryClient.invalidateQueries({ queryKey: ["school-payments"] });
    },
  });

  return (
    <ScreenContainer>
      <SectionHeader title="بيانات المدرسة" accentColor={colors.amber} />
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم المدرسة" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="العنوان" />
      <Button title="حفظ" onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} color={colors.amber} />

      <SectionHeader title="الاشتراك" accentColor={colors.amber} />
      <Card>
        <Text style={styles.subLabel}>الباقة الحالية: {(school as any)?.package?.name ?? "-"}</Text>
        <Text style={styles.subLabel}>الحالة: {school?.subscriptionStatus ?? "-"}</Text>
        <Text style={styles.subLabel}>السعر الشهري: {(school as any)?.package ? formatPackagePrice((school as any).package.priceMonthly) : "-"}</Text>
      </Card>

      <SectionHeader title="تسديد دفعة الاشتراك" accentColor={colors.amber} />
      <View style={styles.chipsRow}>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.value}
            style={[styles.chip, method === m.value && styles.chipActive]}
            onPress={() => setMethod(m.value)}
          >
            <Text style={[styles.chipText, method === m.value && styles.chipTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={receiptUrl}
        onChangeText={setReceiptUrl}
        placeholder="رابط صورة الإيصال (اختياري)"
        autoCapitalize="none"
      />
      <Button title="تسديد الدفعة" onPress={() => paymentMutation.mutate()} loading={paymentMutation.isPending} color={colors.amber} />

      <SectionHeader title="سجل المدفوعات" accentColor={colors.amber} />
      {payments?.length ? (
        payments.map((p) => (
          <Card key={p.id}>
            <Text style={styles.subLabel}>{p.packageName} — {p.amount} ر.ي</Text>
            <Text style={styles.subLabel}>{new Date(p.createdAt).toLocaleDateString("ar-YE")} • {METHODS.find((m) => m.value === p.method)?.label ?? p.method}</Text>
          </Card>
        ))
      ) : (
        <Text style={styles.subLabel}>لا توجد مدفوعات سابقة</Text>
      )}

      <Button title="حسابي الشخصي" variant="outline" onPress={() => router.push("/(school)/profile")} />
      <Button title="💬 الدعم الفني" variant="outline" onPress={() => router.push("/(school)/contact")} />
      <Button title="عن النظام" variant="outline" onPress={() => router.push("/(school)/about")} />

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

const styles = {
  input: {
    borderWidth: 1 as const, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
  subLabel: { fontSize: 13, color: colors.gray700, marginBottom: 4 },
  chipsRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8, marginBottom: 8 },
  chip: { borderWidth: 1 as const, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.amber}22`, borderColor: colors.amber },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.amber, fontWeight: "700" as const },
};
