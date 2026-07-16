import { insights as evidenceInsights, themes } from "./evidence";
import type { Theme } from "./types";

const relatedByTheme: Record<
  Theme["id"],
  { creatorIds: [string, string]; spaceIds: [string, string] }
> = {
  "play-belonging": {
    creatorIds: ["aphmau", "itsfunneh"],
    spaceIds: ["roblox", "minecraft"],
  },
  "media-influence": {
    creatorIds: ["mrbeast", "salish-matter"],
    spaceIds: ["youtube", "tiktok"],
  },
  "time-routines": {
    creatorIds: ["ms-rachel", "cocomelon"],
    spaceIds: ["youtube", "snapchat"],
  },
  "learning-becoming": {
    creatorIds: ["ms-rachel", "moriah-elizabeth"],
    spaceIds: ["youtube", "capcut"],
  },
};

const comparisonByTheme: Record<Theme["id"], string> = {
  "play-belonging":
    "Gen Z helped normalize social gaming; Gen Alpha is encountering creation, identity, and friendship as more integrated parts of play from childhood.",
  "media-influence":
    "Gen Z learned to tune social feeds; Gen Alpha is meeting entertainment as a layer that also explains, recommends, and invites participation.",
  "time-routines":
    "Gen Z's screen debate often centered online identity; Gen Alpha's is more visibly structured by family routines, early device access, and context.",
  "learning-becoming":
    "Gen Z learned to search for answers; Gen Alpha is growing up with systems that can coach, generate, and answer back in the moment.",
};

const implicationByTheme: Record<Theme["id"], string> = {
  "play-belonging":
    "Create a useful role for participation, contribution, or co-play, with safeguards that are legible to both children and adults.",
  "media-influence":
    "Build a repeatable format people can recognize and use, then make commercial intent, privacy, and age context explicit.",
  "time-routines":
    "Design for a real household moment and explain what the experience enables, what it asks for, and when it should stop.",
  "learning-becoming":
    "Invite a low-friction first attempt, support checking and iteration, and keep adult guidance available where risk or uncertainty rises.",
};

export const insights = evidenceInsights.map((insight) => {
  const related = relatedByTheme[insight.themeId];
  const relatedIndex = (insight.sequence - 1) % related.creatorIds.length;

  return {
    ...insight,
    interpretation: `${insight.thesis} Read the pattern through the age, household, platform, and geography limits in its evidence.`,
    genZComparison: comparisonByTheme[insight.themeId],
    agencyImplication: implicationByTheme[insight.themeId],
    relatedCreatorIds: [related.creatorIds[relatedIndex]],
    relatedSpaceIds: [related.spaceIds[relatedIndex]],
  };
});

export { themes };

export const getInsight = (id: string) => insights.find((insight) => insight.id === id);

export const getInsightsForTheme = (id: Theme["id"]) =>
  insights.filter((insight) => insight.themeId === id).sort((left, right) => left.sequence - right.sequence);
