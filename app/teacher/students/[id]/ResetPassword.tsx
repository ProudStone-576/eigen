"use client";

import { useState, useTransition } from "react";
import { resetStudentPassword } from "@/app/teacher/actions";

/** Two-step reset: confirm, then show the temporary password once. */
export function ResetPassword({ studentId, name, pending: alreadyPending }: { studentId: string; name: string; pending: boolean }) {
  const [stage, setStage] = useState<"idle" | "confirm" | "done">("idle");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();

  if (stage === "done")
    return (
      <div className="card p-4! max-w-sm space-y-2">
        <p className="text-sm">Temporary password for {name}. It won&rsquo;t be shown again:</p>
        <p className="font-mono text-lg select-all">{password}</p>
        <p className="text-xs text-[var(--muted)]">They&rsquo;ll be asked to choose a new one when they log in. All their sessions were signed out.</p>
      </div>
    );
  if (stage === "confirm")
    return (
      <div className="card p-4! max-w-sm space-y-3">
        <p className="text-sm">Reset {name}&rsquo;s password? Their current password stops working immediately.</p>
        {error && <p className="feedback feedback-bad text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() =>
              start(async () => {
                const r = await resetStudentPassword({ studentId });
                if (!r.ok) return setError(r.error);
                setPassword(r.password);
                setStage("done");
              })
            }
          >
            {busy ? "Resetting…" : "Yes, reset"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setStage("idle")}>Cancel</button>
        </div>
      </div>
    );
  return (
    <div className="text-right">
      <button type="button" className="btn-ghost" onClick={() => setStage("confirm")}>Reset password</button>
      {alreadyPending && <p className="mt-1 text-xs text-[var(--muted)]">A reset is waiting: they haven&rsquo;t chosen a new password yet.</p>}
    </div>
  );
}
