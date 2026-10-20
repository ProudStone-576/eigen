import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Compound-angle formulas; double, triple and half angles; product-to-sum and sum-to-product; a sin x + b cos x as a single sinusoid (maximum and minimum); conditional identities for angles of a triangle. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const rad = (d: number) => (d * Math.PI) / 180;

const base: ConceptNode = {
  id: "trig-identities",
  title: "Trigonometric identities",
  summary: "Sine and cosine of a sum are not sums of sines and cosines; they follow the compound-angle formulas, from which everything else follows: double and triple angles, half angles, and conversions between products and sums. Any combination a sin x + b cos x is a single wave R sin(x + α) with R = √(a² + b²), which gives its maximum and minimum at once.",
  deps: ["trig-ratios"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "compound angle", meaning: "An angle such as $A + B$ or $A - B$ built from two others." },
    { term: "double-angle formulas", meaning: "$\\sin 2A = 2\\sin A\\cos A$, $\\cos 2A = \\cos^2A - \\sin^2A = 1 - 2\\sin^2A = 2\\cos^2A - 1$." },
    { term: "amplitude form", meaning: "$a\\sin x + b\\cos x = R\\sin(x + \\alpha)$ with $R = \\sqrt{a^2 + b^2}$." },
  ],
  misconceptions: {
    "sin-sum-linear": "Treats sine as linear: $\\sin(A + B) = \\sin A + \\sin B$.",
    "double-angle-double": "Thinks $\\sin 2A = 2\\sin A$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Building every angle from a few",
      body: "Knowing only 30°, 45° and 60°, can you find $\\sin 75°$ or $\\cos 15°$ exactly? Can you find the maximum of $3\\sin x + 4\\cos x$ without calculus? Identities do both, and they are the workhorse of JEE trigonometry, needed again in integration, complex numbers and physics.",
      realWorld: {
        title: "Beats and radio",
        body: "Two notes of nearly equal frequency produce a pulsing \"beat\". The sum-to-product formula $\\sin a + \\sin b = 2\\sin\\tfrac{a + b}2\\cos\\tfrac{a - b}2$ explains it: a tone at the average frequency whose loudness swings at half the difference. AM radio relies on the same identity.",
      },
    },
    {
      type: "truth",
      statement: "$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$; $\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$; $\\tan(A \\pm B) = \\dfrac{\\tan A \\pm \\tan B}{1 \\mp \\tan A\\tan B}$. Hence $\\sin 2A = 2\\sin A\\cos A$, $\\cos 2A = 1 - 2\\sin^2A = 2\\cos^2A - 1$, $\\tan 2A = \\dfrac{2\\tan A}{1 - \\tan^2A}$, $\\sin 3A = 3\\sin A - 4\\sin^3A$, $\\cos 3A = 4\\cos^3A - 3\\cos A$. And $a\\sin x + b\\cos x = R\\sin(x + \\alpha)$ with $R = \\sqrt{a^2 + b^2}$, $\\tan\\alpha = b/a$, so it ranges over $[-R, R]$.",
      body: "**Sum to product**: $\\sin C + \\sin D = 2\\sin\\tfrac{C + D}2\\cos\\tfrac{C - D}2$, $\\sin C - \\sin D = 2\\cos\\tfrac{C + D}2\\sin\\tfrac{C - D}2$, $\\cos C + \\cos D = 2\\cos\\tfrac{C + D}2\\cos\\tfrac{C - D}2$, $\\cos C - \\cos D = -2\\sin\\tfrac{C + D}2\\sin\\tfrac{C - D}2$. **Product to sum**: $2\\sin A\\cos B = \\sin(A + B) + \\sin(A - B)$, $2\\cos A\\cos B = \\cos(A + B) + \\cos(A - B)$, $2\\sin A\\sin B = \\cos(A - B) - \\cos(A + B)$. **Half angles**: $\\sin^2\\tfrac A2 = \\tfrac{1 - \\cos A}2$, $\\cos^2\\tfrac A2 = \\tfrac{1 + \\cos A}2$. If $A + B + C = \\pi$, then $\\tan A + \\tan B + \\tan C = \\tan A\\tan B\\tan C$.",
    },
    {
      type: "predict",
      misconception: "sin-sum-linear",
      item: {
        kind: "mc",
        id: "tid-predict-1",
        prompt: "Find $\\sin 75°$ using $75° = 45° + 30°$.",
        options: [
          { id: "a", text: "$\\dfrac{\\sqrt6 + \\sqrt2}{4} \\approx 0.966$", correct: true, why: "$\\sin 45\\cos 30 + \\cos 45\\sin 30$." },
          { id: "b", text: "$\\sin 45° + \\sin 30° \\approx 1.207$", misconception: "sin-sum-linear", why: "Sine can't exceed 1; it isn't linear." },
          { id: "c", text: "$\\tfrac{\\sqrt3}{2}$", why: "That is $\\sin 60°$." },
        ],
      },
      reveal: {
        body: "$\\sin(45° + 30°) = \\tfrac{\\sqrt2}2 \\cdot \\tfrac{\\sqrt3}2 + \\tfrac{\\sqrt2}2 \\cdot \\tfrac12 = \\tfrac{\\sqrt6 + \\sqrt2}4$. Adding the sines gives about 1.21, impossible for a sine. Rotating by $A$ then by $B$ mixes the coordinates, which is exactly what the formula's cross terms record.",
      },
      resolve: {
        kind: "mc",
        id: "tid-resolve-1",
        prompt: "$\\cos(A + B)$ equals",
        options: [
          { id: "a", text: "$\\cos A\\cos B - \\sin A\\sin B$", correct: true, why: "The compound-angle formula." },
          { id: "b", text: "$\\cos A + \\cos B$", misconception: "sin-sum-linear", why: "Trig functions aren't linear." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tid-check-1",
        prompt: "$\\sin A = \\tfrac35$ with $A$ acute. $\\sin 2A$ equals",
        options: [
          { id: "a", text: "$\\tfrac{24}{25}$", correct: true, why: "$2 \\times \\tfrac35 \\times \\tfrac45$." },
          { id: "b", text: "$\\tfrac65$", misconception: "double-angle-double", why: "Doubling the sine can exceed 1; use $2\\sin A\\cos A$." },
          { id: "c", text: "$\\tfrac7{25}$", why: "That is $\\cos 2A$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tid-check-2",
        prompt: "The maximum of $3\\sin x + 4\\cos x$ is",
        options: [
          { id: "a", text: "5", correct: true, why: "$\\sqrt{9 + 16}$." },
          { id: "b", text: "7", why: "$\\sin$ and $\\cos$ can't both be 1 at once." },
          { id: "c", text: "4", why: "Combine into $R\\sin(x + \\alpha)$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Rotary position embeddings in large language models rotate query and key vectors by angles proportional to position; the compound-angle formula makes the attention score depend only on the difference of positions. Fourier features rely on the product-to-sum identities.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "tid-produce-1", prompt: "$\\tan A = \\tfrac12$ and $\\tan B = \\tfrac13$. Find $\\tan(A + B)$.", answer: 1, explain: "$\\dfrac{5/6}{1 - 1/6}$." },
        { kind: "number", id: "tid-produce-2", prompt: "Find the minimum of $5\\sin x - 12\\cos x + 20$.", answer: 7, explain: "$20 - 13$." },
        {
          kind: "mc",
          id: "tid-produce-3",
          prompt: "$\\sin(60° + 30°)$ equals",
          options: [
            { id: "a", text: "1", correct: true, why: "$\\sin 90°$." },
            { id: "b", text: "$\\tfrac{\\sqrt3 + 1}2$", misconception: "sin-sum-linear", why: "That adds the two sines." },
          ],
        },
        {
          kind: "mc",
          id: "tid-produce-4",
          prompt: "$\\cos 2A$ in terms of $\\cos A$ is",
          options: [
            { id: "a", text: "$2\\cos^2A - 1$", correct: true, why: "A double-angle form." },
            { id: "b", text: "$2\\cos A$", misconception: "double-angle-double", why: "Doubling the angle doesn't double the cosine." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "tid-review-1", prompt: "$\\cos A = 0.6$. Find $\\cos 2A$.", answer: -0.28, explain: "$2(0.36) - 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "useful values",
      body: "$\\sin 15° = \\dfrac{\\sqrt6 - \\sqrt2}4$, $\\cos 15° = \\dfrac{\\sqrt6 + \\sqrt2}4$, $\\tan 15° = 2 - \\sqrt3$, $\\tan 75° = 2 + \\sqrt3$, $\\sin 18° = \\dfrac{\\sqrt5 - 1}4$, $\\cos 36° = \\dfrac{\\sqrt5 + 1}4$. These appear constantly in JEE simplifications.",
    },
    {
      type: "definition",
      term: "the amplitude form",
      body: "Write $a\\sin x + b\\cos x = R(\\sin x\\cos\\alpha + \\cos x\\sin\\alpha)$ with $R\\cos\\alpha = a$, $R\\sin\\alpha = b$. Then $R = \\sqrt{a^2 + b^2}$ and the expression is $R\\sin(x + \\alpha)$, between $-R$ and $R$. So $a\\sin x + b\\cos x = c$ has solutions only if $\\lvert c\\rvert \\le R$ (§{trig-equations}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the compound-angle formula",
      statement: "$\\cos(A - B) = \\cos A\\cos B + \\sin A\\sin B$, and the other compound-angle formulas follow.",
      proof: [
        "The points $(\\cos A, \\sin A)$ and $(\\cos B, \\sin B)$ on the unit circle are separated by angle $A - B$; by the cosine rule (or the dot product) their distance squared is $2 - 2\\cos(A - B)$.",
        "Directly, it is $(\\cos A - \\cos B)^2 + (\\sin A - \\sin B)^2 = 2 - 2(\\cos A\\cos B + \\sin A\\sin B)$. Replace $B$ by $-B$, or $A$ by $\\tfrac\\pi2 - A$, for the rest.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "triple angles",
      statement: "$\\sin 3A = 3\\sin A - 4\\sin^3A$ and $\\cos 3A = 4\\cos^3A - 3\\cos A$.",
      proof: ["$\\sin 3A = \\sin 2A\\cos A + \\cos 2A\\sin A = 2\\sin A\\cos^2A + (1 - 2\\sin^2A)\\sin A$; replace $\\cos^2A$ by $1 - \\sin^2A$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "angles of a triangle",
      statement: "If $A + B + C = \\pi$ (none a right angle), then $\\tan A + \\tan B + \\tan C = \\tan A\\tan B\\tan C$.",
      proof: ["$\\tan(A + B) = \\tan(\\pi - C) = -\\tan C$, so $\\dfrac{\\tan A + \\tan B}{1 - \\tan A\\tan B} = -\\tan C$; clear the fraction."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $\\cos 15°$ exactly.",
      solution: ["$\\cos(45° - 30°) = \\cos 45\\cos 30 + \\sin 45\\sin 30$.", "$= \\tfrac{\\sqrt2}2 \\cdot \\tfrac{\\sqrt3}2 + \\tfrac{\\sqrt2}2 \\cdot \\tfrac12 = \\tfrac{\\sqrt6 + \\sqrt2}4 \\approx 0.966$."],
      result: "$\\tfrac{\\sqrt6 + \\sqrt2}4$.",
    },
    {
      type: "example",
      level: 2,
      title: "maximum and minimum",
      problem: "Find the range of $f(x) = 3\\sin x + 4\\cos x + 2$.",
      solution: ["$3\\sin x + 4\\cos x = 5\\sin(x + \\alpha)$ ranges over $[-5, 5]$.", "So $f$ ranges over $[-3, 7]$."],
      result: "$[-3, 7]$.",
    },
    {
      type: "example",
      level: 3,
      title: "a product to a sum",
      problem: "Evaluate $2\\sin 75°\\cos 15°$.",
      solution: ["$2\\sin A\\cos B = \\sin(A + B) + \\sin(A - B) = \\sin 90° + \\sin 60°$.", "$= 1 + \\tfrac{\\sqrt3}2 \\approx 1.866$."],
      result: "$1 + \\tfrac{\\sqrt3}{2}$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\sin(A + B) = \\sin A + \\sin B$.", right: "$\\sin A\\cos B + \\cos A\\sin B$." },
    { wrong: "$\\sin 2A = 2\\sin A$.", right: "$\\sin 2A = 2\\sin A\\cos A$." },
    { wrong: "Maximum of $a\\sin x + b\\cos x$ is $a + b$.", right: "It is $\\sqrt{a^2 + b^2}$." },
  ],
  formulas: [
    { label: "Compound", tex: "\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B" },
    { label: "Double", tex: "\\cos 2A = 1 - 2\\sin^2A = 2\\cos^2A - 1" },
    { label: "Triple", tex: "\\sin 3A = 3\\sin A - 4\\sin^3A" },
    { label: "Amplitude", tex: "a\\sin x + b\\cos x \\in [-\\sqrt{a^2 + b^2}, \\sqrt{a^2 + b^2}]" },
  ],
  exercises: [
    ex(1, dp("tidx-ex-1", "Find $\\sin 15°$.", Math.sin(rad(15)), "$\\sin(45° - 30°)$."), ["$\\tfrac{\\sqrt6 - \\sqrt2}4 \\approx 0.259$."]),
    ex(1, num("tidx-ex-2", "Find the maximum of $5\\sin x - 12\\cos x$.", 13, "$\\sqrt{25 + 144}$."), ["$13$."]),
    ex(2, dp("tidx-ex-3", "Evaluate $\\cos^2 15° - \\sin^2 15°$.", Math.cos(rad(30)), "It is $\\cos 30°$."), ["$\\tfrac{\\sqrt3}2 \\approx 0.866$."]),
    ex(2, num("tidx-ex-4", "Find the minimum of $3\\sin x + 4\\cos x + 2$.", -3, "$2 - 5$."), ["$-3$."]),
    ex(2, dp("tidx-ex-5", "$\\tan A = 2$. Find $\\tan 2A$.", -4 / 3, "$\\dfrac{4}{1 - 4}$."), ["$-\\tfrac43$."]),
    ex(3, dp("tidx-ex-6", "$\\sin A = \\tfrac13$. Find $\\sin 3A$.", 3 / 3 - 4 / 27, "$3\\sin A - 4\\sin^3A$."), ["$1 - \\tfrac4{27} = \\tfrac{23}{27} \\approx 0.852$."]),
    ex(3, num("tidx-ex-7", "In a triangle, $\\tan A = 1$ and $\\tan B = 2$. Find $\\tan C$.", 3, "$\\tan A + \\tan B + \\tan C = \\tan A\\tan B\\tan C$."), ["$3 + t = 2t$ gives $t = 3$."]),
    ex(3, mc("tidx-ex-8", "$\\sin 50° + \\sin 10°$ equals", ["$\\cos 20°$", "$2\\sin 30°\\cos 20°$."], [["$\\sin 60°$", "Sines don't add like that."], ["$2\\sin 30°$", "The cosine factor matters."]]), ["Sum to product."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, R] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [1, 1, Math.SQRT2]] as const);
      const c = r.int(-10, 10);
      const want = r.pick(["maximum", "minimum"] as const);
      const sb = r.pick([1, -1]);
      const v = want === "maximum" ? c + R : c - R;
      return n(`Find the ${want} of $${a}\\sin x ${sb < 0 ? "-" : "+"} ${b}\\cos x ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sqrt{${a * a} + ${b * b}} = ${r2(R)}$, so the ${want} is $${c} ${want === "maximum" ? "+" : "-"} ${r2(R)}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [s, c] = r.pick([[3, 4], [5, 12], [8, 15], [7, 24], [20, 21]] as const);
      const h = Math.sqrt(s * s + c * c);
      const sinA = s / h;
      const cosA = c / h;
      const want = r.pick(["sin 2A", "cos 2A", "tan 2A"] as const);
      const v = want === "sin 2A" ? 2 * sinA * cosA : want === "cos 2A" ? cosA * cosA - sinA * sinA : (2 * (s / c)) / (1 - (s / c) ** 2);
      return n(`$A$ is acute with $\\sin A = \\tfrac{${s}}{${h}}$. Find $\\${want.replace(" 2A", "")} 2A$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\cos A = \\tfrac{${c}}{${h}}$; use the double-angle formula: $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b] = r.pick([[45, 30], [60, 45], [45, 60], [60, 30], [30, 45]] as const);
      const op = r.pick(["+", "-"] as const);
      const fn = r.pick(["sin", "cos"] as const);
      const ang = op === "+" ? a + b : a - b;
      const v = fn === "sin" ? Math.sin(rad(ang)) : Math.cos(rad(ang));
      return n(`Use a compound-angle formula to find $\\${fn}(${a}° ${op} ${b}°)$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\${fn} ${ang}° \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b] = r.pick([[30, 60], [45, 45], [20, 40], [50, 40]] as const);
      return mcNumbers(
        `Which equals $\\sin(${a}° + ${b}°)$?`,
        { text: `$\\sin ${a}°\\cos ${b}° + \\cos ${a}°\\sin ${b}°$`, why: "The compound-angle formula." },
        [{ text: `$\\sin ${a}° + \\sin ${b}°$`, why: "Sine isn't linear.", misconception: "sin-sum-linear" }, { text: `$\\sin ${a}°\\sin ${b}° - \\cos ${a}°\\cos ${b}°$`, why: "That is $-\\cos(A + B)$." }],
      );
    },
  },
];
