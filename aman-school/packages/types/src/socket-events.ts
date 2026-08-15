import { Alert, GpsPing, Trip, TripEvent } from "./entities";

/** Server → client events, shared by mobile app modules and backend Socket.IO gateway. */
export interface ServerToClientEvents {
  "bus:location": (payload: GpsPing) => void;
  "trip:updated": (payload: Trip) => void;
  "trip:event": (payload: TripEvent) => void;
  "alert:new": (payload: Alert) => void;
  "alert:updated": (payload: Alert) => void;
}

/** Client → server events. */
export interface ClientToServerEvents {
  "subscribe:bus": (busId: string) => void;
  "unsubscribe:bus": (busId: string) => void;
  "subscribe:school": (schoolId: string) => void;
  "subscribe:operations": (scopeId: string) => void;
  // Real device GPS during an active trip (supervisor's phone) — the socket's
  // own authenticated user must be that trip's supervisor; see gateway.ts.
  "report:location": (payload: { tripId: string; busId: string; lat: number; lng: number; speedKmh: number | null }) => void;
}
