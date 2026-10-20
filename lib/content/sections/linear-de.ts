import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Linear first-order equations dy/dx + P(x)y = Q(x): standard form, the integrating factor e^∫P, the solution formula; equations linear in x; Bernoulli equations reduced to linear form. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "linear-de",
  title: "Linear first-order equations",
  summary: "A linear equation dy/dx + P(x)y = Q(x) is solved by multiplying through by the integrating factor I = e^{∫P dx}, which turns the left side into the derivative of yI. Then yI = ∫Q·I dx + C. Two steps go wrong most often: the equation must first be in standard form (coefficient of dy/dx equal to 1), and the right side Q must be multiplied by I too. Bernoulli equations y′ + Py = Qyⁿ become linear with v = y^{1−n}.",
  deps: ["separable-homogeneous"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "standard form", meaning: "$\\dfrac{dy}{dx} + P(x)y = Q(x)$, with the coefficient of $\\dfrac{dy}{dx}$ equal to 1." },
    { term: "integrating factor", meaning: "$I(x) = e^{\\int P\\,dx}$; multiplying by it makes the left side $\\dfrac{d}{dx}(yI)$." },
    { term: "Bernoulli equation", meaning: "$\\dfrac{dy}{dx} + Py = Qy^n$ ($n \\ne 0, 1$), made linear by $v = y^{1 - n}$." },
  ],
  misconceptions: {
    "if-forget-multiply-q": "Multiplies only the left side by the integrating factor, writing $yI = \\int Q\\,dx + C$.",
    "not-standard-form": "Reads $P$ off an equation before dividing by the coefficient of $\\dfrac{dy}{dx}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "One trick for a whole class",
      body: "Equations such as $y' + y = e^{-x}$ can't be separated: $y$ and $x$ are tangled on the right. But they are linear in $y$ and $y'$, and for every such equation one multiplier, the integrating factor, makes the left side an exact derivative. JEE sets these every year, often with the twist of writing the equation in $x$ as a function of $y$.",
      realWorld: {
        title: "An RC circuit",
        body: "A capacitor charging through a resistor obeys $RC\\dfrac{dV}{dt} + V = E(t)$, a linear equation. With a constant supply $E$, the integrating factor $e^{t/RC}$ gives $V = E(1 - e^{-t/RC})$: the familiar charging curve, approaching $E$ with time constant $RC$.",
      },
    },
    {
      type: "truth",
      statement: "For $\\dfrac{dy}{dx} + P(x)y = Q(x)$: the **integrating factor** is $I = e^{\\int P\\,dx}$, and then $\\dfrac{d}{dx}(yI) = QI$, so $$yI = \\int Q(x)I(x)\\,dx + C.$$ First put the equation in standard form: divide by the coefficient of $\\dfrac{dy}{dx}$. **Linear in $x$**: $\\dfrac{dx}{dy} + P(y)x = Q(y)$ has $I = e^{\\int P\\,dy}$ and $xI = \\int QI\\,dy + C$. **Bernoulli**: for $y' + Py = Qy^n$, divide by $y^n$ and put $v = y^{1-n}$: $\\dfrac{dv}{dx} + (1 - n)Pv = (1 - n)Q$.",
      body: "Why it works: $\\dfrac{d}{dx}(yI) = y'I + yI' = y'I + yPI = I(y' + Py)$, since $I' = PI$. Useful factors: $P = \\dfrac kx$ gives $I = x^k$ (for $x > 0$); $P = k$ gives $I = e^{kx}$; $P = \\tan x$ gives $I = \\sec x$. Any antiderivative of $P$ works; the constant would cancel. The general solution is a particular solution plus $Ce^{-\\int P}$, the solution of the equation with $Q = 0$ (which is separable, §{separable-homogeneous}).",
    },
    {
      type: "predict",
      misconception: "if-forget-multiply-q",
      item: {
        kind: "mc",
        id: "lde-predict-1",
        prompt: "Solve $\\dfrac{dy}{dx} + 2y = 4$.",
        options: [
          { id: "a", text: "$y = 2 + Ce^{-2x}$", correct: true, why: "$I = e^{2x}$: $ye^{2x} = \\int 4e^{2x}\\,dx = 2e^{2x} + C$." },
          { id: "b", text: "$ye^{2x} = 4x + C$", misconception: "if-forget-multiply-q", why: "The right side must be multiplied by $e^{2x}$ too." },
          { id: "c", text: "$y = 2 + Ce^{2x}$", why: "That grows; check it in the equation: $y' + 2y = 4 + 4Ce^{2x}$." },
        ],
      },
      reveal: {
        body: "Multiplying the whole equation by $e^{2x}$: $e^{2x}y' + 2e^{2x}y = 4e^{2x}$. The left side is $(ye^{2x})'$, and the **right** side is now $4e^{2x}$, which integrates to $2e^{2x}$. So $ye^{2x} = 2e^{2x} + C$ and $y = 2 + Ce^{-2x}$. Check: $y' + 2y = -2Ce^{-2x} + 4 + 2Ce^{-2x} = 4$.",
      },
      resolve: {
        kind: "mc",
        id: "lde-resolve-1",
        prompt: "Solve $\\dfrac{dy}{dx} + y = 1$.",
        options: [
          { id: "a", text: "$y = 1 + Ce^{-x}$", correct: true, why: "$ye^x = \\int e^x\\,dx = e^x + C$." },
          { id: "b", text: "$ye^x = x + C$", misconception: "if-forget-multiply-q", why: "Integrate $Q \\cdot I = e^x$, not $Q$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lde-check-1",
        prompt: "The integrating factor of $x\\dfrac{dy}{dx} + 2y = x^2$ ($x > 0$) is",
        options: [
          { id: "a", text: "$x^2$", correct: true, why: "Standard form $y' + \\tfrac2xy = x$: $e^{\\int 2/x} = x^2$." },
          { id: "b", text: "$e^{2x}$", misconception: "not-standard-form", why: "Divide by $x$ first: $P = \\tfrac2x$, not 2." },
          { id: "c", text: "$x$", why: "$e^{2\\ln x} = x^2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lde-check-2",
        prompt: "The integrating factor of $\\dfrac{dy}{dx} - \\dfrac yx = x$ ($x > 0$) is",
        options: [
          { id: "a", text: "$\\dfrac1x$", correct: true, why: "$e^{-\\ln x}$." },
          { id: "b", text: "$x$", why: "$P = -\\tfrac1x$ gives $e^{-\\ln x}$." },
          { id: "c", text: "$e^{-x}$", why: "$\\int -\\tfrac1x\\,dx = -\\ln x$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "An exponential moving average, used in optimisers like Adam and in batch-norm statistics, is the discrete form of $\\dfrac{dm}{dt} + \\lambda m = \\lambda g(t)$: its solution weights past inputs by $e^{-\\lambda(t - s)}$, exactly what the integrating factor produces.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "lde-produce-1", prompt: "Solve $y' + y = 1$, $y(0) = 0$. Find $y(\\ln 2)$.", answer: 0.5, explain: "$y = 1 - e^{-x}$." },
        { kind: "number", id: "lde-produce-2", prompt: "Solve $y' + 2y = 4$, $y(0) = 3$. Find $\\lim_{x \\to \\infty}y$.", answer: 2, explain: "$y = 2 + e^{-2x} \\to 2$." },
        {
          kind: "mc",
          id: "lde-produce-3",
          prompt: "The general solution of $y' + 3y = 6$ is",
          options: [
            { id: "a", text: "$y = 2 + Ce^{-3x}$", correct: true, why: "$ye^{3x} = 2e^{3x} + C$." },
            { id: "b", text: "$ye^{3x} = 6x + C$", misconception: "if-forget-multiply-q", why: "Integrate $6e^{3x}$." },
          ],
        },
        {
          kind: "mc",
          id: "lde-produce-4",
          prompt: "The integrating factor of $x\\dfrac{dy}{dx} + y = x^3$ ($x > 0$) is",
          options: [
            { id: "a", text: "$x$", correct: true, why: "$y' + \\tfrac1xy = x^2$." },
            { id: "b", text: "$e^x$", misconception: "not-standard-form", why: "Divide through by $x$ first." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "lde-review-1", prompt: "The integrating factor of $y' + 2y = x$ is $e^{kx}$. Find $k$.", answer: 2, explain: "$e^{\\int 2\\,dx}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "equations linear in x",
      body: "$\\dfrac{dy}{dx} = \\dfrac1{x + y}$ isn't linear in $y$, but flipped it is: $\\dfrac{dx}{dy} - x = y$. Then $I = e^{-y}$ and $xe^{-y} = \\int ye^{-y}\\,dy = -(y + 1)e^{-y} + C$, so $x = Ce^y - y - 1$.",
    },
    {
      type: "definition",
      term: "Bernoulli equations",
      body: "$y' + Py = Qy^n$. Divide by $y^n$: $y^{-n}y' + Py^{1-n} = Q$. With $v = y^{1-n}$, $v' = (1 - n)y^{-n}y'$, giving the linear equation $v' + (1 - n)Pv = (1 - n)Q$. Example: $y' + y = y^2$ ($n = 2$, $v = \\tfrac1y$): $v' - v = -1$, $v = 1 + Ce^x$, $y = \\dfrac1{1 + Ce^x}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the integrating factor",
      statement: "With $I = e^{\\int P\\,dx}$, the solutions of $y' + Py = Q$ are exactly $y = \\dfrac1I\\left(\\int QI\\,dx + C\\right)$.",
      proof: ["$I' = PI$, so $(yI)' = y'I + yPI = I(y' + Py)$.", "Hence $y' + Py = Q$ iff $(yI)' = QI$; integrate."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "structure of solutions",
      statement: "The general solution is $y = y_p + Ce^{-\\int P}$, a particular solution plus the general solution of $y' + Py = 0$.",
      proof: ["If $y_1, y_2$ both solve the equation, their difference solves $y' + Py = 0$, whose solutions are $Ce^{-\\int P}$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Bernoulli reduction",
      statement: "$v = y^{1-n}$ turns $y' + Py = Qy^n$ into $v' + (1 - n)Pv = (1 - n)Q$.",
      proof: ["$v' = (1 - n)y^{-n}y' = (1 - n)y^{-n}(Qy^n - Py) = (1 - n)(Q - Pv)$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Solve $y' + y = e^{-x}$.",
      solution: ["$I = e^x$: $(ye^x)' = 1$.", "$ye^x = x + C$, so $y = (x + C)e^{-x}$."],
      result: "$y = (x + C)e^{-x}$.",
    },
    {
      type: "example",
      level: 2,
      title: "standard form first",
      problem: "Solve $xy' + 2y = x^2$ for $x > 0$.",
      solution: ["Divide by $x$: $y' + \\tfrac2xy = x$, so $I = x^2$.", "$(x^2y)' = x^3$: $x^2y = \\tfrac{x^4}4 + C$, $y = \\tfrac{x^2}4 + \\tfrac C{x^2}$."],
      result: "$y = \\tfrac{x^2}4 + \\tfrac C{x^2}$.",
    },
    {
      type: "example",
      level: 3,
      title: "a Bernoulli equation",
      problem: "Solve $y' + y = y^2$, $y(0) = \\tfrac12$.",
      solution: ["$v = \\tfrac1y$: $v' - v = -1$, so $v = 1 + Ce^x$.", "$y(0) = \\tfrac12$ gives $v(0) = 2$, $C = 1$: $y = \\dfrac1{1 + e^x}$."],
      result: "$y = \\dfrac1{1 + e^x}$.",
    },
  ],
  pitfalls: [
    { wrong: "$yI = \\int Q\\,dx + C$.", right: "$yI = \\int QI\\,dx + C$." },
    { wrong: "Read $P$ before dividing by the coefficient of $y'$.", right: "Get the standard form first." },
    { wrong: "Divide $C$ by $I$ only in the particular part.", right: "$y = \\dfrac1I\\left(\\int QI + C\\right)$: the constant term is $\\dfrac CI$." },
  ],
  formulas: [
    { label: "Integrating factor", tex: "I = e^{\\int P\\,dx}" },
    { label: "Solution", tex: "yI = \\int QI\\,dx + C" },
    { label: "Bernoulli", tex: "v = y^{1 - n}" },
    { label: "Common factors", tex: "P = \\tfrac kx \\Rightarrow I = x^k" },
  ],
  exercises: [
    ex(1, num("ldex-ex-1", "The integrating factor of $y' + 3y = x$ is $e^{kx}$. Find $k$.", 3, "$\\int 3\\,dx$."), ["$3$."]),
    ex(1, num("ldex-ex-2", "The integrating factor of $y' + \\dfrac yx = x^2$ ($x > 0$) is $x^k$. Find $k$.", 1, "$e^{\\ln x}$."), ["$1$."]),
    ex(2, num("ldex-ex-3", "Solve $y' + y = 1$, $y(0) = 0$. Find $y(\\ln 2)$.", 0.5, "$1 - e^{-x}$."), ["$\\tfrac12$."]),
    ex(2, num("ldex-ex-4", "Solve $y' + 2y = 4$, $y(0) = 3$. Find $y(\\ln 2)$.", 2.25, "$2 + e^{-2x}$."), ["$2 + \\tfrac14$."]),
    ex(2, num("ldex-ex-5", "Solve $xy' + 2y = x^2$ ($x > 0$), $y(1) = 1$. Find $y(2)$.", 1.1875, "$y = \\tfrac{x^2}4 + \\tfrac{3/4}{x^2}$."), ["$1 + \\tfrac3{16} = 1.1875$."]),
    ex(3, dp("ldex-ex-6", "Solve $y' - y = e^x$, $y(0) = 0$. Find $y(1)$.", Math.E, "$I = e^{-x}$: $ye^{-x} = x$."), ["$y = xe^x$: $e \\approx 2.718$."]),
    ex(3, num("ldex-ex-7", "Solve $y' + y = y^2$, $y(0) = \\tfrac12$. Find $y(\\ln 3)$.", 0.25, "$y = \\tfrac1{1 + e^x}$."), ["$\\tfrac14$."]),
    ex(3, mc("ldex-ex-8", "Treated as linear in $x$, $\\dfrac{dx}{dy} + x = y$ has integrating factor", ["$e^y$", "$P = 1$ as a function of $y$."], [["$e^x$", "Integrate with respect to $y$."], ["$e^{-y}$", "$\\int 1\\,dy = y$."]]), ["$xe^y = \\int ye^y\\,dy$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 4);
      const c = r.nonzero(-6, 9);
      const y0 = r.int(-3, 6);
      const x0 = r.pick([0.5, 1, 2]);
      const want = r.pick(["limit", "value"] as const);
      const v = want === "limit" ? c / k : c / k + (y0 - c / k) * Math.exp(-k * x0);
      return n(`Solve $y' + ${k === 1 ? "" : k}y = ${c}$, $y(0) = ${y0}$. Find ${want === "limit" ? "$\\lim_{x \\to \\infty}y$" : `$y(${x0})$`} (3 decimals).`, Math.round(v * 1000) / 1000, `$y = \\tfrac{${c}}{${k}} + \\left(${y0} - \\tfrac{${c}}{${k}}\\right)e^{-${k}x}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 5);
      return n(`The integrating factor of $x\\dfrac{dy}{dx} + ${k === 1 ? "" : k}y = x^3$ ($x > 0$) is $x^m$. Find $m$.`, k, `Standard form $y' + \\tfrac{${k}}xy = x^2$: $e^{${k}\\ln x} = x^{${k}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.nonzero(-5, 5);
      return n(`The integrating factor of $y' ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}y = \\sin x$ is $e^{mx}$. Find $m$.`, k, `$e^{\\int ${k}\\,dx}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.int(2, 5);
      const c = k * r.int(1, 4);
      return mcNumbers(
        `The general solution of $y' + ${k}y = ${c}$ is`,
        { text: `$y = ${c / k} + Ce^{-${k}x}$`, why: `$ye^{${k}x} = \\int ${c}e^{${k}x}\\,dx$.` },
        [{ text: `$ye^{${k}x} = ${c}x + C$`, why: "The right side must be multiplied by the integrating factor.", misconception: "if-forget-multiply-q" }, { text: `$y = ${c / k} + Ce^{${k}x}$`, why: "The exponential must decay: $e^{-kx}$." }],
      );
    },
  },
];
