import { prisma } from "../prisma";
import { emitBusLocation, realGpsLastSeenAt, REAL_GPS_FRESHNESS_MS } from "./gateway";

// Real hardware publishes a GPS ping every 30s over MQTT (see
// docs/architecture/00-overview.md "Live tracking" + S-04 UX notes). There is
// no physical GPS device in this dev environment, so this in-process
// simulator stands in for it: every 5s it nudges each bus with an `active`
// trip a step further along its route's stops and emits `bus:location`, the
// same event real hardware ingestion would trigger.
const TICK_MS = 5000;
const STEP_FRACTION = 0.2; // fraction of the remaining leg covered per tick

let timer: ReturnType<typeof setInterval> | null = null;

export function startGpsSimulator() {
  if (timer) return;
  timer = setInterval(() => {
    tick().catch((err) => console.error("[gps-simulator] tick failed:", err));
  }, TICK_MS);
  console.log(`[gps-simulator] started — ticking every ${TICK_MS}ms for active trips`);
}

export function stopGpsSimulator() {
  if (timer) clearInterval(timer);
  timer = null;
}

async function tick() {
  const activeTrips = await prisma.trip.findMany({
    where: { status: "active" },
    include: {
      bus: { include: { route: { include: { stops: true } } } },
    },
  });

  for (const trip of activeTrips) {
    const bus = trip.bus;

    // A supervisor's phone is actively reporting real GPS for this bus —
    // back off entirely so simulated and real positions never fight.
    const realSeenAt = realGpsLastSeenAt.get(bus.id);
    if (realSeenAt && Date.now() - realSeenAt < REAL_GPS_FRESHNESS_MS) continue;

    const stops = bus.route?.stops.slice().sort((a, b) => a.order - b.order) ?? [];
    if (stops.length < 2) continue;

    let idx = Math.min(trip.simStopIndex, stops.length - 2);
    const from = stops[idx];
    const to = stops[idx + 1];

    const currentLat = bus.currentLat ?? from.lat;
    const currentLng = bus.currentLng ?? from.lng;

    let nextLat = currentLat + (to.lat - currentLat) * STEP_FRACTION;
    let nextLng = currentLng + (to.lng - currentLng) * STEP_FRACTION;

    const distToTarget = Math.hypot(to.lat - nextLat, to.lng - nextLng);
    let advanced = false;
    if (distToTarget < 0.0005) {
      // close enough — snap to the stop and advance to the next leg
      nextLat = to.lat;
      nextLng = to.lng;
      if (idx < stops.length - 2) {
        idx += 1;
        advanced = true;
      }
    }

    const speedKmh = idx >= stops.length - 2 && !advanced ? 22 + Math.random() * 10 : 20 + Math.random() * 15;

    await prisma.bus.update({
      where: { id: bus.id },
      data: { currentLat: nextLat, currentLng: nextLng, currentSpeedKmh: speedKmh, lastGpsAt: new Date() },
    });
    if (advanced) {
      await prisma.trip.update({ where: { id: trip.id }, data: { simStopIndex: idx } });
    }

    emitBusLocation(
      { busId: bus.id, lat: nextLat, lng: nextLng, speedKmh, timestamp: new Date().toISOString() },
      trip.schoolId
    );
  }
}
