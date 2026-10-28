import Link from "next/link";
import { courseHref, partSlug } from "@/lib/content/catalog";
import { parts } from "@/lib/content/numbering";

export const metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-4xl font-semibold">Courses</h1>
      <p className="mt-2 text-[var(--muted)]">The book in {parts.length} parts. Each part is a course; open one to see its chapters and how far you have got.</p>
      <ol className="mt-8 border-t border-[var(--fg)]">
        {parts.map((p) => {
          const sections = p.units.reduce((k, u) => k + u.nodes.length, 0);
          return (
            <li key={partSlug(p)} className="border-b border-[var(--border)]">
              <Link href={courseHref(p)} className="grid grid-cols-[4rem_1fr_auto] items-baseline gap-4 py-4 hover:text-[var(--accent)]">
                <span className="tb-label">Part {p.roman}</span>
                <span>
                  <span className="font-serif text-xl font-semibold">{p.track}</span>
                  <span className="mt-0.5 block text-sm text-[var(--muted)]">{p.units.map((u) => u.title).join(" · ")}</span>
                </span>
                <span className="text-sm tabular-nums text-[var(--muted)]">
                  {p.units.length} ch · {sections} sec
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
