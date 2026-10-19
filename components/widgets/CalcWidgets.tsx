"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Vec } from "@/lib/content/types";
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

function frame(w: number, h: number, x0: number, x1: number, y0: number, y1: number, pad = 26) {
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0)) * (w - 2 * pad);
  const sy = (y: number) => h - pad - ((y - y0) / (y1 - y0)) * (h - 2 * pad);
  return { sx, sy, w, h, pad, x0, x1, y0, y1 };
}

// ---------- Tangent: secant -> tangent ----------

const FNS = {
  square: { f: (x: number) => x * x, df: (x: number) => 2 * x, tex: "x^2", x: [-2, 5], y: [-1, 26] },
  chain: { f: (x: number) => (3 * x + 1) ** 2, df: (x: number) => 6 * (3 * x + 1), tex: "(3x+1)^2", x: [-0.9, 0.6], y: [-0.5, 8] },
  cubic: { f: (x: number) => x ** 3 - 3 * x, df: (x: number) => 3 * x * x - 3, tex: "x^3 - 3x", x: [-2.4, 2.4], y: [-4, 4] },
} as const;

export function TangentWidget({ fn, a: a0 }: { fn: keyof typeof FNS; a: number }) {
  const F = FNS[fn];
  const [a, setA] = useState(a0);
  const [h, setH] = useState(1);
  const c = frame(440, 260, F.x[0], F.x[1], F.y[0], F.y[1]);
  const xs = Array.from({ length: 161 }, (_, i) => F.x[0] + (i * (F.x[1] - F.x[0])) / 160);
  const curve = xs.map((x, i) => `${i ? "L" : "M"}${c.sx(x)},${c.sy(F.f(x))}`).join(" ");
  const secant = (F.f(a + h) - F.f(a)) / h;
  const line = (slope: number) => {
    const xl = F.x[0];
    const xr = F.x[1];
    return { x1: c.sx(xl), y1: c.sy(F.f(a) + slope * (xl - a)), x2: c.sx(xr), y2: c.sy(F.f(a) + slope * (xr - a)) };
  };
  const span = F.x[1] - F.x[0];
  const close = h <= 0.02 * span;
  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[480px] rounded-2xl bg-[var(--plane)] overflow-hidden">
        <defs>
          <clipPath id={`clip-${fn}`}>
            <rect x={c.pad} y={c.pad} width={c.w - 2 * c.pad} height={c.h - 2 * c.pad} />
          </clipPath>
        </defs>
        <line x1={c.sx(F.x[0])} x2={c.sx(F.x[1])} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        <line x1={c.sx(0)} x2={c.sx(0)} y1={c.sy(F.y[0])} y2={c.sy(F.y[1])} stroke="var(--axis)" />
        <g clipPath={`url(#clip-${fn})`}>
          <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
          <line {...line(secant)} stroke={close ? "var(--solid)" : "var(--v)"} strokeWidth={2} />
          {!close && <line {...line(F.df(a))} stroke="var(--solid)" strokeWidth={1.5} strokeDasharray="5 5" strokeOpacity={0.6} />}
        </g>
        <circle cx={c.sx(a)} cy={c.sy(F.f(a))} r={5.5} fill="var(--a)" />
        <circle cx={c.sx(a + h)} cy={c.sy(F.f(a + h))} r={4.5} fill="var(--v)" />
      </svg>
      <Slider label={<span>Point <Tex src="a" /></span>} value={a} min={F.x[0] + 0.2 * span} max={F.x[1] - 0.25 * span} step={0.05} onChange={setA} />
      <Slider label={<span>Gap <Tex src="h" /></span>} value={h} min={0.01} max={span / 4} step={0.01} onChange={setH} />
      <p className="text-sm">
        <Tex src={`f(x) = ${F.tex}`} />. Secant slope <Tex src={`\\frac{f(a+h)-f(a)}{h}`} /> = <strong>{fmt(secant, 3)}</strong>
        {close ? (
          <span className="block feedback feedback-ok mt-2">
            h is tiny: the secant has become the tangent. <Tex src={`f'(${fmt(a)}) = ${fmt(F.df(a), 3)}`} />
          </span>
        ) : (
          <span className="block text-[var(--muted)]">Shrink h. The dashed green line is where the yellow one is heading.</span>
        )}
      </p>
    </div>
  );
}

// ---------- Gradient of f(x, y) = x² + 2y² ----------

export function Gradient2dWidget({ start }: { start: Vec }) {
  const [p, setP] = useState<Vec>(start);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const R = 3;
  const c = frame(380, 380, -R, R, -R, R, 10);
  const grad = (q: Vec): Vec => [2 * q[0], 4 * q[1]];
  const g = grad(p);
  const f = p[0] ** 2 + 2 * p[1] ** 2;
  const toPlane = (e: { clientX: number; clientY: number }): Vec | null => {
    const ctm = svg.current?.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = ((pt.x - c.pad) / (c.w - 2 * c.pad)) * 2 * R - R;
    const y = R - ((pt.y - c.pad) / (c.h - 2 * c.pad)) * 2 * R;
    const s = (v: number) => Math.max(-R + 0.25, Math.min(R - 0.25, Math.round(v * 4) / 4));
    return [s(x), s(y)];
  };
  const arrow = (from: Vec, d: Vec, scale: number, color: string, width: number, key?: string) => {
    const to: Vec = [from[0] + d[0] * scale, from[1] + d[1] * scale];
    const [x1, y1, x2, y2] = [c.sx(from[0]), c.sy(from[1]), c.sx(to[0]), c.sy(to[1])];
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 2) return null;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const hd = Math.min(8, len / 2);
    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={x2 - ux * hd} y2={y2 - uy * hd} stroke={color} strokeWidth={width} />
        <polygon points={`${x2},${y2} ${x2 - ux * hd - uy * hd * 0.5},${y2 - uy * hd + ux * hd * 0.5} ${x2 - ux * hd + uy * hd * 0.5},${y2 - uy * hd - ux * hd * 0.5}`} fill={color} />
      </g>
    );
  };
  const field: ReactNode[] = [];
  for (let x = -2.5; x <= 2.5; x += 1) for (let y = -2.5; y <= 2.5; y += 1) field.push(arrow([x, y], grad([x, y]), 0.06, "var(--muted)", 1.2, `${x},${y}`));
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
      <svg
        ref={svg}
        viewBox={`0 0 ${c.w} ${c.h}`}
        className="w-full max-w-[400px] aspect-square rounded-2xl bg-[var(--plane)] touch-none select-none"
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const q = toPlane(e);
          if (q) setP(q);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        {[0.5, 1, 2, 4, 8].map((k) => (
          <ellipse key={k} cx={c.sx(0)} cy={c.sy(0)} rx={(Math.sqrt(k) / (2 * R)) * (c.w - 2 * c.pad)} ry={(Math.sqrt(k / 2) / (2 * R)) * (c.h - 2 * c.pad)} fill="none" stroke="var(--grid)" />
        ))}
        <circle cx={c.sx(0)} cy={c.sy(0)} r={4} fill="var(--solid)" />
        {field}
        {arrow(p, [-g[0], -g[1]], 0.15, "var(--j)", 2)}
        {arrow(p, g, 0.15, "var(--v)", 3)}
        <circle
          cx={c.sx(p[0])}
          cy={c.sy(p[1])}
          r={10}
          fill="var(--a)"
          fillOpacity={0.3}
          stroke="var(--a)"
          strokeWidth={2}
          className="cursor-grab"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
        />
      </svg>
      <div className="flex-1 space-y-3 text-[15px]">
        <p>
          <Tex src="f(x,y) = x^2 + 2y^2" />: a bowl. The rings are contour lines (equal height); the green dot is the bottom.
        </p>
        <p className="text-lg">
          <Tex src={`\\nabla f(${fmt(p[0])}, ${fmt(p[1])}) = \\begin{bmatrix}2x\\\\4y\\end{bmatrix} = \\begin{bmatrix}${fmt(g[0])}\\\\${fmt(g[1])}\\end{bmatrix}`} />
        </p>
        <p className="text-sm">
          <span className="text-[var(--v)] font-semibold">Yellow</span> = ∇f (uphill). <span className="text-[var(--j)] font-semibold">Red</span> = −∇f (downhill). f here ={" "}
          {fmt(f)}. Drag the blue point.
        </p>
      </div>
    </div>
  );
}

// ---------- Gradient descent on L(w) = (w - 3)^2 + 1 ----------

const L = (w: number) => (w - 3) ** 2 + 1;
const dL = (w: number) => 2 * (w - 3);

export function DescentWidget({ eta: e0, start }: { eta: number; start: number }) {
  const [eta, setEta] = useState(e0);
  const [ws, setWs] = useState<number[]>([start]);
  const w = ws.at(-1)!;
  const diverged = Math.abs(w) > 60;
  const c = frame(440, 240, -2, 8, 0, 27);
  const xs = Array.from({ length: 121 }, (_, i) => -2 + (i * 10) / 120);
  const curve = xs.map((x, i) => `${i ? "L" : "M"}${c.sx(x)},${c.sy(L(x))}`).join(" ");
  const step = (n: number) =>
    setWs((cur) => {
      const next = [...cur];
      for (let i = 0; i < n && Math.abs(next.at(-1)!) <= 60; i++) next.push(next.at(-1)! - eta * dL(next.at(-1)!));
      return next;
    });
  const shown = ws.filter((x) => x >= -2 && x <= 8);
  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${c.w} ${c.h}`} className="w-full max-w-[480px] rounded-2xl bg-[var(--plane)] overflow-hidden">
        <line x1={c.sx(-2)} x2={c.sx(8)} y1={c.sy(0)} y2={c.sy(0)} stroke="var(--axis)" />
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        {shown.slice(1).map((x, i) => (
          <line key={i} x1={c.sx(shown[i])} y1={c.sy(L(shown[i]))} x2={c.sx(x)} y2={c.sy(L(x))} stroke="var(--v)" strokeWidth={1.5} strokeOpacity={0.7} />
        ))}
        {shown.map((x, i) => (
          <circle key={i} cx={c.sx(x)} cy={c.sy(L(x))} r={i === shown.length - 1 ? 6 : 3.5} fill="var(--v)" />
        ))}
        <line x1={c.sx(3)} x2={c.sx(3)} y1={c.sy(0)} y2={c.sy(1)} stroke="var(--solid)" strokeDasharray="3 3" />
      </svg>
      <Slider label={<span>Learning rate <Tex src="\eta" /></span>} value={eta} min={0.05} max={1.2} step={0.05} onChange={(n) => (setEta(n), setWs([start]))} />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="chip" onClick={() => step(1)} disabled={diverged}>Step</button>
        <button type="button" className="chip" onClick={() => step(10)} disabled={diverged}>Step ×10</button>
        <button type="button" className="chip" onClick={() => setWs([start])}>Reset</button>
      </div>
      <p className="text-sm">
        <Tex src={`L(w) = (w-3)^2 + 1`} />, update <Tex src={`w \\leftarrow w - \\eta \\cdot 2(w-3)`} />. Steps: {ws.length - 1}. w ={" "}
        <strong>{diverged ? "∞" : fmt(w, 3)}</strong>, L = <strong>{diverged ? "∞" : fmt(L(w), 3)}</strong>
      </p>
      {diverged && <p className="feedback feedback-bad text-sm">Diverged: each step overshot further than the last.</p>}
      {!diverged && Math.abs(w - 3) < 0.01 && ws.length > 1 && <p className="feedback feedback-ok text-sm">Reached the minimum at w = 3 in {ws.length - 1} steps.</p>}
    </div>
  );
}
