import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The derivative as a rate of change; related rates; tangents and normals to curves (explicit, implicit and parametric); horizontal and vertical tangents; the angle between two curves and orthogonal curves; linear approximation and small errors via differentials. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "tangents-normals",
  title: "Tangents, normals & rates of change",
  summary: "The derivative f′(x₁) is the slope of the tangent at (x₁, y₁), so the tangent is y − y₁ = f′(x₁)(x − x₁) and the normal, perpendicular to it, has slope −1/f′(x₁). The derivative is also a rate: when quantities are linked by an equation and change with time, differentiate the whole equation with respect to t first, then substitute the values at the instant you care about. Near a point, f(a + h) ≈ f(a) + h f′(a).",
  deps: ["differentiation-methods"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "normal", meaning: "The line through the point of contact perpendicular to the tangent." },
    { term: "related rates", meaning: "Rates of change of linked quantities, found by differentiating their relation with respect to time." },
    { term: "differential", meaning: "$dy = f'(x)\\,dx$, the change along the tangent; it approximates the true change $\\Delta y$ for small $dx$." },
  ],
  misconceptions: {
    "substitute-before-differentiating": "Substitutes the instantaneous values into a relation before differentiating it with respect to time, so the rate comes out 0.",
    "normal-negative-slope": "Takes the slope of the normal to be $-f'(x_1)$ rather than $-\\dfrac1{f'(x_1)}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Slopes and speeds",
      body: "A balloon is inflated at a steady rate: how fast is its radius growing when it is 10 cm across? A ladder slides down a wall: how fast does its top fall? These are rates of change of one quantity driven by another, and the derivative answers them. The same derivative gives the tangent line, the best straight-line approximation to a curve near a point.",
      realWorld: {
        title: "Linear approximation in engineering",
        body: "Engineers estimate how small changes in a measurement propagate: if a pipe's radius is measured with 1% error, its cross-sectional area $\\pi r^2$ has about 2% error, because $\\dfrac{dA}A = 2\\dfrac{dr}r$. This is the differential $dA = 2\\pi r\\,dr$.",
      },
    },
    {
      type: "truth",
      statement: "At $(x_1, y_1)$ on $y = f(x)$: **tangent** $y - y_1 = f'(x_1)(x - x_1)$; **normal** $y - y_1 = -\\dfrac1{f'(x_1)}(x - x_1)$ (if $f'(x_1) \\ne 0$). The tangent is horizontal where $f'(x_1) = 0$ (normal $x = x_1$) and vertical where $\\dfrac{dx}{dy} = 0$. For parametric or implicit curves, use $\\dfrac{dy}{dx}$ from §{differentiation-methods}. **Related rates**: write the relation between the quantities, differentiate it with respect to $t$ (chain rule), then substitute the instantaneous values. **Approximation**: $f(a + h) \\approx f(a) + hf'(a)$.",
      body: "The **angle between two curves** at an intersection is the angle between their tangents there: $\\tan\\theta = \\left\\lvert\\dfrac{m_1 - m_2}{1 + m_1m_2}\\right\\rvert$ (§{straight-lines}); they cut **orthogonally** if $m_1m_2 = -1$. In related-rates problems the order matters: a quantity that is changing must stay a variable until after differentiation. Units help: if $r$ is in cm and $t$ in s, $\\dfrac{dA}{dt}$ is in cm²/s. Relative error: if $y = x^n$, then $\\dfrac{dy}y = n\\dfrac{dx}x$.",
    },
    {
      type: "predict",
      misconception: "substitute-before-differentiating",
      item: {
        kind: "mc",
        id: "tgn-predict-1",
        prompt: "A circle's radius grows at 2 cm/s. How fast is its area growing when $r = 5$ cm?",
        options: [
          { id: "a", text: "$20\\pi$ cm²/s", correct: true, why: "$\\dfrac{dA}{dt} = 2\\pi r\\dfrac{dr}{dt} = 2\\pi(5)(2)$." },
          { id: "b", text: "0: at that moment the area is $25\\pi$, a constant", misconception: "substitute-before-differentiating", why: "Substituting $r = 5$ freezes the radius; differentiate first." },
          { id: "c", text: "$10\\pi$ cm²/s", why: "$\\dfrac{d}{dr}\\pi r^2 = 2\\pi r$." },
        ],
      },
      reveal: {
        body: "The area is $25\\pi$ only at one instant; a moment later the radius is larger. The rate comes from differentiating the relation $A = \\pi r^2$ while $r$ is still a variable: $\\dfrac{dA}{dt} = 2\\pi r\\dfrac{dr}{dt}$. Only then put $r = 5$ and $\\dfrac{dr}{dt} = 2$: $20\\pi \\approx 62.8$ cm²/s.",
      },
      resolve: {
        kind: "mc",
        id: "tgn-resolve-1",
        prompt: "A square's side increases at 3 cm/s. How fast is its area increasing when the side is 4 cm?",
        options: [
          { id: "a", text: "24 cm²/s", correct: true, why: "$\\dfrac{d}{dt}s^2 = 2s\\dfrac{ds}{dt} = 2(4)(3)$." },
          { id: "b", text: "0 cm²/s", misconception: "substitute-before-differentiating", why: "The side is changing; keep it as a variable until after differentiating." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tgn-check-1",
        prompt: "The normal to $y = x^2$ at $(1, 1)$ has slope",
        options: [
          { id: "a", text: "$-\\tfrac12$", correct: true, why: "The tangent slope is 2, and the normal is perpendicular." },
          { id: "b", text: "$-2$", misconception: "normal-negative-slope", why: "Perpendicular slopes multiply to $-1$." },
          { id: "c", text: "2", why: "That is the tangent's slope." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tgn-check-2",
        prompt: "The tangent to $y = x^3$ at $(1, 1)$ is",
        options: [
          { id: "a", text: "$y = 3x - 2$", correct: true, why: "Slope $3x^2 = 3$: $y - 1 = 3(x - 1)$." },
          { id: "b", text: "$y = 3x - 3$", why: "It must pass through $(1, 1)$." },
          { id: "c", text: "$y = x$", why: "The slope is $f'(1) = 3$, not $f(1)/1$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Gradient descent moves along the tangent's information: each step assumes the loss is approximately linear nearby, $L(w + h) \\approx L(w) + hL'(w)$, and steps against the slope (§{gradient-descent}). If the step is too large the linear approximation breaks down, which is the mathematical reason learning rates must be small.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "tgn-produce-1", prompt: "Find the slope of the tangent to $y = x^3 - 2x$ at $x = 2$.", answer: 10, explain: "$3x^2 - 2$ at 2." },
        { kind: "number", id: "tgn-produce-2", prompt: "Use $f(a + h) \\approx f(a) + hf'(a)$ to approximate $\\sqrt{25.1}$.", answer: 5.01, explain: "$5 + \\tfrac{0.1}{2 \\times 5}$.", tolerance: 0.0001 },
        {
          kind: "mc",
          id: "tgn-produce-3",
          prompt: "The normal to $y = 3x^2$ at $x = 1$ has slope",
          options: [
            { id: "a", text: "$-\\tfrac16$", correct: true, why: "Tangent slope $6x = 6$." },
            { id: "b", text: "$-6$", misconception: "normal-negative-slope", why: "Negate **and** invert." },
          ],
        },
        {
          kind: "mc",
          id: "tgn-produce-4",
          prompt: "A sphere's radius grows at 0.5 cm/s. When $r = 3$ cm, its volume grows at",
          options: [
            { id: "a", text: "$18\\pi$ cm³/s", correct: true, why: "$4\\pi r^2\\dfrac{dr}{dt} = 4\\pi(9)(0.5)$." },
            { id: "b", text: "0 cm³/s", misconception: "substitute-before-differentiating", why: "Differentiate $V = \\tfrac43\\pi r^3$ before substituting." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "tgn-review-1", prompt: "Find the slope of the tangent to $y = x^2$ at $x = 3$.", answer: 6, explain: "$2x$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "tangents to parametric and implicit curves",
      body: "For $x = x(t)$, $y = y(t)$ the tangent at $t_0$ has slope $\\dfrac{\\dot y(t_0)}{\\dot x(t_0)}$; it is horizontal where $\\dot y = 0$ and vertical where $\\dot x = 0$. For an implicit curve $F(x, y) = 0$, differentiate implicitly and evaluate at the point; on $x^2 + y^2 = r^2$ this gives the familiar fact that the tangent is perpendicular to the radius (§{circles}).",
    },
    {
      type: "definition",
      term: "errors",
      body: "If $x$ is measured with a small error $\\Delta x$, the error in $y = f(x)$ is about $\\Delta y \\approx f'(x)\\Delta x$, the **absolute error**; $\\dfrac{\\Delta y}y$ is the **relative error** and $100\\dfrac{\\Delta y}y$ the **percentage error**. For a sphere, $V \\propto r^3$, so a 1% error in $r$ gives about a 3% error in $V$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "tangent and normal",
      statement: "The tangent to $y = f(x)$ at $(x_1, y_1)$ is $y - y_1 = f'(x_1)(x - x_1)$; the normal is $(x - x_1) + f'(x_1)(y - y_1) = 0$.",
      proof: ["The tangent passes through the point with slope $f'(x_1)$ (§{derivative}).", "The normal has slope $-1/f'(x_1)$; clearing the fraction gives $(x - x_1) + f'(x_1)(y - y_1) = 0$, a form that also covers $f'(x_1) = 0$, when the normal is the vertical line $x = x_1$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "related rates",
      statement: "If $F(x, y) = 0$ links two quantities that both depend on $t$, then $F_x\\dfrac{dx}{dt} + F_y\\dfrac{dy}{dt} = 0$.",
      proof: ["Differentiate $F(x(t), y(t)) = 0$ with respect to $t$ using the chain rule.", "For example, $x^2 + y^2 = L^2$ (a ladder) gives $x\\dot x + y\\dot y = 0$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "linear approximation",
      statement: "If $f$ is differentiable at $a$, then $f(a + h) = f(a) + hf'(a) + \\varepsilon(h)h$ with $\\varepsilon(h) \\to 0$ as $h \\to 0$.",
      proof: ["Define $\\varepsilon(h) = \\dfrac{f(a + h) - f(a)}h - f'(a)$; it tends to 0 by the definition of the derivative (§{differentiability})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the tangent and normal to $y = x^2 - 4x + 5$ at $(3, 2)$.",
      solution: ["$y' = 2x - 4 = 2$ at $x = 3$: tangent $y - 2 = 2(x - 3)$, that is $y = 2x - 4$.", "Normal slope $-\\tfrac12$: $y - 2 = -\\tfrac12(x - 3)$, that is $x + 2y - 7 = 0$."],
      result: "$y = 2x - 4$; $x + 2y = 7$.",
    },
    {
      type: "example",
      level: 2,
      title: "the sliding ladder",
      problem: "A 5 m ladder leans on a wall. Its foot slides away at 0.5 m/s. How fast is the top sliding down when the foot is 3 m from the wall?",
      solution: ["$x^2 + y^2 = 25$, so $x\\dot x + y\\dot y = 0$. When $x = 3$, $y = 4$.", "$3(0.5) + 4\\dot y = 0$, so $\\dot y = -0.375$ m/s."],
      result: "Down at 0.375 m/s.",
    },
    {
      type: "example",
      level: 3,
      title: "angle between curves",
      problem: "Find the angle between $y = x^2$ and $y = x^3$ at $(1, 1)$.",
      solution: ["Slopes $2x = 2$ and $3x^2 = 3$.", "$\\tan\\theta = \\left\\lvert\\dfrac{3 - 2}{1 + 6}\\right\\rvert = \\dfrac17$, so $\\theta = \\tan^{-1}\\tfrac17 \\approx 8.13°$."],
      result: "$\\tan^{-1}\\tfrac17$.",
    },
  ],
  pitfalls: [
    { wrong: "Substitute the given instant's values, then differentiate.", right: "Differentiate the relation first; substitute after." },
    { wrong: "Normal slope $= -f'(x_1)$.", right: "Normal slope $= -1/f'(x_1)$." },
    { wrong: "Write the tangent with $f'(x)$ instead of $f'(x_1)$.", right: "The slope is a number, the derivative evaluated at the point." },
  ],
  formulas: [
    { label: "Tangent", tex: "y - y_1 = f'(x_1)(x - x_1)" },
    { label: "Normal", tex: "y - y_1 = -\\tfrac1{f'(x_1)}(x - x_1)" },
    { label: "Approximation", tex: "f(a + h) \\approx f(a) + hf'(a)" },
    { label: "Angle", tex: "\\tan\\theta = \\left\\lvert\\tfrac{m_1 - m_2}{1 + m_1m_2}\\right\\rvert" },
  ],
  exercises: [
    ex(1, num("tgnx-ex-1", "Find the slope of the tangent to $y = x^3 - 3x$ at $x = 2$.", 9, "$3x^2 - 3$."), ["$9$."]),
    ex(1, num("tgnx-ex-2", "At what $x$ is the tangent to $y = x^2 - 6x + 1$ horizontal?", 3, "$2x - 6 = 0$."), ["$3$."]),
    ex(2, num("tgnx-ex-3", "Find the $y$-intercept of the normal to $y = x^2$ at $(2, 4)$.", 4.5, "Slope $-\\tfrac14$: $y = 4 - \\tfrac14(x - 2)$."), ["$4.5$."]),
    ex(2, num("tgnx-ex-4", "A 5 m ladder's foot slides from a wall at 0.5 m/s. Find $\\dfrac{dy}{dt}$ for the top when the foot is 3 m out.", -0.375, "$3(0.5) + 4\\dot y = 0$."), ["$-0.375$ m/s."]),
    ex(2, num("tgnx-ex-5", "Use differentials to approximate $(1.02)^5$.", 1.1, "$1 + 5(0.02)$."), ["$1.1$ (exact: 1.104)."]),
    ex(3, num("tgnx-ex-6", "Find the $y$-intercept of the tangent to $x = t^2$, $y = 2t$ at $t = 3$.", 3, "Slope $\\dfrac2{2t} = \\tfrac13$ at $(9, 6)$."), ["$y = 6 + \\tfrac13(x - 9)$: intercept 3."]),
    ex(3, fr("tgnx-ex-7", "Find $\\tan\\theta$ for the acute angle between $y = x^2$ and $y = x^3$ at $(1, 1)$.", 1 / 7, "Slopes 2 and 3."), ["$\\tfrac17$."]),
    ex(3, mc("tgnx-ex-8", "At $(0, 1)$, the curves $y = e^x$ and $y = e^{-x}$ meet", ["at right angles", "Slopes $1$ and $-1$ multiply to $-1$."], [["tangentially", "Their slopes differ."], ["at $45°$", "Use $\\tan\\theta = \\lvert\\tfrac{m_1 - m_2}{1 + m_1m_2}\\rvert$; the denominator is 0."]]), ["Orthogonal."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const co = (k: number) => (k === 1 ? "" : k === -1 ? "-" : `${k}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = [r.nonzero(-4, 4), r.nonzero(-6, 6), r.int(-5, 5)];
      const x0 = r.int(-3, 3);
      return n(`Find the slope of the tangent to $y = ${co(a)}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ at $x = ${x0}$.`, 2 * a * x0 + b, `$y' = ${2 * a}x + ${b}$ at ${x0}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-3, 3);
      let x0 = r.int(-3, 3);
      const b = r.nonzero(-5, 5);
      if (2 * a * x0 + b === 0) x0 += 1;
      const m = 2 * a * x0 + b;
      return n(`Find the slope of the normal to $y = ${co(a)}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x$ at $x = ${x0}$ (3 decimals).`, Math.round((-1 / m) * 1000) / 1000, `Tangent slope ${m}; normal slope $-\\tfrac1{${m}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const rad = r.int(2, 12);
      const rate = r.int(1, 5);
      const shape = r.pick(["circle", "sphere"] as const);
      const k = shape === "circle" ? 2 * rad * rate : 4 * rad * rad * rate;
      return n(`A ${shape}'s radius grows at ${rate} cm/s. When $r = ${rad}$ cm, its ${shape === "circle" ? "area" : "volume"} grows at $k\\pi$ cm${shape === "circle" ? "²" : "³"}/s. Find $k$.`, k, shape === "circle" ? `$2\\pi r\\dot r = 2\\pi(${rad})(${rate})$.` : `$4\\pi r^2\\dot r = 4\\pi(${rad * rad})(${rate})$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = r.int(2, 12);
      const d = r.nonzero(-9, 9) / 10;
      const v = m + d / (2 * m);
      return n(`Use $f(a + h) \\approx f(a) + hf'(a)$ to approximate $\\sqrt{${m * m + d}}$ (4 decimals).`, Math.round(v * 10000) / 10000, `$${m} + \\dfrac{${d}}{2 \\times ${m}}$.`, 0.0001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.int(2, 9);
      const rate = r.int(1, 4);
      return mcNumbers(
        `A square's side grows at ${rate} cm/s. When the side is ${s} cm, its area grows at`,
        { text: `${2 * s * rate} cm²/s`, why: `$2s\\dot s = 2(${s})(${rate})$.` },
        [{ text: "0 cm²/s", why: "Differentiate before substituting.", misconception: "substitute-before-differentiating" }, { text: `${s * rate} cm²/s`, why: "$\\tfrac{d}{dt}s^2 = 2s\\dot s$." }],
      );
    },
  },
];
