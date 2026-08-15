import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { colors } from "@aman-school/shared-ui";
import { api } from "../../lib/api";

const ADEN = { latitude: 12.7797, longitude: 45.0369 };

/** operations-map: fleet-wide live map — every currently-active bus's last
 * known GPS position at once, polling like the rest of the control room
 * (no per-bus socket subscription needed since this view already wants all
 * of them simultaneously). */
export default function OperationsMapScreen() {
  const router = useRouter();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { data: trips } = useQuery({
    queryKey: ["active-trips"],
    queryFn: () => api.operations.activeTrips() as Promise<any[]>,
    refetchInterval: 5000,
  });

  const withGps = (trips ?? []).filter((t) => t.bus?.currentLat != null && t.bus?.currentLng != null);
  const selected = withGps.find((t) => t.id === selectedTripId);

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={{ ...ADEN, latitudeDelta: 0.15, longitudeDelta: 0.15 }}>
        {withGps.map((t) => (
          <Marker
            key={t.id}
            coordinate={{ latitude: t.bus.currentLat, longitude: t.bus.currentLng }}
            title={`باص ${t.bus.busNumber}`}
            description={t.bus.currentSpeedKmh != null ? `${Math.round(t.bus.currentSpeedKmh)} كم/س` : undefined}
            pinColor={colors.greenMid}
            onPress={() => setSelectedTripId(t.id)}
          />
        ))}
      </MapView>

      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{withGps.length} باص نشط الآن</Text>
      </View>

      {selected ? (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/(operations)/incidents` as never)} activeOpacity={0.85}>
          <Text style={styles.busTitle}>باص {selected.bus.busNumber} — {selected.bus.plateNumber}</Text>
          <Text style={styles.busMeta}>
            {selected.bus.currentSpeedKmh != null ? `السرعة: ${Math.round(selected.bus.currentSpeedKmh)} كم/س` : "لا توجد بيانات سرعة"}
          </Text>
          <Text style={styles.busMeta}>
            آخر تحديث: {selected.bus.lastGpsAt ? new Date(selected.bus.lastGpsAt).toLocaleTimeString("ar-YE") : "-"}
          </Text>
        </TouchableOpacity>
      ) : !withGps.length ? (
        <View style={styles.card}>
          <Text style={styles.busMeta}>لا توجد رحلات نشطة ببيانات GPS حالياً</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: "absolute", top: 12, alignSelf: "center", backgroundColor: colors.navy,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6,
  },
  topBarText: { color: colors.white, fontWeight: "700", fontSize: 12 },
  card: {
    position: "absolute", bottom: 16, left: 16, right: 16, backgroundColor: colors.white,
    borderRadius: 16, padding: 16, elevation: 5, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 8,
  },
  busTitle: { fontSize: 15, fontWeight: "800", color: colors.navy },
  busMeta: { fontSize: 12, color: colors.gray600, marginTop: 4 },
});
