import { Text, View, StyleSheet, Image, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";
import { useActiveTripStore } from "../../../store/activeTrip";

/* ---- SF-5: confirm the identity of whoever is picking up this student ---- */
export default function VerifyPickupScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const queryClient = useQueryClient();

  const { data: info } = useQuery({
    queryKey: ["pickup-info", tripId, studentId],
    queryFn: () => api.supervisor.pickupInfo(tripId, studentId) as Promise<{ activeDelegate: any }>,
  });
  const delegate = info?.activeDelegate;

  const confirmMutation = useMutation({
    mutationFn: () => api.supervisor.verifiedAlight(tripId, studentId, "delegate", delegate?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-live-status", tripId] });
      router.back();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.supervisor.reportNotCollected(tripId, studentId),
    onSuccess: () => router.push(`/(supervisor)/not-collected/${studentId}`),
  });

  return (
    <ScreenContainer>
      <Card accentColor={colors.amber}>
        <Text style={styles.warning}>⚠️ يوجد تفويض استلام نشط اليوم لهذا الطالب</Text>
      </Card>

      {delegate ? (
        <Card accentColor={colors.blueMid}>
          {delegate.photoUrl ? (
            <Image source={{ uri: delegate.photoUrl }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}><Text style={{ fontSize: 32 }}>👤</Text></View>
          )}
          <Text style={styles.name}>{delegate.name} ({delegate.relation})</Text>
          <Text style={styles.meta}>رقم الهوية: {delegate.nationalId}</Text>
          <Text style={styles.meta}>{delegate.phone}</Text>
        </Card>
      ) : null}

      <Text style={styles.question}>هل الشخص الحاضر الآن هو نفسه في الصورة؟</Text>

      <Button title="✅ نعم، طابقت الهوية — تسليم" onPress={() => confirmMutation.mutate()} loading={confirmMutation.isPending} color={colors.greenMid} />
      <Button title="❌ لا يطابق — لا تُسلِّم الطالب" onPress={() => rejectMutation.mutate()} loading={rejectMutation.isPending} color={colors.red} />

      {delegate?.phone ? (
        <Button title="📞 اتصال بولي الأمر للتأكد" variant="outline" onPress={() => Linking.openURL(`tel:${delegate.phone}`)} />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  warning: { fontSize: 13, color: colors.amber, fontWeight: "700", textAlign: "center" },
  photo: { width: 80, height: 80, borderRadius: 40, alignSelf: "center", marginBottom: 8 },
  photoPlaceholder: {
    width: 80, height: 80, borderRadius: 40, alignSelf: "center", marginBottom: 8,
    backgroundColor: colors.gray100, alignItems: "center", justifyContent: "center",
  },
  name: { fontSize: 15, fontWeight: "800", color: colors.navy, textAlign: "center" },
  meta: { fontSize: 12, color: colors.gray600, textAlign: "center", marginTop: 2 },
  question: { fontSize: 14, fontWeight: "700", color: colors.navy, textAlign: "center", marginVertical: 16 },
});
