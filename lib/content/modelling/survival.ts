import type { Unit } from "@/lib/content/types";
import { node as survivalFunctions } from "../sections/survival-functions";
import { node as kaplanMeier } from "../sections/kaplan-meier";
import { node as coxModel } from "../sections/cox-model";
import { node as survivalExtensions } from "../sections/survival-extensions";

export const survivalUnit: Unit = {
  id: "sm-8",
  track: "Statistical modelling",
  title: "Survival & Reliability",
  blurb: "Time-to-event data with censoring, survival and hazard functions, Kaplan–Meier curves and the log-rank test, Cox and Weibull models, competing risks and reliability testing.",
  nodes: [survivalFunctions, kaplanMeier, coxModel, survivalExtensions],
};
