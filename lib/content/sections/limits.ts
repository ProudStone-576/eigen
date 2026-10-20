import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Limits: intuitive meaning, one-sided limits and existence; algebra of limits; factorising and rationalising; standard limits (sin x / x, (eˣ − 1)/x, ln(1 + x)/x, (xⁿ − aⁿ)/(x − a), (1 + x)^(1/x)); limits at infinity; indeterminate forms including 1^∞; the sandwich theorem; L'Hôpital's rule; series expansions for limits. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "limits",
  title: "Limits",
  summary: "The limit of f(x) as x → a is the value f(x) gets arbitrarily close to as x approaches a, whatever happens at a itself. It exists only when the left and right limits agree. A form like 0/0 is a signal to simplify, not an answer: factorise, rationalise, use a standard limit such as sin x / x → 1, or apply L'Hôpital's rule. The form 1^∞ is not 1; it is e raised to lim g(x)(f(x) − 1).",
  deps: ["functions-basics", "trig-identities", "exponents-logs"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "one-sided limits", meaning: "$\\lim_{x \\to a^-}f(x)$ approaches from below, $\\lim_{x \\to a^+}f(x)$ from above; the limit exists iff both exist and are equal." },
    { term: "indeterminate form", meaning: "A form such as $\\tfrac00$, $\\tfrac\\infty\\infty$, $\\infty - \\infty$, $0 \\cdot \\infty$, $1^\\infty$, $0^0$ or $\\infty^0$ whose value depends on how fast the parts approach their limits." },
    { term: "L'Hôpital's rule", meaning: "For a $\\tfrac00$ or $\\tfrac\\infty\\infty$ form, $\\lim\\dfrac{f}{g} = \\lim\\dfrac{f'}{g'}$ when the right side exists." },
  ],
  misconceptions: {
    "indeterminate-dne": "Concludes that a limit doesn't exist because direct substitution gives $\\tfrac00$.",
    "one-to-infinity": "Takes a limit of the form $1^\\infty$ to be 1.",
  },
  steps: [
    {
      type: "motivate",
      title: "Getting close without arriving",
      body: "What is the slope of a curve at a point? Two points on the curve give a slope, but one point gives $\\tfrac00$. Limits resolve exactly this: let the second point slide towards the first and ask what the slopes approach. Every derivative and integral is a limit, and JEE asks for limits directly, usually of forms that look undefined at first.",
      realWorld: {
        title: "Compound interest",
        body: "Interest of 100% a year compounded $n$ times gives a growth factor $\\left(1 + \\tfrac1n\\right)^n$. Monthly gives 2.613, daily 2.7146, and as $n \\to \\infty$ the factor approaches $e \\approx 2.71828$, not 1, even though the base tends to 1.",
      },
    },
    {
      type: "truth",
      statement: "$\\lim_{x \\to a}f(x) = L$ means $f(x)$ is as close to $L$ as we like for all $x$ close enough to $a$ (but $x \\ne a$); it exists iff $\\lim_{x \\to a^-}f = \\lim_{x \\to a^+}f$. Limits respect sums, products, quotients (nonzero denominator) and continuous functions. **Standard limits** as $x \\to 0$: $\\dfrac{\\sin x}x \\to 1$, $\\dfrac{\\tan x}x \\to 1$, $\\dfrac{1 - \\cos x}{x^2} \\to \\dfrac12$, $\\dfrac{e^x - 1}x \\to 1$, $\\dfrac{a^x - 1}x \\to \\ln a$, $\\dfrac{\\ln(1 + x)}x \\to 1$, $(1 + x)^{1/x} \\to e$; and $\\dfrac{x^n - a^n}{x - a} \\to na^{n-1}$ as $x \\to a$. **The $1^\\infty$ form**: if $f \\to 1$ and $g \\to \\infty$, then $\\lim f^g = e^{\\lim g(f - 1)}$.",
      body: "Strategy for $\\tfrac00$: factorise and cancel; rationalise surds; reduce to a standard limit by scaling ($\\dfrac{\\sin 3x}x = 3 \\cdot \\dfrac{\\sin 3x}{3x} \\to 3$); or use **L'Hôpital's rule**, differentiating top and bottom separately (§{derivative}). At infinity, divide by the highest power: a rational function tends to the ratio of leading coefficients if the degrees are equal, to 0 if the bottom degree is larger, and to $\\pm\\infty$ if the top is larger. **Sandwich theorem**: if $g \\le f \\le h$ near $a$ and $g, h \\to L$, then $f \\to L$; this is how $x\\sin\\tfrac1x \\to 0$. For harder forms, expand: $\\sin x = x - \\tfrac{x^3}6 + \\dots$, $\\cos x = 1 - \\tfrac{x^2}2 + \\tfrac{x^4}{24} - \\dots$, $e^x = 1 + x + \\tfrac{x^2}2 + \\dots$, $\\ln(1 + x) = x - \\tfrac{x^2}2 + \\dots$",
    },
    {
      type: "predict",
      misconception: "one-to-infinity",
      item: {
        kind: "mc",
        id: "lim-predict-1",
        prompt: "$\\lim_{x \\to 0}(1 + x)^{1/x}$ equals",
        options: [
          { id: "a", text: "$e$", correct: true, why: "This is the definition of $e$." },
          { id: "b", text: "1", misconception: "one-to-infinity", why: "The base approaches 1 but the exponent grows without bound; the race between them gives $e$." },
          { id: "c", text: "$\\infty$", why: "It stays bounded, near 2.718." },
        ],
      },
      reveal: {
        body: "Try values: $x = 0.1$ gives $1.1^{10} \\approx 2.594$; $x = 0.01$ gives $1.01^{100} \\approx 2.705$; $x = 0.001$ gives $\\approx 2.717$. The base creeping towards 1 is exactly balanced by the exponent racing to infinity, and the result is $e$. In general $\\lim f^g = e^{\\lim g(f - 1)}$, here $e^{\\lim (1/x)(x)} = e^1$.",
      },
      resolve: {
        kind: "mc",
        id: "lim-resolve-1",
        prompt: "$\\lim_{x \\to \\infty}\\left(1 + \\dfrac2x\\right)^x$ equals",
        options: [
          { id: "a", text: "$e^2$", correct: true, why: "$e^{\\lim x \\cdot (2/x)} = e^2$." },
          { id: "b", text: "1", misconception: "one-to-infinity", why: "A $1^\\infty$ form is indeterminate." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lim-check-1",
        prompt: "$\\lim_{x \\to 2}\\dfrac{x^2 - 4}{x - 2}$ is",
        options: [
          { id: "a", text: "4", correct: true, why: "$\\dfrac{(x - 2)(x + 2)}{x - 2} = x + 2 \\to 4$." },
          { id: "b", text: "It doesn't exist, because substitution gives $\\tfrac00$", misconception: "indeterminate-dne", why: "$\\tfrac00$ means simplify first." },
          { id: "c", text: "0", why: "Cancel the common factor." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lim-check-2",
        prompt: "$\\lim_{x \\to 0}\\dfrac{\\sin 3x}x$ is",
        options: [
          { id: "a", text: "3", correct: true, why: "$3 \\cdot \\dfrac{\\sin 3x}{3x} \\to 3$." },
          { id: "b", text: "1", why: "The angle is $3x$, not $x$." },
          { id: "c", text: "$\\tfrac13$", why: "The 3 multiplies." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Gradients are limits, and numerical gradient checks approximate them with a small $h$: $\\dfrac{f(x + h) - f(x - h)}{2h}$. Softmax with temperature $T \\to 0$ tends to a hard argmax; the cross-entropy of a perfect prediction involves $\\lim_{p \\to 0}p\\ln p = 0$, a $0 \\cdot \\infty$ form that appears in the cross-entropy loss (§{loss-functions}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "lim-produce-1", prompt: "Find $\\lim_{x \\to 0}\\dfrac{1 - \\cos 2x}{x^2}$.", answer: 2, explain: "$1 - \\cos 2x = 2\\sin^2x$, and $\\dfrac{\\sin x}x \\to 1$." },
        { kind: "number", id: "lim-produce-2", prompt: "Find $\\lim_{x \\to \\infty}\\dfrac{3x^2 + 2x}{5x^2 - 1}$.", answer: 0.6, explain: "Equal degrees: $\\tfrac35$." },
        {
          kind: "mc",
          id: "lim-produce-3",
          prompt: "$\\lim_{x \\to 0}\\dfrac{e^{2x} - 1}x$ is",
          options: [
            { id: "a", text: "2", correct: true, why: "$2 \\cdot \\dfrac{e^{2x} - 1}{2x} \\to 2$." },
            { id: "b", text: "undefined, because it is $\\tfrac00$", misconception: "indeterminate-dne", why: "$\\tfrac00$ forms often have limits." },
          ],
        },
        {
          kind: "mc",
          id: "lim-produce-4",
          prompt: "$\\lim_{x \\to 0}(1 + 3x)^{1/x}$ is",
          options: [
            { id: "a", text: "$e^3$", correct: true, why: "$e^{\\lim (1/x)(3x)}$." },
            { id: "b", text: "1", misconception: "one-to-infinity", why: "$1^\\infty$ is indeterminate." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "lim-review-1", prompt: "Find $\\lim_{x \\to 3}\\dfrac{x^2 - 9}{x - 3}$.", answer: 6, explain: "$x + 3 \\to 6$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "ε–δ definition",
      body: "$\\lim_{x \\to a}f(x) = L$ means: for every $\\varepsilon > 0$ there is a $\\delta > 0$ with $\\lvert f(x) - L\\rvert < \\varepsilon$ whenever $0 < \\lvert x - a\\rvert < \\delta$. The condition $0 < \\lvert x - a\\rvert$ is why the value $f(a)$, or whether it exists at all, doesn't matter.",
    },
    {
      type: "definition",
      term: "one-sided limits in practice",
      body: "Piecewise functions, $\\lvert x\\rvert$, $[x]$ and expressions like $e^{1/x}$ need one-sided limits. $\\lim_{x \\to 0}\\dfrac{\\lvert x\\rvert}x$ doesn't exist: it is $-1$ from the left and $1$ from the right. $\\lim_{x \\to 0^+}e^{1/x} = \\infty$ but $\\lim_{x \\to 0^-}e^{1/x} = 0$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the fundamental trigonometric limit",
      statement: "$\\lim_{x \\to 0}\\dfrac{\\sin x}x = 1$ ($x$ in radians).",
      proof: ["For $0 < x < \\tfrac\\pi2$, comparing a triangle, a sector and a larger triangle in the unit circle gives $\\sin x < x < \\tan x$.", "Divide by $\\sin x$ and invert: $\\cos x < \\dfrac{\\sin x}x < 1$; the sandwich theorem gives the limit 1 (both sides are even, so $x < 0$ follows)."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "the 1^∞ form",
      statement: "If $f(x) \\to 1$ and $g(x) \\to \\infty$, then $\\lim f(x)^{g(x)} = e^{\\lim g(x)(f(x) - 1)}$, provided the last limit exists.",
      proof: ["$f^g = e^{g\\ln f}$, and $\\ln f = \\ln(1 + (f - 1)) \\approx f - 1$ since $\\dfrac{\\ln(1 + u)}u \\to 1$ as $u \\to 0$.", "So $g\\ln f$ and $g(f - 1)$ have the same limit, and $e^u$ is continuous."],
    },
    {
      type: "theorem",
      name: "L'Hôpital's rule",
      statement: "If $f(a) = g(a) = 0$ (or both tend to $\\pm\\infty$), $f, g$ are differentiable near $a$ with $g' \\ne 0$, and $\\lim\\dfrac{f'}{g'}$ exists, then $\\lim\\dfrac fg = \\lim\\dfrac{f'}{g'}$.",
      proof: ["By Cauchy's mean value theorem, $\\dfrac{f(x)}{g(x)} = \\dfrac{f(x) - f(a)}{g(x) - g(a)} = \\dfrac{f'(c)}{g'(c)}$ for some $c$ between $a$ and $x$.", "As $x \\to a$, $c \\to a$ too."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $\\lim_{x \\to 1}\\dfrac{x^3 - 1}{x - 1}$.",
      solution: ["$x^3 - 1 = (x - 1)(x^2 + x + 1)$, so the quotient is $x^2 + x + 1$ for $x \\ne 1$.", "It tends to 3 (or use $na^{n-1}$ with $n = 3$, $a = 1$)."],
      result: "3.",
    },
    {
      type: "example",
      level: 2,
      title: "by expansion",
      problem: "Find $\\lim_{x \\to 0}\\dfrac{x - \\sin x}{x^3}$.",
      solution: ["$\\sin x = x - \\tfrac{x^3}6 + O(x^5)$, so $x - \\sin x = \\tfrac{x^3}6 + O(x^5)$.", "Divide by $x^3$: the limit is $\\tfrac16$ (L'Hôpital three times agrees)."],
      result: "$\\tfrac16$.",
    },
    {
      type: "example",
      level: 3,
      title: "a 1^∞ form",
      problem: "Find $\\lim_{x \\to 0}(\\cos x)^{1/x^2}$.",
      solution: ["Base $\\to 1$, exponent $\\to \\infty$: the limit is $e^{\\lim (\\cos x - 1)/x^2}$.", "$\\dfrac{\\cos x - 1}{x^2} \\to -\\tfrac12$, so the answer is $e^{-1/2}$."],
      result: "$e^{-1/2} \\approx 0.607$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\tfrac00$ means the limit doesn't exist.", right: "It means simplify: factor, rationalise, or use a standard limit." },
    { wrong: "$1^\\infty = 1$.", right: "Use $e^{\\lim g(f - 1)}$." },
    { wrong: "Apply L'Hôpital to a form that isn't $\\tfrac00$ or $\\tfrac\\infty\\infty$.", right: "Check the form first; otherwise the rule gives nonsense." },
  ],
  formulas: [
    { label: "Trig", tex: "\\tfrac{\\sin x}x \\to 1,\\ \\tfrac{1 - \\cos x}{x^2} \\to \\tfrac12" },
    { label: "Exp, log", tex: "\\tfrac{a^x - 1}x \\to \\ln a,\\ \\tfrac{\\ln(1 + x)}x \\to 1" },
    { label: "Power", tex: "\\tfrac{x^n - a^n}{x - a} \\to na^{n-1}" },
    { label: "1^∞", tex: "\\lim f^g = e^{\\lim g(f - 1)}" },
  ],
  exercises: [
    ex(1, num("limx-ex-1", "Find $\\lim_{x \\to 2}\\dfrac{x^3 - 8}{x - 2}$.", 12, "$3 \\cdot 2^2$."), ["$12$."]),
    ex(1, num("limx-ex-2", "Find $\\lim_{x \\to 0}\\dfrac{\\tan 5x}{\\sin 2x}$.", 2.5, "$\\tfrac52$."), ["$2.5$."]),
    ex(2, num("limx-ex-3", "Find $\\lim_{x \\to \\infty}\\dfrac{2x^3 + 1}{x^3 - 4x}$.", 2, "Leading coefficients."), ["$2$."]),
    ex(2, dp("limx-ex-4", "Find $\\lim_{x \\to 0}\\dfrac{5^x - 1}x$.", Math.log(5), "$\\ln 5$."), ["$\\ln 5 \\approx 1.609$."]),
    ex(2, num("limx-ex-5", "Find $\\lim_{x \\to 0}\\dfrac{1 - \\cos x}{x^2}$.", 0.5, "Standard limit."), ["$\\tfrac12$."]),
    ex(3, fr("limx-ex-6", "Find $\\lim_{x \\to 0}\\dfrac{x - \\sin x}{x^3}$.", 1 / 6, "Expand $\\sin x$."), ["$\\tfrac16$."]),
    ex(3, dp("limx-ex-7", "Find $\\lim_{x \\to 0}(\\cos x)^{1/x^2}$.", Math.exp(-0.5), "$e^{-1/2}$."), ["$\\approx 0.607$."]),
    ex(3, mc("limx-ex-8", "$\\lim_{x \\to 0}x\\sin\\dfrac1x$ is", ["0", "$-\\lvert x\\rvert \\le x\\sin\\tfrac1x \\le \\lvert x\\rvert$: sandwich."], [["It doesn't exist, because $\\sin\\tfrac1x$ oscillates", "The factor $x$ squeezes the oscillation to 0."], ["1", "That is $\\lim\\tfrac{\\sin x}x$, a different limit."]]), ["Bounded times something tending to 0 tends to 0."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
/** A coefficient as written before a variable: 1 and −1 drop the digit. */
const co = (k: number) => (k === 1 ? "" : k === -1 ? "-" : `${k}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 3);
      const k = r.int(2, 5);
      return n(`Find $\\lim_{x \\to ${a}}\\dfrac{x^{${k}} - ${a ** k}}{x - ${a}}$.`, k * a ** (k - 1), `$na^{n-1} = ${k} \\times ${a}^{${k - 1}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(1, 9);
      const q = r.int(1, 9);
      const top = r.pick(["\\sin", "\\tan"]);
      const bot = r.pick(["", "\\sin", "\\tan"]);
      const v = p / q;
      return n(`Find $\\lim_{x \\to 0}\\dfrac{${top} ${co(p)}x}{${bot ? `${bot} ${co(q)}x` : `${co(q)}x`}}$ (3 decimals).`, Math.round(v * 1000) / 1000, `Each of $\\sin u$, $\\tan u$ behaves like $u$: $\\tfrac{${p}}{${q}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const deg = r.int(1, 3);
      const lower = r.pick([true, false]);
      const a = r.nonzero(-6, 6);
      const b = r.nonzero(-6, 6);
      const c = r.nonzero(-5, 5);
      const botDeg = lower ? deg + 1 : deg;
      const v = lower ? 0 : a / b;
      const pow = (d: number) => (d === 1 ? "x" : `x^{${d}}`);
      return n(`Find $\\lim_{x \\to \\infty}\\dfrac{${co(a)}${pow(deg)} ${c < 0 ? "-" : "+"} ${Math.abs(c)}}{${co(b)}${pow(botDeg)} + 1}$ (3 decimals).`, Math.round(v * 1000) / 1000, lower ? "The denominator has the higher degree: the limit is 0." : `Equal degrees: ratio of leading coefficients $\\tfrac{${a}}{${b}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.nonzero(-4, 5);
      const q = r.int(1, 4);
      return n(`$\\lim_{x \\to 0}(1 + ${p}x)^{${q}/x} = e^c$. Find $c$.`, p * q, `$c = \\lim\\dfrac{${q}}x \\cdot ${p}x = ${p * q}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.int(2, 6);
      return mcNumbers(
        `$\\lim_{x \\to \\infty}\\left(1 + \\dfrac{${k}}x\\right)^x$ equals`,
        { text: `$e^{${k}}$`, why: `$e^{\\lim x \\cdot ${k}/x}$.` },
        [{ text: "1", why: "$1^\\infty$ is indeterminate.", misconception: "one-to-infinity" }, { text: "$\\infty$", why: "It stays bounded." }],
      );
    },
  },
];
