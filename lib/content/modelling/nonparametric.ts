import type { Unit } from "@/lib/content/types";
import { node as rankTests } from "../sections/rank-tests";
import { node as kruskalFriedman } from "../sections/kruskal-friedman";
import { node as normalityTests } from "../sections/normality-tests";
import { node as robustEstimation } from "../sections/robust-estimation";

export const nonparametricUnit: Unit = {
  id: "sm-3",
  track: "Statistical modelling",
  title: "Nonparametric & Robust Methods",
  blurb: "Rank tests that drop the normality assumption, checking a distribution's fit, and estimators that resist bad data.",
  nodes: [rankTests, kruskalFriedman, normalityTests, robustEstimation],
};
