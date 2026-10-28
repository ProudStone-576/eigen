"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type MenuPart = { key: string; label: string; track: string; href: string; chapters: { id: string; label: string; title: string; href: string }[] };

/**
 * "Courses" opens a two-pane menu: parts on the left, the chosen part's
 * chapters on the right. Escape or a click outside closes it.
 */
export function CoursesMenu({ parts }: { parts: MenuPart[] }) {
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return setAt(null);
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chosen = at === null ? null : parts[at];

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="courses-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium hover:text-[var(--accent)]"
      >
        Courses
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div id="courses-menu" className="absolute left-0 top-[calc(100%+0.75rem)] z-[80] flex w-[min(44rem,calc(100vw-2rem))] border border-[var(--rule)] bg-[var(--surface)]">
          <nav aria-label="Courses menu" className="w-[45%] shrink-0 border-r border-[var(--border)] py-2">
            <ul
              role="menu"
              aria-label="Parts"
              onKeyDown={(e) => {
                const i = items.current.findIndex((b) => b === document.activeElement);
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const n = (i + (e.key === "ArrowDown" ? 1 : parts.length - 1)) % parts.length;
                  items.current[n]?.focus();
                }
              }}
            >
              {parts.map((p, i) => (
                <li key={p.key} role="none">
                  <button
                    ref={(el) => {
                      items.current[i] = el;
                    }}
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={at === i}
                    onClick={() => setAt(i)}
                    onMouseEnter={() => setAt(i)}
                    onFocus={() => setAt(i)}
                    className={`flex w-full items-baseline gap-3 px-4 py-2 text-left text-sm ${at === i ? "bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] text-[var(--accent)]" : "hover:text-[var(--accent)]"}`}
                  >
                    <span className="w-8 shrink-0 tb-label">{p.label}</span>
                    <span className="flex-1">{p.track}</span>
                    <span aria-hidden>›</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 flex-1 p-4">
            {chosen ? (
              <>
                <Link href={chosen.href} className="font-serif text-lg font-semibold hover:text-[var(--accent)]">
                  {chosen.track}
                </Link>
                <ol className="mt-2 max-h-[60vh] space-y-0.5 overflow-y-auto text-sm">
                  {chosen.chapters.map((c) => (
                    <li key={c.id}>
                      <Link href={c.href} className="flex gap-2 py-1 hover:text-[var(--accent)]">
                        <span className="w-6 shrink-0 tabular-nums text-[var(--muted)]">{c.label}</span>
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ol>
                <Link href={chosen.href} className="link-more mt-3 text-sm">
                  The whole course
                </Link>
              </>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-[var(--muted)]">Choose a part to see its chapters.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
