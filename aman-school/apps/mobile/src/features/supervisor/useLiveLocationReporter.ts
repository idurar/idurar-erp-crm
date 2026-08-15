import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import type { Socket } from "socket.io-client";
import { connectSocket } from "../../lib/api";

const REPORT_INTERVAL_MS = 6000;
const REPORT_DISTANCE_M = 15;

/** Real (not simulated) GPS reporting for an active trip — starts a foreground
 * location watch on the supervisor's own device and streams it to the
 * backend over the same socket used for live-tracking subscriptions. The
 * backend's GPS simulator automatically backs off for any bus receiving
 * these real pings (see backend/src/sockets/gateway.ts). */
export function useLiveLocationReporter(tripId: string | undefined, busId: string | undefined, active: boolean) {
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const socketRef = useRef<ReturnType<typeof connectSocket>>(null);

  useEffect(() => {
    if (!active || !tripId || !busId) return;
    let cancelled = false;

    (async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted" || cancelled) return;

      const socket = connectSocket();
      if (!socket || cancelled) return;
      socketRef.current = socket;

      subscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: REPORT_INTERVAL_MS, distanceInterval: REPORT_DISTANCE_M },
        (pos) => {
          const payload = {
            tripId,
            busId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speedKmh: pos.coords.speed != null && pos.coords.speed >= 0 ? pos.coords.speed * 3.6 : null,
          };
          (socket as Socket).emit("report:location", payload);
        }
      );
    })();

    return () => {
      cancelled = true;
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [active, tripId, busId]);
}
