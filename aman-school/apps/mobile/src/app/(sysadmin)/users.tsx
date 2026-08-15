import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { ROLE_LABELS_AR, type Role } from "@aman-school/types";
import { api } from "../../lib/api";

type SysadminUser = { id: string; name: string; role: Role; email: string | null; phone: string | null; createdAt: string };

export default function SysadminUsersScreen() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");

  const { data: users } = useQuery({
    queryKey: ["sysadmin-users", q],
    queryFn: () => api.sysadmin.users(q ? `?q=${encodeURIComponent(q)}` : "") as Promise<SysadminUser[]>,
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => api.sysadmin.suspendUser(id),
    onSuccess: (res: any) => {
      Alert.alert("تم", res?.note ?? "تم تحديث الحساب");
      queryClient.invalidateQueries({ queryKey: ["sysadmin-users"] });
    },
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
          <Card accentColor={colors.navy}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <StatusPill label={ROLE_LABELS_AR[item.role]} tone="info" />
            </View>
            <Text style={styles.meta}>{item.email ?? item.phone ?? "—"}</Text>
            <Text style={styles.suspend} onPress={() => suspendMutation.mutate(item.id)}>
              وضع الحساب قيد المراجعة
            </Text>
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
  suspend: { color: colors.red, fontSize: 11, marginTop: 8, fontWeight: "700" },
});
