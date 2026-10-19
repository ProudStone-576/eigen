"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ActionButton, CopyButton, InlineForm } from "@/components/console/Controls";
import { createOrganization, setOrgArchived, setSeatLimit } from "./actions";

export function NewOrganization() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [seats, setSeats] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="tb-box space-y-3">
      <p className="tb-label">New organisation</p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-56">
          <span className="text-sm font-medium block mb-1">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="e.g. Northfield Coaching Institute" className="field w-full text-sm" />
        </label>
        <label className="w-40">
          <span className="text-sm font-medium block mb-1">Student seats</span>
          <input value={seats} onChange={(e) => setSeats(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Unlimited" className="field w-full text-sm" />
        </label>
        <button
          className="btn"
          disabled={pending || name.trim().length < 2}
          onClick={() =>
            start(async () => {
              setError(null);
              setUrl(null);
              const r = await createOrganization({ name, seatLimit: seats ? Number(seats) : null });
              if (!r.ok) return setError(r.error);
              setUrl(r.url);
              setName("");
              setSeats("");
              router.refresh();
            })
          }
        >
          {pending ? "Creating…" : "Create"}
        </button>
      </div>
      {error && <p className="text-sm text-[var(--mis)]">{error}</p>}
      {url && (
        <div className="border-l-2 border-[var(--fg)] pl-4 space-y-1">
          <p className="text-sm">Owner invitation (one use, 14 days). Send it to the person who will run the organisation. It won&rsquo;t be shown again.</p>
          <p className="font-mono text-xs break-all select-all">{url}</p>
          <CopyButton text={url} label="Copy link" />
        </div>
      )}
    </div>
  );
}

export function SeatLimit({ orgId, value }: { orgId: string; value: number | null }) {
  return (
    <InlineForm
      placeholder="Unlimited"
      submit="Set"
      initial={value === null ? "" : String(value)}
      maxLength={8}
      run={(v) => setSeatLimit({ orgId, seatLimit: v.trim() ? Number(v.replace(/\D/g, "")) : null })}
    />
  );
}

export function ArchiveOrg({ orgId, archived }: { orgId: string; archived: boolean }) {
  return (
    <ActionButton run={() => setOrgArchived({ orgId, archived: !archived })} confirm={archived ? undefined : "Confirm suspend"} className="text-xs text-[var(--muted)] hover:text-[var(--mis)]">
      {archived ? "Reactivate" : "Suspend"}
    </ActionButton>
  );
}
