import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/context";
import { canManageClass, isAdmin, isStaff } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { formatCode } from "@/lib/org/codes";
import { siteOrigin } from "@/lib/http/origin";
import { assignmentProgress, classMisconceptions, liveMisconceptions, statusCounts, trackProgress } from "@/lib/learning/summary";
import { CopyButton } from "@/components/console/Controls";
import { AddTeacher, ArchiveClass, RemoveFromClass, RenameClass, RotateCode } from "../../ClassActions";

export const metadata = { title: "Class" };

const fmtDate = (d: Date) => d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });

/** One class at a glance: join code, assignments, the mix-ups most students hold, and every student's progress. */
export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireStaff();
  const { id } = await params;
  const cls = await prisma.classroom.findFirst({ where: { id, orgId: ctx.org.id } });
  if (!cls || !canManageClass(ctx.role, ctx.teaches.includes(cls.id))) notFound();

  const [enrollments, assignments, orgStaff] = await Promise.all([
    prisma.enrollment.findMany({
      where: { classroomId: cls.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, streakDays: true, lastActiveOn: true, progress: { select: { nodeId: true, status: true, misconceptionId: true } } },
        },
      },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.assignment.findMany({ where: { classroomId: cls.id, archived: false }, orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }] }),
    isAdmin(ctx.role) ? prisma.membership.findMany({ where: { orgId: ctx.org.id, role: { in: ["OWNER", "ADMIN", "TEACHER"] } }, include: { user: { select: { id: true, name: true } } } }) : Promise.resolve([]),
  ]);
  const students = enrollments.filter((e) => e.role === "STUDENT").map((e) => e.user);
  const teachers = enrollments.filter((e) => e.role === "TEACHER").map((e) => e.user);
  const exams = await prisma.examRecord.findMany({ where: { userId: { in: students.map((s) => s.id) } }, select: { userId: true, scope: true, createdAt: true, score: true, total: true } });
  const examsBy = (uid: string) => exams.filter((e) => e.userId === uid);
  const mixups = classMisconceptions(students.map((s) => s.progress)).slice(0, 8);
  const tracks = trackProgress([]).map((t) => t.track);
  const now = new Date();
  const joinUrl = `${await siteOrigin()}/signup?code=${cls.joinCode}`;
  const coTeacherCandidates = orgStaff
    .filter((m) => isStaff(m.role) && !teachers.some((t) => t.id === m.user.id))
    .map((m) => ({ id: m.user.id, name: m.user.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-10">
      <div>
        <Link href="/teacher" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
          ← Classes
        </Link>
        <header className="tb-rule mt-3 pt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="tb-label">{ctx.org.name}</p>
            <h1 className="font-serif text-3xl font-semibold mt-1">
              {cls.name}
              {cls.archived && <span className="ml-3 text-base font-normal text-[var(--muted)]">(archived)</span>}
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              {students.length} student{students.length === 1 ? "" : "s"} · taught by {teachers.map((t) => t.name).join(", ") || "nobody yet"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/teacher/classes/${cls.id}/analytics`} className="btn-ghost">
              Class report
            </Link>
            <Link href={`/teacher/assignments/new?class=${cls.id}`} className="btn">
              New assignment
            </Link>
          </div>
        </header>
      </div>

      <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="tb-box">
          <p className="tb-label mb-2">Join code</p>
          <p className="flex items-center gap-4">
            <span className="code-chip text-2xl">{formatCode(cls.joinCode)}</span>
            <CopyButton text={formatCode(cls.joinCode)} />
            <RotateCode id={cls.id} />
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Students sign up with this code, or open the join link. Existing students enter it under Account → Join a class.
          </p>
          <p className="mt-2 text-sm flex flex-wrap items-center gap-3">
            <span className="truncate max-w-full font-mono text-xs">{joinUrl}</span>
            <CopyButton text={joinUrl} label="Copy link" />
          </p>
        </div>
        <div className="space-y-4">
          <RenameClass id={cls.id} name={cls.name} />
          {isAdmin(ctx.role) && <AddTeacher classroomId={cls.id} candidates={coTeacherCandidates} />}
          <ArchiveClass id={cls.id} archived={cls.archived} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-[var(--muted)]">None set. Choose concepts to land, optionally a unit test, and a due date; students see it at the top of their syllabus.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Due</th>
                <th className="num">Done</th>
                <th className="w-1/4">Progress</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const done = students.filter((s) => assignmentProgress(a, s.progress, examsBy(s.id)).complete).length;
                const pct = students.length ? (100 * done) / students.length : 0;
                return (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/teacher/assignments/${a.id}`} className="font-medium hover:text-[var(--accent)]">
                        {a.title}
                      </Link>
                      <p className="text-xs text-[var(--muted)]">
                        {a.nodeIds.length} concept{a.nodeIds.length === 1 ? "" : "s"}
                        {a.unitId ? " + unit test" : ""}
                      </p>
                    </td>
                    <td className={a.dueAt && a.dueAt < now ? "text-[var(--mis)]" : ""}>{a.dueAt ? `${fmtDate(a.dueAt)}${a.dueAt < now ? " (past)" : ""}` : "–"}</td>
                    <td className="num">
                      {done}/{students.length}
                    </td>
                    <td className="align-middle">
                      <div className="meter">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {mixups.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Misconceptions held in this class</h2>
          <table className="ledger">
            <thead>
              <tr>
                <th>Section</th>
                <th>Misconception</th>
                <th className="num">Students</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {mixups.map((m) => (
                <tr key={`${m.nodeId}${m.text}`}>
                  <td className="font-medium">{m.title}</td>
                  <td className="text-[var(--muted)]">{m.text}</td>
                  <td className="num text-[var(--mis)]">{m.students}</td>
                  <td className="text-right">
                    <Link href={`/teacher/content/${m.nodeId}`} className="text-sm text-[var(--accent)] hover:underline underline-offset-4">
                      Write a question
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Register</h2>
        {students.length === 0 ? (
          <p className="text-[var(--muted)]">No students yet. Share the join code above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Last active</th>
                  <th className="num">Streak</th>
                  <th className="num">Mastered</th>
                  {tracks.map((t) => (
                    <th key={t}>{t}</th>
                  ))}
                  <th className="num">Revisit</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const c = statusCounts(s.progress);
                  const tp = trackProgress(s.progress);
                  const mis = liveMisconceptions(s.progress).length;
                  return (
                    <tr key={s.id}>
                      <td>
                        <Link href={`/teacher/students/${s.id}`} className="font-medium hover:text-[var(--accent)]">
                          {s.name}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">{s.email}</p>
                      </td>
                      <td className="whitespace-nowrap">{s.lastActiveOn ?? "never"}</td>
                      <td className="num">{s.streakDays}</td>
                      <td className="num">
                        {c.solid}/{c.total}
                      </td>
                      {tp.map((t) => (
                        <td key={t.track} className="min-w-24 align-middle" title={`${t.done} of ${t.total} learned, ${t.solid} mastered`}>
                          <div className="meter">
                            <span style={{ width: `${(100 * t.done) / t.total}%` }} />
                          </div>
                          <p className="mt-1 text-[11px] text-[var(--muted)] tabular-nums">
                            {t.done}/{t.total}
                          </p>
                        </td>
                      ))}
                      <td className={`num ${mis ? "text-[var(--mis)]" : "text-[var(--muted)]"}`}>{mis || "–"}</td>
                      <td className="text-right">
                        <RemoveFromClass classroomId={cls.id} userId={s.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-[var(--muted)]">Mastered: produced unaided. Bars count sections learned or mastered. Open a student for their full record and a password reset.</p>
      </section>
    </div>
  );
}
