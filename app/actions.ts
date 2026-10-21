"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, currentSession, currentUser, destroyAllSessions, destroySession, SESSION_COOKIE, setSessionOrg, type SessionUser } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { currentContext } from "@/lib/auth/context";
import { opensEverySection } from "@/lib/auth/permissions";
import { safeNext } from "@/lib/auth/redirect";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";
import { audit } from "@/lib/audit";
import { applyJoin, isBootstrapOwner, targetForCode, targetForInvitation, type JoinTarget } from "@/lib/org/join";
import { afterFailedLogin, isLocked, minutesLeft } from "@/lib/auth/lockout";
import { revalidatePath } from "next/cache";
import { course } from "@/lib/content";
import { submitAnswer, type GradeResult } from "@/lib/learning/progress";
import type { Response } from "@/lib/check";
import { hintFor, type HintResult } from "@/lib/tutor";
import { nextPracticeQuestion, type PracticeQuestion } from "@/lib/learning/practice";
import { buildExam, gradeExam, type ExamAnswer, type ExamPaper, type ExamResult } from "@/lib/learning/exam";

export type FormState = { error: string | null };

const signupSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(60),
  email: z.email("Enter a valid email.").trim().toLowerCase(),
  password: z.string().min(8, "Password needs at least 8 characters.").max(200),
  code: z.string().trim().max(100).optional().default(""),
  invite: z.string().trim().max(100).optional().default(""),
});

class JoinError extends Error {}

/**
 * Create an account and join an organisation in one step, by class code or
 * invitation link. Nobody can sign up without one: every account belongs to a
 * tenant from the start.
 */
export async function signup(_prev: FormState, form: FormData): Promise<FormState> {
  const limited = await rateLimit("signupIp", await clientIp());
  if (!limited.ok) return { error: `Too many sign-ups from this network. Try again in ${limited.retry}.` };
  const parsed = signupSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password, code, invite } = parsed.data;

  let target: JoinTarget | null;
  if (invite) {
    const view = await targetForInvitation(invite);
    if (!view || view.state !== "active") return { error: "This invitation link has expired or has already been used. Ask for a new one." };
    target = view.target;
  } else {
    if (!code) return { error: "Enter the class code your teacher gave you." };
    target = await targetForCode(code);
    if (!target) return { error: "That class code isn't right. Check it with your teacher." };
  }
  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    return { error: "An account with that email already exists. Log in, then join the class from your account." };
  }

  const bootstrap = isBootstrapOwner(email, target);
  const t = target;
  const passwordHash = await hashPassword(password);
  let userId: string;
  try {
    userId = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash, platformAdmin: bootstrap, role: bootstrap || t.role !== "STUDENT" ? "TEACHER" : "STUDENT" },
      });
      const joined = await applyJoin(tx, user.id, t, { bootstrapOwner: bootstrap });
      if (!joined.ok) throw new JoinError(joined.error);
      return user.id;
    });
  } catch (err) {
    if (err instanceof JoinError) return { error: err.message };
    throw err;
  }
  await audit({
    orgId: t.orgId,
    actorId: userId,
    action: t.invitationId ? "invite.accepted" : "member.joined",
    targetType: "user",
    targetId: userId,
    meta: { role: bootstrap ? "OWNER" : t.role, via: t.invitationId ? "invitation" : "code", class: t.className },
  });
  await createSession(userId, t.orgId);
  redirect(t.role === "STUDENT" && !bootstrap ? "/learn" : "/teacher");
}

const loginSchema = z.object({ email: z.string().trim().toLowerCase().max(200), password: z.string().max(200), next: z.string().optional() });

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter your email and password." };
  const { email, password } = parsed.data;
  for (const [policy, subject] of [
    ["loginIp", await clientIp()],
    ["loginEmail", email],
  ] as const) {
    const limited = await rateLimit(policy, subject);
    if (!limited.ok) return { error: `Too many attempts. Try again in ${limited.retry}.` };
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && isLocked(user.lockedUntil)) {
    return { error: `Too many wrong passwords. Try again in ${minutesLeft(user.lockedUntil!)} minutes, or ask your teacher to reset it.` };
  }
  // Same message either way: don't reveal which emails have accounts.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    if (user) {
      const next = afterFailedLogin(user.failedLogins);
      await prisma.user.update({ where: { id: user.id }, data: next });
      if (next.lockedUntil) {
        const orgs = await prisma.membership.findMany({ where: { userId: user.id }, select: { orgId: true } });
        for (const m of orgs) await audit({ orgId: m.orgId, actorId: user.id, action: "auth.locked", targetType: "user", targetId: user.id });
      }
    }
    return { error: "Email or password is wrong." };
  }
  if (user.failedLogins > 0 || user.lockedUntil) await prisma.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null } });
  await createSession(user.id);
  redirect(safeNext(parsed.data.next));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}

export type JoinState = { error: string | null };

/** A signed-in user joins another class (and its organisation) with a code. */
export async function joinWithCode(_prev: JoinState, form: FormData): Promise<JoinState> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const limited = await rateLimit("joinIp", await clientIp());
  if (!limited.ok) return { error: `Too many tries. Try again in ${limited.retry}.` };
  const target = await targetForCode(String(form.get("code") ?? "").slice(0, 100));
  if (!target) return { error: "That class code isn't right. Check it with your teacher." };
  const outcome = await joinTarget(user.id, user.email, target);
  if (!outcome.ok) return { error: outcome.error };
  redirect("/learn");
}

/** A signed-in user accepts an invitation link. */
export async function acceptInvitation(_prev: JoinState, form: FormData): Promise<JoinState> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const view = await targetForInvitation(String(form.get("token") ?? ""));
  if (!view || view.state !== "active") return { error: "This invitation link has expired or has already been used. Ask for a new one." };
  const outcome = await joinTarget(user.id, user.email, view.target);
  if (!outcome.ok) return { error: outcome.error };
  redirect(view.target.role === "STUDENT" ? "/learn" : "/teacher");
}

async function joinTarget(userId: string, email: string, t: JoinTarget): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      const joined = await applyJoin(tx, userId, t, { bootstrapOwner: isBootstrapOwner(email, t) });
      if (!joined.ok) throw new JoinError(joined.error);
    });
  } catch (err) {
    if (err instanceof JoinError) return { ok: false, error: err.message };
    throw err;
  }
  await audit({
    orgId: t.orgId,
    actorId: userId,
    action: t.invitationId ? "invite.accepted" : "class.joined",
    targetType: t.classroomId ? "class" : "org",
    targetId: t.classroomId ?? t.orgId,
    meta: { role: t.role, class: t.className },
  });
  await setSessionOrg(t.orgId);
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Act in another organisation the user belongs to. */
export async function switchOrg(form: FormData): Promise<void> {
  const ctx = await currentContext();
  const orgId = String(form.get("orgId") ?? "");
  if (!ctx || !ctx.memberships.some((m) => m.orgId === orgId)) return;
  await setSessionOrg(orgId);
  revalidatePath("/", "layout");
  redirect("/learn");
}

const cell = z.string().max(40);
const responseSchema: z.ZodType<Response> = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("mc"), optionId: z.string().max(10) }),
  z.object({ kind: z.literal("number"), text: z.string().max(80) }),
  z.object({ kind: z.literal("expression"), text: z.string().max(200) }),
  z.object({ kind: z.literal("vector"), values: z.array(cell).max(10) }),
  z.object({ kind: z.literal("matrix"), values: z.array(z.array(cell).max(10)).max(10) }),
]);

/** A signed-in member of an organisation, or the error a learner action returns. */
async function learner(): Promise<{ user: SessionUser; orgId: string; openAll: boolean } | { error: string }> {
  const ctx = await currentContext();
  if (!ctx) return { error: "Your session ended. Log in again." };
  if (!ctx.org) return { error: "Join a class to continue: Account, then Join a class." };
  return { user: ctx.user, orgId: ctx.org.id, openAll: opensEverySection(ctx.role, ctx.user.platformAdmin) };
}

export async function nextPractice(input: { nodeId: string; index: number }): Promise<PracticeQuestion | { error: string }> {
  const l = await learner();
  if ("error" in l) return l;
  const { user, orgId, openAll } = l;
  const index = Number.isInteger(input.index) && input.index >= 0 ? input.index : 0;
  return nextPracticeQuestion(user.id, String(input.nodeId), index, orgId, openAll);
}

export async function startExam(input: { scope: string }): Promise<ExamPaper> {
  const l = await learner();
  if ("error" in l) return l;
  const { user, openAll } = l;
  const scope = String(input.scope);
  return buildExam(user.id, scope === "mock" ? { kind: "mock" } : { kind: "unit", unitId: scope }, openAll);
}

export async function submitExam(input: { scope?: string; durationSec?: number; answers: ExamAnswer[]; timeZone?: string }): Promise<ExamResult | { error: string }> {
  const l = await learner();
  if ("error" in l) return l;
  const { user, orgId } = l;
  const limited = await rateLimit("examUser", user.id);
  if (!limited.ok) return { error: `That's a lot of tests in an hour. Try again in ${limited.retry}.` };
  if (!Array.isArray(input.answers)) return { error: "That exam couldn't be read." };
  const answers: ExamAnswer[] = [];
  for (const a of input.answers.slice(0, 30)) {
    const r = a?.response == null ? null : responseSchema.safeParse(a.response);
    if (r && !r.success) return { error: "An answer couldn't be read." };
    answers.push({ nodeId: String(a?.nodeId), itemId: String(a?.itemId), response: r ? r.data : null });
  }
  const result = await gradeExam(user.id, answers, typeof input.timeZone === "string" ? input.timeZone.slice(0, 64) : undefined);
  const scope = String(input.scope ?? "");
  if (!("error" in result) && (scope === "mock" || course.units.some((u) => u.id === scope))) {
    const durationSec = Number.isFinite(input.durationSec) ? Math.max(0, Math.min(86_400, Math.round(Number(input.durationSec)))) : null;
    await prisma.examRecord.create({ data: { userId: user.id, scope, score: result.score, total: result.total, durationSec } });
  }
  return result;
}

export async function askHint(input: { nodeId: string; itemId: string; response: Response }): Promise<HintResult> {
  const l = await learner();
  if ("error" in l) return l;
  const { user, orgId } = l;
  const response = responseSchema.safeParse(input.response);
  if (!response.success) return { error: "That answer couldn't be read." };
  return hintFor({ userId: user.id, orgId: orgId, nodeId: String(input.nodeId), itemId: String(input.itemId), response: response.data });
}

export async function answer(input: {
  nodeId: string;
  itemId: string;
  response: Response;
  timeZone?: string;
}): Promise<GradeResult | { error: string }> {
  const l = await learner();
  if ("error" in l) return l;
  const { user, orgId } = l;
  const response = responseSchema.safeParse(input.response);
  if (!response.success) return { error: "That answer couldn't be read." };
  const limited = await rateLimit("answerUser", user.id);
  if (!limited.ok) return { error: `You've answered a great many questions this hour. Take a break and try again in ${limited.retry}.` };
  return submitAnswer({
    userId: user.id,
    orgId: orgId,
    nodeId: String(input.nodeId),
    itemId: String(input.itemId),
    response: response.data,
    timeZone: typeof input.timeZone === "string" ? input.timeZone.slice(0, 64) : undefined,
  });
}

export type AccountState = { error: string | null; ok?: string };

export async function updateProfile(_prev: AccountState, form: FormData): Promise<AccountState> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const name = z.string().trim().min(1, "Enter your name.").max(60).safeParse(form.get("name"));
  if (!name.success) return { error: name.error.issues[0].message };
  await prisma.user.update({ where: { id: user.id }, data: { name: name.data } });
  revalidatePath("/account");
  return { error: null, ok: "Saved." };
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(8, "Your new password needs at least 8 characters.").max(200),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { message: "The two new passwords don't match." })
  .refine((v) => v.next !== v.current, { message: "Choose a password different from the current one." });

/** Change password, then sign out every other device by starting a fresh session. */
export async function changePassword(_prev: AccountState, form: FormData): Promise<AccountState> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const parsed = passwordSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const row = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { passwordHash: true } });
  if (!(await verifyPassword(parsed.data.current, row.passwordHash))) return { error: "Your current password isn't right." };
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.next), mustChangePassword: false, failedLogins: 0, lockedUntil: null },
  });
  const orgId = (await currentSession())?.orgId ?? undefined;
  await destroyAllSessions(user.id);
  await createSession(user.id, orgId);
  if (orgId) await audit({ orgId, actorId: user.id, action: "auth.password_changed", targetType: "user", targetId: user.id });
  revalidatePath("/", "layout");
  return { error: null, ok: "Password changed. Other devices have been signed out." };
}

/**
 * Delete the signed-in user's account and everything personal to it. Content
 * they authored for an organisation (assignments, questions) is handed to one
 * of its owners first, so classes don't lose their work. The last owner of an
 * organisation must hand ownership on before leaving.
 */
export async function deleteAccount(_prev: AccountState, form: FormData): Promise<AccountState> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  if (String(form.get("confirm") ?? "").trim() !== "DELETE") return { error: "Type DELETE to confirm." };
  const row = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { passwordHash: true } });
  if (!(await verifyPassword(String(form.get("password") ?? ""), row.passwordHash))) return { error: "That password isn't right." };

  const memberships = await prisma.membership.findMany({ where: { userId: user.id }, include: { org: { select: { name: true } } } });
  for (const m of memberships.filter((x) => x.role === "OWNER")) {
    if ((await prisma.membership.count({ where: { orgId: m.orgId, role: "OWNER" } })) <= 1) {
      return { error: `You're the only owner of ${m.org.name}. Make someone else an owner first.` };
    }
  }
  await prisma.$transaction(async (tx) => {
    for (const m of memberships) {
      const heir = await tx.membership.findFirst({ where: { orgId: m.orgId, role: { in: ["OWNER", "ADMIN"] }, userId: { not: user.id } }, orderBy: [{ role: "asc" }, { createdAt: "asc" }] });
      if (!heir) continue;
      await tx.assignment.updateMany({ where: { createdById: user.id, classroom: { orgId: m.orgId } }, data: { createdById: heir.userId } });
      await tx.customItem.updateMany({ where: { authorId: user.id, orgId: m.orgId }, data: { authorId: heir.userId } });
    }
    await tx.user.delete({ where: { id: user.id } });
  });
  for (const m of memberships) await audit({ orgId: m.orgId, actorId: null, action: "account.deleted", targetType: "user", targetId: user.id, meta: { role: m.role } });
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
