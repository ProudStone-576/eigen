import type { Unit } from "@/lib/content/types";
import { node as estimatorProperties } from "../sections/estimator-properties";
import { node as methodOfMoments } from "../sections/method-of-moments";
import { node as fisherInformation } from "../sections/fisher-information";
import { node as bootstrap } from "../sections/bootstrap";
import { node as intervalsMore } from "../sections/intervals-more";
import { node as surveyDesign } from "../sections/survey-design";

export const estimationUnit: Unit = {
  id: "st-e",
  track: "Statistics",
  title: "Estimation",
  blurb: "What makes an estimator good, other ways to build one, the limits on precision, resampling, and intervals beyond the mean.",
  nodes: [estimatorProperties, methodOfMoments, fisherInformation, bootstrap, intervalsMore, surveyDesign],
};
