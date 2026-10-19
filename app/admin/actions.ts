"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { contextFor, type OrgContext } from "@/lib/auth/context";
import { assignableRoles, canManageMember, ORG_ROLES, roleChangeError, type OrgAction, type OrgRole } from "@/lib/auth/permissions";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rateLimit";
import { hashToken, newToken } from "@/lib/org/codes";
import { siteOrigin } from "@/lib/http/origin";

type Result = { ok: true } | { ok: false; error: string };
const DENIED = { ok: false as const, error: "You don't have permission to do that." };

async function admin(action: OrgAction): Promise<OrgContext | null> {
  const ctx = await contextFor(action);
  if (!ctx) return null;
  return (await rateLimit("adminUser", ctx.user.id)).ok ? ctx : null;
}

const roleSchema = z.enum(ORG_ROLES as [OrgRole, ...OrgRole[]]);

export async function changeMemberRole(input: { userId: string; role: string }): Promise<Result> {
  const ctx = await admin("members.manage");
  if (!ctx) return DENIED;
  const next = roleSchema.safeParse(input.role);
  if (!next.success) return { ok: false, error: "Unknown role." };
  const m = await prisma.membership.findUnique({ where: { orgId_userId: { orgId: ctx.org.id, userId: String(input.userId) } } });
  if (!m) return { ok: false, error: "Member not found." };
  if (m.role === next.data) return { ok: true };
  const owners = await prisma.membership.count({ where: { orgId: ctx.org.id, role: "OWNER" } });
  const error = roleChangeError({ actor: ctx.role, target: m.role, next: next.data, self: m.userId === ctx.user.id, owners });
  if (error) return { ok: false, error };
  await prisma.$transaction(async (tx) => {
    await tx.membership.update({ where: { id: m.id }, data: { role: next.data } });
    // Someone demoted to student stops teaching their classes.
    if (next.data === "STUDENT") await tx.enrollment.deleteMany({ where: { userId: m.userId, role: "TEACHER", classroom: { orgId: ctx.org.id } } });
  });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "member.role_changed", targetType: "user", targetId: m.userId, meta: { from: m.role, to: next.data } });
  revalidatePath("/admin/members");
  return { ok: true };
}

/** Remove someone from the organisation: their classes here, and its sessions. Their account and learning record remain theirs. */
export async function removeMember(input: { userId: string }): Promise<Result> {
  const ctx = await admin("members.manage");
  if (!ctx) return DENIED;
  const m = await prisma.membership.findUnique({ where: { orgId_userId: { orgId: ctx.org.id, userId: String(input.userId) } } });
  if (!m) return { ok: false, error: "Member not found." };
  if (!canManageMember(ctx.role, m.role, m.userId === ctx.user.id)) return DENIED;
  if (m.role === "OWNER" && (await prisma.membership.count({ where: { orgId: ctx.org.id, role: "OWNER" } })) <= 1) {
    return { ok: false, error: "An organisation needs at least one owner." };
  }
  await prisma.$transaction([
    prisma.enrollment.deleteMany({ where: { userId: m.userId, classroom: { orgId: ctx.org.id } } }),
    prisma.membership.delete({ where: { id: m.id } }),
    prisma.session.updateMany({ where: { userId: m.userId, orgId: ctx.org.id }, data: { orgId: null } }),
  ]);
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "member.removed", targetType: "user", targetId: m.userId, meta: { role: m.role } });
  revalidatePath("/admin/members");
  return { ok: true };
}

const inviteSchema = z.object({
  role: roleSchema,
  classroomId: z.string().nullable(),
  label: z.string().trim().max(80).nullable(),
  maxUses: z.number().int().min(1).max(1000),
  days: z.number().int().min(1).max(90),
});

/** Create an invitation link. The URL is returned once; only its hash is stored. */
export async function createInvitation(input: { role: string; classroomId: string | null; label: string | null; maxUses: number; days: number }): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ctx = await admin("invites.manage");
  if (!ctx) return DENIED;
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Check the invitation settings." };
  const { role, label, maxUses, days } = parsed.data;
  if (!assignableRoles(ctx.role).includes(role)) return { ok: false, error: "You can't invite people with that role." };
  let classroomId: string | null = null;
  if (parsed.data.classroomId) {
    const cls = await prisma.classroom.findFirst({ where: { id: parsed.data.classroomId, orgId: ctx.org.id, archived: false } });
    if (!cls) return { ok: false, error: "Choose a current class." };
    classroomId = cls.id;
  }
  const token = newToken();
  const inv = await prisma.invitation.create({
    data: { orgId: ctx.org.id, classroomId, role, label: label || null, maxUses, expiresAt: new Date(Date.now() + days * 86_400_000), tokenHash: hashToken(token), createdById: ctx.user.id },
  });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "invite.created", targetType: "invitation", targetId: inv.id, meta: { role, maxUses, days } });
  revalidatePath("/admin/invitations");
  return { ok: true, url: `${await siteOrigin()}/join/${token}` };
}

export async function revokeInvitation(input: { id: string }): Promise<Result> {
  const ctx = await admin("invites.manage");
  if (!ctx) return DENIED;
  const inv = await prisma.invitation.findFirst({ where: { id: String(input.id), orgId: ctx.org.id } });
  if (!inv) return { ok: false, error: "Invitation not found." };
  if (!inv.revokedAt) await prisma.invitation.update({ where: { id: inv.id }, data: { revokedAt: new Date() } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "invite.revoked", targetType: "invitation", targetId: inv.id });
  revalidatePath("/admin/invitations");
  return { ok: true };
}

export async function renameOrg(input: { name: string }): Promise<Result> {
  const ctx = await admin("org.settings");
  if (!ctx) return DENIED;
  const name = z.string().trim().min(2, "Enter the organisation's name.").max(80).safeParse(input.name);
  if (!name.success) return { ok: false, error: name.error.issues[0].message };
  await prisma.organization.update({ where: { id: ctx.org.id }, data: { name: name.data } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "org.renamed", targetType: "org", targetId: ctx.org.id, meta: { from: ctx.org.name, to: name.data } });
  revalidatePath("/", "layout");
  return { ok: true };
}
