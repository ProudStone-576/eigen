"use client";

import Link from "next/link";
import { segment, useScrollProgress } from "./useScrollProgress";

type M = [number, number, number, number]; // a b / c d, rows

const I: M = [1, 0, 0, 1];
const SHEAR: M = [1, 1, 0, 1];
const STRETCH: M = [1.5, 0.5, 0.5, 1.5]; // eigenvectors (1, 1) ×2 and (1, −1) ×1
const lerp = (x: M, y: M, t: number): M => x.map((v, i) => v + (y[i] - v) * t) as M;
const f = (n: number) => (Math.round(n * 100) / 100).toFixed(2).replace(/\.?0+$/, "") || "0";

const CAPTIONS = [
  { at: 0.12, title: "This is space.", body: "A grid of every point in the plane. Keep scrolling." },
  { at: 0.42, title: "A matrix moves all of it.", body: "Shear: î stays put, ĵ slides over. Every grid line follows." },
  { at: 0.72, title: "Some directions only stretch.", body: "Along the dashed lines, points stay on their own line. Those are eigenvectors." },
];

export function HeroGrid() {
  const { ref, p } = useScrollProgress<HTMLDivElement>();
  const m = p < 0.55 ? lerp(I, SHEAR, segment(p, 0.25, 0.5)) : lerp(SHEAR, STRETCH, segment(p, 0.58, 0.85));
  const [a, b, c, d] = m;
  const intro = 1 - segment(p, 0.02, 0.14);
  const eig = segment(p, 0.7, 0.85);
  const caption = [...CAPTIONS].reverse().find((x) => p >= x.at - 0.1);
  const lines = Array.from({ length: 21 }, (_, i) => i - 10);

  return (
    <section ref={ref} className="full-bleed relative" style={{ height: "300vh" }}>
      <div className="sticky top-12 h-[calc(100svh-3rem)] overflow-hidden flex flex-col items-center justify-center">
        {/* The plane */}
        <svg viewBox="-6 -6 12 12" className="absolute inset-0 m-auto h-[115%] w-[115%] max-w-none" style={{ opacity: 0.35 + 0.65 * (1 - intro) }} aria-hidden>
          <g transform="scale(1,-1)">
            <g transform={`matrix(${a} ${c} ${b} ${d} 0 0)`}>
              {lines.map((k) => (
                <g key={k}>
                  <line x1={k} y1={-10} x2={k} y2={10} stroke={k === 0 ? "var(--axis)" : "var(--grid)"} strokeWidth={k === 0 ? 1.6 : 0.8} vectorEffect="non-scaling-stroke" />
                  <line x1={-10} y1={k} x2={10} y2={k} stroke={k === 0 ? "var(--axis)" : "var(--grid)"} strokeWidth={k === 0 ? 1.6 : 0.8} vectorEffect="non-scaling-stroke" />
                </g>
              ))}
            </g>
            {/* Eigen-directions of the final matrix */}
            <g opacity={eig}>
              <line x1={-8} y1={-8} x2={8} y2={8} stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
              <line x1={-8} y1={8} x2={8} y2={-8} stroke="var(--b)" strokeWidth={2} strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
            </g>
            {/* Basis vectors: where î and ĵ land are the matrix's columns */}
            <line x1={0} y1={0} x2={a} y2={c} stroke="var(--i)" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <line x1={0} y1={0} x2={b} y2={d} stroke="var(--j)" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <circle cx={a} cy={c} r={0.12} fill="var(--i)" />
            <circle cx={b} cy={d} r={0.12} fill="var(--j)" />
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_78%)]" />

        {/* Intro headline, fades as the story starts */}
        <div className="relative text-center px-4 space-y-6" style={{ opacity: intro, transform: `translateY(${(1 - intro) * -40}px) scale(${0.96 + 0.04 * intro})` }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Eigen</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95]">
            The math of ML.
            <br />
            <span className="text-gradient">Felt, not memorised.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg sm:text-xl text-[var(--muted)]">Linear algebra, statistics and calculus you can drag, predict and break, one concept at a time.</p>
          <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn">Start learning</Link>
            <a href="#how" className="btn-ghost">See how it works</a>
          </div>
          <p className="text-xs text-[var(--muted)] pt-6 animate-bounce">Scroll ↓</p>
        </div>

        {/* Scroll captions */}
        {caption && intro < 0.5 && (
          <div key={caption.title} className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[min(92vw,34rem)] text-center rounded-3xl bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] backdrop-blur-xl px-6 py-5 shadow-lg animate-[fadeUp_0.5s_ease-out]">
            <p className="text-2xl sm:text-3xl font-bold">{caption.title}</p>
            <p className="mt-1 text-[var(--muted)]">{caption.body}</p>
            <p className="mt-3 font-mono text-sm text-[var(--muted)]">
              [ {f(a)} {f(b)} ; {f(c)} {f(d)} ]
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
