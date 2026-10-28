import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseNav } from "@/components/course/CourseNav";
import { JoinBanner } from "@/components/course/JoinBanner";
import { MasteryLegend, MasteryRow, Square, STATE_WORD, TestSquare } from "@/components/course/Mastery";
import { MathText } from "@/components/MathText";
import { chapterHref, chapterNeighbours, courseHref, partBySlug, unitInPart } from "@/lib/content/catalog";
import { chapterNumber, sectionNumber } from "@/lib/content/numbering";
import { viewer } from "@/lib/learning/viewer";

type Params = Promise<{ part: string; unit: string }>;

async function find(params: Params) {
  const { part: slug, unit: unitId } = await params;
  const part = partBySlug(slug);
  const unit = part && unitInPart(part, unitId);
  return part && unit ? { part, unit } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const f = await find(params);
  return { title: f ? `Chapter ${chapterNumber(f.unit)}: ${f.unit.title}` : "Chapter" };
}

export default async function ChapterPage({ params }: { params: Params }) {
  const f = await find(params);
  if (!f) notFound();
  const { part, unit } = f;
  const v = await viewer();
  const { prev, next } = chapterNeighbours(unit);
  const ch = chapterNumber(unit);

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="order-2 lg:order-1">
        <div className="lg:sticky lg:top-20">
          <CourseNav part={part} current={unit.id} signedIn={v.signedIn} />
        </div>
      </aside>

      <div className="order-1 min-w-0 lg:order-2">
        {!v.signedIn && <JoinBanner />}
        <nav aria-label="Breadcrumbs" className="text-sm text-[var(--muted)]">
          <Link href="/courses" className="hover:text-[var(--accent)]">
            Courses
          </Link>
          <span className="mx-2">/</span>
          <Link href={courseHref(part)} className="hover:text-[var(--accent)]">
            Part {part.roman} · {part.track}
          </Link>
        </nav>
        <h1 className="mt-3 font-serif text-[2.6rem] leading-tight font-semibold">
          <span className="text-[var(--muted)]">Chapter {ch}</span> {unit.title}
        </h1>
        <p className="mt-2 max-w-2xl font-serif text-lg text-[var(--muted)]">{unit.blurb}</p>

        <div className="mt-8 space-y-4">
          <MasteryLegend withLocked={v.signedIn} />
          <nav aria-label="Chapter mastery" className="border-y border-[var(--border)] py-4">
            <MasteryRow unit={unit} state={v.state} href={v.lessonHref} testHref={v.signedIn ? `/exam/${unit.id}` : null} />
          </nav>
        </div>

        <h2 className="mt-12 border-b border-[var(--fg)] pb-2 font-serif text-2xl font-semibold">Sections</h2>
        <ol>
          {unit.nodes.map((n) => {
            const st = v.state(n.id);
            const open = st !== "LOCKED";
            return (
              <li key={n.id} className="grid grid-cols-[1.25rem_3rem_1fr] gap-x-3 border-b border-[var(--border)] py-4 sm:grid-cols-[1.25rem_3rem_1fr_auto]">
                <span className="pt-1.5">
                  <Square state={st} />
                </span>
                <span className="tabular-nums text-[var(--muted)] pt-0.5">{sectionNumber(n.id)}</span>
                <div className="min-w-0">
                  {open ? (
                    <Link href={v.lessonHref(n.id)} className="font-serif text-lg font-semibold hover:text-[var(--accent)]">
                      {n.title}
                    </Link>
                  ) : (
                    <span className="font-serif text-lg font-semibold text-[var(--muted)]">{n.title}</span>
                  )}
                  <MathText as="p" text={n.summary} className="mt-0.5 block text-sm text-[var(--muted)]" />
                </div>
                <div className="col-start-3 mt-2 flex items-baseline gap-4 text-sm sm:col-start-4 sm:mt-0 sm:justify-end sm:pt-1">
                  <span className={st === "MISCONCEPTION" ? "text-[var(--mis)]" : "text-[var(--muted)]"}>{v.signedIn ? STATE_WORD[st] : ""}</span>
                  {open && (
                    <>
                      <Link href={v.lessonHref(n.id)} className="link-more">
                        Read
                      </Link>
                      {v.signedIn && (
                        <Link href={`/practice/${n.id}`} className="link-more">
                          Practise
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
          <li className="grid grid-cols-[1.25rem_3rem_1fr_auto] items-baseline gap-x-3 py-4">
            <span className="self-center">
              <TestSquare />
            </span>
            <span />
            <div>
              <p className="font-serif text-lg font-semibold">Chapter test</p>
              <p className="text-sm text-[var(--muted)]">Fresh questions on every section you have opened, graded together when you submit.</p>
            </div>
            <Link href={v.signedIn ? `/exam/${unit.id}` : `/login?next=${encodeURIComponent(`/exam/${unit.id}`)}`} className="link-more text-sm">
              Take the test
            </Link>
          </li>
        </ol>

        <nav aria-label="Chapters" className="mt-10 flex justify-between gap-6 border-t border-[var(--rule)] pt-4 text-sm">
          {prev ? (
            <Link href={chapterHref(prev)} className="text-[var(--muted)] hover:text-[var(--fg)]">
              ← Chapter {chapterNumber(prev)} · {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={chapterHref(next)} className="text-right text-[var(--muted)] hover:text-[var(--fg)]">
              Chapter {chapterNumber(next)} · {next.title} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
