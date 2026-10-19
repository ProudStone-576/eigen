"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { startExam, submitExam } from "@/app/actions";
import { MathText } from "@/components/MathText";
import { AnswerInput, emptyResponse, isAnswered } from "@/components/questions/AnswerInput";
import type { Response } from "@/lib/check";
import type { ExamQuestion, ExamResult } from "@/lib/learning/exam";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function ExamSession({ scope }: { scope: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Response[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [at, setAt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    startExam({ scope }).then((p) => {
      if ("error" in p) return setError(p.error);
      setTitle(p.title);
      setQuestions(p.questions);
      setAnswers(p.questions.map((q) => emptyResponse(q.item)));
      setFlags(p.questions.map(() => false));
    });
  }, [scope]);

  useEffect(() => {
    if (!questions || result) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [questions, result]);

  if (error) return <div className="card max-w-lg mx-auto space-y-3"><p className="feedback feedback-bad">{error}</p><Link href="/exam" className="btn-ghost">Back to tests</Link></div>;
  if (!questions) return <p className="text-[var(--muted)] text-center">Building your test…</p>;

  const answeredCount = answers.filter(isAnswered).length;

  function submit() {
    start(async () => {
      const r = await submitExam({
        answers: questions!.map((q, i) => ({ nodeId: q.nodeId, itemId: q.item.id, response: isAnswered(answers[i]) ? answers[i] : null })),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if ("error" in r) return setError(r.error);
      setResult(r);
      router.refresh();
      window.scrollTo({ top: 0 });
    });
  }

  if (result) return <Results title={title} result={result} questions={questions} answers={answers} elapsed={elapsed} />;

  const q = questions[at];
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <span className="font-mono text-sm text-[var(--muted)]" title="Time so far">⏱ {clock(elapsed)}</span>
      </div>

      <nav className="flex flex-wrap gap-1.5" aria-label="Questions">
        {questions.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setAt(i)}
            className={`w-9 h-9 rounded-lg border text-sm font-semibold ${i === at ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)]"} ${isAnswered(answers[i]) ? "bg-[var(--landed-bg)]" : ""}`}
            aria-current={i === at}
          >
            {flags[i] ? "⚑" : i + 1}
          </button>
        ))}
      </nav>

      <div className="card space-y-4 min-h-[260px]">
        <div className="flex justify-between gap-2 text-xs uppercase tracking-widest text-[var(--muted)]">
          <span>
            Question {at + 1} of {questions.length} · {q.title}
          </span>
          {q.item.tag && <span>{q.item.tag}</span>}
        </div>
        <MathText as="div" text={q.item.prompt} className="text-lg leading-relaxed" />
        <AnswerInput item={q.item} value={answers[at]} onChange={(r) => setAnswers((a) => a.map((x, i) => (i === at ? r : x)))} />
        <button type="button" className="text-sm underline text-[var(--muted)]" onClick={() => setFlags((f) => f.map((x, i) => (i === at ? !x : x)))}>
          {flags[at] ? "Unflag" : "⚑ Flag to come back to"}
        </button>
      </div>

      <div className="flex justify-between gap-3 flex-wrap">
        <button type="button" className="btn-ghost" disabled={at === 0} onClick={() => setAt((i) => i - 1)}>← Previous</button>
        {at < questions.length - 1 ? (
          <button type="button" className="btn" onClick={() => setAt((i) => i + 1)}>Next →</button>
        ) : confirming ? (
          <span className="flex gap-2 items-center flex-wrap">
            <span className="text-sm">
              {answeredCount}/{questions.length} answered. Submit?
            </span>
            <button type="button" className="btn" disabled={pending} onClick={submit}>{pending ? "Marking…" : "Yes, submit"}</button>
            <button type="button" className="btn-ghost" onClick={() => setConfirming(false)}>Keep going</button>
          </span>
        ) : (
          <button type="button" className="btn" onClick={() => setConfirming(true)}>Finish test</button>
        )}
      </div>
    </div>
  );
}

function answerText(q: ExamQuestion, r: Response): string {
  if (!isAnswered(r)) return "(blank)";
  switch (r.kind) {
    case "mc":
      return q.item.kind === "mc" ? (q.item.options.find((o) => o.id === r.optionId)?.text ?? "") : "";
    case "number":
    case "expression":
      return r.text;
    case "vector":
      return `(${r.values.join(", ")})`;
    case "matrix":
      return r.values.map((row) => `[${row.join(", ")}]`).join(" ");
  }
}

function Results({ title, result, questions, answers, elapsed }: { title: string; result: ExamResult; questions: ExamQuestion[]; answers: Response[]; elapsed: number }) {
  const pct = Math.round((result.score / result.total) * 100);
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card text-center space-y-2 py-8">
        <p className="text-sm uppercase tracking-widest text-[var(--muted)]">{title}</p>
        <p className="text-5xl font-extrabold">{pct}%</p>
        <p className="text-[var(--muted)]">
          {result.score} of {result.total} right · {clock(elapsed)} · +{result.xpGained} XP
        </p>
      </div>

      <section className="card space-y-3">
        <h2 className="text-lg font-bold">By concept</h2>
        <ul className="space-y-3">
          {result.byConcept.map((c) => (
            <li key={c.nodeId} className="space-y-1">
              <div className="flex justify-between gap-3 flex-wrap">
                <span className="font-medium">{c.title}</span>
                <span className="text-sm">
                  {c.right}/{c.total}
                  {c.right < c.total && (
                    <Link href={`/practice/${c.nodeId}`} className="ml-3 underline text-[var(--accent)]">Practice</Link>
                  )}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                <div className={`h-full ${c.right === c.total ? "bg-[var(--solid)]" : "bg-[var(--edge)]"}`} style={{ width: `${(c.right / c.total) * 100}%` }} />
              </div>
              {c.misconceptions.map((m) => (
                <p key={m} className="text-sm text-[var(--mis)]">Mix-up spotted: {m}</p>
              ))}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Every question</h2>
        {questions.map((q, i) => {
          const it = result.items[i];
          const ok = it.status === "correct";
          const right = it.grade?.correctOptionId && q.item.kind === "mc" ? q.item.options.find((o) => o.id === it.grade!.correctOptionId)?.text : null;
          return (
            <div key={q.item.id} className={`card space-y-2 border-l-4 ${ok ? "border-l-[var(--solid)]" : "border-l-[var(--mis)]"}`}>
              <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                {i + 1}. {q.title} {q.item.tag ? `· ${q.item.tag}` : ""}
              </p>
              <MathText as="div" text={q.item.prompt} />
              <p className="text-sm">
                {ok ? "✓" : "✗"} Your answer: <MathText text={answerText(q, answers[i])} />
              </p>
              {!ok && right && (
                <p className="text-sm">
                  Correct: <MathText text={right} />
                </p>
              )}
              {it.grade?.message && <MathText as="p" text={it.grade.message} className="text-sm" />}
              {!ok && it.grade?.explain && <MathText as="p" text={it.grade.explain} className="text-sm text-[var(--muted)]" />}
            </div>
          );
        })}
      </section>

      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/exam" className="btn-ghost">Back to tests</Link>
        <Link href="/learn" className="btn">Back to the map</Link>
      </div>
    </div>
  );
}
