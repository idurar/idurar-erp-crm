import { useEffect, useState } from "react";
import { Text, Image, View, TextInput, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, SectionHeader, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

/* ---- OP-1 / a-student-edit: edit or archive an existing student ---- */
export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: student } = useQuery({ queryKey: ["student", id], queryFn: () => api.school.student(id) });
  const { data: qr } = useQuery({ queryKey: ["student-qr", id], queryFn: () => api.school.studentQrCode(id) });

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setGrade(student.grade);
    }
  }, [student]);

  const updateMutation = useMutation({
    mutationFn: () => api.school.updateStudent(id, { name, grade }),
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => api.school.archiveStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students"] });
      router.back();
    },
  });

  function confirmArchive() {
    Alert.alert("أرشفة الطالب", "هل أنت متأكد من أرشفة هذا الطالب؟ سيتم إخفاؤه من القوائم النشطة.", [
      { text: "إلغاء", style: "cancel" },
      { text: "أرشفة", style: "destructive", onPress: () => archiveMutation.mutate() },
    ]);
  }

  return (
    <ScreenContainer>
      {editing ? (
        <Card>
          <SectionHeader title="تعديل بيانات الطالب" />
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم الطالب" />
          <TextInput style={styles.input} value={grade} onChangeText={setGrade} placeholder="الصف" />
          <View style={styles.actionsRow}>
            <Button title="حفظ" onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} disabled={!name || !grade} />
            <Button title="إلغاء" variant="outline" onPress={() => setEditing(false)} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={{ fontSize: 17, fontWeight: "800", color: colors.navy }}>{student?.name}</Text>
          <Text style={{ color: colors.gray600, marginTop: 4 }}>{student?.grade} · {student?.code}</Text>
          <View style={styles.actionsRow}>
            <Button title="✏️ تعديل" variant="outline" onPress={() => setEditing(true)} />
            <Button title="🗄️ أرشفة" color={colors.red} onPress={confirmArchive} loading={archiveMutation.isPending} />
          </View>
        </Card>
      )}

      {qr?.qrDataUrl ? (
        <Card>
          <Text style={{ textAlign: "center", fontWeight: "700", color: colors.navy, marginBottom: 10 }}>
            كود QR (لولي الأمر لمسحه عند إضافة الطالب)
          </Text>
          <Image source={{ uri: qr.qrDataUrl }} style={{ width: 200, height: 200, alignSelf: "center" }} />
        </Card>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10,
  },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
});
