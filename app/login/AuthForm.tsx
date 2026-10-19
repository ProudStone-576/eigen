"use client";

import { useActionState } from "react";
import type { FormState } from "../actions";

type Field = { name: string; label: string; type: string; hint?: string };

export function AuthForm({ action, submit, fields }: { action: (s: FormState, f: FormData) => Promise<FormState>; submit: string; fields: Field[] }) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  return (
    <form action={formAction} className="space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block space-y-1">
          <span className="text-sm font-medium">{f.label}</span>
          <input name={f.name} type={f.type} required className="field w-full" autoComplete={f.type === "password" ? "current-password" : f.name} />
          {f.hint && <span className="text-xs text-[var(--muted)]">{f.hint}</span>}
        </label>
      ))}
      {state.error && <p className="feedback feedback-bad text-sm">{state.error}</p>}
      <button className="btn w-full" disabled={pending}>
        {pending ? "One moment…" : submit}
      </button>
    </form>
  );
}
