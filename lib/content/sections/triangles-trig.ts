import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Solution of triangles: the sine rule (and circumradius), the cosine rule, area formulas, the ambiguous SSA case, half-angle formulas, inradius and circumradius, heights and distances. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const rad = (d: number) => (d * Math.PI) / 180;

const base: ConceptNode = {
  id: "triangles-trig",
  title: "Solving triangles",
  summary: "Any triangle, not just a right one, can be solved from three suitable measurements. The sine rule links each side with the sine of its opposite angle; the cosine rule generalises Pythagoras. Area is half the product of two sides and the sine of the included angle, and from it come the inradius and circumradius. Two sides and a non-included angle can give two different triangles.",
  deps: ["trig-identities", "mensuration"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "sine rule", meaning: "$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$, with $R$ the circumradius." },
    { term: "cosine rule", meaning: "$c^2 = a^2 + b^2 - 2ab\\cos C$." },
    { term: "angle of elevation", meaning: "The angle above the horizontal from the observer to an object." },
  ],
  misconceptions: {
    "ambiguous-case": "Assumes two sides and a non-included angle always determine one triangle.",
    "cosine-rule-sign": "Writes the cosine rule with $+2ab\\cos C$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Triangles without right angles",
      body: "Two lighthouses 10 km apart both sight a ship; the angles at each are 50° and 70°. How far is the ship from each? A plot of land has sides 13, 14 and 15 m: what are its angles? Surveying, navigation and physics problems are mostly about non-right triangles, and these rules solve them all.",
      realWorld: {
        title: "The Great Trigonometrical Survey",
        body: "From 1802 the survey of India measured a chain of triangles across the subcontinent with the sine rule, starting from one carefully measured baseline. It established the height of Mount Everest in 1856.",
      },
    },
    {
      type: "truth",
      statement: "In triangle $ABC$ with opposite sides $a, b, c$: **sine rule** $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$; **cosine rule** $a^2 = b^2 + c^2 - 2bc\\cos A$, so $\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}$; **area** $\\Delta = \\tfrac12bc\\sin A$ (or Heron's formula, §{mensuration}). **Circumradius** $R = \\dfrac{abc}{4\\Delta}$, **inradius** $r = \\dfrac\\Delta s$ with $s = \\tfrac12(a + b + c)$.",
      body: "Use the cosine rule for SSS (find an angle) and SAS (find the third side); the sine rule for AAS/ASA and SSA. **Ambiguous case** (given $a$, $b$ and acute $A$): if $a < b\\sin A$, no triangle; if $a = b\\sin A$, one right triangle; if $b\\sin A < a < b$, **two** triangles ($B$ and $180° - B$); if $a \\ge b$, one. Half-angle formulas: $\\sin\\tfrac A2 = \\sqrt{\\dfrac{(s - b)(s - c)}{bc}}$, $\\cos\\tfrac A2 = \\sqrt{\\dfrac{s(s - a)}{bc}}$. The largest angle is opposite the largest side, and it is obtuse exactly when $a^2 > b^2 + c^2$. For heights and distances, draw the right triangles: height $=$ distance $\\times \\tan(\\text{elevation})$.",
    },
    {
      type: "predict",
      misconception: "ambiguous-case",
      item: {
        kind: "mc",
        id: "ttr-predict-1",
        prompt: "In triangle $ABC$, $a = 6$, $b = 8$ and $A = 30°$. How many triangles fit?",
        options: [
          { id: "a", text: "Two", correct: true, why: "$b\\sin A = 4 < a = 6 < b = 8$." },
          { id: "b", text: "One: three measurements fix a triangle", misconception: "ambiguous-case", why: "SSA can give two triangles." },
          { id: "c", text: "None", why: "$a$ exceeds $b\\sin A$, so at least one exists." },
        ],
      },
      reveal: {
        body: "The sine rule gives $\\sin B = \\dfrac{8 \\sin 30°}{6} = \\tfrac23$, so $B \\approx 41.8°$ or $B \\approx 138.2°$. Both leave room for $C$ ($A + B < 180°$ in each case), so two different triangles exist. Picture side $a$ swinging from $C$: a circle of radius 6 meets the line from $A$ in two points.",
      },
      resolve: {
        kind: "mc",
        id: "ttr-resolve-1",
        prompt: "$a = 10$, $b = 8$, $A = 40°$. How many triangles?",
        options: [
          { id: "a", text: "One", correct: true, why: "$a \\ge b$: the larger side faces the given angle." },
          { id: "b", text: "Two, as SSA always gives two", misconception: "ambiguous-case", why: "Two only when $b\\sin A < a < b$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ttr-check-1",
        prompt: "$a = 7$, $b = 8$, $C = 60°$. Then $c^2$ equals",
        options: [
          { id: "a", text: "57", correct: true, why: "$49 + 64 - 2 \\times 56 \\times \\tfrac12$." },
          { id: "b", text: "169", misconception: "cosine-rule-sign", why: "The cosine term is subtracted." },
          { id: "c", text: "113", why: "That ignores the angle." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ttr-check-2",
        prompt: "From 100 m away on level ground, the top of a tower is at elevation 30°. Its height is about",
        options: [
          { id: "a", text: "57.7 m", correct: true, why: "$100\\tan 30°$." },
          { id: "b", text: "50 m", why: "That uses $\\sin 30°$." },
          { id: "c", text: "173 m", why: "That uses $\\tan 60°$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Triangulation, finding a point from angles measured at known positions, underlies GPS-free localisation, stereo vision and the trilateration step in many tracking systems. The cosine rule is the dot-product identity $\\lvert u - v\\rvert^2 = \\lvert u\\rvert^2 + \\lvert v\\rvert^2 - 2u \\cdot v$ (§{vector}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ttr-produce-1", prompt: "Find the area of a triangle with sides 6 and 8 enclosing an angle of 30°.", answer: 12, explain: "$\\tfrac12 \\times 48 \\times \\tfrac12$." },
        { kind: "number", id: "ttr-produce-2", prompt: "For the 13–14–15 triangle (area 84), find the inradius.", answer: 4, explain: "$84/21$." },
        {
          kind: "mc",
          id: "ttr-produce-3",
          prompt: "$b = 10$, $A = 30°$ and $a = 7$. The number of possible triangles is",
          options: [
            { id: "a", text: "2", correct: true, why: "$b\\sin A = 5 < 7 < 10$." },
            { id: "b", text: "1", misconception: "ambiguous-case", why: "This is the two-triangle case." },
          ],
        },
        {
          kind: "mc",
          id: "ttr-produce-4",
          prompt: "Sides 3, 5, 7. The largest angle has cosine",
          options: [
            { id: "a", text: "$-\\tfrac12$ (it is 120°)", correct: true, why: "$\\dfrac{9 + 25 - 49}{30}$." },
            { id: "b", text: "$\\tfrac{83}{30}$", misconception: "cosine-rule-sign", why: "That adds instead of subtracting $a^2$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "ttr-review-1", prompt: "Find the circumradius of a 3–4–5 triangle.", answer: 2.5, explain: "$abc/4\\Delta = 60/24$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "special points and radii",
      body: "The **circumcentre** is where the perpendicular bisectors meet, at distance $R = \\dfrac{a}{2\\sin A}$ from each vertex; the **incentre** is where the angle bisectors meet, at distance $r = \\dfrac\\Delta s = 4R\\sin\\tfrac A2\\sin\\tfrac B2\\sin\\tfrac C2$ from each side. For a right triangle, $R$ is half the hypotenuse.",
    },
    {
      type: "definition",
      term: "projection formula",
      body: "$a = b\\cos C + c\\cos B$, and cyclically: each side is the sum of the projections of the other two onto it. Together with the sine and cosine rules it solves most \"prove that\" triangle identities.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the sine rule",
      statement: "$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$.",
      proof: ["Draw the diameter through $B$ of the circumcircle, meeting it at $D$. Angle $BDC = A$ (same arc) and $BCD = 90°$ (semicircle), so $a = BC = 2R\\sin A$ (§{plane-geometry}); likewise for the others."],
    },
    {
      type: "theorem",
      name: "the cosine rule",
      statement: "$c^2 = a^2 + b^2 - 2ab\\cos C$.",
      proof: ["Place $C$ at the origin, $B$ at $(a, 0)$ and $A$ at $(b\\cos C, b\\sin C)$. Then $c^2 = (a - b\\cos C)^2 + b^2\\sin^2C = a^2 - 2ab\\cos C + b^2$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "area and radii",
      statement: "$\\Delta = \\tfrac12ab\\sin C = \\dfrac{abc}{4R} = rs$.",
      proof: ["The first is base times height; substitute $\\sin C = \\dfrac{c}{2R}$ for the second; for the third, join the incentre to the vertices to split the triangle into three with heights $r$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "In triangle $ABC$, $A = 30°$, $B = 45°$ and $a = 5$. Find $b$.",
      solution: ["$\\dfrac{b}{\\sin 45°} = \\dfrac{5}{\\sin 30°} = 10$.", "$b = 10 \\times \\tfrac{\\sqrt2}2 = 5\\sqrt2 \\approx 7.07$."],
      result: "$5\\sqrt2$.",
    },
    {
      type: "example",
      level: 2,
      title: "radii of the 13–14–15 triangle",
      problem: "Find $R$ and $r$ for the triangle with sides 13, 14, 15.",
      solution: ["$s = 21$, $\\Delta = 84$.", "$R = \\dfrac{13 \\times 14 \\times 15}{4 \\times 84} = \\dfrac{2730}{336} = 8.125$; $r = 84/21 = 4$."],
      result: "$R = 8.125$, $r = 4$.",
    },
    {
      type: "example",
      level: 3,
      title: "two observers",
      problem: "Two points 100 m apart on level ground, on the same side of a tower, see its top at elevations 30° and 60°. Find the height.",
      solution: ["If $x$ is the nearer distance: $h = x\\tan 60° = (x + 100)\\tan 30°$.", "$\\sqrt3x = \\dfrac{x + 100}{\\sqrt3}$ gives $x = 50$, $h = 50\\sqrt3 \\approx 86.6$ m."],
      result: "About 86.6 m.",
    },
  ],
  pitfalls: [
    { wrong: "SSA always fixes one triangle.", right: "Check $b\\sin A$ against $a$ and $b$: there may be 0, 1 or 2." },
    { wrong: "$c^2 = a^2 + b^2 + 2ab\\cos C$.", right: "Minus: $c^2 = a^2 + b^2 - 2ab\\cos C$." },
    { wrong: "Use the sine rule to find an obtuse angle without care.", right: "$\\sin B$ doesn't distinguish $B$ from $180° - B$; use the cosine rule when possible." },
  ],
  formulas: [
    { label: "Sine rule", tex: "\\dfrac{a}{\\sin A} = 2R" },
    { label: "Cosine rule", tex: "\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}" },
    { label: "Area", tex: "\\Delta = \\tfrac12bc\\sin A" },
    { label: "Radii", tex: "R = \\dfrac{abc}{4\\Delta},\\ r = \\dfrac{\\Delta}{s}" },
  ],
  exercises: [
    ex(1, num("ttrx-ex-1", "Find the area of a triangle with sides 10 and 12 enclosing a 30° angle.", 30, "$\\tfrac12 \\times 120 \\times \\tfrac12$."), ["$30$."]),
    ex(1, num("ttrx-ex-2", "Find the inradius of a 3–4–5 triangle.", 1, "$6/6$."), ["$1$."]),
    ex(2, dp("ttrx-ex-3", "$A = 30°$, $B = 45°$, $a = 5$. Find $b$.", (5 * Math.sin(rad(45))) / Math.sin(rad(30)), "Sine rule."), ["$5\\sqrt2 \\approx 7.071$."]),
    ex(2, num("ttrx-ex-4", "Sides 5, 7, 8. Find the angle opposite 7, in degrees.", 60, "$\\cos = \\tfrac{25 + 64 - 49}{80} = \\tfrac12$."), ["$60$."]),
    ex(2, dp("ttrx-ex-5", "$b = 5$, $c = 8$, $A = 60°$. Find $a$.", 7, "$25 + 64 - 40 = 49$."), ["$7$."]),
    ex(3, dp("ttrx-ex-6", "Two points 100 m apart, same side of a tower, see its top at 30° and 60°. Find the height.", 50 * Math.sqrt(3), "Nearer distance 50 m."), ["$50\\sqrt3 \\approx 86.603$ m."]),
    ex(3, num("ttrx-ex-7", "Find the circumradius of the triangle with sides 13, 14, 15.", 8.125, "$2730/336$."), ["$8.125$."]),
    ex(3, mc("ttrx-ex-8", "$a = 4$, $b = 10$, $A = 30°$. The number of triangles is", ["0", "$b\\sin A = 5 > 4$: the side can't reach."], [["1", "That needs $a = 5$ or $a \\ge 10$."], ["2", "That needs $5 < a < 10$."]]), ["Compare $a$ with $b\\sin A$ first."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.int(3, 12);
      const b = r.int(3, 12);
      const C = r.pick([30, 45, 60, 90, 120, 135]);
      const want = r.pick(["side", "area"] as const);
      const v = want === "side" ? Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C))) : 0.5 * a * b * Math.sin(rad(C));
      return n(`In triangle $ABC$, $a = ${a}$, $b = ${b}$ and $C = ${C}°$. Find ${want === "side" ? "$c$" : "the area"} (3 decimals).`, Math.round(v * 1000) / 1000, want === "side" ? `$c^2 = ${a * a} + ${b * b} - 2 \\times ${a * b}\\cos ${C}°$.` : `$\\tfrac12 \\times ${a} \\times ${b} \\times \\sin ${C}°$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c, area] = r.pick([[3, 4, 5, 6], [5, 12, 13, 30], [13, 14, 15, 84], [6, 8, 10, 24], [9, 10, 17, 36], [7, 15, 20, 42]] as const);
      const want = r.pick(["inradius", "circumradius"] as const);
      const v = want === "inradius" ? area / ((a + b + c) / 2) : (a * b * c) / (4 * area);
      return n(`A triangle has sides ${a}, ${b}, ${c} and area ${area}. Find its ${want} (3 decimals).`, Math.round(v * 1000) / 1000, want === "inradius" ? `$r = \\Delta/s = ${area}/${(a + b + c) / 2}$.` : `$R = abc/4\\Delta = ${a * b * c}/${4 * area}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const d = r.int(20, 200);
      const e = r.pick([15, 30, 45, 60, 75]);
      const v = d * Math.tan(rad(e));
      return n(`From ${d} m away on level ground, the top of a tower is at elevation ${e}°. Find its height in metres (2 decimals).`, r2(v), `$${d}\\tan ${e}°$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b, A, k] = r.pick([[6, 8, 30, 2], [7, 10, 30, 2], [9, 12, 45, 2], [12, 10, 50, 1], [3, 8, 30, 0]] as const);
      const right = `${k}`;
      return mcNumbers(
        `In triangle $ABC$, $a = ${a}$, $b = ${b}$ and $A = ${A}°$. How many triangles are possible?`,
        { text: right, why: `Compare $a$ with $b\\sin A \\approx ${r2(b * Math.sin(rad(A)))}$ and with $b$.` },
        k === 1 ? [{ text: "2", why: "Two only when $b\\sin A < a < b$." }, { text: "0", why: "$a \\ge b$ guarantees one." }] : k === 2 ? [{ text: "1", why: "SSA can give two triangles here.", misconception: "ambiguous-case" }, { text: "0", why: "$a > b\\sin A$." }] : [{ text: "1", why: "$a < b\\sin A$: none exist.", misconception: "ambiguous-case" }, { text: "2", why: "The side is too short." }],
      );
    },
  },
];
