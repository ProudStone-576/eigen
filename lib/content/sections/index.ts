import type { Template } from "../templates";
import * as advancedTimeSeries from "./advanced-time-series";
import * as arima from "./arima";
import * as bayesFactors from "./bayes-factors";
import * as bayesianInference from "./bayesian-inference";
import * as bootstrap from "./bootstrap";
import * as clustering from "./clustering";
import * as conjugatePriors from "./conjugate-priors";
import * as continuousFamily from "./continuous-family";
import * as counting from "./counting";
import * as coxModel from "./cox-model";
import * as dataQuality from "./data-quality";
import * as dataVariables from "./data-variables";
import * as discreteFamily from "./discrete-family";
import * as discriminantAnalysis from "./discriminant-analysis";
import * as doeAdvanced from "./doe-advanced";
import * as estimatorProperties from "./estimator-properties";
import * as experimentDesign from "./experiment-design";
import * as exponentialSmoothing from "./exponential-smoothing";
import * as factorAnalysis from "./factor-analysis";
import * as fisherInformation from "./fisher-information";
import * as forecasting from "./forecasting";
import * as frequencyTables from "./frequency-tables";
import * as glm from "./glm";
import * as gmmEm from "./gmm-em";
import * as heterogeneousEffects from "./heterogeneous-effects";
import * as hierarchicalModels from "./hierarchical-models";
import * as intervalsMore from "./intervals-more";
import * as jointDistributions from "./joint-distributions";
import * as kaplanMeier from "./kaplan-meier";
import * as kruskalFriedman from "./kruskal-friedman";
import * as likelihoodRatio from "./likelihood-ratio";
import * as lln from "./lln-inequalities";
import * as mahalanobis from "./mahalanobis";
import * as mcmc from "./mcmc";
import * as mediationSensitivity from "./mediation-sensitivity";
import * as methodOfMoments from "./method-of-moments";
import * as mgf from "./mgf";
import * as mixtures from "./mixtures";
import * as multipleTesting from "./multiple-testing";
import * as multivariateNormal from "./multivariate-normal";
import * as normalityTests from "./normality-tests";
import * as oneWayAnova from "./one-way-anova";
import * as otherMeans from "./other-means";
import * as permutationTests from "./permutation-tests";
import * as postHocTests from "./post-hoc-tests";
import * as potentialOutcomes from "./potential-outcomes";
import * as propensityScores from "./propensity-scores";
import * as quasiExperiments from "./quasi-experiments";
import * as rankCorrelation from "./rank-correlation";
import * as rankTests from "./rank-tests";
import * as regressionDiagnostics from "./regression-diagnostics";
import * as regressionFeatures from "./regression-features";
import * as regressionInference from "./regression-inference";
import * as robustEstimation from "./robust-estimation";
import * as samplingDistributions from "./sampling-distributions";
import * as spreadMeasures from "./spread-measures";
import * as stationarityAcf from "./stationarity-acf";
import * as surveyDesign from "./survey-design";
import * as survivalExtensions from "./survival-extensions";
import * as survivalFunctions from "./survival-functions";
import * as transformations from "./transformations";
import * as tsComponents from "./ts-components";
import * as twoSampleTests from "./two-sample-tests";
import * as twoWayAnova from "./two-way-anova";

/**
 * Self-contained sections: each file holds the lesson, its exam-depth material
 * and its practice templates. Units import the nodes; this registry hands the
 * templates to the practice generator.
 */
const SECTIONS = [
  advancedTimeSeries,
  arima,
  bayesFactors,
  bayesianInference,
  bootstrap,
  clustering,
  conjugatePriors,
  continuousFamily,
  counting,
  coxModel,
  dataQuality,
  dataVariables,
  discreteFamily,
  discriminantAnalysis,
  doeAdvanced,
  estimatorProperties,
  experimentDesign,
  exponentialSmoothing,
  factorAnalysis,
  fisherInformation,
  forecasting,
  frequencyTables,
  glm,
  gmmEm,
  heterogeneousEffects,
  hierarchicalModels,
  intervalsMore,
  jointDistributions,
  kaplanMeier,
  kruskalFriedman,
  likelihoodRatio,
  lln,
  mahalanobis,
  mcmc,
  mediationSensitivity,
  methodOfMoments,
  mgf,
  mixtures,
  multipleTesting,
  multivariateNormal,
  normalityTests,
  oneWayAnova,
  otherMeans,
  permutationTests,
  postHocTests,
  potentialOutcomes,
  propensityScores,
  quasiExperiments,
  rankCorrelation,
  rankTests,
  regressionDiagnostics,
  regressionFeatures,
  regressionInference,
  robustEstimation,
  samplingDistributions,
  spreadMeasures,
  stationarityAcf,
  surveyDesign,
  survivalExtensions,
  survivalFunctions,
  transformations,
  tsComponents,
  twoSampleTests,
  twoWayAnova,
];

export const SECTION_TEMPLATES: Record<string, Template[]> = Object.fromEntries(SECTIONS.map((s) => [s.node.id, s.templates]));
