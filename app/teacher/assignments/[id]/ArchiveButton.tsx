"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { archiveAssignment } from "@/app/teacher/actions";

export function ArchiveButton({ id, archived }: { id: string; archived: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="btn-ghost"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await archiveAssignment({ id, archived: !archived });
          router.refresh();
        })
      }
    >
      {archived ? "Restore" : "Archive"}
    </button>
  );
}
