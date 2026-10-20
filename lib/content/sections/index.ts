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
import * as lln from "./lln-inequalities";
import * as methodOfMoments from "./method-of-moments";
import * as mgf from "./mgf";
import * as mixtures from "./mixtures";
import * as multivariateNormal from "./multivariate-normal";
import * as otherMeans from "./other-means";
import * as samplingDistributions from "./sampling-distributions";
import * as spreadMeasures from "./spread-measures";
import * as surveyDesign from "./survey-design";
import * as transformations from "./transformations";

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
  intervalsMore,
  jointDistributions,
  lln,
  methodOfMoments,
  mgf,
  mixtures,
  multivariateNormal,
  otherMeans,
  samplingDistributions,
  spreadMeasures,
  surveyDesign,
  transformations,
];

export const SECTION_TEMPLATES: Record<string, Template[]> = Object.fromEntries(SECTIONS.map((s) => [s.node.id, s.templates]));
