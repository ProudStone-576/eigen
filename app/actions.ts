"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, currentUser, destroySession } from "@/lib/auth/session";
import { submitAnswer, type GradeResult } from "@/lib/learning/progress";
import type { Response } from "@/lib/check";

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
  // Same message either way: don't reveal which emails have accounts.
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Email or password is wrong." };
  }
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
