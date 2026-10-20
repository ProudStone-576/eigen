import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Graphs of standard functions (polynomial, rational, root, exponential, logarithmic), special functions (modulus, greatest integer, fractional part, signum) and transformations of graphs (shifts, reflections, stretches, |f(x)| and f(|x|)). */

const fl = (x: number) => Math.floor(x + 1e-9);

const base: ConceptNode = {
  id: "function-graphs",
  title: "Special functions & graph transformations",
  summary: "A small library of graphs, lines, parabolas, cubics, 1/x, √x, exponentials, logarithms, the modulus and the greatest-integer function, covers most exam questions once you know how to move them. Adding outside the function shifts the graph vertically; changing x inside shifts or stretches it horizontally, in the direction opposite to what the sign suggests.",
  deps: ["functions-basics", "exponents-logs"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "greatest integer function", meaning: "$[x]$ or $\\lfloor x\\rfloor$: the largest integer $\\le x$; so $[2.7] = 2$ and $[-2.3] = -3$." },
    { term: "fractional part", meaning: "$\\{x\\} = x - [x]$, always in $[0, 1)$." },
    { term: "signum", meaning: "$\\operatorname{sgn}x = 1, 0, -1$ for $x > 0$, $x = 0$, $x < 0$." },
  ],
  misconceptions: {
    "shift-direction": "Thinks $f(x - 3)$ shifts the graph 3 units left.",
    "floor-negative": "Takes the greatest integer of a negative number by dropping its decimals, so $[-2.3] = -2$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Know a few graphs, draw thousands",
      body: "Sketching $y = 2^{x+1} - 3$ or $y = \\lvert x - 2\\rvert - 1$ from scratch is slow. Knowing the parent graphs $2^x$ and $\\lvert x\\rvert$ and how shifts and reflections move them makes it instant, and lets you count solutions of equations like $\\lvert x - 2\\rvert = \\ln x$ by seeing where two graphs cross.",
      realWorld: {
        title: "Postage and tax brackets",
        body: "Charges that jump at whole units, such as ₹40 per started kilogram of parcel, are greatest-integer functions: cost $= 40\\lceil w\\rceil$. Step functions like this appear in tariffs, tax slabs and rounding rules everywhere.",
      },
    },
    {
      type: "truth",
      statement: "For $k > 0$: $y = f(x) + k$ shifts **up** $k$; $y = f(x - k)$ shifts **right** $k$; $y = -f(x)$ reflects in the $x$-axis; $y = f(-x)$ reflects in the $y$-axis; $y = af(x)$ stretches vertically by $a$; $y = f(ax)$ compresses horizontally by $a$. $y = \\lvert f(x)\\rvert$ reflects the parts below the $x$-axis upward; $y = f(\\lvert x\\rvert)$ keeps the right half and mirrors it to the left. The **greatest integer** $[x]$ satisfies $[x] \\le x < [x] + 1$, and $[x] = n \\iff n \\le x < n + 1$.",
      body: "Parent graphs to know: $y = x^2$ (parabola), $y = x^3$, $y = \\tfrac1x$ (hyperbola with both axes as asymptotes), $y = \\sqrt x$, $y = a^x$ (through $(0, 1)$, asymptote $y = 0$), $y = \\log_ax$ (through $(1, 0)$, asymptote $x = 0$, the reflection of $a^x$ in $y = x$), $y = \\lvert x\\rvert$ (a V with vertex at 0), $y = [x]$ (steps, closed on the left), $y = \\{x\\}$ (sawtooth of period 1). The number of solutions of $f(x) = g(x)$ equals the number of intersections of the two graphs. For negative numbers the greatest integer goes **down**: $[-0.5] = -1$.",
    },
    {
      type: "predict",
      misconception: "shift-direction",
      item: {
        kind: "mc",
        id: "fgr-predict-1",
        prompt: "The graph of $y = (x - 3)^2$ is the graph of $y = x^2$",
        options: [
          { id: "a", text: "shifted 3 units right", correct: true, why: "Its vertex moves to $x = 3$." },
          { id: "b", text: "shifted 3 units left", misconception: "shift-direction", why: "The new graph reaches the old value at $x$ when $x - 3$ equals the old input." },
          { id: "c", text: "shifted 3 units down", why: "Vertical shifts come from adding outside." },
        ],
      },
      reveal: {
        body: "$(x - 3)^2$ takes at $x = 3$ the value $x^2$ took at 0, so everything happens 3 units later: the graph moves right. In general $f(x - h)$ moves right by $h$ and $f(x + h)$ moves left. The vertical rule matches intuition, $f(x) + k$ moves up by $k$; the horizontal one is reversed because it acts on the input.",
      },
      resolve: {
        kind: "mc",
        id: "fgr-resolve-1",
        prompt: "$y = \\sqrt{x + 4}$ starts at the point",
        options: [
          { id: "a", text: "$(-4, 0)$", correct: true, why: "$\\sqrt x$ starts at 0; $x + 4$ moves it 4 left." },
          { id: "b", text: "$(4, 0)$", misconception: "shift-direction", why: "Adding inside shifts left." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fgr-check-1",
        prompt: "$[-2.3]$ equals",
        options: [
          { id: "a", text: "$-3$", correct: true, why: "The largest integer not exceeding $-2.3$." },
          { id: "b", text: "$-2$", misconception: "floor-negative", why: "$-2$ is greater than $-2.3$." },
          { id: "c", text: "$2$", why: "The sign stays negative." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fgr-check-2",
        prompt: "The graph of $y = 2^{x+1} - 3$ has horizontal asymptote",
        options: [
          { id: "a", text: "$y = -3$", correct: true, why: "$2^x$ approaches 0; the curve is shifted down 3." },
          { id: "b", text: "$y = 0$", why: "The vertical shift moves the asymptote too." },
          { id: "c", text: "$x = -1$", why: "Exponentials have horizontal asymptotes." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Activation functions are transformed parent graphs: ReLU is $\\max(0, x)$, $\\tfrac12(x + \\lvert x\\rvert)$; a bias term shifts it horizontally and a weight stretches it (§{activation}). Quantisation of model weights uses rounding, a shifted greatest-integer function.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "fgr-produce-1", prompt: "Evaluate $[3.7] + [-3.7]$.", answer: -1, explain: "$3 + (-4)$." },
        { kind: "number", id: "fgr-produce-2", prompt: "Find the minimum value of $y = \\lvert x + 3\\rvert + 2$.", answer: 2, explain: "Vertex at $x = -3$." },
        {
          kind: "mc",
          id: "fgr-produce-3",
          prompt: "$y = \\ln(x - 2)$ has vertical asymptote",
          options: [
            { id: "a", text: "$x = 2$", correct: true, why: "$\\ln x$ shifted 2 right." },
            { id: "b", text: "$x = -2$", misconception: "shift-direction", why: "$x - 2$ shifts right." },
          ],
        },
        {
          kind: "mc",
          id: "fgr-produce-4",
          prompt: "$\\{-1.25\\}$, the fractional part, equals",
          options: [
            { id: "a", text: "0.75", correct: true, why: "$-1.25 - [-1.25] = -1.25 + 2$." },
            { id: "b", text: "0.25", misconception: "floor-negative", why: "$[-1.25] = -2$, not $-1$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "fgr-review-1", prompt: "Evaluate $\\{5.25\\}$.", answer: 0.25, explain: "$5.25 - 5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "properties of the greatest integer function",
      body: "$[x + n] = [x] + n$ for integers $n$; $[x] + [-x] = 0$ if $x$ is an integer and $-1$ otherwise; $x - 1 < [x] \\le x$. Equations in $[x]$ are solved for the integer $n = [x]$ first, then turned into intervals: $[x]^2 - 3[x] + 2 = 0$ gives $[x] = 1$ or 2, so $1 \\le x < 3$.",
    },
    {
      type: "definition",
      term: "even, odd and periodic graphs",
      body: "An even function's graph is symmetric in the $y$-axis ($x^2$, $\\lvert x\\rvert$); an odd function's is symmetric through the origin ($x^3$, $1/x$). $\\{x\\}$ repeats every 1, so it is periodic with period 1 (§{composition-inverse} develops these).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Rule",
      name: "order of transformations",
      statement: "For $y = af(b(x - h)) + k$, start from $f$: compress horizontally by $b$, shift right by $h$, stretch vertically by $a$ (reflecting if $a < 0$), then shift up by $k$.",
      proof: ["Each operation acts on the result of the previous; the point $(x_0, y_0)$ on $f$ maps to $(x_0/b + h, ay_0 + k)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "exponential and log are reflections",
      statement: "The graphs of $y = a^x$ and $y = \\log_ax$ are reflections of each other in the line $y = x$.",
      proof: ["$(p, q)$ is on $y = a^x$ iff $q = a^p$ iff $p = \\log_aq$ iff $(q, p)$ is on $y = \\log_ax$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "counting solutions graphically",
      statement: "The number of real solutions of $f(x) = g(x)$ equals the number of points where the graphs of $f$ and $g$ meet.",
      proof: ["A solution $x_0$ is exactly a common point $(x_0, f(x_0)) = (x_0, g(x_0))$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Describe $y = \\lvert x - 2\\rvert - 1$ and find where it meets the $x$-axis.",
      solution: ["The V of $\\lvert x\\rvert$ moved 2 right and 1 down: vertex $(2, -1)$.", "$\\lvert x - 2\\rvert = 1$ gives $x = 1$ or $3$."],
      result: "Vertex $(2, -1)$; zeros 1 and 3.",
    },
    {
      type: "example",
      level: 2,
      title: "an equation in [x]",
      problem: "Solve $[x]^2 - 3[x] + 2 = 0$.",
      solution: ["Let $n = [x]$: $n^2 - 3n + 2 = 0$, $n = 1$ or $2$.", "$[x] = 1$ gives $1 \\le x < 2$; $[x] = 2$ gives $2 \\le x < 3$."],
      result: "$1 \\le x < 3$.",
    },
    {
      type: "example",
      level: 3,
      title: "counting intersections",
      problem: "How many solutions has $\\lvert x\\rvert = 2^{-x}$?",
      solution: ["For $x \\ge 0$: $y = x$ rises from 0 while $2^{-x}$ falls from 1, so they cross once.", "For $x < 0$: $y = -x$ and $2^{-x} = 2^{\\lvert x\\rvert}$; the exponential is always larger ($2^t > t$), so no crossing."],
      result: "One solution.",
    },
  ],
  pitfalls: [
    { wrong: "$f(x - 3)$ moves the graph left.", right: "It moves it right." },
    { wrong: "$[-2.3] = -2$.", right: "$[-2.3] = -3$: round down, towards $-\\infty$." },
    { wrong: "Apply a horizontal stretch as multiplication outside.", right: "$f(2x)$ compresses horizontally; $2f(x)$ stretches vertically." },
  ],
  formulas: [
    { label: "Shifts", tex: "f(x - h) + k:\\ \\text{right } h,\\ \\text{up } k" },
    { label: "Reflections", tex: "-f(x):\\ x\\text{-axis};\\ f(-x):\\ y\\text{-axis}" },
    { label: "Greatest integer", tex: "[x] \\le x < [x] + 1" },
    { label: "Fractional part", tex: "\\{x\\} = x - [x] \\in [0, 1)" },
  ],
  exercises: [
    ex(1, num("fgrx-ex-1", "Evaluate $[-0.5]$.", -1, "Round down."), ["$-1$."]),
    ex(1, num("fgrx-ex-2", "The vertex of $y = (x - 2)^2 + 1$ has what $x$-coordinate?", 2, "Shifted 2 right."), ["$2$."]),
    ex(2, num("fgrx-ex-3", "Find the length of the solution set of $[x]^2 - 3[x] + 2 = 0$.", 2, "$1 \\le x < 3$."), ["$2$."]),
    ex(2, num("fgrx-ex-4", "How many solutions has $\\lvert x\\rvert = 3 - x^2$?", 2, "Two symmetric crossings."), ["For $x \\ge 0$: $x^2 + x - 3 = 0$ has one positive root; by symmetry one negative."]),
    ex(2, num("fgrx-ex-5", "Evaluate $\\sum_{k=1}^{10}[k/3]$.", 15, "Group by value."), ["$0 + 0 + 1 + 1 + 1 + 2 + 2 + 2 + 3 + 3 = 15$."]),
    ex(3, num("fgrx-ex-6", "How many integers $x$ in $[-5, 5]$ satisfy $[x/2] = 1$?", 2, "$2 \\le x < 4$."), ["$x = 2, 3$."]),
    ex(3, mc("fgrx-ex-7", "The graph of $y = f(\\lvert x\\rvert)$ is obtained from $y = f(x)$ by", ["keeping the part for $x \\ge 0$ and reflecting it in the $y$-axis", "It is even by construction."], [["reflecting negative $y$-values upward", "That is $\\lvert f(x)\\rvert$."], ["reflecting in the $x$-axis", "That is $-f(x)$."]]), ["Compare with $\\lvert f(x)\\rvert$."]),
    ex(3, mc("fgrx-ex-8", "$y = 3 - 2^{-x}$ has range", ["$(-\\infty, 3)$", "$2^{-x} > 0$, so $y < 3$."], [["$(3, \\infty)$", "Subtracting a positive number gives values below 3."], ["all reals", "The asymptote $y = 3$ is never reached."]]), ["Reflect, then shift up 3."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const x = r2(r.nonzero(-60, 60) / 10 + r.pick([0.25, 0.5, 0.75, 0.3]));
      const want = r.pick(["floor", "frac"] as const);
      const v = want === "floor" ? fl(x) : r2(x - fl(x));
      return n(`Evaluate ${want === "floor" ? `$[${x}]$` : `the fractional part $\\{${x}\\}$`}.`, v, want === "floor" ? `The largest integer $\\le ${x}$ is ${v}.` : `$${x} - [${x}] = ${x} - (${fl(x)}) = ${v}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const h = r.int(-6, 6);
      const k = r.int(-6, 6);
      const parent = r.pick(["(x - h)^2", "\\lvert x - h\\rvert"] as const);
      const sh = `x ${h < 0 ? "+" : "-"} ${Math.abs(h)}`;
      const shown = parent === "(x - h)^2" ? `(${sh})^2` : `\\lvert ${sh}\\rvert`;
      const want = r.pick(["x", "y"] as const);
      return n(`Find the ${want}-coordinate of the vertex of $y = ${shown} ${k < 0 ? "-" : "+"} ${Math.abs(k)}$.`, want === "x" ? h : k, `Shift right by ${h} and up by ${k}: vertex $(${h}, ${k})$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 4);
      const b = a + r.int(1, 3);
      return n(`Solve $[x]^2 - ${a + b}[x] + ${a * b} = 0$. Find the sum of the integers in the solution set.`, a + b, `$[x] = ${a}$ or $${b}$, so $x \\in [${a}, ${a + 1}) \\cup [${b}, ${b + 1})$, containing the integers ${a} and ${b}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const h = r.int(2, 7);
      return mcNumbers(
        `The graph of $y = f(x + ${h})$ is the graph of $y = f(x)$ shifted`,
        { text: `${h} units left`, why: "Adding inside the function shifts left." },
        [{ text: `${h} units right`, why: "That is $f(x - h)$.", misconception: "shift-direction" }, { text: `${h} units up`, why: "That is $f(x) + h$." }],
      );
    },
  },
];
