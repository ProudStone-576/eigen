import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Counterfactuals and potential outcomes; ATE and ATT; selection bias; identification assumptions (consistency, exchangeability, positivity); DAGs, confounders, mediators, colliders and the backdoor criterion. */

const base: ConceptNode = {
  id: "potential-outcomes",
  title: "Potential outcomes & DAGs",
  summary: "A causal effect compares what happens with a treatment to what would have happened without it, for the same units. Each unit has two potential outcomes, Y(1) and Y(0), but we only ever see one. Causal inference is the art of recovering average effects from what we do see, under stated assumptions; causal diagrams (DAGs) show which variables to adjust for and which to leave alone.",
  deps: ["correlation-causation", "experiment-design", "conditional-probability"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "potential outcome", meaning: "$Y(1)$, the outcome a unit would have if treated, and $Y(0)$ if untreated." },
    { term: "confounder", meaning: "A variable that affects both the treatment and the outcome." },
    { term: "collider", meaning: "A variable caused by two others; conditioning on it creates a spurious link between them." },
  ],
  misconceptions: {
    "naive-difference-ate": "Takes the difference in mean outcomes between treated and untreated groups in observational data as the causal effect.",
    "adjust-for-everything": "Thinks adjusting for more variables always reduces bias, including mediators and colliders.",
  },
  steps: [
    {
      type: "motivate",
      title: "What would have happened?",
      body: "Patients who took a new drug recovered faster than those who didn't. Did the drug help? Perhaps doctors gave it to the healthier patients, who would have recovered faster anyway. The question is about a world we never see: these same patients, without the drug. Randomised experiments make that world estimable; observational data need assumptions.",
      realWorld: {
        title: "Hormone therapy",
        body: "Observational studies in the 1980s and 90s found that women taking hormone replacement therapy had less heart disease. A large randomised trial in 2002 found no benefit and some harm: the women who chose the therapy had been healthier in many other ways.",
      },
    },
    {
      type: "truth",
      statement: "Each unit $i$ has potential outcomes $Y_i(1)$ and $Y_i(0)$; its causal effect $Y_i(1) - Y_i(0)$ is never observed, since only $Y_i = Y_i(T_i)$ is seen. The **average treatment effect** is $\\text{ATE} = E[Y(1) - Y(0)]$; the effect **on the treated** is $\\text{ATT} = E[Y(1) - Y(0) \\mid T = 1]$. The naive comparison splits as $E[Y \\mid T = 1] - E[Y \\mid T = 0] = \\text{ATT} + \\underbrace{E[Y(0) \\mid T = 1] - E[Y(0) \\mid T = 0]}_{\\text{selection bias}}$.",
      body: "Randomisation makes treatment independent of the potential outcomes, so selection bias is 0 and the naive difference estimates the ATE (§{experiment-design}). Without it, identification needs **consistency** (the observed outcome is the potential outcome for the treatment received, with no interference between units), **conditional exchangeability** ($Y(t)$ independent of $T$ given measured covariates $X$) and **positivity** ($0 < P(T = 1 \\mid X) < 1$). Then $E[Y(t)] = \\sum_xE[Y \\mid T = t, X = x]P(X = x)$, the **adjustment formula**. A **DAG** draws causes as arrows: adjust for **confounders** (forks $T \\leftarrow X \\to Y$), but not for **mediators** on the path $T \\to M \\to Y$ (that removes part of the effect) or **colliders** $T \\to C \\leftarrow Y$ (that creates bias).",
    },
    {
      type: "predict",
      misconception: "adjust-for-everything",
      item: {
        kind: "mc",
        id: "pot-predict-1",
        prompt: "Among Hollywood actors, talent and good looks are negatively correlated, though in the population they are unrelated. Why?",
        options: [
          { id: "a", text: "Becoming an actor depends on both: restricting to actors conditions on a collider", correct: true, why: "Those with little talent got in on looks, and vice versa." },
          { id: "b", text: "Looks reduce talent, which the actor sample reveals by controlling for career", misconception: "adjust-for-everything", why: "Conditioning on a common effect manufactures the correlation." },
          { id: "c", text: "Talent reduces looks", why: "In the population they are unrelated." },
        ],
      },
      reveal: {
        body: "Talent → actor ← looks: \"actor\" is a collider. In the whole population the two are independent, but among those selected for having enough of either, knowing someone has little talent tells you they probably have striking looks. Adjusting for (or selecting on) a collider opens a non-causal path. More adjustment is not always better: choose variables from the causal diagram.",
      },
      resolve: {
        kind: "mc",
        id: "pot-resolve-1",
        prompt: "In $T \\to C \\leftarrow Y$, adjusting for $C$",
        options: [
          { id: "a", text: "creates a spurious association between $T$ and $Y$", correct: true, why: "Conditioning on a collider opens the path." },
          { id: "b", text: "removes confounding, as adjusting always does", misconception: "adjust-for-everything", why: "$C$ is a common effect, not a common cause." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pot-check-1",
        prompt: "In an observational study, people who use a fitness app lose 3 kg more than non-users. The causal effect of the app is",
        options: [
          { id: "a", text: "unknown from this alone: users may differ in motivation, which also drives weight loss", correct: true, why: "Selection bias can be most or all of the 3 kg." },
          { id: "b", text: "3 kg, the difference in means", misconception: "naive-difference-ate", why: "That equals the effect only if users and non-users are exchangeable." },
          { id: "c", text: "0, because the study wasn't randomised", why: "Observational data can still be informative under assumptions." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pot-check-2",
        prompt: "To estimate the total effect of exercise on blood pressure, should you adjust for weight loss, which exercise causes and which lowers blood pressure?",
        options: [
          { id: "a", text: "No: weight loss is a mediator, and adjusting removes part of the effect", correct: true, why: "The total effect includes the path through weight." },
          { id: "b", text: "Yes: adjust for every related variable", misconception: "adjust-for-everything", why: "Adjusting for a mediator blocks part of the effect you want." },
          { id: "c", text: "Yes, it is a confounder", why: "It is caused by exercise, so it is not a common cause." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A model that predicts well can still mislead about interventions: hospital data once suggested asthma lowered pneumonia deaths, because asthmatic patients were sent straight to intensive care. Uplift modelling, recommendation and pricing all ask causal questions (what if we act?) that pure prediction doesn't answer.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pot-produce-1", prompt: "Four people have $(Y(1), Y(0))$ = (8, 6), (7, 5), (4, 3), (5, 2). Find the ATE.", answer: 2, explain: "Effects 2, 2, 1, 3; mean 2." },
        { kind: "number", id: "pot-produce-2", prompt: "Same people; the first two were treated. Find the naive difference $E[Y \\mid T = 1] - E[Y \\mid T = 0]$.", answer: 5, explain: "$7.5 - 2.5$." },
        {
          kind: "mc",
          id: "pot-produce-3",
          prompt: "Why does the naive difference (5) exceed the ATE (2) above?",
          options: [
            { id: "a", text: "Selection bias: the treated had higher $Y(0)$ anyway", correct: true, why: "$E[Y(0) \\mid T = 1] = 5.5$ against $2.5$." },
            { id: "b", text: "It doesn't matter: the naive difference is the causal effect", misconception: "naive-difference-ate", why: "It adds the selection bias of 3." },
          ],
        },
        {
          kind: "mc",
          id: "pot-produce-4",
          prompt: "A study of smoking and lung function restricts to hospitalised patients, where both smoking and other lung diseases raise admission. This can",
          options: [
            { id: "a", text: "bias the association, since hospitalisation is a collider", correct: true, why: "Selecting on a common effect distorts relationships." },
            { id: "b", text: "only reduce bias, as restricting adds control", misconception: "adjust-for-everything", why: "Restriction to a collider creates bias." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "pot-review-1", prompt: "Young people (60% of the population) gain 2 from treatment; old (40%) gain 1. Using the adjustment formula, find the ATE.", answer: 1.6, explain: "$0.6 \\times 2 + 0.4 \\times 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the backdoor criterion",
      body: "A set $X$ of measured variables is enough to adjust for when it blocks every **backdoor path** from $T$ to $Y$ (every path starting with an arrow into $T$), and contains no descendant of $T$. A path is blocked by conditioning on a non-collider on it, and opened by conditioning on a collider or a collider's descendant.",
    },
    {
      type: "definition",
      term: "ATE, ATT and ATC",
      body: "The ATE averages the effect over everyone; the **ATT** over those actually treated (\"did it help those who took it?\"); the **ATC** over the untreated (\"what if we extended it?\"). They differ when effects vary and people select into treatment by how much they would gain.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the selection-bias decomposition",
      statement: "$E[Y \\mid T = 1] - E[Y \\mid T = 0] = \\text{ATT} + \\left(E[Y(0) \\mid T = 1] - E[Y(0) \\mid T = 0]\\right)$.",
      proof: ["By consistency, $E[Y \\mid T = 1] = E[Y(1) \\mid T = 1]$ and $E[Y \\mid T = 0] = E[Y(0) \\mid T = 0]$. Add and subtract $E[Y(0) \\mid T = 1]$."],
    },
    {
      type: "theorem",
      name: "the adjustment formula",
      statement: "Under consistency, conditional exchangeability given $X$ and positivity, $E[Y(t)] = \\sum_xE[Y \\mid T = t, X = x]\\,P(X = x)$.",
      proof: [
        "$E[Y(t)] = \\sum_xE[Y(t) \\mid X = x]P(x)$ by the law of total expectation (§{conditional-probability}).",
        "Exchangeability gives $E[Y(t) \\mid X = x] = E[Y(t) \\mid T = t, X = x]$, positivity makes it defined, and consistency makes it $E[Y \\mid T = t, X = x]$.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "what to adjust for",
      statement: "Adjust for common causes of treatment and outcome (pre-treatment confounders). Do not adjust for mediators when you want the total effect, for colliders, or for variables affected by treatment. If key confounders are unmeasured, adjustment can't fix it: look for a design (§{correlation-causation}).",
      proof: ["These follow from which paths each choice blocks or opens in the DAG."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Four people have $(Y(1), Y(0))$ = (8, 6), (7, 5), (4, 3), (5, 2); the first two are treated. Find the ATE, ATT, naive difference and selection bias.",
      solution: ["Effects 2, 2, 1, 3: ATE 2; ATT (first two) 2.", "Naive $7.5 - 2.5 = 5$; selection bias $E[Y(0) \\mid T = 1] - E[Y(0) \\mid T = 0] = 5.5 - 2.5 = 3$, and $5 = 2 + 3$."],
      result: "ATE 2, ATT 2, naive 5, bias 3.",
    },
    {
      type: "example",
      level: 2,
      title: "standardisation",
      problem: "Young people (60%): mean outcome 10 if treated, 8 if not. Old (40%): 6 and 5. Assuming age is the only confounder, find the ATE.",
      solution: ["Effects by stratum: 2 and 1.", "$\\text{ATE} = 0.6 \\times 2 + 0.4 \\times 1 = 1.6$."],
      result: "1.6.",
    },
    {
      type: "example",
      level: 3,
      title: "reading a DAG",
      problem: "A DAG has $X \\to T$, $X \\to Y$, $T \\to M \\to Y$ and $T \\to C \\leftarrow Y$. Which variables should be adjusted for to estimate the total effect of $T$ on $Y$?",
      solution: ["$X$ is a confounder on the backdoor path $T \\leftarrow X \\to Y$: adjust.", "$M$ is a mediator and $C$ a collider: leave both alone."],
      result: "Adjust for $X$ only.",
    },
  ],
  pitfalls: [
    { wrong: "A difference in means is a causal effect.", right: "Only under exchangeability, as in a randomised trial." },
    { wrong: "Adjust for every available variable.", right: "Adjust for confounders; not mediators, colliders or post-treatment variables." },
    { wrong: "Ignore positivity.", right: "If some covariate groups never get treated, their effect can't be estimated from data." },
  ],
  formulas: [
    { label: "ATE", tex: "E[Y(1) - Y(0)]" },
    { label: "ATT", tex: "E[Y(1) - Y(0) \\mid T = 1]" },
    { label: "Selection bias", tex: "E[Y(0) \\mid T = 1] - E[Y(0) \\mid T = 0]" },
    { label: "Adjustment", tex: "E[Y(t)] = \\textstyle\\sum_xE[Y \\mid t, x]P(x)" },
  ],
  exercises: [
    ex(1, num("potx-ex-1", "Three people have effects $Y(1) - Y(0)$ of 4, 1 and 1. Find the ATE.", 2, "$6/3$."), ["$2$."]),
    ex(1, num("potx-ex-2", "Naive difference 7; ATT 4. Find the selection bias.", 3, "$7 - 4$."), ["$3$."]),
    ex(2, num("potx-ex-3", "Stratum A (30%) has effect 5; stratum B (70%) has effect 1. Find the ATE.", 2.2, "$1.5 + 0.7$."), ["$2.2$."]),
    ex(2, num("potx-ex-4", "Same strata; the treated are 80% A and 20% B. Find the ATT.", 4.2, "$0.8 \\times 5 + 0.2 \\times 1$."), ["$4.2$: the treated are mostly the big gainers."]),
    ex(2, num("potx-ex-5", "Treated mean outcome 50; untreated 42; untreated people would have averaged 42 and treated people 46 without treatment. Find the ATT.", 4, "$50 - 46$."), ["Naive $8 = 4 + 4$."]),
    ex(3, mc("potx-ex-6", "In a DAG $T \\to Y$, $U \\to T$, $U \\to Y$ with $U$ unmeasured, the effect of $T$", ["is not identified by adjustment: the backdoor path through $U$ stays open", "No measured set blocks it."], [["is the naive difference", "Confounding by $U$ biases it."], ["is identified by adjusting for $Y$", "Never adjust for the outcome."]]), ["Look for an instrument or another design."]),
    ex(3, mc("potx-ex-7", "A treatment is given to every patient over 70 and to none under 70. Estimating its effect by adjusting for age violates", ["positivity", "Within each age, treatment probability is 0 or 1."], [["consistency", "Consistency is about the treatment received."], ["no interference", "That concerns units affecting each other."]]), ["A regression discontinuity design can still compare just above and below 70."]),
    ex(3, mc("potx-ex-8", "Vaccinating one person protects their neighbours. This violates", ["no interference (part of SUTVA)", "One unit's treatment affects another's outcome."], [["positivity", "Everyone could be vaccinated."], ["exchangeability", "That concerns who gets treated."]]), ["Cluster-level designs handle interference."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 3 + lv;
      const ys = Array.from({ length: k }, () => {
        const y0 = r.int(2, 10);
        return [y0 + r.int(0, 5), y0];
      });
      const ate = ys.reduce((s, [a, b]) => s + a - b, 0) / k;
      return n(`${k} people have potential outcomes $(Y(1), Y(0))$ = ${ys.map(([a, b]) => `(${a}, ${b})`).join(", ")}. Find the ATE (2 decimals).`, r2(ate), `Individual effects ${ys.map(([a, b]) => a - b).join(", ")}; mean $\\approx ${r2(ate)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
      const e1 = r.int(1, 8);
      const e2 = r.int(-2, 6);
      const ate = p * e1 + (1 - p) * e2;
      return n(`Stratum A (${Math.round(p * 100)}% of people) has treatment effect ${e1}; stratum B (the rest) has effect ${e2}. Assuming the strata capture all confounding, find the ATE.`, r2(ate), `$${p} \\times ${e1} + ${r2(1 - p)} \\times ${e2} = ${r2(ate)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { t: "drink coffee", y: "live longer" },
        { t: "attend tutoring", y: "score higher" },
        { t: "use a standing desk", y: "report less back pain" },
        { t: "take vitamin D", y: "have fewer infections" },
      ]);
      const d = r.int(2, 9);
      return mcNumbers(
        `In survey data, people who ${v.t} ${v.y}, by ${d} points on average, than those who don't. The causal effect is`,
        { text: "not identified without assumptions about confounders", why: "The groups may differ in many other ways." },
        [
          { text: `${d} points`, why: "The difference in means includes selection bias.", misconception: "naive-difference-ate" },
          { text: "certainly 0", why: "Observational data can still carry causal information under assumptions." },
        ],
      );
    },
  },
];
