import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AccuracyRow, ExamAggregate, MisconceptionCount, NodeStatusCount } from "@/lib/analytics";
import type { Status } from "@/lib/learning/rules";

/**
 * Aggregated report data for an organisation, or one of its classes. Every
 * statement is restricted to a "population" of student ids from Membership or
 * Enrollment, and returns at most one row per section, chapter or test.
 */

export type Scope = { orgId: string; classroomId?: string | null };

function population({ orgId, classroomId }: Scope) {
  return classroomId
    ? Prisma.sql`SELECT e."userId" FROM "Enrollment" e JOIN "Classroom" c ON c."id" = e."classroomId"
                 WHERE e."classroomId" = ${classroomId} AND c."orgId" = ${orgId} AND e."role" = 'STUDENT'`
    : Prisma.sql`SELECT "userId" FROM "Membership" WHERE "orgId" = ${orgId} AND "role" = 'STUDENT'`;
}

export async function reportData(scope: Scope) {
  const pop = population(scope);
  const since30 = new Date(Date.now() - 30 * 86_400_000);
  const since56 = new Date(Date.now() - 56 * 86_400_000);
  const [students, statuses, accuracy, misconceptions, exams, weekly] = await Promise.all([
    prisma.$queryRaw<{ n: number }[]>`WITH pop AS (${pop}) SELECT count(*)::int AS n FROM pop`.then((r) => r[0]?.n ?? 0),
    prisma.$queryRaw<{ nodeId: string; status: Status; n: number }[]>`
      WITH pop AS (${pop})
      SELECT p."nodeId", p."status"::text AS status, count(*)::int AS n
      FROM "NodeProgress" p JOIN pop ON pop."userId" = p."userId"
      GROUP BY 1, 2` as Promise<NodeStatusCount[]>,
    prisma.$queryRaw<AccuracyRow[]>`
      WITH pop AS (${pop})
      SELECT a."nodeId", sum(CASE WHEN a."correct" THEN 1 ELSE 0 END)::int AS correct, count(*)::int AS total
      FROM "Attempt" a JOIN pop ON pop."userId" = a."userId"
      WHERE a."createdAt" >= ${since30}
      GROUP BY 1`,
    prisma.$queryRaw<MisconceptionCount[]>`
      WITH pop AS (${pop})
      SELECT p."nodeId", p."misconceptionId", count(*)::int AS n
      FROM "NodeProgress" p JOIN pop ON pop."userId" = p."userId"
      WHERE p."status" = 'MISCONCEPTION' AND p."misconceptionId" IS NOT NULL
      GROUP BY 1, 2`,
    prisma.$queryRaw<ExamAggregate[]>`
      WITH pop AS (${pop})
      SELECT x."scope", count(*)::int AS attempts, count(DISTINCT x."userId")::int AS takers,
             avg(x."score"::float / greatest(x."total", 1)) AS mean, max(x."score"::float / greatest(x."total", 1)) AS best
      FROM "ExamRecord" x JOIN pop ON pop."userId" = x."userId"
      GROUP BY 1`,
    prisma.$queryRaw<{ week: string; n: number }[]>`
      WITH pop AS (${pop})
      SELECT to_char(date_trunc('week', a."createdAt"), 'YYYY-MM-DD') AS week, count(DISTINCT a."userId")::int AS n
      FROM "Attempt" a JOIN pop ON pop."userId" = a."userId"
      WHERE a."createdAt" >= ${since56}
      GROUP BY 1 ORDER BY 1`,
  ]);
  return { students, statuses, accuracy, misconceptions, exams, weekly };
}

/** Student ids in scope, in pages, for the streamed gradebook. */
export async function studentPage(scope: Scope, after: string | null, take: number): Promise<string[]> {
  const pop = population(scope);
  const rows = await prisma.$queryRaw<{ userId: string }[]>`
    WITH pop AS (${pop})
    SELECT pop."userId" FROM pop
    ${after ? Prisma.sql`WHERE pop."userId" > ${after}` : Prisma.empty}
    ORDER BY pop."userId" LIMIT ${take}`;
  return rows.map((r) => r.userId);
}
