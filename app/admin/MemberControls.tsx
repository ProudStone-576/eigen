"use client";

import { ActionButton, SelectAction } from "@/components/console/Controls";
import { ROLE_LABEL, type OrgRole } from "@/lib/auth/permissions";
import { changeMemberRole, removeMember } from "./actions";

export function RoleSelect({ userId, role, options }: { userId: string; role: OrgRole; options: OrgRole[] }) {
  const all = options.includes(role) ? options : [role, ...options];
  return <SelectAction value={role} options={all.map((r) => ({ value: r, label: ROLE_LABEL[r] }))} run={(v) => changeMemberRole({ userId, role: v })} />;
}

export function RemoveMember({ userId }: { userId: string }) {
  return (
    <ActionButton run={() => removeMember({ userId })} confirm="Confirm remove" className="text-xs text-[var(--muted)] hover:text-[var(--mis)]">
      Remove
    </ActionButton>
  );
}
