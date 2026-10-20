import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Integration by parts and the ILATE heuristic; repeated and cyclic parts; the eˣ(f + f′) form; partial fractions with distinct linear, repeated linear and irreducible quadratic factors; integrals of special types such as √(a² − x²) and √(x² ± a²). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "integration-techniques",
  title: "Integration by parts & partial fractions",
  summary: "Integration by parts, ∫u dv = uv − ∫v du, is the product rule backwards: it trades one integral for another, and works when differentiating u makes things simpler. Choose u in the order Inverse trig, Logarithm, Algebraic, Trigonometric, Exponential (ILATE). Rational functions split into partial fractions, one term per linear factor and one term for each power of a repeated factor, and each piece integrates to a logarithm, a power or an inverse tangent.",
  deps: ["indefinite-integrals"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "integration by parts", meaning: "$\\int u\\,dv = uv - \\int v\\,du$, from $(uv)' = u'v + uv'$." },
    { term: "ILATE", meaning: "A rule of thumb for choosing $u$: Inverse trigonometric, Logarithmic, Algebraic, Trigonometric, Exponential, earlier first." },
    { term: "partial fractions", meaning: "Writing a proper rational function as a sum of simple fractions over the factors of its denominator." },
  ],
  misconceptions: {
    "parts-wrong-u": "Chooses $u$ and $dv$ the wrong way round in integration by parts, so the new integral is harder than the old one.",
    "partial-fraction-repeated": "For a repeated factor $(x - a)^2$ writes only $\\dfrac A{x - a}$, missing the $\\dfrac B{(x - a)^2}$ term.",
  },
  steps: [
    {
      type: "motivate",
      title: "Products and fractions",
      body: "Substitution handles a function times its inner derivative, but $\\int x e^x\\,dx$, $\\int\\ln x\\,dx$ and $\\int\\dfrac{dx}{x^2 - 1}$ need something else. Integration by parts handles products where one factor simplifies when differentiated; partial fractions break rational functions into pieces from the table. Together they cover most JEE integrals.",
      realWorld: {
        title: "Laplace transforms",
        body: "Engineers analyse circuits and control systems with the Laplace transform $\\int_0^\\infty e^{-st}f(t)\\,dt$. Its key rules come from integration by parts, and inverting a transform almost always means splitting a rational function into partial fractions.",
      },
    },
    {
      type: "truth",
      statement: "**By parts**: $\\int u\\,dv = uv - \\int v\\,du$. Choose $u$ to become simpler when differentiated (ILATE order: inverse trig, log, algebraic, trig, exponential) and $dv$ to be easy to integrate. **Repeated parts** for $x^ne^x$, $x^n\\sin x$; **cyclic** for $e^{ax}\\sin bx$ (the original integral reappears; solve for it). Shortcut: $\\int e^x\\left(f(x) + f'(x)\\right)dx = e^xf(x) + C$. **Partial fractions** for a proper rational $\\dfrac{P}{Q}$: each factor $(x - a)$ gives $\\dfrac A{x - a}$; each $(x - a)^k$ gives $\\dfrac{A_1}{x - a} + \\dots + \\dfrac{A_k}{(x - a)^k}$; each irreducible $x^2 + px + q$ gives $\\dfrac{Bx + C}{x^2 + px + q}$. If $\\deg P \\ge \\deg Q$, divide first.",
      body: "**Cover-up rule** for distinct linear factors: the coefficient of $\\dfrac1{x - a}$ is the rest of the fraction evaluated at $x = a$. So $\\dfrac1{(x - 1)(x + 2)}$ has $A = \\tfrac13$ (cover $x - 1$, put $x = 1$) and $B = -\\tfrac13$. For repeated factors, cover-up finds only the top power's coefficient; compare coefficients for the rest. **Special types** (by parts or substitution): $\\int\\sqrt{a^2 - x^2}\\,dx = \\dfrac x2\\sqrt{a^2 - x^2} + \\dfrac{a^2}2\\sin^{-1}\\dfrac xa$; $\\int\\sqrt{x^2 \\pm a^2}\\,dx = \\dfrac x2\\sqrt{x^2 \\pm a^2} \\pm \\dfrac{a^2}2\\ln\\left\\lvert x + \\sqrt{x^2 \\pm a^2}\\right\\rvert$. Partial fractions also sum telescoping series (§{special-series}).",
    },
    {
      type: "predict",
      misconception: "parts-wrong-u",
      item: {
        kind: "mc",
        id: "itq-predict-1",
        prompt: "To find $\\int xe^x\\,dx$ by parts, the better choice is",
        options: [
          { id: "a", text: "$u = x$, $dv = e^x\\,dx$", correct: true, why: "$du = dx$ and $v = e^x$, leaving $\\int e^x\\,dx$." },
          { id: "b", text: "$u = e^x$, $dv = x\\,dx$", misconception: "parts-wrong-u", why: "Then $v = \\tfrac{x^2}2$ and the new integral $\\int\\tfrac{x^2}2e^x\\,dx$ is harder." },
          { id: "c", text: "Parts doesn't apply to this integral", why: "It is the textbook case for parts." },
        ],
      },
      reveal: {
        body: "With $u = x$: $\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = (x - 1)e^x + C$. Differentiating $x$ removed it, while $e^x$ integrates to itself. The other way round raises the power of $x$ each time, so the integrals get worse. ILATE puts the algebraic $x$ before the exponential: $u = x$.",
      },
      resolve: {
        kind: "mc",
        id: "itq-resolve-1",
        prompt: "For $\\int x\\ln x\\,dx$, take",
        options: [
          { id: "a", text: "$u = \\ln x$, $dv = x\\,dx$", correct: true, why: "$du = \\tfrac{dx}x$ cancels against $v = \\tfrac{x^2}2$." },
          { id: "b", text: "$u = x$, $dv = \\ln x\\,dx$", misconception: "parts-wrong-u", why: "You would first need $\\int\\ln x\\,dx$, and the result is messier; logs come before algebraic in ILATE." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "itq-check-1",
        prompt: "The partial-fraction form of $\\dfrac1{(x - 1)^2(x + 2)}$ is",
        options: [
          { id: "a", text: "$\\dfrac A{x - 1} + \\dfrac B{(x - 1)^2} + \\dfrac C{x + 2}$", correct: true, why: "One term for each power of the repeated factor." },
          { id: "b", text: "$\\dfrac A{x - 1} + \\dfrac B{x + 2}$", misconception: "partial-fraction-repeated", why: "This can't produce the $(x - 1)^2$ in the denominator." },
          { id: "c", text: "$\\dfrac A{(x - 1)^2} + \\dfrac B{x + 2}$", why: "The first-power term $\\tfrac{A}{x - 1}$ is needed too." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "itq-check-2",
        prompt: "$\\int\\ln x\\,dx$ is",
        options: [
          { id: "a", text: "$x\\ln x - x + C$", correct: true, why: "Parts with $u = \\ln x$, $dv = dx$." },
          { id: "b", text: "$\\dfrac1x + C$", why: "That is the derivative of $\\ln x$." },
          { id: "c", text: "$\\dfrac{(\\ln x)^2}2 + C$", why: "That integrates $\\tfrac{\\ln x}x$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Integration by parts underlies Stein's identity and the reparameterisation and score-function gradient estimators used to train variational autoencoders; it is also how the expectation of a non-negative variable becomes $\\int_0^\\infty P(X > t)\\,dt$ (§{expectation}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "itq-produce-1", prompt: "$\\int xe^x\\,dx = (ax + b)e^x + C$. Find $a + b$.", answer: 0, explain: "$(x - 1)e^x$: $a = 1$, $b = -1$." },
        { kind: "number", id: "itq-produce-2", prompt: "$\\dfrac1{(x - 1)(x + 1)} = \\dfrac A{x - 1} + \\dfrac B{x + 1}$. Find $A$.", answer: 0.5, explain: "Cover-up at $x = 1$: $\\tfrac1{1 + 1}$." },
        {
          kind: "mc",
          id: "itq-produce-3",
          prompt: "For $\\int x^2e^x\\,dx$ by parts, take",
          options: [
            { id: "a", text: "$u = x^2$, $dv = e^x\\,dx$", correct: true, why: "Two rounds reduce $x^2$ to a constant." },
            { id: "b", text: "$u = e^x$, $dv = x^2\\,dx$", misconception: "parts-wrong-u", why: "The power of $x$ would grow each round." },
          ],
        },
        {
          kind: "mc",
          id: "itq-produce-4",
          prompt: "The partial-fraction form of $\\dfrac{x + 3}{(x + 1)^2}$ is",
          options: [
            { id: "a", text: "$\\dfrac A{x + 1} + \\dfrac B{(x + 1)^2}$", correct: true, why: "Here $A = 1$, $B = 2$." },
            { id: "b", text: "$\\dfrac A{x + 1}$", misconception: "partial-fraction-repeated", why: "A repeated factor needs every power up to 2." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "itq-review-1", prompt: "$\\int x\\cos x\\,dx = x\\sin x + k\\cos x + C$. Find $k$.", answer: 1, explain: "$x\\sin x - \\int\\sin x\\,dx = x\\sin x + \\cos x$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "cyclic integrals",
      body: "For $I = \\int e^x\\sin x\\,dx$, parts twice gives $I = e^x\\sin x - e^x\\cos x - I$, so $I = \\tfrac12e^x(\\sin x - \\cos x) + C$. In general $\\int e^{ax}\\sin bx\\,dx = \\dfrac{e^{ax}}{a^2 + b^2}(a\\sin bx - b\\cos bx) + C$.",
    },
    {
      type: "definition",
      term: "irreducible quadratic factors",
      body: "$\\dfrac{1}{x(x^2 + 1)} = \\dfrac Ax + \\dfrac{Bx + C}{x^2 + 1}$: $A = 1$ by cover-up, then comparing coefficients gives $B = -1$, $C = 0$. The $\\dfrac{-x}{x^2 + 1}$ piece integrates to $-\\tfrac12\\ln(x^2 + 1)$, and a constant over $x^2 + 1$ gives $\\tan^{-1}x$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "integration by parts",
      statement: "$\\int u\\,dv = uv - \\int v\\,du$, i.e. $\\int u v'\\,dx = uv - \\int u'v\\,dx$.",
      proof: ["Integrate the product rule $(uv)' = u'v + uv'$ and rearrange."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the eˣ(f + f′) form",
      statement: "$\\int e^x\\left(f(x) + f'(x)\\right)dx = e^xf(x) + C$.",
      proof: ["$\\dfrac{d}{dx}\\left(e^xf(x)\\right) = e^xf(x) + e^xf'(x)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the cover-up rule",
      statement: "If $Q(x) = (x - a)R(x)$ with $R(a) \\ne 0$, the coefficient of $\\dfrac1{x - a}$ in $\\dfrac{P(x)}{Q(x)}$ is $\\dfrac{P(a)}{R(a)}$.",
      proof: ["Multiply $\\dfrac PQ = \\dfrac A{x - a} + (\\text{other terms})$ by $x - a$: $\\dfrac PR = A + (x - a)(\\text{other terms})$.", "Put $x = a$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $\\int x\\cos x\\,dx$.",
      solution: ["$u = x$, $dv = \\cos x\\,dx$: $v = \\sin x$.", "$x\\sin x - \\int\\sin x\\,dx = x\\sin x + \\cos x + C$."],
      result: "$x\\sin x + \\cos x + C$.",
    },
    {
      type: "example",
      level: 2,
      title: "partial fractions",
      problem: "Find $\\int\\dfrac{dx}{(x - 1)(x + 2)}$.",
      solution: ["Cover-up: $\\dfrac13\\left(\\dfrac1{x - 1} - \\dfrac1{x + 2}\\right)$.", "$\\dfrac13\\ln\\left\\lvert\\dfrac{x - 1}{x + 2}\\right\\rvert + C$."],
      result: "$\\tfrac13\\ln\\left\\lvert\\tfrac{x - 1}{x + 2}\\right\\rvert + C$.",
    },
    {
      type: "example",
      level: 3,
      title: "a cyclic integral",
      problem: "Find $\\int e^x\\sin x\\,dx$.",
      solution: ["Parts twice: $I = e^x\\sin x - \\int e^x\\cos x\\,dx = e^x\\sin x - e^x\\cos x - I$.", "$2I = e^x(\\sin x - \\cos x)$."],
      result: "$\\tfrac12e^x(\\sin x - \\cos x) + C$.",
    },
  ],
  pitfalls: [
    { wrong: "Pick $u$ at random.", right: "Follow ILATE: $u$ should simplify when differentiated." },
    { wrong: "One term for a repeated factor.", right: "$\\dfrac{A_1}{x - a} + \\dots + \\dfrac{A_k}{(x - a)^k}$." },
    { wrong: "Use partial fractions on an improper fraction.", right: "Divide first when $\\deg P \\ge \\deg Q$." },
  ],
  formulas: [
    { label: "Parts", tex: "\\int u\\,dv = uv - \\int v\\,du" },
    { label: "Shortcut", tex: "\\int e^x(f + f')\\,dx = e^xf + C" },
    { label: "Repeated factor", tex: "\\tfrac{A}{x - a} + \\tfrac{B}{(x - a)^2}" },
    { label: "Circle form", tex: "\\int\\sqrt{a^2 - x^2}\\,dx = \\tfrac x2\\sqrt{a^2 - x^2} + \\tfrac{a^2}2\\sin^{-1}\\tfrac xa" },
  ],
  exercises: [
    ex(1, num("itqx-ex-1", "$\\int xe^{2x}\\,dx = e^{2x}(ax + b) + C$. Find $a$.", 0.5, "$\\tfrac x2e^{2x} - \\tfrac14e^{2x}$."), ["$a = \\tfrac12$, $b = -\\tfrac14$."]),
    ex(1, num("itqx-ex-2", "$F' = \\ln x$ and $F(1) = -1$. Find $F(e)$.", 0, "$F = x\\ln x - x$."), ["$e - e = 0$."]),
    ex(2, dp("itqx-ex-3", "$F' = x\\sin x$ and $F(0) = 0$. Find $F(\\pi)$.", Math.PI, "$F = \\sin x - x\\cos x$."), ["$\\pi \\approx 3.142$."]),
    ex(2, fr("itqx-ex-4", "$\\dfrac1{(x - 1)(x + 2)} = \\dfrac A{x - 1} + \\dfrac B{x + 2}$. Find $A$.", 1 / 3, "Cover-up at $x = 1$."), ["$\\tfrac13$."]),
    ex(2, num("itqx-ex-5", "$\\dfrac{3x + 5}{(x + 1)(x + 2)} = \\dfrac A{x + 1} + \\dfrac B{x + 2}$. Find $B$.", 1, "Cover-up at $x = -2$: $\\tfrac{-1}{-1}$."), ["$A = 2$, $B = 1$."]),
    ex(3, fr("itqx-ex-6", "$\\dfrac1{(x - 1)^2(x + 2)} = \\dfrac A{x - 1} + \\dfrac B{(x - 1)^2} + \\dfrac C{x + 2}$. Find $C$.", 1 / 9, "Cover-up at $x = -2$: $\\tfrac1{(-3)^2}$."), ["$B = \\tfrac13$, $C = \\tfrac19$, $A = -\\tfrac19$."]),
    ex(3, dp("itqx-ex-7", "$F' = e^x(\\sin x + \\cos x)$ and $F(0) = 0$. Find $F(\\pi/2)$.", Math.exp(Math.PI / 2), "$F = e^x\\sin x$."), ["$e^{\\pi/2} \\approx 4.810$."]),
    ex(3, mc("itqx-ex-8", "$\\int e^x\\sin x\\,dx$ is", ["$\\tfrac12e^x(\\sin x - \\cos x) + C$", "Cyclic parts."], [["$e^x\\cos x + C$", "Its derivative is $e^x(\\cos x - \\sin x)$."], ["$-e^x\\cos x + C$", "Its derivative is $e^x(\\sin x - \\cos x)$."]]), ["Differentiate to check."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const lf = (p: number) => (p === 0 ? "x" : `x ${p < 0 ? "+" : "-"} ${Math.abs(p)}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const p = r.int(-5, 5);
      let q = r.int(-5, 5);
      if (q === p) q = p + r.pick([-2, -1, 1, 2]);
      const v = 1 / (p - q);
      return n(`$\\dfrac1{(${lf(p)})(${lf(q)})} = \\dfrac A{${lf(p)}} + \\dfrac B{${lf(q)}}$. Find $A$ (3 decimals).`, Math.round(v * 1000) / 1000, `Cover-up at $x = ${p}$: $\\dfrac1{${p} - (${q})}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(-4, 4);
      let q = r.int(-4, 4);
      if (q === p) q = p + 1;
      const a = r.nonzero(-4, 4);
      const b = r.nonzero(-6, 6);
      const want = r.pick(["A", "B"] as const);
      const v = want === "A" ? (a * p + b) / (p - q) : (a * q + b) / (q - p);
      return n(`$\\dfrac{${a === 1 ? "" : a === -1 ? "-" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}}{(${lf(p)})(${lf(q)})} = \\dfrac A{${lf(p)}} + \\dfrac B{${lf(q)}}$. Find $${want}$ (3 decimals).`, Math.round(v * 1000) / 1000, want === "A" ? `Cover-up at $x = ${p}$: $\\dfrac{${a * p + b}}{${p - q}}$.` : `Cover-up at $x = ${q}$: $\\dfrac{${a * q + b}}{${q - p}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([1, 2, 4, -1, -2, 5]);
      const want = r.pick(["a", "b"] as const);
      const v = want === "a" ? 1 / k : -1 / (k * k);
      return n(`$\\int xe^{${k}x}\\,dx = e^{${k}x}(ax + b) + C$. Find $${want}$ (3 decimals).`, Math.round(v * 1000) / 1000, `Parts with $u = x$: $\\dfrac x{${k}}e^{${k}x} - \\dfrac1{${k * k}}e^{${k}x}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [g, nm] = r.pick([["e^x", "e^x"], ["\\sin x", "\\sin x"], ["\\cos x", "\\cos x"], ["e^{2x}", "e^{2x}"]] as const);
      const pw = r.pick([1, 2, 3]);
      const xp = pw === 1 ? "x" : `x^{${pw}}`;
      return mcNumbers(
        `For $\\int ${xp}${g}\\,dx$ by parts, take`,
        { text: `$u = ${xp}$, $dv = ${nm}\\,dx$`, why: "Differentiating the power of $x$ lowers it; ILATE puts algebraic before trig and exponential." },
        [{ text: `$u = ${nm}$, $dv = ${xp}\\,dx$`, why: "The power of $x$ would rise and the integral get harder.", misconception: "parts-wrong-u" }],
      );
    },
  },
];
