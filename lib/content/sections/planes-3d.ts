import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Planes: normal and Cartesian forms, intercept form, the plane through three points; distance from a point to a plane and between parallel planes; the angle between two planes and between a line and a plane; parallel and perpendicular conditions; planes through the line of intersection of two planes. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13], [6, 6, 7, 11]] as const;

const base: ConceptNode = {
  id: "planes-3d",
  title: "Planes",
  summary: "A plane is fixed by a point and a normal vector n: r·n = d, or ax + by + cz = d with normal (a, b, c). The distance from (x₀, y₀, z₀) to it is |ax₀ + by₀ + cz₀ − d|/√(a² + b² + c²). The angle between two planes is the angle between their normals. A line meets a plane at the complement of the angle it makes with the normal, so sin φ = |b·n|/(|b||n|). Planes through the line where two planes meet are P₁ + λP₂ = 0.",
  deps: ["lines-3d"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "normal vector", meaning: "A vector perpendicular to every line in the plane; for $ax + by + cz = d$ it is $(a, b, c)$." },
    { term: "intercept form", meaning: "$\\dfrac xa + \\dfrac yb + \\dfrac zc = 1$, the plane meeting the axes at $(a, 0, 0)$, $(0, b, 0)$, $(0, 0, c)$." },
    { term: "angle between a line and a plane", meaning: "The angle $\\varphi$ between the line and its projection on the plane; it is $90°$ minus the angle with the normal." },
  ],
  misconceptions: {
    "line-plane-cos": "Uses $\\cos\\varphi = \\dfrac{\\lvert\\mathbf b \\cdot \\mathbf n\\rvert}{\\lvert\\mathbf b\\rvert\\lvert\\mathbf n\\rvert}$ for the angle between a line and a plane, which gives the angle with the normal instead.",
    "plane-distance-no-root": "Computes the distance from a point to $ax + by + cz = d$ as $\\lvert ax_0 + by_0 + cz_0 - d\\rvert$ without dividing by $\\sqrt{a^2 + b^2 + c^2}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Flat surfaces in space",
      body: "A plane is the three-dimensional cousin of a line in the plane, and its equation $ax + by + cz = d$ looks just like $ax + by = c$. The coefficients form the normal vector, which carries nearly all the geometry: distances, angles and parallelism are all read from it. This section completes the vectors chapter and the exam syllabus.",
      realWorld: {
        title: "Rendering and collision",
        body: "Game engines represent walls and floors as planes $\\mathbf n \\cdot \\mathbf r = d$. Testing whether a point is in front of or behind a wall is the sign of $\\mathbf n \\cdot \\mathbf p - d$, and the distance to the wall decides whether a moving object has collided with it, every frame.",
      },
    },
    {
      type: "truth",
      statement: "**Plane** with normal $\\mathbf n = (a, b, c)$ through $\\mathbf r_0$: $(\\mathbf r - \\mathbf r_0) \\cdot \\mathbf n = 0$, i.e. $ax + by + cz = d$. Through three points $A, B, C$: normal $\\vec{AB} \\times \\vec{AC}$. **Distance** from $(x_0, y_0, z_0)$: $\\dfrac{\\lvert ax_0 + by_0 + cz_0 - d\\rvert}{\\sqrt{a^2 + b^2 + c^2}}$; between parallel planes $ax + by + cz = d_1$, $= d_2$: $\\dfrac{\\lvert d_1 - d_2\\rvert}{\\sqrt{a^2 + b^2 + c^2}}$. **Angles**: between planes, $\\cos\\theta = \\dfrac{\\lvert\\mathbf n_1 \\cdot \\mathbf n_2\\rvert}{\\lvert\\mathbf n_1\\rvert\\lvert\\mathbf n_2\\rvert}$; between a line (direction $\\mathbf b$) and a plane, $\\sin\\varphi = \\dfrac{\\lvert\\mathbf b \\cdot \\mathbf n\\rvert}{\\lvert\\mathbf b\\rvert\\lvert\\mathbf n\\rvert}$.",
      body: "Planes are parallel iff their normals are parallel, perpendicular iff $\\mathbf n_1 \\cdot \\mathbf n_2 = 0$. A line is parallel to a plane iff $\\mathbf b \\cdot \\mathbf n = 0$ (it lies in the plane if, in addition, one of its points does), and perpendicular to it iff $\\mathbf b \\parallel \\mathbf n$. **Family**: every plane through the line of intersection of $P_1 = 0$ and $P_2 = 0$ is $P_1 + \\lambda P_2 = 0$; one more condition fixes $\\lambda$. The distance formula is the 3D version of the point-to-line formula of §{straight-lines}, and the plane through three points uses the cross product (§{cross-product}).",
    },
    {
      type: "predict",
      misconception: "line-plane-cos",
      item: {
        kind: "mc",
        id: "pln-predict-1",
        prompt: "The line $\\mathbf r = \\lambda(1, 1, 0)$ and the plane $z = 0$ make an angle of",
        options: [
          { id: "a", text: "$0°$: the line lies in the plane", correct: true, why: "$\\sin\\varphi = \\dfrac{\\lvert(1, 1, 0) \\cdot (0, 0, 1)\\rvert}{\\dots} = 0$." },
          { id: "b", text: "$90°$", misconception: "line-plane-cos", why: "$90°$ is the angle with the **normal**; the line-plane angle is its complement." },
          { id: "c", text: "$45°$", why: "That is the angle with the $x$-axis." },
        ],
      },
      reveal: {
        body: "The line runs along the floor $z = 0$, so it makes no angle with the plane. Its direction is perpendicular to the plane's normal $(0, 0, 1)$: the dot product is 0. If you put that into a cosine you get $90°$, the angle between the line and the **normal**. The angle with the plane is $90°$ minus that, which is why the formula uses $\\sin$.",
      },
      resolve: {
        kind: "mc",
        id: "pln-resolve-1",
        prompt: "The line $\\mathbf r = \\lambda(0, 0, 1)$ and the plane $z = 0$ make an angle of",
        options: [
          { id: "a", text: "$90°$", correct: true, why: "The line is along the normal: $\\sin\\varphi = 1$." },
          { id: "b", text: "$0°$", misconception: "line-plane-cos", why: "$\\cos$ of the angle with the normal gives the complement." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pln-check-1",
        prompt: "The distance from $(1, 1, 1)$ to $x + 2y + 2z = 14$ is",
        options: [
          { id: "a", text: "3", correct: true, why: "$\\dfrac{\\lvert 1 + 2 + 2 - 14\\rvert}{3}$." },
          { id: "b", text: "9", misconception: "plane-distance-no-root", why: "Divide by $\\sqrt{1 + 4 + 4} = 3$." },
          { id: "c", text: "1", why: "Divide by 3, not 9." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pln-check-2",
        prompt: "A normal vector to $2x - 3y + 6z = 5$ is",
        options: [
          { id: "a", text: "$(2, -3, 6)$", correct: true, why: "The coefficients of $x, y, z$." },
          { id: "b", text: "$(3, 2, 0)$", why: "That lies in the plane's direction: $(2, -3, 6) \\cdot (3, 2, 0) = 0$." },
          { id: "c", text: "$(5, 0, 0)$", why: "The constant 5 only shifts the plane." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A linear classifier in three features separates classes with a plane $\\mathbf w \\cdot \\mathbf x + b = 0$; the signed distance $\\dfrac{\\mathbf w \\cdot \\mathbf x + b}{\\lvert\\mathbf w\\rvert}$ is the margin that support vector machines maximise (§{svm-knn-nb}). In higher dimensions these planes are hyperplanes, but the formula is identical.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pln-produce-1", prompt: "Find the distance from the origin to $2x + 3y + 6z = 14$.", answer: 2, explain: "$\\tfrac{14}7$." },
        { kind: "number", id: "pln-produce-2", prompt: "Find the angle, in degrees, between the planes $x + y = 1$ and $y + z = 1$.", answer: 60, explain: "Normals $(1, 1, 0)$, $(0, 1, 1)$: $\\cos\\theta = \\tfrac12$." },
        {
          kind: "mc",
          id: "pln-produce-3",
          prompt: "A line with direction $(2, 1, 2)$ meets the plane $z = 0$ at an angle $\\varphi$ with",
          options: [
            { id: "a", text: "$\\sin\\varphi = \\tfrac23$", correct: true, why: "$\\dfrac{\\lvert 2\\rvert}{3 \\times 1}$." },
            { id: "b", text: "$\\cos\\varphi = \\tfrac23$", misconception: "line-plane-cos", why: "That is the angle with the normal." },
          ],
        },
        {
          kind: "mc",
          id: "pln-produce-4",
          prompt: "The distance from the origin to the plane $3x + 4y = 10$ is",
          options: [
            { id: "a", text: "2", correct: true, why: "$\\tfrac{10}{\\sqrt{9 + 16}}$." },
            { id: "b", text: "10", misconception: "plane-distance-no-root", why: "Divide by $\\lvert\\mathbf n\\rvert = 5$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "pln-review-1", prompt: "Find the $x$-intercept of the plane $2x + 3y + 4z = 12$.", answer: 6, explain: "Put $y = z = 0$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the plane through three points",
      body: "Through $A(1, 0, 0)$, $B(0, 2, 0)$, $C(0, 0, 3)$: the intercept form gives $x + \\tfrac y2 + \\tfrac z3 = 1$, i.e. $6x + 3y + 2z = 6$. In general take $\\mathbf n = \\vec{AB} \\times \\vec{AC}$ and $d = \\mathbf n \\cdot \\mathbf a$; equivalently, the determinant with rows $(x - x_1, y - y_1, z - z_1)$, $\\vec{AB}$, $\\vec{AC}$ vanishes.",
    },
    {
      type: "definition",
      term: "line of intersection",
      body: "Two non-parallel planes meet in a line whose direction is $\\mathbf n_1 \\times \\mathbf n_2$; a point on it comes from solving the two equations with one coordinate set to 0. The family $P_1 + \\lambda P_2 = 0$ contains every other plane through that line.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "distance from a point to a plane",
      statement: "The distance from $P(x_0, y_0, z_0)$ to $ax + by + cz = d$ is $\\dfrac{\\lvert ax_0 + by_0 + cz_0 - d\\rvert}{\\sqrt{a^2 + b^2 + c^2}}$.",
      proof: ["Take any point $Q$ on the plane; the distance is the length of the projection of $\\vec{QP}$ onto the unit normal $\\dfrac{\\mathbf n}{\\lvert\\mathbf n\\rvert}$.", "$\\vec{QP} \\cdot \\mathbf n = \\mathbf p \\cdot \\mathbf n - \\mathbf q \\cdot \\mathbf n = (ax_0 + by_0 + cz_0) - d$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "angle between a line and a plane",
      statement: "If a line with direction $\\mathbf b$ meets a plane with normal $\\mathbf n$ at angle $\\varphi$, then $\\sin\\varphi = \\dfrac{\\lvert\\mathbf b \\cdot \\mathbf n\\rvert}{\\lvert\\mathbf b\\rvert\\lvert\\mathbf n\\rvert}$.",
      proof: ["The line makes angle $90° - \\varphi$ with the normal, and $\\cos(90° - \\varphi) = \\sin\\varphi$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "planes through a line",
      statement: "If $P_1 = 0$ and $P_2 = 0$ are non-parallel planes, then for each $\\lambda$, $P_1 + \\lambda P_2 = 0$ is a plane containing their line of intersection.",
      proof: ["It is linear in $x, y, z$, so a plane (its normal $\\mathbf n_1 + \\lambda\\mathbf n_2 \\ne \\mathbf 0$).", "Every point with $P_1 = P_2 = 0$ satisfies it."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the plane through $(1, 0, 0)$, $(0, 2, 0)$ and $(0, 0, 3)$.",
      solution: ["Intercepts 1, 2, 3: $\\dfrac x1 + \\dfrac y2 + \\dfrac z3 = 1$.", "Multiply by 6: $6x + 3y + 2z = 6$."],
      result: "$6x + 3y + 2z = 6$.",
    },
    {
      type: "example",
      level: 2,
      title: "parallel planes",
      problem: "Find the distance between $2x - y + 2z = 3$ and $2x - y + 2z = 9$.",
      solution: ["Same normal $(2, -1, 2)$ of length 3.", "$\\dfrac{\\lvert 9 - 3\\rvert}3 = 2$."],
      result: "2.",
    },
    {
      type: "example",
      level: 3,
      title: "a plane through a line",
      problem: "Find the plane through the origin and the line of intersection of $x + y + z = 1$ and $2x + 3y + 4z = 5$.",
      solution: ["$(x + y + z - 1) + \\lambda(2x + 3y + 4z - 5) = 0$ through the origin: $-1 - 5\\lambda = 0$, $\\lambda = -\\tfrac15$.", "Multiply by 5: $5(x + y + z - 1) - (2x + 3y + 4z - 5) = 3x + 2y + z = 0$."],
      result: "$3x + 2y + z = 0$.",
    },
  ],
  pitfalls: [
    { wrong: "Line–plane angle from $\\cos = \\dfrac{\\lvert\\mathbf b \\cdot \\mathbf n\\rvert}{\\lvert\\mathbf b\\rvert\\lvert\\mathbf n\\rvert}$.", right: "That gives the angle with the normal; use $\\sin$." },
    { wrong: "Point-to-plane distance $\\lvert ax_0 + by_0 + cz_0 - d\\rvert$.", right: "Divide by $\\sqrt{a^2 + b^2 + c^2}$." },
    { wrong: "Subtract the constants of parallel planes with different normals' scalings.", right: "Scale both equations to the same $(a, b, c)$ first." },
  ],
  formulas: [
    { label: "Plane", tex: "ax + by + cz = d,\\ \\mathbf n = (a, b, c)" },
    { label: "Intercepts", tex: "\\tfrac xa + \\tfrac yb + \\tfrac zc = 1" },
    { label: "Distance", tex: "\\tfrac{\\lvert ax_0 + by_0 + cz_0 - d\\rvert}{\\sqrt{a^2 + b^2 + c^2}}" },
    { label: "Planes' angle", tex: "\\cos\\theta = \\tfrac{\\lvert\\mathbf n_1 \\cdot \\mathbf n_2\\rvert}{\\lvert\\mathbf n_1\\rvert\\lvert\\mathbf n_2\\rvert}" },
    { label: "Line–plane", tex: "\\sin\\varphi = \\tfrac{\\lvert\\mathbf b \\cdot \\mathbf n\\rvert}{\\lvert\\mathbf b\\rvert\\lvert\\mathbf n\\rvert}" },
  ],
  exercises: [
    ex(1, num("plnx-ex-1", "Find the distance from $(1, 1, 1)$ to $x + 2y + 2z = 14$.", 3, "$\\tfrac93$."), ["$3$."]),
    ex(1, num("plnx-ex-2", "Find the distance between $2x - y + 2z = 3$ and $2x - y + 2z = 9$.", 2, "$\\tfrac63$."), ["$2$."]),
    ex(2, num("plnx-ex-3", "Find the $x$-intercept of $2x + 3y + 4z = 12$.", 6, "$y = z = 0$."), ["$6$."]),
    ex(2, num("plnx-ex-4", "Find the angle, in degrees, between $x + y = 1$ and $y + z = 1$.", 60, "$\\cos\\theta = \\tfrac12$."), ["$60°$."]),
    ex(2, fr("plnx-ex-5", "A line with direction $(2, 1, 2)$ meets the plane $z = 0$ at angle $\\varphi$. Find $\\sin\\varphi$.", 2 / 3, "$\\tfrac{2}{3}$."), ["$\\tfrac23$."]),
    ex(3, num("plnx-ex-6", "The plane through $(1, 0, 0)$, $(0, 2, 0)$, $(0, 0, 3)$ is $6x + 3y + cz = 6$. Find $c$.", 2, "Intercept form."), ["$2$."]),
    ex(3, num("plnx-ex-7", "The plane through the origin and the line of intersection of $x + y + z = 1$ and $2x + 3y + 4z = 5$ is $3x + 2y + cz = 0$. Find $c$.", 1, "$\\lambda = -\\tfrac15$."), ["$1$."]),
    ex(3, mc("plnx-ex-8", "The planes $2x + 3y - z = 1$ and $4x + 6y - 2z = 5$ are", ["parallel", "Normals $(2, 3, -1)$ and $(4, 6, -2)$ are parallel, and the constants don't match."], [["perpendicular", "That needs $\\mathbf n_1 \\cdot \\mathbf n_2 = 0$; here it is 28."], ["the same plane", "Halving the second gives $= \\tfrac52$, not 1."]]), ["Distinct parallel planes."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const pl = (a: number, b: number, c: number, d: number) => {
  const t = (k: number, v: string, first: boolean) => (k === 0 ? "" : `${k < 0 ? (first ? "-" : " - ") : first ? "" : " + "}${Math.abs(k) === 1 ? "" : Math.abs(k)}${v}`);
  return `${t(a, "x", true)}${t(b, "y", a === 0)}${t(c, "z", a === 0 && b === 0)} = ${d}`;
};

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c, m] = r.pick(QUADS);
      const s = [r.pick([1, -1]), r.pick([1, -1]), r.pick([1, -1])];
      const nv = [s[0] * a, s[1] * b, s[2] * c];
      const p = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      const d = r.int(-12, 12);
      const v = Math.abs(nv[0] * p[0] + nv[1] * p[1] + nv[2] * p[2] - d) / m;
      return n(`Find the distance from $(${p.join(", ")})$ to $${pl(nv[0], nv[1], nv[2], d)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\lvert ${nv[0] * p[0] + nv[1] * p[1] + nv[2] * p[2]} - (${d})\\rvert}{${m}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c, m] = r.pick(QUADS);
      const d1 = r.int(-10, 10);
      const d2 = d1 + r.nonzero(-12, 12);
      const v = Math.abs(d1 - d2) / m;
      return n(`Find the distance between $${pl(a, b, c, d1)}$ and $${pl(a, b, c, d2)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\lvert ${d1} - (${d2})\\rvert}{${m}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const co = [r.nonzero(-6, 6), r.nonzero(-6, 6), r.nonzero(-6, 6)];
      const d = r.nonzero(-24, 24);
      const i = r.int(0, 2);
      const v = d / co[i];
      return n(`Find the ${["x", "y", "z"][i]}-intercept of $${pl(co[0], co[1], co[2], d)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `Set the other two coordinates to 0: $\\tfrac{${d}}{${co[i]}}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [p, q] = r.pick([[1, 1], [1, 2], [3, 4], [2, 5]] as const);
      return mcNumbers(
        `The line $\\mathbf r = \\lambda(${p}, ${q}, 0)$ and the plane $z = 0$ make an angle of`,
        { text: "$0°$", why: "The direction is perpendicular to the normal $(0, 0, 1)$, so the line lies in the plane." },
        [{ text: "$90°$", why: "That is the angle with the normal.", misconception: "line-plane-cos" }],
      );
    },
  },
];
