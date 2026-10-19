"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CopyButton } from "@/components/console/Controls";
import { ROLE_LABEL, type OrgRole } from "@/lib/auth/permissions";
import { createInvitation } from "../actions";

/** Create an invitation link. The link is shown once, here; only its hash is stored. */
export function InviteForm({ roles, classes }: { roles: OrgRole[]; classes: { id: string; name: string }[] }) {
  const router = useRouter();
  const [role, setRole] = useState<OrgRole>(roles.includes("TEACHER") ? "TEACHER" : roles[0]);
  const [classroomId, setClassroomId] = useState("");
  const [label, setLabel] = useState("");
  const [maxUses, setMaxUses] = useState(1);
  const [days, setDays] = useState(7);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="tb-box space-y-4">
      <p className="tb-label">New invitation link</p>
      <div className="grid gap-3 sm:grid-cols-5">
        <label className="sm:col-span-1">
          <span className="text-sm font-medium block mb-1">Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value as OrgRole)} className="field w-full text-sm">
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium block mb-1">Class (optional)</span>
          <select value={classroomId} onChange={(e) => setClassroomId(e.target.value)} className="field w-full text-sm">
            <option value="">None</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium block mb-1">Uses</span>
          <select value={maxUses} onChange={(e) => setMaxUses(Number(e.target.value))} className="field w-full text-sm">
            {[1, 5, 25, 100, 500].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "1 person" : `Up to ${n}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium block mb-1">Expires</span>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="field w-full text-sm">
            {[1, 7, 14, 30, 90].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "In 1 day" : `In ${n} days`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium block mb-1">Label (optional)</span>
        <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={80} placeholder="e.g. Physics department" className="field w-full text-sm" />
      </label>
      <button
        className="btn"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            setUrl(null);
            const r = await createInvitation({ role, classroomId: classroomId || null, label: label || null, maxUses, days });
            if (!r.ok) return setError(r.error);
            setUrl(r.url);
            setLabel("");
            router.refresh();
          })
        }
      >
        {pending ? "Creating…" : "Create link"}
      </button>
      {error && <p className="text-sm text-[var(--mis)]">{error}</p>}
      {url && (
        <div className="border-l-2 border-[var(--fg)] pl-4 space-y-1">
          <p className="text-sm">Send this link. It won&rsquo;t be shown again.</p>
          <p className="font-mono text-xs break-all select-all">{url}</p>
          <CopyButton text={url} label="Copy link" />
        </div>
      )}
    </div>
  );
}
