import Link from "next/link";
import { notFound } from "next/navigation";
import { STATUS_STYLE } from "@/components/ConceptMap";
import { requireStaff } from "@/lib/auth/context";
import { canManageClass } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { getNode } from "@/lib/content";
import type { Status } from "@/lib/learning/rules";
import { assignmentProgress, scopeTitle } from "@/lib/learning/summary";
import { ArchiveButton } from "./ArchiveButton";

export const metadata = { title: "Assignment" };

export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireStaff();
  const { id } = await params;
  const a = await prisma.assignment.findFirst({ where: { id, classroom: { orgId: ctx.org.id } }, include: { classroom: { select: { id: true, name: true } } } });
  if (!a || !a.classroom || !canManageClass(ctx.role, ctx.teaches.includes(a.classroom.id))) notFound();
  const students = await prisma.user.findMany({
    where: { enrollments: { some: { classroomId: a.classroom.id, role: "STUDENT" } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, progress: { select: { nodeId: true, status: true, misconceptionId: true } } },
  });
  const exams = a.unitId ? await prisma.examRecord.findMany({ where: { scope: a.unitId, createdAt: { gte: a.createdAt }, userId: { in: students.map((s) => s.id) } } }) : [];
  const nodes = a.nodeIds.flatMap((nid) => {
    const n = getNode(nid);
    return n ? [n] : [];
  });
  const rows = students.map((s) => ({ s, pr: assignmentProgress(a, s.progress, exams.filter((e) => e.userId === s.id)), by: new Map(s.progress.map((p) => [p.nodeId, p.status])) }));
  const done = rows.filter((r) => r.pr.complete).length;

  return (
    <div className="space-y-6">
      <Link href={`/teacher/classes/${a.classroom.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← {a.classroom.name}</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{a.title}</h1>
          <p className="text-[var(--muted)]">
            {a.dueAt ? `Due ${a.dueAt.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })} · ` : ""}
            {done} of {students.length} students done
            {a.archived ? " · archived" : ""}
          </p>
          {a.note && <p className="mt-2 max-w-xl">{a.note}</p>}
        </div>
        <ArchiveButton id={a.id} archived={a.archived} />
      </div>

      <div className="card overflow-x-auto p-0!">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)]">
              <th className="p-3 font-medium">Student</th>
              <th className="p-3 font-medium">Progress</th>
              {nodes.map((n) => (
                <th key={n.id} className="p-3 font-medium whitespace-nowrap">{n.title}</th>
              ))}
              {a.unitId && <th className="p-3 font-medium whitespace-nowrap">{scopeTitle(a.unitId)}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, pr, by }) => (
              <tr key={s.id} className="border-t border-[var(--border)]">
                <td className="p-3">
                  <Link href={`/teacher/students/${s.id}`} className="font-medium hover:text-[var(--accent)]">{s.name}</Link>
                </td>
                <td className="p-3 min-w-32">
                  <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                    <div className={`h-full ${pr.complete ? "bg-[var(--solid)]" : "bg-[var(--landed)]"}`} style={{ width: `${pr.fraction * 100}%` }} />
                  </div>
                  <p className={`mt-1 text-xs ${pr.overdue ? "text-[var(--mis)]" : "text-[var(--muted)]"}`}>{pr.complete ? "Done" : pr.overdue ? "Past due" : `${Math.round(pr.fraction * 100)}%`}</p>
                </td>
                {nodes.map((n) => {
                  const st: Status = by.get(n.id) ?? "UNKNOWN";
                  const style = STATUS_STYLE[st];
                  return (
                    <td key={n.id} className="p-3">
                      <span className="rounded-md px-2 py-0.5 text-xs whitespace-nowrap" style={{ background: style.fill, color: style.stroke, border: `1px solid ${style.stroke}` }}>
                        {style.label}
                      </span>
                    </td>
                  );
                })}
                {a.unitId && <td className="p-3 tabular-nums whitespace-nowrap">{pr.exam ? `${pr.exam.score}/${pr.exam.total}` : <span className="text-[var(--muted)]">not taken</span>}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
