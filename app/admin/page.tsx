import Link from "next/link";
import { requireAdmin } from "@/lib/auth/context";
import { prisma } from "@/lib/db";
import { auditLabel } from "@/lib/auditLabels";
import { orgOverview } from "@/lib/org/stats";

export const metadata = { title: "Overview" };

const fmt = (d: Date) => d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Figure({ n, label, note }: { n: string | number; label: string; note?: string }) {
  return (
    <div className="border-t border-[var(--fg)] pt-3">
      <p className="stat-num">{n}</p>
      <p className="tb-label mt-1">{label}</p>
      {note && <p className="text-xs text-[var(--muted)] mt-1">{note}</p>}
    </div>
  );
}

export default async function AdminOverview() {
  const ctx = await requireAdmin();
  const o = await orgOverview(ctx.org.id);
  const actors = await prisma.user.findMany({ where: { id: { in: o.recent.flatMap((e) => (e.actorId ? [e.actorId] : [])) } }, select: { id: true, name: true } });
  const nameOf = (id: string | null) => actors.find((a) => a.id === id)?.name ?? "System";
  const peak = Math.max(1, ...o.days.map((d) => d.answers));
  const total14 = o.days.reduce((s, d) => s + d.answers, 0);

  return (
    <div className="space-y-12">
      <section className="grid gap-6 grid-cols-2 md:grid-cols-5">
        <Figure n={o.students} label="Students" note={o.seatLimit !== null ? `${Math.max(0, o.seatLimit - o.students)} of ${o.seatLimit} seats free` : "No seat limit"} />
        <Figure n={o.teachers} label="Teachers" />
        <Figure n={o.admins} label="Admins & owners" />
        <Figure n={o.classes} label="Classes" />
        <Figure n={o.active7} label="Active this week" note={o.students ? `${Math.round((100 * o.active7) / o.students)}% of students` : undefined} />
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-semibold">Answers, last 14 days</h2>
          <span className="text-sm text-[var(--muted)] tabular-nums">{total14.toLocaleString()} in total</span>
        </div>
        <table className="ledger">
          <thead>
            <tr>
              <th>Day (UTC)</th>
              <th className="num">Answers</th>
              <th className="num">Students</th>
              <th className="w-1/2" />
            </tr>
          </thead>
          <tbody>
            {o.days.map((d) => (
              <tr key={d.day}>
                <td className="tabular-nums">{d.day}</td>
                <td className="num">{d.answers}</td>
                <td className="num">{d.learners}</td>
                <td className="align-middle">
                  <div className="meter">
                    <span style={{ width: `${(100 * d.answers) / peak}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-semibold">Recent activity</h2>
          <Link href="/admin/audit" className="text-sm text-[var(--accent)] hover:underline underline-offset-4">
            Full audit log
          </Link>
        </div>
        {o.recent.length === 0 ? (
          <p className="text-[var(--muted)]">Nothing recorded yet.</p>
        ) : (
          <table className="ledger">
            <tbody>
              {o.recent.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap text-[var(--muted)] tabular-nums">{fmt(e.createdAt)}</td>
                  <td className="font-medium">{nameOf(e.actorId)}</td>
                  <td>{auditLabel(e.action)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
