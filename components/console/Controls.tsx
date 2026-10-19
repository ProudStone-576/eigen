"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

type Result = { ok: true } | { ok: false; error: string };

/**
 * A button that runs a server action and refreshes the page. Destructive ones
 * ask for a second click ("Remove" -> "Confirm remove") instead of a browser
 * dialog.
 */
export function ActionButton({
  run,
  children,
  confirm,
  className = "btn-ghost",
  onDone,
}: {
  run: () => Promise<Result>;
  children: ReactNode;
  confirm?: string;
  className?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const click = () => {
    if (confirm && !armed) return setArmed(true);
    start(async () => {
      setError(null);
      const r = await run();
      setArmed(false);
      if (!r.ok) return setError(r.error);
      onDone?.();
      router.refresh();
    });
  };
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="inline-flex items-center gap-2">
        <button type="button" onClick={click} disabled={pending} className={className}>
          {pending ? "Working…" : armed ? confirm : children}
        </button>
        {armed && !pending && (
          <button type="button" className="text-xs text-[var(--muted)] underline" onClick={() => setArmed(false)}>
            Cancel
          </button>
        )}
      </span>
      {error && <span className="text-xs text-[var(--mis)]">{error}</span>}
    </span>
  );
}

/** A one-line form: text input (and optional select) plus a submit button. */
export function InlineForm({
  run,
  placeholder,
  submit,
  initial = "",
  select,
  maxLength = 80,
  label,
}: {
  run: (value: string, choice: string) => Promise<Result>;
  placeholder: string;
  submit: string;
  initial?: string;
  select?: { label: string; options: { value: string; label: string }[]; initial?: string };
  maxLength?: number;
  label?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [choice, setChoice] = useState(select?.initial ?? select?.options[0]?.value ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="space-y-1"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          setError(null);
          const r = await run(value, choice);
          if (!r.ok) return setError(r.error);
          if (!initial) setValue("");
          router.refresh();
        });
      }}
    >
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex-1 min-w-48">
          {label && <span className="tb-label block mb-1">{label}</span>}
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} maxLength={maxLength} className="field w-full text-sm" />
        </label>
        {select && (
          <label>
            <span className="tb-label block mb-1">{select.label}</span>
            <select value={choice} onChange={(e) => setChoice(e.target.value)} className="field text-sm">
              {select.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="btn" disabled={pending || !value.trim()}>
          {pending ? "Saving…" : submit}
        </button>
      </div>
      {error && <p className="text-xs text-[var(--mis)]">{error}</p>}
    </form>
  );
}

/** Copy text to the clipboard, with a moment of feedback. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-sm text-[var(--accent)] hover:underline underline-offset-4"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

/** A role or option picker that saves on change. */
export function SelectAction({ value, options, run, disabled }: { value: string; options: { value: string; label: string }[]; run: (v: string) => Promise<Result>; disabled?: boolean }) {
  const router = useRouter();
  const [v, setV] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex flex-col gap-1">
      <select
        value={v}
        disabled={disabled || pending}
        className="field text-sm py-1"
        onChange={(e) => {
          const next = e.target.value;
          const prev = v;
          setV(next);
          start(async () => {
            setError(null);
            const r = await run(next);
            if (!r.ok) {
              setV(prev);
              return setError(r.error);
            }
            router.refresh();
          });
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[var(--mis)]">{error}</span>}
    </span>
  );
}
