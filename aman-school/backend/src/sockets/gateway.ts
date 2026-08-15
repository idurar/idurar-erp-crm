import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import type { ClientToServerEvents, GpsPing, ServerToClientEvents, Trip, TripEvent, Alert } from "@aman-school/types";
import type { Trip as PrismaTrip, TripEvent as PrismaTripEvent, Alert as PrismaAlert } from "@prisma/client";
import { env } from "../env";
import { verifyAccessToken } from "../auth/jwt";
import { prisma } from "../prisma";

/** busId -> last time a *real* device GPS ping was accepted for it. The
 * simulator (sockets/simulator.ts) checks this and backs off for any bus
 * that's actively reporting real positions, so the two sources never fight. */
export const realGpsLastSeenAt = new Map<string, number>();
export const REAL_GPS_FRESHNESS_MS = 20000;

/** Prisma returns Date objects for datetime columns; the shared wire types (from
 * @aman-school/types, used by both backend and mobile app) declare ISO date
 * strings. JSON(.stringify)/Socket.IO serialize Date -> ISO string identically at
 * runtime either way, so this is purely a compile-time shape reconciliation. */
function serializeDates<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = { ...obj };
  for (const key of Object.keys(out)) {
    const value = out[key];
    if (value instanceof Date) out[key] = value.toISOString();
  }
  return out as T;
}

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

let io: AppServer | null = null;

export function initSocketGateway(httpServer: HttpServer): AppServer {
  io = new Server(httpServer, {
    cors: { origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(","), credentials: true },
  });

  // Auth handshake: client passes { auth: { token } } per packages/api-client/src/socket.ts
  io.use((socket, next) => {
    const token = (socket.handshake.auth as { token?: string } | undefined)?.token;
    if (!token) return next(new Error("unauthorized: missing token"));
    try {
      const claims = verifyAccessToken(token);
      socket.data.user = claims;
      next();
    } catch {
      next(new Error("unauthorized: invalid token"));
    }
  });

  io.on("connection", (socket: AppSocket) => {
    socket.on("subscribe:bus", (busId: string) => socket.join(`bus:${busId}`));
    socket.on("unsubscribe:bus", (busId: string) => socket.leave(`bus:${busId}`));
    socket.on("subscribe:school", (schoolId: string) => socket.join(`school:${schoolId}`));
    socket.on("subscribe:operations", (_scopeId: string) => socket.join("operations"));

    socket.on("report:location", async (payload) => {
      const user = socket.data.user as ReturnType<typeof verifyAccessToken> | undefined;
      if (!user || user.role !== "supervisor") return;
      try {
        const trip = await prisma.trip.findUnique({ where: { id: payload.tripId } });
        if (!trip || trip.busId !== payload.busId || trip.supervisorId !== user.sub || trip.status !== "active") return;

        const speedKmh = payload.speedKmh ?? 0;
        await prisma.bus.update({
          where: { id: payload.busId },
          data: { currentLat: payload.lat, currentLng: payload.lng, currentSpeedKmh: speedKmh, lastGpsAt: new Date() },
        });
        realGpsLastSeenAt.set(payload.busId, Date.now());

        emitBusLocation({ busId: payload.busId, lat: payload.lat, lng: payload.lng, speedKmh, timestamp: new Date().toISOString() }, trip.schoolId);
      } catch (err) {
        console.error("[report:location] failed:", err);
      }
    });
  });

  return io;
}

function getIo(): AppServer {
  if (!io) throw new Error("Socket.IO gateway not initialized — call initSocketGateway first");
  return io;
}

export function emitBusLocation(ping: GpsPing, schoolId: string) {
  const server = getIo();
  server.to(`bus:${ping.busId}`).emit("bus:location", ping);
  server.to(`school:${schoolId}`).emit("bus:location", ping);
  server.to("operations").emit("bus:location", ping);
}

export function emitTripUpdated(tripRow: PrismaTrip) {
  const trip = serializeDates(tripRow) as unknown as Trip;
  const server = getIo();
  server.to(`bus:${trip.busId}`).emit("trip:updated", trip);
  server.to(`school:${trip.schoolId}`).emit("trip:updated", trip);
  server.to("operations").emit("trip:updated", trip);
}

export function emitTripEvent(eventRow: PrismaTripEvent, busId: string, schoolId: string) {
  const event = serializeDates(eventRow) as unknown as TripEvent;
  const server = getIo();
  server.to(`bus:${busId}`).emit("trip:event", event);
  server.to(`school:${schoolId}`).emit("trip:event", event);
  server.to("operations").emit("trip:event", event);
}

export function emitAlertNew(alertRow: PrismaAlert) {
  const alert = serializeDates(alertRow) as unknown as Alert;
  const server = getIo();
  server.to(`school:${alert.schoolId}`).emit("alert:new", alert);
  server.to("operations").emit("alert:new", alert);
}

export function emitAlertUpdated(alertRow: PrismaAlert) {
  const alert = serializeDates(alertRow) as unknown as Alert;
  const server = getIo();
  server.to(`school:${alert.schoolId}`).emit("alert:updated", alert);
  server.to("operations").emit("alert:updated", alert);
}
