import Link from "next/link";
import type { Unit } from "@/lib/content/types";
import { gridCells } from "@/lib/content/catalog";
import { sectionNumber } from "@/lib/content/numbering";
import type { Status } from "@/lib/learning/rules";

export type CellState = Status | "LOCKED";

export const STATE_WORD: Record<CellState, string> = {
  SOLID: "Mastered",
  LANDED: "Learned",
  EDGE: "In progress",
  MISCONCEPTION: "Revisit",
  UNKNOWN: "Not started",
  LOCKED: "Locked",
};

const ORDER: CellState[] = ["SOLID", "LANDED", "EDGE", "MISCONCEPTION", "UNKNOWN", "LOCKED"];

/** One small square per section; the fill says how far the student has got. */
export function Square({ state, label }: { state: CellState; label?: string }) {
  return <span className={`sq sq-${state.toLowerCase()}`} aria-hidden={label ? undefined : true} title={label} />;
}

export function TestSquare() {
  return (
    <span className="sq sq-test" aria-hidden>
      T
    </span>
  );
}

export function MasteryLegend({ withLocked = true }: { withLocked?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]" aria-label="What the squares mean">
      {ORDER.filter((s) => withLocked || s !== "LOCKED").map((s) => (
        <li key={s} className="flex items-center gap-2">
          <Square state={s} />
          {STATE_WORD[s]}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <TestSquare />
        Chapter test
      </li>
    </ul>
  );
}

/**
 * A chapter as a row of squares: its sections in order, then the chapter test.
 * `href` decides where an open square goes (the lesson, or log in first).
 */
export function MasteryRow({ unit, state, href, testHref }: { unit: Unit; state: (id: string) => CellState; href: (nodeId: string) => string; testHref: string | null }) {
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label={`Sections of ${unit.title}`}>
      {gridCells(unit).map((c) => {
        if (c.kind === "test") {
          const label = `${unit.title}: chapter test`;
          return (
            <li key="test" className="flex">
              {testHref ? (
                <Link href={testHref} aria-label={label} title={label} className="sq-link">
                  <TestSquare />
                </Link>
              ) : (
                <span title={label} aria-label={label} role="img" className="inline-flex">
                  <TestSquare />
                </span>
              )}
            </li>
          );
        }
        const st = state(c.node.id);
        const label = `${sectionNumber(c.node.id)} ${c.node.title}: ${STATE_WORD[st]}`;
        return (
          <li key={c.node.id} className="flex">
            {st === "LOCKED" ? (
              <span role="img" aria-label={label} title={label} className="inline-flex">
                <Square state={st} />
              </span>
            ) : (
              <Link href={href(c.node.id)} aria-label={label} title={label} className="sq-link">
                <Square state={st} />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
