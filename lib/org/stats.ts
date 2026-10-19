import "server-only";
import { prisma } from "@/lib/db";
import { fillDays, type DayRow } from "./days";

export type { DayRow };

/**
 * Organisation-level figures for the admin console. Every query joins through
 * Membership, so it only ever counts this organisation's people.
 */

export async function orgOverview(orgId: string) {
  const since7 = new Date(Date.now() - 7 * 86_400_000);
  const [roles, classes, seatLimit, active7, days, recent] = await Promise.all([
    prisma.membership.groupBy({ by: ["role"], where: { orgId }, _count: { _all: true } }),
    prisma.classroom.count({ where: { orgId, archived: false } }),
    prisma.organization.findUniqueOrThrow({ where: { id: orgId }, select: { seatLimit: true } }).then((o) => o.seatLimit),
    prisma.attempt.groupBy({ by: ["userId"], where: { createdAt: { gte: since7 }, user: { memberships: { some: { orgId, role: "STUDENT" } } } } }).then((r) => r.length),
    activityByDay(orgId, 14),
    prisma.auditEvent.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const count = (r: string) => roles.find((x) => x.role === r)?._count._all ?? 0;
  return {
    students: count("STUDENT"),
    teachers: count("TEACHER"),
    admins: count("ADMIN") + count("OWNER"),
    classes,
    seatLimit,
    active7,
    days,
    recent,
  };
}

/** Answers and distinct active students per UTC day, oldest first, with empty days filled in. */
export async function activityByDay(orgId: string, days: number, classroomId?: string): Promise<DayRow[]> {
  const rows = classroomId
    ? await prisma.$queryRaw<{ day: string; answers: number; learners: number }[]>`
        SELECT to_char(date_trunc('day', a."createdAt"), 'YYYY-MM-DD') AS day, count(*)::int AS answers, count(DISTINCT a."userId")::int AS learners
        FROM "Attempt" a
        JOIN "Enrollment" e ON e."userId" = a."userId" AND e."classroomId" = ${classroomId} AND e."role" = 'STUDENT'
        JOIN "Classroom" c ON c."id" = e."classroomId" AND c."orgId" = ${orgId}
        WHERE a."createdAt" >= timezone('UTC', now()) - make_interval(days => ${days}::int)
        GROUP BY 1 ORDER BY 1`
    : await prisma.$queryRaw<{ day: string; answers: number; learners: number }[]>`
        SELECT to_char(date_trunc('day', a."createdAt"), 'YYYY-MM-DD') AS day, count(*)::int AS answers, count(DISTINCT a."userId")::int AS learners
        FROM "Attempt" a
        JOIN "Membership" m ON m."userId" = a."userId" AND m."orgId" = ${orgId} AND m."role" = 'STUDENT'
        WHERE a."createdAt" >= timezone('UTC', now()) - make_interval(days => ${days}::int)
        GROUP BY 1 ORDER BY 1`;
  return fillDays(rows, days);
}
