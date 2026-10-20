import type { ConceptNode, Unit } from "@/lib/content/types";
import { deepen } from "../deepen";
import { EVALUATION_DEPTH } from "./evaluation.depth";

const multiple: ConceptNode = {
  id: "multiple-regression",
  title: "Multiple regression & R²",
  summary: "ŷ = b + w₁x₁ + … + wₖxₖ, fitted by least squares. Each weight is the change in ŷ per unit of its feature with the others held fixed; R² = 1 − SSE/SST, and it can only rise as features are added.",
  deps: ["least-squares"],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "feature", meaning: "An input variable $x_j$ the model uses." },
    { term: "SSE", meaning: "Sum of squared errors: $\\sum (y - \\hat y)^2$, what the fit leaves unexplained." },
    { term: "SST", meaning: "Total sum of squares: $\\sum (y - \\bar y)^2$, the variation there was to explain." },
    { term: "R²", meaning: "1 − SSE/SST: the fraction of y's variation the model explains." },
  ],
  misconceptions: {
    "r2-always-better": "Thinks a higher training R² always means a better model, even when it came from adding useless features.",
    "coef-ignore-others": "Reads a coefficient without the \"holding the other features fixed\" part.",
  },
  steps: [
    {
      type: "motivate",
      title: "More than one cause",
      body: "House prices depend on size, *and* location, *and* age, *and* bedrooms. One line through one feature can't separate their effects. Multiple regression fits them all at once.",
      realWorld: {
        title: "Economics",
        body: "\"Each extra year of education adds 8% to earnings, holding experience fixed\" is a multiple-regression coefficient. The \"holding fixed\" part is the whole point.",
      },
    },
    {
      type: "explore",
      title: "Fit the line",
      body: "With one feature, regression is the line you fitted before. With k features it's a flat surface in k + 1 dimensions, fitted the same way.",
      widget: { kind: "fitline", points: [[1, 2], [2, 2.8], [3, 4.1], [4, 4.9], [5, 6.2]] },
      task: "Minimise the squared error. The sum of squared residuals you're left with is SSE; R² compares it with how spread out y is.",
    },
    {
      type: "truth",
      statement: "**Multiple regression**: $\\hat y = b + w_1x_1 + \\dots + w_kx_k$, with weights chosen to minimise SSE. Each $w_j$ is the change in ŷ for one unit of $x_j$ **with the other features held fixed**.",
      body: "$R^2 = 1 - \\text{SSE}/\\text{SST}$. Adding a feature can never raise training SSE, because least squares could always set its weight to 0, so training R² never falls, even for pure noise. Judge models on held-out data (or adjusted R²).",
    },
    {
      type: "predict",
      misconception: "r2-always-better",
      item: {
        kind: "mc",
        id: "mreg-predict-1",
        prompt: "You add 50 columns of random noise as features, and training R² rises from 0.70 to 0.78. Is the model better?",
        options: [
          { id: "a", text: "Probably worse: it's fitting noise that won't repeat on new data", correct: true, why: "Training R² can't go down when you add features." },
          { id: "b", text: "Yes: higher R² means a better model", misconception: "r2-always-better", why: "Training R² rewards any extra knob, useful or not." },
          { id: "c", text: "Impossible: noise can't raise R²", why: "It can: least squares uses noise to chase the training points." },
        ],
      },
      reveal: {
        body: "With more knobs, least squares can only match the training points more closely, so training R² can't drop. The extra 0.08 is the model memorising noise. On new data, those 50 random weights add error. Validation R² would have gone **down**.",
      },
      resolve: {
        kind: "mc",
        id: "mreg-resolve-1",
        prompt: "Why did training R² rise?",
        options: [
          { id: "a", text: "Extra features can only lower training error, useful or not", correct: true, why: "The fit could always ignore them." },
          { id: "b", text: "The noise must have contained real signal", misconception: "r2-always-better", why: "It was random; it only fits this sample." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mreg-check-1",
        prompt: "Price = 50 + 3 · size + 10 · bedrooms (in thousands). What does the 10 mean?",
        options: [
          { id: "a", text: "An extra bedroom adds 10k, for a house of the same size", correct: true, why: "The other features are held fixed." },
          { id: "b", text: "An extra bedroom adds 10k, whatever else changes", misconception: "coef-ignore-others", why: "Adding a bedroom usually adds size too, which has its own 3k per unit." },
          { id: "c", text: "Bedrooms are worth more than size", why: "The units differ; you can't compare raw weights like that." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mreg-check-2",
        prompt: "In a model with size and bedrooms, the bedroom coefficient is negative. Do more bedrooms lower prices?",
        options: [
          { id: "a", text: "Not overall: at a fixed size, more bedrooms means smaller rooms", correct: true, why: "The coefficient answers a \"same size\" question." },
          { id: "b", text: "Yes: bedrooms reduce value", misconception: "coef-ignore-others", why: "Alone, bedrooms probably correlate positively with price." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mreg-check-3",
        prompt: "SSE = 20 and SST = 100. What is R²?",
        options: [
          { id: "a", text: "0.8", correct: true, why: "1 − 20/100." },
          { id: "b", text: "0.2", why: "That's the unexplained fraction, SSE/SST." },
          { id: "c", text: "80", why: "R² is a fraction between 0 and 1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Linear regression is a neural network with one layer and no activation, and the score method of scikit-learn's LinearRegression returns R². Its weights solve $X^\\top X w = X^\\top y$: the solving-systems idea from linear algebra.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mreg-produce-1", prompt: "SSE = 30 and SST = 120. What is R²?", answer: 0.75, explain: "1 − 30/120." },
        { kind: "number", id: "mreg-produce-2", prompt: "ŷ = 5 + 2x₁ − x₂. Predict ŷ at x₁ = 3, x₂ = 4.", answer: 7, explain: "5 + 6 − 4." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "mreg-review-1", prompt: "R² = 0.64 and SST = 50. What is SSE?", answer: 18, explain: "SSE = (1 − 0.64) × 50." },
  ],
};

const logistic: ConceptNode = {
  id: "logistic-regression",
  title: "Logistic regression",
  summary: "Score z = b + w·x, then squash it to a probability with the sigmoid $\\sigma(z) = 1/(1 + e^{-z})$. A weight adds to the log-odds; training minimises cross-entropy.",
  deps: ["multiple-regression", "loss-functions", "gradient-descent"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "sigmoid σ", meaning: "$\\sigma(z) = 1/(1 + e^{-z})$: turns any number into a probability between 0 and 1." },
    { term: "odds", meaning: "p/(1 − p). A probability of 0.75 is odds of 3 (3 to 1)." },
    { term: "log-odds", meaning: "ln(p/(1 − p)). Logistic regression makes this linear in the features." },
  ],
  misconceptions: {
    "logit-linear-prob": "Treats the linear score z as the probability, instead of σ(z).",
    "log-odds-coef": "Reads a logistic coefficient as a change in probability rather than in log-odds.",
  },
  steps: [
    {
      type: "motivate",
      title: "Predicting yes or no",
      body: "Will this customer churn? Is this email spam? A straight line can predict 1.4 or −0.3, which are meaningless as probabilities. We need a model whose output always lands between 0 and 1.",
      realWorld: {
        title: "Credit scoring",
        body: "Many credit scorecards are logistic regressions underneath: points per feature add up to a log-odds of default.",
      },
    },
    {
      type: "explore",
      title: "Scores, a threshold, and errors",
      body: "Each bar counts examples by the model's predicted probability. Anything at or above the threshold is predicted positive.",
      widget: { kind: "threshold" },
      task: "Slide the threshold from 0.5 to 0.8. What happens to the false positives, and to the true positives?",
    },
    {
      type: "truth",
      statement: "**Logistic regression**: compute $z = b + w_1x_1 + \\dots + w_kx_k$ and predict $p = \\sigma(z) = \\dfrac{1}{1 + e^{-z}}$. Then $\\sigma(0) = 0.5$, large positive z gives p near 1, and large negative z gives p near 0.",
      body: "Equivalently, the log-odds $\\ln\\frac{p}{1-p}$ equals z, so increasing $x_j$ by 1 **adds $w_j$ to the log-odds** (multiplies the odds by $e^{w_j}$). Weights are fitted by minimising cross-entropy, which is maximum likelihood for yes/no data, using gradient descent.",
    },
    {
      type: "predict",
      misconception: "logit-linear-prob",
      item: {
        kind: "mc",
        id: "logit-predict-1",
        prompt: "A spam model's score for an email is z = 0. What's the predicted probability that it's spam?",
        options: [
          { id: "a", text: "0.5", correct: true, why: "$\\sigma(0) = 1/(1 + 1)$." },
          { id: "b", text: "0", misconception: "logit-linear-prob", why: "z isn't a probability; σ(z) is." },
          { id: "c", text: "1", why: "Positive scores push towards 1; zero sits on the fence." },
        ],
      },
      reveal: {
        body: "σ squashes any score into (0, 1). z = 0 is the fence, exactly 0.5. z = 2.5 gives about 0.92 and z = −2.5 about 0.08. The score z is a log-odds, not a probability.",
        widget: { kind: "threshold" },
      },
      resolve: {
        kind: "mc",
        id: "logit-resolve-1",
        prompt: "Which part of the model is the probability?",
        options: [
          { id: "a", text: "σ(z), which turns any score into a probability", correct: true, why: "z itself can be any real number." },
          { id: "b", text: "z itself", misconception: "logit-linear-prob", why: "z can be −7 or 12: not probabilities." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "logit-check-1",
        prompt: "z = 2.5. What is the predicted probability?",
        options: [
          { id: "a", text: "About 0.92", correct: true, why: "$1/(1 + e^{-2.5}) \\approx 0.924$." },
          { id: "b", text: "2.5", misconception: "logit-linear-prob", why: "Probabilities can't exceed 1. Apply σ." },
          { id: "c", text: "About 0.08", why: "That's σ(−2.5)." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "logit-check-2",
        prompt: "In a spam model, the weight on \"contains the word free\" is 0.7. Each such email's…",
        options: [
          { id: "a", text: "Log-odds of spam go up by 0.7 (odds roughly double)", correct: true, why: "$e^{0.7} \\approx 2.0$." },
          { id: "b", text: "Probability of spam goes up by 0.7", misconception: "log-odds-coef", why: "That could push p above 1. Weights act on the log-odds." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "logit-check-3",
        prompt: "A feature's weight is ln 3 ≈ 1.10. Raising that feature by 1 multiplies the odds by…",
        options: [
          { id: "a", text: "3", correct: true, why: "$e^{\\ln 3} = 3$." },
          { id: "b", text: "Nothing: it adds 1.10 to the probability", misconception: "log-odds-coef", why: "It adds 1.10 to the log-odds." },
          { id: "c", text: "1.10", why: "Exponentiate the weight to get the odds multiplier." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Logistic regression is a single neuron with a sigmoid activation, trained with binary cross-entropy. It's exactly the last layer of most neural-network classifiers; the layers below just learn better features to feed it.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "logit-produce-1", prompt: "What is σ(0)?", answer: 0.5, explain: "1/(1 + 1)." },
        { kind: "number", id: "logit-produce-2", prompt: "The odds are 3 (3 to 1). What is the probability?", answer: 0.75, explain: "odds/(1 + odds) = 3/4." },
        { kind: "number", id: "logit-produce-3", prompt: "p = 0.8. What are the odds?", answer: 4, explain: "0.8 / 0.2." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "logit-review-1", prompt: "σ(−2.5), to two decimals?", answer: 0.08, tolerance: 0.01, explain: "$1/(1 + e^{2.5}) \\approx 0.076$." },
  ],
};

const regularization: ConceptNode = {
  id: "regularization",
  title: "Ridge & lasso",
  summary: "Add a penalty on weight size to the squared error: ridge ($\\lambda\\sum w^2$) shrinks every weight, lasso ($\\lambda\\sum |w|$) sets some exactly to 0. Training error rises a little so test error can fall.",
  deps: ["multiple-regression"],
  pos: { x: 1, y: 2 },
  glossary: [
    { term: "regularisation", meaning: "Penalising model complexity to stop it fitting noise." },
    { term: "λ", meaning: "How strong the penalty is. λ = 0 is plain least squares." },
  ],
  misconceptions: {
    "reg-improves-train": "Expects regularisation to lower training error, when it raises it to lower test error.",
    "ridge-zeroes": "Thinks ridge sets coefficients exactly to zero (that's lasso).",
  },
  steps: [
    {
      type: "motivate",
      title: "500 features, 200 rows",
      body: "With more features than data points, least squares can fit the training data perfectly, and the weights go wild. We need to tell the model to prefer small, simple weights unless the data really insists.",
      realWorld: {
        title: "Genomics",
        body: "Predicting disease from 20,000 genes and a few hundred patients is only possible with a penalty. Lasso picks out a handful of genes that matter.",
      },
    },
    {
      type: "truth",
      statement: "**Ridge**: minimise $\\text{SSE} + \\lambda\\sum_j w_j^2$. **Lasso**: minimise $\\text{SSE} + \\lambda\\sum_j |w_j|$. Bigger λ means smaller weights and a simpler model.",
      body: "Ridge shrinks all weights towards 0 but rarely to exactly 0. Lasso's corners push some weights to **exactly 0**: built-in feature selection. Standardise features first so the penalty treats them fairly, don't penalise the intercept, and choose λ by validation.",
    },
    {
      type: "predict",
      misconception: "reg-improves-train",
      item: {
        kind: "mc",
        id: "reg-predict-1",
        prompt: "You add a ridge penalty (λ > 0) to an overfitting linear model. Its *training* error…",
        options: [
          { id: "a", text: "Goes up", correct: true, why: "Least squares already had the lowest possible training error." },
          { id: "b", text: "Goes down", misconception: "reg-improves-train", why: "The penalty pulls the weights away from the best training fit." },
          { id: "c", text: "Stays exactly the same", why: "The weights change, so the fit changes." },
        ],
      },
      reveal: {
        body: "Without a penalty, least squares sits at the lowest training error there is. Any penalty pulls the weights away from that point, so training error rises a little. The payoff is on new data: the model stops chasing noise and **test** error usually falls.",
      },
      resolve: {
        kind: "mc",
        id: "reg-resolve-1",
        prompt: "So why regularise at all?",
        options: [
          { id: "a", text: "To trade a little training error for less overfitting and lower test error", correct: true, why: "That's the point." },
          { id: "b", text: "Because penalties make every error smaller", misconception: "reg-improves-train", why: "They make training error bigger." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "reg-check-1",
        prompt: "You want a model that uses only a few of 500 features. Which method?",
        options: [
          { id: "a", text: "Lasso", correct: true, why: "It sets many weights exactly to 0." },
          { id: "b", text: "Ridge", misconception: "ridge-zeroes", why: "Ridge shrinks weights but keeps them all non-zero." },
          { id: "c", text: "Plain least squares", why: "That uses every feature, with wild weights." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "reg-check-2",
        prompt: "After ridge with a large λ, how many coefficients are typically exactly 0?",
        options: [
          { id: "a", text: "None: they shrink towards 0 without reaching it", correct: true, why: "The squared penalty is gentle near 0." },
          { id: "b", text: "Most of them", misconception: "ridge-zeroes", why: "That's lasso's behaviour." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "reg-check-3",
        prompt: "λ = 2 and weights (1, −3). What is the ridge penalty $\\lambda\\sum w^2$?",
        options: [
          { id: "a", text: "20", correct: true, why: "2 × (1 + 9)." },
          { id: "b", text: "8", why: "That's the lasso penalty, 2 × (1 + 3)." },
          { id: "c", text: "−16", why: "Squares are never negative." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Weight decay in neural networks is ridge's penalty: in PyTorch it's the weight_decay argument of the optimiser. Dropout and early stopping are other regularisers with the same goal: worse on training data, better on new data.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "reg-produce-1", prompt: "λ = 0.5 and weights (2, −4, 0). What is the lasso penalty $\\lambda\\sum|w|$?", answer: 3, explain: "0.5 × 6." },
        {
          kind: "mc",
          id: "reg-produce-2",
          prompt: "In ridge, as λ grows without limit, the weights…",
          options: [
            { id: "a", text: "All shrink towards 0", correct: true, why: "The penalty dominates the squared error." },
            { id: "b", text: "Grow", why: "Bigger weights would cost more." },
            { id: "c", text: "Stay the same", why: "λ changes what's being minimised." },
          ],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "reg-review-1", prompt: "λ = 1 and weights (3, 4). What is the ridge penalty?", answer: 25, explain: "9 + 16." },
  ],
};

const cv: ConceptNode = {
  id: "cross-validation",
  title: "Train, validation, test & cross-validation",
  summary: "Tune on validation data, ideally k-fold cross-validation, and touch the test set once. Anything fitted on all the data before splitting (scaling, feature selection) leaks the answers.",
  deps: ["regularization"],
  pos: { x: 2, y: 2 },
  glossary: [
    { term: "validation set", meaning: "Held-out data for choosing settings such as λ or model size." },
    { term: "test set", meaning: "Held-out data used once, at the end, to estimate real-world performance." },
    { term: "k-fold cross-validation", meaning: "Split into k folds; train on k − 1, validate on the remaining one; rotate and average." },
    { term: "leakage", meaning: "Information from the evaluation data sneaking into training." },
  ],
  misconceptions: {
    "tune-on-test": "Tunes choices on the test set, then reports its score as if it were unseen data.",
    "leak-preprocess": "Fits preprocessing (scaling, feature selection) on all the data before splitting it.",
  },
  steps: [
    {
      type: "motivate",
      title: "Grading your own homework",
      body: "A model always looks good on the data it trained on. To know how it will do on tomorrow's data, you have to keep some data out of its sight, and keep it out honestly.",
      realWorld: {
        title: "Kaggle leaderboards",
        body: "Competitions keep a private test set hidden until the end. Teams that tuned against the public leaderboard routinely drop dozens of places when the private scores appear.",
      },
    },
    {
      type: "truth",
      statement: "Split into **train** (fit the weights), **validation** (choose settings) and **test** (estimate performance, used once). **k-fold cross-validation** reuses data: train on k − 1 folds, validate on the last, rotate k times and average.",
      body: "Every step that learns from data (scaling, imputing, feature selection) must be fitted on the training part only, inside each fold. Otherwise the evaluation data leaks into the model and scores come out optimistic.",
    },
    {
      type: "predict",
      misconception: "tune-on-test",
      item: {
        kind: "mc",
        id: "cv-predict-1",
        prompt: "You try 200 hyperparameter settings and report the best test accuracy: 94%. On truly new data, expect…",
        options: [
          { id: "a", text: "Probably a bit below 94%", correct: true, why: "You picked the luckiest of 200 scores." },
          { id: "b", text: "94%: it's test data", misconception: "tune-on-test", why: "Once you choose by it, it isn't unseen any more." },
          { id: "c", text: "Above 94%", why: "Selection makes the reported score optimistic, not pessimistic." },
        ],
      },
      reveal: {
        body: "Each test score is truth plus a bit of luck. Choosing the best of 200 picks the one with the most luck, so the test set has quietly become part of training. Choose with validation (or cross-validation) and open the test set once.",
      },
      resolve: {
        kind: "mc",
        id: "cv-resolve-1",
        prompt: "What went wrong?",
        options: [
          { id: "a", text: "Choosing by test score let luck leak into the choice", correct: true, why: "The test set stopped being independent." },
          { id: "b", text: "Nothing: the test set is unseen, so its score stays honest", misconception: "tune-on-test", why: "It was seen through the choice." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cv-check-1",
        prompt: "You standardise all 10,000 rows, then split into train and test. Problem?",
        options: [
          { id: "a", text: "The test rows' mean and SD leaked into training", correct: true, why: "Fit the scaler on the training rows only." },
          { id: "b", text: "None: scaling isn't learning", misconception: "leak-preprocess", why: "It estimates a mean and SD from data: that's learning." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cv-check-2",
        prompt: "You pick the 20 features most correlated with the label using all the data, then cross-validate. The CV score will be…",
        options: [
          { id: "a", text: "Optimistic: feature choice already saw the validation folds", correct: true, why: "Selection must happen inside each fold." },
          { id: "b", text: "Honest: cross-validation handles it", misconception: "leak-preprocess", why: "CV only protects steps that run inside it." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cv-check-3",
        prompt: "5-fold cross-validation on 1,000 rows. How many rows does each model train on?",
        options: [
          { id: "a", text: "800", correct: true, why: "4 of the 5 folds of 200." },
          { id: "b", text: "200", why: "That's the validation fold." },
          { id: "c", text: "1,000", why: "One fold is always held out." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "scikit-learn's Pipeline plus cross_val_score refits the scaler and feature selector inside each fold, which prevents exactly these leaks. Time series need forward-chaining splits instead: never train on the future.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cv-produce-1", prompt: "10-fold cross-validation on 500 rows. How many rows are in each validation fold?", answer: 50, explain: "500 / 10." },
        { kind: "number", id: "cv-produce-2", prompt: "Fold scores are 0.80, 0.84, 0.82, 0.86 and 0.78. What is the cross-validation score?", answer: 0.82, explain: "Their average: 4.10 / 5." },
        {
          kind: "mc",
          id: "cv-produce-3",
          prompt: "When should you look at the test set?",
          options: [
            { id: "a", text: "Once, after every choice is made", correct: true, why: "Then its score is an honest estimate." },
            { id: "b", text: "After each tuning round, to see progress", misconception: "tune-on-test", why: "Then you're tuning on it." },
          ],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "cv-review-1", prompt: "4-fold cross-validation on 200 rows. How many rows does each model train on?", answer: 150, explain: "3 folds of 50." },
  ],
};

const biasVariance: ConceptNode = {
  id: "bias-variance",
  title: "The bias–variance trade-off",
  summary: "Expected test error = bias² + variance + noise. Too simple: high bias, bad on train and test. Too flexible: high variance, great on train, bad on test. More data cures variance, not bias.",
  deps: ["cross-validation"],
  pos: { x: 3, y: 2 },
  glossary: [
    { term: "bias", meaning: "Error from a model too simple to capture the pattern (underfitting)." },
    { term: "variance", meaning: "Error from a model so flexible it changes a lot with each training sample (overfitting)." },
    { term: "irreducible noise", meaning: "Randomness in the data that no model can predict." },
  ],
  misconceptions: {
    "more-complex-better": "Thinks a more complex model is better whenever it fits the training data better.",
    "more-data-fixes-bias": "Thinks more data will fix an underfitting (high-bias) model.",
  },
  steps: [
    {
      type: "motivate",
      title: "Too simple, too clever",
      body: "A straight line through a curved pattern misses it every time. A wiggly curve through every training point nails them all and then predicts nonsense in between. Good models live in between.",
      realWorld: {
        title: "Weather forecasting",
        body: "\"Tomorrow will be like today\" is a high-bias forecast. A model tuned to every quirk of last year's data is high-variance. Forecasters ensemble many models to cut the variance.",
      },
    },
    {
      type: "truth",
      statement: "Expected test error = **bias²** + **variance** + irreducible noise.",
      body: "**High bias** (underfitting): training and validation errors are both high and close together. Fix with a more flexible model or better features. **High variance** (overfitting): training error is low and validation error much higher. Fix with more data, regularisation or a simpler model. More data shrinks variance; it can't make a straight line bend.",
    },
    {
      type: "predict",
      misconception: "more-complex-better",
      item: {
        kind: "mc",
        id: "bv-predict-1",
        prompt: "A degree-15 polynomial has training error 0.01 and validation error 2.4. A straight line has 0.30 and 0.35. Which do you ship?",
        options: [
          { id: "a", text: "The straight line", correct: true, why: "Validation error estimates performance on new data." },
          { id: "b", text: "The polynomial: it fits much better", misconception: "more-complex-better", why: "It fits the *training* data better, then fails on new data." },
        ],
      },
      reveal: {
        body: "The polynomial memorised the training points: low bias, huge variance. Its 0.01 training error is the giveaway gap, not an achievement. The line's train and validation errors are close, so its performance will carry over to new data.",
      },
      resolve: {
        kind: "mc",
        id: "bv-resolve-1",
        prompt: "Which model is better?",
        options: [
          { id: "a", text: "The one that does best on data it hasn't seen", correct: true, why: "That's the data you'll actually face." },
          { id: "b", text: "The one with the lowest training error", misconception: "more-complex-better", why: "Training error rewards memorising." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bv-check-1",
        prompt: "Training error 30%, validation error 31%, target 5%. Will ten times more data help much?",
        options: [
          { id: "a", text: "No: the model is underfitting; make it more flexible", correct: true, why: "Train and validation agree: it's bias, not variance." },
          { id: "b", text: "Yes: more data always helps", misconception: "more-data-fixes-bias", why: "More data won't help a model that can't fit the training set." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bv-check-2",
        prompt: "Training error 1%, validation error 25%. What will help most?",
        options: [
          { id: "a", text: "More data or regularisation", correct: true, why: "A big gap means high variance." },
          { id: "b", text: "A bigger, more flexible model", misconception: "more-complex-better", why: "That makes overfitting worse." },
          { id: "c", text: "Nothing: it's underfitting", why: "1% training error isn't underfitting." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bv-check-3",
        prompt: "A straight-line model can't capture a curved pattern. You collect a million more rows. The pattern is now…",
        options: [
          { id: "a", text: "Still missed: a line can't bend, however much data it sees", correct: true, why: "That's bias." },
          { id: "b", text: "Captured: enough data fixes it", misconception: "more-data-fixes-bias", why: "Data reduces variance, not the model's inability to bend." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Learning curves (training and validation error against training set size) diagnose this. A gap that closes as data grows means variance; two curves that flatten out high together mean bias. Big neural networks complicate the story (\"double descent\"), but the diagnosis still starts here.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "bv-produce-1", prompt: "bias² = 4, variance = 3 and noise = 1. Expected test error?", answer: 8, explain: "4 + 3 + 1." },
        {
          kind: "mc",
          id: "bv-produce-2",
          prompt: "Increasing λ in ridge regression moves a model towards…",
          options: [
            { id: "a", text: "Higher bias, lower variance", correct: true, why: "Smaller weights mean a simpler, steadier model." },
            { id: "b", text: "Lower bias, higher variance", why: "That's what lowering λ does." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "bv-review-1",
      prompt: "Training and validation errors are both high and almost equal. The model has…",
      options: [
        { id: "a", text: "High bias (underfitting)", correct: true, why: "It can't even fit the training data." },
        { id: "b", text: "High variance", why: "Variance shows up as a big train–validation gap." },
      ],
    },
  ],
};

const precisionRecall: ConceptNode = {
  id: "precision-recall",
  title: "Precision, recall & F1",
  summary: "Precision = TP/(TP + FP): of those flagged, how many were right. Recall = TP/(TP + FN): of the real positives, how many were found. On imbalanced data, accuracy hides failure.",
  deps: ["logistic-regression", "conditional-probability"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "TP, FP, FN, TN", meaning: "True positives, false positives, false negatives, true negatives: the four cells of the confusion matrix." },
    { term: "precision", meaning: "TP/(TP + FP): when the model says yes, how often it's right." },
    { term: "recall", meaning: "TP/(TP + FN): of all the real yeses, the fraction it finds." },
    { term: "F1", meaning: "The harmonic mean of precision and recall: 2PR/(P + R)." },
  ],
  misconceptions: {
    "accuracy-imbalanced": "Trusts accuracy on imbalanced data, where always predicting the majority class looks excellent.",
    "precision-recall-swap": "Mixes up precision (of those flagged, how many are right) with recall (of the real positives, how many were found).",
  },
  steps: [
    {
      type: "motivate",
      title: "99% accurate and useless",
      body: "Only 1 in 100 transactions is fraud. A \"model\" that always says \"not fraud\" is 99% accurate and catches nothing. We need metrics that look at the positives directly.",
      realWorld: {
        title: "Cancer screening",
        body: "Screening programmes are judged on how many cancers they find (recall) and how many of their alarms are real (precision), not on accuracy.",
      },
    },
    {
      type: "explore",
      title: "Rare positives",
      body: "Here positives are rare: 20 of 500.",
      widget: { kind: "threshold", imbalanced: true },
      task: "Slide the threshold up and down. Watch accuracy, precision and recall. Which one barely moves?",
    },
    {
      type: "truth",
      statement: "**Precision** = TP/(TP + FP). **Recall** = TP/(TP + FN). **F1** = 2PR/(P + R).",
      body: "Raising the threshold usually raises precision (fewer, surer alarms) and lowers recall (more misses). Precision is P(really positive | flagged); recall is P(flagged | really positive): two different conditional probabilities. With rare positives, accuracy is dominated by the easy negatives.",
    },
    {
      type: "predict",
      misconception: "accuracy-imbalanced",
      item: {
        kind: "mc",
        id: "pr-predict-1",
        prompt: "Fraud is 1% of transactions. A model that predicts \"not fraud\" for everything has 99% accuracy. Is it a good fraud model?",
        options: [
          { id: "a", text: "No: its recall is 0", correct: true, why: "It finds none of the fraud." },
          { id: "b", text: "Yes: 99% is excellent", misconception: "accuracy-imbalanced", why: "Accuracy is high only because fraud is rare." },
        ],
      },
      reveal: {
        body: "Drag the threshold all the way right: nothing is flagged, recall drops to 0, and accuracy still reads 96%, because 96% of examples are negative. With rare positives, accuracy mostly measures how many easy negatives there are.",
        widget: { kind: "threshold", imbalanced: true },
      },
      resolve: {
        kind: "mc",
        id: "pr-resolve-1",
        prompt: "Which metric exposes the do-nothing model?",
        options: [
          { id: "a", text: "Recall: it finds none of the fraud", correct: true, why: "TP = 0." },
          { id: "b", text: "Accuracy: 99% says it all", misconception: "accuracy-imbalanced", why: "It says almost nothing here." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pr-check-1",
        prompt: "A cancer screen flags 100 people, and 20 of them have cancer. That 20% is the…",
        options: [
          { id: "a", text: "Precision", correct: true, why: "Of those flagged, the fraction who really are positive." },
          { id: "b", text: "Recall", misconception: "precision-recall-swap", why: "Recall would ask what fraction of *all* cancers were flagged." },
          { id: "c", text: "Accuracy", why: "Accuracy counts the unflagged people too." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pr-check-2",
        prompt: "There are 50 fraud cases and the model catches 40 of them. That 80% is the…",
        options: [
          { id: "a", text: "Recall", correct: true, why: "Of the real positives, the fraction found." },
          { id: "b", text: "Precision", misconception: "precision-recall-swap", why: "Precision would ask how many of its *alarms* were fraud." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pr-check-3",
        prompt: "Precision 0.5 and recall 1. What is F1?",
        options: [
          { id: "a", text: "About 0.67", correct: true, why: "2 × 0.5 × 1 / 1.5." },
          { id: "b", text: "0.75", why: "That's the ordinary average. F1 is the harmonic mean, pulled towards the weaker one." },
          { id: "c", text: "0.5", why: "That's just the precision." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Pick the metric from the costs. A cancer screen wants high recall (don't miss cases), with follow-up tests to fix precision. A spam filter wants high precision (don't bin real email). Then set the threshold to get there.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pr-produce-1", prompt: "TP = 30 and FP = 10. Precision?", answer: 0.75, explain: "30 / 40." },
        { kind: "number", id: "pr-produce-2", prompt: "TP = 30 and FN = 20. Recall?", answer: 0.6, explain: "30 / 50." },
        { kind: "number", id: "pr-produce-3", prompt: "Precision = recall = 0.6. F1?", answer: 0.6, explain: "When they're equal, F1 equals both." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "pr-review-1", prompt: "TP = 8, FP = 2, FN = 8. F1, to two decimals?", answer: 8 / 13, tolerance: 0.01, explain: "P = 0.8, R = 0.5, F1 = 0.8/1.3 ≈ 0.62." },
  ],
};

const roc: ConceptNode = {
  id: "roc-auc",
  title: "ROC curves & AUC",
  summary: "The ROC curve plots recall (true positive rate) against the false positive rate as the threshold sweeps. AUC is the chance that a random positive outscores a random negative: 1 is perfect, 0.5 is guessing.",
  deps: ["precision-recall"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "TPR", meaning: "True positive rate = recall = TP/(TP + FN)." },
    { term: "FPR", meaning: "False positive rate = FP/(FP + TN): the fraction of negatives wrongly flagged." },
    { term: "AUC", meaning: "Area under the ROC curve, between 0 and 1." },
  ],
  misconceptions: {
    "auc-threshold": "Thinks AUC changes with the chosen threshold, when it summarises every threshold at once.",
    "auc-half-decent": "Thinks an AUC around 0.5 is a decent model, when it's no better than guessing.",
  },
  steps: [
    {
      type: "motivate",
      title: "Judging scores, not one threshold",
      body: "Precision and recall depend on where you put the threshold. Before you choose one, it's useful to ask a threshold-free question: how well does the model *rank* positives above negatives at all?",
      realWorld: {
        title: "Radar",
        body: "ROC curves were invented for WWII radar operators, to measure how well a receiver separated enemy aircraft from noise at every sensitivity setting.",
      },
    },
    {
      type: "explore",
      title: "Walk along the curve",
      body: "The dot on the ROC curve is the current threshold.",
      widget: { kind: "threshold" },
      task: "Sweep the threshold from 0 to 1. The dot travels the curve from (1, 1) to (0, 0). Does the AUC number ever change?",
    },
    {
      type: "truth",
      statement: "The **ROC curve** plots TPR against FPR as the threshold sweeps from high to low. **AUC**, the area under it, is the probability that a randomly chosen positive gets a higher score than a randomly chosen negative.",
      body: "AUC = 1 is a perfect ranking; 0.5 is no better than coin flips (the diagonal). It doesn't depend on any threshold or on calibration. When positives are rare, look at precision–recall too: a tiny FPR can still mean many false alarms.",
    },
    {
      type: "predict",
      misconception: "auc-threshold",
      item: {
        kind: "mc",
        id: "roc-predict-1",
        prompt: "You move a classifier's threshold from 0.5 to 0.7. Its AUC…",
        options: [
          { id: "a", text: "Stays the same", correct: true, why: "AUC summarises all thresholds at once." },
          { id: "b", text: "Goes up", misconception: "auc-threshold", why: "The threshold moves you along the curve; it doesn't change the curve." },
          { id: "c", text: "Goes down", misconception: "auc-threshold", why: "The curve, and its area, don't move." },
        ],
      },
      reveal: {
        body: "Watch the dot slide along the curve as you move the threshold, while the curve and the AUC stay put. AUC grades the scores themselves: how well they separate the two classes across every possible cut-off.",
        widget: { kind: "threshold" },
      },
      resolve: {
        kind: "mc",
        id: "roc-resolve-1",
        prompt: "What does AUC summarise?",
        options: [
          { id: "a", text: "The whole curve, across all thresholds", correct: true, why: "That's why it's threshold-free." },
          { id: "b", text: "The point at the current threshold", misconception: "auc-threshold", why: "That point gives one TPR and one FPR, not an area." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "roc-check-1",
        prompt: "A model's AUC is 0.5. That means…",
        options: [
          { id: "a", text: "It ranks positives above negatives no better than a coin flip", correct: true, why: "The ROC curve is the diagonal." },
          { id: "b", text: "It's right half the time, which is decent", misconception: "auc-half-decent", why: "Random guessing gets 0.5." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "roc-check-2",
        prompt: "Model A has AUC 0.52 and model B has AUC 0.85. Model A is…",
        options: [
          { id: "a", text: "Barely better than random guessing", correct: true, why: "0.5 is the coin-flip baseline." },
          { id: "b", text: "Decent: it's above 0.5", misconception: "auc-half-decent", why: "0.52 is almost no separation at all." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "roc-check-3",
        prompt: "FP = 10 and TN = 90. What is the false positive rate?",
        options: [
          { id: "a", text: "0.1", correct: true, why: "10 / (10 + 90)." },
          { id: "b", text: "0.9", why: "That's the true negative rate (specificity)." },
          { id: "c", text: "About 0.11", why: "Divide by all negatives, FP + TN." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "AUC is a standard metric for ranking problems such as ad clicks and credit risk. It ignores calibration: scores of 0.51 against 0.49 and 0.99 against 0.01 can give the same AUC, so check calibration separately if the probabilities themselves matter.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "roc-produce-1", prompt: "FP = 5 and TN = 45. False positive rate?", answer: 0.1, explain: "5 / 50." },
        { kind: "number", id: "roc-produce-2", prompt: "TP = 40 and FN = 10. True positive rate?", answer: 0.8, explain: "40 / 50." },
        { kind: "number", id: "roc-produce-3", prompt: "A model scores every positive above every negative. What is its AUC?", answer: 1, explain: "A perfect ranking." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "roc-review-1", prompt: "In 100 random (positive, negative) pairs, a model scores the positive higher in 83. Estimate its AUC.", answer: 0.83, explain: "AUC is P(positive outscores negative)." },
  ],
};

export const evaluationUnit: Unit = {
  id: "ml-1",
  track: "Machine learning",
  title: "Regression & Evaluation",
  blurb: "Multiple and logistic regression, regularisation, honest validation, and the metrics that matter.",
  nodes: [multiple, logistic, regularization, cv, biasVariance, precisionRecall, roc].map((n) => deepen(n, EVALUATION_DEPTH[n.id])),
};
