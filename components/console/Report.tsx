import Link from "next/link";
import { chapterMastery, examTable, hardestSections, misconceptionTable } from "@/lib/analytics";
import { sectionNumber } from "@/lib/content/numbering";
import type { reportData } from "@/lib/org/analytics";

type Data = Awaited<ReturnType<typeof reportData>>;

const pct = (x: number) => `${Math.round(100 * x)}%`;

function Meter({ value, faint }: { value: number; faint?: number }) {
  return (
    <div className="meter" aria-hidden>
      {faint !== undefined && <span style={{ width: `${100 * faint}%`, background: "var(--rule)" }} />}
      <span style={{ width: `${100 * value}%` }} />
    </div>
  );
}

/** The report a teacher or admin reads: where the cohort stands chapter by chapter, what trips it up, and how tests go. */
export function Report({ data, exportHref }: { data: Data; exportHref: string }) {
  const chapters = chapterMastery(data.statuses, data.students);
  const hardest = hardestSections(data.accuracy);
  const mis = misconceptionTable(data.misconceptions);
  const exams = examTable(data.exams);
  const peakWeek = Math.max(1, ...data.weekly.map((w) => w.n));

  if (data.students === 0) return <p className="text-[var(--muted)]">No students in scope yet.</p>;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-[var(--muted)]">
          {data.students} student{data.students === 1 ? "" : "s"} in scope. Figures update as students answer.
        </p>
        <a href={exportHref} className="btn-ghost">
          Download gradebook (CSV)
        </a>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Mastery by chapter</h2>
        <p className="text-sm text-[var(--muted)]">Share of student–section pairs. Dark: mastered (produced unaided). Light: learned but not yet mastered.</p>
        <table className="ledger">
          <thead>
            <tr>
              <th>Chapter</th>
              <th className="num">Learned</th>
              <th className="num">Mastered</th>
              <th className="w-2/5" />
            </tr>
          </thead>
          <tbody>
            {chapters.map((c) => (
              <tr key={c.unitId}>
                <td>
                  <span className="tabular-nums text-[var(--muted)] mr-2">{c.chapter}</span>
                  {c.title}
                  <span className="block text-xs text-[var(--muted)]">{c.track}</span>
                </td>
                <td className="num">{pct(c.learned)}</td>
                <td className="num">{pct(c.mastered)}</td>
                <td className="align-middle">
                  <Meter value={c.mastered} faint={c.learned} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Hardest sections</h2>
          <p className="text-sm text-[var(--muted)]">Lowest share of correct answers in the last 30 days (sections with at least 20 answers).</p>
          {hardest.length === 0 ? (
            <p className="text-[var(--muted)]">Not enough answers yet.</p>
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Section</th>
                  <th className="num">Answers</th>
                  <th className="num">Correct</th>
                </tr>
              </thead>
              <tbody>
                {hardest.map((h) => (
                  <tr key={h.nodeId}>
                    <td>
                      <span className="tabular-nums text-[var(--muted)] mr-2">§{sectionNumber(h.nodeId)}</span>
                      {h.title}
                    </td>
                    <td className="num">{h.total}</td>
                    <td className={`num ${h.accuracy < 0.5 ? "text-[var(--mis)]" : ""}`}>{pct(h.accuracy)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Misconceptions held now</h2>
          <p className="text-sm text-[var(--muted)]">Students whose latest answers point to each error.</p>
          {mis.length === 0 ? (
            <p className="text-[var(--muted)]">None at the moment.</p>
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Misconception</th>
                  <th className="num">Students</th>
                </tr>
              </thead>
              <tbody>
                {mis.map((m) => (
                  <tr key={`${m.nodeId}${m.text}`}>
                    <td>
                      <span className="font-medium">{m.title}.</span> <span className="text-[var(--muted)]">{m.text}</span>
                      <Link href={`/teacher/content/${m.nodeId}`} className="block text-xs text-[var(--accent)] hover:underline underline-offset-4 mt-0.5">
                        Write a question for it
                      </Link>
                    </td>
                    <td className="num text-[var(--mis)]">{m.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Tests</h2>
          {exams.length === 0 ? (
            <p className="text-[var(--muted)]">No tests taken yet.</p>
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Test</th>
                  <th className="num">Students</th>
                  <th className="num">Sittings</th>
                  <th className="num">Mean</th>
                  <th className="num">Best</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => (
                  <tr key={e.scope}>
                    <td>{e.title}</td>
                    <td className="num">{e.takers}</td>
                    <td className="num">{e.attempts}</td>
                    <td className="num">{pct(e.mean)}</td>
                    <td className="num">{pct(e.best)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Active students per week</h2>
          {data.weekly.length === 0 ? (
            <p className="text-[var(--muted)]">No activity in the last eight weeks.</p>
          ) : (
            <table className="ledger">
              <thead>
                <tr>
                  <th>Week of</th>
                  <th className="num">Students</th>
                  <th className="w-1/2" />
                </tr>
              </thead>
              <tbody>
                {data.weekly.map((w) => (
                  <tr key={w.week}>
                    <td className="tabular-nums">{w.week}</td>
                    <td className="num">
                      {w.n} <span className="text-[var(--muted)]">({pct(w.n / data.students)})</span>
                    </td>
                    <td className="align-middle">
                      <Meter value={w.n / peakWeek} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
