import type { Template } from "../templates";
import * as adjointSystems from "./adjoint-systems";
import * as advancedAsymptotics from "./advanced-asymptotics";
import * as advancedTimeSeries from "./advanced-time-series";
import * as areaUnderCurves from "./area-under-curves";
import * as arima from "./arima";
import * as arithmeticProgressions from "./arithmetic-progressions";
import * as asymptotics from "./asymptotics";
import * as bayesFactors from "./bayes-factors";
import * as bayesianInference from "./bayesian-inference";
import * as binomialCoefficients from "./binomial-coefficients";
import * as binomialTheorem from "./binomial-theorem";
import * as bootstrap from "./bootstrap";
import * as calibrationImbalance from "./calibration-imbalance";
import * as circles from "./circles";
import * as clinicalEpi from "./clinical-epi";
import * as clustering from "./clustering";
import * as combinationsAdvanced from "./combinations-advanced";
import * as complexAlgebra from "./complex-algebra";
import * as complexGeometry from "./complex-geometry";
import * as complexPolar from "./complex-polar";
import * as compositionInverse from "./composition-inverse";
import * as conjugatePriors from "./conjugate-priors";
import * as continuity from "./continuity";
import * as continuousFamily from "./continuous-family";
import * as counting from "./counting";
import * as coxModel from "./cox-model";
import * as dataQuality from "./data-quality";
import * as dataVariables from "./data-variables";
import * as deApplications from "./de-applications";
import * as deBasics from "./de-basics";
import * as decisionTheory from "./decision-theory";
import * as definiteIntegrals from "./definite-integrals";
import * as determinantsProperties from "./determinants-properties";
import * as differentiability from "./differentiability";
import * as differentiationMethods from "./differentiation-methods";
import * as discreteFamily from "./discrete-family";
import * as discriminantAnalysis from "./discriminant-analysis";
import * as doeAdvanced from "./doe-advanced";
import * as econometricsFinance from "./econometrics-finance";
import * as ellipse from "./ellipse";
import * as estimatorProperties from "./estimator-properties";
import * as experimentDesign from "./experiment-design";
import * as exponentialSmoothing from "./exponential-smoothing";
import * as exponentsLogs from "./exponents-logs";
import * as factorAnalysis from "./factor-analysis";
import * as fisherInformation from "./fisher-information";
import * as forecasting from "./forecasting";
import * as frequencyTables from "./frequency-tables";
import * as functionGraphs from "./function-graphs";
import * as functionsBasics from "./functions-basics";
import * as geneticsNetworksText from "./genetics-networks-text";
import * as geometricProgressions from "./geometric-progressions";
import * as glm from "./glm";
import * as gmmEm from "./gmm-em";
import * as heterogeneousEffects from "./heterogeneous-effects";
import * as hierarchicalModels from "./hierarchical-models";
import * as highDimensional from "./high-dimensional";
import * as hyperbola from "./hyperbola";
import * as indefiniteIntegrals from "./indefinite-integrals";
import * as induction from "./induction";
import * as integrationTechniques from "./integration-techniques";
import * as interpretability from "./interpretability";
import * as intervalsMore from "./intervals-more";
import * as inverseTrig from "./inverse-trig";
import * as jointDistributions from "./joint-distributions";
import * as kaplanMeier from "./kaplan-meier";
import * as kde from "./kde";
import * as kruskalFriedman from "./kruskal-friedman";
import * as learningTheory from "./learning-theory";
import * as likelihoodRatio from "./likelihood-ratio";
import * as limits from "./limits";
import * as linearDe from "./linear-de";
import * as linearEquations from "./linear-equations";
import * as lln from "./lln-inequalities";
import * as mahalanobis from "./mahalanobis";
import * as matrixAlgebra from "./matrix-algebra";
import * as maximaMinima from "./maxima-minima";
import * as mcmc from "./mcmc";
import * as meansInequalities from "./means-inequalities";
import * as meanValueTheorems from "./mean-value-theorems";
import * as mediationSensitivity from "./mediation-sensitivity";
import * as mensuration from "./mensuration";
import * as methodOfMoments from "./method-of-moments";
import * as mgf from "./mgf";
import * as mixtures from "./mixtures";
import * as monotonicity from "./monotonicity";
import * as monteCarlo from "./monte-carlo";
import * as multipleTesting from "./multiple-testing";
import * as multivariateNormal from "./multivariate-normal";
import * as normalityTests from "./normality-tests";
import * as oneWayAnova from "./one-way-anova";
import * as otherMeans from "./other-means";
import * as parabola from "./parabola";
import * as permutationsAdvanced from "./permutations-advanced";
import * as permutationTests from "./permutation-tests";
import * as planeGeometry from "./plane-geometry";
import * as polynomials from "./polynomials";
import * as postHocTests from "./post-hoc-tests";
import * as potentialOutcomes from "./potential-outcomes";
import * as probabilityRules from "./probability-rules";
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
import * as rootsOfUnity from "./roots-of-unity";
import * as samplingDistributions from "./sampling-distributions";
import * as separableHomogeneous from "./separable-homogeneous";
import * as setsRelations from "./sets-relations";
import * as spatialEnvironmental from "./spatial-environmental";
import * as specialSeries from "./special-series";
import * as sportsForensic from "./sports-forensic";
import * as spreadMeasures from "./spread-measures";
import * as stationarityAcf from "./stationarity-acf";
import * as statisticalComputing from "./statistical-computing";
import * as straightLines from "./straight-lines";
import * as sufficiency from "./sufficiency";
import * as surveyDesign from "./survey-design";
import * as survivalExtensions from "./survival-extensions";
import * as survivalFunctions from "./survival-functions";
import * as svmKnnNb from "./svm-knn-nb";
import * as tangentsNormals from "./tangents-normals";
import * as transformations from "./transformations";
import * as treesEnsembles from "./trees-ensembles";
import * as trianglesTrig from "./triangles-trig";
import * as trigEquations from "./trig-equations";
import * as trigIdentities from "./trig-identities";
import * as trigRatios from "./trig-ratios";
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
  adjointSystems,
  advancedAsymptotics,
  advancedTimeSeries,
  areaUnderCurves,
  arima,
  arithmeticProgressions,
  asymptotics,
  bayesFactors,
  bayesianInference,
  binomialCoefficients,
  binomialTheorem,
  bootstrap,
  calibrationImbalance,
  circles,
  clinicalEpi,
  clustering,
  combinationsAdvanced,
  complexAlgebra,
  complexGeometry,
  complexPolar,
  compositionInverse,
  conjugatePriors,
  continuity,
  continuousFamily,
  counting,
  coxModel,
  dataQuality,
  dataVariables,
  deApplications,
  deBasics,
  decisionTheory,
  definiteIntegrals,
  determinantsProperties,
  differentiability,
  differentiationMethods,
  discreteFamily,
  discriminantAnalysis,
  doeAdvanced,
  econometricsFinance,
  ellipse,
  estimatorProperties,
  experimentDesign,
  exponentialSmoothing,
  exponentsLogs,
  factorAnalysis,
  fisherInformation,
  forecasting,
  frequencyTables,
  functionGraphs,
  functionsBasics,
  geneticsNetworksText,
  geometricProgressions,
  glm,
  gmmEm,
  heterogeneousEffects,
  hierarchicalModels,
  highDimensional,
  hyperbola,
  indefiniteIntegrals,
  induction,
  integrationTechniques,
  interpretability,
  intervalsMore,
  inverseTrig,
  jointDistributions,
  kaplanMeier,
  kde,
  kruskalFriedman,
  learningTheory,
  likelihoodRatio,
  limits,
  linearDe,
  linearEquations,
  lln,
  mahalanobis,
  matrixAlgebra,
  maximaMinima,
  mcmc,
  meansInequalities,
  meanValueTheorems,
  mediationSensitivity,
  mensuration,
  methodOfMoments,
  mgf,
  mixtures,
  monotonicity,
  monteCarlo,
  multipleTesting,
  multivariateNormal,
  normalityTests,
  oneWayAnova,
  otherMeans,
  parabola,
  permutationsAdvanced,
  permutationTests,
  planeGeometry,
  polynomials,
  postHocTests,
  potentialOutcomes,
  probabilityRules,
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
  rootsOfUnity,
  samplingDistributions,
  separableHomogeneous,
  setsRelations,
  spatialEnvironmental,
  specialSeries,
  sportsForensic,
  spreadMeasures,
  stationarityAcf,
  statisticalComputing,
  straightLines,
  sufficiency,
  surveyDesign,
  survivalExtensions,
  survivalFunctions,
  svmKnnNb,
  tangentsNormals,
  transformations,
  treesEnsembles,
  trianglesTrig,
  trigEquations,
  trigIdentities,
  trigRatios,
  tsComponents,
  twoSampleTests,
  twoWayAnova,
  uncertaintyShift,
];

export const SECTION_TEMPLATES: Record<string, Template[]> = Object.fromEntries(SECTIONS.map((s) => [s.node.id, s.templates]));
