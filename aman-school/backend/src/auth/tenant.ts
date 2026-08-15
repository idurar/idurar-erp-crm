import { prisma } from "../prisma";

/**
 * Defense-in-depth helper for Postgres Row-Level Security (see
 * prisma/migrations/*_rls_policies/migration.sql). Runs `fn` inside a
 * transaction with `app.current_school_id` set via `SET LOCAL`, so that even
 * if application-level `where: { schoolId }` filters were ever missing from a
 * query, the RLS policies on tenant tables would still restrict visible rows
 * to this school.
 *
 * CAVEAT (see final report / README): the local dev DATABASE_URL connects as
 * the `postgres` superuser, which Postgres always allows to BYPASS RLS
 * regardless of policy — this is a hard Postgres rule, not a bug here. RLS
 * therefore does not add real protection in *this* environment; a production
 * deployment must connect through a non-superuser role for RLS to actually
 * bind. Application-level `schoolId` filtering (see src/auth/middleware.ts
 * `assertSchoolAccess` and the explicit `where` clauses in every route) is
 * therefore the primary and REQUIRED enforcement mechanism, used on every
 * tenant-scoped query in this codebase regardless of RLS.
 */
export async function runTenantScoped<T>(schoolId: string | null, fn: (tx: typeof prisma) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    if (schoolId) {
      // set_config with is_local=true == SET LOCAL, scoped to this transaction only.
      await tx.$executeRawUnsafe(`SELECT set_config('app.current_school_id', $1, true)`, schoolId);
    }
    return fn(tx as unknown as typeof prisma);
  });
}
