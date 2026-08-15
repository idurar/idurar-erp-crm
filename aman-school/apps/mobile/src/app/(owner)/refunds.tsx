import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TextInput } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = {
  pending: "warning", approved: "success", rejected: "danger",
};
const STATUS_LABEL: Record<string, string> = { pending: "قيد المراجعة", approved: "موافَق عليه", rejected: "مرفوض" };

/* ---- BC-5 / ow-refunds: refund request review & approval ---- */
export default function OwnerRefundsScreen() {
  const queryClient = useQueryClient();
  const [amountDraft, setAmountDraft] = useState<Record<string, string>>({});

  const { data: refunds } = useQuery({ queryKey: ["owner-refunds"], queryFn: () => api.owner.refunds() as Promise<any[]> });

  const resolveMutation = useMutation({
    mutationFn: ({ id, status, refundAmount }: { id: string; status: "approved" | "rejected"; refundAmount?: number }) =>
      api.owner.resolveRefund(id, status, refundAmount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-refunds"] }),
  });

  const pending = refunds?.filter((r) => r.status === "pending") ?? [];
  const resolved = refunds?.filter((r) => r.status !== "pending") ?? [];

  return (
    <ScreenContainer>
      <FlatList
        data={[...pending, ...resolved]}
        keyExtractor={(r) => r.id}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="💸" title="لا توجد طلبات استرداد" />}
        renderItem={({ item }) => (
          <Card accentColor={item.status === "pending" ? colors.amber : colors.gray200}>
            <View style={styles.row}>
              <Text style={styles.subject}>{item.school?.name ?? (item.parentUserId ? "ولي أمر" : "-")}</Text>
              <StatusPill label={STATUS_LABEL[item.status] ?? item.status} tone={STATUS_TONE[item.status] ?? "info"} />
            </View>
            <Text style={styles.reason}>{item.reason}</Text>
            <Text style={styles.meta}>مدفوع: {item.amountPaid} ر.ي · مستحق: {item.amountOwed} ر.ي · مقترح الاسترداد: {item.refundAmount} ر.ي</Text>

            {item.status === "pending" ? (
              <>
                <TextInput
                  style={styles.input}
                  value={amountDraft[item.id] ?? String(item.refundAmount)}
                  onChangeText={(v) => setAmountDraft((prev) => ({ ...prev, [item.id]: v }))}
                  keyboardType="decimal-pad"
                  placeholder="مبلغ الاسترداد النهائي"
                />
                <View style={styles.actionsRow}>
                  <Button
                    title="✅ موافقة"
                    color={colors.greenMid}
                    onPress={() =>
                      resolveMutation.mutate({ id: item.id, status: "approved", refundAmount: parseFloat(amountDraft[item.id] ?? String(item.refundAmount)) })
                    }
                    loading={resolveMutation.isPending}
                  />
                  <Button title="❌ رفض" variant="outline" onPress={() => resolveMutation.mutate({ id: item.id, status: "rejected" })} />
                </View>
              </>
            ) : null}
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subject: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  reason: { color: colors.gray700, fontSize: 12, marginTop: 6 },
  meta: { color: colors.gray600, fontSize: 11, marginTop: 6 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 8, fontSize: 13, backgroundColor: colors.white, marginTop: 10, marginBottom: 8,
  },
  actionsRow: { flexDirection: "row", gap: 8 },
});
