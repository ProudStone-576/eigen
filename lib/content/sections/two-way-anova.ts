import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Two-way and factorial ANOVA, interaction plots, randomised blocks, repeated measures, mixed designs, ANCOVA, MANOVA. */

const base: ConceptNode = {
  id: "two-way-anova",
  title: "Two-way & factorial ANOVA",
  summary: "With two factors, ANOVA splits the variation into a main effect for each factor, their interaction, and error. An interaction means the effect of one factor depends on the level of the other; when it is strong, main effects alone mislead. Repeated measures, ANCOVA and MANOVA extend the same idea.",
  deps: ["one-way-anova", "experiment-design"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "main effect", meaning: "The effect of one factor averaged over the levels of the other." },
    { term: "interaction plot", meaning: "Cell means plotted with one line per level of a factor; non-parallel lines suggest an interaction." },
    { term: "repeated measures", meaning: "A design in which each subject is measured under every condition." },
  ],
  misconceptions: {
    "main-effect-despite-interaction": "Interprets main effects at face value when a strong interaction, such as crossing lines, is present.",
    "repeated-as-independent": "Analyses repeated measurements on the same subjects as if they came from independent groups.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two dials at once",
      body: "A bakery tests two flours and two oven temperatures. Does flour matter? Does temperature? And does the best temperature depend on the flour? A one-at-a-time study answers the first two at best; a two-way design answers all three from the same batches.",
      realWorld: {
        title: "Medicine and genotype",
        body: "A drug that helps patients with one gene variant and harms those with another has an average effect near zero. Only a design with both factors, drug and genotype, reveals the interaction, which is the basis of personalised medicine.",
      },
    },
    {
      type: "truth",
      statement: "For factors A ($a$ levels) and B ($b$ levels) with $n$ observations per cell: $\\text{SST} = \\text{SSA} + \\text{SSB} + \\text{SSAB} + \\text{SSE}$, with degrees of freedom $a - 1$, $b - 1$, $(a - 1)(b - 1)$ and $ab(n - 1)$. Each effect is tested by its mean square over MSE.",
      body: "On an **interaction plot**, parallel lines mean no interaction; non-parallel or crossing lines mean the effect of one factor changes with the other. With a strong interaction, report the **simple effects**, the effect of one factor at each level of the other, rather than the averaged main effects.",
    },
    {
      type: "predict",
      misconception: "main-effect-despite-interaction",
      item: {
        kind: "mc",
        id: "twa-predict-1",
        prompt: "Mean yields: drug A with genotype 1 = 20, with genotype 2 = 10; drug B with genotype 1 = 10, with genotype 2 = 20. The main effect of drug is 0. Does the drug choice matter?",
        options: [
          { id: "a", text: "Yes, a lot: the better drug depends on the genotype", correct: true, why: "A is 10 better for genotype 1 and 10 worse for genotype 2." },
          { id: "b", text: "No: the drug's main effect is zero", misconception: "main-effect-despite-interaction", why: "The average hides two opposite effects." },
          { id: "c", text: "Only genotype matters", why: "Genotype's main effect is also zero here." },
        ],
      },
      reveal: {
        body: "Averaged over genotypes, both drugs give 15, so the main effect is 0. But plot the cell means: the lines cross completely. Drug A is right for genotype 1, drug B for genotype 2, and choosing by genotype gains 10 units for everyone. With a crossing interaction, main effects alone are misleading.",
      },
      resolve: {
        kind: "mc",
        id: "twa-resolve-1",
        prompt: "When a strong interaction is present, what should be reported?",
        options: [
          { id: "a", text: "The effect of each factor at each level of the other (simple effects)", correct: true, why: "That is what the data show." },
          { id: "b", text: "The main effects, since they average over the other factor", misconception: "main-effect-despite-interaction", why: "Averaging opposite effects can cancel them." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "twa-check-1",
        prompt: "Each of 12 people does a memory test after coffee, tea and water. A one-way ANOVA treating the three sets of scores as independent groups",
        options: [
          { id: "a", text: "is wrong: the scores are repeated measures on the same people", correct: true, why: "Use repeated-measures ANOVA, which removes the person-to-person variation." },
          { id: "b", text: "is fine", misconception: "repeated-as-independent", why: "Scores from the same person are correlated." },
          { id: "c", text: "is fine if the groups have equal size", why: "Equal size doesn't make them independent." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "twa-check-2",
        prompt: "A $3 \\times 4$ factorial design has 5 observations per cell. How many degrees of freedom has the interaction?",
        options: [
          { id: "a", text: "6", correct: true, why: "$(3 - 1)(4 - 1)$." },
          { id: "b", text: "12", why: "That is the number of cells." },
          { id: "c", text: "48", why: "That is the error degrees of freedom." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Hyperparameter studies are factorial experiments: learning rate and batch size often interact, so the best learning rate depends on the batch size. Tuning them one at a time can miss the best combination entirely.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "twa-produce-1", prompt: "Cell means: A1B1 = 10, A1B2 = 14, A2B1 = 12, A2B2 = 24. Find the main effect of A (A2 average minus A1 average).", answer: 6, explain: "$18 - 12$." },
        { kind: "number", id: "twa-produce-2", prompt: "Same means. Find the interaction contrast $(24 - 12) - (14 - 10)$.", answer: 8, explain: "B's effect is 12 at A2 but 4 at A1." },
        {
          kind: "mc",
          id: "twa-produce-3",
          prompt: "Blood pressure is measured on the same 20 patients before, during and after treatment. Use",
          options: [
            { id: "a", text: "repeated-measures ANOVA", correct: true, why: "Each patient gives all three measurements." },
            { id: "b", text: "one-way ANOVA with three independent groups", misconception: "repeated-as-independent", why: "The measurements are paired within patients." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "twa-review-1", prompt: "A $2 \\times 3$ design with 4 observations per cell. Find the error degrees of freedom.", answer: 18, explain: "$ab(n - 1) = 6 \\times 3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "blocks and repeated measures",
      body: "In a **randomised block** design the block is a second factor with no interaction assumed: SST = SS(treatment) + SS(block) + SSE. **Repeated-measures** ANOVA treats each subject as a block; it assumes **sphericity**, roughly equal variances of all pairwise differences, and the Greenhouse–Geisser correction reduces the degrees of freedom when that fails. A **mixed design** has some factors between subjects and some within.",
    },
    {
      type: "definition",
      term: "ANCOVA and MANOVA",
      body: "**ANCOVA** adds a numerical covariate, such as a pre-test score, to compare group means adjusted for it: a regression with group dummies plus the covariate. **MANOVA** compares groups on several responses at once, using the covariance between them; Wilks' lambda is a common test statistic.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "effects in a 2 × 2 design",
      statement: "With cell means $\\mu_{11}, \\mu_{12}, \\mu_{21}, \\mu_{22}$ (rows A, columns B): main effect of A $= \\tfrac12(\\mu_{21} + \\mu_{22}) - \\tfrac12(\\mu_{11} + \\mu_{12})$; main effect of B $= \\tfrac12(\\mu_{12} + \\mu_{22}) - \\tfrac12(\\mu_{11} + \\mu_{21})$; interaction $= (\\mu_{22} - \\mu_{21}) - (\\mu_{12} - \\mu_{11})$.",
      proof: ["Each is a contrast in the cell means (§{post-hoc-tests}); the interaction measures how much B's effect changes from A1 to A2."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "blocking removes variation",
      statement: "If blocks differ, a randomised block analysis moves SS(block) out of the error sum of squares. MSE falls, and treatment differences are detected with more power than in a one-way analysis of the same data.",
      proof: ["In the one-way analysis, the block-to-block variation sits inside SSW; the block analysis estimates it separately, at the cost of $b - 1$ degrees of freedom."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "balanced designs",
      statement: "With equal numbers per cell, the sums of squares for A, B and AB add up exactly and don't depend on the order of entry. With unbalanced cells they overlap, and software offers different \"types\" of sums of squares that answer different questions.",
      proof: ["Balance makes the factors' dummy columns orthogonal, so their contributions to SSR separate cleanly."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Give the degrees of freedom for a $3 \\times 2$ factorial with 4 observations per cell.",
      solution: ["A: 2, B: 1, AB: $2 \\times 1 = 2$.", "Error: $3 \\times 2 \\times 3 = 18$; total 23."],
      result: "2, 1, 2 and 18.",
    },
    {
      type: "example",
      level: 2,
      title: "reading effects",
      problem: "Cell means: A1B1 = 10, A1B2 = 14, A2B1 = 12, A2B2 = 24. Find both main effects and the interaction.",
      solution: ["A: $18 - 12 = 6$. B: $19 - 11 = 8$.", "Interaction: $(24 - 12) - (14 - 10) = 8$: B helps far more at A2."],
      result: "6, 8 and 8.",
    },
    {
      type: "example",
      level: 3,
      title: "why repeated measures help",
      problem: "Ten people try two keyboards. Typing speeds vary between people with SD 15 words per minute, but each person's difference between keyboards has SD 3. Compare the SE of the mean difference under the two analyses.",
      solution: ["Independent groups of 10: SE $\\approx 15\\sqrt{2/10} \\approx 6.7$.", "Repeated measures (paired): SE $= 3/\\sqrt{10} \\approx 0.95$, about seven times smaller."],
      result: "About 6.7 against 0.95.",
    },
  ],
  pitfalls: [
    { wrong: "Report main effects when the interaction lines cross.", right: "Report simple effects at each level of the other factor." },
    { wrong: "Treat repeated measurements as independent groups.", right: "Use repeated-measures ANOVA or a mixed model." },
    { wrong: "Assume the order of factors never matters.", right: "In unbalanced designs it can; say which type of sums of squares you used." },
  ],
  formulas: [
    { label: "Split", tex: "\\text{SST} = \\text{SSA} + \\text{SSB} + \\text{SSAB} + \\text{SSE}" },
    { label: "Degrees of freedom", tex: "a - 1,\\ b - 1,\\ (a - 1)(b - 1),\\ ab(n - 1)" },
    { label: "Interaction (2 × 2)", tex: "(\\mu_{22} - \\mu_{21}) - (\\mu_{12} - \\mu_{11})" },
  ],
  exercises: [
    ex(1, num("twax-ex-1", "A $4 \\times 3$ factorial. Find the interaction degrees of freedom.", 6, "$(4 - 1)(3 - 1)$."), ["$6$."]),
    ex(1, num("twax-ex-2", "A $2 \\times 2$ design with 10 per cell. Find the error degrees of freedom.", 36, "$4 \\times 9$."), ["$36$."]),
    ex(2, num("twax-ex-3", "Cell means A1B1 = 5, A1B2 = 9, A2B1 = 7, A2B2 = 11. Find the interaction contrast.", 0, "$(11 - 7) - (9 - 5)$."), ["$4 - 4 = 0$: parallel lines, no interaction."]),
    ex(2, num("twax-ex-4", "Same means. Find the main effect of B.", 4, "$\\tfrac12(9 + 11) - \\tfrac12(5 + 7)$."), ["$10 - 6 = 4$."]),
    ex(2, num("twax-ex-5", "SSA = 40 on 2 d.f. and MSE = 5. Find $F$ for factor A.", 4, "$(40/2)/5$."), ["$4$."]),
    ex(3, num("twax-ex-6", "A randomised block design has 4 treatments in 6 blocks, one observation per cell. Find the error degrees of freedom.", 15, "$(t - 1)(b - 1)$."), ["$3 \\times 5 = 15$."]),
    ex(3, mc("twax-ex-7", "In a $2 \\times 2$ study the lines on the interaction plot cross. The main effects are", ["potentially misleading: describe each factor's effect at each level of the other", "Crossing means the effect reverses."], [["the key result", "They average opposite effects."], ["necessarily zero", "They can be anything; they just don't summarise well."]]), ["Report simple effects when the interaction is strong."]),
    ex(3, mc("twax-ex-8", "Two classes are compared on a final exam, adjusting for their pre-test scores. Use", ["ANCOVA", "A covariate adjusts the comparison."], [["MANOVA", "There is one response."], ["two-way ANOVA", "Pre-test score is numerical, not a factor."]]), ["ANCOVA is regression on a group dummy plus the covariate."]),
    ex(3, mc("twax-ex-9", "Repeated-measures ANOVA's sphericity assumption fails. You should", ["apply a correction such as Greenhouse–Geisser, or use a mixed model", "These adjust the degrees of freedom."], [["ignore it", "The F-test's error rate becomes too high."], ["switch to independent groups", "The data are still paired."]]), ["The correction shrinks the degrees of freedom to keep the error rate honest."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const m = Array.from({ length: 4 }, () => r.int(5, 15 + 10 * lv));
      const which = r.pick(["A", "B", "AB"] as const);
      const [m11, m12, m21, m22] = m;
      const v = which === "A" ? (m21 + m22) / 2 - (m11 + m12) / 2 : which === "B" ? (m12 + m22) / 2 - (m11 + m21) / 2 : m22 - m21 - (m12 - m11);
      const label = which === "AB" ? "the interaction contrast $(\\mu_{22} - \\mu_{21}) - (\\mu_{12} - \\mu_{11})$" : `the main effect of ${which}`;
      return n(`Cell means: A1B1 = ${m11}, A1B2 = ${m12}, A2B1 = ${m21}, A2B2 = ${m22}. Find ${label}.`, v, which === "AB" ? `$(${m22} - ${m21}) - (${m12} - ${m11}) = ${v}$.` : `Difference of the two ${which} averages: ${v}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(2, 5);
      const b = r.int(2, 5);
      const nn = r.int(2, 8);
      const which = r.pick(["interaction", "error"] as const);
      const v = which === "interaction" ? (a - 1) * (b - 1) : a * b * (nn - 1);
      return n(`A ${a} × ${b} factorial with ${nn} observations per cell. Find the ${which} degrees of freedom.`, v, which === "interaction" ? `$(${a} - 1)(${b} - 1) = ${v}$.` : `$${a} \\times ${b} \\times (${nn} - 1) = ${v}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const hi = r.int(15, 30);
      const lo = r.int(5, hi - 5);
      return mcNumbers(
        `Treatment X gives ${hi} for men and ${lo} for women; treatment Y gives ${lo} for men and ${hi} for women. The treatment main effect is 0. What should be reported?`,
        { text: "That the better treatment depends on sex", why: "The lines cross: a strong interaction." },
        [
          { text: "That the treatments are equally good", why: "They are equal only on average over two opposite effects.", misconception: "main-effect-despite-interaction" },
          { text: "That sex has a main effect", why: "Sex's main effect is also 0 here." },
        ],
      );
    },
  },
];
