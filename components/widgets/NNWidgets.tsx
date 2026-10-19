"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { renderMath } from "@/components/MathText";

const fmt = (n: number, dp = 2) => String(Math.round(n * 10 ** dp) / 10 ** dp + 0);
const Tex = ({ src }: { src: string }) => <span dangerouslySetInnerHTML={{ __html: renderMath(`$${src}$`) }} />;

function Slider({ label, value, min, max, step, onChange }: { label: ReactNode; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm text-[var(--muted)]">
        <span>{label}</span>
        <span className="font-mono text-[var(--fg)]">{fmt(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
    </label>
  );
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

// ---------- One neuron ----------

export function NeuronWidget() {
  const [x1, setX1] = useState(2);
  const [x2, setX2] = useState(-1);
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1.5);
  const [b, setB] = useState(0.5);
  const [act, setAct] = useState<"relu" | "sigmoid">("relu");
  const z = w1 * x1 + w2 * x2 + b;
  const a = act === "relu" ? Math.max(0, z) : sigmoid(z);
  return (
    <div className="space-y-4">
      <svg viewBox="0 0 420 170" className="w-full max-w-[460px] rounded-2xl bg-[var(--plane)]">
        {[
          { y: 45, label: `x₁ = ${fmt(x1)}`, w: w1 },
          { y: 125, label: `x₂ = ${fmt(x2)}`, w: w2 },
        ].map((inp, i) => (
          <g key={i}>
            <circle cx={60} cy={inp.y} r={24} fill="var(--surface)" stroke="var(--a)" strokeWidth={2} />
            <text x={60} y={inp.y + 4} textAnchor="middle" fontSize={11} fill="var(--fg)">{inp.label}</text>
            <line x1={84} y1={inp.y} x2={186} y2={85} stroke={inp.w >= 0 ? "var(--a)" : "var(--b)"} strokeWidth={1 + Math.min(6, Math.abs(inp.w) * 2)} strokeOpacity={0.8} />
            <text x={135} y={(inp.y + 85) / 2 - 6} textAnchor="middle" fontSize={11} fill="var(--muted)">w={fmt(inp.w)}</text>
          </g>
        ))}
        <circle cx={220} cy={85} r={34} fill="var(--surface)" stroke="var(--accent)" strokeWidth={3} />
        <text x={220} y={80} textAnchor="middle" fontSize={11} fill="var(--fg)">z = {fmt(z)}</text>
        <text x={220} y={96} textAnchor="middle" fontSize={10} fill="var(--muted)">{act}</text>
        <line x1={254} y1={85} x2={330} y2={85} stroke="var(--v)" strokeWidth={3} />
        <circle cx={360} cy={85} r={28} fill="var(--surface)" stroke="var(--v)" strokeWidth={2} />
        <text x={360} y={89} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--fg)">{fmt(a, 3)}</text>
      </svg>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
        <Slider label={<Tex src="x_1" />} value={x1} min={-3} max={3} step={0.5} onChange={setX1} />
        <Slider label={<Tex src="w_1" />} value={w1} min={-3} max={3} step={0.25} onChange={setW1} />
        <Slider label={<Tex src="x_2" />} value={x2} min={-3} max={3} step={0.5} onChange={setX2} />
        <Slider label={<Tex src="w_2" />} value={w2} min={-3} max={3} step={0.25} onChange={setW2} />
        <Slider label={<span>bias <Tex src="b" /></span>} value={b} min={-3} max={3} step={0.25} onChange={setB} />
        <div className="flex gap-2 items-end">
          {(["relu", "sigmoid"] as const).map((k) => (
            <button key={k} type="button" className={`chip ${act === k ? "chip-on" : ""}`} onClick={() => setAct(k)}>
              {k === "relu" ? "ReLU" : "Sigmoid"}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm">
        <Tex src={`z = ${fmt(w1)}\\cdot${fmt(x1)} + ${fmt(w2)}\\cdot(${fmt(x2)}) + ${fmt(b)} = ${fmt(z)}`} />, output{" "}
        <Tex src={act === "relu" ? `\\max(0, z) = ${fmt(a, 3)}` : `\\sigma(z) = ${fmt(a, 3)}`} />
      </p>
    </div>
  );
}

// ---------- Playground: train a tiny network ----------

type Pt = { x: number; y: number; label: 0 | 1 };

function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeData(kind: "circle" | "xor"): Pt[] {
  const r = seeded(kind === "circle" ? 7 : 11);
  const pts: Pt[] = [];
  if (kind === "circle") {
    for (let i = 0; i < 70; i++) {
      const a = r() * 2 * Math.PI;
      const rad = r() * 0.9;
      pts.push({ x: rad * Math.cos(a), y: rad * Math.sin(a), label: 1 });
    }
    for (let i = 0; i < 90; i++) {
      const a = r() * 2 * Math.PI;
      const rad = 1.4 + r() * 0.8;
      pts.push({ x: rad * Math.cos(a), y: rad * Math.sin(a), label: 0 });
    }
  } else {
    for (const [cx, cy] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      for (let i = 0; i < 40; i++) {
        pts.push({ x: cx + (r() - 0.5) * 1.1, y: cy + (r() - 0.5) * 1.1, label: cx * cy > 0 ? 1 : 0 });
      }
    }
  }
  return pts;
}

type Net = { W1: number[][]; b1: number[]; W2: number[]; b2: number };

export function initNet(hidden: number, seed: number): Net {
  const r = seeded(seed);
  const g = () => (r() * 2 - 1) * 1.2;
  return { W1: Array.from({ length: hidden }, () => [g(), g()]), b1: Array.from({ length: hidden }, () => g() * 0.5), W2: Array.from({ length: hidden }, g), b2: 0 };
}

export function forward(net: Net, x: number, y: number, linear: boolean) {
  const z1 = net.W1.map((w, i) => w[0] * x + w[1] * y + net.b1[i]);
  const h = linear ? z1 : z1.map(Math.tanh);
  const z2 = h.reduce((s, hi, i) => s + hi * net.W2[i], net.b2);
  return { z1, h, p: sigmoid(z2) };
}

/** One full-batch gradient-descent step on binary cross-entropy. Returns the loss before the step. */
export function trainStep(net: Net, data: Pt[], lr: number, linear: boolean): number {
  const H = net.W2.length;
  const gW1 = net.W1.map(() => [0, 0]);
  const gb1 = new Array(H).fill(0);
  const gW2 = new Array(H).fill(0);
  let gb2 = 0;
  let loss = 0;
  for (const d of data) {
    const { h, p } = forward(net, d.x, d.y, linear);
    const pc = Math.min(1 - 1e-9, Math.max(1e-9, p));
    loss += -(d.label * Math.log(pc) + (1 - d.label) * Math.log(1 - pc));
    const dz2 = p - d.label; // dL/dz2 for sigmoid + cross-entropy
    gb2 += dz2;
    for (let i = 0; i < H; i++) {
      gW2[i] += dz2 * h[i];
      const dh = dz2 * net.W2[i];
      const dz1 = linear ? dh : dh * (1 - h[i] * h[i]); // tanh' = 1 - tanh²
      gW1[i][0] += dz1 * d.x;
      gW1[i][1] += dz1 * d.y;
      gb1[i] += dz1;
    }
  }
  const n = data.length;
  for (let i = 0; i < H; i++) {
    net.W1[i][0] -= (lr * gW1[i][0]) / n;
    net.W1[i][1] -= (lr * gW1[i][1]) / n;
    net.b1[i] -= (lr * gb1[i]) / n;
    net.W2[i] -= (lr * gW2[i]) / n;
  }
  net.b2 -= (lr * gb2) / n;
  return loss / n;
}

const GRID = 34;
const RANGE = 2.6;

export function PlaygroundWidget({ dataset: d0, hidden: h0, activation: a0 }: { dataset: "circle" | "xor"; hidden: number; activation: "tanh" | "linear" }) {
  const [dataset, setDataset] = useState(d0);
  const [hidden, setHidden] = useState(h0);
  const [activation, setActivation] = useState(a0);
  const [lr, setLr] = useState(0.5);
  const [running, setRunning] = useState(false);
  const [seed, setSeed] = useState(1);
  const data = useMemo(() => makeData(dataset), [dataset]);
  const net = useRef<Net>(initNet(hidden, seed));
  const [epoch, setEpoch] = useState(0);
  const [losses, setLosses] = useState<number[]>([]);
  const [, force] = useState(0);
  const linear = activation === "linear";

  useEffect(() => {
    net.current = initNet(hidden, seed);
    setEpoch(0);
    setLosses([]);
    force((x) => x + 1);
  }, [hidden, seed, dataset, activation]);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const tick = () => {
      let l = 0;
      for (let k = 0; k < 8; k++) l = trainStep(net.current, data, lr, linear);
      setEpoch((e) => e + 8);
      setLosses((ls) => [...ls.slice(-149), l]);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, data, lr, linear]);

  const size = 300;
  const cell = size / GRID;
  const toPx = (v: number) => ((v + RANGE) / (2 * RANGE)) * size;
  const heat: ReactNode[] = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const x = -RANGE + ((i + 0.5) / GRID) * 2 * RANGE;
      const y = RANGE - ((j + 0.5) / GRID) * 2 * RANGE;
      const p = forward(net.current, x, y, linear).p;
      heat.push(<rect key={`${i},${j}`} x={i * cell} y={j * cell} width={cell + 0.5} height={cell + 0.5} fill={p > 0.5 ? "var(--a)" : "var(--edge)"} fillOpacity={Math.abs(p - 0.5) * 1.1} />);
    }
  }
  const correct = data.filter((d) => (forward(net.current, d.x, d.y, linear).p > 0.5 ? 1 : 0) === d.label).length;
  const maxLoss = Math.max(0.8, ...losses);
  const spark = losses.map((l, i) => `${i ? "L" : "M"}${(i / 149) * 200},${60 - (l / maxLoss) * 56}`).join(" ");

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] aspect-square rounded-2xl bg-[var(--plane)]">
        {heat}
        {data.map((d, i) => (
          <circle key={i} cx={toPx(d.x)} cy={size - toPx(d.y)} r={3.6} fill={d.label ? "var(--a)" : "var(--edge)"} stroke="var(--bg)" strokeWidth={1} />
        ))}
      </svg>
      <div className="flex-1 w-full space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={() => setRunning((r) => !r)}>{running ? "⏸ Pause" : "▶ Train"}</button>
          <button type="button" className="chip" onClick={() => (setRunning(false), setSeed((s) => s + 1))}>Reset weights</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["circle", "xor"] as const).map((k) => (
            <button key={k} type="button" className={`chip ${dataset === k ? "chip-on" : ""}`} onClick={() => (setRunning(false), setDataset(k))}>
              {k === "circle" ? "Circle data" : "XOR data"}
            </button>
          ))}
          {(["tanh", "linear"] as const).map((k) => (
            <button key={k} type="button" className={`chip ${activation === k ? "chip-on" : ""}`} onClick={() => (setRunning(false), setActivation(k))}>
              {k === "tanh" ? "tanh activation" : "no activation (linear)"}
            </button>
          ))}
        </div>
        <Slider label="Hidden units" value={hidden} min={1} max={8} step={1} onChange={(n) => (setRunning(false), setHidden(n))} />
        <Slider label={<span>Learning rate <Tex src="\eta" /></span>} value={lr} min={0.05} max={2} step={0.05} onChange={setLr} />
        <p>
          Steps: <strong>{epoch}</strong> · Loss: <strong>{losses.length ? fmt(losses.at(-1)!, 3) : "–"}</strong> · Accuracy:{" "}
          <strong>{Math.round((correct / data.length) * 100)}%</strong>
        </p>
        <svg viewBox="0 0 200 64" className="w-full max-w-[260px] h-16 rounded bg-[var(--plane)]">
          <path d={spark} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
        </svg>
        <p className="text-[var(--muted)]">
          Network: 2 inputs → {hidden} hidden {linear ? "(linear)" : "(tanh)"} → 1 sigmoid output. Each step is one gradient-descent step on cross-entropy, with gradients from backprop.
        </p>
      </div>
    </div>
  );
}
