import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Statistical genetics (Hardy–Weinberg, heritability, GWAS and multiple testing), network statistics (degree, density, clustering, block models, homophily versus contagion), text and language statistics (bag of words, TF-IDF, Zipf's law, topic models), and functional data analysis. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "genetics-networks-text",
  title: "Genetics, networks, text & functional data",
  summary: "Some of the fastest-growing areas of statistics deal with data that aren't rows of independent numbers: genomes with millions of variants, networks of who is connected to whom, documents made of words, and whole curves measured over time. Each has its own models and its own trap: multiple testing in genetics, dependence and confounding in networks, sparsity in text, and smoothness in functional data.",
  deps: ["multiple-testing", "high-dimensional", "independence"],
  pos: { x: 5, y: 0 },
  glossary: [
    { term: "Hardy–Weinberg equilibrium", meaning: "With allele frequencies $p$ and $q = 1 - p$ and random mating, genotype frequencies are $p^2$, $2pq$ and $q^2$." },
    { term: "network density", meaning: "The fraction of possible edges present: $2m/(n(n - 1))$ for $n$ nodes and $m$ undirected edges." },
    { term: "TF-IDF", meaning: "Term frequency times $\\log(N/\\text{df})$: a word's weight in a document, high when frequent there but rare across documents." },
  ],
  misconceptions: {
    "network-contagion": "Reads similarity between connected people as proof that behaviour spreads through the connection, ignoring homophily and shared environments.",
    "heritability-individual": "Thinks a heritability of 60% means 60% of each person's trait is caused by their genes.",
  },
  steps: [
    {
      type: "motivate",
      title: "Data with structure",
      body: "A genome-wide study tests a million genetic variants for links with diabetes. A public-health team notices obese people tend to have obese friends: does obesity spread? A search engine ranks a billion documents for a query. A physiologist records each patient's heart rate as a whole curve over a day. None of these fits the textbook picture of independent rows, and each has developed its own statistics.",
      realWorld: {
        title: "Mendel's peas",
        body: "Gregor Mendel's 1866 pea experiments gave ratios close to 3 : 1. Fisher later noted in 1936 that they were, statistically, almost too close to expectation, an early example of applying a goodness-of-fit test (§{chi-square}) to genetic data.",
      },
    },
    {
      type: "truth",
      statement: "**Genetics**: under Hardy–Weinberg equilibrium, genotype frequencies are $p^2, 2pq, q^2$; departures are tested by $\\chi^2$. **Heritability** $h^2 = \\sigma_G^2/\\sigma_P^2$ is the share of trait **variance** in a population explained by genetic differences. Genome-wide association studies test about a million variants, so they use the threshold $5 \\times 10^{-8}$ (roughly $0.05/10^6$, §{multiple-testing}) and require replication. **Networks**: with $n$ nodes and $m$ edges, density is $\\dfrac{2m}{n(n - 1)}$, the average degree $2m/n$; the **clustering coefficient** is the fraction of connected triples that close into triangles. Models include stochastic block models (communities) and exponential random graph models.",
      body: "Network data violate independence: connected people influence each other (**contagion**), choose similar friends (**homophily**), and share environments, and these are hard to separate from observational data. **Text**: a document becomes a vector of word counts (bag of words), weighted by **TF-IDF**, $\\text{tf} \\times \\ln(N/\\text{df})$; word frequencies follow **Zipf's law** (frequency roughly $\\propto 1/\\text{rank}$), so most words are rare and vectors are sparse; **topic models** (latent Dirichlet allocation) treat documents as mixtures of topics, each a distribution over words. **Functional data analysis** treats each observation as a curve: smooth the curves, align their timing (registration), and summarise variation with functional principal components (§{pca}).",
    },
    {
      type: "predict",
      misconception: "network-contagion",
      item: {
        kind: "mc",
        id: "gnt-predict-1",
        prompt: "In a large friendship network, a person's chance of becoming obese is higher if a friend became obese. The safest conclusion is",
        options: [
          { id: "a", text: "obesity is correlated across friends, which contagion, homophily or shared environment could each produce", correct: true, why: "Observational network data can't easily separate them." },
          { id: "b", text: "obesity spreads from friend to friend", misconception: "network-contagion", why: "Friends choose each other and share surroundings." },
          { id: "c", text: "there is no relationship", why: "The correlation is real; its cause is unclear." },
        ],
      },
      reveal: {
        body: "A famous 2007 study made the contagion claim; later work showed that homophily (similar people befriend each other) and shared environments (same neighbourhood, same food) produce the same pattern, and that observational network data generally can't separate them without strong assumptions. Randomised experiments on networks, or natural experiments, are needed to identify spread (§{potential-outcomes}).",
      },
      resolve: {
        kind: "mc",
        id: "gnt-resolve-1",
        prompt: "Connected people in a network behave alike. This is evidence of",
        options: [
          { id: "a", text: "association, with contagion only one possible explanation", correct: true, why: "Homophily and shared context give the same signal." },
          { id: "b", text: "contagion", misconception: "network-contagion", why: "That needs a causal design." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gnt-check-1",
        prompt: "Height has heritability about 0.8 in a population. This means",
        options: [
          { id: "a", text: "about 80% of the variation in height across that population is associated with genetic differences", correct: true, why: "Heritability describes variance in a population." },
          { id: "b", text: "80% of each person's height is due to genes", misconception: "heritability-individual", why: "Genes and environment don't split an individual's height into parts." },
          { id: "c", text: "height can't be changed by environment", why: "Average height rose a lot with nutrition despite high heritability." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gnt-check-2",
        prompt: "Allele frequency $p = 0.7$ under Hardy–Weinberg. The expected frequency of heterozygotes is",
        options: [
          { id: "a", text: "0.42", correct: true, why: "$2 \\times 0.7 \\times 0.3$." },
          { id: "b", text: "0.21", why: "Heterozygotes are $2pq$, not $pq$." },
          { id: "c", text: "0.49", why: "That is $p^2$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Graph neural networks learn from network structure; word embeddings and language models replaced TF-IDF for most text tasks but TF-IDF remains a strong, interpretable baseline, and Zipf's law shapes tokenisation. Genomic prediction (polygenic scores) is high-dimensional regression (§{high-dimensional}) with heavy multiple-testing and population-structure confounding.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "gnt-produce-1", prompt: "A network has 10 nodes and 15 undirected edges. Find its density.", answer: 15 / 45, tolerance: 0.001, explain: "$2 \\times 15/(10 \\times 9)$." },
        { kind: "number", id: "gnt-produce-2", prompt: "A word appears 3 times in a document and in 10 of 1,000 documents. Find its TF-IDF with natural log, to 3 decimals.", answer: Math.round(3 * Math.log(100) * 1000) / 1000, tolerance: 0.001, explain: "$3\\ln(1000/10)$." },
        {
          kind: "mc",
          id: "gnt-produce-3",
          prompt: "Teenagers whose friends smoke are more likely to start smoking. To show peer influence, you would most want",
          options: [
            { id: "a", text: "a design that rules out friend selection and shared environment, such as a randomised intervention", correct: true, why: "Otherwise homophily is an explanation." },
            { id: "b", text: "nothing more: the association proves influence", misconception: "network-contagion", why: "Selection and context also produce it." },
          ],
        },
        {
          kind: "mc",
          id: "gnt-produce-4",
          prompt: "A trait has heritability 0.5 in a population. For one person with that trait value,",
          options: [
            { id: "a", text: "heritability says nothing about how much of their value is genetic", correct: true, why: "It is a population variance ratio." },
            { id: "b", text: "half their trait comes from genes", misconception: "heritability-individual", why: "Individual traits don't split that way." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "gnt-review-1", prompt: "Hardy–Weinberg with $q = 0.1$. Find the expected frequency of the recessive homozygote $q^2$.", answer: 0.01, explain: "$0.1^2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "genome-wide association",
      body: "Each variant is tested for association with the trait, usually by regression adjusted for **population structure** (principal components of the genotypes, since ancestry correlates with both genotype and many traits). Results are shown as a Manhattan plot of $-\\log_{10}p$ by genomic position. Nearby variants are correlated (linkage disequilibrium), so a hit marks a region, not necessarily the causal variant. Effects are mostly tiny, which motivates huge samples and polygenic scores summing many small effects.",
    },
    {
      type: "definition",
      term: "functional data",
      body: "Each subject contributes a function $x_i(t)$, observed at many points. Smooth each curve (splines or kernels, §{kde}), align features that occur at different times (registration), then compute a mean curve and **functional principal components**: the main shapes of variation, like PCA with curves instead of vectors. Functional regression relates a scalar outcome to a whole curve through a coefficient function $\\beta(t)$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "Hardy–Weinberg",
      statement: "With random mating and no selection, mutation or migration, allele frequency $p$ gives genotype frequencies $p^2$, $2pq$, $q^2$ after one generation, and these then stay constant.",
      proof: ["Each child draws one allele from each parent independently, each being A with probability $p$ (§{independence}): $P(AA) = p^2$, $P(Aa) = 2pq$, $P(aa) = q^2$. The allele frequency among the children is $p^2 + pq = p$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "network summaries",
      statement: "For an undirected network with $n$ nodes and $m$ edges: density $\\dfrac{2m}{n(n - 1)}$, mean degree $\\dfrac{2m}{n}$; each edge adds 1 to the degree of each endpoint, so degrees sum to $2m$.",
      proof: ["There are $\\binom n2$ possible edges; count edge endpoints."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "Zipf's law",
      statement: "In most languages, the $r$-th most common word has frequency roughly proportional to $1/r$: the most common word is about twice as frequent as the second and ten times the tenth.",
      proof: ["An empirical regularity; it implies a few words dominate counts while most of the vocabulary is rare, which is why stop-word removal and IDF weighting help."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A sample of 200 people has genotypes AA 90, Aa 80, aa 30. Estimate $p$ and the Hardy–Weinberg expected counts.",
      solution: ["$p = (2 \\times 90 + 80)/400 = 0.65$, $q = 0.35$.", "Expected: AA $200 \\times 0.4225 = 84.5$, Aa $200 \\times 0.455 = 91$, aa $200 \\times 0.1225 = 24.5$; compare with $\\chi^2$ on 1 d.f."],
      result: "$p = 0.65$; expected 84.5, 91, 24.5.",
    },
    {
      type: "example",
      level: 2,
      title: "clustering coefficient",
      problem: "Node $v$ has 4 neighbours, and 3 of the 6 possible pairs of neighbours are connected. Find $v$'s local clustering coefficient.",
      solution: ["$\\binom42 = 6$ possible links among neighbours.", "$3/6 = 0.5$: half of $v$'s friends know each other."],
      result: "0.5.",
    },
    {
      type: "example",
      level: 3,
      title: "TF-IDF ranking",
      problem: "In 1,000 documents, \"the\" appears in all and \"kriging\" in 5. A document contains \"the\" 40 times and \"kriging\" 3 times. Compare TF-IDF weights.",
      solution: ["\"the\": $40\\ln(1000/1000) = 0$.", "\"kriging\": $3\\ln(200) \\approx 15.9$: the rare word characterises the document."],
      result: "0 against about 15.9.",
    },
  ],
  pitfalls: [
    { wrong: "Similar friends prove behaviour spreads.", right: "Homophily and shared environment give the same pattern." },
    { wrong: "Heritability tells you how genetic one person's trait is.", right: "It describes variance in a population, and depends on the environment." },
    { wrong: "Use $p < 0.05$ across a million variants.", right: "Use genome-wide thresholds such as $5 \\times 10^{-8}$ and replicate." },
  ],
  formulas: [
    { label: "Hardy–Weinberg", tex: "p^2 + 2pq + q^2 = 1" },
    { label: "Heritability", tex: "h^2 = \\sigma_G^2/\\sigma_P^2" },
    { label: "Density", tex: "\\dfrac{2m}{n(n - 1)}" },
    { label: "TF-IDF", tex: "\\text{tf} \\times \\ln(N/\\text{df})" },
  ],
  exercises: [
    ex(1, num("gntx-ex-1", "Hardy–Weinberg with $p = 0.6$. Find the expected frequency of AA.", 0.36, "$p^2$."), ["$0.36$."]),
    ex(1, num("gntx-ex-2", "A network has 20 nodes and 30 edges. Find the mean degree.", 3, "$2 \\times 30/20$."), ["$3$."]),
    ex(2, dp("gntx-ex-3", "Genetic variance 30, total phenotypic variance 50. Find the heritability.", 0.6, "$30/50$."), ["$0.6$."]),
    ex(2, dp("gntx-ex-4", "A word appears 5 times in a document and in 50 of 10,000 documents. Find its TF-IDF (natural log).", 5 * Math.log(200), "$5\\ln 200$."), ["$\\approx 26.492$."]),
    ex(2, mc("gntx-ex-5", "A Bonferroni threshold for $10^6$ tests at overall 5% is", ["$5 \\times 10^{-8}$", "$0.05/10^6$."], [["$0.05$", "That ignores the million tests."], ["$5 \\times 10^{-6}$", "Divide by $10^6$, not $10^4$."]]), ["The usual genome-wide threshold."]),
    ex(3, dp("gntx-ex-6", "Genotype counts AA 50, Aa 40, aa 10. Estimate the allele frequency $p$ of A.", 0.7, "$(100 + 40)/200$."), ["$0.7$."]),
    ex(3, mc("gntx-ex-7", "By Zipf's law, if the most common word appears 60,000 times in a corpus, the 30th most common appears about", ["2,000 times", "$60000/30$."], [["59,970 times", "Frequency falls like $1/\\text{rank}$."], ["30 times", "Far too few."]]), ["A rough rule, not exact."]),
    ex(3, mc("gntx-ex-8", "A GWAS finds a variant associated with chopstick use. The most likely explanation is", ["population structure: ancestry correlates with both the variant and the behaviour", "Adjust for ancestry components."], [["a gene for chopstick skill", "A classic illustration of confounding by ancestry."], ["a multiple-testing artefact only", "It can be a real, confounded association."]]), ["Control with genetic principal components."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const p = r.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9]);
      const want = r.pick(["AA", "Aa", "aa"] as const);
      const q = 1 - p;
      const v = want === "AA" ? p * p : want === "Aa" ? 2 * p * q : q * q;
      return n(`Hardy–Weinberg with allele frequency $p = ${p}$ for A. Find the expected frequency of ${want} (4 decimals).`, Math.round(v * 10000) / 10000, want === "AA" ? `$p^2 = ${Math.round(v * 10000) / 10000}$.` : want === "Aa" ? `$2pq = 2 \\times ${p} \\times ${r2(q)} = ${Math.round(v * 10000) / 10000}$.` : `$q^2 = ${Math.round(v * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 30);
      const m = r.int(nn, Math.min((nn * (nn - 1)) / 2, 4 * nn));
      const want = r.pick(["density", "mean degree"] as const);
      const v = want === "density" ? (2 * m) / (nn * (nn - 1)) : (2 * m) / nn;
      return n(`An undirected network has ${nn} nodes and ${m} edges. Find its ${want} (3 decimals).`, Math.round(v * 1000) / 1000, want === "density" ? `$2 \\times ${m}/(${nn} \\times ${nn - 1}) \\approx ${Math.round(v * 1000) / 1000}$.` : `$2 \\times ${m}/${nn} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const tf = r.int(1, 10);
      const N = r.pick([100, 1000, 10000]);
      const df = r.pick([1, 5, 10, 50]);
      const v = tf * Math.log(N / df);
      return n(`A term occurs ${tf} times in a document and appears in ${df} of ${N.toLocaleString("en-US")} documents. Find its TF-IDF using the natural log (3 decimals).`, Math.round(v * 1000) / 1000, `$${tf}\\ln(${N}/${df}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const h = r.pick([0.4, 0.5, 0.7, 0.8]);
      const t = r.pick(["height", "blood pressure", "reading ability", "weight"]);
      return mcNumbers(
        `${t[0].toUpperCase()}${t.slice(1)} has heritability ${h} in a population. This means`,
        { text: `${Math.round(h * 100)}% of the variation in ${t} across that population is associated with genetic differences`, why: "A population variance ratio." },
        [{ text: `${Math.round(h * 100)}% of each person's ${t} is caused by their genes`, why: "Heritability isn't about individuals.", misconception: "heritability-individual" }],
      );
    },
  },
];
