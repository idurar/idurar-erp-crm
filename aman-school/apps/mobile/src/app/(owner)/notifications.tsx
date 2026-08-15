import { Text, View, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type OwnerNotification = { type: string; message: string; createdAt: string };

const TYPE_ICON: Record<string, string> = { subscription_risk: "⚠️", new_school: "🏫", growth: "📈" };
const TYPE_COLOR: Record<string, string> = { subscription_risk: colors.amber, new_school: colors.purpleMid, growth: colors.greenMid };

/* ---- ow-notifications: executive-only alerts (subscription expiry, growth, new partner requests) ---- */
export default function OwnerNotificationsScreen() {
  const { data: notifications } = useQuery({
    queryKey: ["owner-notifications"],
    queryFn: () => api.owner.notifications() as Promise<OwnerNotification[]>,
  });

  return (
    <ScreenContainer>
      <FlatList
        data={notifications}
        keyExtractor={(n, i) => `${n.type}-${i}`}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="🔔" title="لا توجد إشعارات" />}
        renderItem={({ item }) => (
          <Card accentColor={TYPE_COLOR[item.type] ?? colors.navy}>
            <View style={styles.row}>
              <Text style={styles.icon}>{TYPE_ICON[item.type] ?? "🔔"}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString("ar-YE")}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  icon: { fontSize: 20 },
  message: { color: colors.navy, fontWeight: "700", fontSize: 13 },
  meta: { color: colors.gray600, fontSize: 11, marginTop: 4 },
});
