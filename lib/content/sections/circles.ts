import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Circles: standard, general and diameter forms; position of a point; intersection of a line and a circle and the condition for tangency; tangents and normals; length of a tangent; chord of contact; two circles (relative position, common tangents, orthogonality); families of circles. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const sq = (h: number, v: string) => (h === 0 ? `${v}^2` : `(${v} ${h > 0 ? "-" : "+"} ${Math.abs(h)})^2`);

const base: ConceptNode = {
  id: "circles",
  title: "Circles",
  summary: "A circle with centre (h, k) and radius r is (x − h)² + (y − k)² = r². Expanded, it becomes x² + y² + 2gx + 2fy + c = 0, with centre (−g, −f) and radius √(g² + f² − c). A line is a tangent exactly when its distance from the centre equals the radius; it cuts the circle when the distance is smaller and misses it when larger. Two circles are compared the same way, through the distance between their centres.",
  deps: ["straight-lines", "quadratics"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "power of a point", meaning: "$S_1 = x_1^2 + y_1^2 + 2gx_1 + 2fy_1 + c$: negative inside the circle, zero on it, positive outside; $\\sqrt{S_1}$ is the tangent length from outside." },
    { term: "chord of contact", meaning: "The chord joining the two points where tangents from an external point touch the circle." },
    { term: "orthogonal circles", meaning: "Circles meeting at right angles: the tangents at an intersection point are perpendicular." },
  ],
  misconceptions: {
    "circle-centre-sign": "Reads the centre of $x^2 + y^2 + 2gx + 2fy + c = 0$ as $(g, f)$ rather than $(-g, -f)$.",
    "radius-squared": "Takes the radius of $(x - h)^2 + (y - k)^2 = r^2$ to be the right-hand side $r^2$ itself.",
  },
  steps: [
    {
      type: "motivate",
      title: "Every point the same distance away",
      body: "A circle is the locus of points at a fixed distance from a centre, so its equation is the distance formula squared. From that one fact come tangents, chords, and the relative positions of lines and circles, a dependable source of JEE questions where the trick is usually to think about the centre and radius rather than to grind algebra.",
      realWorld: {
        title: "Locating a phone",
        body: "A cell tower measures roughly how far away a phone is, placing it on a circle around the tower. Two towers give two circles, which meet in at most two points; a third settles which one. GPS does the same with spheres around satellites.",
      },
    },
    {
      type: "truth",
      statement: "$(x - h)^2 + (y - k)^2 = r^2$ has centre $(h, k)$ and radius $r$. The **general form** $x^2 + y^2 + 2gx + 2fy + c = 0$ has centre $(-g, -f)$ and radius $\\sqrt{g^2 + f^2 - c}$ (a real circle needs $g^2 + f^2 - c \\ge 0$). **Diameter form**: with ends $(x_1, y_1), (x_2, y_2)$, $(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0$. A line at distance $d$ from the centre is a **secant** if $d < r$, a **tangent** if $d = r$, and misses if $d > r$. The tangent at $(x_1, y_1)$ on the circle is $xx_1 + yy_1 + g(x + x_1) + f(y + y_1) + c = 0$.",
      body: "$y = mx + c$ touches $x^2 + y^2 = a^2$ exactly when $c^2 = a^2(1 + m^2)$, so the tangents of slope $m$ are $y = mx \\pm a\\sqrt{1 + m^2}$. From an outside point the tangent length is $\\sqrt{S_1}$, and the chord of contact is $T = 0$, the same expression as the tangent at a point. **Two circles** with centres $d$ apart and radii $r_1, r_2$: $d > r_1 + r_2$ separate (4 common tangents); $d = r_1 + r_2$ touch externally (3); $\\lvert r_1 - r_2\\rvert < d < r_1 + r_2$ intersect (2); $d = \\lvert r_1 - r_2\\rvert$ touch internally (1); smaller $d$, one inside the other (0). They cut **orthogonally** iff $2g_1g_2 + 2f_1f_2 = c_1 + c_2$. Circles through the intersection of $S = 0$ and a line $L = 0$ are $S + \\lambda L = 0$.",
    },
    {
      type: "predict",
      misconception: "circle-centre-sign",
      item: {
        kind: "mc",
        id: "crc-predict-1",
        prompt: "The centre of $x^2 + y^2 - 4x + 6y - 12 = 0$ is",
        options: [
          { id: "a", text: "$(2, -3)$", correct: true, why: "$2g = -4$, $2f = 6$, centre $(-g, -f)$." },
          { id: "b", text: "$(-2, 3)$", misconception: "circle-centre-sign", why: "The centre is $(-g, -f)$; complete the square to see it." },
          { id: "c", text: "$(-4, 6)$", why: "Halve the coefficients and change sign." },
        ],
      },
      reveal: {
        body: "Complete the squares: $(x^2 - 4x + 4) + (y^2 + 6y + 9) = 12 + 4 + 9$, so $(x - 2)^2 + (y + 3)^2 = 25$. The centre is where both brackets vanish, $(2, -3)$, and the radius is 5. In the general form $2g = -4$ and $2f = 6$, and the centre $(-g, -f)$ carries the opposite signs to the coefficients.",
      },
      resolve: {
        kind: "mc",
        id: "crc-resolve-1",
        prompt: "The centre of $x^2 + y^2 + 8x - 2y + 1 = 0$ is",
        options: [
          { id: "a", text: "$(-4, 1)$", correct: true, why: "$(x + 4)^2 + (y - 1)^2 = 16$." },
          { id: "b", text: "$(4, -1)$", misconception: "circle-centre-sign", why: "Reverse the signs of $g$ and $f$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "crc-check-1",
        prompt: "The radius of $(x - 1)^2 + (y + 2)^2 = 9$ is",
        options: [
          { id: "a", text: "3", correct: true, why: "$r^2 = 9$." },
          { id: "b", text: "9", misconception: "radius-squared", why: "The right-hand side is $r^2$." },
          { id: "c", text: "81", why: "Take the square root, not the square." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "crc-check-2",
        prompt: "The line $3x + 4y = 25$ and the circle $x^2 + y^2 = 25$",
        options: [
          { id: "a", text: "touch: the distance from the centre is $\\tfrac{25}5 = 5 = r$", correct: true, why: "Distance equals radius." },
          { id: "b", text: "meet in two points", why: "That needs a distance less than 5." },
          { id: "c", text: "don't meet", why: "That needs a distance greater than 5." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A $k$-nearest-neighbour query (§{svm-knn-nb}) asks which training points lie within a circle (in higher dimensions, a ball) around the query, and an RBF-kernel SVM's decision boundary around one support vector is a circle. Testing whether a point is inside a circle is exactly the sign of $S_1$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "crc-produce-1", prompt: "Find the radius of $x^2 + y^2 - 6x + 8y = 0$.", answer: 5, explain: "$\\sqrt{9 + 16 - 0}$." },
        { kind: "number", id: "crc-produce-2", prompt: "Find the length of the tangent from $(5, 5)$ to $x^2 + y^2 = 1$, squared.", answer: 49, explain: "$S_1 = 25 + 25 - 1$." },
        {
          kind: "mc",
          id: "crc-produce-3",
          prompt: "$(x + 3)^2 + y^2 = 16$ has radius",
          options: [
            { id: "a", text: "4", correct: true, why: "$\\sqrt{16}$." },
            { id: "b", text: "16", misconception: "radius-squared", why: "16 is $r^2$." },
          ],
        },
        {
          kind: "mc",
          id: "crc-produce-4",
          prompt: "The centre of $x^2 + y^2 + 10x - 4y = 0$ is",
          options: [
            { id: "a", text: "$(-5, 2)$", correct: true, why: "$(-g, -f)$ with $g = 5$, $f = -2$." },
            { id: "b", text: "$(5, -2)$", misconception: "circle-centre-sign", why: "Change the signs of $g$ and $f$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "crc-review-1", prompt: "Find the radius of the circle with centre $(1, 2)$ passing through $(4, 6)$.", answer: 5, explain: "$\\sqrt{9 + 16}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the T, S notation",
      body: "For $S(x, y) = x^2 + y^2 + 2gx + 2fy + c$ and a point $(x_1, y_1)$: $S_1 = S(x_1, y_1)$ and $T = xx_1 + yy_1 + g(x + x_1) + f(y + y_1) + c$. Then the tangent at a point on the circle, the chord of contact from an outside point, and the polar are all $T = 0$; the chord with midpoint $(x_1, y_1)$ is $T = S_1$; the pair of tangents from $(x_1, y_1)$ is $SS_1 = T^2$.",
    },
    {
      type: "definition",
      term: "common chord and radical axis",
      body: "For circles $S_1 = 0$ and $S_2 = 0$ (both with leading coefficients 1), $S_1 - S_2 = 0$ is a straight line: the common chord when they intersect, and in general the radical axis, the locus of points with equal tangent lengths to both.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "condition for tangency",
      statement: "$y = mx + c$ touches $x^2 + y^2 = a^2$ iff $c^2 = a^2(1 + m^2)$.",
      proof: ["The distance from $(0, 0)$ to $mx - y + c = 0$ is $\\dfrac{\\lvert c\\rvert}{\\sqrt{1 + m^2}}$ (§{straight-lines}); set it equal to $a$.", "Equivalently, substituting gives a quadratic in $x$ whose discriminant (§{quadratics}) vanishes exactly then."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "length of a tangent",
      statement: "The tangent from an outside point $P(x_1, y_1)$ to $S = 0$ has length $\\sqrt{S_1}$.",
      proof: ["The tangent is perpendicular to the radius at the point of contact, so by Pythagoras its length squared is $CP^2 - r^2 = (x_1 + g)^2 + (y_1 + f)^2 - (g^2 + f^2 - c) = S_1$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "orthogonal circles",
      statement: "$S_1 = 0$ and $S_2 = 0$ cut at right angles iff $2g_1g_2 + 2f_1f_2 = c_1 + c_2$.",
      proof: ["At an intersection the radii are perpendicular, so $d^2 = r_1^2 + r_2^2$.", "Expand: $(g_1 - g_2)^2 + (f_1 - f_2)^2 = g_1^2 + f_1^2 - c_1 + g_2^2 + f_2^2 - c_2$, which simplifies to the condition."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the centre and radius of $x^2 + y^2 - 4x + 6y - 12 = 0$.",
      solution: ["$g = -2$, $f = 3$, $c = -12$: centre $(2, -3)$.", "$r = \\sqrt{4 + 9 + 12} = 5$."],
      result: "Centre $(2, -3)$, radius 5.",
    },
    {
      type: "example",
      level: 2,
      title: "tangents of given slope",
      problem: "Find the tangents to $x^2 + y^2 = 9$ parallel to $y = 2x$.",
      solution: ["Slope 2: $c^2 = 9(1 + 4) = 45$, so $c = \\pm3\\sqrt5$.", "$y = 2x \\pm 3\\sqrt5$."],
      result: "$y = 2x \\pm 3\\sqrt5$.",
    },
    {
      type: "example",
      level: 3,
      title: "two circles",
      problem: "How many common tangents do $x^2 + y^2 = 4$ and $(x - 3)^2 + (y - 4)^2 = 9$ have?",
      solution: ["$d = 5$, $r_1 + r_2 = 2 + 3 = 5$.", "$d = r_1 + r_2$: they touch externally, so there are 3 common tangents."],
      result: "3.",
    },
  ],
  pitfalls: [
    { wrong: "Centre of $x^2 + y^2 + 2gx + 2fy + c = 0$ is $(g, f)$.", right: "It is $(-g, -f)$." },
    { wrong: "Radius of $(x - h)^2 + (y - k)^2 = 9$ is 9.", right: "The right side is $r^2$: $r = 3$." },
    { wrong: "Use the general-form formulas when $x^2, y^2$ have coefficient $\\ne 1$.", right: "Divide through first so both coefficients are 1." },
  ],
  formulas: [
    { label: "Centre, radius", tex: "(-g, -f),\\ \\sqrt{g^2 + f^2 - c}" },
    { label: "Tangent at a point", tex: "xx_1 + yy_1 + g(x + x_1) + f(y + y_1) + c = 0" },
    { label: "Tangency", tex: "c^2 = a^2(1 + m^2)" },
    { label: "Tangent length", tex: "\\sqrt{S_1}" },
    { label: "Orthogonal", tex: "2g_1g_2 + 2f_1f_2 = c_1 + c_2" },
  ],
  exercises: [
    ex(1, num("crcx-ex-1", "Find the radius of $x^2 + y^2 + 2x - 4y - 4 = 0$.", 3, "$\\sqrt{1 + 4 + 4}$."), ["$3$."]),
    ex(1, num("crcx-ex-2", "Find $S_1$ for the point $(1, 1)$ and $x^2 + y^2 - 4 = 0$. Is the point inside?", -2, "$1 + 1 - 4$."), ["$-2 < 0$: inside."]),
    ex(2, dp("crcx-ex-3", "Find the length of the tangent from $(4, 3)$ to $x^2 + y^2 - 2x - 4 = 0$.", Math.sqrt(16 + 9 - 8 - 4), "$\\sqrt{S_1}$."), ["$S_1 = 13$, so $\\sqrt{13} \\approx 3.606$."]),
    ex(2, num("crcx-ex-4", "For which $c > 0$ does $y = x + c$ touch $x^2 + y^2 = 8$?", 4, "$c^2 = 8 \\times 2$."), ["$c = 4$."]),
    ex(2, num("crcx-ex-5", "How many common tangents do $x^2 + y^2 = 4$ and $(x - 3)^2 + (y - 4)^2 = 9$ have?", 3, "They touch externally."), ["$3$."]),
    ex(3, num("crcx-ex-6", "Find the length of the chord cut by $x + y = 2$ on $x^2 + y^2 = 4$, squared.", 8, "$d = \\sqrt2$, half-chord $\\sqrt{4 - 2}$."), ["Chord $2\\sqrt2$, squared 8."]),
    ex(3, num("crcx-ex-7", "For which $k$ do $x^2 + y^2 + 2x + 2y + k = 0$ and $x^2 + y^2 - 4x + 2y + 3 = 0$ cut orthogonally?", -5, "$2(1)(-2) + 2(1)(1) = k + 3$."), ["$2g_1g_2 + 2f_1f_2 = 2(1)(-2) + 2(1)(1) = -2$.", "$-2 = k + 3$, so $k = -5$."]),
    ex(3, mc("crcx-ex-8", "The circle on the segment from $(1, 2)$ to $(5, 6)$ as diameter is", ["$(x - 1)(x - 5) + (y - 2)(y - 6) = 0$", "The diameter form."], [["$(x - 3)^2 + (y - 4)^2 = 32$", "The radius is half the diameter: $r^2 = 8$."], ["$(x + 1)(x + 5) + (y + 2)(y + 6) = 0$", "Signs: the brackets vanish at the ends."]]), ["Centre $(3, 4)$, $r^2 = 8$: the same circle."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const h = r.int(-6, 6);
      const k = r.int(-6, 6);
      const rad = r.int(1, 9);
      const c = h * h + k * k - rad * rad;
      const want = r.pick(["r", "h", "k"] as const);
      const lin = (co: number, v: string) => (co === 0 ? "" : ` ${co > 0 ? "+" : "-"} ${Math.abs(co)}${v}`);
      const eq = `x^2 + y^2${lin(-2 * h, "x")}${lin(-2 * k, "y")}${c === 0 ? "" : ` ${c > 0 ? "+" : "-"} ${Math.abs(c)}`} = 0`;
      const v = want === "r" ? rad : want === "h" ? h : k;
      return n(`For the circle $${eq}$, find ${want === "r" ? "the radius" : `the ${want === "h" ? "x" : "y"}-coordinate of the centre`}.`, v, `Centre $(-g, -f) = (${h}, ${k})$, radius $\\sqrt{g^2 + f^2 - c} = ${rad}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const h = r.int(-4, 4);
      const k = r.int(-4, 4);
      const rad = r.int(1, 5);
      const x1 = h + r.pick([-1, 1]) * r.int(rad + 1, rad + 5);
      const y1 = k + r.int(-5, 5);
      const s1 = (x1 - h) ** 2 + (y1 - k) ** 2 - rad * rad;
      return n(`Find the square of the length of the tangent from $(${x1}, ${y1})$ to $${sq(h, "x")} + ${sq(k, "y")} = ${rad * rad}$.`, s1, `$S_1 = (${x1 - h})^2 + (${y1 - k})^2 - ${rad * rad} = ${s1}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const r1 = r.int(1, 6);
      const r2 = r.int(1, 6);
      const [dx, dy] = r.pick([[3, 4], [0, 5], [6, 8], [5, 12], [0, 3], [4, 0], [1, 0], [0, 10]] as const);
      const d = Math.hypot(dx, dy);
      const count = d > r1 + r2 ? 4 : d === r1 + r2 ? 3 : d > Math.abs(r1 - r2) ? 2 : d === Math.abs(r1 - r2) ? 1 : 0;
      return n(`How many common tangents do $x^2 + y^2 = ${r1 * r1}$ and $${sq(dx, "x")} + ${sq(dy, "y")} = ${r2 * r2}$ have?`, count, `$d = ${d}$, $r_1 + r_2 = ${r1 + r2}$, $\\lvert r_1 - r_2\\rvert = ${Math.abs(r1 - r2)}$: ${count} common tangents.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const h = r.nonzero(-5, 5);
      const k = r.nonzero(-5, 5);
      const lin = (co: number, v: string) => ` ${co > 0 ? "+" : "-"} ${Math.abs(co)}${v}`;
      return mcNumbers(
        `The centre of $x^2 + y^2${lin(-2 * h, "x")}${lin(-2 * k, "y")} - 1 = 0$ is`,
        { text: `$(${h}, ${k})$`, why: "$(-g, -f)$: the opposite signs to the coefficients, halved." },
        [{ text: `$(${-h}, ${-k})$`, why: "The centre has the opposite signs to $g$ and $f$.", misconception: "circle-centre-sign" }, { text: `$(${-2 * h}, ${-2 * k})$`, why: "Halve the coefficients." }],
      );
    },
  },
];
