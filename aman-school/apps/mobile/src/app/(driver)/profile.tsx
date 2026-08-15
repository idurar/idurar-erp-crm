import { Text, View, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/* ---- D-03 / d-profile: driver personal info + license + maintenance history ---- */
export default function DriverProfileScreen() {
  const user = useSessionStore((s) => s.user)!;
  const { data: bus } = useQuery({ queryKey: ["driver-my-bus"], queryFn: () => api.driver.myBus() as Promise<any | null> });
  const { data: history } = useQuery({
    queryKey: ["driver-maintenance-history", bus?.id],
    queryFn: () => api.driver.maintenanceHistory(bus!.id) as Promise<any[]>,
    enabled: !!bus?.id,
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.tealMid}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.meta}>{user.phone}{(user as any).employeeCode ? ` · ${(user as any).employeeCode}` : ""}</Text>
        <Text style={styles.meta}>رخصة القيادة: {(user as any).licenseNumber ?? "-"}</Text>
        {(user as any).licenseExpiresAt ? (
          <Text style={styles.meta}>تنتهي: {new Date((user as any).licenseExpiresAt).toLocaleDateString("ar-YE")}</Text>
        ) : null}
        <Text style={styles.meta}>سنوات الخبرة: {(user as any).yearsExperience ?? 0}</Text>
      </Card>

      <SectionHeader title="سجل صيانة الباص المخصص" />
      {!history?.length ? (
        <EmptyState icon="🔧" title="لا توجد سجلات صيانة" />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(r: any) => r.id}
          scrollEnabled={false}
          renderItem={({ item }: any) => (
            <Card accentColor={item.type === "emergency" ? colors.red : colors.blueMid}>
              <Text style={styles.recordTitle}>{item.type === "emergency" ? "🚨 طارئة" : "🔧 دورية"} — {item.workshop ?? "—"}</Text>
              <Text style={styles.meta}>{new Date(item.date).toLocaleDateString("ar-YE")}{item.notes ? ` · ${item.notes}` : ""}</Text>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontWeight: "800", color: colors.navy, fontSize: 16 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  recordTitle: { fontWeight: "700", color: colors.navy, fontSize: 13 },
});
