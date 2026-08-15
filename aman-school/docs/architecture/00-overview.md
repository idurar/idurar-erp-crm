# Aman School (أمان سكول) — Platform Overview

Multi-tenant SaaS platform for school-bus safety: NFC-bracelet boarding/alighting
confirmation, live GPS tracking, and role-based dashboards for six levels of users.

## Why this differs from the original design doc

The original spec (`aman_school_screens_doc.jsx` + the 4 PDFs, which turned out to be
PDF exports of the same screen doc split by app) proposed **5 separate applications**:
2 Flutter mobile apps (Supervisor, Parent) + 3 React web apps (School Admin, Operations
Room, Owner). Per explicit decision from the product owner for this build:

1. **All 5 roles ship as ONE Expo/React Native app**, buildable to a single APK,
   installable and testable via Expo Go. Flutter is dropped entirely — everything is
   TypeScript/React Native so it can live in one codebase and one Expo project.
2. Each role still gets its own **independent, self-contained screen module** — a
   supervisor never sees parent navigation code and vice versa. This is enforced by
   folder structure (`src/modules/<role>/`) and by a role-gated root navigator, not by
   convention.
3. A **real backend** (Node.js + PostgreSQL, multi-tenant) backs the app — not just UI
   with mocked data — with seed data for every role so the whole product can be
   demoed/tested end-to-end.
4. The web-oriented dashboards (School Admin, Operations Room, Owner) are implemented
   as responsive screens in the same React Native codebase (via `react-native-web`
   under the hood is NOT used for the APK target — they render as regular RN screens
   with a wide-layout breakpoint; a large/TV-optimized layout is applied for the
   Operations Room specifically, per its original 1920×1080 dark-mode design intent).

## Repository layout

```
aman-school/
├── docs/
│   ├── architecture/         ← this file + multi-tenancy, roles, tech stack
│   └── screens/              ← 51 screens, one .md file each, grouped by app
├── apps/
│   └── mobile/                ← single Expo/React Native app, all 5 roles
├── packages/
│   ├── shared-ui/             ← cross-role design system components
│   ├── api-client/             ← typed REST + WebSocket client
│   └── types/                  ← shared TypeScript types/DTOs
├── backend/
│   ├── src/                    ← Express API, multi-tenant middleware, sockets
│   ├── prisma/                 ← schema + migrations + seed data
│   └── ...
└── scripts/
    └── generate-screen-docs.mjs
```

## The 6-level user hierarchy (from the original design)

| Level | Role | Scope |
|---|---|---|
| 1 | Platform Owner (مالك النظام) | Everything — all partners, all schools |
| 2 | Partner (الشريك) | A region's group of schools + commission |
| 3 | School Admin (مدير المدرسة) | One school only |
| 4 | Operations Room (غرفة العمليات) | One school or a group of schools, live monitoring |
| 5 | Supervisor (المشرف) | Their assigned bus only |
| 6 | Parent (ولي الأمر) | Their own children only |

## Core real-time flows

- **Boarding**: Supervisor scans NFC bracelet → local SQLite/local-DB lookup → confirm
  sound/vibration → event queued if offline → synced to backend → pushed to parent app
  and school/operations dashboards in real time.
- **Live tracking**: Bus GPS position published every 30s (background-capable) →
  backend fan-out over WebSocket to Parent map view (5s UI refresh), School dashboard,
  and Operations Room control map.
- **Emergency (SOS)**: Dual-channel — primary API call with location, SMS fallback if
  offline — routed to Operations Room as a "very urgent" alert that sounds/flashes
  until acknowledged.
