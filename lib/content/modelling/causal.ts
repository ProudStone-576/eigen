import type { Unit } from "@/lib/content/types";
import { node as potentialOutcomes } from "../sections/potential-outcomes";
import { node as propensityScores } from "../sections/propensity-scores";
import { node as quasiExperiments } from "../sections/quasi-experiments";
import { node as mediationSensitivity } from "../sections/mediation-sensitivity";
import { node as heterogeneousEffects } from "../sections/heterogeneous-effects";

export const causalUnit: Unit = {
  id: "sm-7",
  track: "Statistical modelling",
  title: "Causal Inference",
  blurb: "Potential outcomes and causal diagrams, adjusting by matching and weighting, natural experiments, mediation and sensitivity, and effects that vary from person to person.",
  nodes: [potentialOutcomes, propensityScores, quasiExperiments, mediationSensitivity, heterogeneousEffects],
};
