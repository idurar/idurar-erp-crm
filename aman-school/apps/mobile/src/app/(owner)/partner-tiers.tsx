import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TextInput } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, colors } from "@aman-school/shared-ui";
import { ScreenContainer } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const TIER_LABEL: Record<string, string> = { silver: "🥈 فضي", gold: "🥇 ذهبي" };

/* ---- BC-6 / ow-partner-tiers: partner commission tier management ---- */
export default function PartnerTiersScreen() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, { commissionPercent: string; minActiveSchools: string }>>({});

  const { data: tiers } = useQuery({ queryKey: ["partner-tiers"], queryFn: () => api.owner.partnerTiers() as Promise<any[]> });

  const updateMutation = useMutation({
    mutationFn: ({ id, commissionPercent, minActiveSchools }: { id: string; commissionPercent: number; minActiveSchools: number }) =>
      api.owner.updatePartnerTier(id, { commissionPercent, minActiveSchools }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partner-tiers"] }),
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.purpleMid}>
        <Text style={styles.note}>يتم ترقية/تخفيض الشركاء تلقائياً بحسب عدد مدارسهم النشطة مقارنة بالحد الأدنى لكل مستوى.</Text>
      </Card>

      <FlatList
        data={tiers}
        keyExtractor={(t) => t.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const d = draft[item.id] ?? { commissionPercent: String(item.commissionPercent), minActiveSchools: String(item.minActiveSchools) };
          return (
            <Card accentColor={colors.purpleMid}>
              <Text style={styles.tierName}>{TIER_LABEL[item.name] ?? item.name} — {item.labelAr}</Text>
              <Text style={styles.label}>نسبة العمولة %</Text>
              <TextInput
                style={styles.input}
                value={d.commissionPercent}
                onChangeText={(v) => setDraft((prev) => ({ ...prev, [item.id]: { ...d, commissionPercent: v } }))}
                keyboardType="decimal-pad"
              />
              <Text style={styles.label}>الحد الأدنى لعدد المدارس النشطة</Text>
              <TextInput
                style={styles.input}
                value={d.minActiveSchools}
                onChangeText={(v) => setDraft((prev) => ({ ...prev, [item.id]: { ...d, minActiveSchools: v } }))}
                keyboardType="number-pad"
              />
              <Button
                title="حفظ"
                color={colors.purpleMid}
                onPress={() =>
                  updateMutation.mutate({
                    id: item.id,
                    commissionPercent: parseFloat(d.commissionPercent) || 0,
                    minActiveSchools: parseInt(d.minActiveSchools, 10) || 0,
                  })
                }
                loading={updateMutation.isPending}
              />
            </Card>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  note: { fontSize: 12, color: colors.gray700 },
  tierName: { fontWeight: "800", color: colors.navy, fontSize: 14, marginBottom: 10 },
  label: { fontSize: 11, color: colors.gray600, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 8, fontSize: 13, backgroundColor: colors.white, marginBottom: 8,
  },
});
