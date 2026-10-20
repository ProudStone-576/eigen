import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Angles in degrees and radians, arc length; right-triangle and unit-circle definitions of the trigonometric ratios; standard values; signs by quadrant; allied angles; graphs, periods and ranges; reciprocal ratios and the Pythagorean identities. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const rad = (d: number) => (d * Math.PI) / 180;

const base: ConceptNode = {
  id: "trig-ratios",
  title: "Angles, radians & trigonometric ratios",
  summary: "In a right triangle, sine, cosine and tangent are ratios of sides. On the unit circle they extend to every angle: the point at angle θ is (cos θ, sin θ). Radians measure angles by arc length, so 180° is π. Each ratio's sign depends on the quadrant, allied-angle rules turn any angle into an acute one, and the identity sin²θ + cos²θ = 1 is Pythagoras on the unit circle.",
  deps: ["plane-geometry", "functions-basics"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "radian", meaning: "The angle subtending an arc equal to the radius; $\\pi\\text{ rad} = 180°$." },
    { term: "unit circle", meaning: "The circle of radius 1 about the origin; the point at angle $\\theta$ from the positive $x$-axis is $(\\cos\\theta, \\sin\\theta)$." },
    { term: "reference angle", meaning: "The acute angle between the terminal side and the $x$-axis, used with the quadrant sign to evaluate any ratio." },
  ],
  misconceptions: {
    "quadrant-sign": "Uses the acute-angle value with the wrong sign, for example $\\cos 120° = +\\tfrac12$.",
    "radian-degree": "Mixes radians and degrees, for example treating $\\sin 30$ (radians) as $\\sin 30°$.",
  },
  steps: [
    {
      type: "motivate",
      title: "From triangles to circles",
      body: "Surveyors find a building's height from one angle and one distance; engineers describe alternating current and sound as waves. Both use the same three ratios, first defined in right triangles and then extended around the circle so that angles of 120°, 300° or −45° make sense too.",
      realWorld: {
        title: "GPS and navigation",
        body: "Converting between latitude–longitude and distances on Earth's surface uses sines and cosines of angles in radians; the arc length $r\\theta$ with $r \\approx 6371$ km gives great-circle distances.",
      },
    },
    {
      type: "truth",
      statement: "In a right triangle with angle $\\theta$: $\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}}$, $\\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}}$, $\\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}}$. On the unit circle, $(\\cos\\theta, \\sin\\theta)$ is the point at angle $\\theta$, and $\\tan\\theta = \\sin\\theta/\\cos\\theta$. **Radians**: $\\pi\\text{ rad} = 180°$, and an arc of angle $\\theta$ (radians) on radius $r$ has length $r\\theta$. **Signs**: all positive in quadrant I, only $\\sin$ in II, only $\\tan$ in III, only $\\cos$ in IV. **Allied angles**: $\\sin(\\pi - \\theta) = \\sin\\theta$, $\\cos(\\pi - \\theta) = -\\cos\\theta$, $\\sin(-\\theta) = -\\sin\\theta$, $\\cos(-\\theta) = \\cos\\theta$, $\\sin(\\tfrac\\pi2 - \\theta) = \\cos\\theta$.",
      body: "Standard values: $\\sin 0, 30°, 45°, 60°, 90° = 0, \\tfrac12, \\tfrac{\\sqrt2}2, \\tfrac{\\sqrt3}2, 1$ and cosines in reverse; $\\tan 30°, 45°, 60° = \\tfrac1{\\sqrt3}, 1, \\sqrt3$. $\\sin$ and $\\cos$ have period $2\\pi$ and range $[-1, 1]$; $\\tan$ has period $\\pi$ and is undefined at odd multiples of $\\tfrac\\pi2$. Reciprocals: $\\csc\\theta = 1/\\sin\\theta$, $\\sec\\theta = 1/\\cos\\theta$, $\\cot\\theta = 1/\\tan\\theta$. **Pythagorean identities**: $\\sin^2\\theta + \\cos^2\\theta = 1$, $1 + \\tan^2\\theta = \\sec^2\\theta$, $1 + \\cot^2\\theta = \\csc^2\\theta$. To evaluate any ratio: find the reference angle, take its value, attach the quadrant's sign.",
    },
    {
      type: "predict",
      misconception: "quadrant-sign",
      item: {
        kind: "mc",
        id: "trr-predict-1",
        prompt: "$\\cos 120°$ equals",
        options: [
          { id: "a", text: "$-\\tfrac12$", correct: true, why: "Reference angle 60° in quadrant II, where cosine is negative." },
          { id: "b", text: "$\\tfrac12$", misconception: "quadrant-sign", why: "120° is in quadrant II: the $x$-coordinate is negative." },
          { id: "c", text: "$\\tfrac{\\sqrt3}{2}$", why: "That is $\\sin 120°$." },
        ],
      },
      reveal: {
        body: "On the unit circle, 120° lands in quadrant II, at $(-\\tfrac12, \\tfrac{\\sqrt3}2)$. Its reference angle is $180° - 120° = 60°$, so the size is $\\cos 60° = \\tfrac12$, but the $x$-coordinate is to the left, so $\\cos 120° = -\\tfrac12$. Using allied angles: $\\cos(180° - 60°) = -\\cos 60°$.",
      },
      resolve: {
        kind: "mc",
        id: "trr-resolve-1",
        prompt: "$\\sin 210°$ equals",
        options: [
          { id: "a", text: "$-\\tfrac12$", correct: true, why: "Quadrant III: sine negative; reference 30°." },
          { id: "b", text: "$\\tfrac12$", misconception: "quadrant-sign", why: "Sine is negative below the $x$-axis." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "trr-check-1",
        prompt: "A wheel of radius 0.5 m turns through 3 radians. How far does a point on its rim travel?",
        options: [
          { id: "a", text: "1.5 m", correct: true, why: "$s = r\\theta = 0.5 \\times 3$." },
          { id: "b", text: "about 0.026 m", misconception: "radian-degree", why: "That treats 3 radians as 3°." },
          { id: "c", text: "6 m", why: "Multiply by the radius, don't divide." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "trr-check-2",
        prompt: "$\\sin\\theta = \\tfrac35$ with $\\theta$ in quadrant II. Then $\\tan\\theta$ is",
        options: [
          { id: "a", text: "$-\\tfrac34$", correct: true, why: "$\\cos\\theta = -\\tfrac45$ in quadrant II." },
          { id: "b", text: "$\\tfrac34$", why: "Cosine is negative in quadrant II, so tangent is too." },
          { id: "c", text: "$-\\tfrac43$", why: "$\\tan = \\sin/\\cos$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Transformers encode token positions with sines and cosines of different frequencies, and cyclical features such as hour of day or month are encoded as $(\\sin, \\cos)$ pairs so that 23:00 is close to 00:00. Cosine similarity between vectors is the cosine of the angle between them (§{vector}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "trr-produce-1", prompt: "Convert 150° to radians and give the result divided by $\\pi$, as a decimal to 3 places.", answer: Math.round((150 / 180) * 1000) / 1000, tolerance: 0.001, explain: "$150/180 = 5/6$." },
        { kind: "number", id: "trr-produce-2", prompt: "Evaluate $\\sin^2 20° + \\sin^2 70°$.", answer: 1, explain: "$\\sin 70° = \\cos 20°$." },
        {
          kind: "mc",
          id: "trr-produce-3",
          prompt: "$\\tan 135°$ equals",
          options: [
            { id: "a", text: "$-1$", correct: true, why: "Quadrant II; reference 45°." },
            { id: "b", text: "1", misconception: "quadrant-sign", why: "Tangent is negative in quadrant II." },
          ],
        },
        {
          kind: "mc",
          id: "trr-produce-4",
          prompt: "A calculator in radian mode is used to find $\\sin 30°$ by typing $\\sin(30)$. The displayed value is",
          options: [
            { id: "a", text: "about $-0.988$, the sine of 30 radians", correct: true, why: "Convert 30° to $\\pi/6$ first." },
            { id: "b", text: "0.5", misconception: "radian-degree", why: "In radian mode, 30 means 30 radians." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "trr-review-1", prompt: "Evaluate $\\sec 60°$.", answer: 2, explain: "$1/\\cos 60°$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "allied angles",
      body: "For angles $n\\cdot\\tfrac\\pi2 \\pm \\theta$: if $n$ is even, the ratio is unchanged (sin stays sin); if $n$ is odd, it switches to the co-ratio (sin ↔ cos, tan ↔ cot). The sign is that of the original ratio in the quadrant where $n\\tfrac\\pi2 \\pm \\theta$ lies, treating $\\theta$ as acute. So $\\cos(\\tfrac{3\\pi}2 + \\theta) = \\sin\\theta$ (quadrant IV, cosine positive).",
    },
    {
      type: "definition",
      term: "graphs",
      body: "$y = \\sin x$ starts at 0, peaks at $\\tfrac\\pi2$, returns to 0 at $\\pi$ and repeats every $2\\pi$. $\\cos x$ is the same wave shifted left by $\\tfrac\\pi2$. $y = A\\sin(Bx + C)$ has amplitude $\\lvert A\\rvert$ and period $\\dfrac{2\\pi}{\\lvert B\\rvert}$ (§{composition-inverse}). $\\tan x$ rises through each interval $(-\\tfrac\\pi2, \\tfrac\\pi2) + n\\pi$ with vertical asymptotes between.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the Pythagorean identity",
      statement: "$\\sin^2\\theta + \\cos^2\\theta = 1$ for every angle $\\theta$; dividing by $\\cos^2\\theta$ or $\\sin^2\\theta$ gives $1 + \\tan^2\\theta = \\sec^2\\theta$ and $1 + \\cot^2\\theta = \\csc^2\\theta$.",
      proof: ["$(\\cos\\theta, \\sin\\theta)$ lies on the unit circle $x^2 + y^2 = 1$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "special triangles",
      statement: "$\\sin 30° = \\tfrac12$, $\\sin 45° = \\tfrac{\\sqrt2}{2}$, $\\sin 60° = \\tfrac{\\sqrt3}{2}$.",
      proof: ["Halve an equilateral triangle of side 2: sides $1, \\sqrt3, 2$ give 30° and 60°. An isosceles right triangle with legs 1 has hypotenuse $\\sqrt2$, giving 45° (§{plane-geometry})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "arc length and sector area",
      statement: "With $\\theta$ in radians, an arc has length $r\\theta$ and a sector area $\\tfrac12r^2\\theta$.",
      proof: ["A full turn is $2\\pi$ radians with circumference $2\\pi r$ and area $\\pi r^2$; scale by $\\theta/2\\pi$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Evaluate $\\sin 330°$, $\\cos(-\\tfrac\\pi3)$ and $\\tan 225°$.",
      solution: ["330° is in quadrant IV, reference 30°: $\\sin 330° = -\\tfrac12$. $\\cos(-\\tfrac\\pi3) = \\cos\\tfrac\\pi3 = \\tfrac12$.", "225° is in quadrant III, reference 45°: $\\tan 225° = 1$."],
      result: "$-\\tfrac12$, $\\tfrac12$, $1$.",
    },
    {
      type: "example",
      level: 2,
      title: "from one ratio to all",
      problem: "$\\tan\\theta = \\tfrac5{12}$ with $\\theta$ in quadrant III. Find $\\sin\\theta$ and $\\cos\\theta$.",
      solution: ["A right triangle with sides 5, 12, 13 gives sizes $\\tfrac5{13}$ and $\\tfrac{12}{13}$.", "Quadrant III: both negative. $\\sin\\theta = -\\tfrac5{13}$, $\\cos\\theta = -\\tfrac{12}{13}$."],
      result: "$-\\tfrac5{13}$ and $-\\tfrac{12}{13}$.",
    },
    {
      type: "example",
      level: 3,
      title: "allied angles",
      problem: "Simplify $\\dfrac{\\sin(\\pi - \\theta)\\cos(\\tfrac\\pi2 + \\theta)}{\\cos(-\\theta)\\tan(\\pi + \\theta)}$.",
      solution: ["$\\sin(\\pi - \\theta) = \\sin\\theta$, $\\cos(\\tfrac\\pi2 + \\theta) = -\\sin\\theta$, $\\cos(-\\theta) = \\cos\\theta$, $\\tan(\\pi + \\theta) = \\tan\\theta$.", "$\\dfrac{-\\sin^2\\theta}{\\cos\\theta \\cdot \\sin\\theta/\\cos\\theta} = -\\sin\\theta$."],
      result: "$-\\sin\\theta$.",
    },
  ],
  pitfalls: [
    { wrong: "Use the acute value without the quadrant sign.", right: "Remember: All, Sin, Tan, Cos positive in quadrants I–IV." },
    { wrong: "Mix radians and degrees.", right: "Use radians in $r\\theta$, in calculus, and check the calculator mode." },
    { wrong: "$\\sin^2\\theta$ means $\\sin(\\theta^2)$.", right: "It means $(\\sin\\theta)^2$." },
  ],
  formulas: [
    { label: "Conversion", tex: "\\pi\\text{ rad} = 180°" },
    { label: "Identities", tex: "\\sin^2\\theta + \\cos^2\\theta = 1,\\ 1 + \\tan^2\\theta = \\sec^2\\theta" },
    { label: "Allied", tex: "\\sin(\\pi - \\theta) = \\sin\\theta,\\ \\cos(\\pi - \\theta) = -\\cos\\theta" },
    { label: "Arc", tex: "s = r\\theta" },
  ],
  exercises: [
    ex(1, num("trrx-ex-1", "Evaluate $\\sin 330°$.", -0.5, "Quadrant IV."), ["$-\\tfrac12$."]),
    ex(1, num("trrx-ex-2", "Evaluate $\\cos\\tfrac{2\\pi}{3}$.", -0.5, "120°, quadrant II."), ["$-\\tfrac12$."]),
    ex(2, dp("trrx-ex-3", "Convert 135° to radians.", (3 * Math.PI) / 4, "$\\tfrac{3\\pi}4$."), ["$\\approx 2.356$."]),
    ex(2, dp("trrx-ex-4", "$\\tan\\theta = \\tfrac5{12}$ in quadrant III. Find $\\sin\\theta$.", -5 / 13, "Negative in III."), ["$-\\tfrac5{13} \\approx -0.385$."]),
    ex(2, num("trrx-ex-5", "An arc of length 15 cm lies on a circle of radius 6 cm. Find the angle in radians.", 2.5, "$\\theta = s/r$."), ["$2.5$."]),
    ex(3, num("trrx-ex-6", "Evaluate $\\sin^2 10° + \\sin^2 20° + \\dots + \\sin^2 80°$ (8 terms).", 4, "Pair $\\sin^2\\theta + \\sin^2(90° - \\theta) = 1$."), ["Four pairs: 4."]),
    ex(3, dp("trrx-ex-7", "Evaluate $\\cos 300° + \\tan 315° + \\sin 240°$.", 0.5 - 1 - Math.sqrt(3) / 2, "$\\tfrac12 - 1 - \\tfrac{\\sqrt3}2$."), ["$\\approx -1.366$."]),
    ex(3, mc("trrx-ex-8", "The period of $y = 3\\sin(4x - 1)$ is", ["$\\tfrac\\pi2$", "$2\\pi/4$."], [["$8\\pi$", "Divide by 4, don't multiply."], ["$2\\pi$", "The 4 compresses the wave."]]), ["Amplitude 3 doesn't change the period."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const refs = [30, 45, 60];
      const ref = r.pick(refs);
      const quad = r.int(1, 4);
      const deg = quad === 1 ? ref : quad === 2 ? 180 - ref : quad === 3 ? 180 + ref : 360 - ref;
      const fn = r.pick(["sin", "cos", "tan"] as const);
      const v = fn === "sin" ? Math.sin(rad(deg)) : fn === "cos" ? Math.cos(rad(deg)) : Math.tan(rad(deg));
      return n(`Evaluate $\\${fn} ${deg}°$ (3 decimals).`, Math.round(v * 1000) / 1000, `Reference angle ${ref}°, quadrant ${["I", "II", "III", "IV"][quad - 1]}: $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const d = r.pick([15, 20, 36, 72, 105, 210, 225, 270, 300, 330]);
      return n(`Convert ${d}° to radians (3 decimals).`, Math.round(rad(d) * 1000) / 1000, `$${d} \\times \\pi/180 \\approx ${Math.round(rad(d) * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const radius = r.int(2, 12);
      const th = r2(r.int(2, 30) / 10);
      const want = r.pick(["arc", "sector"] as const);
      const v = want === "arc" ? radius * th : 0.5 * radius * radius * th;
      return n(`A circle has radius ${radius}. For a central angle of ${th} radians, find the ${want === "arc" ? "arc length" : "sector area"} (2 decimals).`, r2(v), want === "arc" ? `$r\\theta = ${radius} \\times ${th}$.` : `$\\tfrac12r^2\\theta = \\tfrac12 \\times ${radius * radius} \\times ${th}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { a: "\\cos 150°", right: "-\\tfrac{\\sqrt3}2", wrong: "\\tfrac{\\sqrt3}2" },
        { a: "\\sin 240°", right: "-\\tfrac{\\sqrt3}2", wrong: "\\tfrac{\\sqrt3}2" },
        { a: "\\tan 300°", right: "-\\sqrt3", wrong: "\\sqrt3" },
        { a: "\\cos 225°", right: "-\\tfrac{\\sqrt2}2", wrong: "\\tfrac{\\sqrt2}2" },
      ]);
      return mcNumbers(
        `$${v.a}$ equals`,
        { text: `$${v.right}$`, why: "Reference angle value with the quadrant's sign." },
        [{ text: `$${v.wrong}$`, why: "The quadrant makes it negative.", misconception: "quadrant-sign" }],
      );
    },
  },
];
