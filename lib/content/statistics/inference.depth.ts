import { ex, mc, num, type Depth } from "../deepen";

/** Chapter 8 at exam depth: confidence intervals, tests, errors and power, t-tests, chi-square, causation. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const TABLE = "Use $\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$.";

export const INFERENCE_DEPTH: Record<string, Depth> = {
  // §8.1
  "confidence-intervals": {
    definitions: [
      {
        type: "definition",
        term: "confidence interval, critical value",
        body: "A **C% confidence interval** for a parameter is computed from the sample by a method that captures the true value in C% of repeated samples. For a mean with large $n$ it is $\\bar x \\pm z^*\\,\\text{SE}$, with **critical value** $z^* = 1.645$ (90%), $1.96$ (95%) or $2.576$ (99%). The **margin of error** is $z^*\\,\\text{SE}$, half the interval's width.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "why the interval works",
        statement: "If $\\bar X \\approx N(\\mu, \\text{SE}^2)$, then $P(\\bar X - 1.96\\,\\text{SE} \\le \\mu \\le \\bar X + 1.96\\,\\text{SE}) \\approx 0.95$.",
        proof: [
          "Standardising (§6.4), $P\\left(-1.96 \\le \\dfrac{\\bar X - \\mu}{\\text{SE}} \\le 1.96\\right) = 0.95$.",
          "Rearrange each inequality for $\\mu$. The random quantity is the interval, which moves from sample to sample; $\\mu$ stays fixed.",
        ],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "a proportion",
        statement: "A large-sample C% interval for a proportion is $\\hat p \\pm z^*\\sqrt{\\dfrac{\\hat p(1 - \\hat p)}{n}}$.",
        proof: ["It is the same construction, with $\\text{SE}(\\hat p)$ from §7.5."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "sample size for a margin",
        statement: "For margin at most $E$: $n \\ge \\left(\\dfrac{z^*\\sigma}{E}\\right)^2$ for a mean, and $n \\ge \\left(\\dfrac{z^*}{2E}\\right)^2$ for a proportion whatever $p$ is. Always round **up**.",
        proof: ["Solve $z^*\\sigma/\\sqrt n \\le E$ for $n$. For a proportion use the worst case $\\sqrt{p(1 - p)} \\le \\tfrac12$ (§7.5)."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A sample of 100 has $\\bar x = 72$ and $s = 10$. Find the 95% confidence interval for $\\mu$.",
        solution: ["$\\text{SE} = 10/\\sqrt{100} = 1$.", "$72 \\pm 1.96 \\times 1$ gives $70.04$ to $73.96$."],
        result: "$(70.04,\\ 73.96)$.",
      },
      {
        type: "example",
        level: 2,
        title: "reading an interval",
        problem: "A 95% interval is $(46.08, 53.92)$. Find $\\bar x$, the SE, and the 99% interval from the same data.",
        solution: [
          "$\\bar x$ is the midpoint, 50. The margin is $3.92 = 1.96\\,\\text{SE}$, so $\\text{SE} = 2$.",
          "99%: $50 \\pm 2.576 \\times 2 = 50 \\pm 5.152$.",
        ],
        result: "$\\bar x = 50$, $\\text{SE} = 2$, 99% interval $(44.85,\\ 55.15)$.",
      },
      {
        type: "example",
        level: 3,
        title: "planning a study",
        problem: "Scores have $\\sigma = 15$. How large a sample gives a 95% margin of error of at most 2?",
        solution: ["$n \\ge \\left(\\dfrac{1.96 \\times 15}{2}\\right)^2 = 14.7^2 = 216.09$.", "Round up: 216 would give a margin slightly above 2."],
        result: "217.",
      },
      {
        type: "example",
        level: 3,
        title: "a poll",
        problem: "In a poll of 1000 voters, 540 back a candidate. Find a 95% interval for the support. Does it rule out 50%?",
        solution: [
          "$\\hat p = 0.54$ and $\\text{SE} = \\sqrt{0.54 \\times 0.46/1000} \\approx 0.0158$.",
          "Margin $1.96 \\times 0.0158 \\approx 0.031$, so the interval is about $0.509$ to $0.571$.",
          "All of it lies above 0.5.",
        ],
        result: "About $(0.509,\\ 0.571)$, which excludes 50%.",
      },
    ],
    pitfalls: [
      { wrong: "95% of the data lie inside the 95% interval.", right: "The interval is for the mean. Individuals spread far wider." },
      { wrong: "A 99% interval is narrower because it is more confident.", right: "It is wider: more confidence needs a larger $z^*$." },
      { wrong: "Round a required sample size to the nearest whole number.", right: "Always round up, or the margin exceeds the target." },
    ],
    formulas: [
      { label: "Mean", tex: "\\bar x \\pm z^*\\,\\dfrac{s}{\\sqrt n}" },
      { label: "Proportion", tex: "\\hat p \\pm z^*\\sqrt{\\hat p(1 - \\hat p)/n}" },
      { label: "Critical values", tex: "1.645,\\ 1.96,\\ 2.576\\ \\text{for}\\ 90, 95, 99\\%" },
      { label: "Sample size", tex: "n \\ge (z^*\\sigma/E)^2" },
    ],
    exercises: [
      ex(1, num("ci2-ex-1", "$\\bar x = 40$ and $\\text{SE} = 2$. Find the upper end of the 95% interval.", 43.92, "$40 + 1.96 \\times 2$."), ["$40 + 3.92 = 43.92$."]),
      ex(1, num("ci2-ex-2", "A confidence interval is $(12, 18)$. Find the point estimate.", 15, "The midpoint."), ["$(12 + 18)/2 = 15$."]),
      ex(1, num("ci2-ex-3", "A confidence interval is $(12, 18)$. Find the margin of error.", 3, "Half the width."), ["Width 6, so the margin is 3."]),
      ex(2, num("ci2-ex-4", "$\\bar x = 50$ and $\\text{SE} = 4$. Find the lower end of the 90% interval.", 43.42, "$z^* = 1.645$."), ["$50 - 1.645 \\times 4 = 50 - 6.58 = 43.42$."]),
      ex(2, num("ci2-ex-5", "$\\hat p = 0.4$ from $n = 600$. Find the 95% margin of error.", 0.0392, "$\\text{SE} = 0.02$."), ["$\\text{SE} = \\sqrt{0.24/600} = \\sqrt{0.0004} = 0.02$, margin $1.96 \\times 0.02 = 0.0392$."]),
      ex(2, num("ci2-ex-6", "By what factor must $n$ grow to halve the width of an interval?", 4, "Width is proportional to $1/\\sqrt n$."), ["Halve $1/\\sqrt n$ by doubling $\\sqrt n$: four times the data."]),
      ex(2, num("ci2-ex-7", "A 95% interval is $(46.08, 53.92)$. Find the SE.", 2, "Margin $= 1.96\\,\\text{SE}$."), ["Margin $3.92 = 1.96\\,\\text{SE}$, so $\\text{SE} = 2$."]),
      ex(3, num("ci2-ex-8", "With $\\sigma = 10$, what is the smallest $n$ giving a 95% margin of at most 1?", 385, "$(1.96 \\times 10)^2$, rounded up."), ["$n \\ge 19.6^2 = 384.16$, so 385."]),
      ex(3, num("ci2-ex-9", "What poll size guarantees a 95% margin of at most 0.03 whatever the true proportion?", 1068, "$(1.96/0.06)^2$, rounded up."), ["$n \\ge \\left(\\dfrac{1.96}{2 \\times 0.03}\\right)^2 \\approx 1067.1$, so 1068."]),
      ex(3, num("ci2-ex-10", "A sample of 64 has $s = 20$. Find the full width of the 99% interval.", 12.88, "$2 \\times 2.576 \\times \\text{SE}$."), ["$\\text{SE} = 20/8 = 2.5$; width $2 \\times 2.576 \\times 2.5 = 12.88$."]),
      ex(3, mc("ci2-ex-11", "An A/B test reports a lift of 1.2 points, 95% CI $(-0.3, 2.7)$. What follows?", ["The data cannot rule out no effect", "0 lies inside the interval."], [["B is better with 95% probability", "The 95% describes the method, and 0 is still plausible."], ["B is worse", "Most of the interval is positive; it is inconclusive, not negative."]]), [
        "Every value inside the interval, including 0, is consistent with the data at the 95% level.",
      ]),
    ],
  },

  // §8.2
  "hypothesis-tests": {
    definitions: [
      {
        type: "definition",
        term: "hypotheses",
        body: "The **null hypothesis** $H_0$ states no effect, e.g. $\\mu = \\mu_0$. The **alternative** $H_1$ is two-sided ($\\mu \\neq \\mu_0$) or one-sided ($\\mu > \\mu_0$ or $\\mu < \\mu_0$), and is chosen before seeing the data.",
      },
      {
        type: "definition",
        term: "statistic, p-value, significance level",
        body: "The **test statistic** $z = \\dfrac{\\bar x - \\mu_0}{\\text{SE}}$ measures the gap in standard errors. The **p-value** is $P(Z \\ge z)$ one-sided, or $2P(Z \\ge |z|)$ two-sided, computed assuming $H_0$. At **significance level** $\\alpha$, reject $H_0$ when $p < \\alpha$; equivalently when $|z| > 1.96$ (two-sided, $\\alpha = 0.05$) or $z > 1.645$ (one-sided).",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "tests and intervals agree",
        statement: "A two-sided test at level $\\alpha$ rejects $H_0: \\mu = \\mu_0$ exactly when $\\mu_0$ lies outside the $(1 - \\alpha)$ confidence interval.",
        proof: ["$\\dfrac{|\\bar x - \\mu_0|}{\\text{SE}} > 1.96$ says $\\mu_0$ is more than $1.96\\,\\text{SE}$ from $\\bar x$, i.e. outside $\\bar x \\pm 1.96\\,\\text{SE}$."],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "a proportion",
        statement: "To test $H_0: p = p_0$, use $z = \\dfrac{\\hat p - p_0}{\\sqrt{p_0(1 - p_0)/n}}$. For small $n$, compute the p-value exactly from $\\mathrm{Bin}(n, p_0)$.",
        proof: ["Under $H_0$ the true proportion is $p_0$, so the SE uses $p_0$, not $\\hat p$. The exact version adds binomial probabilities (§7.1) of results at least as extreme."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `$H_0: \\mu = 100$ against $\\mu \\neq 100$. A sample gives $\\bar x = 104$ with $\\text{SE} = 2$. Test at 5%. ${TABLE}`,
        solution: ["$z = (104 - 100)/2 = 2$.", "Two-sided $p = 2(1 - 0.9772) = 0.0456 < 0.05$: reject $H_0$."],
        result: "$z = 2$, $p \\approx 0.046$: reject.",
      },
      {
        type: "example",
        level: 2,
        title: "a proportion",
        problem: `A coin gives 215 heads in 400 tosses. Test fairness at 5%, two-sided. ${TABLE}`,
        solution: ["$\\hat p = 0.5375$; under $H_0$, $\\text{SE} = \\sqrt{0.25/400} = 0.025$.", "$z = 0.0375/0.025 = 1.5$ and $p = 2(1 - 0.9332) = 0.1336 > 0.05$."],
        result: "Do not reject: no convincing evidence of bias.",
      },
      {
        type: "example",
        level: 3,
        title: "an exact test",
        problem: "A coin shows 9 heads in 10 tosses. Find the one-sided p-value for $H_1: p > \\tfrac12$.",
        solution: [
          "At least as extreme means 9 or 10 heads: $P = \\dfrac{\\binom{10}{9} + \\binom{10}{10}}{2^{10}}$.",
          "$= \\dfrac{11}{1024} \\approx 0.0107$, below 0.05.",
        ],
        result: "$p \\approx 0.011$: reject at 5%.",
      },
      {
        type: "example",
        level: 3,
        title: "one side or two",
        problem: "A test gives $z = 1.8$, and $\\Phi(1.8) = 0.9641$. Compare the one-sided and two-sided conclusions at 5%.",
        solution: ["One-sided $p = 1 - 0.9641 = 0.0359 < 0.05$: reject.", "Two-sided $p = 0.0718 > 0.05$: do not reject. The side must be fixed before the data are seen."],
        result: "Rejected one-sided, not two-sided.",
      },
    ],
    pitfalls: [
      { wrong: "$p = 0.03$ means a 3% chance that $H_0$ is true.", right: "It is $P(\\text{data this extreme} \\mid H_0)$, not $P(H_0 \\mid \\text{data})$." },
      { wrong: "Not rejecting $H_0$ proves it.", right: "It means the evidence is insufficient. Small studies often miss real effects." },
      { wrong: "Pick the one-sided test after seeing which way the data went.", right: "That doubles the real false-alarm rate. Choose the side in advance." },
      { wrong: "Significant means important.", right: "With huge $n$, tiny, useless differences become significant. Report the effect size and its interval." },
    ],
    formulas: [
      { label: "Statistic", tex: "z = \\dfrac{\\bar x - \\mu_0}{\\text{SE}}" },
      { label: "p-value (two-sided)", tex: "p = 2\\,P(Z \\ge |z|)" },
      { label: "Proportion", tex: "z = \\dfrac{\\hat p - p_0}{\\sqrt{p_0(1 - p_0)/n}}" },
      { label: "5% cut-offs", tex: "|z| > 1.96\\ \\text{or}\\ z > 1.645" },
    ],
    exercises: [
      ex(1, num("ht-ex-1", "$\\bar x = 52$, $\\mu_0 = 50$ and $\\text{SE} = 0.8$. Find $z$.", 2.5, "$(52 - 50)/0.8$."), ["$2/0.8 = 2.5$."]),
      ex(1, mc("ht-ex-2", "A test gives $p = 0.03$ and $\\alpha = 0.01$. The conclusion is", ["do not reject $H_0$", "$0.03 > 0.01$."], [["reject $H_0$", "Only if $p < \\alpha$."], ["$H_0$ is true", "Failing to reject never proves $H_0$."]]), ["Compare $p$ with $\\alpha$: $0.03$ is not below $0.01$."]),
      ex(2, dp("ht-ex-3", `Find the two-sided p-value for $z = 1.5$. ${TABLE}`, 2 * (1 - 0.9332), "Double one tail."), ["$2(1 - 0.9332) = 0.1336$."]),
      ex(2, dp("ht-ex-4", `Find the one-sided p-value for $z = 2$. ${TABLE}`, 1 - 0.9772, "One tail."), ["$1 - 0.9772 = 0.0228$."]),
      ex(2, num("ht-ex-5", "$H_0: p = 0.5$. In 100 trials, $\\hat p = 0.6$. Find $z$.", 2, "SE uses $p_0$."), ["$\\text{SE} = \\sqrt{0.25/100} = 0.05$ and $z = 0.1/0.05 = 2$."]),
      ex(2, mc("ht-ex-6", "The 95% interval for $\\mu$ is $(21.2, 25.8)$. At 5%, two-sided, $H_0: \\mu = 20$ is", ["rejected", "20 lies outside the interval."], [["not rejected", "Only values inside the interval survive."], ["undecidable without the raw data", "The interval is enough."]]), [
        "Tests and intervals agree: $\\mu_0$ outside the 95% interval means rejection at 5%.",
      ]),
      ex(3, fr("ht-ex-7", "A coin shows at least 8 heads in 10 tosses. Find the one-sided p-value for a fair coin.", (45 + 10 + 1) / 1024, "$P(X \\ge 8)$ for $\\mathrm{Bin}(10, \\tfrac12)$."), [
        "$\\binom{10}{8} + \\binom{10}{9} + \\binom{10}{10} = 45 + 10 + 1 = 56$.",
        "$p = \\tfrac{56}{1024} = \\tfrac{7}{128} \\approx 0.055$: not significant at 5%.",
      ]),
      ex(3, num("ht-ex-8", "$H_0: \\mu = 50$, $H_1: \\mu > 50$, $\\text{SE} = 2$, $\\alpha = 0.05$. Above what value of $\\bar x$ is $H_0$ rejected?", 53.29, "$\\mu_0 + 1.645\\,\\text{SE}$."), ["$50 + 1.645 \\times 2 = 53.29$."]),
      ex(3, dp("ht-ex-9", "Twenty independent tests are run at $\\alpha = 0.05$, all with true $H_0$. Find the probability of at least one false rejection.", 1 - 0.95 ** 20, "$1 - 0.95^{20}$."), ["$1 - 0.95^{20} \\approx 1 - 0.358 = 0.642$."]),
      ex(3, mc("ht-ex-10", "With a million users per group, a 0.01-point difference in conversion gives $p < 0.001$. The difference is", ["statistically significant but possibly unimportant", "Huge samples detect tiny effects."], [["certainly important", "Significance measures evidence, not size."], ["a false positive", "Nothing suggests that; the effect is just tiny."]]), [
        "With enormous $n$ the SE is tiny, so even a negligible effect yields a large $z$.",
      ]),
    ],
  },

  // §8.3
  "errors-power": {
    definitions: [
      {
        type: "definition",
        term: "error rates, power",
        body: "$\\alpha = P(\\text{reject } H_0 \\mid H_0 \\text{ true})$, the **Type I** rate. $\\beta = P(\\text{keep } H_0 \\mid H_1 \\text{ true})$, the **Type II** rate. **Power** $= 1 - \\beta$, the chance of detecting an effect that is really there. Power depends on how big the true effect is.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "power of a z-test",
        statement: "For $H_1: \\mu > \\mu_0$, rejecting when $\\bar x > \\mu_0 + z_\\alpha\\text{SE}$, the power at a true mean $\\mu_1$ is $1 - \\Phi\\!\\left(z_\\alpha - \\dfrac{\\mu_1 - \\mu_0}{\\text{SE}}\\right)$.",
        proof: [
          "Power $= P(\\bar X > \\mu_0 + z_\\alpha\\text{SE})$ when $\\bar X \\sim N(\\mu_1, \\text{SE}^2)$.",
          "Standardise with $\\mu_1$: $P\\left(Z > \\dfrac{\\mu_0 + z_\\alpha\\text{SE} - \\mu_1}{\\text{SE}}\\right)$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "what raises power",
        statement: "Power rises with a larger effect $\\mu_1 - \\mu_0$, a larger $n$, a smaller $\\sigma$, or a larger $\\alpha$. For power $1 - \\beta$ at effect $\\delta$, one-sided, $n \\ge \\left(\\dfrac{(z_\\alpha + z_\\beta)\\sigma}{\\delta}\\right)^2$.",
        proof: [
          "The first three raise $\\delta/\\text{SE} = \\delta\\sqrt n/\\sigma$; a larger $\\alpha$ lowers $z_\\alpha$. Either lowers the argument of $\\Phi$.",
          "Power $1 - \\beta$ needs $z_\\alpha - \\delta\\sqrt n/\\sigma \\le -z_\\beta$; solve for $n$.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "multiple testing",
        statement: "With $m$ independent tests of true nulls, $P(\\text{at least one false positive}) = 1 - (1 - \\alpha)^m$. The **Bonferroni** correction tests each at $\\alpha/m$, keeping that probability at most $\\alpha$.",
        proof: ["Each test avoids a false positive with probability $1 - \\alpha$. For Bonferroni, the chance of any false positive is at most the sum $m \\cdot \\alpha/m = \\alpha$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A screening test has $H_0$: healthy. Name the error when a healthy person is told they are ill, and when an ill person is told they are healthy.",
        solution: ["Rejecting a true $H_0$ (healthy, flagged ill) is a Type I error.", "Keeping a false $H_0$ (ill, cleared) is a Type II error."],
        result: "Type I, then Type II.",
      },
      {
        type: "example",
        level: 2,
        title: "computing power",
        problem: `$H_0: \\mu = 50$, $H_1: \\mu > 50$, $\\text{SE} = 2$, reject when $z > 2$. Find the power if really $\\mu = 56$, and if $\\mu = 54$. ${TABLE}`,
        solution: [
          "Reject when $\\bar x > 50 + 2 \\times 2 = 54$.",
          "If $\\mu = 56$: $P(\\bar X > 54) = P(Z > -1) = 0.8413$.",
          "If $\\mu = 54$: $P(Z > 0) = 0.5$. An effect sitting exactly at the cut-off is caught only half the time.",
        ],
        result: "Power 0.841 and 0.5.",
      },
      {
        type: "example",
        level: 3,
        title: "sizing a study",
        problem: "Find $n$ for 80% power ($z_\\beta = 0.84$) to detect $\\delta = 5$ at one-sided $\\alpha = 0.05$ when $\\sigma = 10$.",
        solution: ["$n \\ge \\left(\\dfrac{(1.645 + 0.84) \\times 10}{5}\\right)^2 = 4.97^2 \\approx 24.7$.", "Round up."],
        result: "25.",
      },
    ],
    pitfalls: [
      { wrong: "$\\beta = 1 - \\alpha$.", right: "$\\beta$ depends on the true effect and on $n$; $1 - \\alpha$ is the chance of correctly keeping a true $H_0$." },
      { wrong: "Lowering $\\alpha$ is free safety.", right: "It raises $\\beta$: fewer false alarms, more missed effects." },
      { wrong: "Test twenty things and report the one with $p < 0.05$.", right: "With twenty true nulls that happens 64% of the time. Correct for multiple tests." },
    ],
    formulas: [
      { label: "Power", tex: "1 - \\beta = 1 - \\Phi\\!\\left(z_\\alpha - \\tfrac{\\mu_1 - \\mu_0}{\\text{SE}}\\right)" },
      { label: "Sample size", tex: "n \\ge \\left(\\tfrac{(z_\\alpha + z_\\beta)\\sigma}{\\delta}\\right)^2" },
      { label: "Any false positive", tex: "1 - (1 - \\alpha)^m" },
      { label: "Bonferroni", tex: "\\alpha/m\\ \\text{per test}" },
    ],
    exercises: [
      ex(1, num("pow-ex-1", "$\\beta = 0.1$. Find the power.", 0.9, "$1 - \\beta$."), ["$1 - 0.1 = 0.9$."]),
      ex(1, mc("pow-ex-2", "A court acquits a guilty defendant ($H_0$: innocent). This is", ["a Type II error", "A false $H_0$ was kept."], [["a Type I error", "That would be convicting an innocent person."], ["not an error", "The verdict is wrong."]]), ["Guilty means $H_0$ is false; acquitting keeps it: Type II."]),
      ex(2, num("pow-ex-3", "Fifty independent tests of true nulls are run at $\\alpha = 0.02$. Find the expected number of false positives.", 1, "$m\\alpha$."), ["$50 \\times 0.02 = 1$."]),
      ex(2, dp("pow-ex-4", "Ten independent tests of true nulls at $\\alpha = 0.05$. Find the probability of at least one false positive.", 1 - 0.95 ** 10, "$1 - 0.95^{10}$."), ["$1 - 0.95^{10} \\approx 0.401$."]),
      ex(2, num("pow-ex-5", "Find the Bonferroni per-test level for 20 tests with overall $\\alpha = 0.05$.", 0.0025, "$\\alpha/m$."), ["$0.05/20 = 0.0025$."]),
      ex(3, dp("pow-ex-6", `$H_0: \\mu = 50$, $\\text{SE} = 2$, reject when $\\bar x > 54$. Find the power if really $\\mu = 55$. ${TABLE}`, 0.6915, "Standardise with 55."), ["$P(\\bar X > 54) = P(Z > -0.5) = \\Phi(0.5) = 0.6915$."]),
      ex(3, dp("pow-ex-7", `Same test (reject when $\\bar x > 54$, $\\text{SE} = 2$). Find the power if really $\\mu = 52$. ${TABLE}`, 1 - 0.8413, "$z = (54 - 52)/2$."), ["$P(Z > 1) = 1 - 0.8413 = 0.1587$: small effects are usually missed."]),
      ex(3, num("pow-ex-8", "Use $n \\ge ((z_\\alpha + z_\\beta)\\sigma/\\delta)^2$ with $z_\\alpha = 1.645$, $z_\\beta = 0.84$, $\\sigma = 8$, $\\delta = 2$. Find the smallest $n$.", 99, "$(2.485 \\times 4)^2$."), ["$(2.485 \\times 8/2)^2 = 9.94^2 \\approx 98.8$, so 99."]),
      ex(3, num("pow-ex-9", "If $n$ is multiplied by 4, by what factor does $\\delta/\\text{SE}$ change?", 2, "$\\text{SE} \\propto 1/\\sqrt n$."), ["$\\text{SE}$ halves, so $\\delta/\\text{SE}$ doubles."]),
      ex(3, mc("pow-ex-10", "Which change lowers a test's power?", ["Lowering $\\alpha$ from 0.05 to 0.01", "A stricter cut-off misses more real effects."], [["Collecting more data", "That raises power."], ["A larger true effect", "Larger effects are easier to detect."]]), ["Lowering $\\alpha$ pushes the cut-off out, so $\\beta$ rises and power falls."]),
    ],
  },

  // §8.4
  "t-tests": {
    definitions: [
      {
        type: "definition",
        term: "t distribution",
        body: "For a normal population, $T = \\dfrac{\\bar X - \\mu}{s/\\sqrt n}$ has a **t distribution with $n - 1$ degrees of freedom**: symmetric, with heavier tails than $N(0, 1)$, approaching it as $n$ grows. Two-sided 95% cut-offs $t^*$: 2.776 (4 d.f.), 2.262 (9), 2.131 (15), 2.093 (19), 2.064 (24), 2.042 (30).",
      },
      {
        type: "definition",
        term: "paired and two-sample tests",
        body: "**Paired**: the same units measured twice; take differences $d_i$ and use $t = \\dfrac{\\bar d}{s_d/\\sqrt n}$ with $n - 1$ d.f. **Two-sample** (Welch): independent groups, $t = \\dfrac{\\bar x_1 - \\bar x_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$, with at least $\\min(n_1, n_2) - 1$ d.f. as a safe choice by hand.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "t interval",
        statement: "A 95% interval for $\\mu$ from a small sample is $\\bar x \\pm t^*_{n-1}\\dfrac{s}{\\sqrt n}$.",
        proof: ["Repeat the rearrangement of §8.1 with the t cut-off: $P(-t^* \\le T \\le t^*) = 0.95$."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "when the t-test is valid",
        statement: "Observations must be independent. For small $n$ the population (or the differences, if paired) should be roughly normal: no strong skew or outliers. For large $n$ the CLT makes the test reliable anyway.",
        proof: ["The t distribution is derived for normal data. The CLT (§7.4) makes $\\bar X$ nearly normal for large $n$, but small samples inherit the population's shape."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$n = 16$, $\\bar x = 53$, $s = 8$. Test $H_0: \\mu = 50$ two-sided at 5%.",
        solution: ["$\\text{SE} = 8/4 = 2$ and $t = 3/2 = 1.5$ with 15 d.f.", "$|t| = 1.5 < 2.131$: do not reject."],
        result: "$t = 1.5$: not significant.",
      },
      {
        type: "example",
        level: 2,
        title: "a t interval",
        problem: "$n = 10$, $\\bar x = 20$, $s = 3$. Find the 95% interval for $\\mu$.",
        solution: ["$\\text{SE} = 3/\\sqrt{10} \\approx 0.949$ and $t^* = 2.262$ (9 d.f.).", "Margin $2.262 \\times 0.949 \\approx 2.15$."],
        result: "About $(17.85,\\ 22.15)$.",
      },
      {
        type: "example",
        level: 3,
        title: "paired data",
        problem: "Five students' scores rise by $3, 5, 2, 6, 4$ after tutoring. Test for an improvement at 5%, two-sided.",
        solution: [
          "$\\bar d = 4$. Deviations $-1, 1, -2, 2, 0$ give $s_d^2 = 10/4 = 2.5$, so $s_d \\approx 1.581$.",
          "$\\text{SE} = 1.581/\\sqrt5 \\approx 0.707$ and $t = 4/0.707 \\approx 5.66$ with 4 d.f.",
          "$5.66 > 2.776$: reject. Pairing removed the large differences between students.",
        ],
        result: "$t \\approx 5.66$: significant improvement.",
      },
      {
        type: "example",
        level: 3,
        title: "two groups",
        problem: "Group A: $n = 10$, $\\bar x = 78$, $s = 6$. Group B: $n = 10$, $\\bar x = 72$, $s = 8$. Test for a difference at 5%.",
        solution: ["$\\text{SE} = \\sqrt{36/10 + 64/10} = \\sqrt{10} \\approx 3.16$ and $t = 6/3.16 \\approx 1.90$.", "With the safe 9 d.f., $1.90 < 2.262$: do not reject."],
        result: "Not significant.",
      },
    ],
    pitfalls: [
      { wrong: "Use 1.96 with $n = 10$ and an estimated $s$.", right: "Use $t^*$ with $n - 1$ d.f.: 2.262 for $n = 10$." },
      { wrong: "Analyse before-and-after data as two independent groups.", right: "Test the differences. Pairing removes the variation between units." },
      { wrong: "The degrees of freedom are $n$.", right: "$n - 1$: one is used up estimating the mean." },
    ],
    formulas: [
      { label: "One-sample", tex: "t = \\dfrac{\\bar x - \\mu_0}{s/\\sqrt n},\\ n - 1\\ \\text{d.f.}" },
      { label: "Paired", tex: "t = \\dfrac{\\bar d}{s_d/\\sqrt n}" },
      { label: "Two-sample", tex: "t = \\dfrac{\\bar x_1 - \\bar x_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}" },
      { label: "Interval", tex: "\\bar x \\pm t^*_{n-1}\\,s/\\sqrt n" },
    ],
    exercises: [
      ex(1, num("tt-ex-1", "$n = 25$, $s = 10$, $\\bar x = 54$, $\\mu_0 = 50$. Find $t$.", 2, "$\\text{SE} = 2$."), ["$\\text{SE} = 10/5 = 2$ and $t = 4/2 = 2$."]),
      ex(1, num("tt-ex-2", "A paired study has 12 pairs. How many degrees of freedom?", 11, "$n - 1$ differences."), ["12 differences give 11 d.f."]),
      ex(2, mc("tt-ex-3", "The two-sided 95% cut-off for $|t|$ with 9 d.f. is", ["2.262", "From the table."], [["1.96", "That is the normal cut-off."], ["1.833", "That is the one-sided 5% cut-off."]]), ["With 9 d.f. the tails are heavier than normal: 2.262."]),
      ex(2, num("tt-ex-4", "$n = 16$, $\\bar x = 30$, $s = 4$. Find the upper end of the 95% interval, using $t^* = 2.131$.", 32.131, "$\\text{SE} = 1$."), ["$30 + 2.131 \\times 1 = 32.131$."]),
      ex(2, dp("tt-ex-5", "Paired differences are $2, 4, 6$. Find $t$ for $H_0$: mean difference 0.", 2 * Math.sqrt(3), "$s_d = 2$."), ["$\\bar d = 4$, $s_d = 2$, $\\text{SE} = 2/\\sqrt3$.", "$t = 4\\sqrt3/2 = 2\\sqrt3 \\approx 3.464$."]),
      ex(2, mc("tt-ex-6", "Reaction times of 15 drivers are measured sober and after a drink. Which test?", ["A paired t-test on the differences", "The same drivers are measured twice."], [["A two-sample t-test", "The groups are not independent."], ["A chi-square test", "The data are measurements, not counts."]]), ["Each driver is their own control, so test the 15 differences."]),
      ex(3, dp("tt-ex-7", "Group 1: $n = 9$, $s = 6$, $\\bar x = 47$. Group 2: $n = 16$, $s = 8$, $\\bar x = 40$. Find the Welch $t$.", 7 / Math.sqrt(8), "$\\text{SE} = \\sqrt{4 + 4}$."), ["$s_1^2/n_1 = 4$ and $s_2^2/n_2 = 4$, so $\\text{SE} = \\sqrt8 \\approx 2.828$.", "$t = 7/2.828 \\approx 2.475$."]),
      ex(3, num("tt-ex-8", "$H_0: \\mu = 100$, $n = 16$, $s = 12$. Above what $\\bar x$ is $H_0$ rejected (two-sided 5%, $t^* = 2.131$)?", 106.393, "$100 + t^*\\,\\text{SE}$."), ["$\\text{SE} = 3$, so $100 + 2.131 \\times 3 = 106.393$."]),
      ex(3, dp("tt-ex-9", "The sample $4, 6, 8, 10, 12$ tests $H_0: \\mu = 6$. Find $t$.", Math.SQRT2, "$s^2 = 40/4$."), ["$\\bar x = 8$ and $s^2 = 10$, so $\\text{SE} = \\sqrt{10/5} = \\sqrt2$.", "$t = 2/\\sqrt2 = \\sqrt2 \\approx 1.414$."]),
      ex(3, mc("tt-ex-10", "Eight values, one a huge outlier, from a strongly skewed population. A t-test is", ["unreliable", "Small samples need roughly normal data."], [["fine, because t handles small samples", "It handles unknown $\\sigma$, not skew and outliers."], ["fine, by the CLT", "The CLT needs large $n$."]]), ["With $n = 8$ the outlier dominates $\\bar x$ and $s$; the t distribution no longer describes $T$."]),
    ],
  },

  // §8.5
  "chi-square": {
    definitions: [
      {
        type: "definition",
        term: "chi-square tests",
        body: "**Goodness of fit**: do counts in $k$ categories match hypothesised proportions? $E_i = n p_i$, with $k - 1$ d.f. **Independence**: in an $r \\times c$ table, are the two classifications unrelated? $E = \\dfrac{\\text{row total} \\times \\text{column total}}{N}$, with $(r - 1)(c - 1)$ d.f. Both use $\\chi^2 = \\sum (O - E)^2/E$.",
      },
      {
        type: "definition",
        term: "critical values",
        body: "Reject at 5% when $\\chi^2$ exceeds 3.84 (1 d.f.), 5.99 (2), 7.81 (3), 9.49 (4), 11.07 (5) or 12.59 (6). The approximation needs every expected count to be at least 5.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "expected counts",
        statement: "Under independence, $E_{ij} = \\dfrac{R_iC_j}{N}$ for row total $R_i$, column total $C_j$ and grand total $N$.",
        proof: ["Independence means $P(\\text{row } i \\text{ and column } j) = P(\\text{row } i)P(\\text{column } j)$, estimated by $\\dfrac{R_i}{N} \\cdot \\dfrac{C_j}{N}$. Multiply by $N$."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "degrees of freedom",
        statement: "Independence: $(r - 1)(c - 1)$. Goodness of fit: $k - 1$, minus one more for each parameter estimated from the data.",
        proof: ["Once the totals are fixed, choosing the cells of the first $r - 1$ rows and $c - 1$ columns determines the rest. The counts must also add to $n$, which uses up one d.f. in goodness of fit."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "the 2 × 2 shortcut",
        statement: "For the table with rows $(a, b)$ and $(c, d)$, $\\chi^2 = \\dfrac{N(ad - bc)^2}{(a + b)(c + d)(a + c)(b + d)}$.",
        proof: [
          "Every cell has $|O - E| = |ad - bc|/N$; for instance $a - \\tfrac{(a + b)(a + c)}{N} = \\tfrac{ad - bc}{N}$.",
          "$\\sum \\tfrac{1}{E_{ij}} = N\\left(\\tfrac{1}{R_1} + \\tfrac{1}{R_2}\\right)\\left(\\tfrac{1}{C_1} + \\tfrac{1}{C_2}\\right) = \\tfrac{N^3}{R_1R_2C_1C_2}$; multiply by $\\tfrac{(ad - bc)^2}{N^2}$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A die rolled 60 times gives counts $8, 9, 12, 11, 6, 14$. Is it fair, at 5%?",
        solution: ["$E = 10$ each. $\\chi^2 = \\tfrac{4 + 1 + 4 + 1 + 16 + 16}{10} = 4.2$.", "5 d.f., cut-off 11.07: $4.2 < 11.07$."],
        result: "No evidence the die is unfair.",
      },
      {
        type: "example",
        level: 2,
        title: "a 3 : 1 ratio",
        problem: "Genetics predicts tall : short in ratio 3 : 1. Of 200 plants, 160 are tall. Test at 5%.",
        solution: ["$E = 150$ and $50$. $\\chi^2 = \\tfrac{100}{150} + \\tfrac{100}{50} \\approx 0.667 + 2 = 2.67$.", "1 d.f., cut-off 3.84: do not reject."],
        result: "$\\chi^2 \\approx 2.67$: consistent with 3 : 1.",
      },
      {
        type: "example",
        level: 3,
        title: "independence",
        problem: "Of 60 men, 40 like a product; of 40 women, 10 do. Test independence at 5%.",
        solution: [
          "Totals: 50 like, 50 don't. Expected: men $30, 30$; women $20, 20$.",
          "$\\chi^2 = \\tfrac{100}{30} + \\tfrac{100}{30} + \\tfrac{100}{20} + \\tfrac{100}{20} \\approx 16.7$.",
          "Shortcut check: $\\dfrac{100(40 \\cdot 30 - 20 \\cdot 10)^2}{60 \\cdot 40 \\cdot 50 \\cdot 50} = \\dfrac{10^8}{6 \\times 10^6} \\approx 16.7$. With 1 d.f., far above 3.84.",
        ],
        result: "$\\chi^2 \\approx 16.7$: liking depends on gender.",
      },
    ],
    pitfalls: [
      { wrong: "Plug percentages into $\\chi^2$.", right: "Use counts. Percentages hide the sample size." },
      { wrong: "Divide by $O$.", right: "Divide by $E$, the count $H_0$ predicts." },
      { wrong: "Degrees of freedom = number of cells.", right: "$(r - 1)(c - 1)$ for a table, $k - 1$ for goodness of fit." },
      { wrong: "Ignore expected counts below 5.", right: "Merge small categories first; the approximation breaks down." },
    ],
    formulas: [
      { label: "Statistic", tex: "\\chi^2 = \\sum \\dfrac{(O - E)^2}{E}" },
      { label: "Expected (table)", tex: "E_{ij} = R_iC_j/N" },
      { label: "Degrees of freedom", tex: "(r - 1)(c - 1)\\ \\text{or}\\ k - 1" },
      { label: "2 × 2", tex: "\\chi^2 = \\dfrac{N(ad - bc)^2}{R_1R_2C_1C_2}" },
    ],
    exercises: [
      ex(1, num("chi2-ex-1", "$O = 30$ and $E = 25$. Find this cell's contribution to $\\chi^2$.", 1, "$5^2/25$."), ["$25/25 = 1$."]),
      ex(1, num("chi2-ex-2", "A goodness-of-fit test has 4 categories. How many degrees of freedom?", 3, "$k - 1$."), ["$4 - 1 = 3$."]),
      ex(2, num("chi2-ex-3", "Row total 80, column total 50, grand total 200. Find the expected count.", 20, "$R C/N$."), ["$80 \\times 50/200 = 20$."]),
      ex(2, num("chi2-ex-4", "How many degrees of freedom has a test of independence on a $4 \\times 5$ table?", 12, "$(r - 1)(c - 1)$."), ["$3 \\times 4 = 12$."]),
      ex(2, fr("chi2-ex-5", "Of 100 plants, 70 are tall; the hypothesis is 3 : 1 tall : short. Find $\\chi^2$.", 4 / 3, "$E = 75, 25$."), ["$\\tfrac{25}{75} + \\tfrac{25}{25} = \\tfrac13 + 1 = \\tfrac43$."]),
      ex(2, num("chi2-ex-6", "A coin gives 60 heads in 100 tosses. Find $\\chi^2$ for fairness.", 4, "$E = 50, 50$."), ["$\\tfrac{100}{50} + \\tfrac{100}{50} = 4$. This is $z^2$ for $z = 2$: the one-d.f. chi-square test equals the two-sided z-test."]),
      ex(3, num("chi2-ex-7", "A $2 \\times 2$ table has rows $(20, 30)$ and $(30, 20)$. Find $\\chi^2$.", 4, "Shortcut formula."), ["$N = 100$, all totals 50: $\\dfrac{100(400 - 900)^2}{50^4} = \\dfrac{2.5 \\times 10^7}{6.25 \\times 10^6} = 4$."]),
      ex(3, mc("chi2-ex-8", "That table gives $\\chi^2 = 4$ with 1 d.f. At 5%,", ["reject independence", "$4 > 3.84$."], [["do not reject", "The statistic exceeds the cut-off."], ["the test is invalid", "All expected counts are 25."]]), ["Compare with 3.84: reject."]),
      ex(3, num("chi2-ex-9", "Counts in 5 categories are tested against given proportions, with one parameter estimated from the data. How many degrees of freedom?", 3, "$k - 1 - 1$."), ["$5 - 1 - 1 = 3$."]),
      ex(3, mc("chi2-ex-10", "One cell has an expected count of 2. What should you do?", ["Merge it with a neighbouring category", "The approximation needs $E \\ge 5$."], [["Drop that cell", "That discards data and changes the hypothesis."], ["Nothing: chi-square works for any counts", "Small $E$ makes $\\chi^2$ unreliable."]]), ["Combine categories until every expected count is at least 5."]),
    ],
  },

  // §8.6
  "correlation-causation": {
    definitions: [
      {
        type: "definition",
        term: "confounder",
        body: "A **confounder** is a variable that influences both the explanatory variable and the response, creating an association between them even if neither causes the other. Age confounds shoe size and reading ability.",
      },
      {
        type: "definition",
        term: "observational study, experiment",
        body: "In an **observational study** subjects choose (or are already in) their groups. In a **randomised controlled experiment** a chance mechanism assigns treatments, ideally with a control group and blinding.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "randomisation balances confounders",
        statement: "Under random assignment, every pre-existing characteristic is independent of the treatment, so the groups differ only by chance and by the treatment. A difference larger than chance explains is caused by the treatment.",
        proof: ["The coin that assigns treatment knows nothing about the subjects. Any variable, measured or not, has the same distribution in each group, up to sampling noise that a test (§8.2) accounts for."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "pooled rates are weighted averages",
        statement: "An overall rate is $w \\cdot r_1 + (1 - w)r_2$, where $w$ is the share of cases in group 1. If two treatments receive different mixes of easy and hard cases, the pooled comparison can reverse the within-group one (**Simpson's paradox**).",
        proof: ["A treatment that is better in both groups can still have the lower average if most of its weight sits on the harder group, whose rate is low for everyone."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "regression to the mean",
        statement: "If two measurements have correlation $r < 1$, then in standard units the predicted second value is $\\hat z_2 = r z_1$: extreme first results tend to be followed by less extreme ones, with no cause needed.",
        proof: ["The least-squares line in standard units has slope $r$ (§6.6). With $|r| < 1$, $|r z_1| < |z_1|$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Ice-cream sales and drownings rise and fall together. Explain.",
        solution: ["Hot weather increases both ice-cream sales and swimming.", "Temperature is a confounder; banning ice cream would not prevent drowning."],
        result: "A confounder (temperature).",
      },
      {
        type: "example",
        level: 2,
        title: "Simpson's paradox",
        problem: "Hospital X: mild cases 90/100 survive, severe 30/100. Hospital Y: mild 19/20, severe 60/180. Which is better?",
        solution: [
          "Within groups Y is better: mild 95% vs 90%, severe 33% vs 30%.",
          "Overall X has $120/200 = 60\\%$ and Y has $79/200 = 39.5\\%$, because 90% of Y's patients are severe.",
          "Compare like with like: Y is better.",
        ],
        result: "Y, despite its lower overall rate.",
      },
      {
        type: "example",
        level: 3,
        title: "regression to the mean",
        problem: "Two tests have correlation 0.6. A student scores 2 standard deviations above the mean on the first. Predict the second.",
        solution: ["$\\hat z_2 = 0.6 \\times 2 = 1.2$.", "The prediction is still well above average, but closer to it: no change in ability is implied."],
        result: "1.2 standard deviations above the mean.",
      },
    ],
    pitfalls: [
      { wrong: "Correlation proves causation.", right: "It may come from a confounder, reverse causation or chance." },
      { wrong: "A huge observational sample removes confounding.", right: "More data shrinks noise, not bias. Only randomisation (or careful design) removes confounding." },
      { wrong: "A drop after an extreme result proves the intervention worked.", right: "Regression to the mean predicts that drop anyway. Compare with a control group." },
    ],
    formulas: [
      { label: "Pooled rate", tex: "w r_1 + (1 - w) r_2" },
      { label: "Regression to the mean", tex: "\\hat z_2 = r z_1" },
      { label: "Variance explained", tex: "r^2" },
    ],
    exercises: [
      ex(1, mc("cc-ex-1", "Cities with more police officers have more crime. The most likely explanation is", ["reverse causation: crime leads cities to hire police", "The arrow can point either way."], [["police cause crime", "Correlation alone cannot show that."], ["pure chance", "The pattern is strong and consistent."]]), ["High crime drives police hiring, so the association runs from crime to police."]),
      ex(1, mc("cc-ex-2", "The best way to show that a new teaching method causes higher scores is", ["randomly assign classes to the method or the old one", "Randomisation balances confounders."], [["compare schools that chose the method with those that didn't", "Schools that choose it may differ in other ways."], ["survey teachers' opinions", "Opinions do not measure the effect."]]), ["Random assignment makes the groups alike apart from the method."]),
      ex(2, num("cc-ex-3", "30% of a hospital's patients are severe (40% survive) and 70% mild (90% survive). Find the overall survival rate.", 0.75, "Weighted average."), ["$0.3 \\times 0.4 + 0.7 \\times 0.9 = 0.12 + 0.63 = 0.75$."]),
      ex(2, num("cc-ex-4", "Two measurements have $r = 0.5$. The first is at $z = 2$. Predict the second in standard units.", 1, "$r z_1$."), ["$0.5 \\times 2 = 1$."]),
      ex(2, num("cc-ex-5", "Two variables have $r = 0.8$. What fraction of the variance in one is explained by a linear fit on the other?", 0.64, "$r^2$."), ["$0.8^2 = 0.64$."]),
      ex(3, num("cc-ex-6", "Hospital Y saved 19 of 20 mild and 60 of 180 severe patients. Find its overall survival rate.", 0.395, "$79/200$."), ["$(19 + 60)/200 = 0.395$."]),
      ex(3, mc("cc-ex-7", "Hospital Y has the lower overall rate but the higher rate in each severity group. Which comparison is fair?", ["Within severity groups", "It compares like with like."], [["Overall", "The overall rates mix very different case loads."], ["Neither can be used", "The within-group comparison is valid."]]), ["Severity confounds hospital and survival; compare within each severity level."]),
      ex(3, num("cc-ex-8", "Instructors praise landings at $z = 1.5$. Successive landings have $r = 0.4$. Predict the next landing's $z$.", 0.6, "$r z_1$."), ["$0.4 \\times 1.5 = 0.6$: worse, with or without the praise."]),
      ex(3, mc("cc-ex-9", "An observational study of a million people finds that coffee drinkers live longer. You can conclude", ["an association, not causation", "Size does not remove confounding."], [["coffee extends life", "Coffee drinkers may differ in income, health and habits."], ["nothing at all", "The association itself is solid."]]), ["A large sample makes the association precise, but confounders remain."]),
      ex(3, mc("cc-ex-10", "$X$ and $Y$ have correlation 0. Then", ["they can still be strongly related", "Correlation measures only linear association."], [["$X$ cannot cause $Y$", "A nonlinear or masked effect can give $r = 0$."], ["they are independent", "Zero correlation does not imply independence (§6.2)."]]), ["$Y = X^2$ with $X$ symmetric about 0 has $r = 0$ yet $Y$ is determined by $X$."]),
    ],
  },
};
