"use client";

import { useRouter } from "next/navigation";
import { ActionButton, InlineForm } from "@/components/console/Controls";
import { addClassTeacher, createClass, removeFromClass, renameClass, rotateJoinCode, setClassArchived } from "./actions";

/** Thin client wrappers so server pages can render the controls with plain props. */

export function NewClass({ teachers, me }: { teachers: { id: string; name: string }[]; me: string }) {
  const router = useRouter();
  return (
    <InlineForm
      label="New class"
      placeholder="e.g. JEE 2027 · Batch A"
      submit="Create class"
      select={teachers.length > 1 ? { label: "Teacher", options: teachers.map((t) => ({ value: t.id, label: t.id === me ? `${t.name} (you)` : t.name })), initial: me } : undefined}
      run={async (name, teacherId) => {
        const r = await createClass({ name, teacherId: teacherId || null });
        if (r.ok) router.push(`/teacher/classes/${r.id}`);
        return r;
      }}
    />
  );
}

export function RenameClass({ id, name }: { id: string; name: string }) {
  return <InlineForm label="Class name" placeholder="Class name" submit="Rename" initial={name} run={(v) => renameClass({ classroomId: id, name: v })} />;
}

export function RotateCode({ id }: { id: string }) {
  return (
    <ActionButton run={() => rotateJoinCode({ classroomId: id })} confirm="Confirm: old code stops working" className="text-sm text-[var(--accent)] hover:underline underline-offset-4">
      New code
    </ActionButton>
  );
}

export function ArchiveClass({ id, archived }: { id: string; archived: boolean }) {
  return (
    <ActionButton run={() => setClassArchived({ classroomId: id, archived: !archived })} confirm={archived ? undefined : "Confirm archive"}>
      {archived ? "Restore class" : "Archive class"}
    </ActionButton>
  );
}

export function RemoveFromClass({ classroomId, userId }: { classroomId: string; userId: string }) {
  return (
    <ActionButton run={() => removeFromClass({ classroomId, userId })} confirm="Confirm remove" className="text-xs text-[var(--muted)] hover:text-[var(--mis)]">
      Remove
    </ActionButton>
  );
}

export function AddTeacher({ classroomId, candidates }: { classroomId: string; candidates: { id: string; name: string }[] }) {
  if (candidates.length === 0) return null;
  return (
    <form
      className="flex flex-wrap items-end gap-2"
      action={async (f) => {
        await addClassTeacher({ classroomId, userId: String(f.get("userId")) });
      }}
    >
      <label>
        <span className="tb-label block mb-1">Add a co-teacher</span>
        <select name="userId" className="field text-sm">
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <button className="btn-ghost">Add</button>
    </form>
  );
}
