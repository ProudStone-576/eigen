"use client";

import Link from "next/link";
import { useState } from "react";
import { Question } from "@/components/questions/Question";
import type { PublicItem } from "@/lib/content";

export function ReviewSession({ cards }: { cards: { nodeId: string; title: string; item: PublicItem }[] }) {
  const [index, setIndex] = useState(0);
  const [graded, setGraded] = useState(false);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<{ nodeId: string; title: string }[]>([]);

  if (index >= cards.length) {
    return (
      <div className="card text-center space-y-4">
        <h2 className="text-2xl font-bold">
          {score} / {cards.length} recalled
        </h2>
        <p className="text-[var(--muted)]">Recalled ones wait longer next time. Missed ones come back tomorrow.</p>
        {missed.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm">Rebuild what slipped before it comes back:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {missed.map((m) => (
                <Link key={m.nodeId} href={`/practice/${m.nodeId}`} className="chip">
                  Practice {m.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        <Link href="/learn" className="btn">
          Back to the map
        </Link>
      </div>
    );
  }

  const card = cards[index];
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
        {index + 1} / {cards.length} · {card.title}
      </p>
      <div className="card">
        <Question
          key={card.item.id + index}
          nodeId={card.nodeId}
          item={card.item}
          onGraded={(g) => {
            setGraded(true);
            if (g.status === "correct") setScore((s) => s + 1);
            else setMissed((m) => [...m, { nodeId: card.nodeId, title: card.title }]);
          }}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="btn"
          disabled={!graded}
          onClick={() => {
            setGraded(false);
            setIndex((i) => i + 1);
          }}
        >
          {index === cards.length - 1 ? "Finish" : "Next →"}
        </button>
      </div>
    </div>
  );
}
