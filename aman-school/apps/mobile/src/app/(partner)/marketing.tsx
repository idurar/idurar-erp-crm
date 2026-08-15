import { Text, View, FlatList, Share, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Share2, FileText, Video, Image as ImageIcon } from "lucide-react-native";
import { Button, Card, ErrorState, LoadingState, ScreenContainer, SectionHeader, colors, roleGradients } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";

const MATERIALS = [
  { icon: FileText, title: "بروشور تعريفي بالمنصة (PDF)", desc: "شرح مختصر لميزات أمان سكول موجه لإدارات المدارس" },
  { icon: Video, title: "فيديو تعريفي (٩٠ ثانية)", desc: "جولة سريعة في تتبع الرحلات والتنبيهات اللحظية" },
  { icon: ImageIcon, title: "بطاقات تواصل اجتماعي", desc: "تصاميم جاهزة للمشاركة على واتساب وفيسبوك" },
];

/** Partner-04: referral/marketing kit — referral code + shareable pitch text
 * + a static list of marketing materials the partner can request/download. */
export default function PartnerMarketingScreen() {
  const user = useSessionStore((s) => s.user)!;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["partner-dashboard", user.partnerId],
    queryFn: () => api.partner.dashboard(user.partnerId!) as Promise<{ partner: { name: string; region: string } }>,
    enabled: !!user.partnerId,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const referralCode = `AMAN-${(user.partnerId ?? "").slice(0, 8).toUpperCase()}`;
  const pitchText = `منصة أمان سكول لتتبع باصات المدارس لحظياً وحماية الطلاب — سجّل مدرستك عبر شريكنا ${data?.partner.name ?? ""} برمز الإحالة ${referralCode}`;

  return (
    <ScreenContainer>
      <Card accentColor={roleGradients.partner[0]}>
        <View style={styles.codeRow}>
          <Megaphone size={20} color={colors.navy} />
          <Text style={styles.codeLabel}>رمز الإحالة الخاص بك</Text>
        </View>
        <Text style={styles.code}>{referralCode}</Text>
        <Button
          title="مشاركة رسالة تعريفية"
          onPress={() => Share.share({ message: pitchText })}
          color={roleGradients.partner[0]}
        />
      </Card>

      <SectionHeader title="المواد التسويقية المتاحة" />
      <FlatList
        data={MATERIALS}
        keyExtractor={(m) => m.title}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card accentColor={roleGradients.partner[0]} style={styles.materialCard}>
            <View style={styles.materialRow}>
              <item.icon size={20} color={colors.navy} />
              <View style={{ flex: 1 }}>
                <Text style={styles.materialTitle}>{item.title}</Text>
                <Text style={styles.materialDesc}>{item.desc}</Text>
              </View>
              <Share2 size={16} color={colors.gray400} />
            </View>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  codeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  codeLabel: { color: colors.gray600, fontSize: 13, fontWeight: "700" },
  code: { fontSize: 22, fontWeight: "800", color: colors.navy, letterSpacing: 2, marginBottom: 14, textAlign: "center" },
  materialCard: { marginBottom: 10 },
  materialRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  materialTitle: { fontWeight: "700", color: colors.navy, fontSize: 13 },
  materialDesc: { color: colors.gray600, fontSize: 11, marginTop: 2 },
});
