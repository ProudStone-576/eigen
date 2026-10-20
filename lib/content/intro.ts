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
  // Self-contained sections (lib/content/sections) without a widget of their own.
  "data-variables": { kind: "people", mode: "sample" },
  "frequency-tables": { kind: "bars", dist: { type: "values", values: [12, 15, 15, 18, 22, 22, 22, 25, 28, 31, 35, 41], max: 50 }, marks: "box" },
  "other-means": { kind: "bars", dist: { type: "values", values: [30, 30, 40, 45, 60, 60, 60, 90], max: 100 }, marks: "mean" },
  "experiment-design": { kind: "people", mode: "table-differ" },
  "data-quality": { kind: "people", mode: "biased" },
  counting: { kind: "bars", dist: { type: "binomial", n: 8, p: 0.5 } },
  "joint-distributions": { kind: "people", mode: "table-same" },
  mgf: { kind: "bars", dist: { type: "poisson", lambda: 3 }, marks: "mean" },
  "survey-design": { kind: "people", mode: "sample" },
  "discrete-family": { kind: "bars", dist: { type: "binomial", n: 10, p: 0.3 }, marks: "mean" },
  "continuous-family": { kind: "bars", dist: { type: "exponential" }, marks: "mean" },
  mixtures: { kind: "bars", dist: { type: "values", values: [10, 12, 12, 13, 14, 14, 15, 30, 31, 32, 32, 33, 35], max: 45 }, marks: "mean" },
  "sampling-distributions": { kind: "bars", dist: { type: "clt" } },
  "estimator-properties": { kind: "intervals" },
  "method-of-moments": { kind: "bars", dist: { type: "poisson", lambda: 2 }, marks: "mean" },
  bootstrap: { kind: "bars", dist: { type: "clt" } },
  "intervals-more": { kind: "intervals" },
  "two-sample-tests": { kind: "people", mode: "table-differ" },
  "multiple-testing": { kind: "bell", z: 2.5 },
  "permutation-tests": { kind: "people", mode: "folds" },
  "likelihood-ratio": { kind: "bars", dist: { type: "likelihood", heads: 60, flips: 100 } },
  "rank-correlation": { kind: "cloud", flatten: false },
  "regression-inference": { kind: "scatter", points: [[1, 2], [2, 2.8], [3, 4.1], [4, 4.9], [5, 6.2]], fit: "line" },
  "regression-diagnostics": { kind: "scatter", points: [], fit: "wiggle" },
  "regression-features": { kind: "scatter", points: [], fit: "plane" },
  glm: { kind: "bars", dist: { type: "poisson", lambda: 3 }, marks: "mean" },
  "one-way-anova": { kind: "people", mode: "table-differ" },
  "post-hoc-tests": { kind: "bars", dist: { type: "values", values: [12, 13, 14, 15, 15, 16, 20, 21, 22, 23], max: 30 }, marks: "box" },
  "two-way-anova": { kind: "people", mode: "table-differ" },
  "doe-advanced": { kind: "people", mode: "folds" },
  "rank-tests": { kind: "bars", dist: { type: "values", values: [3, 4, 4, 5, 6, 6, 7, 7, 8, 90], max: 100 }, marks: "box" },
  "kruskal-friedman": { kind: "bars", dist: { type: "values", values: [5, 8, 9, 12, 14, 15, 18, 22, 30, 41], max: 50 }, marks: "box" },
  "normality-tests": { kind: "bars", dist: { type: "normal" }, marks: "spread" },
  "robust-estimation": { kind: "bars", dist: { type: "values", values: [4, 5, 5, 6, 6, 7, 95], max: 100 }, marks: "mean" },
  "bayesian-inference": { kind: "bars", dist: { type: "likelihood", heads: 7, flips: 10 } },
  "conjugate-priors": { kind: "bars", dist: { type: "likelihood", heads: 3, flips: 4 } },
  "bayes-factors": { kind: "people", mode: "bayes", prevalence: 0.5, sensitivity: 0.8, falsePositive: 0.2 },
  "hierarchical-models": { kind: "bars", dist: { type: "values", values: [62, 65, 68, 70, 70, 72, 75, 78, 80], max: 100 }, marks: "mean" },
  mcmc: { kind: "bars", dist: { type: "normal" }, marks: "spread" },
  mahalanobis: { kind: "cloud", flatten: false },
  "discriminant-analysis": { kind: "threshold" },
  clustering: { kind: "bars", dist: { type: "values", values: [1, 2, 2, 3, 3, 9, 10, 10, 11, 12], max: 15 }, marks: "box" },
  "gmm-em": { kind: "bars", dist: { type: "values", values: [2, 3, 3, 4, 4, 4, 5, 10, 11, 11, 12, 13], max: 15 }, marks: "mean" },
  "factor-analysis": { kind: "cloud", flatten: true },
  "ts-components": { kind: "scatter", points: [[1, 2], [2, 3.4], [3, 2.9], [4, 4.5], [5, 4.1], [6, 5.8], [7, 5.2], [8, 6.9]], fit: "line" },
  "exponential-smoothing": { kind: "bars", dist: { type: "values", values: [40, 44, 41, 47, 45, 50, 48, 53], max: 60 }, marks: "mean" },
  "stationarity-acf": { kind: "bars", dist: { type: "normal" }, marks: "spread" },
  arima: { kind: "cloud", flatten: false },
  forecasting: { kind: "intervals" },
  "advanced-time-series": { kind: "bars", dist: { type: "values", values: [1, 0, 1, 0, 4, 5, 6, 4, 0, 1, 1, 0], max: 8 }, marks: "spread" },
  "potential-outcomes": { kind: "scatter", points: [], fit: "simpson" },
  "propensity-scores": { kind: "people", mode: "biased" },
  "quasi-experiments": { kind: "people", mode: "table-differ" },
  "mediation-sensitivity": { kind: "people", mode: "table-same" },
  "heterogeneous-effects": { kind: "people", mode: "folds" },
  "survival-functions": { kind: "bars", dist: { type: "exponential" } },
  "kaplan-meier": { kind: "bars", dist: { type: "values", values: [2, 3, 5, 6, 6, 8, 9, 12, 14, 20], max: 24 }, marks: "box" },
  "cox-model": { kind: "bars", dist: { type: "exponential" }, marks: "mean" },
  "survival-extensions": { kind: "bars", dist: { type: "poisson", lambda: 2 }, marks: "mean" },
  "trees-ensembles": { kind: "scatter", points: [], fit: "wiggle" },
  "svm-knn-nb": { kind: "threshold" },
  "calibration-imbalance": { kind: "threshold", imbalanced: true },
  interpretability: { kind: "scatter", points: [], fit: "plane" },
  "uncertainty-shift": { kind: "intervals" },
  sufficiency: { kind: "bars", dist: { type: "likelihood", heads: 6, flips: 10 } },
  asymptotics: { kind: "bars", dist: { type: "clt" } },
  "advanced-asymptotics": { kind: "bars", dist: { type: "values", values: [1, 2, 2, 3, 4, 4, 5, 6, 7, 9], max: 10 }, marks: "box" },
  "decision-theory": { kind: "bars", dist: { type: "normal" }, marks: "mean" },
  kde: { kind: "bars", dist: { type: "values", values: [2, 3, 3, 4, 4, 4, 5, 9, 10, 10, 11], max: 14 }, marks: "spread" },
  "high-dimensional": { kind: "cloud", flatten: true },
  "learning-theory": { kind: "people", mode: "folds" },
  "monte-carlo": { kind: "bars", dist: { type: "clt" } },
  "statistical-computing": { kind: "people", mode: "sample" },
  "reproducible-practice": { kind: "people", mode: "folds" },
  "clinical-epi": { kind: "people", mode: "bayes", prevalence: 0.01, sensitivity: 0.9, falsePositive: 0.05 },
  "econometrics-finance": { kind: "scatter", points: [], fit: "simpson" },
  "quality-control": { kind: "bars", dist: { type: "normal" }, marks: "spread" },
  "spatial-environmental": { kind: "bars", dist: { type: "exponential" }, marks: "box" },
  "psychometrics-social": { kind: "bars", dist: { type: "binomial", n: 20, p: 0.6 }, marks: "mean" },
  "genetics-networks-text": { kind: "bars", dist: { type: "values", values: [60, 30, 20, 15, 12, 10, 8, 7, 6, 5], max: 60 } },
  "sports-forensic": { kind: "people", mode: "bayes", prevalence: 0.001, sensitivity: 1, falsePositive: 0.01 },
  "linear-equations": { kind: "scatter", points: [[0, 1], [1, 3.1], [2, 4.9], [3, 7.2], [4, 8.8], [5, 11.1]], fit: "line" },
  "ratios-percentages": { kind: "bars", dist: { type: "values", values: [20, 25, 25, 30, 35, 40, 40, 45], max: 50 }, marks: "mean" },
  "exponents-logs": { kind: "bars", dist: { type: "exponential" } },
  polynomials: { kind: "scatter", points: [], fit: "wiggle" },
  quadratics: { kind: "curve", fn: "square", a: 1 },
  "plane-geometry": { kind: "vectors", op: "add", v: [3, 1], w: [1, 2] },
  mensuration: { kind: "lattice" },
  "sets-relations": { kind: "people", mode: "table-same" },
  "functions-basics": { kind: "scatter", points: [[-2, 4.1], [-1, 1.2], [0, 0.1], [1, 0.9], [2, 4.2], [3, 8.8]], fit: "wiggle" },
  "function-graphs": { kind: "curve", fn: "cubic", a: 1 },
  "composition-inverse": { kind: "plane", m: [[0, 1], [1, 0]], firstName: "reflect in y = x" },
  "trig-ratios": { kind: "plane", m: [[0.866, -0.5], [0.5, 0.866]], firstName: "rotate 30°" },
  "trig-identities": { kind: "plane", m: [[0.866, -0.5], [0.5, 0.866]], then: [[0.707, -0.707], [0.707, 0.707]], firstName: "rotate 30°", thenName: "rotate 45°" },
  "trig-equations": { kind: "bars", dist: { type: "values", values: [5, 8, 10, 8, 5, 2, 0, 2, 5, 8, 10, 8, 5], max: 10 }, marks: "mean" },
  "inverse-trig": { kind: "plane", m: [[0, 1], [1, 0]], firstName: "reflect in y = x" },
  "triangles-trig": { kind: "vectors", op: "add", v: [4, 1], w: [-1, 3] },
  "complex-algebra": { kind: "vectors", op: "add", v: [3, 2], w: [1, -2] },
  "complex-polar": { kind: "plane", m: [[1, -1], [1, 1]], firstName: "multiply by 1 + i" },
  "roots-of-unity": { kind: "plane", m: [[-0.5, -0.866], [0.866, -0.5]], firstName: "multiply by ω" },
  "complex-geometry": { kind: "plane", m: [[0, -1], [1, 0]], firstName: "multiply by i" },
  "arithmetic-progressions": { kind: "scatter", points: [[1, 3], [2, 7], [3, 11], [4, 15], [5, 19], [6, 23]], fit: "line" },
  "geometric-progressions": { kind: "bars", dist: { type: "values", values: [1, 2, 4, 8, 16, 32], max: 32 } },
  "means-inequalities": { kind: "bars", dist: { type: "values", values: [2, 3, 5, 8, 12], max: 12 }, marks: "mean" },
  "special-series": { kind: "bars", dist: { type: "values", values: [1, 4, 9, 16, 25, 36], max: 36 } },
  induction: { kind: "bars", dist: { type: "values", values: [1, 3, 5, 7, 9, 11], max: 12 }, marks: "mean" },
  "permutations-advanced": { kind: "people", mode: "sample" },
  "combinations-advanced": { kind: "people", mode: "folds" },
  "binomial-theorem": { kind: "bars", dist: { type: "binomial", n: 10, p: 0.5 } },
  "binomial-coefficients": { kind: "bars", dist: { type: "binomial", n: 8, p: 0.5 }, marks: "spread" },
  "probability-rules": { kind: "bars", dist: { type: "die" } },
  "matrix-algebra": { kind: "plane", m: [[1, 1], [0, 1]], firstName: "shear" },
  "determinants-properties": { kind: "plane", m: [[2, 1], [1, 2]], area: true },
  "adjoint-systems": { kind: "plane", m: [[2, 1], [5, 3]], then: [[3, -1], [-5, 2]], firstName: "A", thenName: "inverse of A" },
  "straight-lines": { kind: "scatter", points: [[0, 1], [1, 3], [2, 5], [3, 7], [4, 9]], fit: "line" },
  circles: { kind: "plane", m: [[0, -1], [1, 0]], firstName: "rotate by 90°" },
  parabola: { kind: "curve", fn: "square", a: 1 },
  ellipse: { kind: "plane", m: [[2, 0], [0, 1]], area: true, firstName: "stretch a circle" },
  hyperbola: { kind: "plane", m: [[2, 0], [0, 0.5]], area: true, firstName: "squeeze along xy = c²" },
  limits: { kind: "curve", fn: "square", a: 1 },
  continuity: { kind: "threshold" },
  differentiability: { kind: "curve", fn: "cubic", a: 0.5 },
  "differentiation-methods": { kind: "curve", fn: "chain", a: 1 },
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

/** Caption for a section's opening figure, in textbook voice. */
export function introCaption(spec: IntroSpec): string {
  switch (spec.kind) {
    case "vectors":
      return spec.op === "span"
        ? "Every combination $a\vec v + b\vec w$ of two vectors. Independent vectors fill the plane; parallel ones collapse to a line."
        : spec.op === "add"
          ? "Vector addition, tip to tail: the sum is the single movement that does both."
          : spec.op === "scale"
            ? "Scalar multiplication stretches a vector along its own line; a negative scalar reverses it."
            : spec.op === "combo"
              ? "A linear combination: scale each vector, then add tip to tail."
              : "A vector as a movement: so many units across, so many up.";
    case "plane":
      if (spec.then) return `${spec.firstName ?? "The first matrix"} acts on the plane, then ${spec.thenName ?? "the second"}. The composite is a single matrix.`;
      if (spec.eigen) return "The matrix acting on the plane. Along the highlighted lines vectors are only stretched: these are the eigenvector directions.";
      if (spec.target) return "Solving $A\vec x = \vec b$: the input $\vec x$ is moved until its image lands on the target $\vec b$.";
      if (spec.area) return "The unit square under the matrix. Its area becomes $|\det A|$; a negative determinant also flips orientation.";
      return "The matrix acting on the plane: the columns are where $\hat\imath$ and $\hat\jmath$ land, and every grid line follows.";
    case "lattice":
      return "A $3\times3$ matrix acting on a lattice of 4,096 points. The gold line is an eigenvector direction: points on it stay on it.";
    case "cloud":
      return spec.flatten ? "A cloud of data, its principal axes, and its projection onto the plane of the two largest." : "Two variables with increasing correlation: the cloud tilts and narrows along the line of best fit.";
    case "bars":
      return "A distribution built up one observation at a time; the readout shows its summary statistics.";
    case "bell":
      return "The standard normal curve with both tails beyond $\pm z$ shaded: their area is the two-sided p-value.";
    case "intervals":
      return "Forty 95% confidence intervals from forty samples. The gold line is the true mean; intervals that miss it are marked.";
    case "people":
      return "One thousand people, each a column of points. The readout gives the counts behind each probability.";
    case "scatter":
      return spec.fit === "wiggle"
        ? "An interpolating polynomial through every point against a low-degree fit: training error and error on new data compared."
        : spec.fit === "simpson"
          ? "Two groups with the same downward trend inside each, and an upward trend when pooled (Simpson's paradox)."
          : spec.fit === "plane"
            ? "A least-squares plane through data with two features; vertical segments are residuals."
            : "The least-squares line, with each residual drawn as a square: the line minimises their total area.";
    case "curve":
      return "Secant lines through $a$ and $a+h$ as $h \to 0$; their slopes converge to the derivative $f'(a)$.";
    case "surface":
      return "A loss surface and a gradient-descent path on it; each step moves against the gradient.";
    case "network":
      return spec.train ? "A small network: activations flow forward, then gradients flow back to every weight." : "A small network: each layer is a matrix followed by a nonlinearity.";
    case "threshold":
      return "Classifier scores for positives and negatives with a moving threshold; the readout gives precision and recall at each threshold.";
  }
}
