"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export type Audience = { id: string; tab: string; title: string; body: string; points: string[]; link: { href: string; label: string } };

/** ARIA tabs: arrow keys move between tabs, only the selected one is in the tab order. */
export function AudienceTabs({ audiences }: { audiences: Audience[] }) {
  const [at, setAt] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const a = audiences[at];
  const move = (i: number) => {
    const n = (i + audiences.length) % audiences.length;
    setAt(n);
    tabs.current[n]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Who Eigen is for" className="flex gap-8 border-b border-white/15">
        {audiences.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={i === at}
            aria-controls={`panel-${x.id}`}
            tabIndex={i === at ? 0 : -1}
            onClick={() => setAt(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") move(at + 1);
              if (e.key === "ArrowLeft") move(at - 1);
            }}
            className={`-mb-px border-b-2 pb-3 text-lg transition-colors ${i === at ? "border-white text-white" : "border-transparent text-[#86868b] hover:text-white"}`}
          >
            {x.tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${a.id}`} aria-labelledby={`tab-${a.id}`} className="grid gap-10 pt-10 md:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em]">{a.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-[#86868b]">{a.body}</p>
          <Link href={a.link.href} className="mt-6 inline-block rounded-full border border-white/30 px-5 py-2 text-sm font-medium transition hover:bg-white/10">
            {a.link.label}
          </Link>
        </div>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {a.points.map((p) => (
            <li key={p} className="py-4 text-[15px] leading-7 text-[#d2d2d7]">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
