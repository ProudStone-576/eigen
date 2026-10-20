import type { Template } from "../templates";
import * as counting from "./counting";
import * as dataQuality from "./data-quality";
import * as dataVariables from "./data-variables";
import * as experimentDesign from "./experiment-design";
import * as frequencyTables from "./frequency-tables";
import * as jointDistributions from "./joint-distributions";
import * as lln from "./lln-inequalities";
import * as mgf from "./mgf";
import * as otherMeans from "./other-means";
import * as spreadMeasures from "./spread-measures";
import * as surveyDesign from "./survey-design";
import * as transformations from "./transformations";

/**
 * Self-contained sections: each file holds the lesson, its exam-depth material
 * and its practice templates. Units import the nodes; this registry hands the
 * templates to the practice generator.
 */
const SECTIONS = [counting, dataQuality, dataVariables, experimentDesign, frequencyTables, jointDistributions, lln, mgf, otherMeans, spreadMeasures, surveyDesign, transformations];

export const SECTION_TEMPLATES: Record<string, Template[]> = Object.fromEntries(SECTIONS.map((s) => [s.node.id, s.templates]));
