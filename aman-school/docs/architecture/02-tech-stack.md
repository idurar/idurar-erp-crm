# Tech Stack

## Mobile/unified app (`apps/mobile`)

- **Expo (SDK, managed workflow)** + **React Native** + **TypeScript** — required for
  Expo Go compatibility and single-APK EAS builds.
- **expo-router** for file-based navigation, with role-gated route groups:
  `app/(auth)`, `app/(supervisor)`, `app/(parent)`, `app/(school)`, `app/(operations)`,
  `app/(owner)`.
- **Zustand** for lightweight global state (session, active role).
- **TanStack Query** for server-state/caching + offline-friendly retry.
- **expo-sqlite** for the Supervisor module's offline-first roster/queue (mirrors the
  original Flutter app's local SQLite requirement).
- **react-native-maps** for live tracking maps (Parent, School, Operations).
- **socket.io-client** for realtime boarding/tracking events.
- **expo-notifications** for push (FCM under the hood via Expo push service).
- NFC: **react-native-nfc-manager** (works in a custom/EAS dev-client build; Expo Go
  itself cannot access NFC hardware — see note in `apps/mobile/README.md`).

## Backend (`backend`)

- **Node.js + Express + TypeScript**.
- **PostgreSQL + Prisma ORM**, Row-Level Security for tenant isolation (see
  `01-multi-tenant-design.md`).
- **Socket.IO** server for realtime fan-out (boarding events, GPS pings, alerts).
- **JWT** auth (short-lived access + refresh tokens); bcrypt for admin passwords;
  hashed-PIN + phone+OTP for supervisor/parent per the original spec.
- Seed script (`prisma/seed.ts`) creates one demo school with a full roster: schools,
  buses, routes, students, parents, supervisors, ops-room user, and a partner + the
  platform owner — so every one of the 51 screens has real data to render.

## Shared packages

- `packages/types` — Zod schemas + inferred TS types shared by backend and app
  (single source of truth for DTOs, validated on both ends).
- `packages/api-client` — typed fetch wrapper + typed Socket.IO event map.
- `packages/shared-ui` — buttons, badges, cards, status pills, RTL-aware layout
  primitives used by all 5 role modules for visual consistency.

## Why not Flutter (deviation from original doc)

The original doc specified Flutter for the two mobile apps. Per the build decision for
this project, the whole product — including those two roles — is now React
Native/Expo, because the deliverable must be one Expo Go–compatible / EAS-buildable APK
containing all 5 roles, and mixing a Flutter binary into that isn't possible.
