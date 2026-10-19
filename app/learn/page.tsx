import Link from "next/link";
import { ConceptMap, STATUS_STYLE } from "@/components/ConceptMap";
import { requireUser } from "@/lib/auth/session";
import { course } from "@/lib/content";
import { dueNodes, loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import { PRACTICE_STREAK, type Status } from "@/lib/learning/rules";
import { strugglingNodes } from "@/lib/learning/practice";
import { prisma } from "@/lib/db";
import { getNode } from "@/lib/content";
import { assignmentProgress } from "@/lib/learning/summary";

export const metadata = { title: "Learn" };

export default async function LearnPage() {
  const user = await requireUser();
  const progress = await loadProgress(user.id);
  const status = statusIn(progress);
  const due = dueNodes(progress);
  const [struggling, assignments, exams] = await Promise.all([
    strugglingNodes(user.id),
    prisma.assignment.findMany({ where: { archived: false }, orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }] }),
    prisma.examRecord.findMany({ where: { userId: user.id }, select: { scope: true, createdAt: true, score: true, total: true } }),
  ]);
  const rows = [...progress.entries()].map(([nodeId, p]) => ({ nodeId, status: p.status, misconceptionId: p.misconceptionId }));
  const assigned = assignments.map((a) => ({ a, pr: assignmentProgress(a, rows, exams) })).filter(({ pr }) => !pr.complete);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[var(--muted)]">Hi {user.name.split(" ")[0]} 👋</p>
        <h1 className="text-3xl font-extrabold">{course.title}</h1>
      </div>

      {assigned.length > 0 && (
        <section className="card space-y-4">
          <h2 className="font-semibold">Assigned to you</h2>
          {assigned.map(({ a, pr }) => {
            const next = pr.next ? getNode(pr.next) : null;
            return (
              <div key={a.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">{a.title}</p>
                  <p className={`text-sm ${pr.overdue ? "text-[var(--mis)]" : "text-[var(--muted)]"}`}>
                    {a.dueAt ? `${pr.overdue ? "Was due" : "Due"} ${a.dueAt.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}` : "No due date"}
                  </p>
                </div>
                {a.note && <p className="text-sm text-[var(--muted)]">{a.note}</p>}
                <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div className="h-full bg-[var(--landed)]" style={{ width: `${pr.fraction * 100}%` }} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-[var(--muted)]">
                    {pr.conceptsDone} of {pr.concepts} concepts landed{a.unitId ? (pr.exam ? " · test done" : " · plus a unit test") : ""}
                  </span>
                  {next && unlocked(next.id, progress) && (
                    <Link href={`/learn/${next.id}`} className="link-more">Next: {next.title}</Link>
                  )}
                  {next && !unlocked(next.id, progress) && <span className="text-[var(--muted)]">Next: {next.title} (unlock its foundations first)</span>}
                  {!next && a.unitId && !pr.exam && (
                    <Link href={`/exam/${a.unitId}`} className="link-more">Take the unit test</Link>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {due.length > 0 && (
        <Link href="/review" className="card-soft flex items-center justify-between gap-4 hover:opacity-90">
          <span>
            <strong>
              {due.length} concept{due.length > 1 ? "s" : ""} due for review.
            </strong>{" "}
            Recall first, while it&rsquo;s fresh.
          </span>
          <span className="btn">Review</span>
        </Link>
      )}

      <Link href="/exam" className="card-soft flex items-center justify-between gap-4 hover:opacity-90">
        <span>
          <strong>Test yourself.</strong> Unit tests and mock exams: every kind of question, graded together, with a breakdown of what to revisit.
        </span>
        <span className="btn-ghost">Tests</span>
      </Link>

      {struggling.length > 0 && (
        <section className="card space-y-3 border-[var(--edge)]">
          <h2 className="font-bold">🎯 Needs practice</h2>
          <p className="text-sm text-[var(--muted)]">
            These keep tripping you up. Practice gives fresh questions on each, mixed with the ideas underneath, until you get them right{" "}
            {PRACTICE_STREAK} times in a row.
          </p>
          <ul className="space-y-2">
            {struggling.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 flex-wrap">
                <span>
                  <strong>{s.title}</strong> <span className="text-sm text-[var(--muted)]">· {s.reason}</span>
                </span>
                <Link href={`/practice/${s.id}`} className="btn">
                  Practice
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {course.units.map((unit, i) => {
        const trackStart = i === 0 || course.units[i - 1].track !== unit.track;
        const state: Record<string, Status | "LOCKED"> = Object.fromEntries(
          unit.nodes.map((n) => [n.id, unlocked(n.id, progress) ? status(n.id) : "LOCKED"]),
        );
        const solid = unit.nodes.filter((n) => status(n.id) === "SOLID").length;
        const next = unit.nodes.find((n) => state[n.id] !== "LOCKED" && state[n.id] !== "SOLID");
        return (
          <div key={unit.id} className="space-y-3">
          {trackStart && <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] pt-2">{unit.track}</h2>}
          <section className="card space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{unit.title}</h2>
                <p className="text-[var(--muted)]">{unit.blurb}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--muted)]">
                  {solid} / {unit.nodes.length} solid
                </p>
                {next && (
                  <Link href={`/learn/${next.id}`} className="btn mt-2">
                    {state[next.id] === "UNKNOWN" ? "Start" : "Continue"}: {next.title}
                  </Link>
                )}
              </div>
            </div>
            <ConceptMap nodes={unit.nodes} state={state} />
            <ul className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
              {(["UNKNOWN", "EDGE", "LANDED", "SOLID", "MISCONCEPTION", "LOCKED"] as const).map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded"
                    style={{ background: STATUS_STYLE[s].fill, border: `2px solid ${STATUS_STYLE[s].stroke}` }}
                  />
                  {STATUS_STYLE[s].label}
                </li>
              ))}
            </ul>
          </section>
          </div>
        );
      })}

      <p className="text-sm text-[var(--muted)]">One story across every track: data as vectors, uncertainty as probability, learning as gradient descent on a likelihood, and neural networks putting it all together.</p>
    </div>
  );
}
