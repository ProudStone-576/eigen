import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Coordinates in space; distance and the section formula in three dimensions; vectors and scalars, position vectors, components along i, j, k, magnitude and unit vectors; addition and scalar multiples, collinearity; the scalar (dot) product, angles, perpendicularity and projections. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const v3 = (a: readonly number[]) => `(${a.join(", ")})`;

const base: ConceptNode = {
  id: "vector-algebra",
  title: "Vector algebra & the dot product",
  summary: "A point in space has three coordinates, and the distance between two points is √(Δx² + Δy² + Δz²). A vector has a length and a direction; in components a = a₁i + a₂j + a₃k, it adds component by component. The dot product a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ is a number, not a vector: it is zero exactly for perpendicular vectors, and a·b/|b| is the projection of a on b. Lengths don't add: |a + b| ≤ |a| + |b|.",
  deps: ["straight-lines"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "position vector", meaning: "The vector $\\vec{OP}$ from the origin to $P$; for $P(x, y, z)$ it is $x\\mathbf i + y\\mathbf j + z\\mathbf k$." },
    { term: "unit vector", meaning: "A vector of length 1; $\\hat a = \\dfrac{\\mathbf a}{\\lvert\\mathbf a\\rvert}$ points along $\\mathbf a$." },
    { term: "scalar projection", meaning: "$\\dfrac{\\mathbf a \\cdot \\mathbf b}{\\lvert\\mathbf b\\rvert}$, the signed length of the shadow of $\\mathbf a$ on the line of $\\mathbf b$." },
  ],
  misconceptions: {
    "dot-is-vector": "Thinks the dot product is a vector, multiplying components without adding them.",
    "magnitude-sum": "Takes $\\lvert\\mathbf a + \\mathbf b\\rvert$ to be $\\lvert\\mathbf a\\rvert + \\lvert\\mathbf b\\rvert$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Arrows in space",
      body: "Forces, velocities and displacements have both size and direction, and they combine by adding arrows. Vectors give coordinate geometry a third dimension and a compact language: a single dot product measures angles, tests perpendicularity and computes work. The two-dimensional picture of §{vector} carries over with one more component.",
      realWorld: {
        title: "Work done by a force",
        body: "Pulling a sledge with force $\\mathbf F$ along displacement $\\mathbf d$ does work $\\mathbf F \\cdot \\mathbf d = \\lvert\\mathbf F\\rvert\\lvert\\mathbf d\\rvert\\cos\\theta$. Only the component of the force along the motion counts, which is why pulling at a steep angle wastes effort.",
      },
    },
    {
      type: "truth",
      statement: "Distance $PQ = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$; the point dividing $PQ$ internally in ratio $m : n$ is $\\dfrac{m\\mathbf q + n\\mathbf p}{m + n}$, coordinate by coordinate. For $\\mathbf a = a_1\\mathbf i + a_2\\mathbf j + a_3\\mathbf k$: $\\lvert\\mathbf a\\rvert = \\sqrt{a_1^2 + a_2^2 + a_3^2}$, and vectors add and scale componentwise; $\\mathbf a \\parallel \\mathbf b$ iff $\\mathbf a = \\lambda\\mathbf b$. **Dot product**: $\\mathbf a \\cdot \\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta$, a **scalar**; $\\mathbf a \\perp \\mathbf b$ iff $\\mathbf a \\cdot \\mathbf b = 0$; projection of $\\mathbf a$ on $\\mathbf b$ is $\\dfrac{\\mathbf a \\cdot \\mathbf b}{\\lvert\\mathbf b\\rvert}$.",
      body: "Properties: $\\mathbf a \\cdot \\mathbf b = \\mathbf b \\cdot \\mathbf a$, $\\mathbf a \\cdot (\\mathbf b + \\mathbf c) = \\mathbf a \\cdot \\mathbf b + \\mathbf a \\cdot \\mathbf c$, $\\mathbf a \\cdot \\mathbf a = \\lvert\\mathbf a\\rvert^2$, and $\\mathbf i \\cdot \\mathbf i = 1$, $\\mathbf i \\cdot \\mathbf j = 0$. Lengths combine through the dot product: $\\lvert\\mathbf a + \\mathbf b\\rvert^2 = \\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 + 2\\mathbf a \\cdot \\mathbf b$, so $\\lvert\\mathbf a + \\mathbf b\\rvert = \\lvert\\mathbf a\\rvert + \\lvert\\mathbf b\\rvert$ only when they point the same way; in general $\\lvert\\mathbf a + \\mathbf b\\rvert \\le \\lvert\\mathbf a\\rvert + \\lvert\\mathbf b\\rvert$ (the triangle inequality). The angle between $\\mathbf a$ and $\\mathbf b$ is $\\cos^{-1}\\dfrac{\\mathbf a \\cdot \\mathbf b}{\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert}$.",
    },
    {
      type: "predict",
      misconception: "dot-is-vector",
      item: {
        kind: "mc",
        id: "vca-predict-1",
        prompt: "$(\\mathbf i + 2\\mathbf j + 3\\mathbf k) \\cdot (4\\mathbf i - 5\\mathbf j + 6\\mathbf k)$ is",
        options: [
          { id: "a", text: "12", correct: true, why: "$4 - 10 + 18$." },
          { id: "b", text: "$4\\mathbf i - 10\\mathbf j + 18\\mathbf k$", misconception: "dot-is-vector", why: "The dot product adds the component products into one number." },
          { id: "c", text: "0", why: "Compute $4 - 10 + 18$." },
        ],
      },
      reveal: {
        body: "Multiply matching components and **add**: $1 \\times 4 + 2 \\times (-5) + 3 \\times 6 = 12$. The result is a scalar, which is why it is also called the scalar product. Since it equals $\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta$ and is positive here, the angle between the vectors is acute.",
      },
      resolve: {
        kind: "mc",
        id: "vca-resolve-1",
        prompt: "$(2, 1, -1) \\cdot (1, 3, 2)$ is",
        options: [
          { id: "a", text: "3", correct: true, why: "$2 + 3 - 2$." },
          { id: "b", text: "$(2, 3, -2)$", misconception: "dot-is-vector", why: "Add the products." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "vca-check-1",
        prompt: "$\\lvert\\mathbf a\\rvert = 3$, $\\lvert\\mathbf b\\rvert = 4$ and $\\mathbf a \\perp \\mathbf b$. Then $\\lvert\\mathbf a + \\mathbf b\\rvert$ is",
        options: [
          { id: "a", text: "5", correct: true, why: "$9 + 16 + 2(0) = 25$." },
          { id: "b", text: "7", misconception: "magnitude-sum", why: "Lengths add only for vectors pointing the same way." },
          { id: "c", text: "1", why: "That would need opposite directions." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "vca-check-2",
        prompt: "The angle between $\\mathbf i + \\mathbf j$ and $\\mathbf j + \\mathbf k$ is",
        options: [
          { id: "a", text: "60°", correct: true, why: "$\\cos\\theta = \\dfrac1{\\sqrt2\\sqrt2} = \\tfrac12$." },
          { id: "b", text: "90°", why: "The dot product is 1, not 0." },
          { id: "c", text: "45°", why: "$\\cos 45° = \\tfrac1{\\sqrt2}$, not $\\tfrac12$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Cosine similarity, $\\dfrac{\\mathbf a \\cdot \\mathbf b}{\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert}$, compares word and document embeddings in search and recommendation; a neuron computes a dot product of weights with inputs (§{layer}), and attention scores in transformers are dot products of query and key vectors.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "vca-produce-1", prompt: "Find the distance between $(1, 2, 3)$ and $(4, 6, 15)$.", answer: 13, explain: "$\\sqrt{9 + 16 + 144}$." },
        { kind: "number", id: "vca-produce-2", prompt: "Find the projection of $2\\mathbf i + 3\\mathbf j + 6\\mathbf k$ on $\\mathbf i + 2\\mathbf j + 2\\mathbf k$. Give an exact fraction or 3 decimal places.", answer: 20 / 3, tolerance: 0.0005, explain: "$\\dfrac{2 + 6 + 12}3$." },
        {
          kind: "mc",
          id: "vca-produce-3",
          prompt: "$(1, 0, 2) \\cdot (3, 1, -1)$ is",
          options: [
            { id: "a", text: "1", correct: true, why: "$3 + 0 - 2$." },
            { id: "b", text: "$(3, 0, -2)$", misconception: "dot-is-vector", why: "A dot product is a single number." },
          ],
        },
        {
          kind: "mc",
          id: "vca-produce-4",
          prompt: "$\\mathbf a, \\mathbf b$ are unit vectors at $120°$. Then $\\lvert\\mathbf a + \\mathbf b\\rvert$ is",
          options: [
            { id: "a", text: "1", correct: true, why: "$1 + 1 + 2\\cos 120° = 1$." },
            { id: "b", text: "2", misconception: "magnitude-sum", why: "That needs them to point the same way." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "vca-review-1", prompt: "Find $\\lvert 2\\mathbf i - 3\\mathbf j + 6\\mathbf k\\rvert$.", answer: 7, explain: "$\\sqrt{4 + 9 + 36}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "components and direction",
      body: "$\\vec{PQ} = \\mathbf q - \\mathbf p$. A vector $\\mathbf a$ makes angles $\\alpha, \\beta, \\gamma$ with the axes, where $\\cos\\alpha = \\dfrac{a_1}{\\lvert\\mathbf a\\rvert}$ and so on; these direction cosines satisfy $\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1$ (developed for lines in §{lines-3d}).",
    },
    {
      type: "definition",
      term: "collinear points",
      body: "$A, B, C$ are collinear iff $\\vec{AB} = \\lambda\\vec{AC}$ for some $\\lambda$, i.e. the component ratios agree. $(1, 2, 3)$, $(2, 4, 5)$, $(3, 6, 7)$ are collinear: $\\vec{AB} = (1, 2, 2)$ and $\\vec{AC} = (2, 4, 4) = 2\\vec{AB}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the two forms of the dot product agree",
      statement: "$a_1b_1 + a_2b_2 + a_3b_3 = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta$.",
      proof: ["By the cosine rule (§{triangles-trig}) in the triangle with sides $\\mathbf a$, $\\mathbf b$, $\\mathbf a - \\mathbf b$: $\\lvert\\mathbf a - \\mathbf b\\rvert^2 = \\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 - 2\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta$.", "Expanding the left side in components gives $\\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 - 2(a_1b_1 + a_2b_2 + a_3b_3)$; compare."],
    },
    {
      type: "theorem",
      name: "the Cauchy–Schwarz inequality",
      statement: "$\\lvert\\mathbf a \\cdot \\mathbf b\\rvert \\le \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert$, with equality iff $\\mathbf a \\parallel \\mathbf b$.",
      proof: ["$\\lvert\\cos\\theta\\rvert \\le 1$, with equality iff $\\theta = 0$ or $\\pi$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the triangle inequality",
      statement: "$\\lvert\\mathbf a + \\mathbf b\\rvert \\le \\lvert\\mathbf a\\rvert + \\lvert\\mathbf b\\rvert$.",
      proof: ["$\\lvert\\mathbf a + \\mathbf b\\rvert^2 = \\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 + 2\\mathbf a \\cdot \\mathbf b \\le \\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 + 2\\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert = (\\lvert\\mathbf a\\rvert + \\lvert\\mathbf b\\rvert)^2$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the unit vector along $2\\mathbf i - \\mathbf j + 2\\mathbf k$.",
      solution: ["$\\lvert\\mathbf a\\rvert = \\sqrt{4 + 1 + 4} = 3$.", "$\\hat a = \\tfrac13(2\\mathbf i - \\mathbf j + 2\\mathbf k)$."],
      result: "$\\tfrac23\\mathbf i - \\tfrac13\\mathbf j + \\tfrac23\\mathbf k$.",
    },
    {
      type: "example",
      level: 2,
      title: "perpendicular vectors",
      problem: "Find $\\lambda$ so that $2\\mathbf i + \\lambda\\mathbf j + \\mathbf k$ is perpendicular to $\\mathbf i - 2\\mathbf j + 3\\mathbf k$.",
      solution: ["Dot product zero: $2 - 2\\lambda + 3 = 0$.", "$\\lambda = \\tfrac52$."],
      result: "$\\lambda = \\tfrac52$.",
    },
    {
      type: "example",
      level: 3,
      title: "the section formula",
      problem: "Find the point dividing $A(1, 2, 3)$, $B(4, -1, 6)$ internally in the ratio $2 : 1$.",
      solution: ["$\\dfrac{2\\mathbf b + \\mathbf a}3$, coordinate by coordinate.", "$\\left(\\tfrac{8 + 1}3, \\tfrac{-2 + 2}3, \\tfrac{12 + 3}3\\right) = (3, 0, 5)$."],
      result: "$(3, 0, 5)$.",
    },
  ],
  pitfalls: [
    { wrong: "The dot product is a vector.", right: "It is a number: $\\sum a_ib_i$." },
    { wrong: "$\\lvert\\mathbf a + \\mathbf b\\rvert = \\lvert\\mathbf a\\rvert + \\lvert\\mathbf b\\rvert$.", right: "Use $\\lvert\\mathbf a + \\mathbf b\\rvert^2 = \\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 + 2\\mathbf a \\cdot \\mathbf b$." },
    { wrong: "Projection of $\\mathbf a$ on $\\mathbf b$ is $\\mathbf a \\cdot \\mathbf b$.", right: "Divide by $\\lvert\\mathbf b\\rvert$." },
  ],
  formulas: [
    { label: "Distance", tex: "\\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}" },
    { label: "Dot product", tex: "\\mathbf a \\cdot \\mathbf b = \\textstyle\\sum a_ib_i = \\lvert\\mathbf a\\rvert\\lvert\\mathbf b\\rvert\\cos\\theta" },
    { label: "Projection", tex: "\\tfrac{\\mathbf a \\cdot \\mathbf b}{\\lvert\\mathbf b\\rvert}" },
    { label: "Length of a sum", tex: "\\lvert\\mathbf a + \\mathbf b\\rvert^2 = \\lvert\\mathbf a\\rvert^2 + \\lvert\\mathbf b\\rvert^2 + 2\\mathbf a \\cdot \\mathbf b" },
  ],
  exercises: [
    ex(1, num("vcax-ex-1", "Find $\\lvert 3\\mathbf i - 4\\mathbf j + 12\\mathbf k\\rvert$.", 13, "$\\sqrt{9 + 16 + 144}$."), ["$13$."]),
    ex(1, num("vcax-ex-2", "Find the distance between $(1, -1, 2)$ and $(3, 1, 3)$.", 3, "$\\sqrt{4 + 4 + 1}$."), ["$3$."]),
    ex(2, num("vcax-ex-3", "Find $(1, 2, 3) \\cdot (3, -2, 1)$.", 2, "$3 - 4 + 3$."), ["$2$."]),
    ex(2, num("vcax-ex-4", "Find $\\lambda$ with $(2, \\lambda, 1) \\perp (1, -2, 3)$.", 2.5, "$2 - 2\\lambda + 3 = 0$."), ["$2.5$."]),
    ex(2, num("vcax-ex-5", "Find the angle, in degrees, between $(1, 1, 0)$ and $(0, 1, 1)$.", 60, "$\\cos\\theta = \\tfrac12$."), ["$60°$."]),
    ex(3, fr("vcax-ex-6", "Find the projection of $(2, 3, 6)$ on $(1, 2, 2)$.", 20 / 3, "$\\tfrac{20}3$."), ["$\\tfrac{20}3$."]),
    ex(3, num("vcax-ex-7", "Find the $x$-coordinate of the point dividing $(1, 2, 3)$ to $(4, -1, 6)$ internally in ratio $2 : 1$.", 3, "$\\tfrac{8 + 1}3$."), ["$3$."]),
    ex(3, mc("vcax-ex-8", "$\\mathbf a, \\mathbf b$ are unit vectors with $\\lvert\\mathbf a + \\mathbf b\\rvert = \\sqrt3$. The angle between them is", ["60°", "$2 + 2\\cos\\theta = 3$."], [["30°", "Solve $\\cos\\theta = \\tfrac12$."], ["90°", "That gives $\\lvert\\mathbf a + \\mathbf b\\rvert = \\sqrt2$."]]), ["$\\cos\\theta = \\tfrac12$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13], [6, 6, 7, 11], [2, 10, 11, 15]] as const;

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
      const b = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
      const v = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      return n(`Find $${v3(a)} \\cdot ${v3(b)}$.`, v, `$${a[0] * b[0]} + ${a[1] * b[1]} + ${a[2] * b[2]} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [x, y, z, m] = r.pick(QUADS);
      const s = [r.pick([1, -1]), r.pick([1, -1]), r.pick([1, -1])];
      const p = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
      const q = [p[0] + s[0] * x, p[1] + s[1] * y, p[2] + s[2] * z];
      return n(`Find the distance between $${v3(p)}$ and $${v3(q)}$.`, m, `$\\sqrt{${x * x} + ${y * y} + ${z * z}} = ${m}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a1 = r.int(-4, 4);
      const a3 = r.int(-4, 4);
      const b = [r.int(-4, 4), r.nonzero(-4, 4), r.int(-4, 4)];
      const lam = -(a1 * b[0] + a3 * b[2]) / b[1];
      return n(`Find $\\lambda$ with $(${a1}, \\lambda, ${a3}) \\perp ${v3(b)}$ (3 decimals).`, Math.round(lam * 1000) / 1000, `$${a1 * b[0]} + ${b[1]}\\lambda + ${a3 * b[2]} = 0$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = [r.nonzero(-4, 4), r.nonzero(-4, 4), r.nonzero(-4, 4)];
      const b = [r.nonzero(-4, 4), r.nonzero(-4, 4), r.nonzero(-4, 4)];
      const prod = a.map((x, i) => x * b[i]);
      const v = prod[0] + prod[1] + prod[2];
      return mcNumbers(
        `$${v3(a)} \\cdot ${v3(b)}$ is`,
        { text: `${v}`, why: "Multiply matching components and add." },
        [{ text: `$${v3(prod)}$`, why: "A dot product is a single number.", misconception: "dot-is-vector" }],
      );
    },
  },
];
