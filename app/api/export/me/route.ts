import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth/session";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

/** Everything the platform holds about the signed-in user, as JSON (right of access / portability). */
export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Log in first", { status: 401 });
  if (!(await rateLimit("examUser", `export:${user.id}`)).ok) return new Response("Too many requests", { status: 429 });
  const data = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      createdAt: true,
      streakDays: true,
      lastActiveOn: true,
      memberships: { select: { role: true, createdAt: true, org: { select: { name: true } } } },
      enrollments: { select: { role: true, createdAt: true, classroom: { select: { name: true, org: { select: { name: true } } } } } },
      progress: { select: { nodeId: true, status: true, misconceptionId: true, intervalDays: true, reviewStreak: true, dueAt: true, updatedAt: true } },
      attempts: { orderBy: { createdAt: "asc" }, select: { nodeId: true, itemId: true, step: true, correct: true, misconceptionId: true, response: true, createdAt: true } },
      examRecords: { orderBy: { createdAt: "asc" }, select: { scope: true, score: true, total: true, durationSec: true, createdAt: true } },
      hints: { orderBy: { createdAt: "asc" }, select: { nodeId: true, itemId: true, createdAt: true } },
    },
  });
  const orgs = await prisma.membership.findMany({ where: { userId: user.id }, select: { orgId: true } });
  for (const m of orgs) await audit({ orgId: m.orgId, actorId: user.id, action: "data.exported", targetType: "user", targetId: user.id, meta: { what: "own data" } });
  return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="eigen-my-data-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
