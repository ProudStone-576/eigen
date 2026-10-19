import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "eigen_session";
const SESSION_DAYS = 30;

export type SessionUser = { id: string; email: string; name: string; role: Role; xp: number; streakDays: number; mustChangePassword: boolean };

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Issue a fresh session and set the cookie. Called after login and signup. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  store.delete(SESSION_COOKIE);
}

/** Current user from the cookie. Cached per request. */
export const currentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true, role: true, xp: true, streakDays: true, mustChangePassword: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

/**
 * The signed-in user, or a redirect to log in. After a teacher resets a
 * password, every page except the account page sends the student to choose a
 * new one first.
 */
export async function requireUser(opts: { allowPasswordChange?: boolean } = {}): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword && !opts.allowPasswordChange) redirect("/account?reset=1");
  return user;
}

/** End every session a user has (after a password change or reset). */
export async function destroyAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function requireTeacher(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "TEACHER") redirect("/learn");
  return user;
}
