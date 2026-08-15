import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: "تحويل بنكي", cash: "نقداً", ecash: "إي كاش", yemenpay: "يمن باي",
};
const STATUS_TONE: Record<string, "success" | "warning" | "info"> = {
  instant: "success", instant_verify: "success", near_instant: "info", integrating: "warning",
};
const STATUS_LABEL: Record<string, string> = {
  instant: "فوري", instant_verify: "تحقق فوري", near_instant: "شبه فوري", integrating: "قيد الدمج",
};

/* ---- BC-7 / payment-status: payment gateway transparency ---- */
export default function PaymentStatusScreen() {
  const { data } = useQuery({
    queryKey: ["payment-gateway-status"],
    queryFn: () => api.subscriptions.gatewayStatus() as Promise<Record<string, { status: string; note: string }>>,
  });

  return (
    <ScreenContainer>
      <Text style={styles.intro}>حالة كل وسيلة دفع وسرعة تفعيلها بشفافية كاملة:</Text>
      {data
        ? Object.entries(data).map(([method, info]) => (
            <Card key={method} accentColor={colors.greenMid}>
              <View style={styles.row}>
                <Text style={styles.methodName}>{METHOD_LABEL[method] ?? method}</Text>
                <StatusPill label={STATUS_LABEL[info.status] ?? info.status} tone={STATUS_TONE[info.status] ?? "info"} />
              </View>
              <Text style={styles.note}>{info.note}</Text>
            </Card>
          ))
        : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 12, color: colors.gray700, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  methodName: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  note: { color: colors.gray600, fontSize: 12, marginTop: 6 },
});
