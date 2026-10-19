import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "eigen_session";
const SESSION_DAYS = 30;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  xp: number;
  streakDays: number;
  mustChangePassword: boolean;
  platformAdmin: boolean;
};

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * Issue a fresh session and set the cookie. Called after login and signup.
 * The session acts in `orgId`, or else the organisation the user joined first.
 */
export async function createSession(userId: string, orgId?: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const org =
    orgId ?? (await prisma.membership.findFirst({ where: { userId, org: { archived: false } }, orderBy: { createdAt: "asc" }, select: { orgId: true } }))?.orgId ?? null;
  await prisma.session.create({ data: { userId, orgId: org, tokenHash: hashToken(token), expiresAt } });
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

/** The session row behind the cookie, with its user. Cached per request. */
export const currentSession = cache(async (): Promise<{ id: string; orgId: string | null; user: SessionUser } | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true, xp: true, streakDays: true, mustChangePassword: true, platformAdmin: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return { id: session.id, orgId: session.orgId, user: session.user };
});

/** Current user from the cookie. Cached per request. */
export const currentUser = cache(async (): Promise<SessionUser | null> => (await currentSession())?.user ?? null);

/** Point this session at another organisation the user belongs to. */
export async function setSessionOrg(orgId: string): Promise<void> {
  const s = await currentSession();
  if (s) await prisma.session.update({ where: { id: s.id }, data: { orgId } });
}

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

/** End every session a user has (after a password change, reset or removal). */
export async function destroyAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
