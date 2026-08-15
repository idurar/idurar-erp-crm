import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";

export default function ManualEntryScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const { data: results } = useQuery({
    queryKey: ["student-search", query],
    queryFn: () => api.supervisor.searchStudents(query),
    enabled: query.length > 1,
  });

  const mutation = useMutation({
    mutationFn: () => api.supervisor.manualBoard(tripId, selectedId!, reason),
    onSuccess: () => router.back(),
  });

  return (
    <ScreenContainer>
      <Text style={styles.label}>ابحث بالاسم أو رقم الطالب</Text>
      <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="اسم الطالب أو الكود" />

      <FlatList
        data={results}
        keyExtractor={(s) => s.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedId(item.id)}>
            <Card accentColor={selectedId === item.id ? colors.blueMid : colors.gray200}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.grade}>{item.grade} · {item.code}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />

      {selectedId ? (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>سبب الإدخال اليدوي</Text>
          <TextInput style={styles.input} value={reason} onChangeText={setReason} placeholder="سوار تعطل / ضاع" />
          <Button title="تأكيد التسجيل" onPress={() => mutation.mutate()} loading={mutation.isPending} disabled={!reason} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "700", color: colors.gray700, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, backgroundColor: colors.white, marginBottom: 12,
  },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  grade: { color: colors.gray600, fontSize: 12 },
});
