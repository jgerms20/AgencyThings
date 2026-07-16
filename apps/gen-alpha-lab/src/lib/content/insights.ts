import { insights, themes } from "./evidence";
import type { Theme } from "./types";

export { insights, themes };

export const getInsight = (id: string) => insights.find((insight) => insight.id === id);

export const getInsightsForTheme = (id: Theme["id"]) =>
  insights.filter((insight) => insight.themeId === id).sort((left, right) => left.sequence - right.sequence);
