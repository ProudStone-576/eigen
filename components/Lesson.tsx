"use client";

import Link from "next/link";
import { useState } from "react";
import { MathText } from "@/components/MathText";
import { Question, type Graded } from "@/components/questions/Question";
import { WidgetView } from "@/components/widgets/Widgets";
import type { PublicStep } from "@/lib/content";
import type { Status } from "@/lib/learning/rules";

const LABEL: Record<PublicStep["type"], string> = {
  motivate: "Why",
  explore: "Play",
  truth: "Key idea",
  connect: "Connect",
  check: "Check",
  predict: "Predict",
  ml: "In ML",
  produce: "Produce",
};

const STATUS_COPY: Record<Status, { title: string; body: string }> = {
  SOLID: { title: "Solid 🎉", body: "You produced it unaided. It's in your review queue for tomorrow, then the gaps grow: 2, 4, 8 days…" },
  LANDED: { title: "Landed", body: "You've got the idea. Nail the produce step to make it solid." },
  MISCONCEPTION: { title: "Something to untangle", body: "One of your answers points to a common mix-up. Run the lesson again: the predict step is built to sort it out." },
  EDGE: { title: "In progress", body: "Keep going. Answer the check to land this concept." },
  UNKNOWN: { title: "Not started", body: "" },
};

function StepView({ nodeId, step, tutor, onDone }: { nodeId: string; step: PublicStep; tutor: boolean; onDone: (g?: Graded) => void }) {
  const [predicted, setPredicted] = useState(false);
  const [producedOk, setProducedOk] = useState<Record<string, boolean>>({});

  switch (step.type) {
    case "motivate":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{step.title}</h2>
          <MathText as="p" text={step.body} className="text-lg leading-relaxed" />
          <div className="card-soft">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">Real life · {step.realWorld.title}</p>
            <MathText as="p" text={step.realWorld.body} className="mt-1" />
          </div>
        </div>
      );
    case "explore":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{step.title}</h2>
          <MathText as="p" text={step.body} />
          <WidgetView widget={step.widget} />
          <div className="card-soft">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">Your move</p>
            <MathText as="p" text={step.task} />
          </div>
        </div>
      );
    case "truth":
      return (
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">Always true</p>
          <MathText as="div" text={step.statement} className="text-xl leading-relaxed font-medium card-key" />
          <MathText as="p" text={step.body} className="text-lg leading-relaxed" />
        </div>
      );
    case "connect":
      return (
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">How it connects</p>
          <MathText as="p" text={step.body} className="text-lg leading-relaxed" />
        </div>
      );
    case "ml":
      return (
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">🤖 {step.title}</p>
          <MathText as="p" text={step.body} className="text-lg leading-relaxed" />
        </div>
      );
    case "check":
      return (
        <div className="space-y-3">
          <p className="text-sm text-[var(--muted)]">Quick check. &ldquo;I&rsquo;m not sure&rdquo; is fine; a lucky guess hides what you need.</p>
          <Question nodeId={nodeId} item={step.item} onGraded={(g) => onDone(g)} />
        </div>
      );
    case "predict":
      return (
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">Commit to a prediction first. Then see what really happens.</p>
          <Question nodeId={nodeId} item={step.item} hideWhy onGraded={() => setPredicted(true)} />
          {predicted && (
            <div className="space-y-4 border-t border-[var(--border)] pt-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">What actually happens</p>
              <WidgetView widget={step.reveal.widget} />
              <MathText as="p" text={step.reveal.body} className="text-lg" />
              <Question nodeId={nodeId} item={step.resolve} onGraded={(g) => onDone(g)} />
            </div>
          )}
        </div>
      );
    case "produce":
      return (
        <div className="space-y-6">
          <MathText as="p" text={step.body} className="text-lg" />
          {step.items.map((item) => (
            <div key={item.id} className="card">
              <Question
                nodeId={nodeId}
                item={item}
                retry
                tutor={tutor}
                onGraded={(g) => {
                  if (g.status !== "correct") return;
                  const next = { ...producedOk, [item.id]: true };
                  setProducedOk(next);
                  if (step.items.every((i) => next[i.id])) onDone(g);
                }}
              />
            </div>
          ))}
        </div>
      );
  }
}

const needsAnswer = (s: PublicStep) => s.type === "check" || s.type === "predict" || s.type === "produce";

export function Lesson({ nodeId, title, steps, initialStatus, nextNode, tutor = false }: { nodeId: string; title: string; steps: PublicStep[]; initialStatus: Status; nextNode: { id: string; title: string } | null; tutor?: boolean }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [status, setStatus] = useState<Status>(initialStatus);
  const [finished, setFinished] = useState(false);
  const step = steps[index];
  const produceIndex = steps.findIndex((s) => s.type === "produce");
  const canContinue = !needsAnswer(step) || done[index];
  const isLast = index === steps.length - 1;

  if (finished) {
    const copy = STATUS_COPY[status];
    return (
      <div className="card text-center space-y-4 py-10">
        <h2 className="text-3xl font-bold">{copy.title}</h2>
        <p className="text-lg text-[var(--muted)] max-w-md mx-auto">{copy.body}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/learn" className="btn-ghost">Back to the map</Link>
          {nextNode && status !== "MISCONCEPTION" && (
            <Link href={`/learn/${nextNode.id}`} className="btn">Next: {nextNode.title} →</Link>
          )}
          {status === "MISCONCEPTION" && (
            <button type="button" className="btn" onClick={() => location.reload()}>Run it again</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold text-[var(--muted)]">{title}</h1>
        {index < produceIndex && status !== "SOLID" && (
          <button type="button" className="text-sm underline text-[var(--muted)]" onClick={() => setIndex(produceIndex)}>
            Already know this? Skip to produce
          </button>
        )}
      </div>

      <ol className="flex gap-1.5" aria-label="Lesson steps">
        {steps.map((s, i) => (
          <li key={i} className="flex-1">
            <span
              title={LABEL[s.type]}
              className={`block h-1.5 rounded-full ${i < index || done[i] ? "bg-[var(--accent)]" : i === index ? "bg-[var(--accent)]/50" : "bg-[var(--border)]"}`}
            />
          </li>
        ))}
      </ol>
      <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
        {index + 1} / {steps.length} · {LABEL[step.type]}
      </p>

      <div className="card min-h-[320px]">
        <StepView
          key={index}
          nodeId={nodeId}
          step={step}
          tutor={tutor}
          onDone={(g) => {
            setDone((d) => ({ ...d, [index]: true }));
            if (g) setStatus(g.status_after);
          }}
        />
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn-ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          ← Back
        </button>
        <button
          type="button"
          className="btn"
          disabled={!canContinue && step.type !== "produce"}
          onClick={() => (isLast ? setFinished(true) : setIndex((i) => i + 1))}
        >
          {isLast ? (done[index] ? "Finish" : "Finish for now") : "Continue →"}
        </button>
      </div>
    </div>
  );
}
