import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

function formatElapsed(createdAt: string) {
  const seconds = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ---- SF-9 / o-not-collected: escalated student-not-collected incidents ---- */
export default function NotCollectedScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [instructionDraft, setInstructionDraft] = useState<Record<string, string>>({});

  const { data: alerts } = useQuery({
    queryKey: ["not-collected"],
    queryFn: () => api.operations.notCollected() as Promise<any[]>,
    refetchInterval: 5000,
  });

  const instructMutation = useMutation({
    mutationFn: ({ alertId, instruction }: { alertId: string; instruction: string }) =>
      api.operations.instructSupervisor(alertId, instruction),
    onSuccess: (_res, { alertId }) => {
      setInstructionDraft((prev) => ({ ...prev, [alertId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["not-collected"] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (alertId: string) => api.operations.resolveAlert(alertId, "تم الحل يدوياً من غرفة العمليات"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["not-collected"] }),
  });

  return (
    <ScreenContainer backgroundColor={colors.navy}>
      <FlatList
        data={alerts}
        keyExtractor={(a) => a.id}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyState icon="✅" title="لا توجد حالات عدم استلام مفتوحة" />}
        renderItem={({ item }) => (
          <Card style={{ backgroundColor: "rgba(255,255,255,0.06)" }} accentColor={colors.red}>
            <View style={styles.row}>
              <Text style={styles.message}>{item.message}</Text>
              <StatusPill label="حرج" tone="danger" />
            </View>
            <Text style={styles.meta}>
              {item.bus ? `باص ${item.bus.busNumber}` : ""} • الوقت المنقضي: {formatElapsed(item.createdAt)} ⏱️
            </Text>

            <View style={styles.actionsRow}>
              <Text style={styles.actionButton} onPress={() => router.push(`/(operations)/incident/${item.id}`)}>
                📋 تفاصيل الحادثة وسجل الإجراءات ←
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={instructionDraft[item.id] ?? ""}
              onChangeText={(v) => setInstructionDraft((prev) => ({ ...prev, [item.id]: v }))}
              placeholder="تعليمة للمشرف (مثال: أعد الطالب للمدرسة)"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
            <Button
              title="🚌 إرسال تعليمة للمشرف"
              variant="outline"
              onPress={() => instructMutation.mutate({ alertId: item.id, instruction: instructionDraft[item.id] ?? "" })}
              disabled={!instructionDraft[item.id]}
              loading={instructMutation.isPending}
            />
            <Button title="✅ تم الحل يدوياً" onPress={() => resolveMutation.mutate(item.id)} loading={resolveMutation.isPending} color={colors.greenMid} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  message: { color: colors.white, fontWeight: "700", fontSize: 14, flex: 1 },
  meta: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 6 },
  actionsRow: { marginTop: 10 },
  actionButton: { color: colors.blueMid, fontSize: 12, fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 8, fontSize: 13, color: colors.white, marginTop: 10, marginBottom: 8,
  },
});
