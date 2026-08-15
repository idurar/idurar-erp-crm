import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

export default function StudentsScreen() {
  const router = useRouter();
  const schoolId = useSessionStore((s) => s.user?.schoolId)!;
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const { data: students, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["school-students", schoolId, query],
    queryFn: () => api.school.students(schoolId, query ? `?q=${encodeURIComponent(query)}` : ""),
  });

  const createMutation = useMutation({
    mutationFn: () => api.school.createStudent(schoolId, { name, grade }),
    onSuccess: () => {
      setName("");
      setGrade("");
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });
    },
  });

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="بحث بالاسم أو الكود" placeholderTextColor={colors.gray400} />

      <Button title="📥 استيراد دفعة من Excel" variant="outline" onPress={() => router.push("/(school)/import-students")} />
      <View style={{ height: 10 }} />

      {isLoading ? null : !students?.length ? (
        <EmptyState icon="🎒" title={query ? "لا نتائج مطابقة" : "لا يوجد طلاب بعد"} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(s) => s.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/(school)/student/${item.id}`)}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.grade} · {item.code}</Text>
            </Card>
          )}
        />
      )}

      {showAdd ? (
        <View style={styles.addForm}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم الطالب" />
          <TextInput style={styles.input} value={grade} onChangeText={setGrade} placeholder="الصف" />
          <Button title="حفظ" onPress={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!name || !grade} />
        </View>
      ) : (
        <Button title="+ إضافة طالب" onPress={() => setShowAdd(true)} color={colors.amber} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 12,
  },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12 },
  addForm: { marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
});
