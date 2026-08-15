import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, EmptyState, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

export default function OwnerPartnersScreen() {
  const queryClient = useQueryClient();
  const { data: partners } = useQuery({ queryKey: ["owner-partners"], queryFn: () => api.owner.partners() as Promise<any[]> });
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [commission, setCommission] = useState("15");

  const createMutation = useMutation({
    mutationFn: () => api.owner.registerPartner({ name, region, commissionPercent: Number(commission) }),
    onSuccess: () => {
      setName(""); setRegion(""); setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["owner-partners"] });
    },
  });

  return (
    <ScreenContainer>
      {!partners?.length ? (
        <EmptyState icon="🤝" title="لا يوجد شركاء بعد" />
      ) : (
        <FlatList
          data={partners}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card accentColor={colors.orangeMid}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.region} · عمولة {item.commissionPercent}% · {item.schools?.length ?? 0} مدرسة</Text>
            </Card>
          )}
        />
      )}

      {showAdd ? (
        <View style={{ marginTop: 8 }}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسم الشريك" />
          <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="المنطقة" />
          <TextInput style={styles.input} value={commission} onChangeText={setCommission} placeholder="نسبة العمولة %" keyboardType="number-pad" />
          <Button title="تسجيل الشريك" onPress={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!name || !region} color={colors.orangeMid} />
        </View>
      ) : (
        <Button title="+ تسجيل شريك جديد" onPress={() => setShowAdd(true)} color={colors.orangeMid} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 8,
  },
});
