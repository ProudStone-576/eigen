import type { Unit } from "@/lib/content/types";
import { node as clinicalEpi } from "../sections/clinical-epi";
import { node as econometricsFinance } from "../sections/econometrics-finance";
import { node as qualityControl } from "../sections/quality-control";
import { node as spatialEnvironmental } from "../sections/spatial-environmental";
import { node as psychometricsSocial } from "../sections/psychometrics-social";
import { node as geneticsNetworksText } from "../sections/genetics-networks-text";
import { node as sportsForensic } from "../sections/sports-forensic";

export const fieldsUnit: Unit = {
  id: "sm-12",
  track: "Statistical modelling",
  title: "Statistics in the Field",
  blurb: "How statistics is practised in medicine, economics and finance, industry, the environment, education and social science, genetics and networks, sport and the courtroom.",
  nodes: [clinicalEpi, econometricsFinance, qualityControl, spatialEnvironmental, psychometricsSocial, geneticsNetworksText, sportsForensic],
};
