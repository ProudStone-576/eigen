"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveCustomItem } from "../../actions";
import { Editor, type EditorInitial } from "./Editor";

export function ItemActions({ id, archived, nodeId, misconceptions, initial }: { id: string; archived: boolean; nodeId: string; misconceptions: Record<string, string>; initial: EditorInitial }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="space-y-3">
      <div className="flex gap-3 text-sm">
        {!archived && (
          <button type="button" className="underline" onClick={() => setEditing((e) => !e)}>
            {editing ? "Close editor" : "Edit"}
          </button>
        )}
        <button
          type="button"
          className="underline text-[var(--muted)]"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await archiveCustomItem({ id, archived: !archived });
              router.refresh();
            })
          }
        >
          {archived ? "Restore" : "Archive"}
        </button>
      </div>
      {editing && <Editor nodeId={nodeId} misconceptions={misconceptions} initial={initial} onDone={() => setEditing(false)} />}
    </div>
  );
}
