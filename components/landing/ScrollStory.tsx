"use client";

import { useScrollProgress } from "./useScrollProgress";

const STEPS = [
  { kicker: "Play", title: "Touch the idea first.", body: "Drag vectors, bend the grid, flip a thousand coins. You build an intuition before you ever see the formula." },
  { kicker: "Predict", title: "Guess. Then watch.", body: "Commit to a prediction, see what really happens, and untangle the mix-up yourself. That's where misconceptions die." },
  { kicker: "Produce", title: "Answer it cold.", body: "A concept turns solid only when you produce the answer unaided: typed maths, vectors, matrices. Checked like a teacher would." },
  { kicker: "Review", title: "Come back at the right time.", body: "Solid ideas return after 1, 2, 4, 8… days, mixed with the concepts they depend on. Miss one and it's back tomorrow." },
];

function Visual({ step, local }: { step: number; local: number }) {
  if (step === 0) {
    // A vector swinging round as you scroll.
    const ang = 0.4 + local * 2.2;
    const x = Math.cos(ang) * 3.2;
    const y = Math.sin(ang) * 3.2;
    return (
      <svg viewBox="-4.5 -4.5 9 9" className="w-full h-full">
        <g transform="scale(1,-1)">
          {Array.from({ length: 9 }, (_, i) => i - 4).map((k) => (
            <g key={k}>
              <line x1={k} y1={-4.5} x2={k} y2={4.5} stroke="var(--grid)" strokeWidth={0.02} />
              <line x1={-4.5} y1={k} x2={4.5} y2={k} stroke="var(--grid)" strokeWidth={0.02} />
            </g>
          ))}
          <line x1={0} y1={0} x2={x} y2={y} stroke="var(--v)" strokeWidth={0.18} strokeLinecap="round" />
          <circle cx={x} cy={y} r={0.28} fill="var(--v)" />
        </g>
        <text x={0} y={4.1} textAnchor="middle" fontSize={0.5} fill="var(--muted)" fontFamily="ui-monospace, monospace">
          ({x.toFixed(1)}, {y.toFixed(1)})
        </text>
      </svg>
    );
  }
  if (step === 1) {
    const picked = local > 0.25;
    const revealed = local > 0.55;
    const opts = ["Still 1/2", "Less than 1/2: tails is due", "More than 1/2: heads is hot"];
    return (
      <div className="w-full max-w-sm space-y-3 p-6">
        <p className="font-semibold">A fair coin landed heads 5 times in a row. P(heads next)?</p>
        {opts.map((o, i) => (
          <div
            key={o}
            className={`rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-500 ${
              revealed && i === 0 ? "border-[var(--solid)] bg-[var(--solid-bg)]" : revealed && i === 1 ? "border-[var(--mis)] bg-[var(--mis-bg)]" : picked && i === 1 ? "border-[var(--accent)]" : "border-[var(--border)]"
            }`}
          >
            {o}
          </div>
        ))}
        <p className={`text-sm text-[var(--muted)] transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-0"}`}>The coin has no memory. Now explain why you thought otherwise.</p>
      </div>
    );
  }
  if (step === 2) {
    const target = "2a - b";
    const typed = target.slice(0, Math.round(Math.min(1, local * 1.6) * target.length));
    const done = local > 0.7;
    return (
      <div className="w-full max-w-sm space-y-4 p-6">
        <p className="font-semibold">First component of 2·(a, 1) − (b, 3)?</p>
        <div className={`rounded-2xl border-2 px-4 py-3 font-mono text-xl transition-colors duration-500 ${done ? "border-[var(--solid)]" : "border-[var(--accent)]"}`}>
          {typed}
          <span className="animate-pulse">|</span>
        </div>
        <p className={`rounded-2xl bg-[var(--ok-bg)] text-[var(--ok-fg)] px-4 py-3 text-sm transition-all duration-500 ${done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          ✓ Correct. Equivalent forms like −b + 2a count too.
        </p>
      </div>
    );
  }
  const days = [1, 2, 4, 8, 16, 32];
  const shown = Math.ceil(local * days.length * 1.2);
  return (
    <div className="w-full max-w-sm p-6">
      <p className="font-semibold mb-4">Next reviews</p>
      <div className="flex items-end gap-2 h-48">
        {days.map((d, i) => (
          <div key={d} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
            <div
              className="w-full rounded-t-xl bg-[var(--accent)] transition-all duration-700"
              style={{ height: i < shown ? `${(Math.log2(d) + 1) * 15}%` : "4%", opacity: i < shown ? 0.35 + i * 0.12 : 0.15 }}
            />
            <span className="text-xs text-[var(--muted)]">{d}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScrollStory() {
  const { ref, p } = useScrollProgress<HTMLDivElement>();
  const raw = p * STEPS.length;
  const step = Math.min(STEPS.length - 1, Math.floor(raw));
  const local = Math.min(1, raw - step);
  return (
    <section id="how" ref={ref} className="full-bleed relative" style={{ height: `${STEPS.length * 100 + 40}vh` }}>
      <div className="sticky top-12 h-[calc(100svh-3rem)] flex items-center">
        <div className="mx-auto w-full max-w-5xl px-4 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative h-56 md:h-72">
            {STEPS.map((s, i) => (
              <div
                key={s.kicker}
                className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ opacity: i === step ? 1 : 0, transform: `translateY(${(i - step) * 28}px)` }}
                aria-hidden={i !== step}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")} · {s.kicker}
                </p>
                <h2 className="mt-3 text-4xl md:text-6xl font-bold leading-[1.02]">{s.title}</h2>
                <p className="mt-4 text-lg text-[var(--muted)] max-w-md">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-[32px] bg-[var(--surface)] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.25)] border border-[color-mix(in_srgb,var(--border)_60%,transparent)] flex items-center justify-center overflow-hidden">
            <div key={step} className="w-full h-full flex items-center justify-center animate-[fadeUp_0.6s_ease-out]">
              <Visual step={step} local={local} />
            </div>
          </div>
        </div>
        {/* Progress dots */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
          {STEPS.map((s, i) => (
            <span key={s.kicker} className={`w-1.5 rounded-full transition-all duration-500 ${i === step ? "h-6 bg-[var(--accent)]" : "h-1.5 bg-[var(--border)]"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
