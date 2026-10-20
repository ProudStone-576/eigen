import type { Template } from "../templates";
import * as bootstrap from "./bootstrap";
import * as continuousFamily from "./continuous-family";
import * as counting from "./counting";
import * as dataQuality from "./data-quality";
import * as dataVariables from "./data-variables";
import * as discreteFamily from "./discrete-family";
import * as estimatorProperties from "./estimator-properties";
import * as experimentDesign from "./experiment-design";
import * as fisherInformation from "./fisher-information";
import * as frequencyTables from "./frequency-tables";
import * as intervalsMore from "./intervals-more";
import * as jointDistributions from "./joint-distributions";
import * as glm from "./glm";
import * as likelihoodRatio from "./likelihood-ratio";
import * as lln from "./lln-inequalities";
import * as methodOfMoments from "./method-of-moments";
import * as mgf from "./mgf";
import * as mixtures from "./mixtures";
import * as multipleTesting from "./multiple-testing";
import * as multivariateNormal from "./multivariate-normal";
import * as otherMeans from "./other-means";
import * as permutationTests from "./permutation-tests";
import * as rankCorrelation from "./rank-correlation";
import * as regressionDiagnostics from "./regression-diagnostics";
import * as regressionFeatures from "./regression-features";
import * as regressionInference from "./regression-inference";
import * as samplingDistributions from "./sampling-distributions";
import * as spreadMeasures from "./spread-measures";
import * as surveyDesign from "./survey-design";
import * as transformations from "./transformations";
import * as twoSampleTests from "./two-sample-tests";

/**
 * Self-contained sections: each file holds the lesson, its exam-depth material
 * and its practice templates. Units import the nodes; this registry hands the
 * templates to the practice generator.
 */
const SECTIONS = [
  bootstrap,
  continuousFamily,
  counting,
  dataQuality,
  dataVariables,
  discreteFamily,
  estimatorProperties,
  experimentDesign,
  fisherInformation,
  frequencyTables,
  glm,
  intervalsMore,
  jointDistributions,
  likelihoodRatio,
  lln,
  methodOfMoments,
  mgf,
  mixtures,
  multipleTesting,
  multivariateNormal,
  otherMeans,
  permutationTests,
  rankCorrelation,
  regressionDiagnostics,
  regressionFeatures,
  regressionInference,
  samplingDistributions,
  spreadMeasures,
  surveyDesign,
  transformations,
  twoSampleTests,
];

export const SECTION_TEMPLATES: Record<string, Template[]> = Object.fromEntries(SECTIONS.map((s) => [s.node.id, s.templates]));
