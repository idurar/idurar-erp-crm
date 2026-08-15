import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import type { Alert } from "@aman-school/types";

const STATUS_LABEL: Record<string, string> = { active: "نشط", acknowledged: "قيد المعالجة", resolved: "مغلق" };
const STATUS_TONE: Record<string, "danger" | "warning" | "success"> = { active: "danger", acknowledged: "warning", resolved: "success" };
const TYPE_LABEL: Record<string, string> = { sos: "استغاثة", delay: "تأخير", incident: "حادثة", exception: "استثناء" };
const PRIORITY_LABEL: Record<string, string> = { urgent_critical: "حرج", urgent: "عاجل", notice: "ملاحظة" };

/* ---- O-5: incidents list — all alerts, any status, for the ops room ---- */
export default function IncidentsListScreen() {
  const router = useRouter();
  const { data: incidents } = useQuery({
    queryKey: ["incidents-list"],
    queryFn: () => api.operations.incidents() as Promise<Array<Alert & { bus?: { busNumber: string } | null }>>,
  });

  return (
    <ScreenContainer>
      <FlatList
        data={incidents}
        keyExtractor={(a) => a.id}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="📋" title="لا توجد حوادث مسجّلة" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(operations)/incident/${item.id}`)}>
            <Card accentColor={colors.redMid}>
              <View style={styles.row}>
                <Text style={styles.type}>{TYPE_LABEL[item.type] ?? item.type}</Text>
                <StatusPill label={STATUS_LABEL[item.status] ?? item.status} tone={STATUS_TONE[item.status] ?? "warning"} />
              </View>
              <Text style={styles.message}>{item.message ?? "—"}</Text>
              <Text style={styles.meta}>
                {PRIORITY_LABEL[item.priority] ?? item.priority}
                {item.bus ? ` • باص ${item.bus.busNumber}` : ""}
                {" • "}
                {new Date(item.createdAt).toLocaleString("ar-YE")}
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  type: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  message: { color: colors.gray700, fontSize: 13, marginTop: 4 },
  meta: { color: colors.gray600, fontSize: 11, marginTop: 4 },
});
