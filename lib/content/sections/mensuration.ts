import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Mensuration: areas of triangles (including Heron's formula), quadrilaterals and circles; surface areas and volumes of prisms, cylinders, pyramids, cones and spheres; scaling; composite solids and recasting. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "mensuration",
  title: "Area & volume",
  summary: "Areas measure flat regions in square units; volumes measure solids in cubic units. A handful of formulas cover nearly everything: base × height for prisms and cylinders, one third of that for pyramids and cones, and 4/3·πr³ for spheres. Scaling every length by k multiplies areas by k² and volumes by k³, and melting one solid into another keeps the volume fixed.",
  deps: ["plane-geometry"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "prism", meaning: "A solid with two identical parallel faces joined by rectangles; volume = base area × height." },
    { term: "slant height", meaning: "For a cone, $l = \\sqrt{r^2 + h^2}$: the distance from the rim to the apex along the surface." },
    { term: "Heron's formula", meaning: "Area of a triangle with sides $a, b, c$: $\\sqrt{s(s - a)(s - b)(s - c)}$, with $s = (a + b + c)/2$." },
  ],
  misconceptions: {
    "volume-scale-linear": "Thinks doubling every dimension of a solid doubles its volume.",
    "cone-volume-cylinder": "Uses $\\pi r^2h$ for a cone's volume, forgetting the factor $\\tfrac13$.",
  },
  steps: [
    {
      type: "motivate",
      title: "How much paint, how much water?",
      body: "Painting a cylindrical tank needs its surface area; filling it needs its volume. A scale model of a building is 1/100 the size: how much smaller is its floor area, and its volume? Mensuration questions are quick marks in every exam, as long as the right formula and the right scaling are used.",
      realWorld: {
        title: "Why big animals are shaped differently",
        body: "If an animal were scaled up 10 times in every direction, its weight (volume) would grow 1,000 times but the strength of its bones (cross-sectional area) only 100 times. That is why elephants have thick legs and why giant insects can't exist.",
      },
    },
    {
      type: "truth",
      statement: "**Areas**: triangle $\\tfrac12bh$ (or Heron's formula); parallelogram $bh$; trapezium $\\tfrac12(a + b)h$; circle $\\pi r^2$, circumference $2\\pi r$. **Volumes**: prism and cylinder $= $ base area $\\times$ height, so a cylinder is $\\pi r^2h$; pyramid and cone $= \\tfrac13$ base area $\\times$ height, so a cone is $\\tfrac13\\pi r^2h$; sphere $\\tfrac43\\pi r^3$. **Surface areas**: cylinder $2\\pi rh + 2\\pi r^2$; cone $\\pi rl + \\pi r^2$ with $l = \\sqrt{r^2 + h^2}$; sphere $4\\pi r^2$.",
      body: "Scaling all lengths by $k$ scales areas by $k^2$ and volumes by $k^3$ (§{plane-geometry}). When a solid is melted and recast, its volume is unchanged: equate the volume formulas and solve. For composite solids, add or subtract volumes, but for surface area count only the outside faces. Convert units carefully: $1\\text{ m}^3 = 10^6\\text{ cm}^3 = 1000$ litres, and $1$ litre $= 1000\\text{ cm}^3$.",
    },
    {
      type: "predict",
      misconception: "volume-scale-linear",
      item: {
        kind: "mc",
        id: "msr-predict-1",
        prompt: "A cylindrical can holds 500 ml. A can twice as tall and twice as wide holds",
        options: [
          { id: "a", text: "4,000 ml", correct: true, why: "Every length doubles, so the volume scales by $2^3 = 8$." },
          { id: "b", text: "1,000 ml", misconception: "volume-scale-linear", why: "All three dimensions double, not one." },
          { id: "c", text: "2,000 ml", why: "That doubles only the radius: $r^2$ gives 4." },
        ],
      },
      reveal: {
        body: "$V = \\pi r^2h$: doubling $r$ multiplies $r^2$ by 4, and doubling $h$ multiplies by another 2, for 8 in all. Volumes scale with the cube of the length ratio, areas with the square. That is why a pizza 2 times the diameter has 4 times the area.",
      },
      resolve: {
        kind: "mc",
        id: "msr-resolve-1",
        prompt: "A model car is built at scale 1 : 10. If the model's fuel tank holds 0.05 litres, the real one holds",
        options: [
          { id: "a", text: "50 litres", correct: true, why: "$0.05 \\times 10^3$." },
          { id: "b", text: "0.5 litres", misconception: "volume-scale-linear", why: "Volume scales by $10^3$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "msr-check-1",
        prompt: "A cone has radius 3 cm and height 4 cm. Its volume is",
        options: [
          { id: "a", text: "$12\\pi$ cm³", correct: true, why: "$\\tfrac13 \\times \\pi \\times 9 \\times 4$." },
          { id: "b", text: "$36\\pi$ cm³", misconception: "cone-volume-cylinder", why: "That is the cylinder with the same base and height." },
          { id: "c", text: "$15\\pi$ cm³", why: "That is the curved surface area $\\pi rl$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "msr-check-2",
        prompt: "The area of a triangle with sides 13, 14 and 15 is",
        options: [
          { id: "a", text: "84", correct: true, why: "$s = 21$; $\\sqrt{21 \\times 8 \\times 7 \\times 6} = 84$." },
          { id: "b", text: "91", why: "That is $\\tfrac12 \\times 13 \\times 14$, which assumes a right angle." },
          { id: "c", text: "42", why: "Check Heron's formula." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Volume scaling explains the curse of dimensionality: in $d$ dimensions a ball's volume scales as $r^d$, so almost all the volume of a high-dimensional ball lies near its surface and data spread thin (§{svm-knn-nb}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "msr-produce-1", prompt: "A sphere of radius 3 is melted and recast into a cylinder of radius 3. Find the cylinder's height.", answer: 4, explain: "$36\\pi = 9\\pi h$." },
        { kind: "number", id: "msr-produce-2", prompt: "Find the area of a trapezium with parallel sides 8 and 12 and height 5.", answer: 50, explain: "$\\tfrac12(20)(5)$." },
        {
          kind: "mc",
          id: "msr-produce-3",
          prompt: "Doubling the radius of a sphere multiplies its volume by",
          options: [
            { id: "a", text: "8", correct: true, why: "$2^3$." },
            { id: "b", text: "2", misconception: "volume-scale-linear", why: "Volume grows with $r^3$." },
          ],
        },
        {
          kind: "mc",
          id: "msr-produce-4",
          prompt: "A cone and a cylinder have the same base and height. The cone's volume is",
          options: [
            { id: "a", text: "one third of the cylinder's", correct: true, why: "$\\tfrac13\\pi r^2h$." },
            { id: "b", text: "equal to the cylinder's", misconception: "cone-volume-cylinder", why: "Three such cones fill the cylinder." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "msr-review-1", prompt: "A cylinder has radius 2 and height 7. Find its volume divided by $\\pi$.", answer: 28, explain: "$r^2h = 28$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "frustum and composite solids",
      body: "A **frustum** is a cone with its top cut off parallel to the base: with radii $R$ and $r$ and height $h$, $V = \\tfrac13\\pi h(R^2 + Rr + r^2)$, the difference of two cones. Composite solids (a cylinder topped with a hemisphere, say) add volumes; their surface area counts only exposed faces, so the shared circle is left out.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "Heron's formula",
      statement: "A triangle with sides $a, b, c$ and semi-perimeter $s = \\tfrac{a + b + c}{2}$ has area $\\sqrt{s(s - a)(s - b)(s - c)}$.",
      proof: ["Write the area as $\\tfrac12ab\\sin C$ and use the cosine rule for $\\cos C$; $\\sin^2C = 1 - \\cos^2C$ factorises into the product shown."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "a cone is a third of a cylinder",
      statement: "A pyramid or cone has one third of the volume of the prism or cylinder with the same base and height.",
      proof: ["Slice at height $t$ from the apex: the cross-section is the base scaled by $t/h$, so its area is $A(t/h)^2$. Adding up thin slices (an integral) gives $\\int_0^hA t^2/h^2\\,dt = \\tfrac13Ah$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "scaling",
      statement: "If every length of a solid is multiplied by $k$, its surface area is multiplied by $k^2$ and its volume by $k^3$.",
      proof: ["Each volume formula is a product of three lengths; each area formula of two."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the volume and total surface area of a cylinder with radius 3 cm and height 10 cm.",
      solution: ["$V = \\pi \\times 9 \\times 10 = 90\\pi \\approx 282.7$ cm³.", "$S = 2\\pi \\times 3 \\times 10 + 2\\pi \\times 9 = 78\\pi \\approx 245.0$ cm²."],
      result: "$90\\pi$ cm³; $78\\pi$ cm².",
    },
    {
      type: "example",
      level: 2,
      title: "a cone",
      problem: "A cone has radius 3 and height 4. Find its slant height, curved surface area and volume.",
      solution: ["$l = \\sqrt{9 + 16} = 5$; curved area $\\pi rl = 15\\pi$.", "$V = \\tfrac13\\pi \\times 9 \\times 4 = 12\\pi$."],
      result: "$l = 5$, $15\\pi$, $12\\pi$.",
    },
    {
      type: "example",
      level: 3,
      title: "recasting",
      problem: "A metal sphere of radius 6 cm is melted into small spheres of radius 1 cm. How many are made?",
      solution: ["Volume ratio $(6/1)^3 = 216$.", "216 small spheres."],
      result: "216.",
    },
  ],
  pitfalls: [
    { wrong: "Doubling dimensions doubles volume.", right: "It multiplies volume by 8 (and area by 4)." },
    { wrong: "Cone volume $\\pi r^2h$.", right: "$\\tfrac13\\pi r^2h$." },
    { wrong: "Count hidden faces in a composite solid's surface area.", right: "Include only the outside surface." },
  ],
  formulas: [
    { label: "Cylinder", tex: "V = \\pi r^2h,\\ S = 2\\pi rh + 2\\pi r^2" },
    { label: "Cone", tex: "V = \\tfrac13\\pi r^2h,\\ S = \\pi rl + \\pi r^2" },
    { label: "Sphere", tex: "V = \\tfrac43\\pi r^3,\\ S = 4\\pi r^2" },
    { label: "Heron", tex: "\\sqrt{s(s - a)(s - b)(s - c)}" },
  ],
  exercises: [
    ex(1, num("msrx-ex-1", "Find the volume of a cuboid 4 × 5 × 6.", 120, "Multiply."), ["$120$."]),
    ex(1, num("msrx-ex-2", "Find the area of a triangle with base 10 and height 7.", 35, "$\\tfrac12 \\times 70$."), ["$35$."]),
    ex(2, dp("msrx-ex-3", "Find the volume of a sphere of radius 3, divided by $\\pi$.", 36, "$\\tfrac43 \\times 27$."), ["$36$."]),
    ex(2, num("msrx-ex-4", "Find the area of a triangle with sides 5, 5 and 6.", 12, "$s = 8$: $\\sqrt{8 \\times 3 \\times 3 \\times 2}$."), ["$12$."]),
    ex(2, num("msrx-ex-5", "How many litres does a cuboid tank 2 m × 1.5 m × 1 m hold?", 3000, "$3\\text{ m}^3$."), ["$3000$ litres."]),
    ex(3, dp("msrx-ex-6", "A frustum has radii 4 and 2 and height 3. Find its volume divided by $\\pi$.", 28, "$\\tfrac13 \\times 3 \\times (16 + 8 + 4)$."), ["$28$."]),
    ex(3, num("msrx-ex-7", "A solid is a cylinder of radius 3 and height 5 with a hemisphere of radius 3 on top. Find its volume divided by $\\pi$.", 63, "$45 + 18$."), ["$9 \\times 5 + \\tfrac23 \\times 27 = 63$."]),
    ex(3, mc("msrx-ex-8", "A 10 cm model of a statue uses 50 g of bronze. A 1 m version (same shape and material) uses", ["50 kg", "Length ×10, volume ×1000."], [["500 g", "Volume scales by the cube."], ["5 kg", "That scales by the square."]]), ["Mass is proportional to volume."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const rad = r.int(1, 9);
      const h = r.int(2, 15);
      const shape = r.pick(["cylinder", "cone", "sphere"] as const);
      const v = shape === "cylinder" ? rad * rad * h : shape === "cone" ? (rad * rad * h) / 3 : (4 / 3) * rad ** 3;
      return n(`Find the volume of a ${shape} with radius ${rad}${shape === "sphere" ? "" : ` and height ${h}`}, divided by $\\pi$ (3 decimals).`, Math.round(v * 1000) / 1000, shape === "cylinder" ? `$r^2h = ${rad * rad} \\times ${h}$.` : shape === "cone" ? `$\\tfrac13r^2h = \\tfrac13 \\times ${rad * rad} \\times ${h}$.` : `$\\tfrac43r^3 = \\tfrac43 \\times ${rad ** 3}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c, area] = r.pick([[13, 14, 15, 84], [5, 5, 6, 12], [5, 5, 8, 12], [9, 10, 17, 36], [7, 15, 20, 42], [10, 10, 12, 48]] as const);
      return n(`Find the area of a triangle with sides ${a}, ${b} and ${c}.`, area, `$s = ${(a + b + c) / 2}$; Heron's formula gives ${area}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([2, 3, 4, 5, 10]);
      const v = r.int(2, 50);
      const what = r.pick(["volume", "surface area"] as const);
      const f = what === "volume" ? k ** 3 : k ** 2;
      return n(`A solid has ${what} ${v}. Every length is multiplied by ${k}. Find the new ${what}.`, v * f, `${what === "volume" ? "Volumes" : "Areas"} scale by $${k}^${what === "volume" ? 3 : 2} = ${f}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([2, 3, 4]);
      return mcNumbers(
        `A water tank is replaced by one ${k} times as long, wide and deep. It holds`,
        { text: `${k ** 3} times as much`, why: `Volume scales by $${k}^3$.` },
        [{ text: `${k} times as much`, why: "All three dimensions grow.", misconception: "volume-scale-linear" }, { text: `${k * k} times as much`, why: "That is area scaling." }],
      );
    },
  },
];
