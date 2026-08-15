import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

/** OPS-04: contact supervisors directly (app message, with an SMS-channel option). */
export default function CommunicationsScreen() {
  const schoolId = useSessionStore((s) => s.user?.schoolId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"app" | "sms">("app");

  const { data: supervisors } = useQuery({
    queryKey: ["school-supervisors", schoolId],
    queryFn: () => api.school.supervisors(schoolId!),
    enabled: !!schoolId,
  });

  const mutation = useMutation({
    mutationFn: () => api.operations.sendMessage({ toUserId: selectedId!, message, channel }),
    onSuccess: () => {
      setMessage("");
      Alert.alert("تم الإرسال", "تم إرسال الرسالة");
    },
  });

  if (!supervisors?.length) return <ScreenContainer><EmptyState icon="💬" title="لا يوجد مشرفون لمراسلتهم" /></ScreenContainer>;

  return (
    <ScreenContainer>
      <Text style={styles.hint}>اختر مشرفاً لمراسلته</Text>
      <FlatList
        data={supervisors}
        keyExtractor={(s) => s.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedId(item.id)}>
            <Card accentColor={selectedId === item.id ? colors.navy : colors.gray200}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.employeeCode} · {item.phone}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />

      {selectedId ? (
        <View>
          <View style={styles.channelRow}>
            <TouchableOpacity onPress={() => setChannel("app")} style={[styles.chip, channel === "app" && styles.chipActive]}>
              <Text style={[styles.chipText, channel === "app" && styles.chipTextActive]}>داخل التطبيق</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChannel("sms")} style={[styles.chip, channel === "sms" && styles.chipActive]}>
              <Text style={[styles.chipText, channel === "sms" && styles.chipTextActive]}>SMS</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="اكتب رسالتك..." multiline />
          <Button title="إرسال" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!message} color={colors.navy} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, color: colors.gray600, marginBottom: 12, textAlign: "center" },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  channelRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.blueLight, borderColor: colors.blueMid },
  chipText: { fontSize: 12, color: colors.gray700 },
  chipTextActive: { color: colors.blueMid, fontWeight: "700" },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, padding: 12, minHeight: 80,
    textAlignVertical: "top", backgroundColor: colors.white, marginBottom: 10,
  },
});
