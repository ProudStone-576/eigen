import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { liveMisconceptions, scopeTitle, statusCounts, trackProgress } from "@/lib/learning/summary";
import { NameForm, PasswordForm } from "./AccountForms";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser({ allowPasswordChange: true });
  const since = new Date(Date.now() - 7 * 86_400_000);
  const [rows, exams, week] = await Promise.all([
    prisma.nodeProgress.findMany({ where: { userId: user.id }, select: { nodeId: true, status: true, misconceptionId: true } }),
    prisma.examRecord.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.attempt.groupBy({ by: ["correct"], where: { userId: user.id, createdAt: { gte: since } }, _count: true }),
  ]);
  const counts = statusCounts(rows);
  const tracks = trackProgress(rows);
  const mis = liveMisconceptions(rows);
  const right = week.find((w) => w.correct)?._count ?? 0;
  const answered = week.reduce((s, w) => s + w._count, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {user.mustChangePassword && (
        <p className="feedback feedback-warn">Your teacher reset your password. Choose a new one below to keep going.</p>
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
        <p className="text-[var(--muted)]">{user.email}</p>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { n: counts.solid, label: "solid" },
          { n: counts.landed, label: "landed" },
          { n: user.streakDays, label: "day streak" },
          { n: answered ? `${Math.round((100 * right) / answered)}%` : "–", label: `right this week (${answered} answers)` },
        ].map((s) => (
          <div key={s.label} className="card p-4! text-center">
            <p className="text-3xl font-semibold tabular-nums">{s.n}</p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">Progress by track</h2>
        {tracks.map((t) => (
          <div key={t.track}>
            <div className="flex justify-between text-sm">
              <span>{t.track}</span>
              <span className="text-[var(--muted)] tabular-nums">
                {t.done} of {t.total} landed · {t.solid} solid
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-[var(--border)] overflow-hidden flex">
              <div className="h-full bg-[var(--solid)]" style={{ width: `${(100 * t.solid) / t.total}%` }} />
              <div className="h-full bg-[var(--landed)]" style={{ width: `${(100 * (t.done - t.solid)) / t.total}%` }} />
            </div>
          </div>
        ))}
      </section>

      {mis.length > 0 && (
        <section className="card space-y-3">
          <h2 className="text-lg font-semibold">Mix-ups to untangle</h2>
          <ul className="space-y-2">
            {mis.map((m) => (
              <li key={m.nodeId} className="flex flex-wrap items-baseline justify-between gap-2">
                <span>
                  <span className="font-medium">{m.title}:</span> <span className="text-[var(--muted)]">{m.text}</span>
                </span>
                <Link href={`/practice/${m.nodeId}`} className="link-more text-sm">Practise</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Tests</h2>
        {exams.length === 0 ? (
          <p className="text-[var(--muted)]">
            No tests yet. <Link href="/exam" className="underline">Take one</Link>.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {exams.map((e) => (
              <li key={e.id} className="flex justify-between gap-3 py-2 text-sm">
                <span>{scopeTitle(e.scope)}</span>
                <span className="tabular-nums text-[var(--muted)]">
                  {e.score}/{e.total} ({Math.round((100 * e.score) / e.total)}%) · {e.createdAt.toLocaleDateString("en-CA")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <NameForm name={user.name} />
        <PasswordForm />
      </section>
    </div>
  );
}
