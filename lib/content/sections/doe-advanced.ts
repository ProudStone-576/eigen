import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Design of experiments: randomised blocks, Latin squares, 2^k and fractional factorials, aliasing, response surfaces, ANOVA power. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "doe-advanced",
  title: "Blocks, Latin squares & response surfaces",
  summary: "Designed experiments get the most information from the fewest runs. Latin squares control two nuisance factors at once; 2^k factorials study many factors in few runs, and fractional factorials fewer still, at the price of aliasing some effects together; response surface designs fit a curved model to find the best settings.",
  deps: ["two-way-anova", "errors-power"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "Latin square", meaning: "An $n \\times n$ layout in which each of $n$ treatments appears once in every row and once in every column." },
    { term: "aliasing", meaning: "Two effects that a design cannot tell apart because their columns of signs are identical; also called confounding." },
    { term: "response surface", meaning: "A fitted curved model of the response over the factor settings, used to find an optimum." },
  ],
  misconceptions: {
    "fractional-free-lunch": "Thinks a fractional factorial estimates every effect separately, ignoring that some effects are aliased together.",
    "block-as-treatment": "Interprets differences between blocks as evidence about the treatments.",
  },
  steps: [
    {
      type: "motivate",
      title: "Eight factors, sixteen runs",
      body: "An engineer has eight settings that might affect a chip's yield. Trying every combination of two levels each needs $2^8 = 256$ runs. A well-chosen 16 runs can find the few settings that matter, if the engineer accepts what those 16 runs cannot separate.",
      realWorld: {
        title: "Industrial quality",
        body: "Fractional factorial and response surface designs, popularised in manufacturing by Taguchi and by Box, are the core of industrial experimentation, from pharmaceutical formulation to tuning a chemical plant.",
      },
    },
    {
      type: "truth",
      statement: "A **Latin square** of order $n$ assigns $n$ treatments to an $n \\times n$ grid of two nuisance factors (rows and columns) so each treatment appears once per row and column, controlling both with $n^2$ runs. A **$2^k$ factorial** runs every combination of $k$ two-level factors; a **$2^{k-p}$ fractional factorial** runs a $1/2^p$ fraction, chosen so that main effects are aliased only with high-order interactions.",
      body: "**Response surface methodology** fits a quadratic model $y = \\beta_0 + \\sum\\beta_ix_i + \\sum\\beta_{ii}x_i^2 + \\sum\\beta_{ij}x_ix_j$ near promising settings, often with a central composite design, and moves towards its optimum. **Power analysis** before the experiment chooses the replication: enough runs to detect the smallest effect that matters (§{errors-power}).",
    },
    {
      type: "predict",
      misconception: "fractional-free-lunch",
      item: {
        kind: "mc",
        id: "doe-predict-1",
        prompt: "A $2^{3-1}$ design studies factors A, B, C in 4 runs, chosen with C = AB. The estimate of C's main effect",
        options: [
          { id: "a", text: "cannot be separated from the AB interaction", correct: true, why: "Their sign columns are identical." },
          { id: "b", text: "is as clean as in the full 8-run design", misconception: "fractional-free-lunch", why: "Halving the runs costs the ability to separate some effects." },
          { id: "c", text: "cannot be estimated at all", why: "It can, but only as C + AB together." },
        ],
      },
      reveal: {
        body: "Setting C's level equal to the product of A's and B's signs makes the C column identical to the AB column, so the design estimates C + AB as one number. If the AB interaction is negligible, as is often the case, the estimate is C; if not, it is misleading. Fractional factorials rely on the **sparsity** of high-order interactions.",
      },
      resolve: {
        kind: "mc",
        id: "doe-resolve-1",
        prompt: "What does a fractional factorial give up?",
        options: [
          { id: "a", text: "The ability to separate aliased effects", correct: true, why: "Each estimate is a sum of aliased effects." },
          { id: "b", text: "Nothing: every effect is still estimated separately", misconception: "fractional-free-lunch", why: "Fewer runs than effects can't separate them all." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "doe-check-1",
        prompt: "In a field trial blocked by soil type, the clay blocks yield much less than the loam blocks. This shows",
        options: [
          { id: "a", text: "that blocking was worthwhile; it says nothing about the treatments", correct: true, why: "Block differences are removed from the treatment comparison." },
          { id: "b", text: "that the treatments used on clay are worse", misconception: "block-as-treatment", why: "Every treatment appears in every block." },
          { id: "c", text: "that the experiment failed", why: "Large block differences are what blocking is for." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "doe-check-2",
        prompt: "A $2^{5-2}$ fractional factorial needs how many runs?",
        options: [
          { id: "a", text: "8", correct: true, why: "$2^3$." },
          { id: "b", text: "32", why: "That is the full $2^5$." },
          { id: "c", text: "10", why: "Runs are powers of 2." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Hyperparameter search is experimental design. Random search beats a full grid in high dimensions for the same reason fractional factorials work: few settings matter. Bayesian optimisation is a response-surface method that fits a model of validation error and samples where it looks most promising.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "doe-produce-1", prompt: "A Latin square tests 5 treatments. How many runs does it need?", answer: 25, explain: "$5^2$." },
        { kind: "number", id: "doe-produce-2", prompt: "A fitted response surface is $y = 50 + 4x - x^2$. Find the $x$ of the optimum.", answer: 2, explain: "$4 - 2x = 0$." },
        {
          kind: "mc",
          id: "doe-produce-3",
          prompt: "In a randomised block design, large differences between blocks",
          options: [
            { id: "a", text: "are removed from the error and don't bias the treatment comparison", correct: true, why: "Each block contains every treatment." },
            { id: "b", text: "favour the treatments in the better blocks", misconception: "block-as-treatment", why: "All treatments appear in every block." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "doe-review-1", prompt: "A full $2^4$ factorial needs how many runs?", answer: 16, explain: "$2^4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "resolution",
      body: "A fractional factorial's **resolution** is the length of the shortest word in its defining relation. Resolution III aliases main effects with two-factor interactions; resolution IV aliases main effects only with three-factor interactions; resolution V keeps main effects and two-factor interactions clear of each other.",
    },
    {
      type: "definition",
      term: "central composite design, Cohen's f",
      body: "A **central composite design** adds centre points and axial \"star\" points to a $2^k$ factorial so that all quadratic terms can be estimated. For ANOVA power, **Cohen's** $f = \\sqrt{\\eta^2/(1 - \\eta^2)}$ measures effect size: about 0.1 small, 0.25 medium, 0.4 large.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "effects in a 2^k design",
      statement: "Code each factor $-1$ or $+1$. An effect is the average response at $+1$ minus the average at $-1$ of its sign column, where an interaction's column is the product of its factors' columns. In a full $2^k$ design all $2^k - 1$ columns are orthogonal, so every effect is estimated independently.",
      proof: ["Each pair of distinct sign columns agrees in exactly half the runs, so their dot product is 0; orthogonal columns give independent least-squares estimates."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "aliasing in a half fraction",
      statement: "A $2^{k-1}$ design with generator $D = ABC$ has defining relation $I = ABCD$. Each effect is aliased with its product with $ABCD$: $A$ with $BCD$, $AB$ with $CD$, and so on (using $A^2 = I$).",
      proof: ["Multiplying the columns for $A$ and $ABCD$ gives $A^2BCD = BCD$, and in the design the $ABCD$ column is all $+1$, so $A$ and $BCD$ have identical columns."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the stationary point",
      statement: "For a fitted quadratic in one factor, $y = b_0 + b_1x + b_2x^2$, the stationary point is $x = -b_1/(2b_2)$, a maximum if $b_2 < 0$. With several factors, solve $\\nabla y = \\vec 0$ (§{gradient}) and check the Hessian's signs.",
      proof: ["Setting the derivative to 0, as for any quadratic (§{regression-features})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Compare the runs needed for 6 two-level factors: full factorial against a $2^{6-2}$ fraction.",
      solution: ["Full: $2^6 = 64$.", "Fraction: $2^4 = 16$, a quarter of the runs."],
      result: "64 against 16.",
    },
    {
      type: "example",
      level: 2,
      title: "computing an effect",
      problem: "In a $2^2$ design the responses are: $(-, -)$ 10, $(+, -)$ 14, $(-, +)$ 12, $(+, +)$ 20. Find the effects of A, B and AB.",
      solution: ["A: $\\tfrac{14 + 20}{2} - \\tfrac{10 + 12}{2} = 17 - 11 = 6$. B: $\\tfrac{12 + 20}{2} - \\tfrac{10 + 14}{2} = 16 - 12 = 4$.", "AB uses signs $+, -, -, +$: $\\tfrac{10 + 20}{2} - \\tfrac{14 + 12}{2} = 15 - 13 = 2$."],
      result: "6, 4 and 2.",
    },
    {
      type: "example",
      level: 3,
      title: "aliases",
      problem: "A $2^{4-1}$ design uses $D = ABC$. What is the AB interaction aliased with?",
      solution: ["The defining relation is $I = ABCD$.", "$AB \\times ABCD = A^2B^2CD = CD$."],
      result: "AB is aliased with CD.",
    },
  ],
  pitfalls: [
    { wrong: "A fractional factorial separates every effect.", right: "Effects are aliased in groups; choose a design whose aliases are effects you expect to be negligible." },
    { wrong: "Block differences say which treatment is better.", right: "Every treatment appears in every block; block effects are nuisance." },
    { wrong: "Decide the number of runs by convenience.", right: "Do a power analysis for the smallest effect that matters." },
  ],
  formulas: [
    { label: "Runs", tex: "2^k\\ \\text{full},\\quad 2^{k-p}\\ \\text{fraction},\\quad n^2\\ \\text{Latin square}" },
    { label: "Effect", tex: "\\bar y_{+} - \\bar y_{-}" },
    { label: "Alias", tex: "\\text{effect} \\times \\text{defining word}" },
    { label: "Cohen's f", tex: "\\sqrt{\\eta^2/(1 - \\eta^2)}" },
  ],
  exercises: [
    ex(1, num("doex-ex-1", "A $2^{7-3}$ design needs how many runs?", 16, "$2^4$."), ["$16$."]),
    ex(1, num("doex-ex-2", "A 6-treatment Latin square needs how many runs?", 36, "$6^2$."), ["$36$."]),
    ex(2, num("doex-ex-3", "$2^2$ responses: $(-, -)$ 8, $(+, -)$ 12, $(-, +)$ 10, $(+, +)$ 18. Find the effect of A.", 6, "$15 - 9$."), ["$\\tfrac{12 + 18}{2} - \\tfrac{8 + 10}{2} = 6$."]),
    ex(2, num("doex-ex-4", "Same data. Find the AB interaction effect.", 2, "Signs $+, -, -, +$."), ["$\\tfrac{8 + 18}{2} - \\tfrac{12 + 10}{2} = 13 - 11 = 2$."]),
    ex(2, num("doex-ex-5", "A fitted surface is $y = 30 + 6x - 0.5x^2$. Find the $x$ of the maximum.", 6, "$-b_1/(2b_2)$."), ["$6/1 = 6$."]),
    ex(3, dp("doex-ex-6", "$\\eta^2 = 0.2$. Find Cohen's $f$.", Math.sqrt(0.2 / 0.8), "$\\sqrt{0.2/0.8}$."), ["$\\sqrt{0.25} = 0.5$: a large effect."]),
    ex(3, mc("doex-ex-7", "In a $2^{4-1}$ design with $D = ABC$, the main effect A is aliased with", ["BCD", "$A \\times ABCD = BCD$."], [["BC", "That would need $I = ABC$."], ["nothing", "Every effect has an alias in a half fraction."]]), ["Multiply by the defining word and cancel squares."]),
    ex(3, mc("doex-ex-8", "A designer wants main effects free of two-factor interactions. The fraction needs resolution", ["IV or higher", "Resolution IV aliases main effects only with three-factor interactions."], [["III", "That aliases main effects with two-factor interactions."], ["I", "Not a usable design."]]), ["Resolution IV designs keep main effects clear of two-factor interactions."]),
    ex(3, mc("doex-ex-9", "A Latin square for 4 fertilisers uses rows for fields and columns for planting weeks. It controls", ["both field and week differences", "Each fertiliser meets every field and every week once."], [["only field differences", "Columns control the second factor."], ["interactions between fertiliser and field", "It assumes none."]]), ["Two nuisance factors are balanced out with only $n^2$ runs."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = r.int(3, 6 + lv);
      const p = r.int(1, Math.min(3, k - 2));
      return n(`How many runs does a $2^{${k}-${p}}$ fractional factorial need?`, 2 ** (k - p), `$2^{${k - p}} = ${2 ** (k - p)}$, against $2^{${k}} = ${2 ** k}$ for the full design.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const y = Array.from({ length: 4 }, () => r.int(5, 15 + 10 * lv));
      const which = r.pick(["A", "B", "AB"] as const);
      const [mm, pm, mp, pp] = y;
      const v = which === "A" ? (pm + pp) / 2 - (mm + mp) / 2 : which === "B" ? (mp + pp) / 2 - (mm + pm) / 2 : (mm + pp) / 2 - (pm + mp) / 2;
      return n(`A $2^2$ design gives $(-, -)$ ${mm}, $(+, -)$ ${pm}, $(-, +)$ ${mp}, $(+, +)$ ${pp}. Find the ${which === "AB" ? "AB interaction" : `main`} effect${which === "AB" ? "" : ` of ${which}`}.`, v, `Average at $+$ minus average at $-$ of the ${which} column: ${r2(v)}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const gen = r.pick([
        { k: "D = ABC", eff: "AB", alias: "CD" },
        { k: "D = ABC", eff: "A", alias: "BCD" },
        { k: "C = AB", eff: "C", alias: "AB" },
        { k: "D = ABC", eff: "AC", alias: "BD" },
      ]);
      return mcNumbers(
        `A half-fraction uses ${gen.k}. What is ${gen.eff} aliased with?`,
        { text: gen.alias, why: "Multiply by the defining word and cancel squared letters." },
        [
          { text: "Nothing: every effect is estimated separately", why: "In a half fraction every effect has an alias.", misconception: "fractional-free-lunch" },
          { text: gen.alias === "CD" ? "BC" : "AD", why: "Check by multiplying with the defining word." },
        ],
      );
    },
  },
];
