import type { Unit } from "@/lib/content/types";
import { samplingNodes } from "./describing";
import { node as experimentDesign } from "../sections/experiment-design";
import { node as dataQuality } from "../sections/data-quality";

export const collectingUnit: Unit = {
  id: "st-c",
  track: "Statistics",
  title: "Collecting Data",
  blurb: "Samples, surveys and experiments: how data are gathered, how they go wrong, and what to do about missing values.",
  nodes: [...samplingNodes, experimentDesign, dataQuality],
};
