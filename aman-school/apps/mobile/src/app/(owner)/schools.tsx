import { useMemo, useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = {
  active: "success", trial: "info", suspended: "warning", expired: "danger",
};
const STATUS_LABEL: Record<string, string> = { active: "نشط", trial: "تجريبي", suspended: "معلّق", expired: "منتهي" };

export default function OwnerSchoolsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [packageId, setPackageId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const { data: schools, isLoading, isRefetching, refetch } = useQuery({ queryKey: ["owner-schools"], queryFn: () => api.owner.schools() });
  const { data: packages } = useQuery({ queryKey: ["owner-packages"], queryFn: () => api.owner.packages() as Promise<any[]> });

  const filteredSchools = useMemo(() => {
    if (!schools) return schools;
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s: any) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q));
  }, [schools, query]);

  const registerMutation = useMutation({
    mutationFn: () => api.owner.registerSchool({ name, slug, adminName, adminEmail, packageId: packageId! }),
    onSuccess: (res: any) => {
      setShowAdd(false);
      setName(""); setSlug(""); setAdminName(""); setAdminEmail(""); setPackageId(null);
      queryClient.invalidateQueries({ queryKey: ["owner-schools"] });
      if (res.devTempPassword) Alert.alert("تم التسجيل", `كلمة مرور المدير المؤقتة: ${res.devTempPassword}`);
    },
  });

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <Button
        title="🚀 معالج الإطلاق الكامل (5 خطوات)"
        onPress={() => router.push("/(owner)/onboarding")}
        color={colors.purpleMid}
      />
      <View style={{ height: 12 }} />
      <TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="بحث بالاسم أو المعرّف" placeholderTextColor={colors.gray400} />

      {isLoading ? null : !filteredSchools?.length ? (
        <EmptyState icon="🏫" title={query ? "لا نتائج مطابقة" : "لا توجد مدارس مسجّلة بعد"} />
      ) : (
        <FlatList
          data={filteredSchools}
          keyExtractor={(s) => s.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card accentColor={colors.purpleMid} onPress={() => router.push(`/(owner)/school/${item.id}`)}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <StatusPill label={STATUS_LABEL[item.subscriptionStatus] ?? item.subscriptionStatus} tone={STATUS_TONE[item.subscriptionStatus] ?? "info"} />
              </View>
              <Text style={styles.meta}>{(item as any).package?.name ?? "بدون باقة"}</Text>
            </Card>
          )}
        />
      )}

      {showAdd ? (
        <View style={{ marginTop: 8 }}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم المدرسة" />
          <TextInput style={styles.input} value={slug} onChangeText={setSlug} placeholder="المعرّف (slug), مثال: noor2" autoCapitalize="none" />
          <TextInput style={styles.input} value={adminName} onChangeText={setAdminName} placeholder="اسم مدير المدرسة" />
          <TextInput style={styles.input} value={adminEmail} onChangeText={setAdminEmail} placeholder="بريد المدير" autoCapitalize="none" keyboardType="email-address" />
          <View style={styles.packageRow}>
            {packages?.map((p) => (
              <TouchableOpacity key={p.id} onPress={() => setPackageId(p.id)} style={[styles.packageChip, packageId === p.id && styles.packageChipActive]}>
                <Text style={[styles.packageText, packageId === p.id && styles.packageTextActive]}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title="تسجيل المدرسة"
            onPress={() => registerMutation.mutate()}
            loading={registerMutation.isPending}
            disabled={!name || !slug || !adminName || !adminEmail || !packageId}
            color={colors.purpleMid}
          />
        </View>
      ) : (
        <Button title="+ تسجيل مدرسة جديدة" onPress={() => setShowAdd(true)} color={colors.purpleMid} />
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
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
  packageRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  packageChip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  packageChipActive: { backgroundColor: `${colors.purpleMid}22`, borderColor: colors.purpleMid },
  packageText: { fontSize: 12, color: colors.gray700 },
  packageTextActive: { color: colors.purpleMid, fontWeight: "700" },
});
