import type { Unit } from "@/lib/content/types";
import { node as mahalanobis } from "../sections/mahalanobis";
import { node as discriminantAnalysis } from "../sections/discriminant-analysis";
import { node as clustering } from "../sections/clustering";
import { node as gmmEm } from "../sections/gmm-em";
import { node as factorAnalysis } from "../sections/factor-analysis";

export const multivariateUnit: Unit = {
  id: "sm-5",
  track: "Statistical modelling",
  title: "Multivariate Statistics",
  blurb: "Distance and testing with correlated variables, classifying with normal classes, finding clusters, fitting mixtures by EM, and latent factors.",
  nodes: [mahalanobis, discriminantAnalysis, clustering, gmmEm, factorAnalysis],
};
