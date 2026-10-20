import type { Unit } from "@/lib/content/types";
import { node as rankCorrelation } from "../sections/rank-correlation";
import { node as regressionInference } from "../sections/regression-inference";
import { node as regressionDiagnostics } from "../sections/regression-diagnostics";
import { node as regressionFeatures } from "../sections/regression-features";
import { node as glm } from "../sections/glm";

export const regressionUnit: Unit = {
  id: "sm-1",
  track: "Statistical modelling",
  title: "Regression Analysis",
  blurb: "Association beyond Pearson, inference for coefficients, checking a model, building features, and generalised linear models.",
  nodes: [rankCorrelation, regressionInference, regressionDiagnostics, regressionFeatures, glm],
};
