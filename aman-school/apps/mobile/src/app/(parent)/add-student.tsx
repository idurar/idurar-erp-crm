import { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { HttpError } from "@aman-school/api-client";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/** Covers both P-04 (first student) and P-12 (add another, possibly cross-school). */
export default function AddStudentScreen() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [linked, setLinked] = useState<{ name: string; grade: string } | null>(null);

  const mutation = useMutation({
    mutationFn: () => api.parent.linkStudent(code.trim().toUpperCase()),
    onSuccess: (student) => {
      setError(null);
      setLinked(student);
      queryClient.invalidateQueries({ queryKey: ["parent-children-status", user.id] });
    },
    onError: (e) => {
      setError(e instanceof HttpError ? String((e.body as { error?: string })?.error ?? "الكود غير صحيح") : "تعذر الاتصال بالخادم");
    },
  });

  return (
    <ScreenContainer>
      <Text style={styles.hint}>احصل على الكود من مدرسة ابنك (مثال: NOOR-2026-00001)</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        placeholder="SCHOOL-2026-XXXXX"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {linked ? (
        <Card accentColor={colors.greenMid}>
          <Text style={styles.successTitle}>مرحباً بـ {linked.name} 🎉</Text>
          <Text style={styles.successSubtitle}>{linked.grade}</Text>
        </Card>
      ) : null}

      {linked ? (
        <Button title="العودة للرئيسية" onPress={() => router.replace("/(parent)/home")} />
      ) : (
        <View>
          <Text style={styles.note}>ستتلقى إشعارات لجميع أبنائك، حتى من مدارس مختلفة</Text>
          <Button title="إضافة" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!code} />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, color: colors.gray600, marginBottom: 14, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 14, fontSize: 16, textAlign: "center", backgroundColor: colors.white, marginBottom: 10,
  },
  error: { color: colors.red, fontSize: 12, marginBottom: 12, textAlign: "center" },
  successTitle: { fontWeight: "800", color: colors.greenMid, fontSize: 16, textAlign: "center" },
  successSubtitle: { color: colors.gray600, fontSize: 13, textAlign: "center" },
  note: { fontSize: 11, color: colors.gray400, textAlign: "center", marginBottom: 12 },
});
