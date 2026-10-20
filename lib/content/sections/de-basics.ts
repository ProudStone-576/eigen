import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Ordinary differential equations: order and degree (and when degree is undefined); general and particular solutions; arbitrary constants and initial conditions; verifying a solution; forming the differential equation of a family of curves by eliminating constants. */

const base: ConceptNode = {
  id: "de-basics",
  title: "Differential equations: order, degree & formation",
  summary: "A differential equation links an unknown function with its derivatives. Its order is the highest derivative that appears; its degree is the power of that highest derivative once the equation is a polynomial in the derivatives (otherwise the degree is undefined). A general solution of an order-n equation carries n arbitrary constants, and conditions such as y(0) = 1 fix them. Conversely, eliminating n constants from a family of curves by differentiating n times gives its differential equation.",
  deps: ["area-under-curves"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "order", meaning: "The order of the highest derivative in the equation." },
    { term: "degree", meaning: "The power of the highest-order derivative after the equation is made a polynomial in its derivatives (radicals and fractions cleared)." },
    { term: "general solution", meaning: "A solution containing as many independent arbitrary constants as the order; a particular solution fixes them." },
  ],
  misconceptions: {
    "degree-highest-power-any": "Takes the degree to be the highest power of any derivative, rather than the power of the highest-order derivative.",
    "degree-undefined": "Assigns a degree to an equation that is not a polynomial in its derivatives, such as one containing $\\sin y'$ or $e^{y'}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Equations about change",
      body: "Physical laws usually say how things change: acceleration is proportional to force, a population grows in proportion to its size, a hot object cools in proportion to how much hotter it is than the room. Each is a differential equation. Before solving them, JEE asks you to classify them by order and degree and to build them from families of curves.",
      realWorld: {
        title: "Newton's second law",
        body: "A mass on a spring obeys $m\\dfrac{d^2x}{dt^2} = -kx$, a second-order equation. Its general solution $x = A\\cos\\omega t + B\\sin\\omega t$ has two constants, fixed by the starting position and the starting velocity: two numbers for a second-order law.",
      },
    },
    {
      type: "truth",
      statement: "**Order**: the highest derivative present. **Degree**: when the equation can be written as a polynomial in $y', y'', \\dots$ (after clearing radicals and fractions), the power of the highest-order derivative; if derivatives appear inside functions like $\\sin y'$, $e^{y'}$ or $\\ln y''$, the degree is **not defined**. A general solution of an order-$n$ equation has $n$ arbitrary constants; $n$ conditions select a particular solution. To **form** the equation of an $n$-parameter family, differentiate $n$ times and eliminate the $n$ constants.",
      body: "Examples: $(y'')^3 + (y')^4 + y = 0$ has order 2 and degree 3 (the power of $y''$, not the larger power 4 of $y'$). $\\left(1 + (y')^2\\right)^{3/2} = ky''$ squares to $\\left(1 + (y')^2\\right)^3 = k^2(y'')^2$: order 2, degree 2. $y'' + \\sin y = 0$ has degree 1, since $\\sin y$ involves $y$, not a derivative; $y' + \\sin y' = x$ has no degree. **Verifying** a solution: substitute it and its derivatives and check that the equation holds identically. Solving methods follow in §{separable-homogeneous} and §{linear-de}.",
    },
    {
      type: "predict",
      misconception: "degree-highest-power-any",
      item: {
        kind: "mc",
        id: "deb-predict-1",
        prompt: "$(y'')^3 + (y')^4 + y = 0$ has",
        options: [
          { id: "a", text: "order 2, degree 3", correct: true, why: "The highest derivative is $y''$, raised to the power 3." },
          { id: "b", text: "order 2, degree 4", misconception: "degree-highest-power-any", why: "The degree is the power of the **highest-order** derivative, $y''$." },
          { id: "c", text: "order 4, degree 3", why: "Order counts derivatives, not powers." },
        ],
      },
      reveal: {
        body: "Order and degree both look at the highest-order derivative, here $y''$. Order is which derivative that is (2); degree is the power it carries (3). The $(y')^4$ term has a larger power, but $y'$ is a lower-order derivative, so it doesn't affect the degree.",
      },
      resolve: {
        kind: "mc",
        id: "deb-resolve-1",
        prompt: "$\\left(\\dfrac{d^3y}{dx^3}\\right)^2 + \\left(\\dfrac{dy}{dx}\\right)^5 = x$ has degree",
        options: [
          { id: "a", text: "2", correct: true, why: "The third derivative is squared." },
          { id: "b", text: "5", misconception: "degree-highest-power-any", why: "Use the power of the highest-order derivative." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "deb-check-1",
        prompt: "The degree of $y' + \\sin(y') = x$ is",
        options: [
          { id: "a", text: "not defined", correct: true, why: "It isn't a polynomial in $y'$." },
          { id: "b", text: "1", misconception: "degree-undefined", why: "$\\sin y'$ can't be written as a polynomial in $y'$." },
          { id: "c", text: "0", why: "Degree, when defined, is at least 1." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "deb-check-2",
        prompt: "The differential equation of the family $y = Ae^x + Be^{-x}$ is",
        options: [
          { id: "a", text: "$y'' = y$", correct: true, why: "Two constants, two differentiations: $y'' = Ae^x + Be^{-x}$." },
          { id: "b", text: "$y' = y$", why: "That fits $Ae^x$ alone." },
          { id: "c", text: "$y'' = -y$", why: "That family is $A\\cos x + B\\sin x$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Gradient descent with a tiny step is a discretised differential equation, $\\dfrac{dw}{dt} = -\\nabla L(w)$, the gradient flow (§{gradient-descent}); neural ODEs make a network's depth continuous by letting a learned function define $\\dfrac{dh}{dt}$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "deb-produce-1", prompt: "Find the order of $y''' + 2y'' + y = 0$.", answer: 3, explain: "The third derivative." },
        { kind: "number", id: "deb-produce-2", prompt: "How many arbitrary constants are in the general solution of a fourth-order equation?", answer: 4, explain: "One per order." },
        {
          kind: "mc",
          id: "deb-produce-3",
          prompt: "The degree of $y'' + (y')^2 = e^{y'}$ is",
          options: [
            { id: "a", text: "not defined", correct: true, why: "$e^{y'}$ isn't polynomial in $y'$." },
            { id: "b", text: "1", misconception: "degree-undefined", why: "A derivative sits inside an exponential." },
          ],
        },
        {
          kind: "mc",
          id: "deb-produce-4",
          prompt: "The degree of $(y'')^2 + (y')^3 = 0$ is",
          options: [
            { id: "a", text: "2", correct: true, why: "The power of $y''$." },
            { id: "b", text: "3", misconception: "degree-highest-power-any", why: "$y'$ is not the highest-order derivative." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "deb-review-1", prompt: "Find the order of $y'' + y = 0$.", answer: 2, explain: "Second derivative." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "families and their equations",
      body: "$y = mx$ (lines through the origin, one constant) gives $m = y/x$ and so $xy' = y$. $y = A\\cos x + B\\sin x$ (two constants) gives $y'' + y = 0$. Circles $x^2 + y^2 = r^2$ (one constant) give $x + yy' = 0$. The order of the equation equals the number of **independent** constants: $y = Ae^{x + B}$ is really one constant, $Ae^B$.",
    },
    {
      type: "definition",
      term: "initial-value problems",
      body: "An equation together with conditions at one point, e.g. $y'' + y = 0$, $y(0) = 1$, $y'(0) = 0$, which fix the constants: here $A = 1$, $B = 0$ and $y = \\cos x$. Conditions at two different points (boundary values) may have one solution, none or many.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Rule",
      name: "forming an equation",
      statement: "An $n$-parameter family $F(x, y, c_1, \\dots, c_n) = 0$ satisfies an $n$th-order differential equation, found by differentiating $n$ times and eliminating the constants.",
      proof: ["The original equation and its $n$ derivatives are $n + 1$ relations in the $n$ constants, so the constants can (in general) be eliminated, leaving one relation among $x, y, y', \\dots, y^{(n)}$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "verifying a solution",
      statement: "$y = e^{kx}$ solves $y'' = 9y$ exactly when $k = \\pm3$.",
      proof: ["$y'' = k^2e^{kx}$, so the equation holds iff $k^2 = 9$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "order equals number of constants",
      statement: "The general solution of an $n$th-order equation (under the usual existence and uniqueness conditions) contains exactly $n$ independent arbitrary constants.",
      proof: ["Specifying $y, y', \\dots, y^{(n-1)}$ at a point fixes a unique solution, and these $n$ values can be chosen freely: so the solutions form an $n$-parameter family."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the order and degree of $\\left(1 + (y')^2\\right)^{3/2} = 4y''$.",
      solution: ["Square to clear the fractional power: $\\left(1 + (y')^2\\right)^3 = 16(y'')^2$.", "Highest derivative $y''$, with power 2."],
      result: "Order 2, degree 2.",
    },
    {
      type: "example",
      level: 2,
      title: "forming an equation",
      problem: "Form the differential equation of $y = A\\cos x + B\\sin x$.",
      solution: ["$y' = -A\\sin x + B\\cos x$, $y'' = -A\\cos x - B\\sin x = -y$.", "So $y'' + y = 0$: two constants, second order."],
      result: "$y'' + y = 0$.",
    },
    {
      type: "example",
      level: 3,
      title: "a family of circles",
      problem: "Form the differential equation of circles through the origin with centres on the $x$-axis.",
      solution: ["$x^2 + y^2 = 2ax$. Differentiate: $2x + 2yy' = 2a$.", "Substitute $a = x + yy'$: $x^2 + y^2 = 2x(x + yy')$, i.e. $y^2 - x^2 = 2xyy'$."],
      result: "$2xyy' = y^2 - x^2$.",
    },
  ],
  pitfalls: [
    { wrong: "Degree is the largest power anywhere.", right: "It is the power of the highest-order derivative." },
    { wrong: "Every equation has a degree.", right: "Only polynomial ones in the derivatives do." },
    { wrong: "Forget to clear radicals before reading the degree.", right: "Rationalise first: $(1 + y'^2)^{3/2} = y''$ has degree 2." },
  ],
  formulas: [
    { label: "Constants", tex: "\\text{order } n \\leftrightarrow n \\text{ constants}" },
    { label: "Lines through O", tex: "xy' = y" },
    { label: "Oscillation", tex: "y'' + y = 0" },
  ],
  exercises: [
    ex(1, num("debx-ex-1", "Find the order of $y''' - 3y' + 2y = 0$.", 3, "Third derivative."), ["$3$."]),
    ex(1, num("debx-ex-2", "Find the degree of $(y'')^2 + y' = 0$.", 2, "$y''$ squared."), ["$2$."]),
    ex(2, num("debx-ex-3", "Find the degree of $\\left(1 + (y')^2\\right)^{3/2} = 4y''$.", 2, "Square both sides."), ["$2$."]),
    ex(2, num("debx-ex-4", "Find the order of the differential equation of the family $y = mx$.", 1, "One constant."), ["$1$: $xy' = y$."]),
    ex(2, num("debx-ex-5", "Find the order of the differential equation of $y = Ae^{2x} + Be^{-x} + C$.", 3, "Three independent constants."), ["$3$."]),
    ex(3, num("debx-ex-6", "$y = Ae^{2x} + Be^{3x}$ satisfies $y'' + py' + qy = 0$. Find $p$.", -5, "Roots 2, 3 of $m^2 + pm + q = 0$."), ["$p = -5$, $q = 6$."]),
    ex(3, num("debx-ex-7", "$y = e^{kx}$ ($k > 0$) solves $y'' = 9y$. Find $k$.", 3, "$k^2 = 9$."), ["$3$."]),
    ex(3, mc("debx-ex-8", "The degree of $y'' + \\sin y = 0$ is", ["1", "$\\sin y$ involves $y$, not a derivative, so the equation is polynomial (degree 1) in $y''$."], [["not defined", "Only functions of the **derivatives** spoil the degree."], ["0", "$y''$ appears to the first power."]]), ["Degree 1, order 2."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });
const d = (k: number) => (k === 1 ? "y'" : k === 2 ? "y''" : k === 3 ? "y'''" : `y^{(${k})}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(2, 4);
      const p = r.int(1, 4);
      const q = r.int(p + 1, 6);
      const want = r.pick(["order", "degree"] as const);
      return n(`Find the ${want} of $(${d(k)})^{${p}} + (y')^{${q}} + y = x$.`, want === "order" ? k : p, `Highest derivative $${d(k)}$ (order ${k}), raised to the power ${p} (degree ${p}).`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(-3, 3);
      let b = r.int(-3, 3);
      if (b === a) b += 1;
      const want = r.pick(["p", "q"] as const);
      return n(`$y = Ae^{${a}x} + Be^{${b}x}$ satisfies $y'' + py' + qy = 0$. Find $${want}$.`, want === "p" ? -(a + b) : a * b, `$${a}$ and $${b}$ are the roots of $m^2 + pm + q = 0$: $p = ${-(a + b)}$, $q = ${a * b}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 5);
      return n(`How many arbitrary constants does the general solution of an equation of order ${k} contain?`, k, "One per order.");
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.int(2, 3);
      const q = p + r.int(1, 3);
      return mcNumbers(
        `The degree of $(y'')^{${p}} + (y')^{${q}} = \\sin x$ is`,
        { text: `${p}`, why: "The power of the highest-order derivative, $y''$." },
        [{ text: `${q}`, why: "That power belongs to $y'$, a lower-order derivative.", misconception: "degree-highest-power-any" }, { text: "not defined", why: "$\\sin x$ involves $x$, not a derivative." }],
      );
    },
  },
];
