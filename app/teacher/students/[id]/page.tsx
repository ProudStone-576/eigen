import Link from "next/link";
import { notFound } from "next/navigation";
import { STATUS_STYLE } from "@/components/ConceptMap";
import { requireStaff } from "@/lib/auth/context";
import { canResetPassword, canViewStudent } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { course, getNode } from "@/lib/content";
import type { Status } from "@/lib/learning/rules";
import { assignmentProgress, liveMisconceptions, scopeTitle, statusCounts } from "@/lib/learning/summary";
import { ResetPassword } from "./ResetPassword";

export const metadata = { title: "Student" };

const STEP: Record<string, string> = { check: "Check", predict: "Predict", resolve: "Resolve", produce: "Produce", review: "Review", practice: "Practice", exam: "Test", testout: "Test out" };

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireStaff();
  const { id } = await params;
  const member = await prisma.membership.findUnique({ where: { orgId_userId: { orgId: ctx.org.id, userId: id } } });
  if (!member) notFound();
  const classes = await prisma.enrollment.findMany({ where: { userId: id, role: "STUDENT", classroom: { orgId: ctx.org.id } }, include: { classroom: { select: { id: true, name: true } } } });
  const shares = classes.some((e) => ctx.teaches.includes(e.classroomId));
  if (!canViewStudent(ctx.role, shares)) notFound();
  const visibleClassIds = classes.map((e) => e.classroomId).filter((cid) => ctx.role !== "TEACHER" || ctx.teaches.includes(cid));
  const s = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, xp: true, streakDays: true, lastActiveOn: true, createdAt: true, mustChangePassword: true, progress: { select: { nodeId: true, status: true, misconceptionId: true } } },
  });
  if (!s) notFound();
  const [exams, attempts, assignments] = await Promise.all([
    prisma.examRecord.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.attempt.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, nodeId: true, step: true, correct: true, misconceptionId: true, createdAt: true } }),
    prisma.assignment.findMany({ where: { archived: false, classroomId: { in: visibleClassIds } }, orderBy: { createdAt: "desc" } }),
  ]);
  const by = new Map(s.progress.map((p) => [p.nodeId, p]));
  const counts = statusCounts(s.progress);
  const mis = liveMisconceptions(s.progress);

  return (
    <div className="space-y-8">
      <Link href={visibleClassIds[0] ? `/teacher/classes/${visibleClassIds[0]}` : "/teacher"} className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← {classes.find((e) => e.classroomId === visibleClassIds[0])?.classroom.name ?? "Classes"}</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{s.name}</h1>
          <p className="text-[var(--muted)]">
            {s.email} · {classes.map((e) => e.classroom.name).join(", ") || "no class"} · joined {s.createdAt.toLocaleDateString("en-CA")} · last active {s.lastActiveOn ?? "never"}
          </p>
          <p className="mt-1 text-sm">
            {counts.solid} solid · {counts.landed} landed · {counts.misconception} to untangle · {s.streakDays}-day streak · {s.xp} XP
          </p>
        </div>
        {canResetPassword(ctx.role, member.role, s.id === ctx.user.id, shares) && <ResetPassword studentId={s.id} name={s.name} pending={s.mustChangePassword} />}
      </div>

      {assignments.length > 0 && (
        <section className="card space-y-2">
          <h2 className="text-lg font-semibold">Assignments</h2>
          {assignments.map((a) => {
            const pr = assignmentProgress(a, s.progress, exams);
            return (
              <div key={a.id} className="flex flex-wrap justify-between gap-2 text-sm">
                <Link href={`/teacher/assignments/${a.id}`} className="hover:text-[var(--accent)]">{a.title}</Link>
                <span className={pr.complete ? "text-[var(--solid)]" : pr.overdue ? "text-[var(--mis)]" : "text-[var(--muted)]"}>
                  {pr.complete ? "Done" : `${pr.conceptsDone}/${pr.concepts} concepts${a.unitId ? (pr.exam ? " · test taken" : " · test not taken") : ""}${pr.overdue ? " · past due" : ""}`}
                </span>
              </div>
            );
          })}
        </section>
      )}

      {mis.length > 0 && (
        <section className="card space-y-2">
          <h2 className="text-lg font-semibold">Mix-ups they hold</h2>
          <ul className="space-y-1.5 text-sm">
            {mis.map((m) => (
              <li key={m.nodeId}>
                <span className="font-medium">{m.title}:</span> <span className="text-[var(--muted)]">{m.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Concept map</h2>
        {course.units.map((u) => (
          <div key={u.id}>
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
              {u.track} · {u.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {u.nodes.map((n) => {
                const st: Status = by.get(n.id)?.status ?? "UNKNOWN";
                const style = STATUS_STYLE[st];
                return (
                  <span key={n.id} title={style.label} className="rounded-lg px-2.5 py-1 text-xs" style={{ background: style.fill, color: style.stroke, border: `1px solid ${style.stroke}` }}>
                    {n.title}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="card space-y-2">
          <h2 className="text-lg font-semibold">Tests</h2>
          {exams.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">None yet.</p>
          ) : (
            exams.map((e) => (
              <div key={e.id} className="flex justify-between gap-2 text-sm">
                <span>{scopeTitle(e.scope)}</span>
                <span className="tabular-nums text-[var(--muted)]">
                  {e.score}/{e.total} · {e.createdAt.toLocaleDateString("en-CA")}
                </span>
              </div>
            ))
          )}
        </section>
        <section className="card space-y-2">
          <h2 className="text-lg font-semibold">Recent answers</h2>
          {attempts.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">None yet.</p>
          ) : (
            attempts.map((a) => {
              const node = getNode(a.nodeId);
              return (
                <div key={a.id} className="flex justify-between gap-2 text-sm">
                  <span>
                    <span className={a.correct ? "text-[var(--solid)]" : "text-[var(--mis)]"}>{a.correct ? "✓" : "✗"}</span> {node?.title ?? a.nodeId}{" "}
                    <span className="text-[var(--muted)]">· {STEP[a.step] ?? a.step}</span>
                    {a.misconceptionId && node?.misconceptions[a.misconceptionId] && <span className="block text-xs text-[var(--mis)]">{node.misconceptions[a.misconceptionId]}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">{a.createdAt.toLocaleDateString("en-CA")}</span>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
