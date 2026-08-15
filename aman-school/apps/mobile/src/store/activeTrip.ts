import { create } from "zustand";

/** Carries the in-progress trip id across the supervisor's screen flow
 * (select trip -> roster -> scan -> live status -> end trip). */
export const useActiveTripStore = create<{ tripId: string | null; setTripId: (id: string | null) => void }>((set) => ({
  tripId: null,
  setTripId: (id) => set({ tripId: id }),
}));
