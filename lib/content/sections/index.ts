import type { Template } from "../templates";
import * as advancedAsymptotics from "./advanced-asymptotics";
import * as advancedTimeSeries from "./advanced-time-series";
import * as arima from "./arima";
import * as asymptotics from "./asymptotics";
import * as bayesFactors from "./bayes-factors";
import * as bayesianInference from "./bayesian-inference";
import * as bootstrap from "./bootstrap";
import * as calibrationImbalance from "./calibration-imbalance";
import * as clinicalEpi from "./clinical-epi";
import * as clustering from "./clustering";
import * as conjugatePriors from "./conjugate-priors";
import * as continuousFamily from "./continuous-family";
import * as counting from "./counting";
import * as coxModel from "./cox-model";
import * as dataQuality from "./data-quality";
import * as dataVariables from "./data-variables";
import * as decisionTheory from "./decision-theory";
import * as discreteFamily from "./discrete-family";
import * as discriminantAnalysis from "./discriminant-analysis";
import * as doeAdvanced from "./doe-advanced";
import * as econometricsFinance from "./econometrics-finance";
import * as estimatorProperties from "./estimator-properties";
import * as experimentDesign from "./experiment-design";
import * as exponentialSmoothing from "./exponential-smoothing";
import * as exponentsLogs from "./exponents-logs";
import * as factorAnalysis from "./factor-analysis";
import * as fisherInformation from "./fisher-information";
import * as forecasting from "./forecasting";
import * as frequencyTables from "./frequency-tables";
import * as geneticsNetworksText from "./genetics-networks-text";
import * as glm from "./glm";
import * as gmmEm from "./gmm-em";
import * as heterogeneousEffects from "./heterogeneous-effects";
import * as hierarchicalModels from "./hierarchical-models";
import * as highDimensional from "./high-dimensional";
import * as interpretability from "./interpretability";
import * as intervalsMore from "./intervals-more";
import * as jointDistributions from "./joint-distributions";
import * as kaplanMeier from "./kaplan-meier";
import * as kde from "./kde";
import * as kruskalFriedman from "./kruskal-friedman";
import * as learningTheory from "./learning-theory";
import * as likelihoodRatio from "./likelihood-ratio";
import * as linearEquations from "./linear-equations";
import * as lln from "./lln-inequalities";
import * as mahalanobis from "./mahalanobis";
import * as mcmc from "./mcmc";
import * as mediationSensitivity from "./mediation-sensitivity";
import * as mensuration from "./mensuration";
import * as methodOfMoments from "./method-of-moments";
import * as mgf from "./mgf";
import * as mixtures from "./mixtures";
import * as monteCarlo from "./monte-carlo";
import * as multipleTesting from "./multiple-testing";
import * as multivariateNormal from "./multivariate-normal";
import * as normalityTests from "./normality-tests";
import * as oneWayAnova from "./one-way-anova";
import * as otherMeans from "./other-means";
import * as permutationTests from "./permutation-tests";
import * as planeGeometry from "./plane-geometry";
import * as polynomials from "./polynomials";
import * as postHocTests from "./post-hoc-tests";
import * as potentialOutcomes from "./potential-outcomes";
import * as propensityScores from "./propensity-scores";
import * as psychometricsSocial from "./psychometrics-social";
import * as quadratics from "./quadratics";
import * as qualityControl from "./quality-control";
import * as quasiExperiments from "./quasi-experiments";
import * as rankCorrelation from "./rank-correlation";
import * as rankTests from "./rank-tests";
import * as ratiosPercentages from "./ratios-percentages";
import * as regressionDiagnostics from "./regression-diagnostics";
import * as regressionFeatures from "./regression-features";
import * as regressionInference from "./regression-inference";
import * as reproduciblePractice from "./reproducible-practice";
import * as robustEstimation from "./robust-estimation";
import * as samplingDistributions from "./sampling-distributions";
import * as spatialEnvironmental from "./spatial-environmental";
import * as sportsForensic from "./sports-forensic";
import * as spreadMeasures from "./spread-measures";
import * as stationarityAcf from "./stationarity-acf";
import * as statisticalComputing from "./statistical-computing";
import * as sufficiency from "./sufficiency";
import * as surveyDesign from "./survey-design";
import * as survivalExtensions from "./survival-extensions";
import * as survivalFunctions from "./survival-functions";
import * as svmKnnNb from "./svm-knn-nb";
import * as transformations from "./transformations";
import * as treesEnsembles from "./trees-ensembles";
import * as tsComponents from "./ts-components";
import * as twoSampleTests from "./two-sample-tests";
import * as twoWayAnova from "./two-way-anova";
import * as uncertaintyShift from "./uncertainty-shift";

/**
 * Self-contained sections: each file holds the lesson, its exam-depth material
 * and its practice templates. Units import the nodes; this registry hands the
 * templates to the practice generator.
 */
const SECTIONS = [
  advancedAsymptotics,
  advancedTimeSeries,
  arima,
  asymptotics,
  bayesFactors,
  bayesianInference,
  bootstrap,
  calibrationImbalance,
  clinicalEpi,
  clustering,
  conjugatePriors,
  continuousFamily,
  counting,
  coxModel,
  dataQuality,
  dataVariables,
  decisionTheory,
  discreteFamily,
  discriminantAnalysis,
  doeAdvanced,
  econometricsFinance,
  estimatorProperties,
  experimentDesign,
  exponentialSmoothing,
  exponentsLogs,
  factorAnalysis,
  fisherInformation,
  forecasting,
  frequencyTables,
  geneticsNetworksText,
  glm,
  gmmEm,
  heterogeneousEffects,
  hierarchicalModels,
  highDimensional,
  interpretability,
  intervalsMore,
  jointDistributions,
  kaplanMeier,
  kde,
  kruskalFriedman,
  learningTheory,
  likelihoodRatio,
  linearEquations,
  lln,
  mahalanobis,
  mcmc,
  mediationSensitivity,
  mensuration,
  methodOfMoments,
  mgf,
  mixtures,
  monteCarlo,
  multipleTesting,
  multivariateNormal,
  normalityTests,
  oneWayAnova,
  otherMeans,
  permutationTests,
  planeGeometry,
  polynomials,
  postHocTests,
  potentialOutcomes,
  propensityScores,
  psychometricsSocial,
  quadratics,
  qualityControl,
  quasiExperiments,
  rankCorrelation,
  rankTests,
  ratiosPercentages,
  regressionDiagnostics,
  regressionFeatures,
  regressionInference,
  reproduciblePractice,
  robustEstimation,
  samplingDistributions,
  spatialEnvironmental,
  sportsForensic,
  spreadMeasures,
  stationarityAcf,
  statisticalComputing,
  sufficiency,
  surveyDesign,
  survivalExtensions,
  survivalFunctions,
  svmKnnNb,
  transformations,
  treesEnsembles,
  tsComponents,
  twoSampleTests,
  twoWayAnova,
  uncertaintyShift,
];

export const SECTION_TEMPLATES: Record<string, Template[]> = Object.fromEntries(SECTIONS.map((s) => [s.node.id, s.templates]));
