import type { Unit } from "@/lib/content/types";
import { node as sufficiency } from "../sections/sufficiency";
import { node as asymptotics } from "../sections/asymptotics";
import { node as advancedAsymptotics } from "../sections/advanced-asymptotics";
import { node as decisionTheory } from "../sections/decision-theory";
import { node as kde } from "../sections/kde";
import { node as highDimensional } from "../sections/high-dimensional";
import { node as learningTheory } from "../sections/learning-theory";

export const mathStatsUnit: Unit = {
  id: "sm-10",
  track: "Statistical modelling",
  title: "Mathematical Statistics",
  blurb: "Sufficiency and optimal estimators, asymptotic theory and the delta method, empirical processes and semiparametrics, decision theory, kernel smoothing, high-dimensional inference and learning theory.",
  nodes: [sufficiency, asymptotics, advancedAsymptotics, decisionTheory, kde, highDimensional, learningTheory],
};
