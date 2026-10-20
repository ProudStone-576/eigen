import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** MCMC: Metropolis–Hastings, Gibbs sampling, HMC and NUTS, diagnostics; variational inference; Bayesian networks and optimisation. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "mcmc",
  title: "Markov chain Monte Carlo",
  summary: "Most posteriors have no formula, but they can be sampled. MCMC builds a random walk whose long-run distribution is the posterior: Metropolis–Hastings proposes moves and accepts them with a probability set by the posterior ratio; Gibbs sampling updates one parameter at a time from its conditional. The draws are correlated, so diagnostics and effective sample sizes matter.",
  deps: ["bayesian-inference", "lln-inequalities"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "Markov chain", meaning: "A random sequence in which each step depends only on the current state." },
    { term: "burn-in", meaning: "The early draws, discarded while the chain moves from its starting point to the posterior." },
    { term: "effective sample size", meaning: "The number of independent draws that would give the same precision as the correlated MCMC draws." },
  ],
  misconceptions: {
    "mcmc-independent-draws": "Treats MCMC draws as independent, so overstates the precision of posterior summaries.",
    "mh-reject-wasted": "Thinks rejected Metropolis proposals are simply discarded, rather than the chain staying put and repeating its current value.",
  },
  steps: [
    {
      type: "motivate",
      title: "Sampling what you can't integrate",
      body: "A hierarchical model with 50 schools has over 50 parameters. Its posterior is known only up to a constant, and integrating it to get means and intervals is hopeless. But a cleverly built random walk can visit each region of parameter space in proportion to its posterior probability, and averages along the walk estimate any posterior quantity.",
      realWorld: {
        title: "From bombs to biology",
        body: "The Metropolis algorithm was invented at Los Alamos in 1953 for physics simulations. Today Stan, PyMC and similar tools run MCMC for epidemiology, ecology, astronomy and election forecasting.",
      },
    },
    {
      type: "truth",
      statement: "**Metropolis–Hastings**: from the current $\\theta$, propose $\\theta'$ from a symmetric proposal and accept it with probability $\\min\\!\\left(1, \\dfrac{\\pi(\\theta' \\mid x)}{\\pi(\\theta \\mid x)}\\right)$; otherwise stay at $\\theta$. Only the ratio is needed, so the unknown normalising constant cancels. **Gibbs sampling** updates each parameter in turn by drawing from its conditional posterior given the others.",
      body: "After burn-in, the chain's draws have the posterior as their distribution, and averages converge by a law of large numbers for Markov chains (§{lln-inequalities}). Consecutive draws are correlated, so 10,000 draws may be worth far fewer independent ones: check **trace plots**, $\\hat R$ across several chains (close to 1), and the **effective sample size**. **Hamiltonian Monte Carlo** and its self-tuning version **NUTS** use gradients to make long, efficient moves.",
    },
    {
      type: "predict",
      misconception: "mh-reject-wasted",
      item: {
        kind: "mc",
        id: "mcm-predict-1",
        prompt: "In a Metropolis chain at $\\theta = 2$, a proposal $\\theta' = 2.5$ is rejected. The next value of the chain is",
        options: [
          { id: "a", text: "2 again: the chain repeats its current value", correct: true, why: "Repeats are how high-probability regions get their weight." },
          { id: "b", text: "nothing: rejected steps are skipped", misconception: "mh-reject-wasted", why: "Skipping would under-represent where the chain lingers." },
          { id: "c", text: "2.5, since it was proposed", why: "It was rejected." },
        ],
      },
      reveal: {
        body: "Staying put and recording the current value again is essential. A chain sitting at a high-probability point rejects many moves away from it, and those repeated values are what give the point its proper weight in the averages. Dropping them would distort the distribution of the draws.",
      },
      resolve: {
        kind: "mc",
        id: "mcm-resolve-1",
        prompt: "What happens to a rejected Metropolis proposal?",
        options: [
          { id: "a", text: "The current value is recorded again", correct: true, why: "The chain stays where it is." },
          { id: "b", text: "It is discarded and the step doesn't count", misconception: "mh-reject-wasted", why: "Every step records a value." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mcm-check-1",
        prompt: "10,000 MCMC draws have lag-1 autocorrelation 0.9. The posterior mean estimate is as precise as roughly",
        options: [
          { id: "a", text: "500 independent draws", correct: true, why: "ESS $\\approx n(1 - \\rho)/(1 + \\rho) = 10{,}000 \\times 0.1/1.9 \\approx 526$." },
          { id: "b", text: "10,000 independent draws", misconception: "mcmc-independent-draws", why: "Highly correlated draws repeat much of the same information." },
          { id: "c", text: "9,000 independent draws", why: "Correlation 0.9 costs far more than 10%." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mcm-check-2",
        prompt: "The posterior density at the proposal is 0.3 times that at the current point. The Metropolis acceptance probability is",
        options: [
          { id: "a", text: "0.3", correct: true, why: "$\\min(1, 0.3)$." },
          { id: "b", text: "1", why: "Only uphill moves are always accepted." },
          { id: "c", text: "0", why: "Downhill moves are accepted sometimes, so the chain explores." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "**Variational inference** replaces sampling with optimisation: choose the member of a simple family $q(\\theta)$ closest to the posterior in KL divergence (§{likelihood-ratio}) by maximising the evidence lower bound. It powers variational autoencoders and large-scale Bayesian models, trading MCMC's accuracy for speed.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mcm-produce-1", prompt: "The proposal's posterior density is twice the current one's. Find the Metropolis acceptance probability.", answer: 1, explain: "$\\min(1, 2)$." },
        { kind: "number", id: "mcm-produce-2", prompt: "Draws have AR(1) autocorrelation $\\rho = 0.5$. The effective sample size is $n(1 - \\rho)/(1 + \\rho)$. Find it for $n = 3000$.", answer: 1000, explain: "$3000 \\times 0.5/1.5$." },
        {
          kind: "mc",
          id: "mcm-produce-3",
          prompt: "Treating 5,000 strongly autocorrelated MCMC draws as independent makes the reported Monte Carlo error",
          options: [
            { id: "a", text: "too small", correct: true, why: "The effective sample size is much less than 5,000." },
            { id: "b", text: "correct", misconception: "mcmc-independent-draws", why: "Correlation reduces the information in the draws." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mcm-review-1", prompt: "1,200 MCMC draws have AR(1) autocorrelation 0.5. Find the effective sample size.", answer: 400, explain: "$1200 \\times 0.5/1.5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "diagnostics",
      body: "A **trace plot** of each parameter against iteration should look like a fuzzy caterpillar with no trend. $\\hat R$ compares the variance within chains with the variance between several chains started far apart; values above about 1.01 mean the chains haven't mixed. The **effective sample size** is $\\dfrac{n}{1 + 2\\sum_{k \\ge 1}\\rho_k}$, with $\\rho_k$ the lag-$k$ autocorrelation.",
    },
    {
      type: "definition",
      term: "Bayesian networks and Bayesian optimisation",
      body: "A **Bayesian network** is a directed acyclic graph whose joint distribution factorises as $\\prod_i P(X_i \\mid \\text{parents}(X_i))$, which can need far fewer numbers than the full joint table. **Bayesian optimisation** places a probabilistic model, often a Gaussian process, over an expensive function and chooses the next point to evaluate by its posterior, as in hyperparameter tuning.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "why Metropolis works",
      statement: "With a symmetric proposal, the acceptance rule $\\min(1, \\pi(\\theta')/\\pi(\\theta))$ makes the flow from $\\theta$ to $\\theta'$ equal the flow back (detailed balance), so the posterior $\\pi$ is the chain's stationary distribution.",
      proof: ["Flow $\\theta \\to \\theta'$: $\\pi(\\theta)q\\min(1, \\pi(\\theta')/\\pi(\\theta)) = q\\min(\\pi(\\theta), \\pi(\\theta'))$, symmetric in $\\theta$ and $\\theta'$. A distribution with balanced flows between every pair of states stays unchanged by a step."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "effective sample size for AR(1) draws",
      statement: "If the autocorrelation at lag $k$ is $\\rho^k$, then $\\text{ESS} = n\\,\\dfrac{1 - \\rho}{1 + \\rho}$.",
      proof: ["$1 + 2\\sum_{k \\ge 1}\\rho^k = 1 + \\dfrac{2\\rho}{1 - \\rho} = \\dfrac{1 + \\rho}{1 - \\rho}$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "tuning the proposal",
      statement: "Steps that are too small are almost always accepted but move slowly; steps that are too large are almost always rejected. For random-walk Metropolis an acceptance rate around 20–40% is a common target; HMC and NUTS tune themselves.",
      proof: ["Both extremes give highly autocorrelated chains and small effective sample sizes."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A Metropolis chain at $\\theta$ proposes $\\theta'$ whose posterior density is 0.6 times the current one's. Describe the step.",
      solution: ["Accept with probability $\\min(1, 0.6) = 0.6$.", "Draw $u \\sim U(0, 1)$; move if $u < 0.6$, otherwise record $\\theta$ again."],
      result: "Move with probability 0.6.",
    },
    {
      type: "example",
      level: 2,
      title: "effective sample size",
      problem: "20,000 draws have AR(1) autocorrelation 0.8. Find the effective sample size.",
      solution: ["$\\text{ESS} = 20{,}000 \\times \\tfrac{0.2}{1.8}$.", "$\\approx 2{,}222$."],
      result: "About 2,200.",
    },
    {
      type: "example",
      level: 3,
      title: "counting a network's parameters",
      problem: "Three binary variables form the chain $A \\to B \\to C$. How many probabilities does the network need, against the full joint table?",
      solution: ["$P(A)$: 1. $P(B \\mid A)$: 2 (one per value of $A$). $P(C \\mid B)$: 2. Total 5.", "The full joint table over $2^3 = 8$ outcomes needs $8 - 1 = 7$."],
      result: "5 against 7.",
    },
  ],
  pitfalls: [
    { wrong: "MCMC draws are independent samples.", right: "They are autocorrelated; use the effective sample size." },
    { wrong: "Rejected proposals are thrown away.", right: "The chain records its current value again." },
    { wrong: "One long chain that looks stable has converged.", right: "Run several chains from dispersed starts and check $\\hat R$." },
  ],
  formulas: [
    { label: "Metropolis acceptance", tex: "\\min\\!\\left(1, \\pi(\\theta')/\\pi(\\theta)\\right)" },
    { label: "Effective sample size", tex: "\\dfrac{n}{1 + 2\\sum_{k \\ge 1}\\rho_k}" },
    { label: "AR(1) case", tex: "n(1 - \\rho)/(1 + \\rho)" },
    { label: "Bayesian network", tex: "P(x_1, \\dots, x_d) = \\textstyle\\prod_i P(x_i \\mid \\text{pa}_i)" },
  ],
  exercises: [
    ex(1, num("mcmx-ex-1", "The posterior ratio $\\pi(\\theta')/\\pi(\\theta)$ is 0.25. Find the Metropolis acceptance probability.", 0.25, "$\\min(1, 0.25)$."), ["$0.25$."]),
    ex(1, num("mcmx-ex-2", "The posterior ratio is 3. Find the acceptance probability.", 1, "Uphill moves are always accepted."), ["$1$."]),
    ex(2, dp("mcmx-ex-3", "Find the ESS of 10,000 draws with AR(1) autocorrelation 0.9.", 10000 * (0.1 / 1.9), "$n(1 - \\rho)/(1 + \\rho)$."), ["$\\approx 526.316$."]),
    ex(2, num("mcmx-ex-4", "Draws have autocorrelations $\\rho_1 = 0.5$, $\\rho_2 = 0.25$ and 0 beyond. Find the ESS of 4,000 draws.", 1600, "$4000/(1 + 2 \\times 0.75)$."), ["$1 + 2(0.5 + 0.25) = 2.5$, so ESS $= 4000/2.5 = 1600$."]),
    ex(2, num("mcmx-ex-5", "Binary variables in the chain $A \\to B \\to C \\to D$. How many probabilities does the Bayesian network need?", 7, "$1 + 2 + 2 + 2$."), ["$7$, against $2^4 - 1 = 15$ for the full table."]),
    ex(3, mc("mcmx-ex-6", "A random-walk Metropolis sampler accepts 99% of its proposals. This suggests", ["the steps are too small and the chain moves slowly", "Tiny steps are almost always accepted."], [["excellent mixing", "High acceptance with tiny steps means high autocorrelation."], ["the steps are too large", "Large steps are mostly rejected."]]), ["Increase the proposal scale until acceptance is around 20–40%."]),
    ex(3, mc("mcmx-ex-7", "Four chains started far apart give $\\hat R = 1.4$ for one parameter. You should", ["run longer or reparameterise: the chains haven't converged", "They disagree about the posterior."], [["report the pooled draws", "Unconverged draws give wrong answers."], ["discard three chains", "That hides the problem."]]), ["$\\hat R$ well above 1 means between-chain variance dominates."]),
    ex(3, mc("mcmx-ex-8", "Variational inference differs from MCMC in that it", ["fits an approximate distribution by optimisation", "It minimises a KL divergence."], [["gives exact posterior samples", "It is an approximation."], ["needs no model", "It approximates a model's posterior."]]), ["It is usually faster and scales further, but can understate uncertainty."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const ratio = r.pick([0.1, 0.25, 0.4, 0.6, 0.8, 1.5, 2, 5]);
      return n(`The posterior density at a proposal is ${ratio} times that at the current point. Find the Metropolis acceptance probability.`, Math.min(1, ratio), `$\\min(1, ${ratio}) = ${Math.min(1, ratio)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([1000, 2000, 5000, 10000, 20000]);
      const rho = r.pick([0.2, 0.5, 0.6, 0.8, 0.9, 0.95]);
      const ess = (nn * (1 - rho)) / (1 + rho);
      return n(`${nn.toLocaleString("en-US")} MCMC draws have AR(1) autocorrelation ${rho}. Find the effective sample size (nearest whole number).`, Math.round(ess), `$${nn}(1 - ${rho})/(1 + ${rho}) \\approx ${Math.round(ess)}$.`, 0.5);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([5000, 10000, 20000]);
      return mcNumbers(
        `${nn.toLocaleString("en-US")} highly autocorrelated MCMC draws are summarised by their mean, with Monte Carlo SE computed as $s/\\sqrt{${nn}}$. That SE is`,
        { text: "too small", why: "The effective sample size is much less than the number of draws." },
        [
          { text: "correct", why: "It treats correlated draws as independent.", misconception: "mcmc-independent-draws" },
          { text: "too large", why: "Correlation makes the true error larger, not smaller." },
        ],
      );
    },
  },
];
