import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Modulus–argument (polar) form, principal argument and quadrants, Euler's form, multiplication and division in polar form, De Moivre's theorem, powers and trigonometric identities from De Moivre. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "complex-polar",
  title: "Polar form & De Moivre's theorem",
  summary: "Every complex number is a distance and a direction: z = r(cos θ + i sin θ) = re^{iθ}, with r = |z| and θ = arg z. In this form multiplication is easy, multiply the moduli and add the arguments, so powers follow at once: (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ, De Moivre's theorem. The one trap is the argument: it must be read from the quadrant, not from tan⁻¹(b/a) alone.",
  deps: ["complex-algebra", "trig-identities"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "argument", meaning: "$\\arg z$: the angle from the positive real axis to $z$; the principal argument lies in $(-\\pi, \\pi]$." },
    { term: "polar form", meaning: "$z = r(\\cos\\theta + i\\sin\\theta)$, often written $r\\operatorname{cis}\\theta$ or $re^{i\\theta}$." },
    { term: "Euler's formula", meaning: "$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$." },
  ],
  misconceptions: {
    "arg-arctan": "Takes $\\arg(a + bi) = \\tan^{-1}(b/a)$ regardless of quadrant.",
    "demoivre-modulus": "Applies De Moivre to the angle but forgets to raise the modulus to the power.",
  },
  steps: [
    {
      type: "motivate",
      title: "Multiplication is rotation",
      body: "Multiplying by $i$ turns $1$ into $i$, $i$ into $-1$, $-1$ into $-i$: each time a quarter turn. In general, multiplying by a complex number rotates and scales. Writing numbers in polar form exposes this and makes $(1 + i)^{20}$ a one-line calculation instead of twenty multiplications.",
      realWorld: {
        title: "Phasors",
        body: "In power engineering, a sinusoidal voltage $V\\cos(\\omega t + \\phi)$ is represented by the complex number $Ve^{i\\phi}$. Phase shifts become additions of arguments and amplitude changes become multiplications of moduli.",
      },
    },
    {
      type: "truth",
      statement: "$z = a + bi = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}$ with $r = \\sqrt{a^2 + b^2}$, $\\cos\\theta = a/r$, $\\sin\\theta = b/r$. Then $z_1z_2 = r_1r_2e^{i(\\theta_1 + \\theta_2)}$ and $\\dfrac{z_1}{z_2} = \\dfrac{r_1}{r_2}e^{i(\\theta_1 - \\theta_2)}$, so $\\arg(z_1z_2) = \\arg z_1 + \\arg z_2$ (up to multiples of $2\\pi$). **De Moivre**: $(r(\\cos\\theta + i\\sin\\theta))^n = r^n(\\cos n\\theta + i\\sin n\\theta)$ for every integer $n$.",
      body: "Find the argument from the quadrant: with $\\alpha = \\tan^{-1}\\lvert b/a\\rvert$, the principal argument is $\\alpha$ (quadrant I), $\\pi - \\alpha$ (II), $-(\\pi - \\alpha)$ (III), $-\\alpha$ (IV). So $\\arg(-1 - i) = -\\tfrac{3\\pi}4$, not $\\tfrac\\pi4$. De Moivre gives multiple-angle formulas: expanding $(\\cos\\theta + i\\sin\\theta)^3$ and comparing real parts gives $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$ (§{trig-identities}). Also $\\bar z = re^{-i\\theta}$ and $\\dfrac1z = \\dfrac1re^{-i\\theta}$.",
    },
    {
      type: "predict",
      misconception: "arg-arctan",
      item: {
        kind: "mc",
        id: "cxp-predict-1",
        prompt: "The principal argument of $-1 - i$ is",
        options: [
          { id: "a", text: "$-\\tfrac{3\\pi}4$", correct: true, why: "Quadrant III, reference angle $\\tfrac\\pi4$." },
          { id: "b", text: "$\\tfrac\\pi4$, since $\\tan^{-1}\\tfrac{-1}{-1} = \\tan^{-1}1$", misconception: "arg-arctan", why: "That is the argument of $1 + i$, the opposite point." },
          { id: "c", text: "$\\tfrac{5\\pi}4$", why: "Correct angle, but outside the principal range $(-\\pi, \\pi]$." },
        ],
      },
      reveal: {
        body: "$\\tan^{-1}(b/a)$ can't tell $-1 - i$ from $1 + i$, because the ratio is the same. Plot it: $-1 - i$ is in quadrant III, $\\tfrac{3\\pi}4$ below the positive real axis, so the principal argument is $-\\tfrac{3\\pi}4$. Always locate the point first, then use the reference angle.",
      },
      resolve: {
        kind: "mc",
        id: "cxp-resolve-1",
        prompt: "The principal argument of $-\\sqrt3 + i$ is",
        options: [
          { id: "a", text: "$\\tfrac{5\\pi}6$", correct: true, why: "Quadrant II: $\\pi - \\tfrac\\pi6$." },
          { id: "b", text: "$-\\tfrac\\pi6$", misconception: "arg-arctan", why: "$\\tan^{-1}(-1/\\sqrt3)$ ignores the quadrant." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cxp-check-1",
        prompt: "$\\left(2(\\cos 20° + i\\sin 20°)\\right)^3$ equals",
        options: [
          { id: "a", text: "$8(\\cos 60° + i\\sin 60°)$", correct: true, why: "Cube the modulus, triple the angle." },
          { id: "b", text: "$2(\\cos 60° + i\\sin 60°)$", misconception: "demoivre-modulus", why: "The modulus must be cubed too." },
          { id: "c", text: "$6(\\cos 60° + i\\sin 60°)$", why: "$2^3$, not $3 \\times 2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cxp-check-2",
        prompt: "$(1 + i)^{10}$ equals",
        options: [
          { id: "a", text: "$32i$", correct: true, why: "$(\\sqrt2)^{10}e^{i \\cdot 10\\pi/4} = 32e^{i5\\pi/2} = 32i$." },
          { id: "b", text: "$32$", why: "The angle $\\tfrac{5\\pi}2$ points along $i$." },
          { id: "c", text: "$1024i$", why: "$\\lvert 1 + i\\rvert = \\sqrt2$, not 2." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The Fourier transform multiplies signals by $e^{-i\\omega t}$, and rotary position embeddings rotate pairs of coordinates exactly like multiplying by $e^{i\\theta}$; relative positions appear as differences of arguments.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cxp-produce-1", prompt: "$(1 + \\sqrt3i)^6 = a + bi$. Find $a$.", answer: 64, explain: "$2^6e^{i2\\pi}$." },
        { kind: "number", id: "cxp-produce-2", prompt: "$\\lvert z_1\\rvert = 3$, $\\arg z_1 = \\tfrac\\pi6$; $\\lvert z_2\\rvert = 4$, $\\arg z_2 = \\tfrac\\pi3$. Find $\\operatorname{Im}(z_1z_2)$.", answer: 12, explain: "$12e^{i\\pi/2} = 12i$." },
        {
          kind: "mc",
          id: "cxp-produce-3",
          prompt: "The principal argument of $1 - i$ is",
          options: [
            { id: "a", text: "$-\\tfrac\\pi4$", correct: true, why: "Quadrant IV." },
            { id: "b", text: "$\\tfrac{3\\pi}4$", misconception: "arg-arctan", why: "That is $-1 + i$." },
          ],
        },
        {
          kind: "mc",
          id: "cxp-produce-4",
          prompt: "$(3e^{i\\pi/8})^4$ equals",
          options: [
            { id: "a", text: "$81i$", correct: true, why: "$3^4e^{i\\pi/2}$." },
            { id: "b", text: "$3i$", misconception: "demoivre-modulus", why: "Raise 3 to the fourth power." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cxp-review-1", prompt: "$\\lvert z\\rvert = 2$. Find $\\lvert z^5\\rvert$.", answer: 32, explain: "$2^5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Euler's form",
      body: "$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$ lies on the unit circle, with $e^{i\\pi} = -1$ and $e^{i\\pi/2} = i$. Hence $\\cos\\theta = \\dfrac{e^{i\\theta} + e^{-i\\theta}}{2}$ and $\\sin\\theta = \\dfrac{e^{i\\theta} - e^{-i\\theta}}{2i}$, which turn trigonometric products into exponentials.",
    },
    {
      type: "definition",
      term: "argument rules",
      body: "$\\arg(z_1z_2) = \\arg z_1 + \\arg z_2$, $\\arg(z_1/z_2) = \\arg z_1 - \\arg z_2$, $\\arg\\bar z = -\\arg z$, $\\arg z^n = n\\arg z$, each modulo $2\\pi$: after adding, bring the result back into $(-\\pi, \\pi]$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "multiplication in polar form",
      statement: "$r_1(\\cos\\alpha + i\\sin\\alpha) \\cdot r_2(\\cos\\beta + i\\sin\\beta) = r_1r_2(\\cos(\\alpha + \\beta) + i\\sin(\\alpha + \\beta))$.",
      proof: ["Expand: the real part is $r_1r_2(\\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta) = r_1r_2\\cos(\\alpha + \\beta)$ and the imaginary part is $r_1r_2\\sin(\\alpha + \\beta)$ by the compound-angle formulas."],
    },
    {
      type: "theorem",
      name: "De Moivre's theorem",
      statement: "$(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta$ for all integers $n$.",
      proof: [
        "For $n \\ge 1$, induct using the multiplication rule: multiplying by $\\cos\\theta + i\\sin\\theta$ adds $\\theta$ to the angle.",
        "For $n = -m < 0$, $(\\cos\\theta + i\\sin\\theta)^{-1} = \\cos\\theta - i\\sin\\theta = \\cos(-\\theta) + i\\sin(-\\theta)$; apply the positive case.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "computing large powers",
      statement: "To find $(a + bi)^n$: write it as $re^{i\\theta}$, compute $r^ne^{in\\theta}$, reduce $n\\theta$ modulo $2\\pi$, and convert back with $\\cos$ and $\\sin$.",
      proof: ["Direct from De Moivre; reducing the angle uses periodicity of $\\cos$ and $\\sin$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Write $-\\sqrt3 + i$ in polar form.",
      solution: ["$r = \\sqrt{3 + 1} = 2$; quadrant II with reference angle $\\tfrac\\pi6$.", "$\\theta = \\tfrac{5\\pi}6$: $-\\sqrt3 + i = 2(\\cos\\tfrac{5\\pi}6 + i\\sin\\tfrac{5\\pi}6)$."],
      result: "$2e^{i5\\pi/6}$.",
    },
    {
      type: "example",
      level: 2,
      title: "a large power",
      problem: "Compute $(1 + i)^{10}$.",
      solution: ["$1 + i = \\sqrt2e^{i\\pi/4}$; $(\\sqrt2)^{10} = 32$, angle $\\tfrac{10\\pi}4 = \\tfrac{5\\pi}2 \\equiv \\tfrac\\pi2$.", "$32e^{i\\pi/2} = 32i$."],
      result: "$32i$.",
    },
    {
      type: "example",
      level: 3,
      title: "an identity from De Moivre",
      problem: "Express $\\cos 3\\theta$ in terms of $\\cos\\theta$.",
      solution: ["$(c + is)^3 = c^3 + 3ic^2s - 3cs^2 - is^3$, with $c = \\cos\\theta$, $s = \\sin\\theta$.", "Real part: $\\cos 3\\theta = c^3 - 3cs^2 = c^3 - 3c(1 - c^2) = 4c^3 - 3c$."],
      result: "$4\\cos^3\\theta - 3\\cos\\theta$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\arg(a + bi) = \\tan^{-1}(b/a)$.", right: "Plot the point and use the quadrant." },
    { wrong: "$(re^{i\\theta})^n = re^{in\\theta}$.", right: "$r^ne^{in\\theta}$." },
    { wrong: "Leave an argument outside $(-\\pi, \\pi]$ when the principal value is asked.", right: "Add or subtract $2\\pi$." },
  ],
  formulas: [
    { label: "Polar", tex: "z = re^{i\\theta} = r(\\cos\\theta + i\\sin\\theta)" },
    { label: "Product", tex: "z_1z_2 = r_1r_2e^{i(\\theta_1 + \\theta_2)}" },
    { label: "De Moivre", tex: "(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta" },
    { label: "Euler", tex: "e^{i\\pi} + 1 = 0" },
  ],
  exercises: [
    ex(1, num("cxpx-ex-1", "Find $\\lvert(1 + i)^8\\rvert$.", 16, "$(\\sqrt2)^8$."), ["$16$."]),
    ex(1, dp("cxpx-ex-2", "Find the principal argument of $-1 - i$, divided by $\\pi$.", -0.75, "Quadrant III."), ["$-0.75$."]),
    ex(2, num("cxpx-ex-3", "Find $\\operatorname{Re}\\left((1 + i)^8\\right)$.", 16, "$16e^{i2\\pi}$."), ["$16$."]),
    ex(2, dp("cxpx-ex-4", "Find $\\operatorname{Re}\\left((\\cos 20° + i\\sin 20°)^3\\right)$.", 0.5, "$\\cos 60°$."), ["$0.5$."]),
    ex(2, num("cxpx-ex-5", "Find $(\\sqrt3 + i)^6$ (it is real).", -64, "$2^6e^{i\\pi}$."), ["$-64$."]),
    ex(3, num("cxpx-ex-6", "Find the least positive integer $n$ for which $(1 + i)^n$ is real and positive.", 8, "Angle $n\\pi/4$ must be a multiple of $2\\pi$."), ["$n = 8$."]),
    ex(3, dp("cxpx-ex-7", "$z = 2e^{i\\pi/3}$. Find $\\operatorname{Im}(z^{-1})$.", -Math.sqrt(3) / 4, "$\\tfrac12e^{-i\\pi/3}$."), ["$-\\tfrac{\\sqrt3}4 \\approx -0.433$."]),
    ex(3, mc("cxpx-ex-8", "$\\arg z_1 = \\tfrac{3\\pi}4$ and $\\arg z_2 = \\tfrac\\pi2$. The principal argument of $z_1z_2$ is", ["$-\\tfrac{3\\pi}4$", "$\\tfrac{5\\pi}4 - 2\\pi$."], [["$\\tfrac{5\\pi}4$", "Outside $(-\\pi, \\pi]$."], ["$\\tfrac\\pi4$", "Arguments add."]]), ["Reduce after adding."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, label] = r.pick([[1, 1, "1 + i"], [1, -1, "1 - i"], [-1, 1, "-1 + i"], [-1, -1, "-1 - i"], [Math.sqrt(3), 1, "\\sqrt3 + i"], [-Math.sqrt(3), 1, "-\\sqrt3 + i"], [1, -Math.sqrt(3), "1 - \\sqrt3i"], [-1, -Math.sqrt(3), "-1 - \\sqrt3i"]] as const);
      const v = Math.atan2(b, a) / Math.PI;
      return n(`Find the principal argument of $${label}$, divided by $\\pi$ (3 decimals).`, Math.round(v * 1000) / 1000, `Locate the quadrant, then use the reference angle: $\\arg = ${Math.round(v * 1000) / 1000}\\pi$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, label, rr] = r.pick([[1, 1, "1 + i", Math.SQRT2], [1, Math.sqrt(3), "1 + \\sqrt3i", 2], [Math.sqrt(3), 1, "\\sqrt3 + i", 2], [1, -1, "1 - i", Math.SQRT2]] as const);
      const nn = r.int(2, 12);
      const th = Math.atan2(b, a) * nn;
      const want = r.pick(["Re", "Im"] as const);
      const v = rr ** nn * (want === "Re" ? Math.cos(th) : Math.sin(th));
      const vv = Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1000) / 1000;
      return n(`Find $\\operatorname{${want}}\\left((${label})^{${nn}}\\right)$ (3 decimals).`, vv, `$(${label})^{${nn}} = ${r2(rr)}^{${nn}}e^{i \\cdot ${nn}\\arg}$; the ${want === "Re" ? "real" : "imaginary"} part is $${vv}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = r.int(2, 5);
      const k = r.int(2, 6);
      return n(`$\\lvert z\\rvert = ${m}$. Find $\\lvert z^{${k}}\\rvert$.`, m ** k, `$${m}^{${k}}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [m, k, d] = r.pick([[2, 3, 18], [3, 2, 24], [2, 4, 16], [5, 2, 10]] as const);
      return mcNumbers(
        `$\\left(${m}e^{i\\pi/${d}}\\right)^{${k}}$ equals`,
        { text: `$${m ** k}e^{i${k}\\pi/${d}}$`, why: "Raise the modulus to the power and multiply the angle." },
        [{ text: `$${m}e^{i${k}\\pi/${d}}$`, why: "The modulus must be raised too.", misconception: "demoivre-modulus" }, { text: `$${m * k}e^{i${k}\\pi/${d}}$`, why: `$${m}^{${k}}$, not $${m} \\times ${k}$.` }],
      );
    },
  },
];
