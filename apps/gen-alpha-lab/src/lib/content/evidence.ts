import { sources } from "./sources";
import type { EvidenceItem, Insight, Theme } from "./types";

export const themes: Theme[] = [
  { id: "play-belonging", title: "Play & Belonging", description: "Social play, identity, family participation, and safety." },
  { id: "media-influence", title: "Media & Influence", description: "Video, creators, culture, household influence, and discovery." },
  { id: "time-routines", title: "Time & Routines", description: "Daily media rhythms, device access, and household context." },
  { id: "learning-becoming", title: "Learning & Becoming", description: "Learning, creativity, AI, literacy, and self-directed growth." },
];

type InsightSeed = Pick<Insight, "id" | "themeId" | "sequence" | "title" | "thesis" | "tags"> & {
  sourceIds: [string, string];
};

const insightSeeds: InsightSeed[] = [
  { id: "play-social-infrastructure", themeId: "play-belonging", sequence: 1, title: "Play is social infrastructure.", thesis: "Shared activity gives friendship a durable place to happen.", tags: ["play", "belonging"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"] },
  { id: "play-making-interface", themeId: "play-belonging", sequence: 2, title: "Playing and making increasingly share the same interface.", thesis: "Creation tools make participation part of play.", tags: ["play", "creation"], sourceIds: ["walton-creation-gaming-2024", "roblox-search-style-trends-2025"] },
  { id: "play-friendship-travels", themeId: "play-belonging", sequence: 3, title: "Friendship travels between games, chat, video, and real life.", thesis: "Relationships move across connected activities.", tags: ["friendship", "spaces"], sourceIds: ["ofcom-children-media-lives-2025", "pew-teens-video-games-2024"] },
  { id: "play-avatars-identity", themeId: "play-belonging", sequence: 4, title: "Avatars are rehearsal spaces for identity.", thesis: "Digital expression lets young people try style and social signals.", tags: ["identity", "avatars"], sourceIds: ["roblox-search-style-trends-2025", "ofcom-children-media-lives-2025"] },
  { id: "play-small-crews", themeId: "play-belonging", sequence: 5, title: "Small crews matter more than public follower counts.", thesis: "Repeated shared activity can matter more than broadcast reach.", tags: ["friendship", "groups"], sourceIds: ["ofcom-children-media-lives-2025", "pew-teens-video-games-2024"] },
  { id: "play-competition-performance", themeId: "play-belonging", sequence: 6, title: "Competition is also performance and storytelling.", thesis: "Games can be watched, narrated, and shared alongside being played.", tags: ["competition", "media"], sourceIds: ["pew-teens-video-games-2024", "ap-sports-alpha-2026"] },
  { id: "play-status-contribution", themeId: "play-belonging", sequence: 7, title: "Digital status is built through fluency, objects, and contribution.", thesis: "Contribution and cultural fluency can signal belonging in shared worlds.", tags: ["identity", "participation"], sourceIds: ["roblox-search-style-trends-2025", "walton-creation-gaming-2024"] },
  { id: "play-family-coplay", themeId: "play-belonging", sequence: 8, title: "Family co-play remains part of the social system.", thesis: "Households shape the conditions around play and media.", tags: ["family", "play"], sourceIds: ["common-sense-census-2025", "ofcom-children-media-lives-2025"] },
  { id: "play-offline-rebound", themeId: "play-belonging", sequence: 9, title: "Offline play is rebounding rather than disappearing.", thesis: "Digital and offline activity should be studied together.", tags: ["offline", "play"], sourceIds: ["anxious-generation-book", "digital-wellbeing-review-2025"] },
  { id: "play-safety-boundaries", themeId: "play-belonging", sequence: 10, title: "Safety boundaries are part of the play experience.", thesis: "Child-centered game participation requires safety by design.", tags: ["safety", "play"], sourceIds: ["unicef-online-gaming", "ftc-coppa-2025"] },
  { id: "media-video-default", themeId: "media-influence", sequence: 1, title: "Video is the default entertainment and explanation layer.", thesis: "Video is used for entertainment and everyday explanation.", tags: ["video", "media"], sourceIds: ["common-sense-census-2025", "ofcom-children-media-lives-2025"] },
  { id: "media-short-form-shape", themeId: "media-influence", sequence: 2, title: "Short-form changes the shape of attention, not only its duration.", thesis: "Format and context matter alongside time spent.", tags: ["short-form", "attention"], sourceIds: ["pew-teens-social-2024", "oxford-brain-rot-2024"] },
  { id: "media-creators-templates", themeId: "media-influence", sequence: 3, title: "Creators act as behavioral templates.", thesis: "Creators can make formats and behavior visible for imitation.", tags: ["creators", "influence"], sourceIds: ["ap-sports-alpha-2026", "emarketer-alpha-faq-2026"] },
  { id: "media-household-negotiation", themeId: "media-influence", sequence: 4, title: "Influence is negotiated inside the household.", thesis: "Interest, permission, and purchase often involve adults.", tags: ["family", "commerce"], sourceIds: ["pwc-alpha-2026", "gwi-alpha-unfiltered"] },
  { id: "media-discovery-commerce", themeId: "media-influence", sequence: 5, title: "Discovery and commerce increasingly share the same surface.", thesis: "Discovery formats can connect interest with household decisions.", tags: ["discovery", "commerce"], sourceIds: ["pwc-alpha-2026", "emarketer-alpha-faq-2026"] },
  { id: "media-repeatable-formats", themeId: "media-influence", sequence: 6, title: "Culture moves through repeatable formats more than fixed channels.", thesis: "Cultural participation can travel across platforms and formats.", tags: ["culture", "formats"], sourceIds: ["ap-sports-alpha-2026", "ofcom-children-media-lives-2025"] },
  { id: "media-properties-travel", themeId: "media-influence", sequence: 7, title: "Entertainment properties travel through music, games, products, and memes.", thesis: "Youth culture crosses media, play, and commercial environments.", tags: ["culture", "franchises"], sourceIds: ["ap-sports-alpha-2026", "emarketer-alpha-habits-2026"] },
  { id: "media-coviewing", themeId: "media-influence", sequence: 8, title: "Co-viewing still creates household-scale influence.", thesis: "Household context remains consequential for media meaning.", tags: ["family", "video"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"] },
  { id: "media-ai-recommendation", themeId: "media-influence", sequence: 9, title: "AI is entering entertainment search and recommendation.", thesis: "Conversational discovery changes how entertainment can be found and evaluated.", tags: ["ai", "discovery"], sourceIds: ["nielsen-ai-discovery-2026", "razorfish-alpha-ai"] },
  { id: "media-reach-risk", themeId: "media-influence", sequence: 10, title: "Reach, persuasion, and safety risk coexist in the same feeds.", thesis: "Participation environments need responsible safeguards alongside reach planning.", tags: ["safety", "media"], sourceIds: ["arxiv-young-user-safety-2025", "ftc-coppa-2025"] },
  { id: "time-screen-purpose", themeId: "time-routines", sequence: 1, title: "Total screen time hides a major shift in what screens are for.", thesis: "Context and activity matter alongside duration.", tags: ["time", "context"], sourceIds: ["digital-wellbeing-review-2025", "common-sense-census-2025"] },
  { id: "time-device-access", themeId: "time-routines", sequence: 2, title: "Personal device access begins before personal independence.", thesis: "Device access occurs inside family rules and developmental context.", tags: ["devices", "family"], sourceIds: ["common-sense-census-2025", "pew-teens-social-2024"] },
  { id: "time-youtube-rhythm", themeId: "time-routines", sequence: 3, title: "YouTube is embedded in the daily household rhythm.", thesis: "Video is a recurring part of young children's media environments.", tags: ["youtube", "routines"], sourceIds: ["common-sense-census-2025", "ofcom-children-media-lives-2025"] },
  { id: "time-parent-context", themeId: "time-routines", sequence: 4, title: "Parents manage context and rules, not only minutes.", thesis: "Household management includes content, setting, and permission.", tags: ["parents", "safety"], sourceIds: ["common-sense-census-2025", "unicef-online-gaming"] },
  { id: "time-family-needs", themeId: "time-routines", sequence: 5, title: "Screens fill practical family needs as well as entertainment needs.", thesis: "Media can be woven into routines, care, and learning.", tags: ["family", "media"], sourceIds: ["common-sense-census-2025", "aecf-generation-alpha"] },
  { id: "time-age-change", themeId: "time-routines", sequence: 6, title: "Digital routines change quickly with age.", thesis: "Age should remain explicit when interpreting media patterns.", tags: ["age", "routines"], sourceIds: ["common-sense-census-2025", "pew-teens-social-2024"] },
  { id: "time-nighttime-use", themeId: "time-routines", sequence: 7, title: "Nighttime use is part of the real media day.", thesis: "The daily media environment extends beyond a single daytime measure.", tags: ["routines", "time"], sourceIds: ["ofcom-children-media-lives-2025", "pew-platform-experiences-2026"] },
  { id: "time-coexistence", themeId: "time-routines", sequence: 8, title: "Online and offline activities coexist rather than cancel each other out.", thesis: "Digital activity needs to be considered with, not apart from, offline life.", tags: ["offline", "context"], sourceIds: ["screen-socioemotional-review-2025", "ofcom-children-media-lives-2025"] },
  { id: "time-private-day", themeId: "time-routines", sequence: 9, title: "Personal devices widen the private media day.", thesis: "Personal access changes where and how media can be used.", tags: ["devices", "privacy"], sourceIds: ["pew-teens-social-2024", "common-sense-census-2025"] },
  { id: "time-household-context", themeId: "time-routines", sequence: 10, title: "Income and household context shape access and use.", thesis: "Access and use should not be treated as uniform across families.", tags: ["equity", "family"], sourceIds: ["aecf-generation-alpha", "common-sense-census-2025"] },
  { id: "learning-assembled", themeId: "learning-becoming", sequence: 1, title: "Learning is assembled on demand across multiple environments.", thesis: "Learning can span school, video, play, search, and family support.", tags: ["learning", "spaces"], sourceIds: ["generation-alpha-education-review-2024", "ofcom-children-media-lives-2025"] },
  { id: "learning-creation-skills", themeId: "learning-becoming", sequence: 2, title: "Creation games are perceived as places to learn real skills.", thesis: "Creation-gaming environments can support making and social learning.", tags: ["learning", "games"], sourceIds: ["walton-creation-gaming-2024", "generation-alpha-education-review-2024"] },
  { id: "learning-ai-homework", themeId: "learning-becoming", sequence: 3, title: "AI is already part of homework and explanation.", thesis: "AI is appearing in youth learning and explanation contexts.", tags: ["ai", "learning"], sourceIds: ["common-sense-ai-2026", "common-sense-chatgpt-video"] },
  { id: "learning-ai-discovery", themeId: "learning-becoming", sequence: 4, title: "AI use extends beyond schoolwork into discovery, creativity, and support.", thesis: "AI use spans discovery, creativity, and everyday support contexts.", tags: ["ai", "creativity"], sourceIds: ["razorfish-alpha-ai", "nielsen-ai-discovery-2026"] },
  { id: "learning-safety-guidance", themeId: "learning-becoming", sequence: 5, title: "Safety guidance is lagging behind AI adoption.", thesis: "Family guidance and privacy safeguards remain necessary around AI use.", tags: ["ai", "safety"], sourceIds: ["common-sense-ai-2026", "ftc-coppa-2025"] },
  { id: "learning-verification", themeId: "learning-becoming", sequence: 6, title: "Verification is becoming a core literacy.", thesis: "Trust and checking matter when systems recommend and answer.", tags: ["ai", "literacy"], sourceIds: ["nielsen-ai-discovery-2026", "common-sense-chatgpt-video"] },
  { id: "learning-enablement", themeId: "learning-becoming", sequence: 7, title: "Technology matters for what it enables, not for the hardware itself.", thesis: "The learning value of technology depends on activity and setting.", tags: ["learning", "technology"], sourceIds: ["generation-alpha-education-review-2024", "digital-wellbeing-review-2025"] },
  { id: "learning-remix", themeId: "learning-becoming", sequence: 8, title: "Creative identity grows through iteration and remix.", thesis: "Creation environments give young people opportunities to make and revise.", tags: ["creation", "identity"], sourceIds: ["walton-creation-gaming-2024", "roblox-search-style-trends-2025"] },
  { id: "learning-commercial-fluency", themeId: "learning-becoming", sequence: 9, title: "Commercial fluency begins as a form of practical learning.", thesis: "Household influence and brands are part of young people's practical media environment.", tags: ["commerce", "learning"], sourceIds: ["pwc-alpha-2026", "razorfish-alpha-industries"] },
  { id: "learning-multimodal", themeId: "learning-becoming", sequence: 10, title: "Becoming is multimodal, self-directed, and socially coached.", thesis: "Learning and identity develop across social, creative, and educational contexts.", tags: ["learning", "identity"], sourceIds: ["generation-alpha-education-review-2024", "walton-creation-gaming-2024"] },
];

const sourceById = new Map(sources.map((item) => [item.id, item]));

export const insights: Insight[] = insightSeeds.map((seed) => ({
  ...seed,
  evidenceIds: seed.sourceIds.map((sourceId, index) => `evidence-${seed.id}-${index + 1}`),
  interpretation: "Treat this as evidence-bounded context for strategy, not a universal claim about every child.",
  ageRange: "Varies by supporting evidence",
  geography: "Varies by supporting evidence",
  confidence: "medium",
  confidenceReason: "The conclusion is supported by two distinct sources with explicit scope and limitations.",
  nuance: "Evidence is mixed across ages, countries, platforms, and household circumstances.",
  genZComparison: "Use adjacent teen evidence as context, not as a substitute for direct Gen Alpha measurement.",
  agencyImplication: "Design participation with clear value, age-appropriate safeguards, and an adult-facing explanation where needed.",
  relatedCreatorIds: [],
  relatedSpaceIds: [],
}));

export const evidenceItems: EvidenceItem[] = insightSeeds.flatMap((insight) =>
  insight.sourceIds.map((sourceId, index) => {
    const source = sourceById.get(sourceId);
    if (!source) {
      throw new Error(`Unknown source ${sourceId} in ${insight.id}`);
    }

    return {
      id: `evidence-${insight.id}-${index + 1}`,
      sourceId,
      claim: source.summary,
      locator: "Public report summary or methodology description.",
      evidenceType: source.sourceClass === "platform data" ? "platform-wide metric" : source.sourceClass === "journalism" ? "qualitative" : "self-reported",
      population: source.population,
      ageRange: source.ageRange,
      geography: source.geography,
      period: source.fieldworkPeriod ?? source.publishedAt ?? "Publication date not stated",
      methodology: source.methodology,
      limitations: source.limitations,
      insightIds: [insight.id],
    };
  }),
);
