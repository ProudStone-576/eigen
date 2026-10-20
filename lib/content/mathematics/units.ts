import type { Unit } from "@/lib/content/types";
import { node as linearEquations } from "../sections/linear-equations";
import { node as ratiosPercentages } from "../sections/ratios-percentages";
import { node as exponentsLogs } from "../sections/exponents-logs";
import { node as polynomials } from "../sections/polynomials";
import { node as quadratics } from "../sections/quadratics";
import { node as planeGeometry } from "../sections/plane-geometry";
import { node as mensuration } from "../sections/mensuration";

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

export const mathematicsUnits: Unit[] = [algebraUnit, geometryUnit];
