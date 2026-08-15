import { useSyncExternalStore } from "react";

export type Kund = {
  id: string;
  namn: string;
  telefon: string;
  epost: string;
  anteckningar: string;
  skapad: string;
};

export type Bokning = {
  id: string;
  syfte: string;
  datum: string; // ISO datetime
  adress: string;
  kundId?: string;
  anteckningar: string;
  skapad: string;
};

export type Uppgift = {
  id: string;
  titel: string;
  klar: boolean;
  prioritet: "låg" | "medel" | "hög";
  kundId?: string;
  skapad: string;
};

export type Mailmall = {
  id: string;
  namn: string;
  amne: string;
  brodtext: string;
};

export type Fil = {
  id: string;
  namn: string;
  typ: string;
  storlek: number;
  dataUrl: string;
  kundId?: string;
  uppladdad: string;
};

export type AvtalStatus = "utkast" | "skickat" | "signerat";
export type Avtal = {
  id: string;
  titel: string;
  kundId?: string;
  status: AvtalStatus;
  innehall: string;
  skapad: string;
};

export type Paket = {
  id: string;
  namn: string;
  beskrivning: string;
  pris: number;
  enhet: string;
};

type Data = {
  kunder: Kund[];
  bokningar: Bokning[];
  uppgifter: Uppgift[];
  mallar: Mailmall[];
  filer: Fil[];
  avtal: Avtal[];
  paket: Paket[];
};

const STORAGE_KEY = "lovcrm.v2";

const iso = (d: Date) => d.toISOString();
const now = () => new Date().toISOString();

function seed(): Data {
  const idag = new Date();
  const imorgon = new Date(idag);
  imorgon.setDate(imorgon.getDate() + 1);
  imorgon.setHours(10, 0, 0, 0);
  const nastaVecka = new Date(idag);
  nastaVecka.setDate(nastaVecka.getDate() + 5);
  nastaVecka.setHours(14, 30, 0, 0);

  return {
    kunder: [
      {
        id: "k1",
        namn: "Anna Lindberg",
        telefon: "070-123 45 67",
        epost: "anna@nordicdesign.se",
        anteckningar: "Intresserad av årsavtal. Följ upp i nästa vecka.",
        skapad: now(),
      },
      {
        id: "k2",
        namn: "Erik Sundberg",
        telefon: "073-987 65 43",
        epost: "erik@bygglaget.se",
        anteckningar: "Skickade offert 3 juli.",
        skapad: now(),
      },
    ],
    bokningar: [
      {
        id: "b1",
        syfte: "Uppstartsmöte",
        datum: iso(imorgon),
        adress: "Storgatan 12, Stockholm",
        kundId: "k1",
        anteckningar: "Ta med prisexempel.",
        skapad: now(),
      },
      {
        id: "b2",
        syfte: "Platsbesök",
        datum: iso(nastaVecka),
        adress: "Industrivägen 4, Solna",
        kundId: "k2",
        anteckningar: "",
        skapad: now(),
      },
    ],
    uppgifter: [
      { id: "u1", titel: "Ring Anna om offert", klar: false, prioritet: "hög", kundId: "k1", skapad: now() },
      { id: "u2", titel: "Förbered demo till fredag", klar: false, prioritet: "medel", skapad: now() },
      { id: "u3", titel: "Uppdatera prislistan", klar: true, prioritet: "låg", skapad: now() },
    ],
    mallar: [
      {
        id: "m1",
        namn: "Uppföljning efter möte",
        amne: "Trevligt att träffas!",
        brodtext:
          "Hej {{namn}},\n\nTack för ett bra möte idag. Här kommer en sammanfattning av det vi pratade om…\n\nHör av dig om du har frågor.\n\nVänliga hälsningar",
      },
      {
        id: "m2",
        namn: "Offertutskick",
        amne: "Offert från oss",
        brodtext:
          "Hej {{namn}},\n\nBifogat hittar du offerten vi diskuterade. Den är giltig i 30 dagar.\n\nSäg till om något är oklart.\n\nMvh",
      },
    ],
    filer: [],
    avtal: [
      {
        id: "a1",
        titel: "Konsultavtal – Nordic Design",
        kundId: "k1",
        status: "utkast",
        innehall: "Detta avtal reglerar samarbetet mellan parterna…",
        skapad: now(),
      },
    ],
    paket: [
      { id: "p1", namn: "Startpaket", beskrivning: "Uppstart och kartläggning", pris: 4900, enhet: "st" },
      { id: "p2", namn: "Månadsservice", beskrivning: "Löpande stöd", pris: 3500, enhet: "månad" },
      { id: "p3", namn: "Konsulttimme", beskrivning: "Rådgivning per timme", pris: 1250, enhet: "timme" },
    ],
  };
}

function empty(): Data {
  return {
    kunder: [],
    bokningar: [],
    uppgifter: [],
    mallar: [],
    filer: [],
    avtal: [],
    paket: [],
  };
}

function load(): Data {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as Partial<Data>;
    return { ...empty(), ...parsed };
  } catch {
    return empty();
  }
}

let state: Data = typeof window === "undefined" ? empty() : load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Kunde inte spara till localStorage – kanske för mycket data.", e);
    }
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;
const getServerSnapshot = () => empty();

export function useCRM() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const store = {
  // Kunder
  addKund(k: Omit<Kund, "id" | "skapad">) {
    state = { ...state, kunder: [{ ...k, id: uid(), skapad: now() }, ...state.kunder] };
    persist();
  },
  updateKund(id: string, patch: Partial<Kund>) {
    state = { ...state, kunder: state.kunder.map((x) => (x.id === id ? { ...x, ...patch } : x)) };
    persist();
  },
  removeKund(id: string) {
    state = {
      ...state,
      kunder: state.kunder.filter((x) => x.id !== id),
      bokningar: state.bokningar.map((b) => (b.kundId === id ? { ...b, kundId: undefined } : b)),
      uppgifter: state.uppgifter.map((u) => (u.kundId === id ? { ...u, kundId: undefined } : u)),
      filer: state.filer.map((f) => (f.kundId === id ? { ...f, kundId: undefined } : f)),
      avtal: state.avtal.map((a) => (a.kundId === id ? { ...a, kundId: undefined } : a)),
    };
    persist();
  },

  // Bokningar
  addBokning(b: Omit<Bokning, "id" | "skapad">) {
    state = { ...state, bokningar: [{ ...b, id: uid(), skapad: now() }, ...state.bokningar] };
    persist();
  },
  updateBokning(id: string, patch: Partial<Bokning>) {
    state = {
      ...state,
      bokningar: state.bokningar.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    };
    persist();
  },
  removeBokning(id: string) {
    state = { ...state, bokningar: state.bokningar.filter((x) => x.id !== id) };
    persist();
  },

  // Uppgifter
  addUppgift(u: Omit<Uppgift, "id" | "skapad" | "klar"> & { klar?: boolean }) {
    state = {
      ...state,
      uppgifter: [
        { ...u, klar: u.klar ?? false, id: uid(), skapad: now() },
        ...state.uppgifter,
      ],
    };
    persist();
  },
  toggleUppgift(id: string) {
    state = {
      ...state,
      uppgifter: state.uppgifter.map((u) => (u.id === id ? { ...u, klar: !u.klar } : u)),
    };
    persist();
  },
  removeUppgift(id: string) {
    state = { ...state, uppgifter: state.uppgifter.filter((u) => u.id !== id) };
    persist();
  },

  // Mallar
  addMall(m: Omit<Mailmall, "id">) {
    state = { ...state, mallar: [{ ...m, id: uid() }, ...state.mallar] };
    persist();
  },
  updateMall(id: string, patch: Partial<Mailmall>) {
    state = { ...state, mallar: state.mallar.map((m) => (m.id === id ? { ...m, ...patch } : m)) };
    persist();
  },
  removeMall(id: string) {
    state = { ...state, mallar: state.mallar.filter((m) => m.id !== id) };
    persist();
  },

  // Filer
  addFil(f: Omit<Fil, "id" | "uppladdad">) {
    state = { ...state, filer: [{ ...f, id: uid(), uppladdad: now() }, ...state.filer] };
    persist();
  },
  removeFil(id: string) {
    state = { ...state, filer: state.filer.filter((f) => f.id !== id) };
    persist();
  },

  // Avtal
  addAvtal(a: Omit<Avtal, "id" | "skapad">) {
    state = { ...state, avtal: [{ ...a, id: uid(), skapad: now() }, ...state.avtal] };
    persist();
  },
  updateAvtal(id: string, patch: Partial<Avtal>) {
    state = { ...state, avtal: state.avtal.map((a) => (a.id === id ? { ...a, ...patch } : a)) };
    persist();
  },
  removeAvtal(id: string) {
    state = { ...state, avtal: state.avtal.filter((a) => a.id !== id) };
    persist();
  },

  // Paket / priser
  addPaket(p: Omit<Paket, "id">) {
    state = { ...state, paket: [{ ...p, id: uid() }, ...state.paket] };
    persist();
  },
  updatePaket(id: string, patch: Partial<Paket>) {
    state = { ...state, paket: state.paket.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
    persist();
  },
  removePaket(id: string) {
    state = { ...state, paket: state.paket.filter((p) => p.id !== id) };
    persist();
  },
};

export const formatDatum = (iso: string) =>
  new Date(iso).toLocaleString("sv-SE", { dateStyle: "medium", timeStyle: "short" });

export const formatKort = (iso: string) =>
  new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });

export const formatKr = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
