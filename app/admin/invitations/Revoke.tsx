"use client";

import { ActionButton } from "@/components/console/Controls";
import { revokeInvitation } from "../actions";

export function ActionButtonRevoke({ id }: { id: string }) {
  return (
    <ActionButton run={() => revokeInvitation({ id })} confirm="Confirm revoke" className="text-xs text-[var(--muted)] hover:text-[var(--mis)]">
      Revoke
    </ActionButton>
  );
}
