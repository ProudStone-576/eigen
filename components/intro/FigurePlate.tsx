"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { MathText } from "@/components/MathText";
import type { IntroSpec } from "@/lib/content/intro";
import type { IntroState } from "./IntroScene";

const IntroScene = dynamic(() => import("./IntroScene"), { ssr: false });
const DURATION = 9000;

/**
 * The section's opening figure: a 3D scene built from the lesson's own
 * numbers. It plays once when it scrolls into view; the scrubber replays or
 * steps through it, and the live readout is part of the caption.
 */
export function FigurePlate({ spec, number, caption }: { spec: IntroSpec; number: string; caption: string }) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<IntroState>({ p: 0, visible: false });
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);
  const played = useRef(false);
  const hudId = `fig-hud-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        state.current.visible = e.isIntersecting;
        if (e.isIntersecting && e.intersectionRatio > 0.5 && !played.current && !reduce) {
          played.current = true;
          setPlaying(true);
        }
      },
      { threshold: [0, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now() - state.current.p * DURATION;
    const tick = (t: number) => {
      const v = Math.min(1, (t - start) / DURATION);
      state.current.p = v;
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const scrub = (v: number) => {
    setPlaying(false);
    state.current.p = v;
    setP(v);
  };

  return (
    <figure className="tb-figure">
      <div ref={host} className="theme-dark relative aspect-[16/10] w-full overflow-hidden bg-black sm:aspect-[16/8]">
        <IntroScene spec={spec} state={state} hudId={hudId} framing="center" />
        <p id={hudId} aria-live="off" className="pointer-events-none absolute left-4 top-3 right-4 font-mono text-[11px] leading-relaxed text-white/70" />
      </div>
      <div className="mt-2 flex items-center gap-3 font-sans text-sm">
        <button
          type="button"
          className="w-16 text-left text-[var(--accent)] hover:underline underline-offset-4"
          onClick={() => {
            if (p >= 1) state.current.p = 0;
            setPlaying((x) => !x);
          }}
        >
          {playing ? "Pause" : p >= 1 ? "Replay" : "Play"}
        </button>
        <input type="range" min={0} max={1} step={0.001} value={p} onChange={(e) => scrub(Number(e.target.value))} className="flex-1 accent-[var(--fg)]" aria-label="Step through the figure" />
        <span className="text-xs text-[var(--muted)]">Drag the figure to rotate</span>
      </div>
      <figcaption className="tb-caption">
        <span className="font-semibold text-[var(--fg)]">Figure {number}.</span> <MathText text={caption} />
      </figcaption>
    </figure>
  );
}
