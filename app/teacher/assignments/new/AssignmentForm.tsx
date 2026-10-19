"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createAssignment } from "@/app/teacher/actions";

type UnitOption = { id: string; track: string; title: string; nodes: { id: string; title: string }[] };

export function AssignmentForm({ units, classes, initialClass }: { units: UnitOption[]; classes: { id: string; name: string }[]; initialClass: string }) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState(initialClass);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [unitId, setUnitId] = useState("");
  const [due, setDue] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const toggle = (ids: string[], on: boolean) =>
    setPicked((cur) => {
      const next = new Set(cur);
      for (const id of ids) on ? next.add(id) : next.delete(id);
      return next;
    });

  const submit = () =>
    start(async () => {
      setError(null);
      // A date-only due date means the end of that day, local time.
      const dueAt = due ? new Date(`${due}T23:59:00`).toISOString() : null;
      const r = await createAssignment({ classroomId, title, nodeIds: [...picked], unitId: unitId || null, note: note || null, dueAt });
      if (!r.ok) return setError(r.error);
      router.push(`/teacher/assignments/${r.id}`);
    });

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <label className="block text-sm font-medium">
          Class
          <select value={classroomId} onChange={(e) => setClassroomId(e.target.value)} className="field mt-1 w-full">
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Week 3: eigenvectors" className="field mt-1 w-full" />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Due date (optional)
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field mt-1 w-full" />
          </label>
          <label className="block text-sm font-medium">
            Unit test to take (optional)
            <select value={unitId} onChange={(e) => setUnitId(e.target.value)} className="field mt-1 w-full">
              <option value="">None</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.track}: {u.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Note to students (optional)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2} className="field mt-1 w-full" />
        </label>
      </div>

      <div className="card space-y-5">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-semibold">Concepts to land</h2>
          <span className="text-sm text-[var(--muted)]">{picked.size} chosen</span>
        </div>
        {units.map((u) => {
          const ids = u.nodes.map((n) => n.id);
          const all = ids.every((id) => picked.has(id));
          return (
            <fieldset key={u.id} className="space-y-2">
              <legend className="flex w-full items-center justify-between gap-2 text-sm">
                <span className="font-medium">
                  <span className="text-[var(--muted)]">{u.track} · </span>
                  {u.title}
                </span>
                <button type="button" className="text-xs underline text-[var(--muted)]" onClick={() => toggle(ids, !all)}>
                  {all ? "Clear unit" : "Whole unit"}
                </button>
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {u.nodes.map((n) => (
                  <label key={n.id} className={`chip cursor-pointer select-none ${picked.has(n.id) ? "chip-on" : ""}`}>
                    <input type="checkbox" className="sr-only" checked={picked.has(n.id)} onChange={(e) => toggle([n.id], e.target.checked)} />
                    {n.title}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      {error && <p className="feedback feedback-bad">{error}</p>}
      <div className="flex justify-end">
        <button type="button" className="btn" disabled={pending} onClick={submit}>
          {pending ? "Creating…" : "Create assignment"}
        </button>
      </div>
    </div>
  );
}
