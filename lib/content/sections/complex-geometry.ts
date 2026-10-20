import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Geometry in the complex plane: distance, section formula, rotation by multiplication, collinearity and perpendicularity, standard loci (circles, perpendicular bisectors, ellipses, arcs), triangles and equilateral conditions, extreme values of |z| on a locus. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "complex-geometry",
  title: "Geometry with complex numbers",
  summary: "Points in the plane are complex numbers, so geometry becomes algebra. The distance between z₁ and z₂ is |z₁ − z₂|; rotating a point about another by θ multiplies their difference by e^{iθ}. Equations in |z| describe curves: |z − a| = r is a circle, |z − a| = |z − b| the perpendicular bisector of ab. Greatest and least values of |z| on a curve follow from the triangle inequality.",
  deps: ["roots-of-unity"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "locus", meaning: "The set of points satisfying a condition, such as $\\lvert z - 2\\rvert = 3$." },
    { term: "rotation", meaning: "Turning $z$ about $a$ by $\\theta$: $z' - a = (z - a)e^{i\\theta}$." },
    { term: "collinear", meaning: "Lying on one line: $z_1, z_2, z_3$ are collinear iff $\\dfrac{z_3 - z_1}{z_2 - z_1}$ is real." },
  ],
  misconceptions: {
    "locus-line-circle": "Reads $\\lvert z - a\\rvert = \\lvert z - b\\rvert$ as a circle rather than a straight line.",
    "rotation-add": "Rotates a complex number by adding the angle to it, rather than multiplying by $e^{i\\theta}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Algebra that draws pictures",
      body: "Where are the points equidistant from $1$ and $i$? What do you get by turning a square's corner a quarter turn about its neighbour? Such questions are awkward with coordinates but short with complex numbers, because distance is a modulus and rotation is a multiplication.",
      realWorld: {
        title: "Computer graphics",
        body: "2D game engines rotate sprites by multiplying their coordinates by $\\cos\\theta + i\\sin\\theta$ (or the equivalent matrix). Composing rotations is multiplying unit complex numbers, cheaper and more stable than repeatedly recomputing angles.",
      },
    },
    {
      type: "truth",
      statement: "Distance: $\\lvert z_1 - z_2\\rvert$. The point dividing $z_1z_2$ in ratio $m : n$ is $\\dfrac{mz_2 + nz_1}{m + n}$. **Rotation**: if $z_3$ is obtained by turning $z_2$ about $z_1$ through $\\theta$, then $z_3 - z_1 = (z_2 - z_1)e^{i\\theta}$; more generally $\\dfrac{z_3 - z_1}{z_2 - z_1} = \\dfrac{\\lvert z_3 - z_1\\rvert}{\\lvert z_2 - z_1\\rvert}e^{i\\theta}$ where $\\theta$ is the angle from $z_1z_2$ to $z_1z_3$. **Loci**: $\\lvert z - a\\rvert = r$ is a circle; $\\lvert z - a\\rvert = \\lvert z - b\\rvert$ the perpendicular bisector of $a$ and $b$; $\\lvert z - a\\rvert + \\lvert z - b\\rvert = 2k > \\lvert a - b\\rvert$ an ellipse with foci $a, b$.",
      body: "Collinear: $\\dfrac{z_3 - z_1}{z_2 - z_1}$ real. Perpendicular: purely imaginary. Equilateral triangle: $z_1^2 + z_2^2 + z_3^2 = z_1z_2 + z_2z_3 + z_3z_1$. $\\arg\\dfrac{z - a}{z - b} = \\theta$ is an arc of a circle through $a$ and $b$ (angles in the same segment, §{plane-geometry}). On the circle $\\lvert z - c\\rvert = r$, $\\lvert z\\rvert$ ranges between $\\big\\lvert\\lvert c\\rvert - r\\big\\rvert$ and $\\lvert c\\rvert + r$ by the triangle inequality (§{complex-algebra}). The area of the triangle $0, z, iz$ is $\\tfrac12\\lvert z\\rvert^2$.",
    },
    {
      type: "predict",
      misconception: "locus-line-circle",
      item: {
        kind: "mc",
        id: "cxg-predict-1",
        prompt: "The locus $\\lvert z - 1\\rvert = \\lvert z - i\\rvert$ is",
        options: [
          { id: "a", text: "the line $y = x$", correct: true, why: "Points equidistant from $(1, 0)$ and $(0, 1)$: their perpendicular bisector." },
          { id: "b", text: "a circle through 1 and $i$", misconception: "locus-line-circle", why: "Equal distances to two points define a line, not a circle." },
          { id: "c", text: "the single point $\\tfrac{1 + i}2$", why: "Every point on the bisector qualifies." },
        ],
      },
      reveal: {
        body: "With $z = x + iy$: $(x - 1)^2 + y^2 = x^2 + (y - 1)^2$ simplifies to $-2x = -2y$, the line $y = x$. Geometrically, points equally far from two fixed points form their perpendicular bisector. A circle needs a fixed distance from one point, $\\lvert z - a\\rvert = r$, or a fixed ratio of distances $\\lvert z - a\\rvert = k\\lvert z - b\\rvert$ with $k \\ne 1$.",
      },
      resolve: {
        kind: "mc",
        id: "cxg-resolve-1",
        prompt: "$\\lvert z + 2\\rvert = \\lvert z - 4\\rvert$ describes",
        options: [
          { id: "a", text: "the vertical line $\\operatorname{Re}z = 1$", correct: true, why: "The perpendicular bisector of $-2$ and $4$." },
          { id: "b", text: "a circle", misconception: "locus-line-circle", why: "Equal distances give a line." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cxg-check-1",
        prompt: "Rotating $z = 2 + i$ by $90°$ anticlockwise about the origin gives",
        options: [
          { id: "a", text: "$-1 + 2i$", correct: true, why: "$i(2 + i) = 2i - 1$." },
          { id: "b", text: "$2 + i + 90$", misconception: "rotation-add", why: "Rotation multiplies by $e^{i\\theta}$." },
          { id: "c", text: "$1 - 2i$", why: "That is a clockwise turn followed by a reflection." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cxg-check-2",
        prompt: "$\\lvert z - 3 - 4i\\rvert = 2$. The greatest value of $\\lvert z\\rvert$ is",
        options: [
          { id: "a", text: "7", correct: true, why: "Centre at distance 5 from 0, plus radius 2." },
          { id: "b", text: "5", why: "That is the centre's distance." },
          { id: "c", text: "3", why: "That is the least value." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Data augmentation for images rotates and reflects inputs, and some networks are built to be equivariant to rotations, treating 2D feature vectors as complex numbers so that a rotation of the input becomes multiplication by $e^{i\\theta}$ inside the network.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cxg-produce-1", prompt: "Find the distance between $1 + 2i$ and $4 + 6i$.", answer: 5, explain: "$\\lvert 3 + 4i\\rvert$." },
        { kind: "number", id: "cxg-produce-2", prompt: "Rotate $3$ about $1$ by $90°$ anticlockwise. Find the imaginary part of the image.", answer: 2, explain: "$1 + i(3 - 1) = 1 + 2i$." },
        {
          kind: "mc",
          id: "cxg-produce-3",
          prompt: "$\\lvert z - 2i\\rvert = \\lvert z + 2i\\rvert$ is",
          options: [
            { id: "a", text: "the real axis", correct: true, why: "Perpendicular bisector of $2i$ and $-2i$." },
            { id: "b", text: "a circle of radius 2", misconception: "locus-line-circle", why: "Equal distances to two points give a line." },
          ],
        },
        {
          kind: "mc",
          id: "cxg-produce-4",
          prompt: "To rotate $z$ by $60°$ about the origin, compute",
          options: [
            { id: "a", text: "$ze^{i\\pi/3}$", correct: true, why: "Multiplication by a unit complex number." },
            { id: "b", text: "$z + \\tfrac\\pi3$", misconception: "rotation-add", why: "Adding translates; it doesn't rotate." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cxg-review-1", prompt: "Find the radius of the circle $\\lvert z - 3 + 4i\\rvert = 5$.", answer: 5, explain: "$\\lvert z - c\\rvert = r$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "standard loci",
      body: "$\\lvert z - a\\rvert = r$: circle, centre $a$, radius $r$. $\\lvert z - a\\rvert = \\lvert z - b\\rvert$: perpendicular bisector of $ab$. $\\lvert z - a\\rvert = k\\lvert z - b\\rvert$, $k \\ne 1$: a circle (of Apollonius). $\\lvert z - a\\rvert + \\lvert z - b\\rvert = 2c$: ellipse if $2c > \\lvert a - b\\rvert$, the segment if equal, empty if less. $\\lvert\\lvert z - a\\rvert - \\lvert z - b\\rvert\\rvert = 2c < \\lvert a - b\\rvert$: hyperbola. $\\arg(z - a) = \\theta$: a ray from $a$.",
    },
    {
      type: "definition",
      term: "triangles",
      body: "Centroid $\\tfrac{z_1 + z_2 + z_3}{3}$. Area $\\tfrac12\\lvert\\operatorname{Im}((z_2 - z_1)\\overline{(z_3 - z_1)})\\rvert$. Equilateral iff $z_1^2 + z_2^2 + z_3^2 = z_1z_2 + z_2z_3 + z_3z_1$, equivalently $z_1 + \\omega z_2 + \\omega^2z_3 = 0$ for one orientation (§{roots-of-unity}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "rotation about a point",
      statement: "Turning $z$ about $a$ through $\\theta$ anticlockwise gives $a + (z - a)e^{i\\theta}$.",
      proof: ["Translate $a$ to the origin ($z - a$), rotate (multiply by $e^{i\\theta}$, which adds $\\theta$ to the argument and keeps the modulus), translate back (§{complex-polar})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "collinearity and perpendicularity",
      statement: "$z_1, z_2, z_3$ are collinear iff $\\dfrac{z_3 - z_1}{z_2 - z_1} \\in \\mathbb R$; the lines $z_1z_2$ and $z_1z_3$ are perpendicular iff the ratio is purely imaginary.",
      proof: ["The argument of the ratio is the angle between the two directions: 0 or $\\pi$ for collinear points, $\\pm\\tfrac\\pi2$ for perpendicular lines."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "extreme moduli on a circle",
      statement: "On $\\lvert z - c\\rvert = r$: $\\max\\lvert z\\rvert = \\lvert c\\rvert + r$ and $\\min\\lvert z\\rvert = \\big\\lvert\\lvert c\\rvert - r\\big\\rvert$.",
      proof: ["$\\lvert z\\rvert = \\lvert c + (z - c)\\rvert$ lies between $\\lvert\\lvert c\\rvert - r\\rvert$ and $\\lvert c\\rvert + r$; both are attained on the line through 0 and $c$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the locus $\\lvert z - 1\\rvert = \\lvert z + i\\rvert$.",
      solution: ["$(x - 1)^2 + y^2 = x^2 + (y + 1)^2$.", "$-2x = 2y$: the line $y = -x$."],
      result: "$y = -x$.",
    },
    {
      type: "example",
      level: 2,
      title: "completing a square",
      problem: "Two adjacent vertices of a square are $1$ and $3 + i$. Find the other two (on the anticlockwise side).",
      solution: ["Side $3 + i - 1 = 2 + i$; turning it by $90°$ gives $i(2 + i) = -1 + 2i$.", "Vertices $3 + i + (-1 + 2i) = 2 + 3i$ and $1 + (-1 + 2i) = 2i$."],
      result: "$2 + 3i$ and $2i$.",
    },
    {
      type: "example",
      level: 3,
      title: "extreme values",
      problem: "If $\\lvert z - 3 - 4i\\rvert = 2$, find the least and greatest $\\lvert z\\rvert$.",
      solution: ["Centre $3 + 4i$ at distance 5 from the origin; radius 2.", "Least $5 - 2 = 3$, greatest $5 + 2 = 7$."],
      result: "3 and 7.",
    },
  ],
  pitfalls: [
    { wrong: "$\\lvert z - a\\rvert = \\lvert z - b\\rvert$ is a circle.", right: "It is the perpendicular bisector of $a$ and $b$." },
    { wrong: "Rotate by adding an angle to $z$.", right: "Multiply $(z - a)$ by $e^{i\\theta}$." },
    { wrong: "Rotate about a point other than 0 without translating.", right: "Subtract the centre, rotate, add it back." },
  ],
  formulas: [
    { label: "Distance", tex: "\\lvert z_1 - z_2\\rvert" },
    { label: "Rotation", tex: "z' = a + (z - a)e^{i\\theta}" },
    { label: "Circle", tex: "\\lvert z - a\\rvert = r" },
    { label: "Bisector", tex: "\\lvert z - a\\rvert = \\lvert z - b\\rvert" },
  ],
  exercises: [
    ex(1, num("cxgx-ex-1", "Find the distance between $-2 + i$ and $1 + 5i$.", 5, "$\\lvert 3 + 4i\\rvert$."), ["$5$."]),
    ex(1, num("cxgx-ex-2", "Rotate $1 + i$ by $90°$ anticlockwise about 0. Find the real part of the image.", -1, "$i(1 + i) = -1 + i$."), ["$-1$."]),
    ex(2, num("cxgx-ex-3", "$\\lvert z\\rvert = 2$. Find the area of the triangle with vertices $0$, $z$ and $iz$.", 2, "$\\tfrac12\\lvert z\\rvert^2$."), ["$2$: a right isosceles triangle with legs 2."]),
    ex(2, num("cxgx-ex-4", "Find the least value of $\\lvert z\\rvert$ if $\\lvert z - 6 - 8i\\rvert = 4$.", 6, "$10 - 4$."), ["$6$."]),
    ex(2, num("cxgx-ex-5", "Find the midpoint of $2 + 6i$ and $4 - 2i$, and give its imaginary part.", 2, "$\\tfrac{6 + 4i}{2}$."), ["$3 + 2i$."]),
    ex(3, dp("cxgx-ex-6", "Rotate $2$ about $1 + i$ by $90°$ anticlockwise. Find the real part of the image.", 2, "$1 + i + i(1 - i)$."), ["$1 + i + (i + 1) = 2 + 2i$: real part 2."]),
    ex(3, num("cxgx-ex-7", "Two vertices of an equilateral triangle are $0$ and $2$. The third, above the real axis, is $1 + bi$. Find $b^2$.", 3, "Rotate 2 by $60°$."), ["$2e^{i\\pi/3} = 1 + \\sqrt3i$: $b^2 = 3$."]),
    ex(3, mc("cxgx-ex-8", "$\\lvert z - 2\\rvert + \\lvert z + 2\\rvert = 10$ is", ["an ellipse with foci $\\pm2$", "Sum of distances to two foci is constant and exceeds 4."], [["a circle of radius 5", "That would be $\\lvert z\\rvert = 5$."], ["a hyperbola", "A hyperbola fixes the difference of distances."]]), ["Semi-major axis 5."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const cx = (a: number, b: number) => (b === 0 ? `${a}` : a === 0 ? `${b === 1 ? "" : b === -1 ? "-" : b}i` : `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [dx, dy, d] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [-3, 4, 5], [4, -3, 5]] as const);
      const a = r.int(-5, 5);
      const b = r.int(-5, 5);
      return n(`Find the distance between $${cx(a, b)}$ and $${cx(a + dx, b + dy)}$.`, d, `$\\lvert ${cx(dx, dy)}\\rvert = ${d}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [p, q] = [r.int(-5, 5), r.nonzero(-5, 5)];
      const ang = r.pick([90, 180, 270] as const);
      const [rp, rq] = ang === 90 ? [-q, p] : ang === 180 ? [-p, -q] : [q, -p];
      const want = r.pick(["Re", "Im"] as const);
      return n(`Rotate $${cx(p, q)}$ by $${ang}°$ anticlockwise about the origin. Find the ${want === "Re" ? "real" : "imaginary"} part of the image.`, want === "Re" ? rp : rq, `Multiply by $${ang === 90 ? "i" : ang === 180 ? "-1" : "-i"}$: $${cx(rp, rq)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]] as const);
      const rad_ = r.int(1, c - 1);
      const want = r.pick(["greatest", "least"] as const);
      return n(`$\\lvert z - (${cx(a, b)})\\rvert = ${rad_}$. Find the ${want} value of $\\lvert z\\rvert$.`, want === "greatest" ? c + rad_ : c - rad_, `The centre is ${c} from the origin; ${want === "greatest" ? `$${c} + ${rad_}$` : `$${c} - ${rad_}$`}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b, desc] = r.pick([["1", "-1", "the imaginary axis"], ["2i", "-2i", "the real axis"], ["1", "i", "the line $y = x$"], ["3", "-1", "the line $\\operatorname{Re}z = 1$"]] as const);
      return mcNumbers(
        `The locus $\\lvert z - ${a}\\rvert = \\lvert z - (${b})\\rvert$ is`,
        { text: desc, why: "The perpendicular bisector of the two points." },
        [{ text: "a circle", why: "Equal distances to two points give a line.", misconception: "locus-line-circle" }],
      );
    },
  },
];
