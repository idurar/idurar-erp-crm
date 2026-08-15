import { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");

  const { data: incident } = useQuery({ queryKey: ["incident", id], queryFn: () => api.operations.incident(id) as Promise<any> });

  const actionMutation = useMutation({
    mutationFn: () => api.operations.incidentAction(id, { note }),
    onSuccess: () => {
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["incident", id] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: () => api.operations.resolveAlert(id, reason),
    onSuccess: () => router.back(),
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.red}>
        <Text style={styles.message}>{incident?.message}</Text>
        <Text style={styles.meta}>
          {incident?.bus ? `باص ${incident.bus.busNumber}` : ""}
          {incident?.trip?.supervisor ? ` · المشرف: ${incident.trip.supervisor.name}` : ""}
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>سجل الإجراءات</Text>
      {(incident?.incidentActions ?? []).map((a: any) => (
        <Card key={a.id}>
          <Text style={styles.actionNote}>{a.note}</Text>
          <Text style={styles.actionMeta}>{a.user?.name ?? "-"} · {new Date(a.createdAt).toLocaleTimeString("ar-SA")}</Text>
        </Card>
      ))}

      <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="أضف إجراءً..." />
      <Button title="إضافة" variant="outline" onPress={() => actionMutation.mutate()} disabled={!note} loading={actionMutation.isPending} />

      <View style={{ height: 16 }} />
      <TextInput style={styles.input} value={reason} onChangeText={setReason} placeholder="سبب الإغلاق" />
      <Button title="إغلاق التنبيه" color={colors.red} onPress={() => resolveMutation.mutate()} disabled={!reason} loading={resolveMutation.isPending} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  message: { color: colors.navy, fontWeight: "700" },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  sectionTitle: { fontWeight: "700", color: colors.navy, marginVertical: 10, fontSize: 13 },
  actionNote: { color: colors.gray700, fontSize: 13 },
  actionMeta: { color: colors.gray400, fontSize: 10, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
});
