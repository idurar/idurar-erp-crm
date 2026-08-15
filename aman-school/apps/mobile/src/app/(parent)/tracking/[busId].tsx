import { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { colors } from "@aman-school/shared-ui";
import type { GpsPing } from "@aman-school/types";
import { api, connectSocket } from "../../../lib/api";

const ADEN = { latitude: 12.7797, longitude: 45.0369 };

export default function TrackingMapScreen() {
  const { busId } = useLocalSearchParams<{ busId: string }>();
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const socketRef = useRef<ReturnType<typeof connectSocket>>(null);

  const { data: eta } = useQuery({
    queryKey: ["bus-eta", busId],
    queryFn: () => api.parent.busEta(busId),
    refetchInterval: 10000,
  });

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;
    if (!socket) return;
    socket.emit("subscribe:bus", busId);
    socket.on("bus:location", (ping: GpsPing) => {
      if (ping.busId === busId) setPosition({ latitude: ping.lat, longitude: ping.lng });
    });
    return () => {
      socket.emit("unsubscribe:bus", busId);
      socket.disconnect();
    };
  }, [busId]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{ ...(position ?? ADEN), latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        region={position ? { ...position, latitudeDelta: 0.05, longitudeDelta: 0.05 } : undefined}
      >
        {position ? (
          <Marker coordinate={position} title="الباص" pinColor={colors.blueMid} />
        ) : null}
      </MapView>

      <View style={styles.card}>
        {!position ? (
          <Text style={styles.status}>الرحلة لم تبدأ بعد أو لا توجد إشارة GPS</Text>
        ) : (
          <>
            <Text style={styles.eta}>{eta?.etaMinutes != null ? `الوصول خلال ${eta.etaMinutes} دقيقة` : "جاري الحساب..."}</Text>
            <Text style={styles.detail}>
              {eta?.distanceKm != null ? `المسافة المتبقية: ${eta.distanceKm} كم` : ""}
              {eta?.stopsBefore != null ? ` · ${eta.stopsBefore} محطة قبلك` : ""}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute", bottom: 16, left: 16, right: 16, backgroundColor: colors.white,
    borderRadius: 12, padding: 16, elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6,
  },
  status: { textAlign: "center", color: colors.gray600, fontSize: 13 },
  eta: { fontSize: 16, fontWeight: "800", color: colors.navy, textAlign: "center" },
  detail: { fontSize: 12, color: colors.gray600, textAlign: "center", marginTop: 4 },
});
