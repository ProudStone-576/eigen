import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Mediation (direct and indirect effects), moderation, sensitivity analysis and E-values, negative controls, target trial emulation. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const evalue = (rr: number) => rr + Math.sqrt(rr * (rr - 1));

const base: ConceptNode = {
  id: "mediation-sensitivity",
  title: "Mediation, moderation & sensitivity",
  summary: "Once an effect is estimated, three questions follow. How does it work: through which mediators? For whom: which moderators change its size? And how sure are we: how strong would an unmeasured confounder have to be to explain it away? Negative controls and target trial emulation are practical guards against the biases observational studies are prone to.",
  deps: ["propensity-scores", "regression-features"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "mediator", meaning: "A variable on the causal path from treatment to outcome: $T \\to M \\to Y$." },
    { term: "moderator", meaning: "A variable that changes the size of the treatment's effect (effect modification)." },
    { term: "E-value", meaning: "The minimum strength of association an unmeasured confounder would need with both treatment and outcome to explain away an observed risk ratio." },
  ],
  misconceptions: {
    "randomized-mediator": "Thinks that randomising the treatment makes the mediator–outcome relationship causal too, so indirect effects need no further assumptions.",
    "moderator-mediator-same": "Confuses a moderator, which changes how big the effect is, with a mediator, which carries the effect.",
  },
  steps: [
    {
      type: "motivate",
      title: "How, for whom, how sure",
      body: "A tutoring programme raises exam marks. Does it work by increasing study time, or by building confidence? Does it help weaker students more? And if the evidence is observational, could an unmeasured difference between students explain the whole result? These questions shape whether and how the programme should be expanded.",
      realWorld: {
        title: "Smoking and lung cancer",
        body: "In 1959, critics argued an unmeasured genetic factor might explain the link between smoking and lung cancer. Cornfield and colleagues showed such a factor would have to be about nine times more common among smokers, which was implausible: an early sensitivity analysis.",
      },
    },
    {
      type: "truth",
      statement: "In the linear mediation model $M = \\alpha_0 + aT + e_M$ and $Y = \\beta_0 + c'T + bM + e_Y$, the **indirect effect** is $ab$, the **direct effect** $c'$, and the **total effect** $c = c' + ab$. **Moderation** is effect modification, modelled by an interaction: in $Y = \\beta_0 + \\beta_1T + \\beta_2W + \\beta_3TW$, the effect of $T$ is $\\beta_1 + \\beta_3W$ (§{regression-features}). The **E-value** for an observed risk ratio $\\text{RR} > 1$ is $\\text{RR} + \\sqrt{\\text{RR}(\\text{RR} - 1)}$.",
      body: "Even when $T$ is randomised, $M$ is not: the $M \\to Y$ link can be confounded, so indirect effects need no unmeasured mediator–outcome confounding. **Sensitivity analysis** asks how much unmeasured confounding would change the conclusion; a small E-value means a weak confounder could explain the result. A **negative control outcome** is one the treatment can't plausibly affect; finding an \"effect\" on it reveals bias. **Target trial emulation** writes down the randomised trial you would run (eligibility, time zero, treatment strategies, follow-up, analysis) and makes the observational analysis follow it, avoiding biases such as immortal time.",
    },
    {
      type: "predict",
      misconception: "randomized-mediator",
      item: {
        kind: "mc",
        id: "med-predict-1",
        prompt: "A randomised trial of a diet finds it lowers blood pressure, and that weight loss accounts for much of the effect. Is the indirect effect through weight loss as trustworthy as the total effect?",
        options: [
          { id: "a", text: "No: weight loss wasn't randomised, so the weight–blood pressure link may be confounded", correct: true, why: "Exercise, say, could drive both weight loss and blood pressure." },
          { id: "b", text: "Yes: randomising the diet makes every downstream estimate causal", misconception: "randomized-mediator", why: "Randomisation covers the treatment, not the mediator." },
          { id: "c", text: "No, because indirect effects can never be estimated", why: "They can, under extra assumptions." },
        ],
      },
      reveal: {
        body: "Randomising the diet makes the total effect unconfounded. But splitting it into direct and indirect parts compares people with different weight changes, and who loses more weight isn't random: those who also exercised might lose more weight and have lower blood pressure for other reasons. Mediation analysis needs no unmeasured confounding of $M$ and $Y$, which the trial doesn't guarantee.",
      },
      resolve: {
        kind: "mc",
        id: "med-resolve-1",
        prompt: "In a randomised trial, the mediator–outcome relationship is",
        options: [
          { id: "a", text: "still observational and possibly confounded", correct: true, why: "The mediator isn't randomised." },
          { id: "b", text: "causal, because the treatment was randomised", misconception: "randomized-mediator", why: "Randomisation doesn't extend to the mediator." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "med-check-1",
        prompt: "A reading programme helps children with low starting scores more than those with high starting scores. Starting score is a",
        options: [
          { id: "a", text: "moderator: it changes the size of the effect", correct: true, why: "Effect modification." },
          { id: "b", text: "mediator: it carries the effect", misconception: "moderator-mediator-same", why: "Starting score comes before treatment, so it can't be on the causal path." },
          { id: "c", text: "collider", why: "It isn't caused by both treatment and outcome." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "med-check-2",
        prompt: "An observational study finds risk ratio 2. Its E-value is about",
        options: [
          { id: "a", text: "3.41", correct: true, why: "$2 + \\sqrt2$." },
          { id: "b", text: "2", why: "The E-value exceeds the RR." },
          { id: "c", text: "1.41", why: "Add the RR." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Fairness analyses often ask a mediation question: how much of a model's difference in outcomes between groups flows through legitimate variables and how much through proxies? Path-specific effects formalise this, with the same caution about confounded mediators.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "med-produce-1", prompt: "$a = 0.5$, $b = 2$ and $c' = 1$. Find the total effect.", answer: 2, explain: "$1 + 0.5 \\times 2$." },
        { kind: "number", id: "med-produce-2", prompt: "Same model. What proportion of the total effect is mediated?", answer: 0.5, explain: "$1/2$." },
        {
          kind: "mc",
          id: "med-produce-3",
          prompt: "A drug works better in younger patients. Age is",
          options: [
            { id: "a", text: "a moderator", correct: true, why: "It changes the effect's size." },
            { id: "b", text: "a mediator", misconception: "moderator-mediator-same", why: "The drug doesn't change age." },
          ],
        },
        {
          kind: "mc",
          id: "med-produce-4",
          prompt: "A trial randomises a training course and estimates the indirect effect through confidence. The key extra assumption is",
          options: [
            { id: "a", text: "no unmeasured confounding of confidence and the outcome", correct: true, why: "The mediator wasn't randomised." },
            { id: "b", text: "none: the course was randomised", misconception: "randomized-mediator", why: "Randomising the course doesn't randomise confidence." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "med-review-1", prompt: "$a = 2$, $b = 0.5$ and $c' = 3$. Find the indirect effect.", answer: 1, explain: "$ab$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "natural direct and indirect effects",
      body: "The **natural direct effect** is $E[Y(1, M(0)) - Y(0, M(0))]$: change the treatment but hold the mediator at what it would have been untreated. The **natural indirect effect** is $E[Y(1, M(1)) - Y(1, M(0))]$. They sum to the total effect and reduce to $c'$ and $ab$ in the linear model without interaction.",
    },
    {
      type: "definition",
      term: "negative controls and target trials",
      body: "A **negative control outcome** shares the study's possible biases but can't be caused by the treatment (flu vaccination and hip fracture, say); a **negative control exposure** can't cause the outcome. A non-null result for either signals confounding or measurement bias. In **target trial emulation**, aligning eligibility, treatment assignment and the start of follow-up at the same time zero avoids **immortal time bias**, where the treated group gets credit for time before treatment in which they had to survive.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the product of coefficients",
      statement: "In the linear mediation model without $T \\times M$ interaction, the total effect of $T$ on $Y$ is $c = c' + ab$.",
      proof: ["Substitute $M = \\alpha_0 + aT + e_M$ into $Y = \\beta_0 + c'T + bM + e_Y$: the coefficient on $T$ becomes $c' + ab$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the E-value",
      statement: "For an observed risk ratio $\\text{RR} > 1$, an unmeasured confounder with risk ratio at least $E = \\text{RR} + \\sqrt{\\text{RR}(\\text{RR} - 1)}$ with both treatment and outcome could explain the association away; weaker confounding could not. For $\\text{RR} < 1$, use $1/\\text{RR}$.",
      proof: ["It solves the bounding inequality $\\dfrac{E^2}{2E - 1} = \\text{RR}$, the largest bias factor a confounder with associations $E$ and $E$ can produce (VanderWeele and Ding, 2017)."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "moderator or mediator?",
      statement: "A mediator is affected by the treatment and lies between it and the outcome; a moderator is typically measured before treatment and changes the effect's size. Adjusting for a mediator removes part of the effect; estimating effects within levels of a moderator shows heterogeneity.",
      proof: ["Timing and the causal diagram decide the role (§{potential-outcomes})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$a = 0.5$, $b = 2$, $c' = 1$. Find the indirect, direct and total effects, and the proportion mediated.",
      solution: ["Indirect $ab = 1$; direct $c' = 1$.", "Total $2$; proportion mediated $1/2 = 50\\%$."],
      result: "1, 1, 2; 50%.",
    },
    {
      type: "example",
      level: 2,
      title: "an E-value",
      problem: "A cohort study reports risk ratio 3 for an exposure. Find the E-value and interpret it.",
      solution: ["$E = 3 + \\sqrt{3 \\times 2} = 3 + 2.449 = 5.449$.", "An unmeasured confounder would need risk ratio about 5.4 with both exposure and outcome to explain the result away."],
      result: "About 5.45.",
    },
    {
      type: "example",
      level: 3,
      title: "moderation",
      problem: "$Y = 50 + 4T + 2W - 1.5TW$, where $W$ is hours of sleep (centred). Find the effect of $T$ at $W = -2$ and $W = 2$.",
      solution: ["Effect $= 4 - 1.5W$.", "$W = -2$: $7$. $W = 2$: $1$. The treatment helps sleep-deprived people far more."],
      result: "7 and 1.",
    },
  ],
  pitfalls: [
    { wrong: "Randomising the treatment makes mediation estimates causal.", right: "Mediator–outcome confounding must also be ruled out." },
    { wrong: "Moderator and mediator are interchangeable.", right: "Mediators carry the effect; moderators change its size." },
    { wrong: "A significant result is robust.", right: "Report how strong unmeasured confounding would need to be (E-value)." },
  ],
  formulas: [
    { label: "Mediation", tex: "c = c' + ab" },
    { label: "Moderation", tex: "\\partial Y/\\partial T = \\beta_1 + \\beta_3W" },
    { label: "E-value", tex: "\\text{RR} + \\sqrt{\\text{RR}(\\text{RR} - 1)}" },
    { label: "Natural indirect", tex: "E[Y(1, M(1)) - Y(1, M(0))]" },
  ],
  exercises: [
    ex(1, num("medx-ex-1", "$a = 3$, $b = 0.4$. Find the indirect effect.", 1.2, "$ab$."), ["$1.2$."]),
    ex(1, num("medx-ex-2", "Total effect 5, direct effect 3. Find the indirect effect.", 2, "$5 - 3$."), ["$2$."]),
    ex(2, dp("medx-ex-3", "Find the E-value for a risk ratio of 1.5.", evalue(1.5), "$\\text{RR} + \\sqrt{\\text{RR}(\\text{RR} - 1)}$."), ["$1.5 + \\sqrt{0.75} \\approx 2.366$."]),
    ex(2, dp("medx-ex-4", "Find the E-value for a protective risk ratio of 0.5.", evalue(2), "Invert first."), ["$1/0.5 = 2$; $2 + \\sqrt2 \\approx 3.414$."]),
    ex(2, num("medx-ex-5", "$Y = 10 + 3T + W + 2TW$. Find the effect of $T$ when $W = 1.5$.", 6, "$3 + 2 \\times 1.5$."), ["$6$."]),
    ex(3, mc("medx-ex-6", "Flu vaccination appears to reduce hospitalisation for hip fractures by 20%. This suggests", ["healthier people get vaccinated: confounding biases the study's main result too", "The vaccine can't prevent fractures, so this is a negative control."], [["the vaccine prevents fractures", "There is no plausible mechanism."], ["the main result is confirmed", "It shows bias, not confirmation."]]), ["The \"healthy vaccinee\" effect."]),
    ex(3, mc("medx-ex-7", "An observational study counts a patient as treated from diagnosis, though they started the drug 6 months later. This risks", ["immortal time bias: treated patients had to survive 6 months to be treated", "That time is misattributed."], [["no bias", "The 6 months are credited to treatment wrongly."], ["collider bias", "It is a timing error."]]), ["Align time zero as in a target trial."]),
    ex(3, mc("medx-ex-8", "An E-value of 1.2 means", ["a weak unmeasured confounder could explain the result away", "Small E-values signal fragile conclusions."], [["the result is very robust", "Robust results have large E-values."], ["the risk ratio is 1.2", "The E-value exceeds the RR."]]), ["Report it with the confidence limit's E-value too."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([0.2, 0.5, 0.8, 1, 1.5, 2]);
      const b = r.pick([0.5, 1, 1.5, 2, 3]);
      const c = r.pick([0, 0.5, 1, 2, 3]);
      const want = r.pick(["indirect", "total"] as const);
      const v = want === "indirect" ? a * b : c + a * b;
      return n(`Linear mediation model with $a = ${a}$, $b = ${b}$ and $c' = ${c}$. Find the ${want} effect.`, r2(v), want === "indirect" ? `$ab = ${r2(a * b)}$.` : `$c' + ab = ${c} + ${r2(a * b)} = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const rr = r.pick([1.3, 1.5, 1.8, 2, 2.5, 3, 4]);
      const v = evalue(rr);
      return n(`Find the E-value for an observed risk ratio of ${rr} (3 decimals).`, Math.round(v * 1000) / 1000, `$${rr} + \\sqrt{${rr} \\times ${r2(rr - 1)}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { x: "Baseline anxiety", t: "a therapy", how: "works better for highly anxious patients", role: "moderator" },
        { x: "Sex", t: "a drug", how: "has a larger effect in women than men", role: "moderator" },
        { x: "Practice time", t: "a coaching scheme", how: "increases practice time, which then improves performance", role: "mediator" },
        { x: "Cholesterol", t: "a statin", how: "lowers cholesterol, which then reduces heart attacks", role: "mediator" },
      ]);
      const other = v.role === "moderator" ? "mediator" : "moderator";
      return mcNumbers(
        `${v.t[0].toUpperCase()}${v.t.slice(1)} ${v.how}. ${v.x} is a`,
        { text: v.role, why: v.role === "moderator" ? "It changes the effect's size." : "It carries the effect from treatment to outcome." },
        [{ text: other, why: v.role === "moderator" ? "The treatment doesn't change it." : "It lies on the causal path.", misconception: "moderator-mediator-same" }],
      );
    },
  },
];
