import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Experiments: control, randomisation, replication, blinding, blocking, matched pairs, factorial designs. */

const base: ConceptNode = {
  id: "experiment-design",
  title: "Designing experiments",
  summary: "An experiment assigns treatments, so it can show causes. Its principles: compare with a control, randomise who gets what, replicate on enough units, and block on known sources of variation. Blinding stops expectations leaking into the results.",
  deps: ["sampling-bias"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "experimental unit", meaning: "The thing a treatment is applied to: a patient, a plot of land, a website visitor." },
    { term: "treatment", meaning: "A condition applied to units; with several factors, a combination of factor levels." },
    { term: "placebo", meaning: "A dummy treatment that looks like the real one, so that only the active ingredient differs." },
  ],
  misconceptions: {
    "observational-is-experiment": "Calls a study an experiment when the subjects chose their own treatment.",
    "random-sample-vs-assignment": "Confuses random sampling (who is studied, for generalising) with random assignment (who gets which treatment, for causation).",
  },
  steps: [
    {
      type: "motivate",
      title: "Does it actually work?",
      body: "People who take vitamin pills are healthier. Is that the pills, or are pill-takers people who also exercise and eat well? Watching cannot separate the two. Deciding by coin toss who takes the pill can.",
      realWorld: {
        title: "A/B tests",
        body: "When an online shop tests a new checkout page, each visitor is randomly shown the old or the new one. That random assignment is what lets the shop credit any difference in sales to the page.",
      },
    },
    {
      type: "truth",
      statement: "In an **experiment** the researcher assigns treatments; in an **observational study** they only record. A good experiment has a **control** group for comparison, **randomly assigns** units to treatments, uses enough units (**replication**), and **blocks** on known sources of variation.",
      body: "**Blinding** keeps subjects (single-blind) or subjects and assessors (double-blind) unaware of who got what, often with a **placebo**. A **randomised controlled trial** combines all of these and is the standard for showing that a treatment causes an effect.",
    },
    {
      type: "predict",
      misconception: "observational-is-experiment",
      item: {
        kind: "mc",
        id: "xd-predict-1",
        prompt: "Researchers compare the grades of 500 students who chose to join a coding club with 500 who didn't. Is this an experiment?",
        options: [
          { id: "a", text: "No: students chose their group, so it is observational", correct: true, why: "Nobody assigned the treatment." },
          { id: "b", text: "Yes: there is a treatment group and a comparison group", misconception: "observational-is-experiment", why: "Having two groups isn't enough; the researcher must assign them." },
          { id: "c", text: "Yes, because 1,000 students is a large study", why: "Size doesn't decide the design." },
        ],
      },
      reveal: {
        body: "Students who choose a coding club may already be more motivated or better at maths. Any difference in grades mixes the club's effect with those differences. Assigning places in the club by lottery would make the two groups alike on average in motivation and everything else.",
      },
      resolve: {
        kind: "mc",
        id: "xd-resolve-1",
        prompt: "What makes a study an experiment?",
        options: [
          { id: "a", text: "The researcher decides who gets which treatment", correct: true, why: "Assignment, ideally random, is the defining feature." },
          { id: "b", text: "It compares a treatment group with a control group", misconception: "observational-is-experiment", why: "Observational studies compare groups too." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "xd-check-1",
        prompt: "A trial recruits volunteers at one hospital and randomly assigns half to a new drug. What does the random assignment buy?",
        options: [
          { id: "a", text: "A fair comparison: differences can be credited to the drug", correct: true, why: "Randomisation balances the groups on average." },
          { id: "b", text: "Results that apply to all patients everywhere", misconception: "random-sample-vs-assignment", why: "That needs a random sample of patients; these are volunteers at one hospital." },
          { id: "c", text: "Nothing, unless the groups are very large", why: "Randomisation works at any size; larger groups just reduce chance imbalance." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "xd-check-2",
        prompt: "Why do drug trials give the control group a placebo rather than nothing?",
        options: [
          { id: "a", text: "So that believing you are treated is the same in both groups", correct: true, why: "The placebo effect is then present in both, and cancels." },
          { id: "b", text: "Placebos are cheaper than the drug", why: "Cost is not the reason." },
          { id: "c", text: "To make the trial larger", why: "It doesn't change the number of subjects." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Deploying a new recommendation model is an experiment: a random share of users sees it, the rest stay on the old model, and the difference in clicks estimates the model's effect. Offline accuracy can't replace this, because users react to what they are shown.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "xd-produce-1",
          prompt: "A study records whether people drink coffee and whether they develop heart disease over 10 years. This is",
          options: [
            { id: "a", text: "an observational study", correct: true, why: "People chose whether to drink coffee." },
            { id: "b", text: "an experiment", misconception: "observational-is-experiment", why: "No treatment was assigned." },
          ],
        },
        {
          kind: "mc",
          id: "xd-produce-2",
          prompt: "Random assignment of treatments mainly supports",
          options: [
            { id: "a", text: "conclusions about cause and effect", correct: true, why: "It balances confounders between groups." },
            { id: "b", text: "generalising to the whole population", misconception: "random-sample-vs-assignment", why: "That is what random sampling supports." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "xd-review-1",
      prompt: "In a double-blind trial,",
      options: [
        { id: "a", text: "neither the subjects nor the people assessing them know who got which treatment", correct: true, why: "Both sources of expectation are removed." },
        { id: "b", text: "only the subjects are unaware", why: "That is single-blind." },
      ],
    },
  ],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "factor, level, treatment",
      body: "A **factor** is a variable the experimenter controls (dose, fertiliser); its values are **levels**. A **treatment** is one combination of levels. A **factorial design** tests every combination: two factors with 2 and 3 levels give $2 \\times 3 = 6$ treatments.",
    },
    {
      type: "definition",
      term: "blocks and matched pairs",
      body: "A **block** is a group of units alike in some way that affects the response (same field, same age band). In a **randomised block design**, treatments are randomised separately within each block. **Matched pairs** is the case of blocks of two, or of each unit receiving both treatments in random order.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "why randomise",
      statement: "Random assignment makes every characteristic of the units, measured or not, independent of the treatment. A difference between groups larger than chance would produce can then only come from the treatment.",
      proof: ["The coin, not the units' traits, decides the groups, so each trait has the same distribution in every group, up to chance imbalance that a significance test (§{hypothesis-tests}) accounts for."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "block what you can, randomise what you can't",
      statement: "Blocking removes the variation between blocks from the comparison, so a smaller difference can be detected. Randomisation within blocks still protects against the variables you didn't block on.",
      proof: ["Comparing treatments within a block cancels everything the units in the block share; the paired t-test (§{t-tests}) is the two-unit case."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "interactions",
      statement: "Two factors **interact** when the effect of one depends on the level of the other. Only a factorial design, which runs every combination, can detect an interaction; changing one factor at a time cannot.",
      proof: ["Changing one factor at a time measures each effect at a single level of the other factor, so whether that effect changes with the other factor is never observed."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Design an experiment to test whether a new fertiliser increases tomato yield, using 40 plants.",
      solution: [
        "Number the plants and use random numbers to assign 20 to the new fertiliser and 20 to the standard one (the control).",
        "Grow all 40 under the same conditions and compare mean yields.",
      ],
      result: "A completely randomised design with a control.",
    },
    {
      type: "example",
      level: 2,
      title: "blocking",
      problem: "The 40 plants are in two greenhouses, one sunnier. How should the design change?",
      solution: ["Treat each greenhouse as a block: randomly assign half the plants in each greenhouse to each fertiliser.", "Compare fertilisers within each greenhouse, so sunlight no longer adds noise to the comparison."],
      result: "A randomised block design.",
    },
    {
      type: "example",
      level: 3,
      title: "an interaction",
      problem: "Mean yields (kg): fertiliser A with low water 4, with high water 6; fertiliser B with low water 5, with high water 9. Describe the effects.",
      solution: [
        "Under low water B adds 1 kg; under high water it adds 3 kg.",
        "The effect of fertiliser depends on watering: the factors interact. A one-factor-at-a-time study at low water would have found only a 1 kg effect.",
      ],
      result: "An interaction: B's advantage grows with water.",
    },
  ],
  pitfalls: [
    { wrong: "Any study with two groups is an experiment.", right: "Only if the researcher assigned the groups." },
    { wrong: "Random assignment lets you generalise to everyone.", right: "It supports causation. Generalising needs a representative (ideally random) sample." },
    { wrong: "Let doctors choose which patients get the new treatment.", right: "Their choices can track how ill the patients are. Randomise." },
  ],
  formulas: [
    { label: "Treatments in a factorial", tex: "k_1 \\times k_2 \\times \\cdots" },
    { label: "Interaction (2 × 2)", tex: "(y_{B,\\text{high}} - y_{A,\\text{high}}) - (y_{B,\\text{low}} - y_{A,\\text{low}})" },
  ],
  exercises: [
    ex(1, mc("xdx-ex-1", "The main purpose of a control group is to", ["provide a baseline for comparison", "Without it, a change can't be attributed to the treatment."], [["make the sample larger", "It doesn't need to be large."], ["remove the need for randomisation", "Controls and randomisation do different jobs."]]), ["The treatment's effect is the difference from what happens without it."]),
    ex(1, num("xdx-ex-2", "A factorial experiment has factors with 2, 3 and 4 levels. How many treatments are there?", 24, "Multiply."), ["$2 \\times 3 \\times 4 = 24$."]),
    ex(2, mc("xdx-ex-3", "Twins are split so that one twin of each pair gets a new teaching method. This is", ["a matched-pairs design", "Each pair is a block of two similar units."], [["a completely randomised design", "Units are paired before assignment."], ["an observational study", "The method is assigned."]]), ["Twins share background, so comparing within pairs removes much of the variation."]),
    ex(2, mc("xdx-ex-4", "A trial finds a drug works in randomly assigned volunteers aged 60–70 at one clinic. The result can safely be extended to", ["similar patients, aged 60–70", "Causation is established for this kind of patient."], [["all adults", "The sample was not drawn from all adults."], ["nobody: volunteers invalidate trials", "Random assignment still gives a valid comparison."]]), ["Random assignment gives causation; scope depends on who was in the trial."]),
    ex(2, mc("xdx-ex-5", "Why randomise in a randomised block design, once blocks are formed?", ["To balance the variables that weren't blocked on", "Blocking handles only the blocking variable."], [["It isn't needed after blocking", "Other differences between units remain."], ["To make the blocks equal in size", "Block sizes are fixed by the design."]]), ["Blocking controls known variation; randomisation guards against the rest."]),
    ex(3, num("xdx-ex-6", "Yields: A-low 4, A-high 6, B-low 5, B-high 9. Find the interaction contrast $(B_{\\text{high}} - A_{\\text{high}}) - (B_{\\text{low}} - A_{\\text{low}})$.", 2, "$3 - 1$."), ["$(9 - 6) - (5 - 4) = 3 - 1 = 2$: the fertiliser effect is 2 kg larger under high water."]),
    ex(3, mc("xdx-ex-7", "A school tries a new timetable this year and finds results better than last year. The main weakness is", ["no concurrent control group", "Other changes between years are mixed in."], [["too few students", "Size isn't the main issue."], ["the lack of a placebo", "A placebo is not the key missing element here."]]), ["A before-and-after comparison cannot separate the timetable from everything else that changed."]),
    ex(3, mc("xdx-ex-8", "A study changes temperature with pressure held at one level, then pressure with temperature held at one level. It cannot detect", ["an interaction between temperature and pressure", "Combinations are never varied together."], [["the main effect of temperature", "That is measured, at one pressure."], ["random error", "Replication measures that."]]), ["Only a factorial design varies both factors together."]),
  ],
});

const STUDIES: { text: string; experiment: boolean }[] = [
  { text: "Researchers randomly assign 200 patients to a new or standard painkiller and compare pain scores.", experiment: true },
  { text: "A survey compares the sleep of people who own a smartwatch with those who don't.", experiment: false },
  { text: "A website randomly shows half its visitors a green button and half a blue one.", experiment: true },
  { text: "Doctors review records to compare recovery of smokers and non-smokers after surgery.", experiment: false },
  { text: "Farmers who chose organic methods are compared with those who didn't.", experiment: false },
  { text: "Seeds are randomly assigned to three light levels and their growth is measured.", experiment: true },
  { text: "Students are allocated by lottery to small or large classes and their test scores compared.", experiment: true },
  { text: "Countries with more cycle lanes are compared on obesity rates.", experiment: false },
];

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick(STUDIES);
      return mcNumbers(
        `${s.text} Is this an experiment or an observational study?`,
        { text: s.experiment ? "An experiment" : "An observational study", why: s.experiment ? "The researchers assigned the treatments." : "The groups chose themselves; nothing was assigned." },
        [
          {
            text: s.experiment ? "An observational study" : "An experiment",
            why: s.experiment ? "Treatments were assigned, so it is an experiment." : "Comparing groups is not enough: someone must assign the treatment.",
            ...(s.experiment ? {} : { misconception: "observational-is-experiment" }),
          },
        ],
      );
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const levels = Array.from({ length: lv + 1 }, () => r.int(2, 4));
      const reps = r.int(2, 5);
      const t = levels.reduce((p, x) => p * x, 1);
      return n(
        `A factorial experiment has ${levels.length} factors with ${levels.join(", ")} levels, and each treatment is run on ${reps} units. How many units are needed?`,
        t * reps,
        `${levels.join(" × ")} = ${t} treatments, times ${reps} = ${t * reps}.`,
      );
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const al = r.int(3, 8);
      const ah = al + r.int(1, 4);
      const bl = al + r.int(-2, 3);
      const bh = bl + (ah - al) + r.int(-2, 2 + lv);
      const c = bh - ah - (bl - al);
      return n(
        `Mean yields: A at low water ${al}, A at high water ${ah}, B at low water ${bl}, B at high water ${bh}. Find the interaction contrast $(B_{\\text{high}} - A_{\\text{high}}) - (B_{\\text{low}} - A_{\\text{low}})$.`,
        c,
        `$(${bh} - ${ah}) - (${bl} - ${al}) = ${bh - ah} - ${bl - al} = ${c}$. ${c === 0 ? "No interaction: the fertiliser effect is the same at both water levels." : "The fertiliser effect changes with water: an interaction."}`,
      );
    },
  },
];
