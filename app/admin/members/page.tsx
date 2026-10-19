import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/context";
import { assignableRoles, canManageMember, ORG_ROLES, ROLE_LABEL, type OrgRole } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { ResetPassword } from "@/app/teacher/students/[id]/ResetPassword";
import { RemoveMember, RoleSelect } from "../MemberControls";

export const metadata = { title: "Members" };

const PAGE = 50;

/** Everyone in the organisation, with role changes, password resets and removal. Searchable and paged. */
export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; page?: string }> }) {
  const ctx = await requireAdmin();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const role = ORG_ROLES.includes(sp.role as OrgRole) ? (sp.role as OrgRole) : null;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.MembershipWhereInput = {
    orgId: ctx.org.id,
    ...(role ? { role } : {}),
    ...(q ? { user: { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } } : {}),
  };
  const [total, members] = await Promise.all([
    prisma.membership.count({ where }),
    prisma.membership.findMany({
      where,
      orderBy: [{ role: "asc" }, { user: { name: "asc" } }],
      skip: (page - 1) * PAGE,
      take: PAGE,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            lastActiveOn: true,
            mustChangePassword: true,
            enrollments: { where: { classroom: { orgId: ctx.org.id, archived: false } }, select: { role: true, classroom: { select: { id: true, name: true } } } },
          },
        },
      },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const href = (p: number) => `/admin/members?${new URLSearchParams({ ...(q ? { q } : {}), ...(role ? { role } : {}), page: String(p) })}`;
  const assignable = assignableRoles(ctx.role);

  return (
    <div className="space-y-6">
      <form className="flex flex-wrap items-end gap-3" action="/admin/members">
        <label className="flex-1 min-w-56">
          <span className="tb-label block mb-1">Search</span>
          <input name="q" defaultValue={q} placeholder="Name or email" className="field w-full text-sm" />
        </label>
        <label>
          <span className="tb-label block mb-1">Role</span>
          <select name="role" defaultValue={role ?? ""} className="field text-sm">
            <option value="">All roles</option>
            {ORG_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </label>
        <button className="btn-ghost">Filter</button>
        <Link href="/admin/invitations" className="btn ml-auto">
          Invite people
        </Link>
      </form>

      <p className="text-sm text-[var(--muted)] tabular-nums">
        {total} member{total === 1 ? "" : "s"}
        {q || role ? " match" : ""}
      </p>

      <div className="overflow-x-auto">
        <table className="ledger">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Classes</th>
              <th>Last active</th>
              <th>Joined</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const self = m.userId === ctx.user.id;
              const manage = canManageMember(ctx.role, m.role, self);
              return (
                <tr key={m.id}>
                  <td>
                    {m.role === "STUDENT" ? (
                      <Link href={`/teacher/students/${m.userId}`} className="font-medium hover:text-[var(--accent)]">
                        {m.user.name}
                      </Link>
                    ) : (
                      <span className="font-medium">{m.user.name}</span>
                    )}
                    {self && <span className="text-[var(--muted)]"> (you)</span>}
                    <p className="text-xs text-[var(--muted)]">{m.user.email}</p>
                  </td>
                  <td>{manage ? <RoleSelect userId={m.userId} role={m.role} options={assignable} /> : ROLE_LABEL[m.role]}</td>
                  <td className="text-[var(--muted)]">
                    {m.user.enrollments.length === 0
                      ? "–"
                      : m.user.enrollments.map((e, i) => (
                          <span key={e.classroom.id}>
                            {i > 0 && ", "}
                            <Link href={`/teacher/classes/${e.classroom.id}`} className="hover:text-[var(--fg)]">
                              {e.classroom.name}
                            </Link>
                            {e.role === "TEACHER" && " (teaches)"}
                          </span>
                        ))}
                  </td>
                  <td className="whitespace-nowrap">{m.user.lastActiveOn ?? "never"}</td>
                  <td className="whitespace-nowrap tabular-nums text-[var(--muted)]">{m.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="text-right space-y-2">
                    {manage && (
                      <>
                        <ResetPassword studentId={m.userId} name={m.user.name} pending={m.user.mustChangePassword} />
                        <RemoveMember userId={m.userId} />
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="flex items-center gap-4 text-sm">
          {page > 1 && <Link href={href(page - 1)}>← Previous</Link>}
          <span className="text-[var(--muted)] tabular-nums">
            Page {page} of {pages}
          </span>
          {page < pages && <Link href={href(page + 1)}>Next →</Link>}
        </nav>
      )}
    </div>
  );
}
