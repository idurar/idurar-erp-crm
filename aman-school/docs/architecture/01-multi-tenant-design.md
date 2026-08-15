# Multi-Tenant Design

## Isolation strategy: shared database, `school_id` row-level isolation + RLS

Given this is a single Postgres instance managed via Prisma (not a per-school schema
fork, which doesn't scale operationally past a few dozen tenants), tenancy is enforced
by:

1. Every tenant-owned table carries a non-nullable `schoolId` foreign key.
2. Postgres **Row-Level Security (RLS)** policies restrict every query to rows whose
   `schoolId` matches the session's `app.current_school_id` setting, set per-request
   by middleware from the caller's JWT. This means even a bug in application code
   cannot leak cross-tenant data — the database itself enforces isolation.
3. Partner accounts and the Owner account are **not** scoped by RLS — they use a
   separate elevated DB role that can see across schools, gated entirely by
   application-level RBAC (never exposed to browser/mobile clients directly).
4. A parent can legitimately have children in **multiple schools** (confirmed by the
   spec: `SCHOOL-2026-XXXXX` student codes are tenant-prefixed, and P-12 lets a parent
   link a child "from a different school or the same one"). Parent-facing queries
   therefore join across schools explicitly for that one user's own linked students —
   this is the one deliberate exception to strict per-request single-tenant scoping,
   and it's implemented as a UNION over the parent's own `student_parent` links, never
   a broad cross-tenant read.

## JWT claims

```json
{
  "sub": "<user id>",
  "role": "owner | partner | school_admin | ops_room | supervisor | parent",
  "schoolId": "<uuid, null for owner/partner>",
  "partnerId": "<uuid, null unless role=partner>",
  "tenantVersion": 1
}
```

`schoolId` is injected into `SET app.current_school_id = '<uuid>'` at the start of
every DB transaction by the `tenantContext` middleware.

## Student code format

`SCHOOL-2026-XXXXX` → `{schoolSlug}-{enrollmentYear}-{serial}` — used both as the
human-entered linking code (Parent App P-04) and encoded into the printed QR code
(School Admin SCH-03/SCH-04).

## Provisioning a new school (Owner: OWN-02)

Registering a school automatically:
1. Creates the `School` row + a `SchoolAdmin` user with a generated password, emailed
   to the admin.
2. Creates default notification/report settings rows.
3. Does **not** create a separate DB schema (see isolation strategy above) — it's a
   single new tenant row scoping all subsequent data via RLS.
