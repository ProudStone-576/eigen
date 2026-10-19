import Link from "next/link";
import { requireOrg } from "@/lib/auth/context";
import { course } from "@/lib/content";
import { loadProgress, statusIn, unlocked } from "@/lib/learning/progress";

export const metadata = { title: "Tests" };

export default async function ExamHome() {
  const user = (await requireOrg()).user;
  const map = await loadProgress(user.id);
  const status = statusIn(map);
  const learned = course.units.flatMap((u) => u.nodes).filter((n) => unlocked(n.id, map) && status(n.id) !== "UNKNOWN").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Tests</h1>
        <p className="text-[var(--muted)]">
          Fresh questions of every kind, harder than practice, with no feedback until you submit. Your results show exactly which ideas to go back to.
        </p>
      </div>

      <section className="card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Mock exam</h2>
          <p className="text-sm text-[var(--muted)]">20 questions across everything you&rsquo;ve learned, weighted towards your weakest concepts. Hard level.</p>
        </div>
        {learned >= 3 ? (
          <Link href="/exam/mock" className="btn">Start mock exam</Link>
        ) : (
          <span className="text-sm text-[var(--muted)]">Learn {3 - learned} more concept{3 - learned === 1 ? "" : "s"} to unlock</span>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Unit tests</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {course.units.map((u) => {
            const open = u.nodes.filter((n) => unlocked(n.id, map)).length;
            return (
              <div key={u.id} className="card p-4! space-y-2">
                <p className="text-xs uppercase tracking-widest text-[var(--accent)]">{u.track}</p>
                <h3 className="font-bold">{u.title}</h3>
                <p className="text-sm text-[var(--muted)]">
                  {open} of {u.nodes.length} concepts unlocked · up to {Math.min(16, open * 2)} questions
                </p>
                {open > 0 ? (
                  <Link href={`/exam/${u.id}`} className="btn-ghost">Take the test</Link>
                ) : (
                  <p className="text-sm text-[var(--muted)]">Unlock a concept first</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
