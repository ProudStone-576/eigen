import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Conic sections as focus–directrix loci; the parabola y² = 4ax and its other standard orientations: focus, directrix, axis, vertex, latus rectum, focal distance; shifted parabolas; parametric form; tangents (point, slope and parametric forms) and normals; focal chords; the reflection property. */

const base: ConceptNode = {
  id: "parabola",
  title: "The parabola",
  summary: "A parabola is the set of points equally far from a fixed point (the focus) and a fixed line (the directrix). With the vertex at the origin and the focus at (a, 0), it is y² = 4ax: directrix x = −a, latus rectum 4a, and every point's distance to the focus is x + a. Points on it are (at², 2at), and the tangent of slope m is y = mx + a/m. Rays parallel to the axis reflect through the focus.",
  deps: ["circles"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "eccentricity", meaning: "For a conic, $e = \\dfrac{\\text{distance to focus}}{\\text{distance to directrix}}$, constant: $e = 1$ parabola, $e < 1$ ellipse, $e > 1$ hyperbola." },
    { term: "latus rectum", meaning: "The chord through the focus perpendicular to the axis; for $y^2 = 4ax$ its length is $4a$." },
    { term: "focal chord", meaning: "Any chord through the focus; for $y^2 = 4ax$ its ends have parameters with $t_1t_2 = -1$." },
  ],
  misconceptions: {
    "focus-4a": "Places the focus of $y^2 = 4ax$ at $(4a, 0)$, reading the whole coefficient of $x$ as the focal distance.",
    "parabola-axis-swap": "Thinks $x^2 = 4ay$ has its axis along the $x$-axis, opening sideways.",
  },
  steps: [
    {
      type: "motivate",
      title: "One focus, one line",
      body: "The parabola is the first conic: slice a cone parallel to its side. Thrown balls trace parabolas, and satellite dishes are parabolic because every incoming signal parallel to the axis reflects to the same point, the focus. JEE questions use its parametric points $(at^2, 2at)$ to make tangents, normals and chords short calculations.",
      realWorld: {
        title: "Dishes and headlights",
        body: "A satellite dish collects parallel radio waves at its focus, where the receiver sits. A car headlight runs the other way: a bulb at the focus of a parabolic mirror sends out a parallel beam.",
      },
    },
    {
      type: "truth",
      statement: "$y^2 = 4ax$ ($a > 0$): vertex $(0, 0)$, focus $(a, 0)$, directrix $x = -a$, axis $y = 0$, latus rectum $4a$, focal distance of $(x, y)$ equal to $x + a$. Other orientations: $y^2 = -4ax$ opens left; $x^2 = 4ay$ opens up with focus $(0, a)$; $x^2 = -4ay$ opens down. **Parametric**: $(at^2, 2at)$. **Tangents**: at $(x_1, y_1)$, $yy_1 = 2a(x + x_1)$; at $t$, $ty = x + at^2$; of slope $m$, $y = mx + \\dfrac am$ (so $y = mx + c$ touches iff $c = a/m$). **Normal** at $t$: $y = -tx + 2at + at^3$.",
      body: "Always read $a$ as **a quarter** of the coefficient: $y^2 = 12x$ has $4a = 12$, $a = 3$, focus $(3, 0)$. For a shifted parabola, complete the square: $(y - k)^2 = 4a(x - h)$ has vertex $(h, k)$ and focus $(h + a, k)$. A focal chord through $t_1$ and $t_2$ has $t_1t_2 = -1$; the tangents at its ends are perpendicular and meet on the directrix. The normal at $t_1$ meets the parabola again at $t_2 = -t_1 - \\dfrac2{t_1}$. The defining property, distance to focus equals distance to directrix, gives the focal distance $x + a$ with no square roots.",
    },
    {
      type: "predict",
      misconception: "focus-4a",
      item: {
        kind: "mc",
        id: "prb-predict-1",
        prompt: "The focus of $y^2 = 12x$ is",
        options: [
          { id: "a", text: "$(3, 0)$", correct: true, why: "$4a = 12$, so $a = 3$." },
          { id: "b", text: "$(12, 0)$", misconception: "focus-4a", why: "12 is $4a$, not $a$." },
          { id: "c", text: "$(0, 3)$", why: "$y^2 = 4ax$ has its axis along the $x$-axis." },
        ],
      },
      reveal: {
        body: "Match $y^2 = 12x$ with $y^2 = 4ax$: $4a = 12$, so $a = 3$. The focus is $(3, 0)$ and the directrix $x = -3$. Check with the definition: the point $(3, 6)$ is on the curve, its distance to the focus is 6, and its distance to the directrix is $3 + 3 = 6$.",
      },
      resolve: {
        kind: "mc",
        id: "prb-resolve-1",
        prompt: "The focus of $x^2 = 8y$ is",
        options: [
          { id: "a", text: "$(0, 2)$", correct: true, why: "$4a = 8$." },
          { id: "b", text: "$(0, 8)$", misconception: "focus-4a", why: "Divide the coefficient by 4." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prb-check-1",
        prompt: "The parabola $x^2 = -12y$",
        options: [
          { id: "a", text: "opens downward, with focus $(0, -3)$", correct: true, why: "$x^2 = -4ay$ with $a = 3$." },
          { id: "b", text: "opens to the left, with focus $(-3, 0)$", misconception: "parabola-axis-swap", why: "The squared variable is $x$, so the axis is the $y$-axis." },
          { id: "c", text: "opens upward, with focus $(0, 3)$", why: "The minus sign turns it downward." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prb-check-2",
        prompt: "The latus rectum of $y^2 = 8x$ has length",
        options: [
          { id: "a", text: "8", correct: true, why: "$4a = 8$." },
          { id: "b", text: "2", why: "That is $a$." },
          { id: "c", text: "4", why: "That is $2a$, the half-length." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The squared-error loss $(y - \\hat y)^2$ is a parabola in the prediction, which is why gradient descent on it has a single minimum and a gradient proportional to the error (§{loss-functions}). Fitting a quadratic trend is least squares with an $x^2$ feature (§{regression-features}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "prb-produce-1", prompt: "The directrix of $y^2 = 20x$ is $x = c$. Find $c$.", answer: -5, explain: "$a = 5$, directrix $x = -a$." },
        { kind: "number", id: "prb-produce-2", prompt: "A point on $y^2 = 8x$ has $x = 2$. Find its distance from the focus.", answer: 4, explain: "$x + a = 2 + 2$." },
        {
          kind: "mc",
          id: "prb-produce-3",
          prompt: "The focus of $y^2 = 16x$ is",
          options: [
            { id: "a", text: "$(4, 0)$", correct: true, why: "$a = 16/4$." },
            { id: "b", text: "$(16, 0)$", misconception: "focus-4a", why: "16 is $4a$." },
          ],
        },
        {
          kind: "mc",
          id: "prb-produce-4",
          prompt: "The axis of $x^2 = 4y$ is",
          options: [
            { id: "a", text: "the $y$-axis", correct: true, why: "It is symmetric under $x \\to -x$." },
            { id: "b", text: "the $x$-axis", misconception: "parabola-axis-swap", why: "The squared variable is $x$, so the curve is symmetric about $x = 0$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "prb-review-1", prompt: "$y^2 = 4ax$ passes through $(2, 4)$. Find $a$.", answer: 2, explain: "$16 = 8a$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "conic by focus and directrix",
      body: "Given a focus $S$, a directrix $L$ and $e > 0$, the conic is the locus of $P$ with $PS = e \\cdot PM$, $M$ the foot of the perpendicular from $P$ to $L$. With $e = 1$ and $S = (a, 0)$, $L: x = -a$: $(x - a)^2 + y^2 = (x + a)^2$, which simplifies to $y^2 = 4ax$.",
    },
    {
      type: "definition",
      term: "shifted parabolas",
      body: "Complete the square in the squared variable. $y^2 - 4y - 8x + 20 = 0$ becomes $(y - 2)^2 = 8(x - 2)$: vertex $(2, 2)$, $a = 2$, focus $(4, 2)$, directrix $x = 0$, axis $y = 2$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "tangent of given slope",
      statement: "$y = mx + c$ touches $y^2 = 4ax$ iff $c = \\dfrac am$; the point of contact is $\\left(\\dfrac a{m^2}, \\dfrac{2a}m\\right)$.",
      proof: ["Substitute: $(mx + c)^2 = 4ax$, a quadratic $m^2x^2 + (2mc - 4a)x + c^2 = 0$.", "Tangency means a repeated root: $(2mc - 4a)^2 = 4m^2c^2$, which gives $16a^2 = 16amc$, so $c = a/m$ (§{quadratics})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "focal chords",
      statement: "The chord joining $t_1$ and $t_2$ on $y^2 = 4ax$ passes through the focus iff $t_1t_2 = -1$.",
      proof: ["The chord's slope is $\\dfrac{2a(t_2 - t_1)}{a(t_2^2 - t_1^2)} = \\dfrac2{t_1 + t_2}$, so it is $2x - (t_1 + t_2)y + 2at_1t_2 = 0$.", "It passes through $(a, 0)$ iff $2a + 2at_1t_2 = 0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "reflection property",
      statement: "The tangent at any point $P$ makes equal angles with the focal radius $SP$ and with the line through $P$ parallel to the axis.",
      proof: ["The tangent at $t$, $ty = x + at^2$, meets the axis at $T(-at^2, 0)$, so $ST = a + at^2 = SP$ (the focal distance).", "Triangle $SPT$ is isosceles, so its base angles at $P$ and $T$ are equal, and the angle at $T$ equals the angle between the tangent and the axis direction."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the focus, directrix and latus rectum of $y^2 = 12x$.",
      solution: ["$4a = 12$, $a = 3$.", "Focus $(3, 0)$, directrix $x = -3$, latus rectum 12."],
      result: "$(3, 0)$, $x = -3$, 12.",
    },
    {
      type: "example",
      level: 2,
      title: "tangent of given slope",
      problem: "Find the tangent to $y^2 = 8x$ with slope 2, and its point of contact.",
      solution: ["$a = 2$, $c = a/m = 1$: $y = 2x + 1$.", "Contact at $\\left(\\dfrac a{m^2}, \\dfrac{2a}m\\right) = \\left(\\tfrac12, 2\\right)$; check: $2^2 = 8 \\times \\tfrac12$."],
      result: "$y = 2x + 1$ at $\\left(\\tfrac12, 2\\right)$.",
    },
    {
      type: "example",
      level: 3,
      title: "the other end of a focal chord",
      problem: "One end of a focal chord of $y^2 = 4x$ is $(4, 4)$. Find the other end.",
      solution: ["$a = 1$, and $(4, 4) = (t^2, 2t)$ with $t = 2$.", "$t_2 = -\\tfrac1{t_1} = -\\tfrac12$: the point $\\left(\\tfrac14, -1\\right)$."],
      result: "$\\left(\\tfrac14, -1\\right)$.",
    },
  ],
  pitfalls: [
    { wrong: "Focus of $y^2 = 12x$ at $(12, 0)$.", right: "The coefficient is $4a$: focus $(3, 0)$." },
    { wrong: "$x^2 = 4ay$ opens sideways.", right: "Its axis is the $y$-axis; it opens up (or down if $a < 0$)." },
    { wrong: "Use the origin-vertex formulas for a shifted parabola.", right: "Complete the square and shift the focus and directrix with the vertex." },
  ],
  formulas: [
    { label: "Standard", tex: "y^2 = 4ax:\\ S(a, 0),\\ x = -a" },
    { label: "Parametric", tex: "(at^2, 2at)" },
    { label: "Tangent", tex: "y = mx + \\tfrac am,\\quad ty = x + at^2" },
    { label: "Normal", tex: "y = -tx + 2at + at^3" },
    { label: "Focal chord", tex: "t_1t_2 = -1" },
  ],
  exercises: [
    ex(1, num("prbx-ex-1", "Find the $x$-coordinate of the focus of $y^2 = 20x$.", 5, "$4a = 20$."), ["$5$."]),
    ex(1, num("prbx-ex-2", "Find the length of the latus rectum of $x^2 = -16y$.", 16, "$4\\lvert a\\rvert$."), ["$16$."]),
    ex(2, num("prbx-ex-3", "A point on $y^2 = 8x$ has $x = 4$. Find its focal distance.", 6, "$x + a$."), ["$4 + 2 = 6$."]),
    ex(2, num("prbx-ex-4", "For which $c$ does $y = 3x + c$ touch $y^2 = 12x$?", 1, "$c = a/m = 3/3$."), ["$1$."]),
    ex(2, num("prbx-ex-5", "Find the $x$-coordinate of the vertex of $y^2 - 4y - 8x + 20 = 0$.", 2, "$(y - 2)^2 = 8(x - 2)$."), ["$2$."]),
    ex(3, num("prbx-ex-6", "One end of a focal chord of $y^2 = 4x$ is $(4, 4)$. Find the $x$-coordinate of the other end.", 0.25, "$t_2 = -\\tfrac12$."), ["$\\tfrac14$."]),
    ex(3, num("prbx-ex-7", "The normal to $y^2 = 4x$ at $(1, 2)$ meets the parabola again. Find the $x$-coordinate of that point.", 9, "$t_2 = -t_1 - 2/t_1 = -3$."), ["$t_1 = 1$, $t_2 = -3$: the point $(9, -6)$."]),
    ex(3, mc("prbx-ex-8", "The tangents at the ends of a focal chord of a parabola meet", ["at right angles, on the directrix", "Their slopes $1/t_1$ and $1/t_2$ multiply to $-1$, and they meet at $(at_1t_2, a(t_1 + t_2))$ with $at_1t_2 = -a$."], [["on the axis", "They meet at $x = -a$, generally off the axis."], ["at the focus", "Tangents from the focus don't exist: it is inside the parabola."]]), ["The meeting point has $x = -a$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-6, 6);
      const vert = r.pick([true, false]);
      const want = r.pick(["focus", "directrix", "latus"] as const);
      const eq = vert ? `x^2 = ${4 * a}y` : `y^2 = ${4 * a}x`;
      const v = want === "latus" ? 4 * Math.abs(a) : want === "focus" ? a : -a;
      const q = want === "latus" ? "the length of the latus rectum" : want === "focus" ? `the ${vert ? "y" : "x"}-coordinate of the focus` : `$c$, where the directrix is $${vert ? "y" : "x"} = c$`;
      return n(`For $${eq}$, find ${q}.`, v, `$4a = ${4 * a}$, so $a = ${a}$; focus at distance $a$ along the axis, directrix on the other side.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = r.pick([1, 2, 4, -1, -2]);
      const j = r.nonzero(-5, 5);
      const a = m * j;
      return n(`$y = ${m === 1 ? "" : m === -1 ? "-" : m}x + c$ touches $y^2 = ${4 * a}x$. Find $c$.`, j, `$c = a/m = ${a}/${m} = ${j}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 5);
      const t = r.nonzero(-4, 4);
      return n(`The point $(${a * t * t}, ${2 * a * t})$ lies on $y^2 = ${4 * a}x$. Find its distance from the focus.`, a * t * t + a, `Focal distance $x + a = ${a * t * t} + ${a}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(2, 7);
      return mcNumbers(
        `The focus of $y^2 = ${4 * a}x$ is`,
        { text: `$(${a}, 0)$`, why: `$4a = ${4 * a}$, so $a = ${a}$.` },
        [{ text: `$(${4 * a}, 0)$`, why: "The coefficient is $4a$, not $a$.", misconception: "focus-4a" }, { text: `$(0, ${a})$`, why: "$y^2 = 4ax$ opens along the $x$-axis." }],
      );
    },
  },
];
