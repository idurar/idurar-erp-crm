import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, SectionHeader, StatusPill, colors } from "@aman-school/shared-ui";
import { PARENT_PACKAGE_TIERS } from "@aman-school/types";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const CYCLES = [
  { value: "monthly", label: "شهري" },
  { value: "quarterly", label: "ربع سنوي" },
  { value: "yearly", label: "سنوي" },
];

const METHODS = [
  { value: "ecash", label: "إي كاش" },
  { value: "bank_transfer", label: "تحويل بنكي" },
  { value: "cash", label: "نقداً" },
  { value: "yemenpay", label: "يمن باي (قريباً)" },
];

export default function ParentSubscriptionScreen() {
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [cycle, setCycle] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [method, setMethod] = useState<string>("ecash");
  const [receiptUrl, setReceiptUrl] = useState("");

  const { data: subscription } = useQuery({
    queryKey: ["parent-subscription", user.id],
    queryFn: () => api.subscriptions.parentSubscription(user.id),
  });
  const { data: payments } = useQuery({
    queryKey: ["parent-payments", user.id],
    queryFn: () => api.subscriptions.parentPayments(user.id) as Promise<any[]>,
  });

  const subscribeMutation = useMutation({
    mutationFn: () => api.subscriptions.subscribeParent(user.id, selectedTier!, cycle),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parent-subscription"] }),
  });

  const paymentMutation = useMutation({
    mutationFn: () => {
      const plan = PARENT_PACKAGE_TIERS.find((p) => p.tier === selectedTier)!;
      const amount = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
      return api.subscriptions.submitPayment({
        subjectType: "parent",
        subjectId: user.id,
        packageName: plan.name,
        cycle,
        amount,
        method,
        receiptUrl: receiptUrl || undefined,
      });
    },
    onSuccess: () => {
      Alert.alert("تم الدفع", "تم تسجيل عملية الدفع بنجاح");
      setReceiptUrl("");
      queryClient.invalidateQueries({ queryKey: ["parent-payments"] });
      subscribeMutation.mutate();
    },
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.greenMid}>
        <Text style={styles.label}>باقتك الحالية</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{subscription?.tier ?? "لا يوجد اشتراك فعّال"}</Text>
          {subscription?.endsAt ? <StatusPill label={`ينتهي: ${new Date(subscription.endsAt).toLocaleDateString("ar-YE")}`} tone="info" /> : null}
        </View>
      </Card>

      <SectionHeader title="اختر باقة" accentColor={colors.greenMid} />
      {PARENT_PACKAGE_TIERS.map((plan) => (
        <TouchableOpacity key={plan.tier} onPress={() => setSelectedTier(plan.tier)}>
          <Card accentColor={selectedTier === plan.tier ? colors.greenMid : colors.gray200}>
            <View style={styles.row}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.priceMonthly} ر.ي / شهرياً</Text>
            </View>
            <Text style={styles.meta}>{plan.buses ?? "غير محدود"} باص • {plan.children ?? "غير محدود"} ابن</Text>
            {plan.features.map((f) => (
              <Text key={f} style={styles.feature}>• {f}</Text>
            ))}
          </Card>
        </TouchableOpacity>
      ))}

      {selectedTier ? (
        <>
          <SectionHeader title="دورة الفوترة" accentColor={colors.greenMid} />
          <View style={styles.chipsRow}>
            {CYCLES.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={[styles.chip, cycle === c.value && styles.chipActive]}
                onPress={() => setCycle(c.value as typeof cycle)}
              >
                <Text style={[styles.chipText, cycle === c.value && styles.chipTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionHeader title="طريقة الدفع" accentColor={colors.greenMid} />
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

          <Button
            title="تأكيد الدفع والاشتراك"
            onPress={() => paymentMutation.mutate()}
            loading={paymentMutation.isPending || subscribeMutation.isPending}
            color={colors.greenMid}
          />
        </>
      ) : null}

      <SectionHeader title="سجل المدفوعات" accentColor={colors.greenMid} />
      {payments?.length ? (
        payments.map((p) => (
          <Card key={p.id} accentColor={colors.greenMid}>
            <View style={styles.row}>
              <Text style={styles.planName}>{p.packageName}</Text>
              <Text style={styles.planPrice}>{p.amount} ر.ي</Text>
            </View>
            <Text style={styles.meta}>{new Date(p.createdAt).toLocaleDateString("ar-YE")} • {METHODS.find((m) => m.value === p.method)?.label ?? p.method}</Text>
          </Card>
        ))
      ) : (
        <Text style={styles.meta}>لا توجد مدفوعات سابقة</Text>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.gray600, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  value: { fontSize: 15, fontWeight: "800", color: colors.navy },
  planName: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  planPrice: { fontWeight: "700", color: colors.greenMid, fontSize: 13 },
  meta: { color: colors.gray600, fontSize: 11, marginTop: 4 },
  feature: { color: colors.gray700, fontSize: 11, marginTop: 4 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: `${colors.greenMid}22`, borderColor: colors.greenMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.greenMid, fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 12,
  },
});
