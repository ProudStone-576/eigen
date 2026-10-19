"use client";

import { MathText } from "@/components/MathText";
import type { PublicItem } from "@/lib/content";
import type { Response } from "@/lib/check";

/** Answer entry without grading (exams). The parent owns the value. */
export function emptyResponse(item: PublicItem): Response {
  switch (item.kind) {
    case "mc":
      return { kind: "mc", optionId: "" };
    case "number":
    case "expression":
      return { kind: item.kind, text: "" };
    case "vector":
      return { kind: "vector", values: Array.from({ length: item.size }, () => "") };
    case "matrix":
      return { kind: "matrix", values: Array.from({ length: item.rows }, () => Array.from({ length: item.cols }, () => "")) };
  }
}

export function isAnswered(r: Response): boolean {
  switch (r.kind) {
    case "mc":
      return r.optionId !== "";
    case "number":
    case "expression":
      return r.text.trim() !== "";
    case "vector":
      return r.values.some((v) => v.trim() !== "");
    case "matrix":
      return r.values.some((row) => row.some((v) => v.trim() !== ""));
  }
}

export function AnswerInput({ item, value, onChange, disabled }: { item: PublicItem; value: Response; onChange: (r: Response) => void; disabled?: boolean }) {
  if (item.kind === "mc" && value.kind === "mc") {
    return (
      <div className="grid gap-2">
        {item.options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ kind: "mc", optionId: o.id })}
            className={`option ${value.optionId === o.id ? "border-[var(--accent)]!" : ""}`}
            aria-pressed={value.optionId === o.id}
          >
            <MathText text={o.text} />
          </button>
        ))}
      </div>
    );
  }
  if ((value.kind === "number" || value.kind === "expression") && (item.kind === "number" || item.kind === "expression")) {
    return (
      <input
        value={value.text}
        disabled={disabled}
        onChange={(e) => onChange({ kind: value.kind, text: e.target.value })}
        className="field w-full max-w-sm font-mono text-lg"
        placeholder={item.kind === "expression" ? "e.g. 2a - b" : "e.g. 3/4"}
        autoComplete="off"
        spellCheck={false}
      />
    );
  }
  const grid = value.kind === "vector" ? value.values.map((v) => [v]) : value.kind === "matrix" ? value.values : [];
  const set = (r: number, c: number, s: string) => {
    if (value.kind === "vector") onChange({ kind: "vector", values: value.values.map((v, i) => (i === r ? s : v)) });
    else if (value.kind === "matrix") onChange({ kind: "matrix", values: value.values.map((row, i) => (i === r ? row.map((v, j) => (j === c ? s : v)) : row)) });
  };
  return (
    <div className="inline-flex items-stretch gap-1">
      <div className="w-2 border-l-2 border-y-2 rounded-l border-[var(--fg)]" />
      <div className="grid gap-1.5 py-1.5" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, 4.5rem)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <input key={`${r}-${c}`} value={cell} disabled={disabled} onChange={(e) => set(r, c, e.target.value)} className="field text-center font-mono" aria-label={`row ${r + 1}, column ${c + 1}`} />
          )),
        )}
      </div>
      <div className="w-2 border-r-2 border-y-2 rounded-r border-[var(--fg)]" />
    </div>
  );
}
