import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The ellipse x²/a² + y²/b² = 1: axes, vertices, foci, eccentricity, directrices, latus rectum; the focal-sum property and focal distances; ellipses with the major axis vertical; parametric form and auxiliary circle; tangents (point and slope forms), director circle; normals; area. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "ellipse",
  title: "The ellipse",
  summary: "An ellipse is the set of points whose distances to two foci add up to a constant 2a. In standard position, x²/a² + y²/b² = 1 with a > b, the foci are at (±c, 0) where c² = a² − b², and the eccentricity e = c/a lies between 0 and 1. The major axis has length 2a and the minor axis 2b. Points are (a cos θ, b sin θ), and the tangent of slope m is y = mx ± √(a²m² + b²).",
  deps: ["circles"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "major and minor axes", meaning: "The longest and shortest diameters, of lengths $2a$ and $2b$; $a$ and $b$ are the semi-axes." },
    { term: "auxiliary circle", meaning: "$x^2 + y^2 = a^2$, the circle on the major axis; the eccentric angle $\\theta$ of $(a\\cos\\theta, b\\sin\\theta)$ is measured on it." },
    { term: "director circle", meaning: "$x^2 + y^2 = a^2 + b^2$, the locus of points from which the two tangents are perpendicular." },
  ],
  misconceptions: {
    "ellipse-c-sum": "Computes the focal distance of an ellipse as $c = \\sqrt{a^2 + b^2}$, the hyperbola's relation, instead of $\\sqrt{a^2 - b^2}$.",
    "ellipse-axis-length": "Takes the length of the major (or minor) axis to be $a$ (or $b$) rather than $2a$ (or $2b$).",
  },
  steps: [
    {
      type: "motivate",
      title: "Two pins and a loop of string",
      body: "Push two pins into a board, loop a string around them and trace with a pencil keeping the string taut: the curve is an ellipse, because the two distances to the pins always add to the same length. Planets move on ellipses with the Sun at one focus. In JEE the work is mostly bookkeeping between $a$, $b$, $c$ and $e$, and the one relation that ties them.",
      realWorld: {
        title: "Kepler's first law",
        body: "Earth's orbit is an ellipse with eccentricity about 0.017, nearly a circle; Halley's comet has eccentricity about 0.97, a long thin ellipse. The Sun sits at a focus, not the centre, so the distance varies between $a(1 - e)$ and $a(1 + e)$.",
      },
    },
    {
      type: "truth",
      statement: "$\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ with $a > b > 0$: vertices $(\\pm a, 0)$, major axis $2a$, minor axis $2b$, foci $(\\pm c, 0)$ with $c^2 = a^2 - b^2$, eccentricity $e = \\dfrac ca < 1$ (so $b^2 = a^2(1 - e^2)$), directrices $x = \\pm\\dfrac ae$, latus rectum $\\dfrac{2b^2}a$. For every point $P$, $PS + PS' = 2a$, with focal distances $a - ex$ and $a + ex$. If $b > a$ the major axis is vertical: swap the roles, $c^2 = b^2 - a^2$, foci $(0, \\pm c)$.",
      body: "**Parametric** form $(a\\cos\\theta, b\\sin\\theta)$. **Tangents**: at $(x_1, y_1)$, $\\dfrac{xx_1}{a^2} + \\dfrac{yy_1}{b^2} = 1$; of slope $m$, $y = mx \\pm \\sqrt{a^2m^2 + b^2}$, so $y = mx + c$ touches iff $c^2 = a^2m^2 + b^2$. **Normal** at $(x_1, y_1)$: $\\dfrac{a^2x}{x_1} - \\dfrac{b^2y}{y_1} = a^2 - b^2$. Area $\\pi ab$. The ellipse is the circle $x^2 + y^2 = a^2$ squashed vertically by the factor $b/a$, which explains the area and the parametric form at once. Compare the hyperbola, where the relation becomes $c^2 = a^2 + b^2$ (§{hyperbola}).",
    },
    {
      type: "predict",
      misconception: "ellipse-c-sum",
      item: {
        kind: "mc",
        id: "elp-predict-1",
        prompt: "The foci of $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$ are",
        options: [
          { id: "a", text: "$(\\pm4, 0)$", correct: true, why: "$c^2 = 25 - 9 = 16$." },
          { id: "b", text: "$(\\pm\\sqrt{34}, 0)$", misconception: "ellipse-c-sum", why: "For an ellipse the foci are inside it: $c^2 = a^2 - b^2$." },
          { id: "c", text: "$(\\pm5, 0)$", why: "Those are the vertices." },
        ],
      },
      reveal: {
        body: "The foci lie inside the ellipse, so $c < a$. The endpoint $(0, b)$ of the minor axis is at distance $a$ from each focus (the two distances add to $2a$ and are equal), so $b^2 + c^2 = a^2$: $c^2 = 25 - 9 = 16$, $c = 4$. With $c = \\sqrt{34} > 5$ the \"foci\" would lie outside the curve.",
      },
      resolve: {
        kind: "mc",
        id: "elp-resolve-1",
        prompt: "For $\\dfrac{x^2}{169} + \\dfrac{y^2}{25} = 1$, $c$ equals",
        options: [
          { id: "a", text: "12", correct: true, why: "$\\sqrt{169 - 25}$." },
          { id: "b", text: "$\\sqrt{194}$", misconception: "ellipse-c-sum", why: "Subtract: $c^2 = a^2 - b^2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "elp-check-1",
        prompt: "The major axis of $\\dfrac{x^2}{16} + \\dfrac{y^2}9 = 1$ has length",
        options: [
          { id: "a", text: "8", correct: true, why: "$2a = 2 \\times 4$." },
          { id: "b", text: "4", misconception: "ellipse-axis-length", why: "$a = 4$ is the semi-major axis." },
          { id: "c", text: "6", why: "That is the minor axis." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "elp-check-2",
        prompt: "The eccentricity of $\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$ is",
        options: [
          { id: "a", text: "$\\tfrac35$", correct: true, why: "$c = 3$, $e = c/a$." },
          { id: "b", text: "$\\tfrac45$", why: "That is $b/a$." },
          { id: "c", text: "$\\tfrac{\\sqrt{41}}5$", why: "An ellipse has $e < 1$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The contours of a two-dimensional normal density are ellipses whose axes are the eigenvectors of the covariance matrix and whose semi-axes scale with the square roots of its eigenvalues (§{pca}); Mahalanobis distance (§{mahalanobis}) measures distance in units of those ellipses.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "elp-produce-1", prompt: "Find the length of the latus rectum of $\\dfrac{x^2}{16} + \\dfrac{y^2}4 = 1$.", answer: 2, explain: "$\\dfrac{2b^2}a = \\dfrac84$." },
        { kind: "number", id: "elp-produce-2", prompt: "$P$ is on $\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$ with foci $S, S'$. Find $PS + PS'$.", answer: 10, explain: "$2a$." },
        {
          kind: "mc",
          id: "elp-produce-3",
          prompt: "The foci of $\\dfrac{x^2}{36} + \\dfrac{y^2}{20} = 1$ are",
          options: [
            { id: "a", text: "$(\\pm4, 0)$", correct: true, why: "$c^2 = 36 - 20$." },
            { id: "b", text: "$(\\pm\\sqrt{56}, 0)$", misconception: "ellipse-c-sum", why: "Subtract for an ellipse." },
          ],
        },
        {
          kind: "mc",
          id: "elp-produce-4",
          prompt: "The minor axis of $\\dfrac{x^2}9 + \\dfrac{y^2}{49} = 1$ has length",
          options: [
            { id: "a", text: "6", correct: true, why: "The major axis is vertical; the minor axis is $2 \\times 3$." },
            { id: "b", text: "3", misconception: "ellipse-axis-length", why: "3 is the semi-minor axis." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "elp-review-1", prompt: "An ellipse has $a = 5$ and $c = 3$. Find $b^2$.", answer: 16, explain: "$25 - 9$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "focal distances",
      body: "For $P(x, y)$ on the ellipse, $PS = e \\cdot PM = e\\left(\\dfrac ae - x\\right) = a - ex$ to the focus $(ae, 0)$, and $PS' = a + ex$. Adding gives $2a$. Nearest and farthest points from a focus are the vertices, at $a(1 - e)$ and $a(1 + e)$.",
    },
    {
      type: "definition",
      term: "ellipses not at the origin",
      body: "$\\dfrac{(x - h)^2}{a^2} + \\dfrac{(y - k)^2}{b^2} = 1$ has centre $(h, k)$; shift every point and line accordingly. To read one off a quadratic like $4x^2 + 9y^2 - 16x + 18y - 11 = 0$, complete both squares: $4(x - 2)^2 + 9(y + 1)^2 = 36$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the focal sum",
      statement: "Every point of $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ has $PS + PS' = 2a$.",
      proof: ["$PS^2 = (x - c)^2 + y^2 = x^2 - 2cx + c^2 + b^2 - \\dfrac{b^2x^2}{a^2} = \\left(a - \\dfrac{cx}a\\right)^2$, using $b^2 + c^2 = a^2$.", "So $PS = a - ex$ (positive since $\\lvert x\\rvert \\le a$), and likewise $PS' = a + ex$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "tangent of given slope",
      statement: "$y = mx + c$ touches the ellipse iff $c^2 = a^2m^2 + b^2$.",
      proof: ["Substitute into $b^2x^2 + a^2y^2 = a^2b^2$: $(b^2 + a^2m^2)x^2 + 2a^2mcx + a^2(c^2 - b^2) = 0$.", "The discriminant $4a^4m^2c^2 - 4a^2(b^2 + a^2m^2)(c^2 - b^2)$ simplifies to $4a^2b^2(a^2m^2 + b^2 - c^2)$, zero exactly then."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "director circle",
      statement: "Perpendicular tangents to the ellipse meet on $x^2 + y^2 = a^2 + b^2$.",
      proof: ["A tangent through $(h, k)$ with slope $m$ needs $(k - mh)^2 = a^2m^2 + b^2$, a quadratic in $m$: $(h^2 - a^2)m^2 - 2hkm + k^2 - b^2 = 0$.", "Perpendicular means the product of roots is $-1$: $\\dfrac{k^2 - b^2}{h^2 - a^2} = -1$, so $h^2 + k^2 = a^2 + b^2$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "For $\\dfrac{x^2}{25} + \\dfrac{y^2}9 = 1$ find $e$, the foci, the directrices and the latus rectum.",
      solution: ["$a = 5$, $b = 3$, $c = 4$, $e = \\tfrac45$; foci $(\\pm4, 0)$.", "Directrices $x = \\pm\\dfrac ae = \\pm\\dfrac{25}4$; latus rectum $\\dfrac{2 \\times 9}5 = \\dfrac{18}5$."],
      result: "$e = \\tfrac45$, $(\\pm4, 0)$, $x = \\pm\\tfrac{25}4$, $\\tfrac{18}5$.",
    },
    {
      type: "example",
      level: 2,
      title: "from foci and eccentricity",
      problem: "Find the ellipse with foci $(\\pm3, 0)$ and eccentricity $\\tfrac12$.",
      solution: ["$c = ae = 3$ with $e = \\tfrac12$, so $a = 6$.", "$b^2 = a^2 - c^2 = 36 - 9 = 27$: $\\dfrac{x^2}{36} + \\dfrac{y^2}{27} = 1$."],
      result: "$\\dfrac{x^2}{36} + \\dfrac{y^2}{27} = 1$.",
    },
    {
      type: "example",
      level: 3,
      title: "tangents of given slope",
      problem: "Find the tangents to $\\dfrac{x^2}{16} + \\dfrac{y^2}9 = 1$ with slope 1.",
      solution: ["$c^2 = a^2m^2 + b^2 = 16 + 9 = 25$.", "$y = x \\pm 5$."],
      result: "$y = x \\pm 5$.",
    },
  ],
  pitfalls: [
    { wrong: "$c^2 = a^2 + b^2$ for an ellipse.", right: "$c^2 = a^2 - b^2$; the plus sign belongs to the hyperbola." },
    { wrong: "The major axis has length $a$.", right: "It is $2a$; $a$ is the semi-major axis." },
    { wrong: "Assume the major axis is along $x$.", right: "Compare the denominators: the larger one marks the major axis." },
  ],
  formulas: [
    { label: "Foci", tex: "c^2 = a^2 - b^2,\\ e = c/a < 1" },
    { label: "Latus rectum", tex: "2b^2/a" },
    { label: "Focal sum", tex: "PS + PS' = 2a" },
    { label: "Tangent", tex: "y = mx \\pm \\sqrt{a^2m^2 + b^2}" },
    { label: "Area", tex: "\\pi ab" },
  ],
  exercises: [
    ex(1, num("elpx-ex-1", "Find the eccentricity of $\\dfrac{x^2}{100} + \\dfrac{y^2}{64} = 1$.", 0.6, "$c = 6$."), ["$\\tfrac6{10} = 0.6$."]),
    ex(1, num("elpx-ex-2", "Find the length of the major axis of $4x^2 + 9y^2 = 36$.", 6, "$\\dfrac{x^2}9 + \\dfrac{y^2}4 = 1$."), ["$2a = 6$."]),
    ex(2, num("elpx-ex-3", "Find the length of the latus rectum of $\\dfrac{x^2}{25} + \\dfrac{y^2}9 = 1$.", 3.6, "$\\tfrac{18}5$."), ["$3.6$."]),
    ex(2, num("elpx-ex-4", "An ellipse has foci $(\\pm3, 0)$ and $e = \\tfrac12$. Find $b^2$.", 27, "$a = 6$."), ["$36 - 9 = 27$."]),
    ex(2, num("elpx-ex-5", "$P$ on $\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$ has $x = 3$. Find its distance from the focus $(3, 0)$.", 3.2, "$a - ex = 5 - \\tfrac35 \\times 3$."), ["$3.2$."]),
    ex(3, num("elpx-ex-6", "For which $c > 0$ does $y = x + c$ touch $\\dfrac{x^2}{16} + \\dfrac{y^2}9 = 1$?", 5, "$c^2 = 16 + 9$."), ["$5$."]),
    ex(3, dp("elpx-ex-7", "Find the area of $\\dfrac{x^2}{16} + \\dfrac{y^2}9 = 1$.", 12 * Math.PI, "$\\pi ab$."), ["$12\\pi \\approx 37.699$."]),
    ex(3, mc("elpx-ex-8", "An ellipse's latus rectum equals half its minor axis. Its eccentricity is", ["$\\tfrac{\\sqrt3}2$", "$\\tfrac{2b^2}a = b$ gives $a = 2b$, so $e^2 = 1 - \\tfrac14$."], [["$\\tfrac12$", "That is $b/a$."], ["$\\tfrac1{\\sqrt2}$", "That needs $a^2 = 2b^2$."]]), ["$e = \\sqrt{1 - b^2/a^2}$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const TRIPLES = [[5, 3, 4], [5, 4, 3], [13, 5, 12], [13, 12, 5], [10, 6, 8], [10, 8, 6], [17, 8, 15], [17, 15, 8], [25, 7, 24]] as const;

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick(TRIPLES);
      const vertical = r.pick([true, false]);
      const eq = vertical ? `\\dfrac{x^2}{${b * b}} + \\dfrac{y^2}{${a * a}} = 1` : `\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1`;
      const want = r.pick(["c", "e", "lr", "major"] as const);
      const v = want === "c" ? c : want === "e" ? c / a : want === "lr" ? (2 * b * b) / a : 2 * a;
      const q = want === "c" ? "the distance from the centre to a focus" : want === "e" ? "the eccentricity (3 decimals)" : want === "lr" ? "the length of the latus rectum (3 decimals)" : "the length of the major axis";
      return n(`For $${eq}$, find ${q}.`, Math.round(v * 1000) / 1000, `Semi-major axis ${a}, semi-minor ${b}, $c = \\sqrt{${a * a} - ${b * b}} = ${c}$.`, want === "e" || want === "lr" ? 0.001 : undefined);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(2, 6);
      const b = r.int(1, a - 1);
      const m = r.nonzero(-3, 3);
      return n(`$y = ${m === 1 ? "" : m === -1 ? "-" : m}x + c$ touches $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$. Find $c^2$.`, a * a * m * m + b * b, `$c^2 = a^2m^2 + b^2 = ${a * a}(${m * m}) + ${b * b}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick(TRIPLES);
      const x = r.int(-a + 1, a - 1);
      const near = a - (c / a) * x;
      return n(`$P$ on $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$ has $x = ${x}$. Find its distance from the focus $(${c}, 0)$ (3 decimals).`, Math.round(near * 1000) / 1000, `$a - ex = ${a} - \\tfrac{${c}}{${a}}(${x})$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b, c] = r.pick(TRIPLES);
      return mcNumbers(
        `The foci of $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$ are`,
        { text: `$(\\pm${c}, 0)$`, why: `$c^2 = ${a * a} - ${b * b}$.` },
        [{ text: `$(\\pm\\sqrt{${a * a + b * b}}, 0)$`, why: "For an ellipse $c^2 = a^2 - b^2$.", misconception: "ellipse-c-sum" }, { text: `$(\\pm${a}, 0)$`, why: "Those are the vertices." }],
      );
    },
  },
];
