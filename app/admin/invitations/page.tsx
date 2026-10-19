import { requireAdmin } from "@/lib/auth/context";
import { assignableRoles, ROLE_LABEL } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { invitationState } from "@/lib/org/codes";
import { ActionButtonRevoke } from "./Revoke";
import { InviteForm } from "./InviteForm";

export const metadata = { title: "Invitations" };

const STATE = { active: "Active", expired: "Expired", used: "Used up", revoked: "Revoked" } as const;

export default async function InvitationsPage() {
  const ctx = await requireAdmin();
  const [invites, classes] = await Promise.all([
    prisma.invitation.findMany({ where: { orgId: ctx.org.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.classroom.findMany({ where: { orgId: ctx.org.id, archived: false }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  const people = await prisma.user.findMany({ where: { id: { in: [...new Set(invites.map((i) => i.createdById))] } }, select: { id: true, name: true } });
  const className = (id: string | null) => classes.find((c) => c.id === id)?.name ?? (id ? "(archived class)" : "–");

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-[var(--muted)]">
        Students usually join with a class code. Use invitation links for staff, or to admit a set number of people to a class. Every link expires, and you can revoke it at any time.
      </p>
      <InviteForm roles={assignableRoles(ctx.role)} classes={classes} />
      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Links</h2>
        {invites.length === 0 ? (
          <p className="text-[var(--muted)]">No invitations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Role</th>
                  <th>Class</th>
                  <th className="num">Used</th>
                  <th>Expires</th>
                  <th>State</th>
                  <th>Created by</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invites.map((i) => {
                  const state = invitationState(i);
                  return (
                    <tr key={i.id}>
                      <td>{i.label ?? <span className="text-[var(--muted)]">Untitled</span>}</td>
                      <td>{ROLE_LABEL[i.role]}</td>
                      <td>{className(i.classroomId)}</td>
                      <td className="num">
                        {i.uses}/{i.maxUses}
                      </td>
                      <td className="tabular-nums whitespace-nowrap">{i.expiresAt.toISOString().slice(0, 10)}</td>
                      <td className={state === "active" ? "" : "text-[var(--muted)]"}>{STATE[state]}</td>
                      <td className="text-[var(--muted)]">{people.find((p) => p.id === i.createdById)?.name ?? "–"}</td>
                      <td className="text-right">{state === "active" && <ActionButtonRevoke id={i.id} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
