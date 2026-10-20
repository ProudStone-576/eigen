import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Unsupervised learning and clustering: k-means, k-means++, hierarchical clustering and linkage, silhouettes, choosing k, scaling. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "clustering",
  title: "Clustering",
  summary: "Clustering finds groups in data without labels: unsupervised learning. k-means alternates between assigning points to the nearest centre and moving each centre to the mean of its points, lowering the within-cluster sum of squares; hierarchical clustering builds a tree of merges. Silhouettes and the elbow method help choose the number of clusters.",
  deps: ["spread-measures", "multivariate-normal"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "unsupervised learning", meaning: "Finding structure in data without a target label; supervised learning predicts a known label." },
    { term: "centroid", meaning: "The mean of the points in a cluster." },
    { term: "dendrogram", meaning: "The tree of merges in hierarchical clustering; cutting it at a height gives clusters." },
  ],
  misconceptions: {
    "kmeans-finds-true": "Thinks k-means always finds the best clustering and reveals the \"right\" number of clusters by itself.",
    "cluster-unscaled": "Clusters variables measured on very different scales without standardising them.",
  },
  steps: [
    {
      type: "motivate",
      title: "Groups no one labelled",
      body: "A shop has purchase histories for a million customers and no labels. Are there natural groups, such as bargain hunters, weekly regulars and big seasonal spenders? Clustering looks for them. Whether the groups it finds are real or useful is a separate question that the algorithm can't answer for you.",
      realWorld: {
        title: "Gene expression",
        body: "Biologists cluster tumours by the activity of thousands of genes. Clusters found this way revealed subtypes of breast cancer that respond to different treatments.",
      },
    },
    {
      type: "truth",
      statement: "**k-means** minimises the within-cluster sum of squares $\\text{WCSS} = \\sum_k\\sum_{i \\in C_k}|\\vec x_i - \\vec\\mu_k|^2$. **Lloyd's algorithm** repeats two steps: assign each point to its nearest centre, then move each centre to the mean of its points. Each step can only lower WCSS, so the algorithm stops, but possibly at a local minimum; **k-means++** chooses spread-out starting centres and several restarts help.",
      body: "**Agglomerative hierarchical clustering** starts with every point alone and repeatedly merges the closest two clusters, where \"closest\" is set by the **linkage**: single (nearest points), complete (farthest points), average, or Ward's (smallest increase in WCSS). Distances depend on units, so **standardise** first. The **silhouette** $s_i = \\dfrac{b_i - a_i}{\\max(a_i, b_i)}$ compares a point's mean distance to its own cluster ($a_i$) with that to the nearest other cluster ($b_i$).",
    },
    {
      type: "predict",
      misconception: "cluster-unscaled",
      item: {
        kind: "mc",
        id: "clu-predict-1",
        prompt: "Customers are clustered on annual income (in rupees, ranging 2–50 lakh) and age (20–70) without scaling. The clusters will be driven",
        options: [
          { id: "a", text: "almost entirely by income, whose numbers are vastly larger", correct: true, why: "Squared distances are dominated by the largest-scale variable." },
          { id: "b", text: "equally by income and age", misconception: "cluster-unscaled", why: "Distance treats a rupee and a year as the same unit." },
          { id: "c", text: "mainly by age", why: "Age differences are tiny next to rupee differences." },
        ],
      },
      reveal: {
        body: "Income differences run to hundreds of thousands of rupees; age differences to tens of years. In a squared Euclidean distance, age barely registers, so the clusters are just income bands. Standardising each variable (or choosing weights deliberately) lets both count.",
      },
      resolve: {
        kind: "mc",
        id: "clu-resolve-1",
        prompt: "Before k-means on variables in different units, you should",
        options: [
          { id: "a", text: "standardise them, or weight them deliberately", correct: true, why: "Distance depends on units." },
          { id: "b", text: "leave them as they are", misconception: "cluster-unscaled", why: "The largest-scale variable would dominate." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "clu-check-1",
        prompt: "k-means is run with $k = 4$ on data with no real group structure. It will",
        options: [
          { id: "a", text: "still return 4 clusters", correct: true, why: "It partitions any data into $k$ groups." },
          { id: "b", text: "report that there are no clusters", misconception: "kmeans-finds-true", why: "k-means always produces exactly $k$ clusters." },
          { id: "c", text: "fail to run", why: "It always runs." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "clu-check-2",
        prompt: "A point has mean distance 1 to its own cluster and 4 to the nearest other cluster. Its silhouette is",
        options: [
          { id: "a", text: "0.75", correct: true, why: "$(4 - 1)/4$." },
          { id: "b", text: "3", why: "Divide by $\\max(a, b)$." },
          { id: "c", text: "0.25", why: "That is $a/b$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Clustering is used to segment customers, compress images (colour quantisation is k-means on pixel colours), build vocabularies of visual features, and initialise other models. Its cousin, Gaussian mixture modelling (§{gmm-em}), gives soft assignments with probabilities.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "clu-produce-1", prompt: "Points 1, 2, 9, 10, 11 with centres 1 and 9. After one assignment-and-update step, where is the first centre?", answer: 1.5, explain: "{1, 2} → mean 1.5." },
        { kind: "number", id: "clu-produce-2", prompt: "Same step. Find the new WCSS with centres 1.5 and 10.", answer: 2.5, explain: "$0.25 + 0.25 + 1 + 0 + 1$." },
        {
          kind: "mc",
          id: "clu-produce-3",
          prompt: "Clustering height in metres and weight in grams without scaling",
          options: [
            { id: "a", text: "lets weight dominate the distances", correct: true, why: "Its numbers are thousands of times larger." },
            { id: "b", text: "treats both fairly", misconception: "cluster-unscaled", why: "Units decide the distances." },
          ],
        },
        {
          kind: "mc",
          id: "clu-produce-4",
          prompt: "Running k-means from 10 different random starts gives different final WCSS values. This shows",
          options: [
            { id: "a", text: "k-means finds local minima; keep the best run", correct: true, why: "It is not guaranteed to find the global minimum." },
            { id: "b", text: "a bug, since k-means always finds the best clustering", misconception: "kmeans-finds-true", why: "Different starts can end in different local minima." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "clu-review-1", prompt: "Mean distance to own cluster 2, to the nearest other cluster 5. Find the silhouette.", answer: 0.6, explain: "$(5 - 2)/5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "choosing the number of clusters",
      body: "WCSS always falls as $k$ grows, reaching 0 at $k = n$. The **elbow method** looks for the $k$ after which the fall levels off; the **average silhouette** is highest for well-separated clusters; the **gap statistic** compares WCSS with what uniformly scattered data would give. Domain knowledge decides whether the clusters are useful.",
    },
    {
      type: "definition",
      term: "linkage",
      body: "**Single** linkage uses the closest pair of points between clusters and can chain long, thin clusters together. **Complete** linkage uses the farthest pair and favours compact clusters. **Average** linkage averages all pairs. **Ward's** method merges the pair that increases WCSS least, giving k-means-like clusters.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "Lloyd's algorithm never increases WCSS",
      statement: "Each assignment step and each update step of k-means leaves WCSS lower or the same, so the algorithm stops after finitely many steps, at a local minimum.",
      proof: [
        "Assigning each point to its nearest centre can only reduce its squared distance.",
        "For a fixed set of points, the centre minimising $\\sum|\\vec x_i - \\vec c|^2$ is their mean (§{spread-measures}). There are finitely many partitions, and WCSS strictly falls whenever the partition changes.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "what k-means assumes",
      statement: "k-means works best for roughly spherical clusters of similar size and spread, because it assigns each point to the nearest centre. Elongated, nested or very unequal clusters need other methods: Gaussian mixtures, density-based clustering such as DBSCAN, or spectral clustering.",
      proof: ["The nearest-centre boundaries are straight lines halfway between centres, which can't follow curved or stretched clusters."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "one k-means step",
      problem: "Points 1, 2, 9, 10, 11 on a line; starting centres 1 and 9. Do one assignment and update, and find the WCSS.",
      solution: ["Assign: {1, 2} to centre 1, {9, 10, 11} to centre 9. Update: centres 1.5 and 10.", "WCSS $= 0.25 + 0.25 + 1 + 0 + 1 = 2.5$. Reassigning changes nothing, so the algorithm has converged."],
      result: "Centres 1.5 and 10; WCSS 2.5.",
    },
    {
      type: "example",
      level: 2,
      title: "silhouettes",
      problem: "In the clustering above, find the silhouette of the point 2.",
      solution: ["$a$: mean distance to 1 is 1. $b$: mean distance to 9, 10, 11 is 8.", "$s = (8 - 1)/8 = 0.875$: well placed."],
      result: "0.875.",
    },
    {
      type: "example",
      level: 3,
      title: "linkage matters",
      problem: "Points 0, 1, 2, 3, 4, 10. Under single linkage, which merge happens last?",
      solution: ["0–4 are joined one step apart at distance 1 each.", "The last merge joins {0, …, 4} with {10} at distance 6 (from 4 to 10)."],
      result: "{0, …, 4} with {10}, at height 6.",
    },
  ],
  pitfalls: [
    { wrong: "k-means finds the true groups and their number.", right: "It returns $k$ groups whatever the data; you choose $k$, and judge whether the groups mean anything." },
    { wrong: "Cluster raw variables in different units.", right: "Standardise, or weight variables on purpose." },
    { wrong: "One run of k-means is enough.", right: "Use k-means++ starts and several restarts; keep the lowest WCSS." },
  ],
  formulas: [
    { label: "WCSS", tex: "\\textstyle\\sum_k\\sum_{i \\in C_k}|\\vec x_i - \\vec\\mu_k|^2" },
    { label: "Update", tex: "\\vec\\mu_k = \\tfrac{1}{|C_k|}\\textstyle\\sum_{i \\in C_k}\\vec x_i" },
    { label: "Silhouette", tex: "s_i = \\dfrac{b_i - a_i}{\\max(a_i, b_i)}" },
  ],
  exercises: [
    ex(1, num("clux-ex-1", "A cluster contains 2, 4 and 9. Find its centroid.", 5, "The mean."), ["$15/3 = 5$."]),
    ex(1, num("clux-ex-2", "Same cluster. Find its contribution to WCSS.", 26, "$9 + 1 + 16$."), ["$(2 - 5)^2 + (4 - 5)^2 + (9 - 5)^2 = 26$."]),
    ex(2, num("clux-ex-3", "Find the silhouette of a point with $a = 3$ and $b = 2$. Give an exact fraction or 3 decimal places.", -1 / 3, "$(2 - 3)/3$.", 0.0005), ["$-\\tfrac13$: the point sits closer to another cluster, so it is probably misassigned."]),
    ex(2, num("clux-ex-4", "Points 0, 4, 6 and 10 with centres 0 and 10. After one step, find the new centres' sum.", 10, "Assign 4 to 0 and 6 to 10."), ["{0, 4} → 2, {6, 10} → 8; sum 10."]),
    ex(2, dp("clux-ex-5", "Standardise an age of 50 when ages have mean 40 and SD 12.", 10 / 12, "$z = (50 - 40)/12$."), ["$\\approx 0.833$."]),
    ex(3, num("clux-ex-6", "Points 0, 1, 2, 3, 4, 10, 11. Under single linkage, at what height do the two final clusters merge?", 6, "Closest pair across the gap."), ["{0, …, 4} and {10, 11} are closest at 4 and 10: height 6."]),
    ex(3, mc("clux-ex-7", "Two clusters are long, thin and parallel. k-means with $k = 2$ will likely", ["cut across them, mixing the two", "Its straight, halfway boundaries suit round clusters."], [["separate them perfectly", "It favours compact, round clusters."], ["fail to run", "It always returns clusters."]]), ["Single linkage, Gaussian mixtures or spectral clustering can follow elongated shapes."]),
    ex(3, mc("clux-ex-8", "WCSS for $k = 1, \\dots, 6$ is 100, 40, 25, 22, 20, 19. The elbow suggests", ["$k = 3$", "The big drops stop after 3."], [["$k = 6$", "WCSS always falls; small further drops aren't worth it."], ["$k = 1$", "Going to 2 and 3 clusters gains a lot."]]), ["Look for where extra clusters stop buying much."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 3 + lv;
      const xs = Array.from({ length: k }, () => r.int(0, 10 + 5 * lv));
      const m = xs.reduce((s, x) => s + x, 0) / k;
      const w = xs.reduce((s, x) => s + (x - m) ** 2, 0);
      return n(`A cluster contains ${xs.join(", ")}. Find its contribution to the WCSS (2 decimals).`, r2(w), `Centroid ${r2(m)}; sum of squared distances $\\approx ${r2(w)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 8);
      let b = r.int(1, 10);
      if (b === a) b += 1;
      const s = (b - a) / Math.max(a, b);
      return n(`A point's mean distance to its own cluster is ${a} and to the nearest other cluster is ${b}. Find its silhouette (3 decimals).`, Math.round(s * 1000) / 1000, `$(${b} - ${a})/${Math.max(a, b)} \\approx ${Math.round(s * 1000) / 1000}$${s < 0 ? ": probably misassigned" : ""}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { a: "annual salary in rupees", b: "number of children" },
        { a: "house price", b: "number of bedrooms" },
        { a: "distance travelled in metres", b: "trip duration in hours" },
      ]);
      return mcNumbers(
        `Customers are clustered by k-means on ${v.a} and ${v.b}, with no scaling. What drives the clusters?`,
        { text: `Almost entirely ${v.a}`, why: "Its numbers are far larger, so it dominates squared distances." },
        [
          { text: "Both variables equally", why: "Distance depends on units, not importance.", misconception: "cluster-unscaled" },
          { text: `Mostly ${v.b}`, why: "Small-scale differences barely register." },
        ],
      );
    },
  },
];
