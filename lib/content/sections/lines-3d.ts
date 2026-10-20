import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Direction cosines and direction ratios; vector and Cartesian equations of a line (point and direction, two points); the angle between two lines; parallel, perpendicular, intersecting and skew lines; the shortest distance between skew lines and between parallel lines; the foot of the perpendicular from a point to a line. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "lines-3d",
  title: "Lines in space",
  summary: "A line in space is a point plus all multiples of a direction: r = a + λb, or (x − x₁)/l = (y − y₁)/m = (z − z₁)/n. Direction ratios can be any multiple of b; direction cosines are the components of the unit vector, so l² + m² + n² = 1. In three dimensions two lines can be parallel, intersect, or be skew: neither parallel nor meeting. The shortest distance between skew lines is the projection of a₂ − a₁ onto b₁ × b₂.",
  deps: ["cross-product"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "direction ratios", meaning: "Any three numbers proportional to the components of a line's direction vector." },
    { term: "direction cosines", meaning: "$l = \\cos\\alpha$, $m = \\cos\\beta$, $n = \\cos\\gamma$, the cosines of the angles with the axes; the components of a unit direction vector." },
    { term: "skew lines", meaning: "Lines in space that are neither parallel nor intersecting." },
  ],
  misconceptions: {
    "dc-not-normalised": "Uses direction ratios as direction cosines without dividing by the length.",
    "skew-means-parallel": "Thinks two lines in space that don't meet must be parallel.",
  },
  steps: [
    {
      type: "motivate",
      title: "Lines that miss each other",
      body: "In the plane, two lines either cross or are parallel. In space there is a third possibility: a road and a bridge above it can run in different directions without meeting. Vector equations handle all three cases uniformly, and the cross product of the directions measures how far apart skew lines come.",
      realWorld: {
        title: "Air-traffic separation",
        body: "Two aircraft flying straight at different headings and altitudes follow skew lines. Controllers compute the closest approach of their paths, the same shortest-distance calculation as here, extended to account for the times at which each aircraft reaches each point.",
      },
    },
    {
      type: "truth",
      statement: "A line through $\\mathbf a$ with direction $\\mathbf b = (p, q, r)$: $\\mathbf r = \\mathbf a + \\lambda\\mathbf b$, or $\\dfrac{x - a_1}p = \\dfrac{y - a_2}q = \\dfrac{z - a_3}r$; through two points, take $\\mathbf b = \\mathbf a_2 - \\mathbf a_1$. **Direction cosines**: $(l, m, n) = \\dfrac{(p, q, r)}{\\sqrt{p^2 + q^2 + r^2}}$, with $l^2 + m^2 + n^2 = 1$. **Angle** between lines: $\\cos\\theta = \\dfrac{\\lvert\\mathbf b_1 \\cdot \\mathbf b_2\\rvert}{\\lvert\\mathbf b_1\\rvert\\lvert\\mathbf b_2\\rvert}$. **Shortest distance** between $\\mathbf r = \\mathbf a_1 + \\lambda\\mathbf b_1$ and $\\mathbf r = \\mathbf a_2 + \\mu\\mathbf b_2$: $\\dfrac{\\lvert(\\mathbf a_2 - \\mathbf a_1) \\cdot (\\mathbf b_1 \\times \\mathbf b_2)\\rvert}{\\lvert\\mathbf b_1 \\times \\mathbf b_2\\rvert}$; for parallel lines ($\\mathbf b_1 = \\mathbf b_2 = \\mathbf b$), $\\dfrac{\\lvert(\\mathbf a_2 - \\mathbf a_1) \\times \\mathbf b\\rvert}{\\lvert\\mathbf b\\rvert}$.",
      body: "Classify two lines: parallel if $\\mathbf b_1 \\times \\mathbf b_2 = \\mathbf 0$; otherwise they intersect iff the shortest distance is 0, i.e. $[\\mathbf a_2 - \\mathbf a_1\\ \\mathbf b_1\\ \\mathbf b_2] = 0$ (the lines are coplanar, §{cross-product}), and are skew if it isn't. Perpendicular lines have $\\mathbf b_1 \\cdot \\mathbf b_2 = 0$, whether or not they meet. The **foot of the perpendicular** from $P$ to $\\mathbf r = \\mathbf a + \\lambda\\mathbf b$ is the point with $(\\mathbf a + \\lambda\\mathbf b - \\mathbf p) \\cdot \\mathbf b = 0$. Compare lines in the plane: §{straight-lines}.",
    },
    {
      type: "predict",
      misconception: "skew-means-parallel",
      item: {
        kind: "mc",
        id: "lnt-predict-1",
        prompt: "Two lines in space never meet. Then they are",
        options: [
          { id: "a", text: "either parallel or skew", correct: true, why: "In 3D, non-parallel lines can miss each other." },
          { id: "b", text: "parallel", misconception: "skew-means-parallel", why: "That is forced only in a plane." },
          { id: "c", text: "the same line", why: "The same line meets itself everywhere." },
        ],
      },
      reveal: {
        body: "Take the $x$-axis, $\\mathbf r = \\lambda\\mathbf i$, and the vertical line through $(0, 1, 0)$, $\\mathbf r = \\mathbf j + \\mu\\mathbf k$. Their directions $\\mathbf i$ and $\\mathbf k$ aren't parallel, yet a point of the first has $y = 0$ and a point of the second has $y = 1$, so they never meet. Such skew lines are 1 apart: $\\lvert\\mathbf j \\cdot (\\mathbf i \\times \\mathbf k)\\rvert/\\lvert\\mathbf i \\times \\mathbf k\\rvert = 1$.",
      },
      resolve: {
        kind: "mc",
        id: "lnt-resolve-1",
        prompt: "$\\mathbf r = \\lambda\\mathbf i$ and $\\mathbf r = \\mathbf j + \\mu\\mathbf k$ are",
        options: [
          { id: "a", text: "skew", correct: true, why: "Not parallel, and $y$ is 0 on one and 1 on the other." },
          { id: "b", text: "parallel", misconception: "skew-means-parallel", why: "Their directions $\\mathbf i$ and $\\mathbf k$ differ." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lnt-check-1",
        prompt: "A line has direction ratios $2, -1, 2$. Its direction cosines are",
        options: [
          { id: "a", text: "$\\tfrac23, -\\tfrac13, \\tfrac23$", correct: true, why: "Divide by $\\sqrt{4 + 1 + 4} = 3$." },
          { id: "b", text: "$2, -1, 2$", misconception: "dc-not-normalised", why: "Direction cosines satisfy $l^2 + m^2 + n^2 = 1$; these give 9." },
          { id: "c", text: "$\\tfrac25, -\\tfrac15, \\tfrac25$", why: "Divide by the length, 3, not the sum of absolute values." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lnt-check-2",
        prompt: "The angle between lines with directions $(1, 1, 0)$ and $(1, 0, 1)$ is",
        options: [
          { id: "a", text: "60°", correct: true, why: "$\\cos\\theta = \\tfrac1{\\sqrt2\\sqrt2}$." },
          { id: "b", text: "90°", why: "The dot product is 1." },
          { id: "c", text: "45°", why: "$\\cos\\theta = \\tfrac12$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Fitting a line through 3D data by least squares projects each point onto the line, the foot-of-perpendicular calculation done for many points at once; the best such line is the first principal component (§{pca}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "lnt-produce-1", prompt: "For any line, find $l^2 + m^2 + n^2$.", answer: 1, explain: "They are the components of a unit vector." },
        { kind: "number", id: "lnt-produce-2", prompt: "Find the shortest distance between $\\mathbf r = \\lambda\\mathbf i$ and $\\mathbf r = \\mathbf j + \\mu\\mathbf k$.", answer: 1, explain: "$\\lvert\\mathbf j \\cdot (\\mathbf i \\times \\mathbf k)\\rvert/\\lvert\\mathbf i \\times \\mathbf k\\rvert = \\lvert\\mathbf j \\cdot (-\\mathbf j)\\rvert$." },
        {
          kind: "mc",
          id: "lnt-produce-3",
          prompt: "The direction cosines of a line with direction ratios $1, 2, 2$ are",
          options: [
            { id: "a", text: "$\\tfrac13, \\tfrac23, \\tfrac23$", correct: true, why: "Divide by 3." },
            { id: "b", text: "$1, 2, 2$", misconception: "dc-not-normalised", why: "Normalise to length 1." },
          ],
        },
        {
          kind: "mc",
          id: "lnt-produce-4",
          prompt: "$\\mathbf r = (1, 0, 0) + \\lambda(1, 1, 0)$ and $\\mathbf r = (0, 0, 1) + \\mu(1, -1, 0)$ are",
          options: [
            { id: "a", text: "skew", correct: true, why: "Not parallel, and $z$ is 0 on one and 1 on the other." },
            { id: "b", text: "parallel, since they don't meet", misconception: "skew-means-parallel", why: "Their directions differ." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "lnt-review-1", prompt: "A line has direction ratios $3, 4, 0$. Find its first direction cosine.", answer: 0.6, explain: "$\\tfrac35$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Cartesian and vector forms",
      body: "$\\dfrac{x - 1}2 = \\dfrac{y + 3}{-1} = \\dfrac z4$ is the line through $(1, -3, 0)$ with direction $(2, -1, 4)$; setting the common ratio to $\\lambda$ gives the vector form $\\mathbf r = (1, -3, 0) + \\lambda(2, -1, 4)$, and each value of $\\lambda$ gives a point. A zero denominator, as in $\\dfrac{x - 1}0$, means $x = 1$ throughout.",
    },
    {
      type: "definition",
      term: "foot of a perpendicular",
      body: "From $P(1, 2, 3)$ to the $x$-axis $\\mathbf r = \\lambda\\mathbf i$: the general point $(\\lambda, 0, 0)$ minus $P$ is $(\\lambda - 1, -2, -3)$, perpendicular to $\\mathbf i$ when $\\lambda = 1$. Foot $(1, 0, 0)$, distance $\\sqrt{4 + 9} = \\sqrt{13}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "direction cosines",
      statement: "$l^2 + m^2 + n^2 = 1$.",
      proof: ["$(l, m, n) = \\dfrac{\\mathbf b}{\\lvert\\mathbf b\\rvert}$, a unit vector, since $\\cos\\alpha = \\dfrac{\\mathbf b \\cdot \\mathbf i}{\\lvert\\mathbf b\\rvert}$ and so on (§{vector-algebra})."],
    },
    {
      type: "theorem",
      name: "shortest distance between skew lines",
      statement: "The shortest distance between $\\mathbf r = \\mathbf a_1 + \\lambda\\mathbf b_1$ and $\\mathbf r = \\mathbf a_2 + \\mu\\mathbf b_2$ is $\\dfrac{\\lvert(\\mathbf a_2 - \\mathbf a_1) \\cdot (\\mathbf b_1 \\times \\mathbf b_2)\\rvert}{\\lvert\\mathbf b_1 \\times \\mathbf b_2\\rvert}$.",
      proof: ["The common perpendicular is along $\\mathbf n = \\mathbf b_1 \\times \\mathbf b_2$.", "The distance is the length of the projection of any connecting vector, such as $\\mathbf a_2 - \\mathbf a_1$, onto $\\mathbf n$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "condition for intersection",
      statement: "Non-parallel lines intersect iff $[\\mathbf a_2 - \\mathbf a_1\\ \\mathbf b_1\\ \\mathbf b_2] = 0$.",
      proof: ["They meet iff they lie in one plane, i.e. iff $\\mathbf a_2 - \\mathbf a_1$, $\\mathbf b_1$, $\\mathbf b_2$ are coplanar; equivalently the shortest distance is 0."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the line through $(1, 2, 3)$ and $(3, 5, 9)$ and its direction cosines.",
      solution: ["Direction $(2, 3, 6)$, length 7: direction cosines $\\left(\\tfrac27, \\tfrac37, \\tfrac67\\right)$.", "$\\dfrac{x - 1}2 = \\dfrac{y - 2}3 = \\dfrac{z - 3}6$."],
      result: "As shown.",
    },
    {
      type: "example",
      level: 2,
      title: "angle between lines",
      problem: "Find the angle between lines with directions $(2, 1, 2)$ and $(1, -2, 2)$.",
      solution: ["Dot product $2 - 2 + 4 = 4$; lengths 3 and 3.", "$\\cos\\theta = \\tfrac49$, so $\\theta = \\cos^{-1}\\tfrac49 \\approx 63.6°$."],
      result: "$\\cos^{-1}\\tfrac49$.",
    },
    {
      type: "example",
      level: 3,
      title: "skew lines",
      problem: "Find the shortest distance between $\\mathbf r = (1, 1, 0) + \\lambda(2, -1, 1)$ and $\\mathbf r = (2, 1, -1) + \\mu(3, -5, 2)$.",
      solution: ["$\\mathbf b_1 \\times \\mathbf b_2 = (3, -1, -7)$, length $\\sqrt{59}$; $\\mathbf a_2 - \\mathbf a_1 = (1, 0, -1)$.", "Distance $\\dfrac{\\lvert 3 + 0 + 7\\rvert}{\\sqrt{59}} = \\dfrac{10}{\\sqrt{59}} \\approx 1.302$."],
      result: "$\\tfrac{10}{\\sqrt{59}}$.",
    },
  ],
  pitfalls: [
    { wrong: "Direction ratios are direction cosines.", right: "Divide by the length so that $l^2 + m^2 + n^2 = 1$." },
    { wrong: "Non-meeting lines are parallel.", right: "In space they may be skew." },
    { wrong: "Use the skew-line formula for parallel lines.", right: "$\\mathbf b_1 \\times \\mathbf b_2 = \\mathbf 0$ there; use $\\lvert(\\mathbf a_2 - \\mathbf a_1) \\times \\mathbf b\\rvert/\\lvert\\mathbf b\\rvert$." },
  ],
  formulas: [
    { label: "Line", tex: "\\mathbf r = \\mathbf a + \\lambda\\mathbf b" },
    { label: "Direction cosines", tex: "l^2 + m^2 + n^2 = 1" },
    { label: "Angle", tex: "\\cos\\theta = \\tfrac{\\lvert\\mathbf b_1 \\cdot \\mathbf b_2\\rvert}{\\lvert\\mathbf b_1\\rvert\\lvert\\mathbf b_2\\rvert}" },
    { label: "Skew distance", tex: "\\tfrac{\\lvert(\\mathbf a_2 - \\mathbf a_1) \\cdot (\\mathbf b_1 \\times \\mathbf b_2)\\rvert}{\\lvert\\mathbf b_1 \\times \\mathbf b_2\\rvert}" },
    { label: "Parallel distance", tex: "\\tfrac{\\lvert(\\mathbf a_2 - \\mathbf a_1) \\times \\mathbf b\\rvert}{\\lvert\\mathbf b\\rvert}" },
  ],
  exercises: [
    ex(1, fr("lntx-ex-1", "Find the first direction cosine of a line with direction ratios $2, 3, 6$.", 2 / 7, "Divide by 7."), ["$\\tfrac27$."]),
    ex(1, dp("lntx-ex-2", "A line makes equal acute angles with the three axes. Find its direction cosine $l$.", 1 / Math.sqrt(3), "$3l^2 = 1$."), ["$\\tfrac1{\\sqrt3} \\approx 0.577$."]),
    ex(2, num("lntx-ex-3", "Find the angle, in degrees, between lines with directions $(1, 1, 0)$ and $(1, 0, 1)$.", 60, "$\\cos\\theta = \\tfrac12$."), ["$60°$."]),
    ex(2, fr("lntx-ex-4", "Find $\\cos\\theta$ for lines with directions $(2, 1, 2)$ and $(1, -2, 2)$.", 4 / 9, "$\\tfrac4{3 \\times 3}$."), ["$\\tfrac49$."]),
    ex(2, num("lntx-ex-5", "Find the shortest distance between $\\mathbf r = \\lambda\\mathbf i$ and $\\mathbf r = \\mathbf j + \\mu\\mathbf k$.", 1, "Skew lines 1 apart."), ["$1$."]),
    ex(3, dp("lntx-ex-6", "Find the shortest distance between $\\mathbf r = (1, 1, 0) + \\lambda(2, -1, 1)$ and $\\mathbf r = (2, 1, -1) + \\mu(3, -5, 2)$.", 10 / Math.sqrt(59), "$\\tfrac{10}{\\sqrt{59}}$."), ["$\\approx 1.302$."]),
    ex(3, num("lntx-ex-7", "Find the distance between the parallel lines $\\mathbf r = \\lambda\\mathbf i$ and $\\mathbf r = (0, 3, 4) + \\mu\\mathbf i$.", 5, "$\\lvert(0, 3, 4) \\times \\mathbf i\\rvert = \\lvert(0, 4, -3)\\rvert$."), ["$5$."]),
    ex(3, mc("lntx-ex-8", "Two non-parallel lines intersect exactly when", ["$[\\mathbf a_2 - \\mathbf a_1\\ \\mathbf b_1\\ \\mathbf b_2] = 0$", "They are coplanar."], [["$\\mathbf b_1 \\cdot \\mathbf b_2 = 0$", "That means perpendicular directions."], ["$\\mathbf b_1 \\times \\mathbf b_2 = \\mathbf 0$", "That means parallel."]]), ["The shortest distance is then 0."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13], [6, 6, 7, 11]] as const;

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [p, q, s, m] = r.pick(QUADS);
      const sg = [r.pick([1, -1]), r.pick([1, -1]), r.pick([1, -1])];
      const d = [sg[0] * p, sg[1] * q, sg[2] * s];
      const i = r.int(0, 2);
      const v = d[i] / m;
      return n(`A line has direction ratios $${d.join(", ")}$. Find its direction cosine ${["$l$", "$m$", "$n$"][i]} (3 decimals).`, Math.round(v * 1000) / 1000, `Divide by $\\sqrt{${p * p} + ${q * q} + ${s * s}} = ${m}$: $\\tfrac{${d[i]}}{${m}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [p1, q1, s1, m1] = r.pick(QUADS);
      const [p2, q2, s2, m2] = r.pick(QUADS);
      const b2 = [p2, -q2, s2];
      const v = Math.abs(p1 * b2[0] + q1 * b2[1] + s1 * b2[2]) / (m1 * m2);
      return n(`Find $\\cos\\theta$ for the acute angle between lines with directions $(${p1}, ${q1}, ${s1})$ and $(${b2.join(", ")})$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\lvert ${p1 * b2[0] + q1 * b2[1] + s1 * b2[2]}\\rvert}{${m1} \\times ${m2}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [y, z, h] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [0, 7, 7], [4, 3, 5]] as const);
      const x = r.int(-5, 5);
      return n(`Find the distance between the parallel lines $\\mathbf r = \\lambda\\mathbf i$ and $\\mathbf r = (${x}, ${y}, ${z}) + \\mu\\mathbf i$.`, h, `$\\lvert(${x}, ${y}, ${z}) \\times \\mathbf i\\rvert = \\lvert(0, ${z}, ${-y})\\rvert = ${h}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [p, q, s, m] = r.pick(QUADS);
      return mcNumbers(
        `A line has direction ratios $${p}, ${q}, ${s}$. Its direction cosines are`,
        { text: `$\\tfrac{${p}}{${m}}, \\tfrac{${q}}{${m}}, \\tfrac{${s}}{${m}}$`, why: `Divide by the length ${m}.` },
        [{ text: `$${p}, ${q}, ${s}$`, why: "Direction cosines have squares summing to 1.", misconception: "dc-not-normalised" }],
      );
    },
  },
];
