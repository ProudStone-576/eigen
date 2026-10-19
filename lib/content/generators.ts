import type { Item, McItem } from "./types";

/**
 * Practice generators: fresh versions of each concept's questions with new
 * numbers, so a struggling student can keep practising until it clicks.
 *
 * Every generator computes its own answer (and traps), so correctness doesn't
 * depend on hand-written numbers. tests/generators.test.ts grades thousands of
 * generated items against their own answers.
 *
 * An item's id encodes how to rebuild it: gen~<nodeId>~<generator>~<seed>.
 */

export type Rng = { int: (lo: number, hi: number) => number; nonzero: (lo: number, hi: number) => number; pick: <T>(xs: readonly T[]) => T; next: () => number };

export function rng(seed: number): Rng {
  let s = seed | 0;
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  return {
    next,
    int,
    nonzero: (lo, hi) => {
      for (;;) {
        const x = int(lo, hi);
        if (x !== 0) return x;
      }
    },
    pick: (xs) => xs[Math.floor(next() * xs.length)],
  };
}

type Gen = (r: Rng) => Item;

const v = (x: number | string, y: number | string) => `\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}`;
const m = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`;
const r2 = (x: number) => Math.round(x * 100) / 100;
/** Negative numbers in brackets inside a product: (−2)·3. */
const par = (x: number) => (x < 0 ? `(${x})` : String(x));
const same = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < 1e-9);
const sameM = (a: number[][], b: number[][]) => a.every((row, i) => same(row, b[i]));

/** Multiple choice from a correct value and labelled wrong values; drops duplicates of the answer. */
function mcNumbers(prompt: string, correct: { text: string; why: string }, wrong: { text: string; why: string; misconception?: string }[]): McItem {
  const seen = new Set([correct.text]);
  const opts = wrong.filter((w) => !seen.has(w.text) && seen.add(w.text));
  return {
    kind: "mc",
    id: "",
    prompt,
    options: [{ id: "a", text: correct.text, correct: true, why: correct.why }, ...opts.map((w, i) => ({ id: "bcde"[i], text: w.text, why: w.why, misconception: w.misconception }))],
  };
}

const dir = (x: number, pos: string, neg: string) => `${Math.abs(x)} ${x < 0 ? neg : pos}`;

export const GENERATORS: Record<string, Gen[]> = {
  // ---------- Linear algebra ----------
  vector: [
    (r) => {
      const x = r.nonzero(-6, 6);
      const y = r.nonzero(-6, 6);
      return {
        kind: "vector", id: "", answer: [x, y],
        prompt: `A robot moves ${dir(x, "right", "left")} and ${dir(y, "up", "down")}. Write the movement as a vector.`,
        explain: `Right/up positive, left/down negative: $${v(x, y)}$.`,
        traps: [
          ...(x !== y ? [{ answer: [y, x], misconception: "order-swap", message: "Horizontal first, then vertical." }] : []),
          { answer: [Math.abs(x), Math.abs(y)], misconception: "sign-direction", message: "Left and down are negative." },
        ].filter((t) => !same(t.answer, [x, y])),
      };
    },
  ],
  "vector-add": [
    (r) => {
      const a = [r.int(-6, 6), r.int(-6, 6)];
      const b = [r.int(-6, 6), r.int(-6, 6)];
      const ans = [a[0] + b[0], a[1] + b[1]];
      const mult = [a[0] * b[0], a[1] * b[1]];
      return {
        kind: "vector", id: "", answer: ans,
        prompt: `Compute $${v(a[0], a[1])} + ${v(b[0], b[1])}$.`,
        explain: `Add matching components: $${v(ans[0], ans[1])}$.`,
        traps: same(mult, ans) ? [] : [{ answer: mult, misconception: "multiply-components", message: "That multiplies. Add the components." }],
      };
    },
  ],
  scalar: [
    (r) => {
      const k = r.pick([-3, -2, -0.5, 2, 3, 4]);
      const p = [r.nonzero(-5, 5), r.nonzero(-5, 5)];
      const ans = [k * p[0], k * p[1]];
      const one = [k * p[0], p[1]];
      return {
        kind: "vector", id: "", answer: ans,
        prompt: `Compute $${k === -0.5 ? "-\\tfrac12" : k}\\,${v(p[0], p[1])}$.`,
        explain: `Multiply every component by ${k}: $${v(ans[0], ans[1])}$.`,
        traps: [
          ...(same(one, ans) ? [] : [{ answer: one, misconception: "scale-one-component", message: "Scale both components." }]),
          ...(k < 0 && !same([-ans[0], -ans[1]], ans) ? [{ answer: [-ans[0], -ans[1]], misconception: "negative-shrinks", message: "A negative scalar also flips the direction." }] : []),
        ],
      };
    },
  ],
  "linear-combination": [
    (r) => {
      const a = r.nonzero(-3, 3);
      const b = r.nonzero(-3, 3);
      const p = [r.int(-3, 3), r.int(-3, 3)];
      const q = [r.int(-3, 3), r.int(-3, 3)];
      const ans = [a * p[0] + b * q[0], a * p[1] + b * q[1]];
      const wrong = [(a + b) * (p[0] + q[0]), (a + b) * (p[1] + q[1])];
      return {
        kind: "vector", id: "", answer: ans,
        prompt: `Compute $${a}${v(p[0], p[1])} ${b < 0 ? "-" : "+"} ${Math.abs(b)}${v(q[0], q[1])}$.`,
        explain: `Scale each, then add: $${v(ans[0], ans[1])}$.`,
        traps: same(wrong, ans) ? [] : [{ answer: wrong, misconception: "add-before-scale", message: "Scale each vector by its own number first." }],
      };
    },
  ],
  basis: [
    (r) => {
      const b1 = [r.int(-2, 2), r.nonzero(1, 3)];
      const b2 = [r.nonzero(1, 3), r.int(-2, 2)];
      const c1 = r.nonzero(-3, 3);
      const c2 = r.nonzero(-3, 3);
      const ans = [c1 * b1[0] + c2 * b2[0], c1 * b1[1] + c2 * b2[1]];
      return {
        kind: "vector", id: "", answer: ans,
        prompt: `In the basis $\\vec b_1 = ${v(b1[0], b1[1])}$, $\\vec b_2 = ${v(b2[0], b2[1])}$, a vector has weights ${c1} and ${c2}. Write it in ordinary coordinates.`,
        explain: `$${c1}\\vec b_1 + ${c2}\\vec b_2 = ${v(ans[0], ans[1])}$.`,
        traps: same([c1, c2], ans) ? [] : [{ answer: [c1, c2], misconception: "coords-not-weights", message: "Those are the weights. Apply them to b₁ and b₂." }],
      };
    },
  ],
  "matrix-transform": [
    (r) => {
      const i = [r.int(-3, 3), r.int(-3, 3)];
      const j = [r.int(-3, 3), r.int(-3, 3)];
      const ans = [[i[0], j[0]], [i[1], j[1]]];
      const rows = [[i[0], i[1]], [j[0], j[1]]];
      return {
        kind: "matrix", id: "", answer: ans,
        prompt: `A transformation sends $\\hat\\imath \\to ${v(i[0], i[1])}$ and $\\hat\\jmath \\to ${v(j[0], j[1])}$. Write its matrix.`,
        explain: `Columns are the landing spots: $${m(ans[0][0], ans[0][1], ans[1][0], ans[1][1])}$.`,
        traps: sameM(rows, ans) ? [] : [{ answer: rows, misconception: "rows-are-landings", message: "Landing spots go in columns, not rows." }],
      };
    },
  ],
  "matrix-vector": [
    (r) => {
      const [a, b, c, d] = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      const [x, y] = [r.int(-3, 3), r.int(-3, 3)];
      const ans = [a * x + b * y, c * x + d * y];
      const diag = [a * x, d * y];
      return {
        kind: "vector", id: "", answer: ans,
        prompt: `Compute $${m(a, b, c, d)}${v(x, y)}$.`,
        explain: `$${x}${v(a, c)} + ${y}${v(b, d)} = ${v(ans[0], ans[1])}$.`,
        traps: same(diag, ans) ? [] : [{ answer: diag, misconception: "elementwise", message: "Every entry contributes, not just the diagonal." }],
      };
    },
  ],
  composition: [
    (r) => {
      const A = [[r.int(-2, 2), r.int(-2, 2)], [r.int(-2, 2), r.int(-2, 2)]];
      const B = [[r.int(-2, 2), r.int(-2, 2)], [r.int(-2, 2), r.int(-2, 2)]];
      const mul = (P: number[][], Q: number[][]) => [
        [P[0][0] * Q[0][0] + P[0][1] * Q[1][0], P[0][0] * Q[0][1] + P[0][1] * Q[1][1]],
        [P[1][0] * Q[0][0] + P[1][1] * Q[1][0], P[1][0] * Q[0][1] + P[1][1] * Q[1][1]],
      ];
      const AB = mul(A, B);
      const BA = mul(B, A);
      return {
        kind: "matrix", id: "", answer: AB,
        prompt: `$A = ${m(A[0][0], A[0][1], A[1][0], A[1][1])}$, $B = ${m(B[0][0], B[0][1], B[1][0], B[1][1])}$. Compute $AB$ (B first, then A).`,
        explain: `Each column of AB is A times that column of B: $${m(AB[0][0], AB[0][1], AB[1][0], AB[1][1])}$.`,
        traps: sameM(BA, AB) ? [] : [{ answer: BA, misconception: "commutes", message: "That's BA. Order matters." }],
      };
    },
  ],
  span: [
    (r) => {
      const s = r.nonzero(-4, 4);
      const a = r.nonzero(-4, 4);
      return {
        kind: "number", id: "", answer: a * s,
        prompt: `For which $k$ is $${v(a, "k")}$ in the span of $${v(1, s)}$?`,
        explain: `It must be $${a}${v(1, s)} = ${v(a, a * s)}$.`,
      };
    },
  ],
  "linear-independence": [
    (r) => {
      const p = [r.nonzero(1, 4), r.nonzero(-4, 4)];
      const t = r.pick([2, 3, -2, -1]);
      return {
        kind: "number", id: "", answer: t * p[1],
        prompt: `For which $k$ are $${v(t * p[0], "k")}$ and $${v(p[0], p[1])}$ dependent?`,
        explain: `Parallel means $${v(t * p[0], "k")} = ${t}${v(p[0], p[1])}$, so $k = ${t * p[1]}$.`,
      };
    },
  ],
  determinant: [
    (r) => {
      const [a, b, c, d] = [r.int(-5, 5), r.nonzero(-5, 5), r.nonzero(-5, 5), r.int(-5, 5)];
      const det = a * d - b * c;
      return mcNumbers(`$\\det${m(a, b, c, d)} = ?$`, { text: String(det), why: `${par(a)}·${par(d)} − ${par(b)}·${par(c)} = ${det}.` }, [
        { text: String(a * d), why: "That's only a·d. Subtract b·c.", misconception: "ad-only" },
        { text: String(a * d + b * c), why: "Minus b·c, not plus.", misconception: "plus-bc" },
        { text: String(-det), why: "Wrong order: it's ad − bc." },
      ]);
    },
  ],
  "det-zero": [
    (r) => {
      const d = r.nonzero(1, 5);
      const k = r.nonzero(-4, 4);
      const b = r.nonzero(-4, 4);
      const c = (k * d) / b;
      if (!Number.isInteger(c)) return GENERATORS["det-zero"][0](r);
      return {
        kind: "number", id: "", answer: k,
        prompt: `For which $k$ is $\\det${m("k", b, c, d)} = 0$?`,
        explain: `${d}k − ${b}·${c} = 0, so k = ${k}.`,
      };
    },
  ],
  inverse: [
    (r) => {
      // det = 1 matrices built from shears keep the inverse integral.
      const s = r.nonzero(-3, 3);
      const t = r.nonzero(-3, 3);
      const A = [[1 + s * t, s], [t, 1]]; // [[1,s],[0,1]] * [[1,0],[t,1]]
      const inv = [[1, -s], [-t, 1 + s * t]];
      const recip = A.map((row) => row.map((x) => (x === 0 ? 0 : 1 / x)));
      return {
        kind: "matrix", id: "", answer: inv,
        prompt: `Find the inverse of $${m(A[0][0], A[0][1], A[1][0], A[1][1])}$ (its determinant is 1).`,
        explain: `Swap the diagonal, negate the rest, divide by 1: $${m(inv[0][0], inv[0][1], inv[1][0], inv[1][1])}$.`,
        traps: A.flat().includes(0) || sameM(recip, inv) ? [] : [{ answer: recip, misconception: "reciprocal-entries", message: "Flipping entries doesn't undo the transformation." }],
      };
    },
  ],
  "solving-systems": [
    (r) => {
      for (;;) {
        const [a, b, c, d] = [r.nonzero(-3, 3), r.int(-3, 3), r.int(-3, 3), r.nonzero(-3, 3)];
        if (a * d - b * c === 0) continue;
        const x = [r.int(-3, 3), r.int(-3, 3)];
        const bb = [a * x[0] + b * x[1], c * x[0] + d * x[1]];
        return {
          kind: "vector", id: "", answer: x,
          prompt: `Solve ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}y = ${bb[0]} and ${c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}y = ${bb[1]}. Give $\\begin{bmatrix}x\\\\y\\end{bmatrix}$.`,
          explain: `Check: ${a}·${x[0]} + ${b}·${x[1]} = ${bb[0]} and ${c}·${x[0]} + ${d}·${x[1]} = ${bb[1]}.`,
        };
      }
    },
  ],
  eigenvector: [
    (r) => {
      const a = r.int(1, 4);
      const b = r.nonzero(1, 3);
      const top = r.next() < 0.5;
      return {
        kind: "vector", id: "", answer: top ? [1, 1] : [1, -1], upToScale: true,
        prompt: `Give an eigenvector of $${m(a, b, b, a)}$ with eigenvalue ${top ? a + b : a - b}. (Any non-zero multiple counts.)`,
        explain: top ? `$A${v(1, 1)} = ${v(a + b, a + b)}$.` : `$A${v(1, -1)} = ${v(a - b, b - a)}$.`,
        traps: [{ answer: [0, 0], misconception: "zero-is-eigenvector", message: "Never the zero vector." }],
      };
    },
  ],
  eigenvalue: [
    (r) => {
      const a = r.int(-2, 4);
      const b = r.nonzero(-3, 3);
      const top = r.next() < 0.5;
      const vec = top ? [1, 1] : [1, -1];
      const lam = top ? a + b : a - b;
      return {
        kind: "number", id: "", answer: lam,
        prompt: `$${v(vec[0], vec[1])}$ is an eigenvector of $${m(a, b, b, a)}$. What is its eigenvalue?`,
        explain: `$A${v(vec[0], vec[1])} = ${v(lam * vec[0], lam * vec[1])} = ${lam}${v(vec[0], vec[1])}$.`,
      };
    },
  ],
  "finding-eigenvalues": [
    (r) => {
      // Symmetric [[a, b], [b, a]] has eigenvalues a ± b.
      const a = r.int(1, 5);
      const b = r.nonzero(1, 4);
      return {
        kind: "number", id: "", answer: a + b,
        prompt: `Find the **largest** eigenvalue of $${m(a, b, b, a)}$.`,
        explain: `$(${a} - \\lambda)^2 - ${b * b} = 0$ gives $\\lambda = ${a} \\pm ${b}$, so ${a + b}.`,
      };
    },
  ],
  "finding-eigenvectors": [
    (r) => {
      // A = [[p, q], [q, s]] built from a chosen eigenvector (x, y) and its perpendicular.
      const x = r.nonzero(1, 3);
      const y = r.nonzero(-3, 3);
      const l1 = r.int(2, 5);
      const l2 = r.int(-1, l1 - 1);
      const n = x * x + y * y;
      // A = l1 uuᵀ + l2 wwᵀ scaled by n to keep integers: A·n
      const A = [
        [l1 * x * x + l2 * y * y, (l1 - l2) * x * y],
        [(l1 - l2) * x * y, l1 * y * y + l2 * x * x],
      ];
      return {
        kind: "vector", id: "", answer: [x, y], upToScale: true,
        prompt: `$${m(A[0][0], A[0][1], A[1][0], A[1][1])}$ has eigenvalue ${l1 * n}. Find an eigenvector for it. (Any non-zero multiple counts.)`,
        explain: `Solve $(A - ${l1 * n}I)\\vec v = \\vec 0$: one solution is $${v(x, y)}$.`,
        traps: [{ answer: [0, 0], misconception: "zero-is-eigenvector", message: "The zero vector always solves it, but never counts." }],
      };
    },
  ],
  eigenbasis: [
    (r) => {
      const lam = r.pick([2, 3, -2, -1]);
      const k = r.int(2, 4);
      const p = [r.nonzero(1, 2), r.nonzero(-2, 2)];
      const f = lam ** k;
      return {
        kind: "vector", id: "", answer: [f * p[0], f * p[1]],
        prompt: `$${v(p[0], p[1])}$ is an eigenvector of $A$ with $\\lambda = ${lam}$. Compute $A^{${k}}${v(p[0], p[1])}$.`,
        explain: `$\\lambda^{${k}} = ${f}$, so the answer is $${f}${v(p[0], p[1])}$.`,
      };
    },
  ],
  pca: [
    (r) => {
      const p = r.int(2, 9);
      const q = r.int(1, p - 1);
      const xTop = r.next() < 0.5;
      const C = xTop ? [p, q] : [q, p];
      return {
        kind: "vector", id: "", answer: xTop ? [1, 0] : [0, 1], upToScale: true,
        prompt: `A covariance matrix is $${m(C[0], 0, 0, C[1])}$. Give the first principal component's direction. (Any multiple counts.)`,
        explain: `The eigenvector with the bigger eigenvalue, ${p}: the ${xTop ? "x" : "y"}-axis.`,
        traps: [{ answer: xTop ? [0, 1] : [1, 0], misconception: "smallest-eigen", message: "That's the direction of least spread." }],
      };
    },
  ],

  // ---------- Statistics ----------
  probability: [
    (r) => {
      const red = r.int(1, 8);
      const blue = r.int(1, 8);
      const green = r.int(0, 6);
      const total = red + blue + green;
      return {
        kind: "number", id: "", answer: blue / total,
        prompt: `A bag has ${red} red, ${blue} blue and ${green} green marbles. P(blue)? (A fraction like 3/10 is fine.)`,
        explain: `${blue} of ${total}.`,
      };
    },
  ],
  "random-variable": [
    (r) => {
      const n = r.pick([2, 3, 4]);
      const k = r.int(0, n);
      const choose = (a: number, b: number) => { let c = 1; for (let i = 0; i < b; i++) c = (c * (a - i)) / (i + 1); return c; };
      return {
        kind: "number", id: "", answer: choose(n, k) / 2 ** n,
        prompt: `Flip ${n} fair coins. X = number of heads. P(X = ${k})?`,
        explain: `${choose(n, k)} of the ${2 ** n} equally likely outcomes have exactly ${k} heads.`,
      };
    },
  ],
  expectation: [
    (r) => {
      const vals = [0, r.int(1, 5), r.int(6, 20)];
      const p1 = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      const p2 = r.pick([0.1, 0.2, 0.3].filter((x) => x + p1 < 1));
      const p0 = r2(1 - p1 - p2);
      const e = vals[1] * p1 + vals[2] * p2;
      return mcNumbers(
        `X is ${vals[0]} with probability ${p0}, ${vals[1]} with probability ${p1} and ${vals[2]} with probability ${p2}. What is E[X]?`,
        { text: String(r2(e)), why: `${vals[1]}·${p1} + ${vals[2]}·${p2} = ${r2(e)}.` },
        [{ text: String(r2((vals[0] + vals[1] + vals[2]) / 3)), why: "That's the plain average. Weight by probability.", misconception: "ignore-probabilities" }],
      );
    },
  ],
  "conditional-probability": [
    (r) => {
      const pb = r.pick([0.2, 0.25, 0.4, 0.5, 0.8]);
      const ratio = r.pick([0.25, 0.5, 0.75]);
      const pab = r2(pb * ratio);
      return mcNumbers(
        `P(A and B) = ${pab} and P(B) = ${pb}. What is P(A | B)?`,
        { text: String(ratio), why: `${pab} / ${pb}.` },
        [
          { text: String(pab), why: "That's P(A and B). Divide by P(B).", misconception: "joint-not-conditional" },
          { text: String(r2(pab * pb)), why: "Divide, don't multiply." },
        ],
      );
    },
  ],
  bayes: [
    (r) => {
      const prev = r.pick([0.01, 0.02, 0.05, 0.1]);
      const sens = r.pick([0.8, 0.9, 0.95]);
      const fpr = r.pick([0.05, 0.1]);
      const post = (prev * sens) / (prev * sens + (1 - prev) * fpr);
      return {
        kind: "number", id: "", answer: post, tolerance: 0.01,
        prompt: `A condition affects ${r2(prev * 100)}%. The test catches ${sens * 100}% of cases and false-alarms on ${fpr * 100}% of healthy people. P(condition | positive)? (Two decimals.)`,
        explain: `${r2(prev * sens * 1000) / 1000} true positives vs ${r2((1 - prev) * fpr * 1000) / 1000} false alarms: ≈ ${r2(post)}.`,
      };
    },
  ],
  independence: [
    (r) => {
      const pa = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      const pb = r.pick([0.2, 0.5, 0.6]);
      return mcNumbers(
        `A and B are independent, P(A) = ${pa}, P(B) = ${pb}. P(A and B)?`,
        { text: String(r2(pa * pb)), why: `${pa} × ${pb}.` },
        [{ text: String(r2(pa + pb)), why: "Multiply for \"and\".", misconception: "add-for-and" }],
      );
    },
  ],
  variance: [
    (r) => {
      const n = r.pick([3, 4]);
      const xs = Array.from({ length: n }, () => r.int(0, 9));
      const mean = xs.reduce((s, x) => s + x, 0) / n;
      const vr = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
      return {
        kind: "number", id: "", answer: vr, tolerance: 0.01,
        prompt: `Data ${xs.join(", ")}. What is the variance (divide by n)? (Two decimals.)`,
        explain: `Mean ${r2(mean)}; average squared deviation ${r2(vr)}.`,
      };
    },
  ],
  covariance: [
    (r) => {
      const sx = r.int(1, 5);
      const sy = r.int(1, 5);
      const rho = r.pick([-0.8, -0.5, 0.25, 0.5, 0.6, 0.9]);
      const cov = r2(rho * sx * sy);
      return {
        kind: "number", id: "", answer: cov / (sx * sy), tolerance: 0.01,
        prompt: `Cov(X, Y) = ${cov}, σx = ${sx}, σy = ${sy}. What is the correlation? (Two decimals.)`,
        explain: `${cov} / (${sx} · ${sy}).`,
      };
    },
  ],
  "pca-practice": [
    (r) => {
      const ls = [r.int(20, 60), r.int(10, 30), r.int(5, 15), r.int(1, 5)].sort((a, b) => b - a);
      const total = ls.reduce((s, x) => s + x, 0);
      const k = r.int(1, 3);
      const kept = ls.slice(0, k).reduce((s, x) => s + x, 0);
      return {
        kind: "number", id: "", answer: kept / total, tolerance: 0.01,
        prompt: `Covariance eigenvalues are ${ls.join(", ")}. What fraction of the variance do the top ${k} component${k > 1 ? "s" : ""} keep? (Two decimals.)`,
        explain: `${kept} / ${total} ≈ ${r2(kept / total)}.`,
      };
    },
  ],
  normal: [
    (r) => {
      const mu = r.int(5, 20) * 5;
      const s = r.pick([2, 4, 5, 10, 15]);
      const z = r.pick([-2, -1.5, -1, 0.5, 1, 1.5, 2, 3]);
      return {
        kind: "number", id: "", answer: z,
        prompt: `μ = ${mu}, σ = ${s}. What is the z-score of x = ${mu + z * s}?`,
        explain: `(${mu + z * s} − ${mu}) / ${s} = ${z}.`,
      };
    },
  ],
  mle: [
    (r) => {
      const n = r.pick([10, 20, 40, 50, 100]);
      const k = r.int(1, n - 1);
      return {
        kind: "number", id: "", answer: k / n,
        prompt: `${k} heads in ${n} flips. What is the maximum-likelihood estimate of p?`,
        explain: `k / n = ${k}/${n}.`,
      };
    },
  ],
  "least-squares": [
    (r) => {
      const vx = r.int(1, 6);
      const w = r.nonzero(-3, 3);
      const cov = w * vx;
      return mcNumbers(
        `Var(x) = ${vx} and Cov(x, y) = ${cov}. What is the least-squares slope?`,
        { text: String(w), why: `Cov / Var = ${cov} / ${vx}.` },
        [{ text: String(r2(vx / cov)), why: "Upside down: Cov goes on top.", misconception: "slope-flipped" }],
      );
    },
  ],
  "loss-functions": [
    (r) => {
      const n = r.pick([2, 3]);
      const pred = Array.from({ length: n }, () => r.int(0, 6));
      const truth = pred.map((p) => p + r.int(-3, 3));
      const mse = pred.reduce((s, p, i) => s + (p - truth[i]) ** 2, 0) / n;
      return {
        kind: "number", id: "", answer: mse, tolerance: 0.01,
        prompt: `Predictions ${pred.join(", ")}; true values ${truth.join(", ")}. Mean squared error? (Two decimals.)`,
        explain: `Squared errors ${pred.map((p, i) => (p - truth[i]) ** 2).join(", ")}; average ${r2(mse)}.`,
      };
    },
  ],

  // ---------- Calculus ----------
  derivative: [
    (r) => {
      const a = r.int(-4, 5);
      return mcNumbers(`f(x) = x². What is f′(${a})?`, { text: String(2 * a), why: `f′(x) = 2x.` }, [
        { text: String(a * a), why: "That's f(a), the height. The derivative is the slope.", misconception: "derivative-is-value" },
      ]);
    },
  ],
  "derivative-rules": [
    (r) => {
      const c = r.nonzero(2, 6);
      const n = r.int(2, 5);
      const k = r.nonzero(-5, 5);
      const e = r.int(1, 9);
      return {
        kind: "expression", id: "",
        prompt: `Differentiate $${c}x^{${n}} ${k < 0 ? "-" : "+"} ${Math.abs(k)}x + ${e}$.`,
        forms: [
          { value: `${c * n}x^${n - 1} + ${k} + ${e}`, status: "wrong", misconception: "constant-not-zero", message: "The constant term's derivative is 0." },
          { value: `${c}x^${n - 1} + ${k}`, status: "wrong", misconception: "power-rule-drop", message: "Multiply by the old power too." },
          { value: `${c * n}x^${n} + ${k}`, status: "wrong", misconception: "power-keep-exponent", message: "Lower the power by one." },
          { value: `${c * n}x^${n - 1} + ${k}`, status: "correct" },
        ],
        explain: `$${c * n}x^{${n - 1}} ${k < 0 ? "-" : "+"} ${Math.abs(k)}$.`,
      };
    },
  ],
  "chain-rule": [
    (r) => {
      const a = r.nonzero(2, 5);
      const b = r.nonzero(-5, 5);
      const n = r.int(2, 4);
      return {
        kind: "expression", id: "",
        prompt: `Differentiate $(${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${n}}$.`,
        forms: [
          { value: `${n}(${a}x + ${b})^${n - 1}`, status: "wrong", misconception: "forget-inner", message: `Multiply by the inside's derivative, ${a}.` },
          { value: `${n * a}(${a}x + ${b})^${n - 1}`, status: "correct" },
        ],
        explain: `$${n}(${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${n - 1}} \\cdot ${a}$.`,
      };
    },
  ],
  gradient: [
    (r) => {
      const a = r.nonzero(1, 4);
      const b = r.nonzero(1, 4);
      const x = r.int(-3, 3);
      const y = r.int(-3, 3);
      return {
        kind: "vector", id: "", answer: [2 * a * x, 2 * b * y],
        prompt: `f(x, y) = ${a}x² + ${b}y². Compute ∇f at (${x}, ${y}).`,
        explain: `$\\nabla f = ${v(`${2 * a}x`, `${2 * b}y`)} = ${v(2 * a * x, 2 * b * y)}$.`,
      };
    },
  ],
  "gradient-descent": [
    (r) => {
      const c = r.int(-3, 3);
      const w = c + r.nonzero(-4, 4);
      const eta = r.pick([0.1, 0.25, 0.5]);
      const g = 2 * (w - c);
      const next = r2(w - eta * g);
      return mcNumbers(
        `L(w) = (w ${c < 0 ? "+" : "−"} ${Math.abs(c)})². From w = ${w} with η = ${eta}, where does one step go?`,
        { text: String(next), why: `L′(${w}) = ${g}; ${w} − ${eta} × ${par(g)} = ${next}.` },
        [{ text: String(r2(w + eta * g)), why: "That stepped uphill. Subtract η∇L.", misconception: "plus-gradient" }],
      );
    },
  ],
  backprop: [
    (r) => {
      const x = r.nonzero(-3, 3);
      const w = r.int(-3, 3);
      const y = r.int(-6, 6);
      const yhat = w * x;
      return {
        kind: "number", id: "", answer: 2 * (yhat - y) * x,
        prompt: `ŷ = wx and L = (ŷ − y)², with x = ${x}, w = ${w}, y = ${y}. What is ∂L/∂w?`,
        explain: `2(ŷ − y)·x = 2(${yhat} − ${y})·${x} = ${2 * (yhat - y) * x}.`,
      };
    },
  ],

  // ---------- Neural networks ----------
  neuron: [
    (r) => {
      const w = [r.int(-3, 3), r.int(-3, 3)];
      const x = [r.int(-3, 3), r.int(-3, 3)];
      const b = r.nonzero(-4, 4);
      const z = w[0] * x[0] + w[1] * x[1] + b;
      return mcNumbers(
        `$\vec w = ${v(w[0], w[1])}$, $\vec x = ${v(x[0], x[1])}$, $b = ${b}$. What is $z = \vec w\cdot\vec x + b$?`,
        { text: String(z), why: `${par(w[0])}·${par(x[0])} + ${par(w[1])}·${par(x[1])} + ${par(b)} = ${z}.` },
        [{ text: String(z - b), why: "Don't forget the bias.", misconception: "forget-bias" }],
      );
    },
  ],
  activation: [
    (r) => {
      const z = r.pick([-6, -4, -2.5, -1, -0.5, 1.5, 3, 5]);
      const relu = Math.max(0, z);
      return mcNumbers(`ReLU(${z}) = ?`, { text: String(relu), why: z < 0 ? "Negatives become 0." : "Positives pass unchanged." }, [
        { text: String(z), why: "ReLU blocks negatives.", misconception: "relu-passes-negatives" },
        { text: String(Math.abs(z)), why: "ReLU isn't the absolute value.", misconception: "relu-abs" },
      ]);
    },
  ],
  layer: [
    (r) => {
      const mm = r.int(2, 9);
      let n = r.int(2, 9);
      if (n === mm) n = mm + 1;
      return mcNumbers(`A layer has ${mm} neurons reading ${n} inputs. What shape is its weight matrix W?`, { text: `${mm} × ${n}`, why: "One row per neuron, one column per input." }, [
        { text: `${n} × ${mm}`, why: "Rows are neurons, columns are inputs.", misconception: "shape-flip" },
      ]);
    },
  ],
  "forward-pass": [
    (r) => {
      const z = [r.int(-4, 4), r.int(-4, 4)];
      const w = [r.nonzero(1, 3), r.nonzero(1, 3)];
      const b = r.int(-2, 2);
      const h = z.map((x) => Math.max(0, x));
      const y = w[0] * h[0] + w[1] * h[1] + b;
      const skip = w[0] * z[0] + w[1] * z[1] + b;
      return mcNumbers(
        `A hidden layer's pre-activation is $${v(z[0], z[1])}$. Apply ReLU, then $\hat y = ${w[0]}h_1 + ${w[1]}h_2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}$. What is $\hat y$?`,
        { text: String(y), why: `h = (${h[0]}, ${h[1]}); ŷ = ${y}.` },
        [{ text: String(skip), why: "That skipped the ReLU.", misconception: "skip-activation" }],
      );
    },
  ],
  "training-loop": [
    (r) => {
      const batch = r.pick([10, 20, 25, 50, 100]);
      const steps = r.int(2, 40);
      const epochs = r.int(1, 5);
      return {
        kind: "number", id: "", answer: steps * epochs,
        prompt: `${batch * steps} training examples, batch size ${batch}. How many gradient steps in ${epochs} epoch${epochs > 1 ? "s" : ""}?`,
        explain: `${steps} steps per epoch × ${epochs}.`,
      };
    },
  ],
  "train-network": [
    (r) => {
      const i = r.int(2, 6);
      const h = r.int(2, 12);
      const o = r.int(1, 4);
      return {
        kind: "number", id: "", answer: i * h + h + h * o + o,
        prompt: `How many parameters (weights and biases) does a ${i} → ${h} → ${o} network have?`,
        explain: `${i}·${h} + ${h} = ${i * h + h}, then ${h}·${o} + ${o} = ${h * o + o}.`,
      };
    },
  ],
};

export function generatedId(nodeId: string, gen: number, seed: number) {
  return `gen~${nodeId}~${gen}~${seed}`;
}

/** Rebuild a generated item from its id. Same id, same question. */
export function fromGeneratedId(id: string): { nodeId: string; item: Item } | null {
  const [tag, nodeId, g, s] = id.split("~");
  if (tag !== "gen" || !nodeId) return null;
  const gens = GENERATORS[nodeId];
  const gen = gens?.[Number(g)];
  const seed = Number(s);
  if (!gen || !Number.isInteger(seed)) return null;
  return { nodeId, item: { ...gen(rng(seed)), id } };
}

export function generate(nodeId: string, seed: number): Item | null {
  const gens = GENERATORS[nodeId];
  if (!gens?.length) return null;
  const g = seed % gens.length;
  return fromGeneratedId(generatedId(nodeId, g, seed))?.item ?? null;
}
