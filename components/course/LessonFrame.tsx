"use client";

import { useEffect, useState, type ReactNode } from "react";

const KEY = "eigen.contents.hidden";

/**
 * The lesson with its chapter contents in a left panel (below the lesson on
 * small screens). The panel can be hidden; the choice is remembered per browser.
 */
export function LessonFrame({ panel, children }: { panel: ReactNode; children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);
  const toggle = (h: boolean) => {
    setHidden(h);
    try {
      localStorage.setItem(KEY, h ? "1" : "0");
    } catch {}
  };

  return (
    <div className={`mx-auto grid max-w-6xl gap-x-12 gap-y-12 ${hidden ? "lg:grid-cols-[minmax(0,44rem)] lg:justify-center" : "lg:grid-cols-[16rem_minmax(0,44rem)]"}`}>
      <aside className={`order-2 border-t border-[var(--rule)] pt-6 lg:order-1 lg:border-0 lg:pt-0 ${hidden ? "lg:hidden" : ""}`} aria-label="Chapter contents">
        <div className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pr-2">
          <button type="button" onClick={() => toggle(true)} aria-expanded="true" aria-controls="lesson-contents" className="mb-3 hidden text-xs text-[var(--muted)] hover:text-[var(--fg)] lg:inline">
            ‹ Hide contents
          </button>
          <div id="lesson-contents">{panel}</div>
        </div>
      </aside>
      <div className="order-1 min-w-0 lg:order-2">
        {hidden && (
          <button type="button" onClick={() => toggle(false)} aria-expanded="false" aria-controls="lesson-contents" className="mb-4 hidden text-xs text-[var(--muted)] hover:text-[var(--fg)] lg:inline">
            Show contents ›
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
