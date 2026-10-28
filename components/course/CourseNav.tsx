import Link from "next/link";
import { chapterHref, courseHref, type Part } from "@/lib/content/catalog";
import { chapterNumber } from "@/lib/content/numbering";

/** The course's own table of contents: the part, its chapters, then the mock exam. */
export function CourseNav({ part, current, signedIn }: { part: Part; current?: string; signedIn: boolean }) {
  return (
    <nav aria-label={`Course: ${part.track}`} className="text-sm">
      <Link href={courseHref(part)} aria-current={current ? undefined : "page"} className={`course-nav-item block border-b border-[var(--rule)] pb-3 ${current ? "" : "is-current"}`}>
        <span className="tb-label">Part {part.roman}</span>
        <span className="mt-0.5 block font-serif text-xl font-semibold">{part.track}</span>
        <span className="text-[var(--muted)]">
          {part.units.length} chapters · {part.units.reduce((k, u) => k + u.nodes.length, 0)} sections
        </span>
      </Link>
      <ol>
        {part.units.map((u) => (
          <li key={u.id}>
            <Link href={chapterHref(u)} aria-current={u.id === current ? "page" : undefined} className={`course-nav-item block border-b border-[var(--border)] py-2.5 ${u.id === current ? "is-current" : ""}`}>
              <span className="tb-label">Chapter {chapterNumber(u)}</span>
              <span className="block leading-snug">{u.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <MockExamNote signedIn={signedIn} className="mt-6" />
    </nav>
  );
}

export function MockExamNote({ signedIn, className = "" }: { signedIn: boolean; className?: string }) {
  return (
    <div className={`border border-[var(--rule)] bg-[var(--surface)] p-4 ${className}`}>
      <p className="tb-label">Mock exam</p>
      <p className="mt-1 text-sm text-[var(--muted)]">Twenty questions across everything you have learned, weighted towards your weakest sections.</p>
      <Link href={signedIn ? "/exam" : "/login?next=%2Fexam"} className="link-more mt-2 text-sm">
        Start the mock exam
      </Link>
    </div>
  );
}
