import Link from "next/link";
import { requireOrg } from "@/lib/auth/context";
import { ConceptMap, STATUS_STYLE } from "@/components/ConceptMap";
import { course } from "@/lib/content";
import { chapterNumber } from "@/lib/content/numbering";
import { loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import type { Status } from "@/lib/learning/rules";

export const metadata = { title: "Dependency map" };

/** The prerequisite graph of every chapter, for students who like to see how sections connect. */
export default async function MapPage() {
  const user = (await requireOrg()).user;
  const progress = await loadProgress(user.id);
  const status = statusIn(progress);
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <Link href="/learn" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← Syllabus</Link>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Dependency map</h1>
        <p className="mt-2 text-[var(--muted)]">An arrow means the later section assumes the earlier one.</p>
        <ul className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
          {(["UNKNOWN", "EDGE", "LANDED", "SOLID", "MISCONCEPTION", "LOCKED"] as const).map((s) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3" style={{ background: STATUS_STYLE[s].fill, border: `1.5px solid ${STATUS_STYLE[s].stroke}` }} />
              {STATUS_STYLE[s].label}
            </li>
          ))}
        </ul>
      </div>
      {course.units.map((u) => {
        const state: Record<string, Status | "LOCKED"> = Object.fromEntries(u.nodes.map((n) => [n.id, unlocked(n.id, progress) ? status(n.id) : "LOCKED"]));
        return (
          <section key={u.id}>
            <h2 className="font-serif text-xl font-semibold">
              Chapter {chapterNumber(u)} <span className="font-normal">· {u.title}</span>
            </h2>
            <div className="mt-3 border border-[var(--border)] bg-[var(--surface)] p-4">
              <ConceptMap nodes={u.nodes} state={state} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
