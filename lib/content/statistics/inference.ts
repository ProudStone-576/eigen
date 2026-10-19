import type { ConceptNode, Unit } from "@/lib/content/types";

const ci: ConceptNode = {
  id: "confidence-intervals",
  title: "Confidence intervals",
  summary: "A 95% confidence interval, $\\bar x \\pm 1.96\\,\\text{SE}$, comes from a method that catches the true mean in 95% of repeated samples. It's about the mean, not individual data values.",
  deps: ["standard-error"],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "confidence interval", meaning: "A range of plausible values for a population quantity, computed from a sample." },
    { term: "confidence level", meaning: "How often the method catches the true value over many repeated samples (95% is common)." },
  ],
  misconceptions: {
    "ci-covers-data": "Thinks a 95% confidence interval contains 95% of the individual data values.",
    "ci-always-catches": "Thinks a correctly computed 95% interval always contains the true value.",
  },
  steps: [
    {
      type: "motivate",
      title: "An estimate needs a range",
      body: "\"Average delivery time is 32 minutes\" sounds precise. But from 10 orders or 10,000? A confidence interval puts a number on how far off the estimate could be.",
      realWorld: {
        title: "Clinical trials",
        body: "Drug trials report effects like \"blood pressure down 8 points (95% CI 5 to 11)\". Regulators read the interval, not just the single number.",
      },
    },
    {
      type: "explore",
      title: "Catch the true mean",
      body: "The true mean is 50. Each line is one sample's 95% interval.",
      widget: { kind: "cisim" },
      task: "Take 20 samples at a time, a few hundred in total. What fraction of intervals catch 50? Do the misses look like mistakes?",
    },
    {
      type: "truth",
      statement: "A **95% confidence interval** for a mean is $\\bar x \\pm 1.96\\,\\text{SE}$. The method catches the true mean in about 95% of repeated samples.",
      body: "The 95% describes the *procedure*: about 1 interval in 20 misses through bad luck, and you can't tell which. More confidence (99%, using 2.58) means wider intervals; more data means a smaller SE and narrower intervals. The interval is about where the **mean** is, not where individual values fall.",
    },
    {
      type: "predict",
      misconception: "ci-covers-data",
      item: {
        kind: "mc",
        id: "ci-predict-1",
        prompt: "A 95% CI for adults' mean height is 168 to 172 cm. What fraction of adults are between 168 and 172 cm tall?",
        options: [
          { id: "a", text: "Probably far fewer than 95%", correct: true, why: "The interval is about the mean; people spread much more widely." },
          { id: "b", text: "95%", misconception: "ci-covers-data", why: "That would be a range for individuals, which is much wider." },
          { id: "c", text: "Exactly 5%", why: "There's no reason for that number." },
        ],
      },
      reveal: {
        body: "Heights vary by about 10 cm from person to person, but the interval for the *mean* is only ±2 cm, because the SE shrinks with n while individual spread doesn't. Only a small fraction of people are within 2 cm of the average.",
        widget: { kind: "cisim" },
      },
      resolve: {
        kind: "mc",
        id: "ci-resolve-1",
        prompt: "What does a confidence interval for the mean describe?",
        options: [
          { id: "a", text: "Where the population mean plausibly is", correct: true, why: "It narrows as the sample grows." },
          { id: "b", text: "The range most data values fall in", misconception: "ci-covers-data", why: "That's a different and much wider range." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ci-check-1",
        prompt: "You repeat a whole study 100 times and compute a 95% CI each time. About how many intervals contain the true mean?",
        options: [
          { id: "a", text: "About 95", correct: true, why: "That's what 95% confidence means." },
          { id: "b", text: "All 100, if every one was done correctly", misconception: "ci-always-catches", why: "Unlucky samples miss even when nothing was done wrong." },
          { id: "c", text: "About 5", why: "About 5 *miss*." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ci-check-2",
        prompt: "In the simulator, a red interval missed the true mean. Did someone make a mistake?",
        options: [
          { id: "a", text: "No: about 1 in 20 honest 95% intervals miss", correct: true, why: "Misses are built into the 95%." },
          { id: "b", text: "Yes: a correct interval always catches it", misconception: "ci-always-catches", why: "Then it would be a 100% interval." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ci-check-3",
        prompt: "$\\bar x$ = 50 and SE = 2. Which is the 95% confidence interval?",
        options: [
          { id: "a", text: "46.08 to 53.92", correct: true, why: "50 ± 1.96 × 2." },
          { id: "b", text: "48 to 52", why: "That's ±1 SE: about 68% confidence." },
          { id: "c", text: "44 to 56", why: "That's ±3 SE." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Report intervals on metrics and A/B results: \"conversion up 1.2 points (95% CI −0.3 to 2.7)\" says the data can't rule out no effect at all. A single accuracy number without its interval hides how much of a difference is luck.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ci-produce-1", prompt: "$\\bar x$ = 100 and SE = 5. Upper end of the 95% CI (use 1.96)?", answer: 109.8, explain: "100 + 1.96 × 5." },
        {
          kind: "mc",
          id: "ci-produce-2",
          prompt: "You collect four times as much data. The 95% CI becomes…",
          options: [
            { id: "a", text: "About half as wide", correct: true, why: "SE shrinks by $\\sqrt 4 = 2$." },
            { id: "b", text: "A quarter as wide", why: "Width follows $\\sqrt{n}$." },
            { id: "c", text: "Wider", why: "More data means more precision." },
          ],
        },
        {
          kind: "mc",
          id: "ci-produce-3",
          prompt: "Compared with a 95% CI from the same data, a 99% CI is…",
          options: [
            { id: "a", text: "Wider", correct: true, why: "To catch the mean more often, the net must be bigger: 2.58 SE instead of 1.96." },
            { id: "b", text: "Narrower", why: "More confidence costs width." },
          ],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "ci-review-1", prompt: "$\\bar x$ = 20 and SE = 1. Lower end of the 95% CI?", answer: 18.04, explain: "20 − 1.96." },
  ],
};

const tests: ConceptNode = {
  id: "hypothesis-tests",
  title: "Hypothesis tests & p-values",
  summary: "Assume no effect (H₀) and ask how surprising the data would be: the p-value is P(data at least this extreme | H₀). Small p is evidence against H₀; a large p doesn't prove H₀.",
  deps: ["standard-error"],
  pos: { x: 1, y: 1 },
  glossary: [
    { term: "null hypothesis H₀", meaning: "The default, boring explanation: no effect, no difference." },
    { term: "test statistic", meaning: "How far the data is from what H₀ predicts, in standard errors, e.g. $z = (\\bar x - \\mu_0)/\\text{SE}$." },
    { term: "p-value", meaning: "If H₀ were true, the chance of data at least this extreme." },
    { term: "significance level α", meaning: "The cut-off (often 0.05): reject H₀ when p < α." },
  ],
  misconceptions: {
    "p-is-prob-null": "Reads the p-value as the probability that the null hypothesis is true.",
    "fail-reject-proves": "Thinks a non-significant result proves there's no effect.",
  },
  steps: [
    {
      type: "motivate",
      title: "Real effect, or luck?",
      body: "A new website design gets 5.3% conversions against the old 5.0%. Every sample wobbles, so is that a real improvement or noise? Hypothesis tests ask: if nothing had changed, how often would luck alone produce a gap this big?",
      realWorld: {
        title: "Particle physics",
        body: "The Higgs boson discovery was announced at \"5 sigma\": data that extreme would happen by chance, with no Higgs, about once in 3.5 million experiments.",
      },
    },
    {
      type: "explore",
      title: "Shade the tails",
      body: "The curve shows z values you'd see if H₀ were true. The shaded tails are the two-sided p-value.",
      widget: { kind: "pvalue", z: 1.5 },
      task: "Slide z until the p-value drops below 0.05. Where's the line? What p-value does z = 3 give?",
    },
    {
      type: "truth",
      statement: "A test assumes **H₀** and computes a statistic, e.g. $z = (\\bar x - \\mu_0)/\\text{SE}$. The **p-value** is the probability, *if H₀ were true*, of data at least that extreme. If p < α (often 0.05), reject H₀.",
      body: "A p-value is $P(\\text{data this extreme} \\mid H_0)$, not $P(H_0 \\mid \\text{data})$. Not rejecting H₀ means \"not enough evidence\", not \"no effect\": small studies often miss real effects.",
    },
    {
      type: "predict",
      misconception: "p-is-prob-null",
      item: {
        kind: "mc",
        id: "test-predict-1",
        prompt: "A test gives p = 0.03. Which statement is right?",
        options: [
          { id: "a", text: "If there were no effect, data this extreme would turn up about 3% of the time", correct: true, why: "That's the definition." },
          { id: "b", text: "There's a 3% chance there's no effect", misconception: "p-is-prob-null", why: "The p-value is computed *assuming* there's no effect." },
          { id: "c", text: "There's a 97% chance the effect is large", why: "p says nothing about how large an effect is." },
        ],
      },
      reveal: {
        body: "Set z = 2.17: the shaded area is about 0.03. That area is computed from a curve that *assumes* H₀ is true, so it's P(data this extreme | H₀). Turning it into P(H₀ | data) is the same conditional flip as in Bayes, and it needs a prior.",
        widget: { kind: "pvalue", z: 2.17 },
      },
      resolve: {
        kind: "mc",
        id: "test-resolve-1",
        prompt: "What does a p-value measure?",
        options: [
          { id: "a", text: "How surprising the data would be if H₀ were true", correct: true, why: "P(data at least this extreme | H₀)." },
          { id: "b", text: "The probability that H₀ is true", misconception: "p-is-prob-null", why: "That's the reverse conditional." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "test-check-1",
        prompt: "A small study of a new drug finds p = 0.4. What's the right conclusion?",
        options: [
          { id: "a", text: "Not enough evidence of an effect; one might still exist", correct: true, why: "A small study can easily miss a real effect." },
          { id: "b", text: "The drug doesn't work", misconception: "fail-reject-proves", why: "Absence of evidence isn't evidence of absence." },
          { id: "c", text: "The drug works", why: "p = 0.4 is very weak evidence." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "test-check-2",
        prompt: "\"Our A/B test wasn't significant, so the two versions perform identically.\" Fair?",
        options: [
          { id: "a", text: "No: the test just couldn't detect a difference", correct: true, why: "The confidence interval for the difference probably still includes real gains and losses." },
          { id: "b", text: "Yes: not significant means no difference", misconception: "fail-reject-proves", why: "It means the data is compatible with no difference, and with others." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "test-check-3",
        prompt: "H₀: μ = 100. A sample gives $\\bar x$ = 106 with SE = 2. What is the test statistic z?",
        options: [
          { id: "a", text: "3", correct: true, why: "(106 − 100) / 2." },
          { id: "b", text: "6", why: "Divide the gap by the SE." },
          { id: "c", text: "1.06", why: "Subtract μ₀, then divide by the SE." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "\"Is model B better than model A on this test set?\" is a hypothesis test. Trying 20 metrics or 20 random seeds and reporting the one with p < 0.05 is *p-hacking*: with 20 tries, one will cross the line by luck about 64% of the time.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "test-produce-1", prompt: "$\\bar x$ = 52, $\\mu_0$ = 50, SE = 1. What is z?", answer: 2, explain: "(52 − 50) / 1." },
        {
          kind: "mc",
          id: "test-produce-2",
          prompt: "α = 0.05 and p = 0.08. What do you conclude?",
          options: [
            { id: "a", text: "Don't reject H₀", correct: true, why: "p isn't below α." },
            { id: "b", text: "H₀ is true", misconception: "fail-reject-proves", why: "You just didn't find enough evidence against it." },
            { id: "c", text: "Reject H₀", why: "0.08 > 0.05." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "test-review-1",
      prompt: "p = 0.20 means…",
      options: [
        { id: "a", text: "Data this extreme would be fairly common even with no effect", correct: true, why: "One time in five." },
        { id: "b", text: "There's a 20% chance H₀ is true", misconception: "p-is-prob-null", why: "The p-value assumes H₀; it isn't H₀'s probability." },
      ],
    },
  ],
};

const errors: ConceptNode = {
  id: "errors-power",
  title: "Type I & II errors and power",
  summary: "A Type I error rejects a true H₀ (false alarm, probability α); a Type II error misses a real effect (probability β). Power, 1 − β, grows with bigger samples and bigger effects, and shrinks when α is made stricter.",
  deps: ["hypothesis-tests"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "Type I error", meaning: "Rejecting H₀ when it's true: a false positive." },
    { term: "Type II error", meaning: "Not rejecting H₀ when it's false: a missed effect, a false negative." },
    { term: "power", meaning: "The chance a test detects a real effect: 1 − β." },
  ],
  misconceptions: {
    "type-swap": "Mixes up Type I errors (false alarms) and Type II errors (missed effects).",
    "alpha-lower-free": "Thinks making α stricter has no cost, when it lowers power and raises Type II errors.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two ways to be wrong",
      body: "A smoke alarm can go off with no fire, or stay silent while the kitchen burns. Make it more sensitive and you get more false alarms; make it less sensitive and it misses fires. Every test faces this trade-off.",
      realWorld: {
        title: "Criminal trials",
        body: "\"Innocent until proven guilty\": H₀ is innocence. Convicting an innocent person is a Type I error; acquitting a guilty one is Type II. \"Beyond reasonable doubt\" is a very small α.",
      },
    },
    {
      type: "explore",
      title: "Move the cut-off",
      body: "At α = 0.05 the cut-off is |z| > 1.96.",
      widget: { kind: "pvalue", z: 2.5 },
      task: "A real effect produces z ≈ 2.5. Is it detected at α = 0.05? At α = 0.01 (cut-off 2.58)? At α = 0.001 (cut-off 3.29)?",
    },
    {
      type: "truth",
      statement: "**Type I error**: rejecting a true H₀, with probability α. **Type II error**: failing to reject a false H₀, with probability β. **Power** = 1 − β.",
      body: "Power rises with a bigger sample (smaller SE), a bigger true effect, and a looser α. Lowering α buys fewer false alarms at the cost of more misses. Studies plan their sample size to reach a target power, often 80%.",
    },
    {
      type: "predict",
      misconception: "alpha-lower-free",
      item: {
        kind: "mc",
        id: "err-predict-1",
        prompt: "To avoid false alarms, a team lowers α from 0.05 to 0.001. What happens to their chance of detecting a real effect?",
        options: [
          { id: "a", text: "It goes down", correct: true, why: "A stricter cut-off lets more real effects slip through." },
          { id: "b", text: "It stays the same: α only affects false alarms", misconception: "alpha-lower-free", why: "The same cut-off decides both kinds of error." },
          { id: "c", text: "It goes up", why: "Stricter means harder to reject." },
        ],
      },
      reveal: {
        body: "At α = 0.05 the cut-off is |z| > 1.96; at α = 0.001 it's |z| > 3.29. A real but modest effect producing z ≈ 2.5 was detected before and is missed now. Fewer false alarms, more misses: the same dial controls both.",
        widget: { kind: "pvalue", z: 2.5 },
      },
      resolve: {
        kind: "mc",
        id: "err-resolve-1",
        prompt: "Why does lowering α reduce power?",
        options: [
          { id: "a", text: "The stricter cut-off misses more real effects", correct: true, why: "Only bigger z values now count." },
          { id: "b", text: "It doesn't: false alarms and misses are unrelated", misconception: "alpha-lower-free", why: "They trade off through the same cut-off." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "err-check-1",
        prompt: "A smoke alarm goes off with no fire (H₀: no fire). Which error is that?",
        options: [
          { id: "a", text: "Type I", correct: true, why: "Rejecting a true H₀: a false alarm." },
          { id: "b", text: "Type II", misconception: "type-swap", why: "Type II would be staying silent during a real fire." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "err-check-2",
        prompt: "A test reads negative for someone who is infected (H₀: not infected). Which error is that?",
        options: [
          { id: "a", text: "Type II", correct: true, why: "A real effect (infection) was missed." },
          { id: "b", text: "Type I", misconception: "type-swap", why: "Type I is a false alarm: a positive for a healthy person." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "err-check-3",
        prompt: "Which of these raises a test's power?",
        options: [
          { id: "a", text: "A bigger sample", correct: true, why: "Smaller SE, so real effects give bigger z values." },
          { id: "b", text: "A smaller α", misconception: "alpha-lower-free", why: "That makes rejection harder, so power falls." },
          { id: "c", text: "A noisier measurement", why: "Noise inflates the SE." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A spam filter's false positive (real email sent to spam) is a Type I error and a false negative (spam gets through) is Type II. Choosing a classifier's threshold is choosing how to trade one against the other.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "err-produce-1", prompt: "α = 0.05 and β = 0.2. What is the power?", answer: 0.8, explain: "1 − β." },
        { kind: "number", id: "err-produce-2", prompt: "You run 20 independent tests at α = 0.05 on things with no real effect. Expected number of false positives?", answer: 1, explain: "20 × 0.05." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "err-review-1", prompt: "β = 0.35. What is the power?", answer: 0.65, explain: "1 − 0.35." },
  ],
};

const tTests: ConceptNode = {
  id: "t-tests",
  title: "t-tests",
  summary: "When σ is estimated from the sample, use $t = (\\bar x - \\mu_0)/(s/\\sqrt{n})$ with n − 1 degrees of freedom: fatter tails than the normal for small n. Paired data is tested through its differences.",
  deps: ["hypothesis-tests", "confidence-intervals"],
  pos: { x: 2, y: 2 },
  glossary: [
    { term: "t-distribution", meaning: "Like the standard normal but with fatter tails, which accounts for estimating σ." },
    { term: "degrees of freedom", meaning: "For a one-sample t-test, n − 1. More degrees of freedom make t closer to normal." },
    { term: "paired data", meaning: "Two measurements on the same unit, like before and after on the same person." },
  ],
  misconceptions: {
    "paired-as-independent": "Treats before/after measurements on the same people as two independent groups.",
    "t-equals-z-small-n": "Uses the z cut-off of 1.96 for small samples where σ is estimated.",
  },
  steps: [
    {
      type: "motivate",
      title: "Small samples, unknown σ",
      body: "A z-test assumes you know σ. You almost never do: you estimate it with s from the same small sample, which adds extra uncertainty that the normal curve ignores.",
      realWorld: {
        title: "Brewing",
        body: "The t-test was invented at the Guinness brewery by William Gosset, who published as \"Student\" and needed to judge barley quality from very small samples.",
      },
    },
    {
      type: "explore",
      title: "Where's the line?",
      body: "This is the normal curve. A t curve with few degrees of freedom has fatter tails, so its 5% cut-off sits further out.",
      widget: { kind: "pvalue", z: 2.26 },
      task: "At z = 2.26 the normal p-value is about 0.024. With n = 10, t = 2.26 is exactly on the 5% line. Why might it take a bigger statistic to convince you when n is small?",
    },
    {
      type: "truth",
      statement: "**One-sample t-test**: $t = (\\bar x - \\mu_0)/(s/\\sqrt{n})$, compared with a t-distribution with n − 1 degrees of freedom. For 95% two-sided, the cut-off is 2.26 at 9 degrees of freedom, 2.09 at 19 and 2.04 at 30, heading to 1.96.",
      body: "**Two-sample** (independent groups): compare the two means using the SE of their difference (Welch's test). **Paired** (the same units measured twice): take each unit's difference and run a one-sample t-test on the differences against 0.",
    },
    {
      type: "predict",
      misconception: "paired-as-independent",
      item: {
        kind: "mc",
        id: "t-predict-1",
        prompt: "The blood pressure of 10 people is measured before and after a drug. Which test?",
        options: [
          { id: "a", text: "A paired t-test on the 10 differences", correct: true, why: "Each 'after' belongs to a 'before'." },
          { id: "b", text: "A two-sample t-test comparing the 'before' group with the 'after' group", misconception: "paired-as-independent", why: "They're the same 10 people, not two groups." },
          { id: "c", text: "A chi-square test", why: "Chi-square is for counts in categories." },
        ],
      },
      reveal: {
        body: "Blood pressure varies hugely *between* people, say SD 15, but each person's change might be a steady −6 ± 3. Testing the differences removes the between-person noise: SE = $3/\\sqrt{10} \\approx 0.95$ instead of about $15\\sqrt{2/10} \\approx 6.7$. Same data, far stronger test.",
      },
      resolve: {
        kind: "mc",
        id: "t-resolve-1",
        prompt: "What makes data paired?",
        options: [
          { id: "a", text: "Each measurement in one list is linked to one in the other (same person, same item)", correct: true, why: "Then the differences are what matter." },
          { id: "b", text: "Nothing special: two lists are two samples", misconception: "paired-as-independent", why: "Ignoring the pairing throws away information." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "t-check-1",
        prompt: "n = 10, σ unknown, 95% two-sided. Which cut-off for |t|?",
        options: [
          { id: "a", text: "About 2.26 (t with 9 degrees of freedom)", correct: true, why: "Small samples need fatter tails." },
          { id: "b", text: "1.96", misconception: "t-equals-z-small-n", why: "That's for known σ or large n." },
          { id: "c", text: "1.645", why: "That's a one-sided z cut-off." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "t-check-2",
        prompt: "Why is the t cut-off bigger than 1.96 for small samples?",
        options: [
          { id: "a", text: "s is estimated from little data, which adds uncertainty, so the tails are fatter", correct: true, why: "With large n, s ≈ σ and t ≈ z." },
          { id: "b", text: "It isn't: 1.96 works for any n", misconception: "t-equals-z-small-n", why: "Using 1.96 with n = 5 gives far too many false alarms." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "t-check-3",
        prompt: "$\\bar x$ = 53, $\\mu_0$ = 50, s = 6, n = 16. What is t?",
        options: [
          { id: "a", text: "2", correct: true, why: "SE = 6/4 = 1.5, so t = 3/1.5." },
          { id: "b", text: "0.5", why: "Divide by $s/\\sqrt{n}$ = 1.5, not by s." },
          { id: "c", text: "8", why: "Divide by $s/\\sqrt{n}$, not $s/n$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Comparing two models over the same 10 cross-validation folds? Use a paired test on the per-fold differences: both models see the same easy and hard folds, so pairing cancels out fold difficulty.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "t-produce-1", prompt: "$\\bar x$ = 12, $\\mu_0$ = 10, s = 4, n = 16. What is t?", answer: 2, explain: "SE = 4/4 = 1, so t = 2/1." },
        { kind: "number", id: "t-produce-2", prompt: "How many degrees of freedom does a one-sample t-test with n = 25 have?", answer: 24, explain: "n − 1." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "t-review-1", prompt: "s = 10 and n = 25. What is the SE used in the t statistic?", answer: 2, explain: "$10/\\sqrt{25}$." },
  ],
};

const chi: ConceptNode = {
  id: "chi-square",
  title: "Chi-square tests",
  summary: "Compare observed counts O with the counts E you'd expect under H₀: $\\chi^2 = \\sum (O - E)^2/E$. For independence, E = row total × column total ÷ grand total.",
  deps: ["hypothesis-tests", "conditional-probability"],
  pos: { x: 3, y: 1 },
  glossary: [
    { term: "observed count O", meaning: "How many fell in a category or table cell." },
    { term: "expected count E", meaning: "How many H₀ says should fall there." },
    { term: "contingency table", meaning: "A table of counts for two categorical variables." },
  ],
  misconceptions: {
    "chi-percentages": "Runs the chi-square test on percentages instead of the actual counts.",
    "chi-expected-even": "Splits expected counts evenly between groups instead of applying the overall rate to each group's size.",
  },
  steps: [
    {
      type: "motivate",
      title: "Tests for categories",
      body: "Is a die fair? Does preference for a product depend on age group? Are clicks spread evenly across days of the week? The data is counts in categories, not averages.",
      realWorld: {
        title: "Genetics",
        body: "Mendel's pea experiments predicted a 3 : 1 ratio of traits. Chi-square is how you'd check whether observed counts match that ratio, beyond random variation.",
      },
    },
    {
      type: "truth",
      statement: "$\\chi^2 = \\sum \\dfrac{(O - E)^2}{E}$ over every category or cell. Large values mean the counts are far from what H₀ predicts.",
      body: "**Goodness of fit**: E = n × the hypothesised proportion; k categories give k − 1 degrees of freedom. **Independence** in an r × c table: E = row total × column total ÷ grand total, with (r − 1)(c − 1) degrees of freedom. Always use counts, and want every E to be at least about 5.",
    },
    {
      type: "predict",
      misconception: "chi-expected-even",
      item: {
        kind: "mc",
        id: "chi-predict-1",
        prompt: "100 people: 60 men and 40 women; 50 like the product overall. If liking is independent of gender, how many men would you expect to like it?",
        options: [
          { id: "a", text: "30", correct: true, why: "The overall rate, 50%, applied to the 60 men." },
          { id: "b", text: "25: half of the 50 likers", misconception: "chi-expected-even", why: "There are more men than women, so more of the likers should be men." },
          { id: "c", text: "60", why: "Not every man likes it." },
        ],
      },
      reveal: {
        body: "Independence means men like it at the same rate as everyone: 50 of 100, so 50%. 50% of 60 men is 30, and 50% of 40 women is 20. In formula form: row total × column total ÷ grand total = 60 × 50 / 100 = 30.",
      },
      resolve: {
        kind: "mc",
        id: "chi-resolve-1",
        prompt: "Under independence, how do you get each group's expected count?",
        options: [
          { id: "a", text: "Apply the overall rate to the group's size", correct: true, why: "Row total × column total ÷ grand total." },
          { id: "b", text: "Split the total evenly between groups", misconception: "chi-expected-even", why: "Only if the groups are the same size." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "chi-check-1",
        prompt: "30% of group A and 40% of group B clicked. Can you plug 30 and 40 into χ² as the observed counts?",
        options: [
          { id: "a", text: "Only if each group had exactly 100 people: use the actual counts", correct: true, why: "χ² is built on counts." },
          { id: "b", text: "Yes, percentages work the same way", misconception: "chi-percentages", why: "The same percentages from 10 people or 10,000 are very different evidence." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "chi-check-2",
        prompt: "Why does a chi-square test need counts rather than percentages?",
        options: [
          { id: "a", text: "The same percentages are much stronger evidence from 10,000 people than from 10", correct: true, why: "Counts carry the sample size." },
          { id: "b", text: "It doesn't matter which you use", misconception: "chi-percentages", why: "Percentages throw away n." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "chi-check-3",
        prompt: "A die is rolled 60 times (expected 10 per face) and a 6 comes up 16 times. What does that face add to χ²?",
        options: [
          { id: "a", text: "3.6", correct: true, why: "$(16 - 10)^2/10$." },
          { id: "b", text: "6", why: "Square the gap and divide by E." },
          { id: "c", text: "0.6", why: "Square the gap first: 36 / 10." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Chi-square feature selection (scikit-learn's chi2) scores each categorical or count feature by how far its counts are from independence with the label, a quick way to rank features before training.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "chi-produce-1", prompt: "O = 25 and E = 20. What does this cell add to χ²?", answer: 1.25, explain: "$5^2/20$." },
        { kind: "number", id: "chi-produce-2", prompt: "How many degrees of freedom does a test of independence on a 3 × 4 table have?", answer: 6, explain: "(3 − 1)(4 − 1)." },
        { kind: "number", id: "chi-produce-3", prompt: "Row total 40, column total 30, grand total 200. Expected count in that cell?", answer: 6, explain: "40 × 30 / 200." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "chi-review-1", prompt: "A goodness-of-fit test has 6 categories. How many degrees of freedom?", answer: 5, explain: "k − 1." },
  ],
};

const causation: ConceptNode = {
  id: "correlation-causation",
  title: "Correlation, causation & Simpson's paradox",
  summary: "Correlation can come from a confounder, reverse causation or chance; randomised experiments are how you get causation. Combining groups of different sizes can even reverse a trend.",
  deps: ["covariance", "sampling-bias"],
  pos: { x: 1, y: 2.6 },
  glossary: [
    { term: "confounder", meaning: "A third variable that drives both things you're looking at." },
    { term: "randomised experiment", meaning: "Treatments are assigned by chance, so confounders balance out between groups." },
    { term: "Simpson's paradox", meaning: "A trend that holds within every group reverses when the groups are combined." },
  ],
  misconceptions: {
    "correlation-causation": "Concludes that one thing causes another from a correlation alone.",
    "aggregate-always": "Thinks a trend in the combined data must also hold within every group.",
  },
  steps: [
    {
      type: "motivate",
      title: "They move together. So what?",
      body: "Countries that eat more chocolate win more Nobel prizes. Children with bigger feet read better. Both correlations are real; neither means what it seems to.",
      realWorld: {
        title: "Medicine",
        body: "Observational studies suggested hormone therapy protected women's hearts. A large randomised trial found it didn't: healthier, wealthier women were simply more likely to take it.",
      },
    },
    {
      type: "truth",
      statement: "A correlation between X and Y can come from X causing Y, Y causing X, a **confounder** driving both, or chance. **Randomised experiments** break the link to confounders, which is why they can show causation.",
      body: "**Simpson's paradox**: combining groups can reverse a trend when the groups differ in size and difficulty. Look within comparable groups before trusting a pooled number.",
    },
    {
      type: "predict",
      misconception: "aggregate-always",
      item: {
        kind: "mc",
        id: "cause-predict-1",
        prompt: "Kidney stones, 700 patients: treatment B succeeds 83% of the time overall, treatment A 78%. Must B also be better for small stones?",
        options: [
          { id: "a", text: "No: A could be better within each group", correct: true, why: "Pooled rates can hide, or even reverse, group-level results." },
          { id: "b", text: "Yes: better overall means better in each group", misconception: "aggregate-always", why: "Not when the groups are mixed differently." },
          { id: "c", text: "Yes, if the sample is big enough", why: "Size doesn't fix a mix difference." },
        ],
      },
      reveal: {
        body: "From a 1986 study. Small stones: A 81/87 (93%), B 234/270 (87%). Large stones: A 192/263 (73%), B 55/80 (69%). **A wins in both groups** yet loses overall (273/350 against 289/350), because doctors gave A mostly the hard, large-stone cases. Stone size is the confounder.",
      },
      resolve: {
        kind: "mc",
        id: "cause-resolve-1",
        prompt: "Why did A lose overall while winning in each group?",
        options: [
          { id: "a", text: "A treated mostly hard cases, which drag down any treatment's rate", correct: true, why: "263 of A's 350 patients had large stones." },
          { id: "b", text: "The numbers must be wrong", misconception: "aggregate-always", why: "They're right; pooling different mixes does this." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cause-check-1",
        prompt: "Ice-cream sales and drownings rise and fall together. Best explanation?",
        options: [
          { id: "a", text: "Hot weather drives both", correct: true, why: "A confounder." },
          { id: "b", text: "Ice cream causes drowning", misconception: "correlation-causation", why: "Correlation alone can't show that." },
          { id: "c", text: "Drowning causes ice-cream sales", why: "Neither causes the other." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cause-check-2",
        prompt: "Countries with more TVs per person have longer life expectancy. Should we ship TVs to raise life expectancy?",
        options: [
          { id: "a", text: "No: wealth plausibly drives both", correct: true, why: "Rich countries have more TVs and better healthcare." },
          { id: "b", text: "Yes: the correlation is strong", misconception: "correlation-causation", why: "Strength doesn't tell you the direction or the cause." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cause-check-3",
        prompt: "What's the most reliable way to show that a new teaching method *causes* better grades?",
        options: [
          { id: "a", text: "Randomly assign classes to the new or old method and compare", correct: true, why: "Randomisation balances the confounders." },
          { id: "b", text: "Find a strong correlation in a big dataset of schools that chose it", misconception: "correlation-causation", why: "Schools that choose it may differ in many ways." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Models learn correlations, including misleading ones. One hospital model learned that asthma patients with pneumonia had *lower* risk, because they were sent straight to intensive care. Good predictions don't tell you what an intervention will do.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "cause-produce-1",
          prompt: "Children with bigger shoe sizes have better reading scores. The most likely confounder?",
          options: [
            { id: "a", text: "Age", correct: true, why: "Older children have bigger feet and read better." },
            { id: "b", text: "There is none: big feet help reading", misconception: "correlation-causation", why: "Shoe size isn't doing the reading." },
          ],
        },
        { kind: "number", id: "cause-produce-2", prompt: "Treatment A succeeded in 273 of 350 cases. What percent is that, to the nearest whole number?", answer: 78, explain: "273 / 350 = 0.78." },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "cause-review-1",
      prompt: "A department's admission rate is higher for men overall but higher for women in every subject. Possible?",
      options: [
        { id: "a", text: "Yes, if women mostly applied to the harder subjects", correct: true, why: "Simpson's paradox: something very like this happened in UC Berkeley's 1973 graduate admissions." },
        { id: "b", text: "No: the overall rate must follow the subjects", misconception: "aggregate-always", why: "Different application mixes can reverse it." },
      ],
    },
  ],
};

export const inferenceUnit: Unit = {
  id: "st-4",
  track: "Statistics",
  title: "Inference",
  blurb: "Confidence intervals, hypothesis tests, t and chi-square, and when a correlation means a cause.",
  nodes: [ci, tests, errors, tTests, chi, causation],
};
