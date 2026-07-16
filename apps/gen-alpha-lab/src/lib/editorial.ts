export type InsightTabId = "play-belonging" | "media-influence" | "time-learning" | "ai-agency";

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

export const insightTabs: InsightTab[] = [
  {
    id: "play-belonging",
    label: "Play and belonging",
    thesis: "Play is where friendship, identity, and making become one behavior.",
    tone: "acid"
  },
  {
    id: "media-influence",
    label: "Media and influence",
    thesis: "Culture arrives through people and repeatable formats, then moves through the household.",
    tone: "coral"
  },
  {
    id: "time-learning",
    label: "Time and learning",
    thesis: "Digital life is woven into managed routines, curiosity, and help on demand.",
    tone: "cyan"
  },
  {
    id: "ai-agency",
    label: "AI and agency",
    thesis: "AI feels ordinary; judgment and verification are the emerging differentiators.",
    tone: "violet"
  }
];

export const editorialInsights: EditorialInsight[] = [
  {
    id: "play-is-social",
    number: "01",
    tabId: "play-belonging",
    title: "Play is social and creative.",
    interpretation: "Roblox, Minecraft, and Fortnite are places to gather, make, perform, and solve problems together.",
    href: "/findings/creation-gaming-is-participatory",
    tone: "acid"
  },
  {
    id: "friendship-is-portable",
    number: "02",
    tabId: "play-belonging",
    title: "Friendship travels with the activity.",
    interpretation: "The group moves between chat, video, games, and real life without treating those as separate social worlds.",
    href: "/findings/friendship-portable",
    tone: "acid"
  },
  {
    id: "identity-is-remixed",
    number: "03",
    tabId: "play-belonging",
    title: "Customization is a social language.",
    interpretation: "Avatars, skins, builds, edits, and inside jokes let identity stay flexible, visible, and shared.",
    href: "/topics/play-create",
    tone: "acid"
  },
  {
    id: "video-is-utility",
    number: "04",
    tabId: "media-influence",
    title: "Video is utility and culture.",
    interpretation: "The same video can entertain, explain, teach a move, start a purchase, and give friends something to quote.",
    href: "/findings/video-default",
    tone: "coral"
  },
  {
    id: "creators-are-formats",
    number: "05",
    tabId: "media-influence",
    title: "Creators are behavioral templates.",
    interpretation: "Their real influence is the challenge, reaction, ritual, phrase, or way of inviting the audience to participate.",
    href: "/influencers",
    tone: "coral"
  },
  {
    id: "influence-is-negotiated",
    number: "06",
    tabId: "media-influence",
    title: "Influence is negotiated at home.",
    interpretation: "Creators and peers spark the want; adults still shape access, safety, permission, and purchase.",
    href: "/findings/influence-is-networked",
    tone: "coral"
  },
  {
    id: "time-is-managed",
    number: "07",
    tabId: "time-learning",
    title: "Digital time is still managed childhood.",
    interpretation: "What a screen enables, who is present, and what it replaces matter more than duration alone.",
    href: "/findings/time-is-managed",
    tone: "cyan"
  },
  {
    id: "learning-is-assembled",
    number: "08",
    tabId: "time-learning",
    title: "Learning is assembled on demand.",
    interpretation: "School, tutorial video, search, games, family help, and AI support all sit inside one learning environment.",
    href: "/findings/learning-is-assembled",
    tone: "cyan"
  },
  {
    id: "ai-is-normal",
    number: "09",
    tabId: "ai-agency",
    title: "AI is a default interface.",
    interpretation: "Asking, comparing, discovering, and making increasingly begin with a system that answers back.",
    href: "/findings/ai-is-a-normal-interface",
    tone: "violet"
  },
  {
    id: "verification-is-literacy",
    number: "10",
    tabId: "ai-agency",
    title: "Verification is becoming a core literacy.",
    interpretation: "Fluency now includes knowing when to question, compare, check, and ask an adult or another source.",
    href: "/topics/ai",
    tone: "violet"
  }
];

export function getInsightsForTab(tabId: InsightTabId): EditorialInsight[] {
  return editorialInsights.filter((insight) => insight.tabId === tabId);
}

export const libraryTakeaways = [
  "Culture moves faster than reports.",
  "Patterns matter more than anecdotes.",
  "Context changes the meaning of every signal."
] as const;
