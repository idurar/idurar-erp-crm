import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, ScreenContainer, SectionHeader, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type RolesResponse = {
  roles: Array<{ role: string; labelAr: string; count: number }>;
  permissions: Array<{ key: string; labelAr: string; roles: string[] }>;
};

export default function SysadminRolesScreen() {
  const { data } = useQuery({
    queryKey: ["sysadmin-roles"],
    queryFn: () => api.sysadmin.roles() as Promise<RolesResponse>,
  });

  return (
    <ScreenContainer>
      <SectionHeader title="الأدوار وعدد المستخدمين" accentColor={colors.navy} />
      {data?.roles.map((r) => (
        <Card key={r.role} accentColor={colors.navy}>
          <View style={styles.row}>
            <Text style={styles.label}>{r.labelAr}</Text>
            <StatusPill label={String(r.count)} tone="info" />
          </View>
        </Card>
      ))}

      <SectionHeader title="مصفوفة الصلاحيات" accentColor={colors.navy} />
      {data?.permissions.map((p) => (
        <Card key={p.key} accentColor={colors.blueMid}>
          <Text style={styles.label}>{p.labelAr}</Text>
          <View style={styles.chipsRow}>
            {p.roles.map((role) => (
              <View key={role} style={styles.chip}>
                <Text style={styles.chipText}>{role}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: { backgroundColor: colors.gray100, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: colors.gray700 },
});
