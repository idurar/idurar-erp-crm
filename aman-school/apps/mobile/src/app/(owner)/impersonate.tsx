import { useState } from "react";
import { Text, TextInput, View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, EmptyState, LoadingState, ScreenContainer, SectionHeader, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/** owner-impersonate (§13): a time-boxed (30 min), reason-logged support
 * session as a target school's own school_admin — every start is recorded
 * to ImpersonationLog on the backend. */
export default function ImpersonateScreen() {
  const router = useRouter();
  const startImpersonation = useSessionStore((s) => s.startImpersonation);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const { data: schools, isLoading } = useQuery({ queryKey: ["owner-schools"], queryFn: () => api.owner.schools() });
  const { data: logs } = useQuery({ queryKey: ["owner-impersonation-logs"], queryFn: () => api.owner.impersonationLogs() as Promise<any[]> });

  const startMutation = useMutation({
    mutationFn: () => api.owner.startImpersonation(selectedSchoolId!, reason.trim()),
    onSuccess: (res) => {
      startImpersonation(res.accessToken, res.targetUser, res.expiresAt);
      router.replace("/(school)/dashboard");
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <ScreenContainer>
      <Text style={styles.hint}>اختر المدرسة وسبب الدخول — الجلسة محدودة بـ 30 دقيقة ويُسجَّل كل دخول في سجل التدقيق.</Text>

      <SectionHeader title="المدرسة" accentColor={colors.purpleMid} />
      {schools?.map((s: any) => (
        <Card
          key={s.id}
          accentColor={selectedSchoolId === s.id ? colors.purpleMid : colors.gray200}
          onPress={() => setSelectedSchoolId(s.id)}
          style={styles.schoolCard}
        >
          <Text style={[styles.schoolName, selectedSchoolId === s.id && { color: colors.purpleMid }]}>{s.name}</Text>
        </Card>
      ))}

      <SectionHeader title="سبب الدخول (إلزامي)" accentColor={colors.purpleMid} />
      <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        placeholder="مثال: حل مشكلة تسجيل دخول أبلغت عنها المدرسة"
        multiline
      />

      <Button
        title="بدء جلسة الدعم (30 دقيقة)"
        color={colors.purpleMid}
        onPress={() => startMutation.mutate()}
        loading={startMutation.isPending}
        disabled={!selectedSchoolId || reason.trim().length < 5}
      />

      <SectionHeader title="سجل جلسات الدعم السابقة" accentColor={colors.purpleMid} />
      {!logs?.length ? (
        <EmptyState icon="🕵️" title="لا توجد جلسات دعم سابقة" />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(l) => l.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card style={styles.logCard}>
              <View style={styles.logRow}>
                <Text style={styles.logSchool}>{item.school?.name ?? "-"}</Text>
                <Text style={styles.logDate}>{new Date(item.startedAt).toLocaleString("ar-YE")}</Text>
              </View>
              <Text style={styles.logReason}>{item.reason}</Text>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 12, color: colors.gray600, marginBottom: 12, textAlign: "center", lineHeight: 18 },
  schoolCard: { marginBottom: 8 },
  schoolName: { fontWeight: "700", color: colors.navy, fontSize: 13 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 12, minHeight: 60, textAlignVertical: "top",
  },
  logCard: { marginBottom: 8 },
  logRow: { flexDirection: "row", justifyContent: "space-between" },
  logSchool: { fontWeight: "700", color: colors.navy, fontSize: 12 },
  logDate: { fontSize: 11, color: colors.gray400 },
  logReason: { fontSize: 12, color: colors.gray600, marginTop: 4 },
});
