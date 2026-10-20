import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Coordinate geometry of straight lines: distance and section formulas, centroid, slope and angle of inclination, standard forms of a line, angle between lines, parallel and perpendicular lines, intersection and concurrency, distance from a point to a line, foot of perpendicular and reflection, families of lines, locus. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const lin = (a: number, b: number, c: number) => {
  const t = (k: number, s: string, first: boolean) => (k === 0 ? "" : `${k < 0 ? (first ? "-" : " - ") : first ? "" : " + "}${Math.abs(k) === 1 && s ? "" : Math.abs(k)}${s}`);
  const head = t(a, "x", true) + t(b, "y", a === 0) + t(c, "", a === 0 && b === 0);
  return `${head} = 0`;
};

const base: ConceptNode = {
  id: "straight-lines",
  title: "Straight lines",
  summary: "Coordinates turn geometry into algebra. The distance between points comes from Pythagoras; the section formula finds points dividing a segment in a ratio. A line is fixed by a point and a slope, or two points, or its intercepts. Slopes decide parallel (equal) and perpendicular (product −1) lines, and the distance from a point (x₀, y₀) to ax + by + c = 0 is |ax₀ + by₀ + c|/√(a² + b²).",
  deps: ["linear-equations", "trig-ratios"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "slope", meaning: "$m = \\tan\\theta = \\dfrac{y_2 - y_1}{x_2 - x_1}$, where $\\theta$ is the angle the line makes with the positive $x$-axis." },
    { term: "section formula", meaning: "The point dividing $(x_1, y_1)$ to $(x_2, y_2)$ internally in ratio $m : n$ is $\\left(\\dfrac{mx_2 + nx_1}{m + n}, \\dfrac{my_2 + ny_1}{m + n}\\right)$." },
    { term: "locus", meaning: "The path traced by a point satisfying a condition, written as an equation in $x$ and $y$." },
  ],
  misconceptions: {
    "perp-slope-negative": "Takes a perpendicular line's slope as $-m$ rather than $-1/m$.",
    "distance-no-root": "Computes the distance from a point to $ax + by + c = 0$ as $\\lvert ax_0 + by_0 + c\\rvert$ without dividing by $\\sqrt{a^2 + b^2}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Geometry by numbers",
      body: "How far is a town at $(2, 3)$ from a straight road $3x + 4y = 5$? Where do two roads cross, and at what angle? Descartes' idea of coordinates turns such questions into short calculations, and straight lines are the first and most heavily examined part of coordinate geometry.",
      realWorld: {
        title: "Linear programming",
        body: "Airlines, factories and delivery companies optimise schedules subject to constraints that are straight lines (linear inequalities). The best solution always lies at a corner where two constraint lines meet, found by solving their equations.",
      },
    },
    {
      type: "truth",
      statement: "Distance $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$; midpoint $\\left(\\tfrac{x_1 + x_2}2, \\tfrac{y_1 + y_2}2\\right)$; centroid of a triangle $\\left(\\tfrac{\\sum x_i}3, \\tfrac{\\sum y_i}3\\right)$. **Forms of a line**: $y = mx + c$; $y - y_1 = m(x - x_1)$; $\\dfrac xa + \\dfrac yb = 1$ (intercepts $a, b$); $ax + by + c = 0$ (slope $-a/b$). Lines with slopes $m_1, m_2$ are parallel iff $m_1 = m_2$ and perpendicular iff $m_1m_2 = -1$; the acute angle between them satisfies $\\tan\\theta = \\left\\lvert\\dfrac{m_1 - m_2}{1 + m_1m_2}\\right\\rvert$. Distance from $(x_0, y_0)$ to $ax + by + c = 0$ is $\\dfrac{\\lvert ax_0 + by_0 + c\\rvert}{\\sqrt{a^2 + b^2}}$.",
      body: "Parallel lines $ax + by + c_1 = 0$ and $ax + by + c_2 = 0$ are $\\dfrac{\\lvert c_1 - c_2\\rvert}{\\sqrt{a^2 + b^2}}$ apart. Three lines are **concurrent** if the determinant of their coefficients is 0 (§{determinants-properties}). Every line through the intersection of $L_1 = 0$ and $L_2 = 0$ is $L_1 + \\lambda L_2 = 0$ for some $\\lambda$. The foot of the perpendicular from $(x_0, y_0)$ to $ax + by + c = 0$ is $(x_0, y_0) - \\dfrac{ax_0 + by_0 + c}{a^2 + b^2}(a, b)$; the reflection goes twice as far. A **locus** problem: let the moving point be $(h, k)$, write the condition, eliminate the parameter, and replace $h, k$ by $x, y$.",
    },
    {
      type: "predict",
      misconception: "perp-slope-negative",
      item: {
        kind: "mc",
        id: "stl-predict-1",
        prompt: "A line perpendicular to $y = 2x + 1$ has slope",
        options: [
          { id: "a", text: "$-\\tfrac12$", correct: true, why: "$m_1m_2 = -1$." },
          { id: "b", text: "$-2$", misconception: "perp-slope-negative", why: "That line isn't perpendicular: $2 \\times (-2) = -4$." },
          { id: "c", text: "$\\tfrac12$", why: "The product must be $-1$." },
        ],
      },
      reveal: {
        body: "Rotating a line by $90°$ turns a direction $(1, m)$ into $(-m, 1)$, whose slope is $-1/m$. So perpendicular slopes multiply to $-1$: here $2 \\times (-\\tfrac12) = -1$. A slope of $-2$ is just a line tilted the other way, meeting $y = 2x + 1$ at about $53°$, not $90°$.",
      },
      resolve: {
        kind: "mc",
        id: "stl-resolve-1",
        prompt: "The line through $(2, 3)$ perpendicular to $2x - y + 1 = 0$ is",
        options: [
          { id: "a", text: "$x + 2y - 8 = 0$", correct: true, why: "Slope $-\\tfrac12$ through $(2, 3)$." },
          { id: "b", text: "$2x + y - 7 = 0$", misconception: "perp-slope-negative", why: "Slope $-2$ isn't perpendicular to slope 2." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "stl-check-1",
        prompt: "The distance from $(2, 3)$ to $3x + 4y - 5 = 0$ is",
        options: [
          { id: "a", text: "$\\tfrac{13}5$", correct: true, why: "$\\dfrac{\\lvert 6 + 12 - 5\\rvert}{\\sqrt{9 + 16}}$." },
          { id: "b", text: "13", misconception: "distance-no-root", why: "Divide by $\\sqrt{a^2 + b^2} = 5$." },
          { id: "c", text: "$\\tfrac{13}{25}$", why: "Divide by the square root, not $a^2 + b^2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "stl-check-2",
        prompt: "The acute angle between $y = 2x + 1$ and $y = -3x + 4$ is",
        options: [
          { id: "a", text: "45°", correct: true, why: "$\\tan\\theta = \\left\\lvert\\dfrac{2 + 3}{1 - 6}\\right\\rvert = 1$." },
          { id: "b", text: "90°", why: "$2 \\times (-3) \\ne -1$." },
          { id: "c", text: "30°", why: "Compute $\\tan\\theta$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A linear classifier's decision boundary is a line $w_1x + w_2y + b = 0$ in two features; the signed distance $\\dfrac{w \\cdot x + b}{\\lvert w\\rvert}$ of a point from it is the SVM's margin (§{svm-knn-nb}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "stl-produce-1", prompt: "Find the $x$-coordinate of the point dividing $(1, 2)$ to $(7, 8)$ internally in the ratio $1 : 2$.", answer: 3, explain: "$\\tfrac{1 \\times 7 + 2 \\times 1}{3}$." },
        { kind: "number", id: "stl-produce-2", prompt: "Find the distance between the parallel lines $3x + 4y + 2 = 0$ and $3x + 4y - 8 = 0$.", answer: 2, explain: "$\\tfrac{10}{5}$." },
        {
          kind: "mc",
          id: "stl-produce-3",
          prompt: "A line perpendicular to $3x + 4y = 7$ has slope",
          options: [
            { id: "a", text: "$\\tfrac43$", correct: true, why: "The given slope is $-\\tfrac34$." },
            { id: "b", text: "$\\tfrac34$", misconception: "perp-slope-negative", why: "Negate and invert: $-1/(-\\tfrac34)$." },
          ],
        },
        {
          kind: "mc",
          id: "stl-produce-4",
          prompt: "The distance from the origin to $x + y - 4 = 0$ is",
          options: [
            { id: "a", text: "$2\\sqrt2$", correct: true, why: "$\\tfrac{4}{\\sqrt2}$." },
            { id: "b", text: "4", misconception: "distance-no-root", why: "Divide by $\\sqrt{1 + 1}$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "stl-review-1", prompt: "Find the distance between $(-2, 1)$ and $(1, 5)$.", answer: 5, explain: "$\\sqrt{9 + 16}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "centres of a triangle",
      body: "**Centroid** $G$: average of the vertices. **Incentre**: $\\left(\\dfrac{ax_1 + bx_2 + cx_3}{a + b + c}, \\dfrac{ay_1 + by_2 + cy_3}{a + b + c}\\right)$ with $a, b, c$ the opposite side lengths. **Circumcentre**: intersection of perpendicular bisectors. **Orthocentre** $H$: intersection of altitudes. $G$ lies on the segment from the circumcentre $O$ to $H$ with $OG : GH = 1 : 2$ (the Euler line).",
    },
    {
      type: "definition",
      term: "families of lines",
      body: "$y = mx + c$ with $m$ fixed is a family of parallel lines; with $c$ fixed, lines through $(0, c)$. Lines through the intersection of $L_1: a_1x + b_1y + c_1 = 0$ and $L_2$ are $L_1 + \\lambda L_2 = 0$: impose one more condition to fix $\\lambda$. The angle bisectors of $L_1, L_2$ are $\\dfrac{L_1}{\\sqrt{a_1^2 + b_1^2}} = \\pm\\dfrac{L_2}{\\sqrt{a_2^2 + b_2^2}}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "distance from a point to a line",
      statement: "The distance from $(x_0, y_0)$ to $ax + by + c = 0$ is $\\dfrac{\\lvert ax_0 + by_0 + c\\rvert}{\\sqrt{a^2 + b^2}}$.",
      proof: ["The vector $(a, b)$ is normal to the line. For any point $P$ on the line, the distance is the length of the projection of $(x_0, y_0) - P$ onto $(a, b)/\\sqrt{a^2 + b^2}$, which is $\\dfrac{\\lvert a(x_0 - p_1) + b(y_0 - p_2)\\rvert}{\\sqrt{a^2 + b^2}}$, and $ap_1 + bp_2 = -c$ (§{vector})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "angle between two lines",
      statement: "If the lines have slopes $m_1, m_2$ with $m_1m_2 \\ne -1$, the acute angle $\\theta$ between them has $\\tan\\theta = \\left\\lvert\\dfrac{m_1 - m_2}{1 + m_1m_2}\\right\\rvert$.",
      proof: ["With inclinations $\\alpha, \\beta$, $\\theta = \\lvert\\alpha - \\beta\\rvert$ (or its supplement), and $\\tan(\\alpha - \\beta) = \\dfrac{\\tan\\alpha - \\tan\\beta}{1 + \\tan\\alpha\\tan\\beta}$ (§{trig-identities})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "concurrency",
      statement: "Three lines $a_ix + b_iy + c_i = 0$ (no two parallel) are concurrent iff $\\begin{vmatrix} a_1 & b_1 & c_1 \\\\ a_2 & b_2 & c_2 \\\\ a_3 & b_3 & c_3 \\end{vmatrix} = 0$.",
      proof: ["A common point $(x, y)$ means the homogeneous system with unknowns $(x, y, 1)$ has a non-trivial solution, which happens exactly when the determinant is 0 (§{adjoint-systems})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the line through $(2, 3)$ perpendicular to $2x - y + 1 = 0$.",
      solution: ["The given slope is 2, so the perpendicular slope is $-\\tfrac12$.", "$y - 3 = -\\tfrac12(x - 2)$, that is $x + 2y - 8 = 0$."],
      result: "$x + 2y - 8 = 0$.",
    },
    {
      type: "example",
      level: 2,
      title: "foot and reflection",
      problem: "Find the foot of the perpendicular from $(1, 2)$ to $x + y - 5 = 0$, and the reflection of the point in the line.",
      solution: ["$\\dfrac{1 + 2 - 5}{2} = -1$, so the foot is $(1, 2) - (-1)(1, 1) = (2, 3)$.", "The reflection goes twice as far: $(1, 2) + 2(1, 1) = (3, 4)$."],
      result: "Foot $(2, 3)$, image $(3, 4)$.",
    },
    {
      type: "example",
      level: 3,
      title: "a locus",
      problem: "A point moves so that its distances from $(1, 0)$ and $(-1, 0)$ are equal. Find its locus.",
      solution: ["Let it be $(h, k)$: $(h - 1)^2 + k^2 = (h + 1)^2 + k^2$.", "$-2h = 2h$, so $h = 0$: the locus is the $y$-axis, the perpendicular bisector."],
      result: "$x = 0$.",
    },
  ],
  pitfalls: [
    { wrong: "Perpendicular slope is $-m$.", right: "It is $-1/m$." },
    { wrong: "Point-to-line distance is $\\lvert ax_0 + by_0 + c\\rvert$.", right: "Divide by $\\sqrt{a^2 + b^2}$." },
    { wrong: "Use the parallel-lines distance formula with different $a, b$.", right: "First scale the equations to the same $a, b$." },
  ],
  formulas: [
    { label: "Distance", tex: "\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" },
    { label: "Section", tex: "\\left(\\tfrac{mx_2 + nx_1}{m + n}, \\tfrac{my_2 + ny_1}{m + n}\\right)" },
    { label: "Angle", tex: "\\tan\\theta = \\left\\lvert\\tfrac{m_1 - m_2}{1 + m_1m_2}\\right\\rvert" },
    { label: "Point to line", tex: "\\dfrac{\\lvert ax_0 + by_0 + c\\rvert}{\\sqrt{a^2 + b^2}}" },
  ],
  exercises: [
    ex(1, num("stlx-ex-1", "Find the slope of the line through $(1, -2)$ and $(4, 7)$.", 3, "$9/3$."), ["$3$."]),
    ex(1, num("stlx-ex-2", "Find the $y$-intercept of $3x + 2y = 12$.", 6, "Put $x = 0$."), ["$6$."]),
    ex(2, num("stlx-ex-3", "Find the centroid's $x$-coordinate for the triangle $(1, 2)$, $(4, 6)$, $(7, 1)$.", 4, "$(1 + 4 + 7)/3$."), ["$4$."]),
    ex(2, dp("stlx-ex-4", "Find the distance from $(3, -1)$ to $5x - 12y + 4 = 0$.", 31 / 13, "$\\tfrac{\\lvert 15 + 12 + 4\\rvert}{13}$."), ["$\\tfrac{31}{13} \\approx 2.385$."]),
    ex(2, num("stlx-ex-5", "For which $k$ are $2x + ky = 5$ and $4x - 6y = 1$ perpendicular? Give an exact fraction or 3 decimal places.", 4 / 3, "Slopes $-2/k$ and $\\tfrac23$ multiply to $-1$.", 0.0005), ["$-\\tfrac2k \\cdot \\tfrac23 = -1$ gives $k = \\tfrac43$."]),
    ex(3, num("stlx-ex-6", "Find the $y$-coordinate of the reflection of $(1, 2)$ in $x + y - 5 = 0$.", 4, "Image $(3, 4)$."), ["$4$."]),
    ex(3, num("stlx-ex-7", "For which $k$ are $x + y = 3$, $2x - y = 0$ and $kx + 2y = 7$ concurrent?", 3, "The first two meet at $(1, 2)$."), ["The first two lines meet at $(1, 2)$.", "The third passes through it when $k + 4 = 7$, so $k = 3$."]),
    ex(3, mc("stlx-ex-8", "The lines $y = mx$ through the origin that make $45°$ with $y = 2x$ have slopes", ["$-3$ and $\\tfrac13$", "$\\left\\lvert\\tfrac{m - 2}{1 + 2m}\\right\\rvert = 1$ gives $m - 2 = \\pm(1 + 2m)$."], [["$\\pm1$", "That is $45°$ with the $x$-axis."], ["$-\\tfrac12$ only", "That is the perpendicular."]]), ["$m - 2 = 1 + 2m$ gives $m = -3$; $m - 2 = -(1 + 2m)$ gives $m = \\tfrac13$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, h] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [1, 1, Math.SQRT2]] as const);
      const sa = r.pick([1, -1]);
      const x0 = r.int(-5, 6);
      const y0 = r.int(-5, 6);
      const c = r.int(-12, 12);
      const v = Math.abs(sa * a * x0 + b * y0 + c) / h;
      return n(`Find the distance from $(${x0}, ${y0})$ to $${lin(sa * a, b, c)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\lvert ${sa * a}(${x0}) + ${b}(${y0}) + (${c})\\rvert}{${r2(h)}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [x1, y1, x2, y2] = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 6), r.int(-6, 6)];
      const m = r.int(1, 4);
      const k = r.int(1, 4);
      const want = r.pick(["x", "y"] as const);
      const v = want === "x" ? (m * x2 + k * x1) / (m + k) : (m * y2 + k * y1) / (m + k);
      return n(`Find the ${want}-coordinate of the point dividing $(${x1}, ${y1})$ to $(${x2}, ${y2})$ internally in the ratio $${m} : ${k}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{${m} \\times ${want === "x" ? x2 : y2} + ${k} \\times ${want === "x" ? x1 : y1}}{${m + k}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m1 = r.int(-4, 4);
      let m2 = r.int(-4, 4);
      if (m2 === m1) m2 += 1;
      if (1 + m1 * m2 === 0) m2 += 1;
      const v = (Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2))) * 180) / Math.PI;
      return n(`Find the acute angle, in degrees, between lines of slopes ${m1} and ${m2} (2 decimals).`, r2(v), `$\\tan\\theta = \\left\\lvert\\tfrac{${m1} - (${m2})}{1 + (${m1})(${m2})}\\right\\rvert$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [p, q] = r.pick([[2, 1], [3, 1], [1, 2], [3, 4], [5, 2]] as const);
      const f = (a: number, b: number) => (b === 1 ? `${a}` : `\\tfrac{${a}}{${b}}`);
      return mcNumbers(
        `A line perpendicular to one of slope $${f(p, q)}$ has slope`,
        { text: `$-${f(q, p)}$`, why: "Perpendicular slopes multiply to $-1$." },
        [{ text: `$-${f(p, q)}$`, why: "Negating alone doesn't give a right angle.", misconception: "perp-slope-negative" }, { text: `$${f(q, p)}$`, why: "The sign must change too." }],
      );
    },
  },
];
