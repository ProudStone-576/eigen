import type { Unit } from "@/lib/content/types";
import { node as bayesianInference } from "../sections/bayesian-inference";
import { node as conjugatePriors } from "../sections/conjugate-priors";
import { node as bayesFactors } from "../sections/bayes-factors";
import { node as hierarchicalModels } from "../sections/hierarchical-models";
import { node as mcmc } from "../sections/mcmc";

export const bayesianUnit: Unit = {
  id: "sm-4",
  track: "Statistical modelling",
  title: "Bayesian Statistics",
  blurb: "Priors, posteriors and credible intervals; conjugate updating; comparing models by Bayes factors; pooling groups; and sampling posteriors with MCMC.",
  nodes: [bayesianInference, conjugatePriors, bayesFactors, hierarchicalModels, mcmc],
};
