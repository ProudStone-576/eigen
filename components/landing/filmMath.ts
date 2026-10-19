/**
 * The landing "film": N particles that morph between mathematical objects as
 * the visitor scrolls. Pure maths, no rendering, so every number shown on the
 * page can be unit-tested.
 *
 * Acts: 0 lattice · 1 matrix transform · 2 tesseract (4D) · 3 data cloud + PCA ·
 * 4 loss surface + gradient descent · 5 neural network · 6 sphere.
 */

export const N = 4096;
export const ACT_COUNT = 7;

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20261018);
const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());

// ---------- 3×3 matrices (row-major) ----------

export type M3 = number[];
export const mul3 = (a: M3, b: M3): M3 => {
  const o = new Array(9).fill(0);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++) o[r * 3 + c] += a[r * 3 + k] * b[k * 3 + c];
  return o;
};
export function inv3(m: M3): M3 {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [A, -(b * i - c * h), b * f - c * e, B, a * i - c * g, -(a * f - c * d), C, -(a * h - b * g), a * e - b * d].map((x) => x / det);
}
export const apply3 = (m: M3, v: number[]) => [0, 1, 2].map((r) => m[r * 3] * v[0] + m[r * 3 + 1] * v[1] + m[r * 3 + 2] * v[2]);

/** Columns of P are the eigenvectors; D their eigenvalues. A = P D P⁻¹. */
const P: M3 = [1, 1, 0, 1, -1, 1, 1, 0, -1];
const D = [1.7, 0.55, 1.25];
export const EIGEN = { vectors: [[1, 1, 1], [1, -1, 0], [0, 1, -1]], values: D };
export const A: M3 = mul3(
  P.map((x, i) => x * D[i % 3]),
  inv3(P),
);
/** Straight-line path from the identity to A. (1, 1, 1) stays an eigenvector the whole way. */
export const matrixAt = (u: number): M3 => A.map((a, i) => (i % 4 === 0 ? 1 : 0) * (1 - u) + a * u);

// ---------- Static particle layouts ----------

const S = 0.85; // lattice half-width
const LAT = new Float32Array(N * 3);
const ON_AXIS = new Uint8Array(N);
for (let x = 0; x < 16; x++)
  for (let y = 0; y < 16; y++)
    for (let z = 0; z < 16; z++) {
      const i = x * 256 + y * 16 + z;
      LAT[i * 3] = S * (-1 + (2 * x) / 15);
      LAT[i * 3 + 1] = S * (-1 + (2 * y) / 15);
      LAT[i * 3 + 2] = S * (-1 + (2 * z) / 15);
      ON_AXIS[i] = x === y && y === z ? 1 : 0;
    }
export const onEigenAxis = (i: number) => ON_AXIS[i] === 1;

/** Tesseract: 16 vertices in {−1, 1}⁴; 32 edges join vertices differing in one coordinate. */
export const T_VERTS: number[][] = Array.from({ length: 16 }, (_, m) => [0, 1, 2, 3].map((b) => ((m >> b) & 1 ? 1 : -1)));
export const T_EDGES: [number, number][] = [];
for (let a = 0; a < 16; a++)
  for (let b = a + 1; b < 16; b++) {
    const x = a ^ b;
    if ((x & (x - 1)) === 0) T_EDGES.push([a, b]);
  }
const PER_EDGE = N / T_EDGES.length; // 128

/** Rotate a 4D point in the x–w and z–w planes, then perspective-project from 4D into 3D. */
export function tesseract(v: number[], theta: number, phi: number) {
  const [x0, y0, z0, w0] = v;
  const x1 = x0 * Math.cos(theta) - w0 * Math.sin(theta);
  const w1 = x0 * Math.sin(theta) + w0 * Math.cos(theta);
  const z2 = z0 * Math.cos(phi) - w1 * Math.sin(phi);
  const w2 = z0 * Math.sin(phi) + w1 * Math.cos(phi);
  const k = 2.2 / (3 - w2);
  return { p: [x1 * k * 0.62, y0 * k * 0.62, z2 * k * 0.62], w: w2 };
}

/** Data cloud: principal axes q1..q3 (orthonormal) with standard deviations SD. */
const r3 = Math.sqrt(3);
const r2 = Math.sqrt(2);
const r6 = Math.sqrt(6);
export const PCA_AXES = [
  [1 / r3, 1 / r3, 1 / r3],
  [1 / r2, -1 / r2, 0],
  [1 / r6, 1 / r6, -2 / r6],
];
export const PCA_SD = [0.85, 0.6, 0.15];
/** Fraction of variance kept by projecting onto the top two components. */
export const VARIANCE_KEPT = (PCA_SD[0] ** 2 + PCA_SD[1] ** 2) / PCA_SD.reduce((s, x) => s + x * x, 0);
const G = new Float32Array(N * 3);
for (let i = 0; i < N * 3; i++) G[i] = Math.max(-3, Math.min(3, gauss()));

/** Loss surface and a gradient-descent run on it. */
export const loss = (x: number, z: number) => 0.3 * (x * x + 1.7 * z * z) - 0.45 * Math.exp(-2.5 * ((x - 0.55) ** 2 + (z + 0.35) ** 2));
export const lossGrad = (x: number, z: number) => {
  const e = Math.exp(-2.5 * ((x - 0.55) ** 2 + (z + 0.35) ** 2));
  return [0.6 * x + 2.25 * (x - 0.55) * e, 1.02 * z + 2.25 * (z + 0.35) * e];
};
export const surfaceY = (l: number) => l * 0.55 - 0.5;
export const LR = 0.18;
export const PATH: { x: number; z: number; loss: number }[] = (() => {
  let x = -1.45;
  let z = 1.25;
  const out = [];
  for (let s = 0; s < 90; s++) {
    out.push({ x, z, loss: loss(x, z) });
    const [gx, gz] = lossGrad(x, z);
    x -= LR * gx;
    z -= LR * gz;
  }
  return out;
})();
const GRID = 64;
const SURF = new Float32Array(N * 3);
for (let a = 0; a < GRID; a++)
  for (let b = 0; b < GRID; b++) {
    const i = a * GRID + b;
    const x = -1.7 + (3.4 * a) / (GRID - 1);
    const z = -1.7 + (3.4 * b) / (GRID - 1);
    SURF[i * 3] = x;
    SURF[i * 3 + 1] = surfaceY(loss(x, z));
    SURF[i * 3 + 2] = z;
  }

/** Neural network: layers on rings in the y–z plane, fully connected layer to layer. */
export const LAYERS = [3, 5, 5, 2];
const LAYER_X = [-1.5, -0.5, 0.5, 1.5];
export const NODES: { p: number[]; layer: number }[] = [];
LAYERS.forEach((n, l) => {
  const r = n === 2 ? 0.36 : 0.18 * n;
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2 + Math.PI / 2;
    NODES.push({ p: [LAYER_X[l], Math.sin(a) * r, Math.cos(a) * r], layer: l });
  }
});
export const NET_EDGES: [number, number][] = [];
NODES.forEach((a, i) => NODES.forEach((b, j) => b.layer === a.layer + 1 && NET_EDGES.push([i, j])));
const NODE_P = NODES.length * 64; // particles forming the nodes
const NET_NODE = new Uint16Array(N);
const NET_EDGE = new Uint16Array(N);
const NET_S = new Float32Array(N);
const NET_JIT = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  NET_NODE[i] = Math.floor(i / 64) % NODES.length;
  NET_EDGE[i] = i % NET_EDGES.length;
  NET_S[i] = rnd();
  for (let k = 0; k < 3; k++) NET_JIT[i * 3 + k] = gauss() * 0.045;
}
const LAYER_COLOR = [
  [0.45, 0.6, 1.0],
  [0.6, 0.5, 1.0],
  [0.85, 0.45, 0.95],
  [1.0, 0.72, 0.38],
];

/** Per-particle randomness for staggered, swirling morphs. */
export const DELAY = new Float32Array(N);
export const SWIRL = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  DELAY[i] = rnd() * 0.35;
  const v = [gauss(), gauss(), gauss()];
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  for (let k = 0; k < 3; k++) SWIRL[i * 3 + k] = v[k] / l;
}

// ---------- Filling a frame ----------

const BASE = [0.42, 0.52, 1.0];
const GOLD = [1.0, 0.76, 0.32];
const mix = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const DOT = 0.036;

/**
 * Write act k's particles at its own progress u (0 → 1) and clock time into
 * pos (xyz), col (rgb, additive, so keep it dim) and size (world units).
 */
export function fillShape(k: number, u: number, time: number, pos: Float32Array, col: Float32Array, size: Float32Array) {
  const set = (i: number, x: number, y: number, z: number, c: number[], s: number) => {
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    col[i * 3] = c[0];
    col[i * 3 + 1] = c[1];
    col[i * 3 + 2] = c[2];
    size[i] = s;
  };
  switch (k) {
    case 0: {
      for (let i = 0; i < N; i++) {
        const x = LAT[i * 3];
        const y = LAT[i * 3 + 1];
        const z = LAT[i * 3 + 2];
        const wave = 0.65 + 0.55 * (0.5 + 0.5 * Math.sin(time * 1.1 - (x + y + z) * 2.4));
        set(i, x, y, z, [BASE[0] * wave, BASE[1] * wave, BASE[2] * wave], DOT);
      }
      return;
    }
    case 1: {
      const M = matrixAt(smooth(0, 0.6, u));
      const h = smooth(0.55, 0.8, u);
      for (let i = 0; i < N; i++) {
        const v = apply3(M, [LAT[i * 3], LAT[i * 3 + 1], LAT[i * 3 + 2]]);
        if (ON_AXIS[i]) set(i, v[0], v[1], v[2], mix(BASE, [GOLD[0] * 1.5, GOLD[1] * 1.5, GOLD[2] * 1.5], h), DOT * (1 + 1.8 * h));
        else set(i, v[0], v[1], v[2], BASE.map((c) => c * (1 - 0.4 * h)), DOT);
      }
      return;
    }
    case 2: {
      const theta = u * Math.PI * 1.25 + time * 0.12;
      const phi = theta * 0.6;
      for (let i = 0; i < N; i++) {
        const [a, b] = T_EDGES[Math.floor(i / PER_EDGE)];
        const s = (i % PER_EDGE) / (PER_EDGE - 1);
        const v = T_VERTS[a].map((c, j) => c + (T_VERTS[b][j] - c) * s);
        const { p, w } = tesseract(v, theta, phi);
        const t = Math.min(1, Math.max(0, (w + 1.7) / 3.4));
        set(i, p[0], p[1], p[2], mix([0.35, 0.3, 0.85], [0.35, 0.85, 1.0], t), DOT * (0.8 + 0.5 * t));
      }
      return;
    }
    case 3: {
      const f = smooth(0.5, 0.9, u);
      const [q1, q2, q3] = PCA_AXES;
      for (let i = 0; i < N; i++) {
        const a = G[i * 3] * PCA_SD[0];
        const b = G[i * 3 + 1] * PCA_SD[1];
        const c = G[i * 3 + 2] * PCA_SD[2] * (1 - f);
        const t = Math.min(1, Math.max(0, (G[i * 3] + 2.5) / 5));
        set(i, a * q1[0] + b * q2[0] + c * q3[0], a * q1[1] + b * q2[1] + c * q3[1], a * q1[2] + b * q2[2] + c * q3[2], mix([0.3, 0.5, 1.0], [1.0, 0.42, 0.7], t), DOT * 1.25);
      }
      return;
    }
    case 4: {
      for (let i = 0; i < N; i++) {
        const y = SURF[i * 3 + 1];
        const t = Math.min(1, Math.max(0, (y + 0.7) / 1.5));
        set(i, SURF[i * 3], y, SURF[i * 3 + 2], mix([0.36, 0.34, 1.0], [1.0, 0.62, 0.3], t).map((c) => c * 1.1), DOT * 0.95);
      }
      return;
    }
    case 5: {
      const speed = 0.12 + 0.3 * u;
      for (let i = 0; i < N; i++) {
        if (i < NODE_P) {
          const n = NODES[NET_NODE[i]];
          const c = LAYER_COLOR[n.layer];
          set(i, n.p[0] + NET_JIT[i * 3], n.p[1] + NET_JIT[i * 3 + 1], n.p[2] + NET_JIT[i * 3 + 2], c, DOT * 1.3);
        } else {
          const [ia, ib] = NET_EDGES[NET_EDGE[i]];
          const a = NODES[ia];
          const b = NODES[ib];
          const s = (NET_S[i] + time * speed) % 1;
          const glow = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin((NET_S[i] * 6 - time * speed * 6) * Math.PI), 6);
          const c = mix(LAYER_COLOR[a.layer], LAYER_COLOR[b.layer], s).map((x) => x * glow * 0.8);
          set(i, a.p[0] + (b.p[0] - a.p[0]) * s, a.p[1] + (b.p[1] - a.p[1]) * s, a.p[2] + (b.p[2] - a.p[2]) * s, c, DOT * 0.75);
        }
      }
      return;
    }
    default: {
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (2 * (i + 0.5)) / N;
        const r = Math.sqrt(1 - y * y);
        const a = i * golden;
        const R = 1.15 * (1 + 0.025 * Math.sin(time * 1.4 + y * 3));
        set(i, Math.cos(a) * r * R, y * R, Math.sin(a) * r * R, mix([0.45, 0.42, 1.0], [0.85, 0.8, 1.0], 0.5 + 0.5 * y), DOT * 0.9);
      }
    }
  }
}

/**
 * Camera per act: distance, yaw, elevation; which side the object sits on
 * (text goes opposite); and lift (+ moves the object up the screen).
 * Act 3 looks 45° off the flattened plane's normal so "2D" reads as a plane, not a line.
 */
export const ACT_VIEW: { dist: number; yaw: number; elev: number; side: -1 | 0 | 1; lift: number }[] = [
  { dist: 7.0, yaw: 0.65, elev: 0.42, side: 0, lift: -0.2 },
  { dist: 8.4, yaw: 0.95, elev: 0.3, side: 1, lift: 0 },
  { dist: 6.2, yaw: 0.45, elev: 0.22, side: -1, lift: 0 },
  { dist: 8.6, yaw: 3.49, elev: 0.82, side: 1, lift: 0 },
  { dist: 8.6, yaw: 0.75, elev: 0.55, side: -1, lift: 0 },
  { dist: 6.4, yaw: 0.0, elev: 0.16, side: 1, lift: 0 },
  { dist: 8.2, yaw: 0.6, elev: 0.3, side: 0, lift: 0.13 },
];
