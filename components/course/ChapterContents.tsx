import Link from "next/link";
import { MathText } from "@/components/MathText";
import { Square, STATE_WORD, TestSquare, type CellState } from "@/components/course/Mastery";
import { getNode } from "@/lib/content";
import { chapterHref, chapterNeighbours, courseHref, partOfUnit } from "@/lib/content/catalog";
import { chapterNumber, sectionNumber } from "@/lib/content/numbering";
import type { ConceptNode, Unit } from "@/lib/content/types";

/** The lesson's left panel: where it sits in the course, its chapter's sections, and its margin notes. */
export function ChapterContents({ unit, node, state, counts }: { unit: Unit; node: ConceptNode; state: (id: string) => CellState; counts: string }) {
  const part = partOfUnit(unit);
  const { prev, next } = chapterNeighbours(unit);
  const arrow = "flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]";

  return (
    <div className="space-y-7 font-sans text-sm">
      <div>
        <Link href={courseHref(part)} className="tb-label hover:text-[var(--accent)]">
          Part {part.roman} · {part.track}
        </Link>
        <div className="mt-2 flex items-start gap-2">
          {prev ? (
            <Link href={chapterHref(prev)} className={arrow} aria-label={`Previous chapter: ${prev.title}`} title={prev.title}>
              ‹
            </Link>
          ) : (
            <span className={`${arrow} opacity-30`} aria-hidden>
              ‹
            </span>
          )}
          <Link href={chapterHref(unit)} className="flex-1 text-center font-serif text-base leading-snug font-semibold hover:text-[var(--accent)]">
            Chapter {chapterNumber(unit)}: {unit.title}
          </Link>
          {next ? (
            <Link href={chapterHref(next)} className={arrow} aria-label={`Next chapter: ${next.title}`} title={next.title}>
              ›
            </Link>
          ) : (
            <span className={`${arrow} opacity-30`} aria-hidden>
              ›
            </span>
          )}
        </div>
      </div>

      <ol className="border-t border-[var(--border)]">
        {unit.nodes.map((n) => {
          const st = state(n.id);
          const here = n.id === node.id;
          const row = (
            <>
              <Square state={st} />
              <span className="w-8 shrink-0 tabular-nums text-[var(--muted)]">{sectionNumber(n.id)}</span>
              <span className="flex-1 leading-snug">{n.title}</span>
            </>
          );
          return (
            <li key={n.id} className="border-b border-[var(--border)]">
              {st === "LOCKED" ? (
                <span className="flex items-start gap-2.5 py-2.5 pl-3 text-[var(--muted)]" title={`${STATE_WORD.LOCKED}: learn what it assumes first`}>
                  {row}
                </span>
              ) : (
                <Link
                  href={`/learn/${n.id}`}
                  aria-current={here ? "page" : undefined}
                  title={STATE_WORD[st]}
                  className={`course-nav-item flex items-start gap-2.5 py-2.5 ${here ? "is-current font-medium" : ""}`}
                >
                  {row}
                </Link>
              )}
              {here && (
                <Link href={`/practice/${n.id}`} className="link-more mb-2.5 ml-[3.95rem] text-xs">
                  Practise this section
                </Link>
              )}
            </li>
          );
        })}
        <li>
          <Link href={`/exam/${unit.id}`} className="course-nav-item flex items-center gap-2.5 py-2.5">
            <TestSquare />
            <span className="w-8 shrink-0" />
            Chapter test
          </Link>
        </li>
      </ol>

      <div>
        <p className="tb-label">In this section</p>
        <p className="mt-1 text-[var(--muted)]">{counts}</p>
      </div>
      {node.deps.length > 0 && (
        <div>
          <p className="tb-label">Assumes</p>
          <ul className="mt-2 space-y-1">
            {node.deps.map((d) => (
              <li key={d}>
                <Link href={`/learn/${d}`} className="hover:text-[var(--accent)]">
                  {sectionNumber(d)} {getNode(d)?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {node.glossary.length > 0 && (
        <div>
          <p className="tb-label">Terms</p>
          <dl className="mt-2 space-y-2.5">
            {node.glossary.map((g) => (
              <div key={g.term}>
                <dt className="font-medium">{g.term}</dt>
                <dd className="text-[var(--muted)]">
                  <MathText text={g.meaning} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
