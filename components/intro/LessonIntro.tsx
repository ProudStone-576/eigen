"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef } from "react";
import { MathText } from "@/components/MathText";
import type { IntroSpec } from "@/lib/content/intro";
import type { IntroState } from "./IntroScene";

const IntroScene = dynamic(() => import("./IntroScene"), { ssr: false });

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const BEATS: [number, number][] = [
  [0, 0.3],
  [0.33, 0.64],
  [0.67, 1],
];
const HEADER = 48;

/**
 * A pinned, scroll-driven opening for a lesson: the concept's title, the
 * question that motivates it, then the one idea, over a 3D scene built from
 * the lesson's own numbers.
 */
export function LessonIntro({
  spec,
  kicker,
  title,
  question,
  questionBody,
  idea,
  startAtLesson = false,
}: {
  spec: IntroSpec;
  kicker: string;
  title: string;
  question: string;
  questionBody: string;
  idea: string;
  /** Students who already have the concept start at the lesson (the intro stays above). */
  startAtLesson?: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  const beats = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const state = useRef<IntroState>({ p: 0, visible: true });
  const hudId = `intro-hud-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!startAtLesson) return;
    // Twice: once now, once after fonts and maths have settled the layout.
    const go = () => document.getElementById("lesson")?.scrollIntoView({ block: "start" });
    go();
    const t = setTimeout(go, 250);
    return () => clearTimeout(t);
  }, [startAtLesson]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - (vh - HEADER);
      const p = Math.min(1, Math.max(0, (HEADER - r.top) / travel));
      state.current.p = p;
      state.current.visible = r.bottom > 0 && r.top < vh;
      if (!state.current.visible) return;
      BEATS.forEach(([s, e], i) => {
        const b = beats.current[i];
        if (!b) return;
        const fin = i === 0 ? 1 : smooth(s, s + 0.06, p);
        const fout = i === BEATS.length - 1 ? 1 : 1 - smooth(e - 0.06, e, p);
        const o = fin * fout;
        b.style.opacity = String(o);
        b.style.transform = `translate3d(0, ${((1 - fin) * 36 - (1 - fout) * 36).toFixed(1)}px, 0)`;
        b.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const skip = () => document.getElementById("lesson")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section ref={section} aria-label={`${title}: introduction`} className="full-bleed theme-dark relative -mt-8 bg-black text-[#f5f5f7]" style={{ height: "300vh" }}>
      <div className="sticky top-12 h-[calc(100svh-3rem)] overflow-hidden">
        <IntroScene spec={spec} state={state} hudId={hudId} />
        <div className="pointer-events-none relative mx-auto h-full max-w-6xl px-6">
          <div className="absolute inset-x-6 bottom-[9svh] md:inset-x-auto md:left-6 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:w-[min(30rem,45%)]">
            <div className="absolute -inset-x-6 -bottom-[9svh] -top-24 -z-10 bg-gradient-to-t from-black via-black/85 to-transparent md:hidden" />
            <div className="relative min-h-[16rem]">
              <div ref={(el) => void (beats.current[0] = el)} className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                <p className="text-sm font-medium text-[#86868b]">{kicker}</p>
                <h1 className="mt-2 text-[clamp(2.75rem,6.5vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">{title}</h1>
                <p className="mt-6 text-xs text-[#86868b]">Scroll to watch it happen · drag to rotate</p>
              </div>
              <div ref={(el) => void (beats.current[1] = el)} className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2" style={{ opacity: 0 }}>
                <p className="text-sm font-medium text-[#86868b]">The question</p>
                <h2 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.03em]">{question}</h2>
                <MathText as="p" text={questionBody} className="mt-4 text-lg leading-relaxed text-[#a1a1a6]" />
              </div>
              <div ref={(el) => void (beats.current[2] = el)} className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2" style={{ opacity: 0 }}>
                <p className="text-sm font-medium text-[#86868b]">The idea</p>
                <MathText as="p" text={idea} className="mt-2 block text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-snug tracking-[-0.02em]" />
                <button type="button" onClick={skip} className="pointer-events-auto mt-8 rounded-full bg-white px-6 py-2.5 font-medium text-black transition hover:bg-white/90 active:scale-[0.97]">
                  Start the lesson ↓
                </button>
              </div>
            </div>
          </div>
          <p id={hudId} aria-live="off" className="absolute right-6 top-6 hidden max-w-[34rem] text-right font-mono text-xs leading-relaxed text-white/75 md:block" />
          <button type="button" onClick={skip} className="pointer-events-auto absolute right-6 bottom-6 hidden rounded-full border border-white/25 px-4 py-1.5 text-xs text-white/80 transition hover:bg-white/10 md:block">
            Skip intro
          </button>
          <button type="button" onClick={skip} className="pointer-events-auto absolute right-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-xs text-white/80 md:hidden">
            Skip
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10">
          <div ref={bar} className="h-full origin-left bg-white/60" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
