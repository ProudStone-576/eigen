import { STATUS_STYLE } from "@/components/ConceptMap";
import { requireTeacher } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { allNodes } from "@/lib/content";
import type { Status } from "@/lib/learning/rules";

export const metadata = { title: "Students" };

/** Every student x every concept, plus the misconceptions they currently hold. */
export default async function TeacherPage() {
  await requireTeacher();
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, xp: true, streakDays: true, lastActiveOn: true, progress: true },
  });
  const misconceptionText = (nodeId: string, id: string | null) =>
    id ? (allNodes.find((n) => n.id === nodeId)?.misconceptions[id] ?? id) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Students</h1>
      {students.length === 0 ? (
        <p className="card">No students yet. Share the invite code from your .env so they can join.</p>
      ) : (
        <div className="card overflow-x-auto p-0!">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)]">
                <th className="p-3">Student</th>
                <th className="p-3">XP</th>
                <th className="p-3">Streak</th>
                <th className="p-3">Last active</th>
                {allNodes.map((n) => (
                  <th key={n.id} className="p-3 whitespace-nowrap font-medium" title={n.title}>
                    {n.title.split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const byNode = new Map(s.progress.map((p) => [p.nodeId, p]));
                return (
                  <tr key={s.id} className="border-t border-[var(--border)]">
                    <td className="p-3">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-[var(--muted)]">{s.email}</p>
                    </td>
                    <td className="p-3">{s.xp}</td>
                    <td className="p-3">{s.streakDays}</td>
                    <td className="p-3 whitespace-nowrap">{s.lastActiveOn ?? "never"}</td>
                    {allNodes.map((n) => {
                      const p = byNode.get(n.id);
                      const st: Status = p?.status ?? "UNKNOWN";
                      const style = STATUS_STYLE[st];
                      return (
                        <td key={n.id} className="p-3">
                          <span
                            title={misconceptionText(n.id, p?.misconceptionId ?? null) ?? style.label}
                            className="inline-block rounded-md px-2 py-0.5 text-xs whitespace-nowrap"
                            style={{ background: style.fill, color: style.stroke, border: `1px solid ${style.stroke}` }}
                          >
                            {st === "UNKNOWN" ? "·" : style.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-sm text-[var(--muted)]">Hover a red &ldquo;Untangle&rdquo; badge to see the misconception the student holds.</p>
    </div>
  );
}
