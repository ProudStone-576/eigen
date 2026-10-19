"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { renderMath } from "@/components/MathText";

const fmt = (n: number, dp = 2) => String(Math.round(n * 10 ** dp) / 10 ** dp + 0);
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

function frame(w: number, h: number, x0: number, x1: number, y0: number, y1: number, pad = 26) {
  // Rounded so server and browser render identical SVG (Math.exp etc. can differ in the last digits).
  const sx = (x: number) => Math.round((pad + ((x - x0) / (x1 - x0)) * (w - 2 * pad)) * 100) / 100;
  const sy = (y: number) => Math.round((h - pad - ((y - y0) / (y1 - y0)) * (h - 2 * pad)) * 100) / 100;
  return { sx, sy, w, h, pad };
}

// ---------- shared maths ----------

/** Quartiles by the median-of-halves rule (median excluded when n is odd). */
export function quartiles(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const med = (a: number[]) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
  const n = s.length;
  const lower = s.slice(0, Math.floor(n / 2));
  const upper = s.slice(Math.ceil(n / 2));
  return { sorted: s, q1: med(lower), median: med(s), q3: med(upper) };
}

/** Standard normal CDF (Abramowitz–Stegun 7.1.26, error < 1.5e-7). */
export function phi(z: number) {
  const t = 1 / (1 + 0.3275911 * (Math.abs(z) / Math.SQRT2));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (rand: () => number) => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());

// ---------- Box plot with draggable data ----------

export function Summary1dWidget({ values, max }: { values: number[]; max: number }) {
  const [vals, setVals] = useState(values);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<number | null>(null);
  const c = frame(460, 190, 0, max, 0, 1, 22);
  const { q1, median, q3 } = quartiles(vals);
  const mean = vals.reduce((s, x) => s + x, 0) / vals.length;
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const inside = vals.filter((x) => x >= lo && x <= hi);
  const wl = Math.min(...inside);
  const wh = Math.max(...inside);
  const step = max > 40 ? 1 : 0.5;
  const toValue = (clientX: number) => {
    const ctm = svg.current?.getScreenCTM();
    if (!ctm) return null;
    const x = new DOMPoint(clientX, 0).matrixTransform(ctm.inverse()).x;
    return Math.max(0, Math.min(max, Math.round((((x - c.pad) / (c.w - 2 * c.pad)) * max) / step) * step));
  };
  const ticks = Array.from({ length: 6 }, (_, i) => (i * max) / 5);
  return (
    <div className="space-y-3">
      <svg
        ref={svg}
        viewBox={`0 0 ${c.w} ${c.h}`}
        className="w-full max-w-[500px] rounded-2xl bg-[var(--plane)] touch-none select-none"
        onPointerMove={(e) => {
          if (dragging.current === null) return;
          const v = toValue(e.clientX);
          if (v !== null) setVals((cur) => cur.map((x, i) => (i === dragging.current ? v : x)));
        }}
        onPointerUp={() => (dragging.current = null)}
        onPointerLeave={() => (dragging.current = null)}
      >
        {/* box plot */}
        <line x1={c.sx(wl)} x2={c.sx(q1)} y1={45} y2={45} stroke="var(--fg)" />
        <line x1={c.sx(q3)} x2={c.sx(wh)} y1={45} y2={45} stroke="var(--fg)" />
        <line x1={c.sx(wl)} x2={c.sx(wl)} y1={36} y2={54} stroke="var(--fg)" />
        <line x1={c.sx(wh)} x2={c.sx(wh)} y1={36} y2={54} stroke="var(--fg)" />
        <rect x={c.sx(q1)} y={30} width={Math.max(1, c.sx(q3) - c.sx(q1))} height={30} fill="var(--accent)" fillOpacity={0.18} stroke="var(--accent)" />
        <line x1={c.sx(median)} x2={c.sx(median)} y1={30} y2={60} stroke="var(--accent)" strokeWidth={3} />
        <line x1={c.sx(mean)} x2={c.sx(mean)} y1={22} y2={150} stroke="var(--solid)" strokeDasharray="4 4" />
        <text x={c.sx(mean)} y={16} textAnchor="middle" fontSize={11} fill="var(--solid)">mean</text>
        {/* axis */}
        <line x1={c.sx(0)} x2={c.sx(max)} y1={150} y2={150} stroke="var(--axis)" />
        {ticks.map((t) => (
          <text key={t} x={c.sx(t)} y={168} fontSize={11} textAnchor="middle" fill="var(--muted)">{fmt(t, 0)}</text>
        ))}
        {vals.map((x, i) => {
          const out = x < lo || x > hi;
          return (
            <circle
              key={i}
              cx={c.sx(x)}
              cy={100 + (i % 3) * 14}
              r={8}
              fill={out ? "var(--mis)" : "var(--v)"}
              fillOpacity={0.9}
              className="cursor-grab"
              onPointerDown={(e) => {
                dragging.current = i;
                (e.target as Element).setPointerCapture?.(e.pointerId);
              }}
            />
          );
        })}
      </svg>
      <p className="text-sm">
        Mean <strong className="text-[var(--solid)]">{fmt(mean)}</strong> · Median <strong className="text-[var(--accent)]">{fmt(median)}</strong> · Q1 {fmt(q1)} · Q3 {fmt(q3)} · IQR{" "}
        <strong>{fmt(iqr)}</strong> · fences {fmt(lo)} and {fmt(hi)}
      </p>
      <p className="text-sm text-[var(--muted)]">Drag the dots. Red dots are outliers by the 1.5 × IQR rule. The box spans Q1 to Q3.</p>
    </div>
  );
}

// ---------- Binomial ----------

export function BinomialWidget({ n: n0, p: p0 }: { n: number; p: number }) {
  const [n, setN] = useState(n0);
  const [p, setP] = useState(p0);
  const probs = useMemo(() => {
    const out: number[] = [];
    let c = 1;
    for (let k = 0; k <= n; k++) {
      out.push(c * p ** k * (1 - p) ** (n - k));
      c = (c * (n - k)) / (k + 1);
    }
    return out;
  }, [n, p]);
  const top = Math.max(...probs);
  const c = frame(460, 220, -0.5, n + 0.5, 0, top * 1.1);
  const bw = Math.max(2, (c.w - 2 * c.pad) / (n + 1) - 2);
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[500px] rounded-2xl bg-[var(--plane)]">
        {probs.map((pr, k) => (
          <rect key={k} x={c.sx(k) - bw / 2} y={c.sy(pr)} width={bw} height={c.sy(0) - c.sy(pr)} fill="var(--accent)" fillOpacity={0.75} />
        ))}
        <line x1={c.sx(n * p)} x2={c.sx(n * p)} y1={c.sy(0)} y2={c.pad - 6} stroke="var(--solid)" strokeDasharray="4 4" />
        <text x={c.sx(n * p)} y={c.pad - 10} fontSize={11} textAnchor="middle" fill="var(--solid)">np = {fmt(n * p)}</text>
        <line x1={c.sx(-0.5)} x2={c.sx(n + 0.5)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        {probs.map((_, k) =>
          n <= 20 || k % 5 === 0 ? (
            <text key={k} x={c.sx(k)} y={c.h - 8} fontSize={10} textAnchor="middle" fill="var(--muted)">{k}</text>
          ) : null,
        )}
      </svg>
      <Slider label={<span>Trials <Tex src="n" /></span>} value={n} min={1} max={40} step={1} onChange={setN} />
      <Slider label={<span>Success chance <Tex src="p" /></span>} value={p} min={0.05} max={0.95} step={0.05} onChange={setP} />
      <p className="text-sm">
        Mean <Tex src={`np = ${fmt(n * p)}`} /> · variance <Tex src={`np(1-p) = ${fmt(n * p * (1 - p))}`} /> · most likely count {probs.indexOf(top)} (P = {fmt(top, 3)})
      </p>
    </div>
  );
}

// ---------- Central limit theorem ----------

const SIZES = [1, 2, 5, 10, 30, 50];

export function CltWidget() {
  const [n, setN] = useState(5);
  const [means, setMeans] = useState<number[]>([]);
  const draw = () => {
    const out: number[] = [];
    for (let s = 0; s < 400; s++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += -Math.log(1 - Math.random()); // exponential(1): skewed, mean 1, sd 1
      out.push(sum / n);
    }
    setMeans(out);
  };
  const bins = 30;
  const hi = 4;
  const counts = new Array(bins).fill(0);
  for (const x of means) counts[Math.min(bins - 1, Math.floor((x / hi) * bins))]++;
  const top = Math.max(1, ...counts);
  const c = frame(460, 220, 0, hi, 0, top * 1.1);
  const bw = (c.w - 2 * c.pad) / bins;
  const sd = means.length ? Math.sqrt(means.reduce((s, x) => s + (x - 1) ** 2, 0) / means.length) : 0;
  const popXs = Array.from({ length: 80 }, (_, i) => (i * hi) / 79);
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--muted)]">
        Population: very skewed (most values small, a long tail), mean 1, σ = 1. Each draw takes <strong>{n}</strong> values and averages them.
      </p>
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[500px] rounded-2xl bg-[var(--plane)]">
        <path
          d={popXs.map((x, i) => `${i ? "L" : "M"}${c.sx(x)},${c.sy(Math.exp(-x) * top)}`).join(" ")}
          fill="none"
          stroke="var(--muted)"
          strokeDasharray="4 4"
        />
        {counts.map((k, i) => (
          <rect key={i} x={c.pad + i * bw} y={c.sy(k)} width={bw - 1} height={c.sy(0) - c.sy(k)} fill="var(--accent)" fillOpacity={0.75} />
        ))}
        <line x1={c.sx(0)} x2={c.sx(hi)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        {[0, 1, 2, 3, 4].map((t) => (
          <text key={t} x={c.sx(t)} y={c.h - 8} fontSize={11} textAnchor="middle" fill="var(--muted)">{t}</text>
        ))}
      </svg>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-[var(--muted)]">Sample size n:</span>
        {SIZES.map((s) => (
          <button key={s} type="button" className={`chip ${n === s ? "chip-on" : ""}`} onClick={() => (setN(s), setMeans([]))}>
            {s}
          </button>
        ))}
        <button type="button" className="btn" onClick={draw}>Draw 400 sample means</button>
      </div>
      {means.length > 0 && (
        <p className="text-sm">
          Spread of the sample means: <strong>{fmt(sd, 3)}</strong>. Theory says <Tex src={`\\sigma/\\sqrt{n} = 1/\\sqrt{${n}} = ${fmt(1 / Math.sqrt(n), 3)}`} />. The dashed curve is the
          population&rsquo;s shape.
        </p>
      )}
    </div>
  );
}

// ---------- Confidence intervals ----------

export function CiSimWidget() {
  const MU = 50;
  const SE = 2;
  const [cis, setCis] = useState<{ m: number; hit: boolean }[]>([]);
  const add = () =>
    setCis((cur) => {
      const next = [...cur];
      for (let i = 0; i < 20; i++) {
        const m = MU + SE * gauss(Math.random);
        next.push({ m, hit: Math.abs(m - MU) <= 1.96 * SE });
      }
      return next;
    });
  const shown = cis.slice(-20);
  const c = frame(460, 260, 42, 58, 0, 21);
  const hits = cis.filter((x) => x.hit).length;
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[500px] rounded-2xl bg-[var(--plane)]">
        <line x1={c.sx(MU)} x2={c.sx(MU)} y1={c.sy(0)} y2={c.sy(21)} stroke="var(--solid)" strokeWidth={2} />
        <text x={c.sx(MU)} y={14} fontSize={11} textAnchor="middle" fill="var(--solid)">true mean 50</text>
        {shown.map((ci, i) => (
          <g key={i}>
            <line x1={c.sx(ci.m - 1.96 * SE)} x2={c.sx(ci.m + 1.96 * SE)} y1={c.sy(i + 1)} y2={c.sy(i + 1)} stroke={ci.hit ? "var(--a)" : "var(--mis)"} strokeWidth={3} />
            <circle cx={c.sx(ci.m)} cy={c.sy(i + 1)} r={3} fill={ci.hit ? "var(--a)" : "var(--mis)"} />
          </g>
        ))}
        {[42, 46, 50, 54, 58].map((t) => (
          <text key={t} x={c.sx(t)} y={c.h - 6} fontSize={11} textAnchor="middle" fill="var(--muted)">{t}</text>
        ))}
      </svg>
      <div className="flex gap-2 flex-wrap items-center">
        <button type="button" className="btn" onClick={add}>Take 20 more samples</button>
        <button type="button" className="chip" onClick={() => setCis([])}>Reset</button>
      </div>
      <p className="text-sm">
        Each line is one sample&rsquo;s 95% interval, <Tex src="\bar x \pm 1.96\,\text{SE}" />. {cis.length > 0 ? (
          <>
            So far <strong>{hits}</strong> of <strong>{cis.length}</strong> caught the true mean ({pct(hits / cis.length)}). Red ones missed.
          </>
        ) : (
          "Take some samples."
        )}
      </p>
    </div>
  );
}

// ---------- p-value ----------

const pdf = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

export function PValueWidget({ z: z0 }: { z: number }) {
  const [z, setZ] = useState(z0);
  const p = 2 * (1 - phi(Math.abs(z)));
  const c = frame(460, 220, -4, 4, 0, 0.45);
  const xs = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);
  const curve = xs.map((x, i) => `${i ? "L" : "M"}${c.sx(x)},${c.sy(pdf(x))}`).join(" ");
  const tail = (from: number, to: number) => {
    const pts = xs.filter((x) => x >= from && x <= to);
    if (pts.length < 2) return "";
    return `M${c.sx(pts[0])},${c.sy(0)} ` + pts.map((x) => `L${c.sx(x)},${c.sy(pdf(x))}`).join(" ") + ` L${c.sx(pts.at(-1)!)},${c.sy(0)} Z`;
  };
  const a = Math.abs(z);
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[500px] rounded-2xl bg-[var(--plane)]">
        <path d={tail(a, 4)} fill="var(--mis)" fillOpacity={0.35} />
        <path d={tail(-4, -a)} fill="var(--mis)" fillOpacity={0.35} />
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        <line x1={c.sx(z)} x2={c.sx(z)} y1={c.sy(0)} y2={c.sy(0.42)} stroke="var(--v)" strokeWidth={2} />
        <line x1={c.sx(-4)} x2={c.sx(4)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        {[-4, -2, -1.96, 0, 1.96, 2, 4].filter((t) => Math.abs(t) !== 2).map((t) => (
          <text key={t} x={c.sx(t)} y={c.h - 8} fontSize={10} textAnchor="middle" fill="var(--muted)">{t}</text>
        ))}
      </svg>
      <Slider label={<span>Test statistic <Tex src="z" /></span>} value={z} min={-4} max={4} step={0.01} onChange={setZ} />
      <p className="text-sm">
        Two-sided p-value = shaded area = <strong>{fmt(p, 4)}</strong>. {p < 0.05 ? "Below 0.05: reject H₀ at the 5% level." : "Not below 0.05: not enough evidence against H₀ at the 5% level."}
      </p>
      <p className="text-sm text-[var(--muted)]">The curve is what z would look like if H₀ (no effect) were true.</p>
    </div>
  );
}

// ---------- Classifier threshold, confusion matrix, ROC ----------

export function ThresholdWidget({ imbalanced }: { imbalanced?: boolean }) {
  const data = useMemo(() => {
    const r = seeded(21);
    const nPos = imbalanced ? 20 : 100;
    const nNeg = imbalanced ? 480 : 100;
    const clip = (x: number) => Math.min(0.999, Math.max(0.001, x));
    const pos = Array.from({ length: nPos }, () => clip(0.66 + 0.16 * gauss(r)));
    const neg = Array.from({ length: nNeg }, () => clip(0.36 + 0.16 * gauss(r)));
    return { pos, neg };
  }, [imbalanced]);
  const [t, setT] = useState(0.5);
  const tp = data.pos.filter((s) => s >= t).length;
  const fn = data.pos.length - tp;
  const fp = data.neg.filter((s) => s >= t).length;
  const tn = data.neg.length - fp;
  const precision = tp + fp ? tp / (tp + fp) : 1;
  const recall = tp / data.pos.length;
  const fpr = fp / data.neg.length;
  const acc = (tp + tn) / (data.pos.length + data.neg.length);
  const roc = useMemo(() => {
    const ts = Array.from({ length: 101 }, (_, i) => 1 - i / 100);
    return ts.map((th) => [data.neg.filter((s) => s >= th).length / data.neg.length, data.pos.filter((s) => s >= th).length / data.pos.length]);
  }, [data]);
  const auc = useMemo(() => {
    let wins = 0;
    for (const a of data.pos) for (const b of data.neg) wins += a > b ? 1 : a === b ? 0.5 : 0;
    return wins / (data.pos.length * data.neg.length);
  }, [data]);
  const hc = frame(300, 150, 0, 1, 0, 1, 18);
  const bins = 20;
  const hist = (xs: number[]) => {
    const out = new Array(bins).fill(0);
    for (const x of xs) out[Math.min(bins - 1, Math.floor(x * bins))]++;
    return out;
  };
  const hp = hist(data.pos);
  const hn = hist(data.neg);
  const top = Math.max(...hp, ...hn);
  const bw = (hc.w - 2 * hc.pad) / bins;
  const rc = frame(170, 170, 0, 1, 0, 1, 18);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-start">
        <svg viewBox={`0 0 ${hc.w} ${hc.h}`} className="w-full max-w-[320px] rounded-2xl bg-[var(--plane)]">
          {hn.map((k, i) => (
            <rect key={`n${i}`} x={hc.pad + i * bw} y={hc.sy(k / top)} width={bw - 1} height={hc.sy(0) - hc.sy(k / top)} fill="var(--edge)" fillOpacity={0.55} />
          ))}
          {hp.map((k, i) => (
            <rect key={`p${i}`} x={hc.pad + i * bw} y={hc.sy(k / top)} width={bw - 1} height={hc.sy(0) - hc.sy(k / top)} fill="var(--a)" fillOpacity={0.55} />
          ))}
          <line x1={hc.sx(t)} x2={hc.sx(t)} y1={hc.sy(0)} y2={hc.sy(1)} stroke="var(--fg)" strokeWidth={2} />
          <text x={hc.sx(t) + 4} y={hc.pad} fontSize={10} fill="var(--fg)">threshold</text>
        </svg>
        <svg viewBox={`0 0 ${rc.w} ${rc.h}`} className="w-40 rounded-2xl bg-[var(--plane)]">
          <line x1={rc.sx(0)} y1={rc.sy(0)} x2={rc.sx(1)} y2={rc.sy(1)} stroke="var(--muted)" strokeDasharray="3 3" />
          <path d={roc.map(([x, y], i) => `${i ? "L" : "M"}${rc.sx(x)},${rc.sy(y)}`).join(" ")} fill="none" stroke="var(--accent)" strokeWidth={2} />
          <circle cx={rc.sx(fpr)} cy={rc.sy(recall)} r={5} fill="var(--v)" />
          <text x={rc.w / 2} y={rc.h - 3} fontSize={9} textAnchor="middle" fill="var(--muted)">FPR →</text>
          <text x={6} y={rc.h / 2} fontSize={9} fill="var(--muted)" transform={`rotate(-90 6 ${rc.h / 2})`} textAnchor="middle">TPR ↑</text>
        </svg>
      </div>
      <Slider label="Threshold (predict positive if score ≥ threshold)" value={t} min={0} max={1} step={0.01} onChange={setT} />
      <div className="grid grid-cols-[auto_1fr_1fr] gap-1 text-sm max-w-xs text-center">
        <span />
        <span className="text-[var(--muted)]">Predicted +</span>
        <span className="text-[var(--muted)]">Predicted −</span>
        <span className="text-[var(--muted)] text-left">Actual +</span>
        <span className="rounded bg-[var(--solid-bg)] py-1">TP {tp}</span>
        <span className="rounded bg-[var(--mis-bg)] py-1">FN {fn}</span>
        <span className="text-[var(--muted)] text-left">Actual −</span>
        <span className="rounded bg-[var(--mis-bg)] py-1">FP {fp}</span>
        <span className="rounded bg-[var(--solid-bg)] py-1">TN {tn}</span>
      </div>
      <p className="text-sm">
        Accuracy <strong>{pct(acc)}</strong> · Precision <strong>{pct(precision)}</strong> · Recall (TPR) <strong>{pct(recall)}</strong> · FPR <strong>{pct(fpr)}</strong> · AUC{" "}
        <strong>{fmt(auc, 3)}</strong>
      </p>
      <p className="text-sm text-[var(--muted)]">
        Blue bars: scores of {data.pos.length} real positives. Orange: {data.neg.length} real negatives.{imbalanced ? " Positives are rare here (4%)." : ""}
      </p>
    </div>
  );
}
