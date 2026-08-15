import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Truck } from "lucide-react-native";
import { Button, Card, EmptyState, ErrorState, GradientHeader, LoadingState, ScreenContainer, SectionHeader, StatusPill, colors, roleGradients, useToast } from "@aman-school/shared-ui";
import { api } from "../../lib/api";
import { useSessionStore } from "../../store/session";
import { useLogout } from "../../features/shared/RoleGuardLayout";

/* ---- D-02 / d-home: driver's assigned bus, breakdown reporting, SOS ---- */
export default function DriverHomeScreen() {
  const router = useRouter();
  const logout = useLogout();
  const showToast = useToast();
  const user = useSessionStore((s) => s.user)!;
  const queryClient = useQueryClient();
  const [breakdownNotes, setBreakdownNotes] = useState("");
  const [sending, setSending] = useState(false);

  const {
    data: bus,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery({ queryKey: ["driver-my-bus"], queryFn: () => api.driver.myBus() as Promise<any | null> });

  const breakdownMutation = useMutation({
    mutationFn: () => api.driver.reportBreakdown(bus!.id, breakdownNotes),
    onSuccess: () => {
      showToast("تم إرسال بلاغ العطل لإدارة المدرسة", "success");
      setBreakdownNotes("");
      queryClient.invalidateQueries({ queryKey: ["driver-my-bus"] });
    },
    onError: () => showToast("تعذر الإرسال — تحقق من الاتصال بالإنترنت", "error"),
  });

  async function sendSos() {
    setSending(true);
    try {
      let lat = 12.7797;
      let lng = 45.0369;
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status === "granted") {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
      await api.driver.sos({ tripId: null, lat, lng, description: "طوارئ من السائق" });
      showToast("تم إرسال تنبيه الطوارئ لغرفة العمليات مع موقعك", "success");
    } catch {
      showToast("تعذر الإرسال — اتصل مباشرة بغرفة العمليات", "error");
    } finally {
      setSending(false);
    }
  }

  function confirmSos() {
    Alert.alert("هل أنت في حالة طوارئ؟", "سيتم إرسال موقعك فوراً لغرفة العمليات", [
      { text: "إلغاء", style: "cancel" },
      { text: "نعم، أرسل الآن", style: "destructive", onPress: sendSos },
    ]);
  }

  return (
    <ScreenContainer refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.headerBleed}>
        <GradientHeader
          gradient={roleGradients.driver}
          title="كابينة القيادة"
          subtitle={user.name}
          icon={<Truck size={20} color={colors.white} />}
          right={
            <TouchableOpacity style={styles.logoutBtn} onPress={async () => { await logout(); router.replace("/(auth)/role-select"); }}>
              <LogOut size={20} color={colors.white} />
            </TouchableOpacity>
          }
        />
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !bus ? (
        <EmptyState icon="🚌" title="لا يوجد باص مخصص لك حالياً" subtitle="تواصل مع إدارة المدرسة" />
      ) : (
        <Card accentColor={bus.outOfService ? colors.red : colors.tealMid}>
          <View style={styles.row}>
            <Text style={styles.busName}>باص {bus.busNumber}</Text>
            <StatusPill label={bus.outOfService ? "خارج الخدمة" : "بالخدمة"} tone={bus.outOfService ? "danger" : "success"} />
          </View>
          <Text style={styles.meta}>{bus.plateNumber} · السعة {bus.capacity}</Text>
          {bus.inspectionExpiresAt ? (
            <Text style={styles.meta}>الفحص الفني ينتهي: {new Date(bus.inspectionExpiresAt).toLocaleDateString("ar-YE")}</Text>
          ) : null}
          {bus.insuranceExpiresAt ? (
            <Text style={styles.meta}>التأمين ينتهي: {new Date(bus.insuranceExpiresAt).toLocaleDateString("ar-YE")}</Text>
          ) : null}
        </Card>
      )}

      {bus ? (
        <Card>
          <SectionHeader title="الإبلاغ عن عطل طارئ" accentColor={colors.amber} />
          <TextInput
            style={styles.input}
            value={breakdownNotes}
            onChangeText={setBreakdownNotes}
            placeholder="صف العطل (مثال: عطل في الفرامل)"
            multiline
          />
          <Button
            title="🔧 إرسال بلاغ عطل"
            onPress={() => breakdownMutation.mutate()}
            loading={breakdownMutation.isPending}
            disabled={!breakdownNotes}
            color={colors.amber}
          />
          <View style={{ height: 8 }} />
          <Button title="📋 سجل الصيانة" variant="outline" onPress={() => router.push(`/(driver)/profile`)} />
        </Card>
      ) : null}

      <Card accentColor={colors.red}>
        <SectionHeader title="طوارئ" accentColor={colors.red} />
        <Button title="🆘 إرسال تنبيه طوارئ SOS" color={colors.red} onPress={confirmSos} loading={sending} />
      </Card>

      <Button title="🔔 الإشعارات" variant="outline" onPress={() => router.push("/(driver)/notifications")} />
      <Button title="👤 حسابي" variant="outline" onPress={() => router.push("/(driver)/profile")} />
      <Button title="⚙️ الإعدادات" variant="outline" onPress={() => router.push("/(driver)/settings")} />
      <Button title="💬 الدعم الفني" variant="outline" onPress={() => router.push("/(driver)/contact")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBleed: { marginHorizontal: -16, marginTop: -16, marginBottom: 20 },
  logoutBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  busName: { fontWeight: "800", color: colors.navy, fontSize: 15 },
  meta: { color: colors.gray600, fontSize: 12, marginTop: 6 },
  input: {
    borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, backgroundColor: colors.white, marginBottom: 10, minHeight: 60, textAlignVertical: "top",
  },
});
