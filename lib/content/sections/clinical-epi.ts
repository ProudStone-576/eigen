import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Biostatistics, epidemiological statistics, clinical trial statistics and public health statistics: risks, rates, odds and their ratios; study designs; standardisation; attributable fractions; trial design, sample size, intention-to-treat and interim analyses. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const perArm = (sd: number, delta: number, zA = 1.96, zB = 0.8416) => Math.ceil((2 * (zA + zB) ** 2 * sd * sd) / (delta * delta));

const base: ConceptNode = {
  id: "clinical-epi",
  title: "Biostatistics & epidemiology",
  summary: "Medicine and public health ask who gets ill, why, and what helps. Epidemiology measures disease with risks, rates and prevalence, compares groups with risk ratios and odds ratios, and chooses study designs (cohort, case–control, trial) to fit the question. Clinical trials add randomisation, blinding, sample-size planning and analysis by intention to treat.",
  deps: ["potential-outcomes", "survival-functions", "errors-power"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "risk ratio", meaning: "$\\text{RR} = \\dfrac{P(\\text{disease} \\mid \\text{exposed})}{P(\\text{disease} \\mid \\text{unexposed})}$." },
    { term: "odds ratio", meaning: "$\\text{OR} = \\dfrac{\\text{odds of disease if exposed}}{\\text{odds if unexposed}}$, where odds $= p/(1 - p)$." },
    { term: "intention to treat", meaning: "Analysing every randomised participant in the group they were assigned to, whatever treatment they actually took." },
  ],
  misconceptions: {
    "or-equals-rr": "Reads an odds ratio as a risk ratio even when the outcome is common, overstating the effect.",
    "per-protocol-better": "Thinks analysing only participants who followed the protocol gives a more valid trial result than intention to treat.",
  },
  steps: [
    {
      type: "motivate",
      title: "Counting disease",
      body: "Is a new vaccine effective? Does living near a main road raise asthma risk? How many deaths would disappear without smoking? Each question needs a measure of disease, a comparison between groups, and a design that makes the comparison fair. Biostatistics supplies all three, and its conventions shape how medical evidence is reported everywhere.",
      realWorld: {
        title: "Doll and Hill",
        body: "Richard Doll and Austin Bradford Hill's 1950 case–control study linked smoking with lung cancer, and their cohort study of British doctors from 1951 confirmed it, measuring death rates by smoking habit over decades. Bradford Hill had also run the first modern randomised trial, of streptomycin for tuberculosis, in 1948.",
      },
    },
    {
      type: "truth",
      statement: "From a 2×2 table with $a$ diseased and $b$ healthy among the exposed, $c$ and $d$ among the unexposed: risk ratio $\\text{RR} = \\dfrac{a/(a + b)}{c/(c + d)}$, risk difference $\\text{RD} = \\dfrac{a}{a + b} - \\dfrac{c}{c + d}$, odds ratio $\\text{OR} = \\dfrac{ad}{bc}$, and the **number needed to treat** (or harm) is $1/\\lvert\\text{RD}\\rvert$. **Cohort** studies follow exposed and unexposed people and estimate risks directly; **case–control** studies sample people with and without the disease and can estimate only the OR, which approximates the RR when the disease is rare. A **rate** is events per person-time; **prevalence** $\\approx$ incidence rate $\\times$ average duration.",
      body: "To compare populations with different age structures, **direct standardisation** applies each population's age-specific rates to one standard population. The **population attributable fraction** $\\dfrac{p(\\text{RR} - 1)}{1 + p(\\text{RR} - 1)}$ (with $p$ the exposure prevalence) estimates the share of cases due to an exposure, if it is causal. In **trials**: randomise (with allocation concealed), blind where possible, pre-register the primary outcome, and size the trial for power: per arm $n \\approx \\dfrac{2(z_{\\alpha/2} + z_\\beta)^2\\sigma^2}{\\delta^2}$ (§{errors-power}). Analyse by **intention to treat**, which preserves randomisation; **per-protocol** analysis compares groups that are no longer randomised. Interim analyses use **alpha-spending** rules (such as O'Brien–Fleming) so repeated looks don't inflate the false-positive rate.",
    },
    {
      type: "predict",
      misconception: "or-equals-rr",
      item: {
        kind: "mc",
        id: "cep-predict-1",
        prompt: "Among 100 exposed people, 30 develop the condition; among 100 unexposed, 10 do. The odds ratio is about 3.86. Reporting \"exposure makes the condition 3.86 times as likely\" is",
        options: [
          { id: "a", text: "wrong: the risk ratio is 3; the OR exaggerates it because the outcome is common", correct: true, why: "$0.3/0.1 = 3$." },
          { id: "b", text: "right: the odds ratio and risk ratio are the same thing", misconception: "or-equals-rr", why: "They agree only for rare outcomes." },
          { id: "c", text: "an understatement", why: "Odds ratios are further from 1 than risk ratios." },
        ],
      },
      reveal: {
        body: "Odds are $0.3/0.7 \\approx 0.429$ and $0.1/0.9 \\approx 0.111$, so OR $= (30 \\times 90)/(70 \\times 10) \\approx 3.86$, while RR $= 3$. When the outcome is rare, $p/(1 - p) \\approx p$ and the two agree; as it becomes common, the OR moves further from 1. Logistic regression (§{logistic-regression}) reports odds ratios, so convert to risks before telling patients how much more likely something is.",
      },
      resolve: {
        kind: "mc",
        id: "cep-resolve-1",
        prompt: "An odds ratio approximates the risk ratio when",
        options: [
          { id: "a", text: "the outcome is rare in both groups", correct: true, why: "Then odds and risks are nearly equal." },
          { id: "b", text: "always", misconception: "or-equals-rr", why: "For common outcomes the OR overstates." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cep-check-1",
        prompt: "In a trial, 20% of the drug arm stopped taking the drug because of side effects. Excluding them (per-protocol) makes the drug look better than intention to treat. Which estimates the effect of prescribing the drug?",
        options: [
          { id: "a", text: "Intention to treat: it keeps the randomised comparison, including those who stopped", correct: true, why: "Excluding non-adherers selects healthier, more tolerant patients." },
          { id: "b", text: "Per-protocol, because it uses only patients who took the drug properly", misconception: "per-protocol-better", why: "Those who adhere differ from those who don't, so the groups are no longer comparable." },
          { id: "c", text: "Neither", why: "ITT answers exactly this question." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cep-check-2",
        prompt: "A treatment cuts the 5-year risk of stroke from 10% to 6%. The number needed to treat is",
        options: [
          { id: "a", text: "25", correct: true, why: "$1/0.04$." },
          { id: "b", text: "4", why: "That is the risk difference in percentage points." },
          { id: "c", text: "1.67", why: "That is the risk ratio inverted." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Clinical prediction models are judged by discrimination and calibration (§{calibration-imbalance}) and, before use, ideally by randomised trials of their impact. Reporting guidelines (TRIPOD for prediction, CONSORT for trials) apply epidemiology's lessons about bias to machine-learning studies.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cep-produce-1", prompt: "Exposed: 30 of 100 ill; unexposed: 10 of 100 ill. Find the risk ratio.", answer: 3, explain: "$0.3/0.1$." },
        { kind: "number", id: "cep-produce-2", prompt: "Same table. Find the odds ratio to 3 decimals.", answer: Math.round((2700 / 700) * 1000) / 1000, tolerance: 0.001, explain: "$(30 \\times 90)/(70 \\times 10)$." },
        {
          kind: "mc",
          id: "cep-produce-3",
          prompt: "A case–control study of a common condition reports OR 2.5. The risk ratio is most likely",
          options: [
            { id: "a", text: "smaller than 2.5", correct: true, why: "For common outcomes the OR is further from 1." },
            { id: "b", text: "exactly 2.5", misconception: "or-equals-rr", why: "Only for rare outcomes." },
          ],
        },
        {
          kind: "mc",
          id: "cep-produce-4",
          prompt: "The primary analysis of a randomised trial should normally be",
          options: [
            { id: "a", text: "intention to treat", correct: true, why: "It preserves randomisation." },
            { id: "b", text: "per-protocol, which is less biased", misconception: "per-protocol-better", why: "Excluding non-adherers breaks randomisation." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cep-review-1", prompt: "Incidence 5 per 1,000 per year; average duration 4 years. Estimate the prevalence per 1,000.", answer: 20, explain: "$5 \\times 4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "direct standardisation",
      body: "Choose a standard population with age weights $w_a$. The age-standardised rate is $\\sum_aw_ar_a$, using the study population's age-specific rates $r_a$. Two countries with the same rates at every age then get the same standardised rate, even if one is much older (and so has a higher crude rate).",
    },
    {
      type: "definition",
      term: "trial phases and designs",
      body: "Phase I: safety and dose in a few people. Phase II: early efficacy. Phase III: large randomised comparison with standard care. Phase IV: monitoring after approval. Designs include parallel groups, crossover (each person gets both treatments in random order), cluster randomisation (whole schools or villages), and non-inferiority trials, which test whether a new treatment is no worse than the standard by more than a pre-set margin.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "odds ratio and risk ratio",
      statement: "$\\text{OR} = \\text{RR} \\times \\dfrac{1 - p_0}{1 - p_1}$, where $p_1$ and $p_0$ are the risks in the exposed and unexposed. If $\\text{RR} > 1$, then $\\text{OR} > \\text{RR}$, and $\\text{OR} \\approx \\text{RR}$ when both risks are small.",
      proof: ["$\\dfrac{p_1/(1 - p_1)}{p_0/(1 - p_0)} = \\dfrac{p_1}{p_0} \\cdot \\dfrac{1 - p_0}{1 - p_1}$; with $p_1 > p_0$ the second factor exceeds 1."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "case–control studies estimate the odds ratio",
      statement: "Sampling cases and controls at fixed proportions changes the disease odds in each exposure group by the same factor, so the exposure odds ratio among cases and controls equals the disease odds ratio in the population.",
      proof: ["The OR $ad/bc$ is symmetric in rows and columns, and multiplying the case row by a sampling fraction and the control row by another cancels."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "trial sample size",
      statement: "To detect a mean difference $\\delta$ with outcome SD $\\sigma$, two-sided level $\\alpha$ and power $1 - \\beta$, each arm needs about $\\dfrac{2(z_{\\alpha/2} + z_\\beta)^2\\sigma^2}{\\delta^2}$ participants; for 5% and 80%, $(z_{\\alpha/2} + z_\\beta)^2 \\approx 7.85$.",
      proof: ["The difference in means has SE $\\sigma\\sqrt{2/n}$; require $\\delta = (z_{\\alpha/2} + z_\\beta)\\sigma\\sqrt{2/n}$ and solve for $n$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Exposed: 30 of 100 ill. Unexposed: 10 of 100 ill. Find RR, RD, OR and the number needed to harm.",
      solution: ["RR $= 3$; RD $= 0.2$; OR $= 2700/700 \\approx 3.86$.", "Number needed to harm $= 1/0.2 = 5$: one extra case for every 5 people exposed."],
      result: "3, 0.2, 3.86, 5.",
    },
    {
      type: "example",
      level: 2,
      title: "planning a trial",
      problem: "Blood-pressure SD is 10 mmHg; the trial should detect a 5 mmHg difference with 80% power at 5%. Find the size of each arm.",
      solution: ["$n = 2 \\times 7.85 \\times 100/25 \\approx 62.8$.", "63 per arm; allowing 10% dropout, recruit about 70."],
      result: "63 per arm.",
    },
    {
      type: "example",
      level: 3,
      title: "attributable fraction",
      problem: "30% of adults smoke and smoking doubles the risk of a disease. What fraction of cases is attributable to smoking?",
      solution: ["$\\dfrac{0.3 \\times (2 - 1)}{1 + 0.3 \\times (2 - 1)} = \\dfrac{0.3}{1.3}$.", "$\\approx 0.231$: about 23% of cases would not occur without smoking, if the effect is causal."],
      result: "About 23%.",
    },
  ],
  pitfalls: [
    { wrong: "Report an odds ratio as a risk ratio for a common outcome.", right: "Convert to risks; the OR overstates." },
    { wrong: "Analyse trials per protocol.", right: "Use intention to treat as the primary analysis." },
    { wrong: "Compare crude death rates of countries with different age structures.", right: "Age-standardise." },
  ],
  formulas: [
    { label: "Risk ratio", tex: "\\text{RR} = \\dfrac{a/(a + b)}{c/(c + d)}" },
    { label: "Odds ratio", tex: "\\text{OR} = \\dfrac{ad}{bc}" },
    { label: "NNT", tex: "1/\\lvert\\text{RD}\\rvert" },
    { label: "PAF", tex: "\\dfrac{p(\\text{RR} - 1)}{1 + p(\\text{RR} - 1)}" },
  ],
  exercises: [
    ex(1, num("cepx-ex-1", "A treatment lowers risk from 20% to 15%. Find the number needed to treat.", 20, "$1/0.05$."), ["$20$."]),
    ex(1, num("cepx-ex-2", "Exposed 12 of 200 ill; unexposed 6 of 200 ill. Find the risk ratio.", 2, "$0.06/0.03$."), ["$2$."]),
    ex(2, dp("cepx-ex-3", "Same table. Find the odds ratio.", (12 * 194) / (188 * 6), "$(12 \\times 194)/(188 \\times 6)$."), ["$\\approx 2.064$: close to RR because the outcome is rare."]),
    ex(2, num("cepx-ex-4", "Age-specific death rates 2 and 10 per 1,000 for young and old; standard population 60% young, 40% old. Find the standardised rate per 1,000.", 5.2, "$0.6 \\times 2 + 0.4 \\times 10$."), ["$5.2$."]),
    ex(2, num("cepx-ex-5", "Outcome SD 8, target difference 4, 5% level, 80% power. Find the size of each arm.", perArm(8, 4), "$2 \\times 7.85 \\times 64/16$."), ["$62.8 \\to 63$."]),
    ex(3, dp("cepx-ex-6", "Exposure prevalence 0.5 and RR 3. Find the population attributable fraction.", 1 / 2, "$\\tfrac{0.5 \\times 2}{1 + 0.5 \\times 2}$."), ["$0.5$."]),
    ex(3, mc("cepx-ex-7", "A test with sensitivity 90% and specificity 95% is used where prevalence is 1%. A positive result means disease with probability about", ["15%", "PPV $= 0.009/(0.009 + 0.0495)$."], [["90%", "That is the sensitivity."], ["95%", "That is the specificity."]]), ["Screening rare conditions gives many false positives (§{bayes})."]),
    ex(3, mc("cepx-ex-8", "A trial checks its data 5 times and stops at the first p < 0.05. Without adjustment, its overall false-positive rate is", ["well above 5%", "Each look is another chance."], [["exactly 5%", "Repeated looks inflate it."], ["below 5%", "They raise it, not lower it."]]), ["Use an alpha-spending rule such as O'Brien–Fleming."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const n1 = r.pick([100, 200, 500]);
      const n0 = n1;
      const a = r.int(5, Math.round(n1 * 0.5));
      const c = r.int(2, Math.round(n1 * 0.3));
      const b = n1 - a;
      const d = n0 - c;
      const want = lv === 1 ? "risk ratio" : r.pick(["risk ratio", "odds ratio", "risk difference"] as const);
      const v = want === "risk ratio" ? a / n1 / (c / n0) : want === "odds ratio" ? (a * d) / (b * c) : a / n1 - c / n0;
      return n(`Exposed: ${a} of ${n1} ill. Unexposed: ${c} of ${n0} ill. Find the ${want} (3 decimals).`, Math.round(v * 1000) / 1000, want === "odds ratio" ? `$(${a} \\times ${d})/(${b} \\times ${c}) \\approx ${Math.round(v * 1000) / 1000}$.` : want === "risk ratio" ? `$(${a}/${n1})/(${c}/${n0}) \\approx ${Math.round(v * 1000) / 1000}$.` : `$${a}/${n1} - ${c}/${n0} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p0 = r.pick([0.15, 0.2, 0.25, 0.3]);
      const red = r.pick([0.02, 0.04, 0.05, 0.1]);
      const v = Math.round(1 / red);
      return n(`A treatment lowers a risk from ${Math.round(p0 * 100)}% to ${Math.round((p0 - red) * 100)}%. Find the number needed to treat.`, v, `$1/${red} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const sd = r.pick([5, 8, 10, 12, 15]);
      const delta = r.pick([2, 3, 4, 5, 6]);
      const v = perArm(sd, delta);
      return n(`Outcome SD ${sd}; detect a difference of ${delta} with 80% power at the 5% level. Find the size of each arm (round up).`, v, `$2 \\times 7.85 \\times ${sd * sd}/${delta * delta}$, rounded up: ${v}.`, 1);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const or = r.pick([2.2, 2.8, 3.5, 4.1]);
      const prev = r.pick(["40%", "35%", "50%"]);
      return mcNumbers(
        `A study of an outcome affecting ${prev} of people reports odds ratio ${or}. Saying the exposure makes it "${or} times as likely" is`,
        { text: "an overstatement: for a common outcome the risk ratio is closer to 1", why: "OR exceeds RR when RR > 1." },
        [{ text: "correct", why: "OR and RR differ for common outcomes.", misconception: "or-equals-rr" }],
      );
    },
  },
];
