import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The Cox proportional hazards model, hazard ratios and the PH assumption; parametric survival models (exponential, Weibull, log-normal); accelerated failure time models; Weibull reliability and B-lives. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "cox-model",
  title: "Cox & parametric survival models",
  summary: "The Cox model relates the hazard to covariates: each covariate multiplies the hazard by a fixed factor, the hazard ratio, while the baseline hazard is left completely unspecified. Parametric models such as the Weibull specify the whole distribution instead, which allows extrapolation and reliability calculations. Accelerated failure time models describe covariates as stretching or shrinking time itself.",
  deps: ["kaplan-meier", "glm", "likelihood-ratio"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "hazard ratio", meaning: "$e^\\beta$: the factor by which a one-unit increase in a covariate multiplies the hazard." },
    { term: "proportional hazards", meaning: "The assumption that hazard ratios stay constant over time." },
    { term: "time ratio", meaning: "In an AFT model, $e^\\gamma$: the factor by which a covariate stretches survival times." },
  ],
  misconceptions: {
    "hr-is-risk-ratio": "Reads a hazard ratio of 2 as twice the probability of the event by the end of follow-up.",
    "ph-unchecked": "Assumes proportional hazards without checking, even when survival curves cross or effects fade over time.",
  },
  steps: [
    {
      type: "motivate",
      title: "Effects on the rate",
      body: "Smokers, older patients and those with advanced disease all die sooner, but the baseline risk itself rises and falls over time in complicated ways. David Cox's 1972 insight was that we can estimate how covariates scale the hazard without ever modelling its shape. It became one of the most used models in medicine.",
      realWorld: {
        title: "Trial results",
        body: "Clinical trials of cancer drugs usually report a hazard ratio with a confidence interval: \"HR 0.70 (0.58 to 0.85)\" means the treatment lowers the death rate by about 30% at any given time, if hazards are proportional.",
      },
    },
    {
      type: "truth",
      statement: "The **Cox model** is $h(t \\mid \\vec x) = h_0(t)\\exp(\\vec\\beta^{\\mathsf T}\\vec x)$, with the baseline hazard $h_0(t)$ unspecified. The **hazard ratio** for a one-unit increase in $x_j$ is $e^{\\beta_j}$, the same at all times. It implies $S(t \\mid \\vec x) = S_0(t)^{\\exp(\\vec\\beta^{\\mathsf T}\\vec x)}$. $\\vec\\beta$ is estimated from the **partial likelihood** $\\prod_{\\text{events } i}\\dfrac{e^{\\vec\\beta^{\\mathsf T}\\vec x_i}}{\\sum_{j \\in R(t_i)}e^{\\vec\\beta^{\\mathsf T}\\vec x_j}}$, which compares the subject who failed with everyone at risk then.",
      body: "Check **proportional hazards** with log–log survival plots (parallel curves), Schoenfeld residuals (no trend over time) or a time interaction; if it fails, stratify, add time-varying effects, or report the hazard ratio in time windows. **Parametric** models specify $h_0$: exponential (constant), Weibull (monotone, §{survival-functions}), log-normal and log-logistic (rising then falling). **Accelerated failure time** models write $\\ln T = \\mu + \\vec\\gamma^{\\mathsf T}\\vec x + \\sigma W$, so covariates multiply survival times by $e^{\\gamma}$. The Weibull is both a PH and an AFT model.",
    },
    {
      type: "predict",
      misconception: "hr-is-risk-ratio",
      item: {
        kind: "mc",
        id: "cox-predict-1",
        prompt: "With proportional hazards and hazard ratio 2, the control group's 5-year survival is 0.8. The treated group's 5-year risk of the event is",
        options: [
          { id: "a", text: "0.36, so the risk ratio is 1.8, not 2", correct: true, why: "$S_1 = 0.8^2 = 0.64$, risk $0.36$ against $0.2$." },
          { id: "b", text: "0.4: twice the control risk of 0.2", misconception: "hr-is-risk-ratio", why: "Hazards multiply rates, not cumulative risks." },
          { id: "c", text: "0.16", why: "That is $0.8^2$ subtracted from 0.8, which isn't meaningful." },
        ],
      },
      reveal: {
        body: "Under proportional hazards, $S_1(t) = S_0(t)^{\\text{HR}} = 0.8^2 = 0.64$. The cumulative risks are $0.2$ and $0.36$, a risk ratio of 1.8. The gap between HR and risk ratio grows as events become common: when nearly everyone eventually has the event, the risk ratio tends to 1 whatever the hazard ratio.",
      },
      resolve: {
        kind: "mc",
        id: "cox-resolve-1",
        prompt: "A hazard ratio of 2 means",
        options: [
          { id: "a", text: "the event rate is twice as high at every moment among those still at risk", correct: true, why: "It compares instantaneous rates." },
          { id: "b", text: "twice the probability of the event by the end of the study", misconception: "hr-is-risk-ratio", why: "Cumulative risks don't double." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cox-check-1",
        prompt: "Surgery has high early mortality but much better long-term survival than medication: the Kaplan–Meier curves cross. A single Cox hazard ratio for surgery",
        options: [
          { id: "a", text: "misdescribes the effect, since proportional hazards fails; model the effect over time", correct: true, why: "The hazard ratio changes from above 1 to below 1." },
          { id: "b", text: "summarises it well", misconception: "ph-unchecked", why: "One constant ratio averages away opposite effects." },
          { id: "c", text: "must equal 1", why: "It is some weighted average; that is the problem." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cox-check-2",
        prompt: "A Cox model has $\\beta = -0.357$ for treatment. The hazard ratio is about",
        options: [
          { id: "a", text: "0.70", correct: true, why: "$e^{-0.357}$." },
          { id: "b", text: "−0.36", why: "Exponentiate the coefficient." },
          { id: "c", text: "1.43", why: "That is $e^{0.357}$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Cox-style losses (the negative partial likelihood) let gradient boosting and neural networks learn $\\beta^{\\mathsf T}x$ as any flexible function of the features, as in DeepSurv. Predictive maintenance fits Weibull or AFT models to sensor data to schedule repairs before failures.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cox-produce-1", prompt: "Baseline 3-year survival 0.9; hazard ratio 3 under PH. Find the 3-year survival for the higher-risk group to 3 decimals.", answer: 0.729, tolerance: 0.001, explain: "$0.9^3$." },
        { kind: "number", id: "cox-produce-2", prompt: "An AFT model has $\\gamma = 0.693$ for a treatment. By what factor are survival times multiplied?", answer: 2, tolerance: 0.01, explain: "$e^{0.693}$." },
        {
          kind: "mc",
          id: "cox-produce-3",
          prompt: "HR = 1.5, and 60% of controls have the event by 10 years. The treated 10-year risk is",
          options: [
            { id: "a", text: "about 75%, from $1 - 0.4^{1.5}$", correct: true, why: "Survival is raised to the power HR." },
            { id: "b", text: "90%, 1.5 times 60%", misconception: "hr-is-risk-ratio", why: "Hazard ratios don't scale cumulative risk." },
          ],
        },
        {
          kind: "mc",
          id: "cox-produce-4",
          prompt: "Schoenfeld residuals for a covariate trend strongly with time. You should",
          options: [
            { id: "a", text: "allow its effect to vary with time, or stratify on it", correct: true, why: "Its hazard ratio isn't constant." },
            { id: "b", text: "keep the single hazard ratio, since PH can be assumed", misconception: "ph-unchecked", why: "The check says it fails." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cox-review-1", prompt: "A Cox coefficient is $\\beta = 0.405$. Find the hazard ratio to 2 decimals.", answer: 1.5, tolerance: 0.01, explain: "$e^{0.405}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "parametric and AFT models",
      body: "In an **AFT** model $T = e^{\\vec\\gamma^{\\mathsf T}\\vec x}T_0$: a time ratio of 1.5 means the treated live 50% longer at every quantile. Choosing $W$ gives the distribution: extreme-value $W$ gives the Weibull, normal gives log-normal, logistic gives log-logistic. A Weibull with shape $k$ has PH coefficients $\\beta = -k\\gamma$. Parametric fits use the full likelihood, with each censored subject contributing $S(t_i)$ and each event $f(t_i)$ (§{mle}).",
    },
    {
      type: "definition",
      term: "Weibull reliability",
      body: "In reliability engineering the Weibull shape $k$ (often written $\\beta$) diagnoses failure modes, and the **B-life** $B_p$ is the time by which a fraction $p$ of units fail: $B_p = \\lambda(-\\ln(1 - p))^{1/k}$. B10 life is a common design specification for bearings.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "survival under proportional hazards",
      statement: "If $h_1(t) = \\text{HR}\\cdot h_0(t)$ for all $t$, then $S_1(t) = S_0(t)^{\\text{HR}}$.",
      proof: ["$H_1 = \\text{HR}\\cdot H_0$, so $S_1 = e^{-H_1} = (e^{-H_0})^{\\text{HR}}$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the partial likelihood term",
      statement: "Given that one subject in the risk set $R(t_i)$ fails at $t_i$, the probability it is subject $i$ is $\\dfrac{e^{\\vec\\beta^{\\mathsf T}\\vec x_i}}{\\sum_{j \\in R(t_i)}e^{\\vec\\beta^{\\mathsf T}\\vec x_j}}$, free of $h_0$.",
      proof: ["Each subject's hazard is $h_0(t_i)e^{\\vec\\beta^{\\mathsf T}\\vec x_j}$; the share belonging to $i$ cancels $h_0(t_i)$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "reporting",
      statement: "Report hazard ratios with confidence intervals and the evidence for proportional hazards; give absolute survival or risk differences at clinically relevant times too, since hazard ratios don't translate directly into risks.",
      proof: ["Readers act on absolute risks; the HR-to-risk link depends on the baseline survival."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A Cox model gives $\\beta = 0.693$ for smoking. Interpret it.",
      solution: ["$\\text{HR} = e^{0.693} = 2$.", "At any time, a smoker still alive has twice the death rate of a comparable non-smoker."],
      result: "HR 2.",
    },
    {
      type: "example",
      level: 2,
      title: "from hazard ratio to survival",
      problem: "Control 5-year survival 0.8; HR 0.5 for treatment. Find the treated 5-year survival and the risk difference.",
      solution: ["$S_1 = 0.8^{0.5} \\approx 0.894$.", "Risks $0.2$ and $0.106$: an absolute reduction of about 9.4 points."],
      result: "0.894; risk difference about 0.094.",
    },
    {
      type: "example",
      level: 3,
      title: "a B10 life",
      problem: "Bearings follow a Weibull with scale 1000 hours and shape 2. Find the B10 life.",
      solution: ["$B_{10} = 1000(-\\ln 0.9)^{1/2} = 1000\\sqrt{0.10536}$.", "$\\approx 324.6$ hours: 10% fail by then."],
      result: "About 325 hours.",
    },
  ],
  pitfalls: [
    { wrong: "HR = 2 means twice the risk.", right: "It doubles the rate; cumulative risks rise by less." },
    { wrong: "Assume proportional hazards.", right: "Check it; crossing curves are a clear warning." },
    { wrong: "Extrapolate a Cox model beyond the data.", right: "The baseline hazard is only known where there were events; parametric models extrapolate, with care." },
  ],
  formulas: [
    { label: "Cox", tex: "h(t \\mid \\vec x) = h_0(t)e^{\\vec\\beta^{\\mathsf T}\\vec x}" },
    { label: "PH survival", tex: "S_1(t) = S_0(t)^{\\text{HR}}" },
    { label: "AFT", tex: "\\ln T = \\mu + \\vec\\gamma^{\\mathsf T}\\vec x + \\sigma W" },
    { label: "B-life", tex: "B_p = \\lambda(-\\ln(1 - p))^{1/k}" },
  ],
  exercises: [
    ex(1, dp("coxx-ex-1", "A Cox coefficient is $\\beta = -0.223$. Find the hazard ratio.", Math.exp(-0.223), "$e^\\beta$."), ["$\\approx 0.800$: a 20% lower rate."]),
    ex(1, dp("coxx-ex-2", "HR 1.8 per 10 years of age. Find $\\beta$ per 10 years.", Math.log(1.8), "$\\ln 1.8$."), ["$\\approx 0.588$."]),
    ex(2, dp("coxx-ex-3", "Baseline 2-year survival 0.7; HR 1.5. Find the 2-year survival.", 0.7 ** 1.5, "$0.7^{1.5}$."), ["$\\approx 0.586$."]),
    ex(2, dp("coxx-ex-4", "Covariates $x_1 = 1$ (HR 2) and $x_2 = 3$ (HR 1.2 per unit). Find the combined hazard ratio against $x_1 = x_2 = 0$.", 2 * 1.2 ** 3, "Hazard ratios multiply."), ["$2 \\times 1.2^3 = 3.456$."]),
    ex(2, dp("coxx-ex-5", "Weibull bearings: scale 2000 hours, shape 1.5. Find the B10 life in hours.", 2000 * (-Math.log(0.9)) ** (1 / 1.5), "$\\lambda(-\\ln 0.9)^{1/k}$."), ["$\\approx 445.947$ hours."]),
    ex(3, dp("coxx-ex-6", "An AFT model's time ratio for a drug is 1.4. If the control median survival is 10 months, find the treated median.", 14, "Times scale by the ratio."), ["$14$ months."]),
    ex(3, mc("coxx-ex-7", "Log–log survival curves for two groups are parallel. This supports", ["proportional hazards", "Parallel $\\ln(-\\ln S)$ curves mean a constant hazard ratio."], [["crossing hazards", "Crossing would show as crossing lines."], ["an exponential baseline", "Parallel lines say nothing about the baseline's shape."]]), ["$\\ln(-\\ln S_1) = \\ln \\text{HR} + \\ln(-\\ln S_0)$."]),
    ex(3, mc("coxx-ex-8", "To predict how many turbines will fail in years 20 to 30 from 10 years of data, prefer", ["a parametric (e.g. Weibull) model, checked against the data", "Cox leaves the baseline unknown beyond observed times."], [["a Cox model", "It can't extrapolate the baseline hazard."], ["Kaplan–Meier", "It stops at the last observed time."]]), ["Extrapolation always rests on the chosen shape."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const b = r.pick([-0.693, -0.511, -0.357, -0.223, 0.182, 0.405, 0.693, 1.099]);
      const v = Math.exp(b);
      return n(`A Cox model gives $\\beta = ${b}$. Find the hazard ratio (3 decimals).`, Math.round(v * 1000) / 1000, `$e^{${b}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const s0 = r.pick([0.5, 0.6, 0.7, 0.8, 0.9, 0.95]);
      const hr = r.pick([0.5, 0.6, 0.7, 1.3, 1.5, 2, 3]);
      const s1 = s0 ** hr;
      const risk = lv === 3;
      const v = risk ? 1 - s1 : s1;
      return n(`Baseline survival at 5 years is ${s0}; under proportional hazards the hazard ratio is ${hr}. Find the ${risk ? "5-year risk of the event" : "5-year survival"} for the other group (3 decimals).`, Math.round(v * 1000) / 1000, `$S_1 = ${s0}^{${hr}} \\approx ${Math.round(s1 * 1000) / 1000}$${risk ? `; risk $\\approx ${Math.round(v * 1000) / 1000}$` : ""}.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const lam = r.pick([500, 1000, 2000, 5000]);
      const k = r.pick([1, 1.5, 2, 3]);
      const p = r.pick([0.01, 0.05, 0.1]);
      const v = lam * (-Math.log(1 - p)) ** (1 / k);
      return n(`A Weibull with scale ${lam} hours and shape ${k}. Find the B${Math.round(p * 100)} life in hours (2 decimals).`, r2(v), `$${lam}(-\\ln ${1 - p})^{1/${k}} \\approx ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s0 = r.pick([0.5, 0.7, 0.8]);
      return mcNumbers(
        `Control 5-year survival is ${s0}. A hazard ratio of 2 under proportional hazards makes the treated 5-year risk`,
        { text: `$1 - ${s0}^2 = ${r2(1 - s0 * s0)}$`, why: "Survival is raised to the power HR." },
        [
          { text: `${r2(2 * (1 - s0))}, twice the control risk`, why: "Hazard ratios don't double cumulative risks.", misconception: "hr-is-risk-ratio" },
          { text: `${r2(1 - s0)}, unchanged`, why: "A higher hazard raises the risk." },
        ],
      );
    },
  },
];
