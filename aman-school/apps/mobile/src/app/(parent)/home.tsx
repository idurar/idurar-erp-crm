import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, User } from "lucide-react-native";
import { Button, Card, EmptyState, ErrorState, GradientHeader, LoadingState, ScreenContainer, StatusPill, SubscriptionBanner, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";

const STATUS_LABEL: Record<string, string> = { home: "في المنزل", on_the_way: "في الطريق", at_school: "في المدرسة" };
const STATUS_TONE: Record<string, "neutral" | "warning" | "success"> = { home: "neutral", on_the_way: "warning", at_school: "success" };

export default function ParentHomeScreen() {
  const router = useRouter();
  const logout = useLogout();
  const user = useSessionStore((s) => s.user)!;
  const { data: children, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ["parent-children-status", user.id],
    queryFn: () => api.parent.childrenStatus(user.id),
  });
  const { data: subscription } = useQuery({
    queryKey: ["parent-subscription", user.id],
    queryFn: () => api.subscriptions.parentSubscription(user.id),
  });

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.parent}
          title="مرحباً بك"
          subtitle={user.name}
          icon={<User size={20} color={colors.white} />}
          right={
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/(parent)/notifications")}>
                <Bell size={18} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={async () => { await logout(); router.replace("/(auth)/role-select"); }}>
                <LogOut size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      <SubscriptionBanner endsAt={subscription?.endsAt} />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !children?.length ? (
        <EmptyState icon="👨‍👩‍👦" title="لا يوجد أبناء مضافون" subtitle="اضغط + لإضافة ابنك" />
      ) : (
        <FlatList
          data={children}
          keyExtractor={(c) => c.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card accentColor={colors.greenMid} onPress={() => router.push(`/(parent)/child/${item.id}`)}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.school}>{(item as any).school?.name ?? ""}</Text>
                </View>
                <StatusPill label={STATUS_LABEL[item.status] ?? item.status} tone={STATUS_TONE[item.status] ?? "neutral"} />
              </View>
              {item.busId ? (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push(`/(parent)/tracking/${item.busId}`);
                  }}
                >
                  <Text style={styles.trackLink}>📍 تتبع الباص مباشرة</Text>
                </TouchableOpacity>
              ) : null}
            </Card>
          )}
        />
      )}

      <Button title="+ إضافة ابن آخر" variant="outline" onPress={() => router.push("/(parent)/add-student")} />
      <Button title="الاشتراك والدفع" variant="outline" onPress={() => router.push("/(parent)/subscription")} />
      <Button title="🧾 الفواتير" variant="outline" onPress={() => router.push("/(parent)/invoices")} />
      <Button title="💳 حالة وسائل الدفع" variant="outline" onPress={() => router.push("/(parent)/payment-status")} />
      <Button title="التواصل والدعم" variant="outline" onPress={() => router.push("/(parent)/contact")} />
      <Button title="الإعدادات" variant="outline" onPress={() => router.push("/(parent)/settings")} />
      <Button title="حسابي" variant="outline" onPress={() => router.push("/(parent)/profile")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBleed: { marginHorizontal: -16, marginTop: -16, marginBottom: 20 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  muted: { color: colors.gray600, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  name: { fontWeight: "700", color: colors.navy, fontSize: 15 },
  school: { color: colors.gray600, fontSize: 12 },
  trackLink: { color: colors.blueMid, fontSize: 12, fontWeight: "700", marginTop: 4 },
});
