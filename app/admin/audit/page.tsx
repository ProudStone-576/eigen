import Link from "next/link";
import { requireAdmin } from "@/lib/auth/context";
import { prisma } from "@/lib/db";
import { auditLabel } from "@/lib/auditLabels";

export const metadata = { title: "Audit log" };

const PAGE = 50;
const GROUPS = { auth: "Sign-in", member: "Members", class: "Classes", invite: "Invitations", assignment: "Assignments", question: "Questions", org: "Organisation", data: "Data" } as const;

const fmt = (d: Date) => d.toISOString().replace("T", " ").slice(0, 19);

/** Append-only log of security-relevant actions in this organisation, newest first, paged by time. */
export default async function AuditPage({ searchParams }: { searchParams: Promise<{ group?: string; before?: string }> }) {
  const ctx = await requireAdmin();
  const sp = await searchParams;
  const group = sp.group && sp.group in GROUPS ? sp.group : null;
  const before = sp.before && !Number.isNaN(Date.parse(sp.before)) ? new Date(sp.before) : null;
  const events = await prisma.auditEvent.findMany({
    where: { orgId: ctx.org.id, ...(group ? { action: { startsWith: `${group}.` } } : {}), ...(before ? { createdAt: { lt: before } } : {}) },
    orderBy: { createdAt: "desc" },
    take: PAGE + 1,
  });
  const more = events.length > PAGE;
  const shown = events.slice(0, PAGE);
  const ids = [...new Set(shown.flatMap((e) => [e.actorId, e.targetType === "user" ? e.targetId : null]).filter((x): x is string => !!x))];
  const people = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, email: true } });
  const who = (id: string | null) => {
    const p = people.find((x) => x.id === id);
    return p ? p.name : id ? "Deleted account" : "System";
  };
  const qs = (extra: Record<string, string>) => `/admin/audit?${new URLSearchParams({ ...(group ? { group } : {}), ...extra })}`;

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link href="/admin/audit" className={group ? "text-[var(--muted)] hover:text-[var(--fg)]" : "font-medium underline underline-offset-4"}>
          Everything
        </Link>
        {Object.entries(GROUPS).map(([k, label]) => (
          <Link key={k} href={`/admin/audit?group=${k}`} className={group === k ? "font-medium underline underline-offset-4" : "text-[var(--muted)] hover:text-[var(--fg)]"}>
            {label}
          </Link>
        ))}
      </nav>
      {shown.length === 0 ? (
        <p className="text-[var(--muted)]">Nothing recorded{group ? " in this category" : ""}.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="ledger">
            <thead>
              <tr>
                <th>Time (UTC)</th>
                <th>Who</th>
                <th>What</th>
                <th>Subject</th>
                <th>Details</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap tabular-nums text-[var(--muted)]">{fmt(e.createdAt)}</td>
                  <td className="font-medium">{who(e.actorId)}</td>
                  <td>{auditLabel(e.action)}</td>
                  <td className="text-[var(--muted)]">{e.targetType === "user" ? who(e.targetId) : e.targetType ? `${e.targetType}` : "–"}</td>
                  <td className="text-xs text-[var(--muted)] max-w-xs">
                    {e.meta && typeof e.meta === "object"
                      ? Object.entries(e.meta as Record<string, unknown>)
                          .filter(([, v]) => v !== null && v !== undefined && v !== "")
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(" · ")
                      : ""}
                  </td>
                  <td className="text-xs font-mono text-[var(--muted)]">{e.ip ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {more && (
        <Link href={qs({ before: shown[shown.length - 1].createdAt.toISOString() })} className="text-sm">
          Older →
        </Link>
      )}
    </div>
  );
}
