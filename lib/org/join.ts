import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { atLeast, type OrgRole } from "@/lib/auth/permissions";
import { hashToken, invitationState, normaliseCode, type InvitationState } from "./codes";

/**
 * How people get into an organisation: a class join code (students), an
 * invitation link (any role the inviter may grant), or the legacy invite code
 * from the environment, which leads into the default organisation's first class.
 */

export type JoinTarget = { orgId: string; orgName: string; role: OrgRole; classroomId: string | null; className: string | null; invitationId: string | null };

const DEFAULT_ORG = "org_default";

/** A class join code (or the legacy environment invite code) to where it leads. */
export async function targetForCode(input: string): Promise<JoinTarget | null> {
  const code = normaliseCode(input);
  if (code.length < 4) return null;
  const cls = await prisma.classroom.findUnique({ where: { joinCode: code }, include: { org: { select: { name: true, archived: true } } } });
  if (cls && !cls.archived && !cls.org.archived) {
    return { orgId: cls.orgId, orgName: cls.org.name, role: "STUDENT", classroomId: cls.id, className: cls.name, invitationId: null };
  }
  const legacy = process.env.INVITE_CODE;
  if (legacy && input.trim() === legacy) {
    const first = await prisma.classroom.findFirst({ where: { orgId: DEFAULT_ORG, archived: false }, orderBy: { createdAt: "asc" }, include: { org: { select: { name: true } } } });
    if (first) return { orgId: first.orgId, orgName: first.org.name, role: "STUDENT", classroomId: first.id, className: first.name, invitationId: null };
  }
  return null;
}

export type InvitationView = { state: InvitationState; target: JoinTarget };

export async function targetForInvitation(token: string): Promise<InvitationView | null> {
  if (!token || token.length > 100) return null;
  const inv = await prisma.invitation.findUnique({ where: { tokenHash: hashToken(token) }, include: { org: { select: { name: true, archived: true } } } });
  if (!inv || inv.org.archived) return null;
  const cls = inv.classroomId ? await prisma.classroom.findFirst({ where: { id: inv.classroomId, orgId: inv.orgId, archived: false } }) : null;
  return {
    state: invitationState(inv),
    target: { orgId: inv.orgId, orgName: inv.org.name, role: inv.role, classroomId: cls?.id ?? null, className: cls?.name ?? null, invitationId: inv.id },
  };
}

export type JoinOutcome = { ok: true } | { ok: false; error: string };

/**
 * Put a user into the target organisation (and class), inside a transaction.
 * An existing membership is only ever raised, never lowered. Student seats are
 * checked against the organisation's limit, and an invitation's use is counted
 * with a guarded update, so a single-use link can't be used twice concurrently.
 */
export async function applyJoin(tx: Prisma.TransactionClient, userId: string, t: JoinTarget, opts: { bootstrapOwner?: boolean } = {}): Promise<JoinOutcome> {
  if (t.invitationId) {
    const used = await tx.invitation.updateMany({
      where: { id: t.invitationId, revokedAt: null, expiresAt: { gt: new Date() }, uses: { lt: tx.invitation.fields.maxUses } },
      data: { uses: { increment: 1 } },
    });
    if (used.count === 0) return { ok: false, error: "This invitation has expired or has already been used." };
  }

  const role: OrgRole = opts.bootstrapOwner ? "OWNER" : t.role;
  const existing = await tx.membership.findUnique({ where: { orgId_userId: { orgId: t.orgId, userId } } });
  if (!existing) {
    if (role === "STUDENT") {
      const org = await tx.organization.findUniqueOrThrow({ where: { id: t.orgId }, select: { seatLimit: true } });
      if (org.seatLimit !== null) {
        const used = await tx.membership.count({ where: { orgId: t.orgId, role: "STUDENT" } });
        if (used >= org.seatLimit) return { ok: false, error: `${t.orgName} has no free student seats. Ask its administrator.` };
      }
    }
    await tx.membership.create({ data: { orgId: t.orgId, userId, role } });
  } else if (!atLeast(existing.role, role)) {
    await tx.membership.update({ where: { id: existing.id }, data: { role } });
  }

  if (t.classroomId) {
    const classRole = atLeast(role, "TEACHER") ? "TEACHER" : "STUDENT";
    await tx.enrollment.upsert({
      where: { classroomId_userId: { classroomId: t.classroomId, userId } },
      create: { classroomId: t.classroomId, userId, role: classRole },
      update: {},
    });
  }
  return { ok: true };
}

/** Whether the bootstrap teacher email should become owner of the default organisation. */
export const isBootstrapOwner = (email: string, t: JoinTarget) => {
  const boot = process.env.TEACHER_EMAIL?.trim().toLowerCase();
  return !!boot && email === boot && t.orgId === DEFAULT_ORG;
};
