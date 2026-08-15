import { useMemo, useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

type SchoolParent = {
  id: string; name: string; phone: string | null;
  subscriptionTier: string | null; subscriptionEndsAt: string | null;
  children: Array<{ id: string; name: string; grade: string }>;
};

/* ---- A-9: parents/guardians of this school's students ---- */
export default function SchoolParentsScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const [query, setQuery] = useState("");
  const { data: parents, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["school-parents", schoolId],
    queryFn: () => api.school.parents(schoolId) as Promise<SchoolParent[]>,
  });

  const filtered = useMemo(() => {
    if (!parents) return parents;
    const q = query.trim().toLowerCase();
    if (!q) return parents;
    return parents.filter((p) => p.name.toLowerCase().includes(q) || (p.phone ?? "").includes(q));
  }, [parents, query]);

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="بحث بالاسم أو الجوال" placeholderTextColor={colors.gray400} />

      {isLoading ? null : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
          ListEmptyComponent={<EmptyState icon="👨‍👩‍👦" title={query ? "لا نتائج مطابقة" : "لا يوجد أولياء أمور مسجّلون"} />}
          renderItem={({ item }) => (
            <Card accentColor={colors.amber}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                {item.subscriptionTier ? <StatusPill label={item.subscriptionTier} tone="success" /> : <StatusPill label="بدون اشتراك" tone="neutral" />}
              </View>
              <Text style={styles.meta}>{item.phone ?? "—"}</Text>
              <Text style={styles.meta}>
                الأبناء: {item.children.map((c) => `${c.name} (${c.grade})`).join("، ")}
              </Text>
            </Card>
          )}
        />
      )}
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
