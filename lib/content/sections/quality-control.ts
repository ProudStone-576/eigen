import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Industrial statistics and quality control: Shewhart control charts (x-bar, p), run rules, average run length, CUSUM and EWMA, process capability (Cp, Cpk), Six Sigma and DMAIC, acceptance sampling, measurement-system analysis, reliability engineering. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "quality-control",
  title: "Quality control & industrial statistics",
  summary: "Every process varies. Statistical process control separates ordinary, common-cause variation from special causes worth investigating, using control charts with limits three standard errors from the centre. Capability indices compare the process spread with the specification, and Six Sigma organises improvement projects around measurement. Acceptance sampling and reliability testing decide whether batches and designs are good enough.",
  deps: ["sampling-distributions", "binomial", "survival-extensions"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "control chart", meaning: "A time plot of a process statistic with a centre line and control limits, usually at $\\pm 3$ standard errors." },
    { term: "common cause", meaning: "Variation built into a stable process; special causes are unusual events (a worn tool, a new supplier) that can be found and removed." },
    { term: "process capability", meaning: "How well a stable process fits within specification limits, measured by $C_p$ and $C_{pk}$." },
  ],
  misconceptions: {
    "control-limits-are-specs": "Confuses control limits (what the process does) with specification limits (what the customer requires).",
    "tamper-every-point": "Adjusts the process after every reading that differs from target, which increases variation in a stable process.",
  },
  steps: [
    {
      type: "motivate",
      title: "Signal or noise?",
      body: "A machine fills bottles to a target of 500 ml. Today's sample averaged 498.7. Should the line stop? Some variation is inevitable; reacting to every wobble makes things worse, but missing a real drift wastes product. Control charts give a disciplined rule: act only when the data show something the process wouldn't normally do.",
      realWorld: {
        title: "Shewhart and Deming",
        body: "Walter Shewhart invented the control chart at Bell Telephone Laboratories in 1924. W. Edwards Deming took his methods to Japanese manufacturers after 1950, where they became central to the quality movement; Japan's top quality award is named after Deming.",
      },
    },
    {
      type: "truth",
      statement: "An $\\bar x$ **chart** for samples of size $n$ from a process with mean $\\mu$ and SD $\\sigma$ has centre $\\mu$ and limits $\\mu \\pm 3\\sigma/\\sqrt n$ (§{sampling-distributions}); a **p chart** for the fraction defective has limits $\\bar p \\pm 3\\sqrt{\\bar p(1 - \\bar p)/n}$. For a stable normal process, a point falls outside 3-sigma limits with probability 0.0027, so the **average run length** between false alarms is $1/0.0027 \\approx 370$ samples. **Capability**: $C_p = \\dfrac{\\text{USL} - \\text{LSL}}{6\\sigma}$ compares the specification width with the process spread; $C_{pk} = \\min\\!\\left(\\dfrac{\\text{USL} - \\mu}{3\\sigma}, \\dfrac{\\mu - \\text{LSL}}{3\\sigma}\\right)$ also penalises an off-centre mean.",
      body: "**Run rules** (such as 8 points in a row on one side of the centre) catch small, sustained shifts faster; **CUSUM** and **EWMA** charts accumulate evidence and detect small drifts far sooner than Shewhart charts. Control limits come from the process; **specification** limits come from the customer, and a process can be in control yet incapable. **Six Sigma** aims for the nearest specification limit to be 6 process SDs from the mean (about 3.4 defects per million allowing a 1.5$\\sigma$ drift), improving through **DMAIC**: Define, Measure, Analyse, Improve, Control. **Acceptance sampling** inspects $n$ items from a lot and accepts if at most $c$ are defective, with the operating-characteristic curve giving $P(\\text{accept})$ for each true defect rate (§{binomial}). **Gauge R&R** studies split measurement variation into repeatability and reproducibility. Reliability engineering applies survival methods to products (§{survival-extensions}).",
    },
    {
      type: "predict",
      misconception: "tamper-every-point",
      item: {
        kind: "mc",
        id: "qcl-predict-1",
        prompt: "A stable filling process has random variation with SD 2 ml. An operator adjusts the machine after every bottle, by the amount that bottle missed the target. The fill variation will",
        options: [
          { id: "a", text: "increase, to about $\\sqrt2 \\times 2 \\approx 2.8$ ml", correct: true, why: "Each adjustment adds the last random error to the next." },
          { id: "b", text: "decrease, because errors are corrected", misconception: "tamper-every-point", why: "Random errors don't persist, so correcting them injects new variation." },
          { id: "c", text: "stay the same", why: "Adjustments change it." },
        ],
      },
      reveal: {
        body: "In a stable process, each bottle's error is independent noise; the next one isn't affected by the last. Shifting the setting by $-e_{t-1}$ makes the next fill $e_t - e_{t-1}$, whose variance is $2\\sigma^2$. Deming called this **tampering**. Adjust only when the chart signals a special cause.",
      },
      resolve: {
        kind: "mc",
        id: "qcl-resolve-1",
        prompt: "When a control chart shows a stable process, the right response to a point slightly off target is",
        options: [
          { id: "a", text: "leave the process alone", correct: true, why: "It is common-cause variation." },
          { id: "b", text: "adjust to cancel the deviation", misconception: "tamper-every-point", why: "That increases variation." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "qcl-check-1",
        prompt: "An $\\bar x$ chart shows every point within control limits 9.4 to 10.6 mm; the customer's specification is 9.8 to 10.2 mm. The process is",
        options: [
          { id: "a", text: "in control but not capable: many parts fall outside the specification", correct: true, why: "Control limits describe the process, not the requirement." },
          { id: "b", text: "fine, because all points are inside the limits", misconception: "control-limits-are-specs", why: "Being inside control limits says nothing about meeting specifications." },
          { id: "c", text: "out of control", why: "No point is outside the control limits." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "qcl-check-2",
        prompt: "Specification 9.4 to 10.6, process SD 0.1, mean 10.2. Then",
        options: [
          { id: "a", text: "$C_p = 2$ but $C_{pk} \\approx 1.33$: capable spread, off-centre mean", correct: true, why: "$1.2/0.6 = 2$; $(10.6 - 10.2)/0.3 \\approx 1.33$." },
          { id: "b", text: "$C_p = C_{pk} = 2$", why: "$C_{pk}$ uses the nearer limit." },
          { id: "c", text: "$C_p = 1$", why: "$6\\sigma = 0.6$, half the specification width." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Control charts monitor deployed models: plot daily error rates or prediction means with limits, and investigate only genuine signals (§{uncertainty-shift}). Anomaly detection in manufacturing sensors and A/B-test guardrail metrics use CUSUM and EWMA ideas.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "qcl-produce-1", prompt: "Process mean 50, SD 4, samples of 4. Find the upper control limit of the $\\bar x$ chart.", answer: 56, explain: "$50 + 3 \\times 4/2$." },
        { kind: "number", id: "qcl-produce-2", prompt: "Specification 40 to 60, process SD 2.5. Find $C_p$.", answer: 4 / 3, tolerance: 0.001, explain: "$20/15$." },
        {
          kind: "mc",
          id: "qcl-produce-3",
          prompt: "A manager wants control limits set at the customer's tolerances. This",
          options: [
            { id: "a", text: "mixes two ideas: control limits must come from the process's own variation", correct: true, why: "Specs say what is needed; control limits say what the process does." },
            { id: "b", text: "is standard practice", misconception: "control-limits-are-specs", why: "Charts would then miss real process changes or raise false alarms." },
          ],
        },
        {
          kind: "mc",
          id: "qcl-produce-4",
          prompt: "A stable process's last reading is 0.5 SD above target. The operator should",
          options: [
            { id: "a", text: "not adjust", correct: true, why: "Common-cause variation." },
            { id: "b", text: "lower the setting by 0.5 SD", misconception: "tamper-every-point", why: "Tampering increases variation." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "qcl-review-1", prompt: "A false-alarm rate per sample of 0.0027. Find the average run length between false alarms (nearest whole number).", answer: 370, tolerance: 1, explain: "$1/0.0027$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "CUSUM and EWMA",
      body: "A **CUSUM** chart tracks $S_t = \\max(0, S_{t-1} + (x_t - \\mu_0 - k))$ and signals when $S_t > h$; it accumulates small deviations, so a shift of 1 SD is caught in about 10 samples instead of about 44 for a Shewhart $\\bar x$ chart with $n = 1$. An **EWMA** chart plots $z_t = \\lambda x_t + (1 - \\lambda)z_{t-1}$ (§{exponential-smoothing}) with narrower limits.",
    },
    {
      type: "definition",
      term: "acceptance sampling",
      body: "A single sampling plan $(n, c)$ inspects $n$ items from each lot and accepts if at most $c$ are defective. With defect rate $p$, $P(\\text{accept}) = \\sum_{k=0}^{c}\\binom nkp^k(1 - p)^{n-k}$. Its OC curve shows the producer's risk (rejecting good lots) and the consumer's risk (accepting bad ones). Sampling inspects quality in at best; control charts build it in.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "average run length",
      statement: "If each sample independently signals with probability $p$, the number of samples until the first signal is geometric with mean $1/p$. For 3-sigma limits on a normal process, $p = 0.0027$ in control, giving ARL $\\approx 370$.",
      proof: ["$P(\\lvert Z\\rvert > 3) = 2(1 - \\Phi(3)) \\approx 0.0027$; the geometric mean is $1/p$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "tampering doubles the variance",
      statement: "If $y_t = \\mu + e_t$ with independent $e_t$ and the setting is adjusted by $-(y_{t-1} - \\text{target})$ each time, the output variance becomes $2\\sigma^2$.",
      proof: ["The output deviation becomes $e_t - e_{t-1}$, a difference of independent errors."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "capability and defect rates",
      statement: "For a centred normal process, the fraction outside the specification is $2\\Phi(-3C_p)$: $C_p = 1$ gives about 0.27%, $C_p = 1.33$ about 63 per million, $C_p = 2$ about 2 per billion.",
      proof: ["The nearer limit is $3C_p$ SDs from the mean on each side."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Process mean 500 ml, SD 2 ml, samples of 4. Find the $\\bar x$ chart limits, and judge a sample mean of 497.2.",
      solution: ["Limits $500 \\pm 3 \\times 2/\\sqrt4 = 500 \\pm 3$: 497 to 503.", "497.2 is inside: no signal."],
      result: "497–503; no action.",
    },
    {
      type: "example",
      level: 2,
      title: "a p chart",
      problem: "Samples of 200 items average 4% defective. Find the p-chart limits.",
      solution: ["$\\sqrt{0.04 \\times 0.96/200} \\approx 0.01386$.", "$0.04 \\pm 0.0416$: lower limit 0 (it can't be negative), upper about 0.0816."],
      result: "0 to about 8.2%.",
    },
    {
      type: "example",
      level: 3,
      title: "an acceptance plan",
      problem: "Plan: inspect 20 items, accept if at most 1 is defective. Find $P(\\text{accept})$ when the lot is 5% defective.",
      solution: ["$0.95^{20} + 20 \\times 0.05 \\times 0.95^{19}$.", "$\\approx 0.358 + 0.377 = 0.736$."],
      result: "About 74%.",
    },
  ],
  pitfalls: [
    { wrong: "Set control limits at the specification.", right: "Compute them from the process; compare with specs through capability." },
    { wrong: "Adjust after every reading.", right: "Adjust only on a chart signal." },
    { wrong: "Report $C_p$ for an off-centre process.", right: "Report $C_{pk}$ too." },
  ],
  formulas: [
    { label: "$\\bar x$ chart", tex: "\\mu \\pm 3\\sigma/\\sqrt n" },
    { label: "p chart", tex: "\\bar p \\pm 3\\sqrt{\\bar p(1 - \\bar p)/n}" },
    { label: "Capability", tex: "C_p = \\dfrac{\\text{USL} - \\text{LSL}}{6\\sigma},\\ C_{pk} = \\dfrac{\\min(\\text{USL} - \\mu, \\mu - \\text{LSL})}{3\\sigma}" },
    { label: "ARL", tex: "1/p" },
  ],
  exercises: [
    ex(1, num("qclx-ex-1", "Process mean 20, SD 3, samples of 9. Find the lower control limit of the $\\bar x$ chart.", 17, "$20 - 3 \\times 3/3$."), ["$17$."]),
    ex(1, dp("qclx-ex-2", "Specification 90 to 110, SD 2, mean 100. Find $C_p$.", 20 / 12, "$20/12$."), ["$\\approx 1.667$."]),
    ex(2, dp("qclx-ex-3", "Same specification and SD, but mean 104. Find $C_{pk}$.", 6 / 6, "$\\min(6, 14)/6$."), ["$1$: the shift costs capability."]),
    ex(2, dp("qclx-ex-4", "Samples of 100 average 10% defective. Find the upper p-chart limit.", 0.1 + 3 * Math.sqrt(0.09 / 100), "$0.1 + 3\\sqrt{0.1 \\times 0.9/100}$."), ["$0.19$."]),
    ex(2, dp("qclx-ex-5", "Plan $n = 10$, $c = 0$. Find $P(\\text{accept})$ for a lot that is 10% defective.", 0.9 ** 10, "$0.9^{10}$."), ["$\\approx 0.349$."]),
    ex(3, num("qclx-ex-6", "A chart signals with probability 0.02 per sample after a shift. Find the average number of samples to detect it.", 50, "$1/0.02$."), ["$50$: Shewhart charts are slow for small shifts; use CUSUM."]),
    ex(3, mc("qclx-ex-7", "Eight consecutive points lie above the centre line, all within the control limits. This", ["signals a likely shift, by a standard run rule", "Probability about $0.5^8 \\approx 0.004$ for a stable process."], [["is fine, since no point is outside the limits", "Run rules catch sustained small shifts."], ["means the limits are wrong", "It suggests the process moved."]]), ["Investigate for a special cause."]),
    ex(3, mc("qclx-ex-8", "A gauge study finds measurement variation is 40% of total observed variation. Before improving the process you should", ["improve the measurement system", "Otherwise you can't see process changes clearly."], [["ignore it", "Measurement noise hides real signals."], ["tighten the control limits", "That would cause false alarms."]]), ["Gauge R&R below about 10% is usually considered good."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const mu = r.int(10, 100);
      const s = r.pick([1, 2, 3, 4, 6]);
      const nn = r.pick([4, 9, 16, 25]);
      const up = r.pick([true, false]);
      const v = mu + (up ? 1 : -1) * (3 * s) / Math.sqrt(nn);
      return n(`Process mean ${mu}, SD ${s}, samples of ${nn}. Find the ${up ? "upper" : "lower"} control limit of the $\\bar x$ chart (3 decimals).`, Math.round(v * 1000) / 1000, `$${mu} ${up ? "+" : "-"} 3 \\times ${s}/\\sqrt{${nn}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const lsl = r.int(5, 50) * 2;
      const width = r.pick([6, 8, 10, 12, 20]);
      const usl = lsl + width;
      const s = r.pick([0.5, 1, 1.5, 2]);
      const mid = (lsl + usl) / 2;
      const mu = lv === 1 ? mid : mid + r.pick([-2, -1, 1, 2]) * s * 0.5;
      const cp = width / (6 * s);
      const cpk = Math.min(usl - mu, mu - lsl) / (3 * s);
      const want = lv === 1 ? "C_p" : "C_{pk}";
      const v = lv === 1 ? cp : cpk;
      return n(`Specification ${lsl} to ${usl}, process mean ${r2(mu)}, SD ${s}. Find $${want}$ (3 decimals).`, Math.round(v * 1000) / 1000, lv === 1 ? `$${width}/(6 \\times ${s}) \\approx ${Math.round(v * 1000) / 1000}$.` : `$\\min(${r2(usl - mu)}, ${r2(mu - lsl)})/(3 \\times ${s}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([10, 20, 50]);
      const c = r.pick([0, 1, 2]);
      const p = r.pick([0.01, 0.02, 0.05, 0.1]);
      let v = 0;
      let term = (1 - p) ** nn;
      for (let k = 0; k <= c; k++) {
        v += term;
        term = (term * (nn - k) * p) / ((k + 1) * (1 - p));
      }
      return n(`Acceptance plan: inspect ${nn}, accept if at most ${c} defective. Find $P(\\text{accept})$ for a lot that is ${Math.round(p * 100)}% defective (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sum_{k=0}^{${c}}\\binom{${nn}}{k}${p}^k(${r2(1 - p)})^{${nn} - k} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const ctrl = r.pick(["49.1 to 50.9", "9.5 to 10.5", "199 to 201"]);
      return mcNumbers(
        `All points on a chart lie inside the control limits ${ctrl}. Does that mean the parts meet the customer's specification?`,
        { text: "Not necessarily: compare the process spread with the specification (capability)", why: "Control limits describe the process, not the requirement." },
        [{ text: "Yes, being in control means meeting the specification", why: "A stable process can still be incapable.", misconception: "control-limits-are-specs" }],
      );
    },
  },
];
