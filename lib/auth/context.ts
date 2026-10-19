import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { currentSession, requireUser, type SessionUser } from "./session";
import { atLeast, can, isAdmin, type OrgAction, type OrgRole } from "./permissions";

/**
 * The organisation a request acts in, and the signed-in user's place in it.
 * Every tenant-scoped query starts from this: never from a global table scan.
 */

export type Org = { id: string; name: string; slug: string; seatLimit: number | null };
export type MembershipSummary = { orgId: string; orgName: string; role: OrgRole };

export type Context = {
  user: SessionUser;
  org: Org | null;
  role: OrgRole | null;
  memberships: MembershipSummary[];
  /** Classes in this organisation the user teaches. */
  teaches: string[];
  /** Classes in this organisation the user is enrolled in as a student. */
  learnsIn: string[];
};

export type OrgContext = Context & { org: Org; role: OrgRole };

export const currentContext = cache(async (): Promise<Context | null> => {
  const session = await currentSession();
  if (!session) return null;
  const rows = await prisma.membership.findMany({
    where: { userId: session.user.id, org: { archived: false } },
    orderBy: { createdAt: "asc" },
    include: { org: { select: { id: true, name: true, slug: true, seatLimit: true } } },
  });
  const memberships = rows.map((m) => ({ orgId: m.orgId, orgName: m.org.name, role: m.role }));
  const active = rows.find((m) => m.orgId === session.orgId) ?? rows[0] ?? null;
  if (!active) return { user: session.user, org: null, role: null, memberships, teaches: [], learnsIn: [] };
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, classroom: { orgId: active.orgId, archived: false } },
    select: { classroomId: true, role: true },
  });
  return {
    user: session.user,
    org: active.org,
    role: active.role,
    memberships,
    teaches: enrollments.filter((e) => e.role === "TEACHER").map((e) => e.classroomId),
    learnsIn: enrollments.filter((e) => e.role === "STUDENT").map((e) => e.classroomId),
  };
});

/** Signed in and a member of an organisation; otherwise to log in, or to join one. */
export async function requireOrg(opts: { allowPasswordChange?: boolean } = {}): Promise<OrgContext> {
  await requireUser(opts);
  const ctx = await currentContext();
  if (!ctx) redirect("/login");
  if (!ctx.org || !ctx.role) redirect("/join");
  return ctx as OrgContext;
}

/** Teachers, admins and owners. Students go back to their syllabus. */
export async function requireStaff(): Promise<OrgContext> {
  const ctx = await requireOrg();
  if (!atLeast(ctx.role, "TEACHER")) redirect("/learn");
  return ctx;
}

export async function requireAdmin(): Promise<OrgContext> {
  const ctx = await requireOrg();
  if (!isAdmin(ctx.role)) redirect(atLeast(ctx.role, "TEACHER") ? "/teacher" : "/learn");
  return ctx;
}

export async function requirePlatformAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.platformAdmin) redirect("/learn");
  return user;
}

/** For server actions: the org context if the user may perform `action`, else null. */
export async function contextFor(action: OrgAction): Promise<OrgContext | null> {
  const ctx = await currentContext();
  if (!ctx?.org || !ctx.role || ctx.user.mustChangePassword) return null;
  return can(ctx.role, action) ? (ctx as OrgContext) : null;
}

/** Classes the user may manage: every class for admins, their own for teachers. */
export async function manageableClasses(ctx: OrgContext, opts: { archived?: boolean } = {}) {
  return prisma.classroom.findMany({
    where: { orgId: ctx.org.id, archived: opts.archived ?? false, ...(isAdmin(ctx.role) ? {} : { id: { in: ctx.teaches } }) },
    orderBy: { name: "asc" },
  });
}

/**
 * Students the user may see: every student member for admins; for teachers,
 * students enrolled in a class they teach. Returns a Prisma `where` on User.
 */
export function visibleStudentsWhere(ctx: OrgContext) {
  const inOrg = { memberships: { some: { orgId: ctx.org.id, role: "STUDENT" as const } } };
  if (isAdmin(ctx.role)) return inOrg;
  return { ...inOrg, enrollments: { some: { role: "STUDENT" as const, classroomId: { in: ctx.teaches } } } };
}
