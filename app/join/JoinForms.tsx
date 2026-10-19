"use client";

import { useActionState } from "react";
import { acceptInvitation, joinWithCode, type JoinState } from "../actions";

export function JoinCodeForm() {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinWithCode, { error: null });
  return (
    <form action={action} className="space-y-3">
      <label className="block space-y-1">
        <span className="text-sm font-medium">Class code</span>
        <input name="code" required maxLength={20} placeholder="K7Q-4MZ" className="field w-full font-mono tracking-widest uppercase" autoComplete="off" />
      </label>
      {state.error && <p className="feedback feedback-bad text-sm">{state.error}</p>}
      <button className="btn" disabled={pending}>
        {pending ? "Joining…" : "Join class"}
      </button>
    </form>
  );
}

export function AcceptInvitationForm({ token, label }: { token: string; label: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(acceptInvitation, { error: null });
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      {state.error && <p className="feedback feedback-bad text-sm">{state.error}</p>}
      <button className="btn" disabled={pending}>
        {pending ? "Joining…" : label}
      </button>
    </form>
  );
}
