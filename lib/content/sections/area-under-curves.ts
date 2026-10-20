import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Area as a definite integral; regions below the axis and total versus net area; area between two curves (vertical and horizontal strips); finding the limits from intersection points; standard areas: parabola and latus rectum, circle, ellipse; Archimedes' parabolic segment. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "area-under-curves",
  title: "Areas between curves",
  summary: "The integral ∫ₐᵇ f(x) dx counts area above the x-axis as positive and below as negative, so a geometric area is ∫|f| dx: split the interval where f changes sign. The area between two curves is ∫(upper − lower) dx between the x-values where they meet. Sometimes horizontal strips, ∫(right − left) dy, are simpler. The first job is always a sketch and the intersection points.",
  deps: ["definite-integrals", "parabola"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "net (signed) area", meaning: "$\\int_a^bf(x)\\,dx$, in which parts below the axis count negatively." },
    { term: "total area", meaning: "$\\int_a^b\\lvert f(x)\\rvert\\,dx$, the geometric area between the curve and the axis." },
    { term: "strip", meaning: "A thin rectangle of width $dx$ (or $dy$) whose length is the gap between the bounding curves." },
  ],
  misconceptions: {
    "signed-area": "Takes $\\int_a^bf(x)\\,dx$ as the area even where the curve dips below the $x$-axis, so negative parts cancel positive ones.",
    "intersection-limits": "Integrates between limits that are not the $x$-coordinates where the bounding curves meet.",
  },
  steps: [
    {
      type: "motivate",
      title: "Measuring curved regions",
      body: "Geometry gives the areas of polygons and circles; calculus gives the area of any region bounded by curves. The integral does the adding, but it keeps signs, so a careful sketch decides which curve is on top, where curves cross, and which pieces to add. JEE area questions are mostly about setting up the right integrals.",
      realWorld: {
        title: "Inequality and the Lorenz curve",
        body: "Economists measure inequality with the Gini coefficient: twice the area between the line of equality $y = x$ and the Lorenz curve, which shows the share of income held by the poorest fraction of people. It is exactly an area between two curves on $[0, 1]$.",
      },
    },
    {
      type: "truth",
      statement: "The area between $y = f(x)$ and the $x$-axis from $a$ to $b$ is $\\int_a^b\\lvert f(x)\\rvert\\,dx$: split at the zeros of $f$ and add the absolute values of the pieces. The area between $y = f(x)$ and $y = g(x)$ with $f \\ge g$ on $[a, b]$ is $\\int_a^b(f - g)\\,dx$, where $a, b$ are usually the intersection points ($f = g$). With horizontal strips, the area between $x = p(y)$ and $x = q(y)$, $p \\ge q$, is $\\int_c^d(p - q)\\,dy$. **Standard results**: $y^2 = 4ax$ and its latus rectum enclose $\\tfrac83a^2$; the circle $x^2 + y^2 = r^2$ has area $\\pi r^2$; the ellipse $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ has area $\\pi ab$ (§{ellipse}).",
      body: "Method: (1) sketch; (2) solve $f = g$ for the intersection points; (3) decide which curve is above on each interval; (4) integrate upper minus lower; (5) if the curves cross inside, split there. **Archimedes' result**: a parabolic segment has $\\tfrac23$ the area of the rectangle enclosing it (with the same base and height), so the region between $y = x^2$ and $y = h^2$ has area $\\tfrac23 \\times 2h \\times h^2 = \\tfrac43h^3$. Symmetry halves the work: for an even integrand on $[-a, a]$, compute $\\int_0^a$ and double (§{definite-integrals}).",
    },
    {
      type: "predict",
      misconception: "signed-area",
      item: {
        kind: "mc",
        id: "arc-predict-1",
        prompt: "The area between $y = \\sin x$ and the $x$-axis for $0 \\le x \\le 2\\pi$ is",
        options: [
          { id: "a", text: "4", correct: true, why: "Each hump has area 2." },
          { id: "b", text: "0", misconception: "signed-area", why: "That is the net integral; the lower hump's area is still positive." },
          { id: "c", text: "2", why: "Count both humps." },
        ],
      },
      reveal: {
        body: "$\\int_0^\\pi\\sin x\\,dx = 2$ and $\\int_\\pi^{2\\pi}\\sin x\\,dx = -2$: the integral over $[0, 2\\pi]$ is 0 because the second hump lies below the axis. Area is never negative, so take $\\lvert -2\\rvert$ and add: $2 + 2 = 4$. Always split where the curve crosses the axis.",
      },
      resolve: {
        kind: "mc",
        id: "arc-resolve-1",
        prompt: "The area between $y = x^3$ and the $x$-axis for $-1 \\le x \\le 1$ is",
        options: [
          { id: "a", text: "$\\tfrac12$", correct: true, why: "$2\\int_0^1x^3\\,dx = \\tfrac12$." },
          { id: "b", text: "0", misconception: "signed-area", why: "The left half is below the axis; its area still counts." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "arc-check-1",
        prompt: "The area enclosed by $y = x^2$ and $y = x$ is",
        options: [
          { id: "a", text: "$\\int_0^1(x - x^2)\\,dx = \\tfrac16$", correct: true, why: "They meet at $x = 0$ and $x = 1$, with $y = x$ on top." },
          { id: "b", text: "$\\int_{-1}^1(x - x^2)\\,dx$", misconception: "intersection-limits", why: "The curves meet at 0 and 1, not at $-1$." },
          { id: "c", text: "$\\tfrac13$", why: "That is $\\int_0^1x^2\\,dx$ alone." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "arc-check-2",
        prompt: "The area of the ellipse $\\dfrac{x^2}9 + \\dfrac{y^2}4 = 1$ is",
        options: [
          { id: "a", text: "$6\\pi$", correct: true, why: "$\\pi ab = \\pi \\times 3 \\times 2$." },
          { id: "b", text: "$36\\pi$", why: "Use the semi-axes 3 and 2, not their squares." },
          { id: "c", text: "$13\\pi$", why: "Area is $\\pi ab$, not $\\pi(a^2 + b^2)$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The AUC of a classifier is the area under its ROC curve (§{roc-auc}), computed in practice by the trapezium rule over the curve's points; precision–recall AUC works the same way. Probabilities of a continuous variable are areas under its density.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "arc-produce-1", prompt: "Find the area under $y = x^2$ from $x = 0$ to $x = 3$.", answer: 9, explain: "$\\tfrac{27}3$." },
        { kind: "number", id: "arc-produce-2", prompt: "Find the area enclosed by $y = x^2$ and $y = 2x$, to 3 decimals.", answer: 1.333, tolerance: 0.001, explain: "$\\int_0^2(2x - x^2)\\,dx = 4 - \\tfrac83 = \\tfrac43$." },
        {
          kind: "mc",
          id: "arc-produce-3",
          prompt: "The area between $y = x(x - 2)$ and the $x$-axis is",
          options: [
            { id: "a", text: "$\\tfrac43$", correct: true, why: "The curve is below the axis on $(0, 2)$: $\\lvert\\int_0^2(x^2 - 2x)\\,dx\\rvert$." },
            { id: "b", text: "$-\\tfrac43$", misconception: "signed-area", why: "An area can't be negative; the integral is negative because the region is below the axis." },
          ],
        },
        {
          kind: "mc",
          id: "arc-produce-4",
          prompt: "The area enclosed by $y = x^2$ and $y = 4$ is",
          options: [
            { id: "a", text: "$\\int_{-2}^2(4 - x^2)\\,dx = \\tfrac{32}3$", correct: true, why: "They meet where $x^2 = 4$." },
            { id: "b", text: "$\\int_0^4(4 - x^2)\\,dx$", misconception: "intersection-limits", why: "The limits are the $x$-values of the meeting points, $\\pm2$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "arc-review-1", prompt: "Find the area under $y = 2x$ from $x = 0$ to $x = 3$.", answer: 9, explain: "A triangle: $\\tfrac12 \\times 3 \\times 6$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "vertical or horizontal strips",
      body: "Use vertical strips ($dx$) when each vertical line meets the region in one segment from a lower curve to an upper one. If the boundary is easier as $x$ in terms of $y$, or a vertical strip would switch curves partway, use horizontal strips ($dy$). The region between $y^2 = x$ and $y = x - 2$ is one integral in $y$, $\\int_{-1}^2(y + 2 - y^2)\\,dy = \\tfrac92$, but two in $x$.",
    },
    {
      type: "definition",
      term: "regions bounded by conics",
      body: "Use symmetry and standard forms: the area inside the circle $x^2 + y^2 = a^2$ is $4\\int_0^a\\sqrt{a^2 - x^2}\\,dx = \\pi a^2$ (§{integration-techniques}); the ellipse squeezes this by $\\tfrac ba$ to give $\\pi ab$; the parabola $y^2 = 4ax$ cut by $x = c$ encloses $\\tfrac83\\sqrt ac^{3/2}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "area between curves",
      statement: "If $f$ and $g$ are continuous with $f \\ge g$ on $[a, b]$, the region between them has area $\\int_a^b(f(x) - g(x))\\,dx$.",
      proof: ["Each strip at $x$ has height $f(x) - g(x) \\ge 0$ and width $dx$; adding strips is the Riemann sum for the integral.", "Equivalently, it is (area under $f$) minus (area under $g$), which also works when both dip below the axis."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "parabola and latus rectum",
      statement: "The region between $y^2 = 4ax$ and its latus rectum $x = a$ has area $\\tfrac83a^2$.",
      proof: ["By symmetry, $2\\int_0^a2\\sqrt{ax}\\,dx = 4\\sqrt a \\cdot \\tfrac23a^{3/2} = \\tfrac83a^2$ (§{parabola})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Archimedes' parabolic segment",
      statement: "The region between $y = x^2$ and $y = h^2$ has area $\\tfrac43h^3$, two-thirds of the enclosing $2h \\times h^2$ rectangle.",
      proof: ["$\\int_{-h}^h(h^2 - x^2)\\,dx = 2h^3 - \\tfrac23h^3 = \\tfrac43h^3$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the area enclosed by $y = x^2$ and $y = x$.",
      solution: ["They meet where $x^2 = x$: $x = 0, 1$; on $(0, 1)$, $x > x^2$.", "$\\int_0^1(x - x^2)\\,dx = \\tfrac12 - \\tfrac13 = \\tfrac16$."],
      result: "$\\tfrac16$.",
    },
    {
      type: "example",
      level: 2,
      title: "parabola and latus rectum",
      problem: "Find the area between $y^2 = 4x$ and its latus rectum.",
      solution: ["$a = 1$, latus rectum $x = 1$; the upper half is $y = 2\\sqrt x$.", "$2\\int_0^12\\sqrt x\\,dx = 4 \\cdot \\tfrac23 = \\tfrac83$."],
      result: "$\\tfrac83$.",
    },
    {
      type: "example",
      level: 3,
      title: "curves that cross",
      problem: "Find the area between $y = \\sin x$ and $y = \\cos x$ for $0 \\le x \\le \\tfrac\\pi2$.",
      solution: ["They cross at $x = \\tfrac\\pi4$; $\\cos$ is on top before, $\\sin$ after.", "$\\int_0^{\\pi/4}(\\cos x - \\sin x)\\,dx + \\int_{\\pi/4}^{\\pi/2}(\\sin x - \\cos x)\\,dx = (\\sqrt2 - 1) + (\\sqrt2 - 1)$."],
      result: "$2\\sqrt2 - 2 \\approx 0.828$.",
    },
  ],
  pitfalls: [
    { wrong: "Area $= \\int_a^bf$ even where $f < 0$.", right: "Split at the zeros and add absolute values." },
    { wrong: "Use the interval from the question without finding where curves meet.", right: "Solve $f = g$ for the limits." },
    { wrong: "Integrate across a crossing point in one piece.", right: "Split where the upper and lower curves swap." },
  ],
  formulas: [
    { label: "Between curves", tex: "\\int_a^b(f - g)\\,dx" },
    { label: "Horizontal strips", tex: "\\int_c^d(x_R - x_L)\\,dy" },
    { label: "Parabola, latus rectum", tex: "\\tfrac83a^2" },
    { label: "Ellipse", tex: "\\pi ab" },
  ],
  exercises: [
    ex(1, num("arcx-ex-1", "Find the area under $y = x^3$ from $x = 0$ to $x = 2$.", 4, "$\\tfrac{16}4$."), ["$4$."]),
    ex(1, num("arcx-ex-2", "Find the area between $y = \\sin x$ and the $x$-axis for $0 \\le x \\le \\pi$.", 2, "$[-\\cos x]_0^\\pi$."), ["$2$."]),
    ex(2, fr("arcx-ex-3", "Find the area enclosed by $y = x^2$ and $y = x$.", 1 / 6, "$\\int_0^1(x - x^2)\\,dx$."), ["$\\tfrac16$."]),
    ex(2, fr("arcx-ex-4", "Find the area enclosed by $y = x^2$ and $y = 2x$.", 4 / 3, "$\\int_0^2(2x - x^2)\\,dx$."), ["$\\tfrac43$."]),
    ex(2, fr("arcx-ex-5", "Find the area between $y^2 = 4x$ and the line $x = 1$.", 8 / 3, "$\\tfrac83a^2$ with $a = 1$."), ["$\\tfrac83$."]),
    ex(3, dp("arcx-ex-6", "Find the area of the ellipse $\\dfrac{x^2}{16} + \\dfrac{y^2}9 = 1$.", 12 * Math.PI, "$\\pi ab$."), ["$12\\pi \\approx 37.699$."]),
    ex(3, fr("arcx-ex-7", "Find the area between $y = x^2 - 4$ and the $x$-axis.", 32 / 3, "$\\int_{-2}^2(4 - x^2)\\,dx$."), ["$\\tfrac{32}3$."]),
    ex(3, mc("arcx-ex-8", "The area between $y = \\sin x$ and $y = \\cos x$ for $0 \\le x \\le \\tfrac\\pi2$ is", ["$2\\sqrt2 - 2$", "Split at $\\tfrac\\pi4$, where they cross."], [["0", "That is the net integral of $\\sin x - \\cos x$."], ["$\\sqrt2 - 1$", "That is only one of the two pieces."]]), ["Two equal pieces of $\\sqrt2 - 1$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 4);
      const c = r.int(1, 3);
      const b = r.int(1, 3);
      const v = (c * b ** (k + 1)) / (k + 1);
      return n(`Find the area under $y = ${c === 1 ? "" : c}x^{${k}}$ from $x = 0$ to $x = ${b}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$${c}\\cdot\\dfrac{${b}^{${k + 1}}}{${k + 1}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = r.int(1, 6);
      const v = m ** 3 / 6;
      return n(`Find the area enclosed by $y = x^2$ and $y = ${m === 1 ? "" : m}x$ (3 decimals).`, Math.round(v * 1000) / 1000, `They meet at 0 and ${m}: $\\int_0^{${m}}(${m}x - x^2)\\,dx = \\tfrac{${m}^3}6$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 5);
      const v = (4 * a ** 3) / 3;
      return n(`Find the area between $y = ${a * a} - x^2$ and the $x$-axis (3 decimals).`, Math.round(v * 1000) / 1000, `$\\int_{-${a}}^{${a}}(${a * a} - x^2)\\,dx = \\tfrac43(${a})^3$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(2, 7);
      const b = r.int(1, a - 1);
      const v = Math.PI * a * b;
      return n(`Find the area of $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\pi ab = ${a * b}\\pi$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.int(1, 3);
      return mcNumbers(
        `The area between $y = \\sin x$ and the $x$-axis for $0 \\le x \\le ${2 * k}\\pi$ is`,
        { text: `${4 * k}`, why: `${2 * k} humps of area 2 each.` },
        [{ text: "0", why: "That is the net integral; areas below the axis still count positively.", misconception: "signed-area" }, { text: `${2 * k}`, why: "Each hump has area 2." }],
      );
    },
  },
];
