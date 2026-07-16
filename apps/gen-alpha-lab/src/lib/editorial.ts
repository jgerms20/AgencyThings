import { insights, themes } from "@/lib/content/insights";
import type { Theme } from "@/lib/content/types";

export type OverviewThemeId = Theme["id"];
export type InsightTabId = "play-belonging" | "media-influence" | "time-learning" | "ai-agency";

export type InsightTab = {
  id: InsightTabId;
  label: string;
  thesis: string;
  tone: "acid" | "cyan" | "coral" | "violet";
};

export type OverviewTab = Omit<InsightTab, "id"> & { id: OverviewThemeId };

export type EditorialInsight = {
  id: string;
  number: string;
  tabId: InsightTabId;
  title: string;
  interpretation: string;
  href: string;
  tone: InsightTab["tone"];
};

export type OverviewInsight = Omit<EditorialInsight, "tabId"> & { tabId: OverviewThemeId };

const toneByTheme: Record<OverviewThemeId, InsightTab["tone"]> = {
  "play-belonging": "acid",
  "media-influence": "coral",
  "time-routines": "cyan",
  "learning-becoming": "violet",
};

const labelByTheme: Record<OverviewThemeId, string> = {
  "play-belonging": "Play and belonging",
  "media-influence": "Media and influence",
  "time-routines": "Time & Routines",
  "learning-becoming": "Learning & Becoming",
};

export const overviewTabs: OverviewTab[] = themes.map((theme) => ({
  id: theme.id,
  label: labelByTheme[theme.id],
  thesis: theme.description,
  tone: toneByTheme[theme.id],
}));

export const overviewInsights: OverviewInsight[] = insights.map((insight) => ({
  id: insight.id,
  number: String(insight.sequence).padStart(2, "0"),
  tabId: insight.themeId,
  title: insight.title,
  interpretation: insight.interpretation,
  href: `/insights/${insight.id}`,
  tone: toneByTheme[insight.themeId],
}));

export function getOverviewInsightsForTheme(themeId: OverviewThemeId): OverviewInsight[] {
  return overviewInsights.filter((insight) => insight.tabId === themeId);
}

// These exports keep the previous editorial routes stable while the rendered UI reads the canonical graph.
export const insightTabs: InsightTab[] = [
  { id: "play-belonging", label: "Play and belonging", thesis: overviewTabs[0].thesis, tone: "acid" },
  { id: "media-influence", label: "Media and influence", thesis: overviewTabs[1].thesis, tone: "coral" },
  { id: "time-learning", label: "Time and learning", thesis: `${overviewTabs[2].thesis} ${overviewTabs[3].thesis}`, tone: "cyan" },
  { id: "ai-agency", label: "AI and agency", thesis: "A cross-cutting tag for discovery, learning, creativity, safety, and verification.", tone: "violet" },
];

const legacySelections: Record<InsightTabId, OverviewInsight[]> = {
  "play-belonging": getOverviewInsightsForTheme("play-belonging").slice(0, 3),
  "media-influence": getOverviewInsightsForTheme("media-influence").slice(0, 3),
  "time-learning": [
    getOverviewInsightsForTheme("time-routines")[0],
    getOverviewInsightsForTheme("learning-becoming")[0],
  ],
  "ai-agency": overviewInsights.filter((insight) => insights.find((item) => item.id === insight.id)?.tags.includes("ai")).slice(0, 2),
};

export const editorialInsights: EditorialInsight[] = insightTabs.flatMap((tab) =>
  legacySelections[tab.id].map((insight) => ({ ...insight, tabId: tab.id })),
);

export function getInsightsForTab(tabId: InsightTabId): EditorialInsight[] {
  return editorialInsights.filter((insight) => insight.tabId === tabId);
}

export const libraryTakeaways = [
  "Culture moves faster than reports.",
  "Patterns matter more than anecdotes.",
  "Context changes the meaning of every signal."
] as const;
