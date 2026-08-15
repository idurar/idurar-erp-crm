import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TextInput, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/* ---- BC-6 / invoices: official invoice list + refund request (parent) ---- */
export default function ParentInvoicesScreen() {
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();
  const [showRefund, setShowRefund] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: invoices } = useQuery({ queryKey: ["parent-invoices", user.id], queryFn: () => api.parent.invoices(user.id) as Promise<any[]> });

  const refundMutation = useMutation({
    mutationFn: () => {
      const lastPaid = invoices?.find((i) => i.status === "paid");
      if (!lastPaid) throw new Error("لا توجد فاتورة مدفوعة لطلب استرداد بشأنها");
      return api.parent.requestRefund({
        subjectType: "parent", subjectId: user.id, reason,
        amountPaid: lastPaid.amount, amountOwed: 0,
      });
    },
    onSuccess: () => {
      Alert.alert("تم الإرسال", "تم إرسال طلب الاسترداد للمراجعة من إدارة المنصة");
      setShowRefund(false);
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["parent-invoices"] });
    },
    onError: (e) => setError(e instanceof HttpError ? String((e.body as any)?.error ?? "تعذر إرسال الطلب") : "تعذر الاتصال بالخادم"),
  });

  return (
    <ScreenContainer>
      <FlatList
        data={invoices}
        keyExtractor={(i) => i.id}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="🧾" title="لا توجد فواتير بعد" />}
        renderItem={({ item }) => (
          <Card accentColor={colors.greenMid}>
            <View style={styles.row}>
              <Text style={styles.invNumber}>{item.invoiceNumber}</Text>
              <Text style={styles.amount}>{item.amount} ر.ي</Text>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>{item.issuedAt ? new Date(item.issuedAt).toLocaleDateString("ar-YE") : ""} · {item.status === "paid" ? "مدفوعة ✅" : item.status}</Text>
          </Card>
        )}
      />

      <View style={{ height: 16 }} />
      {showRefund ? (
        <Card accentColor={colors.amber}>
          <TextInput style={styles.input} value={reason} onChangeText={setReason} placeholder="سبب طلب الاسترداد" multiline />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="إرسال الطلب" onPress={() => refundMutation.mutate()} loading={refundMutation.isPending} disabled={!reason} color={colors.amber} />
        </Card>
      ) : (
        <Button title="💸 طلب استرداد مبلغ" variant="outline" onPress={() => setShowRefund(true)} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  invNumber: { fontWeight: "800", color: colors.navy, fontSize: 13 },
  amount: { fontWeight: "700", color: colors.greenMid, fontSize: 13 },
  desc: { color: colors.gray700, fontSize: 12, marginTop: 6 },
  meta: { color: colors.gray600, fontSize: 11, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10, minHeight: 60, textAlignVertical: "top",
  },
  error: { color: colors.red, fontSize: 12, marginBottom: 8 },
});
