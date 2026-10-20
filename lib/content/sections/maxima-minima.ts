import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Local and global extrema; critical points and Fermat's theorem; the first and second derivative tests; extrema on closed intervals; concavity and points of inflection; optimisation problems (areas, volumes, distances, costs). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "maxima-minima",
  title: "Maxima & minima",
  summary: "At a local maximum or minimum of a differentiable function the tangent is horizontal, f′ = 0. The converse fails: x³ has f′(0) = 0 and no extremum. The first derivative test (f′ changes sign) or the second (f″ < 0 for a maximum, f″ > 0 for a minimum) decides. On a closed interval the greatest and least values are among the critical points and the two endpoints, so the endpoints must always be checked. Optimisation problems reduce to this after writing the quantity as a function of one variable.",
  deps: ["monotonicity"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "local maximum", meaning: "$f(c) \\ge f(x)$ for all $x$ near $c$; a **global** (absolute) maximum beats every $x$ in the domain." },
    { term: "point of inflection", meaning: "A point where the concavity changes, i.e. $f''$ changes sign." },
    { term: "concave up", meaning: "$f'' > 0$: the slope increases and the curve bends upward, lying above its tangents." },
  ],
  misconceptions: {
    "critical-is-extremum": "Thinks every critical point ($f' = 0$) is a local maximum or minimum.",
    "ignore-endpoints": "Looks for the greatest or least value on a closed interval only among the critical points, ignoring the endpoints.",
  },
  steps: [
    {
      type: "motivate",
      title: "The best possible",
      body: "What box made from a square sheet holds the most? What can shape uses the least metal? Which point on a curve is closest to a given point? Optimisation asks for the largest or smallest value of a quantity, and calculus finds it where the derivative vanishes, provided one remembers the boundary and checks that a flat point really is a peak or a valley.",
      realWorld: {
        title: "Economic order quantity",
        body: "A shop ordering $Q$ units at a time pays ordering costs that fall with $Q$ and storage costs that rise with $Q$. Total cost $\\dfrac{DS}Q + \\dfrac{HQ}2$ is least where its derivative vanishes, at $Q = \\sqrt{2DS/H}$, the classic formula used in inventory management.",
      },
    },
    {
      type: "truth",
      statement: "**Fermat**: if $f$ has a local extremum at an interior point $c$ and $f'(c)$ exists, then $f'(c) = 0$. Candidates are the **critical points** ($f' = 0$ or undefined). **First derivative test**: $f'$ changing $+ \\to -$ at $c$ gives a local maximum, $- \\to +$ a local minimum, no change neither. **Second derivative test**: $f'(c) = 0$ and $f''(c) < 0$ gives a maximum, $f''(c) > 0$ a minimum, $f''(c) = 0$ inconclusive. **Closed interval**: the global maximum and minimum of a continuous $f$ on $[a, b]$ are the largest and smallest of $f$ at the critical points in $(a, b)$ and at $a$ and $b$.",
      body: "$f'(c) = 0$ is necessary but not sufficient: $x^3$ at 0 is a horizontal **point of inflection**. Concavity: $f'' > 0$ concave up, $f'' < 0$ concave down; inflection where $f''$ changes sign. **Optimisation recipe**: (1) name the variables and draw; (2) write the quantity to optimise; (3) use the constraint to reduce it to one variable; (4) find critical points in the allowed range; (5) check they give the required extremum (and compare with the endpoints). AM–GM (§{means-inequalities}) often confirms the answer: with $x + y$ fixed, $xy$ is greatest when $x = y$.",
    },
    {
      type: "predict",
      misconception: "critical-is-extremum",
      item: {
        kind: "mc",
        id: "mxm-predict-1",
        prompt: "$f(x) = x^3$ has $f'(0) = 0$. At $x = 0$, $f$ has",
        options: [
          { id: "a", text: "neither a maximum nor a minimum", correct: true, why: "$f' \\ge 0$ on both sides: $f$ keeps increasing through 0." },
          { id: "b", text: "a local minimum, because $f'(0) = 0$", misconception: "critical-is-extremum", why: "$f' = 0$ is necessary for an extremum, not sufficient." },
          { id: "c", text: "a local maximum", why: "Values to the right are larger." },
        ],
      },
      reveal: {
        body: "Just left of 0, $f(x) < 0$; just right, $f(x) > 0$. So 0 is neither the highest nor the lowest value nearby, although the tangent is horizontal there. The first derivative test shows it: $f' = 3x^2$ is positive on both sides, with no sign change. The point is a horizontal inflection.",
      },
      resolve: {
        kind: "mc",
        id: "mxm-resolve-1",
        prompt: "$f(x) = x^3 - 3x^2 + 3x$ has $f'(x) = 3(x - 1)^2$. At $x = 1$, $f$ has",
        options: [
          { id: "a", text: "no extremum", correct: true, why: "$f' \\ge 0$ on both sides; no sign change." },
          { id: "b", text: "a local minimum", misconception: "critical-is-extremum", why: "Check the sign of $f'$ either side." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mxm-check-1",
        prompt: "The greatest value of $f(x) = x^2$ on $[-1, 3]$ is",
        options: [
          { id: "a", text: "9, at $x = 3$", correct: true, why: "Compare $f(-1) = 1$, $f(0) = 0$, $f(3) = 9$." },
          { id: "b", text: "There is none: the only critical point, $x = 0$, is a minimum", misconception: "ignore-endpoints", why: "On a closed interval the maximum can sit at an endpoint." },
          { id: "c", text: "1, at $x = -1$", why: "$f(3)$ is larger." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mxm-check-2",
        prompt: "$f(x) = x^3 - 3x$ has a local maximum at",
        options: [
          { id: "a", text: "$x = -1$", correct: true, why: "$f' = 0$ and $f''(-1) = -6 < 0$." },
          { id: "b", text: "$x = 1$", why: "$f''(1) = 6 > 0$: a minimum." },
          { id: "c", text: "$x = 0$", why: "$f'(0) = -3 \\ne 0$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training a model is minimising a loss; gradient descent looks for points where the gradient vanishes (§{gradient-descent}). In many dimensions most critical points of a neural network's loss are saddle points, the higher-dimensional relatives of $x^3$'s flat inflection, which is why \"$f' = 0$\" alone doesn't mean a minimum was found.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mxm-produce-1", prompt: "Find the greatest value of $x(10 - x)$.", answer: 25, explain: "At $x = 5$." },
        { kind: "number", id: "mxm-produce-2", prompt: "Equal squares of side $x$ are cut from the corners of a $12 \\times 12$ sheet and the sides folded up into an open box. Find the greatest volume.", answer: 128, explain: "$V = x(12 - 2x)^2$, $V' = (12 - 2x)(12 - 6x) = 0$ at $x = 2$." },
        {
          kind: "mc",
          id: "mxm-produce-3",
          prompt: "The least value of $f(x) = x^2 - 4x + 7$ on $[3, 5]$ is",
          options: [
            { id: "a", text: "4, at $x = 3$", correct: true, why: "$f' = 2x - 4 > 0$ on $[3, 5]$, so the least value is at the left end." },
            { id: "b", text: "3, at the critical point $x = 2$", misconception: "ignore-endpoints", why: "$x = 2$ is outside $[3, 5]$; check the endpoints." },
          ],
        },
        {
          kind: "mc",
          id: "mxm-produce-4",
          prompt: "$f(x) = x^5$ at $x = 0$ has",
          options: [
            { id: "a", text: "neither a maximum nor a minimum", correct: true, why: "$f' = 5x^4 \\ge 0$ doesn't change sign." },
            { id: "b", text: "a local minimum, because $f'(0) = 0$", misconception: "critical-is-extremum", why: "No sign change of $f'$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mxm-review-1", prompt: "Find the critical point of $f(x) = x^2 - 6x$.", answer: 3, explain: "$2x - 6 = 0$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "concavity and inflection",
      body: "$f$ is concave up on an interval if $f'$ increases there ($f'' > 0$), concave down if $f'$ decreases ($f'' < 0$). A point of inflection is where the concavity changes; $f''(c) = 0$ is necessary (if $f''$ exists) but not sufficient: $x^4$ has $f''(0) = 0$ and no inflection.",
    },
    {
      type: "definition",
      term: "when the second derivative test fails",
      body: "If $f'(c) = f''(c) = 0$, use the first derivative test, or higher derivatives: if the first nonzero derivative at $c$ has even order $n$, $c$ is an extremum (minimum if $f^{(n)}(c) > 0$); if odd, it isn't. So $x^4$ has a minimum at 0 and $x^5$ doesn't.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "Fermat's theorem",
      statement: "If $f$ has a local maximum or minimum at an interior point $c$ and $f'(c)$ exists, then $f'(c) = 0$.",
      proof: ["At a local maximum, $\\dfrac{f(c + h) - f(c)}h \\le 0$ for small $h > 0$ and $\\ge 0$ for small $h < 0$.", "The right limit is $\\le 0$ and the left limit $\\ge 0$; both equal $f'(c)$, so $f'(c) = 0$."],
    },
    {
      type: "theorem",
      name: "the second derivative test",
      statement: "If $f'(c) = 0$ and $f''(c) < 0$, $f$ has a local maximum at $c$; if $f''(c) > 0$, a local minimum.",
      proof: ["$f''(c) < 0$ means $f'$ is decreasing near $c$; with $f'(c) = 0$, $f' > 0$ just left of $c$ and $f' < 0$ just right.", "By the first derivative test, $c$ is a maximum (§{monotonicity})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the least-surface cylinder",
      statement: "Of all closed cylinders with volume $V$, the one with least surface area has height equal to its diameter.",
      proof: ["$S = 2\\pi r^2 + 2\\pi rh$ with $\\pi r^2h = V$, so $S(r) = 2\\pi r^2 + \\dfrac{2V}r$.", "$S'(r) = 4\\pi r - \\dfrac{2V}{r^2} = 0$ gives $V = 2\\pi r^3$, i.e. $h = 2r$; $S'' > 0$ confirms a minimum."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the local extrema of $f(x) = x^3 - 6x^2 + 9x + 1$.",
      solution: ["$f' = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$; $f'' = 6x - 12$.", "$f''(1) = -6$: local maximum $f(1) = 5$. $f''(3) = 6$: local minimum $f(3) = 1$."],
      result: "Maximum 5 at $x = 1$; minimum 1 at $x = 3$.",
    },
    {
      type: "example",
      level: 2,
      title: "a closed interval",
      problem: "Find the greatest and least values of $f(x) = x^3 - 3x$ on $[0, 2]$.",
      solution: ["Critical point in $(0, 2)$: $x = 1$, with $f(1) = -2$.", "Endpoints: $f(0) = 0$, $f(2) = 2$. Greatest 2 (at the endpoint), least $-2$."],
      result: "Greatest 2, least $-2$.",
    },
    {
      type: "example",
      level: 3,
      title: "the open box",
      problem: "Squares of side $x$ are cut from the corners of a $12 \\times 12$ sheet to make an open box. Find $x$ for the greatest volume.",
      solution: ["$V = x(12 - 2x)^2$ for $0 < x < 6$; $V' = (12 - 2x)(12 - 6x)$.", "$V' = 0$ at $x = 2$ (and $x = 6$, excluded); $V$ rises then falls, so $V(2) = 128$ is the maximum."],
      result: "$x = 2$, volume 128.",
    },
  ],
  pitfalls: [
    { wrong: "$f'(c) = 0$ means an extremum.", right: "Check a sign change or $f''(c)$." },
    { wrong: "Ignore the endpoints of a closed interval.", right: "Compare critical values with $f(a)$ and $f(b)$." },
    { wrong: "Use a critical point outside the allowed range.", right: "Only critical points in the domain count." },
  ],
  formulas: [
    { label: "Necessary", tex: "f'(c) = 0" },
    { label: "Second derivative test", tex: "f''(c) < 0 \\text{ max},\\ f''(c) > 0 \\text{ min}" },
    { label: "Inflection", tex: "f'' \\text{ changes sign}" },
  ],
  exercises: [
    ex(1, num("mxmx-ex-1", "Find the least value of $x^2 - 8x + 3$.", -13, "At $x = 4$."), ["$16 - 32 + 3 = -13$."]),
    ex(1, num("mxmx-ex-2", "Find the local maximum value of $x^3 - 3x$.", 2, "At $x = -1$."), ["$-1 + 3 = 2$."]),
    ex(2, dp("mxmx-ex-3", "Find the greatest value of $\\sin x + \\cos x$.", Math.SQRT2, "$\\sqrt2\\sin(x + \\tfrac\\pi4)$."), ["$\\sqrt2 \\approx 1.414$."]),
    ex(2, num("mxmx-ex-4", "Find the greatest value of $x^3 - 3x$ on $[0, 2]$.", 2, "Endpoint $x = 2$."), ["$2$."]),
    ex(2, num("mxmx-ex-5", "Two positive numbers have sum 20. Find their greatest product.", 100, "Both 10."), ["$100$."]),
    ex(3, num("mxmx-ex-6", "Find the greatest volume of an open box from a $12 \\times 12$ sheet with corner squares cut out.", 128, "$x = 2$."), ["$128$."]),
    ex(3, num("mxmx-ex-7", "Find the $x$-coordinate of the point of inflection of $x^3 - 6x^2 + 9x$.", 2, "$f'' = 6x - 12$."), ["$2$."]),
    ex(3, mc("mxmx-ex-8", "$f'(a) = 0$ and $f''(a) = 0$. Then at $a$,", ["$f$ may have a maximum, a minimum, or neither", "$x^4$, $-x^4$ and $x^3$ at 0 show all three."], [["$f$ has a point of inflection", "$x^4$ has $f''(0) = 0$ but a minimum."], ["$f$ has a minimum", "$-x^4$ has a maximum there."]]), ["The second derivative test is inconclusive."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });
const term = (k: number, v: string) => (k === 0 ? "" : ` ${k < 0 ? "-" : "+"} ${Math.abs(k)}${v}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const h = r.nonzero(-6, 6);
      const c = r.int(-9, 9);
      const v = c - h * h;
      return n(`Find the least value of $x^2${term(-2 * h, "x")}${term(c, "")}$.`, v, `Complete the square: $(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})^2${term(v, "")}$, least at $x = ${h}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(1, 3);
      const c = r.int(-5, 5);
      const want = r.pick(["max", "min"] as const);
      const v = want === "max" ? 2 * p ** 3 + c : -2 * p ** 3 + c;
      return n(`Find the local ${want === "max" ? "maximum" : "minimum"} value of $f(x) = x^3${term(-3 * p * p, "x")}${term(c, "")}$.`, v, `$f' = 3(x^2 - ${p * p})$: critical points $\\pm${p}$; $f''(${want === "max" ? -p : p}) ${want === "max" ? "<" : ">"} 0$, so the ${want === "max" ? "maximum" : "minimum"} is $f(${want === "max" ? -p : p}) = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s = 2 * r.int(2, 15);
      return n(`Two positive numbers have sum ${s}. Find their greatest product.`, (s / 2) ** 2, `$x(${s} - x)$ is greatest at $x = ${s / 2}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = -r.int(1, 5);
      const b = r.int(1, 5);
      const want = r.pick(["max", "min"] as const);
      const v = want === "max" ? Math.max(a * a, b * b) : 0;
      return n(`Find the ${want === "max" ? "greatest" : "least"} value of $x^2$ on $[${a}, ${b}]$.`, v, want === "max" ? `Compare the endpoints: $(${a})^2 = ${a * a}$ and $${b}^2 = ${b * b}$.` : "The critical point $x = 0$ lies inside: the least value is 0.");
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([3, 5, 7]);
      return mcNumbers(
        `$f(x) = x^{${k}}$ has $f'(0) = 0$. At 0, $f$ has`,
        { text: "neither a maximum nor a minimum", why: `$f' = ${k}x^{${k - 1}} \\ge 0$ on both sides.` },
        [{ text: "a local minimum", why: "$f' = 0$ alone doesn't give an extremum.", misconception: "critical-is-extremum" }, { text: "a local maximum", why: "Values to the right are larger." }],
      );
    },
  },
];
