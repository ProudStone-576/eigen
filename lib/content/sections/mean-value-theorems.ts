import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Rolle's theorem and its hypotheses; Lagrange's mean value theorem and its geometric meaning; consequences (zero derivative means constant, derivative bounds give value bounds, monotonicity); Cauchy's mean value theorem; counting roots with Rolle's theorem. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "mean-value-theorems",
  title: "Rolle's & mean value theorems",
  summary: "If a smooth journey starts and ends at the same height, somewhere the path is level: that is Rolle's theorem, f′(c) = 0 when f(a) = f(b). Tilted, it becomes Lagrange's mean value theorem: somewhere the instantaneous slope equals the average slope, f′(c) = (f(b) − f(a))/(b − a). Both need f continuous on [a, b] and differentiable on (a, b); drop either and they can fail. Their consequences hold calculus together: f′ = 0 means constant, and f′ > 0 means increasing.",
  deps: ["maxima-minima"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "Rolle's theorem", meaning: "$f$ continuous on $[a, b]$, differentiable on $(a, b)$, $f(a) = f(b)$ $\\Rightarrow$ $f'(c) = 0$ for some $c \\in (a, b)$." },
    { term: "mean value theorem", meaning: "$f$ continuous on $[a, b]$ and differentiable on $(a, b)$ $\\Rightarrow$ $f'(c) = \\dfrac{f(b) - f(a)}{b - a}$ for some $c \\in (a, b)$." },
    { term: "average rate of change", meaning: "$\\dfrac{f(b) - f(a)}{b - a}$, the slope of the chord from $(a, f(a))$ to $(b, f(b))$." },
  ],
  misconceptions: {
    "rolle-without-hypotheses": "Applies Rolle's theorem without checking continuity and differentiability, e.g. expecting $f'(c) = 0$ for $\\lvert x\\rvert$ on $[-1, 1]$.",
    "mvt-midpoint": "Thinks the point $c$ of the mean value theorem is always the midpoint $\\tfrac{a + b}2$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Somewhere, exactly average",
      body: "Drive 120 km in 2 hours and at some instant the speedometer read exactly 60 km/h. That everyday certainty is the mean value theorem. It is the bridge from information about $f'$ to information about $f$: it proves that positive derivatives mean increasing functions, gives error bounds, and with Rolle's theorem limits how many roots an equation can have.",
      realWorld: {
        title: "Average-speed cameras",
        body: "Some highways time cars between two cameras a known distance apart. If the average speed exceeds the limit, the mean value theorem guarantees that the car's instantaneous speed exceeded it at some moment, so the fine is mathematically justified.",
      },
    },
    {
      type: "truth",
      statement: "**Rolle**: if $f$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $f(a) = f(b)$, then $f'(c) = 0$ for some $c \\in (a, b)$. **Lagrange (MVT)**: if $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then $f'(c) = \\dfrac{f(b) - f(a)}{b - a}$ for some $c \\in (a, b)$: the tangent at $c$ is parallel to the chord. **Cauchy**: under the same hypotheses on $f$ and $g$ with $g' \\ne 0$, $\\dfrac{f'(c)}{g'(c)} = \\dfrac{f(b) - f(a)}{g(b) - g(a)}$.",
      body: "Both hypotheses matter. $\\lvert x\\rvert$ on $[-1, 1]$ has equal end values but no horizontal tangent: it isn't differentiable at 0. $\\tfrac1{x^2}$ on $[-1, 1]$ isn't continuous. **Consequences**: $f' = 0$ on an interval ⇒ $f$ constant; $f' = g'$ ⇒ $f - g$ constant (why antiderivatives differ by a constant); $f' > 0$ ⇒ $f$ increasing (§{monotonicity}); $\\lvert f'\\rvert \\le M$ ⇒ $\\lvert f(b) - f(a)\\rvert \\le M\\lvert b - a\\rvert$. **Roots**: between two roots of $f$ lies a root of $f'$, so if $f'$ has no roots in an interval, $f$ has at most one there. The point $c$ is the midpoint for quadratics, but not in general.",
    },
    {
      type: "predict",
      misconception: "rolle-without-hypotheses",
      item: {
        kind: "mc",
        id: "mvt-predict-1",
        prompt: "$f(x) = \\lvert x\\rvert$ on $[-1, 1]$ has $f(-1) = f(1)$. Is there $c$ in $(-1, 1)$ with $f'(c) = 0$?",
        options: [
          { id: "a", text: "No: $f$ isn't differentiable at 0, and $f' = \\pm1$ elsewhere", correct: true, why: "Rolle's hypotheses fail, and so does its conclusion." },
          { id: "b", text: "Yes, by Rolle's theorem", misconception: "rolle-without-hypotheses", why: "Rolle needs differentiability on the whole open interval." },
          { id: "c", text: "Yes, $c = 0$", why: "$f'(0)$ doesn't exist." },
        ],
      },
      reveal: {
        body: "The V-shaped graph goes down and comes back up, but it turns at a corner, not at a flat point. Rolle's theorem promises a horizontal tangent only for functions that are differentiable throughout $(a, b)$; at the corner there is no tangent at all. A theorem's conclusion is only guaranteed when every hypothesis holds.",
      },
      resolve: {
        kind: "mc",
        id: "mvt-resolve-1",
        prompt: "$f(x) = \\dfrac1{x^2}$ on $[-1, 1]$ has $f(-1) = f(1) = 1$. Does Rolle's theorem apply?",
        options: [
          { id: "a", text: "No: $f$ isn't continuous at 0", correct: true, why: "It isn't even defined there." },
          { id: "b", text: "Yes, since $f(-1) = f(1)$", misconception: "rolle-without-hypotheses", why: "Equal end values are only one of three hypotheses." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mvt-check-1",
        prompt: "For $f(x) = x^3$ on $[0, 3]$, the mean value theorem's $c$ is",
        options: [
          { id: "a", text: "$\\sqrt3$", correct: true, why: "$3c^2 = \\dfrac{27 - 0}3 = 9$." },
          { id: "b", text: "$1.5$, the midpoint", misconception: "mvt-midpoint", why: "That works for quadratics, not cubics: $f'(1.5) = 6.75 \\ne 9$." },
          { id: "c", text: "3", why: "$c$ must be inside $(0, 3)$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mvt-check-2",
        prompt: "Rolle's theorem for $f(x) = x^2 - 4x$ on $[0, 4]$ gives $c =$",
        options: [
          { id: "a", text: "2", correct: true, why: "$f(0) = f(4) = 0$ and $f'(c) = 2c - 4 = 0$." },
          { id: "b", text: "4", why: "$c$ is interior." },
          { id: "c", text: "0", why: "$f'(0) = -4$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Convergence proofs for gradient descent use the mean value theorem: if the gradient is Lipschitz with constant $L$, then $\\lvert\\nabla f(x) - \\nabla f(y)\\rvert \\le L\\lvert x - y\\rvert$, which caps how far one step can change the loss and dictates a learning rate below $2/L$ (§{gradient-descent}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mvt-produce-1", prompt: "Find the mean value theorem's $c$ for $f(x) = x^2$ on $[1, 5]$.", answer: 3, explain: "$2c = \\dfrac{25 - 1}4 = 6$." },
        { kind: "number", id: "mvt-produce-2", prompt: "Find the mean value theorem's $c$ for $f(x) = \\sqrt x$ on $[0, 4]$.", answer: 1, explain: "$\\dfrac1{2\\sqrt c} = \\dfrac{2}{4}$." },
        {
          kind: "mc",
          id: "mvt-produce-3",
          prompt: "For $f(x) = x^3$ on $[0, 2]$, the mean value theorem's $c$ is",
          options: [
            { id: "a", text: "$\\tfrac2{\\sqrt3}$", correct: true, why: "$3c^2 = 4$." },
            { id: "b", text: "1", misconception: "mvt-midpoint", why: "$f'(1) = 3 \\ne 4$." },
          ],
        },
        {
          kind: "mc",
          id: "mvt-produce-4",
          prompt: "$f(x) = x^{2/3}$ on $[-1, 1]$ has $f(-1) = f(1) = 1$. Rolle's theorem",
          options: [
            { id: "a", text: "doesn't apply: $f$ has a cusp at 0", correct: true, why: "$f'(x) = \\tfrac23x^{-1/3}$ is undefined at 0, and never 0." },
            { id: "b", text: "gives $c = 0$ with $f'(0) = 0$", misconception: "rolle-without-hypotheses", why: "$f'(0)$ doesn't exist." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mvt-review-1", prompt: "Find Rolle's $c$ for $f(x) = x^2 - 2x$ on $[0, 2]$.", answer: 1, explain: "$2c - 2 = 0$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the geometric meaning",
      body: "The chord from $(a, f(a))$ to $(b, f(b))$ has slope $\\dfrac{f(b) - f(a)}{b - a}$. The MVT says some tangent in between is parallel to it. Rolle's theorem is the case of a horizontal chord. Sliding the chord parallel to itself until it last touches the curve finds such a tangent.",
    },
    {
      type: "definition",
      term: "counting roots",
      body: "If $f$ had two roots $r < s$, Rolle would give a root of $f'$ in $(r, s)$. Contrapositive: if $f'$ never vanishes on an interval, $f$ has at most one root there. So $x^3 + x + 1 = 0$ has exactly one real root: $f' = 3x^2 + 1 > 0$, and $f$ changes sign (§{continuity}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "Rolle's theorem",
      statement: "If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$ and $f(a) = f(b)$, then $f'(c) = 0$ for some $c \\in (a, b)$.",
      proof: ["By the extreme value theorem $f$ attains a maximum and a minimum on $[a, b]$.", "If both are at the endpoints, $f$ is constant and any $c$ works; otherwise one is at an interior $c$, where $f'(c) = 0$ by Fermat's theorem (§{maxima-minima})."],
    },
    {
      type: "theorem",
      name: "Lagrange's mean value theorem",
      statement: "If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then $f'(c) = \\dfrac{f(b) - f(a)}{b - a}$ for some $c \\in (a, b)$.",
      proof: ["Subtract the chord: $g(x) = f(x) - f(a) - \\dfrac{f(b) - f(a)}{b - a}(x - a)$ has $g(a) = g(b) = 0$.", "Rolle gives $g'(c) = 0$, which is the statement."],
    },
    {
      type: "theorem",
      kind: "Corollary",
      name: "zero derivative",
      statement: "If $f'(x) = 0$ for all $x$ in an interval, $f$ is constant there.",
      proof: ["For any $x_1 < x_2$ in the interval, the MVT gives $f(x_2) - f(x_1) = f'(c)(x_2 - x_1) = 0$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Verify Rolle's theorem for $f(x) = x^2 - 5x + 6$ on $[2, 3]$.",
      solution: ["A polynomial, so continuous and differentiable; $f(2) = f(3) = 0$.", "$f'(c) = 2c - 5 = 0$ at $c = 2.5 \\in (2, 3)$."],
      result: "$c = 2.5$.",
    },
    {
      type: "example",
      level: 2,
      title: "the MVT for a cubic",
      problem: "Find $c$ in the mean value theorem for $f(x) = x^3 - x$ on $[0, 2]$.",
      solution: ["$\\dfrac{f(2) - f(0)}{2} = \\dfrac{6}{2} = 3$.", "$3c^2 - 1 = 3$ gives $c^2 = \\tfrac43$, $c = \\tfrac2{\\sqrt3} \\approx 1.155 \\in (0, 2)$."],
      result: "$c = \\tfrac2{\\sqrt3}$.",
    },
    {
      type: "example",
      level: 3,
      title: "an inequality",
      problem: "Show that $\\lvert\\sin a - \\sin b\\rvert \\le \\lvert a - b\\rvert$ for all real $a, b$.",
      solution: ["By the MVT, $\\sin a - \\sin b = \\cos c\\,(a - b)$ for some $c$ between $a$ and $b$.", "$\\lvert\\cos c\\rvert \\le 1$, so the inequality follows."],
      result: "$\\lvert\\sin a - \\sin b\\rvert \\le \\lvert a - b\\rvert$.",
    },
  ],
  pitfalls: [
    { wrong: "Apply Rolle whenever $f(a) = f(b)$.", right: "Check continuity on $[a, b]$ and differentiability on $(a, b)$ first." },
    { wrong: "$c$ is the midpoint.", right: "Solve $f'(c) = $ average slope; the midpoint works only for quadratics." },
    { wrong: "Give $c$ at an endpoint.", right: "The theorem places $c$ strictly inside $(a, b)$." },
  ],
  formulas: [
    { label: "Rolle", tex: "f(a) = f(b) \\Rightarrow f'(c) = 0" },
    { label: "MVT", tex: "f'(c) = \\tfrac{f(b) - f(a)}{b - a}" },
    { label: "Cauchy", tex: "\\tfrac{f'(c)}{g'(c)} = \\tfrac{f(b) - f(a)}{g(b) - g(a)}" },
    { label: "Bound", tex: "\\lvert f(b) - f(a)\\rvert \\le M\\lvert b - a\\rvert" },
  ],
  exercises: [
    ex(1, num("mvtx-ex-1", "Find Rolle's $c$ for $f(x) = x^2 - 6x + 8$ on $[2, 4]$.", 3, "$2c - 6 = 0$."), ["$3$."]),
    ex(1, num("mvtx-ex-2", "Find the mean value theorem's $c$ for $f(x) = x^2$ on $[2, 6]$.", 4, "$2c = 8$."), ["$4$."]),
    ex(2, dp("mvtx-ex-3", "Find the mean value theorem's $c$ for $f(x) = x^3$ on $[0, 3]$.", Math.sqrt(3), "$3c^2 = 9$."), ["$\\sqrt3 \\approx 1.732$."]),
    ex(2, dp("mvtx-ex-4", "Find the mean value theorem's $c$ for $f(x) = \\ln x$ on $[1, e]$.", Math.E - 1, "$\\dfrac1c = \\dfrac{1}{e - 1}$."), ["$e - 1 \\approx 1.718$."]),
    ex(2, dp("mvtx-ex-5", "Find Rolle's $c$ for $f(x) = \\sin x$ on $[0, \\pi]$.", Math.PI / 2, "$\\cos c = 0$."), ["$\\tfrac\\pi2 \\approx 1.571$."]),
    ex(3, num("mvtx-ex-6", "Find the mean value theorem's $c$ for $f(x) = \\sqrt x$ on $[0, 4]$.", 1, "$\\tfrac1{2\\sqrt c} = \\tfrac12$."), ["$1$."]),
    ex(3, num("mvtx-ex-7", "$f'(x) \\le 3$ for all $x$ and $f(1) = 2$. Find the greatest possible value of $f(4)$.", 11, "$f(4) - f(1) = 3f'(c) \\le 9$."), ["$11$."]),
    ex(3, mc("mvtx-ex-8", "How many real roots has $x^3 + x + 1 = 0$?", ["exactly one", "$f' = 3x^2 + 1 > 0$ allows at most one, and $f$ changes sign."], [["three", "Two roots would force a root of $f'$ between them."], ["none", "$f(-1) = -1 < 0 < f(0) = 1$."]]), ["Rolle bounds the count; the IVT supplies one."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.int(-5, 4);
      const b = a + r.int(1, 6);
      const k = r.nonzero(-3, 3);
      const m = r.nonzero(-4, 4);
      const sm = `${m < 0 ? "-" : "+"} ${Math.abs(m)}`;
      return n(`Find the mean value theorem's $c$ for $f(x) = ${k === 1 ? "" : k === -1 ? "-" : k}x^2 ${sm}x$ on $[${a}, ${b}]$ (3 decimals).`, Math.round(((a + b) / 2) * 1000) / 1000, `$f'(c) = ${2 * k}c ${sm}$ equals the chord slope $${k}(${a + b}) ${sm}$, so $c = ${(a + b) / 2}$, the midpoint (true for every quadratic).`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const b = r.int(1, 6);
      const v = b / Math.sqrt(3);
      return n(`Find the mean value theorem's $c$ for $f(x) = x^3$ on $[0, ${b}]$ (3 decimals).`, Math.round(v * 1000) / 1000, `$3c^2 = \\dfrac{${b ** 3}}{${b}} = ${b * b}$, so $c = \\tfrac{${b}}{\\sqrt3}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const M = r.int(1, 6);
      const a = r.int(-3, 3);
      const b = a + r.int(1, 5);
      const y0 = r.int(-5, 5);
      return n(`$f'(x) \\le ${M}$ for all $x$ and $f(${a}) = ${y0}$. Find the greatest possible value of $f(${b})$.`, y0 + M * (b - a), `MVT: $f(${b}) - f(${a}) = f'(c)(${b - a}) \\le ${M * (b - a)}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const b = r.pick([2, 3, 4, 6]);
      return mcNumbers(
        `For $f(x) = x^3$ on $[0, ${b}]$, the mean value theorem's $c$ is`,
        { text: `$\\tfrac{${b}}{\\sqrt3}$`, why: `$3c^2 = ${b * b}$.` },
        [{ text: `${b / 2}`, why: "The midpoint works only for quadratics.", misconception: "mvt-midpoint" }, { text: `${b}`, why: "$c$ is strictly inside the interval." }],
      );
    },
  },
];
