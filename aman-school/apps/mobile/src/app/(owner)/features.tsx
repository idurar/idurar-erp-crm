import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ErrorState, LoadingState, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

type FeatureFlag = {
  id: string; key: string; labelAr: string; description: string | null;
  enabledGlobally: boolean; enabledForSchoolIds: string[];
};

/** owner-features (§12): roll experimental features out to specific schools
 * before a platform-wide release. */
export default function FeatureFlagsScreen() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [key, setKey] = useState("");
  const [labelAr, setLabelAr] = useState("");
  const [description, setDescription] = useState("");

  const { data: flags, isLoading, isError, refetch } = useQuery({
    queryKey: ["owner-feature-flags"],
    queryFn: () => api.owner.featureFlags() as Promise<FeatureFlag[]>,
  });
  const { data: schools } = useQuery({ queryKey: ["owner-schools"], queryFn: () => api.owner.schools() });

  const createMutation = useMutation({
    mutationFn: () => api.owner.createFeatureFlag({ key, labelAr, description: description || undefined }),
    onSuccess: () => {
      setKey(""); setLabelAr(""); setDescription(""); setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ["owner-feature-flags"] });
    },
  });

  const toggleGlobalMutation = useMutation({
    mutationFn: ({ id, enabledGlobally }: { id: string; enabledGlobally: boolean }) =>
      api.owner.updateFeatureFlag(id, { enabledGlobally }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-feature-flags"] }),
  });

  const toggleSchoolMutation = useMutation({
    mutationFn: ({ id, schoolId, enabled }: { id: string; schoolId: string; enabled: boolean }) =>
      api.owner.setFeatureFlagForSchool(id, schoolId, enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-feature-flags"] }),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <ScreenContainer>
      {!flags?.length ? (
        <EmptyState icon="🧪" title="لا توجد ميزات تجريبية بعد" />
      ) : (
        flags.map((flag) => (
          <Card key={flag.id} accentColor={colors.purpleMid} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{flag.labelAr}</Text>
                <Text style={styles.key}>{flag.key}</Text>
              </View>
              <Switch
                value={flag.enabledGlobally}
                onValueChange={(v) => toggleGlobalMutation.mutate({ id: flag.id, enabledGlobally: v })}
              />
            </View>
            {flag.description ? <Text style={styles.desc}>{flag.description}</Text> : null}
            <Text style={styles.globalNote}>
              {flag.enabledGlobally ? "مفعّلة لجميع المدارس" : `مفعّلة لـ ${flag.enabledForSchoolIds.length} مدرسة محددة`}
            </Text>

            {!flag.enabledGlobally ? (
              <TouchableOpacity onPress={() => setExpandedId(expandedId === flag.id ? null : flag.id)}>
                <Text style={styles.expandLink}>{expandedId === flag.id ? "إخفاء المدارس ▲" : "عرض المدارس المشمولة ▼"}</Text>
              </TouchableOpacity>
            ) : null}

            {!flag.enabledGlobally && expandedId === flag.id ? (
              <View style={styles.schoolsList}>
                {schools?.map((s: any) => (
                  <View key={s.id} style={styles.schoolRow}>
                    <Switch
                      value={flag.enabledForSchoolIds.includes(s.id)}
                      onValueChange={(v) => toggleSchoolMutation.mutate({ id: flag.id, schoolId: s.id, enabled: v })}
                    />
                    <Text style={styles.schoolName}>{s.name}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Card>
        ))
      )}

      {showCreate ? (
        <Card accentColor={colors.purpleMid}>
          <TextInput style={styles.input} value={key} onChangeText={setKey} placeholder="المفتاح (بالإنجليزية، مثال: live_chat)" autoCapitalize="none" />
          <TextInput style={styles.input} value={labelAr} onChangeText={setLabelAr} placeholder="الاسم بالعربية" />
          <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="وصف مختصر (اختياري)" />
          <Button
            title="إنشاء الميزة"
            onPress={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!key || !labelAr}
            color={colors.purpleMid}
          />
        </Card>
      ) : (
        <Button title="+ ميزة تجريبية جديدة" onPress={() => setShowCreate(true)} color={colors.purpleMid} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontWeight: "800", color: colors.navy, fontSize: 14 },
  key: { fontSize: 11, color: colors.gray400, fontFamily: "monospace" as any },
  desc: { fontSize: 12, color: colors.gray600, marginTop: 8 },
  globalNote: { fontSize: 11, color: colors.purpleMid, fontWeight: "700", marginTop: 8 },
  expandLink: { fontSize: 12, color: colors.blueMid, fontWeight: "700", marginTop: 8 },
  schoolsList: { marginTop: 10, gap: 6, borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 10 },
  schoolRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  schoolName: { fontSize: 12, color: colors.gray700 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
});
