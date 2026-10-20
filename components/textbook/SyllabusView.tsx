import Link from "next/link";
import type { ReactNode } from "react";
import { allNodes, getNode } from "@/lib/content";
import { chapterNumber, parts, sectionNumber } from "@/lib/content/numbering";
import type { Status } from "@/lib/learning/rules";
import type { assignmentProgress } from "@/lib/learning/summary";

const WORD: Record<Status | "LOCKED", string> = {
  SOLID: "Mastered",
  LANDED: "Learned",
  EDGE: "In progress",
  MISCONCEPTION: "Revisit",
  UNKNOWN: "Not started",
  LOCKED: "Locked",
};
const TONE: Record<Status | "LOCKED", string> = {
  SOLID: "text-[var(--solid)]",
  LANDED: "text-[var(--landed)]",
  EDGE: "text-[var(--edge)]",
  MISCONCEPTION: "text-[var(--mis)]",
  UNKNOWN: "text-[var(--muted)]",
  LOCKED: "text-[var(--muted)] opacity-60",
};
const fmt = (d: Date) => d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });

function AgendaRow({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <li className="grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-4 border-t border-[var(--border)] py-3 first:border-0 sm:grid-cols-[7.5rem_1fr_auto]">
      <span className="tb-label">{label}</span>
      <span>{children}</span>
      <span className="text-sm">{action}</span>
    </li>
  );
}

export type SyllabusData = {
  name: string;
  streakDays: number;
  statusOf: Record<string, Status>;
  unlockedIds: string[];
  due: string[];
  assigned: { a: { id: string; title: string; note: string | null; dueAt: Date | null; unitId: string | null }; pr: ReturnType<typeof assignmentProgress> }[];
  struggling: { id: string; title: string; reason: string }[];
};

/** The syllabus page, given plain data (also rendered by the dev preview). */
export function SyllabusView({ name, streakDays, statusOf, unlockedIds, due, assigned, struggling }: SyllabusData) {
  const open = new Set(unlockedIds);
  const status = (id: string): Status => statusOf[id] ?? "UNKNOWN";
  const unlocked = (id: string) => open.has(id);
  const state = (id: string): Status | "LOCKED" => (unlocked(id) ? status(id) : "LOCKED");
  const user = { name, streakDays };
  const mastered = allNodes.filter((n) => status(n.id) === "SOLID").length;
  const cont = allNodes.find((n) => state(n.id) === "EDGE") ?? allNodes.find((n) => state(n.id) === "UNKNOWN") ?? null;

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="font-serif text-4xl font-semibold">Syllabus</h1>
        <p className="mt-2 text-[var(--muted)]">
          {user.name} · {mastered} of {allNodes.length} sections mastered{user.streakDays > 0 ? ` · ${user.streakDays}-day streak` : ""}
        </p>
      </header>

      <ul className="mt-8 border-y border-[var(--rule)]">
        {cont && (
          <AgendaRow label="Continue" action={<Link href={`/learn/${cont.id}`} className="link-more">Open</Link>}>
            <Link href={`/learn/${cont.id}`} className="hover:text-[var(--accent)]">
              {sectionNumber(cont.id)} {cont.title}
            </Link>
          </AgendaRow>
        )}
        {due.length > 0 && (
          <AgendaRow label="Review due" action={<Link href="/review" className="link-more">Review</Link>}>
            {due.length} section{due.length === 1 ? "" : "s"}:{" "}
            <span className="text-[var(--muted)]">
              {due
                .slice(0, 4)
                .map((id) => `${sectionNumber(id)} ${getNode(id)?.title}`)
                .join(", ")}
              {due.length > 4 ? ", …" : ""}
            </span>
          </AgendaRow>
        )}
        {assigned.map(({ a, pr }) => {
          const next = pr.next ? getNode(pr.next) : null;
          return (
            <AgendaRow
              key={a.id}
              label="Assigned"
              action={
                next && unlocked(next.id) ? (
                  <Link href={`/learn/${next.id}`} className="link-more">{sectionNumber(next.id)}</Link>
                ) : !next && a.unitId && !pr.exam ? (
                  <Link href={`/exam/${a.unitId}`} className="link-more">Take the test</Link>
                ) : null
              }
            >
              {a.title}{" "}
              <span className={pr.overdue ? "text-[var(--mis)]" : "text-[var(--muted)]"}>
                · {pr.conceptsDone} of {pr.concepts} sections{a.unitId ? (pr.exam ? " · test done" : " · plus a chapter test") : ""}
                {a.dueAt ? ` · ${pr.overdue ? "was due" : "due"} ${fmt(a.dueAt)}` : ""}
              </span>
              {a.note && <span className="block text-sm text-[var(--muted)]">{a.note}</span>}
            </AgendaRow>
          );
        })}
        {struggling.map((s) => (
          <AgendaRow key={s.id} label="Revisit" action={<Link href={`/practice/${s.id}`} className="link-more">Practise</Link>}>
            {sectionNumber(s.id)} {s.title} <span className="text-[var(--muted)]">· {s.reason}</span>
          </AgendaRow>
        ))}
        <AgendaRow label="Tests" action={<Link href="/exam" className="link-more">Tests</Link>}>
          Chapter tests and mock exams, timed and graded together.
        </AgendaRow>
      </ul>

      <div className="mt-12 space-y-14">
        {parts.map((part) => {
          const nodes = part.units.flatMap((u) => u.nodes);
          const done = nodes.filter((n) => status(n.id) === "SOLID").length;
          return (
            <section key={part.track}>
              <div className="flex items-baseline justify-between border-b border-[var(--fg)] pb-2">
                <h2 className="font-serif text-2xl font-semibold">
                  <span className="text-[var(--muted)]">Part {part.roman}</span> {part.track}
                </h2>
                <span className="text-sm tabular-nums text-[var(--muted)]">
                  {done} / {nodes.length} mastered
                </span>
              </div>
              {part.units.map((u) => {
                const ch = chapterNumber(u);
                const m = u.nodes.filter((n) => status(n.id) === "SOLID").length;
                const l = u.nodes.filter((n) => status(n.id) === "LANDED").length;
                return (
                  <div key={u.id} className="mt-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-lg font-semibold">
                        Chapter {ch} <span className="font-normal">· {u.title}</span>
                      </h3>
                      <span className="flex items-center gap-2 text-xs text-[var(--muted)] tabular-nums" title={`${m} mastered, ${l} learned`}>
                        <span className="flex h-1.5 w-24 overflow-hidden bg-[var(--border)]">
                          <span className="bg-[var(--solid)]" style={{ width: `${(100 * m) / u.nodes.length}%` }} />
                          <span className="bg-[var(--landed)]" style={{ width: `${(100 * l) / u.nodes.length}%` }} />
                        </span>
                        {m}/{u.nodes.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{u.blurb}</p>
                    <ol className="mt-3">
                      {u.nodes.map((n) => {
                        const st = state(n.id);
                        const needs = st === "LOCKED" ? n.deps.filter((d) => !["LANDED", "SOLID"].includes(status(d))) : [];
                        const row = (
                          <>
                            <span className="w-12 shrink-0 tabular-nums text-[var(--muted)]">{sectionNumber(n.id)}</span>
                            <span className={st === "LOCKED" ? "text-[var(--muted)]" : ""}>{n.title}</span>
                            <span className="dotleader" aria-hidden />
                            <span className={`shrink-0 text-sm ${TONE[st]}`}>
                              {WORD[st]}
                              {needs.length > 0 && <span className="hidden sm:inline"> · needs {sectionNumber(needs[0])}</span>}
                            </span>
                          </>
                        );
                        return (
                          <li key={n.id}>
                            {st === "LOCKED" ? (
                              <div className="flex items-baseline py-1.5">{row}</div>
                            ) : (
                              <Link href={`/learn/${n.id}`} className="flex items-baseline py-1.5 hover:text-[var(--accent)]">
                                {row}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <p className="mt-14 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
        Sections unlock when the sections they assume are learned.{" "}
        <Link href="/learn/map" className="text-[var(--accent)] hover:underline underline-offset-4">
          View the dependency map
        </Link>
        .
      </p>
    </div>
  );
}

