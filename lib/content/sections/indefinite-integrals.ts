import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Integration as anti-differentiation; the constant of integration; the table of fundamental integrals (powers, 1/x, exponentials, trigonometric and inverse-trigonometric forms); linearity; integration by substitution, including f′/f; integrals using trigonometric identities; the standard forms 1/(x² ± a²), 1/√(a² − x²), 1/√(x² ± a²). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "indefinite-integrals",
  title: "Indefinite integrals & substitution",
  summary: "Integration reverses differentiation: ∫f(x) dx = F(x) + C means F′ = f, and the constant C is there because every antiderivative differs from another by a constant. Each derivative in the table gives an integral, ∫xⁿ dx = xⁿ⁺¹/(n + 1) for n ≠ −1 and ∫dx/x = ln|x|. Substitution is the chain rule backwards: ∫f(g(x))g′(x) dx = ∫f(u) du. A linear inside, as in ∫cos 3x dx, brings in the factor 1/3.",
  deps: ["differentiation-methods"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "antiderivative", meaning: "A function $F$ with $F' = f$; all of them are $F + C$ for constants $C$." },
    { term: "integrand", meaning: "The function $f$ being integrated in $\\int f(x)\\,dx$." },
    { term: "substitution", meaning: "Replacing $g(x)$ by $u$ and $g'(x)\\,dx$ by $du$ to simplify an integral." },
  ],
  misconceptions: {
    "chain-factor-missing": "Integrates $f(ax + b)$ as $F(ax + b)$, forgetting to divide by $a$ (e.g. $\\int\\cos 3x\\,dx = \\sin 3x$).",
    "integral-product": "Thinks the integral of a product is the product of the integrals.",
  },
  steps: [
    {
      type: "motivate",
      title: "Running differentiation backwards",
      body: "Velocity is the derivative of position; given the velocity, what was the position? Rates of flow, of growth, of spending all need undoing a derivative. Integration is that undoing. It has no product rule or chain rule that works mechanically, so it rests on recognising derivatives and on substitution, and JEE integrals reward a well-practised table.",
      realWorld: {
        title: "From acceleration to position",
        body: "An accelerometer in a phone measures acceleration. Integrating once gives velocity (up to an unknown starting velocity, a constant of integration), and again gives position (another constant). Inertial navigation in aircraft and submarines works this way, correcting for the constants with occasional fixes.",
      },
    },
    {
      type: "truth",
      statement: "$\\int f(x)\\,dx = F(x) + C$ iff $F'(x) = f(x)$. **Table**: $\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1}$ ($n \\ne -1$); $\\int\\dfrac{dx}x = \\ln\\lvert x\\rvert$; $\\int e^x\\,dx = e^x$; $\\int a^x\\,dx = \\dfrac{a^x}{\\ln a}$; $\\int\\sin x = -\\cos x$; $\\int\\cos x = \\sin x$; $\\int\\sec^2x = \\tan x$; $\\int\\csc^2x = -\\cot x$; $\\int\\sec x\\tan x = \\sec x$; $\\int\\tan x = \\ln\\lvert\\sec x\\rvert$; $\\int\\sec x = \\ln\\lvert\\sec x + \\tan x\\rvert$; $\\int\\dfrac{dx}{\\sqrt{a^2 - x^2}} = \\sin^{-1}\\dfrac xa$; $\\int\\dfrac{dx}{x^2 + a^2} = \\dfrac1a\\tan^{-1}\\dfrac xa$; $\\int\\dfrac{dx}{x^2 - a^2} = \\dfrac1{2a}\\ln\\left\\lvert\\dfrac{x - a}{x + a}\\right\\rvert$; $\\int\\dfrac{dx}{\\sqrt{x^2 \\pm a^2}} = \\ln\\left\\lvert x + \\sqrt{x^2 \\pm a^2}\\right\\rvert$ (each $+ C$).",
      body: "**Linearity**: $\\int(af + bg) = a\\int f + b\\int g$. But there is no product rule: $\\int fg \\ne \\int f\\int g$ (check by differentiating); products need substitution or integration by parts (§{integration-techniques}). **Substitution**: if the integrand is $f(g(x))g'(x)$, put $u = g(x)$. Special cases: $\\int f(ax + b)\\,dx = \\dfrac1aF(ax + b)$, and $\\int\\dfrac{f'(x)}{f(x)}\\,dx = \\ln\\lvert f(x)\\rvert$. **Trigonometric identities** turn powers into integrable forms: $\\sin^2x = \\tfrac12(1 - \\cos 2x)$, $\\cos^2x = \\tfrac12(1 + \\cos 2x)$ (§{trig-identities}). Always check an answer by differentiating it.",
    },
    {
      type: "predict",
      misconception: "chain-factor-missing",
      item: {
        kind: "mc",
        id: "ain-predict-1",
        prompt: "$\\int\\cos 3x\\,dx$ is",
        options: [
          { id: "a", text: "$\\tfrac13\\sin 3x + C$", correct: true, why: "Differentiating $\\tfrac13\\sin 3x$ gives $\\cos 3x$." },
          { id: "b", text: "$\\sin 3x + C$", misconception: "chain-factor-missing", why: "Its derivative is $3\\cos 3x$, three times too big." },
          { id: "c", text: "$3\\sin 3x + C$", why: "Its derivative is $9\\cos 3x$." },
        ],
      },
      reveal: {
        body: "Check by differentiating: $\\dfrac{d}{dx}\\sin 3x = 3\\cos 3x$ by the chain rule. To get $\\cos 3x$ we need a third of that, so $\\int\\cos 3x\\,dx = \\tfrac13\\sin 3x + C$. In general, $\\int f(ax + b)\\,dx = \\tfrac1aF(ax + b) + C$: the chain rule multiplies by $a$, so integration divides by it.",
      },
      resolve: {
        kind: "mc",
        id: "ain-resolve-1",
        prompt: "$\\int e^{5x}\\,dx$ is",
        options: [
          { id: "a", text: "$\\tfrac15e^{5x} + C$", correct: true, why: "Divide by the inner coefficient." },
          { id: "b", text: "$e^{5x} + C$", misconception: "chain-factor-missing", why: "Its derivative is $5e^{5x}$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ain-check-1",
        prompt: "$\\int x \\cdot x^2\\,dx$ is",
        options: [
          { id: "a", text: "$\\dfrac{x^4}4 + C$", correct: true, why: "Multiply first: $\\int x^3\\,dx$." },
          { id: "b", text: "$\\dfrac{x^2}2 \\cdot \\dfrac{x^3}3 + C = \\dfrac{x^5}6 + C$", misconception: "integral-product", why: "Its derivative is $\\tfrac56x^4$, not $x^3$." },
          { id: "c", text: "$\\dfrac{x^3}3 + C$", why: "That integrates $x^2$ only." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ain-check-2",
        prompt: "$\\int\\dfrac{dx}x$ is",
        options: [
          { id: "a", text: "$\\ln\\lvert x\\rvert + C$", correct: true, why: "The power rule fails at $n = -1$; $\\ln\\lvert x\\rvert$ has derivative $\\tfrac1x$." },
          { id: "b", text: "$-\\dfrac1{x^2} + C$", why: "That is the derivative of $\\tfrac1x$, not its integral." },
          { id: "c", text: "$\\dfrac{x^2}2 + C$", why: "That integrates $x$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A probability density integrates to 1, and its antiderivative is the cumulative distribution function (§{continuous-family}); computing CDFs, expectations and normalising constants are integration problems. Where no closed form exists, as for the normal CDF, numerical integration or Monte Carlo (§{monte-carlo}) takes over.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ain-produce-1", prompt: "$F$ is an antiderivative of $6x^2$ with $F(0) = 1$. Find $F(1)$.", answer: 3, explain: "$F = 2x^3 + 1$." },
        { kind: "number", id: "ain-produce-2", prompt: "$F' = \\dfrac{2x}{x^2 + 1}$ and $F(0) = 0$. Find $F(1)$, to 3 decimals.", answer: Math.round(Math.log(2) * 1000) / 1000, tolerance: 0.001, explain: "$F = \\ln(x^2 + 1)$, an $f'/f$ form." },
        {
          kind: "mc",
          id: "ain-produce-3",
          prompt: "$\\int\\sin 2x\\,dx$ is",
          options: [
            { id: "a", text: "$-\\tfrac12\\cos 2x + C$", correct: true, why: "Divide by 2." },
            { id: "b", text: "$-\\cos 2x + C$", misconception: "chain-factor-missing", why: "Its derivative is $2\\sin 2x$." },
          ],
        },
        {
          kind: "mc",
          id: "ain-produce-4",
          prompt: "$\\int xe^x\\,dx$ is",
          options: [
            { id: "a", text: "$xe^x - e^x + C$", correct: true, why: "Differentiate to check: $e^x + xe^x - e^x = xe^x$." },
            { id: "b", text: "$\\dfrac{x^2}2e^x + C$", misconception: "integral-product", why: "Its derivative is $xe^x + \\tfrac{x^2}2e^x$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "ain-review-1", prompt: "$F$ is an antiderivative of $3x^2$ with $F(0) = 0$. Find $F(2)$.", answer: 8, explain: "$F = x^3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "choosing a substitution",
      body: "Look for a function whose derivative also appears: in $\\int x^2(x^3 + 1)^5\\,dx$, $u = x^3 + 1$ has $du = 3x^2\\,dx$, so the integral is $\\tfrac13\\int u^5\\,du = \\tfrac1{18}(x^3 + 1)^6 + C$. For $\\sqrt{a^2 - x^2}$ try $x = a\\sin\\theta$; for $x^2 + a^2$ try $x = a\\tan\\theta$; for $\\sqrt{x^2 - a^2}$ try $x = a\\sec\\theta$.",
    },
    {
      type: "definition",
      term: "quadratic denominators",
      body: "Complete the square to reach a standard form: $\\int\\dfrac{dx}{x^2 + 4x + 13} = \\int\\dfrac{dx}{(x + 2)^2 + 9} = \\tfrac13\\tan^{-1}\\dfrac{x + 2}3 + C$. For $\\int\\dfrac{px + q}{ax^2 + bx + c}\\,dx$, write the numerator as $\\lambda \\cdot$ (derivative of the denominator) $+ \\mu$, giving a log term plus a standard form.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "antiderivatives differ by a constant",
      statement: "If $F' = G' = f$ on an interval, then $F - G$ is constant there.",
      proof: ["$(F - G)' = 0$ on the interval, so $F - G$ is constant by the mean value theorem (§{mean-value-theorems})."],
    },
    {
      type: "theorem",
      name: "integration by substitution",
      statement: "$\\int f(g(x))g'(x)\\,dx = F(g(x)) + C$, where $F' = f$.",
      proof: ["By the chain rule, $\\dfrac{d}{dx}F(g(x)) = F'(g(x))g'(x) = f(g(x))g'(x)$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the f′/f form",
      statement: "$\\int\\dfrac{f'(x)}{f(x)}\\,dx = \\ln\\lvert f(x)\\rvert + C$.",
      proof: ["Substitute $u = f(x)$: $\\int\\dfrac{du}u = \\ln\\lvert u\\rvert + C$. Hence $\\int\\tan x\\,dx = -\\ln\\lvert\\cos x\\rvert = \\ln\\lvert\\sec x\\rvert$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $\\int\\left(3x^2 + \\dfrac2x - e^x\\right)dx$.",
      solution: ["Integrate term by term using the table.", "$x^3 + 2\\ln\\lvert x\\rvert - e^x + C$."],
      result: "$x^3 + 2\\ln\\lvert x\\rvert - e^x + C$.",
    },
    {
      type: "example",
      level: 2,
      title: "substitution",
      problem: "Find $\\int 2x\\cos(x^2)\\,dx$.",
      solution: ["Put $u = x^2$, $du = 2x\\,dx$.", "$\\int\\cos u\\,du = \\sin u + C = \\sin(x^2) + C$."],
      result: "$\\sin(x^2) + C$.",
    },
    {
      type: "example",
      level: 3,
      title: "a square of sine",
      problem: "Find $\\int\\sin^2x\\,dx$.",
      solution: ["$\\sin^2x = \\tfrac12(1 - \\cos 2x)$.", "$\\int = \\dfrac x2 - \\dfrac{\\sin 2x}4 + C$."],
      result: "$\\dfrac x2 - \\dfrac{\\sin 2x}4 + C$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\int\\cos 3x\\,dx = \\sin 3x$.", right: "Divide by the inner coefficient: $\\tfrac13\\sin 3x$." },
    { wrong: "$\\int fg = \\int f\\int g$.", right: "There is no product rule for integrals; use substitution or parts." },
    { wrong: "Apply the power rule to $x^{-1}$.", right: "$\\int\\dfrac{dx}x = \\ln\\lvert x\\rvert + C$." },
  ],
  formulas: [
    { label: "Power", tex: "\\int x^n\\,dx = \\tfrac{x^{n+1}}{n + 1} + C\\ (n \\ne -1)" },
    { label: "Linear inside", tex: "\\int f(ax + b)\\,dx = \\tfrac1aF(ax + b) + C" },
    { label: "Log form", tex: "\\int\\tfrac{f'}{f}\\,dx = \\ln\\lvert f\\rvert + C" },
    { label: "Inverse tan", tex: "\\int\\tfrac{dx}{x^2 + a^2} = \\tfrac1a\\tan^{-1}\\tfrac xa + C" },
    { label: "Inverse sin", tex: "\\int\\tfrac{dx}{\\sqrt{a^2 - x^2}} = \\sin^{-1}\\tfrac xa + C" },
  ],
  exercises: [
    ex(1, num("ainx-ex-1", "$F' = 4x^3 + 2x$ and $F(0) = 0$. Find $F(2)$.", 20, "$F = x^4 + x^2$."), ["$16 + 4 = 20$."]),
    ex(1, num("ainx-ex-2", "$\\int\\cos 2x\\,dx = k\\sin 2x + C$. Find $k$.", 0.5, "Divide by 2."), ["$\\tfrac12$."]),
    ex(2, fr("ainx-ex-3", "$\\int e^{3x}\\,dx = ke^{3x} + C$. Find $k$.", 1 / 3, "Divide by 3."), ["$\\tfrac13$."]),
    ex(2, num("ainx-ex-4", "$\\int\\dfrac x{x^2 + 1}\\,dx = k\\ln(x^2 + 1) + C$. Find $k$.", 0.5, "Half of an $f'/f$ form."), ["$\\tfrac12$."]),
    ex(2, fr("ainx-ex-5", "$\\int\\dfrac{dx}{x^2 + 9} = k\\tan^{-1}\\dfrac x3 + C$. Find $k$.", 1 / 3, "$\\tfrac1a$ with $a = 3$."), ["$\\tfrac13$."]),
    ex(3, dp("ainx-ex-6", "$F' = \\sin^2x$ and $F(0) = 0$. Find $F(\\pi)$.", Math.PI / 2, "$F = \\tfrac x2 - \\tfrac{\\sin 2x}4$."), ["$\\tfrac\\pi2 \\approx 1.571$."]),
    ex(3, dp("ainx-ex-7", "$F' = \\tan x$ and $F(0) = 0$. Find $F(\\pi/3)$.", Math.log(2), "$F = \\ln\\lvert\\sec x\\rvert$."), ["$\\ln 2 \\approx 0.693$."]),
    ex(3, mc("ainx-ex-8", "$\\int\\dfrac{dx}{\\sqrt{4 - x^2}}$ is", ["$\\sin^{-1}\\dfrac x2 + C$", "The standard form with $a = 2$."], [["$\\tfrac12\\sin^{-1}\\dfrac x2 + C$", "Unlike the $\\tan^{-1}$ form, there's no $\\tfrac1a$ factor; differentiate to check."], ["$\\tan^{-1}\\dfrac x2 + C$", "That needs $x^2 + 4$ without a square root."]]), ["Differentiate $\\sin^{-1}\\tfrac x2$: $\\dfrac{1/2}{\\sqrt{1 - x^2/4}} = \\dfrac1{\\sqrt{4 - x^2}}$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-3, 3);
      const b = r.nonzero(-4, 4);
      const c = r.int(-5, 5);
      const x0 = r.int(1, 3);
      const F = (x: number) => a * x ** 3 + b * x * x + c;
      return n(`$F' = ${3 * a}x^2 ${2 * b < 0 ? "-" : "+"} ${Math.abs(2 * b)}x$ and $F(0) = ${c}$. Find $F(${x0})$.`, F(x0), `$F = ${a}x^3 + ${b}x^2 + ${c}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.nonzero(-6, 6);
      const fn = r.pick(["exp", "sin", "cos"] as const);
      const v = fn === "sin" ? -1 / k : 1 / k;
      const integrand = fn === "exp" ? `e^{${k}x}` : `\\${fn} ${k}x`;
      const result = fn === "exp" ? `ke^{${k}x}` : fn === "sin" ? `k\\cos ${k}x` : `k\\sin ${k}x`;
      return n(`$\\int ${integrand}\\,dx = ${result} + C$. Find $k$ (3 decimals).`, Math.round(v * 1000) / 1000, fn === "exp" ? `$\\tfrac1{${k}}e^{${k}x}$.` : fn === "sin" ? `$-\\tfrac1{${k}}\\cos ${k}x$.` : `$\\tfrac1{${k}}\\sin ${k}x$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(2, 9);
      return n(`$\\int\\dfrac{dx}{x^2 + ${a * a}} = k\\tan^{-1}\\dfrac x{${a}} + C$. Find $k$ (3 decimals).`, Math.round((1 / a) * 1000) / 1000, `$k = \\tfrac1a = \\tfrac1{${a}}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([2, 3, 4, 5]);
      return mcNumbers(
        `$\\int e^{${k}x}\\,dx$ is`,
        { text: `$\\tfrac1{${k}}e^{${k}x} + C$`, why: `Its derivative is $e^{${k}x}$.` },
        [{ text: `$e^{${k}x} + C$`, why: `Its derivative is $${k}e^{${k}x}$.`, misconception: "chain-factor-missing" }, { text: `$${k}e^{${k}x} + C$`, why: `Its derivative is $${k * k}e^{${k}x}$.` }],
      );
    },
  },
];
