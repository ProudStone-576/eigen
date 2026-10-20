import type { Unit } from "@/lib/content/types";
import { node as tsComponents } from "../sections/ts-components";
import { node as exponentialSmoothing } from "../sections/exponential-smoothing";
import { node as stationarityAcf } from "../sections/stationarity-acf";
import { node as arima } from "../sections/arima";
import { node as forecasting } from "../sections/forecasting";
import { node as advancedTimeSeries } from "../sections/advanced-time-series";

export const timeSeriesUnit: Unit = {
  id: "sm-6",
  track: "Statistical modelling",
  title: "Time Series",
  blurb: "Trend and seasonality, exponential smoothing, stationarity and autocorrelation, ARIMA models, honest forecast evaluation, and volatility, VAR and spectral methods.",
  nodes: [tsComponents, exponentialSmoothing, stationarityAcf, arima, forecasting, advancedTimeSeries],
};
