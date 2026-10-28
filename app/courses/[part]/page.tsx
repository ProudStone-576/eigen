import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseNav, MockExamNote } from "@/components/course/CourseNav";
import { JoinBanner } from "@/components/course/JoinBanner";
import { MasteryLegend, MasteryRow } from "@/components/course/Mastery";
import { chapterHref, partBySlug, partSlug, tally } from "@/lib/content/catalog";
import { chapterNumber, parts } from "@/lib/content/numbering";
import { viewer } from "@/lib/learning/viewer";

export async function generateMetadata({ params }: { params: Promise<{ part: string }> }) {
  const part = partBySlug((await params).part);
  return { title: part ? part.track : "Course" };
}

export default async function CoursePage({ params }: { params: Promise<{ part: string }> }) {
  const part = partBySlug((await params).part);
  if (!part) notFound();
  const v = await viewer();
  const nodes = part.units.flatMap((u) => u.nodes);
  const t = tally(nodes, (id) => {
    const s = v.state(id);
    return s === "LOCKED" ? "UNKNOWN" : s;
  });
  const i = parts.indexOf(part);
  const before = i > 0 ? parts[i - 1] : null;

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="order-2 lg:order-1">
        <div className="lg:sticky lg:top-20">
          <CourseNav part={part} signedIn={v.signedIn} />
        </div>
      </aside>

      <div className="order-1 min-w-0 lg:order-2">
        {!v.signedIn && <JoinBanner />}
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <nav aria-label="Breadcrumbs" className="text-sm text-[var(--muted)]">
            <Link href="/courses" className="hover:text-[var(--accent)]">
              Courses
            </Link>
            <span className="mx-2">/</span>
            <span>Part {part.roman}</span>
          </nav>
          {before && (
            <p className="text-sm text-[var(--muted)]">
              Builds on{" "}
              <Link href={`/courses/${partSlug(before)}`} className="text-[var(--accent)] hover:underline underline-offset-4">
                Part {before.roman}, {before.track}
              </Link>
            </p>
          )}
        </div>
        <h1 className="mt-3 font-serif text-[2.6rem] leading-tight font-semibold">{part.track}</h1>
        <p className="mt-1 text-[var(--muted)] tabular-nums">
          {nodes.length} sections in {part.units.length} chapters
          {v.signedIn && ` · ${t.SOLID} mastered · ${t.LANDED} learned`}
        </p>

        <div className="mt-8">
          <MasteryLegend withLocked={v.signedIn} />
        </div>

        <ol aria-label="Course mastery" className="mt-6 border-t border-[var(--fg)]">
          {part.units.map((u) => (
            <li key={u.id} className="grid gap-2 border-b border-[var(--border)] py-4 sm:grid-cols-[17rem_1fr] sm:items-center sm:gap-6">
              <Link href={chapterHref(u)} className="leading-snug hover:text-[var(--accent)]">
                <span className="tb-label mr-2">Chapter {chapterNumber(u)}</span>
                <span>{u.title}</span>
              </Link>
              <MasteryRow unit={u} state={v.state} href={v.lessonHref} testHref={v.signedIn ? `/exam/${u.id}` : null} />
            </li>
          ))}
        </ol>

        <MockExamNote signedIn={v.signedIn} className="mt-8 max-w-md" />
      </div>
    </div>
  );
}
