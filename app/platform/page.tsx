import { requirePlatformAdmin } from "@/lib/auth/context";
import { prisma } from "@/lib/db";
import { ArchiveOrg, NewOrganization, SeatLimit } from "./PlatformControls";

export const metadata = { title: "Platform" };

/** The operator's view: every organisation, its size and seats, and onboarding new ones. */
export default async function PlatformPage() {
  await requirePlatformAdmin();
  const orgs = await prisma.organization.findMany({
    orderBy: [{ archived: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { classrooms: true } }, memberships: { select: { role: true } } },
  });
  const since = new Date(Date.now() - 7 * 86_400_000);
  const active = await prisma.$queryRaw<{ orgId: string; n: number }[]>`
    SELECT m."orgId", count(DISTINCT a."userId")::int AS n
    FROM "Attempt" a JOIN "Membership" m ON m."userId" = a."userId"
    WHERE a."createdAt" >= ${since}
    GROUP BY m."orgId"`;
  return (
    <div className="space-y-8">
      <header className="tb-rule pt-6">
        <p className="tb-label">Platform operator</p>
        <h1 className="font-serif text-3xl font-semibold mt-1">Organisations</h1>
      </header>
      <NewOrganization />
      <div className="overflow-x-auto">
        <table className="ledger">
          <thead>
            <tr>
              <th>Organisation</th>
              <th className="num">Students</th>
              <th className="num">Staff</th>
              <th className="num">Classes</th>
              <th className="num">Active 7d</th>
              <th>Seat limit</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => {
              const students = o.memberships.filter((m) => m.role === "STUDENT").length;
              return (
                <tr key={o.id} className={o.archived ? "opacity-60" : ""}>
                  <td>
                    <span className="font-medium">{o.name}</span>
                    {o.archived && <span className="text-[var(--muted)]"> (suspended)</span>}
                    <p className="text-xs text-[var(--muted)]">{o.slug}</p>
                  </td>
                  <td className="num">{students}</td>
                  <td className="num">{o.memberships.length - students}</td>
                  <td className="num">{o._count.classrooms}</td>
                  <td className="num">{active.find((a) => a.orgId === o.id)?.n ?? 0}</td>
                  <td className="w-56">
                    <SeatLimit orgId={o.id} value={o.seatLimit} />
                  </td>
                  <td className="tabular-nums text-[var(--muted)] whitespace-nowrap">{o.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="text-right">
                    <ArchiveOrg orgId={o.id} archived={o.archived} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[var(--muted)] max-w-2xl">
        Suspending an organisation stops its members from using it (their accounts remain). New organisations start with one class and a single-use owner invitation.
      </p>
    </div>
  );
}
