import type { ConceptNode, Unit, Vec } from "@/lib/content/types";
import { deepen } from "../deepen";
import { UNIT5_DEPTH } from "./unit5.depth";
import { node as spreadMeasures } from "../sections/spread-measures";
import { node as transformations } from "../sections/transformations";

const m = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`;

// House size (100s of m²) vs price-ish: a noisy upward trend for the line-fitting widget.
const HOUSES: Vec[] = [[1, 2], [2, 2.8], [3, 4.5], [4, 4.9], [5, 6.6], [6, 7.1]];

const CLOUD: Vec[] = [
  [-3, -1.5], [-2.5, -2], [-2, -0.5], [-1.5, -1.5], [-1, 0], [-0.5, -1], [0, 0.5], [0.5, -0.5],
  [1, 1], [1.5, 0], [2, 1.5], [2.5, 0.8], [3, 2], [-1, -1.2], [1, 0.2],
];

const variance: ConceptNode = {
  id: "variance",
  title: "Variance & standard deviation",
  summary: "Variance is the average squared distance from the mean; its square root σ is in the original units.",
  deps: ["expectation"],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "variance", meaning: "Var(X) = E[(X − μ)²]: the average squared distance from the mean." },
    { term: "standard deviation", meaning: "σ = √Var: the typical distance from the mean, in the data's own units." },
  ],
  misconceptions: {
    "average-deviation": "Thinks the plain average of deviations from the mean measures spread.",
    "var-is-std": "Mixes up variance and standard deviation.",
  },
  steps: [
    {
      type: "motivate",
      title: "Same average, different risk",
      body: "Two investments both average 5% a year. One swings between 4% and 6%; the other between −25% and +35%. The average hides the thing you care about most.",
      realWorld: { title: "Weather", body: "Two cities can share an average temperature of 15°C while one swings from −10 to 40. Spread matters." },
    },
    {
      type: "explore",
      title: "Drag the data",
      body: "Five values on a line. Each bar is that value's deviation from the mean.",
      widget: { kind: "points1d", values: [2, 4, 4, 6, 9] },
      task: "Try to make the sum of deviations anything but 0. Then make the variance as small as you can.",
    },
    {
      type: "truth",
      statement: "**Variance** $\\operatorname{Var}(X) = E[(X - \\mu)^2]$: the average squared distance from the mean $\\mu$. **Standard deviation** $\\sigma = \\sqrt{\\operatorname{Var}(X)}$.",
      body: "Squaring stops positive and negative deviations from cancelling, and weights big misses more. σ undoes the squaring so it's back in the original units. (With a *sample* you'll often see division by n − 1; here we divide by n.)",
    },
    {
      type: "predict",
      misconception: "average-deviation",
      item: {
        kind: "mc",
        id: "var-predict-1",
        prompt: "Data: 1, 5, 9 (mean 5). What is the average of (x − mean)?",
        options: [
          { id: "a", text: "0, and it is for any data", correct: true, why: "Deviations above and below always balance." },
          { id: "b", text: "About 2.7: the typical distance", misconception: "average-deviation", why: "That's the average of the *sizes*. With signs, they cancel." },
        ],
      },
      reveal: {
        body: "Deviations −4, 0, +4: they cancel to 0. Drag the points anywhere: the sum is always 0, because that's what the mean is. Spread needs the squares.",
        widget: { kind: "points1d", values: [1, 5, 9] },
      },
      resolve: {
        kind: "mc",
        id: "var-resolve-1",
        prompt: "Why does variance square the deviations?",
        options: [
          { id: "a", text: "So positives and negatives can't cancel out", correct: true, why: "And it makes big misses count more." },
          { id: "b", text: "It doesn't need to; the plain average works", misconception: "average-deviation", why: "The plain average is always 0." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "var-check-1",
        prompt: "Data 2, 4, 4, 4, 5, 5, 7, 9 has mean 5. What is its variance?",
        options: [
          { id: "a", text: "4", correct: true, why: "Squared deviations 9, 1, 1, 1, 0, 0, 4, 16 sum to 32; 32 / 8 = 4." },
          { id: "b", text: "2", misconception: "var-is-std", why: "That's the standard deviation, √4." },
          { id: "c", text: "32", why: "Divide the sum by the 8 values." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "var-check-2",
        prompt: "Heights have standard deviation σ = 3 cm. What is the variance?",
        options: [
          { id: "a", text: "9 cm²", correct: true, why: "Var = σ²." },
          { id: "b", text: "3 cm", misconception: "var-is-std", why: "That's σ. Variance is its square, in squared units." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "*Standardising* features (subtract the mean, divide by σ) gives every feature spread 1, so no feature dominates just because of its units. Mean squared error, the most common loss, is a variance of the errors.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "var-produce-1", prompt: "Data 1, 3, 5. What is the variance (divide by n)?", answer: 8 / 3, tolerance: 0.01, explain: "Mean 3; squared deviations 4, 0, 4; 8 / 3 ≈ 2.67." },
        { kind: "number", id: "var-produce-2", prompt: "A variance is 9. What is the standard deviation?", answer: 3, explain: "√9." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "var-review-1", prompt: "Data 4, 8. Variance (divide by n)?", answer: 4, explain: "Mean 6; squared deviations 4 and 4; average 4." },
  ],
};

const covariance: ConceptNode = {
  id: "covariance",
  title: "Covariance & correlation",
  summary: "Covariance measures whether two variables move together; the covariance matrix is what PCA diagonalises.",
  deps: ["variance"],
  pos: { x: 1, y: 0.4 },
  glossary: [
    { term: "covariance", meaning: "Cov(X, Y) = E[(X − μx)(Y − μy)]: positive when X and Y rise together, negative when one rises as the other falls." },
    { term: "correlation", meaning: "Covariance with the units removed: Cov / (σx σy), always between −1 and 1." },
  ],
  misconceptions: {
    "zero-cov-no-relation": "Thinks zero covariance means the variables are unrelated in every way.",
  },
  steps: [
    {
      type: "motivate",
      title: "Do they move together?",
      body: "Hot days, more ice cream sold. Variance describes one variable; we need a number for **two** at once.",
      realWorld: { title: "Investing", body: "Portfolios mix assets whose returns have negative covariance, so when one falls the other tends to rise. Risk drops without giving up the average." },
    },
    {
      type: "truth",
      statement: "$\\operatorname{Cov}(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)]$.",
      body: "When both are above their means together (or both below), the product is positive. When one is up while the other is down, it's negative. Note $\\operatorname{Cov}(X, X) = \\operatorname{Var}(X)$.",
    },
    {
      type: "truth",
      statement: "**Correlation** $\\rho = \\dfrac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y}$ is always between −1 and 1.",
      body: "It measures how close the points are to a straight line: ±1 means exactly on one. It says nothing about curved relationships.",
    },
    {
      type: "truth",
      statement: `The **covariance matrix** of $(X, Y)$ is $${m("\\operatorname{Var}X", "\\operatorname{Cov}(X,Y)", "\\operatorname{Cov}(X,Y)", "\\operatorname{Var}Y")}$: symmetric, because Cov(X, Y) = Cov(Y, X).`,
      body: "This is the matrix from the PCA lesson. Its eigenvectors are the directions of spread.",
    },
    {
      type: "explore",
      title: "A cloud with positive covariance",
      body: "This cloud leans up and to the right: positive covariance.",
      widget: { kind: "spread", points: CLOUD },
      task: "Find the direction of greatest spread again. Positive covariance tilts it upward.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cov-check-1",
        prompt: "X is spread evenly between −1 and 1, and Y = X². Their covariance is 0. Are X and Y unrelated?",
        options: [
          { id: "a", text: "No: Y is completely determined by X", correct: true, why: "The relationship is a curve, which covariance can't see." },
          { id: "b", text: "Yes: zero covariance means no relationship", misconception: "zero-cov-no-relation", why: "Zero covariance only rules out a straight-line trend." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cov-check-2",
        prompt: "A correlation of 0 means:",
        options: [
          { id: "a", text: "No straight-line trend; there could still be a curved one", correct: true, why: "Correlation only measures linear relationships." },
          { id: "b", text: "No relationship of any kind", misconception: "zero-cov-no-relation", why: "Y = X² has zero correlation with X." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A correlation matrix of your features is the first thing to check for redundant inputs. PCA, Gaussian models and portfolio optimisers all start from the covariance matrix.",
    },
    {
      type: "produce",
      body: "Unaided. All three right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "cov-produce-1",
          prompt: "Points (1, 1), (2, 3), (3, 5). Compute Cov(X, Y), dividing by n.",
          answer: 4 / 3,
          tolerance: 0.01,
          explain: "Means 2 and 3. Products of deviations: (−1)(−2) = 2, 0, (1)(2) = 2. Sum 4, divided by 3 ≈ 1.33.",
        },
        { kind: "number", id: "cov-produce-2", prompt: "Var X = 4, Var Y = 9, Cov(X, Y) = 3. What is the correlation?", answer: 0.5, explain: "3 / (2 · 3)." },
        {
          kind: "matrix",
          id: "cov-produce-3",
          prompt: "Same Var X = 4, Var Y = 9, Cov(X, Y) = 3. Write the covariance matrix.",
          answer: [[4, 3], [3, 9]],
          explain: `$${m(4, 3, 3, 9)}$: variances on the diagonal, the covariance in both corners.`,
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "cov-review-1", prompt: "Cov(X, Y) = 6, σx = 2, σy = 5. Correlation?", answer: 0.6, explain: "6 / 10." },
  ],
};

// The PCA lesson's cloud, moved off the origin so centring visibly matters.
const OFFSET_CLOUD: Vec[] = CLOUD.map(([x, y]) => [x + 1.5, y + 1.5]);

const pcaPractice: ConceptNode = {
  id: "pca-practice",
  title: "PCA in practice",
  summary: "Centre the data, build its covariance matrix, take the top eigenvectors, project onto them, and measure what's lost.",
  deps: ["covariance", "pca"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "score", meaning: "A point's coordinate along a principal component: its projection onto that direction." },
    { term: "reconstruction", meaning: "Rebuilding a point from its kept scores. What's missing is the information PCA threw away." },
  ],
  misconceptions: {
    "skip-centering": "Runs PCA without subtracting the mean first.",
    "pca-keeps-all": "Thinks projecting onto fewer components loses nothing.",
  },
  steps: [
    {
      type: "motivate",
      title: "From idea to recipe",
      body: "The PCA lesson found the direction of greatest spread. Now we run the full recipe on raw data, the way `sklearn` does it, and see exactly what dropping a dimension costs.",
      realWorld: {
        title: "Compressing sensor data",
        body: "A wearable records 50 correlated sensor channels. PCA keeps 5 component scores per moment and still reconstructs 95% of the signal: 10× less to send.",
      },
    },
    {
      type: "explore",
      title: "Run the pipeline",
      body: "Step through each stage of PCA.",
      widget: { kind: "pcapipe", points: OFFSET_CLOUD },
      task: "Go stage by stage. At stage 5, what fraction of the variance survived? Where are the red bars longest?",
    },
    {
      type: "truth",
      statement: "**PCA recipe:** (1) centre: subtract the mean; (2) covariance matrix $C$; (3) eigenvectors of $C$, sorted by eigenvalue; (4) **project**: score $= \\vec x\\cdot\\vec u_k$ for each kept unit eigenvector $\\vec u_k$; (5) **reconstruct**: $\\sum_k \\text{score}_k\\,\\vec u_k$ (+ the mean).",
      body: "Variance kept by the first $k$ components = (sum of their eigenvalues) ÷ (sum of all eigenvalues). What's dropped is the variance along the components you didn't keep.",
    },
    { type: "connect", body: "*Covariance* builds $C$; the *PCA* lesson said its top eigenvectors are the directions of spread; *basis vectors* say a score is just a coordinate in a new basis." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pcap-check-1",
        prompt: "Why centre the data before PCA?",
        options: [
          { id: "a", text: "Otherwise the first component points at the data's mean instead of along its spread", correct: true, why: "Covariance is about spread around the mean." },
          { id: "b", text: "It's optional tidying; the components come out the same", misconception: "skip-centering", why: "Uncentred data is dominated by its distance from the origin." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pcap-check-2",
        prompt: "A dataset sits around (100, 100) and spreads mostly along the x-axis. Run PCA *without* centring. The first \"component\" points:",
        options: [
          { id: "a", text: "Roughly towards (100, 100)", correct: true, why: "Distance from the origin swamps the real spread." },
          { id: "b", text: "Along the x-axis", misconception: "skip-centering", why: "That's what centred PCA would find." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pcap-check-3",
        prompt: "Project 2D data onto PC1 only, then reconstruct. Do you get the original data back?",
        options: [
          { id: "a", text: "Only the part along PC1; the PC2 part is lost", correct: true, why: "That loss is the red bars." },
          { id: "b", text: "Yes, exactly", misconception: "pca-keeps-all", why: "One number per point can't hold two numbers' worth of information." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "`PCA(n_components=0.95)` in sklearn keeps just enough components for 95% of the variance. It's used to speed up training, to visualise high-dimensional data in 2D, and to strip noise that lives in the small components.",
    },
    {
      type: "produce",
      body: "Unaided. All four right turns this **solid**. Use $C = \\begin{bmatrix}5&2\\\\2&2\\end{bmatrix}$ (eigenvalues 6 and 1, PC1 along $(2, 1)$).",
      items: [
        {
          kind: "vector",
          id: "pcap-produce-1",
          prompt: "Data (1, 2), (3, 4), (5, 9). What is the mean you subtract first?",
          answer: [3, 5],
          explain: "x: (1 + 3 + 5)/3 = 3. y: (2 + 4 + 9)/3 = 5.",
        },
        {
          kind: "number",
          id: "pcap-produce-2",
          prompt: "A centred point is (3, −1). PC1's unit vector is $(2, 1)/\\sqrt 5$. What is its score on PC1? (Two decimals.)",
          answer: Math.sqrt(5),
          tolerance: 0.01,
          explain: "(3·2 + (−1)·1)/√5 = 5/√5 = √5 ≈ 2.24.",
        },
        {
          kind: "vector",
          id: "pcap-produce-3",
          prompt: "Reconstruct that point from its PC1 score alone: score × unit vector.",
          answer: [2, 1],
          explain: "√5 · (2, 1)/√5 = (2, 1). The original (3, −1) is off by (1, −2): the PC2 part we dropped.",
          traps: [{ answer: [3, -1], misconception: "pca-keeps-all", message: "That's the original point. One score can only rebuild the part along PC1." }],
        },
        {
          kind: "number",
          id: "pcap-produce-4",
          prompt: "Five components have eigenvalues 50, 30, 15, 4, 1. How many do you need to keep at least 95% of the variance?",
          answer: 3,
          explain: "Total 100. Cumulative: 50, 80, 95. Three components reach 95%.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "pcap-review-1",
      prompt: "Eigenvalues 8, 1.5, 0.5. What fraction of variance do the top 2 components keep?",
      answer: 0.95,
      tolerance: 0.005,
      explain: "(8 + 1.5) / 10 = 0.95.",
    },
  ],
};

const normal: ConceptNode = {
  id: "normal",
  title: "The normal distribution",
  summary: "N(μ, σ²) is a bell centred at μ with width σ: 68% within 1σ, 95% within 2σ, 99.7% within 3σ.",
  deps: ["variance"],
  pos: { x: 1, y: 2 },
  glossary: [
    { term: "normal distribution", meaning: "The bell curve, N(μ, σ²): centred at μ, width set by σ." },
    { term: "z-score", meaning: "(x − μ) / σ: how many standard deviations x is from the mean." },
  ],
  misconceptions: {
    "bigger-sigma-taller": "Thinks a larger σ makes the bell taller.",
    "rule-mixup": "Mixes up the 68% (1σ) and 95% (2σ) ranges.",
  },
  steps: [
    {
      type: "motivate",
      title: "The shape everywhere",
      body: "Heights, measurement errors, exam scores: plot enough of them and you get the same bell. Why? Anything that's the sum of many small independent effects ends up bell-shaped (the *central limit theorem*).",
      realWorld: { title: "Quality control", body: "A factory flags any part more than 3σ from the target size: under the bell curve, only 0.3% of good parts should land that far out." },
    },
    {
      type: "explore",
      title: "Shape the bell",
      body: "Move μ and σ.",
      widget: { kind: "normal", mu: 0, sigma: 1 },
      task: "What does μ do? What does σ do to the width and to the height?",
    },
    {
      type: "truth",
      statement: "The **normal distribution** $N(\\mu, \\sigma^2)$ is a symmetric bell centred at $\\mu$ with width $\\sigma$. About **68%** of values are within $1\\sigma$, **95%** within $2\\sigma$, **99.7%** within $3\\sigma$.",
      body: "The total area under any probability curve is 1. That's what forces the shape's height.",
    },
    {
      type: "truth",
      statement: "The **z-score** $z = \\dfrac{x - \\mu}{\\sigma}$ says how many standard deviations $x$ is from the mean.",
      body: "It turns every normal distribution into the same standard one, $N(0, 1)$.",
    },
    {
      type: "predict",
      misconception: "bigger-sigma-taller",
      item: {
        kind: "mc",
        id: "norm-predict-1",
        prompt: "Increase σ from 1 to 2. The bell curve gets:",
        options: [
          { id: "a", text: "Wider and lower", correct: true, why: "Same total area, spread over more width." },
          { id: "b", text: "Wider and taller", misconception: "bigger-sigma-taller", why: "Taller and wider would mean more total area than 1." },
        ],
      },
      reveal: {
        body: "Peak height halves when σ doubles. The area under the curve is always exactly 1, so spreading it out must flatten it.",
        widget: { kind: "normal", mu: 0, sigma: 2 },
      },
      resolve: {
        kind: "mc",
        id: "norm-resolve-1",
        prompt: "Why does a wider normal curve get lower?",
        options: [
          { id: "a", text: "Its total area must stay 1", correct: true, why: "Probabilities add to 1." },
          { id: "b", text: "It doesn't: wider curves are taller", misconception: "bigger-sigma-taller", why: "The widget showed the peak drop." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "norm-check-1",
        prompt: "Heights are normal with μ = 170 cm and σ = 10 cm. About what percent are between 160 and 180 cm?",
        options: [
          { id: "a", text: "68%", correct: true, why: "That's within 1σ." },
          { id: "b", text: "95%", misconception: "rule-mixup", why: "95% is within 2σ: 150 to 190." },
          { id: "c", text: "50%", why: "Within one σ holds more than half." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "norm-check-2",
        prompt: "About what fraction of a normal distribution lies within 2σ of the mean?",
        options: [
          { id: "a", text: "95%", correct: true, why: "68–95–99.7." },
          { id: "b", text: "68%", misconception: "rule-mixup", why: "That's within 1σ." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Neural-network weights start out drawn from a normal distribution; *batch normalisation* turns each layer's activations into z-scores; and many models assume errors are normal. That last one leads straight to least squares.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "norm-produce-1", prompt: "A test has mean 70 and σ = 10. What is the z-score of 85?", answer: 1.5, explain: "(85 − 70) / 10." },
        {
          kind: "number",
          id: "norm-produce-2",
          prompt: "Same test (normal). Using 68–95–99.7, roughly what **percent** score above 90?",
          answer: 2.5,
          tolerance: 0.1,
          explain: "90 is 2σ above the mean. 95% lie within 2σ, so 5% lie outside, half of it above: 2.5%.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "norm-review-1", prompt: "x = 130, μ = 100, σ = 15. z-score?", answer: 2, explain: "30 / 15." },
  ],
};

const mle: ConceptNode = {
  id: "mle",
  title: "Maximum likelihood",
  summary: "MLE picks the parameters that make the observed data most probable.",
  deps: ["normal", "expectation"],
  pos: { x: 2, y: 2.2 },
  glossary: [
    { term: "likelihood", meaning: "L(θ) = P(data | θ): how probable your data is if the parameter were θ." },
    { term: "maximum likelihood estimate", meaning: "The θ with the highest likelihood. Written θ̂." },
  ],
  misconceptions: {
    "mle-is-fair": "Picks the parameter you expected beforehand instead of the one the data supports.",
  },
  steps: [
    {
      type: "motivate",
      title: "From data back to the model",
      body: "So far: given the coin's p, how likely are the results? Now flip it: given the results, what's the best guess for p?",
      realWorld: { title: "Polling", body: "A poll finds 420 of 1,000 people support a policy. The natural estimate, 42%, is a maximum-likelihood estimate." },
    },
    {
      type: "explore",
      title: "Slide the guess",
      body: "7 heads in 10 flips. The curve shows how likely that data is for each possible p.",
      widget: { kind: "likelihood", heads: 7, flips: 10 },
      task: "Find the p that makes 7-out-of-10 most likely.",
    },
    {
      type: "truth",
      statement: "The **likelihood** $L(\\theta) = P(\\text{data} \\mid \\theta)$. The **maximum likelihood estimate** $\\hat\\theta$ is the $\\theta$ that makes it biggest.",
      body: "Same formula as a probability, read the other way: the data is fixed and the parameter varies.",
    },
    {
      type: "truth",
      statement: "For $k$ heads in $n$ flips, $\\hat p = k/n$. For normal data, $\\hat\\mu$ = the sample mean.",
      body: "The intuitive answers *are* the maximum-likelihood ones. MLE explains why they're the right choice, and works for models where intuition runs out.",
    },
    {
      type: "predict",
      misconception: "mle-is-fair",
      item: {
        kind: "mc",
        id: "mle-predict-1",
        prompt: "A coin lands heads 7 times in 10 flips. What's the maximum-likelihood estimate of its p?",
        options: [
          { id: "a", text: "0.7", correct: true, why: "k / n." },
          { id: "b", text: "0.5: coins are fair", misconception: "mle-is-fair", why: "MLE goes by the data, not by expectations." },
        ],
      },
      reveal: {
        body: "The likelihood curve peaks at exactly 0.7. Believing \"most coins are fair\" is a *prior*: that's what Bayes adds on top. MLE uses the data alone.",
        widget: { kind: "likelihood", heads: 7, flips: 10 },
      },
      resolve: {
        kind: "mc",
        id: "mle-resolve-1",
        prompt: "Maximum likelihood chooses the parameter that:",
        options: [
          { id: "a", text: "Makes the observed data most probable", correct: true, why: "That's the definition." },
          { id: "b", text: "Matches what we believed before the data", misconception: "mle-is-fair", why: "That's a prior, which MLE ignores." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mle-check-1",
        prompt: "You observe 3, 5 and 7 and assume they're normal. What is the MLE of μ?",
        options: [
          { id: "a", text: "5", correct: true, why: "The sample mean." },
          { id: "b", text: "7", why: "The largest value isn't the most likely centre." },
          { id: "c", text: "15", why: "That's the sum. Divide by 3." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Most training *is* maximum likelihood: logistic regression and neural-network classifiers maximise the likelihood of the training labels. In practice we maximise the **log**-likelihood (sums are easier than products) and call its negative the loss.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "mle-produce-1", prompt: "12 heads in 40 flips. MLE of p?", answer: 0.3, explain: "12 / 40." },
        { kind: "number", id: "mle-produce-2", prompt: "Data 2, 4 and 9, assumed normal. MLE of μ?", answer: 5, explain: "The mean: 15 / 3." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "mle-review-1", prompt: "45 of 300 emails are spam. MLE of P(spam)?", answer: 0.15, explain: "45 / 300." },
  ],
};

const leastSquares: ConceptNode = {
  id: "least-squares",
  title: "Least squares regression",
  summary: "The best-fit line minimises the sum of squared residuals: slope = Cov(x, y) / Var(x).",
  deps: ["covariance", "solving-systems"],
  pos: { x: 2, y: 1.1 },
  glossary: [
    { term: "residual", meaning: "y − ŷ: how far a point is from the line, vertically." },
    { term: "least squares", meaning: "Choosing the line that makes the sum of squared residuals as small as possible." },
  ],
  misconceptions: {
    "sum-of-errors": "Thinks minimising the plain sum of residuals is enough.",
    "slope-flipped": "Computes the slope as Var(x) / Cov(x, y) instead of Cov(x, y) / Var(x).",
  },
  steps: [
    {
      type: "motivate",
      title: "The best line through messy points",
      body: "Real data never sits on a line. Which line is \"best\"? We need a score to minimise.",
      realWorld: { title: "House prices", body: "Price per extra square metre, estimated from hundreds of noisy sales, is the slope of a least-squares line." },
    },
    {
      type: "explore",
      title: "Fit it by hand",
      body: "Red bars are residuals: how far each point is from your line.",
      widget: { kind: "fitline", points: HOUSES },
      task: "Get the sum of squared residuals as low as you can. Keep an eye on the plain sum of residuals too.",
    },
    {
      type: "truth",
      statement: "**Least squares** picks the line $\\hat y = wx + b$ minimising $\\sum_i (y_i - \\hat y_i)^2$.",
      body: "The solution: $w = \\dfrac{\\operatorname{Cov}(x, y)}{\\operatorname{Var}(x)}$ and $b = \\bar y - w\\,\\bar x$. The line always passes through the point of means $(\\bar x, \\bar y)$.",
    },
    {
      type: "truth",
      statement: "In matrix form: stack the data into $X$ and solve the **normal equations** $X^\\top X\\,\\theta = X^\\top y$, so $\\theta = (X^\\top X)^{-1}X^\\top y$.",
      body: "That's Unit 2's \"closest fit\": with more equations than unknowns, $X\\theta = y$ has no exact answer, so we find the $\\theta$ whose error is smallest.",
    },
    {
      type: "predict",
      misconception: "sum-of-errors",
      item: {
        kind: "mc",
        id: "ls-predict-1",
        prompt: "Why not just minimise the plain sum of residuals, Σ(y − ŷ)?",
        options: [
          { id: "a", text: "Positive and negative misses cancel, so a terrible line can score 0", correct: true, why: "Any line through the point of means sums to 0." },
          { id: "b", text: "That works just as well", misconception: "sum-of-errors", why: "Try a flat line through the middle: plain sum 0, awful fit." },
        ],
      },
      reveal: {
        body: "Set the slope to 0 and the intercept to 4.65 (the mean of y): the plain sum of residuals is 0, yet the line misses everything. Squares make every miss count.",
        widget: { kind: "fitline", points: HOUSES },
      },
      resolve: {
        kind: "mc",
        id: "ls-resolve-1",
        prompt: "Squaring the residuals:",
        options: [
          { id: "a", text: "Stops misses cancelling and punishes big misses more", correct: true, why: "Both matter." },
          { id: "b", text: "Isn't needed; signed residuals are fine", misconception: "sum-of-errors", why: "Signed residuals cancel." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ls-check-1",
        prompt: "Data has x̄ = 2, ȳ = 5, Var(x) = 2 and Cov(x, y) = 4. What is the least-squares slope?",
        options: [
          { id: "a", text: "2", correct: true, why: "Cov / Var = 4 / 2." },
          { id: "b", text: "0.5", misconception: "slope-flipped", why: "Upside down: Cov goes on top." },
          { id: "c", text: "4", why: "Divide the covariance by the variance of x." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "This *is* linear regression. `sklearn`'s `LinearRegression` solves the normal equations; big models minimise the same mean squared error with gradient descent instead.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "ls-produce-1", prompt: "Same data (x̄ = 2, ȳ = 5, slope 2). What is the intercept b?", answer: 1, explain: "b = ȳ − w x̄ = 5 − 4." },
        {
          kind: "vector",
          id: "ls-produce-2",
          prompt: "Fit a line to (1, 1), (2, 3), (3, 5). Give $\\begin{bmatrix}w\\\\b\\end{bmatrix}$.",
          answer: [2, -1],
          explain: "Var(x) = 2/3, Cov = 4/3, so w = 2 and b = 3 − 2·2 = −1. These points lie exactly on y = 2x − 1.",
          traps: [{ answer: [0.5, 2], misconception: "slope-flipped", message: "The slope is Cov / Var, not Var / Cov." }],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "ls-review-1", prompt: "x̄ = 4, ȳ = 10, Var(x) = 5, Cov(x, y) = 10. Slope?", answer: 2, explain: "10 / 5." },
  ],
};

const losses: ConceptNode = {
  id: "loss-functions",
  title: "Loss functions are likelihoods",
  summary: "Minimising squared error is maximum likelihood under normal noise; log loss is maximum likelihood for yes/no labels.",
  deps: ["least-squares", "mle"],
  pos: { x: 3, y: 1.6 },
  glossary: [
    { term: "loss function", meaning: "The number training tries to make small: how wrong the model is on the data." },
    { term: "log loss", meaning: "−ln(probability the model gave the true label). Also called cross-entropy." },
  ],
  misconceptions: {
    "any-noise": "Thinks squared error is the right loss whatever the noise looks like.",
  },
  steps: [
    {
      type: "motivate",
      title: "Why these losses?",
      body: "Regression uses mean squared error. Classification uses \"cross-entropy\". Are these arbitrary conventions? No: both fall out of maximum likelihood.",
      realWorld: { title: "Robust losses", body: "Self-driving sensor pipelines often swap squared error for losses that tolerate outliers, because a few wild readings would otherwise drag the fit." },
    },
    {
      type: "truth",
      statement: "If $y = wx + b + \\text{noise}$ with **normal** noise, maximising the likelihood is exactly minimising $\\sum (y - \\hat y)^2$.",
      body: "A normal density is $\\propto e^{-(y-\\hat y)^2/2\\sigma^2}$. Take logs: the log-likelihood is a constant minus the squared error over $2\\sigma^2$. Maximise one, minimise the other.",
    },
    {
      type: "truth",
      statement: "For yes/no labels, a model that predicts $p$ gets log-likelihood $\\ln p$ when the answer is yes and $\\ln(1-p)$ when it's no. Its negative is **log loss** (cross-entropy).",
      body: "Same story as the coin in the MLE lesson, but now the model's $p$ depends on the input.",
    },
    { type: "connect", body: "*Least squares* + *maximum likelihood* = why MSE is the default regression loss. Choosing a loss is choosing a noise model." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "loss-check-1",
        prompt: "Least squares is the maximum-likelihood fit when the noise is:",
        options: [
          { id: "a", text: "Normal", correct: true, why: "The squared error comes from the normal density's exponent." },
          { id: "b", text: "Any distribution at all", misconception: "any-noise", why: "Other noise gives other losses: absolute error comes from Laplace noise, for example." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "loss-check-2",
        prompt: "Your errors are mostly small, with occasional huge outliers (not normal). Squared error is then:",
        options: [
          { id: "a", text: "No longer the MLE, and the outliers dominate it", correct: true, why: "Squaring a huge miss makes it enormous." },
          { id: "b", text: "Still the best choice", misconception: "any-noise", why: "It's only the MLE under normal noise." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "PyTorch's `MSELoss` and `CrossEntropyLoss` are negative log-likelihoods in disguise. Huber, Poisson and quantile losses each correspond to a different noise model.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "loss-produce-1", prompt: "Predictions 3 and 5; true values 2 and 7. Mean squared error?", answer: 2.5, explain: "(1² + 2²) / 2." },
        {
          kind: "number",
          id: "loss-produce-2",
          prompt: "The true label is yes and the model said p = 0.5. Log loss, −ln(p)? (Three decimals.)",
          answer: Math.log(2),
          tolerance: 0.005,
          explain: "−ln 0.5 = ln 2 ≈ 0.693. A confident correct answer (p near 1) would cost almost nothing.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "loss-review-1", prompt: "Predictions 1, 1, 1; truth 1, 2, 3. Mean squared error?", answer: 5 / 3, tolerance: 0.01, explain: "(0 + 1 + 4) / 3 ≈ 1.67." },
  ],
};

export const unit5: Unit = {
  id: "st-2",
  track: "Statistics",
  title: "Spread, Normal & Regression",
  blurb: "How data spreads, the bell curve, and why training a model is maximum likelihood.",
  nodes: [variance, spreadMeasures, covariance, pcaPractice, normal, transformations, mle, leastSquares, losses].map((n) => deepen(n, UNIT5_DEPTH[n.id])),
};
