import type { BarsDist, IntroSpec, V2 } from "@/lib/content/intro";
import { fillShape, matrixAt, PATH, PCA_AXES, PCA_SD, surfaceY, VARIANCE_KEPT } from "@/components/landing/filmMath";

/**
 * Lesson-intro scenes as pure functions of scroll progress p (0 → 1) and a
 * clock. A program fills N particles and returns overlays (arrows, glowing
 * lines, a ball) and a live readout. No rendering here, so it's unit-testable.
 */

export const N = 4096;
export type V3 = [number, number, number];
export type RGB = [number, number, number];
export type Arrow = { v: V3; from?: V3; color: number; o: number };
export type Line = { a: V3; b: V3; c: RGB; o: number };
export type Frame = { arrows: Arrow[]; lines: Line[]; ball?: { p: V3; o: number }; hud: string };
export type View = { dist: number; yaw: number; elev: number };
export type Program = { view: View; frame: (p: number, time: number, pos: Float32Array, col: Float32Array, size: Float32Array) => Frame };

// ---------- helpers ----------

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
function mulberry(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gaussFrom = (r: () => number) => () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
const mixc = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const scale = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];
const f2 = (x: number) => (Math.abs(x) < 0.005 ? "0" : String(Math.round(x * 100) / 100));
const pct = (x: number) => `${Math.round(x * 100)}%`;
/** Standard normal CDF (Abramowitz–Stegun 7.1.26). */
export function phi(z: number) {
  const t = 1 / (1 + 0.3275911 * (Math.abs(z) / Math.SQRT2));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

const BLUE: RGB = [0.42, 0.52, 1.0];
const DIM: RGB = [0.22, 0.27, 0.55];
const WHITE: RGB = [0.95, 0.95, 1.0];
const GOLD: RGB = [1.0, 0.76, 0.32];
const RED: RGB = [1.0, 0.35, 0.35];
const PINK: RGB = [1.0, 0.45, 0.75];
const GREEN: RGB = [0.3, 0.9, 0.6];
const HEX = { i: 0x34d399, j: 0xf87171, gold: 0xffc35a, white: 0xffffff, blue: 0x60a5fa, pink: 0xf9a8d4 };
const DOT = 0.034;

type Writer = (i: number, x: number, y: number, z: number, c: RGB, s: number) => void;
const writer = (pos: Float32Array, col: Float32Array, size: Float32Array): Writer => (i, x, y, z, c, s) => {
  pos[i * 3] = x;
  pos[i * 3 + 1] = y;
  pos[i * 3 + 2] = z;
  col[i * 3] = c[0];
  col[i * 3 + 1] = c[1];
  col[i * 3 + 2] = c[2];
  size[i] = s;
};
/** Park unused particles invisibly at the origin. */
const park = (w: Writer, from: number) => {
  for (let i = from; i < N; i++) w(i, 0, 0, 0, [0, 0, 0], 0.0001);
};

// ---------- 2D linear algebra (vectors and matrices on a grid) ----------

const S2 = 0.3; // one unit in world space
type M2 = number[][];
const I2: M2 = [[1, 0], [0, 1]];
const lerpM = (a: M2, b: M2, t: number): M2 => a.map((row, r) => row.map((x, c) => x + (b[r][c] - x) * t));
const mulM = (a: M2, b: M2): M2 => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
];
const app = (m: M2, v: V2): V2 => [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]];
const det2 = (m: M2) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const w3 = (v: V2): V3 => [v[0] * S2, v[1] * S2, 0];
/** Real eigenpairs of a 2×2 matrix, largest first (empty if complex). */
export function eigen2(m: M2): { value: number; vector: V2 }[] {
  const [[a, b], [c, d]] = m;
  const tr = a + d;
  const disc = (tr * tr) / 4 - (a * d - b * c);
  if (disc < -1e-12) return [];
  const r = Math.sqrt(Math.max(0, disc));
  const out: { value: number; vector: V2 }[] = [];
  for (const l of r < 1e-9 ? [tr / 2] : [tr / 2 + r, tr / 2 - r]) {
    let v: V2 = Math.abs(b) > 1e-9 ? [b, l - a] : Math.abs(c) > 1e-9 ? [l - d, c] : Math.abs(l - a) < 1e-9 ? [1, 0] : [0, 1];
    const n = Math.hypot(v[0], v[1]);
    v = [v[0] / n, v[1] / n];
    out.push({ value: l, vector: v });
  }
  return out;
}

/** 11 + 11 grid lines from −5 to 5 as particles: 4,092 of them. */
const GRID_LINES = 11;
const PER_LINE = 186;
const GRID: { x: number; y: number; axis: boolean }[] = [];
for (let d = 0; d < 2; d++)
  for (let k = -5; k <= 5; k++)
    for (let j = 0; j < PER_LINE; j++) {
      const t = -5 + (10 * j) / (PER_LINE - 1);
      GRID.push(d === 0 ? { x: t, y: k, axis: k === 0 } : { x: k, y: t, axis: k === 0 });
    }

function drawGrid(w: Writer, m: M2, bright = 1, gold?: (x: number, y: number) => boolean) {
  GRID.forEach((g, i) => {
    const [x, y] = app(m, [g.x, g.y]);
    const c = gold?.(g.x, g.y) ? scale(GOLD, 1.3) : g.axis ? scale(WHITE, 0.55 * bright) : scale(BLUE, 0.55 * bright);
    w(i, x * S2, y * S2, 0, c, DOT * (g.axis ? 1.1 : 0.9));
  });
  park(w, GRID.length);
}
const basisArrows = (m: M2, o: number): Arrow[] => [
  { v: w3([m[0][0], m[1][0]]), color: HEX.i, o },
  { v: w3([m[0][1], m[1][1]]), color: HEX.j, o },
];
const mat2Text = (m: M2) => `[ ${f2(m[0][0])}  ${f2(m[0][1])} ; ${f2(m[1][0])}  ${f2(m[1][1])} ]`;

function planeProgram(spec: Extract<IntroSpec, { kind: "plane" }>): Program {
  const M1 = spec.m;
  const total = spec.then ? mulM(spec.then, M1) : M1;
  const eig = spec.eigen ? eigen2(M1) : [];
  const solution = spec.target ? app(inv2(M1), spec.target) : null;
  return {
    view: { dist: 7.6, yaw: 0.4, elev: 0.18 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      let M: M2;
      if (spec.then) {
        const t2 = smooth(0.55, 0.88, p);
        M = t2 > 0 ? lerpM(M1, total, t2) : lerpM(I2, M1, smooth(0.12, 0.45, p));
      } else M = lerpM(I2, M1, smooth(spec.target ? 0.08 : 0.15, spec.target ? 0.35 : 0.55, p));
      const inSquare = spec.area ? (x: number, y: number) => x >= -1e-9 && x <= 1 + 1e-9 && y >= -1e-9 && y <= 1 + 1e-9 && (Math.abs(x) < 1e-9 || Math.abs(x - 1) < 1e-9 || Math.abs(y) < 1e-9 || Math.abs(y - 1) < 1e-9) : undefined;
      drawGrid(w, M, 1, inSquare);
      const arrows = basisArrows(M, 1);
      const lines: Line[] = [];
      let hud = `M = ${mat2Text(M)}`;
      if (spec.area) {
        const corners: V2[] = [[0, 0], [1, 0], [1, 1], [0, 1]].map((c) => app(M, c as V2));
        corners.forEach((c, k) => lines.push({ a: w3(c), b: w3(corners[(k + 1) % 4]), c: GOLD, o: 1 }));
        const d = det2(M);
        hud += `  ·  area ×${f2(Math.abs(d))}${d < -1e-6 ? ", flipped" : Math.abs(d) < 0.02 ? ": squashed flat" : ""}`;
      }
      if (spec.vector) {
        const v = spec.vector;
        arrows.push({ v: w3(app(M, v)), color: HEX.gold, o: 1 });
        hud += `  ·  M${vtxt(v)} = ${vtxt(app(M, v))}`;
      }
      if (eig.length) {
        const o = smooth(0.55, 0.75, p);
        eig.forEach((e, k) => {
          const d = e.vector;
          lines.push({ a: w3([-8 * d[0], -8 * d[1]]), b: w3([8 * d[0], 8 * d[1]]), c: k === 0 ? GOLD : PINK, o: o * 0.8 });
          arrows.push({ v: w3(app(M, [2 * d[0], 2 * d[1]])), color: k === 0 ? HEX.gold : HEX.pink, o });
        });
        if (o > 0.3) hud = `${eig.map((e, k) => `λ${k === 0 ? "₁" : "₂"} = ${f2(e.value)}`).join("  ·  ")}  ·  vectors on these lines only stretch`;
      }
      if (spec.then) {
        const name = p < 0.5 ? (spec.firstName ?? "first") : `${spec.thenName ?? "then"} after ${spec.firstName ?? "first"}`;
        hud = `${name}: ${mat2Text(M)}`;
      }
      if (solution && spec.target) {
        const x: V2 = [solution[0] * smooth(0.4, 0.9, p), solution[1] * smooth(0.4, 0.9, p)];
        const b = spec.target;
        arrows.push({ v: w3(app(M, x)), color: HEX.gold, o: smooth(0.35, 0.45, p) });
        const s = 0.18;
        lines.push({ a: w3([b[0] - s, b[1]]), b: w3([b[0] + s, b[1]]), c: WHITE, o: 1 }, { a: w3([b[0], b[1] - s]), b: w3([b[0], b[1] + s]), c: WHITE, o: 1 });
        hud = `x = ${vtxt(x)}  →  Ax = ${vtxt(app(M, x))}  ·  target b = ${vtxt(b)}`;
      }
      return { arrows, lines, hud };
    },
  };
}
const vtxt = (v: V2) => `(${f2(v[0])}, ${f2(v[1])})`;
const inv2 = (m: M2): M2 => {
  const d = det2(m);
  return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]];
};

function vectorsProgram(spec: Extract<IntroSpec, { kind: "vectors" }>): Program {
  const v = spec.v;
  const u = spec.w ?? [0, 1];
  const r = mulberry(11);
  const coeff = Array.from({ length: N }, () => [-2.2 + 4.4 * r(), -2.2 + 4.4 * r()]);
  const dependent = Math.abs(v[0] * u[1] - v[1] * u[0]) < 1e-9;
  return {
    view: { dist: 7.6, yaw: 0.4, elev: 0.18 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const arrows: Arrow[] = [];
      const lines: Line[] = [];
      let hud = "";
      if (spec.op === "span") {
        const t = smooth(0.3, 0.75, p);
        GRID.forEach((g, i) => {
          const s = [coeff[i][0] * v[0] + coeff[i][1] * u[0], coeff[i][0] * v[1] + coeff[i][1] * u[1]];
          const k = clamp((t - (i % 97) / 400) / 0.75, 0, 1);
          const x = g.x + (s[0] - g.x) * k;
          const y = g.y + (s[1] - g.y) * k;
          w(i, x * S2, y * S2, 0, mixc(scale(BLUE, 0.45), scale(GOLD, 0.8), k), DOT * (0.9 + 0.2 * k));
        });
        park(w, GRID.length);
        arrows.push({ v: w3(v), color: HEX.i, o: 1 }, { v: w3(u), color: HEX.j, o: 1 });
        const ratio = Math.abs(v[0]) > 1e-9 ? u[0] / v[0] : u[1] / v[1];
        hud = t < 0.95 ? `every combination a·v + b·w …` : dependent ? `span: one line. w is just ${f2(ratio)}v, so it adds nothing new` : `span: the whole plane. v and w point in different directions`;
        return { arrows, lines, hud };
      }
      drawGrid(w, I2, 0.75);
      const grow = (a: number, b: number) => smooth(a, b, p);
      if (spec.op === "show") {
        const t = grow(0.15, 0.5);
        arrows.push({ v: w3([v[0] * t, v[1] * t]), color: HEX.gold, o: 1 });
        const o = grow(0.55, 0.75);
        lines.push({ a: [0, 0, 0], b: w3([v[0], 0]), c: GREEN, o }, { a: w3([v[0], 0]), b: w3(v), c: RED, o });
        hud = o > 0.3 ? `v = ${vtxt(v)}: ${Math.abs(v[0])} ${v[0] < 0 ? "left" : "right"}, ${Math.abs(v[1])} ${v[1] < 0 ? "down" : "up"}` : "a vector is a movement";
      } else if (spec.op === "add") {
        const ta = grow(0.1, 0.35);
        const tb = grow(0.4, 0.6);
        const ts = grow(0.65, 0.85);
        arrows.push({ v: w3([v[0] * ta, v[1] * ta]), color: HEX.i, o: 1 });
        arrows.push({ v: w3([u[0] * tb, u[1] * tb]), from: w3(v), color: HEX.j, o: tb > 0 ? 1 : 0 });
        const s: V2 = [v[0] + u[0], v[1] + u[1]];
        arrows.push({ v: w3([s[0] * ts, s[1] * ts]), color: HEX.gold, o: ts > 0 ? 1 : 0 });
        hud = ts > 0.5 ? `a + b = ${vtxt(v)} + ${vtxt(u)} = ${vtxt(s)}` : "a, then b from where a ends";
      } else if (spec.op === "scale") {
        const k = p < 0.55 ? 1 + 1.2 * grow(0.15, 0.45) : 2.2 - 3.7 * grow(0.6, 0.9);
        arrows.push({ v: w3(v), color: HEX.blue, o: 0.35 });
        arrows.push({ v: w3([v[0] * k, v[1] * k]), color: HEX.gold, o: 1 });
        hud = `k = ${f2(k)}  ·  k·v = ${vtxt([v[0] * k, v[1] * k])}${k < 0 ? "  ·  negative k flips it" : ""}`;
      } else {
        const a = (spec.a ?? 1) * grow(0.15, 0.5);
        const b = (spec.b ?? 1) * grow(0.45, 0.8);
        const av: V2 = [v[0] * a, v[1] * a];
        arrows.push({ v: w3(av), color: HEX.i, o: 1 });
        arrows.push({ v: w3([u[0] * b, u[1] * b]), from: w3(av), color: HEX.j, o: b !== 0 ? 1 : 0 });
        const s: V2 = [av[0] + u[0] * b, av[1] + u[1] * b];
        arrows.push({ v: w3(s), color: HEX.gold, o: grow(0.5, 0.6) });
        hud = `${f2(a)}·${vtxt(v)} + ${f2(b)}·${vtxt(u)} = ${vtxt(s)}`;
      }
      return { arrows, lines, hud };
    },
  };
}

// ---------- 3D linear algebra and PCA (shared with the landing film) ----------

function latticeProgram(): Program {
  return {
    view: { dist: 7.8, yaw: 0.95, elev: 0.3 },
    frame(p, time, pos, col, size) {
      const u = smooth(0.1, 0.9, p);
      fillShape(1, u, time, pos, col, size);
      const M = matrixAt(smooth(0, 0.6, u));
      const h = smooth(0.55, 0.8, u);
      const s = 0.85;
      const arrows: Arrow[] = [0, 1, 2].map((c) => ({ v: [M[c] * s, M[3 + c] * s, M[6 + c] * s] as V3, color: [HEX.i, HEX.j, HEX.blue][c], o: 1 }));
      const lines: Line[] = [{ a: [-3, -3, -3], b: [3, 3, 3], c: GOLD, o: h * 0.9 }];
      return { arrows, lines, hud: h > 0.4 ? `λ = ${f2(1 + 0.7 * smooth(0, 0.6, u))} along (1, 1, 1): the gold line only stretches` : `3 × 3 matrix acting on 4,096 points` };
    },
  };
}

function cloudProgram(spec: Extract<IntroSpec, { kind: "cloud" }>): Program {
  if (spec.flatten)
    return {
      view: { dist: 8.6, yaw: 3.49, elev: 0.82 },
      frame(p, time, pos, col, size) {
        const u = smooth(0.05, 0.95, p);
        fillShape(3, u, time, pos, col, size);
        const grow = smooth(0.12, 0.4, u);
        const flat = smooth(0.5, 0.9, u);
        const arrows: Arrow[] = PCA_AXES.map((q, k) => ({ v: q.map((x) => x * PCA_SD[k] * 2.2 * grow * (k === 2 ? 1 - flat : 1)) as V3, color: [HEX.white, HEX.blue, HEX.pink][k], o: 1 }));
        return { arrows, lines: [], hud: `${flat > 0.98 ? 2 : 3} dimensions  ·  variance kept ${(100 - flat * (1 - VARIANCE_KEPT) * 100).toFixed(1)}%` };
      },
    };
  const g = gaussFrom(mulberry(5));
  const Z = Array.from({ length: N }, () => [clamp(g(), -3, 3), clamp(g(), -3, 3), clamp(g(), -3, 3)]);
  return {
    view: { dist: 6.4, yaw: 0.3, elev: 0.22 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const rho = 0.85 * smooth(0.15, 0.75, p);
      const s = 0.62;
      Z.forEach((z, i) => {
        const x = z[0] * s;
        const y = (rho * z[0] + Math.sqrt(1 - rho * rho) * z[1]) * s;
        w(i, x, y, z[2] * 0.12, mixc([0.3, 0.5, 1.0], [1.0, 0.45, 0.7], clamp((z[0] + z[1] + 3) / 6, 0, 1)), DOT);
      });
      const lines: Line[] = [{ a: [-2, -2 * rho, 0], b: [2, 2 * rho, 0], c: GOLD, o: smooth(0.3, 0.8, p) * 0.8 }];
      return { arrows: [], lines, hud: `correlation ρ = ${f2(rho)}  ·  covariance ${f2(rho)} (both standardised)` };
    },
  };
}

// ---------- Distributions as piles of glowing particles ----------

type Bin = { x: number; p: number };
function binsFor(d: BarsDist): { bins: Bin[]; lo: number; hi: number; label: (x: number) => string } {
  const norm = (bs: Bin[]) => {
    const s = bs.reduce((a, b) => a + b.p, 0);
    return bs.map((b) => ({ x: b.x, p: b.p / s }));
  };
  const choose = (n: number, k: number) => {
    let c = 1;
    for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
    return c;
  };
  const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
  switch (d.type) {
    case "coin":
      return { bins: [{ x: 0, p: 0.5 }, { x: 1, p: 0.5 }], lo: -0.5, hi: 1.5, label: (x) => (x ? "tails" : "heads") };
    case "die":
      return { bins: [1, 2, 3, 4, 5, 6].map((x) => ({ x, p: 1 / 6 })), lo: 0.5, hi: 6.5, label: String };
    case "two-coins":
      return { bins: [{ x: 0, p: 0.25 }, { x: 1, p: 0.5 }, { x: 2, p: 0.25 }], lo: -0.5, hi: 2.5, label: String };
    case "binomial":
      return { bins: Array.from({ length: d.n + 1 }, (_, k) => ({ x: k, p: choose(d.n, k) * d.p ** k * (1 - d.p) ** (d.n - k) })), lo: -0.5, hi: d.n + 0.5, label: String };
    case "poisson":
      return { bins: norm(Array.from({ length: 11 }, (_, k) => ({ x: k, p: (Math.exp(-d.lambda) * d.lambda ** k) / fact(k) }))), lo: -0.5, hi: 10.5, label: String };
    case "normal":
      return { bins: norm(Array.from({ length: 31 }, (_, k) => ({ x: -3.5 + (7 * k) / 30, p: Math.exp(-((-3.5 + (7 * k) / 30) ** 2) / 2) }))), lo: -3.75, hi: 3.75, label: f2 };
    case "exponential":
    case "clt":
      return { bins: norm(Array.from({ length: 30 }, (_, k) => ({ x: ((k + 0.5) * 3.2) / 30, p: Math.exp(-((k + 0.5) * 3.2) / 30) }))), lo: 0, hi: 3.2, label: f2 };
    case "likelihood":
      return { bins: Array.from({ length: d.flips + 1 }, (_, k) => ({ x: k, p: 0 })), lo: -0.5, hi: d.flips + 0.5, label: String };
    case "values":
      return { bins: [], lo: 0, hi: d.max, label: String };
  }
}

/** Column slot for the k-th particle stacked in a bar at world x. */
function slot(x: number, k: number, cols: number, layerH: number): V3 {
  const per = cols * 4;
  const layer = Math.floor(k / per);
  const q = k % per;
  return [x + ((q % cols) - (cols - 1) / 2) * 0.045, -1 + layer * layerH, (Math.floor(q / cols) - 1.5) * 0.045];
}

function barsProgram(spec: Extract<IntroSpec, { kind: "bars" }>): Program {
  const d = spec.dist;
  if (d.type === "values") return valuesProgram(d, spec.marks);
  const { bins, lo, hi } = binsFor(d);
  const X = (x: number) => -1.8 + ((x - lo) / (hi - lo)) * 3.6;
  const binW = 3.6 / bins.length;
  const cols = clamp(Math.floor((binW * 0.8) / 0.045), 1, 5);
  const USED = 3600;
  const r = mulberry(17);
  const order = Array.from({ length: USED }, (_, i) => i).sort(() => r() - 0.5); // arrival order
  const arrive = new Float32Array(USED);
  order.forEach((i, rank) => (arrive[i] = rank / USED));
  const random = d.type === "coin" || d.type === "die" || d.type === "two-coins";
  // Random experiments: each particle is one outcome (counts wobble, then settle).
  const outcome = new Uint8Array(USED);
  if (random) for (let i = 0; i < USED; i++) {
    let u = r();
    let k = 0;
    while (k < bins.length - 1 && u > bins[k].p) u -= bins[k++].p;
    outcome[i] = k;
  }
  // Rank-based layout for a probability vector: particle rank → (bin, height in stack).
  const layout = (probs: number[]) => {
    const total = probs.reduce((a, b) => a + b, 0) || 1;
    const counts = probs.map((q) => Math.round((q / total) * USED));
    const max = Math.max(...counts, 1);
    const layerH = Math.min(0.06, 2.1 / Math.ceil(max / (cols * 4)));
    const out: V3[] = new Array(USED);
    let rank = 0;
    counts.forEach((c, b) => {
      for (let k = 0; k < c && rank < USED; k++) out[rank++] = slot(X(bins[b].x), k, cols, layerH);
    });
    while (rank < USED) out[rank++] = [0, -5, 0];
    return out;
  };
  const staticLayout = random || d.type === "likelihood" || d.type === "clt" ? null : layout(bins.map((b) => b.p));
  const cltB =
    d.type === "clt"
      ? layout(bins.map((b) => Math.exp(-((b.x - 1) ** 2) / (2 * 0.25))))
      : null; // averages of 4: mean 1, variance 1/4
  const cltA = d.type === "clt" ? layout(bins.map((b) => b.p)) : null;
  const choose = (n: number, k: number) => {
    let c = 1;
    for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
    return c;
  };
  const mean = bins.reduce((s, b) => s + b.x * b.p, 0);

  return {
    view: { dist: 6.4, yaw: 0.2, elev: 0.22 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const fill = smooth(0.05, 0.75, p);
      const lines: Line[] = [{ a: [-1.9, -1.02, 0], b: [1.9, -1.02, 0], c: WHITE, o: 0.35 }];
      let hud = "";
      let target: V3[];
      let hiBin = -1;
      if (random) {
        const counts = new Array(bins.length).fill(0);
        const max = Math.ceil((USED * Math.max(...bins.map((b) => b.p)) * 1.25) / (cols * 4));
        const layerH = Math.min(0.06, 2.1 / max);
        let arrived = 0;
        target = new Array(USED);
        for (const i of order) {
          const k = outcome[i];
          target[i] = slot(X(bins[k].x), counts[k], cols, layerH);
          if (arrive[i] <= fill) {
            counts[k]++;
            arrived++;
          }
        }
        const total = Math.max(1, arrived);
        if (d.type === "coin") hud = `${arrived.toLocaleString()} flips  ·  heads ${((100 * counts[0]) / total).toFixed(1)}%`;
        else if (d.type === "die") hud = `${arrived.toLocaleString()} rolls  ·  average ${(counts.reduce((s, c, k) => s + c * bins[k].x, 0) / total).toFixed(2)}  (expected 3.5)`;
        else hud = `${arrived.toLocaleString()} pairs of flips  ·  P(1 head) ≈ ${(counts[1] / total).toFixed(2)}`;
      } else if (d.type === "likelihood") {
        const q = 0.25 + (d.heads / d.flips - 0.25) * smooth(0.25, 0.85, p);
        target = layout(bins.map((b) => choose(d.flips, b.x) * q ** b.x * (1 - q) ** (d.flips - b.x)));
        hiBin = d.heads;
        const like = choose(d.flips, d.heads) * q ** d.heads * (1 - q) ** (d.flips - d.heads);
        hud = `p = ${q.toFixed(2)}  ·  P(${d.heads} heads in ${d.flips}) = ${like.toFixed(3)}${q > d.heads / d.flips - 0.005 ? "  ·  the most likely p" : ""}`;
      } else if (cltA && cltB) {
        const t = smooth(0.55, 0.9, p);
        target = cltA.map((a, i) => [a[0] + (cltB[i][0] - a[0]) * t, a[1] + (cltB[i][1] - a[1]) * t, a[2] + (cltB[i][2] - a[2]) * t] as V3);
        hud = t < 0.5 ? "single values: very skewed (σ = 1)" : "averages of 4 values: already bell-shaped, spread σ/√4 = 0.5";
      } else {
        target = staticLayout!;
        if (d.type === "binomial") hud = `n = ${d.n}, p = ${d.p}  ·  mean np = ${f2(d.n * d.p)}  ·  variance ${f2(d.n * d.p * (1 - d.p))}`;
        else if (d.type === "poisson") hud = `λ = ${d.lambda}  ·  mean = variance = ${d.lambda}`;
        else if (d.type === "exponential") hud = "waiting times: mean 1/λ = 1, a long right tail";
        else if (d.type === "normal") hud = "68% within 1σ  ·  95% within 2σ";
      }
      for (let i = 0; i < USED; i++) {
        const tg = target[i];
        const a = random ? arrive[i] : arrive[i] * 0.75;
        const f = random ? (arrive[i] <= fill ? 1 : 0) : smooth(a * 0.95, a * 0.95 + 0.12, fill);
        const y = tg[1] + (1 - f) * 1.4;
        const bin = Math.round(((tg[0] + 1.8) / 3.6) * (hi - lo) + lo);
        const c = hiBin >= 0 && Math.abs(bin - bins[hiBin].x) < 0.5 ? scale(GOLD, 1.2) : mixc(BLUE, PINK, clamp((tg[1] + 1) / 2.2, 0, 1));
        w(i, tg[0], y, tg[2], scale(c, 0.15 + 0.85 * f), DOT * (f > 0 ? 1 : 0.4));
      }
      park(w, USED);
      const showMark = smooth(0.75, 0.9, p);
      if (spec.marks === "mean" && !random && d.type !== "likelihood") lines.push({ a: [X(mean), -1, 0], b: [X(mean), 1.3, 0], c: GOLD, o: showMark });
      if (spec.marks === "mean" && random && d.type === "die") lines.push({ a: [X(3.5), -1, 0], b: [X(3.5), 1.3, 0], c: GOLD, o: showMark });
      if (spec.marks === "spread") [-2, -1, 1, 2].forEach((s) => lines.push({ a: [X(s), -1, 0], b: [X(s), 1.2, 0], c: Math.abs(s) === 1 ? GOLD : PINK, o: showMark * 0.8 }));
      return { arrows: [], lines, hud };
    },
  };
}

/** A handful of data values as glowing balls on a number line, with mean/median, box plot or deviations. */
function valuesProgram(d: Extract<BarsDist, { type: "values" }>, marks?: "mean" | "box" | "spread"): Program {
  const values = [...d.values];
  const n = values.length;
  const per = Math.floor(3800 / n);
  const rand = mulberry(3);
  const g = gaussFrom(rand);
  // Points uniform in a ball of radius 0.085 (direction from a Gaussian, radius ∝ cube root).
  const blob = Array.from({ length: per }, () => {
    const v = [g(), g(), g()];
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    const r = 0.05 * Math.cbrt(rand());
    return [(v[0] / l) * r, (v[1] / l) * r, (v[2] / l) * r];
  });
  const sortedIdx = values.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const maxV = d.max;
  const moveOutlier = marks === "mean" && Math.max(...values) < maxV * 0.6;
  const lo = Math.min(...values) - 1;
  const hi = Math.max(moveOutlier ? maxV * 0.9 : Math.max(...values), ...values) + 1;
  const X = (x: number) => -1.8 + ((x - lo) / (hi - lo)) * 3.6;
  const quart = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    const med = (a: number[]) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
    return { q1: med(s.slice(0, Math.floor(s.length / 2))), median: med(s), q3: med(s.slice(Math.ceil(s.length / 2))) };
  };
  return {
    view: { dist: 5.6, yaw: 0.15, elev: 0.18 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const vals = [...values];
      if (moveOutlier) {
        const top = sortedIdx[n - 1];
        vals[top] = values[top] + (maxV * 0.9 - values[top]) * smooth(0.72, 0.95, p);
      }
      const seen = new Map<number, number>();
      sortedIdx.forEach((vi, order) => {
        const v = vals[vi];
        const key = Math.round(v * 100);
        const stack = seen.get(key) ?? 0;
        seen.set(key, stack + 1);
        const appear = smooth(0.05 + (order / n) * 0.4, 0.12 + (order / n) * 0.4, p);
        const cy = -0.7 + stack * 0.12 + (1 - appear) * 2.2;
        const { q1, q3 } = quart(vals);
        const out = marks === "box" && (v > q3 + 1.5 * (q3 - q1) || v < q1 - 1.5 * (q3 - q1));
        for (let k = 0; k < per; k++) {
          const b = blob[k];
          w(vi * per + k, X(v) + b[0], cy + b[1], b[2], scale(out ? RED : BLUE, 0.5 + 0.5 * appear), DOT * 0.8);
        }
      });
      park(w, n * per);
      const lines: Line[] = [{ a: [-1.9, -0.82, 0], b: [1.9, -0.82, 0], c: WHITE, o: 0.4 }];
      for (let t = Math.ceil(lo); t <= hi; t += hi - lo > 20 ? 5 : hi - lo > 10 ? 2 : 1) lines.push({ a: [X(t), -0.86, 0], b: [X(t), -0.78, 0], c: WHITE, o: 0.4 });
      const o = smooth(0.5, 0.65, p);
      const mean = vals.reduce((s, x) => s + x, 0) / n;
      const { q1, median, q3 } = quart(vals);
      let hud = "";
      if (marks === "mean") {
        lines.push({ a: [X(mean), -0.82, 0.02], b: [X(mean), 0.9, 0.02], c: GOLD, o }, { a: [X(median), -0.82, 0], b: [X(median), 0.7, 0], c: WHITE, o: o * 0.8 });
        hud = `mean ${f2(mean)} (gold)  ·  median ${f2(median)} (white)${moveOutlier && p > 0.75 ? "  ·  one big value drags the mean" : ""}`;
      } else if (marks === "box") {
        const y0 = -0.5;
        const y1 = -0.3;
        const iqr = q3 - q1;
        const inside = vals.filter((x) => x >= q1 - 1.5 * iqr && x <= q3 + 1.5 * iqr);
        const lo = Math.min(...inside);
        const hi = Math.max(...inside);
        const seg = (a: V3, b: V3, c: RGB = GOLD) => lines.push({ a, b, c, o });
        seg([X(q1), y0, 0], [X(q3), y0, 0]);
        seg([X(q1), y1, 0], [X(q3), y1, 0]);
        seg([X(q1), y0, 0], [X(q1), y1, 0]);
        seg([X(q3), y0, 0], [X(q3), y1, 0]);
        seg([X(median), y0, 0], [X(median), y1, 0], WHITE);
        seg([X(lo), (y0 + y1) / 2, 0], [X(q1), (y0 + y1) / 2, 0], WHITE);
        seg([X(q3), (y0 + y1) / 2, 0], [X(hi), (y0 + y1) / 2, 0], WHITE);
        const outs = vals.filter((x) => !inside.includes(x));
        hud = `Q1 ${f2(q1)}  ·  median ${f2(median)}  ·  Q3 ${f2(q3)}  ·  IQR ${f2(iqr)}${outs.length ? `  ·  ${outs.join(", ")} is an outlier` : ""}`;
      } else {
        lines.push({ a: [X(mean), -0.82, 0], b: [X(mean), 1.0, 0], c: GOLD, o });
        const seen2 = new Map<number, number>();
        sortedIdx.forEach((vi) => {
          const key = Math.round(vals[vi] * 100);
          const stack = seen2.get(key) ?? 0;
          seen2.set(key, stack + 1);
          const y = -0.7 + stack * 0.12;
          lines.push({ a: [X(mean), y, 0], b: [X(vals[vi]), y, 0], c: PINK, o: smooth(0.62, 0.8, p) });
        });
        const variance = vals.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
        hud = `mean ${f2(mean)}  ·  variance ${f2(variance)} (average squared deviation)  ·  SD ${f2(Math.sqrt(variance))}`;
      }
      return { arrows: [], lines, hud };
    },
  };
}

function bellProgram(spec: Extract<IntroSpec, { kind: "bell" }>): Program {
  const r = mulberry(23);
  const pts: V3[] = [];
  const pdf = (x: number) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
  while (pts.length < N) {
    const x = -4 + 8 * r();
    const y = r() * 0.4;
    if (y <= pdf(x)) pts.push([x, y, -0.25 + 0.5 * r()]);
  }
  const z = Math.abs(spec.z);
  const pval = 2 * (1 - phi(z));
  return {
    view: { dist: 6.0, yaw: 0.35, elev: 0.2 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const zc = 4 - (4 - z) * smooth(0.25, 0.7, p);
      pts.forEach(([x, y, d], i) => {
        const tail = Math.abs(x) >= zc;
        w(i, x * 0.45, y * 3.6 - 0.7, d, tail ? scale(RED, 1.1) : scale(BLUE, 0.7), DOT * (tail ? 1.1 : 0.85));
      });
      const lines: Line[] = [-1, 1].map((s) => ({ a: [s * zc * 0.45, -0.72, 0] as V3, b: [s * zc * 0.45, pdf(zc) * 3.6 - 0.7 + 0.25, 0] as V3, c: GOLD, o: smooth(0.2, 0.3, p) }));
      lines.push({ a: [-1.85, -0.72, 0], b: [1.85, -0.72, 0], c: WHITE, o: 0.4 });
      const cur = 2 * (1 - phi(zc));
      return {
        arrows: [],
        lines,
        hud: `if there were no effect, values beyond ±${zc.toFixed(2)} happen ${(cur * 100).toFixed(1)}% of the time${p > 0.72 ? `  ·  ${pval < 0.05 ? "below 5%: significant" : "not below 5%"}` : ""}`,
      };
    },
  };
}

function intervalsProgram(): Program {
  // 40 sample means with exactly 2 misses, like a real run of 95% intervals.
  let seed = 1;
  let means: number[] = [];
  for (;;) {
    const g = gaussFrom(mulberry(seed++));
    means = Array.from({ length: 40 }, () => g());
    if (means.filter((m) => Math.abs(m) > 1.96).length === 2) break;
  }
  const PER = 80;
  return {
    view: { dist: 6.2, yaw: 0.4, elev: 0.12 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      let shown = 0;
      let caught = 0;
      means.forEach((m, k) => {
        const appear = smooth(0.08 + (k / 40) * 0.75, 0.1 + (k / 40) * 0.75, p);
        if (appear > 0.5) {
          shown++;
          if (Math.abs(m) <= 1.96) caught++;
        }
        const miss = Math.abs(m) > 1.96;
        const y = -1.35 + k * 0.07;
        for (let j = 0; j < PER; j++) {
          const x = (m - 1.96 + (3.92 * j) / (PER - 1)) * 0.4;
          w(k * PER + j, x, y, 0, scale(miss ? RED : BLUE, appear), DOT * (0.7 + 0.3 * appear));
        }
      });
      for (let i = 40 * PER; i < N; i++) {
        const t = (i - 40 * PER) / (N - 40 * PER);
        w(i, 0, -1.45 + t * 2.95, ((i * 7) % 5) * 0.02 - 0.04, scale(GOLD, 0.6), DOT * 0.7);
      }
      return { arrows: [], lines: [], hud: shown ? `${shown} samples  ·  ${caught} intervals caught the true mean (${pct(caught / shown)})` : "the gold line is the true mean" };
    },
  };
}

// ---------- 1,000 people ----------

function peopleProgram(spec: Extract<IntroSpec, { kind: "people" }>): Program {
  const COLS = 40;
  const ROWS = 25;
  const P = COLS * ROWS;
  const G = 0.068;
  const home = (k: number, cols = COLS, rows = ROWS, ox = 0, oz = 0): V3 => [ox + ((k % cols) - (cols - 1) / 2) * G, -0.6, oz + (Math.floor(k / cols) - (rows - 1) / 2) * G];
  const r = mulberry(31);
  const shuffled = Array.from({ length: P }, (_, i) => i).sort(() => r() - 0.5);
  const person = (w: Writer, k: number, at: V3, c: RGB, lift = 0) => {
    for (let j = 0; j < 4; j++) w(k * 4 + j, at[0], at[1] + lift + j * 0.026, at[2], j === 3 ? scale(c, 1.25) : c, DOT * (j === 3 ? 1.5 : 1.1));
  };
  const view = { dist: 7.2, yaw: 0.3, elev: 0.82 };

  if (spec.mode === "bayes") {
    const sick = new Set(shuffled.slice(0, Math.round(spec.prevalence * P)));
    const sickList = [...sick];
    const tp = new Set(sickList.slice(0, Math.round(spec.sensitivity * sick.size)));
    const healthy = shuffled.filter((k) => !sick.has(k));
    const fp = new Set(healthy.slice(0, Math.round(spec.falsePositive * healthy.length)));
    const positives = [...tp, ...fp];
    const posRank = new Map(positives.map((k, i) => [k, i]));
    const restRank = new Map(Array.from({ length: P }, (_, i) => i).filter((k) => !posRank.has(k)).map((k, i) => [k, i]));
    return {
      view,
      frame(p, _t, pos, col, size) {
        const w = writer(pos, col, size);
        const showSick = smooth(0.1, 0.3, p);
        const test = smooth(0.38, 0.55, p);
        const split = smooth(0.62, 0.9, p);
        for (let k = 0; k < P; k++) {
          const isSick = sick.has(k);
          const isPos = posRank.has(k);
          let at = home(k);
          if (split > 0) {
            const to = isPos ? home(posRank.get(k)!, 12, Math.ceil(positives.length / 12), 1.7, 0) : home(restRank.get(k)!, 36, 28, -0.45, 0);
            at = [at[0] + (to[0] - at[0]) * split, at[1], at[2] + (to[2] - at[2]) * split];
          }
          let c = scale(BLUE, 0.72);
          if (isSick) c = mixc(c, scale(RED, 1.4), showSick);
          if (isPos) c = mixc(c, isSick ? scale(RED, 1.3) : WHITE, test * 0.85);
          person(w, k, at, c, isPos ? test * 0.1 * (1 - split) : 0);
        }
        park(w, P * 4);
        const sickPos = [...tp].length;
        const hud =
          split > 0.5
            ? `of ${positives.length} positive tests, only ${sickPos} are sick: P(sick | positive) = ${pct(sickPos / positives.length)}`
            : test > 0.5
              ? `the test flags ${positives.length} people`
              : `1,000 people  ·  ${sick.size} have the disease (${pct(spec.prevalence)})`;
        return { arrows: [], lines: [], hud };
      },
    };
  }

  if (spec.mode === "sample" || spec.mode === "biased") {
    const chosen = new Set(spec.mode === "sample" ? shuffled.slice(0, 50) : Array.from({ length: P }, (_, k) => k).sort((a, b) => (a % COLS) + Math.floor(a / COLS) * 1.6 - ((b % COLS) + Math.floor(b / COLS) * 1.6)).slice(0, 50));
    return {
      view,
      frame(p, _t, pos, col, size) {
        const w = writer(pos, col, size);
        const pick = smooth(0.25, 0.6, p);
        const dimRest = smooth(0.6, 0.8, p);
        for (let k = 0; k < P; k++) {
          const on = chosen.has(k);
          person(w, k, home(k), on ? mixc(scale(BLUE, 0.72), GOLD, pick) : scale(DIM, 1.2 - 0.6 * dimRest), on ? pick * 0.14 : 0);
        }
        park(w, P * 4);
        return {
          arrows: [],
          lines: [],
          hud: spec.mode === "sample" ? "simple random sample: 50 of 1,000, every person equally likely" : "convenience sample: the 50 nearest the door. The far side never had a chance",
        };
      },
    };
  }

  if (spec.mode === "folds") {
    const FOLD = [GREEN, BLUE, PINK, GOLD, [0.6, 0.5, 1.0] as RGB];
    return {
      view,
      frame(p, _t, pos, col, size) {
        const w = writer(pos, col, size);
        const color = smooth(0.1, 0.3, p);
        const active = clamp(Math.floor(smooth(0.35, 0.95, p) * 5), 0, 4);
        for (let k = 0; k < P; k++) {
          const fold = Math.floor((k % COLS) / 8);
          const isVal = p > 0.35 && fold === active;
          const base = mixc(scale(BLUE, 0.72), scale(FOLD[fold], 0.55), color);
          person(w, k, home(k), isVal ? scale(WHITE, 1.0) : base, isVal ? 0.12 : 0);
        }
        park(w, P * 4);
        return { arrows: [], lines: [], hud: p > 0.35 ? `fold ${active + 1} of 5 held out for validation  ·  train on the other 800` : "split the data into 5 folds" };
      },
    };
  }

  // Two groups × yes/no, sorted into four blocks.
  const differ = spec.mode === "table-differ";
  const groupA = new Set(shuffled.slice(0, 600));
  const rateA = differ ? 0.6 : 0.5;
  const rateB = differ ? 0.3 : 0.5;
  const aList = shuffled.slice(0, 600);
  const bList = shuffled.slice(600);
  const yes = new Set([...aList.slice(0, Math.round(rateA * 600)), ...bList.slice(0, Math.round(rateB * 400))]);
  const cell = new Map<number, { block: number; rank: number }>();
  const counters = [0, 0, 0, 0];
  for (const k of shuffled) {
    const block = (groupA.has(k) ? 0 : 2) + (yes.has(k) ? 0 : 1);
    cell.set(k, { block, rank: counters[block]++ });
  }
  const obs = counters;
  const tot = 1000;
  const rowT = [600, 400];
  const colT = [obs[0] + obs[2], obs[1] + obs[3]];
  const chi = [0, 1, 2, 3].reduce((s, b) => {
    const e = (rowT[b >> 1] * colT[b & 1]) / tot;
    return s + (obs[b] - e) ** 2 / e;
  }, 0);
  return {
    view,
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const sort = smooth(0.2, 0.7, p);
      for (let k = 0; k < P; k++) {
        const { block, rank } = cell.get(k)!;
        const from = home(k);
        const to = home(rank, 20, 20, (block & 1 ? 1 : -1) * 0.95, (block >> 1 ? 1 : -1) * 0.65 - 0.2);
        const at: V3 = [from[0] + (to[0] - from[0]) * sort, from[1], from[2] + (to[2] - from[2]) * sort];
        const c = mixc(scale(BLUE, 0.72), groupA.has(k) ? scale(BLUE, 0.9) : scale(PINK, 0.9), smooth(0.05, 0.2, p));
        person(w, k, at, yes.has(k) ? scale(c, 1 + 0.6 * sort) : scale(c, 1 - 0.4 * sort));
      }
      park(w, P * 4);
      return {
        arrows: [],
        lines: [],
        hud:
          sort < 0.5
            ? "1,000 people: group A (blue) and group B (pink)"
            : `A: ${obs[0]} of 600 say yes (${pct(obs[0] / 600)})  ·  B: ${obs[2]} of 400 (${pct(obs[2] / 400)})  ·  χ² = ${chi.toFixed(1)}${differ ? "" : ": independent"}`,
      };
    },
  };
}

// ---------- Scatter plots and fits ----------

const ols = (pts: V2[]) => {
  const n = pts.length;
  const mx = pts.reduce((s, q) => s + q[0], 0) / n;
  const my = pts.reduce((s, q) => s + q[1], 0) / n;
  const sxy = pts.reduce((s, q) => s + (q[0] - mx) * (q[1] - my), 0);
  const sxx = pts.reduce((s, q) => s + (q[0] - mx) ** 2, 0);
  const w = sxy / sxx;
  return { w, b: my - w * mx };
};

function scatterProgram(spec: Extract<IntroSpec, { kind: "scatter" }>): Program {
  const g = gaussFrom(mulberry(41));
  const blobOf = (count: number, r: number) =>
    Array.from({ length: count }, () => {
      const v = [g(), g(), g()];
      const l = Math.hypot(v[0], v[1], v[2]) || 1;
      const k = r * (0.4 + 0.6 * Math.abs(g()) * 0.5);
      return [(v[0] / l) * k, (v[1] / l) * k, (v[2] / l) * k];
    });

  if (spec.fit === "plane") {
    const pts = Array.from({ length: 60 }, () => {
      const x1 = clamp(g() * 0.55, -1, 1);
      const x2 = clamp(g() * 0.55, -1, 1);
      return { x1, x2, y: 0.3 + 0.6 * x1 - 0.4 * x2 + g() * 0.1 };
    });
    // Normal equations for y = b + w1 x1 + w2 x2.
    const X = pts.map((q) => [1, q.x1, q.x2]);
    const XtX = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => X.reduce((s, row) => s + row[r] * row[c], 0)));
    const Xty = [0, 1, 2].map((r) => X.reduce((s, row, i) => s + row[r] * pts[i].y, 0));
    const inv = inv3(XtX);
    const beta = [0, 1, 2].map((r) => inv[r * 3] * Xty[0] + inv[r * 3 + 1] * Xty[1] + inv[r * 3 + 2] * Xty[2]);
    const yhat = (x1: number, x2: number) => beta[0] + beta[1] * x1 + beta[2] * x2;
    const my = pts.reduce((s, q) => s + q.y, 0) / pts.length;
    const sse = pts.reduce((s, q) => s + (q.y - yhat(q.x1, q.x2)) ** 2, 0);
    const sst = pts.reduce((s, q) => s + (q.y - my) ** 2, 0);
    const blob = blobOf(40, 0.045);
    const S = 1.5;
    return {
      view: { dist: 7.0, yaw: 0.8, elev: 0.35 },
      frame(p, _t, pos, col, size) {
        const w = writer(pos, col, size);
        let i = 0;
        pts.forEach((q, k) => {
          const a = smooth(0.05 + (k / 60) * 0.25, 0.1 + (k / 60) * 0.25, p);
          for (const b of blob) w(i++, q.x1 * S + b[0], q.y * S + b[1] + (1 - a) * 2, q.x2 * S + b[2], scale(WHITE, 0.8 * a), DOT * 0.8);
        });
        const plane = smooth(0.35, 0.6, p);
        for (let a = 0; a < 40 && i < N; a++)
          for (let b = 0; b < 40 && i < N; b++) {
            const x1 = -1.1 + (2.2 * a) / 39;
            const x2 = -1.1 + (2.2 * b) / 39;
            w(i++, x1 * S, yhat(x1, x2) * S, x2 * S, scale(GOLD, 0.45 * plane), DOT * 0.75 * (plane > 0 ? 1 : 0.01));
          }
        park(w, i);
        const ro = smooth(0.65, 0.85, p);
        const lines: Line[] = pts.map((q) => ({ a: [q.x1 * S, q.y * S, q.x2 * S] as V3, b: [q.x1 * S, yhat(q.x1, q.x2) * S, q.x2 * S] as V3, c: PINK, o: ro }));
        return {
          arrows: [],
          lines,
          hud: plane > 0.5 ? `ŷ = ${f2(beta[0])} + ${f2(beta[1])}x₁ − ${f2(-beta[2])}x₂  ·  R² = ${f2(1 - sse / sst)}` : "60 houses: two features, one price",
        };
      },
    };
  }

  if (spec.fit === "simpson") {
    const groups = [
      { cx: -0.8, cy: -0.45, c: BLUE },
      { cx: 0.8, cy: 0.75, c: PINK },
    ];
    const pts = groups.flatMap((gr, gi) =>
      Array.from({ length: 30 }, () => {
        const dx = g() * 0.42;
        return { x: gr.cx + dx, y: gr.cy - 0.6 * dx + g() * 0.12, gi };
      }),
    );
    const all = ols(pts.map((q) => [q.x, q.y] as V2));
    const per = groups.map((_, gi) => ols(pts.filter((q) => q.gi === gi).map((q) => [q.x, q.y] as V2)));
    const blob = blobOf(60, 0.05);
    const S = 1.2;
    return {
      view: { dist: 5.8, yaw: 0.35, elev: 0.15 },
      frame(p, _t, pos, col, size) {
        const w = writer(pos, col, size);
        const color = smooth(0.6, 0.75, p);
        let i = 0;
        pts.forEach((q, k) => {
          const a = smooth(0.05 + (k / 60) * 0.25, 0.1 + (k / 60) * 0.25, p);
          for (const b of blob) w(i++, q.x * S + b[0], q.y * S + b[1] + (1 - a) * 2, b[2], scale(mixc(WHITE, groups[q.gi].c, color), 0.55 * a), DOT * 0.8);
        });
        park(w, i);
        const L = (f: { w: number; b: number }, x0: number, x1: number, c: RGB, o: number): Line => ({ a: [x0 * S, (f.w * x0 + f.b) * S, 0], b: [x1 * S, (f.w * x1 + f.b) * S, 0], c, o });
        const lines: Line[] = [L(all, -1.8, 1.8, WHITE, smooth(0.35, 0.5, p) * (1 - 0.7 * color))];
        per.forEach((f, gi) => lines.push(L(f, groups[gi].cx - 0.9, groups[gi].cx + 0.9, groups[gi].c, color)));
        return {
          arrows: [],
          lines,
          hud: color > 0.5 ? `within each group the slope is ${f2(per[0].w)} and ${f2(per[1].w)}: the trend reverses` : `all together: slope +${f2(all.w)}`,
        };
      },
    };
  }

  if (spec.fit === "wiggle") {
    const truth = (x: number) => Math.sin(x * 1.6) * 0.6;
    const xs = Array.from({ length: 10 }, (_, k) => -1.5 + (3 * k) / 9 + g() * 0.04);
    const pts: V2[] = xs.map((x) => [x, truth(x) + g() * 0.12]);
    // Degree-9 interpolation (memorises every point) against a least-squares cubic.
    const lagrange = (x: number) =>
      pts.reduce((s, [xi, yi], i) => {
        let l = 1;
        pts.forEach(([xj], j) => j !== i && (l *= (x - xj) / (xi - xj)));
        return s + yi * l;
      }, 0);
    const V = pts.map(([x]) => [1, x, x * x, x * x * x]);
    const VtV = [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => V.reduce((s, row) => s + row[r] * row[c], 0)));
    const Vty = [0, 1, 2, 3].map((r) => V.reduce((s, row, i) => s + row[r] * pts[i][1], 0));
    const coef = solve4(VtV, Vty);
    const cubic = (x: number) => coef[0] + coef[1] * x + coef[2] * x * x + coef[3] * x * x * x;
    const testX = Array.from({ length: 60 }, (_, k) => -1.45 + (2.9 * k) / 59);
    const mse = (f: (x: number) => number, set: V2[]) => set.reduce((s, [x, y]) => s + (f(x) - y) ** 2, 0) / set.length;
    const test: V2[] = testX.map((x) => [x, truth(x)]);
    const err = { wigTrain: mse(lagrange, pts), wigTest: mse(lagrange, test), cubTrain: mse(cubic, pts), cubTest: mse(cubic, test) };
    const blob = blobOf(150, 0.055);
    const CURVE = (N - pts.length * blob.length);
    const S = 1.1;
    return {
      view: { dist: 5.6, yaw: 0.35, elev: 0.15 },
      frame(p, _t, pos, col, size) {
        const w = writer(pos, col, size);
        let i = 0;
        pts.forEach(([x, y], k) => {
          const a = smooth(0.05 + k * 0.025, 0.1 + k * 0.025, p);
          for (const b of blob) w(i++, x * S + b[0], y * S + b[1] + (1 - a) * 2, b[2], scale(WHITE, 0.5 * a), DOT * 0.8);
        });
        const show = smooth(0.3, 0.5, p);
        const morph = smooth(0.62, 0.88, p);
        for (let k = 0; k < CURVE; k++) {
          const x = -1.5 + (3 * k) / (CURVE - 1);
          const y = clamp(lagrange(x), -1.5, 1.5) * (1 - morph) + cubic(x) * morph;
          w(i++, x * S, y * S, ((k % 3) - 1) * 0.02, scale(mixc(RED, GOLD, morph), 0.6 * show), DOT * 0.7 * (show > 0 ? 1 : 0.01));
        }
        park(w, i);
        return {
          arrows: [],
          lines: [],
          hud:
            morph > 0.5
              ? `simpler fit: training error ${err.cubTrain.toFixed(3)}, new-data error ${err.cubTest.toFixed(3)}`
              : show > 0.5
                ? `memorise every point: training error ${err.wigTrain.toFixed(3)}, new-data error ${err.wigTest.toFixed(2)}`
                : "10 noisy measurements",
        };
      },
    };
  }

  // Least squares on the lesson's own points, with residual squares.
  const pts = spec.points;
  const { w: slope, b: icpt } = ols(pts);
  const mx = pts.reduce((s, q) => s + q[0], 0) / pts.length;
  const my = pts.reduce((s, q) => s + q[1], 0) / pts.length;
  const span = Math.max(...pts.map((q) => Math.max(Math.abs(q[0] - mx), Math.abs(q[1] - my))));
  const S = 1.1 / span;
  const T = (x: number, y: number): V3 => [(x - mx) * S, (y - my) * S, 0];
  const blob = blobOf(Math.floor(2400 / pts.length), 0.06);
  const sse = pts.reduce((s, [x, y]) => s + (y - (slope * x + icpt)) ** 2, 0);
  return {
    view: { dist: 5.6, yaw: 0.35, elev: 0.15 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      let i = 0;
      pts.forEach(([x, y], k) => {
        const a = smooth(0.05 + k * 0.04, 0.1 + k * 0.04, p);
        const c = T(x, y);
        for (const b of blob) w(i++, c[0] + b[0], c[1] + b[1] + (1 - a) * 2, b[2], scale(WHITE, 0.5 * a), DOT * 0.8);
      });
      const grow = smooth(0.35, 0.6, p);
      const LINE = N - i;
      const x0 = mx - span * 1.25;
      const x1 = mx + span * 1.25;
      for (let k = 0; k < LINE; k++) {
        const x = mx + ((x0 - mx) + ((x1 - x0) * k) / (LINE - 1)) * grow;
        const q = T(x, slope * x + icpt);
        w(i++, q[0], q[1], ((k % 3) - 1) * 0.02, scale(GOLD, 0.7), DOT * 0.75 * (grow > 0 ? 1 : 0.01));
      }
      const ro = smooth(0.62, 0.85, p);
      const lines: Line[] = [];
      pts.forEach(([x, y]) => {
        const yh = slope * x + icpt;
        const a = T(x, y);
        const b = T(x, yh);
        const side = (b[1] - a[1]) * (x > mx ? -1 : 1);
        lines.push({ a, b, c: PINK, o: ro }, { a, b: [a[0] + side, a[1], 0], c: PINK, o: ro * 0.6 }, { a: [a[0] + side, a[1], 0], b: [b[0] + side, b[1], 0], c: PINK, o: ro * 0.6 }, { a: b, b: [b[0] + side, b[1], 0], c: PINK, o: ro * 0.6 });
      });
      return {
        arrows: [],
        lines,
        hud: ro > 0.4 ? `ŷ = ${f2(slope)}x + ${f2(icpt)}  ·  the pink squares' total area is ${f2(sse)}, the smallest any line can get` : grow > 0.5 ? "the least-squares line" : `${pts.length} measurements`,
      };
    },
  };
}

function inv3(m: number[]): number[] {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [A, -(b * i - c * h), b * f - c * e, B, a * i - c * g, -(a * f - c * d), C, -(a * h - b * g), a * e - b * d].map((x) => x / det);
}
/** Gaussian elimination for a 4×4 system. */
function solve4(A: number[][], y: number[]): number[] {
  const M = A.map((row, i) => [...row, y[i]]);
  for (let c = 0; c < 4; c++) {
    let piv = c;
    for (let r = c + 1; r < 4; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < 4; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k < 5; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[4] / row[i]);
}

// ---------- Calculus ----------

const FNS = {
  square: { f: (x: number) => x * x, df: (x: number) => 2 * x, x: [-2, 3.2], y: [-1, 10.5], tex: "x²" },
  chain: { f: (x: number) => (3 * x + 1) ** 2, df: (x: number) => 6 * (3 * x + 1), x: [-0.9, 0.6], y: [-0.5, 8], tex: "(3x + 1)²" },
  cubic: { f: (x: number) => x ** 3 - 3 * x, df: (x: number) => 3 * x * x - 3, x: [-2.4, 2.4], y: [-4, 4], tex: "x³ − 3x" },
} as const;

function curveProgram(spec: Extract<IntroSpec, { kind: "curve" }>): Program {
  const F = FNS[spec.fn];
  const [x0, x1] = F.x;
  const [y0, y1] = F.y;
  const X = (x: number) => -1.8 + ((x - x0) / (x1 - x0)) * 3.6;
  const Y = (y: number) => -1.2 + ((y - y0) / (y1 - y0)) * 2.6;
  const a = spec.a;
  const h0 = (x1 - a) * 0.75;
  return {
    view: { dist: 5.8, yaw: 0.35, elev: 0.12 },
    frame(p, _t, pos, col, size) {
      const w = writer(pos, col, size);
      const draw = smooth(0.02, 0.3, p);
      for (let i = 0; i < N; i++) {
        const t = Math.floor(i / 3) / (N / 3 - 1);
        const x = x0 + (x1 - x0) * t;
        const y = F.f(x);
        const on = t <= draw && y >= y0 && y <= y1;
        w(i, X(x), Y(y), ((i % 3) - 1) * 0.025, scale(mixc(BLUE, PINK, t), on ? 0.8 : 0), on ? DOT * 0.85 : 0.0001);
      }
      const h = h0 * (1 - smooth(0.3, 0.9, p)) + 0.001;
      const fa = F.f(a);
      const fb = F.f(a + h);
      const m = (fb - fa) / h;
      const ext = (x1 - x0) * 0.6;
      const o = smooth(0.25, 0.35, p);
      const lines: Line[] = [{ a: [X(a - ext), Y(fa - m * ext), 0], b: [X(a + ext), Y(fa + m * ext), 0], c: GOLD, o }];
      const mark = (x: number, y: number, c: RGB) => {
        lines.push({ a: [X(x) - 0.06, Y(y), 0], b: [X(x) + 0.06, Y(y), 0], c, o }, { a: [X(x), Y(y) - 0.06, 0], b: [X(x), Y(y) + 0.06, 0], c, o });
      };
      mark(a, fa, WHITE);
      mark(a + h, fb, WHITE);
      return {
        arrows: [],
        lines,
        hud: `f(x) = ${F.tex}  ·  h = ${h.toFixed(3)}  ·  slope ${m.toFixed(3)}${p > 0.85 ? `  →  f′(${a}) = ${F.df(a)}` : ""}`,
      };
    },
  };
}

function surfaceProgram(): Program {
  return {
    view: { dist: 8.6, yaw: 0.75, elev: 0.55 },
    frame(p, time, pos, col, size) {
      fillShape(4, 0, time, pos, col, size);
      const step = Math.min(PATH.length - 1, smooth(0.15, 0.95, p) * (PATH.length - 1));
      const i0 = Math.floor(step);
      const a = PATH[i0];
      const b = PATH[Math.min(PATH.length - 1, i0 + 1)];
      const fr = step - i0;
      const x = a.x + (b.x - a.x) * fr;
      const z = a.z + (b.z - a.z) * fr;
      const l = a.loss + (b.loss - a.loss) * fr;
      const lines: Line[] = [];
      for (let k = 0; k < i0; k++) lines.push({ a: [PATH[k].x, surfaceY(PATH[k].loss) + 0.03, PATH[k].z], b: [PATH[k + 1].x, surfaceY(PATH[k + 1].loss) + 0.03, PATH[k + 1].z], c: GOLD, o: 0.9 });
      return { arrows: [], lines, ball: { p: [x, surfaceY(l) + 0.075, z], o: 1 }, hud: `step ${Math.round(step)}  ·  loss ${l.toFixed(3)}  ·  each step moves against the gradient` };
    },
  };
}

// ---------- Networks ----------

function networkProgram(spec: Extract<IntroSpec, { kind: "network" }>): Program {
  const L = spec.layers;
  const xs = L.map((_, l) => (L.length === 1 ? 0 : -1.4 + (2.8 * l) / (L.length - 1)));
  const nodes: { p: V3; layer: number }[] = [];
  L.forEach((n, l) => {
    const r = n === 1 ? 0 : n === 2 ? 0.36 : 0.18 * n;
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2 + Math.PI / 2;
      nodes.push({ p: [xs[l], Math.sin(a) * r, Math.cos(a) * r], layer: l });
    }
  });
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => nodes.forEach((b, j) => b.layer === a.layer + 1 && edges.push([i, j])));
  const PER_NODE = Math.min(120, Math.floor(1400 / nodes.length));
  const NODE_P = nodes.length * PER_NODE;
  const g = gaussFrom(mulberry(53));
  const jit = Array.from({ length: N }, () => [g() * 0.05, g() * 0.05, g() * 0.05]);
  const r = mulberry(59);
  const s0 = Array.from({ length: N }, () => r());
  const COLORS: RGB[] = [[0.45, 0.6, 1.0], [0.6, 0.5, 1.0], [0.85, 0.45, 0.95], [1.0, 0.72, 0.38]];
  const lc = (l: number) => COLORS[Math.round((l / Math.max(1, L.length - 1)) * 3)];
  const weights = edges.length;
  const biases = L.slice(1).reduce((s, x) => s + x, 0);
  return {
    view: { dist: L.length <= 2 ? 4.6 : 6.0, yaw: 0.15, elev: 0.16 },
    frame(p, time, pos, col, size) {
      const w = writer(pos, col, size);
      const backward = spec.train && p > 0.55;
      const speed = 0.25;
      for (let i = 0; i < N; i++) {
        if (i < NODE_P) {
          const n = nodes[Math.floor(i / PER_NODE)];
          w(i, n.p[0] + jit[i][0], n.p[1] + jit[i][1], n.p[2] + jit[i][2], lc(n.layer), DOT * 1.25);
        } else {
          const [ia, ib] = edges[i % edges.length];
          const a = nodes[ia].p;
          const b = nodes[ib].p;
          let s = (s0[i] + (time + p * 4) * speed) % 1;
          if (backward) s = 1 - s;
          const glow = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin((s0[i] * 6 - (time + p * 4) * speed * 6) * Math.PI), 6);
          const c = backward ? scale(GOLD, glow * 0.8) : scale(mixc(lc(nodes[ia].layer), lc(nodes[ib].layer), s), glow * 0.8);
          w(i, a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s, c, DOT * 0.75);
        }
      }
      const lines: Line[] = edges.map(([a, b]) => ({ a: nodes[a].p, b: nodes[b].p, c: [0.35, 0.38, 0.75], o: 0.5 }));
      return {
        arrows: [],
        lines,
        hud: backward ? `backward: gradients flow back and every one of the ${weights} weights gets nudged` : `${L.join(" → ")}  ·  ${weights} weights  ·  ${biases} biases  ·  signals flow forward`,
      };
    },
  };
}

// ---------- Classifier scores and a threshold ----------

function thresholdProgram(spec: Extract<IntroSpec, { kind: "threshold" }>): Program {
  const g = gaussFrom(mulberry(21));
  const nPos = spec.imbalanced ? 20 : 100;
  const nNeg = spec.imbalanced ? 480 : 100;
  const clip = (x: number) => clamp(x, 0.001, 0.999);
  const pos = Array.from({ length: nPos }, () => clip(0.66 + 0.16 * g()));
  const neg = Array.from({ length: nNeg }, () => clip(0.36 + 0.16 * g()));
  const BINS = 25;
  const perEx = Math.floor(3600 / (nPos + nNeg));
  const parts: { x: number; y: number; z: number; score: number; positive: boolean }[] = [];
  const stack = (scores: number[], positive: boolean) => {
    const h = new Array(BINS).fill(0);
    for (const s of scores) {
      const b = Math.min(BINS - 1, Math.floor(s * BINS));
      for (let k = 0; k < perEx; k++) {
        const idx = h[b]++;
        const q = idx % 12;
        const layer = Math.floor(idx / 12);
        parts.push({ x: -1.8 + ((b + 0.5) / BINS) * 3.6 + ((q % 3) - 1) * 0.04, y: -1 + layer * 0.04, z: (positive ? 0.18 : -0.18) + (Math.floor(q / 3) - 1.5) * 0.04, score: s, positive });
      }
    }
  };
  stack(pos, true);
  stack(neg, false);
  const maxY = Math.max(...parts.map((q) => q.y));
  const yScale = maxY > 1.2 ? 2.2 / (maxY + 1) : 1;
  return {
    view: { dist: 6.4, yaw: 0.35, elev: 0.25 },
    frame(p, _t, P, col, size) {
      const w = writer(P, col, size);
      const t = 0.15 + 0.7 * smooth(0.2, 0.9, p);
      const appear = smooth(0.02, 0.2, p);
      parts.forEach((q, i) => {
        const predicted = q.score >= t;
        const base: RGB = q.positive ? [0.35, 0.6, 1.0] : [1.0, 0.6, 0.25];
        w(i, q.x, -1 + (q.y + 1) * yScale * appear, q.z, scale(base, predicted ? 1.0 : 0.35), DOT * (predicted ? 1.0 : 0.8));
      });
      park(w, parts.length);
      const tp = pos.filter((s) => s >= t).length;
      const fp = neg.filter((s) => s >= t).length;
      const x = -1.8 + t * 3.6;
      const top = -1 + (maxY + 1) * yScale + 0.25;
      const lines: Line[] = [
        { a: [x, -1.05, -0.5], b: [x, top, -0.5], c: GOLD, o: 1 },
        { a: [x, -1.05, 0.5], b: [x, top, 0.5], c: GOLD, o: 1 },
        { a: [x, top, -0.5], b: [x, top, 0.5], c: GOLD, o: 1 },
        { a: [x, -1.05, -0.5], b: [x, -1.05, 0.5], c: GOLD, o: 1 },
      ];
      const precision = tp + fp ? tp / (tp + fp) : 1;
      return {
        arrows: [],
        lines,
        hud: `threshold ${t.toFixed(2)}  ·  precision ${pct(precision)}  ·  recall ${pct(tp / nPos)}  ·  accuracy ${pct((tp + nNeg - fp) / (nPos + nNeg))}`,
      };
    },
  };
}

export function buildProgram(spec: IntroSpec): Program {
  switch (spec.kind) {
    case "vectors":
      return vectorsProgram(spec);
    case "plane":
      return planeProgram(spec);
    case "lattice":
      return latticeProgram();
    case "cloud":
      return cloudProgram(spec);
    case "bars":
      return barsProgram(spec);
    case "bell":
      return bellProgram(spec);
    case "intervals":
      return intervalsProgram();
    case "people":
      return peopleProgram(spec);
    case "scatter":
      return scatterProgram(spec);
    case "curve":
      return curveProgram(spec);
    case "surface":
      return surfaceProgram();
    case "network":
      return networkProgram(spec);
    case "threshold":
      return thresholdProgram(spec);
  }
}
