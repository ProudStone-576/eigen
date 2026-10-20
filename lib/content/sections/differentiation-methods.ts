import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Methods of differentiation: sum, product and quotient rules; the chain rule; derivatives of trigonometric, inverse trigonometric, exponential and logarithmic functions; implicit differentiation; logarithmic differentiation; parametric differentiation; derivative of an inverse function; second derivatives, including parametric. */

const base: ConceptNode = {
  id: "differentiation-methods",
  title: "Methods of differentiation",
  summary: "A short list of standard derivatives plus four rules differentiates almost anything: sums, products (uv)′ = u′v + uv′, quotients, and the chain rule (f(g(x)))′ = f′(g(x))·g′(x). Implicit differentiation handles curves like x² + y² = 25; logarithmic differentiation handles variable powers like xˣ; and a curve given by x(t), y(t) has slope (dy/dt)/(dx/dt). Exponentials are not powers: (aˣ)′ = aˣ ln a.",
  deps: ["differentiability", "inverse-trig"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "implicit differentiation", meaning: "Differentiating both sides of an equation in $x$ and $y$ with respect to $x$, treating $y$ as a function of $x$ (so $\\tfrac{d}{dx}y^2 = 2yy'$)." },
    { term: "logarithmic differentiation", meaning: "Taking $\\ln$ of both sides before differentiating, to handle products, quotients and powers like $f(x)^{g(x)}$." },
    { term: "parametric form", meaning: "A curve given by $x = x(t)$, $y = y(t)$; then $\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}$." },
  ],
  misconceptions: {
    "power-rule-exponential": "Differentiates an exponential like $a^x$ or $x^x$ with the power rule, giving $xa^{x-1}$ or $x \\cdot x^{x-1}$.",
    "parametric-second-derivative": "Computes $\\dfrac{d^2y}{dx^2}$ for a parametric curve as $\\dfrac{d^2y/dt^2}{d^2x/dt^2}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "A toolkit, not a limit each time",
      body: "First principles work, but nobody differentiates $e^{\\sin x}\\tan^{-1}x$ that way. A table of standard derivatives and four rules turn differentiation into mechanical steps, freeing attention for the JEE twists: implicit curves, variable exponents, parametric curves and second derivatives.",
      realWorld: {
        title: "Automatic differentiation",
        body: "Scientific software and deep-learning frameworks differentiate programs by applying the product, quotient and chain rules to each elementary operation, exactly the rules of this section, millions of times per second.",
      },
    },
    {
      type: "truth",
      statement: "$(u \\pm v)' = u' \\pm v'$; $(uv)' = u'v + uv'$; $\\left(\\dfrac uv\\right)' = \\dfrac{u'v - uv'}{v^2}$; **chain rule** $\\dfrac{d}{dx}f(g(x)) = f'(g(x))\\,g'(x)$. Standard derivatives: $(x^n)' = nx^{n-1}$; $(e^x)' = e^x$; $(a^x)' = a^x\\ln a$; $(\\ln x)' = \\tfrac1x$; $(\\sin x)' = \\cos x$; $(\\cos x)' = -\\sin x$; $(\\tan x)' = \\sec^2x$; $(\\sec x)' = \\sec x\\tan x$; $(\\cot x)' = -\\csc^2x$; $(\\csc x)' = -\\csc x\\cot x$; $(\\sin^{-1}x)' = \\dfrac1{\\sqrt{1 - x^2}}$; $(\\cos^{-1}x)' = -\\dfrac1{\\sqrt{1 - x^2}}$; $(\\tan^{-1}x)' = \\dfrac1{1 + x^2}$.",
      body: "**Implicit**: differentiate term by term, writing $y'$ for each derivative of $y$, then solve for $y'$. **Logarithmic**: for $y = x^x$, $\\ln y = x\\ln x$, so $\\dfrac{y'}y = \\ln x + 1$ and $y' = x^x(1 + \\ln x)$; the power rule needs a constant exponent and the exponential rule a constant base, and $x^x$ has neither. **Parametric**: $\\dfrac{dy}{dx} = \\dfrac{\\dot y}{\\dot x}$ and $\\dfrac{d^2y}{dx^2} = \\dfrac{d}{dt}\\left(\\dfrac{dy}{dx}\\right) \\Big/ \\dot x$. **Inverse function**: $\\dfrac{dx}{dy} = 1\\Big/\\dfrac{dy}{dx}$. Inverse-trig expressions often simplify first by a substitution (§{inverse-trig}): $\\tan^{-1}\\dfrac{2x}{1 - x^2} = 2\\tan^{-1}x$ for $\\lvert x\\rvert < 1$. The chain rule and its ML use are also in §{chain-rule}.",
    },
    {
      type: "predict",
      misconception: "power-rule-exponential",
      item: {
        kind: "mc",
        id: "dmt-predict-1",
        prompt: "$\\dfrac{d}{dx}2^x$ is",
        options: [
          { id: "a", text: "$2^x\\ln 2$", correct: true, why: "$2^x = e^{x\\ln 2}$; the chain rule brings down $\\ln 2$." },
          { id: "b", text: "$x \\cdot 2^{x-1}$", misconception: "power-rule-exponential", why: "The power rule needs a constant exponent; here the exponent is the variable." },
          { id: "c", text: "$2^x$", why: "Only base $e$ is its own derivative." },
        ],
      },
      reveal: {
        body: "Write $2^x = e^{x\\ln 2}$. The chain rule gives $e^{x\\ln 2} \\cdot \\ln 2 = 2^x\\ln 2$. Check numerically: at $x = 0$ the slope of $2^x$ is $\\ln 2 \\approx 0.693$, while $x \\cdot 2^{x-1}$ would give 0, a flat tangent, which is false since $2^x$ is increasing there.",
      },
      resolve: {
        kind: "mc",
        id: "dmt-resolve-1",
        prompt: "$\\dfrac{d}{dx}x^x$ (for $x > 0$) is",
        options: [
          { id: "a", text: "$x^x(1 + \\ln x)$", correct: true, why: "Logarithmic differentiation." },
          { id: "b", text: "$x \\cdot x^{x-1} = x^x$", misconception: "power-rule-exponential", why: "The exponent varies, so the power rule doesn't apply." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dmt-check-1",
        prompt: "For $x = t^2$, $y = t^3$, $\\dfrac{d^2y}{dx^2}$ is",
        options: [
          { id: "a", text: "$\\dfrac3{4t}$", correct: true, why: "$\\dfrac{dy}{dx} = \\dfrac{3t}2$; differentiate in $t$ and divide by $\\dot x = 2t$." },
          { id: "b", text: "$3t$", misconception: "parametric-second-derivative", why: "That is $\\ddot y/\\ddot x = 6t/2$, not the second derivative in $x$." },
          { id: "c", text: "$\\dfrac{3t}2$", why: "That is $\\dfrac{dy}{dx}$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dmt-check-2",
        prompt: "The derivative of $\\tan^{-1}x$ at $x = 1$ is",
        options: [
          { id: "a", text: "$\\tfrac12$", correct: true, why: "$\\dfrac1{1 + 1}$." },
          { id: "b", text: "1", why: "That is $\\sec^2$ of something; use $\\tfrac1{1 + x^2}$." },
          { id: "c", text: "$\\tfrac\\pi4$", why: "That is $\\tan^{-1}1$ itself." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Backpropagation is the chain rule applied layer by layer (§{backprop}); the derivative of the sigmoid $\\sigma(x) = \\dfrac1{1 + e^{-x}}$ is $\\sigma(1 - \\sigma)$ by the quotient and chain rules, and softmax gradients come from logarithmic differentiation of $\\ln\\sum e^{z_i}$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dmt-produce-1", prompt: "Find $f'(1)$ for $f(x) = x^3\\ln x$.", answer: 1, explain: "$3x^2\\ln x + x^2$ at 1." },
        { kind: "number", id: "dmt-produce-2", prompt: "On $x^2 + y^2 = 25$, find $\\dfrac{dy}{dx}$ at $(3, 4)$.", answer: -0.75, explain: "$2x + 2yy' = 0$, so $y' = -x/y$." },
        {
          kind: "mc",
          id: "dmt-produce-3",
          prompt: "$\\dfrac{d}{dx}3^x$ is",
          options: [
            { id: "a", text: "$3^x\\ln 3$", correct: true, why: "$(a^x)' = a^x\\ln a$." },
            { id: "b", text: "$x \\cdot 3^{x-1}$", misconception: "power-rule-exponential", why: "The variable is in the exponent." },
          ],
        },
        {
          kind: "mc",
          id: "dmt-produce-4",
          prompt: "For $x = \\cos t$, $y = \\sin t$, $\\dfrac{d^2y}{dx^2}$ is",
          options: [
            { id: "a", text: "$-\\csc^3t$", correct: true, why: "$y' = -\\cot t$; $\\dfrac{d}{dt}(-\\cot t) = \\csc^2t$; divide by $\\dot x = -\\sin t$." },
            { id: "b", text: "$\\tan t$", misconception: "parametric-second-derivative", why: "That is $\\ddot y/\\ddot x = (-\\sin t)/(-\\cos t)$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dmt-review-1", prompt: "Find the derivative of $x^5$ at $x = 1$.", answer: 5, explain: "$5x^4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "second derivatives",
      body: "$f''(x)$ is the derivative of $f'(x)$; it measures how the slope changes (concavity). For $y = e^{ax}$, $y'' = a^2y$; for $y = \\sin x$, $y'' = -y$. Implicitly, differentiate the equation for $y'$ again and substitute $y'$ back.",
    },
    {
      type: "definition",
      term: "derivative of an inverse function",
      body: "If $y = f(x)$ is differentiable with $f'(x) \\ne 0$, the inverse $x = f^{-1}(y)$ has $\\dfrac{dx}{dy} = \\dfrac1{f'(x)}$. Applied to $y = \\sin x$ on $\\left[-\\tfrac\\pi2, \\tfrac\\pi2\\right]$: $\\dfrac{d}{dy}\\sin^{-1}y = \\dfrac1{\\cos x} = \\dfrac1{\\sqrt{1 - y^2}}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the product rule",
      statement: "$(uv)' = u'v + uv'$.",
      proof: ["$\\dfrac{u(x + h)v(x + h) - u(x)v(x)}h = \\dfrac{u(x + h) - u(x)}h v(x + h) + u(x)\\dfrac{v(x + h) - v(x)}h$.", "Let $h \\to 0$, using the continuity of $v$ (§{differentiability})."],
    },
    {
      type: "theorem",
      name: "the chain rule",
      statement: "If $g$ is differentiable at $x$ and $f$ at $g(x)$, then $(f \\circ g)'(x) = f'(g(x))g'(x)$.",
      proof: ["Write $\\dfrac{f(g(x + h)) - f(g(x))}h = \\dfrac{f(g(x + h)) - f(g(x))}{g(x + h) - g(x)} \\cdot \\dfrac{g(x + h) - g(x)}h$ (when $g(x + h) \\ne g(x)$; the general case uses a small refinement).", "The factors tend to $f'(g(x))$ and $g'(x)$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "parametric second derivative",
      statement: "For $x = x(t)$, $y = y(t)$ with $\\dot x \\ne 0$: $\\dfrac{d^2y}{dx^2} = \\dfrac{\\ddot y\\dot x - \\dot y\\ddot x}{\\dot x^3}$.",
      proof: ["$\\dfrac{d^2y}{dx^2} = \\dfrac{d}{dx}\\left(\\dfrac{\\dot y}{\\dot x}\\right) = \\dfrac{d}{dt}\\left(\\dfrac{\\dot y}{\\dot x}\\right)\\dfrac{dt}{dx}$.", "The quotient rule gives $\\dfrac{\\ddot y\\dot x - \\dot y\\ddot x}{\\dot x^2}$, and $\\dfrac{dt}{dx} = \\dfrac1{\\dot x}$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Differentiate $\\sin(3x^2)$.",
      solution: ["Outer $\\sin u$, inner $u = 3x^2$.", "$\\cos(3x^2) \\cdot 6x$."],
      result: "$6x\\cos(3x^2)$.",
    },
    {
      type: "example",
      level: 2,
      title: "logarithmic differentiation",
      problem: "Differentiate $y = x^{\\sin x}$ ($x > 0$).",
      solution: ["$\\ln y = \\sin x\\ln x$, so $\\dfrac{y'}y = \\cos x\\ln x + \\dfrac{\\sin x}x$.", "$y' = x^{\\sin x}\\left(\\cos x\\ln x + \\dfrac{\\sin x}x\\right)$."],
      result: "$x^{\\sin x}\\left(\\cos x\\ln x + \\tfrac{\\sin x}x\\right)$.",
    },
    {
      type: "example",
      level: 3,
      title: "the cycloid",
      problem: "For $x = a(t - \\sin t)$, $y = a(1 - \\cos t)$, find $\\dfrac{dy}{dx}$.",
      solution: ["$\\dot x = a(1 - \\cos t)$, $\\dot y = a\\sin t$.", "$\\dfrac{dy}{dx} = \\dfrac{\\sin t}{1 - \\cos t} = \\dfrac{2\\sin\\frac t2\\cos\\frac t2}{2\\sin^2\\frac t2} = \\cot\\dfrac t2$."],
      result: "$\\cot\\tfrac t2$.",
    },
  ],
  pitfalls: [
    { wrong: "$(a^x)' = xa^{x-1}$.", right: "$(a^x)' = a^x\\ln a$." },
    { wrong: "$\\dfrac{d^2y}{dx^2} = \\ddot y/\\ddot x$.", right: "Differentiate $\\dfrac{dy}{dx}$ in $t$, then divide by $\\dot x$." },
    { wrong: "$\\dfrac{d}{dx}y^2 = 2y$ in implicit work.", right: "$2y\\dfrac{dy}{dx}$: the chain rule applies to $y$." },
  ],
  formulas: [
    { label: "Product, quotient", tex: "(uv)' = u'v + uv',\\ \\left(\\tfrac uv\\right)' = \\tfrac{u'v - uv'}{v^2}" },
    { label: "Chain", tex: "(f \\circ g)' = f'(g)\\,g'" },
    { label: "Exponential", tex: "(a^x)' = a^x\\ln a" },
    { label: "Inverse trig", tex: "(\\sin^{-1}x)' = \\tfrac1{\\sqrt{1 - x^2}},\\ (\\tan^{-1}x)' = \\tfrac1{1 + x^2}" },
    { label: "Parametric", tex: "\\tfrac{dy}{dx} = \\tfrac{\\dot y}{\\dot x}" },
  ],
  exercises: [
    ex(1, num("dmtx-ex-1", "Find $f'(2)$ for $f(x) = x^3 - 4x$.", 8, "$3x^2 - 4$."), ["$8$."]),
    ex(1, num("dmtx-ex-2", "Find the derivative of $\\sin x\\cos x$ at $x = 0$.", 1, "$\\cos^2x - \\sin^2x = \\cos 2x$."), ["$1$."]),
    ex(2, num("dmtx-ex-3", "Find the derivative of $\\tan^{-1}x$ at $x = 2$.", 0.2, "$\\tfrac1{1 + 4}$."), ["$0.2$."]),
    ex(2, num("dmtx-ex-4", "On $x^2 + xy + y^2 = 7$, find $\\dfrac{dy}{dx}$ at $(1, 2)$.", -0.8, "$2x + y + xy' + 2yy' = 0$."), ["$y' = -\\dfrac{2x + y}{x + 2y} = -\\tfrac45$."]),
    ex(2, num("dmtx-ex-5", "$y = x^x$. Find $y'(1)$.", 1, "$x^x(1 + \\ln x)$ at 1."), ["$1$."]),
    ex(3, num("dmtx-ex-6", "$x = t^2$, $y = 2t$. Find $\\dfrac{dy}{dx}$ at $t = 2$.", 0.5, "$\\dfrac2{2t}$."), ["$\\tfrac12$."]),
    ex(3, num("dmtx-ex-7", "$y = e^{2x}\\sin x$. Find $y''(0)$.", 4, "$y'' = e^{2x}(3\\sin x + 4\\cos x)$."), ["$4$."]),
    ex(3, mc("dmtx-ex-8", "For $\\lvert x\\rvert < 1$, $\\dfrac{d}{dx}\\tan^{-1}\\dfrac{2x}{1 - x^2}$ is", ["$\\dfrac2{1 + x^2}$", "The expression is $2\\tan^{-1}x$ (put $x = \\tan\\theta$)."], [["$\\dfrac1{1 + x^2}$", "Missed the factor 2."], ["$\\dfrac{2x}{(1 + x^2)^2}$", "Simplify before differentiating."]]), ["Substitute $x = \\tan\\theta$ first."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const co = (k: number) => (k === 1 ? "" : k === -1 ? "-" : `${k}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = [r.nonzero(-3, 3), r.nonzero(-5, 5), r.nonzero(-6, 6)];
      const x0 = r.int(-3, 3);
      const v = 3 * a * x0 * x0 + 2 * b * x0 + c;
      return n(`Find $f'(${x0})$ for $f(x) = ${co(a)}x^3 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)}x$.`, v, `$f'(x) = ${3 * a}x^2 + ${2 * b}x + ${c}$ at ${x0}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-3, 3);
      const b = r.nonzero(-3, 3);
      const k = r.int(2, 4);
      const x0 = r.int(-2, 2);
      const v = k * a * (a * x0 + b) ** (k - 1);
      return n(`Find the derivative of $(${co(a)}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${k}}$ at $x = ${x0}$.`, v, `Chain rule: $${k} \\cdot ${a}(${a * x0 + b})^{${k - 1}} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [p, q, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]] as const);
      const sx = r.pick([1, -1]);
      const sy = r.pick([1, -1]);
      const v = -(sx * p) / (sy * q);
      return n(`On $x^2 + y^2 = ${h * h}$, find $\\dfrac{dy}{dx}$ at $(${sx * p}, ${sy * q})$ (3 decimals).`, Math.round(v * 1000) / 1000, `$2x + 2yy' = 0$, so $y' = -\\dfrac xy = -\\dfrac{${sx * p}}{${sy * q}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const pp = r.int(1, 3);
      const qq = r.int(1, 4);
      const t = r.pick([1, 2, -1]);
      const v = (qq * t ** (qq - 1)) / (pp * t ** (pp - 1));
      const pw = (k: number) => (k === 1 ? "t" : `t^{${k}}`);
      return n(`$x = ${pw(pp)}$, $y = ${pw(qq)}$. Find $\\dfrac{dy}{dx}$ at $t = ${t}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\dot y}{\\dot x} = \\dfrac{${qq * t ** (qq - 1)}}{${pp * t ** (pp - 1)}}$ at $t = ${t}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.pick([2, 3, 5, 7, 10]);
      return mcNumbers(
        `$\\dfrac{d}{dx}${a}^x$ is`,
        { text: `$${a}^x\\ln ${a}$`, why: `$${a}^x = e^{x\\ln ${a}}$.` },
        [{ text: `$x \\cdot ${a}^{x-1}$`, why: "The power rule needs a constant exponent.", misconception: "power-rule-exponential" }, { text: `$${a}^x$`, why: "Only $e^x$ is its own derivative." }],
      );
    },
  },
];
