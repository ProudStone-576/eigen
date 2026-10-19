"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth/session";
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
