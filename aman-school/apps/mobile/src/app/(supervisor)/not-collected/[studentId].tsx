import { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Linking, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, ScreenContainer, colors } from "@aman-school/shared-ui";
import { api } from "../../../lib/api";
import { useActiveTripStore } from "../../../store/activeTrip";

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ---- SF-6: not-collected protocol — auto-escalates at 3 and 5 minutes ---- */
export default function NotCollectedScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const [elapsed, setElapsed] = useState(0);
  const escalatedRef = useRef(false);

  const { data: student } = useQuery({ queryKey: ["student", studentId], queryFn: () => api.school.student(studentId) as Promise<any> });

  const escalateMutation = useMutation({
    mutationFn: () => api.supervisor.reportNotCollected(tripId, studentId),
  });

  const callContactMutation = useMutation({
    mutationFn: () => api.supervisor.medicalEmergencyAccess(studentId, tripId) as Promise<any>,
    onSuccess: (profile) => {
      const phone = profile?.emergencyContactPhone;
      if (phone) Linking.openURL(`tel:${phone}`);
      else Alert.alert("لا يوجد رقم", "لم يُسجَّل رقم طوارئ إضافي لهذا الطالب");
    },
  });
  const collectedMutation = useMutation({
    mutationFn: () => api.supervisor.markCollected(tripId, studentId, "تم الاستلام يدوياً من التطبيق"),
    onSuccess: () => router.replace("/(supervisor)/scan"),
  });

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (elapsed >= 300 && !escalatedRef.current) {
      escalatedRef.current = true;
      escalateMutation.mutate();
    }
  }, [elapsed]);

  const step = elapsed < 180 ? 1 : elapsed < 300 ? 2 : 3;

  return (
    <ScreenContainer backgroundColor={elapsed >= 300 ? colors.redLight : colors.amberLight}>
      <Text style={styles.title}>🚨 لم يُستلم الطالب — {student?.name}</Text>
      <Text style={styles.meta}>الطالب لا يزال في الباص</Text>
      <Text style={styles.timer}>الوقت المنقضي منذ التوقف: {formatElapsed(elapsed)} ⏱️</Text>

      <View style={[styles.stepCard, step >= 1 && styles.stepActive]}>
        <Text style={styles.stepTitle}>الخطوة 1 (0-3 دقائق)</Text>
        <Text style={styles.stepBody}>✅ انتظر عند المحطة</Text>
      </View>

      <View style={[styles.stepCard, step >= 2 && styles.stepActive]}>
        <Text style={styles.stepTitle}>الخطوة 2 (بعد 3 دقائق)</Text>
        <Text style={styles.stepBody}>🔄 حاول التفويض الاحتياطي أو جهة الطوارئ الإضافية</Text>
      </View>

      <View style={[styles.stepCard, step >= 3 && styles.stepActive]}>
        <Text style={styles.stepTitle}>الخطوة 3 (بعد 5 دقائق)</Text>
        <Text style={styles.stepBody}>{step >= 3 ? "🚨 تم التصعيد تلقائياً لغرفة العمليات" : "🚨 تصعيد تلقائي لغرفة العمليات"}</Text>
      </View>

      <Text style={styles.blockNote}>لا يمكن متابعة المسار وترك الطالب حتى تأكيد استلامه أو تعليمات العمليات</Text>

      <Button title="📞 اتصال بجهة الطوارئ الإضافية" variant="outline" onPress={() => callContactMutation.mutate()} loading={callContactMutation.isPending} />
      <Button title="✅ تم الاستلام الآن" onPress={() => collectedMutation.mutate()} loading={collectedMutation.isPending} color={colors.greenMid} />
      <Button title="🆘 SOS فوري" color={colors.red} onPress={() => router.push("/(supervisor)/sos")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "800", color: colors.red, textAlign: "center", marginBottom: 8 },
  meta: { fontSize: 13, color: colors.gray700, textAlign: "center" },
  timer: { fontSize: 15, fontWeight: "700", color: colors.navy, textAlign: "center", marginVertical: 12 },
  stepCard: { backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 10, padding: 12, marginBottom: 8, opacity: 0.5 },
  stepActive: { opacity: 1, backgroundColor: colors.white },
  stepTitle: { fontSize: 11, fontWeight: "700", color: colors.gray700 },
  stepBody: { fontSize: 13, color: colors.navy, marginTop: 4 },
  blockNote: { fontSize: 11, color: colors.gray700, textAlign: "center", marginVertical: 16 },
});
