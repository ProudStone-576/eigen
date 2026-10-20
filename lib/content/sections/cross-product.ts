import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The vector (cross) product: determinant form, magnitude |a||b| sin θ, right-hand direction, anticommutativity, parallel vectors; areas of parallelograms and triangles; the scalar triple product, volume and coplanarity; the vector triple product a × (b × c) = (a·c)b − (a·b)c. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
type V = [number, number, number];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const v3 = (a: readonly number[]) => `(${a.join(", ")})`;

const base: ConceptNode = {
  id: "cross-product",
  title: "Cross & triple products",
  summary: "The cross product a × b is a vector perpendicular to both a and b, of length |a||b| sin θ, pointing by the right-hand rule. It is computed as a determinant with i, j, k in the top row. Order matters: b × a = −(a × b). Its length is the area of the parallelogram on a and b, and the scalar triple product a·(b × c), a 3 × 3 determinant, is the volume of the box on a, b, c, zero exactly when the three vectors are coplanar.",
  deps: ["vector-algebra", "determinants-properties"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "right-hand rule", meaning: "Curl the fingers of the right hand from $\\mathbf a$ to $\\mathbf b$; the thumb points along $\\mathbf a \\times \\mathbf b$." },
    { term: "scalar triple product", meaning: "$[\\mathbf a\\ \\mathbf b\\ \\mathbf c] = \\mathbf a \\cdot (\\mathbf b \\times \\mathbf c)$, the determinant of the components." },
    { term: "coplanar", meaning: "Lying in one plane; three vectors are coplanar iff $[\\mathbf a\\ \\mathbf b\\ \\mathbf c] = 0$." },
  ],
  misconceptions: {
    "cross-commutes": "Assumes $\\mathbf a \\times \\mathbf b = \\mathbf b \\times \\mathbf a$.",
    "cross-magnitude-cos": "Uses $\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta$ for the length of $\\mathbf a \\times \\mathbf b$, confusing it with the dot product.",
  },
  steps: [
    {
      type: "motivate",
      title: "A vector at right angles",
      body: "The dot product measures how much two vectors agree; the cross product measures how much they turn. Torque, angular momentum and the force on a moving charge are all cross products. In geometry it supplies normals to planes, areas of triangles in space and, through the triple product, volumes and a test for coplanarity.",
      realWorld: {
        title: "Torque on a wrench",
        body: "Pushing on a wrench with force $\\mathbf F$ at position $\\mathbf r$ from the bolt gives torque $\\boldsymbol\\tau = \\mathbf r \\times \\mathbf F$. Its size $\\lvert\\mathbf r\\rvert\\lvert\\mathbf F\\rvert\\sin\\theta$ is largest when you push at right angles to the handle, and zero if you push along it.",
      },
    },
    {
      type: "truth",
      statement: "$\\mathbf a \\times \\mathbf b = \\begin{vmatrix} \\mathbf i & \\mathbf j & \\mathbf k \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix} = (a_2b_3 - a_3b_2,\\ a_3b_1 - a_1b_3,\\ a_1b_2 - a_2b_1)$. It is perpendicular to $\\mathbf a$ and $\\mathbf b$, has length $\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\sin\\theta$, and $\\mathbf b \\times \\mathbf a = -\\mathbf a \\times \\mathbf b$; $\\mathbf a \\times \\mathbf b = \\mathbf 0$ iff $\\mathbf a \\parallel \\mathbf b$. $\\mathbf i \\times \\mathbf j = \\mathbf k$, $\\mathbf j \\times \\mathbf k = \\mathbf i$, $\\mathbf k \\times \\mathbf i = \\mathbf j$. **Areas**: parallelogram $\\lvert\\mathbf a \\times \\mathbf b\\rvert$, triangle $\\tfrac12\\lvert\\mathbf a \\times \\mathbf b\\rvert$. **Scalar triple product**: $[\\mathbf a\\ \\mathbf b\\ \\mathbf c] = \\det\\begin{bmatrix} \\mathbf a \\\\ \\mathbf b \\\\ \\mathbf c \\end{bmatrix}$, the signed volume of the parallelepiped.",
      body: "The triple product is unchanged by cyclic shifts, $[\\mathbf a\\ \\mathbf b\\ \\mathbf c] = [\\mathbf b\\ \\mathbf c\\ \\mathbf a]$, and changes sign when two vectors swap; it vanishes when two are equal or when the three are coplanar (§{determinants-properties}). The volume of a tetrahedron is $\\tfrac16\\lvert[\\mathbf a\\ \\mathbf b\\ \\mathbf c]\\rvert$. **Vector triple product**: $\\mathbf a \\times (\\mathbf b \\times \\mathbf c) = (\\mathbf a \\cdot \\mathbf c)\\mathbf b - (\\mathbf a \\cdot \\mathbf b)\\mathbf c$; the cross product is not associative. **Lagrange's identity**: $\\lvert\\mathbf a \\times \\mathbf b\\rvert^2 + (\\mathbf a \\cdot \\mathbf b)^2 = \\lvert\\mathbf a\\rvert^2\\lvert\\mathbf b\\rvert^2$, which is $\\sin^2\\theta + \\cos^2\\theta = 1$.",
    },
    {
      type: "predict",
      misconception: "cross-commutes",
      item: {
        kind: "mc",
        id: "crp-predict-1",
        prompt: "Compare $\\mathbf i \\times \\mathbf j$ and $\\mathbf j \\times \\mathbf i$.",
        options: [
          { id: "a", text: "$\\mathbf i \\times \\mathbf j = \\mathbf k$ but $\\mathbf j \\times \\mathbf i = -\\mathbf k$", correct: true, why: "Reversing the order reverses the right-hand rule." },
          { id: "b", text: "Both are $\\mathbf k$", misconception: "cross-commutes", why: "The cross product is anticommutative." },
          { id: "c", text: "Both are $\\mathbf 0$", why: "$\\mathbf i$ and $\\mathbf j$ are not parallel." },
        ],
      },
      reveal: {
        body: "Curl your right hand from $\\mathbf i$ to $\\mathbf j$: the thumb points up the $z$-axis, $\\mathbf k$. From $\\mathbf j$ to $\\mathbf i$ the curl is the other way and the thumb points down, $-\\mathbf k$. In the determinant, swapping the two rows changes the sign. So $\\mathbf b \\times \\mathbf a = -(\\mathbf a \\times \\mathbf b)$ always.",
      },
      resolve: {
        kind: "mc",
        id: "crp-resolve-1",
        prompt: "$\\mathbf a \\times \\mathbf b = 2\\mathbf i - \\mathbf j + 3\\mathbf k$. Then $\\mathbf b \\times \\mathbf a$ is",
        options: [
          { id: "a", text: "$-2\\mathbf i + \\mathbf j - 3\\mathbf k$", correct: true, why: "Reverse the sign." },
          { id: "b", text: "$2\\mathbf i - \\mathbf j + 3\\mathbf k$", misconception: "cross-commutes", why: "Order matters for cross products." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "crp-check-1",
        prompt: "$\\lvert\\mathbf a\\rvert = 2$, $\\lvert\\mathbf b\\rvert = 3$ and the angle between them is $30°$. Then $\\lvert\\mathbf a \\times \\mathbf b\\rvert$ is",
        options: [
          { id: "a", text: "3", correct: true, why: "$2 \\times 3 \\times \\sin 30°$." },
          { id: "b", text: "$3\\sqrt3$", misconception: "cross-magnitude-cos", why: "That uses $\\cos 30°$; the cross product's length uses $\\sin$." },
          { id: "c", text: "6", why: "That needs $\\theta = 90°$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "crp-check-2",
        prompt: "The parallelogram with sides $\\mathbf i + \\mathbf j$ and $\\mathbf j + \\mathbf k$ has area",
        options: [
          { id: "a", text: "$\\sqrt3$", correct: true, why: "$(1, 1, 0) \\times (0, 1, 1) = (1, -1, 1)$." },
          { id: "b", text: "$\\tfrac{\\sqrt3}2$", why: "That is the triangle." },
          { id: "c", text: "1", why: "That is the dot product." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "3D vision and robotics pipelines use cross products to compute surface normals from point clouds and to build rotation matrices; the triple product's sign tells whether a triangle mesh is oriented consistently. More broadly, the determinant as signed volume underlies the change-of-variables formula in normalising flows.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "crp-produce-1", prompt: "Find the $\\mathbf k$-component of $(1, 2, 3) \\times (4, 5, 6)$.", answer: -3, explain: "$1 \\times 5 - 2 \\times 4$." },
        { kind: "number", id: "crp-produce-2", prompt: "Find the volume of the parallelepiped with edges $\\mathbf i$, $\\mathbf j$ and $\\mathbf i + \\mathbf j + 2\\mathbf k$.", answer: 2, explain: "$\\det\\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 1 & 1 & 2 \\end{bmatrix} = 2$." },
        {
          kind: "mc",
          id: "crp-produce-3",
          prompt: "$\\mathbf a \\times \\mathbf b = (1, -2, 4)$. Then $\\mathbf b \\times \\mathbf a$ is",
          options: [
            { id: "a", text: "$(-1, 2, -4)$", correct: true, why: "Anticommutative." },
            { id: "b", text: "$(1, -2, 4)$", misconception: "cross-commutes", why: "Swapping the order flips the sign." },
          ],
        },
        {
          kind: "mc",
          id: "crp-produce-4",
          prompt: "$\\lvert\\mathbf a\\rvert = 4$, $\\lvert\\mathbf b\\rvert = 5$, angle $60°$. Then $\\lvert\\mathbf a \\times \\mathbf b\\rvert$ is",
          options: [
            { id: "a", text: "$10\\sqrt3$", correct: true, why: "$20\\sin 60°$." },
            { id: "b", text: "10", misconception: "cross-magnitude-cos", why: "That is $20\\cos 60° = \\mathbf a \\cdot \\mathbf b$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "crp-review-1", prompt: "Find $\\lvert\\mathbf i \\times \\mathbf i\\rvert$.", answer: 0, explain: "Parallel vectors: $\\sin 0 = 0$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the cross product of unit vectors",
      body: "Going round $\\mathbf i \\to \\mathbf j \\to \\mathbf k \\to \\mathbf i$ gives a positive product: $\\mathbf i \\times \\mathbf j = \\mathbf k$, $\\mathbf j \\times \\mathbf k = \\mathbf i$, $\\mathbf k \\times \\mathbf i = \\mathbf j$; going backwards gives minus signs. Any vector crossed with itself is $\\mathbf 0$. The determinant formula is these rules applied by distributivity.",
    },
    {
      type: "definition",
      term: "areas and volumes in space",
      body: "Triangle $ABC$: $\\tfrac12\\lvert\\vec{AB} \\times \\vec{AC}\\rvert$. Parallelepiped on $\\mathbf a, \\mathbf b, \\mathbf c$: $\\lvert[\\mathbf a\\ \\mathbf b\\ \\mathbf c]\\rvert$. Tetrahedron $ABCD$: $\\tfrac16\\lvert[\\vec{AB}\\ \\vec{AC}\\ \\vec{AD}]\\rvert$. Four points are coplanar iff that triple product is 0.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "a × b is perpendicular to a and b",
      statement: "$\\mathbf a \\cdot (\\mathbf a \\times \\mathbf b) = \\mathbf b \\cdot (\\mathbf a \\times \\mathbf b) = 0$.",
      proof: ["$\\mathbf a \\cdot (\\mathbf a \\times \\mathbf b) = [\\mathbf a\\ \\mathbf a\\ \\mathbf b]$, a determinant with two equal rows, so 0; likewise for $\\mathbf b$."],
    },
    {
      type: "theorem",
      name: "Lagrange's identity",
      statement: "$\\lvert\\mathbf a \\times \\mathbf b\\rvert^2 = \\lvert\\mathbf a\\rvert^2\\lvert\\mathbf b\\rvert^2 - (\\mathbf a \\cdot \\mathbf b)^2$.",
      proof: ["Expand both sides in components; both equal $\\sum_{i<j}(a_ib_j - a_jb_i)^2$.", "Hence $\\lvert\\mathbf a \\times \\mathbf b\\rvert = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\sqrt{1 - \\cos^2\\theta} = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\sin\\theta$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the vector triple product",
      statement: "$\\mathbf a \\times (\\mathbf b \\times \\mathbf c) = (\\mathbf a \\cdot \\mathbf c)\\mathbf b - (\\mathbf a \\cdot \\mathbf b)\\mathbf c$.",
      proof: ["Both sides are linear in each vector, so it suffices to check on unit vectors $\\mathbf i, \\mathbf j, \\mathbf k$; e.g. $\\mathbf i \\times (\\mathbf i \\times \\mathbf j) = \\mathbf i \\times \\mathbf k = -\\mathbf j = (\\mathbf i \\cdot \\mathbf j)\\mathbf i - (\\mathbf i \\cdot \\mathbf i)\\mathbf j$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $(2, 1, -1) \\times (1, 3, 2)$.",
      solution: ["$(1 \\cdot 2 - (-1) \\cdot 3,\\ (-1) \\cdot 1 - 2 \\cdot 2,\\ 2 \\cdot 3 - 1 \\cdot 1)$.", "$= (5, -5, 5)$; check: its dot product with each factor is 0."],
      result: "$(5, -5, 5)$.",
    },
    {
      type: "example",
      level: 2,
      title: "a triangle in space",
      problem: "Find the area of the triangle with vertices $(1, 0, 0)$, $(0, 1, 0)$, $(0, 0, 1)$.",
      solution: ["$\\vec{AB} = (-1, 1, 0)$, $\\vec{AC} = (-1, 0, 1)$, cross product $(1, 1, 1)$.", "Area $\\tfrac12\\sqrt3$."],
      result: "$\\tfrac{\\sqrt3}2$.",
    },
    {
      type: "example",
      level: 3,
      title: "coplanarity",
      problem: "Find $\\lambda$ for which $(1, 2, 3)$, $(2, 1, \\lambda)$ and $(3, 3, 4)$ are coplanar.",
      solution: ["$\\begin{vmatrix} 1 & 2 & 3 \\\\ 2 & 1 & \\lambda \\\\ 3 & 3 & 4 \\end{vmatrix} = 1(4 - 3\\lambda) - 2(8 - 3\\lambda) + 3(6 - 3) = 3\\lambda - 3$.", "Zero at $\\lambda = 1$."],
      result: "$\\lambda = 1$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\mathbf a \\times \\mathbf b = \\mathbf b \\times \\mathbf a$.", right: "$\\mathbf b \\times \\mathbf a = -\\mathbf a \\times \\mathbf b$." },
    { wrong: "$\\lvert\\mathbf a \\times \\mathbf b\\rvert = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta$.", right: "It uses $\\sin\\theta$." },
    { wrong: "$\\mathbf a \\times (\\mathbf b \\times \\mathbf c) = (\\mathbf a \\times \\mathbf b) \\times \\mathbf c$.", right: "The cross product isn't associative; use $(\\mathbf a \\cdot \\mathbf c)\\mathbf b - (\\mathbf a \\cdot \\mathbf b)\\mathbf c$." },
  ],
  formulas: [
    { label: "Cross product", tex: "(a_2b_3 - a_3b_2,\\ a_3b_1 - a_1b_3,\\ a_1b_2 - a_2b_1)" },
    { label: "Magnitude", tex: "\\lvert\\mathbf a \\times \\mathbf b\\rvert = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\sin\\theta" },
    { label: "Triangle", tex: "\\tfrac12\\lvert\\vec{AB} \\times \\vec{AC}\\rvert" },
    { label: "Triple product", tex: "[\\mathbf a\\ \\mathbf b\\ \\mathbf c] = \\det" },
    { label: "BAC − CAB", tex: "\\mathbf a \\times (\\mathbf b \\times \\mathbf c) = (\\mathbf a \\cdot \\mathbf c)\\mathbf b - (\\mathbf a \\cdot \\mathbf b)\\mathbf c" },
  ],
  exercises: [
    ex(1, num("crpx-ex-1", "Find the $\\mathbf k$-component of $(1, 2, 3) \\times (4, 5, 6)$.", -3, "$5 - 8$."), ["$-3$; the whole product is $(-3, 6, -3)$."]),
    ex(1, dp("crpx-ex-2", "Find $\\lvert\\mathbf i \\times \\mathbf j + \\mathbf j \\times \\mathbf k\\rvert$.", Math.SQRT2, "$\\lvert\\mathbf k + \\mathbf i\\rvert$."), ["$\\sqrt2 \\approx 1.414$."]),
    ex(2, dp("crpx-ex-3", "Find the area of the parallelogram with sides $(1, 1, 0)$ and $(0, 1, 1)$.", Math.sqrt(3), "$\\lvert(1, -1, 1)\\rvert$."), ["$\\sqrt3 \\approx 1.732$."]),
    ex(2, dp("crpx-ex-4", "Find the area of the triangle $(1, 0, 0)$, $(0, 1, 0)$, $(0, 0, 1)$.", Math.sqrt(3) / 2, "$\\tfrac12\\lvert(1, 1, 1)\\rvert$."), ["$\\approx 0.866$."]),
    ex(2, num("crpx-ex-5", "Find $[\\mathbf i\\ \\mathbf j\\ \\mathbf k]$.", 1, "$\\mathbf i \\cdot (\\mathbf j \\times \\mathbf k) = \\mathbf i \\cdot \\mathbf i$."), ["$1$."]),
    ex(3, num("crpx-ex-6", "Find $\\lambda$ for which $(1, 2, 3)$, $(2, 1, \\lambda)$, $(3, 3, 4)$ are coplanar.", 1, "$3\\lambda - 3 = 0$."), ["$1$."]),
    ex(3, num("crpx-ex-7", "Find the volume of the parallelepiped with edges $(1, 2, 3)$, $(0, 1, 2)$, $(1, 0, 1)$.", 2, "$1(1) - 2(-2) + 3(-1)$."), ["$2$."]),
    ex(3, mc("crpx-ex-8", "$\\mathbf a \\times (\\mathbf b \\times \\mathbf c)$ equals", ["$(\\mathbf a \\cdot \\mathbf c)\\mathbf b - (\\mathbf a \\cdot \\mathbf b)\\mathbf c$", "The BAC − CAB rule."], [["$(\\mathbf a \\cdot \\mathbf b)\\mathbf c - (\\mathbf a \\cdot \\mathbf c)\\mathbf b$", "The signs are reversed."], ["$(\\mathbf a \\times \\mathbf b) \\times \\mathbf c$", "The cross product isn't associative."]]), ["It lies in the plane of $\\mathbf b$ and $\\mathbf c$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const rv = (r: { int: (a: number, b: number) => number }): V => [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = rv(r);
      const b = rv(r);
      const c = cross(a, b);
      const i = r.int(0, 2);
      const name = ["\\mathbf i", "\\mathbf j", "\\mathbf k"][i];
      return n(`Find the $${name}$-component of $${v3(a)} \\times ${v3(b)}$.`, c[i], `$${v3(a)} \\times ${v3(b)} = ${v3(c)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = rv(r);
      const b = rv(r);
      const c = rv(r);
      const v = dot(a, cross(b, c));
      return n(`Find the scalar triple product $[\\mathbf a\\ \\mathbf b\\ \\mathbf c]$ for $\\mathbf a = ${v3(a)}$, $\\mathbf b = ${v3(b)}$, $\\mathbf c = ${v3(c)}$.`, v, `The determinant of the three rows: ${v}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(1, 6);
      const q = r.int(1, 6);
      const th = r.pick([30, 90, 150]);
      const v = p * q * Math.sin((th * Math.PI) / 180);
      return n(`$\\lvert\\mathbf a\\rvert = ${p}$, $\\lvert\\mathbf b\\rvert = ${q}$, and the angle between them is $${th}°$. Find $\\lvert\\mathbf a \\times \\mathbf b\\rvert$ (3 decimals).`, Math.round(v * 1000) / 1000, `$${p} \\times ${q} \\times \\sin ${th}°$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const c: V = [r.nonzero(-5, 5), r.nonzero(-5, 5), r.nonzero(-5, 5)];
      return mcNumbers(
        `$\\mathbf a \\times \\mathbf b = ${v3(c)}$. Then $\\mathbf b \\times \\mathbf a$ is`,
        { text: `$${v3(c.map((x) => -x))}$`, why: "Swapping the order reverses the sign." },
        [{ text: `$${v3(c)}$`, why: "The cross product is anticommutative.", misconception: "cross-commutes" }, { text: "$\\mathbf 0$", why: "Only parallel vectors give $\\mathbf 0$." }],
      );
    },
  },
];
