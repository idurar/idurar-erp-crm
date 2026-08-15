# Aman School — Mobile App

One Expo/React Native app for all 6 roles (Owner, Partner, School Admin, Operations Room,
Supervisor, Parent). Role-gated `expo-router` route groups keep each role's screens fully
independent (`src/app/(supervisor)`, `src/app/(parent)`, `src/app/(school)`,
`src/app/(operations)`, `src/app/(owner)`), while shipping as a single Expo Go–compatible
codebase and a single APK.

## Running locally (Expo Go)

```bash
# from the aman-school/ monorepo root
npm install

# 1. start the backend (needs local Postgres running — see backend/README/.env.example)
npm run dev:backend

# 2. start the app, pointing it at a LAN-reachable backend URL
#    "localhost" resolves to the PHONE itself in Expo Go, never your dev machine —
#    use your machine's LAN IP instead.
EXPO_PUBLIC_API_URL=http://<your-machine-lan-ip>:4000 npx expo start
```

Scan the QR code with Expo Go. Log in with any of the demo accounts in
`../../backend/SEED_CREDENTIALS.md`.

## Known Expo Go limitations (by design)

- **NFC bracelet scanning (S-05/S-06)**: Expo Go cannot load custom native modules, so
  real NFC hardware access isn't available inside the Expo Go client. The Supervisor
  "scan" screen is implemented as a tap-to-board roster — functionally equivalent for
  testing the boarding/alighting flow end-to-end. Real hardware integration
  (`react-native-nfc-manager`) is a documented follow-up that requires an EAS
  **development build** (a custom native client), not Expo Go.
- **Offline-first sync**: the original spec calls for a fully offline-capable
  Supervisor app backed by local SQLite with a sync queue. This build is online-first
  (React Query caching/retry only) to keep scope shippable; `expo-sqlite` is
  Expo-Go-compatible and is the natural place to add a real offline queue later.

## Building a real APK (EAS)

This project is already linked to the Expo project `aman-` (owner
`abdozas94s-organization`, id in `app.json` under `extra.eas.projectId`).

```bash
npm install -g eas-cli   # or: npx eas-cli <command>
eas login                # or set EXPO_TOKEN env var for non-interactive auth
eas build -p android --profile preview
```

**Never commit an Expo access token to this repo.** Set it as a local environment
variable (`EXPO_TOKEN=...`) for the build command only.

**Important**: the resulting APK talks to whatever `EXPO_PUBLIC_API_URL` (or the
`extra.apiUrl` fallback in `app.json`) was baked in at build time. A backend running
inside a temporary sandbox/session is not reachable by an APK installed on a real
device — deploy `aman-school/backend` somewhere with a stable public URL (Render,
Railway, Fly.io, a VPS, etc.) before it's useful outside of local dev.
