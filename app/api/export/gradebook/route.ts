import { prisma } from "@/lib/db";
import { currentContext } from "@/lib/auth/context";
import { canManageClass, isAdmin, isStaff } from "@/lib/auth/permissions";
import { csvLine, gradebookHeader, gradebookRow } from "@/lib/analytics";
import { studentPage } from "@/lib/org/analytics";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

const BATCH = 250;

/**
 * The gradebook as CSV: one class (its teachers and admins) or the whole
 * organisation (admins). Streamed in batches so a large organisation never
 * sits in memory at once.
 */
export async function GET(req: Request) {
  const ctx = await currentContext();
  if (!ctx?.org || !ctx.role || !isStaff(ctx.role) || ctx.user.mustChangePassword) return new Response("Not allowed", { status: 403 });
  if (!(await rateLimit("adminUser", ctx.user.id)).ok) return new Response("Too many requests", { status: 429 });
  const classId = new URL(req.url).searchParams.get("class");
  const org = ctx.org;
  let className = "all";
  if (classId) {
    const cls = await prisma.classroom.findFirst({ where: { id: classId, orgId: org.id } });
    if (!cls || !canManageClass(ctx.role, ctx.teaches.includes(cls.id))) return new Response("Not allowed", { status: 403 });
    className = cls.name;
  } else if (!isAdmin(ctx.role)) {
    return new Response("Not allowed", { status: 403 });
  }
  const scope = { orgId: org.id, classroomId: classId };
  await audit({ orgId: org.id, actorId: ctx.user.id, action: "data.exported", targetType: classId ? "class" : "org", targetId: classId ?? org.id, meta: { what: "gradebook" } });

  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(enc.encode("﻿" + csvLine(gradebookHeader())));
        let after: string | null = null;
        for (;;) {
          const ids = await studentPage(scope, after, BATCH);
          if (ids.length === 0) break;
          after = ids[ids.length - 1];
          const users = await prisma.user.findMany({
            where: { id: { in: ids } },
            orderBy: { name: "asc" },
            select: {
              name: true,
              email: true,
              lastActiveOn: true,
              streakDays: true,
              progress: { select: { nodeId: true, status: true, misconceptionId: true } },
              examRecords: { select: { scope: true, score: true, total: true } },
              enrollments: { where: { role: "STUDENT", classroom: { orgId: org.id } }, select: { classroom: { select: { name: true } } } },
            },
          });
          for (const u of users) {
            controller.enqueue(
              enc.encode(
                csvLine(gradebookRow({ ...u, classes: u.enrollments.map((e) => e.classroom.name), exams: u.examRecords })),
              ),
            );
          }
          if (ids.length < BATCH) break;
        }
        controller.close();
      } catch (err) {
        console.error("gradebook export failed", err);
        controller.error(err);
      }
    },
  });
  const file = `${org.slug}-${className.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-gradebook-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "no-store",
    },
  });
}
