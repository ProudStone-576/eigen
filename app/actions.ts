"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, currentUser, destroyAllSessions, destroySession } from "@/lib/auth/session";
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
  invite: z.string().trim(),
});

export async function signup(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password, invite } = parsed.data;

  const expected = process.env.INVITE_CODE;
  if (!expected || invite !== expected) return { error: "That invite code isn't right. Ask your teacher for it." };
  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    return { error: "An account with that email already exists. Log in instead." };
  }

  const teacherEmail = process.env.TEACHER_EMAIL?.trim().toLowerCase();
  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password), role: email === teacherEmail ? "TEACHER" : "STUDENT" },
  });
  await createSession(user.id);
  redirect("/learn");
}

const loginSchema = z.object({ email: z.string().trim().toLowerCase(), password: z.string() });

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter your email and password." };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user && isLocked(user.lockedUntil)) {
    return { error: `Too many wrong passwords. Try again in ${minutesLeft(user.lockedUntil!)} minutes, or ask your teacher to reset it.` };
  }
  // Same message either way: don't reveal which emails have accounts.
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    if (user) await prisma.user.update({ where: { id: user.id }, data: afterFailedLogin(user.failedLogins) });
    return { error: "Email or password is wrong." };
  }
  if (user.failedLogins > 0 || user.lockedUntil) await prisma.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null } });
  await createSession(user.id);
  redirect("/learn");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}

const cell = z.string().max(40);
const responseSchema: z.ZodType<Response> = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("mc"), optionId: z.string().max(10) }),
  z.object({ kind: z.literal("number"), text: z.string().max(80) }),
  z.object({ kind: z.literal("expression"), text: z.string().max(200) }),
  z.object({ kind: z.literal("vector"), values: z.array(cell).max(10) }),
  z.object({ kind: z.literal("matrix"), values: z.array(z.array(cell).max(10)).max(10) }),
]);

export async function nextPractice(input: { nodeId: string; index: number }): Promise<PracticeQuestion | { error: string }> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const index = Number.isInteger(input.index) && input.index >= 0 ? input.index : 0;
  return nextPracticeQuestion(user.id, String(input.nodeId), index);
}

export async function startExam(input: { scope: string }): Promise<ExamPaper> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const scope = String(input.scope);
  return buildExam(user.id, scope === "mock" ? { kind: "mock" } : { kind: "unit", unitId: scope });
}

export async function submitExam(input: { scope?: string; durationSec?: number; answers: ExamAnswer[]; timeZone?: string }): Promise<ExamResult | { error: string }> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
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
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const response = responseSchema.safeParse(input.response);
  if (!response.success) return { error: "That answer couldn't be read." };
  return hintFor({ userId: user.id, nodeId: String(input.nodeId), itemId: String(input.itemId), response: response.data });
}

export async function answer(input: {
  nodeId: string;
  itemId: string;
  response: Response;
  timeZone?: string;
}): Promise<GradeResult | { error: string }> {
  const user = await currentUser();
  if (!user) return { error: "Your session ended. Log in again." };
  const response = responseSchema.safeParse(input.response);
  if (!response.success) return { error: "That answer couldn't be read." };
  return submitAnswer({
    userId: user.id,
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
  await destroyAllSessions(user.id);
  await createSession(user.id);
  revalidatePath("/", "layout");
  return { error: null, ok: "Password changed. Other devices have been signed out." };
}
