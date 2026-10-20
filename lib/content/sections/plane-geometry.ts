import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Plane geometry: angles and parallel lines, triangles (angle sums, Pythagoras, special right triangles, congruence and similarity), circles (arcs, sectors, inscribed and central angles, tangents and chords). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "plane-geometry",
  title: "Lines, angles, triangles & circles",
  summary: "Plane geometry rests on a few facts: angles on a straight line sum to 180°, a transversal makes equal angles with parallel lines, a triangle's angles sum to 180°, and in a right triangle a² + b² = c². Similar triangles have proportional sides, so their areas scale with the square of the ratio. In a circle, an inscribed angle is half the central angle on the same arc.",
  deps: ["linear-equations"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "similar figures", meaning: "Same shape, possibly different size: corresponding angles equal, corresponding sides in a constant ratio $k$." },
    { term: "inscribed angle", meaning: "An angle whose vertex is on the circle and whose sides are chords." },
    { term: "sector", meaning: "The region of a circle between two radii; its arc is the part of the circumference between them." },
  ],
  misconceptions: {
    "area-ratio-linear": "Thinks similar figures with side ratio $k$ have area ratio $k$ rather than $k^2$.",
    "inscribed-equals-central": "Takes an inscribed angle to equal the central angle on the same arc, rather than half of it.",
  },
  steps: [
    {
      type: "motivate",
      title: "A few facts go a long way",
      body: "How tall is a tree whose shadow is 12 m when a 1.5 m pole casts a 2 m shadow? How long is the arc a pendulum swings through? SAT geometry questions look varied but nearly all yield to angle facts, Pythagoras, similar triangles and the circle theorems collected here.",
      realWorld: {
        title: "Measuring the Earth",
        body: "Around 240 BCE Eratosthenes noticed the Sun's rays made a 7.2° angle at Alexandria when it was overhead at Syene, 800 km south. Since 7.2° is 1/50 of a circle, the Earth's circumference is about $50 \\times 800 = 40{,}000$ km: an arc-length calculation.",
      },
    },
    {
      type: "truth",
      statement: "Angles on a straight line sum to $180°$; vertically opposite angles are equal; with parallel lines, corresponding and alternate angles are equal and co-interior angles sum to $180°$. In a triangle the angles sum to $180°$ and an exterior angle equals the sum of the two opposite interior angles. **Pythagoras**: in a right triangle $a^2 + b^2 = c^2$; the special triangles have sides $1 : 1 : \\sqrt2$ (45°–45°–90°) and $1 : \\sqrt3 : 2$ (30°–60°–90°). **Similar** triangles (two equal angles suffice) with side ratio $k$ have perimeter ratio $k$ and area ratio $k^2$.",
      body: "In a circle of radius $r$, an arc subtending a central angle $\\theta°$ has length $\\dfrac{\\theta}{360} \\cdot 2\\pi r$, and its sector has area $\\dfrac{\\theta}{360} \\cdot \\pi r^2$ (with $\\theta$ in radians, simply $r\\theta$ and $\\tfrac12r^2\\theta$). An **inscribed angle** is half the **central angle** on the same arc, so an angle in a semicircle is $90°$ and angles in the same segment are equal. A **tangent** is perpendicular to the radius at the point of contact, and the perpendicular from the centre to a chord bisects it. A polygon with $n$ sides has interior angles summing to $(n - 2) \\times 180°$.",
    },
    {
      type: "predict",
      misconception: "area-ratio-linear",
      item: {
        kind: "mc",
        id: "pgm-predict-1",
        prompt: "Two similar triangles have corresponding sides 3 cm and 6 cm. The smaller has area 10 cm². The larger has area",
        options: [
          { id: "a", text: "40 cm²", correct: true, why: "Side ratio 2, area ratio $2^2 = 4$." },
          { id: "b", text: "20 cm²", misconception: "area-ratio-linear", why: "Area scales with the square of the side ratio." },
          { id: "c", text: "80 cm²", why: "That is the volume scaling, $2^3$." },
        ],
      },
      reveal: {
        body: "Doubling every length doubles both the base and the height, so the area $\\tfrac12bh$ is multiplied by $2 \\times 2 = 4$. In general lengths scale by $k$, areas by $k^2$ and volumes by $k^3$ (§{mensuration}).",
      },
      resolve: {
        kind: "mc",
        id: "pgm-resolve-1",
        prompt: "A map is drawn at scale 1 : 1000. A park measures 3 cm² on the map. Its real area is",
        options: [
          { id: "a", text: "300 m²", correct: true, why: "$3 \\times 1000^2$ cm² $= 3{,}000{,}000$ cm² $= 300$ m²." },
          { id: "b", text: "30 m²", misconception: "area-ratio-linear", why: "That scales area by 1000, not $1000^2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pgm-check-1",
        prompt: "A central angle is 110°. An inscribed angle on the same arc is",
        options: [
          { id: "a", text: "55°", correct: true, why: "Half the central angle." },
          { id: "b", text: "110°", misconception: "inscribed-equals-central", why: "The inscribed angle is half." },
          { id: "c", text: "70°", why: "That is $180° - 110°$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pgm-check-2",
        prompt: "A 30°–60°–90° triangle has hypotenuse 10. The side opposite 60° is",
        options: [
          { id: "a", text: "$5\\sqrt3$", correct: true, why: "Sides $5 : 5\\sqrt3 : 10$." },
          { id: "b", text: "5", why: "That is opposite 30°." },
          { id: "c", text: "$10\\sqrt3$", why: "The hypotenuse is the longest side." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Computer-vision pipelines rely on similar-triangle geometry: a pinhole camera maps a 3D point to the image by similar triangles, which is how depth is estimated from two views. Distances and angles between feature vectors generalise these ideas to many dimensions (§{vector}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pgm-produce-1", prompt: "A 1.5 m pole casts a 2 m shadow when a tree casts a 12 m shadow. Find the tree's height in metres.", answer: 9, explain: "Similar triangles: $1.5/2 = h/12$." },
        { kind: "number", id: "pgm-produce-2", prompt: "Find each interior angle of a regular hexagon, in degrees.", answer: 120, explain: "$(6 - 2) \\times 180/6$." },
        {
          kind: "mc",
          id: "pgm-produce-3",
          prompt: "An angle inscribed in a semicircle measures",
          options: [
            { id: "a", text: "90°", correct: true, why: "Half of the 180° central angle." },
            { id: "b", text: "180°", misconception: "inscribed-equals-central", why: "The inscribed angle is half the central angle." },
          ],
        },
        {
          kind: "mc",
          id: "pgm-produce-4",
          prompt: "Tripling all sides of a triangle multiplies its area by",
          options: [
            { id: "a", text: "9", correct: true, why: "$3^2$." },
            { id: "b", text: "3", misconception: "area-ratio-linear", why: "Areas scale by the square." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "pgm-review-1", prompt: "A right triangle has legs 9 and 12. Find the hypotenuse.", answer: 15, explain: "$\\sqrt{81 + 144}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "congruence and similarity tests",
      body: "Triangles are **congruent** (identical) by SSS, SAS, ASA/AAS, or RHS for right triangles. They are **similar** by AA (two equal angles), SAS with the included angle equal and the enclosing sides in proportion, or SSS with all three sides in proportion. A line parallel to one side of a triangle cuts the other two proportionally (the basic proportionality theorem).",
    },
    {
      type: "definition",
      term: "circle theorems",
      body: "Inscribed angle $= \\tfrac12$ central angle on the same arc. Opposite angles of a cyclic quadrilateral sum to $180°$. The two tangents from an external point are equal in length. The angle between a tangent and a chord equals the inscribed angle in the alternate segment. If two chords $AB$ and $CD$ meet at $P$, then $PA \\cdot PB = PC \\cdot PD$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the inscribed angle theorem",
      statement: "An inscribed angle is half the central angle subtending the same arc.",
      proof: [
        "Take the case where one side of the inscribed angle at $P$ passes through the centre $O$. Triangle $OPA$ is isosceles ($OP = OA$), so its base angles are equal, say $x$.",
        "The central angle $\\angle AOB$ is an exterior angle of that triangle, so it equals $x + x = 2x$. Other positions follow by adding or subtracting two such cases.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "areas of similar figures",
      statement: "If two figures are similar with length ratio $k$, their areas are in ratio $k^2$.",
      proof: ["Every area is a sum of (limits of) products of two lengths, each multiplied by $k$; for triangles, $\\tfrac12(kb)(kh) = k^2 \\cdot \\tfrac12bh$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "polygon angles",
      statement: "The interior angles of a convex $n$-gon sum to $(n - 2) \\times 180°$; its exterior angles sum to $360°$.",
      proof: ["Diagonals from one vertex split it into $n - 2$ triangles; walking once around turns through a full $360°$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "In triangle $ABC$, $\\angle A = 50°$ and the exterior angle at $C$ is $120°$. Find $\\angle B$.",
      solution: ["Exterior angle at $C$ = $\\angle A + \\angle B$.", "$\\angle B = 120° - 50° = 70°$."],
      result: "70°.",
    },
    {
      type: "example",
      level: 2,
      title: "arc and sector",
      problem: "A circle has radius 6 cm. Find the length of the arc and the area of the sector for a central angle of 60°.",
      solution: ["Arc $= \\tfrac{60}{360} \\times 2\\pi \\times 6 = 2\\pi \\approx 6.28$ cm.", "Sector $= \\tfrac{60}{360} \\times \\pi \\times 36 = 6\\pi \\approx 18.85$ cm²."],
      result: "$2\\pi$ cm and $6\\pi$ cm².",
    },
    {
      type: "example",
      level: 3,
      title: "chord distance",
      problem: "A chord of length 16 lies in a circle of radius 10. How far is it from the centre?",
      solution: ["The perpendicular from the centre bisects the chord: half-chord 8.", "$d = \\sqrt{10^2 - 8^2} = 6$."],
      result: "6.",
    },
  ],
  pitfalls: [
    { wrong: "Similar figures' areas scale like their sides.", right: "Areas scale by $k^2$, volumes by $k^3$." },
    { wrong: "An inscribed angle equals the central angle.", right: "It is half." },
    { wrong: "Assume a diagram is to scale.", right: "Use only stated facts and theorems." },
  ],
  formulas: [
    { label: "Pythagoras", tex: "a^2 + b^2 = c^2" },
    { label: "Arc, sector", tex: "\\tfrac{\\theta}{360}2\\pi r,\\ \\tfrac{\\theta}{360}\\pi r^2" },
    { label: "Polygon", tex: "(n - 2) \\times 180°" },
    { label: "Similar areas", tex: "A_2/A_1 = k^2" },
  ],
  exercises: [
    ex(1, num("pgmx-ex-1", "Two angles of a triangle are 47° and 68°. Find the third, in degrees.", 65, "$180 - 115$."), ["$65$."]),
    ex(1, num("pgmx-ex-2", "A right triangle has hypotenuse 13 and one leg 5. Find the other leg.", 12, "$\\sqrt{169 - 25}$."), ["$12$."]),
    ex(2, dp("pgmx-ex-3", "Find the arc length for a 45° central angle in a circle of radius 8.", 2 * Math.PI, "$\\tfrac18 \\times 16\\pi$."), ["$2\\pi \\approx 6.283$."]),
    ex(2, num("pgmx-ex-4", "Similar triangles have areas 9 and 25. The smaller has a side of 6. Find the corresponding side of the larger.", 10, "Side ratio $\\sqrt{25/9} = 5/3$."), ["$10$."]),
    ex(2, num("pgmx-ex-5", "In a cyclic quadrilateral, one angle is 75°. Find the opposite angle, in degrees.", 105, "They sum to 180°."), ["$105$."]),
    ex(3, num("pgmx-ex-6", "Two chords meet inside a circle: one is split into 4 and 6, the other into 3 and $x$. Find $x$.", 8, "$4 \\times 6 = 3x$."), ["$8$."]),
    ex(3, num("pgmx-ex-7", "Each interior angle of a regular polygon is 156°. How many sides has it?", 15, "Exterior angle 24°."), ["$360/24 = 15$."]),
    ex(3, mc("pgmx-ex-8", "A tangent from a point 13 cm from the centre touches a circle of radius 5 cm. Its length is", ["12 cm", "Tangent ⟂ radius: $\\sqrt{169 - 25}$."], [["8 cm", "$13 - 5$ ignores the right angle."], ["$\\sqrt{194}$ cm", "Subtract, don't add, the squares."]]), ["A right triangle with the radius."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]] as const);
      const want = r.pick(["hyp", "leg"] as const);
      return want === "hyp"
        ? n(`A right triangle has legs ${a} and ${b}. Find the hypotenuse.`, c, `$\\sqrt{${a * a} + ${b * b}} = ${c}$.`)
        : n(`A right triangle has hypotenuse ${c} and one leg ${a}. Find the other leg.`, b, `$\\sqrt{${c * c} - ${a * a}} = ${b}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const rad = r.int(2, 12);
      const th = r.pick([30, 45, 60, 72, 90, 120, 150]);
      const want = r.pick(["arc", "sector"] as const);
      const v = want === "arc" ? (th / 360) * 2 * Math.PI * rad : (th / 360) * Math.PI * rad * rad;
      return n(`A circle has radius ${rad}. Find the ${want === "arc" ? "arc length" : "sector area"} for a central angle of ${th}° (3 decimals).`, Math.round(v * 1000) / 1000, want === "arc" ? `$\\tfrac{${th}}{360} \\times 2\\pi \\times ${rad}$.` : `$\\tfrac{${th}}{360} \\times \\pi \\times ${rad * rad}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([2, 3, 4, 5, 1.5, 2.5]);
      const a1 = r.int(2, 30);
      return n(`Similar triangles have side ratio 1 : ${k}. The smaller has area ${a1}. Find the larger's area (2 decimals).`, r2(a1 * k * k), `Area ratio $${k}^2 = ${k * k}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const c = r.pick([70, 80, 100, 130, 140, 160]);
      return mcNumbers(
        `A central angle is ${c}°. An inscribed angle subtending the same arc measures`,
        { text: `${c / 2}°`, why: "Half the central angle." },
        [
          { text: `${c}°`, why: "Inscribed angles are half the central angle.", misconception: "inscribed-equals-central" },
          { text: `${180 - c}°`, why: "That isn't a circle theorem here." },
        ],
      );
    },
  },
];
