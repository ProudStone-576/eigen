import type { Item } from "./types";
import { GENERATORS, mcNumbers, par, r2, rng, same, sameM, m, v, type Rng } from "./generators";

/**
 * Question templates: several *kinds* of question per concept, each at three
 * difficulty levels, so practice and exams test an idea from different angles.
 *
 *   compute    – the core calculation (the original generators)
 *   reverse    – work backwards from a result to an input
 *   interpret  – what does a number or result *mean*
 *   error      – spot the mistake in someone's working
 *   real-world – the idea inside a concrete situation
 *
 * Level 1 is small friendly numbers; level 3 brings negatives, bigger values,
 * fractions or an extra step. Every template computes its own answer.
 *
 * Ids: gen~<node>~<template>~<level>~<seed>. (Old 4-part ids are level 1.)
 */

export type TemplateType = "compute" | "reverse" | "interpret" | "error" | "real-world";
export type Level = 1 | 2 | 3;
export type Template = { type: TemplateType; make: (r: Rng, level: Level) => Item };

export const TYPE_LABEL: Record<TemplateType, string> = {
  compute: "Compute",
  reverse: "Work backwards",
  interpret: "What does it mean?",
  error: "Spot the error",
  "real-world": "Real world",
};

/** Number range for a level: ±3, ±6, ±10. */
const span = (L: Level) => [3, 6, 10][L - 1];
const sgn = (x: number) => (x < 0 ? "−" : "+");
const abs = Math.abs;

const EXTRA: Record<string, Template[]> = {
  // ---------- Linear algebra ----------
  vector: [
    {
      type: "real-world",
      make: (r, L) => {
        const s = span(L);
        const a = [r.int(-s, s), r.int(-s, s)];
        const b = [r.int(-s, s), r.int(-s, s)];
        const d = [b[0] - a[0], b[1] - a[1]];
        if (d[0] === 0 && d[1] === 0) b[0] += 1, (d[0] = 1);
        return {
          kind: "vector", id: "", answer: d,
          prompt: `A drone flies from the point (${a[0]}, ${a[1]}) to (${b[0]}, ${b[1]}). Write its movement as a vector.`,
          explain: `End minus start: $${v(`${b[0]} - ${par(a[0])}`, `${b[1]} - ${par(a[1])}`)} = ${v(d[0], d[1])}$.`,
          traps: same([-d[0], -d[1]], d) ? [] : [{ answer: [-d[0], -d[1]], misconception: "sign-direction", message: "That's start minus end: the drone flying backwards." }],
        };
      },
    },
    {
      type: "interpret",
      make: (r, L) => {
        const s = span(L);
        const x = r.nonzero(-s, s);
        let y = r.nonzero(-s, s);
        if (abs(y) === abs(x)) y = y > 0 ? y + 1 : y - 1;
        const say = (h: number, vv: number) => `${abs(h)} ${h < 0 ? "left" : "right"}, ${abs(vv)} ${vv < 0 ? "down" : "up"}`;
        return mcNumbers(`Which movement does $${v(x, y)}$ describe?`, { text: say(x, y), why: "First number horizontal, second vertical; negative means left/down." }, [
          { text: say(y, x), why: "The first number is horizontal.", misconception: "order-swap" },
          { text: say(-x, y), why: "Check the sign of the first number.", misconception: "sign-direction" },
          { text: say(x, -y), why: "Check the sign of the second number.", misconception: "sign-direction" },
        ]);
      },
    },
  ],
  "vector-add": [
    {
      type: "reverse",
      make: (r, L) => {
        const s = span(L);
        const a = [r.int(-s, s), r.int(-s, s)];
        const x = [r.int(-s, s), r.int(-s, s)];
        const b = [a[0] + x[0], a[1] + x[1]];
        return {
          kind: "vector", id: "", answer: x,
          prompt: `Find the missing vector: $${v(a[0], a[1])} + \\vec x = ${v(b[0], b[1])}$.`,
          explain: `Subtract: $\\vec x = ${v(`${b[0]} - ${par(a[0])}`, `${b[1]} - ${par(a[1])}`)} = ${v(x[0], x[1])}$.`,
        };
      },
    },
    {
      type: "real-world",
      make: (r, L) => {
        const p = [r.int(2, 6) * 50, L === 1 ? 0 : r.int(-3, 3) * 10];
        const w = [L === 3 ? r.int(-5, 5) * 10 : 0, r.nonzero(-6, 6) * 10];
        const g = [p[0] + w[0], p[1] + w[1]];
        return {
          kind: "vector", id: "", answer: g,
          prompt: `A plane's airspeed is $${v(p[0], p[1])}$ km/h and the wind blows at $${v(w[0], w[1])}$ km/h. What is its velocity over the ground?`,
          explain: `Add the two movements: $${v(g[0], g[1])}$ km/h.`,
        };
      },
    },
  ],
  scalar: [
    {
      type: "reverse",
      make: (r, L) => {
        const k = r.pick(L === 1 ? [2, 3, 4] : L === 2 ? [-3, -2, 2, 5] : [-0.5, 1.5, -4, 0.25]);
        const a = [r.nonzero(-4, 4) * (k === 0.25 ? 4 : 2), r.nonzero(-4, 4) * (k === 0.25 ? 4 : 2)];
        const b = [k * a[0], k * a[1]];
        return {
          kind: "number", id: "", answer: k,
          prompt: `$k${v(a[0], a[1])} = ${v(b[0], b[1])}$. What is $k$?`,
          explain: `${b[0]} ÷ ${par(a[0])} = ${k}, and the second component agrees.`,
        };
      },
    },
    {
      type: "error",
      make: (r) => {
        const k = r.pick([2, 3, 4, -2]);
        const a = [r.nonzero(-4, 4), r.nonzero(-4, 4)];
        return mcNumbers(
          `Ali says $${k}${v(a[0], a[1])} = ${v(k * a[0], a[1])}$. What went wrong?`,
          { text: "Only the first component was scaled", why: `Both components get multiplied: $${v(k * a[0], k * a[1])}$.` },
          [
            { text: "Nothing: that's correct", why: "The second component should have been scaled too.", misconception: "scale-one-component" },
            { text: "The scalar should have been added", why: "Scaling multiplies." },
          ],
        );
      },
    },
  ],
  "matrix-transform": [
    {
      type: "interpret",
      make: (r, L) => {
        const s = span(L);
        const [a, b, c, d] = [r.int(-s, s), r.int(-s, s), r.int(-s, s), r.int(-s, s)];
        const col = (x: number, y: number) => `$${v(x, y)}$`;
        return mcNumbers(`For $${m(a, b, c, d)}$, where does $\\hat\\jmath$ land?`, { text: col(b, d), why: "The second column." }, [
          { text: col(c, d), why: "That's the second row. Landing spots are columns.", misconception: "rows-are-landings" },
          { text: col(a, c), why: "That's where î lands." },
        ]);
      },
    },
    {
      type: "real-world",
      make: (r, L) => {
        const k = r.pick([2, 3, 0.5]);
        const q = r.pick([1, 2, 0.5, 3]);
        const shear = L === 3 ? r.nonzero(-2, 2) : 0;
        const ans = [[k, shear], [0, q]];
        return {
          kind: "matrix", id: "", answer: ans,
          prompt: `A photo filter stretches images ${k}× horizontally and ${q}× vertically${shear ? `, and slides ĵ sideways by ${shear} (a shear)` : ""}. Write its matrix.`,
          explain: `î lands on $${v(k, 0)}$ and ĵ on $${v(shear, q)}$: $${m(k, shear, 0, q)}$.`,
          traps: shear ? [{ answer: [[k, 0], [shear, q]], misconception: "rows-are-landings", message: "ĵ's landing spot goes in the second column." }] : [],
        };
      },
    },
  ],
  "matrix-vector": [
    {
      type: "error",
      make: (r) => {
        const [a, b, c, d] = [r.nonzero(-3, 3), r.nonzero(-3, 3), r.nonzero(-3, 3), r.nonzero(-3, 3)];
        const [x, y] = [r.nonzero(-3, 3), r.nonzero(-3, 3)];
        return mcNumbers(
          `Kim computes $${m(a, b, c, d)}${v(x, y)} = ${v(a * x, d * y)}$. What's wrong?`,
          { text: "The off-diagonal entries were ignored", why: `It's $${x}${v(a, c)} + ${y}${v(b, d)} = ${v(a * x + b * y, c * x + d * y)}$.` },
          [
            { text: "Nothing: multiply matching entries", why: "Each output mixes both columns.", misconception: "elementwise" },
            { text: "The vector should be on the left", why: "Order is fine; the multiplication itself is off." },
          ],
        );
      },
    },
    {
      type: "reverse",
      make: (r, L) => {
        const p = r.nonzero(1, 3 + L);
        const q = r.nonzero(-3 - L, 3);
        const x = [r.int(-span(L), span(L)), r.int(-span(L), span(L))];
        return {
          kind: "vector", id: "", answer: x,
          prompt: `$${m(p, 0, 0, q)}\\vec x = ${v(p * x[0], q * x[1])}$. What is $\\vec x$?`,
          explain: `Undo each stretch: $${v(`${p * x[0]}/${par(p)}`, `${q * x[1]}/${par(q)}`)} = ${v(x[0], x[1])}$.`,
        };
      },
    },
  ],
  composition: [
    {
      type: "interpret",
      make: (r) => {
        const [first, second] = r.pick([["R", "S"], ["A", "B"], ["P", "Q"]] as const);
        return mcNumbers(
          `Apply ${first} first, then ${second}. Which single matrix does both?`,
          { text: `${second}${first}`, why: `The matrix next to the vector acts first: ${second}(${first}v).` },
          [
            { text: `${first}${second}`, why: "That would apply the left one first. Read right to left.", misconception: "left-first" },
            { text: "Either: the order doesn't matter", why: "Order usually changes the result.", misconception: "commutes" },
          ],
        );
      },
    },
    {
      type: "error",
      make: () =>
        mcNumbers(
          "Lee says: \"AB and BA are always the same matrix.\" Is Lee right?",
          { text: "No: rotating then shearing differs from shearing then rotating", why: "Order matters for most pairs of matrices." },
          [{ text: "Yes, like ordinary multiplication", why: "Numbers commute; matrices usually don't.", misconception: "commutes" }],
        ),
    },
  ],
  determinant: [
    {
      type: "reverse",
      make: (r, L) => {
        const d = r.nonzero(1, 2 + L);
        const [b, c] = [r.nonzero(-span(L), span(L)), r.nonzero(-span(L), span(L))];
        const x = r.int(-span(L), span(L));
        const t = x * d - b * c;
        return {
          kind: "number", id: "", answer: x,
          prompt: `$\\det${m("x", b, c, d)} = ${t}$. What is $x$?`,
          explain: `${d}x − ${par(b)}·${par(c)} = ${t}, so ${d}x = ${t + b * c} and x = ${x}.`,
        };
      },
    },
    {
      type: "interpret",
      make: (r, L) => {
        const det = L === 3 ? r.pick([-0.5, 0.25, -2.5, 1.5]) : r.nonzero(-4, 4);
        const area = abs(det);
        const say = (a: number, flip: boolean) => `Areas ×${a}${flip ? ", flipped over" : ", same orientation"}`;
        return mcNumbers(`A matrix has determinant ${det}. What does it do to areas?`, { text: say(area, det < 0), why: `Size |det| = ${area}; sign ${det < 0 ? "negative: flipped" : "positive: not flipped"}.` }, [
          { text: say(area, det >= 0), why: "The sign decides flipping." },
          ...(det < 0 ? [{ text: `Areas shrink to ${r2(1 / area)}× (negative means smaller)`, why: "Negative means flipped, not smaller.", misconception: "negative-means-smaller" }] : []),
        ]);
      },
    },
    {
      type: "error",
      make: (r) => {
        const [a, b, c, d] = [r.nonzero(1, 6), r.nonzero(1, 6), r.nonzero(1, 6), r.nonzero(1, 6)];
        return mcNumbers(
          `Raj computes $\\det${m(a, b, c, d)} = ${a}·${d} + ${b}·${c} = ${a * d + b * c}$. What's the mistake?`,
          { text: `It's ad − bc = ${a * d - b * c}`, why: "Subtract b·c." },
          [{ text: "No mistake", why: "The formula subtracts bc.", misconception: "plus-bc" }],
        );
      },
    },
    {
      type: "real-world",
      make: (r, L) => {
        const [a, b, c, d] = [r.int(1, 3 + L), r.int(-2, 2), r.int(-2, 2), r.int(1, 3 + L)];
        const det = a * d - b * c;
        if (det === 0) return EXTRA.determinant[3].make(r, L);
        const logo = r.pick([2, 5, 10, 12]);
        return {
          kind: "number", id: "", answer: abs(det) * logo,
          prompt: `An image-warping filter uses $${m(a, b, c, d)}$. A logo covering ${logo} cm² is warped. What area does it cover afterwards?`,
          explain: `|det| = |${a}·${d} − ${par(b)}·${par(c)}| = ${abs(det)}, so ${logo} × ${abs(det)} = ${abs(det) * logo} cm².`,
        };
      },
    },
  ],
  inverse: [
    {
      type: "interpret",
      make: (r) => {
        const k = r.nonzero(1, 3);
        const [p, q] = [r.nonzero(1, 4), r.nonzero(-4, 4)];
        const singular = m(p, q, k * p, k * q);
        const zeroEntry = m(0, r.nonzero(1, 3), r.nonzero(1, 3), r.int(-2, 2));
        const diag = m(r.nonzero(2, 4), 0, 0, r.nonzero(2, 4));
        return mcNumbers(
          "Which matrix has **no** inverse?",
          { text: `$${singular}$`, why: `Row 2 is ${k}× row 1, so det = 0.` },
          [
            { text: `$${zeroEntry}$`, why: "Its determinant isn't 0; zero entries are fine.", misconception: "zero-entry-no-inverse" },
            { text: `$${diag}$`, why: "A stretch with no zero on the diagonal undoes easily.", misconception: "zero-entry-no-inverse" },
          ],
        );
      },
    },
    {
      type: "reverse",
      make: (r, L) => {
        const s = r.nonzero(-2, 2);
        const t = r.nonzero(-2, 2);
        const inv = [[1, -s], [-t, 1 + s * t]];
        const x = [r.int(-span(L), span(L)), r.int(-span(L), span(L))];
        const A = [[1 + s * t, s], [t, 1]];
        const b = [A[0][0] * x[0] + A[0][1] * x[1], A[1][0] * x[0] + A[1][1] * x[1]];
        return {
          kind: "vector", id: "", answer: x,
          prompt: `$A = ${m(A[0][0], A[0][1], A[1][0], A[1][1])}$ has inverse $${m(inv[0][0], inv[0][1], inv[1][0], inv[1][1])}$. Solve $A\\vec x = ${v(b[0], b[1])}$.`,
          explain: `$\\vec x = A^{-1}\\vec b = ${v(x[0], x[1])}$.`,
        };
      },
    },
  ],
  "solving-systems": [
    {
      type: "real-world",
      make: (r, L) => {
        const adult = r.pick([8, 10, 12, 15]);
        const child = r.pick([4, 5, 6]);
        const A = r.int(2, 10 * L);
        const K = r.int(2, 10 * L);
        return {
          kind: "vector", id: "", answer: [A, K],
          prompt: `Adult tickets cost $${adult}, child tickets $${child}. ${A + K} tickets were sold for $${adult * A + child * K}. How many of each? Give $\\begin{bmatrix}\\text{adults}\\\\\\text{children}\\end{bmatrix}$.`,
          explain: `a + c = ${A + K} and ${adult}a + ${child}c = ${adult * A + child * K} give a = ${A}, c = ${K}.`,
          traps: A === K ? [] : [{ answer: [K, A], misconception: "columns-are-equations", message: "Swapped: adults first." }],
        };
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const [a, b, c, d] = [r.nonzero(1, 5), r.nonzero(-4, 4), r.nonzero(-4, 4), r.nonzero(1, 5)];
        if (b === c) return EXTRA["solving-systems"][1].make(r, 1);
        return mcNumbers(
          `Write ${a}x ${sgn(b)} ${abs(b)}y = 1 and ${c}x ${sgn(d)} ${abs(d)}y = 2 as $A\\vec x = \\vec b$. What is $A$?`,
          { text: `$${m(a, b, c, d)}$`, why: "One row per equation." },
          [{ text: `$${m(a, c, b, d)}$`, why: "Equations are rows, not columns.", misconception: "columns-are-equations" }],
        );
      },
    },
  ],
  eigenvector: [
    {
      type: "error",
      make: () =>
        mcNumbers(
          "Mia says: \"The zero vector is an eigenvector of every matrix, because A·0 = λ·0.\" Is she right?",
          { text: "No: eigenvectors must be non-zero", why: "A·0 = 0 for every matrix, so it tells you nothing." },
          [{ text: "Yes: the equation holds", why: "It holds trivially, which is exactly why it's excluded.", misconception: "zero-is-eigenvector" }],
        ),
    },
    {
      type: "interpret",
      make: (r) => {
        const a = r.int(1, 5);
        const b = r.nonzero(1, 3);
        const vecs = [[1, 1], [1, -1], [1, 0], [2, 1]];
        const vec = r.pick(vecs);
        const Av = [a * vec[0] + b * vec[1], b * vec[0] + a * vec[1]];
        const cross = vec[0] * Av[1] - vec[1] * Av[0];
        const lam = vec[0] ? Av[0] / vec[0] : Av[1] / vec[1];
        const yes = cross === 0;
        return mcNumbers(
          `Is $${v(vec[0], vec[1])}$ an eigenvector of $${m(a, b, b, a)}$?`,
          yes ? { text: `Yes, with λ = ${lam}`, why: `$A\\vec v = ${v(Av[0], Av[1])} = ${lam}\\vec v$.` } : { text: "No", why: `$A\\vec v = ${v(Av[0], Av[1])}$ isn't a multiple of $\\vec v$.` },
          [yes ? { text: "No", why: `$A\\vec v = ${lam}\\vec v$.` } : { text: `Yes, with λ = ${a}`, why: "Av is knocked off v's line." }],
        );
      },
    },
  ],
  eigenvalue: [
    {
      type: "interpret",
      make: (r) => {
        const lam = r.pick([-0.5, -2, 0.5, 3, -1]);
        const desc = (l: number) => `${l < 0 ? "Flipped" : "Same direction"}, ${abs(l) === 1 ? "same length" : abs(l) > 1 ? `stretched ×${abs(l)}` : `shrunk to ×${abs(l)}`}`;
        return mcNumbers(`An eigenvector has eigenvalue ${lam}. What does the matrix do to it?`, { text: desc(lam), why: "Size |λ| scales; a negative sign flips." }, [
          { text: desc(-lam), why: "Check the sign." },
          ...(lam < 0 ? [{ text: "Impossible: eigenvalues can't be negative", why: "Flipping keeps it on its line.", misconception: "negative-impossible" }] : []),
        ]);
      },
    },
    {
      type: "real-world",
      make: (r, L) => {
        const lam = r.pick([1.1, 1.2, 1.5, 0.9, 2]);
        const n = r.int(2, 1 + L * 2);
        return {
          kind: "number", id: "", answer: lam ** n, tolerance: 0.01,
          prompt: `A population model's largest eigenvalue is ${lam}. In the long run, by what factor does the population change over ${n} years? (Two decimals.)`,
          explain: `Each year multiplies by λ: ${lam}^${n} ≈ ${r2(lam ** n)}.`,
        };
      },
    },
  ],
  "finding-eigenvalues": [
    {
      type: "compute",
      make: (r, L) => {
        // Integer eigenvalues l1 > l2 baked in through trace and determinant.
        for (;;) {
          const l1 = r.int(1, 3 + L * 2);
          const l2 = r.int(-L * 2, l1 - 1);
          const p = r.int(-span(L), span(L));
          const s = l1 + l2 - p;
          const q = r.nonzero(-4, 4);
          const rr = (p * s - l1 * l2) / q;
          if (!Number.isInteger(rr) || abs(rr) > 12) continue;
          return {
            kind: "number", id: "", answer: l1,
            prompt: `Find the **largest** eigenvalue of $${m(p, q, rr, s)}$.`,
            explain: `λ² − ${p + s}λ + ${p * s - q * rr} = 0 factors as (λ − ${l1})(λ ${sgn(-l2)} ${abs(l2)}) = 0.`,
          };
        }
      },
    },
    {
      type: "error",
      make: () =>
        mcNumbers(
          "Sol finds eigenvalues by solving det(A) = 0. What's wrong?",
          { text: "It should be det(A − λI) = 0", why: "λ has to appear in the equation." },
          [{ text: "Nothing", why: "det(A) is just one number with no λ in it.", misconception: "det-of-A" }],
        ),
    },
  ],
  "pca-practice": [
    {
      type: "compute",
      make: (r, L) => {
        const n = 3 + (L - 1);
        const pts = Array.from({ length: n }, () => [r.int(-span(L), span(L)), r.int(-span(L), span(L))]);
        const mean = [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
        return {
          kind: "vector", id: "", answer: mean,
          prompt: `Before PCA, centre the data ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}. What mean do you subtract? (Fractions are fine.)`,
          explain: `Average each coordinate: (${r2(mean[0])}, ${r2(mean[1])}).`,
        };
      },
    },
    {
      type: "reverse",
      make: (r) => {
        const ls = [r.int(30, 60), r.int(15, 25), r.int(8, 14), r.int(3, 6), r.int(1, 2)];
        const total = ls.reduce((s, x) => s + x, 0);
        const target = r.pick([0.8, 0.9, 0.95]);
        let k = 0;
        let acc = 0;
        while (acc / total < target) acc += ls[k++];
        return {
          kind: "number", id: "", answer: k,
          prompt: `Eigenvalues ${ls.join(", ")}. What's the fewest components that keep at least ${target * 100}% of the variance?`,
          explain: `Total ${total}; cumulative ${ls.map((_, i) => ls.slice(0, i + 1).reduce((s, x) => s + x, 0)).join(", ")}. ${k} components reach ${r2((acc / total) * 100)}%.`,
        };
      },
    },
  ],

  // ---------- Statistics ----------
  probability: [
    {
      type: "real-world",
      make: (r, L) => {
        const sum = r.int(L === 1 ? 6 : 2, L === 1 ? 8 : 12);
        let ways = 0;
        for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === sum) ways++;
        return {
          kind: "number", id: "", answer: ways / 36,
          prompt: `Roll two fair dice. What is P(the total is ${sum})? (A fraction like 5/36 is fine.)`,
          explain: `${ways} of the 36 equally likely pairs add to ${sum}.`,
        };
      },
    },
    {
      type: "error",
      make: (r) => {
        const n = r.int(3, 6);
        return mcNumbers(
          `A fair coin landed heads ${n} times in a row. Jo says tails is now more likely. Is Jo right?`,
          { text: "No: it's still 1/2", why: "Each flip is independent of the last." },
          [{ text: "Yes: it's due", why: "The coin has no memory.", misconception: "gamblers-fallacy" }],
        );
      },
    },
  ],
  expectation: [
    {
      type: "real-world",
      make: (r, L) => {
        const cost = r.int(1, 5);
        const prize = r.pick([10, 20, 50, 100]);
        const p = r.pick(L === 1 ? [0.1, 0.2, 0.5] : [0.05, 0.02, 0.25, 0.04]);
        const e = r2(prize * p - cost);
        return mcNumbers(
          `A game costs $${cost} to play and pays $${prize} with probability ${p}. Expected profit per game?`,
          { text: `$${e}`, why: `${prize} × ${p} − ${cost} = ${e}.` },
          [
            { text: `$${prize - cost}`, why: "You only win with probability " + p + ".", misconception: "ignore-probabilities" },
            { text: `$${r2(prize * p)}`, why: "Subtract the cost of playing." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const sides = r.pick([4, 6, 8, 10, 20]);
        const e = (sides + 1) / 2;
        return mcNumbers(
          `A fair ${sides}-sided die has expected value ${e}. What does that mean?`,
          { text: `Over many rolls, the average settles near ${e}`, why: "Expectation is a long-run average." },
          [{ text: `The next roll will probably be ${e}`, why: Number.isInteger(e) ? "Every face is equally likely." : `You can't even roll ${e}.`, misconception: "must-be-outcome" }],
        );
      },
    },
  ],
  "conditional-probability": [
    {
      type: "real-world",
      make: (r, L) => {
        const n = r.pick([100, 200, 400]);
        const b = r.int(2, 8) * (n / 20);
        const ab = r.int(1, b / (n / 20) - 1) * (n / 20);
        const a = ab + r.int(1, 5) * (n / 20);
        const which = L >= 2 && r.next() < 0.5;
        return mcNumbers(
          `In a group of ${n} people, ${b} drink coffee, ${a} are night owls, and ${ab} are both. What is P(${which ? "coffee | night owl" : "night owl | coffee"})?`,
          which ? { text: String(r2(ab / a)), why: `${ab} of the ${a} night owls.` } : { text: String(r2(ab / b)), why: `${ab} of the ${b} coffee drinkers.` },
          [
            { text: String(r2(ab / n)), why: "That's P(both). Shrink the world to the given group.", misconception: "joint-not-conditional" },
            { text: String(r2(which ? ab / b : ab / a)), why: "That's the condition flipped.", misconception: "flipped-conditional" },
          ],
        );
      },
    },
  ],
  bayes: [
    {
      type: "interpret",
      make: (r) => {
        const up = r.next() < 0.5;
        return mcNumbers(
          `The same test is used where the disease is ${up ? "far more" : "far less"} common. P(sick | positive) becomes:`,
          { text: up ? "Higher" : "Lower", why: up ? "More true positives compared with false alarms." : "False alarms make up more of the positives." },
          [{ text: "The same: it's the same test", why: "The base rate changes the answer.", misconception: "base-rate-neglect" }],
        );
      },
    },
  ],
  variance: [
    {
      type: "interpret",
      make: (r) => {
        const c = r.int(2, 20);
        const k = r.pick([2, 3, 10]);
        const add = r.next() < 0.5;
        return add
          ? mcNumbers(`Add ${c} to every value in a dataset. What happens to the variance?`, { text: "Unchanged", why: "Every value moves together; spread is the same." }, [
              { text: `It goes up by ${c}`, why: "Shifting doesn't spread things out." },
              { text: `It goes up by ${c * c}`, why: "Shifting doesn't spread things out." },
            ])
          : mcNumbers(`Multiply every value by ${k}. What happens to the variance?`, { text: `×${k * k}`, why: `Deviations scale by ${k}, squared deviations by ${k * k}.` }, [
              { text: `×${k}`, why: "That's what happens to the standard deviation.", misconception: "var-is-std" },
              { text: "Unchanged", why: "The spread grows." },
            ]);
      },
    },
    {
      type: "reverse",
      make: (r) => {
        const s = r.int(2, 12);
        return mcNumbers(`A variance is ${s * s}. What is the standard deviation?`, { text: String(s), why: `√${s * s}.` }, [
          { text: String(s * s), why: "That's the variance itself.", misconception: "var-is-std" },
          { text: String(r2((s * s) / 2)), why: "Take the square root, not half." },
        ]);
      },
    },
  ],
  covariance: [
    {
      type: "interpret",
      make: (r) => {
        const cases = [
          { text: "hours studied and exam score", sign: "Positive" },
          { text: "outside temperature and heating bill", sign: "Negative" },
          { text: "price of a used car and its mileage", sign: "Negative" },
          { text: "height and shoe size", sign: "Positive" },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(`What sign would you expect for the covariance of ${c.text}?`, { text: c.sign, why: c.sign === "Positive" ? "They rise together." : "One rises as the other falls." }, [
          { text: c.sign === "Positive" ? "Negative" : "Positive", why: "Think about whether they move together." },
          { text: "Zero", why: "They clearly move together (or against each other)." },
        ]);
      },
    },
  ],
  normal: [
    {
      type: "reverse",
      make: (r, L) => {
        const mu = r.int(4, 20) * 5;
        const s = r.pick([2, 4, 5, 10]);
        const z = r.pick(L === 1 ? [1, 2, -1] : [-1.5, 2.5, -2, 0.5, 3]);
        return {
          kind: "number", id: "", answer: mu + z * s,
          prompt: `μ = ${mu} and σ = ${s}. Which value has z-score ${z}?`,
          explain: `x = μ + zσ = ${mu} + ${par(z)}·${s} = ${mu + z * s}.`,
        };
      },
    },
    {
      type: "real-world",
      make: (r) => {
        const mu = r.int(15, 40) * 5;
        const s = r.pick([5, 10, 15]);
        const k = r.pick([1, 2]);
        return mcNumbers(
          `Delivery times are roughly normal with mean ${mu} and σ = ${s} minutes. About what percent take between ${mu - k * s} and ${mu + k * s} minutes?`,
          { text: k === 1 ? "68%" : "95%", why: `That's within ${k}σ.` },
          [{ text: k === 1 ? "95%" : "68%", why: `${k === 1 ? "95% is within 2σ" : "68% is within 1σ"}.`, misconception: "rule-mixup" }, { text: "50%", why: "More than half lie within 1σ." }],
        );
      },
    },
  ],
  mle: [
    {
      type: "error",
      make: (r) => {
        const n = r.pick([20, 50, 100]);
        const k = r.int(Math.round(n * 0.6), Math.round(n * 0.9));
        return mcNumbers(
          `A coin lands heads ${k} times in ${n} flips. Sam estimates p = 0.5 "because coins are fair". What's the maximum-likelihood estimate?`,
          { text: String(r2(k / n)), why: "k / n: the data, not the expectation." },
          [{ text: "0.5", why: "That's a prior belief, not what the data says.", misconception: "mle-is-fair" }],
        );
      },
    },
  ],
  "least-squares": [
    {
      type: "real-world",
      make: (r, L) => {
        const w = r.pick([1.5, 2, 3, 0.5, 4]);
        const b = r.int(-5, 20);
        const x = r.int(1, 5 * L);
        return {
          kind: "number", id: "", answer: w * x + b,
          prompt: `A fitted line predicts price (thousands) from size (tens of m²): ŷ = ${w}x ${sgn(b)} ${abs(b)}. Predict the price at x = ${x}.`,
          explain: `${w} × ${x} ${sgn(b)} ${abs(b)} = ${w * x + b}.`,
        };
      },
    },
    {
      type: "compute",
      make: (r, L) => {
        const xbar = r.int(1, 5 * L);
        const w = r.nonzero(-3, 3);
        const b = r.int(-5, 5);
        const ybar = w * xbar + b;
        return {
          kind: "number", id: "", answer: b,
          prompt: `x̄ = ${xbar}, ȳ = ${ybar} and the least-squares slope is ${w}. What is the intercept?`,
          explain: `b = ȳ − w x̄ = ${ybar} − ${par(w)}·${xbar} = ${b}.`,
        };
      },
    },
  ],

  // ---------- Calculus ----------
  derivative: [
    {
      type: "compute",
      make: (r, L) => {
        const c = r.nonzero(-L * 2, L * 3);
        const a = r.int(-span(L), span(L));
        return {
          kind: "number", id: "", answer: 2 * c * a,
          prompt: `f(x) = ${c}x². What is f′(${a})?`,
          explain: `f′(x) = ${2 * c}x, so f′(${a}) = ${2 * c * a}.`,
        };
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const d = r.nonzero(-5, 5);
        return mcNumbers(`At x = 2, f(2) = ${r.int(-9, 9)} and f′(2) = ${d}. What is f doing at x = 2?`, { text: d > 0 ? "Increasing" : "Decreasing", why: "The derivative's sign gives the direction." }, [
          { text: d > 0 ? "Decreasing" : "Increasing", why: "Check the sign of f′." },
          { text: "It depends on the sign of f(2)", why: "Height doesn't say which way it's moving.", misconception: "derivative-is-value" },
        ]);
      },
    },
  ],
  "chain-rule": [
    {
      type: "compute",
      make: (r, L) => {
        const g1 = r.int(-3, 3);
        const dg = r.nonzero(-span(L), span(L));
        const df = r.nonzero(-span(L), span(L));
        return {
          kind: "number", id: "", answer: df * dg,
          prompt: `h(x) = f(g(x)). At x = 1: g(1) = ${g1}, g′(1) = ${dg}, and f′(${g1}) = ${df}. What is h′(1)?`,
          explain: `f′(g(1)) · g′(1) = ${par(df)} · ${par(dg)} = ${df * dg}.`,
        };
      },
    },
    {
      type: "error",
      make: (r) => {
        const a = r.nonzero(2, 6);
        const n = r.int(2, 5);
        return mcNumbers(
          `Pat says the derivative of $(${a}x + 1)^{${n}}$ is $${n}(${a}x + 1)^{${n - 1}}$. What's missing?`,
          { text: `A factor of ${a}, from the inside`, why: "Chain rule: multiply by the inner derivative." },
          [{ text: "Nothing", why: `The inside changes ${a}× as fast as x.`, misconception: "forget-inner" }],
        );
      },
    },
  ],
  "gradient-descent": [
    {
      type: "compute",
      make: (r, L) => {
        const eta = r.pick(L === 1 ? [0.5, 0.25] : [0.1, 0.25, 0.05]);
        const p = [r.int(-span(L), span(L)), r.int(-span(L), span(L))];
        const g = [2 * p[0], 2 * p[1]];
        const next = [r2(p[0] - eta * g[0]), r2(p[1] - eta * g[1])];
        const up = [r2(p[0] + eta * g[0]), r2(p[1] + eta * g[1])];
        return {
          kind: "vector", id: "", answer: next,
          prompt: `L(x, y) = x² + y². From (${p[0]}, ${p[1]}) with η = ${eta}, where does one gradient-descent step go?`,
          explain: `$\\nabla L = ${v(g[0], g[1])}$; step to $${v(next[0], next[1])}$.`,
          traps: same(up, next) ? [] : [{ answer: up, misconception: "plus-gradient", message: "That stepped uphill: subtract η∇L." }],
        };
      },
    },
    {
      type: "interpret",
      make: () =>
        mcNumbers(
          "Training loss jumps up and down wildly and sometimes explodes. What's the most likely fix?",
          { text: "Lower the learning rate", why: "Steps are overshooting the minimum." },
          [{ text: "Raise the learning rate to get there faster", why: "Bigger steps overshoot even more.", misconception: "bigger-lr-faster" }],
        ),
    },
  ],

  // ---------- Neural networks ----------
  neuron: [
    {
      type: "real-world",
      make: (r, L) => {
        const inc = r.int(2, 9);
        const debt = r.int(0, 6);
        const wi = r.pick([1, 2]);
        const wd = r.pick([-1, -2, -3]);
        const b = r.int(-6, 0) - (L - 1) * 2;
        const z = wi * inc + wd * debt + b;
        return {
          kind: "number", id: "", answer: Math.max(0, z),
          prompt: `A loan-scoring neuron weighs income (in $10k) by ${wi} and debt (in $10k) by ${wd}, with bias ${b}, then applies ReLU. Income ${inc}, debt ${debt}. Its output?`,
          explain: `z = ${wi}·${inc} + ${par(wd)}·${debt} + ${par(b)} = ${z}; ReLU gives ${Math.max(0, z)}.`,
        };
      },
    },
  ],
  layer: [
    {
      type: "compute",
      make: (r, L) => {
        const s = span(L);
        const W = [[r.int(-3, 3), r.int(-3, 3)], [r.int(-3, 3), r.int(-3, 3)]];
        const x = [r.int(-s, s), r.int(-s, s)];
        const b = [r.int(-3, 3), r.int(-3, 3)];
        const z = [W[0][0] * x[0] + W[0][1] * x[1] + b[0], W[1][0] * x[0] + W[1][1] * x[1] + b[1]];
        const out = z.map((t) => Math.max(0, t));
        return {
          kind: "vector", id: "", answer: out,
          prompt: `$W = ${m(W[0][0], W[0][1], W[1][0], W[1][1])}$, $\\vec x = ${v(x[0], x[1])}$, $\\vec b = ${v(b[0], b[1])}$, then ReLU. What does the layer output?`,
          explain: `$\\vec z = ${v(z[0], z[1])}$; ReLU: $${v(out[0], out[1])}$.`,
          traps: sameM([z], [out]) ? [] : [{ answer: z, misconception: "forgot-activation", message: "Apply the ReLU." }],
        };
      },
    },
  ],
  backprop: [
    {
      type: "compute",
      make: (r, L) => {
        const x = r.nonzero(-2, 2);
        const w1 = r.nonzero(-2, 2);
        const w2 = r.nonzero(-3, 3);
        const y = r.int(-4, 4) * L;
        const h = w1 * x;
        const yhat = w2 * h;
        const dy = 2 * (yhat - y);
        return {
          kind: "number", id: "", answer: dy * w2 * x,
          prompt: `Two layers: h = w₁x, ŷ = w₂h, L = (ŷ − y)². With x = ${x}, w₁ = ${w1}, w₂ = ${w2}, y = ${y}, what is ∂L/∂w₁?`,
          explain: `h = ${h}, ŷ = ${yhat}, ∂L/∂ŷ = ${dy}; back through w₂ (×${w2}) and x (×${x}): ${dy * w2 * x}.`,
        };
      },
    },
  ],
};

/** All templates for a concept: the original compute generators first, then the extra kinds. */
export function templatesFor(nodeId: string): Template[] {
  const base: Template[] = (GENERATORS[nodeId] ?? []).map((g) => ({ type: "compute" as const, make: (r: Rng) => g(r) }));
  return [...base, ...(EXTRA[nodeId] ?? [])];
}

export function generatedId(nodeId: string, template: number, level: Level, seed: number) {
  return `gen~${nodeId}~${template}~${level}~${seed}`;
}

/** Rebuild a generated item from its id. Same id, same question. */
export function fromGeneratedId(id: string): { nodeId: string; item: Item; template: number; level: Level; type: TemplateType } | null {
  const parts = id.split("~");
  if (parts[0] !== "gen" || !parts[1]) return null;
  const [, nodeId, t, a, b] = parts;
  const level = (parts.length === 5 ? Number(a) : 1) as Level;
  const seed = Number(parts.length === 5 ? b : a);
  const template = Number(t);
  const tpl = templatesFor(nodeId)[template];
  if (!tpl || !Number.isInteger(seed) || ![1, 2, 3].includes(level)) return null;
  const item = { ...tpl.make(rng(seed), level), id, tag: TYPE_LABEL[tpl.type] };
  return { nodeId, item, template, level, type: tpl.type };
}

/** A fresh question. Pick a template (or let the seed choose) at a level. */
export function generate(nodeId: string, seed: number, opts: { template?: number; level?: Level } = {}): Item | null {
  const tpls = templatesFor(nodeId);
  if (!tpls.length) return null;
  const template = opts.template ?? seed % tpls.length;
  return fromGeneratedId(generatedId(nodeId, template, opts.level ?? 1, seed))?.item ?? null;
}

/** Parse just the template/level of a generated id (for adaptive practice). */
export function parseGeneratedId(id: string): { template: number; level: Level } | null {
  const parts = id.split("~");
  if (parts[0] !== "gen") return null;
  return { template: Number(parts[2]), level: (parts.length === 5 ? Number(parts[3]) : 1) as Level };
}
