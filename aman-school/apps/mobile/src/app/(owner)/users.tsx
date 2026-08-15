import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { ROLE_LABELS_AR, type Role } from "@aman-school/types";
import { api } from "../../lib/api";

type PlatformUser = {
  id: string; name: string; role: Role; email: string | null; phone: string | null;
  schoolName: string | null; createdAt: string;
};

/* ---- OWN-08 (ow-users): every user on the platform, across all schools ---- */
export default function OwnerUsersScreen() {
  const [q, setQ] = useState("");
  const { data: users } = useQuery({
    queryKey: ["owner-users", q],
    queryFn: () => api.owner.users(q ? `?q=${encodeURIComponent(q)}` : "") as Promise<PlatformUser[]>,
  });

  return (
    <ScreenContainer>
      <TextInput
        style={styles.search}
        value={q}
        onChangeText={setQ}
        placeholder="بحث بالاسم أو البريد أو الهاتف"
        autoCapitalize="none"
      />
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="👥" title="لا يوجد مستخدمون مطابقون" />}
        renderItem={({ item }) => (
          <Card accentColor={colors.purpleMid}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <StatusPill label={ROLE_LABELS_AR[item.role]} tone="info" />
            </View>
            <Text style={styles.meta}>{item.email ?? item.phone ?? "—"}</Text>
            {item.schoolName ? <Text style={styles.meta}>{item.schoolName}</Text> : null}
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
});
