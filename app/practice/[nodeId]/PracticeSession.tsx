"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { nextPractice } from "@/app/actions";
import { Question, type Graded } from "@/components/questions/Question";
import type { PracticeQuestion } from "@/lib/learning/practice";

export function PracticeSession({ nodeId, title, alreadySolid, tutor, need }: { nodeId: string; title: string; alreadySolid: boolean; tutor: boolean; need: number }) {
  const [index, setIndex] = useState(0);
  const [q, setQ] = useState<PracticeQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [graded, setGraded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [mastered, setMastered] = useState(alreadySolid);
  const [justMastered, setJustMastered] = useState(false);
  const [answered, setAnswered] = useState({ right: 0, total: 0 });

  const load = useCallback(
    async (i: number) => {
      setQ(null);
      setGraded(false);
      const r = await nextPractice({ nodeId, index: i });
      if ("error" in r) setError(r.error);
      else setQ(r);
    },
    [nodeId],
  );

  useEffect(() => {
    load(0);
  }, [load]);

  function onGraded(g: Graded) {
    setGraded(true);
    setAnswered((a) => ({ right: a.right + (g.status === "correct" ? 1 : 0), total: a.total + 1 }));
    if (q?.isTarget && g.practiceStreak !== undefined) setStreak(g.practiceStreak);
    if (g.mastered) {
      setMastered(true);
      setJustMastered(true);
    }
  }

  if (error) return <p className="feedback feedback-bad">{error}</p>;

  return (
    <div className="space-y-4">
      {justMastered && (
        <div className="feedback feedback-ok">
          <p className="font-semibold">{title} is solid.</p>
          <p className="text-sm">{need} in a row on questions you&rsquo;d never seen. It&rsquo;s in your review queue now. Keep going to lock it in, or head back.</p>
          <Link href="/learn" className="underline text-sm">Back to the syllabus</Link>
        </div>
      )}

      <div className="min-h-[260px] border-t border-[var(--fg)] pt-5">
        {!q ? (
          <p className="text-[var(--muted)]">Picking a question…</p>
        ) : (
          <div className="space-y-3">
            <p className="tb-label flex justify-between gap-2">
              <span>{q.isTarget ? title : `Mixing in: ${q.title}`}</span>
              {q.level && <span title="Difficulty adapts to how you're doing">Level {["", "I", "II", "III"][q.level]}</span>}
            </p>
            <Question key={q.item.id} nodeId={q.nodeId} item={q.item} retry tutor={tutor} onGraded={onGraded} />
          </div>
        )}
      </div>

      {/* The task bar: progress towards mastery on the left, the next step on the right. */}
      <div className="sticky bottom-0 z-40 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] bg-[var(--bg)] py-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">{mastered ? "Mastered" : `Get ${need} in a row`}</span>
          <span className="flex items-center gap-1.5" role="img" aria-label={`${Math.min(streak, need)} of ${need} in a row`}>
            {Array.from({ length: need }, (_, i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-full border ${i < streak || mastered ? "border-[var(--solid)] bg-[var(--solid)]" : "border-[var(--rule)]"}`} />
            ))}
          </span>
          <span className="hidden text-[var(--muted)] sm:inline">
            · {answered.right} of {answered.total} right this session
          </span>
        </div>
        <button
          type="button"
          className="btn"
          // No skipping: dodging the hard ones would fake the streak.
          disabled={!q || !graded}
          onClick={() => {
            const i = index + 1;
            setIndex(i);
            load(i);
          }}
        >
          Next question
        </button>
      </div>
    </div>
  );
}
