"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Progress 0 → 1 while a tall section scrolls past a pinned (sticky) viewport:
 * 0 when its top reaches the top of the screen, 1 when its bottom reaches the bottom.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      setP(travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { ref, p };
}

/** Map p from [a, b] onto [0, 1], clamped, with ease-in-out. */
export function segment(p: number, a: number, b: number) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
