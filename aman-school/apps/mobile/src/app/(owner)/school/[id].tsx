import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, StatusPill, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";

export default function OwnerSchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: school } = useQuery({ queryKey: ["owner-school-detail", id], queryFn: () => api.owner.schoolDetail(id) as Promise<any> });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.owner.setSchoolStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-school-detail", id] }),
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.purpleMid}>
        <Text style={styles.name}>{school?.name}</Text>
        <Text style={styles.meta}>{school?.address}</Text>
        <StatusPill label={school?.subscriptionStatus} tone={school?.subscriptionStatus === "active" ? "success" : "warning"} />
      </Card>

      <Card>
        <View style={styles.row}><Text style={styles.label}>الطلاب</Text><Text style={styles.value}>{school?.students?.length ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>الباصات</Text><Text style={styles.value}>{school?.buses?.length ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>الباقة</Text><Text style={styles.value}>{school?.package?.name ?? "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>الشريك</Text><Text style={styles.value}>{school?.partner?.name ?? "-"}</Text></View>
      </Card>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button title="تفعيل" onPress={() => statusMutation.mutate("active")} color={colors.greenMid} />
        <Button title="تعليق" onPress={() => statusMutation.mutate("suspended")} color={colors.red} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 17, fontWeight: "800", color: colors.navy, marginBottom: 4 },
  meta: { color: colors.gray600, fontSize: 12, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  label: { color: colors.gray600, fontSize: 13 },
  value: { color: colors.navy, fontWeight: "700", fontSize: 13 },
});
