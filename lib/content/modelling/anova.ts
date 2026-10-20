import type { Unit } from "@/lib/content/types";
import { node as oneWayAnova } from "../sections/one-way-anova";
import { node as postHocTests } from "../sections/post-hoc-tests";
import { node as twoWayAnova } from "../sections/two-way-anova";
import { node as doeAdvanced } from "../sections/doe-advanced";

export const anovaUnit: Unit = {
  id: "sm-2",
  track: "Statistical modelling",
  title: "ANOVA & Experiments",
  blurb: "Comparing many groups at once, finding which differ, factorial and repeated-measures designs, and getting the most from every experimental run.",
  nodes: [oneWayAnova, postHocTests, twoWayAnova, doeAdvanced],
};
