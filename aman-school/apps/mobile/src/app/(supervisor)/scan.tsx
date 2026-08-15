import { useMemo, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, StatusPill, colors } from "@aman-school/shared-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../lib/api";
import { useActiveTripStore } from "../../store/activeTrip";
import { useLiveLocationReporter } from "../../features/supervisor/useLiveLocationReporter";

/**
 * S-05 (NFC scanning) + S-06 (post-scan confirmation card), reimplemented as a
 * tap-to-board roster: Expo Go cannot access NFC hardware (no custom native
 * modules in the Expo Go client). A standalone EAS "development build" using
 * react-native-nfc-manager is the documented path to real bracelet scanning —
 * see apps/mobile/README.md. Tapping a student here is the functional
 * equivalent of a successful bracelet scan for demo/testing purposes.
 */
export default function ScanScreen() {
  const router = useRouter();
  const tripId = useActiveTripStore((s) => s.tripId)!;
  const queryClient = useQueryClient();
  const [lastConfirmed, setLastConfirmed] = useState<{ name: string; action: "board" | "alight" } | null>(null);

  const { data: roster } = useQuery({ queryKey: ["trip-students", tripId], queryFn: () => api.supervisor.tripStudents(tripId) });
  const { data: live } = useQuery({
    queryKey: ["trip-live-status", tripId],
    queryFn: () => api.supervisor.liveStatus(tripId),
    refetchInterval: 4000,
  });

  useLiveLocationReporter(tripId, live?.busId, live?.status === "active");

  const boardedIds = useMemo(() => new Set((live?.events ?? []).filter((e) => e.type === "board").map((e) => e.studentId)), [live]);
  const alightedIds = useMemo(() => new Set((live?.events ?? []).filter((e) => e.type === "alight").map((e) => e.studentId)), [live]);

  const boardMutation = useMutation({
    mutationFn: (studentId: string) => api.supervisor.board(tripId, studentId),
    onSuccess: (_res, studentId) => {
      const student = roster?.find((s) => s.id === studentId);
      if (student) setLastConfirmed({ name: student.name, action: "board" });
      queryClient.invalidateQueries({ queryKey: ["trip-live-status", tripId] });
      setTimeout(() => setLastConfirmed(null), 3000);
    },
  });
  const alightMutation = useMutation({
    mutationFn: (studentId: string) => api.supervisor.alight(tripId, studentId),
    onSuccess: (_res, studentId) => {
      const student = roster?.find((s) => s.id === studentId);
      if (student) setLastConfirmed({ name: student.name, action: "alight" });
      queryClient.invalidateQueries({ queryKey: ["trip-live-status", tripId] });
      setTimeout(() => setLastConfirmed(null), 3000);
    },
  });

  /* ---- SF-5: if this student has an active pickup delegate, verify identity
   * first instead of alighting immediately ---- */
  async function handleAlight(studentId: string) {
    const info = (await api.supervisor.pickupInfo(tripId, studentId)) as { activeDelegate: unknown };
    if (info.activeDelegate) {
      router.push(`/(supervisor)/verify-pickup/${studentId}`);
    } else {
      alightMutation.mutate(studentId);
    }
  }

  const boardedCount = boardedIds.size;
  const total = roster?.length ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.counterBar}>
        <Text style={styles.counterText}>{boardedCount} / {total} صعدوا</Text>
        {live?.status === "active" ? <Text style={styles.gpsBadge}>📍 GPS حي نشط</Text> : null}
      </View>

      {lastConfirmed ? (
        <View style={[styles.confirmBanner, { backgroundColor: lastConfirmed.action === "board" ? colors.greenLight : colors.blueLight }]}>
          <Text style={{ color: lastConfirmed.action === "board" ? colors.greenMid : colors.blueMid, fontWeight: "700" }}>
            {lastConfirmed.action === "board" ? "✅ صعد" : "🚪 نزل"}: {lastConfirmed.name}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={roster}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const boarded = boardedIds.has(item.id);
          const alighted = alightedIds.has(item.id);
          return (
            <Card accentColor={alighted ? colors.gray400 : boarded ? colors.greenMid : colors.blueMid}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.grade}>{item.grade}</Text>
                </View>
                {alighted ? (
                  <StatusPill label="نزل" tone="neutral" />
                ) : boarded ? (
                  <TouchableOpacity onPress={() => handleAlight(item.id)}>
                    <StatusPill label="اضغط لتسجيل النزول" tone="success" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => boardMutation.mutate(item.id)}>
                    <StatusPill label="اضغط لمحاكاة المسح (صعود)" tone="info" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.medicalLink} onPress={() => router.push(`/(supervisor)/medical-alert/${item.id}`)}>🩺 طوارئ طبية</Text>
            </Card>
          );
        }}
      />

      <View style={styles.footer}>
        <Button title="إدخال يدوي" variant="outline" onPress={() => router.push("/(supervisor)/manual-entry")} />
        <Button title="حالة الرحلة" variant="outline" onPress={() => router.push("/(supervisor)/live-status")} />
        <Button title="إنهاء الرحلة" onPress={() => router.push("/(supervisor)/end-trip")} color={colors.navy} />
      </View>
      <TouchableOpacity style={styles.sosButton} onPress={() => router.push("/(supervisor)/sos")}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray100 },
  counterBar: { backgroundColor: colors.navy, padding: 12, alignItems: "center" },
  counterText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  gpsBadge: { color: colors.greenMid, fontWeight: "700", fontSize: 11, marginTop: 4 },
  confirmBanner: { padding: 10, alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  grade: { color: colors.gray600, fontSize: 12 },
  medicalLink: { color: colors.red, fontSize: 11, fontWeight: "700", marginTop: 8 },
  footer: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: colors.white },
  sosButton: {
    position: "absolute", bottom: 90, left: 16, backgroundColor: colors.red,
    width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4,
  },
  sosText: { color: colors.white, fontWeight: "800", fontSize: 12 },
});
