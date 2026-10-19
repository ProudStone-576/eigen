"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MathText, renderMath } from "@/components/MathText";
import { Question } from "@/components/questions/Question";
import { WidgetView } from "@/components/widgets/Widgets";
import type { PublicStep } from "@/lib/content";
import type { Status } from "@/lib/learning/rules";

/**
 * A lesson set as a textbook section: one continuous page with numbered
 * blocks (Definition 1.2.1, Theorem 1.2.2, Example 1.2.3), captioned figures,
 * inline checks, a mastery check and leveled exercises.
 */

export const LEVEL_NAME = { 1: "Level I", 2: "Level II", 3: "Level III" } as const;
export const LEVEL_HINT = { 1: "foundations · SAT / school boards", 2: "JEE Main standard", 3: "JEE Advanced standard" } as const;
const stars = (l: 1 | 2 | 3) => "★".repeat(l) + "☆".repeat(3 - l);

export const STATUS_WORD: Record<Status, string> = {
  SOLID: "Mastered",
  LANDED: "Learned",
  EDGE: "In progress",
  MISCONCEPTION: "Revisit",
  UNKNOWN: "Not started",
};

const STATUS_NOTE: Record<Status, string> = {
  SOLID: "You answered the mastery check unaided. This section joins your review schedule: tomorrow, then 2, 4, 8 days apart.",
  LANDED: "You have the idea. Complete the mastery check without notes to mark the section mastered.",
  MISCONCEPTION: "One of your answers points to a common error (described in its feedback). Targeted practice works on exactly that error until it is gone.",
  EDGE: "Answer the checks to show you have the idea, then the mastery check.",
  UNKNOWN: "",
};

function Head({ label, number, name }: { label: string; number?: string; name?: string }) {
  return (
    <span className="tb-head">
      {label}
      {number ? ` ${number}` : ""}
      {name ? <span className="font-normal"> ({name})</span> : null}.{" "}
    </span>
  );
}

function Reveal({ label, children, defaultOpen = false }: { label: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-3">
      <button type="button" onClick={() => setOpen((o) => !o)} className="font-sans text-sm text-[var(--accent)] hover:underline underline-offset-4" aria-expanded={open}>
        {open ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function Section({
  nodeId,
  number,
  title,
  steps,
  initialStatus,
  nextNode,
  tutor,
  figure,
}: {
  nodeId: string;
  number: string;
  title: string;
  steps: PublicStep[];
  initialStatus: Status;
  nextNode: { id: string; title: string; number: string } | null;
  tutor: boolean;
  /** The opening 3D figure (already numbered Figure n.1). */
  figure?: ReactNode;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  let block = 0;
  let fig = figure ? 1 : 0;
  const nextBlock = () => `${number}.${++block}`;
  const nextFig = () => `${number}.${++fig}`;
  let exerciseNo = 0;

  const graded = (s: Status) => setStatus(s);

  return (
    <article className="tb">
      {figure}
      {steps.map((s, i) => {
        switch (s.type) {
          case "motivate":
            return (
              <div key={i} className="tb-block">
                <h2 className="font-serif text-2xl font-semibold">{s.title}</h2>
                <MathText as="p" text={s.body} className="mt-3 block" />
                <div className="tb-aside">
                  <span className="tb-label">In context · {s.realWorld.title}</span>
                  <MathText as="p" text={s.realWorld.body} className="mt-1 block" />
                </div>
              </div>
            );
          case "definition":
            return (
              <div key={i} className="tb-block">
                <Head label="Definition" number={nextBlock()} name={s.term} />
                <MathText text={s.body} />
              </div>
            );
          case "theorem": {
            const n = nextBlock();
            return (
              <div key={i} className="tb-theorem">
                <Head label={s.kind ?? "Theorem"} number={n} name={s.name} />
                <MathText text={s.statement} className="tb-statement" />
                {s.proof && (
                  <div className="tb-proof">
                    {s.proof.map((p, k) => (
                      <p key={k} className={k === 0 ? "" : "mt-2"}>
                        {k === 0 && <span className="italic">Proof. </span>}
                        <MathText text={p} />
                        {k === s.proof!.length - 1 && (
                          <span className="ml-2 whitespace-nowrap" aria-label="end of proof">
                            ∎
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          case "truth":
            return (
              <div key={i} className="tb-theorem">
                <Head label="Key result" number={nextBlock()} />
                <MathText text={s.statement} className="tb-statement" />
                <MathText as="p" text={s.body} className="mt-3 block" />
              </div>
            );
          case "example": {
            const n = nextBlock();
            return (
              <div key={i} className="tb-block">
                <p>
                  <Head label="Example" number={n} name={s.title} />
                  <span className="font-sans text-xs text-[var(--muted)] align-middle" title={LEVEL_HINT[s.level]}>
                    {stars(s.level)} {LEVEL_NAME[s.level]}
                  </span>
                </p>
                <MathText as="div" text={s.problem} className="mt-2 block" />
                <Reveal label="Solution">
                  <div className="solution">
                    <ol>
                      {s.solution.map((line, k) => (
                        <li key={k}>
                          <MathText text={line} />
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2">
                      <span className="font-semibold">Answer: </span>
                      <MathText text={s.result} />
                    </p>
                  </div>
                </Reveal>
              </div>
            );
          }
          case "pitfalls":
            return (
              <div key={i} className="tb-block">
                <p className="tb-label mb-3">Common errors</p>
                <ul className="space-y-3">
                  {s.items.map((p, k) => (
                    <li key={k} className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                      <span className="text-[var(--mis)]">✗</span>
                      <MathText text={p.wrong} />
                      <span className="text-[var(--solid)]">✓</span>
                      <MathText text={p.right} className="text-[var(--muted)]" />
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "formulas":
            return (
              <div key={i} className="tb-box">
                <p className="tb-label mb-2">{s.title ?? "Formulas to know"}</p>
                <table className="w-full">
                  <tbody>
                    {s.rows.map((r, k) => (
                      <tr key={k} className="border-t border-[var(--border)] first:border-0">
                        <td className="py-2 pr-4 align-middle text-[0.98rem] text-[var(--muted)]">
                          <MathText text={r.label} />
                        </td>
                        <td className="py-2 align-middle" dangerouslySetInnerHTML={{ __html: renderMath(`$${r.tex}$`) }} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "explore": {
            const n = nextFig();
            return (
              <figure key={i} className="tb-figure">
                <div className="border border-[var(--border)] bg-[var(--surface)] p-4 font-sans">
                  <WidgetView widget={s.widget} />
                </div>
                <figcaption className="tb-caption">
                  <span className="font-semibold text-[var(--fg)]">Figure {n}.</span> <MathText text={s.title} />. <MathText text={s.body} /> <span className="italic">Try:</span>{" "}
                  <MathText text={s.task} />
                </figcaption>
              </figure>
            );
          }
          case "connect":
            return (
              <div key={i} className="tb-aside">
                <span className="tb-label">Connection</span>
                <MathText as="p" text={s.body} className="mt-1 block" />
              </div>
            );
          case "ml":
            return (
              <div key={i} className="tb-aside">
                <span className="tb-label">{s.title}</span>
                <MathText as="p" text={s.body} className="mt-1 block" />
              </div>
            );
          case "check":
            return (
              <div key={i} className="tb-box font-sans text-base">
                <p className="tb-label mb-3">Check your understanding</p>
                <Question nodeId={nodeId} item={s.item} onGraded={(g) => graded(g.status_after)} />
              </div>
            );
          case "predict":
            return <Predict key={i} nodeId={nodeId} step={s} figNumber={nextFig()} onGraded={graded} />;
          case "produce":
            return (
              <section key={i} className="my-12">
                <div className="tb-rule pt-6">
                  <h2 className="font-serif text-2xl font-semibold">Mastery check</h2>
                  <p className="mt-1 text-[var(--muted)]">Without notes. All correct marks §{number} as mastered and schedules it for review.</p>
                </div>
                <ol className="mt-6 space-y-8 font-sans text-base">
                  {s.items.map((item, k) => (
                    <li key={item.id} className="grid grid-cols-[2rem_1fr]">
                      <span className="font-serif font-semibold">{k + 1}.</span>
                      <Question nodeId={nodeId} item={item} retry tutor={tutor} onGraded={(g) => graded(g.status_after)} />
                    </li>
                  ))}
                </ol>
              </section>
            );
          case "exercises": {
            const levels = ([1, 2, 3] as const).filter((l) => s.items.some((e) => e.level === l));
            return (
              <section key={i} className="my-12">
                <div className="tb-rule pt-6">
                  <h2 className="font-serif text-2xl font-semibold">Exercises {number}</h2>
                  <p className="mt-1 text-[var(--muted)]">Attempt each before reading its solution. Solutions open after your first answer.</p>
                </div>
                {levels.map((l) => (
                  <div key={l} className="mt-8">
                    <p className="tb-label">
                      {LEVEL_NAME[l]} · {LEVEL_HINT[l]}
                    </p>
                    <ol className="mt-4 space-y-8 font-sans text-base">
                      {s.items
                        .filter((e) => e.level === l)
                        .map((e) => (
                          <li key={e.item.id} className="grid grid-cols-[2rem_1fr]">
                            <span className="font-serif font-semibold">{++exerciseNo}.</span>
                            <Question nodeId={nodeId} item={e.item} retry tutor={tutor} onGraded={(g) => graded(g.status_after)} />
                          </li>
                        ))}
                    </ol>
                  </div>
                ))}
              </section>
            );
          }
        }
      })}

      <footer className="tb-rule mt-14 pt-6 font-sans text-base">
        <p>
          <span className="tb-label">Status of §{number}</span> <span className="ml-2 font-medium">{STATUS_WORD[status]}</span>
        </p>
        {STATUS_NOTE[status] && <p className="mt-1 text-[var(--muted)]">{STATUS_NOTE[status]}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/practice/${nodeId}`} className="btn-ghost">Practise §{number}</Link>
          {nextNode && (
            <Link href={`/learn/${nextNode.id}`} className="btn">
              §{nextNode.number} {nextNode.title} →
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}

function Predict({
  nodeId,
  step,
  figNumber,
  onGraded,
}: {
  nodeId: string;
  step: Extract<PublicStep, { type: "predict" }>;
  figNumber: string;
  onGraded: (s: Status) => void;
}) {
  const [predicted, setPredicted] = useState(false);
  return (
    <div className="tb-box font-sans text-base">
      <p className="tb-label mb-3">Predict before reading on</p>
      <Question nodeId={nodeId} item={step.item} hideWhy onGraded={(g) => (setPredicted(true), onGraded(g.status_after))} />
      {predicted && (
        <div className="mt-6 space-y-5 border-t border-[var(--border)] pt-5">
          {step.reveal.widget && (
            <figure>
              <WidgetView widget={step.reveal.widget} />
              <figcaption className="tb-caption">
                <span className="font-semibold text-[var(--fg)]">Figure {figNumber}.</span> What actually happens.
              </figcaption>
            </figure>
          )}
          <MathText as="p" text={step.reveal.body} className="block tb" />
          <Question nodeId={nodeId} item={step.resolve} onGraded={(g) => onGraded(g.status_after)} />
        </div>
      )}
    </div>
  );
}
