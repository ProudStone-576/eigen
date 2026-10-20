"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchEntry = { id: string; title: string; where: string; terms: string[] };

/** Rank: title starts with the query, then title contains it, then a glossary term or the unit does. */
export function searchConcepts(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries.slice(0, limit);
  const score = (e: SearchEntry) => {
    const t = e.title.toLowerCase();
    if (t.startsWith(q)) return 0;
    if (t.split(/[\s,&]+/).some((w) => w.startsWith(q))) return 1;
    if (t.includes(q)) return 2;
    if (e.terms.some((x) => x.toLowerCase().includes(q))) return 3;
    if (e.where.toLowerCase().includes(q)) return 4;
    return 9;
  };
  return entries
    .map((e) => ({ e, s: score(e) }))
    .filter((x) => x.s < 9)
    .sort((a, b) => a.s - b.s || a.e.title.length - b.e.title.length || a.e.title.localeCompare(b.e.title))
    .slice(0, limit)
    .map((x) => x.e);
}

/** ⌘K / Ctrl+K (or "/") opens a quick jump to any concept. */
export function Search({ entries, compact = false }: { entries: SearchEntry[]; compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [at, setAt] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchConcepts(entries, q), [entries, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!open) return;
    setQ("");
    setAt(0);
    requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  const go = (e?: SearchEntry) => {
    if (!e) return;
    setOpen(false);
    router.push(`/learn/${e.id}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={compact ? "p-1.5 text-[var(--muted)] hover:text-[var(--fg)]" : "flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] hover:text-[var(--fg)]"}
        aria-label="Search concepts"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        {!compact && (
          <>
            Search <kbd className="font-sans opacity-70">⌘K</kbd>
          </>
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 pt-[12vh]" onMouseDown={() => setOpen(false)} role="presentation">
          <div role="dialog" aria-modal="true" aria-label="Search concepts" className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <input
              ref={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setAt(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
                if (e.key === "ArrowDown") (e.preventDefault(), setAt((i) => Math.min(results.length - 1, i + 1)));
                if (e.key === "ArrowUp") (e.preventDefault(), setAt((i) => Math.max(0, i - 1)));
                if (e.key === "Enter") go(results[at]);
              }}
              placeholder="Search concepts and terms…"
              className="w-full border-b border-[var(--border)] bg-transparent px-5 py-4 text-lg outline-none"
              role="combobox"
              aria-expanded="true"
              aria-controls="search-results"
              aria-activedescendant={results[at] ? `sr-${results[at].id}` : undefined}
            />
            <ul id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">Nothing matches &ldquo;{q}&rdquo;.</li>}
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`sr-${r.id}`}
                  role="option"
                  aria-selected={i === at}
                  onMouseEnter={() => setAt(i)}
                  onClick={() => go(r)}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 ${i === at ? "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]" : ""}`}
                >
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-[var(--muted)]">{r.where}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
