"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type { Mat, Vec, Widget } from "@/lib/content/types";
import { renderMath } from "@/components/MathText";

// ---------- Plane: a coordinate grid you can drag on ----------

const R = 4.5; // grid runs -R..R: big enough units to read and drag on a phone
const U = 40; // px per unit
const SIZE = 2 * R * U;

const toPx = ([x, y]: Vec): [number, number] => [x * U, -y * U];
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
/** Negative numbers in brackets inside a product: (−1)·2, not −1·2. */
const par = (n: number) => (n < 0 ? `(${fmt(n)})` : fmt(n));
const snap = (n: number, step: number) => Math.round(n / step) * step;
const LIMIT = Math.floor(R); // keep dragged points on whole units inside the visible grid
const clamp = (n: number) => Math.max(-LIMIT, Math.min(LIMIT, n));
const mul = (m: Mat, [x, y]: Vec): Vec => [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
const mmul = (a: Mat, b: Mat): Mat => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
];

function Arrow({ to, from = [0, 0], color, dashed, label }: { to: Vec; from?: Vec; color: string; dashed?: boolean; label?: string }) {
  const [x1, y1] = toPx(from);
  const [x2, y2] = toPx(to);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const head = Math.min(10, len / 2);
  const hx = x2 - ux * head;
  const hy = y2 - uy * head;
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={dashed ? "6 5" : undefined} />
      <polygon points={`${x2},${y2} ${hx - uy * head * 0.55},${hy + ux * head * 0.55} ${hx + uy * head * 0.55},${hy - ux * head * 0.55}`} fill={color} />
      {label && (
        <text x={x2 + 8} y={y2 - 8} fill={color} fontSize={14} fontWeight={700}>
          {label}
        </text>
      )}
    </g>
  );
}

function Handle({ at, color, onDown }: { at: Vec; color: string; onDown?: (e: ReactPointerEvent) => void }) {
  const [x, y] = toPx(at);
  return (
    <circle
      cx={x}
      cy={y}
      r={13}
      fill={color}
      fillOpacity={0.15}
      stroke={color}
      strokeWidth={2}
      className={onDown ? "cursor-grab touch-none" : undefined}
      onPointerDown={onDown}
    />
  );
}

function Grid({ m, faint }: { m?: Mat; faint?: boolean }) {
  const lines: ReactNode[] = [];
  const t = (p: Vec) => toPx(m ? mul(m, p) : p);
  for (let k = -Math.ceil(R * 2); k <= Math.ceil(R * 2); k++) {
    const [a1, b1] = t([k, -R * 2]);
    const [a2, b2] = t([k, R * 2]);
    const [c1, d1] = t([-R * 2, k]);
    const [c2, d2] = t([R * 2, k]);
    const axis = k === 0;
    const stroke = faint ? "var(--grid-faint)" : axis ? "var(--axis)" : "var(--grid)";
    const w = axis && !faint ? 1.6 : 1;
    lines.push(<line key={`v${k}`} x1={a1} y1={b1} x2={a2} y2={b2} stroke={stroke} strokeWidth={w} />);
    lines.push(<line key={`h${k}`} x1={c1} y1={d1} x2={c2} y2={d2} stroke={stroke} strokeWidth={w} />);
  }
  return <g>{lines}</g>;
}

/** SVG plane with pointer dragging. `onDrag(key, point)` receives plane coordinates. */
function Plane({ children, onDrag }: { children: (start: (key: string) => (e: ReactPointerEvent) => void) => ReactNode; onDrag?: (key: string, p: Vec) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<string | null>(null);

  const toPlane = (e: { clientX: number; clientY: number }): Vec | null => {
    const el = svg.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [pt.x / U, -pt.y / U];
  };

  const start = (key: string) => (e: ReactPointerEvent) => {
    if (!onDrag) return;
    dragging.current = key;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  return (
    <svg
      ref={svg}
      viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`}
      className="w-full max-w-[420px] aspect-square rounded-2xl bg-[var(--plane)] select-none touch-none"
      onPointerMove={(e) => {
        if (!dragging.current || !onDrag) return;
        const p = toPlane(e);
        if (p) onDrag(dragging.current, p);
      }}
      onPointerUp={() => (dragging.current = null)}
      onPointerLeave={() => (dragging.current = null)}
    >
      {children(start)}
    </svg>
  );
}

const Tex = ({ src }: { src: string }) => <span dangerouslySetInnerHTML={{ __html: renderMath(`$${src}$`) }} />;
const col = (v: Vec) => `\\begin{bmatrix}${fmt(v[0])}\\\\${fmt(v[1])}\\end{bmatrix}`;
const mat = (m: Mat) => `\\begin{bmatrix}${fmt(m[0][0])}&${fmt(m[0][1])}\\\\${fmt(m[1][0])}&${fmt(m[1][1])}\\end{bmatrix}`;

function Panel({ plane, side }: { plane: ReactNode; side: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
      {plane}
      <div className="flex-1 min-w-0 w-full space-y-3 text-[15px]">{side}</div>
    </div>
  );
}

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

// ---------- Widgets ----------

function VectorWidget({ start }: { start: Vec }) {
  const [p, setP] = useState<Vec>(start);
  return (
    <Panel
      plane={
        <Plane onDrag={(_k, q) => setP([clamp(snap(q[0], 1)), clamp(snap(q[1], 1))])}>
          {(drag) => (
            <>
              <Grid />
              <Arrow to={[p[0], 0]} color="var(--i)" dashed />
              <Arrow from={[p[0], 0]} to={p} color="var(--j)" dashed />
              <Arrow to={p} color="var(--v)" />
              <Handle at={p} color="var(--v)" onDown={drag("tip")} />
            </>
          )}
        </Plane>
      }
      side={
        <>
          <p className="text-2xl">
            <Tex src={`\\vec v = ${col(p)}`} />
          </p>
          <p>
            <span className="text-[var(--i)] font-semibold">{fmt(Math.abs(p[0]))} {p[0] < 0 ? "left" : "right"}</span>, then{" "}
            <span className="text-[var(--j)] font-semibold">{fmt(Math.abs(p[1]))} {p[1] < 0 ? "down" : "up"}</span>.
          </p>
          <p className="text-sm text-[var(--muted)]">Drag the yellow dot.</p>
        </>
      }
    />
  );
}

function VectorAddWidget({ a: a0, b: b0 }: { a: Vec; b: Vec }) {
  const [a, setA] = useState<Vec>(a0);
  const [b, setB] = useState<Vec>(b0);
  const sum: Vec = [a[0] + b[0], a[1] + b[1]];
  return (
    <Panel
      plane={
        <Plane
          onDrag={(k, q) => {
            const s: Vec = [clamp(snap(q[0], 1)), clamp(snap(q[1], 1))];
            if (k === "a") setA(s);
            else setB([s[0] - a[0], s[1] - a[1]]);
          }}
        >
          {(drag) => (
            <>
              <Grid />
              <Arrow to={sum} color="var(--sum)" label="a+b" />
              <Arrow to={a} color="var(--a)" label="a" />
              <Arrow from={a} to={sum} color="var(--b)" label="b" />
              <Handle at={a} color="var(--a)" onDown={drag("a")} />
              <Handle at={sum} color="var(--b)" onDown={drag("b")} />
            </>
          )}
        </Plane>
      }
      side={
        <p className="text-xl leading-loose">
          <Tex src={`{\\color{#3b82f6}${col(a)}} + {\\color{#ec4899}${col(b)}} = {\\color{#22c55e}${col(sum)}}`} />
        </p>
      }
    />
  );
}

function ScaleWidget({ v, k: k0 }: { v: Vec; k: number }) {
  const [k, setK] = useState(k0);
  const kv: Vec = [k * v[0], k * v[1]];
  return (
    <Panel
      plane={
        <Plane>
          {() => (
            <>
              <Grid />
              <Arrow to={v} color="var(--muted)" dashed label="v" />
              <Arrow to={kv} color="var(--v)" label="kv" />
            </>
          )}
        </Plane>
      }
      side={
        <>
          <Slider label={<Tex src="k" />} value={k} min={-3} max={3} step={0.25} onChange={setK} />
          <p className="text-xl">
            <Tex src={`${fmt(k)}\\,${col(v)} = ${col(kv)}`} />
          </p>
          <p className="text-sm text-[var(--muted)]">
            {k === 0 ? "k = 0 squashes the arrow to a point." : k < 0 ? "Negative k: flipped, and stretched by |k|." : "Positive k: same direction, stretched by k."}
          </p>
        </>
      }
    />
  );
}

function ComboWidget({ v, w, a: a0, b: b0 }: { v: Vec; w: Vec; a: number; b: number }) {
  const [a, setA] = useState(a0);
  const [b, setB] = useState(b0);
  const av: Vec = [a * v[0], a * v[1]];
  const total: Vec = [av[0] + b * w[0], av[1] + b * w[1]];
  return (
    <Panel
      plane={
        <Plane>
          {() => (
            <>
              <Grid />
              <Arrow to={v} color="var(--a)" dashed />
              <Arrow to={w} color="var(--b)" dashed />
              <Arrow to={av} color="var(--a)" label="av" />
              <Arrow from={av} to={total} color="var(--b)" label="bw" />
              <Arrow to={total} color="var(--v)" />
            </>
          )}
        </Plane>
      }
      side={
        <>
          <Slider label={<Tex src="a" />} value={a} min={-4} max={4} step={0.5} onChange={setA} />
          <Slider label={<Tex src="b" />} value={b} min={-4} max={4} step={0.5} onChange={setB} />
          <p className="text-lg leading-loose">
            <Tex src={`${fmt(a)}{\\color{#3b82f6}${col(v)}} + ${fmt(b)}{\\color{#ec4899}${col(w)}} = ${col(total)}`} />
          </p>
        </>
      }
    />
  );
}

const PRESETS: { name: string; m: Mat }[] = [
  { name: "Reset", m: [[1, 0], [0, 1]] },
  { name: "Rotate 90°", m: [[0, -1], [1, 0]] },
  { name: "Shear", m: [[1, 1], [0, 1]] },
  { name: "Stretch", m: [[2, 0], [0, 1]] },
  { name: "Mirror", m: [[-1, 0], [0, 1]] },
  { name: "Squash flat", m: [[1, 2], [0.5, 1]] },
];

/** The unit square after the transformation: a parallelogram spanned by î and ĵ. */
function AreaPatch({ i, j, det }: { i: Vec; j: Vec; det: number }) {
  const pts = [[0, 0], i, [i[0] + j[0], i[1] + j[1]], j].map((p) => toPx(p as Vec).join(",")).join(" ");
  return <polygon points={pts} fill={det < 0 ? "var(--j)" : "var(--accent)"} fillOpacity={0.22} />;
}

function TransformWidget({ matrix, showVector, lockMatrix, showArea }: { matrix: Mat; showVector?: Vec; lockMatrix?: boolean; showArea?: boolean }) {
  const [m, setM] = useState<Mat>(matrix);
  const i: Vec = [m[0][0], m[1][0]];
  const j: Vec = [m[0][1], m[1][1]];
  const out = showVector ? mul(m, showVector) : null;
  const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  return (
    <Panel
      plane={
        <Plane
          onDrag={
            lockMatrix
              ? undefined
              : (k, q) => {
                  const s: Vec = [clamp(snap(q[0], 0.5)), clamp(snap(q[1], 0.5))];
                  setM((cur) => (k === "i" ? [[s[0], cur[0][1]], [s[1], cur[1][1]]] : [[cur[0][0], s[0]], [cur[1][0], s[1]]]));
                }
          }
        >
          {(drag) => (
            <>
              <Grid faint />
              <Grid m={m} />
              {showArea && <AreaPatch i={i} j={j} det={det} />}
              {showVector && <Arrow to={showVector} color="var(--v)" dashed />}
              {out && <Arrow to={out} color="var(--v)" />}
              <Arrow to={i} color="var(--i)" label="î" />
              <Arrow to={j} color="var(--j)" label="ĵ" />
              {!lockMatrix && <Handle at={i} color="var(--i)" onDown={drag("i")} />}
              {!lockMatrix && <Handle at={j} color="var(--j)" onDown={drag("j")} />}
            </>
          )}
        </Plane>
      }
      side={
        <>
          <p className="text-2xl">
            <Tex src={`\\begin{bmatrix}\\color{#22c55e}${fmt(m[0][0])}&\\color{#ef4444}${fmt(m[0][1])}\\\\\\color{#22c55e}${fmt(m[1][0])}&\\color{#ef4444}${fmt(m[1][1])}\\end{bmatrix}`} />
          </p>
          <p className="text-sm">
            <span className="text-[var(--i)] font-semibold">Green column</span> = where î lands.{" "}
            <span className="text-[var(--j)] font-semibold">Red column</span> = where ĵ lands.
          </p>
          {showVector && out && (
            <p className="text-lg">
              <Tex src={`${mat(m)}${col(showVector)} = \\color{#eab308}${col(out)}`} />
            </p>
          )}
          {!lockMatrix && (
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.name} type="button" onClick={() => setM(p.m)} className="chip">
                  {p.name}
                </button>
              ))}
            </div>
          )}
          {showArea && (
            <p className="text-lg">
              <Tex src={`\\det = ${par(m[0][0])}\\cdot${par(m[1][1])} - ${par(m[0][1])}\\cdot${par(m[1][0])} = ${fmt(det)}`} />
              <span className="block text-sm text-[var(--muted)]">
                Shaded area = {fmt(Math.abs(det))}
                {det < 0 ? " · flipped (î and ĵ swapped sides)" : ""}
              </span>
            </p>
          )}
          {Math.abs(det) < 1e-9 && (
            <p className="text-sm text-[var(--muted)]">î and ĵ landed on one line: the whole plane got squashed flat.</p>
          )}
        </>
      }
    />
  );
}

function ComposeWidget({ first, second, firstName = "Rotate", secondName = "shear" }: { first: Mat; second: Mat; firstName?: string; secondName?: string }) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const low = (s: string) => (s === s.toUpperCase() ? s : s.charAt(0).toLowerCase() + s.slice(1));
  const [swapped, setSwapped] = useState(false);
  // "first then second" = second · first
  const product = swapped ? mmul(first, second) : mmul(second, first);
  const i: Vec = [product[0][0], product[1][0]];
  const j: Vec = [product[0][1], product[1][1]];
  return (
    <Panel
      plane={
        <Plane>
          {() => (
            <>
              <Grid faint />
              <Grid m={product} />
              <Arrow to={i} color="var(--i)" label="î" />
              <Arrow to={j} color="var(--j)" label="ĵ" />
            </>
          )}
        </Plane>
      }
      side={
        <>
          <div className="flex gap-2">
            <button type="button" className={`chip ${!swapped ? "chip-on" : ""}`} onClick={() => setSwapped(false)}>
              {cap(firstName)}, then {low(secondName)}
            </button>
            <button type="button" className={`chip ${swapped ? "chip-on" : ""}`} onClick={() => setSwapped(true)}>
              {cap(secondName)}, then {low(firstName)}
            </button>
          </div>
          <p className="text-lg">
            <Tex src={`${swapped ? mat(first) + mat(second) : mat(second) + mat(first)} = ${mat(product)}`} />
          </p>
          <p className="text-sm">
            î ends at <Tex src={col(i)} />. The matrix on the <strong>right</strong> acts first.
          </p>
        </>
      }
    />
  );
}

function SolveWidget({ matrix, target, start }: { matrix: Mat; target: Vec; start: Vec }) {
  const [x, setX] = useState<Vec>(start);
  const out = mul(matrix, x);
  const hit = Math.abs(out[0] - target[0]) < 1e-9 && Math.abs(out[1] - target[1]) < 1e-9;
  const [tx, ty] = toPx(target);
  return (
    <Panel
      plane={
        <Plane onDrag={(_k, q) => setX([clamp(snap(q[0], 0.5)), clamp(snap(q[1], 0.5))])}>
          {(drag) => (
            <>
              <Grid />
              <circle cx={tx} cy={ty} r={9} fill="none" stroke="var(--sum)" strokeWidth={3} strokeDasharray="4 3" />
              <Arrow to={x} color="var(--a)" label="x" />
              <Arrow to={out} color="var(--v)" label="Ax" />
              <Handle at={x} color="var(--a)" onDown={drag("x")} />
            </>
          )}
        </Plane>
      }
      side={
        <>
          <p className="text-lg">
            <Tex src={`${mat(matrix)}{\\color{#3b82f6}${col(x)}} = {\\color{#eab308}${col(out)}}`} />
          </p>
          <p className="text-sm">
            Drag the <span className="text-[var(--a)] font-semibold">blue input</span> until the{" "}
            <span className="text-[var(--v)] font-semibold">yellow output</span> lands in the green ring at <Tex src={col(target)} />.
          </p>
          {hit && <p className="feedback feedback-ok font-semibold">🎯 Hit! The input was <Tex src={col(x)} />.</p>}
        </>
      }
    />
  );
}

export function WidgetView({ widget }: { widget: Widget }) {
  switch (widget.kind) {
    case "vector":
      return <VectorWidget start={widget.start} />;
    case "vector-add":
      return <VectorAddWidget a={widget.a} b={widget.b} />;
    case "scale":
      return <ScaleWidget v={widget.v} k={widget.k} />;
    case "combo":
      return <ComboWidget v={widget.v} w={widget.w} a={widget.a} b={widget.b} />;
    case "transform":
      return <TransformWidget matrix={widget.matrix} showVector={widget.showVector} lockMatrix={widget.lockMatrix} showArea={widget.showArea} />;
    case "compose":
      return <ComposeWidget first={widget.first} second={widget.second} firstName={widget.firstName} secondName={widget.secondName} />;
    case "solve":
      return <SolveWidget matrix={widget.matrix} target={widget.target} start={widget.start} />;
  }
}
