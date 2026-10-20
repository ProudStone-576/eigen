import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** First-order equations solvable by separating variables; the constant of integration after exponentiating; initial conditions; equations reducible to separable form by the substitution u = ax + by + c; homogeneous equations y′ = F(y/x) and the substitution y = vx. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "separable-homogeneous",
  title: "Separable & homogeneous equations",
  summary: "If dy/dx = f(x)g(y), separate: ∫dy/g(y) = ∫f(x) dx, then add one constant. Exponentiating ln|y| = kx + C gives y = Ae^{kx}: the constant multiplies, it doesn't add. A homogeneous equation dy/dx = F(y/x) becomes separable with y = vx, and dy/dx = f(ax + by + c) with u = ax + by + c. An initial condition such as y(0) = 2 fixes the constant.",
  deps: ["de-basics"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "separable", meaning: "An equation $\\dfrac{dy}{dx} = f(x)g(y)$, which can be rearranged with all $y$ on one side and all $x$ on the other." },
    { term: "homogeneous function", meaning: "$f(tx, ty) = t^nf(x, y)$; an equation $\\dfrac{dy}{dx} = \\dfrac{P(x, y)}{Q(x, y)}$ is homogeneous when $P, Q$ are homogeneous of the same degree, i.e. it depends only on $\\dfrac yx$." },
    { term: "particular solution", meaning: "The member of the family of solutions that satisfies the given condition." },
  ],
  misconceptions: {
    "constant-after-exp": "After integrating, turns $\\ln\\lvert y\\rvert = kx + C$ into $y = e^{kx} + C$ instead of $y = Ae^{kx}$.",
    "not-homogeneous": "Treats an equation as homogeneous when it doesn't depend only on $\\dfrac yx$, for example when it has a constant term.",
  },
  steps: [
    {
      type: "motivate",
      title: "Untangling x and y",
      body: "Most first-order equations in JEE yield to one of a few patterns, and the first to try is separation: gather $y$ with $dy$ and $x$ with $dx$, integrate both sides. When that fails, a substitution often restores it. The care lies in the constant of integration, which a single slip can turn into a wrong family of solutions.",
      realWorld: {
        title: "Drug elimination",
        body: "Many drugs are cleared from the blood at a rate proportional to the concentration: $\\dfrac{dC}{dt} = -kC$. Separating gives $C = C_0e^{-kt}$, which is how doctors compute dosing intervals from a measured half-life (§{de-applications}).",
      },
    },
    {
      type: "truth",
      statement: "**Separable**: $\\dfrac{dy}{dx} = f(x)g(y)$ ⇒ $\\int\\dfrac{dy}{g(y)} = \\int f(x)\\,dx + C$ (one constant suffices). For $\\dfrac{dy}{dx} = ky$: $\\ln\\lvert y\\rvert = kx + C$, so $y = Ae^{kx}$ with $A = \\pm e^C$ (and $A = 0$ gives the solution $y = 0$). **Reducible**: $\\dfrac{dy}{dx} = f(ax + by + c)$; put $u = ax + by + c$, $\\dfrac{du}{dx} = a + bf(u)$, separable. **Homogeneous**: $\\dfrac{dy}{dx} = F\\left(\\dfrac yx\\right)$; put $y = vx$, $\\dfrac{dy}{dx} = v + x\\dfrac{dv}{dx}$, giving $\\int\\dfrac{dv}{F(v) - v} = \\ln\\lvert x\\rvert + C$.",
      body: "Test for homogeneity: replace $x, y$ by $tx, ty$; the right side must be unchanged. $\\dfrac{x^2 + y^2}{xy}$ passes; $\\dfrac{x + y + 1}{x - y}$ fails because of the constant (shift the origin to the intersection of $x + y + 1 = 0$ and $x - y = 0$ to make it homogeneous). Apply the initial condition **after** integrating, to find the constant. Always check: differentiate the answer and substitute back. Linear equations, which need an integrating factor instead, are in §{linear-de}.",
    },
    {
      type: "predict",
      misconception: "constant-after-exp",
      item: {
        kind: "mc",
        id: "shd-predict-1",
        prompt: "Solve $\\dfrac{dy}{dx} = y$ with $y(0) = 2$.",
        options: [
          { id: "a", text: "$y = 2e^x$", correct: true, why: "$\\ln y = x + C$, so $y = Ae^x$, and $y(0) = 2$ gives $A = 2$." },
          { id: "b", text: "$y = e^x + 1$", misconception: "constant-after-exp", why: "Its derivative $e^x$ isn't equal to $y = e^x + 1$." },
          { id: "c", text: "$y = 2 + x$", why: "Its derivative is 1, not $y$." },
        ],
      },
      reveal: {
        body: "Separate: $\\dfrac{dy}y = dx$, so $\\ln y = x + C$. Exponentiating, $y = e^{x + C} = e^Ce^x$: the constant becomes a **factor** $A = e^C$. Then $y(0) = A = 2$. Check: $y = 2e^x$ has $y' = 2e^x = y$. The tempting $y = e^x + 1$ fails the check, because $y' = e^x \\ne e^x + 1$.",
      },
      resolve: {
        kind: "mc",
        id: "shd-resolve-1",
        prompt: "The general solution of $\\dfrac{dy}{dx} = 3y$ is",
        options: [
          { id: "a", text: "$y = Ae^{3x}$", correct: true, why: "$\\ln\\lvert y\\rvert = 3x + C$." },
          { id: "b", text: "$y = e^{3x} + C$", misconception: "constant-after-exp", why: "$e^{3x + C} = e^Ce^{3x}$: the constant multiplies." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "shd-check-1",
        prompt: "Which equation is homogeneous?",
        options: [
          { id: "a", text: "$\\dfrac{dy}{dx} = \\dfrac{x^2 + y^2}{xy}$", correct: true, why: "Replacing $x, y$ by $tx, ty$ leaves it unchanged." },
          { id: "b", text: "$\\dfrac{dy}{dx} = \\dfrac{x + y + 1}{x - y}$", misconception: "not-homogeneous", why: "The constant 1 breaks the scaling." },
          { id: "c", text: "$\\dfrac{dy}{dx} = x^2y$", why: "Scaling gives $t^3x^2y$; it is separable, not homogeneous." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "shd-check-2",
        prompt: "For a homogeneous equation, the standard substitution is",
        options: [
          { id: "a", text: "$y = vx$", correct: true, why: "Then the equation separates in $v$ and $x$." },
          { id: "b", text: "$y = v + x$", why: "That suits $f(x + y)$ forms." },
          { id: "c", text: "$v = xy$", why: "That doesn't use the dependence on $\\tfrac yx$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The logistic function, the sigmoid of §{logistic-regression}, is the solution of the separable equation $\\dfrac{dp}{dt} = p(1 - p)$; separating with partial fractions gives $\\ln\\dfrac p{1 - p} = t + C$, which is exactly the log-odds (logit) used in logistic regression.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "shd-produce-1", prompt: "Solve $\\dfrac{dy}{dx} = 2xy$, $y(0) = 1$, and give $y(1)$ to 3 decimals.", answer: Math.round(Math.E * 1000) / 1000, tolerance: 0.001, explain: "$y = e^{x^2}$." },
        { kind: "number", id: "shd-produce-2", prompt: "Solve $\\dfrac{dy}{dx} = \\dfrac xy$, $y(0) = 3$ ($y > 0$). Find $y(4)$.", answer: 5, explain: "$y^2 = x^2 + 9$." },
        {
          kind: "mc",
          id: "shd-produce-3",
          prompt: "The general solution of $\\dfrac{dy}{dx} = -2y$ is",
          options: [
            { id: "a", text: "$y = Ae^{-2x}$", correct: true, why: "Separate and exponentiate." },
            { id: "b", text: "$y = e^{-2x} + C$", misconception: "constant-after-exp", why: "Exponentiating turns the added constant into a factor." },
          ],
        },
        {
          kind: "mc",
          id: "shd-produce-4",
          prompt: "$\\dfrac{dy}{dx} = \\dfrac{y + 1}x$ is",
          options: [
            { id: "a", text: "separable but not homogeneous", correct: true, why: "$\\dfrac{dy}{y + 1} = \\dfrac{dx}x$; the $+1$ breaks homogeneity." },
            { id: "b", text: "homogeneous", misconception: "not-homogeneous", why: "Scaling $x, y$ by $t$ gives $\\dfrac{ty + 1}{tx}$, which changes." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "shd-review-1", prompt: "Solve $\\dfrac{dy}{dx} = 2x$, $y(0) = 1$. Find $y(2)$.", answer: 5, explain: "$y = x^2 + 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the substitution u = ax + by + c",
      body: "For $\\dfrac{dy}{dx} = (x + y)^2$, put $u = x + y$: $\\dfrac{du}{dx} = 1 + u^2$, so $\\tan^{-1}u = x + C$ and $x + y = \\tan(x + C)$. Any equation whose right side is a function of one linear combination $ax + by$ yields this way.",
    },
    {
      type: "definition",
      term: "reducible to homogeneous",
      body: "$\\dfrac{dy}{dx} = \\dfrac{a_1x + b_1y + c_1}{a_2x + b_2y + c_2}$ with $\\dfrac{a_1}{a_2} \\ne \\dfrac{b_1}{b_2}$: shift $x = X + h$, $y = Y + k$ with $(h, k)$ the intersection of the two lines, which removes the constants and leaves a homogeneous equation in $X, Y$. If the lines are parallel, use $u = a_1x + b_1y$ instead.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "separation of variables",
      statement: "If $\\dfrac{dy}{dx} = f(x)g(y)$ with $g(y) \\ne 0$, then $G(y) = F(x) + C$, where $G' = \\dfrac1g$ and $F' = f$.",
      proof: ["$\\dfrac{1}{g(y)}\\dfrac{dy}{dx} = f(x)$; the left side is $\\dfrac{d}{dx}G(y)$ by the chain rule.", "Integrate both sides with respect to $x$. Any $y_0$ with $g(y_0) = 0$ also gives a constant solution $y = y_0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "y = vx separates a homogeneous equation",
      statement: "If $\\dfrac{dy}{dx} = F\\left(\\dfrac yx\\right)$, then $v = \\dfrac yx$ satisfies $x\\dfrac{dv}{dx} = F(v) - v$.",
      proof: ["$y = vx$ gives $\\dfrac{dy}{dx} = v + x\\dfrac{dv}{dx}$; equate with $F(v)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "exponential solutions",
      statement: "Every solution of $y' = ky$ is $y = Ae^{kx}$ for a constant $A$.",
      proof: ["$(ye^{-kx})' = (y' - ky)e^{-kx} = 0$, so $ye^{-kx}$ is constant (§{mean-value-theorems})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Solve $\\dfrac{dy}{dx} = xy$, $y(0) = 1$.",
      solution: ["$\\dfrac{dy}y = x\\,dx$: $\\ln\\lvert y\\rvert = \\dfrac{x^2}2 + C$.", "$y = Ae^{x^2/2}$ and $y(0) = 1$ gives $A = 1$."],
      result: "$y = e^{x^2/2}$.",
    },
    {
      type: "example",
      level: 2,
      title: "a homogeneous equation",
      problem: "Solve $\\dfrac{dy}{dx} = \\dfrac{x + y}x$ ($x > 0$).",
      solution: ["$y = vx$: $v + xv' = 1 + v$, so $xv' = 1$ and $v = \\ln x + C$.", "$y = x\\ln x + Cx$."],
      result: "$y = x\\ln x + Cx$.",
    },
    {
      type: "example",
      level: 3,
      title: "a linear substitution",
      problem: "Solve $\\dfrac{dy}{dx} = (x + y)^2$.",
      solution: ["$u = x + y$: $u' = 1 + u^2$, so $\\tan^{-1}u = x + C$.", "$x + y = \\tan(x + C)$."],
      result: "$y = \\tan(x + C) - x$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\ln y = x + C \\Rightarrow y = e^x + C$.", right: "$y = e^{x + C} = Ae^x$." },
    { wrong: "Call any fraction of linear terms homogeneous.", right: "Constants break homogeneity; test by scaling $x, y$." },
    { wrong: "Apply the initial condition before integrating.", right: "Integrate, then use it to find the constant." },
  ],
  formulas: [
    { label: "Separable", tex: "\\int\\tfrac{dy}{g(y)} = \\int f(x)\\,dx + C" },
    { label: "Growth", tex: "y' = ky \\Rightarrow y = Ae^{kx}" },
    { label: "Homogeneous", tex: "y = vx:\\ x\\tfrac{dv}{dx} = F(v) - v" },
  ],
  exercises: [
    ex(1, num("shdx-ex-1", "Solve $y' = 3x^2$, $y(0) = 1$. Find $y(2)$.", 9, "$y = x^3 + 1$."), ["$9$."]),
    ex(1, dp("shdx-ex-2", "Solve $y' = y$, $y(0) = 3$. Find $y(1)$.", 3 * Math.E, "$y = 3e^x$."), ["$3e \\approx 8.155$."]),
    ex(2, num("shdx-ex-3", "Solve $y' = \\dfrac yx$, $y(1) = 2$. Find $y(3)$.", 6, "$\\ln y = \\ln x + C$, so $y = Ax$."), ["$y = 2x$: 6."]),
    ex(2, num("shdx-ex-4", "Solve $y' = \\dfrac xy$, $y(0) = 3$ ($y > 0$). Find $y(4)$.", 5, "$y^2 = x^2 + 9$."), ["$5$."]),
    ex(2, dp("shdx-ex-5", "Solve $y' = 2xy$, $y(0) = 1$. Find $y(1)$.", Math.E, "$y = e^{x^2}$."), ["$e \\approx 2.718$."]),
    ex(3, dp("shdx-ex-6", "Solve $y' = \\dfrac{x + y}x$, $y(1) = 0$ ($x > 0$). Find $y(e)$.", Math.E, "$y = x\\ln x$."), ["$e \\approx 2.718$."]),
    ex(3, num("shdx-ex-7", "Solve $y' = e^{x - y}$, $y(0) = 0$. Find $y(2)$.", 2, "$e^y = e^x + C$ with $C = 0$."), ["$y = x$: 2."]),
    ex(3, mc("shdx-ex-8", "For $\\dfrac{dy}{dx} = (x + y)^2$ the useful substitution is", ["$u = x + y$", "Then $u' = 1 + u^2$, separable."], [["$y = vx$", "The equation isn't homogeneous."], ["$u = xy$", "That doesn't simplify $(x + y)^2$."]]), ["$x + y = \\tan(x + C)$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([-2, -1, -0.5, 0.5, 1, 2]);
      const y0 = r.int(1, 9);
      const x0 = r.int(1, 3);
      const v = y0 * Math.exp(k * x0);
      return n(`Solve $y' = ${k === 1 ? "" : k === -1 ? "-" : k}y$, $y(0) = ${y0}$. Find $y(${x0})$ (3 decimals).`, Math.round(v * 1000) / 1000, `$y = ${y0}e^{${k}x}$.`, Math.max(0.001, Math.abs(v) * 1e-4));
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 4);
      const k = r.int(1, 3);
      const y0 = r.int(-3, 5);
      const b = r.int(1, 3);
      const v = y0 + (a * b ** (k + 1)) / (k + 1);
      return n(`Solve $y' = ${a === 1 ? "" : a}x^{${k}}$, $y(0) = ${y0}$. Find $y(${b})$ (3 decimals).`, Math.round(v * 1000) / 1000, `$y = \\tfrac{${a}}{${k + 1}}x^{${k + 1}} + ${y0}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [p, c, h] = r.pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [8, 6, 10], [6, 8, 10]] as const);
      return n(`Solve $y' = \\dfrac xy$, $y(0) = ${c}$ ($y > 0$). Find $y(${p})$.`, h, `$y\\,dy = x\\,dx$: $y^2 = x^2 + ${c * c}$, so $y(${p}) = \\sqrt{${p * p + c * c}}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([2, 3, 4, -1, -3]);
      return mcNumbers(
        `The general solution of $\\dfrac{dy}{dx} = ${k === -1 ? "-" : k}y$ is`,
        { text: `$y = Ae^{${k}x}$`, why: "Exponentiating makes the constant a factor." },
        [{ text: `$y = e^{${k}x} + C$`, why: "$e^{kx + C} = e^Ce^{kx}$.", misconception: "constant-after-exp" }, { text: `$y = ${k === -1 ? "-" : k}x + C$`, why: "That solves $y' = k$, not $y' = ky$." }],
      );
    },
  },
];
