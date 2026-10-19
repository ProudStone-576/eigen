"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth/session";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rateLimit";
import { hashToken, newJoinCode, newToken, slugify } from "@/lib/org/codes";
import { siteOrigin } from "@/lib/http/origin";

const DENIED = { ok: false as const, error: "Only the platform operator can do that." };

async function operator() {
  const user = await currentUser();
  if (!user?.platformAdmin || user.mustChangePassword) return null;
  return (await rateLimit("adminUser", user.id)).ok ? user : null;
}

async function uniqueSlug(base: string): Promise<string> {
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    if (!(await prisma.organization.findUnique({ where: { slug }, select: { id: true } }))) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

const orgSchema = z.object({
  name: z.string().trim().min(2, "Enter the organisation's name.").max(80),
  seatLimit: z.number().int().min(1).max(1_000_000).nullable(),
});

/**
 * Create an organisation with a first class, and return a single-use owner
 * invitation link (valid 14 days) to hand to whoever will run it.
 */
export async function createOrganization(input: { name: string; seatLimit: number | null }): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const user = await operator();
  if (!user) return DENIED;
  const parsed = orgSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const token = newToken();
  let joinCode = newJoinCode();
  while (await prisma.classroom.findUnique({ where: { joinCode }, select: { id: true } })) joinCode = newJoinCode();
  const org = await prisma.organization.create({
    data: {
      name: parsed.data.name,
      slug: await uniqueSlug(slugify(parsed.data.name)),
      seatLimit: parsed.data.seatLimit,
      classrooms: { create: { name: "Class 1", joinCode } },
      invitations: { create: { role: "OWNER", label: "Owner", maxUses: 1, expiresAt: new Date(Date.now() + 14 * 86_400_000), tokenHash: hashToken(token), createdById: user.id } },
    },
  });
  await audit({ orgId: org.id, actorId: user.id, action: "org.created", targetType: "org", targetId: org.id, meta: { name: org.name } });
  revalidatePath("/platform");
  return { ok: true, url: `${await siteOrigin()}/join/${token}` };
}

export async function setSeatLimit(input: { orgId: string; seatLimit: number | null }): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await operator();
  if (!user) return DENIED;
  const n = input.seatLimit === null ? null : Number(input.seatLimit);
  if (n !== null && (!Number.isInteger(n) || n < 1 || n > 1_000_000)) return { ok: false, error: "Enter a whole number of seats, or leave it empty for unlimited." };
  await prisma.organization.update({ where: { id: String(input.orgId) }, data: { seatLimit: n } });
  revalidatePath("/platform");
  return { ok: true };
}

export async function setOrgArchived(input: { orgId: string; archived: boolean }): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await operator();
  if (!user) return DENIED;
  await prisma.organization.update({ where: { id: String(input.orgId) }, data: { archived: !!input.archived } });
  revalidatePath("/platform");
  return { ok: true };
}
