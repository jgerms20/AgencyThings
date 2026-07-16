import { insights, themes } from "@/lib/content/insights";
import type { Theme } from "@/lib/content/types";

export type InsightTabId = Theme["id"];

export type InsightTab = {
  id: InsightTabId;
  label: string;
  thesis: string;
  tone: "acid" | "cyan" | "coral" | "violet";
};

export type EditorialInsight = {
  id: string;
  number: string;
  tabId: InsightTabId;
  title: string;
  interpretation: string;
  href: string;
  tone: InsightTab["tone"];
};

const toneByTheme: Record<InsightTabId, InsightTab["tone"]> = {
  "play-belonging": "acid",
  "media-influence": "coral",
  "time-routines": "cyan",
  "learning-becoming": "violet",
};

export const insightTabs: InsightTab[] = themes.map((theme) => ({
  id: theme.id,
  label: theme.title,
  thesis: theme.description,
  tone: toneByTheme[theme.id],
}));

export const editorialInsights: EditorialInsight[] = insights.map((insight) => ({
  id: insight.id,
  number: String(insight.sequence).padStart(2, "0"),
  tabId: insight.themeId,
  title: insight.title,
  interpretation: insight.interpretation,
  href: `/insights/${insight.id}`,
  tone: toneByTheme[insight.themeId],
}));

export function getInsightsForTab(tabId: InsightTabId): EditorialInsight[] {
  return editorialInsights.filter((insight) => insight.tabId === tabId);
}

export const libraryTakeaways = [
  "Culture moves faster than reports.",
  "Patterns matter more than anecdotes.",
  "Context changes the meaning of every signal."
] as const;
