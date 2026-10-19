import Link from "next/link";
import { requireTeacher } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { assignmentProgress, classMisconceptions, liveMisconceptions, statusCounts, trackProgress } from "@/lib/learning/summary";

export const metadata = { title: "Class" };

const fmtDate = (d: Date) => d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });

/** The class at a glance: assignments, the mix-ups most students hold, and every student's progress. */
export default async function TeacherPage() {
  await requireTeacher();
  const [students, assignments, exams] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, xp: true, streakDays: true, lastActiveOn: true, progress: { select: { nodeId: true, status: true, misconceptionId: true } } },
    }),
    prisma.assignment.findMany({ where: { archived: false }, orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }] }),
    prisma.examRecord.findMany({ select: { userId: true, scope: true, createdAt: true, score: true, total: true } }),
  ]);
  const examsBy = (id: string) => exams.filter((e) => e.userId === id);
  const mixups = classMisconceptions(students.map((s) => s.progress)).slice(0, 8);
  const tracks = trackProgress([]).map((t) => t.track);
  const now = new Date();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your class</h1>
          <p className="text-[var(--muted)]">
            {students.length} student{students.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/content" className="btn-ghost">Questions</Link>
          <Link href="/teacher/assignments/new" className="btn">New assignment</Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="card text-[var(--muted)]">No assignments yet. Set concepts to land (and optionally a unit test) with a due date; students see it on their map.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {assignments.map((a) => {
              const done = students.filter((s) => assignmentProgress(a, s.progress, examsBy(s.id)).complete).length;
              return (
                <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="card p-4! block hover:border-[var(--accent)] transition">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {a.nodeIds.length} concept{a.nodeIds.length === 1 ? "" : "s"}
                    {a.unitId ? " + unit test" : ""}
                    {a.dueAt ? ` · due ${fmtDate(a.dueAt)}` : ""}
                    {a.dueAt && a.dueAt < now ? " (past due)" : ""}
                  </p>
                  <div className="mt-3 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                    <div className="h-full bg-[var(--solid)]" style={{ width: `${students.length ? (100 * done) / students.length : 0}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {done} of {students.length} done
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {mixups.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Mix-ups in the class right now</h2>
          <div className="card p-0! divide-y divide-[var(--border)]">
            {mixups.map((m) => (
              <div key={`${m.nodeId}${m.text}`} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-[var(--muted)]">{m.text}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="rounded-full bg-[var(--mis-bg)] px-2.5 py-0.5 text-[var(--mis)] tabular-nums">
                    {m.students} student{m.students === 1 ? "" : "s"}
                  </span>
                  <Link href={`/teacher/content/${m.nodeId}`} className="link-more">Write a question</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Students</h2>
        {students.length === 0 ? (
          <p className="card">No students yet. Share the invite code from your .env so they can join.</p>
        ) : (
          <div className="card overflow-x-auto p-0!">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--muted)]">
                  <th className="p-3 font-medium">Student</th>
                  <th className="p-3 font-medium">Last active</th>
                  <th className="p-3 font-medium">Streak</th>
                  <th className="p-3 font-medium">Solid</th>
                  {tracks.map((t) => (
                    <th key={t} className="p-3 font-medium whitespace-nowrap">{t}</th>
                  ))}
                  <th className="p-3 font-medium">Mix-ups</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const c = statusCounts(s.progress);
                  const tp = trackProgress(s.progress);
                  const mis = liveMisconceptions(s.progress).length;
                  return (
                    <tr key={s.id} className="border-t border-[var(--border)] hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)]">
                      <td className="p-3">
                        <Link href={`/teacher/students/${s.id}`} className="font-medium hover:text-[var(--accent)]">{s.name}</Link>
                        <p className="text-xs text-[var(--muted)]">{s.email}</p>
                      </td>
                      <td className="p-3 whitespace-nowrap">{s.lastActiveOn ?? "never"}</td>
                      <td className="p-3 tabular-nums">{s.streakDays}</td>
                      <td className="p-3 tabular-nums">
                        {c.solid}/{c.total}
                      </td>
                      {tp.map((t) => (
                        <td key={t.track} className="p-3 min-w-28" title={`${t.done} of ${t.total} landed, ${t.solid} solid`}>
                          <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden flex">
                            <div className="h-full bg-[var(--solid)]" style={{ width: `${(100 * t.solid) / t.total}%` }} />
                            <div className="h-full bg-[var(--landed)]" style={{ width: `${(100 * (t.done - t.solid)) / t.total}%` }} />
                          </div>
                          <p className="mt-1 text-[11px] text-[var(--muted)] tabular-nums">
                            {t.done}/{t.total}
                          </p>
                        </td>
                      ))}
                      <td className="p-3">
                        {mis > 0 ? <span className="rounded-full bg-[var(--mis-bg)] px-2 py-0.5 text-xs text-[var(--mis)]">{mis}</span> : <span className="text-[var(--muted)]">–</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-[var(--muted)]">Green: solid (produced unaided). Blue: landed. Click a student for their full map, mix-ups, tests and a password reset.</p>
      </section>
    </div>
  );
}
