/**
 * Who may do what inside an organisation. Pure: every server action and page
 * asks these functions rather than comparing role strings itself, so the rules
 * live in one place and are unit-tested.
 *
 *   OWNER    everything, including managing admins and the organisation itself
 *   ADMIN    members, classes, invitations, audit log, every class's data
 *   TEACHER  their own classes: roster, assignments, students' progress; org questions
 *   STUDENT  learning only
 */

export type OrgRole = "OWNER" | "ADMIN" | "TEACHER" | "STUDENT";
export const ORG_ROLES: OrgRole[] = ["OWNER", "ADMIN", "TEACHER", "STUDENT"];

const RANK: Record<OrgRole, number> = { OWNER: 4, ADMIN: 3, TEACHER: 2, STUDENT: 1 };

export const ROLE_LABEL: Record<OrgRole, string> = { OWNER: "Owner", ADMIN: "Admin", TEACHER: "Teacher", STUDENT: "Student" };

export const atLeast = (role: OrgRole, min: OrgRole) => RANK[role] >= RANK[min];
export const isStaff = (role: OrgRole) => atLeast(role, "TEACHER");
export const isAdmin = (role: OrgRole) => atLeast(role, "ADMIN");

/**
 * Platform admins and organisation admins open every section whatever its
 * prerequisites, to review content; teachers and students follow the order.
 */
export const opensEverySection = (role: OrgRole | null, platformAdmin: boolean) => platformAdmin || (!!role && isAdmin(role));

/** Organisation-wide abilities that don't depend on a particular class or person. */
export type OrgAction =
  | "members.view"
  | "members.manage"
  | "invites.manage"
  | "classes.create"
  | "classes.viewAll"
  | "audit.view"
  | "org.settings"
  | "content.edit"
  | "analytics.org";

const MIN_ROLE: Record<OrgAction, OrgRole> = {
  "members.view": "ADMIN",
  "members.manage": "ADMIN",
  "invites.manage": "ADMIN",
  "classes.create": "TEACHER",
  "classes.viewAll": "ADMIN",
  "audit.view": "ADMIN",
  "org.settings": "ADMIN",
  "content.edit": "TEACHER",
  "analytics.org": "ADMIN",
};

export const can = (role: OrgRole, action: OrgAction) => atLeast(role, MIN_ROLE[action]);

/** A class's roster, assignments and students: admins see every class, teachers the classes they teach. */
export const canManageClass = (role: OrgRole, teachesIt: boolean) => isAdmin(role) || (role === "TEACHER" && teachesIt);

/**
 * May the actor see a student's work? Admins: anyone in the organisation.
 * Teachers: students enrolled in one of their classes.
 */
export const canViewStudent = (role: OrgRole, sharesTaughtClass: boolean) => isAdmin(role) || (role === "TEACHER" && sharesTaughtClass);

/**
 * May the actor change, reset or remove the target member? Only someone ranked
 * strictly above them, except owners, who may act on other owners. Nobody acts
 * on themselves through these controls (the account page does that).
 */
export function canManageMember(actor: OrgRole, target: OrgRole, self: boolean): boolean {
  if (self) return false;
  if (actor === "OWNER") return true;
  return isAdmin(actor) && RANK[actor] > RANK[target];
}

/** Roles the actor may hand out (in invitations or role changes). Admins can't create owners or other admins. */
export function assignableRoles(actor: OrgRole): OrgRole[] {
  if (actor === "OWNER") return ORG_ROLES;
  if (actor === "ADMIN") return ["TEACHER", "STUDENT"];
  return [];
}

/**
 * Validate a role change. Returns an error message, or null when allowed.
 * `owners` is how many owners the organisation has now: the last one can't be
 * demoted or removed, so an organisation is never left without an owner.
 */
export function roleChangeError(args: { actor: OrgRole; target: OrgRole; next: OrgRole | null; self: boolean; owners: number }): string | null {
  const { actor, target, next, self, owners } = args;
  if (!canManageMember(actor, target, self)) return self ? "You can't change your own role here." : "You don't have permission to change this member.";
  if (next && !assignableRoles(actor).includes(next)) return `You can't make someone ${ROLE_LABEL[next].toLowerCase()}.`;
  if (target === "OWNER" && next !== "OWNER" && owners <= 1) return "An organisation needs at least one owner. Make someone else owner first.";
  return null;
}

/**
 * May the actor issue a temporary password? Whoever may manage the member, and
 * also a teacher for a student in one of their classes.
 */
export const canResetPassword = (actor: OrgRole, target: OrgRole, self: boolean, sharesTaughtClass: boolean) =>
  canManageMember(actor, target, self) || (!self && actor === "TEACHER" && target === "STUDENT" && sharesTaughtClass);
