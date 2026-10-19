import { ex, mc, num, type Depth } from "../deepen";

/** Chapter 4 at exam depth: centre, spread by quartiles, shape, sampling design and bias. */

export const DESCRIBING_DEPTH: Record<string, Depth> = {
  // §4.1
  "mean-median-mode": {
    definitions: [
      {
        type: "definition",
        term: "mean, median, mode",
        body: "For data $x_1, \\dots, x_n$: the **mean** is $\\bar x = \\tfrac1n\\sum x_i$; the **median** is the middle value of the sorted data (the average of the two middle values when $n$ is even); the **mode** is the most frequent value, and there may be several. The **weighted mean** with weights $w_i$ is $\\sum w_ix_i / \\sum w_i$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "sums and transformations",
        statement: "(i) $\\sum x_i = n\\bar x$. (ii) $\\sum (x_i - \\bar x) = 0$. (iii) If every value is transformed to $y_i = ax_i + b$, then $\\bar y = a\\bar x + b$, and the median transforms the same way.",
        proof: [
          "(i) is the definition of $\\bar x$ multiplied by $n$. (ii) $\\sum(x_i - \\bar x) = n\\bar x - n\\bar x = 0$.",
          "(iii) $\\bar y = \\tfrac1n\\sum(ax_i + b) = a\\bar x + b$. For the median, $y = ax + b$ keeps (or, if $a < 0$, reverses) the order, so the middle value maps to the middle value.",
        ],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "combined mean",
        statement: "If group 1 has $n_1$ values with mean $\\bar x_1$ and group 2 has $n_2$ values with mean $\\bar x_2$, the combined mean is $\\dfrac{n_1\\bar x_1 + n_2\\bar x_2}{n_1 + n_2}$.",
        proof: ["The combined total is $n_1\\bar x_1 + n_2\\bar x_2$ by (i); divide by the combined count."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find the mean and median of $4, 8, 15, 16, 23$.",
        solution: ["Mean: $(4 + 8 + 15 + 16 + 23)/5 = 66/5 = 13.2$.", "Median: the data is sorted and $n = 5$, so the median is the third value, 15."],
        result: "Mean 13.2, median 15.",
      },
      {
        type: "example",
        level: 2,
        title: "working with the total",
        problem: "The mean of six numbers is 15. One number, 25, is removed. Find the mean of the rest.",
        solution: ["Total of six: $6 \\cdot 15 = 90$.", "Remove 25: the five remaining total 65, so their mean is $65/5 = 13$."],
        result: "13.",
      },
      {
        type: "example",
        level: 3,
        title: "an unknown count",
        problem: "The mean of $n$ numbers is 10. Adding the number 22 raises the mean to 12. Find $n$.",
        solution: ["Before: total $10n$. After: total $10n + 22$ over $n + 1$ numbers.", "$10n + 22 = 12(n + 1)$ gives $2n = 10$, so $n = 5$."],
        result: "$n = 5$.",
      },
    ],
    pitfalls: [
      { wrong: "The median of $8, 1, 6, 3$ is the average of 1 and 6.", right: "Sort first: $1, 3, 6, 8$. The median is $(3 + 6)/2 = 4.5$." },
      { wrong: "The mean of two groups is the average of the two means.", right: "Only if the groups are the same size. Otherwise weight each mean by its group's size." },
      { wrong: "Adding a constant to every value changes the spread.", right: "It shifts the mean and median by that constant and leaves the spread unchanged." },
    ],
    formulas: [
      { label: "Mean", tex: "\\bar x = \\tfrac1n\\sum x_i,\\quad \\sum x_i = n\\bar x" },
      { label: "Combined mean", tex: "\\dfrac{n_1\\bar x_1 + n_2\\bar x_2}{n_1 + n_2}" },
      { label: "Linear change", tex: "y = ax + b \\Rightarrow \\bar y = a\\bar x + b" },
    ],
    exercises: [
      ex(1, num("mmm-ex-1", "Find the median of $3, 9, 4, 7, 1, 8$.", 5.5, "Sort, then average the middle two."), ["Sorted: $1, 3, 4, 7, 8, 9$.", "The middle two are 4 and 7, so the median is 5.5."]),
      ex(1, num("mmm-ex-2", "Find the mode of $2, 5, 5, 6, 8, 8, 8, 9$.", 8, "Most frequent value."), ["8 appears three times, more than any other value."]),
      ex(1, num("mmm-ex-3", "Find the mean of $12, 15, 18, 21, 24$.", 18, "Total 90."), ["$90/5 = 18$ (the values are evenly spaced, so the mean is the middle one)."]),
      ex(2, num("mmm-ex-4", "The mean of five numbers is 12. When one is removed the mean of the other four is 10. Find the removed number.", 20, "Compare totals."), ["Totals: $5 \\cdot 12 = 60$ and $4 \\cdot 10 = 40$.", "The removed number is $60 - 40 = 20$."]),
      ex(2, num("mmm-ex-5", "Class A has 20 students with mean score 70; class B has 30 students with mean 80. Find the mean of all 50.", 76, "Weight by class size."), ["$\\dfrac{20 \\cdot 70 + 30 \\cdot 80}{50} = \\dfrac{1400 + 2400}{50} = 76$."]),
      ex(2, num("mmm-ex-6", "A data set has mean 5. Every value is multiplied by 3 and then increased by 2. Find the new mean.", 17, "$3\\bar x + 2$."), ["$\\bar y = 3 \\cdot 5 + 2 = 17$."]),
      ex(3, num("mmm-ex-7", "The mean of $a, b, c$ is 8 and the mean of $a, b, c, d, e$ is 10. Find the mean of $d$ and $e$.", 13, "Use totals."), ["$a + b + c = 24$ and $a + b + c + d + e = 50$.", "$d + e = 26$, so their mean is 13."]),
      ex(3, num("mmm-ex-8", "The mean of 25 test scores is 72. One score was recorded as 47 instead of 97. Find the corrected mean.", 74, "The total rises by 50."), ["Recorded total $25 \\cdot 72 = 1800$; corrected total $1800 + 50 = 1850$.", "Corrected mean $1850/25 = 74$."]),
      ex(3, mc("mmm-ex-9", "Every value in a data set is increased by 5. Which statistic stays the same?", ["The range", "Shifting every value moves the maximum and minimum together."], [["The mean", "It increases by 5."], ["The median", "It increases by 5."], ["The mode", "It increases by 5."]]), [
        "Mean, median and mode all shift by 5. The range, maximum minus minimum, is unchanged because both ends shift by 5.",
      ]),
    ],
  },

  // §4.2
  "quartiles-iqr": {
    definitions: [
      {
        type: "definition",
        term: "percentiles, five-number summary",
        body: "The $p$-th **percentile** is a value with about $p\\%$ of the data at or below it. The **five-number summary** is minimum, $Q_1$, median, $Q_3$, maximum. With the median-of-halves rule, $Q_1$ is the median of the lower half and $Q_3$ of the upper half (leaving out the median itself when $n$ is odd).",
      },
      {
        type: "definition",
        term: "interquartile range, outlier fences",
        body: "$\\text{IQR} = Q_3 - Q_1$, the spread of the middle half. The usual outlier rule flags values below $Q_1 - 1.5\\,\\text{IQR}$ or above $Q_3 + 1.5\\,\\text{IQR}$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        statement: "If every value is transformed to $ax + b$, the IQR becomes $|a|\\cdot\\text{IQR}$ and the range becomes $|a|\\cdot\\text{range}$. Adding a constant changes neither.",
        proof: ["Quartiles transform like the median, $Q \\mapsto aQ + b$ (with $Q_1$ and $Q_3$ swapping roles if $a < 0$). The difference $Q_3 - Q_1$ loses the $b$ and gains the factor $|a|$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find $Q_1$, the median and $Q_3$ of $1, 3, 5, 7, 9, 11, 13, 15$.",
        solution: ["$n = 8$: median $= (7 + 9)/2 = 8$.", "Lower half $1, 3, 5, 7$ gives $Q_1 = 4$; upper half $9, 11, 13, 15$ gives $Q_3 = 12$."],
        result: "$Q_1 = 4$, median 8, $Q_3 = 12$.",
      },
      {
        type: "example",
        level: 2,
        title: "outlier test",
        problem: "For $5, 7, 8, 10, 12, 13, 15, 40$, find the IQR and decide whether 40 is an outlier.",
        solution: [
          "$Q_1 = (7 + 8)/2 = 7.5$ and $Q_3 = (13 + 15)/2 = 14$, so $\\text{IQR} = 6.5$.",
          "Upper fence $14 + 1.5 \\cdot 6.5 = 23.75$. Since $40 > 23.75$, 40 is an outlier.",
        ],
        result: "$\\text{IQR} = 6.5$; 40 is an outlier.",
      },
      {
        type: "example",
        level: 3,
        title: "reading a summary",
        problem: "A five-number summary is $10, 20, 25, 35, 70$. Is the maximum an outlier, and is the distribution skewed?",
        solution: [
          "$\\text{IQR} = 15$, so the upper fence is $35 + 22.5 = 57.5$; the maximum 70 lies beyond it, so it is an outlier.",
          "The upper quartile is farther from the median ($35 - 25 = 10$) than the lower ($25 - 20 = 5$), and the upper whisker is long: right skew.",
        ],
        result: "Yes, 70 is an outlier; the data is right-skewed.",
      },
    ],
    pitfalls: [
      { wrong: "IQR = maximum − minimum.", right: "That is the range. IQR = $Q_3 - Q_1$, which ignores the extreme quarters." },
      { wrong: "The box holds all the non-outlying data.", right: "The box holds the middle half; each whisker covers another quarter." },
      { wrong: "Scaling data by 3 leaves the IQR unchanged.", right: "Adding a constant leaves it unchanged; scaling by 3 triples it." },
    ],
    formulas: [
      { label: "IQR", tex: "Q_3 - Q_1" },
      { label: "Outlier fences", tex: "Q_1 - 1.5\\,\\text{IQR},\\quad Q_3 + 1.5\\,\\text{IQR}" },
      { label: "Linear change", tex: "\\text{IQR}(ax + b) = |a|\\,\\text{IQR}(x)" },
    ],
    exercises: [
      ex(1, num("iqr2-ex-1", "Find $Q_1$ of $2, 4, 6, 8, 10, 12, 14$.", 4, "Median of $2, 4, 6$."), ["$n = 7$: median 8; lower half $2, 4, 6$, so $Q_1 = 4$."]),
      ex(1, num("iqr2-ex-2", "Find the IQR of $1, 3, 5, 7, 9, 11, 13, 15$.", 8, "$12 - 4$."), ["$Q_1 = 4$ and $Q_3 = 12$, so $\\text{IQR} = 8$."]),
      ex(2, num("iqr2-ex-3", "$Q_1 = 12$ and $Q_3 = 20$. Find the upper outlier fence.", 32, "$20 + 1.5 \\cdot 8$."), ["$\\text{IQR} = 8$; fence $20 + 12 = 32$."]),
      ex(2, mc("iqr2-ex-4", "$Q_1 = 12$ and $Q_3 = 20$. Is 40 an outlier?", ["Yes", "The upper fence is 32."], [["No", "Compare with $Q_3 + 1.5\\,\\text{IQR} = 32$."]]), ["The upper fence is $20 + 1.5 \\cdot 8 = 32$, and $40 > 32$."]),
      ex(2, num("iqr2-ex-5", "A data set has IQR 5. Every value is multiplied by 3 and then increased by 10. Find the new IQR.", 15, "$|a| \\cdot \\text{IQR}$."), ["Adding 10 has no effect; multiplying by 3 triples the IQR: 15."]),
      ex(3, num("iqr2-ex-6", "In a class of 40, a student scores higher than exactly 30 classmates. What is the student's percentile rank (as a percentage)?", 75, "$30/40$."), ["30 of 40 scores are below: $30/40 = 75\\%$."]),
      ex(3, num("iqr2-ex-7", "A five-number summary is $10, 20, 25, 35, 70$. Find the upper outlier fence.", 57.5, "$35 + 1.5 \\cdot 15$."), ["$\\text{IQR} = 35 - 20 = 15$; fence $35 + 22.5 = 57.5$."]),
      ex(3, num("iqr2-ex-8", "Find the IQR of $5, 7, 8, 10, 12, 13, 15, 40$.", 6.5, "$Q_1 = 7.5$, $Q_3 = 14$."), ["Lower half $5, 7, 8, 10$: $Q_1 = 7.5$. Upper half $12, 13, 15, 40$: $Q_3 = 14$.", "$\\text{IQR} = 6.5$; the outlier 40 does not change it much."]),
    ],
  },

  // §4.3
  "skew-shape": {
    definitions: [
      {
        type: "definition",
        term: "shape",
        body: "A distribution is **symmetric** if its histogram looks the same reflected about the centre, **right-skewed** (positively skewed) if it has a long tail to the right, and **left-skewed** (negatively skewed) if the long tail is on the left. It is **unimodal** with one peak, **bimodal** with two.",
      },
      {
        type: "definition",
        term: "choosing a display",
        body: "One numerical variable: histogram, dot plot or box plot. One categorical variable: bar chart (a pie chart only for a few parts of one whole). Two numerical variables: scatterplot. A variable over time: line chart. Comparing groups: side-by-side box plots.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Rule",
        name: "mean versus median",
        statement: "For a unimodal distribution, the mean is usually pulled towards the long tail: mean > median for right skew and mean < median for left skew. For a symmetric distribution they are equal.",
        proof: ["The mean uses each value's size, so a few far-out values in the tail move it; the median depends only on the order. This is a strong tendency, not a law: unusual distributions can break it."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Most people's commute is 15–30 minutes, but a few take over 2 hours. Describe the shape and compare mean and median.",
        solution: ["The long tail is on the right: right-skewed.", "The few long commutes pull the mean above the median."],
        result: "Right-skewed; mean > median.",
      },
      {
        type: "example",
        level: 2,
        problem: "A summary gives mean 48 and median 55 for exam scores. What does this suggest about the shape?",
        solution: ["The mean is below the median, so something is pulling it down.", "A tail of low scores: left skew."],
        result: "Left-skewed.",
      },
      {
        type: "example",
        level: 3,
        title: "a transformation",
        problem: "Incomes are strongly right-skewed. What does taking $\\log_{10}$ of each income do to the shape, and why?",
        solution: [
          "$\\log_{10}$ turns ratios into differences: 10,000 becomes 4, 100,000 becomes 5 and 1,000,000 becomes 6.",
          "The huge values in the right tail are pulled in far more than the small ones, so the distribution becomes much more symmetric.",
        ],
        result: "It pulls in the right tail, making the data roughly symmetric.",
      },
    ],
    pitfalls: [
      { wrong: "Right skew means most of the data is on the right.", right: "Most of the data is on the left; the long tail points right." },
      { wrong: "A histogram and a bar chart are the same thing.", right: "A histogram bins a numerical variable (bars touch, order matters); a bar chart counts categories." },
    ],
    formulas: [
      { label: "Right skew", tex: "\\text{mean} > \\text{median}" },
      { label: "Left skew", tex: "\\text{mean} < \\text{median}" },
    ],
    exercises: [
      ex(1, mc("skew2-ex-1", "House prices in a city: mean 650k, median 480k. The distribution is most likely", ["right-skewed", "Expensive homes stretch the right tail and lift the mean."], [["left-skewed", "That would put the mean below the median."], ["symmetric", "The mean and median differ a lot."]]), ["The mean far above the median signals a long right tail."]),
      ex(1, mc("skew2-ex-2", "Best display for the number of students choosing each of six subjects?", ["A bar chart", "Counts of a categorical variable."], [["A histogram", "Histograms are for numerical variables."], ["A scatterplot", "That needs two numerical variables."]]), ["Subjects are categories, so use a bar chart."]),
      ex(2, mc("skew2-ex-3", "Ages at retirement cluster around 62–67, with some people retiring in their 40s. The shape is", ["left-skewed", "The tail of early retirements points left."], [["right-skewed", "The long tail is on the low side."], ["symmetric", "One tail is much longer."]]), ["The long tail of early retirements is on the left: left skew, with mean below median."]),
      ex(2, mc("skew2-ex-4", "Best display for comparing exam-score distributions across four classes?", ["Side-by-side box plots", "They compare centre, spread and outliers at a glance."], [["A pie chart", "Pie charts show parts of one whole."], ["A line chart", "There is no time axis."]]), ["Box plots placed side by side make comparisons of quartiles and outliers direct."]),
      ex(2, mc("skew2-ex-5", "A distribution has mean 30 and median 30, and its histogram has two clear peaks. It is", ["symmetric and bimodal", "Equal mean and median fit symmetry; two peaks make it bimodal."], [["right-skewed", "The mean equals the median."], ["unimodal", "It has two peaks."]]), ["Two peaks: bimodal. Mean equal to median is consistent with symmetry."]),
      ex(3, mc("skew2-ex-6", "Which change makes a right-skewed data set more symmetric?", ["Taking logarithms of the values", "It compresses large values more than small ones."], [["Squaring the values", "That stretches the right tail further."], ["Adding 100 to every value", "Shifting does not change the shape."]]), [
        "Logarithms pull large values in proportionally more, shortening the right tail. Squaring lengthens it; shifting changes nothing about shape.",
      ]),
      ex(3, mc("skew2-ex-7", "For a right-skewed distribution, which is the better summary of a typical value?", ["The median", "It is not pulled by the long tail."], [["The mean", "The tail pulls it away from most of the data."], ["The maximum", "That is the most extreme value."]]), ["The median resists the long tail, so it better describes a typical value."]),
    ],
  },

  // §4.4
  "sampling-methods": {
    definitions: [
      {
        type: "definition",
        term: "population, sample, frame",
        body: "The **population** is everyone of interest; the **sample** is who is measured; the **sampling frame** is the list the sample is drawn from. A **parameter** describes the population (e.g. $\\mu$, $p$); a **statistic** describes a sample (e.g. $\\bar x$, $\\hat p$).",
      },
      {
        type: "definition",
        term: "designs",
        body: "**Simple random sample (SRS)** of size $n$: every set of $n$ individuals is equally likely. **Systematic:** every $k$-th individual from a list after a random start. **Stratified:** split into groups (strata) and take an SRS from each. **Cluster:** randomly choose whole groups and measure everyone in them. **Convenience:** whoever is easy to reach (not random).",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        statement: "In a simple random sample of size $n$ from a population of size $N$, each individual is included with probability $n/N$.",
        proof: [
          "There are $\\binom{N}{n}$ equally likely samples. Those containing a given individual choose the other $n - 1$ members from the remaining $N - 1$: $\\binom{N - 1}{n - 1}$ of them.",
          "$\\binom{N-1}{n-1} \\Big/ \\binom{N}{n} = \\dfrac{(N-1)!\\,n!\\,(N-n)!}{(n-1)!\\,(N-n)!\\,N!} = \\dfrac{n}{N}$.",
        ],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "proportional allocation",
        statement: "In a stratified sample of total size $n$ with proportional allocation, a stratum of size $N_h$ out of $N$ receives $n_h = n \\cdot N_h / N$.",
        proof: ["Each stratum's share of the sample equals its share of the population, so every individual still has inclusion probability $n/N$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A school randomly picks 10 students from each of its 6 year groups. Name the method.",
        solution: ["The year groups are strata, and an SRS is taken within each.", "Every group is represented."],
        result: "Stratified sampling.",
      },
      {
        type: "example",
        level: 2,
        title: "allocation",
        problem: "A firm has 600 engineers, 300 sales staff and 100 managers. Allocate a stratified sample of 50 proportionally.",
        solution: ["$N = 1000$. Engineers $50 \\cdot 600/1000 = 30$; sales $50 \\cdot 300/1000 = 15$; managers $50 \\cdot 100/1000 = 5$.", "Check: $30 + 15 + 5 = 50$."],
        result: "30, 15 and 5.",
      },
      {
        type: "example",
        level: 3,
        title: "systematic sampling",
        problem: "From a list of 1000 customers a systematic sample of 50 is taken with a random start at customer 7. Which customer is the 10th selected, and what is the risk of this design?",
        solution: [
          "Step $k = 1000/50 = 20$. The selected customers are $7, 27, 47, \\dots$; the 10th is $7 + 9 \\cdot 20 = 187$.",
          "Risk: if the list has a pattern repeating every 20 entries (for example, ordered by store and register), the sample can line up with it and become unrepresentative.",
        ],
        result: "Customer 187; periodic patterns in the list can bias it.",
      },
    ],
    pitfalls: [
      { wrong: "Stratified and cluster sampling are the same.", right: "Stratified takes some from every group; cluster takes all from a few randomly chosen groups." },
      { wrong: "A convenience sample is random because no one was hand-picked.", right: "Random means chance decides, with a known probability for everyone. Many people had no chance at all." },
    ],
    formulas: [
      { label: "Inclusion probability (SRS)", tex: "n / N" },
      { label: "Proportional allocation", tex: "n_h = n\\,N_h / N" },
      { label: "Systematic step", tex: "k = N / n" },
    ],
    exercises: [
      ex(1, mc("smp-ex-1", "A city randomly chooses 8 blocks and surveys every household on them. Which method?", ["Cluster", "Whole groups are chosen at random."], [["Stratified", "That would take some from every block."], ["Systematic", "No every-$k$-th rule."]]), ["Blocks are clusters chosen at random; everyone in them is surveyed."]),
      ex(1, mc("smp-ex-2", "A reporter interviews the first 50 shoppers leaving a mall. Which method?", ["Convenience", "Whoever happens to be there."], [["Simple random", "Most people had no chance of selection."], ["Cluster", "No groups were chosen at random."]]), ["The shoppers were simply the easiest to reach."]),
      ex(2, num("smp-ex-3", "A population has strata of 600, 300 and 100. In a proportional stratified sample of 50, how many come from the first stratum?", 30, "$50 \\cdot 600/1000$."), ["$50 \\cdot 600/1000 = 30$."]),
      ex(2, num("smp-ex-4", "An SRS of 50 is drawn from 1000 people. What is the probability that a particular person is included?", 0.05, "$n/N$."), ["$50/1000 = 0.05$."]),
      ex(3, num("smp-ex-5", "How many different simple random samples of size 2 can be drawn from 5 people?", 10, "$\\binom52$."), ["$\\binom52 = \\dfrac{5 \\cdot 4}{2} = 10$."]),
      ex(3, num("smp-ex-6", "A systematic sample of 50 from a list of 1000 starts at entry 7. Which entry is the 10th selected?", 187, "Step 20."), ["Step $1000/50 = 20$; the 10th entry is $7 + 9 \\cdot 20 = 187$."]),
      ex(3, mc("smp-ex-7", "A survey must give reliable estimates for each of four small regions as well as overall. The best design is", ["stratified by region", "Guarantees enough people from every region."], [["one simple random sample", "Small regions may be barely represented."], ["cluster sampling of a few regions", "Some regions would not be sampled at all."]]), [
        "Stratifying by region guarantees each region a sample large enough for its own estimate.",
      ]),
    ],
  },

  // §4.5
  "sampling-bias": {
    definitions: [
      {
        type: "definition",
        term: "bias, random error",
        body: "A statistic is **biased** if, over repeated sampling, it centres on the wrong value: its average differs from the parameter. **Random error** is the scatter of the statistic around its own average. Bigger samples shrink random error; they do not remove bias.",
      },
      {
        type: "definition",
        term: "kinds of bias",
        body: "**Selection bias:** the sampling frame or method misses part of the population. **Nonresponse:** selected people do not answer, and they differ from those who do. **Voluntary response:** only the motivated respond. **Survivorship:** only cases that passed a filter are seen. **Response bias:** leading questions or untruthful answers.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        statement: "If a sampling method systematically over-represents a group, so that the expected value of the sample mean is $\\mu + b$ with $b \\neq 0$, then increasing $n$ does not reduce $b$; only the spread around $\\mu + b$ shrinks.",
        proof: ["Each observation from the method has mean $\\mu + b$, so the mean of $n$ of them also has mean $\\mu + b$, for every $n$. Its standard deviation, $\\sigma/\\sqrt n$, does shrink."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A website poll asks readers whether a law is good. Name the main bias.",
        solution: ["Only readers who choose to respond are counted.", "People with strong opinions are much more likely to bother."],
        result: "Voluntary response bias.",
      },
      {
        type: "example",
        level: 2,
        problem: "A gym estimates member satisfaction by surveying people who renewed this year. What is wrong?",
        solution: ["Unhappy members tend not to renew, so they are missing from the sample.", "The sample consists of 'survivors' of a filter related to the answer."],
        result: "Survivorship bias: satisfaction is overestimated.",
      },
      {
        type: "example",
        level: 3,
        title: "bias against size",
        problem: "Method A: a random sample of 1,000. Method B: an online poll of 100,000 with an estimated bias of +8 percentage points. Which is closer to the truth, given that A's random error is about ±3 points?",
        solution: [
          "A is centred on the truth with error about ±3 points.",
          "B's random error is tiny, about ±0.3 points, but it is centred 8 points off.",
          "A's typical error (3) is well under B's (8): the smaller unbiased sample wins.",
        ],
        result: "Method A.",
      },
    ],
    pitfalls: [
      { wrong: "A biased sample becomes accurate if it is large enough.", right: "Size shrinks random error only. A huge biased sample is precisely wrong." },
      { wrong: "Nonresponse is harmless if the response rate is high.", right: "It matters if nonresponders differ on the question; even 10% missing can bias an estimate if they are very different." },
    ],
    formulas: [{ label: "Error of an estimate", tex: "\\text{bias} + \\text{random error}" }],
    exercises: [
      ex(1, mc("bias2-ex-1", "A survey about overtime is emailed to staff; the busiest staff are least likely to answer. Main bias?", ["Nonresponse", "Those who do not reply differ on the question."], [["Survivorship", "No filter by outcome."], ["Response", "The wording is not the issue."]]), ["Nonresponders (the busiest) differ systematically from responders."]),
      ex(1, mc("bias2-ex-2", "A street poll about public transport is run only in the wealthiest district. Main bias?", ["Selection", "The method misses most of the population."], [["Voluntary response", "People did not choose to take part."], ["None, if the sample is large", "Size does not fix who is missing."]]), ["The frame covers only one district, so selection bias."]),
      ex(2, mc("bias2-ex-3", "\"Don't you agree the new park is a waste of money?\" is an example of", ["response bias (a leading question)", "The wording pushes towards one answer."], [["selection bias", "Who is asked is not the issue."], ["survivorship bias", "No filter by outcome."]]), ["The question's wording invites agreement: response bias."]),
      ex(2, mc("bias2-ex-4", "A biased poll's sample size is doubled, collected the same way. Its bias", ["stays about the same", "Bias comes from how the sample is chosen."], [["halves", "Doubling shrinks random error, not bias."], ["disappears", "The same kind of people respond."]]), ["Doubling $n$ shrinks the random error by about $\\sqrt2$ but leaves the bias unchanged."]),
      ex(3, mc("bias2-ex-5", "Studying only successful start-ups, a writer finds they all took big risks and concludes risk causes success. The flaw is", ["survivorship bias", "Risky start-ups that failed are not in the data."], [["nonresponse bias", "No one refused to answer."], ["response bias", "No question wording is involved."]]), ["Without the failures you cannot tell whether risk-taking helps or hurts."]),
      ex(3, num("bias2-ex-6", "A method's estimates centre 8 points above the truth. With $n = 100{,}000$ its random error is about 0.3 points. Roughly how far off is a typical estimate, in points?", 8, "Bias dominates."), ["Typical error is dominated by the bias: about 8 points, whatever the sample size."]),
    ],
  },
};
