import type { Unit } from "@/lib/content/types";
import { node as monteCarlo } from "../sections/monte-carlo";
import { node as statisticalComputing } from "../sections/statistical-computing";
import { node as reproduciblePractice } from "../sections/reproducible-practice";

export const computingUnit: Unit = {
  id: "sm-11",
  track: "Statistical modelling",
  title: "Statistical Computing & Practice",
  blurb: "Simulation and random number generation, computing at scale with streams, shards and privacy, and reproducible analysis in Python, R and SQL.",
  nodes: [monteCarlo, statisticalComputing, reproduciblePractice],
};
