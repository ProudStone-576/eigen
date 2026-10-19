import Link from "next/link";
import { ConceptMap, STATUS_STYLE } from "@/components/ConceptMap";
import { requireUser } from "@/lib/auth/session";
import { course } from "@/lib/content";
import { dueNodes, loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import { PRACTICE_STREAK, type Status } from "@/lib/learning/rules";
import { strugglingNodes } from "@/lib/learning/practice";

export const metadata = { title: "Learn" };

export default async function LearnPage() {
  const user = await requireUser();
  const progress = await loadProgress(user.id);
  const status = statusIn(progress);
  const due = dueNodes(progress);
  const struggling = await strugglingNodes(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[var(--muted)]">Hi {user.name.split(" ")[0]} 👋</p>
        <h1 className="text-3xl font-extrabold">{course.title}</h1>
      </div>

      {due.length > 0 && (
        <Link href="/review" className="card-soft flex items-center justify-between gap-4 hover:opacity-90">
          <span>
            <strong>
              {due.length} concept{due.length > 1 ? "s" : ""} due for review.
            </strong>{" "}
            Recall first, while it&rsquo;s fresh.
          </span>
          <span className="btn">Review</span>
        </Link>
      )}

      <Link href="/exam" className="card-soft flex items-center justify-between gap-4 hover:opacity-90">
        <span>
          <strong>Test yourself.</strong> Unit tests and mock exams: every kind of question, graded together, with a breakdown of what to revisit.
        </span>
        <span className="btn-ghost">Tests</span>
      </Link>

      {struggling.length > 0 && (
        <section className="card space-y-3 border-[var(--edge)]">
          <h2 className="font-bold">🎯 Needs practice</h2>
          <p className="text-sm text-[var(--muted)]">
            These keep tripping you up. Practice gives fresh questions on each, mixed with the ideas underneath, until you get them right{" "}
            {PRACTICE_STREAK} times in a row.
          </p>
          <ul className="space-y-2">
            {struggling.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 flex-wrap">
                <span>
                  <strong>{s.title}</strong> <span className="text-sm text-[var(--muted)]">· {s.reason}</span>
                </span>
                <Link href={`/practice/${s.id}`} className="btn">
                  Practice
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {course.units.map((unit, i) => {
        const trackStart = i === 0 || course.units[i - 1].track !== unit.track;
        const state: Record<string, Status | "LOCKED"> = Object.fromEntries(
          unit.nodes.map((n) => [n.id, unlocked(n.id, progress) ? status(n.id) : "LOCKED"]),
        );
        const solid = unit.nodes.filter((n) => status(n.id) === "SOLID").length;
        const next = unit.nodes.find((n) => state[n.id] !== "LOCKED" && state[n.id] !== "SOLID");
        return (
          <div key={unit.id} className="space-y-3">
          {trackStart && <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] pt-2">{unit.track}</h2>}
          <section className="card space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{unit.title}</h2>
                <p className="text-[var(--muted)]">{unit.blurb}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--muted)]">
                  {solid} / {unit.nodes.length} solid
                </p>
                {next && (
                  <Link href={`/learn/${next.id}`} className="btn mt-2">
                    {state[next.id] === "UNKNOWN" ? "Start" : "Continue"}: {next.title}
                  </Link>
                )}
              </div>
            </div>
            <ConceptMap nodes={unit.nodes} state={state} />
            <ul className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
              {(["UNKNOWN", "EDGE", "LANDED", "SOLID", "MISCONCEPTION", "LOCKED"] as const).map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded"
                    style={{ background: STATUS_STYLE[s].fill, border: `2px solid ${STATUS_STYLE[s].stroke}` }}
                  />
                  {STATUS_STYLE[s].label}
                </li>
              ))}
            </ul>
          </section>
          </div>
        );
      })}

      <p className="text-sm text-[var(--muted)]">One story across every track: data as vectors, uncertainty as probability, learning as gradient descent on a likelihood, and neural networks putting it all together.</p>
    </div>
  );
}
