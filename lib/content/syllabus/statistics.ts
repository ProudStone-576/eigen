/**
 * The full statistics syllabus, topic by topic, mapped to the section that
 * teaches it. A topic is covered when its section exists in the course; the
 * others point at a planned section (PLANNED below), so the map doubles as the
 * build roadmap. tests/syllabus.test.ts checks every id is real or planned.
 */

export type Topic = [name: string, section: string];
export type Area = { title: string; topics: Topic[] };

/** Sections still to be written, with the chapter each will join. */
export const PLANNED: Record<string, { title: string; chapter: string }> = {
  // Distributions & estimation
  // Testing, association, regression
  // ANOVA, nonparametric, robust
  // Bayesian, multivariate
  // Time series, causal, survival
  // Learning, theory, computing, practice
  "monte-carlo": { title: "Monte Carlo simulation", chapter: "Statistical Computing & Practice" },
  "statistical-computing": { title: "Computing at scale & reproducibility", chapter: "Statistical Computing & Practice" },
  "applied-fields": { title: "Statistics in the field", chapter: "Statistical Computing & Practice" },
};

const T = (section: string, ...names: string[]): Topic[] => names.map((n) => [n, section]);

export const STATISTICS_SYLLABUS: Area[] = [
  {
    title: "Foundations of Statistics",
    topics: [
      ...T("data-variables", "Definition, purpose, and scope of statistics", "Descriptive vs. inferential statistics", "Population and sample", "Census and sample survey", "Parameter and statistic", "Observation, variable, and data point", "Qualitative and quantitative data", "Categorical and numerical variables", "Discrete and continuous variables", "Independent and dependent variables", "Explanatory and response variables", "Latent and observed variables", "Cross-sectional, longitudinal, and time-series data", "Measurement scales: nominal, ordinal, interval, ratio", "Sampling error and measurement error", "Reproducibility and replicability", "Exploratory data analysis (EDA)", "Confirmatory data analysis", "Statistical assumptions"),
      ...T("hypothesis-tests", "Statistical significance vs. practical significance"),
      ...T("correlation-causation", "Confounding variables", "Correlation vs. causation"),
      ...T("standard-error", "Statistical uncertainty"),
      ...T("bias-variance", "Bias and variance"),
    ],
  },
  {
    title: "Data Collection and Sampling",
    topics: [
      ...T("sampling-methods", "Primary and secondary data", "Sampling frames", "Simple random sampling", "Systematic sampling", "Stratified sampling", "Cluster sampling", "Multistage sampling", "Sampling with and without replacement"),
      ...T("sampling-bias", "Surveys and questionnaires", "Convenience sampling", "Voluntary response sampling", "Purposive sampling", "Snowball sampling", "Sampling bias", "Nonresponse bias", "Selection bias", "Survivorship bias", "Recall bias", "Response bias"),
      ...T("experiment-design", "Observational studies", "Controlled experiments", "Randomized controlled trials", "Experimental units and treatments", "Randomization and blinding", "Blocking and matched-pair designs", "Factorial experimental designs"),
      ...T("survey-design", "Coverage error", "Finite population correction", "Weighting and survey weights", "Post-stratification", "Oversampling and undersampling"),
      ...T("confidence-intervals", "Sample size determination"),
      ...T("errors-power", "Statistical power and sample size"),
      ...T("data-quality", "Missing-data mechanisms", "Data collection reliability", "Measurement validity"),
    ],
  },
  {
    title: "Data Organization and Visualization",
    topics: [
      ...T("frequency-tables", "Raw data and structured datasets", "Data tables and frequency distributions", "Absolute and relative frequencies", "Cumulative frequency", "Grouped and ungrouped data", "Class intervals and bin widths", "Histograms", "Frequency polygons", "Ogives", "Dot plots", "Stem-and-leaf plots", "Empirical cumulative distribution functions", "Bar charts and grouped bar charts", "Density plots", "Violin plots", "Heatmaps", "Mosaic plots", "Pair plots", "Misleading visualizations", "Univariate and multivariate visualization"),
      ...T("chi-square", "Cross-tabulation and contingency tables"),
      ...T("skew-shape", "Pie charts", "Line charts", "Scatterplots", "Distribution shape and symmetry", "Visual encoding and chart selection"),
      ...T("quartiles-iqr", "Box plots and whisker plots"),
      ...T("transformations", "Q-Q plots"),
      ...T("confidence-intervals", "Confidence interval plots"),
      ...T("intervals-more", "Error bars"),
      ...T("regression-diagnostics", "Residual plots"),
    ],
  },
  {
    title: "Measures of Central Tendency",
    topics: [
      ...T("mean-median-mode", "Arithmetic mean", "Median", "Mode", "Empirical median", "Comparison of mean, median, and mode", "Effects of outliers on central tendency"),
      ...T("other-means", "Weighted mean", "Geometric mean", "Harmonic mean", "Trimmed mean", "Winsorized mean", "Midrange", "Grouped-data mean and median", "Robust measures of location"),
      ...T("quartiles-iqr", "Quantiles and percentiles", "Quartiles"),
      ...T("frequency-tables", "Deciles"),
    ],
  },
  {
    title: "Measures of Dispersion and Variability",
    topics: [
      ...T("spread-measures", "Minimum and maximum", "Range", "Quartile deviation", "Mean absolute deviation", "Coefficient of variation", "Median absolute deviation (MAD)", "Standard scores and z-scores", "Relative dispersion", "Robust scale estimators", "Within-group and between-group variability", "Pooled variance", "Outlier detection using standardized scores"),
      ...T("quartiles-iqr", "Interquartile range (IQR)", "Outlier detection using IQR"),
      ...T("variance", "Variance", "Population variance", "Sample variance", "Standard deviation"),
      ...T("t-tests", "Degrees of freedom"),
      ...T("standard-error", "Standard error", "Variability of estimators"),
    ],
  },
  {
    title: "Shape, Position, and Distribution Analysis",
    topics: [
      ...T("skew-shape", "Skewness", "Positive and negative skew", "Symmetry", "Modality", "Unimodal, bimodal, and multimodal distributions", "Outliers and extreme observations"),
      ...T("transformations", "Kurtosis", "Excess kurtosis", "Heavy-tailed and light-tailed distributions", "Standardization and normalization", "Min-max scaling", "Robust scaling", "Rank transformations", "Winsorization", "Data transformations", "Log transformation", "Square-root transformation", "Box-Cox transformation", "Yeo-Johnson transformation"),
      ...T("quartiles-iqr", "Percentile ranks"),
      ...T("frequency-tables", "Empirical distribution functions"),
      ...T("mle", "Distribution fitting"),
      ...T("normality-tests", "Goodness-of-fit assessment"),
    ],
  },
  {
    title: "Probability Theory for Statistics",
    topics: [
      ...T("probability", "Sample spaces and events", "Probability axioms", "Addition and multiplication rules", "Complement rule"),
      ...T("conditional-probability", "Conditional probability", "Law of total probability"),
      ...T("independence", "Independence and mutual exclusivity"),
      ...T("bayes", "Bayes' theorem"),
      ...T("counting", "Counting principles", "Permutations and combinations"),
      ...T("random-variable", "Random variables", "Discrete and continuous random variables", "Probability mass functions (PMFs)"),
      ...T("uniform-exponential", "Probability density functions (PDFs)", "Cumulative distribution functions (CDFs)"),
      ...T("joint-distributions", "Joint and marginal distributions", "Conditional distributions", "Conditional expectation"),
      ...T("expectation", "Expected value"),
      ...T("variance", "Variance and standard deviation"),
      ...T("covariance", "Covariance and correlation"),
      ...T("mgf", "Moments and moment-generating functions", "Characteristic functions"),
      ...T("lln-inequalities", "Law of large numbers", "Concentration inequalities"),
      ...T("clt", "Central limit theorem"),
    ],
  },
  {
    title: "Probability Distributions",
    topics: [
      ...T("binomial", "Bernoulli distribution", "Binomial distribution", "Geometric distribution"),
      ...T("discrete-family", "Multinomial distribution", "Negative binomial distribution", "Hypergeometric distribution", "Discrete uniform distribution", "Zipf distribution", "Categorical distribution"),
      ...T("poisson", "Poisson distribution"),
      ...T("uniform-exponential", "Continuous uniform distribution", "Exponential distribution"),
      ...T("normal", "Normal distribution", "Standard normal distribution"),
      ...T("continuous-family", "Gamma distribution", "Beta distribution", "Weibull distribution", "Lognormal distribution", "Logistic distribution", "Laplace distribution", "Pareto distribution", "Cauchy distribution", "Rayleigh distribution", "Gumbel distribution", "Generalized extreme-value distribution"),
      ...T("sampling-distributions", "Student's t-distribution", "Chi-square distribution", "F-distribution"),
      ...T("multivariate-normal", "Bivariate normal distribution", "Multivariate normal distribution", "Multivariate t-distribution", "Wishart distribution"),
      ...T("conjugate-priors", "Dirichlet distribution"),
      ...T("mixtures", "Multivariate Bernoulli models", "Copulas", "Mixture distributions", "Truncated distributions", "Zero-inflated distributions"),
      ...T("joint-distributions", "Conditional probability distributions"),
    ],
  },
  {
    title: "Sampling Distributions and the Central Limit Theorem",
    topics: [
      ...T("clt", "Population distributions", "Sample distributions", "Sampling distributions", "Sampling distribution of the mean", "Standard normal approximation", "Central limit theorem"),
      ...T("standard-error", "Sampling distribution of a proportion", "Standard error of the mean", "Standard error of a proportion", "Standard error of a difference", "Standard error vs. standard deviation", "Sampling distribution of an estimator"),
      ...T("sampling-distributions", "Sampling distribution of the variance", "Chi-square sampling distributions", "F-distribution", "Student's t-distribution", "Degrees of freedom", "Sampling distribution of correlation"),
      ...T("regression-inference", "Standard error of regression coefficients"),
      ...T("lln-inequalities", "Law of large numbers"),
      ...T("survey-design", "Finite sample corrections"),
      ...T("bootstrap", "Bootstrap sampling distributions"),
    ],
  },
  {
    title: "Estimation Theory",
    topics: [
      ...T("estimator-properties", "Point estimation", "Estimators and estimates", "Population parameters", "Bias and unbiasedness", "Consistency", "Efficiency", "Relative efficiency", "Mean squared error (MSE)", "Identifiability", "Asymptotic estimation theory"),
      ...T("confidence-intervals", "Interval estimation", "Confidence intervals", "Confidence intervals for means", "Confidence intervals for proportions"),
      ...T("bias-variance", "Bias-variance decomposition"),
      ...T("mle", "Maximum likelihood estimation (MLE)", "Likelihood functions"),
      ...T("method-of-moments", "Maximum a posteriori estimation (MAP)", "Method of moments"),
      ...T("least-squares", "Method of least squares"),
      ...T("fisher-information", "Minimum variance unbiased estimation", "Fisher information", "Cramér-Rao lower bound", "Profile likelihood"),
      ...T("sufficiency", "Sufficiency", "Completeness"),
      ...T("intervals-more", "Confidence intervals for variances", "Confidence intervals for differences", "Prediction intervals", "Tolerance intervals"),
      ...T("regression-inference", "Confidence intervals for regression coefficients"),
      ...T("bootstrap", "Bootstrap confidence intervals"),
      ...T("bayesian-inference", "Bayesian credible intervals"),
    ],
  },
  {
    title: "Hypothesis Testing",
    topics: [
      ...T("likelihood-ratio", "Simple and composite hypotheses"),
      ...T("hypothesis-tests", "Null and alternative hypotheses", "One-tailed and two-tailed tests", "Significance level", "Test statistics", "Critical values", "p-values", "One-sample tests", "One-sample z-test", "Statistical vs. practical significance"),
      ...T("errors-power", "Statistical power", "Type I error", "Type II error"),
      ...T("multiple-testing", "Effect size", "Minimum detectable effect", "Equivalence testing", "Non-inferiority testing", "Multiple comparisons", "Bonferroni correction", "Holm correction", "False discovery rate", "Benjamini-Hochberg procedure"),
      ...T("t-tests", "Two-sample tests", "Independent and paired tests", "One-sample t-test", "Independent-samples t-test", "Paired-samples t-test", "Parametric tests"),
      ...T("rank-tests", "Nonparametric tests"),
      ...T("two-sample-tests", "Two-proportion z-test", "Chi-square test of homogeneity", "F-test", "Variance tests"),
      ...T("chi-square", "Chi-square goodness-of-fit test", "Chi-square test of independence"),
      ...T("rank-correlation", "Tests for correlation"),
      ...T("regression-inference", "Tests for regression coefficients"),
      ...T("likelihood-ratio", "Likelihood ratio tests", "Wald tests", "Score tests"),
      ...T("permutation-tests", "Sequential testing", "Permutation tests", "Randomization tests"),
    ],
  },
  {
    title: "Correlation and Association",
    topics: [
      ...T("covariance", "Pearson correlation", "Correlation matrices", "Covariance matrices"),
      ...T("rank-correlation", "Spearman rank correlation", "Kendall's tau", "Point-biserial correlation", "Phi coefficient", "Partial correlation", "Multiple correlation", "Rank correlation", "Distance correlation", "Intraclass correlation coefficient", "Correlation significance testing", "Nonlinear association", "Measures of categorical association", "Cramér's V", "Contingency coefficients", "Mutual information"),
      ...T("stationarity-acf", "Autocorrelation", "Cross-correlation"),
      ...T("factor-analysis", "Canonical correlation analysis"),
      ...T("correlation-causation", "Confounding and spurious correlation", "Simpson's paradox", "Correlation vs. causation"),
    ],
  },
  {
    title: "Regression Analysis",
    topics: [
      ...T("least-squares", "Simple linear regression", "Ordinary least squares (OLS)", "Intercept and slope", "Fitted values", "Residuals"),
      ...T("multiple-regression", "Multiple linear regression", "Regression coefficients", "Sum of squared errors", "Residual sum of squares", "Total sum of squares", "Coefficient of determination (R²)", "Adjusted R²", "Multicollinearity"),
      ...T("regression-inference", "Standard errors", "Confidence intervals for coefficients", "Prediction intervals", "ANOVA decomposition"),
      ...T("regression-diagnostics", "Regression assumptions", "Linearity", "Independence of errors", "Homoscedasticity", "Normality of errors", "Variance inflation factor", "Residual diagnostics", "Leverage and influence", "Cook's distance", "Studentized residuals", "Weighted least squares", "Generalized least squares", "Robust regression"),
      ...T("regression-features", "Polynomial regression", "Interaction effects", "Dummy variables", "Categorical predictors", "Regression through the origin", "Elastic net regression", "Quantile regression", "Nonlinear regression", "Generalized additive models", "Splines", "Model selection"),
      ...T("regularization", "Ridge regression", "Lasso regression", "Regression regularization"),
      ...T("cross-validation", "Cross-validation", "Prediction error", "Out-of-sample evaluation"),
    ],
  },
  {
    title: "Generalized Linear Models",
    topics: [
      ...T("glm", "Exponential family distributions", "Link functions", "Linear predictors", "Multinomial logistic regression", "Ordinal logistic regression", "Poisson regression", "Negative binomial regression", "Probit regression", "Gamma regression", "Inverse Gaussian regression", "Zero-inflated regression", "Hurdle models", "Overdispersion", "Deviance", "Likelihood-based model comparison", "Generalized estimating equations", "Mixed-effects generalized linear models"),
      ...T("logistic-regression", "Logistic regression", "Binary classification models"),
    ],
  },
  {
    title: "Analysis of Variance and Experimental Statistics",
    topics: [
      ...T("one-way-anova", "One-way ANOVA", "Between-group variance", "Within-group variance", "F-statistics"),
      ...T("two-way-anova", "Two-way ANOVA", "Factorial ANOVA", "Repeated-measures ANOVA", "Mixed-design ANOVA", "MANOVA", "ANCOVA", "Main effects", "Interaction effects"),
      ...T("post-hoc-tests", "Post-hoc comparisons", "Tukey's HSD", "Scheffé's method", "Dunnett's test", "Multiple-comparison procedures"),
      ...T("doe-advanced", "Randomized block designs", "Latin square designs", "Fractional factorial designs", "Response surface methodology", "Design of experiments (DOE)", "Blocking and confounding"),
      ...T("experiment-design", "Factorial experiments", "Randomization and replication"),
      ...T("data-variables", "Experimental reproducibility"),
      ...T("errors-power", "Power analysis"),
    ],
  },
  {
    title: "Nonparametric and Robust Statistics",
    topics: [
      ...T("rank-tests", "Sign test", "Wilcoxon signed-rank test", "Mann-Whitney U test", "Distribution-free inference"),
      ...T("kruskal-friedman", "Kruskal-Wallis test", "Friedman test"),
      ...T("rank-correlation", "Spearman correlation", "Kendall correlation"),
      ...T("normality-tests", "Kolmogorov-Smirnov test", "Anderson-Darling test", "Shapiro-Wilk test", "Runs tests"),
      ...T("permutation-tests", "Permutation tests"),
      ...T("bootstrap", "Bootstrap methods"),
      ...T("regression-diagnostics", "Robust regression"),
      ...T("robust-estimation", "Robust location and scale estimation", "Median-based methods", "M-estimators", "R-estimators", "L-estimators", "Huber loss", "Influence functions", "Breakdown point", "Resistant statistical methods"),
    ],
  },
  {
    title: "Bayesian Statistics",
    topics: [
      ...T("bayesian-inference", "Bayesian inference", "Prior distributions", "Likelihood functions", "Posterior distributions", "Posterior predictive distributions", "Credible intervals", "Objective and subjective priors", "Weakly informative priors", "Posterior predictive checking"),
      ...T("bayes", "Bayes' theorem"),
      ...T("conjugate-priors", "Conjugate priors", "Beta-binomial model", "Gamma-Poisson model", "Normal-normal model"),
      ...T("bayes-factors", "Bayesian hypothesis testing", "Bayes factors", "Bayesian model selection", "Bayesian decision theory"),
      ...T("hierarchical-models", "Hierarchical Bayesian models", "Multilevel models", "Empirical Bayes"),
      ...T("mcmc", "Markov chain Monte Carlo (MCMC)", "Metropolis-Hastings algorithm", "Gibbs sampling", "Hamiltonian Monte Carlo", "No-U-Turn Sampler (NUTS)", "Variational inference", "Bayesian optimization", "Model convergence diagnostics", "Bayesian networks"),
    ],
  },
  {
    title: "Multivariate Statistics",
    topics: [
      ...T("mahalanobis", "Multivariate data analysis", "Multivariate normality", "Mahalanobis distance", "Multivariate hypothesis testing", "Hotelling's T²", "Multivariate analysis of variance"),
      ...T("covariance", "Covariance matrices", "Correlation matrices"),
      ...T("pca-practice", "Principal component analysis (PCA)"),
      ...T("factor-analysis", "Factor analysis", "Exploratory factor analysis", "Confirmatory factor analysis", "Canonical correlation analysis", "Structural equation modeling", "Correspondence analysis", "Multiple correspondence analysis", "Multidimensional scaling", "Independent component analysis", "Partial least squares"),
      ...T("discriminant-analysis", "Linear discriminant analysis", "Quadratic discriminant analysis"),
      ...T("clustering", "Cluster analysis", "Hierarchical clustering", "K-means clustering"),
      ...T("gmm-em", "Gaussian mixture models", "Latent variable models", "Missing multivariate data"),
      ...T("regression-features", "Multivariate regression"),
      ...T("high-dimensional", "High-dimensional statistics"),
    ],
  },
  {
    title: "Time-Series Statistics",
    topics: [
      ...T("ts-components", "Time-indexed data", "Trend and seasonality", "Cycles and irregular components", "Moving averages", "Decomposition methods"),
      ...T("exponential-smoothing", "Exponential smoothing", "Exponential smoothing state-space models"),
      ...T("stationarity-acf", "Stationarity", "Autocorrelation function (ACF)", "Partial autocorrelation function (PACF)", "White noise"),
      ...T("arima", "Autoregressive models (AR)", "Moving-average models (MA)", "ARMA models", "ARIMA models", "Seasonal ARIMA", "ARIMAX and regression with time-series errors"),
      ...T("forecasting", "Forecast intervals", "Forecast error metrics", "State-space models", "Kalman filtering", "Change-point detection", "Interrupted time-series analysis"),
      ...T("advanced-time-series", "Volatility modeling", "ARCH and GARCH", "Vector autoregression (VAR)", "Cointegration", "Granger causality", "Spectral analysis", "Frequency-domain methods"),
      ...T("hierarchical-models", "Longitudinal data analysis", "Panel data models"),
      ...T("survival-functions", "Survival and event-history data"),
    ],
  },
  {
    title: "Causal Inference",
    topics: [
      ...T("potential-outcomes", "Causal relationships and counterfactuals", "Directed acyclic graphs (DAGs)", "Potential outcomes framework", "Average treatment effect", "Average treatment effect on the treated", "Causal identification assumptions"),
      ...T("correlation-causation", "Association vs. causation", "Confounding"),
      ...T("experiment-design", "Treatment and control groups", "Randomized experiments"),
      ...T("propensity-scores", "Observational causal inference", "Matching methods", "Propensity scores", "Inverse probability weighting", "Regression adjustment", "Doubly robust estimation"),
      ...T("quasi-experiments", "Instrumental variables", "Two-stage least squares", "Regression discontinuity designs", "Difference-in-differences", "Synthetic control methods"),
      ...T("mediation-sensitivity", "Mediation analysis", "Moderation analysis", "Sensitivity analysis", "Negative controls", "Target trial emulation"),
      ...T("heterogeneous-effects", "Causal forests", "Heterogeneous treatment effects"),
    ],
  },
  {
    title: "Survival Analysis and Reliability Statistics",
    topics: [
      ...T("survival-functions", "Time-to-event data", "Censoring and truncation", "Survival functions", "Hazard functions", "Reliability functions", "Failure rates", "Hazard-rate estimation", "Life tables"),
      ...T("kaplan-meier", "Kaplan-Meier estimator", "Log-rank test"),
      ...T("cox-model", "Cox proportional hazards model", "Parametric survival models", "Accelerated failure-time models", "Weibull reliability models"),
      ...T("survival-extensions", "Competing risks", "Recurrent events", "Frailty models", "Repairable systems", "Reliability testing", "Accelerated life testing"),
    ],
  },
  {
    title: "Missing Data and Data Quality",
    topics: [
      ...T("data-quality", "Missing completely at random (MCAR)", "Missing at random (MAR)", "Missing not at random (MNAR)", "Missingness mechanisms", "Complete-case analysis", "Pairwise deletion", "Mean and median imputation", "Regression imputation", "Multiple imputation", "Missingness indicators", "Sensitivity analysis for missing data", "Measurement error", "Data entry errors", "Outlier investigation", "Data validation", "Duplicate detection", "Data quality metrics", "Selection and attrition bias"),
      ...T("gmm-em", "Chained equations", "Expectation-maximization algorithm"),
    ],
  },
  {
    title: "Statistical Learning and Machine Learning",
    topics: [
      ...T("bias-variance", "Bias-variance trade-off", "Overfitting and underfitting"),
      ...T("learning-theory", "Statistical learning theory"),
      ...T("clustering", "Supervised and unsupervised learning"),
      ...T("cross-validation", "Training, validation, and test sets", "Cross-validation", "Feature selection"),
      ...T("regression-features", "Feature engineering"),
      ...T("bootstrap", "Bootstrap validation"),
      ...T("regularization", "Regularization", "Ridge and lasso"),
      ...T("trees-ensembles", "Classification and regression trees", "Random forests", "Gradient boosting", "Ensemble methods"),
      ...T("svm-knn-nb", "Support vector machines", "k-nearest neighbors", "Naive Bayes classifiers"),
      ...T("logistic-regression", "Logistic classification"),
      ...T("train-network", "Neural network statistical foundations"),
      ...T("calibration-imbalance", "Calibration", "Class imbalance"),
      ...T("roc-auc", "Discrimination and ranking", "ROC curves and AUC"),
      ...T("precision-recall", "Precision, recall, and F1", "Confusion matrices"),
      ...T("clustering", "Clustering validation"),
      ...T("interpretability", "Model interpretability", "Permutation importance", "Partial dependence", "SHAP-based interpretation"),
      ...T("uncertainty-shift", "Distribution shift", "Concept drift", "Conformal prediction", "Probabilistic forecasting", "Uncertainty quantification"),
    ],
  },
  {
    title: "Advanced Statistical Theory",
    topics: [
      ...T("sufficiency", "Mathematical statistics", "Sufficient statistics", "Rao-Blackwell theorem", "Lehmann-Scheffé theorem", "Exponential families", "Completeness and ancillary statistics", "Likelihood theory"),
      ...T("decision-theory", "Statistical decision theory", "Loss functions and risk", "Admissibility", "Minimax estimation"),
      ...T("asymptotics", "Measure-theoretic probability", "Asymptotic normality", "Delta method", "Slutsky's theorem", "Continuous mapping theorem"),
      ...T("advanced-asymptotics", "Empirical process theory", "U-statistics", "Semiparametric statistics"),
      ...T("robust-estimation", "Influence functions"),
      ...T("kde", "Nonparametric estimation", "Kernel density estimation", "Kernel regression", "Smoothing and bandwidth selection"),
      ...T("bootstrap", "Bootstrap theory"),
      ...T("lln-inequalities", "Concentration inequalities"),
      ...T("high-dimensional", "High-dimensional inference", "Sparse estimation", "Selective inference", "Random matrix theory"),
      ...T("multiple-testing", "Multiple hypothesis testing theory", "False discovery rate"),
      ...T("permutation-tests", "Sequential analysis", "Sequential probability ratio tests"),
      ...T("likelihood-ratio", "Information-theoretic statistics"),
      ...T("applied-fields", "Extreme-value statistics", "Spatial statistics", "Geostatistics", "Functional data analysis", "Statistical genetics", "Psychometrics and item response theory"),
    ],
  },
  {
    title: "Statistical Computing and Software",
    topics: [
      ...T("data-quality", "Data cleaning and preprocessing"),
      ...T("mean-median-mode", "Numerical summaries"),
      ...T("monte-carlo", "Random number generation", "Monte Carlo simulation", "Sampling simulation", "Simulation studies"),
      ...T("bootstrap", "Statistical resampling", "Bootstrap implementation"),
      ...T("permutation-tests", "Permutation testing"),
      ...T("gradient-descent", "Numerical optimization"),
      ...T("mle", "Maximum likelihood computation"),
      ...T("skew-shape", "Statistical visualization"),
      ...T("statistical-computing", "Reproducible analysis", "Computational complexity", "Parallel statistical computing", "Big-data statistics", "Streaming statistics", "Online estimation", "Distributed statistical analysis", "Privacy-preserving statistics", "Statistical programming in Python", "Statistical programming in R", "SQL for statistical data extraction", "Statistical software validation", "Version control and reproducibility"),
    ],
  },
  {
    title: "Specialized Statistical Fields",
    topics: [
      ...T("applied-fields", "Biostatistics", "Epidemiological statistics", "Clinical trial statistics", "Public health statistics", "Econometrics", "Financial statistics", "Actuarial statistics", "Business analytics", "Industrial statistics", "Quality control", "Statistical process control", "Six Sigma statistical methods", "Educational statistics", "Psychometrics", "Social statistics", "Spatial statistics", "Geostatistics", "Sports analytics", "Sports performance modeling", "Forensic statistics", "Reliability engineering", "Network statistics", "Text and language statistics", "Computational social science", "Environmental statistics", "Climate statistics"),
      ...T("survey-design", "Political polling", "Survey statistics", "Official statistics"),
      ...T("bayes-factors", "Bayesian experimental design"),
      ...T("heterogeneous-effects", "Causal machine learning"),
    ],
  },
];
