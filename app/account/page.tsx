import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { currentContext } from "@/lib/auth/context";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { liveMisconceptions, scopeTitle, statusCounts, trackProgress } from "@/lib/learning/summary";
import { switchOrg } from "../actions";
import { DeleteAccountForm, NameForm, PasswordForm } from "./AccountForms";

export const metadata = { title: "Account" };

function Figure({ n, label }: { n: string | number; label: string }) {
  return (
    <div className="border-t border-[var(--fg)] pt-3">
      <p className="stat-num">{n}</p>
      <p className="tb-label mt-1">{label}</p>
    </div>
  );
}

export default async function AccountPage() {
  const user = await requireUser({ allowPasswordChange: true });
  const ctx = await currentContext();
  const since = new Date(Date.now() - 7 * 86_400_000);
  const [rows, exams, week, classes] = await Promise.all([
    prisma.nodeProgress.findMany({ where: { userId: user.id }, select: { nodeId: true, status: true, misconceptionId: true } }),
    prisma.examRecord.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.attempt.groupBy({ by: ["correct"], where: { userId: user.id, createdAt: { gte: since } }, _count: true }),
    prisma.enrollment.findMany({ where: { userId: user.id, classroom: { archived: false, org: { archived: false } } }, include: { classroom: { select: { name: true, orgId: true } } } }),
  ]);
  const counts = statusCounts(rows);
  const tracks = trackProgress(rows);
  const mis = liveMisconceptions(rows);
  const right = week.find((w) => w.correct)?._count ?? 0;
  const answered = week.reduce((s, w) => s + w._count, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {user.mustChangePassword && <p className="feedback feedback-warn">Your password was reset. Choose a new one below to keep going.</p>}
      <header className="tb-rule pt-6">
        <h1 className="font-serif text-3xl font-semibold">{user.name}</h1>
        <p className="text-[var(--muted)]">{user.email}</p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Figure n={counts.solid} label="Mastered" />
        <Figure n={counts.landed} label="Learned" />
        <Figure n={user.streakDays} label="Day streak" />
        <Figure n={answered ? `${Math.round((100 * right) / answered)}%` : "–"} label={`Right this week (${answered})`} />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Progress by part</h2>
        <table className="ledger">
          <tbody>
            {tracks.map((t) => (
              <tr key={t.track}>
                <td>{t.track}</td>
                <td className="num">
                  {t.done}/{t.total} learned · {t.solid} mastered
                </td>
                <td className="w-2/5 align-middle">
                  <div className="meter">
                    <span style={{ width: `${(100 * t.done) / t.total}%`, background: "var(--rule)" }} />
                    <span style={{ width: `${(100 * t.solid) / t.total}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {mis.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">To revisit</h2>
          <table className="ledger">
            <tbody>
              {mis.map((m) => (
                <tr key={m.nodeId}>
                  <td>
                    <span className="font-medium">{m.title}.</span> <span className="text-[var(--muted)]">{m.text}</span>
                  </td>
                  <td className="text-right">
                    <Link href={`/practice/${m.nodeId}`} className="text-sm text-[var(--accent)] hover:underline underline-offset-4">
                      Practise
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Tests</h2>
        {exams.length === 0 ? (
          <p className="text-[var(--muted)]">
            None yet. <Link href="/exam" className="underline">Take one</Link>.
          </p>
        ) : (
          <table className="ledger">
            <tbody>
              {exams.map((e) => (
                <tr key={e.id}>
                  <td>{scopeTitle(e.scope)}</td>
                  <td className="num">
                    {e.score}/{e.total} ({Math.round((100 * e.score) / e.total)}%)
                  </td>
                  <td className="num text-[var(--muted)]">{e.createdAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-semibold">Organisations and classes</h2>
          <Link href="/join" className="text-sm text-[var(--accent)] hover:underline underline-offset-4">
            Join a class
          </Link>
        </div>
        {!ctx || ctx.memberships.length === 0 ? (
          <p className="text-[var(--muted)]">You aren&apos;t in an organisation. Join a class with the code your teacher gives you.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Organisation</th>
                <th>Role</th>
                <th>Classes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ctx.memberships.map((m) => (
                <tr key={m.orgId}>
                  <td className="font-medium">{m.orgName}</td>
                  <td>{ROLE_LABEL[m.role]}</td>
                  <td className="text-[var(--muted)]">
                    {classes
                      .filter((c) => c.classroom.orgId === m.orgId)
                      .map((c) => c.classroom.name)
                      .join(", ") || "–"}
                  </td>
                  <td className="text-right">
                    {ctx.org?.id === m.orgId ? (
                      <span className="text-sm text-[var(--muted)]">Current</span>
                    ) : (
                      <form action={switchOrg}>
                        <input type="hidden" name="orgId" value={m.orgId} />
                        <button className="text-sm text-[var(--accent)] hover:underline underline-offset-4">Switch to</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-10 tb-rule pt-8">
        <NameForm name={user.name} />
        <PasswordForm />
      </section>

      <section className="tb-rule pt-8 grid md:grid-cols-2 gap-10">
        <div className="space-y-2">
          <p className="tb-label">Your data</p>
          <p className="text-sm text-[var(--muted)]">Download everything Eigen holds about you: profile, memberships, progress, every answer and test, as JSON.</p>
          <a href="/api/export/me" className="btn-ghost">
            Download my data
          </a>
        </div>
        <div className="space-y-2">
          <p className="tb-label">Delete account</p>
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
