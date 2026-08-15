import { useState } from "react";
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, colors, formatPackagePrice } from "@aman-school/shared-ui";
import { ScreenContainer } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

/** OWN-05: view + edit packages/pricing (currency: ر.ي — Yemeni Rial). */
export default function OwnerPackagesScreen() {
  const queryClient = useQueryClient();
  const { data: packages } = useQuery({ queryKey: ["owner-packages"], queryFn: () => api.owner.packages() as Promise<any[]> });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [limit, setLimit] = useState("");

  const updateMutation = useMutation({
    mutationFn: () => api.owner.updatePackage(editingId!, { priceMonthly: Number(price), studentLimit: Number(limit) }),
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["owner-packages"] });
    },
  });

  return (
    <ScreenContainer>
      <FlatList
        data={packages}
        keyExtractor={(p) => p.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card accentColor={colors.purpleMid}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{formatPackagePrice(item.priceMonthly)}{item.priceMonthly > 0 ? " / شهرياً" : ""} · حتى {item.studentLimit} طالب</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {item.features?.map((f: string) => (
                <View key={f} style={styles.featureChip}><Text style={styles.featureText}>{f}</Text></View>
              ))}
            </View>
            {editingId === item.id ? (
              <View style={{ marginTop: 10 }}>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="السعر الشهري (ر.ي)" keyboardType="number-pad" />
                <TextInput style={styles.input} value={limit} onChangeText={setLimit} placeholder="الحد الأقصى للطلاب" keyboardType="number-pad" />
                <Button title="حفظ" onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} color={colors.purpleMid} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setEditingId(item.id);
                  setPrice(String(item.priceMonthly));
                  setLimit(String(item.studentLimit));
                }}
              >
                <Text style={styles.editLink}>تعديل السعر ›</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  name: { fontWeight: "800", color: colors.navy, fontSize: 15 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 4 },
  featureChip: { backgroundColor: colors.purpleLight, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  featureText: { fontSize: 10, color: colors.purpleMid },
  editLink: { color: colors.purpleMid, fontWeight: "700", fontSize: 12, marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 8, paddingHorizontal: 10,
    paddingVertical: 8, fontSize: 13, backgroundColor: colors.white, marginBottom: 6,
  },
});
