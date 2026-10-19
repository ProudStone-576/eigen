"use client";

import { useActionState } from "react";
import { changePassword, deleteAccount, updateProfile, type AccountState } from "@/app/actions";

const initial: AccountState = { error: null };

function Status({ state }: { state: AccountState }) {
  if (state.error) return <p className="feedback feedback-bad text-sm">{state.error}</p>;
  if (state.ok) return <p className="feedback feedback-ok text-sm">{state.ok}</p>;
  return null;
}

export function NameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  return (
    <form action={action} className="space-y-3">
      <p className="tb-label">Your name</p>
      <input name="name" defaultValue={name} maxLength={60} className="field w-full" autoComplete="name" aria-label="Your name" />
      <Status state={state} />
      <button className="btn" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  return (
    <form action={action} className="space-y-3">
      <p className="tb-label">Change password</p>
      <label className="block text-sm">
        Current password
        <input name="current" type="password" className="field mt-1 w-full" autoComplete="current-password" required />
      </label>
      <label className="block text-sm">
        New password (8+ characters)
        <input name="next" type="password" minLength={8} className="field mt-1 w-full" autoComplete="new-password" required />
      </label>
      <label className="block text-sm">
        New password again
        <input name="confirm" type="password" minLength={8} className="field mt-1 w-full" autoComplete="new-password" required />
      </label>
      <Status state={state} />
      <button className="btn" disabled={pending}>{pending ? "Changing…" : "Change password"}</button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccount, initial);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <p className="text-sm text-[var(--muted)]">
        Deletes your account, progress, answers and test records permanently. Questions and assignments you wrote stay with your organisation. This cannot be undone.
      </p>
      <label className="block text-sm">
        Password
        <input name="password" type="password" className="field mt-1 w-full" autoComplete="current-password" required />
      </label>
      <label className="block text-sm">
        Type DELETE to confirm
        <input name="confirm" className="field mt-1 w-full" autoComplete="off" required />
      </label>
      <Status state={state} />
      <button className="btn-ghost text-[var(--mis)]" disabled={pending}>
        {pending ? "Deleting…" : "Delete my account"}
      </button>
    </form>
  );
}
