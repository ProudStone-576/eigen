import type { ConceptNode, Unit } from "@/lib/content/types";
import { deepen } from "../deepen";
import { DESCRIBING_DEPTH } from "./describing.depth";

const centre: ConceptNode = {
  id: "mean-median-mode",
  title: "Mean, median & mode",
  summary: "The mean balances every value's size; the median is the middle of the sorted data, so one extreme value drags the mean but barely moves the median.",
  deps: [],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "mean", meaning: "Add the values up and divide by how many there are." },
    { term: "median", meaning: "The middle value once the data is sorted (the average of the two middle values if there's an even number)." },
    { term: "mode", meaning: "The value that appears most often." },
    { term: "outlier", meaning: "A value far away from the rest of the data." },
  ],
  misconceptions: {
    "mean-resists-outliers": "Expects the mean to stay put when one value becomes extreme.",
    "median-unsorted": "Takes the middle of the list as written, without sorting it first.",
  },
  steps: [
    {
      type: "motivate",
      title: "What's a typical salary?",
      body: "Five people work at a startup. The founder pays herself a fortune. Ask \"what does a typical person here earn?\" and two honest averages give wildly different answers.",
      realWorld: {
        title: "News reports",
        body: "Government statistics quote *median* household income, not mean. A handful of billionaires would drag the mean far above what most households earn.",
      },
    },
    {
      type: "explore",
      title: "Drag the data",
      body: "Green dashed line: the mean. The thick line inside the box: the median.",
      widget: { kind: "summary1d", values: [3, 4, 4, 5, 6, 7, 8], max: 30 },
      task: "Drag the rightmost dot all the way to 30. Which line chases it, and which one barely moves?",
    },
    {
      type: "truth",
      statement: "The **mean** is the sum divided by the count. The **median** is the middle of the *sorted* data. The **mode** is the most common value.",
      body: "The mean uses every value's size, so a single extreme value pulls it. The median only cares about order, so it's *robust* to outliers. With an even count, the median is the average of the two middle values.",
    },
    {
      type: "predict",
      misconception: "mean-resists-outliers",
      item: {
        kind: "mc",
        id: "mmm-predict-1",
        prompt: "Salaries (thousands): 40, 45, 50, 55, 60. The founder's 60 becomes 1,000. What happens to the mean and median?",
        options: [
          { id: "a", text: "The mean jumps a lot; the median stays 50", correct: true, why: "The mean goes from 50 to 238; the middle value is still 50." },
          { id: "b", text: "Both stay about the same: it's only one person", misconception: "mean-resists-outliers", why: "One huge value adds a lot to the sum." },
          { id: "c", text: "The median jumps; the mean stays", why: "It's the other way round." },
        ],
      },
      reveal: {
        body: "Mean: (40 + 45 + 50 + 55 + 1000) / 5 = 238. Median: still 50, the middle of the sorted list. One person moved the mean almost five-fold.",
        widget: { kind: "summary1d", values: [40, 45, 50, 55, 1000], max: 1000 },
      },
      resolve: {
        kind: "mc",
        id: "mmm-resolve-1",
        prompt: "Why did the mean move but not the median?",
        options: [
          { id: "a", text: "The mean uses every value's size; the median only uses the order", correct: true, why: "1,000 is still just \"the biggest\" to the median." },
          { id: "b", text: "Something is off: averages can't jump like that", misconception: "mean-resists-outliers", why: "They can: the sum grew by 940." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mmm-check-1",
        prompt: "Find the median of 7, 2, 9, 4, 5.",
        options: [
          { id: "a", text: "5", correct: true, why: "Sorted: 2, 4, 5, 7, 9. The middle is 5." },
          { id: "b", text: "9", misconception: "median-unsorted", why: "9 is in the middle of the list as written. Sort first." },
          { id: "c", text: "5.4", why: "That's the mean: 27 / 5." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mmm-check-2",
        prompt: "Find the median of 8, 1, 6, 3.",
        options: [
          { id: "a", text: "4.5", correct: true, why: "Sorted: 1, 3, 6, 8. Average the middle two: (3 + 6) / 2." },
          { id: "b", text: "3.5", misconception: "median-unsorted", why: "1 and 6 are the middle of the unsorted list. Sort first." },
          { id: "c", text: "3", why: "With an even count, average the two middle values." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "When a feature is skewed (incomes, prices, session lengths), fill its missing values with the **median**, not the mean, so a few extreme rows don't set the default for everyone. Median absolute error is likewise a loss that outliers can't dominate.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mmm-produce-1", prompt: "Mean of 4, 8, 15, 16, 23, 42?", answer: 18, explain: "108 / 6 = 18." },
        { kind: "number", id: "mmm-produce-2", prompt: "Median of 4, 8, 15, 16, 23, 42?", answer: 15.5, explain: "The middle two are 15 and 16: (15 + 16) / 2." },
        { kind: "number", id: "mmm-produce-3", prompt: "Mode of 3, 7, 7, 2, 9, 7, 2?", answer: 7, explain: "7 appears three times." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "mmm-review-1", prompt: "Median of 12, 3, 7, 21, 9?", answer: 9, explain: "Sorted: 3, 7, 9, 12, 21." },
    {
      kind: "mc",
      id: "mmm-review-2",
      prompt: "Which better describes a typical house price in a city with a few mansions?",
      options: [
        { id: "a", text: "The median", correct: true, why: "The mansions drag the mean up; the median ignores how extreme they are." },
        { id: "b", text: "The mean", misconception: "mean-resists-outliers", why: "A few mansions pull the mean well above most homes." },
      ],
    },
  ],
};

const quartiles: ConceptNode = {
  id: "quartiles-iqr",
  title: "Quartiles, IQR & box plots",
  summary: "Quartiles cut sorted data into four equal parts; the IQR (Q3 − Q1) is the spread of the middle half, and points beyond 1.5 × IQR from the box are flagged as outliers.",
  deps: ["mean-median-mode"],
  pos: { x: 1, y: 1 },
  glossary: [
    { term: "quartiles", meaning: "Q1 is the median of the lower half of the sorted data, Q3 the median of the upper half." },
    { term: "IQR", meaning: "Interquartile range, Q3 − Q1: how spread out the middle 50% is." },
    { term: "box plot", meaning: "A box from Q1 to Q3 with a line at the median, and whiskers out to the furthest non-outliers." },
  ],
  misconceptions: {
    "iqr-is-range": "Uses the range (max − min) where the IQR (Q3 − Q1) is asked for.",
    "box-is-all-data": "Thinks the box in a box plot holds all the data, rather than the middle half.",
  },
  steps: [
    {
      type: "motivate",
      title: "Spread that ignores the weirdos",
      body: "The range (max − min) is the simplest measure of spread, but a single broken sensor reading can blow it up. We want a spread that describes most of the data.",
      realWorld: {
        title: "Growth charts",
        body: "Paediatricians plot a child's height against percentiles. \"Between the 25th and 75th percentile\" is the middle half: exactly the box of a box plot.",
      },
    },
    {
      type: "explore",
      title: "Find the outlier fence",
      body: "The box runs from Q1 to Q3. Red dots are outliers: more than 1.5 × IQR beyond the box.",
      widget: { kind: "summary1d", values: [2, 4, 5, 6, 7, 8, 30], max: 40 },
      task: "Drag the red dot left until it turns blue. Where is the fence? Then check: Q3 + 1.5 × IQR.",
    },
    {
      type: "truth",
      statement: "Sort the data. **Q1** is the median of the lower half, **Q3** the median of the upper half, and the **IQR** = Q3 − Q1 covers the middle 50%.",
      body: "A common outlier rule flags anything below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR. (With an odd count, leave the median out of both halves. Software sometimes interpolates instead, giving slightly different quartiles.)",
    },
    {
      type: "predict",
      misconception: "box-is-all-data",
      item: {
        kind: "mc",
        id: "iqr-predict-1",
        prompt: "In a box plot, roughly what fraction of the data lies inside the box?",
        options: [
          { id: "a", text: "About half", correct: true, why: "Q1 to Q3: the middle 50%." },
          { id: "b", text: "All of it, apart from outliers", misconception: "box-is-all-data", why: "The whiskers hold the rest." },
          { id: "c", text: "About a quarter", why: "A quarter lies between Q1 and the median, another quarter between the median and Q3." },
        ],
      },
      reveal: {
        body: "Count the dots: of these 9 values, the box from Q1 = 3.5 to Q3 = 11 holds 4, 6, 7, 8 and 10. That's 5 of 9, about half. The whiskers reach out to the other values.",
        widget: { kind: "summary1d", values: [1, 3, 4, 6, 7, 8, 10, 12, 20], max: 25 },
      },
      resolve: {
        kind: "mc",
        id: "iqr-resolve-1",
        prompt: "So what are the whiskers for?",
        options: [
          { id: "a", text: "They show where the rest of the (non-outlier) data reaches", correct: true, why: "The lowest and highest quarters live out there." },
          { id: "b", text: "Nothing much: the box already holds the data", misconception: "box-is-all-data", why: "The box is only the middle half." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "iqr-check-1",
        prompt: "Data: 2, 4, 5, 6, 7, 8, 30. Q1 = 4 and Q3 = 8. What is the IQR?",
        options: [
          { id: "a", text: "4", correct: true, why: "Q3 − Q1 = 8 − 4." },
          { id: "b", text: "28", misconception: "iqr-is-range", why: "That's the range, 30 − 2." },
          { id: "c", text: "6", why: "That's the median." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "iqr-check-2",
        prompt: "Test scores run from 35 to 98, with Q1 = 60 and Q3 = 82. How spread out is the middle half?",
        options: [
          { id: "a", text: "22 points", correct: true, why: "IQR = 82 − 60." },
          { id: "b", text: "63 points", misconception: "iqr-is-range", why: "That's max − min, the whole range." },
          { id: "c", text: "71 points", why: "That's (Q1 + Q3) / 2: a centre, not a spread." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Robust scaling (scikit-learn's RobustScaler) subtracts the median and divides by the IQR, so a few extreme rows don't squash every other value into a tiny range. The 1.5 × IQR rule is a quick first pass for flagging bad sensor readings before training.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "iqr-produce-1", prompt: "Data 1, 3, 4, 6, 7, 8, 10, 12, 20 has Q1 = 3.5 and Q3 = 11. What is the IQR?", answer: 7.5, explain: "11 − 3.5." },
        { kind: "number", id: "iqr-produce-2", prompt: "Q1 = 20 and Q3 = 30. Where is the upper outlier fence, Q3 + 1.5 × IQR?", answer: 45, explain: "IQR = 10, so 30 + 15." },
        {
          kind: "mc",
          id: "iqr-produce-3",
          prompt: "Q1 = 10 and Q3 = 14. Is a value of 25 an outlier by the 1.5 × IQR rule?",
          options: [
            { id: "a", text: "Yes", correct: true, why: "The fence is 14 + 1.5 × 4 = 20, and 25 is beyond it." },
            { id: "b", text: "No", why: "The fence is 20." },
          ],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "iqr-review-1", prompt: "Find Q1 of 2, 4, 6, 8, 10, 12 (the median of the lower half).", answer: 4, explain: "Lower half: 2, 4, 6. Its median is 4." },
    { kind: "number", id: "iqr-review-2", prompt: "Q1 = 5 and Q3 = 9. Where is the lower outlier fence, Q1 − 1.5 × IQR?", answer: -1, explain: "5 − 1.5 × 4 = −1." },
  ],
};

const shape: ConceptNode = {
  id: "skew-shape",
  title: "Shape, skew & choosing a chart",
  summary: "Skew is named after the long tail: right skew pulls the mean above the median. Pick the chart from the data: histograms for one number, bars for categories, scatterplots for two numbers.",
  deps: ["quartiles-iqr"],
  pos: { x: 2, y: 1 },
  glossary: [
    { term: "skew", meaning: "Lopsidedness. Right (positive) skew has a long tail to the right; left (negative) skew a long tail to the left." },
    { term: "histogram", meaning: "Bars showing how many values fall in each range of a numeric variable." },
  ],
  misconceptions: {
    "skew-direction": "Names the skew after where most of the data sits, instead of where the long tail points.",
    "pie-for-distribution": "Reaches for a pie or bar-per-value chart to show how a numeric variable is distributed.",
  },
  steps: [
    {
      type: "motivate",
      title: "Lopsided data is everywhere",
      body: "Most YouTube videos get a few hundred views; a handful get billions. Most people's commute is 20–40 minutes; a few take two hours. Real data is rarely a neat, symmetric bell.",
      realWorld: {
        title: "Insurance",
        body: "Most claims are small, a few are catastrophic. Insurers price the long right tail, because that's where the money goes.",
      },
    },
    {
      type: "explore",
      title: "Stretch the tail",
      body: "This data is bunched on the left with a few large values.",
      widget: { kind: "summary1d", values: [1, 1, 2, 2, 2, 3, 3, 4, 5, 8, 14], max: 15 },
      task: "Drag the biggest value further right. Watch the mean pull further ahead of the median. Then drag it back into the bunch.",
    },
    {
      type: "truth",
      statement: "Skew is named after the **tail**. **Right-skewed** (positive): long tail to the right, mean > median. **Left-skewed** (negative): long tail to the left, mean < median.",
      body: "Choose the chart from the question: a **histogram** or box plot for the distribution of one numeric variable, a **bar chart** for counts in categories, a **scatterplot** for two numeric variables, a **line chart** for change over time, side-by-side box plots to compare groups. Pie charts only suit a few parts of one whole.",
    },
    {
      type: "predict",
      misconception: "skew-direction",
      item: {
        kind: "mc",
        id: "skew-predict-1",
        prompt: "Most people earn modest incomes; a few earn enormous ones. The income distribution is…",
        options: [
          { id: "a", text: "Right-skewed (positive)", correct: true, why: "The long tail of huge incomes points right." },
          { id: "b", text: "Left-skewed: most of the data is on the left", misconception: "skew-direction", why: "The bulk is on the left, but skew is named after the tail." },
          { id: "c", text: "Symmetric", why: "The rich tail makes it lopsided." },
        ],
      },
      reveal: {
        body: "The bulk sits at the left, but the long tail stretches right and drags the mean (green) past the median. Skew is named for the tail, like a comet: it points where the tail goes.",
        widget: { kind: "summary1d", values: [1, 1, 2, 2, 2, 3, 3, 4, 5, 8, 14], max: 15 },
      },
      resolve: {
        kind: "mc",
        id: "skew-resolve-1",
        prompt: "Which way does a skewed distribution's name point?",
        options: [
          { id: "a", text: "Towards the long tail", correct: true, why: "Right skew: tail on the right." },
          { id: "b", text: "Towards the bulk of the data", misconception: "skew-direction", why: "That's backwards." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "skew-check-1",
        prompt: "On an easy exam, most students score 85–100 and a few score around 40. The scores are…",
        options: [
          { id: "a", text: "Left-skewed", correct: true, why: "The tail of low scores points left." },
          { id: "b", text: "Right-skewed: the bulk is on the right", misconception: "skew-direction", why: "Name it after the tail, which points left." },
          { id: "c", text: "Symmetric", why: "The few low scores make a long left tail." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "skew-check-2",
        prompt: "You want to show the distribution of 500 delivery times (in minutes). Which chart?",
        options: [
          { id: "a", text: "A histogram", correct: true, why: "One numeric variable: bin it and count." },
          { id: "b", text: "A pie chart", misconception: "pie-for-distribution", why: "Pies show shares of a few categories. Delivery times are numbers." },
          { id: "c", text: "A line chart", why: "Line charts show change over time." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "skew-check-3",
        prompt: "Exam scores (0–100) for 300 students. Which chart shows the shape of the scores?",
        options: [
          { id: "a", text: "A histogram", correct: true, why: "It shows where the scores bunch and where the tails go." },
          { id: "b", text: "A pie chart of the scores", misconception: "pie-for-distribution", why: "300 slices, or arbitrary groups, hide the shape." },
          { id: "c", text: "A scatterplot", why: "A scatterplot needs two numeric variables." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Look at every feature's histogram before training. Strong right skew (incomes, counts, prices) is often fixed with a log transform, which pulls in the long tail so linear models and gradient descent aren't dominated by a few huge values.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "skew-produce-1",
          prompt: "A dataset has mean 72 and median 60. Its skew is most likely…",
          options: [
            { id: "a", text: "Right (positive)", correct: true, why: "A long right tail pulls the mean above the median." },
            { id: "b", text: "Left (negative)", misconception: "skew-direction", why: "Left skew pulls the mean below the median." },
            { id: "c", text: "None", why: "Mean and median differ by a lot." },
          ],
        },
        {
          kind: "mc",
          id: "skew-produce-2",
          prompt: "Best chart for the relationship between hours studied and exam score?",
          options: [
            { id: "a", text: "A scatterplot", correct: true, why: "Two numeric variables: one dot per student." },
            { id: "b", text: "A pie chart", misconception: "pie-for-distribution", why: "Pies show parts of one whole." },
            { id: "c", text: "A histogram of scores", why: "That shows one variable, not the relationship." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "skew-review-1",
      prompt: "The mean house price is 650k and the median is 480k. The distribution is…",
      options: [
        { id: "a", text: "Right-skewed", correct: true, why: "Expensive homes stretch the right tail and lift the mean." },
        { id: "b", text: "Left-skewed", misconception: "skew-direction", why: "Left skew would put the mean below the median." },
      ],
    },
  ],
};

const sampling: ConceptNode = {
  id: "sampling-methods",
  title: "Sampling methods",
  summary: "A sample is random when chance, not convenience, decides who's in it. Stratified samples take some from every group; cluster samples take whole groups.",
  deps: [],
  pos: { x: 0, y: 2.6 },
  glossary: [
    { term: "population", meaning: "Everyone (or everything) you want to know about." },
    { term: "sample", meaning: "The part of the population you actually measure." },
    { term: "strata", meaning: "Groups you split the population into before sampling from each one." },
  ],
  misconceptions: {
    "convenience-is-random": "Thinks picking whoever is handy counts as random, as long as nobody hand-picked them.",
    "stratified-vs-cluster": "Mixes up stratified sampling (some from every group) with cluster sampling (everyone in a few groups).",
  },
  steps: [
    {
      type: "motivate",
      title: "You can't ask everyone",
      body: "A country has 40 million voters. A poll asks about 1,000. That can work astonishingly well, but only if the 1,000 are chosen the right way.",
      realWorld: {
        title: "Quality control",
        body: "A factory can't crash-test every car. It tests a sample, and how it picks that sample decides whether the results mean anything.",
      },
    },
    {
      type: "truth",
      statement: "In a **simple random sample**, every group of n individuals is equally likely to be chosen. Other designs: **systematic** (every kth from a list), **stratified** (split into groups, sample randomly from *each*), **cluster** (randomly pick *whole groups*, measure everyone in them).",
      body: "A **convenience sample** takes whoever is easy to reach. It isn't random, even if nobody hand-picked the people, because many members of the population had no chance of being included.",
    },
    {
      type: "predict",
      misconception: "convenience-is-random",
      item: {
        kind: "mc",
        id: "samp-predict-1",
        prompt: "A researcher surveys the first 100 people leaving a gym about how often the town exercises. Is that a random sample of the town?",
        options: [
          { id: "a", text: "No: it's a convenience sample, and gym-goers exercise more", correct: true, why: "People who never go to the gym had no chance of being asked." },
          { id: "b", text: "Yes: she didn't choose who walked out", misconception: "convenience-is-random", why: "Not hand-picking isn't the same as random." },
          { id: "c", text: "Yes, because 100 people is plenty", why: "Size doesn't fix how people were picked." },
        ],
      },
      reveal: {
        body: "Random means every person in the town had a known chance of being picked. Everyone who wasn't at the gym that day had **zero** chance. The sample is guaranteed to over-represent exercisers, however many people she asks.",
      },
      resolve: {
        kind: "mc",
        id: "samp-resolve-1",
        prompt: "What makes a sample random?",
        options: [
          { id: "a", text: "Chance decides who's in it, and everyone has a known chance", correct: true, why: "Drawing names, random number generators, and so on." },
          { id: "b", text: "Nobody deliberately chose the people", misconception: "convenience-is-random", why: "Whoever happens to be nearby is still a biased group." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "samp-check-1",
        prompt: "A school picks 10 students at random from each of its 6 grades. Which method is this?",
        options: [
          { id: "a", text: "Stratified", correct: true, why: "Every grade (stratum) is represented." },
          { id: "b", text: "Cluster", misconception: "stratified-vs-cluster", why: "Cluster sampling would take a few whole grades and survey everyone in them." },
          { id: "c", text: "Systematic", why: "Systematic means every kth person on a list." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "samp-check-2",
        prompt: "A city randomly picks 8 blocks and surveys every household on them. Which method is this?",
        options: [
          { id: "a", text: "Cluster", correct: true, why: "Whole groups (blocks) are chosen, then everyone in them." },
          { id: "b", text: "Stratified", misconception: "stratified-vs-cluster", why: "Stratified would take some households from *every* block." },
          { id: "c", text: "Simple random", why: "Households were picked in whole blocks, not one by one." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Splitting data into train and test sets is sampling. A *stratified* split (scikit-learn's train_test_split with stratify=y) keeps each class's share the same in both sets, so a rare class can't vanish from the test set by bad luck.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "samp-produce-1",
          prompt: "A shop surveys every 20th customer on its list. Which method?",
          options: [
            { id: "a", text: "Systematic", correct: true, why: "Every kth from a list." },
            { id: "b", text: "Cluster", misconception: "stratified-vs-cluster", why: "No groups were chosen." },
            { id: "c", text: "Convenience", misconception: "convenience-is-random", why: "There's a fixed rule over the whole list." },
          ],
        },
        { kind: "number", id: "samp-produce-2", prompt: "A population is 60% group A and 40% group B. A proportional stratified sample of 50 takes how many from group A?", answer: 30, explain: "60% of 50." },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "samp-review-1",
      prompt: "Each of 1,000 employees gets a number and 50 numbers are drawn at random. Which method?",
      options: [
        { id: "a", text: "Simple random sampling", correct: true, why: "Every group of 50 is equally likely." },
        { id: "b", text: "Stratified sampling", misconception: "stratified-vs-cluster", why: "No groups were used." },
      ],
    },
  ],
};

const bias: ConceptNode = {
  id: "sampling-bias",
  title: "Sampling bias",
  summary: "Bias is a systematic error in who gets measured. Unlike random error, it doesn't shrink as the sample grows: a huge biased sample is confidently wrong.",
  deps: ["sampling-methods"],
  pos: { x: 1, y: 2.6 },
  glossary: [
    { term: "bias", meaning: "An error that pushes results the same way every time, because of how data was collected." },
    { term: "survivorship bias", meaning: "Only looking at the cases that made it through some filter." },
    { term: "nonresponse bias", meaning: "The people who don't answer differ from those who do." },
  ],
  misconceptions: {
    "bigger-fixes-bias": "Thinks a bigger sample cancels out a biased way of collecting it.",
    survivorship: "Draws conclusions only from the cases that survived a filter.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two million votes, wrong answer",
      body: "In 1936 the *Literary Digest* magazine polled about 2.4 million people and confidently predicted that Alf Landon would beat Franklin Roosevelt.",
      realWorld: {
        title: "Product reviews",
        body: "Online reviews come mostly from people who loved or hated a product. Ten thousand of them still don't tell you what the typical buyer thinks.",
      },
    },
    {
      type: "truth",
      statement: "**Bias** is a systematic error in how a sample is collected. Collecting more data the same way repeats the same error: bigger samples shrink *random* error, not bias.",
      body: "Common kinds: **selection** (some groups are less likely to be picked), **nonresponse** (some people don't reply), **voluntary response** (only the motivated reply), **survivorship** (you only see the survivors), **response** (leading questions, people shading the truth).",
    },
    {
      type: "predict",
      misconception: "bigger-fixes-bias",
      item: {
        kind: "mc",
        id: "bias-predict-1",
        prompt: "A news site's online poll gets 2 million votes. A random phone poll asks 1,000 people. Which better estimates national opinion?",
        options: [
          { id: "a", text: "The random 1,000", correct: true, why: "Random selection beats sheer size." },
          { id: "b", text: "The 2 million: more data always wins", misconception: "bigger-fixes-bias", why: "Only the site's readers, and only the motivated ones, could vote." },
          { id: "c", text: "They're about equally good", why: "One is biased, one isn't." },
        ],
      },
      reveal: {
        body: "The *Digest* mailed people from phone books, car registrations and its own subscriber list, which in 1936 skewed wealthy, and only some replied. Roosevelt won in a landslide. George Gallup, with a sample of about 50,000, called it right. More of the wrong people just makes you wrong with more confidence.",
      },
      resolve: {
        kind: "mc",
        id: "bias-resolve-1",
        prompt: "Why didn't 2.4 million responses fix the *Digest*'s bias?",
        options: [
          { id: "a", text: "The bias was in who got asked; more of the same people repeats it", correct: true, why: "Size shrinks random wobble, not systematic error." },
          { id: "b", text: "It did: the bigger sample was closer", misconception: "bigger-fixes-bias", why: "It wasn't: it called the wrong winner." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bias-check-1",
        prompt: "In WWII, bombers that returned had bullet holes mostly on the wings. Where should extra armour go?",
        options: [
          { id: "a", text: "Where returning planes had *no* holes: planes hit there didn't come back", correct: true, why: "Statistician Abraham Wald's insight: the sample only contained survivors." },
          { id: "b", text: "On the wings, where the holes are", misconception: "survivorship", why: "Planes survived wing hits. The ones hit elsewhere aren't in the data." },
          { id: "c", text: "Spread evenly everywhere", why: "The data says where hits are survivable." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bias-check-2",
        prompt: "\"All 20 famous successful companies we studied took big risks. So take big risks.\" What's the flaw?",
        options: [
          { id: "a", text: "Risky companies that failed aren't in the study", correct: true, why: "Without the failures, you can't tell whether risk helped." },
          { id: "b", text: "None: all 20 agree", misconception: "survivorship", why: "They were chosen *because* they succeeded." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A loan model trained only on *approved* applicants never learns how rejected ones would have done: selection bias baked into the data. Collecting a million more approved loans doesn't fix it; changing what gets collected does.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "bias-produce-1",
          prompt: "A survey about work hours goes out by email. The most overworked people are least likely to reply. Which bias?",
          options: [
            { id: "a", text: "Nonresponse", correct: true, why: "Those who don't answer differ from those who do." },
            { id: "b", text: "Survivorship", misconception: "survivorship", why: "Nobody was filtered out by a success/failure process." },
          ],
        },
        {
          kind: "mc",
          id: "bias-produce-2",
          prompt: "You double the size of a biased sample, collected the same way. Its bias…",
          options: [
            { id: "a", text: "Stays about the same", correct: true, why: "The error comes from *how* it's collected." },
            { id: "b", text: "Halves", misconception: "bigger-fixes-bias", why: "That's what happens to random error's variance, not bias." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "bias-review-1",
      prompt: "A restaurant judges its food by the comment cards customers choose to fill in. Which bias?",
      options: [
        { id: "a", text: "Voluntary response", correct: true, why: "Only motivated customers (delighted or furious) bother." },
        { id: "b", text: "None, if enough cards come in", misconception: "bigger-fixes-bias", why: "More cards from the same kind of customer don't help." },
      ],
    },
  ],
};

export const describingUnit: Unit = {
  id: "st-0",
  track: "Statistics",
  title: "Describing Data",
  blurb: "Centre, spread and shape; how samples are drawn and how they go wrong.",
  nodes: [centre, quartiles, shape, sampling, bias].map((n) => deepen(n, DESCRIBING_DEPTH[n.id])),
};
