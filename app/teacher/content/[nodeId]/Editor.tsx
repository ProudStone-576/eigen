"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MathText } from "@/components/MathText";
import { saveCustomItem } from "../../actions";
import type { CustomItemInput } from "@/lib/content/customSchema";

type Kind = CustomItemInput["kind"];
type Option = { text: string; correct: boolean; why: string; misconception: string };
type Wrong = { value: string; message: string; misconception: string };

export type EditorInitial = { id?: string; data?: CustomItemInput; inPractice?: boolean; inReview?: boolean };

const KINDS: { kind: Kind; label: string }[] = [
  { kind: "mc", label: "Multiple choice" },
  { kind: "number", label: "Number" },
  { kind: "vector", label: "Vector" },
  { kind: "matrix", label: "Matrix" },
  { kind: "expression", label: "Typed expression" },
];

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function Editor({ nodeId, misconceptions, initial, onDone }: { nodeId: string; misconceptions: Record<string, string>; initial?: EditorInitial; onDone?: () => void }) {
  const router = useRouter();
  const d = initial?.data;
  const [kind, setKind] = useState<Kind>(d?.kind ?? "mc");
  const [prompt, setPrompt] = useState(d?.prompt ?? "");
  const [explain, setExplain] = useState(d && "explain" in d ? d.explain : "");
  const [options, setOptions] = useState<Option[]>(
    d?.kind === "mc"
      ? d.options.map((o) => ({ text: o.text, correct: o.correct, why: o.why, misconception: o.misconception ?? "" }))
      : [
          { text: "", correct: true, why: "", misconception: "" },
          { text: "", correct: false, why: "", misconception: "" },
        ],
  );
  const [answer, setAnswer] = useState(d?.kind === "number" ? String(d.answer) : "");
  const [tolerance, setTolerance] = useState(d?.kind === "number" && d.tolerance ? String(d.tolerance) : "");
  const [cells, setCells] = useState<string[][]>(
    d?.kind === "vector" ? d.answer.map((x) => [String(x)]) : d?.kind === "matrix" ? d.answer.map((r) => r.map(String)) : [["", ""], ["", ""]],
  );
  const [upToScale, setUpToScale] = useState(d?.kind === "vector" ? Boolean(d.upToScale) : false);
  const [correct, setCorrect] = useState(d?.kind === "expression" ? d.correct : "");
  const [wrong, setWrong] = useState<Wrong[]>(d?.kind === "expression" ? d.wrong.map((w) => ({ value: w.value, message: w.message, misconception: w.misconception ?? "" })) : []);
  const [inPractice, setInPractice] = useState(initial?.inPractice ?? true);
  const [inReview, setInReview] = useState(initial?.inReview ?? true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const vectorCells = kind === "vector" ? cells.map((r) => [r[0] ?? ""]) : cells;

  function build(): CustomItemInput {
    switch (kind) {
      case "mc":
        return { kind, prompt, options: options.map((o) => ({ ...o, misconception: o.misconception || undefined })) };
      case "number":
        return { kind, prompt, answer: num(answer), tolerance: tolerance ? num(tolerance) : undefined, explain };
      case "vector":
        return { kind, prompt, answer: vectorCells.map((r) => num(r[0])), upToScale, explain };
      case "matrix":
        return { kind, prompt, answer: cells.map((r) => r.map(num)), explain };
      case "expression":
        return { kind, prompt, correct, wrong: wrong.map((w) => ({ ...w, misconception: w.misconception || undefined })), explain };
    }
  }

  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveCustomItem({ nodeId, id: initial?.id, data: build(), inPractice, inReview });
      if (!r.ok) return setMsg({ ok: false, text: r.error });
      setMsg({ ok: true, text: initial?.id ? "Saved." : "Added. Students will see it in practice/review." });
      router.refresh();
      if (!initial?.id) {
        setPrompt("");
        setExplain("");
        setAnswer("");
        setCorrect("");
        setWrong([]);
      }
      onDone?.();
    });
  }

  const misSelect = (value: string, onChange: (v: string) => void) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="field text-sm">
      <option value="">No misconception</option>
      {Object.entries(misconceptions).map(([id, text]) => (
        <option key={id} value={id}>
          {text}
        </option>
      ))}
    </select>
  );

  const resize = (rows: number, cols: number) =>
    setCells((cur) => Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => cur[i]?.[j] ?? "")));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.kind}
            type="button"
            className={`chip ${kind === k.kind ? "chip-on" : ""}`}
            onClick={() => {
              setKind(k.kind);
              if (k.kind === "vector") resize(2, 1);
              if (k.kind === "matrix" && cells[0]?.length === 1) resize(2, 2);
            }}
          >
            {k.label}
          </button>
        ))}
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Question</span>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="field w-full" placeholder="Use $...$ for math, e.g. What is $\det\begin{bmatrix}1&2\\3&4\end{bmatrix}$?" />
      </label>
      {prompt && (
        <div className="card-soft">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Preview</p>
          <MathText as="div" text={prompt} className="text-lg" />
        </div>
      )}

      {kind === "mc" && (
        <div className="space-y-3">
          {options.map((o, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] p-3 space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="correct"
                  checked={o.correct}
                  onChange={() => setOptions((os) => os.map((x, j) => ({ ...x, correct: j === i })))}
                  aria-label="Correct option"
                />
                <input value={o.text} onChange={(e) => setOptions((os) => os.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} className="field flex-1" placeholder={`Option ${i + 1}`} />
                {options.length > 2 && (
                  <button type="button" className="text-sm text-[var(--muted)]" onClick={() => setOptions((os) => os.filter((_, j) => j !== i))}>
                    Remove
                  </button>
                )}
              </div>
              {o.text && <MathText text={o.text} className="text-sm block" />}
              <input value={o.why} onChange={(e) => setOptions((os) => os.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))} className="field w-full text-sm" placeholder={o.correct ? "Why it's right" : "Why it's wrong"} />
              {!o.correct && misSelect(o.misconception, (v) => setOptions((os) => os.map((x, j) => (j === i ? { ...x, misconception: v } : x))))}
            </div>
          ))}
          {options.length < 6 && (
            <button type="button" className="chip" onClick={() => setOptions((os) => [...os, { text: "", correct: false, why: "", misconception: "" }])}>
              + Add option
            </button>
          )}
        </div>
      )}

      {kind === "number" && (
        <div className="flex flex-wrap gap-3">
          <label className="space-y-1">
            <span className="text-sm font-medium block">Answer</span>
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="field font-mono" inputMode="decimal" placeholder="e.g. 0.75" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium block">Tolerance (optional)</span>
            <input value={tolerance} onChange={(e) => setTolerance(e.target.value)} className="field font-mono" inputMode="decimal" placeholder="e.g. 0.01" />
          </label>
        </div>
      )}

      {(kind === "vector" || kind === "matrix") && (
        <div className="space-y-2">
          <div className="flex gap-3 text-sm items-center flex-wrap">
            <label>
              Rows{" "}
              <select value={vectorCells.length} onChange={(e) => resize(Number(e.target.value), kind === "vector" ? 1 : cells[0].length)} className="field">
                {[2, 3, 4].map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
            {kind === "matrix" && (
              <label>
                Columns{" "}
                <select value={cells[0].length} onChange={(e) => resize(cells.length, Number(e.target.value))} className="field">
                  {[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
            )}
            {kind === "vector" && (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={upToScale} onChange={(e) => setUpToScale(e.target.checked)} /> Accept any non-zero multiple
              </label>
            )}
          </div>
          <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${vectorCells[0].length}, 4.5rem)` }}>
            {vectorCells.map((row, i) =>
              row.map((c, j) => (
                <input
                  key={`${i}-${j}`}
                  value={c}
                  onChange={(e) => setCells((cur) => cur.map((r, a) => (a === i ? r.map((x, b) => (b === j ? e.target.value : x)) : r)))}
                  className="field text-center font-mono"
                  aria-label={`row ${i + 1} column ${j + 1}`}
                />
              )),
            )}
          </div>
        </div>
      )}

      {kind === "expression" && (
        <div className="space-y-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Correct expression</span>
            <input value={correct} onChange={(e) => setCorrect(e.target.value)} className="field w-full font-mono" placeholder="e.g. 2*a - b" />
            <span className="text-xs text-[var(--muted)]">Any equivalent form a student types will be accepted.</span>
          </label>
          {wrong.map((w, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] p-3 space-y-2">
              <div className="flex gap-2">
                <input value={w.value} onChange={(e) => setWrong((ws) => ws.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} className="field flex-1 font-mono" placeholder="A common wrong answer" />
                <button type="button" className="text-sm text-[var(--muted)]" onClick={() => setWrong((ws) => ws.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
              <input value={w.message} onChange={(e) => setWrong((ws) => ws.map((x, j) => (j === i ? { ...x, message: e.target.value } : x)))} className="field w-full text-sm" placeholder="Message to show when a student types this" />
              {misSelect(w.misconception, (v) => setWrong((ws) => ws.map((x, j) => (j === i ? { ...x, misconception: v } : x))))}
            </div>
          ))}
          {wrong.length < 5 && (
            <button type="button" className="chip" onClick={() => setWrong((ws) => [...ws, { value: "", message: "", misconception: "" }])}>
              + Add a common wrong answer
            </button>
          )}
        </div>
      )}

      {kind !== "mc" && (
        <label className="block space-y-1">
          <span className="text-sm font-medium">Explanation (shown after answering)</span>
          <input value={explain} onChange={(e) => setExplain(e.target.value)} className="field w-full" placeholder="Why the answer is what it is" />
        </label>
      )}

      <div className="flex flex-wrap gap-4 text-sm items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inPractice} onChange={(e) => setInPractice(e.target.checked)} /> Use in practice
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inReview} onChange={(e) => setInReview(e.target.checked)} /> Use in review
        </label>
      </div>

      {msg && <p className={`feedback ${msg.ok ? "feedback-ok" : "feedback-bad"} text-sm`}>{msg.text}</p>}
      <button type="button" className="btn" disabled={pending} onClick={save}>
        {pending ? "Checking…" : initial?.id ? "Save changes" : "Add question"}
      </button>
    </div>
  );
}
