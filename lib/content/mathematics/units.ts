import type { Unit } from "@/lib/content/types";
import { node as linearEquations } from "../sections/linear-equations";
import { node as ratiosPercentages } from "../sections/ratios-percentages";
import { node as exponentsLogs } from "../sections/exponents-logs";
import { node as polynomials } from "../sections/polynomials";
import { node as quadratics } from "../sections/quadratics";
import { node as planeGeometry } from "../sections/plane-geometry";
import { node as mensuration } from "../sections/mensuration";
import { node as setsRelations } from "../sections/sets-relations";
import { node as functionsBasics } from "../sections/functions-basics";
import { node as functionGraphs } from "../sections/function-graphs";
import { node as compositionInverse } from "../sections/composition-inverse";
import { node as trigRatios } from "../sections/trig-ratios";
import { node as trigIdentities } from "../sections/trig-identities";
import { node as trigEquations } from "../sections/trig-equations";
import { node as inverseTrig } from "../sections/inverse-trig";
import { node as trianglesTrig } from "../sections/triangles-trig";

/** Part I: the exam mathematics syllabus (JEE Main and Advanced, SAT), in teaching order. */

export const algebraUnit: Unit = {
  id: "ma-1",
  track: "Mathematics",
  title: "Algebra",
  blurb: "Linear equations and inequalities, ratios and percentages, exponents and logarithms, polynomials and quadratics: the algebra every later chapter leans on.",
  nodes: [linearEquations, ratiosPercentages, exponentsLogs, polynomials, quadratics],
};

export const geometryUnit: Unit = {
  id: "ma-2",
  track: "Mathematics",
  title: "Geometry Essentials",
  blurb: "Angles, triangles, similarity and circle theorems, then areas and volumes of plane figures and solids.",
  nodes: [planeGeometry, mensuration],
};

export const functionsUnit: Unit = {
  id: "ma-3",
  track: "Mathematics",
  title: "Sets, Relations & Functions",
  blurb: "Sets and counting with Venn diagrams, relations and equivalence classes, functions with their domains and ranges, special graphs and transformations, composition and inverses.",
  nodes: [setsRelations, functionsBasics, functionGraphs, compositionInverse],
};

export const trigUnit: Unit = {
  id: "ma-4",
  track: "Mathematics",
  title: "Trigonometry",
  blurb: "Ratios on the unit circle, identities from compound angles, equations and their general solutions, inverse functions, and solving any triangle.",
  nodes: [trigRatios, trigIdentities, trigEquations, inverseTrig, trianglesTrig],
};

export const mathematicsUnits: Unit[] = [algebraUnit, geometryUnit, functionsUnit, trigUnit];
