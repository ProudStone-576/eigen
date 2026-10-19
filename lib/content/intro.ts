import type { ConceptNode, Mat, Widget } from "./types";

/**
 * Each lesson opens with a pinned, scroll-driven 3D scene. The scene is a
 * cinematic version of the lesson's own widget, built from the same numbers,
 * so the intro previews exactly what the student is about to play with.
 * Concepts without a widget get a scene chosen for them below.
 *
 * Plain data (no functions) so the server can pass it to the client.
 */

export type V2 = [number, number];
export type BarsDist =
  | { type: "coin" }
  | { type: "die" }
  | { type: "two-coins" }
  | { type: "binomial"; n: number; p: number }
  | { type: "poisson"; lambda: number }
  | { type: "normal" }
  | { type: "exponential" }
  | { type: "clt" }
  | { type: "likelihood"; heads: number; flips: number }
  | { type: "values"; values: number[]; max: number };

export type IntroSpec =
  | { kind: "vectors"; op: "show" | "add" | "scale" | "combo" | "span"; v: V2; w?: V2; k?: number; a?: number; b?: number }
  | { kind: "plane"; m: Mat; then?: Mat; firstName?: string; thenName?: string; area?: boolean; eigen?: boolean; target?: V2; vector?: V2 }
  | { kind: "lattice" }
  | { kind: "cloud"; flatten: boolean }
  | { kind: "bars"; dist: BarsDist; marks?: "mean" | "box" | "spread" }
  | { kind: "bell"; z: number }
  | { kind: "intervals" }
  | { kind: "people"; mode: "bayes"; prevalence: number; sensitivity: number; falsePositive: number }
  | { kind: "people"; mode: "sample" | "biased" | "folds" | "table-same" | "table-differ" }
  | { kind: "scatter"; points: V2[]; fit: "line" | "plane" | "wiggle" | "simpson" }
  | { kind: "curve"; fn: "square" | "chain" | "cubic"; a: number }
  | { kind: "surface" }
  | { kind: "network"; layers: number[]; train?: boolean }
  | { kind: "threshold"; imbalanced?: boolean };

const parallel = (v: V2, w: V2) => Math.abs(v[0] * w[1] - v[1] * w[0]) < 1e-9;

/** Concepts with no widget, or whose widget isn't the best opening shot. */
const OVERRIDES: Record<string, IntroSpec> = {
  "linear-independence": { kind: "vectors", op: "span", v: [2, 1], w: [-1, 1.5] },
  "finding-eigenvalues": { kind: "plane", m: [[4, 1], [2, 3]], eigen: true },
  "finding-eigenvectors": { kind: "plane", m: [[3, 1], [0, 2]], eigen: true },
  eigenbasis: { kind: "lattice" },
  covariance: { kind: "cloud", flatten: false },
  "sampling-methods": { kind: "people", mode: "sample" },
  "sampling-bias": { kind: "people", mode: "biased" },
  "random-variable": { kind: "bars", dist: { type: "two-coins" }, marks: "mean" },
  independence: { kind: "people", mode: "table-same" },
  "loss-functions": { kind: "surface" },
  poisson: { kind: "bars", dist: { type: "poisson", lambda: 2 }, marks: "mean" },
  "uniform-exponential": { kind: "bars", dist: { type: "exponential" }, marks: "mean" },
  "chi-square": { kind: "people", mode: "table-differ" },
  "correlation-causation": { kind: "scatter", points: [], fit: "simpson" },
  "derivative-rules": { kind: "curve", fn: "cubic", a: 1.5 },
  backprop: { kind: "network", layers: [2, 3, 3, 1], train: true },
  layer: { kind: "network", layers: [3, 4] },
  "forward-pass": { kind: "network", layers: [2, 3, 3, 1] },
  "training-loop": { kind: "network", layers: [2, 4, 4, 1], train: true },
  "train-network": { kind: "network", layers: [2, 4, 4, 1], train: true },
  "multiple-regression": { kind: "scatter", points: [], fit: "plane" },
  regularization: { kind: "scatter", points: [], fit: "wiggle" },
  "bias-variance": { kind: "scatter", points: [], fit: "wiggle" },
  "cross-validation": { kind: "people", mode: "folds" },
};

const MARKS: Record<string, "mean" | "box" | "spread"> = {
  "mean-median-mode": "mean",
  "quartiles-iqr": "box",
  "skew-shape": "mean",
  variance: "spread",
  expectation: "mean",
};

function fromWidget(node: ConceptNode, w: Widget): IntroSpec | null {
  switch (w.kind) {
    case "vector":
      return { kind: "vectors", op: "show", v: w.start as V2 };
    case "vector-add":
      return { kind: "vectors", op: "add", v: w.a as V2, w: w.b as V2 };
    case "scale":
      return { kind: "vectors", op: "scale", v: w.v as V2, k: w.k };
    case "combo": {
      const v = w.v as V2;
      const u = w.w as V2;
      if (parallel(v, u) || node.id === "span") return { kind: "vectors", op: "span", v, w: u };
      const small = Math.abs(w.a) < 1 && Math.abs(w.b) < 1;
      return { kind: "vectors", op: "combo", v, w: u, a: small ? 1.5 : w.a, b: small ? 1 : w.b };
    }
    case "transform":
      return { kind: "plane", m: w.matrix, area: w.showArea, vector: w.showVector as V2 | undefined };
    case "compose":
      return { kind: "plane", m: w.first, then: w.second, firstName: w.firstName, thenName: w.secondName };
    case "solve":
      return { kind: "plane", m: w.matrix, target: w.target as V2 };
    case "eigen":
      return { kind: "plane", m: w.matrix, eigen: true };
    case "spread":
    case "pcapipe":
      return { kind: "cloud", flatten: true };
    case "sim":
      return { kind: "bars", dist: { type: w.die ? "die" : "coin" }, marks: MARKS[node.id] };
    case "bayes":
      return { kind: "people", mode: "bayes", prevalence: w.prevalence, sensitivity: w.sensitivity, falsePositive: w.falsePositive };
    case "points1d":
      return { kind: "bars", dist: { type: "values", values: w.values, max: Math.max(...w.values) + 1 }, marks: MARKS[node.id] ?? "spread" };
    case "summary1d":
      return { kind: "bars", dist: { type: "values", values: w.values, max: w.max }, marks: MARKS[node.id] ?? "mean" };
    case "normal":
      return { kind: "bars", dist: { type: "normal" }, marks: "spread" };
    case "likelihood":
      return { kind: "bars", dist: { type: "likelihood", heads: w.heads, flips: w.flips } };
    case "fitline":
      return { kind: "scatter", points: w.points as V2[], fit: "line" };
    case "binomial":
      return { kind: "bars", dist: { type: "binomial", n: w.n, p: w.p }, marks: "mean" };
    case "clt":
      return { kind: "bars", dist: { type: "clt" } };
    case "cisim":
      return { kind: "intervals" };
    case "pvalue":
      return { kind: "bell", z: w.z };
    case "tangent":
      return { kind: "curve", fn: w.fn, a: w.a };
    case "gradient2d":
    case "descent":
      return { kind: "surface" };
    case "neuron":
      return { kind: "network", layers: [2, 1] };
    case "playground":
      return { kind: "network", layers: [2, w.hidden, 1], train: w.activation !== "linear" };
    case "threshold":
      return { kind: "threshold", imbalanced: w.imbalanced };
    default:
      return null;
  }
}

/** The intro scene for a concept. Every concept gets one (a test enforces it). */
export function introFor(node: ConceptNode): IntroSpec {
  if (OVERRIDES[node.id]) return OVERRIDES[node.id];
  for (const s of node.steps) {
    const w = s.type === "explore" ? s.widget : s.type === "predict" ? s.reveal.widget : undefined;
    const spec = w && fromWidget(node, w);
    if (spec) return spec;
  }
  return { kind: "lattice" };
}
