import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Factor analysis (EFA, CFA, rotation, SEM), ICA, multidimensional scaling, correspondence analysis, CCA and PLS. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "factor-analysis",
  title: "Factor analysis & latent-variable methods",
  summary: "Factor analysis explains the correlations among many observed variables by a few unobserved factors: x = Λf + ε. Each variable's variance splits into a communality (shared with the factors) and a uniqueness. Related methods find other hidden structure: ICA separates independent sources, MDS maps distances into a picture, CCA links two sets of variables.",
  deps: ["pca-practice", "covariance", "data-variables"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "factor loading", meaning: "The weight $\\lambda_{jk}$ linking observed variable $j$ to factor $k$; for standardised variables, their correlation." },
    { term: "communality", meaning: "The share of a variable's variance explained by the common factors, $h_j^2 = \\sum_k\\lambda_{jk}^2$." },
    { term: "rotation", meaning: "Re-expressing the factors as different combinations to make the loadings easier to interpret; the fit doesn't change." },
  ],
  misconceptions: {
    "fa-equals-pca": "Treats factor analysis and PCA as the same method.",
    "rotation-changes-fit": "Thinks rotating the factors changes how well the model fits the data.",
  },
  steps: [
    {
      type: "motivate",
      title: "Why do the scores move together?",
      body: "Pupils who do well in algebra tend to do well in geometry and physics too; those good at grammar tend to be good at spelling. Perhaps a few underlying abilities, unseen, drive many observed scores. Factor analysis tests that idea and estimates how strongly each score reflects each ability.",
      realWorld: {
        title: "Personality psychology",
        body: "The \"Big Five\" personality traits came from factor analyses of how people rate themselves on hundreds of descriptive words; five factors account for most of the correlations.",
      },
    },
    {
      type: "truth",
      statement: "The **factor model** writes standardised variables as $\\vec x = \\Lambda\\vec f + \\vec\\varepsilon$, with $k$ uncorrelated unit-variance factors $\\vec f$ and independent unique errors $\\vec\\varepsilon$. Then $\\operatorname{Cov}(\\vec x) = \\Lambda\\Lambda^{\\mathsf T} + \\Psi$, with $\\Psi$ diagonal: variable $j$ has **communality** $h_j^2 = \\sum_k\\lambda_{jk}^2$ and **uniqueness** $\\psi_j = 1 - h_j^2$.",
      body: "**Exploratory** factor analysis (EFA) lets the data suggest the factors; **confirmatory** (CFA) tests a structure fixed in advance, and **structural equation modelling** adds regressions among the factors. Loadings are determined only up to **rotation**: varimax rotation seeks loadings near 0 or ±1 for easier interpretation without changing the fit.",
    },
    {
      type: "predict",
      misconception: "fa-equals-pca",
      item: {
        kind: "mc",
        id: "fac-predict-1",
        prompt: "How does factor analysis differ from PCA?",
        options: [
          { id: "a", text: "FA models the shared variance with latent factors plus a unique error for each variable; PCA just finds directions of greatest total variance", correct: true, why: "One is a statistical model, the other a rotation of the data." },
          { id: "b", text: "They are the same method under two names", misconception: "fa-equals-pca", why: "PCA has no error term and no claim about latent causes." },
          { id: "c", text: "FA works only for two variables", why: "It is used for dozens or hundreds." },
        ],
      },
      reveal: {
        body: "PCA (§{pca-practice}) rewrites the data in new coordinates ordered by variance; its components are exact combinations of the variables, including all their noise. Factor analysis posits that the variables are noisy measurements of fewer latent traits, and separates each variable's variance into a common part and a unique part. When unique variances are small, the two give similar answers.",
      },
      resolve: {
        kind: "mc",
        id: "fac-resolve-1",
        prompt: "Which method includes a separate error term for each variable?",
        options: [
          { id: "a", text: "Factor analysis", correct: true, why: "The uniquenesses $\\psi_j$." },
          { id: "b", text: "PCA, since the two are identical", misconception: "fa-equals-pca", why: "PCA has no such term." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fac-check-1",
        prompt: "A two-factor solution is rotated by varimax. Compared with before, the model's fit to the correlations is",
        options: [
          { id: "a", text: "exactly the same; only the loadings' pattern changes", correct: true, why: "$\\Lambda R(\\Lambda R)^{\\mathsf T} = \\Lambda\\Lambda^{\\mathsf T}$ for a rotation $R$." },
          { id: "b", text: "better, which is why rotation is done", misconception: "rotation-changes-fit", why: "Rotation aids interpretation only." },
          { id: "c", text: "worse", why: "The implied covariance is unchanged." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fac-check-2",
        prompt: "A standardised variable loads 0.8 on a single factor. Its communality and uniqueness are",
        options: [
          { id: "a", text: "0.64 and 0.36", correct: true, why: "$0.8^2$ and $1 - 0.64$." },
          { id: "b", text: "0.8 and 0.2", why: "Communality is the squared loading." },
          { id: "c", text: "0.64 and 0.8", why: "They sum to 1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Latent-factor ideas drive recommender systems: matrix factorisation models each user and item by a few latent factors, whose dot product predicts a rating. Autoencoders and word embeddings learn latent representations in the same spirit, non-linearly.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "fac-produce-1", prompt: "Two standardised variables load 0.8 and 0.6 on a single common factor. Find their implied correlation.", answer: 0.48, explain: "$\\lambda_1\\lambda_2$." },
        { kind: "number", id: "fac-produce-2", prompt: "A variable loads 0.6 and 0.3 on two uncorrelated factors. Find its communality.", answer: 0.45, explain: "$0.36 + 0.09$." },
        {
          kind: "mc",
          id: "fac-produce-3",
          prompt: "Varimax rotation of a factor solution",
          options: [
            { id: "a", text: "makes loadings easier to interpret without changing the fit", correct: true, why: "It is a change of basis for the factors." },
            { id: "b", text: "improves the fit", misconception: "rotation-changes-fit", why: "The implied correlations are unchanged." },
          ],
        },
        {
          kind: "mc",
          id: "fac-produce-4",
          prompt: "A researcher believes 20 survey items measure 3 traits with measurement error. The fitting method is",
          options: [
            { id: "a", text: "factor analysis", correct: true, why: "It models latent traits plus item-specific error." },
            { id: "b", text: "PCA, which is the same thing", misconception: "fa-equals-pca", why: "PCA has no error model." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "fac-review-1", prompt: "A variable's communality is 0.7. Find its uniqueness.", answer: 0.3, explain: "$1 - 0.7$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "ICA and multidimensional scaling",
      body: "**Independent component analysis** assumes the observed signals are mixtures of statistically independent, non-normal sources and recovers them, as in separating voices recorded by several microphones (the cocktail-party problem). **Multidimensional scaling** places points in two or three dimensions so that their distances match given dissimilarities as closely as possible, turning a distance table into a map.",
    },
    {
      type: "definition",
      term: "correspondence analysis, CCA and PLS",
      body: "**Correspondence analysis** maps the rows and columns of a contingency table into the same low-dimensional picture, so associated categories plot near each other; **multiple** correspondence analysis does this for several categorical variables. **Canonical correlation analysis** finds combinations $\\vec a^{\\mathsf T}\\vec x$ and $\\vec b^{\\mathsf T}\\vec y$ of two variable sets with the largest correlation. **Partial least squares** finds latent directions in the predictors that best predict a response, useful with many correlated predictors.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "implied correlations",
      statement: "In a factor model with standardised variables and uncorrelated factors, the implied correlation between variables $i$ and $j$ is $\\sum_k\\lambda_{ik}\\lambda_{jk}$; with one factor, simply $\\lambda_i\\lambda_j$.",
      proof: ["$\\operatorname{Cov}(x_i, x_j) = \\operatorname{Cov}\\left(\\sum_k\\lambda_{ik}f_k + \\varepsilon_i, \\sum_k\\lambda_{jk}f_k + \\varepsilon_j\\right) = \\sum_k\\lambda_{ik}\\lambda_{jk}$, since the factors are uncorrelated with unit variance and the errors are independent of everything."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "rotation leaves the fit unchanged",
      statement: "For any orthogonal matrix $R$, the loadings $\\Lambda R$ give the same implied covariance as $\\Lambda$.",
      proof: ["$(\\Lambda R)(\\Lambda R)^{\\mathsf T} = \\Lambda RR^{\\mathsf T}\\Lambda^{\\mathsf T} = \\Lambda\\Lambda^{\\mathsf T}$, because $RR^{\\mathsf T} = I$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "how many factors",
      statement: "Common guides: keep factors whose eigenvalues of the correlation matrix exceed 1 (Kaiser's rule), look for an elbow in the scree plot, or use parallel analysis, which compares the eigenvalues with those from random data of the same size. Interpretability decides in the end.",
      proof: ["A factor with eigenvalue below 1 explains less variance than a single standardised variable, so keeping it adds little."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A test score loads 0.9 on a single \"ability\" factor. How much of its variance is shared, and how much unique?",
      solution: ["Communality $0.9^2 = 0.81$.", "Uniqueness $1 - 0.81 = 0.19$."],
      result: "81% shared, 19% unique.",
    },
    {
      type: "example",
      level: 2,
      title: "implied correlation",
      problem: "One factor; maths loads 0.8 and physics 0.7. What correlation does the model imply between them?",
      solution: ["$\\lambda_1\\lambda_2 = 0.8 \\times 0.7$.", "$= 0.56$."],
      result: "0.56.",
    },
    {
      type: "example",
      level: 3,
      title: "counting parameters",
      problem: "Ten standardised variables. How many correlations must a model explain, and how many free parameters does a two-factor model use?",
      solution: ["There are $\\binom{10}{2} = 45$ correlations.", "Two factors: $10 \\times 2 = 20$ loadings, minus 1 for rotational freedom, gives 19 parameters (uniquenesses follow from the communalities)."],
      result: "45 correlations; 19 free parameters.",
    },
  ],
  pitfalls: [
    { wrong: "Factor analysis is just PCA.", right: "FA models shared variance with latent factors and unique errors; PCA is a variance-ordered rotation." },
    { wrong: "Rotation improves the fit.", right: "It only changes how the loadings look." },
    { wrong: "The factors are real, measured things.", right: "They are inferred constructs; their names are interpretations." },
  ],
  formulas: [
    { label: "Model", tex: "\\vec x = \\Lambda\\vec f + \\vec\\varepsilon,\\quad \\operatorname{Cov}(\\vec x) = \\Lambda\\Lambda^{\\mathsf T} + \\Psi" },
    { label: "Communality", tex: "h_j^2 = \\textstyle\\sum_k\\lambda_{jk}^2,\\quad \\psi_j = 1 - h_j^2" },
    { label: "Implied correlation", tex: "\\textstyle\\sum_k\\lambda_{ik}\\lambda_{jk}" },
  ],
  exercises: [
    ex(1, num("facx-ex-1", "A variable loads 0.7 on one factor. Find its communality.", 0.49, "$0.7^2$."), ["$0.49$."]),
    ex(1, num("facx-ex-2", "Same variable. Find its uniqueness.", 0.51, "$1 - 0.49$."), ["$0.51$."]),
    ex(2, num("facx-ex-3", "One factor; loadings 0.9 and 0.5. Find the implied correlation.", 0.45, "$0.9 \\times 0.5$."), ["$0.45$."]),
    ex(2, num("facx-ex-4", "Two uncorrelated factors; variable A loads (0.6, 0.2), variable B loads (0.5, 0.4). Find the implied correlation.", 0.38, "$0.30 + 0.08$."), ["$0.6 \\times 0.5 + 0.2 \\times 0.4 = 0.38$."]),
    ex(2, num("facx-ex-5", "How many distinct correlations are there among 8 variables?", 28, "$\\binom82$."), ["$28$."]),
    ex(3, mc("facx-ex-6", "Two microphones record overlapping voices; you want each voice separately. Use", ["independent component analysis", "It separates independent non-normal sources."], [["PCA", "PCA finds uncorrelated directions, not independent sources."], ["factor analysis", "It doesn't target independent sources."]]), ["ICA solves the cocktail-party problem by maximising non-normality of the recovered signals."]),
    ex(3, mc("facx-ex-7", "A researcher has a table of how similar 20 brands seem to consumers and wants a map. Use", ["multidimensional scaling", "It turns dissimilarities into positions."], [["canonical correlation analysis", "That links two sets of variables."], ["Hotelling's $T^2$", "That tests a mean vector."]]), ["MDS places similar brands close together."]),
    ex(3, mc("facx-ex-8", "The eigenvalues of a correlation matrix are 3.2, 1.6, 0.9, 0.2, 0.1. Kaiser's rule keeps", ["2 factors", "Two eigenvalues exceed 1."], [["3 factors", "0.9 is below 1."], ["5 factors", "That keeps everything."]]), ["Check against a scree plot or parallel analysis too."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const l1 = r.pick([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      const l2 = lv === 1 ? 0 : r.pick([0.1, 0.2, 0.3, 0.4]);
      const h = l1 * l1 + l2 * l2;
      const want = r.pick(["communality", "uniqueness"] as const);
      const v = want === "communality" ? h : 1 - h;
      return n(lv === 1 ? `A standardised variable loads ${l1} on one factor. Find its ${want}.` : `A standardised variable loads ${l1} and ${l2} on two uncorrelated factors. Find its ${want}.`, r2(v), `Communality $${lv === 1 ? `${l1}^2` : `${l1}^2 + ${l2}^2`} = ${r2(h)}$${want === "uniqueness" ? `; uniqueness $1 - ${r2(h)} = ${r2(v)}$` : ""}.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      const b = r.pick([0.3, 0.5, 0.6, 0.7, 0.8]);
      return n(`One common factor; two standardised variables load ${a} and ${b}. Find their implied correlation.`, r2(a * b), `$${a} \\times ${b} = ${r2(a * b)}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const how = r.pick(["varimax", "promax", "quartimax"]);
      return mcNumbers(
        `After a ${how} rotation of a factor solution, the reproduced correlations are`,
        { text: "unchanged", why: "Rotation is a change of basis for the factors." },
        [
          { text: "closer to the observed ones", why: "Rotation doesn't change the fit.", misconception: "rotation-changes-fit" },
          { text: "further from the observed ones", why: "The fit is the same before and after." },
        ],
      );
    },
  },
];
