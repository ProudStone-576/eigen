import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Composition of functions and its domain; inverse functions (existence, finding, graphs, inverse of a composition); even and odd functions and decomposition; periodic functions and their periods. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "composition-inverse",
  title: "Composition, inverses, even, odd & periodic functions",
  summary: "Composing functions feeds the output of one into the next, and order matters: f(g(x)) is usually not g(f(x)). A function has an inverse exactly when it is a bijection, and the inverse undoes it; its graph is the mirror image in y = x. Symmetry gives two useful classes, even and odd functions, and periodic functions repeat after a fixed period.",
  deps: ["function-graphs"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "composite", meaning: "$(f \\circ g)(x) = f(g(x))$: apply $g$ first, then $f$." },
    { term: "inverse function", meaning: "$f^{-1}$ with $f^{-1}(f(x)) = x$ and $f(f^{-1}(y)) = y$; it exists only for bijections." },
    { term: "period", meaning: "The smallest $T > 0$ with $f(x + T) = f(x)$ for all $x$." },
  ],
  misconceptions: {
    "composition-commutes": "Assumes $f(g(x)) = g(f(x))$.",
    "inverse-reciprocal": "Confuses the inverse function $f^{-1}(x)$ with the reciprocal $1/f(x)$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Doing and undoing",
      body: "Converting Celsius to Fahrenheit and adding a 2° correction is a composition; reading a thermometer backwards is an inverse. Exams test whether you can compose in the right order, find inverses, spot when they don't exist, and use symmetry and periodicity to shortcut a calculation.",
      realWorld: {
        title: "Encryption",
        body: "Encryption functions must be bijections, so that decryption, the inverse, recovers every message exactly. A layered cipher is a composition, and decrypting undoes the layers in reverse order: $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$.",
      },
    },
    {
      type: "truth",
      statement: "$(f \\circ g)(x) = f(g(x))$ is defined where $x \\in \\operatorname{dom}g$ and $g(x) \\in \\operatorname{dom}f$; in general $f \\circ g \\ne g \\circ f$. A function $f : A \\to B$ has an inverse $f^{-1} : B \\to A$ if and only if it is **bijective**; to find it, solve $y = f(x)$ for $x$ and swap the letters. The graph of $f^{-1}$ is the reflection of the graph of $f$ in $y = x$, and $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$. $f$ is **even** if $f(-x) = f(x)$ (symmetric in the $y$-axis) and **odd** if $f(-x) = -f(x)$ (symmetric through the origin).",
      body: "Every function on a symmetric domain splits as even plus odd: $f(x) = \\dfrac{f(x) + f(-x)}{2} + \\dfrac{f(x) - f(-x)}{2}$. Even × even and odd × odd are even; even × odd is odd. A function is **periodic** with period $T$ if $f(x + T) = f(x)$; $f(ax + b)$ has period $T/\\lvert a\\rvert$, and a sum of functions with periods $T_1, T_2$ (commensurable) has period dividing their least common multiple. $f^{-1}(x)$ is not $\\dfrac1{f(x)}$, which would be written $[f(x)]^{-1}$.",
    },
    {
      type: "predict",
      misconception: "composition-commutes",
      item: {
        kind: "mc",
        id: "cmi-predict-1",
        prompt: "$f(x) = 2x + 3$ and $g(x) = x^2$. Compare $f(g(2))$ and $g(f(2))$.",
        options: [
          { id: "a", text: "11 and 49: different", correct: true, why: "$f(4) = 11$; $g(7) = 49$." },
          { id: "b", text: "Both 11: order doesn't matter", misconception: "composition-commutes", why: "Squaring then doubling isn't doubling then squaring." },
          { id: "c", text: "Both 49", why: "Compute each in order." },
        ],
      },
      reveal: {
        body: "$f(g(x)) = 2x^2 + 3$ squares first; $g(f(x)) = (2x + 3)^2$ doubles and adds first. At $x = 2$ they give 11 and 49. Composition is like putting on socks and shoes: order matters, and undoing it reverses the order.",
      },
      resolve: {
        kind: "mc",
        id: "cmi-resolve-1",
        prompt: "With $f(x) = x + 1$ and $g(x) = 3x$, $(g \\circ f)(2)$ is",
        options: [
          { id: "a", text: "9", correct: true, why: "$f(2) = 3$, then $g(3) = 9$." },
          { id: "b", text: "7, the same as $(f \\circ g)(2)$", misconception: "composition-commutes", why: "$(f \\circ g)(2) = 7$ but $(g \\circ f)(2) = 9$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cmi-check-1",
        prompt: "For $f(x) = 2x - 4$, $f^{-1}(6)$ equals",
        options: [
          { id: "a", text: "5", correct: true, why: "$f^{-1}(y) = (y + 4)/2$." },
          { id: "b", text: "$\\tfrac18$", misconception: "inverse-reciprocal", why: "That is $1/f(6)$, a reciprocal." },
          { id: "c", text: "8", why: "That is $f(6)$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cmi-check-2",
        prompt: "$f(x) = x^3 + x$ is",
        options: [
          { id: "a", text: "odd", correct: true, why: "$f(-x) = -x^3 - x = -f(x)$." },
          { id: "b", text: "even", why: "Odd powers change sign." },
          { id: "c", text: "neither", why: "Check $f(-x)$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A neural network is a composition of layers, $f_L \\circ \\dots \\circ f_1$, and backpropagation differentiates it with the chain rule in reverse order (§{backprop}). Data pipelines apply transforms in sequence, and their inverses (un-normalising predictions, say) must run in the opposite order.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cmi-produce-1", prompt: "$f(x) = \\dfrac{2x + 1}{x - 3}$. Find $f^{-1}(3)$.", answer: 10, explain: "$f^{-1}(x) = \\dfrac{3x + 1}{x - 2}$." },
        { kind: "number", id: "cmi-produce-2", prompt: "For $f(x) = x^2 + x$, find the even part at $x = 3$: $\\tfrac12[f(3) + f(-3)]$.", answer: 9, explain: "$\\tfrac12(12 + 6)$." },
        {
          kind: "mc",
          id: "cmi-produce-3",
          prompt: "If $f(x) = x + 5$, then $f^{-1}(x)$ is",
          options: [
            { id: "a", text: "$x - 5$", correct: true, why: "It undoes adding 5." },
            { id: "b", text: "$\\dfrac{1}{x + 5}$", misconception: "inverse-reciprocal", why: "That is the reciprocal." },
          ],
        },
        {
          kind: "mc",
          id: "cmi-produce-4",
          prompt: "With $f(x) = x^2$ and $g(x) = x - 1$, $f(g(x))$ is",
          options: [
            { id: "a", text: "$(x - 1)^2$", correct: true, why: "Apply $g$, then square." },
            { id: "b", text: "$x^2 - 1$", misconception: "composition-commutes", why: "That is $g(f(x))$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cmi-review-1", prompt: "For $f(x) = 5x - 2$, find $f^{-1}(8)$.", answer: 2, explain: "$(8 + 2)/5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "restricting to get an inverse",
      body: "A function that isn't one-one can be inverted on a restricted domain where it is: $x^2$ on $[0, \\infty)$ has inverse $\\sqrt x$; $x^2 - 4x$ on $[2, \\infty)$ has inverse $2 + \\sqrt{x + 4}$. The inverse trigonometric functions are defined this way.",
    },
    {
      type: "definition",
      term: "periodic functions",
      body: "$\\{x\\}$ has period 1; $\\sin x$ and $\\cos x$ have period $2\\pi$, $\\tan x$ has period $\\pi$. $f(ax)$ has period $T/\\lvert a\\rvert$: $\\{3x\\}$ has period $\\tfrac13$. A constant function is periodic but has no smallest period.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "inverse of a composition",
      statement: "If $f$ and $g$ are bijections, $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$.",
      proof: ["$(g^{-1} \\circ f^{-1}) \\circ (f \\circ g) = g^{-1} \\circ (f^{-1} \\circ f) \\circ g = g^{-1} \\circ g$, the identity; similarly in the other order."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "even–odd decomposition",
      statement: "On a domain symmetric about 0, every $f$ is uniquely the sum of an even function $E(x) = \\tfrac12[f(x) + f(-x)]$ and an odd function $O(x) = \\tfrac12[f(x) - f(-x)]$.",
      proof: ["$E(-x) = E(x)$ and $O(-x) = -O(x)$ by construction, and $E + O = f$. If $f = E_1 + O_1$ also, then $E - E_1 = O_1 - O$ is both even and odd, hence 0."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "finding an inverse",
      statement: "Write $y = f(x)$, solve for $x$ in terms of $y$, then swap $x$ and $y$. Check the result is defined on the range of $f$ and that $f(f^{-1}(x)) = x$.",
      proof: ["Solving expresses the input in terms of the output, which is what the inverse does."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$f(x) = 3x - 7$. Find $f^{-1}(x)$ and check it.",
      solution: ["$y = 3x - 7$ gives $x = \\dfrac{y + 7}{3}$, so $f^{-1}(x) = \\dfrac{x + 7}{3}$.", "$f(f^{-1}(x)) = (x + 7) - 7 = x$. ✓"],
      result: "$f^{-1}(x) = \\tfrac{x + 7}{3}$.",
    },
    {
      type: "example",
      level: 2,
      title: "a rational function",
      problem: "Find the inverse of $f(x) = \\dfrac{2x + 1}{x - 3}$, $x \\ne 3$.",
      solution: ["$y(x - 3) = 2x + 1$ gives $x(y - 2) = 3y + 1$.", "$f^{-1}(x) = \\dfrac{3x + 1}{x - 2}$, $x \\ne 2$ (2 is the value $f$ never takes)."],
      result: "$\\dfrac{3x + 1}{x - 2}$.",
    },
    {
      type: "example",
      level: 3,
      title: "a domain of a composite",
      problem: "$f(x) = \\sqrt x$ and $g(x) = 4 - x^2$. Find the domain of $f \\circ g$.",
      solution: ["Need $g(x) \\ge 0$: $4 - x^2 \\ge 0$.", "$-2 \\le x \\le 2$."],
      result: "$[-2, 2]$.",
    },
  ],
  pitfalls: [
    { wrong: "$f \\circ g = g \\circ f$.", right: "Compose in the stated order; they usually differ." },
    { wrong: "$f^{-1}(x) = 1/f(x)$.", right: "$f^{-1}$ undoes $f$; $1/f(x)$ is the reciprocal." },
    { wrong: "Invert a function that isn't one-one.", right: "Restrict its domain first." },
  ],
  formulas: [
    { label: "Composition", tex: "(f \\circ g)(x) = f(g(x))" },
    { label: "Inverse of composite", tex: "(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}" },
    { label: "Even, odd", tex: "f(-x) = f(x),\\ f(-x) = -f(x)" },
    { label: "Period of $f(ax + b)$", tex: "T/\\lvert a\\rvert" },
  ],
  exercises: [
    ex(1, num("cmix-ex-1", "$f(x) = x + 1$, $g(x) = 3x$. Find $(f \\circ g)(2)$.", 7, "$f(6)$."), ["$7$."]),
    ex(1, num("cmix-ex-2", "$f(x) = 4x + 1$. Find $f^{-1}(9)$.", 2, "$(9 - 1)/4$."), ["$2$."]),
    ex(2, fr("cmix-ex-3", "Find the period of $\\{2x\\}$.", 0.5, "$1/2$."), ["$\\tfrac12$."]),
    ex(2, num("cmix-ex-4", "$f(x) = x^2 - 4x$ on $[2, \\infty)$. Find $f^{-1}(5)$.", 5, "$x^2 - 4x = 5$, $x \\ge 2$."), ["$x = 5$ (reject $-1$)."]),
    ex(2, num("cmix-ex-5", "$f(x) = 2x + 1$, $g(x) = x - 3$. Find $(f \\circ g)^{-1}(7)$.", 6, "$g^{-1}(f^{-1}(7)) = g^{-1}(3)$."), ["$f^{-1}(7) = 3$, $g^{-1}(3) = 6$."]),
    ex(3, num("cmix-ex-6", "For $f(x) = e^x$, find the odd part at $x = \\ln 2$, that is $\\tfrac12[f(x) - f(-x)]$.", 0.75, "$\\tfrac12(2 - \\tfrac12)$."), ["$0.75$ ($\\sinh\\ln 2$)."]),
    ex(3, num("cmix-ex-7", "$f(x) = \\dfrac{x}{x - 1}$. Find $f(f(5))$.", 5, "$f$ is its own inverse."), ["$f(5) = \\tfrac54$; $f(\\tfrac54) = 5$."]),
    ex(3, mc("cmix-ex-8", "If $f$ is even and $g$ is odd, then $f(x)g(x)$ is", ["odd", "$f(-x)g(-x) = -f(x)g(x)$."], [["even", "One sign change survives."], ["neither, in general", "It is always odd."]]), ["Like multiplying $+1$ by $-1$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-4, 5);
      const b = r.int(-6, 6);
      const x = r.int(-5, 5);
      const y = a * x + b;
      return n(`$f(x) = ${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}$. Find $f^{-1}(${y})$.`, x, `$f^{-1}(y) = (y - (${b}))/${a}$: $(${y} - (${b}))/${a} = ${x}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-3, 4);
      const b = r.int(-5, 5);
      const c = r.int(-3, 3);
      const x = r.int(-3, 3);
      const order = r.pick(["fg", "gf"] as const);
      const f = (t: number) => a * t + b;
      const g = (t: number) => t * t + c;
      const v = order === "fg" ? f(g(x)) : g(f(x));
      return n(`$f(x) = ${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}$ and $g(x) = x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)}$. Find $${order === "fg" ? "f(g" : "g(f"}(${x}))$.`, v, order === "fg" ? `$g(${x}) = ${g(x)}$, then $f(${g(x)}) = ${v}$.` : `$f(${x}) = ${f(x)}$, then $g(${f(x)}) = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([2, 3, 4, 5]);
      const which = r.pick(["frac", "frac2"] as const);
      return n(`Find the period of $\\{${a}x${which === "frac2" ? " + 1" : ""}\\}$ (3 decimals).`, Math.round((1 / a) * 1000) / 1000, `$\\{x\\}$ has period 1, so $\\{${a}x + b\\}$ has period $1/${a}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.pick([2, 3, 5]);
      const b = r.pick([1, 4, 7]);
      return mcNumbers(
        `$f(x) = ${a}x + ${b}$. Which is $f^{-1}(x)$?`,
        { text: `$\\dfrac{x - ${b}}{${a}}$`, why: `It undoes multiplying by ${a} and adding ${b}.` },
        [
          { text: `$\\dfrac{1}{${a}x + ${b}}$`, why: "That is the reciprocal $1/f(x)$.", misconception: "inverse-reciprocal" },
          { text: `$${a}x - ${b}$`, why: "Undo the steps in reverse order." },
        ],
      );
    },
  },
];
