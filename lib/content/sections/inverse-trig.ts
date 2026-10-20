import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Inverse trigonometric functions: principal-value branches, domains and ranges, compositions such as sin⁻¹(sin x), identities (sin⁻¹x + cos⁻¹x = π/2, negatives, sums of inverse tangents), and equations. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** sin⁻¹(sin x) for x in radians. */
const asinSin = (x: number) => Math.asin(Math.sin(x));
const acosCos = (x: number) => Math.acos(Math.cos(x));

const base: ConceptNode = {
  id: "inverse-trig",
  title: "Inverse trigonometric functions",
  summary: "Sine, cosine and tangent aren't one-one, so to invert them we restrict each to a principal branch: sin⁻¹ returns angles in [−π/2, π/2], cos⁻¹ in [0, π], tan⁻¹ in (−π/2, π/2). Then sin⁻¹(sin x) equals x only when x lies in that branch; elsewhere it gives the branch angle with the same sine. A handful of identities, such as sin⁻¹x + cos⁻¹x = π/2, handle most exam problems.",
  deps: ["trig-equations", "composition-inverse"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "principal value", meaning: "The unique output of an inverse trig function in its chosen range, such as $\\sin^{-1}x \\in [-\\tfrac\\pi2, \\tfrac\\pi2]$." },
    { term: "arcsin", meaning: "Another name for $\\sin^{-1}$; not the reciprocal $1/\\sin x$, which is $\\csc x$." },
    { term: "branch", meaning: "The restricted domain on which a trig function is one-one, chosen to define its inverse." },
  ],
  misconceptions: {
    "inverse-cancels": "Assumes $\\sin^{-1}(\\sin x) = x$ for every $x$.",
    "inverse-trig-reciprocal": "Reads $\\sin^{-1}x$ as $\\dfrac{1}{\\sin x}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Which angle?",
      body: "A ramp rises 1 m over a 2 m slope: what angle is it? $\\sin\\theta = \\tfrac12$ has infinitely many solutions, but the question wants one answer, 30°. Inverse trig functions choose a standard answer for every ratio. JEE then asks what happens when you compose them with trig functions outside the standard range, which is where most errors happen.",
      realWorld: {
        title: "Robot arms",
        body: "Inverse kinematics finds the joint angles a robot arm needs to reach a point; it uses $\\tan^{-1}$ (in its two-argument form, atan2, which also picks the right quadrant) and $\\cos^{-1}$ from the cosine rule.",
      },
    },
    {
      type: "truth",
      statement: "$\\sin^{-1} : [-1, 1] \\to [-\\tfrac\\pi2, \\tfrac\\pi2]$, $\\cos^{-1} : [-1, 1] \\to [0, \\pi]$, $\\tan^{-1} : \\mathbb R \\to (-\\tfrac\\pi2, \\tfrac\\pi2)$. Always $\\sin(\\sin^{-1}x) = x$ for $x \\in [-1, 1]$, but $\\sin^{-1}(\\sin x) = x$ **only for** $x \\in [-\\tfrac\\pi2, \\tfrac\\pi2]$ (and $\\cos^{-1}(\\cos x) = x$ only for $x \\in [0, \\pi]$). Key identities: $\\sin^{-1}x + \\cos^{-1}x = \\tfrac\\pi2$; $\\tan^{-1}x + \\cot^{-1}x = \\tfrac\\pi2$; $\\sin^{-1}(-x) = -\\sin^{-1}x$; $\\cos^{-1}(-x) = \\pi - \\cos^{-1}x$; $\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\dfrac{x + y}{1 - xy}$ when $xy < 1$.",
      body: "To evaluate $\\sin^{-1}(\\sin x)$ for $x$ outside the branch, find the angle in $[-\\tfrac\\pi2, \\tfrac\\pi2]$ with the same sine: for $x = \\tfrac{2\\pi}3$, $\\sin\\tfrac{2\\pi}3 = \\sin\\tfrac\\pi3$, so the answer is $\\tfrac\\pi3$. When $xy > 1$ with $x, y > 0$, add $\\pi$: $\\tan^{-1}x + \\tan^{-1}y = \\pi + \\tan^{-1}\\dfrac{x + y}{1 - xy}$. Also $2\\tan^{-1}x = \\sin^{-1}\\dfrac{2x}{1 + x^2}$ for $\\lvert x\\rvert \\le 1$, and $\\sin(\\cos^{-1}x) = \\sqrt{1 - x^2}$. Draw a right triangle to turn compositions like $\\tan(\\sin^{-1}\\tfrac35)$ into ratios: $\\tfrac34$.",
    },
    {
      type: "predict",
      misconception: "inverse-cancels",
      item: {
        kind: "mc",
        id: "itr-predict-1",
        prompt: "$\\sin^{-1}\\left(\\sin\\tfrac{2\\pi}3\\right)$ equals",
        options: [
          { id: "a", text: "$\\tfrac\\pi3$", correct: true, why: "The branch angle with the same sine." },
          { id: "b", text: "$\\tfrac{2\\pi}3$", misconception: "inverse-cancels", why: "$\\tfrac{2\\pi}3$ is outside $[-\\tfrac\\pi2, \\tfrac\\pi2]$." },
          { id: "c", text: "$-\\tfrac\\pi3$", why: "The sine is positive." },
        ],
      },
      reveal: {
        body: "$\\sin\\tfrac{2\\pi}3 = \\tfrac{\\sqrt3}2$, and $\\sin^{-1}$ must return an angle in $[-\\tfrac\\pi2, \\tfrac\\pi2]$: that angle is $\\tfrac\\pi3$. The inverse function only undoes sine on the branch it was built from. Similarly $\\cos^{-1}(\\cos\\tfrac{5\\pi}4) = \\tfrac{3\\pi}4$, since $\\cos^{-1}$ returns angles in $[0, \\pi]$.",
      },
      resolve: {
        kind: "mc",
        id: "itr-resolve-1",
        prompt: "$\\cos^{-1}(\\cos 2\\pi)$ equals",
        options: [
          { id: "a", text: "0", correct: true, why: "$\\cos 2\\pi = 1$ and $\\cos^{-1}1 = 0$." },
          { id: "b", text: "$2\\pi$", misconception: "inverse-cancels", why: "$\\cos^{-1}$ returns values in $[0, \\pi]$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "itr-check-1",
        prompt: "$\\sin^{-1}\\tfrac12$ equals",
        options: [
          { id: "a", text: "$\\tfrac\\pi6$", correct: true, why: "The angle in $[-\\tfrac\\pi2, \\tfrac\\pi2]$ whose sine is $\\tfrac12$." },
          { id: "b", text: "$\\dfrac{1}{\\sin\\tfrac12}$", misconception: "inverse-trig-reciprocal", why: "The $-1$ means inverse function, not reciprocal." },
          { id: "c", text: "$\\tfrac{5\\pi}6$", why: "Outside the principal range." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "itr-check-2",
        prompt: "$\\tan^{-1}\\tfrac12 + \\tan^{-1}\\tfrac13$ equals",
        options: [
          { id: "a", text: "$\\tfrac\\pi4$", correct: true, why: "$\\tan^{-1}\\dfrac{5/6}{1 - 1/6} = \\tan^{-1}1$." },
          { id: "b", text: "$\\tan^{-1}\\tfrac56$", why: "Use the addition formula." },
          { id: "c", text: "$\\tfrac\\pi2$", why: "That would need $xy = 1$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The two-argument arctangent (atan2) recovers angles from $(\\cos, \\sin)$ encodings of cyclical features and from complex-valued outputs. Arc-cosine of a cosine similarity gives the angle between embedding vectors, a true distance on the sphere.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "itr-produce-1", prompt: "Evaluate $\\cos^{-1}(-\\tfrac12)$ divided by $\\pi$, to 3 decimals.", answer: Math.round((2 / 3) * 1000) / 1000, tolerance: 0.001, explain: "$\\pi - \\tfrac\\pi3 = \\tfrac{2\\pi}3$." },
        { kind: "number", id: "itr-produce-2", prompt: "Evaluate $\\tan\\left(\\sin^{-1}\\tfrac35\\right)$.", answer: 0.75, explain: "Triangle 3, 4, 5." },
        {
          kind: "mc",
          id: "itr-produce-3",
          prompt: "$\\sin^{-1}(\\sin\\tfrac{3\\pi}4)$ equals",
          options: [
            { id: "a", text: "$\\tfrac\\pi4$", correct: true, why: "Same sine, inside the branch." },
            { id: "b", text: "$\\tfrac{3\\pi}4$", misconception: "inverse-cancels", why: "Outside $[-\\tfrac\\pi2, \\tfrac\\pi2]$." },
          ],
        },
        {
          kind: "mc",
          id: "itr-produce-4",
          prompt: "$\\cos^{-1}0$ equals",
          options: [
            { id: "a", text: "$\\tfrac\\pi2$", correct: true, why: "$\\cos\\tfrac\\pi2 = 0$." },
            { id: "b", text: "$\\dfrac{1}{\\cos 0} = 1$", misconception: "inverse-trig-reciprocal", why: "That is the reciprocal $\\sec 0$, not the inverse function." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "itr-review-1", prompt: "Evaluate $\\sin^{-1}x + \\cos^{-1}x$ for $x = 0.3$, divided by $\\pi$.", answer: 0.5, explain: "Always $\\tfrac\\pi2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the other three",
      body: "$\\cot^{-1} : \\mathbb R \\to (0, \\pi)$; $\\sec^{-1} : (-\\infty, -1] \\cup [1, \\infty) \\to [0, \\pi] \\setminus \\{\\tfrac\\pi2\\}$; $\\csc^{-1} : (-\\infty, -1] \\cup [1, \\infty) \\to [-\\tfrac\\pi2, \\tfrac\\pi2] \\setminus \\{0\\}$. And $\\sec^{-1}x = \\cos^{-1}\\tfrac1x$, $\\csc^{-1}x = \\sin^{-1}\\tfrac1x$.",
    },
    {
      type: "definition",
      term: "graphs of sin⁻¹(sin x)",
      body: "$y = \\sin^{-1}(\\sin x)$ is a zigzag: it equals $x$ on $[-\\tfrac\\pi2, \\tfrac\\pi2]$, $\\pi - x$ on $[\\tfrac\\pi2, \\tfrac{3\\pi}2]$, $x - 2\\pi$ on $[\\tfrac{3\\pi}2, \\tfrac{5\\pi}2]$, and so on, with period $2\\pi$. Similarly $\\cos^{-1}(\\cos x)$ equals $x$ on $[0, \\pi]$ and $2\\pi - x$ on $[\\pi, 2\\pi]$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "complementary inverses",
      statement: "$\\sin^{-1}x + \\cos^{-1}x = \\tfrac\\pi2$ for all $x \\in [-1, 1]$.",
      proof: ["Let $\\theta = \\sin^{-1}x \\in [-\\tfrac\\pi2, \\tfrac\\pi2]$. Then $\\cos(\\tfrac\\pi2 - \\theta) = \\sin\\theta = x$ and $\\tfrac\\pi2 - \\theta \\in [0, \\pi]$, so $\\cos^{-1}x = \\tfrac\\pi2 - \\theta$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "sum of inverse tangents",
      statement: "For $xy < 1$: $\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\dfrac{x + y}{1 - xy}$. For $x, y > 0$ with $xy > 1$, add $\\pi$.",
      proof: ["Let $\\alpha = \\tan^{-1}x$, $\\beta = \\tan^{-1}y$; then $\\tan(\\alpha + \\beta) = \\dfrac{x + y}{1 - xy}$ (§{trig-identities}). If $xy < 1$, $\\alpha + \\beta \\in (-\\tfrac\\pi2, \\tfrac\\pi2)$, the principal range; otherwise it lies beyond and $\\pi$ must be added."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "negatives",
      statement: "$\\sin^{-1}(-x) = -\\sin^{-1}x$, $\\tan^{-1}(-x) = -\\tan^{-1}x$, but $\\cos^{-1}(-x) = \\pi - \\cos^{-1}x$.",
      proof: ["$\\sin$ and $\\tan$ are odd on their branches; for cosine, $\\cos(\\pi - \\theta) = -\\cos\\theta$ and $\\pi - \\theta$ stays in $[0, \\pi]$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Evaluate $\\cos^{-1}(-\\tfrac{\\sqrt3}2)$ and $\\tan^{-1}(-1)$.",
      solution: ["$\\cos^{-1}(-\\tfrac{\\sqrt3}2) = \\pi - \\tfrac\\pi6 = \\tfrac{5\\pi}6$.", "$\\tan^{-1}(-1) = -\\tfrac\\pi4$."],
      result: "$\\tfrac{5\\pi}6$ and $-\\tfrac\\pi4$.",
    },
    {
      type: "example",
      level: 2,
      title: "a composition",
      problem: "Find $\\cos^{-1}(\\cos\\tfrac{7\\pi}6)$.",
      solution: ["$\\tfrac{7\\pi}6 \\notin [0, \\pi]$; $\\cos\\tfrac{7\\pi}6 = \\cos(2\\pi - \\tfrac{7\\pi}6) = \\cos\\tfrac{5\\pi}6$.", "$\\tfrac{5\\pi}6 \\in [0, \\pi]$, so the answer is $\\tfrac{5\\pi}6$."],
      result: "$\\tfrac{5\\pi}6$.",
    },
    {
      type: "example",
      level: 3,
      title: "an equation",
      problem: "Solve $\\tan^{-1}2x + \\tan^{-1}3x = \\tfrac\\pi4$.",
      solution: ["$\\dfrac{5x}{1 - 6x^2} = 1$ gives $6x^2 + 5x - 1 = 0$, $x = \\tfrac16$ or $-1$.", "At $x = -1$ both inverse tangents are negative, so their sum can't be $\\tfrac\\pi4$; only $x = \\tfrac16$ works."],
      result: "$x = \\tfrac16$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\sin^{-1}(\\sin x) = x$ always.", right: "Only on $[-\\tfrac\\pi2, \\tfrac\\pi2]$; elsewhere find the branch angle." },
    { wrong: "$\\sin^{-1}x = 1/\\sin x$.", right: "It is the inverse function; $1/\\sin x = \\csc x$." },
    { wrong: "Use the inverse-tangent sum formula when $xy > 1$.", right: "Add $\\pi$ (for positive $x, y$)." },
  ],
  formulas: [
    { label: "Ranges", tex: "\\sin^{-1} \\in [-\\tfrac\\pi2, \\tfrac\\pi2],\\ \\cos^{-1} \\in [0, \\pi],\\ \\tan^{-1} \\in (-\\tfrac\\pi2, \\tfrac\\pi2)" },
    { label: "Complement", tex: "\\sin^{-1}x + \\cos^{-1}x = \\tfrac\\pi2" },
    { label: "Tangent sum", tex: "\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\tfrac{x + y}{1 - xy}\\ (xy < 1)" },
    { label: "Negative cosine", tex: "\\cos^{-1}(-x) = \\pi - \\cos^{-1}x" },
  ],
  exercises: [
    ex(1, dp("itrx-ex-1", "Evaluate $\\sin^{-1}(-\\tfrac12)$ divided by $\\pi$.", -1 / 6, "$-\\tfrac\\pi6$."), ["$-\\tfrac16 \\approx -0.167$."]),
    ex(1, num("itrx-ex-2", "Evaluate $\\tan^{-1}1$ divided by $\\pi$.", 0.25, "$\\tfrac\\pi4$."), ["$0.25$."]),
    ex(2, dp("itrx-ex-3", "Evaluate $\\sin^{-1}(\\sin\\tfrac{5\\pi}6)$ divided by $\\pi$.", asinSin((5 * Math.PI) / 6) / Math.PI, "Same sine as $\\tfrac\\pi6$."), ["$\\tfrac16 \\approx 0.167$."]),
    ex(2, dp("itrx-ex-4", "Evaluate $\\cos^{-1}(\\cos\\tfrac{7\\pi}6)$ divided by $\\pi$.", acosCos((7 * Math.PI) / 6) / Math.PI, "Same cosine as $\\tfrac{5\\pi}6$."), ["$\\tfrac56 \\approx 0.833$."]),
    ex(2, num("itrx-ex-5", "Evaluate $\\cos\\left(\\tan^{-1}\\tfrac34\\right)$.", 0.8, "Triangle 3, 4, 5."), ["$0.8$."]),
    ex(3, dp("itrx-ex-6", "Evaluate $\\tan^{-1}2 + \\tan^{-1}3$ divided by $\\pi$.", (Math.atan(2) + Math.atan(3)) / Math.PI, "$xy > 1$: add $\\pi$ to $\\tan^{-1}(-1)$."), ["$\\pi - \\tfrac\\pi4 = \\tfrac{3\\pi}4$: $0.75$."]),
    ex(3, dp("itrx-ex-7", "Solve $\\tan^{-1}2x + \\tan^{-1}3x = \\tfrac\\pi4$.", 1 / 6, "Reject $x = -1$."), ["$x = \\tfrac16 \\approx 0.167$."]),
    ex(3, mc("itrx-ex-8", "$\\sin(\\cos^{-1}x)$ for $x \\in [-1, 1]$ equals", ["$\\sqrt{1 - x^2}$", "The angle lies in $[0, \\pi]$, where sine is non-negative."], [["$\\pm\\sqrt{1 - x^2}$", "The principal range fixes the sign."], ["$x$", "That would be $\\cos(\\cos^{-1}x)$."]]), ["Draw the triangle."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const fracPi = (k: number, d: number) => (k === 0 ? "0" : `${k < 0 ? "-" : ""}\\tfrac{${Math.abs(k) === 1 ? "" : Math.abs(k)}\\pi}{${d}}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const d = r.pick([3, 4, 6]);
      const k = r.int(-2 * d + 1, 2 * d - 1);
      const x = (k * Math.PI) / d;
      const fn = r.pick(["sin", "cos"] as const);
      const v = (fn === "sin" ? asinSin(x) : acosCos(x)) / Math.PI;
      return n(`Evaluate $\\${fn}^{-1}\\left(\\${fn} ${fracPi(k, d)}\\right)$ divided by $\\pi$ (3 decimals).`, Math.round(v * 1000) / 1000, `The angle in the principal range with the same ${fn === "sin" ? "sine" : "cosine"} is $${Math.round(v * 1000) / 1000}\\pi$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]] as const);
      const want = r.pick(["tan(sin", "cos(tan", "sin(cos"] as const);
      const [arg, v] = want === "tan(sin" ? [`\\sin^{-1}\\tfrac{${a}}{${c}}`, a / b] : want === "cos(tan" ? [`\\tan^{-1}\\tfrac{${a}}{${b}}`, b / c] : [`\\cos^{-1}\\tfrac{${b}}{${c}}`, a / c];
      const outer = want.slice(0, 3);
      return n(`Evaluate $\\${outer}\\left(${arg}\\right)$ (3 decimals).`, Math.round((v as number) * 1000) / 1000, `Use the right triangle with sides ${a}, ${b}, ${c}.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [x, y] = r.pick([[0.5, 1 / 3], [1, 2], [2, 3], [1 / 4, 3 / 5], [1, 3], [0.2, 0.25]] as const);
      const v = (Math.atan(x) + Math.atan(y)) / Math.PI;
      const show = (t: number) => (Number.isInteger(t) ? `${t}` : t === 0.5 ? "\\tfrac12" : t === 1 / 3 ? "\\tfrac13" : t === 0.25 ? "\\tfrac14" : t === 0.2 ? "\\tfrac15" : "\\tfrac35");
      return n(`Evaluate $\\tan^{-1}${show(x)} + \\tan^{-1}${show(y)}$ divided by $\\pi$ (3 decimals).`, Math.round(v * 1000) / 1000, x * y < 1 ? "$xy < 1$: use $\\tan^{-1}\\tfrac{x + y}{1 - xy}$." : "$xy > 1$: add $\\pi$ to $\\tan^{-1}\\tfrac{x + y}{1 - xy}$.", 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { q: "\\sin^{-1}(\\sin\\tfrac{5\\pi}{6})", right: "\\tfrac\\pi6", wrong: "\\tfrac{5\\pi}6" },
        { q: "\\cos^{-1}(\\cos\\tfrac{4\\pi}{3})", right: "\\tfrac{2\\pi}3", wrong: "\\tfrac{4\\pi}3" },
        { q: "\\tan^{-1}(\\tan\\tfrac{3\\pi}{4})", right: "-\\tfrac\\pi4", wrong: "\\tfrac{3\\pi}4" },
        { q: "\\sin^{-1}(\\sin\\tfrac{7\\pi}{6})", right: "-\\tfrac\\pi6", wrong: "\\tfrac{7\\pi}6" },
      ]);
      return mcNumbers(
        `$${v.q}$ equals`,
        { text: `$${v.right}$`, why: "The principal-range angle with the same value." },
        [{ text: `$${v.wrong}$`, why: "That angle is outside the principal range.", misconception: "inverse-cancels" }],
      );
    },
  },
];
