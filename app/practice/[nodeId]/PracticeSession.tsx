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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2" aria-label={`${Math.min(streak, need)} of ${need} in a row`}>
          {Array.from({ length: need }, (_, i) => (
            <span key={i} className={`h-3 w-8 rounded-full ${i < streak ? "bg-[var(--solid)]" : "bg-[var(--border)]"}`} />
          ))}
          <span className="text-sm text-[var(--muted)] ml-1">{mastered ? "mastered" : `${Math.min(streak, need)}/${need} in a row`}</span>
        </div>
        <span className="text-sm text-[var(--muted)]">
          {answered.right}/{answered.total} right this session
        </span>
      </div>

      {justMastered && (
        <div className="feedback feedback-ok">
          <p className="font-semibold">{title} is solid.</p>
          <p className="text-sm">{need} in a row on questions you&rsquo;d never seen. It&rsquo;s in your review queue now. Keep going to lock it in, or head back.</p>
          <Link href="/learn" className="underline text-sm">Back to the map</Link>
        </div>
      )}

      <div className="card min-h-[260px]">
        {!q ? (
          <p className="text-[var(--muted)]">Picking a question…</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] flex justify-between gap-2">
              <span>{q.isTarget ? title : `Mixing in: ${q.title}`}</span>
              {q.level && <span title="Difficulty adapts to how you're doing">{["", "● Easy", "●● Medium", "●●● Hard"][q.level]}</span>}
            </p>
            <Question key={q.item.id} nodeId={q.nodeId} item={q.item} retry tutor={tutor} onGraded={onGraded} />
          </div>
        )}
      </div>

      <div className="flex justify-end">
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
          Next question →
        </button>
      </div>
    </div>
  );
}
