"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { answer } from "@/app/actions";
import { MathText, renderMath } from "@/components/MathText";
import type { PublicItem } from "@/lib/content";
import type { Response } from "@/lib/check";

const IDK = "idk"; // mirrors lib/check IDK; that module pulls in mathjs, which the client shouldn't load eagerly
import type { GradeResult } from "@/lib/learning/progress";

export type Graded = GradeResult;

type Props = {
  nodeId: string;
  item: PublicItem;
  /** Diagnostic questions lock after one answer. Production lets you retry. */
  retry?: boolean;
  /** Predictions: show right/wrong but not why. The student resolves the conflict first. */
  hideWhy?: boolean;
  onGraded?: (g: Graded) => void;
};

const tz = () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined);

/** Live preview of a typed expression, rendered as math. */
function ExprPreview({ text }: { text: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    let live = true;
    if (!text.trim()) return setHtml("");
    import("mathjs").then(({ parse }) => {
      try {
        const t = text.replace(/[×·⋅]/g, "*").replace(/[−–]/g, "-");
        if (live) setHtml(renderMath(`$${parse(t).toTex({ implicit: "hide", parenthesis: "auto" })}$`));
      } catch {
        if (live) setHtml("");
      }
    });
    return () => {
      live = false;
    };
  }, [text]);
  return <div className="min-h-8 text-lg" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Grid({ rows, cols, values, onChange, disabled }: { rows: number; cols: number; values: string[][]; onChange: (v: string[][]) => void; disabled: boolean }) {
  return (
    <div className="inline-flex items-stretch gap-1">
      <div className="w-2 border-l-2 border-y-2 rounded-l border-[var(--fg)]" />
      <div className="grid gap-1.5 py-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 4.5rem)` }}>
        {values.map((row, r) =>
          row.map((v, c) => (
            <input
              key={`${r}-${c}`}
              value={v}
              disabled={disabled}
              inputMode="text"
              aria-label={`row ${r + 1}, column ${c + 1}`}
              onChange={(e) => onChange(values.map((rr, i) => (i === r ? rr.map((cc, j) => (j === c ? e.target.value : cc)) : rr)))}
              className="field text-center font-mono"
            />
          )),
        )}
      </div>
      <div className="w-2 border-r-2 border-y-2 rounded-r border-[var(--fg)]" />
    </div>
  );
}

export function Question({ nodeId, item, retry = false, hideWhy = false, onGraded }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Graded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [grid, setGrid] = useState<string[][]>(() =>
    item.kind === "vector"
      ? Array.from({ length: item.size }, () => [""])
      : item.kind === "matrix"
        ? Array.from({ length: item.rows }, () => Array.from({ length: item.cols }, () => ""))
        : [],
  );
  const [misses, setMisses] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const locked = !!result && (result.status === "correct" || (result.status === "wrong" && !retry));

  function submit(response: Response) {
    setError(null);
    start(async () => {
      const r = await answer({ nodeId, itemId: item.id, response, timeZone: tz() });
      if ("error" in r) return setError(r.error);
      setResult(r);
      if (r.xpGained > 0) router.refresh(); // header XP and streak are server-rendered
      if (r.status === "wrong") setMisses((n) => n + 1);
      if (r.status === "correct" || r.status === "wrong") onGraded?.(r);
    });
  }

  function submitTyped() {
    if (item.kind === "vector") submit({ kind: "vector", values: grid.map((r) => r[0]) });
    else if (item.kind === "matrix") submit({ kind: "matrix", values: grid });
    else if (item.kind === "number" || item.kind === "expression") submit({ kind: item.kind, text });
  }

  const tone =
    result?.status === "correct" ? "ok" : result?.status === "wrong" ? "bad" : result ? "warn" : null;

  return (
    <div className="space-y-4">
      <MathText as="div" text={item.prompt} className="text-lg leading-relaxed" />

      {item.kind === "mc" ? (
        <div className="grid gap-2">
          {item.options.map((o) => {
            const isChosen = chosen === o.id;
            const isRight = result?.correctOptionId === o.id;
            const state = !result ? "" : isRight ? "opt-right" : isChosen ? "opt-wrong" : "opt-dim";
            return (
              <button
                key={o.id}
                type="button"
                disabled={locked || pending}
                onClick={() => {
                  setChosen(o.id);
                  submit({ kind: "mc", optionId: o.id });
                }}
                className={`option ${state}`}
              >
                <MathText text={o.text} />
                {result?.optionWhy && !hideWhy && (isChosen || isRight) && (
                  <MathText as="p" text={result.optionWhy[o.id]} className="mt-1 text-sm text-[var(--muted)]" />
                )}
              </button>
            );
          })}
          {!retry && !result && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setChosen(IDK);
                submit({ kind: "mc", optionId: IDK });
              }}
              className="justify-self-start text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--fg)] mt-1"
            >
              I&rsquo;m not sure
            </button>
          )}
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submitTyped();
          }}
        >
          {item.kind === "vector" || item.kind === "matrix" ? (
            <Grid rows={grid.length} cols={grid[0]?.length ?? 1} values={grid} onChange={setGrid} disabled={locked || pending} />
          ) : (
            <>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={locked || pending}
                placeholder={item.kind === "expression" ? "e.g. 2a - b" : "e.g. 3/4"}
                className="field w-full max-w-sm font-mono text-lg"
                autoComplete="off"
                spellCheck={false}
              />
              {item.kind === "expression" && <ExprPreview text={text} />}
            </>
          )}
          {!locked && (
            <div>
              <button type="submit" disabled={pending} className="btn">
                {pending ? "Checking…" : result?.status === "wrong" ? "Try again" : "Check"}
              </button>
            </div>
          )}
        </form>
      )}

      {error && <p className="feedback feedback-warn">{error}</p>}

      {tone && result && (
        <div className={`feedback feedback-${tone}`}>
          <p className="font-semibold">
            {result.status === "correct"
              ? "✓ Correct"
              : hideWhy
                ? "Prediction locked in. Now look:"
                : chosen === IDK
                  ? "Here's the idea"
                : result.status === "wrong"
                  ? "✗ Not quite"
                  : "Hmm"}
            {result.xpGained > 0 && <span className="ml-2 xp-pop">+{result.xpGained} XP</span>}
          </p>
          {result.message && <MathText as="p" text={result.message} />}
          {item.kind !== "mc" && result.explain && (result.status === "correct" || !retry || showSolution) && (
            <MathText as="p" text={result.explain} className="mt-1" />
          )}
          {retry && result.status === "wrong" && misses >= 2 && !showSolution && (
            <button type="button" className="mt-2 text-sm underline" onClick={() => setShowSolution(true)}>
              Show the solution
            </button>
          )}
        </div>
      )}
    </div>
  );
}
