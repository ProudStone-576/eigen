/** Every audit action, and how the admin log describes it. Pure, shared by writer and viewer. */
export const AUDIT_LABEL = {
  "auth.locked": "Account locked after repeated wrong passwords",
  "auth.password_changed": "Changed their password",
  "member.joined": "Joined the organisation",
  "member.role_changed": "Changed a member's role",
  "member.removed": "Removed a member",
  "member.password_reset": "Reset a member's password",
  "class.created": "Created a class",
  "class.renamed": "Renamed a class",
  "class.archived": "Archived a class",
  "class.restored": "Restored a class",
  "class.code_rotated": "Issued a new join code",
  "class.teacher_added": "Added a teacher to a class",
  "class.member_removed": "Removed someone from a class",
  "class.joined": "Joined a class",
  "invite.created": "Created an invitation link",
  "invite.revoked": "Revoked an invitation link",
  "invite.accepted": "Accepted an invitation",
  "assignment.created": "Set an assignment",
  "assignment.archived": "Archived an assignment",
  "question.saved": "Saved a custom question",
  "question.archived": "Archived a custom question",
  "org.created": "Created the organisation",
  "org.renamed": "Renamed the organisation",
  "data.exported": "Exported data",
  "account.deleted": "Deleted their account",
} as const;

export type AuditAction = keyof typeof AUDIT_LABEL;

export const auditLabel = (action: string) => (AUDIT_LABEL as Record<string, string>)[action] ?? action;
