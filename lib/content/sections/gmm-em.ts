import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Gaussian mixture models and the EM algorithm: responsibilities, M-step updates, monotone likelihood, local optima, choosing k; EM for missing data. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "gmm-em",
  title: "Gaussian mixtures & the EM algorithm",
  summary: "A Gaussian mixture models data as coming from several normal components with unknown means, variances and weights. The EM algorithm fits it by alternating two steps: the E-step computes each point's responsibility from each component; the M-step re-estimates each component from responsibility-weighted data. The likelihood never decreases, but EM can stop at a local maximum.",
  deps: ["mixtures", "clustering", "mle"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "latent variable", meaning: "An unobserved variable, such as which component produced each point." },
    { term: "E-step", meaning: "Compute the expected latent assignments (responsibilities) under the current parameters." },
    { term: "M-step", meaning: "Maximise the likelihood given those responsibilities, updating the parameters." },
  ],
  misconceptions: {
    "em-global": "Thinks EM always finds the global maximum of the likelihood.",
    "hard-vs-soft": "Thinks a Gaussian mixture assigns each point wholly to one cluster, as k-means does, rather than giving it a probability for each.",
  },
  steps: [
    {
      type: "motivate",
      title: "If only we knew the labels",
      body: "If we knew which component produced each point, fitting a mixture would be easy: average each group. If we knew the components, assigning points would be easy: Bayes' rule. EM breaks the circle by doing each in turn, using the current guess for the other.",
      realWorld: {
        title: "Speech and images",
        body: "Speaker recognition systems long used Gaussian mixtures of voice features, one mixture per speaker. Image segmentation models each region's colours as a mixture component fitted by EM.",
      },
    },
    {
      type: "truth",
      statement: "**E-step**: for each point $x_i$ and component $k$, the **responsibility** $r_{ik} = \\dfrac{\\pi_kf_k(x_i)}{\\sum_j\\pi_jf_j(x_i)}$ (§{mixtures}). **M-step**: with $N_k = \\sum_ir_{ik}$, set $\\pi_k = N_k/n$, $\\mu_k = \\tfrac{1}{N_k}\\sum_ir_{ik}x_i$ and $\\sigma_k^2 = \\tfrac{1}{N_k}\\sum_ir_{ik}(x_i - \\mu_k)^2$. Repeat until the parameters settle.",
      body: "Each EM iteration cannot decrease the likelihood, so it converges, but to a local maximum that depends on the starting values: run it from several starts. Unlike k-means, a mixture gives **soft** assignments, a probability per component; k-means is like EM with equal, tiny, shared variances. Choose the number of components by BIC (§{likelihood-ratio}).",
    },
    {
      type: "predict",
      misconception: "hard-vs-soft",
      item: {
        kind: "mc",
        id: "gmm-predict-1",
        prompt: "A point lies exactly halfway between two equally weighted mixture components with equal variances. Its responsibilities are",
        options: [
          { id: "a", text: "0.5 and 0.5", correct: true, why: "The two densities are equal there." },
          { id: "b", text: "1 for one component and 0 for the other", misconception: "hard-vs-soft", why: "That is k-means' hard assignment." },
          { id: "c", text: "0 for both", why: "Responsibilities always sum to 1." },
        ],
      },
      reveal: {
        body: "With equal weights and variances, the two component densities are equal at the midpoint, so Bayes' rule gives each component half the responsibility. In the M-step this point then contributes half its weight to each component's mean. k-means would force it into one cluster.",
      },
      resolve: {
        kind: "mc",
        id: "gmm-resolve-1",
        prompt: "How does a Gaussian mixture assign points?",
        options: [
          { id: "a", text: "Softly: each point gets a probability for each component", correct: true, why: "Responsibilities sum to 1 per point." },
          { id: "b", text: "Hard: each point belongs to exactly one component", misconception: "hard-vs-soft", why: "That is k-means." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gmm-check-1",
        prompt: "EM run from five random starts gives five different final log-likelihoods. You should",
        options: [
          { id: "a", text: "keep the run with the highest log-likelihood", correct: true, why: "EM finds local maxima." },
          { id: "b", text: "suspect a bug, since EM always reaches the global maximum", misconception: "em-global", why: "EM only guarantees not to go downhill." },
          { id: "c", text: "average the five fits", why: "Averaging parameters across runs isn't meaningful." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gmm-check-2",
        prompt: "Points 0, 2, 4 have responsibilities 1, 0.5, 0 for component A. The M-step mean of A is",
        options: [
          { id: "a", text: "$2/3$", correct: true, why: "$(0 + 1 + 0)/1.5$." },
          { id: "b", text: "2", why: "Weight each point by its responsibility." },
          { id: "c", text: "1", why: "Divide by the total responsibility, 1.5." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "EM is a general recipe for latent-variable models: hidden Markov models (the Baum–Welch algorithm), topic models, and fitting models with missing data. Variational inference (§{mcmc}) generalises its E-step when exact responsibilities can't be computed.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "gmm-produce-1", prompt: "Responsibilities of component A over 4 points are 0.9, 0.6, 0.3, 0.2. Find the updated weight $\\pi_A$.", answer: 0.5, explain: "$N_A/n = 2/4$." },
        { kind: "number", id: "gmm-produce-2", prompt: "Points 1, 3, 5 with responsibilities 0.5, 1, 0.5 for a component. Find its updated mean.", answer: 3, explain: "$(0.5 + 3 + 2.5)/2$." },
        {
          kind: "mc",
          id: "gmm-produce-3",
          prompt: "EM's guarantee is that",
          options: [
            { id: "a", text: "the likelihood never decreases from one iteration to the next", correct: true, why: "It may still stop at a local maximum." },
            { id: "b", text: "it reaches the global maximum", misconception: "em-global", why: "Starting values matter." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "gmm-review-1", prompt: "A point's responsibilities from three components must add up to what?", answer: 1, explain: "They are posterior probabilities." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "EM in general",
      body: "For data $x$ with latent $z$ and parameters $\\theta$, the **E-step** computes $Q(\\theta \\mid \\theta^{(t)}) = E_{z \\mid x, \\theta^{(t)}}[\\ln p(x, z \\mid \\theta)]$, and the **M-step** sets $\\theta^{(t+1)} = \\arg\\max_\\theta Q(\\theta \\mid \\theta^{(t)})$. For missing data, the latent variables are the missing values; **multiple imputation by chained equations** instead imputes each variable in turn from regressions on the others (§{data-quality}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "EM never decreases the likelihood",
      statement: "$\\ell(\\theta^{(t+1)}) \\ge \\ell(\\theta^{(t)})$ at every iteration.",
      proof: [
        "$\\ell(\\theta) = Q(\\theta \\mid \\theta^{(t)}) + H(\\theta \\mid \\theta^{(t)})$, where $H$ is minus the expected log of $p(z \\mid x, \\theta)$, which is smallest at $\\theta = \\theta^{(t)}$ by the KL inequality (§{likelihood-ratio}).",
        "The M-step raises $Q$, and moving away from $\\theta^{(t)}$ can only raise $H$, so $\\ell$ rises or stays put.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "practical cautions",
      statement: "Run EM from several starts (often from k-means solutions). A component can collapse onto a single point with variance shrinking to 0, sending the likelihood to infinity: guard against it with a variance floor or a prior. Pick the number of components by BIC or held-out likelihood.",
      proof: ["A normal density with $\\sigma \\to 0$ centred on a data point grows without bound, so the unrestricted maximum likelihood is degenerate."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 2,
      title: "one E-step",
      problem: "Equal weights; components $N(0, 1)$ and $N(4, 1)$. Find each component's responsibility for $x = 1$.",
      solution: ["Densities proportional to $e^{-1/2}$ and $e^{-9/2}$.", "$r_1 = \\dfrac{1}{1 + e^{-4}} \\approx 0.982$, $r_2 \\approx 0.018$."],
      result: "0.982 and 0.018.",
    },
    {
      type: "example",
      level: 2,
      title: "one M-step",
      problem: "Points 0, 2, 4 have responsibilities 1, 0.5, 0 for component A. Update A's weight and mean.",
      solution: ["$N_A = 1.5$, so $\\pi_A = 1.5/3 = 0.5$.", "$\\mu_A = \\dfrac{1 \\times 0 + 0.5 \\times 2 + 0 \\times 4}{1.5} = \\tfrac23$."],
      result: "$\\pi_A = 0.5$, $\\mu_A = \\tfrac23$.",
    },
  ],
  pitfalls: [
    { wrong: "EM finds the global maximum.", right: "It climbs to a local maximum; use several starts." },
    { wrong: "Mixture models assign each point to one cluster.", right: "They give probabilities; hard labels come from taking the largest." },
    { wrong: "More components always fit better, so use many.", right: "The likelihood always rises; choose $k$ by BIC or held-out data." },
  ],
  formulas: [
    { label: "Responsibility", tex: "r_{ik} = \\dfrac{\\pi_kf_k(x_i)}{\\sum_j\\pi_jf_j(x_i)}" },
    { label: "M-step weight", tex: "\\pi_k = N_k/n,\\ N_k = \\textstyle\\sum_ir_{ik}" },
    { label: "M-step mean", tex: "\\mu_k = \\tfrac{1}{N_k}\\textstyle\\sum_ir_{ik}x_i" },
    { label: "M-step variance", tex: "\\sigma_k^2 = \\tfrac{1}{N_k}\\textstyle\\sum_ir_{ik}(x_i - \\mu_k)^2" },
  ],
  exercises: [
    ex(1, num("gmmx-ex-1", "Responsibilities of component A over 5 points are 1, 1, 0.5, 0.5, 0. Find $N_A$.", 3, "Sum them."), ["$3$."]),
    ex(1, num("gmmx-ex-2", "Same data. Find the updated weight $\\pi_A$.", 0.6, "$3/5$."), ["$0.6$."]),
    ex(2, dp("gmmx-ex-3", "Equal weights; components $N(0, 1)$ and $N(2, 1)$. Find the second component's responsibility for $x = 1.5$.", 1 / (1 + Math.exp(-1)), "Compare $e^{-1.125}$ and $e^{-0.125}$."), ["$\\dfrac{1}{1 + e^{-1}} \\approx 0.731$."]),
    ex(2, num("gmmx-ex-4", "Points 2, 4, 6 with responsibilities 1, 1, 0 for a component. Find its updated mean.", 3, "$(2 + 4)/2$."), ["$3$."]),
    ex(2, num("gmmx-ex-5", "Same component. Find its updated variance.", 1, "$\\tfrac{(2 - 3)^2 + (4 - 3)^2}{2}$."), ["$1$."]),
    ex(3, dp("gmmx-ex-6", "Weights 0.8 and 0.2; components $N(0, 1)$ and $N(3, 1)$. Find the second component's responsibility for $x = 1.5$.", (0.2) / (0.2 + 0.8), "At the midpoint the densities are equal."), ["The densities are equal at 1.5, so $r_2 = 0.2/(0.2 + 0.8) = 0.2$."]),
    ex(3, mc("gmmx-ex-7", "During EM, one component's variance shrinks towards 0 around a single point. This is", ["a degenerate solution: add a variance floor or a prior", "The likelihood blows up without meaning anything."], [["the best possible fit", "It is a spike on one point, not a real cluster."], ["impossible", "It is a known failure of unrestricted mixtures."]]), ["Regularise the variances, or restart from a different initialisation."]),
    ex(3, mc("gmmx-ex-8", "Choosing between 2, 3 and 4 mixture components, use", ["BIC or held-out log-likelihood", "Both penalise needless components."], [["the training log-likelihood", "It always rises with more components."], ["whichever EM converges fastest", "Speed says nothing about fit."]]), ["Training likelihood can't choose model size."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 3 + lv;
      const xs = Array.from({ length: k }, () => r.int(0, 12));
      const rs: number[] = Array.from({ length: k }, () => r.pick([0, 0.2, 0.25, 0.5, 0.75, 0.8, 1]));
      if (!rs.some((x) => x > 0)) rs[0] = 1;
      const N = rs.reduce((s, x) => s + x, 0);
      const m = rs.reduce((s, x, i) => s + x * xs[i], 0) / N;
      return n(`Points ${xs.join(", ")} have responsibilities ${rs.join(", ")} for a component. Find its updated mean (3 decimals).`, Math.round(m * 1000) / 1000, `$N_k = ${r2(N)}$; weighted mean $\\approx ${Math.round(m * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const w = r.pick([0.3, 0.5, 0.7]);
      const m2 = r.pick([2, 3, 4]);
      const x = r2(r.int(0, 4 * m2) / 4);
      const d1 = w * Math.exp(-(x * x) / 2);
      const d2 = (1 - w) * Math.exp(-((x - m2) ** 2) / 2);
      const rr = d2 / (d1 + d2);
      return n(`Weights ${w} and ${r2(1 - w)}; components $N(0, 1)$ and $N(${m2}, 1)$. Find the second component's responsibility for $x = ${x}$ (3 decimals).`, Math.round(rr * 1000) / 1000, `$\\dfrac{${r2(1 - w)}e^{-(${x} - ${m2})^2/2}}{${w}e^{-${x}^2/2} + ${r2(1 - w)}e^{-(${x} - ${m2})^2/2}} \\approx ${Math.round(rr * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const x = r.pick([1, 1.5, 2]);
      return mcNumbers(
        `Two equally weighted components with equal variances have means 0 and ${2 * x}. A point sits at ${x}. Its responsibilities are`,
        { text: "0.5 each", why: "The densities are equal at the midpoint." },
        [
          { text: "1 for one component, 0 for the other", why: "That is a hard, k-means-style assignment.", misconception: "hard-vs-soft" },
          { text: "0 for both", why: "Responsibilities sum to 1." },
        ],
      );
    },
  },
];
