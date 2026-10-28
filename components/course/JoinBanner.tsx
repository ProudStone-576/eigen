import Link from "next/link";

/** Shown to signed-out visitors on public course pages. */
export function JoinBanner() {
  return (
    <aside aria-label="Join Eigen" className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--rule)] py-4">
      <p className="font-serif text-lg">
        Track your mastery of every section. <span className="text-[var(--muted)]">Join with the code your class gave you.</span>
      </p>
      <div className="flex gap-3 text-sm">
        <Link href="/signup" className="btn">
          I&rsquo;m a student
        </Link>
        <Link href="/login" className="btn-ghost">
          I&rsquo;m a teacher
        </Link>
      </div>
    </aside>
  );
}
