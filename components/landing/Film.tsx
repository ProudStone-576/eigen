"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { ACT_VIEW, smooth, VARIANCE_KEPT } from "./filmMath";
import type { FilmState } from "./FilmScene";

const FilmScene = dynamic(() => import("./FilmScene"), { ssr: false });

type Act = { kicker?: string; title: ReactNode; body: ReactNode; hud?: ReactNode; height: number };

const Hud = ({ id, label, pre }: { id: string; label: string; pre?: boolean }) => (
  <div className="mt-8 border-t border-white/15 pt-4">
    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#86868b]">{label}</p>
    <p data-hud={id} className={`mt-1.5 font-mono text-sm text-white/90 ${pre ? "whitespace-pre leading-snug" : ""}`} />
  </div>
);

const ACTS: Act[] = [
  {
    title: "Eigen",
    body: (
      <>
        Exam-level mathematics, from first principles to the hardest problems. <span className="text-white">Made visible.</span>
      </>
    ),
    height: 170,
  },
  {
    kicker: "Linear algebra",
    title: "One matrix. Every point.",
    body: (
      <>
        <span className="text-white">4,096 points, one 3 × 3 matrix.</span> Each point lands at Mx, so the whole of space bends at once. Except one direction: the gold line only stretches. That&rsquo;s an eigenvector.
      </>
    ),
    hud: (
      <>
        <Hud id="matrix" label="M, live" pre />
        <p data-hud="eigen" className="mt-2 font-mono text-sm text-[#ffc35a] opacity-0 transition-opacity" />
      </>
    ),
    height: 240,
  },
  {
    kicker: "Beyond three dimensions",
    title: "Four dimensions. Same rules.",
    body: (
      <>
        A tesseract, rotating through a plane you can&rsquo;t point to, projected into three. <span className="text-white">Nothing new is needed.</span> It&rsquo;s still just a matrix acting on vectors.
      </>
    ),
    hud: <Hud id="tesseract" label="Rotation" />,
    height: 230,
  },
  {
    kicker: "Statistics",
    title: "Data has a shape.",
    body: (
      <>
        A cloud of measurements stretches more in some directions than others. <span className="text-white">PCA finds those directions,</span> then flattens the rest: three dimensions in, two out, {(VARIANCE_KEPT * 100).toFixed(1)}% of the variance kept.
      </>
    ),
    hud: <Hud id="pca" label="Principal components" />,
    height: 240,
  },
  {
    kicker: "Calculus",
    title: "Learning is walking downhill.",
    body: (
      <>
        A loss surface, and gradient descent finding its lowest point one step at a time. <span className="text-white">Every model you&rsquo;ve heard of trains like this.</span>
      </>
    ),
    hud: <Hud id="descent" label="Gradient descent" />,
    height: 240,
  },
  {
    kicker: "Neural networks",
    title: "Put it together, and it learns.",
    body: (
      <>
        Vectors flow through layers of matrices, nonlinearities bend them, gradients tune every weight. <span className="text-white">A neural network is everything above, at once.</span>
      </>
    ),
    hud: <Hud id="network" label="Architecture" />,
    height: 230,
  },
  {
    title: "Start with a vector.",
    body: (
      <>
        68 concepts, from your first arrow to a trained network. Every one of them <span className="text-white">something you can move.</span>
      </>
    ),
    height: 150,
  },
];

export function Film() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const state = useRef<FilmState>({ act: 0, local: 0, visible: true });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = [...el.querySelectorAll<HTMLElement>("[data-act]")];
    const texts = [...el.querySelectorAll<HTMLElement>("[data-act-text]")];
    const last = sections.length - 1;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const vh = window.innerHeight;
      const probe = vh * 0.5;
      let act = 0;
      let local = 0;
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (probe >= r.top) {
          act = i;
          local = Math.min(1, (probe - r.top) / r.height);
        }
      });
      const bottom = el.getBoundingClientRect().bottom;
      state.current.act = act;
      state.current.local = local;
      state.current.visible = bottom > 0;
      if (stage.current) stage.current.style.opacity = String(smooth(0.15 * vh, 0.85 * vh, bottom));
      texts.forEach((t, i) => {
        const L = i === act ? local : i < act ? 1 : 0;
        const fin = i === 0 ? 1 : smooth(0.04, 0.16, L);
        const fout = i === last ? 1 : 1 - smooth(0.56, 0.68, L);
        const o = fin * fout;
        t.style.opacity = String(o);
        t.style.transform = `translate3d(0, ${((1 - fin) * 48 - (1 - fout) * 48).toFixed(1)}px, 0)`;
        t.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={root} className="force-dark full-bleed relative bg-black text-white">
      <div ref={stage} className="fixed inset-0 z-0">
        <FilmScene state={state} />
      </div>
      {ACTS.map((a, i) => {
        const side = ACT_VIEW[i].side;
        const align = side === 0 ? "items-center text-center mx-auto" : side === 1 ? "md:mr-auto" : "md:ml-auto";
        return (
          <section key={i} data-act={i} className="relative z-10 pointer-events-none" style={{ height: `${a.height}vh` }}>
            <div
              className={`sticky top-0 h-svh mx-auto max-w-6xl px-6 flex ${
                i === 0 ? "items-start pt-[11svh]" : i === ACTS.length - 1 ? "items-end pb-[14svh]" : "items-end pb-[10svh] md:items-center md:pb-0"
              }`}
            >
              <div data-act-text={i} className={`relative w-full max-w-md flex flex-col ${align} will-change-transform`}>
                {/* Scrim keeps text readable over particles on phones. */}
                <div className="absolute -inset-x-6 -bottom-[10svh] top-[-4rem] -z-10 bg-gradient-to-t from-black via-black/80 to-transparent md:hidden" />
                {a.kicker && <p className="mb-3 text-sm font-medium text-[#86868b]">{a.kicker}</p>}
                {i === 0 ? (
                  <h1 className="text-[clamp(4.5rem,15vw,11rem)] font-semibold leading-[0.9] tracking-[-0.045em]">{a.title}</h1>
                ) : (
                  <h2 className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{a.title}</h2>
                )}
                <p className={`mt-5 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-relaxed text-[#86868b] ${i === 0 ? "max-w-lg" : ""}`}>{a.body}</p>
                {a.hud}
                {i === 0 && <p className="mt-10 text-xs text-[#86868b]">Scroll to explore · Drag to rotate</p>}
                {i === ACTS.length - 1 && (
                  <div className="mt-9 flex flex-wrap gap-3 pointer-events-auto justify-center">
                    <Link href="/signup" className="rounded-full bg-white px-7 py-3 font-medium text-black transition hover:bg-white/90 active:scale-[0.97]">
                      Get started
                    </Link>
                    <Link href="/login" className="rounded-full border border-white/30 px-7 py-3 font-medium text-white transition hover:bg-white/10 active:scale-[0.97]">
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
