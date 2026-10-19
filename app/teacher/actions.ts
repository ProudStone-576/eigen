"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentUser, destroyAllSessions } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { temporaryPassword } from "@/lib/auth/lockout";
import { course } from "@/lib/content";
import { getNode } from "@/lib/content";
import { toItem } from "@/lib/content/customSchema";

export type EditorResult = { ok: true; id: string } | { ok: false; error: string };

async function teacher() {
  const user = await currentUser();
  return user?.role === "TEACHER" ? user : null;
}

const flags = z.object({ inPractice: z.boolean(), inReview: z.boolean() });

export async function saveCustomItem(input: { nodeId: string; id?: string; data: unknown; inPractice: boolean; inReview: boolean }): Promise<EditorResult> {
  const user = await teacher();
  if (!user) return { ok: false, error: "Only the teacher can edit questions." };
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
    const existing = await prisma.customItem.findUnique({ where: { id: String(input.id) } });
    if (!existing || existing.nodeId !== node.id) return { ok: false, error: "That question no longer exists." };
    await prisma.customItem.update({ where: { id: existing.id }, data: { data, kind, ...f.data } });
    revalidatePath(`/teacher/content/${node.id}`);
    return { ok: true, id: existing.id };
  }
  const row = await prisma.customItem.create({ data: { nodeId: node.id, authorId: user.id, kind, data, ...f.data } });
  revalidatePath(`/teacher/content/${node.id}`);
  revalidatePath("/teacher/content");
  return { ok: true, id: row.id };
}

export async function archiveCustomItem(input: { id: string; archived: boolean }): Promise<EditorResult> {
  const user = await teacher();
  if (!user) return { ok: false, error: "Only the teacher can edit questions." };
  const row = await prisma.customItem.findUnique({ where: { id: String(input.id) } });
  if (!row) return { ok: false, error: "That question no longer exists." };
  await prisma.customItem.update({ where: { id: row.id }, data: { archived: Boolean(input.archived) } });
  revalidatePath(`/teacher/content/${row.nodeId}`);
  revalidatePath("/teacher/content");
  return { ok: true, id: row.id };
}

/** Give a student a temporary password (shown to the teacher once). They must change it on next login. */
export async function resetStudentPassword(input: { studentId: string }): Promise<{ ok: true; password: string } | { ok: false; error: string }> {
  if (!(await teacher())) return { ok: false, error: "Only the teacher can do that." };
  const student = await prisma.user.findUnique({ where: { id: String(input.studentId) }, select: { id: true, role: true } });
  if (!student || student.role !== "STUDENT") return { ok: false, error: "Student not found." };
  const password = temporaryPassword();
  await prisma.user.update({
    where: { id: student.id },
    data: { passwordHash: await hashPassword(password), mustChangePassword: true, failedLogins: 0, lockedUntil: null },
  });
  await destroyAllSessions(student.id);
  return { ok: true, password };
}

const assignmentSchema = z.object({
  title: z.string().trim().min(1, "Give the assignment a title.").max(120),
  nodeIds: z.array(z.string()).max(80),
  unitId: z.string().nullable(),
  note: z.string().trim().max(500).nullable(),
  dueAt: z.string().nullable(),
});

export type AssignmentResult = { ok: true; id: string } | { ok: false; error: string };

export async function createAssignment(input: {
  title: string;
  nodeIds: string[];
  unitId: string | null;
  note: string | null;
  dueAt: string | null;
}): Promise<AssignmentResult> {
  const me = await teacher();
  if (!me) return { ok: false, error: "Only the teacher can do that." };
  const parsed = assignmentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { title, note } = parsed.data;
  const nodeIds = [...new Set(parsed.data.nodeIds)].filter((id) => getNode(id));
  const unitId = parsed.data.unitId && course.units.some((u) => u.id === parsed.data.unitId) ? parsed.data.unitId : null;
  if (nodeIds.length === 0 && !unitId) return { ok: false, error: "Pick at least one concept or a unit test." };
  let dueAt: Date | null = null;
  if (parsed.data.dueAt) {
    dueAt = new Date(parsed.data.dueAt);
    if (Number.isNaN(dueAt.getTime())) return { ok: false, error: "That due date couldn't be read." };
  }
  const a = await prisma.assignment.create({ data: { title, nodeIds, unitId, note: note || null, dueAt, createdById: me.id } });
  revalidatePath("/teacher");
  revalidatePath("/learn");
  return { ok: true, id: a.id };
}

export async function archiveAssignment(input: { id: string; archived: boolean }): Promise<AssignmentResult> {
  if (!(await teacher())) return { ok: false, error: "Only the teacher can do that." };
  const a = await prisma.assignment.update({ where: { id: String(input.id) }, data: { archived: !!input.archived } }).catch(() => null);
  if (!a) return { ok: false, error: "Assignment not found." };
  revalidatePath("/teacher");
  revalidatePath("/learn");
  return { ok: true, id: a.id };
}
