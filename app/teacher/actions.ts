"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { destroyAllSessions } from "@/lib/auth/session";
import { contextFor, currentContext, type OrgContext } from "@/lib/auth/context";
import { canManageClass, canResetPassword, isAdmin, isStaff } from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/password";
import { temporaryPassword } from "@/lib/auth/lockout";
import { course, getNode } from "@/lib/content";
import { toItem } from "@/lib/content/customSchema";
import { newJoinCode } from "@/lib/org/codes";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rateLimit";

export type EditorResult = { ok: true; id: string } | { ok: false; error: string };
export type ActionResult = { ok: true; id: string } | { ok: false; error: string };

const DENIED = { ok: false as const, error: "You don't have permission to do that." };

/** Staff context, rate-limited for writes. */
async function staff(): Promise<OrgContext | null> {
  const ctx = await currentContext();
  if (!ctx?.org || !ctx.role || ctx.user.mustChangePassword || !isStaff(ctx.role)) return null;
  const limited = await rateLimit("adminUser", ctx.user.id);
  return limited.ok ? (ctx as OrgContext) : null;
}

/** The class, if it is in the actor's organisation and they may manage it. */
async function managedClass(ctx: OrgContext, classroomId: string) {
  const cls = await prisma.classroom.findFirst({ where: { id: classroomId, orgId: ctx.org.id } });
  return cls && canManageClass(ctx.role, ctx.teaches.includes(cls.id)) ? cls : null;
}

// ---------------------------------------------------------------- questions

const flags = z.object({ inPractice: z.boolean(), inReview: z.boolean() });

export async function saveCustomItem(input: { nodeId: string; id?: string; data: unknown; inPractice: boolean; inReview: boolean }): Promise<EditorResult> {
  const ctx = await contextFor("content.edit");
  if (!ctx) return { ok: false, error: "Only teachers can edit questions." };
  const node = getNode(String(input.nodeId));
  if (!node) return { ok: false, error: "Unknown concept." };
  const f = flags.safeParse(input);
  if (!f.success) return { ok: false, error: "Choose where the question appears." };
  if (!f.data.inPractice && !f.data.inReview) return { ok: false, error: "Turn on practice, review, or both." };

  const checked = toItem(node, input.data, "preview");
  if ("error" in checked) return { ok: false, error: checked.error };

  const data = input.data as Prisma.InputJsonValue;
  const kind = checked.item.kind;
  if (input.id) {
    const existing = await prisma.customItem.findFirst({ where: { id: String(input.id), orgId: ctx.org.id } });
    if (!existing || existing.nodeId !== node.id) return { ok: false, error: "That question no longer exists." };
    await prisma.customItem.update({ where: { id: existing.id }, data: { data, kind, ...f.data } });
    await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "question.saved", targetType: "question", targetId: existing.id, meta: { node: node.id } });
    revalidatePath(`/teacher/content/${node.id}`);
    return { ok: true, id: existing.id };
  }
  const row = await prisma.customItem.create({ data: { nodeId: node.id, orgId: ctx.org.id, authorId: ctx.user.id, kind, data, ...f.data } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "question.saved", targetType: "question", targetId: row.id, meta: { node: node.id } });
  revalidatePath(`/teacher/content/${node.id}`);
  revalidatePath("/teacher/content");
  return { ok: true, id: row.id };
}

export async function archiveCustomItem(input: { id: string; archived: boolean }): Promise<EditorResult> {
  const ctx = await contextFor("content.edit");
  if (!ctx) return { ok: false, error: "Only teachers can edit questions." };
  const row = await prisma.customItem.findFirst({ where: { id: String(input.id), orgId: ctx.org.id } });
  if (!row) return { ok: false, error: "That question no longer exists." };
  await prisma.customItem.update({ where: { id: row.id }, data: { archived: Boolean(input.archived) } });
  if (input.archived) await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "question.archived", targetType: "question", targetId: row.id });
  revalidatePath(`/teacher/content/${row.nodeId}`);
  revalidatePath("/teacher/content");
  return { ok: true, id: row.id };
}

// ---------------------------------------------------------------- people

/** Give a member a temporary password (shown once). They must change it on next login. */
export async function resetStudentPassword(input: { studentId: string }): Promise<{ ok: true; password: string } | { ok: false; error: string }> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const targetId = String(input.studentId);
  const member = await prisma.membership.findUnique({ where: { orgId_userId: { orgId: ctx.org.id, userId: targetId } } });
  if (!member) return { ok: false, error: "Member not found." };
  const shares = (await prisma.enrollment.count({ where: { userId: targetId, role: "STUDENT", classroomId: { in: ctx.teaches } } })) > 0;
  if (!canResetPassword(ctx.role, member.role, targetId === ctx.user.id, shares)) return DENIED;
  const password = temporaryPassword();
  await prisma.user.update({
    where: { id: targetId },
    data: { passwordHash: await hashPassword(password), mustChangePassword: true, failedLogins: 0, lockedUntil: null },
  });
  await destroyAllSessions(targetId);
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "member.password_reset", targetType: "user", targetId });
  return { ok: true, password };
}

// ---------------------------------------------------------------- classes

const className = z.string().trim().min(1, "Give the class a name.").max(80);

/** A join code that isn't taken yet. */
async function freshCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = newJoinCode();
    if (!(await prisma.classroom.findUnique({ where: { joinCode: code }, select: { id: true } }))) return code;
  }
  throw new Error("Could not allocate a join code");
}

export async function createClass(input: { name: string; teacherId?: string | null }): Promise<ActionResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const name = className.safeParse(input.name);
  if (!name.success) return { ok: false, error: name.error.issues[0].message };
  // Admins may hand a new class to another teacher; teachers create classes for themselves.
  let teacherId = ctx.user.id;
  if (input.teacherId && input.teacherId !== ctx.user.id) {
    if (!isAdmin(ctx.role)) return DENIED;
    const m = await prisma.membership.findUnique({ where: { orgId_userId: { orgId: ctx.org.id, userId: String(input.teacherId) } } });
    if (!m || !isStaff(m.role)) return { ok: false, error: "Choose a teacher from your organisation." };
    teacherId = m.userId;
  }
  const cls = await prisma.classroom.create({
    data: { orgId: ctx.org.id, name: name.data, joinCode: await freshCode(), enrollments: { create: { userId: teacherId, role: "TEACHER" } } },
  });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "class.created", targetType: "class", targetId: cls.id, meta: { name: cls.name } });
  revalidatePath("/teacher");
  revalidatePath("/admin/classes");
  return { ok: true, id: cls.id };
}

export async function renameClass(input: { classroomId: string; name: string }): Promise<ActionResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const cls = await managedClass(ctx, String(input.classroomId));
  if (!cls) return DENIED;
  const name = className.safeParse(input.name);
  if (!name.success) return { ok: false, error: name.error.issues[0].message };
  await prisma.classroom.update({ where: { id: cls.id }, data: { name: name.data } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "class.renamed", targetType: "class", targetId: cls.id, meta: { from: cls.name, to: name.data } });
  revalidatePath(`/teacher/classes/${cls.id}`);
  return { ok: true, id: cls.id };
}

export async function setClassArchived(input: { classroomId: string; archived: boolean }): Promise<ActionResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const cls = await managedClass(ctx, String(input.classroomId));
  if (!cls) return DENIED;
  await prisma.classroom.update({ where: { id: cls.id }, data: { archived: !!input.archived } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: input.archived ? "class.archived" : "class.restored", targetType: "class", targetId: cls.id, meta: { name: cls.name } });
  revalidatePath("/teacher");
  revalidatePath(`/teacher/classes/${cls.id}`);
  revalidatePath("/admin/classes");
  return { ok: true, id: cls.id };
}

/** Issue a new join code; the old one stops working at once. */
export async function rotateJoinCode(input: { classroomId: string }): Promise<ActionResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const cls = await managedClass(ctx, String(input.classroomId));
  if (!cls) return DENIED;
  await prisma.classroom.update({ where: { id: cls.id }, data: { joinCode: await freshCode() } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "class.code_rotated", targetType: "class", targetId: cls.id });
  revalidatePath(`/teacher/classes/${cls.id}`);
  return { ok: true, id: cls.id };
}

/** Admins add a co-teacher to a class. */
export async function addClassTeacher(input: { classroomId: string; userId: string }): Promise<ActionResult> {
  const ctx = await staff();
  if (!ctx || !isAdmin(ctx.role)) return DENIED;
  const cls = await managedClass(ctx, String(input.classroomId));
  if (!cls) return DENIED;
  const m = await prisma.membership.findUnique({ where: { orgId_userId: { orgId: ctx.org.id, userId: String(input.userId) } } });
  if (!m || !isStaff(m.role)) return { ok: false, error: "Choose a teacher from your organisation." };
  await prisma.enrollment.upsert({
    where: { classroomId_userId: { classroomId: cls.id, userId: m.userId } },
    create: { classroomId: cls.id, userId: m.userId, role: "TEACHER" },
    update: { role: "TEACHER" },
  });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "class.teacher_added", targetType: "class", targetId: cls.id, meta: { user: m.userId } });
  revalidatePath(`/teacher/classes/${cls.id}`);
  return { ok: true, id: cls.id };
}

/** Remove someone from a class. They stay in the organisation. */
export async function removeFromClass(input: { classroomId: string; userId: string }): Promise<ActionResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const cls = await managedClass(ctx, String(input.classroomId));
  if (!cls) return DENIED;
  const userId = String(input.userId);
  if (userId === ctx.user.id) return { ok: false, error: "You can't remove yourself from your own class." };
  const e = await prisma.enrollment.findUnique({ where: { classroomId_userId: { classroomId: cls.id, userId } } });
  if (!e) return { ok: false, error: "They aren't in this class." };
  if (e.role === "TEACHER" && !isAdmin(ctx.role)) return DENIED;
  await prisma.enrollment.delete({ where: { id: e.id } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "class.member_removed", targetType: "class", targetId: cls.id, meta: { user: userId, role: e.role } });
  revalidatePath(`/teacher/classes/${cls.id}`);
  return { ok: true, id: cls.id };
}

// ---------------------------------------------------------------- assignments

const assignmentSchema = z.object({
  classroomId: z.string().min(1, "Choose a class."),
  title: z.string().trim().min(1, "Give the assignment a title.").max(120),
  nodeIds: z.array(z.string()).max(80),
  unitId: z.string().nullable(),
  note: z.string().trim().max(500).nullable(),
  dueAt: z.string().nullable(),
});

export type AssignmentResult = ActionResult;

export async function createAssignment(input: {
  classroomId: string;
  title: string;
  nodeIds: string[];
  unitId: string | null;
  note: string | null;
  dueAt: string | null;
}): Promise<AssignmentResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const parsed = assignmentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const cls = await managedClass(ctx, parsed.data.classroomId);
  if (!cls || cls.archived) return { ok: false, error: "Choose one of your classes." };
  const { title, note } = parsed.data;
  const nodeIds = [...new Set(parsed.data.nodeIds)].filter((id) => getNode(id));
  const unitId = parsed.data.unitId && course.units.some((u) => u.id === parsed.data.unitId) ? parsed.data.unitId : null;
  if (nodeIds.length === 0 && !unitId) return { ok: false, error: "Pick at least one concept or a unit test." };
  let dueAt: Date | null = null;
  if (parsed.data.dueAt) {
    dueAt = new Date(parsed.data.dueAt);
    if (Number.isNaN(dueAt.getTime())) return { ok: false, error: "That due date couldn't be read." };
  }
  const a = await prisma.assignment.create({ data: { title, nodeIds, unitId, note: note || null, dueAt, classroomId: cls.id, createdById: ctx.user.id } });
  await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "assignment.created", targetType: "assignment", targetId: a.id, meta: { class: cls.name, title } });
  revalidatePath(`/teacher/classes/${cls.id}`);
  revalidatePath("/learn");
  return { ok: true, id: a.id };
}

export async function archiveAssignment(input: { id: string; archived: boolean }): Promise<AssignmentResult> {
  const ctx = await staff();
  if (!ctx) return DENIED;
  const a = await prisma.assignment.findFirst({ where: { id: String(input.id), classroom: { orgId: ctx.org.id } } });
  if (!a || !a.classroomId || !(await managedClass(ctx, a.classroomId))) return { ok: false, error: "Assignment not found." };
  await prisma.assignment.update({ where: { id: a.id }, data: { archived: !!input.archived } });
  if (input.archived) await audit({ orgId: ctx.org.id, actorId: ctx.user.id, action: "assignment.archived", targetType: "assignment", targetId: a.id, meta: { title: a.title } });
  revalidatePath(`/teacher/classes/${a.classroomId}`);
  revalidatePath("/learn");
  return { ok: true, id: a.id };
}
