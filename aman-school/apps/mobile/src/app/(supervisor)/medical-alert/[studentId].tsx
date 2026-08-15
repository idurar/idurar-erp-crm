import { useState } from "react";
import { Text, View, StyleSheet, Linking, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, ScreenContainer, colors } from "@aman-school/shared-ui";
import { YEMEN_EMERGENCY_NUMBERS } from "@aman-school/types";
import { api } from "../../../lib/api";
import { useActiveTripStore } from "../../../store/activeTrip";

/* ---- SF-7: emergency-only medical access, fully audited on open ---- */
export default function MedicalAlertScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const tripId = useActiveTripStore((s) => s.tripId);
  const [confirmed, setConfirmed] = useState(false);

  const { mutate, data: profile, isPending, isSuccess } = useMutation({
    mutationFn: () => api.supervisor.medicalEmergencyAccess(studentId, tripId ?? undefined) as Promise<any>,
  });

  if (!confirmed) {
    return (
      <ScreenContainer>
        <Card accentColor={colors.red}>
          <Text style={styles.confirmTitle}>هل هذه حالة طوارئ فعلية؟</Text>
          <Text style={styles.confirmBody}>سيتم تسجيل هذا الوصول باسمك ووقته في سجل شفافية يراه مدير المدرسة.</Text>
        </Card>
        <Button
          title="نعم، عرض البيانات الطبية"
          color={colors.red}
          onPress={() => {
            setConfirmed(true);
            mutate();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Card accentColor={colors.red}>
        <Text style={styles.warning}>⚠️ هذا الوصول مُسجَّل باسمك ووقته</Text>
      </Card>

      {isPending ? (
        <Text style={styles.loading}>جاري التحميل...</Text>
      ) : isSuccess && profile ? (
        <Card>
          <Text style={styles.row}>🩸 فصيلة الدم: {profile.bloodType || "غير مسجّلة"}</Text>
          <Text style={styles.row}>⚠️ الحساسية: {profile.allergies?.length ? profile.allergies.join("، ") : "لا يوجد"}</Text>
          <Text style={styles.row}>💊 أدوية دائمة: {profile.medications?.length ? profile.medications.join("، ") : "لا يوجد"}</Text>
          <Text style={styles.row}>🏥 حالة مزمنة: {profile.chronicConditions || "لا يوجد"}</Text>
          <Text style={styles.row}>📞 طوارئ إضافي: {profile.emergencyContactName} — {profile.emergencyContactPhone}</Text>
        </Card>
      ) : (
        <Card>
          <Text style={styles.row}>لا يوجد ملف طبي مسجّل لهذا الطالب.</Text>
        </Card>
      )}

      <View style={{ gap: 8 }}>
        {profile?.emergencyContactPhone ? (
          <Button title="📞 اتصال بجهة الطوارئ الإضافية" variant="outline" onPress={() => Linking.openURL(`tel:${profile.emergencyContactPhone}`)} />
        ) : null}
        <Button
          title={`🚑 طلب إسعاف ${YEMEN_EMERGENCY_NUMBERS.ambulance}`}
          color={colors.red}
          onPress={() =>
            Alert.alert("اتصال بالإسعاف", `سيتم الاتصال بـ ${YEMEN_EMERGENCY_NUMBERS.ambulance}`, [
              { text: "إلغاء", style: "cancel" },
              { text: "اتصال", onPress: () => Linking.openURL(`tel:${YEMEN_EMERGENCY_NUMBERS.ambulance}`) },
            ])
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  confirmTitle: { fontSize: 15, fontWeight: "800", color: colors.red, marginBottom: 6 },
  confirmBody: { fontSize: 12, color: colors.gray700 },
  warning: { fontSize: 12, color: colors.red, fontWeight: "700", textAlign: "center" },
  loading: { textAlign: "center", color: colors.gray600, marginTop: 20 },
  row: { fontSize: 13, color: colors.navy, marginBottom: 8 },
});
