import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The hyperbola x²/a² − y²/b² = 1: transverse and conjugate axes, foci, eccentricity, directrices, latus rectum; the focal-difference property; asymptotes; conjugate and rectangular hyperbolas, xy = c²; parametric forms; tangents (point and slope forms) and normals; identifying a conic from its equation. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "hyperbola",
  title: "The hyperbola",
  summary: "A hyperbola is the set of points whose distances to two foci differ by a constant 2a. In standard position, x²/a² − y²/b² = 1, the foci are at (±c, 0) with c² = a² + b², so the eccentricity e = c/a exceeds 1. Far from the centre the curve hugs its asymptotes y = ±(b/a)x. When a = b the asymptotes are perpendicular: a rectangular hyperbola, which rotated becomes xy = c².",
  deps: ["ellipse"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "transverse axis", meaning: "The axis through the foci, of length $2a$ between the vertices; the conjugate axis has length $2b$." },
    { term: "asymptote", meaning: "A line the curve approaches without meeting as it runs to infinity; for $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ they are $y = \\pm\\dfrac bax$." },
    { term: "rectangular hyperbola", meaning: "A hyperbola with perpendicular asymptotes ($a = b$, $e = \\sqrt2$), such as $x^2 - y^2 = a^2$ or $xy = c^2$." },
  ],
  misconceptions: {
    "hyperbola-c-difference": "Uses the ellipse relation $c^2 = a^2 - b^2$ for a hyperbola, instead of $c^2 = a^2 + b^2$.",
    "asymptote-swap": "Writes the asymptotes of $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ as $y = \\pm\\dfrac abx$ instead of $y = \\pm\\dfrac bax$.",
  },
  steps: [
    {
      type: "motivate",
      title: "A constant difference",
      body: "Two microphones hear a gunshot at slightly different times; the difference fixes the difference in distances, which places the source on a hyperbola. The hyperbola is the conic with $e > 1$, two separate branches, and asymptotes that make sketching easy. In JEE it is the ellipse with one sign changed, and most errors come from carrying over the ellipse's formulas unchanged.",
      realWorld: {
        title: "Navigation by time difference",
        body: "Before GPS, the LORAN system let ships find their position from the difference in arrival times of radio pulses from two stations: each difference defines a hyperbola, and two pairs of stations give two hyperbolas that cross at the ship.",
      },
    },
    {
      type: "truth",
      statement: "$\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$: vertices $(\\pm a, 0)$, transverse axis $2a$, conjugate axis $2b$, foci $(\\pm c, 0)$ with $c^2 = a^2 + b^2$, eccentricity $e = \\dfrac ca > 1$ (so $b^2 = a^2(e^2 - 1)$), directrices $x = \\pm\\dfrac ae$, latus rectum $\\dfrac{2b^2}a$, $\\lvert PS - PS'\\rvert = 2a$, **asymptotes** $y = \\pm\\dfrac bax$. **Tangents**: at $(x_1, y_1)$, $\\dfrac{xx_1}{a^2} - \\dfrac{yy_1}{b^2} = 1$; of slope $m$, $y = mx \\pm \\sqrt{a^2m^2 - b^2}$ (needs $\\lvert m\\rvert > b/a$).",
      body: "Parametric form $(a\\sec\\theta, b\\tan\\theta)$. The **conjugate hyperbola** $-\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ has the same asymptotes, the axes swapped, and eccentricity $e'$ with $\\dfrac1{e^2} + \\dfrac1{e'^2} = 1$. The **rectangular hyperbola** $x^2 - y^2 = a^2$ has $e = \\sqrt2$; rotated by $45°$ it becomes $xy = c^2$, with points $\\left(ct, \\dfrac ct\\right)$ and the axes as asymptotes. Asymptotes come from replacing the 1 by 0: $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 0$. To classify a conic $Ax^2 + Cy^2 + \\dots = 0$ (no $xy$ term): $A = C$ circle, $AC > 0$ ellipse, $AC < 0$ hyperbola, one of them 0 a parabola (§{parabola}).",
    },
    {
      type: "predict",
      misconception: "hyperbola-c-difference",
      item: {
        kind: "mc",
        id: "hyb-predict-1",
        prompt: "The foci of $\\dfrac{x^2}{16} - \\dfrac{y^2}9 = 1$ are",
        options: [
          { id: "a", text: "$(\\pm5, 0)$", correct: true, why: "$c^2 = 16 + 9$." },
          { id: "b", text: "$(\\pm\\sqrt7, 0)$", misconception: "hyperbola-c-difference", why: "That is the ellipse relation; a hyperbola's foci lie beyond its vertices." },
          { id: "c", text: "$(\\pm4, 0)$", why: "Those are the vertices." },
        ],
      },
      reveal: {
        body: "A hyperbola's foci are outside its vertices: $c > a$, so $e > 1$. The relation is $c^2 = a^2 + b^2 = 16 + 9 = 25$, $c = 5$. With $c = \\sqrt7 < 4$ the foci would sit between the vertices, where no point of the curve is, which can't satisfy $\\lvert PS - PS'\\rvert = 2a$.",
      },
      resolve: {
        kind: "mc",
        id: "hyb-resolve-1",
        prompt: "The eccentricity of $\\dfrac{x^2}9 - \\dfrac{y^2}{16} = 1$ is",
        options: [
          { id: "a", text: "$\\tfrac53$", correct: true, why: "$c = \\sqrt{9 + 16} = 5$." },
          { id: "b", text: "$\\tfrac{\\sqrt7}3$", misconception: "hyperbola-c-difference", why: "A hyperbola has $e > 1$; add the squares." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hyb-check-1",
        prompt: "The asymptotes of $\\dfrac{x^2}9 - \\dfrac{y^2}4 = 1$ are",
        options: [
          { id: "a", text: "$y = \\pm\\tfrac23x$", correct: true, why: "$\\dfrac{x^2}9 = \\dfrac{y^2}4$ gives $y = \\pm\\tfrac23x$." },
          { id: "b", text: "$y = \\pm\\tfrac32x$", misconception: "asymptote-swap", why: "Solve $\\dfrac{x^2}{9} - \\dfrac{y^2}{4} = 0$ for $y$." },
          { id: "c", text: "$y = \\pm\\tfrac49x$", why: "Take square roots of the denominators." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hyb-check-2",
        prompt: "The eccentricity of $x^2 - y^2 = 4$ is",
        options: [
          { id: "a", text: "$\\sqrt2$", correct: true, why: "$a = b$, so $c^2 = 2a^2$." },
          { id: "b", text: "2", why: "$e = c/a = \\sqrt2$." },
          { id: "c", text: "1", why: "That would be a parabola." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Hyperbolic geometry, built on the hyperbola $x^2 - y^2 = 1$ and its higher-dimensional relatives, is used to embed tree-like data such as taxonomies with little distortion; the tanh activation is a ratio of hyperbolic functions, named because $(\\cosh t, \\sinh t)$ parametrises that hyperbola.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "hyb-produce-1", prompt: "$P$ is on $\\dfrac{x^2}{25} - \\dfrac{y^2}{11} = 1$ with foci $S, S'$. Find $\\lvert PS - PS'\\rvert$.", answer: 10, explain: "$2a$." },
        { kind: "number", id: "hyb-produce-2", prompt: "Find the length of the latus rectum of $\\dfrac{x^2}4 - \\dfrac{y^2}{12} = 1$.", answer: 12, explain: "$\\dfrac{2b^2}a = \\dfrac{24}2$." },
        {
          kind: "mc",
          id: "hyb-produce-3",
          prompt: "The foci of $\\dfrac{x^2}9 - \\dfrac{y^2}7 = 1$ are",
          options: [
            { id: "a", text: "$(\\pm4, 0)$", correct: true, why: "$c^2 = 9 + 7$." },
            { id: "b", text: "$(\\pm\\sqrt2, 0)$", misconception: "hyperbola-c-difference", why: "Add for a hyperbola." },
          ],
        },
        {
          kind: "mc",
          id: "hyb-produce-4",
          prompt: "The asymptotes of $\\dfrac{x^2}4 - \\dfrac{y^2}{25} = 1$ are",
          options: [
            { id: "a", text: "$y = \\pm\\tfrac52x$", correct: true, why: "$y = \\pm\\tfrac bax$." },
            { id: "b", text: "$y = \\pm\\tfrac25x$", misconception: "asymptote-swap", why: "The slope is $b/a$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "hyb-review-1", prompt: "A hyperbola has $a = 3$ and $b = 4$. Find $c$.", answer: 5, explain: "$\\sqrt{9 + 16}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the rectangular hyperbola xy = c²",
      body: "Rotating $x^2 - y^2 = 2c^2$ by $45°$ gives $xy = c^2$. Its asymptotes are the coordinate axes, its vertices $(c, c)$ and $(-c, -c)$, its foci $(c\\sqrt2, c\\sqrt2)$ and $(-c\\sqrt2, -c\\sqrt2)$, and its points are $\\left(ct, \\dfrac ct\\right)$. The tangent at $t$ is $x + t^2y = 2ct$.",
    },
    {
      type: "definition",
      term: "classifying conics",
      body: "By eccentricity: $e = 0$ circle, $0 < e < 1$ ellipse, $e = 1$ parabola, $e > 1$ hyperbola. By equation $Ax^2 + Cy^2 + Dx + Ey + F = 0$: $AC > 0$ ellipse (circle if $A = C$), $AC = 0$ parabola, $AC < 0$ hyperbola, allowing for degenerate cases (a point, a pair of lines, or nothing).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the focal difference",
      statement: "Every point of $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ has $\\lvert PS - PS'\\rvert = 2a$.",
      proof: ["As for the ellipse, but with $y^2 = \\dfrac{b^2x^2}{a^2} - b^2$ and $c^2 = a^2 + b^2$: $PS^2 = (x - c)^2 + y^2 = (ex - a)^2$.", "So $PS = \\lvert ex - a\\rvert$ and $PS' = \\lvert ex + a\\rvert$; on either branch these differ by $2a$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "asymptotes",
      statement: "As $x \\to \\infty$ on the hyperbola, $y - \\dfrac bax \\to 0$ on the upper half of the right branch.",
      proof: ["$y = \\dfrac ba\\sqrt{x^2 - a^2}$, so $\\dfrac bax - y = \\dfrac ba\\left(x - \\sqrt{x^2 - a^2}\\right) = \\dfrac ba \\cdot \\dfrac{a^2}{x + \\sqrt{x^2 - a^2}} \\to 0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "conjugate eccentricities",
      statement: "If $e$ and $e'$ are the eccentricities of a hyperbola and its conjugate, then $\\dfrac1{e^2} + \\dfrac1{e'^2} = 1$.",
      proof: ["$e^2 = \\dfrac{a^2 + b^2}{a^2}$ and $e'^2 = \\dfrac{a^2 + b^2}{b^2}$, so the reciprocals add to $\\dfrac{a^2 + b^2}{a^2 + b^2} = 1$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "For $\\dfrac{x^2}{16} - \\dfrac{y^2}9 = 1$ find $e$, the foci, the asymptotes and the latus rectum.",
      solution: ["$a = 4$, $b = 3$, $c = 5$, $e = \\tfrac54$; foci $(\\pm5, 0)$.", "Asymptotes $y = \\pm\\tfrac34x$; latus rectum $\\dfrac{2 \\times 9}4 = \\dfrac92$."],
      result: "$e = \\tfrac54$, $(\\pm5, 0)$, $y = \\pm\\tfrac34x$, $\\tfrac92$.",
    },
    {
      type: "example",
      level: 2,
      title: "from foci and vertices",
      problem: "Find the hyperbola with foci $(\\pm5, 0)$ and vertices $(\\pm3, 0)$.",
      solution: ["$c = 5$, $a = 3$, so $b^2 = c^2 - a^2 = 16$.", "$\\dfrac{x^2}9 - \\dfrac{y^2}{16} = 1$."],
      result: "$\\dfrac{x^2}9 - \\dfrac{y^2}{16} = 1$.",
    },
    {
      type: "example",
      level: 3,
      title: "tangents of given slope",
      problem: "Find the tangents to $\\dfrac{x^2}9 - \\dfrac{y^2}4 = 1$ with slope 2.",
      solution: ["$c^2 = a^2m^2 - b^2 = 36 - 4 = 32$; this is positive because $2 > \\tfrac23$.", "$y = 2x \\pm 4\\sqrt2$."],
      result: "$y = 2x \\pm 4\\sqrt2$.",
    },
  ],
  pitfalls: [
    { wrong: "$c^2 = a^2 - b^2$ for a hyperbola.", right: "$c^2 = a^2 + b^2$, so $e > 1$." },
    { wrong: "Asymptotes $y = \\pm\\dfrac abx$.", right: "$y = \\pm\\dfrac bax$: solve $\\dfrac{x^2}{a^2} = \\dfrac{y^2}{b^2}$." },
    { wrong: "Every slope has a tangent.", right: "Only $\\lvert m\\rvert > b/a$; slopes $\\pm b/a$ are the asymptotes'." },
  ],
  formulas: [
    { label: "Foci", tex: "c^2 = a^2 + b^2,\\ e = c/a > 1" },
    { label: "Asymptotes", tex: "y = \\pm\\tfrac bax" },
    { label: "Focal difference", tex: "\\lvert PS - PS'\\rvert = 2a" },
    { label: "Tangent", tex: "y = mx \\pm \\sqrt{a^2m^2 - b^2}" },
    { label: "Conjugate", tex: "\\tfrac1{e^2} + \\tfrac1{e'^2} = 1" },
  ],
  exercises: [
    ex(1, fr("hybx-ex-1", "Find the eccentricity of $\\dfrac{x^2}9 - \\dfrac{y^2}{16} = 1$.", 5 / 3, "$c = 5$, $a = 3$."), ["$\\tfrac53$."]),
    ex(1, num("hybx-ex-2", "Find the length of the transverse axis of $9x^2 - 16y^2 = 144$.", 8, "$\\dfrac{x^2}{16} - \\dfrac{y^2}9 = 1$."), ["$2a = 8$."]),
    ex(2, num("hybx-ex-3", "Find the distance between the foci of $\\dfrac{x^2}{16} - \\dfrac{y^2}9 = 1$.", 10, "$2c$."), ["$10$."]),
    ex(2, num("hybx-ex-4", "Find the length of the latus rectum of $\\dfrac{x^2}{16} - \\dfrac{y^2}9 = 1$.", 4.5, "$\\tfrac{18}4$."), ["$4.5$."]),
    ex(2, num("hybx-ex-5", "A hyperbola has foci $(\\pm5, 0)$ and vertices $(\\pm3, 0)$. Find $b^2$.", 16, "$25 - 9$."), ["$16$."]),
    ex(3, num("hybx-ex-6", "$y = 2x + c$ touches $\\dfrac{x^2}9 - \\dfrac{y^2}4 = 1$. Find $c^2$.", 32, "$a^2m^2 - b^2$."), ["$36 - 4 = 32$."]),
    ex(3, num("hybx-ex-7", "Find the acute angle, in degrees, between the asymptotes of $\\dfrac{x^2}3 - y^2 = 1$.", 60, "Slopes $\\pm\\tfrac1{\\sqrt3}$ make $\\pm30°$ with the axis."), ["$60°$."]),
    ex(3, mc("hybx-ex-8", "$e$ and $e'$ are the eccentricities of a hyperbola and its conjugate. Then $\\dfrac1{e^2} + \\dfrac1{e'^2}$ is", ["1", "$\\dfrac{a^2}{a^2 + b^2} + \\dfrac{b^2}{a^2 + b^2}$."], [["2", "Compute each reciprocal."], ["$e^2e'^2$", "That is a different expression."]]), ["Always 1."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const TRIPLES = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17], [7, 24, 25], [24, 7, 25]] as const;
const f = (p: number, q: number) => (q === 1 ? `${p}` : `\\tfrac{${p}}{${q}}`);
const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick(TRIPLES);
      const want = r.pick(["c", "e", "lr", "transverse"] as const);
      const v = want === "c" ? c : want === "e" ? c / a : want === "lr" ? (2 * b * b) / a : 2 * a;
      const q = want === "c" ? "the distance from the centre to a focus" : want === "e" ? "the eccentricity (3 decimals)" : want === "lr" ? "the length of the latus rectum (3 decimals)" : "the length of the transverse axis";
      return n(`For $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$, find ${q}.`, Math.round(v * 1000) / 1000, `$a = ${a}$, $b = ${b}$, $c = \\sqrt{${a * a} + ${b * b}} = ${c}$.`, want === "e" || want === "lr" ? 0.001 : undefined);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 5);
      const b = r.int(1, 5);
      let m = r.int(1, 4);
      if (a * m <= b) m = Math.ceil(b / a) + 1;
      const sgn = r.pick([1, -1]);
      return n(`$y = ${sgn * m === 1 ? "" : sgn * m === -1 ? "-" : sgn * m}x + c$ touches $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$. Find $c^2$.`, a * a * m * m - b * b, `$c^2 = a^2m^2 - b^2 = ${a * a}(${m * m}) - ${b * b}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      let a = r.int(1, 6);
      let b = r.int(1, 6);
      if (a === b) b += 1;
      const g = gcd(a, b);
      a /= g;
      b /= g;
      return mcNumbers(
        `The asymptotes of $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$ are`,
        { text: `$y = \\pm${f(b, a)}x$`, why: "Replace 1 by 0 and solve: slope $\\pm b/a$." },
        [{ text: `$y = \\pm${f(a, b)}x$`, why: "The slope is $b/a$, not $a/b$.", misconception: "asymptote-swap" }, { text: `$y = \\pm${f(b * b, a * a)}x$`, why: "Take square roots of the denominators." }],
      );
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b, c] = r.pick([[4, 3, 5], [12, 5, 13], [8, 6, 10], [15, 8, 17], [24, 7, 25]] as const);
      return mcNumbers(
        `The foci of $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$ are`,
        { text: `$(\\pm${c}, 0)$`, why: `$c^2 = ${a * a} + ${b * b}$.` },
        [{ text: `$(\\pm\\sqrt{${a * a - b * b}}, 0)$`, why: "For a hyperbola $c^2 = a^2 + b^2$.", misconception: "hyperbola-c-difference" }, { text: `$(\\pm${a}, 0)$`, why: "Those are the vertices." }],
      );
    },
  },
];
