import type { Unit } from "@/lib/content/types";
import { node as treesEnsembles } from "../sections/trees-ensembles";
import { node as svmKnnNb } from "../sections/svm-knn-nb";
import { node as calibrationImbalance } from "../sections/calibration-imbalance";
import { node as interpretability } from "../sections/interpretability";
import { node as uncertaintyShift } from "../sections/uncertainty-shift";

export const learningUnit: Unit = {
  id: "sm-9",
  track: "Statistical modelling",
  title: "More Statistical Learning",
  blurb: "Trees, forests and boosting; SVMs, nearest neighbours and naive Bayes; calibrated probabilities and rare classes; explaining models; and honest uncertainty when data shift.",
  nodes: [treesEnsembles, svmKnnNb, calibrationImbalance, interpretability, uncertaintyShift],
};
