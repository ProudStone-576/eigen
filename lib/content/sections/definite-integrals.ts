import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The definite integral as a limit of Riemann sums; the fundamental theorem of calculus (both parts); evaluation and substitution with changed limits; properties (reversal, additivity, f(a + b − x), even and odd functions, periodicity, modulus); Leibniz's rule for differentiating integrals; limits of sums as integrals. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "definite-integrals",
  title: "Definite integrals",
  summary: "The definite integral ∫ₐᵇ f(x) dx is the limit of sums of thin rectangles, the signed area under the curve. The fundamental theorem of calculus links it to antiderivatives: ∫ₐᵇ f = F(b) − F(a), and d/dx ∫ₐˣ f(t) dt = f(x). With a variable upper limit g(x), the chain rule adds a factor g′(x). Properties such as ∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx and the vanishing of odd functions over [−a, a] evaluate integrals that have no simple antiderivative.",
  deps: ["integration-techniques"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "Riemann sum", meaning: "$\\sum f(x_i^*)\\Delta x$, the total area of rectangles approximating the region under $y = f(x)$." },
    { term: "fundamental theorem", meaning: "Differentiation and integration undo each other: $\\dfrac{d}{dx}\\int_a^xf = f(x)$ and $\\int_a^bf = F(b) - F(a)$." },
    { term: "Leibniz rule", meaning: "$\\dfrac{d}{dx}\\int_{g(x)}^{h(x)}f(t)\\,dt = f(h(x))h'(x) - f(g(x))g'(x)$." },
  ],
  misconceptions: {
    "substitution-keep-limits": "After substituting $u = g(x)$ in a definite integral, keeps the original $x$-limits instead of changing them to $u$-limits.",
    "leibniz-no-chain": "Differentiates $\\int_a^{g(x)}f(t)\\,dt$ as $f(g(x))$, forgetting the factor $g'(x)$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Adding up infinitely many slices",
      body: "Distance is speed times time, when the speed is constant. When it varies, slice time into tiny pieces, multiply on each, and add: as the slices shrink the sum becomes an integral. The miracle of calculus is that this limit of sums can be computed from an antiderivative, and JEE adds a toolkit of properties that crack integrals no antiderivative reaches.",
      realWorld: {
        title: "Work and energy",
        body: "The work done stretching a spring from $a$ to $b$ is $\\int_a^b kx\\,dx = \\tfrac12k(b^2 - a^2)$: the force varies with $x$, so work is an integral, not a product. Engineers compute fuel use, flow volumes and charge the same way.",
      },
    },
    {
      type: "truth",
      statement: "$\\int_a^bf(x)\\,dx = \\lim_{n \\to \\infty}\\sum_{r=1}^n f(x_r)\\Delta x$ with $\\Delta x = \\dfrac{b - a}n$. **FTC**: if $f$ is continuous, $\\dfrac{d}{dx}\\int_a^xf(t)\\,dt = f(x)$, and $\\int_a^bf(x)\\,dx = F(b) - F(a)$ for any antiderivative $F$. **Leibniz**: $\\dfrac{d}{dx}\\int_{g(x)}^{h(x)}f(t)\\,dt = f(h(x))h'(x) - f(g(x))g'(x)$. **Substitution**: $\\int_a^bf(g(x))g'(x)\\,dx = \\int_{g(a)}^{g(b)}f(u)\\,du$, with new limits.",
      body: "**Properties**: $\\int_a^b = -\\int_b^a$; $\\int_a^b = \\int_a^c + \\int_c^b$; $\\int_a^bf(x)\\,dx = \\int_a^bf(a + b - x)\\,dx$ (so $\\int_0^af(x)\\,dx = \\int_0^af(a - x)\\,dx$); $\\int_{-a}^af = 2\\int_0^af$ if $f$ is even, $0$ if odd; $\\int_0^{2a}f = 2\\int_0^af$ if $f(2a - x) = f(x)$, $0$ if $f(2a - x) = -f(x)$; for period $T$, $\\int_0^{nT}f = n\\int_0^Tf$. For $\\lvert f\\rvert$ or $[x]$, split the interval where the expression changes. **Limit of a sum**: $\\lim_{n \\to \\infty}\\dfrac1n\\sum_{r=1}^nf\\left(\\dfrac rn\\right) = \\int_0^1f(x)\\,dx$. Area interpretation and areas between curves: §{area-under-curves}.",
    },
    {
      type: "predict",
      misconception: "leibniz-no-chain",
      item: {
        kind: "mc",
        id: "dfi-predict-1",
        prompt: "$\\dfrac{d}{dx}\\int_0^{x^2}\\sin t\\,dt$ is",
        options: [
          { id: "a", text: "$2x\\sin(x^2)$", correct: true, why: "FTC plus the chain rule on the upper limit $x^2$." },
          { id: "b", text: "$\\sin(x^2)$", misconception: "leibniz-no-chain", why: "The upper limit is $x^2$, which changes at rate $2x$." },
          { id: "c", text: "$\\sin x$", why: "Substitute the upper limit into the integrand." },
        ],
      },
      reveal: {
        body: "Let $G(u) = \\int_0^u\\sin t\\,dt$, so $G'(u) = \\sin u$. The expression is $G(x^2)$, and the chain rule gives $G'(x^2) \\cdot 2x = 2x\\sin(x^2)$. Check directly: $G(x^2) = 1 - \\cos(x^2)$, whose derivative is $2x\\sin(x^2)$.",
      },
      resolve: {
        kind: "mc",
        id: "dfi-resolve-1",
        prompt: "$\\dfrac{d}{dx}\\int_1^{3x}e^t\\,dt$ is",
        options: [
          { id: "a", text: "$3e^{3x}$", correct: true, why: "$e^{3x} \\cdot 3$." },
          { id: "b", text: "$e^{3x}$", misconception: "leibniz-no-chain", why: "Multiply by the derivative of the limit." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dfi-check-1",
        prompt: "With $u = x^2 + 1$, $\\int_0^2 2x(x^2 + 1)^3\\,dx$ becomes",
        options: [
          { id: "a", text: "$\\int_1^5u^3\\,du$", correct: true, why: "$x = 0 \\Rightarrow u = 1$; $x = 2 \\Rightarrow u = 5$." },
          { id: "b", text: "$\\int_0^2u^3\\,du$", misconception: "substitution-keep-limits", why: "The limits must be values of $u$, not of $x$." },
          { id: "c", text: "$\\int_1^5 2xu^3\\,du$", why: "The $2x\\,dx$ has become $du$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dfi-check-2",
        prompt: "$\\int_{-1}^1x^3\\,dx$ is",
        options: [
          { id: "a", text: "0", correct: true, why: "An odd function over a symmetric interval." },
          { id: "b", text: "$\\tfrac12$", why: "The left half cancels the right half." },
          { id: "c", text: "$\\tfrac14$", why: "$\\tfrac14 - \\tfrac14 = 0$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Expectations of continuous variables are definite integrals, $E[g(X)] = \\int g(x)f(x)\\,dx$ (§{expectation}); the area under the ROC curve is literally an integral (§{roc-auc}). Numerical integration by the trapezium rule is the Riemann-sum idea with a better slice shape.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dfi-produce-1", prompt: "Evaluate $\\int_0^2(3x^2 + 1)\\,dx$.", answer: 10, explain: "$[x^3 + x]_0^2 = 8 + 2$." },
        { kind: "number", id: "dfi-produce-2", prompt: "Evaluate $\\int_0^{\\pi/2}\\sin x\\,dx$.", answer: 1, explain: "$[-\\cos x]_0^{\\pi/2} = 0 + 1$." },
        {
          kind: "mc",
          id: "dfi-produce-3",
          prompt: "$\\int_1^2 2xe^{x^2}\\,dx$ with $u = x^2$ equals",
          options: [
            { id: "a", text: "$\\int_1^4e^u\\,du = e^4 - e$", correct: true, why: "$u$ runs from 1 to 4." },
            { id: "b", text: "$\\int_1^2e^u\\,du = e^2 - e$", misconception: "substitution-keep-limits", why: "At $x = 2$, $u = 4$." },
          ],
        },
        {
          kind: "mc",
          id: "dfi-produce-4",
          prompt: "$\\dfrac{d}{dx}\\int_0^{x^3}\\cos t\\,dt$ is",
          options: [
            { id: "a", text: "$3x^2\\cos(x^3)$", correct: true, why: "Chain rule on the limit." },
            { id: "b", text: "$\\cos(x^3)$", misconception: "leibniz-no-chain", why: "Multiply by $\\dfrac{d}{dx}x^3$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dfi-review-1", prompt: "Evaluate $\\int_1^3 2x\\,dx$.", answer: 8, explain: "$9 - 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the definite integral as a limit of sums",
      body: "Split $[a, b]$ into $n$ equal parts of width $h = \\dfrac{b - a}n$ and add $f(a + rh)h$: $\\int_a^bf = \\lim_{n \\to \\infty}h\\sum_{r=1}^nf(a + rh)$. Read backwards, it converts sums: $\\lim\\dfrac1n\\sum\\left(\\dfrac rn\\right)^2 = \\int_0^1x^2\\,dx = \\dfrac13$. Replace $\\dfrac rn$ by $x$, $\\dfrac1n$ by $dx$, and $\\sum$ by $\\int$ over the range of $\\dfrac rn$.",
    },
    {
      type: "definition",
      term: "bounds",
      body: "If $m \\le f \\le M$ on $[a, b]$, then $m(b - a) \\le \\int_a^bf \\le M(b - a)$. Also $\\left\\lvert\\int_a^bf\\right\\rvert \\le \\int_a^b\\lvert f\\rvert$. These estimate integrals that can't be evaluated exactly, e.g. $\\int_0^1e^{x^2}\\,dx$ lies between 1 and $e$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the fundamental theorem of calculus",
      statement: "If $f$ is continuous on $[a, b]$, then $G(x) = \\int_a^xf(t)\\,dt$ has $G'(x) = f(x)$, and $\\int_a^bf = F(b) - F(a)$ for any antiderivative $F$.",
      proof: ["$\\dfrac{G(x + h) - G(x)}h = \\dfrac1h\\int_x^{x + h}f$, which lies between the least and greatest values of $f$ on $[x, x + h]$; by continuity it tends to $f(x)$.", "So $G$ is an antiderivative; any other is $F = G + C$, and $F(b) - F(a) = G(b) - G(a) = \\int_a^bf$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the a + b − x property",
      statement: "$\\int_a^bf(x)\\,dx = \\int_a^bf(a + b - x)\\,dx$.",
      proof: ["Substitute $x = a + b - t$: $dx = -dt$, and the limits $a, b$ become $b, a$; reversing them removes the minus sign."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "even and odd functions",
      statement: "$\\int_{-a}^af(x)\\,dx = 2\\int_0^af(x)\\,dx$ if $f$ is even, and $0$ if $f$ is odd.",
      proof: ["Split at 0 and substitute $x = -t$ in $\\int_{-a}^0$: it becomes $\\int_0^af(-t)\\,dt$, which is $\\int_0^af$ or $-\\int_0^af$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Evaluate $\\int_0^1(x^2 + 2x)\\,dx$.",
      solution: ["$\\left[\\dfrac{x^3}3 + x^2\\right]_0^1 = \\dfrac13 + 1$.", "$= \\dfrac43$."],
      result: "$\\tfrac43$.",
    },
    {
      type: "example",
      level: 2,
      title: "using a + b − x",
      problem: "Evaluate $I = \\int_0^{\\pi/2}\\dfrac{\\sin x}{\\sin x + \\cos x}\\,dx$.",
      solution: ["Replacing $x$ by $\\tfrac\\pi2 - x$ swaps $\\sin$ and $\\cos$: $I = \\int_0^{\\pi/2}\\dfrac{\\cos x}{\\cos x + \\sin x}\\,dx$.", "Adding, $2I = \\int_0^{\\pi/2}1\\,dx = \\tfrac\\pi2$, so $I = \\tfrac\\pi4$."],
      result: "$\\tfrac\\pi4$.",
    },
    {
      type: "example",
      level: 3,
      title: "a limit of a sum",
      problem: "Find $\\lim_{n \\to \\infty}\\dfrac1n\\sum_{r=1}^n\\left(\\dfrac rn\\right)^2$.",
      solution: ["It is a Riemann sum for $f(x) = x^2$ on $[0, 1]$.", "$\\int_0^1x^2\\,dx = \\tfrac13$."],
      result: "$\\tfrac13$.",
    },
  ],
  pitfalls: [
    { wrong: "Keep the $x$-limits after substituting.", right: "Convert them: $u$ runs from $g(a)$ to $g(b)$." },
    { wrong: "$\\dfrac{d}{dx}\\int_0^{g(x)}f = f(g(x))$.", right: "Multiply by $g'(x)$." },
    { wrong: "Integrate $\\lvert f\\rvert$ as $\\lvert F(b) - F(a)\\rvert$.", right: "Split where $f$ changes sign." },
  ],
  formulas: [
    { label: "FTC", tex: "\\int_a^bf = F(b) - F(a)" },
    { label: "Leibniz", tex: "\\tfrac{d}{dx}\\int_{g}^{h}f = f(h)h' - f(g)g'" },
    { label: "King's property", tex: "\\int_a^bf(x)\\,dx = \\int_a^bf(a + b - x)\\,dx" },
    { label: "Odd function", tex: "\\int_{-a}^af = 0" },
    { label: "Sum to integral", tex: "\\lim\\tfrac1n\\sum f\\left(\\tfrac rn\\right) = \\int_0^1f" },
  ],
  exercises: [
    ex(1, num("dfix-ex-1", "Evaluate $\\int_0^3x^2\\,dx$.", 9, "$\\tfrac{27}3$."), ["$9$."]),
    ex(1, num("dfix-ex-2", "Evaluate $\\int_1^e\\dfrac{dx}x$.", 1, "$\\ln e - \\ln 1$."), ["$1$."]),
    ex(2, num("dfix-ex-3", "Evaluate $\\int_{-2}^2(x^3 + x)\\,dx$.", 0, "Odd integrand."), ["$0$."]),
    ex(2, dp("dfix-ex-4", "Evaluate $\\int_0^{\\pi/2}\\cos^2x\\,dx$.", Math.PI / 4, "$\\tfrac12\\int(1 + \\cos 2x)$."), ["$\\tfrac\\pi4 \\approx 0.785$."]),
    ex(2, dp("dfix-ex-5", "Evaluate $\\int_0^{\\pi/2}\\dfrac{\\sin x}{\\sin x + \\cos x}\\,dx$.", Math.PI / 4, "King's property."), ["$\\tfrac\\pi4$."]),
    ex(3, num("dfix-ex-6", "Find $\\dfrac{d}{dx}\\int_0^{x^2}(t + 1)\\,dt$ at $x = 1$.", 4, "$(x^2 + 1) \\cdot 2x$."), ["$2 \\times 2 = 4$."]),
    ex(3, fr("dfix-ex-7", "Find $\\lim_{n \\to \\infty}\\dfrac1n\\sum_{r=1}^n\\left(\\dfrac rn\\right)^2$.", 1 / 3, "$\\int_0^1x^2\\,dx$."), ["$\\tfrac13$."]),
    ex(3, mc("dfix-ex-8", "$\\int_0^{2\\pi}\\lvert\\sin x\\rvert\\,dx$ is", ["4", "Twice $\\int_0^\\pi\\sin x\\,dx = 2$."], [["0", "That is $\\int_0^{2\\pi}\\sin x\\,dx$, without the modulus."], ["2", "The second hump counts too."]]), ["Split at $\\pi$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const c = r.nonzero(-4, 4);
      const d = r.nonzero(-5, 5);
      const a = r.int(-3, 2);
      const b = a + r.int(1, 4);
      const F = (x: number) => (c * x * x) / 2 + d * x;
      const v = F(b) - F(a);
      return n(`Evaluate $\\int_{${a}}^{${b}}(${c === 1 ? "" : c === -1 ? "-" : c}x ${d < 0 ? "-" : "+"} ${Math.abs(d)})\\,dx$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\left[\\tfrac{${c}}2x^2 + ${d}x\\right]_{${a}}^{${b}} = ${v}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 5);
      const b = r.int(1, 3);
      const v = b ** (k + 1) / (k + 1);
      return n(`Evaluate $\\int_0^{${b}}x^{${k}}\\,dx$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{${b}^{${k + 1}}}{${k + 1}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(2, 3);
      const m = r.int(1, 3);
      const x0 = r.pick([1, 2, -1]);
      const v = x0 ** (k * m) * k * x0 ** (k - 1);
      return n(`Find $\\dfrac{d}{dx}\\int_0^{x^{${k}}}t^{${m}}\\,dt$ at $x = ${x0}$.`, v, `$(x^{${k}})^{${m}} \\cdot ${k}x^{${k - 1}}$ at $x = ${x0}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.nonzero(-4, 4);
      const q = r.nonzero(-5, 5);
      const c = r.nonzero(-4, 4);
      const a = r.int(1, 3);
      return n(`Evaluate $\\int_{-${a}}^{${a}}\\left(${p === 1 ? "" : p === -1 ? "-" : p}x^3 ${q < 0 ? "-" : "+"} ${Math.abs(q)}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}\\right)dx$.`, 2 * a * c, `The odd part integrates to 0; the constant gives $2 \\times ${a} \\times ${c}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([2, 3, 4]);
      const fn = r.pick(["\\sin", "\\cos"]);
      return mcNumbers(
        `$\\dfrac{d}{dx}\\int_0^{x^{${k}}}${fn} t\\,dt$ is`,
        { text: `$${k}x^{${k - 1}}${fn}(x^{${k}})$`, why: "FTC times the derivative of the upper limit." },
        [{ text: `$${fn}(x^{${k}})$`, why: "The chain-rule factor is missing.", misconception: "leibniz-no-chain" }, { text: `$${fn} x$`, why: "Substitute the limit into the integrand." }],
      );
    },
  },
];
