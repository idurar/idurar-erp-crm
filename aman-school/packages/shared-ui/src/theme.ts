/** Design tokens — carried over from the original product design doc (aman_school_screens_doc.jsx). */
export const colors = {
  midnight: "#060D1F",
  navy: "#0B2447",
  blue: "#1A5276",
  blueMid: "#2E86C1",
  blueLight: "#EBF5FB",
  green: "#1E8449",
  greenMid: "#27AE60",
  greenLight: "#EAFAF1",
  amber: "#D68910",
  amberMid: "#F39C12",
  amberLight: "#FEF9E7",
  red: "#C0392B",
  redMid: "#E74C3C",
  redLight: "#FDEDEC",
  purple: "#6C3483",
  purpleMid: "#8E44AD",
  purpleLight: "#F5EEF8",
  teal: "#0E6655",
  tealMid: "#17A589",
  tealLight: "#E8F8F5",
  orange: "#A04000",
  orangeMid: "#D35400",
  orangeLight: "#FDEBD0",
  gray50: "#F8F9FA",
  gray100: "#F1F3F4",
  gray200: "#E8EAED",
  gray400: "#9AA0A6",
  gray600: "#5F6368",
  gray700: "#3C4043",
  gray900: "#0F172A",
  white: "#FFFFFF",
} as const;

/** Per-role accent color — solid-UI counterpart (cards, buttons, status dots)
 * to the gradient headers below. Derived from each role's own gradient's lead
 * stop so solid accents and gradient headers always agree for the same role. */
const roleAccentSource = {
  parent: "#2563EB",
  supervisor: "#059669",
  driver: "#0D9488",
  school_admin: "#7C3AED",
  ops_room: "#334155",
  owner: "#D97706",
  partner: "#0891B2",
  sysadmin: "#475569",
  regulator: "#4F46E5",
} as const;
export const roleColors: Record<keyof typeof roleAccentSource, string> = roleAccentSource;

export const spacing = (n: number) => n * 4;

/** Corner-radius scale — used consistently across Card/Button/inputs so the
 * whole app reads as one rounded, modern system instead of mismatched radii. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 32,
  hero: 48,
  pill: 999,
} as const;

/** Per-role hero-header gradients (two-stop, top-to-bottom) — matches the
 * exact Tailwind color-stop spec: parent blue-600→800, supervisor
 * emerald-500→700, driver teal-600→800, school_admin purple-600→800,
 * ops_room slate-700→900 (dark mode), owner amber-600→800, partner
 * cyan-600→800, sysadmin slate-600→800 (distinct from ops_room). */
export const roleGradients: Record<keyof typeof roleAccentSource, [string, string]> = {
  parent: [roleAccentSource.parent, "#1E40AF"],
  supervisor: [roleAccentSource.supervisor, "#065F46"],
  driver: [roleAccentSource.driver, "#115E59"],
  school_admin: [roleAccentSource.school_admin, "#5B21B6"],
  ops_room: [roleAccentSource.ops_room, "#0F172A"],
  owner: [roleAccentSource.owner, "#92400E"],
  partner: [roleAccentSource.partner, "#155E75"],
  sysadmin: [roleAccentSource.sysadmin, "#1E293B"],
  regulator: [roleAccentSource.regulator, "#3730A3"],
};

/** Elevation presets (iOS shadow* + Android elevation together) — gives cards
 * and buttons a soft "lifted" look instead of a flat bordered box. */
export const shadow = {
  none: {},
  card: {
    shadowColor: "#0B2447",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: "#0B2447",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  floating: {
    shadowColor: "#0B2447",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export const typography = {
  h1: { fontSize: 22, fontWeight: "800" as const },
  h2: { fontSize: 18, fontWeight: "800" as const },
  h3: { fontSize: 15, fontWeight: "700" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  bodyStrong: { fontSize: 14, fontWeight: "700" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
  captionStrong: { fontSize: 12, fontWeight: "700" as const },
  micro: { fontSize: 11, fontWeight: "600" as const },
};
