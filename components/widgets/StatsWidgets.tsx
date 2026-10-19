"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Vec } from "@/lib/content/types";
import { renderMath } from "@/components/MathText";

// ---------- shared bits ----------

const fmt = (n: number, dp = 2) => String(Math.round(n * 10 ** dp) / 10 ** dp + 0); // +0 turns -0 into 0
const pct = (n: number, dp = 1) => `${fmt(n * 100, dp)}%`;
const Tex = ({ src }: { src: string }) => <span dangerouslySetInnerHTML={{ __html: renderMath(`$${src}$`) }} />;

function Slider({ label, value, min, max, step, onChange, show }: { label: ReactNode; value: number; min: number; max: number; step: number; onChange: (n: number) => void; show?: string }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm text-[var(--muted)]">
        <span>{label}</span>
        <span className="font-mono text-[var(--fg)]">{show ?? fmt(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
    </label>
  );
}

function Box({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

/** A plain chart frame: maps data coords to an SVG box. */
function chart(w: number, h: number, x0: number, x1: number, y0: number, y1: number, pad = 28) {
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0)) * (w - 2 * pad);
  const sy = (y: number) => h - pad - ((y - y0) / (y1 - y0)) * (h - 2 * pad);
  return { sx, sy, w, h, pad };
}

// ---------- Simulation: coin or die ----------

export function SimWidget({ die }: { die: boolean }) {
  const [running, setRunning] = useState<number[]>([]); // running fraction / average after each trial
  const [total, setTotal] = useState(0);
  const [last, setLast] = useState<number[]>([]);
  const truth = die ? 3.5 : 0.5;

  function run(n: number) {
    let sum = total;
    const next = [...running];
    const outcomes: number[] = [];
    for (let i = 0; i < n && next.length < 2000; i++) {
      const x = die ? 1 + Math.floor(Math.random() * 6) : Math.random() < 0.5 ? 1 : 0;
      outcomes.push(x);
      sum += x;
      next.push(sum / (next.length + 1));
    }
    setRunning(next);
    setTotal(sum);
    setLast(outcomes.slice(-12));
  }

  const c = chart(420, 200, 0, Math.max(10, running.length), die ? 1 : 0, die ? 6 : 1);
  const path = running.map((y, i) => `${i ? "L" : "M"}${c.sx(i + 1)},${c.sy(y)}`).join(" ");
  const current = running.at(-1);
  return (
    <Box>
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[460px] rounded-2xl bg-[var(--plane)]">
        <line x1={c.sx(0)} x2={c.sx(Math.max(10, running.length))} y1={c.sy(truth)} y2={c.sy(truth)} stroke="var(--solid)" strokeDasharray="6 5" />
        <text x={c.w - c.pad} y={c.sy(truth) - 6} textAnchor="end" fontSize={12} fill="var(--solid)">
          {die ? "3.5" : "0.5"}
        </text>
        <line x1={c.pad} x2={c.pad} y1={c.pad} y2={c.h - c.pad} stroke="var(--axis)" />
        <line x1={c.pad} x2={c.w - c.pad} y1={c.h - c.pad} y2={c.h - c.pad} stroke="var(--axis)" />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} />
      </svg>
      <div className="flex flex-wrap gap-2">
        {[1, 10, 100, 1000].map((n) => (
          <button key={n} type="button" className="chip" onClick={() => run(n)}>
            {die ? "Roll" : "Flip"} ×{n}
          </button>
        ))}
        <button type="button" className="chip" onClick={() => (setRunning([]), setTotal(0), setLast([]))}>
          Reset
        </button>
      </div>
      <p className="text-sm">
        Trials: <strong>{running.length}</strong>
        {current !== undefined && (
          <>
            {" "}· {die ? "average so far" : "fraction of heads"}: <strong>{fmt(current, 3)}</strong>
          </>
        )}
        {last.length > 0 && (
          <span className="block text-[var(--muted)] font-mono">
            last: {last.map((x) => (die ? x : x ? "H" : "T")).join(" ")}
          </span>
        )}
      </p>
    </Box>
  );
}

// ---------- Bayes grid: 1,000 people ----------

export function BayesWidget({ prevalence: p0, sensitivity: s0, falsePositive: f0 }: { prevalence: number; sensitivity: number; falsePositive: number }) {
  const [prev, setPrev] = useState(p0);
  const [sens, setSens] = useState(s0);
  const [fpr, setFpr] = useState(f0);
  const N = 1000;
  const sick = Math.round(N * prev);
  const tp = Math.round(sick * sens);
  const fp = Math.round((N - sick) * fpr);
  const exact = (prev * sens) / (prev * sens + (1 - prev) * fpr);
  const cols = 40;
  const cell = 10;
  const kind = (i: number) => (i < sick ? (i < tp ? "tp" : "fn") : i - sick < fp ? "fp" : "tn");
  const fill: Record<string, string> = { tp: "var(--mis)", fn: "none", fp: "var(--edge)", tn: "var(--grid)" };
  return (
    <Box>
      <svg viewBox={`0 0 ${cols * cell} ${(N / cols) * cell}`} className="w-full max-w-[460px] rounded-xl bg-[var(--plane)] p-1">
        {Array.from({ length: N }, (_, i) => {
          const k = kind(i);
          return (
            <circle
              key={i}
              cx={(i % cols) * cell + cell / 2}
              cy={Math.floor(i / cols) * cell + cell / 2}
              r={3.6}
              fill={fill[k]}
              stroke={k === "fn" ? "var(--mis)" : "none"}
              strokeWidth={1.2}
            />
          );
        })}
      </svg>
      <ul className="flex flex-wrap gap-4 text-xs">
        <li><span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--mis)] mr-1" />sick, tests positive ({tp})</li>
        <li><span className="inline-block w-2.5 h-2.5 rounded-full border border-[var(--mis)] mr-1" />sick, missed ({sick - tp})</li>
        <li><span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--edge)] mr-1" />healthy, false alarm ({fp})</li>
      </ul>
      <Slider label="How common the disease is" value={prev} min={0.001} max={0.5} step={0.001} onChange={setPrev} show={pct(prev)} />
      <Slider label="Test catches the sick (sensitivity)" value={sens} min={0.5} max={1} step={0.01} onChange={setSens} show={pct(sens, 0)} />
      <Slider label="False-alarm rate in the healthy" value={fpr} min={0} max={0.3} step={0.005} onChange={setFpr} show={pct(fpr)} />
      <p className="feedback feedback-warn">
        {tp + fp} people test positive. Only <strong>{tp}</strong> are sick: P(sick | positive) ≈ <strong>{pct(exact)}</strong>
      </p>
    </Box>
  );
}

// ---------- Values on a number line ----------

export function Points1dWidget({ values: v0 }: { values: number[] }) {
  const [vals, setVals] = useState(v0);
  const dragging = useRef<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const c = chart(440, 150, 0, 10, 0, 1, 24);
  const n = vals.length;
  const mean = vals.reduce((s, x) => s + x, 0) / n;
  const devs = vals.map((x) => x - mean);
  const variance = devs.reduce((s, d) => s + d * d, 0) / n;
  const toValue = (clientX: number) => {
    const el = svg.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return null;
    const x = new DOMPoint(clientX, 0).matrixTransform(ctm.inverse()).x;
    const v = ((x - c.pad) / (c.w - 2 * c.pad)) * 10;
    return Math.max(0, Math.min(10, Math.round(v * 2) / 2));
  };
  // One row per value, so deviation bars never overlap.
  const rowY = (i: number) => 30 + i * Math.min(16, 76 / Math.max(1, n - 1));
  return (
    <Box>
      <svg
        ref={svg}
        viewBox={`0 0 ${c.w} ${c.h}`}
        className="w-full max-w-[480px] rounded-2xl bg-[var(--plane)] touch-none select-none"
        onPointerMove={(e) => {
          if (dragging.current === null) return;
          const v = toValue(e.clientX);
          if (v !== null) setVals((cur) => cur.map((x, i) => (i === dragging.current ? v : x)));
        }}
        onPointerUp={() => (dragging.current = null)}
        onPointerLeave={() => (dragging.current = null)}
      >
        <line x1={c.sx(0)} x2={c.sx(10)} y1={115} y2={115} stroke="var(--axis)" />
        {Array.from({ length: 11 }, (_, k) => (
          <g key={k}>
            <line x1={c.sx(k)} x2={c.sx(k)} y1={111} y2={119} stroke="var(--axis)" />
            <text x={c.sx(k)} y={135} fontSize={11} textAnchor="middle" fill="var(--muted)">{k}</text>
          </g>
        ))}
        <line x1={c.sx(mean)} x2={c.sx(mean)} y1={20} y2={118} stroke="var(--solid)" strokeWidth={2} strokeDasharray="5 4" />
        <text x={c.sx(mean)} y={14} fontSize={12} textAnchor="middle" fill="var(--solid)">mean {fmt(mean)}</text>
        {vals.map((x, i) => (
          <g key={i}>
            <line x1={c.sx(mean)} x2={c.sx(x)} y1={rowY(i)} y2={rowY(i)} stroke={x >= mean ? "var(--a)" : "var(--b)"} strokeWidth={3} />
            <circle
              cx={c.sx(x)}
              cy={rowY(i)}
              r={9}
              fill="var(--v)"
              fillOpacity={0.85}
              className="cursor-grab"
              onPointerDown={(e) => {
                dragging.current = i;
                (e.target as Element).setPointerCapture?.(e.pointerId);
              }}
            />
          </g>
        ))}
      </svg>
      <div className="text-sm space-y-1">
        <p>
          Deviations from the mean: {devs.map((d) => (d >= 0 ? "+" : "") + fmt(d)).join(", ")}
        </p>
        <p>
          Sum of deviations: <strong>{fmt(devs.reduce((s, d) => s + d, 0) + 0)}</strong> · Variance (average squared deviation):{" "}
          <strong>{fmt(variance)}</strong> · Standard deviation: <strong>{fmt(Math.sqrt(variance))}</strong>
        </p>
        <p className="text-[var(--muted)]">Drag the yellow dots.</p>
      </div>
    </Box>
  );
}

// ---------- Normal distribution ----------

const pdf = (x: number, mu: number, s: number) => Math.exp(-((x - mu) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));

export function NormalWidget({ mu: m0, sigma: s0 }: { mu: number; sigma: number }) {
  const [mu, setMu] = useState(m0);
  const [s, setS] = useState(s0);
  const c = chart(440, 220, -8, 8, 0, 0.82);
  const xs = Array.from({ length: 241 }, (_, i) => -8 + (i * 16) / 240);
  const curve = xs.map((x, i) => `${i ? "L" : "M"}${c.sx(x)},${c.sy(pdf(x, mu, s))}`).join(" ");
  const band = (k: number) => {
    const inside = xs.filter((x) => Math.abs(x - mu) <= k * s);
    if (!inside.length) return "";
    return `M${c.sx(inside[0])},${c.sy(0)} ` + inside.map((x) => `L${c.sx(x)},${c.sy(pdf(x, mu, s))}`).join(" ") + ` L${c.sx(inside.at(-1)!)},${c.sy(0)} Z`;
  };
  return (
    <Box>
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[480px] rounded-2xl bg-[var(--plane)]">
        <path d={band(2)} fill="var(--accent)" fillOpacity={0.12} />
        <path d={band(1)} fill="var(--accent)" fillOpacity={0.25} />
        <line x1={c.sx(-8)} x2={c.sx(8)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        {[-8, -4, 0, 4, 8].map((k) => (
          <text key={k} x={c.sx(k)} y={c.h - 8} fontSize={11} textAnchor="middle" fill="var(--muted)">{k}</text>
        ))}
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        <line x1={c.sx(mu)} x2={c.sx(mu)} y1={c.sy(0)} y2={c.sy(pdf(mu, mu, s))} stroke="var(--solid)" strokeDasharray="4 4" />
      </svg>
      <Slider label={<Tex src="\mu" />} value={mu} min={-3} max={3} step={0.5} onChange={setMu} />
      <Slider label={<Tex src="\sigma" />} value={s} min={0.5} max={3} step={0.25} onChange={setS} />
      <p className="text-sm">
        Dark band: within 1σ (about 68% of the area). Light band: within 2σ (about 95%). Peak height: <strong>{fmt(pdf(mu, mu, s), 3)}</strong>
      </p>
    </Box>
  );
}

// ---------- Likelihood of coin data ----------

export function LikelihoodWidget({ heads, flips }: { heads: number; flips: number }) {
  const [p, setP] = useState(0.5);
  const logL = (q: number) => heads * Math.log(q) + (flips - heads) * Math.log(1 - q);
  const best = heads / flips;
  const rel = (q: number) => Math.exp(logL(q) - logL(Math.min(0.999, Math.max(0.001, best))));
  const c = chart(440, 200, 0, 1, 0, 1.05);
  const qs = Array.from({ length: 199 }, (_, i) => (i + 1) / 200);
  const curve = qs.map((q, i) => `${i ? "L" : "M"}${c.sx(q)},${c.sy(rel(q))}`).join(" ");
  const atPeak = Math.abs(p - best) < 0.005;
  return (
    <Box>
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[480px] rounded-2xl bg-[var(--plane)]">
        <line x1={c.sx(0)} x2={c.sx(1)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        {[0, 0.25, 0.5, 0.75, 1].map((k) => (
          <text key={k} x={c.sx(k)} y={c.h - 8} fontSize={11} textAnchor="middle" fill="var(--muted)">{k}</text>
        ))}
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        <line x1={c.sx(p)} x2={c.sx(p)} y1={c.sy(0)} y2={c.sy(rel(p))} stroke="var(--v)" strokeWidth={2} />
        <circle cx={c.sx(p)} cy={c.sy(rel(p))} r={6} fill="var(--v)" />
      </svg>
      <Slider label="Guess for the coin's p" value={p} min={0.01} max={0.99} step={0.01} onChange={setP} />
      <p className="text-sm">
        Data: <strong>{heads}</strong> heads in <strong>{flips}</strong> flips. Likelihood <Tex src={`p^{${heads}}(1-p)^{${flips - heads}}`} /> at p = {fmt(p)}:{" "}
        <strong>{atPeak ? "the maximum" : `${pct(rel(p), 0)} of the maximum`}</strong>
      </p>
      {atPeak && <p className="feedback feedback-ok text-sm">🎯 The peak: p = {fmt(best)}, exactly heads ÷ flips.</p>}
    </Box>
  );
}

// ---------- PCA pipeline ----------

const STAGES = ["Raw data", "Centre it", "Find the components", "Project onto PC1", "Reconstruct"] as const;

export function PcaPipeWidget({ points }: { points: Vec[] }) {
  const [stage, setStage] = useState(0);
  const n = points.length;
  const mean: Vec = [points.reduce((s, p) => s + p[0], 0) / n, points.reduce((s, p) => s + p[1], 0) / n];
  const ctr = points.map((p): Vec => [p[0] - mean[0], p[1] - mean[1]]);
  const a = ctr.reduce((s, p) => s + p[0] * p[0], 0) / n;
  const b = ctr.reduce((s, p) => s + p[0] * p[1], 0) / n;
  const d = ctr.reduce((s, p) => s + p[1] * p[1], 0) / n;
  const l1 = (a + d) / 2 + Math.hypot((a - d) / 2, b);
  const l2 = a + d - l1;
  const th = Math.atan2(2 * b, a - d) / 2;
  const u1: Vec = [Math.cos(th), Math.sin(th)];
  const u2: Vec = [-u1[1], u1[0]];
  const scores = ctr.map((p) => p[0] * u1[0] + p[1] * u1[1]);
  const recon = scores.map((s): Vec => [s * u1[0], s * u1[1]]);
  const R = 5.5;
  const c = chart(400, 400, -R, R, -R, R, 14);
  const P = (q: Vec): [number, number] => [c.sx(q[0]), c.sy(q[1])];
  const centred = stage >= 1;
  const shown = centred ? ctr : points;
  const axis = (u: Vec, len: number, color: string) => {
    const [x1, y1] = P([-u[0] * len, -u[1] * len]);
    const [x2, y2] = P([u[0] * len, u[1] * len]);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3} strokeLinecap="round" />;
  };
  return (
    <Box>
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s, i) => (
          <button key={s} type="button" className={`chip ${stage === i ? "chip-on" : ""}`} onClick={() => setStage(i)}>
            {i + 1}. {s}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[420px] aspect-square rounded-2xl bg-[var(--plane)]">
        <line x1={c.sx(-R)} x2={c.sx(R)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        <line x1={c.sx(0)} x2={c.sx(0)} y1={c.sy(-R)} y2={c.sy(R)} stroke="var(--axis)" />
        {stage === 0 && <circle cx={c.sx(mean[0])} cy={c.sy(mean[1])} r={6} fill="none" stroke="var(--solid)" strokeWidth={2} />}
        {stage === 1 && points.map((p, i) => <circle key={`o${i}`} cx={c.sx(p[0])} cy={c.sy(p[1])} r={3} fill="var(--muted)" fillOpacity={0.35} />)}
        {stage >= 2 && axis(u1, 2 * Math.sqrt(l1), "var(--v)")}
        {stage >= 2 && axis(u2, 2 * Math.sqrt(l2), "var(--j)")}
        {stage === 3 &&
          ctr.map((p, i) => {
            const [x1, y1] = P(p);
            const [x2, y2] = P(recon[i]);
            return <line key={`p${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeOpacity={0.5} />;
          })}
        {stage === 4 &&
          ctr.map((p, i) => {
            const [x1, y1] = P(p);
            const [x2, y2] = P(recon[i]);
            return <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--mis)" strokeWidth={1.5} />;
          })}
        {stage < 4 && shown.map((p, i) => <circle key={i} cx={c.sx(p[0])} cy={c.sy(p[1])} r={4.5} fill="var(--a)" fillOpacity={stage === 4 ? 0.3 : 1} />)}
        {stage >= 3 && recon.map((q, i) => <circle key={`q${i}`} cx={c.sx(q[0])} cy={c.sy(q[1])} r={4} fill="var(--v)" />)}
        {stage === 4 && ctr.map((p, i) => <circle key={`g${i}`} cx={c.sx(p[0])} cy={c.sy(p[1])} r={3.5} fill="var(--a)" fillOpacity={0.45} />)}
      </svg>
      <div className="text-sm space-y-1">
        {stage === 0 && <p>15 data points. The green ring is their mean, ({fmt(mean[0])}, {fmt(mean[1])}): not at the origin.</p>}
        {stage === 1 && <p>Subtract the mean from every point. Now the cloud is centred on the origin; the grey dots show where it was.</p>}
        {stage === 2 && (
          <p>
            Covariance matrix <Tex src={`\\begin{bmatrix}${fmt(a)}&${fmt(b)}\\\\${fmt(b)}&${fmt(d)}\\end{bmatrix}`} />. Its eigenvectors:{" "}
            <span className="text-[var(--v)] font-semibold">PC1</span> (λ = {fmt(l1)}) and <span className="text-[var(--j)] font-semibold">PC2</span> (λ = {fmt(l2)}).
          </p>
        )}
        {stage === 3 && (
          <p>
            Keep one number per point: its <strong>score</strong> along PC1 (the yellow dots). 2 numbers per point became 1.
          </p>
        )}
        {stage === 4 && (
          <p>
            Rebuild each point from its score alone. Red bars are what was lost. Variance kept: <strong>{pct(l1 / (l1 + l2))}</strong>; lost:{" "}
            {pct(l2 / (l1 + l2))} (exactly PC2&rsquo;s eigenvalue over the total).
          </p>
        )}
      </div>
    </Box>
  );
}

// ---------- Fit a line ----------

export function FitLineWidget({ points }: { points: Vec[] }) {
  const n = points.length;
  const mx = points.reduce((s, p) => s + p[0], 0) / n;
  const my = points.reduce((s, p) => s + p[1], 0) / n;
  const vx = points.reduce((s, p) => s + (p[0] - mx) ** 2, 0) / n;
  const cxy = points.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) / n;
  const wBest = cxy / vx;
  const bBest = my - wBest * mx;
  const sse = (w: number, b: number) => points.reduce((s, p) => s + (p[1] - (w * p[0] + b)) ** 2, 0);
  const best = sse(wBest, bBest);
  const [w, setW] = useState(0.3);
  const [b, setB] = useState(3);
  const err = sse(w, b);
  const sumResid = points.reduce((s, p) => s + (p[1] - (w * p[0] + b)), 0);
  const c = chart(440, 260, 0, 7, 0, 9);
  const found = err <= best * 1.03 + 1e-9; // within 3%: reachable with 0.05 slider steps
  return (
    <Box>
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[480px] rounded-2xl bg-[var(--plane)]">
        <line x1={c.sx(0)} x2={c.sx(7)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        <line x1={c.sx(0)} x2={c.sx(0)} y1={c.sy(0)} y2={c.sy(9)} stroke="var(--axis)" />
        <line x1={c.sx(0)} y1={c.sy(b)} x2={c.sx(7)} y2={c.sy(w * 7 + b)} stroke={found ? "var(--solid)" : "var(--accent)"} strokeWidth={2.5} />
        {points.map((p, i) => (
          <g key={i}>
            <line x1={c.sx(p[0])} x2={c.sx(p[0])} y1={c.sy(p[1])} y2={c.sy(w * p[0] + b)} stroke="var(--mis)" strokeWidth={1.5} />
            <circle cx={c.sx(p[0])} cy={c.sy(p[1])} r={5} fill="var(--a)" />
          </g>
        ))}
      </svg>
      <Slider label="Slope w" value={w} min={-1} max={3} step={0.05} onChange={setW} />
      <Slider label="Intercept b" value={b} min={-3} max={6} step={0.05} onChange={setB} />
      <p className="text-sm">
        Sum of squared residuals: <strong>{fmt(err)}</strong> (best possible {fmt(best)}) · plain sum of residuals: {fmt(sumResid)}
      </p>
      {found && (
        <p className="feedback feedback-ok text-sm">
          🎯 That&rsquo;s the least-squares line: w ≈ {fmt(wBest)}, b ≈ {fmt(bBest)}.
        </p>
      )}
    </Box>
  );
}
