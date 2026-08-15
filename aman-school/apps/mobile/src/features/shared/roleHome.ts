import type { Role } from "@aman-school/types";

/** Where each role lands after login/consent — shared by index.tsx and consent.tsx.
 * `regulator` is web-only (no mobile screens), so this is intentionally partial —
 * every call site already falls back to role-select for an unmapped role. */
export const ROLE_HOME: Partial<Record<Role, string>> = {
  supervisor: "/(supervisor)/trip-select",
  parent: "/(parent)/home",
  school_admin: "/(school)/dashboard",
  ops_room: "/(operations)/control-room",
  owner: "/(owner)/dashboard",
  partner: "/(partner)/dashboard",
  sysadmin: "/(sysadmin)/dashboard",
  driver: "/(driver)/home",
};

/** Each role's route-group prefix — used to build in-group links (e.g. "about")
 * from shared screens that render inside more than one role's group. */
export const ROLE_GROUP: Partial<Record<Role, string>> = {
  supervisor: "/(supervisor)",
  parent: "/(parent)",
  school_admin: "/(school)",
  ops_room: "/(operations)",
  owner: "/(owner)",
  partner: "/(partner)",
  sysadmin: "/(sysadmin)",
  driver: "/(driver)",
};
