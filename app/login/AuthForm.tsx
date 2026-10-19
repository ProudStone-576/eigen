"use client";

import { useActionState } from "react";
import type { FormState } from "../actions";

type Field = { name: string; label: string; type: string; hint?: string; defaultValue?: string; required?: boolean };

const autoComplete = (f: Field, signingUp: boolean) =>
  f.type === "password" ? (signingUp ? "new-password" : "current-password") : f.type === "email" ? "email" : f.name === "name" ? "name" : "off";

export function AuthForm({
  action,
  submit,
  fields,
  hidden = {},
}: {
  action: (s: FormState, f: FormData) => Promise<FormState>;
  submit: string;
  fields: Field[];
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const signingUp = fields.some((f) => f.name === "name");
  return (
    <form action={formAction} className="space-y-4">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {fields.map((f) => (
        <label key={f.name} className="block space-y-1">
          <span className="text-sm font-medium">{f.label}</span>
          <input name={f.name} type={f.type} required={f.required ?? true} defaultValue={f.defaultValue} className="field w-full" autoComplete={autoComplete(f, signingUp)} />
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
