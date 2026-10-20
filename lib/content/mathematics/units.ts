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
import { node as complexAlgebra } from "../sections/complex-algebra";
import { node as complexPolar } from "../sections/complex-polar";
import { node as rootsOfUnity } from "../sections/roots-of-unity";
import { node as complexGeometry } from "../sections/complex-geometry";
import { node as arithmeticProgressions } from "../sections/arithmetic-progressions";
import { node as geometricProgressions } from "../sections/geometric-progressions";
import { node as meansInequalities } from "../sections/means-inequalities";
import { node as specialSeries } from "../sections/special-series";
import { node as induction } from "../sections/induction";
import { node as permutationsAdvanced } from "../sections/permutations-advanced";
import { node as combinationsAdvanced } from "../sections/combinations-advanced";
import { node as binomialTheorem } from "../sections/binomial-theorem";
import { node as binomialCoefficients } from "../sections/binomial-coefficients";
import { node as probabilityRules } from "../sections/probability-rules";
import { node as matrixAlgebra } from "../sections/matrix-algebra";
import { node as determinantsProperties } from "../sections/determinants-properties";
import { node as adjointSystems } from "../sections/adjoint-systems";
import { node as straightLines } from "../sections/straight-lines";
import { node as circles } from "../sections/circles";
import { node as parabola } from "../sections/parabola";
import { node as ellipse } from "../sections/ellipse";
import { node as hyperbola } from "../sections/hyperbola";
import { node as limits } from "../sections/limits";
import { node as continuity } from "../sections/continuity";
import { node as differentiability } from "../sections/differentiability";
import { node as differentiationMethods } from "../sections/differentiation-methods";

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

export const complexUnit: Unit = {
  id: "ma-5",
  track: "Mathematics",
  title: "Complex Numbers",
  blurb: "Arithmetic in the Argand plane, polar form and De Moivre, roots of unity, and geometry done with complex numbers.",
  nodes: [complexAlgebra, complexPolar, rootsOfUnity, complexGeometry],
};

export const sequencesUnit: Unit = {
  id: "ma-6",
  track: "Mathematics",
  title: "Sequences & Series",
  blurb: "Arithmetic and geometric progressions, means and the AM–GM inequality, sums of powers and telescoping series, and proof by induction.",
  nodes: [arithmeticProgressions, geometricProgressions, meansInequalities, specialSeries, induction],
};

export const countingUnit: Unit = {
  id: "ma-7",
  track: "Mathematics",
  title: "Permutations, Combinations & Binomial Theorem",
  blurb: "Arrangements and selections with restrictions, distributions and derangements, the binomial theorem and its coefficient identities, and probability by counting.",
  nodes: [permutationsAdvanced, combinationsAdvanced, binomialTheorem, binomialCoefficients, probabilityRules],
};

export const matricesUnit: Unit = {
  id: "ma-8",
  track: "Mathematics",
  title: "Matrices & Determinants",
  blurb: "Matrix algebra and its pitfalls, determinants and their properties, and solving linear systems with adjoints, inverses and Cramer's rule.",
  nodes: [matrixAlgebra, determinantsProperties, adjointSystems],
};

export const coordinateUnit: Unit = {
  id: "ma-9",
  track: "Mathematics",
  title: "Coordinate Geometry",
  blurb: "Straight lines, circles and the three conics, parabola, ellipse and hyperbola, with their foci, tangents and normals.",
  nodes: [straightLines, circles, parabola, ellipse, hyperbola],
};

export const limitsUnit: Unit = {
  id: "ma-10",
  track: "Mathematics",
  title: "Limits, Continuity & Differentiability",
  blurb: "Limits and indeterminate forms, continuity and the intermediate value theorem, differentiability, and the methods of differentiation.",
  nodes: [limits, continuity, differentiability, differentiationMethods],
};

export const mathematicsUnits: Unit[] = [algebraUnit, geometryUnit, functionsUnit, trigUnit, complexUnit, sequencesUnit, countingUnit, matricesUnit, coordinateUnit, limitsUnit];
