import type { ConfidenceLevel, ResearchKind, ResearchRecord, ReviewStatus } from "./types";

export type Signal = {
  id: string;
  title: string;
  summary: string;
  genAlphaRead: string;
  genZContrast: string;
  evidenceIds: string[];
  tags: string[];
  confidence: ConfidenceLevel;
};

export type SourceLink = {
  title: string;
  outlet: string;
  kind: ResearchKind;
  url: string;
  date: string;
  tags: string[];
  note: string;
};

export const signals: Signal[] = [
  {
    id: "ai-native",
    title: "AI is becoming ambient, not novel",
    summary: "Gen Alpha is arriving as AI moves from wow moment to default interface.",
    genAlphaRead: "They may treat generated answers, character chats, and AI helpers as normal parts of learning and play.",
    genZContrast: "Gen Z adopted social-first creation before AI assistants became broadly available.",
    evidenceIds: [
      "common-sense-ai-2026",
      "morning-consult-alpha-2026",
      "nielsen-ai-discovery-2026",
      "pwc-alpha-2026"
    ],
    tags: ["ai", "learning", "identity"],
    confidence: "high"
  },
  {
    id: "youtube-default",
    title: "YouTube is the ambient screen",
    summary: "Video platforms operate as entertainment, search, instruction, and parasocial hangout.",
    genAlphaRead: "Short clips, long videos, streamers, and explainers blur into one always-available media layer.",
    genZContrast: "Gen Z normalized creator media; Gen Alpha grows up with it as household infrastructure.",
    evidenceIds: ["common-sense-census-2025", "pew-kids-screens-2025", "morning-consult-alpha-2026", "gwi-alpha-z"],
    tags: ["youtube", "media", "creators"],
    confidence: "high"
  },
  {
    id: "game-spaces",
    title: "Games are social rooms",
    summary: "Roblox, Minecraft, Fortnite, and mobile games behave like hangout spaces, not only entertainment products.",
    genAlphaRead: "Identity, friendship, commerce, and co-creation happen inside playable worlds.",
    genZContrast: "Gen Z made social feeds identity infrastructure; Gen Alpha may do more of that inside interactive spaces.",
    evidenceIds: ["pwc-alpha-2026", "morning-consult-alpha-2026"],
    tags: ["gaming", "roblox", "identity"],
    confidence: "medium"
  },
  {
    id: "family-influence",
    title: "Parents are still in the loop",
    summary: "For younger Gen Alpha, family decisions, shared accounts, and co-viewing shape media and shopping behavior.",
    genAlphaRead: "Influence is not purely peer-to-peer yet; household context matters.",
    genZContrast: "Gen Z research often centers independence and peer networks more heavily.",
    evidenceIds: ["pwc-alpha-2026", "common-sense-census-2025", "attest-alpha-2026"],
    tags: ["family", "shopping", "media"],
    confidence: "high"
  },
  {
    id: "language-speed",
    title: "Language mutates at platform speed",
    summary: "Memes, slang, and absurdist humor become markers of belonging and media fluency.",
    genAlphaRead: "The signal is not one phrase; it is the acceleration of remix literacy.",
    genZContrast: "Gen Z created many mainstream internet dialects; Gen Alpha inherits faster remix loops.",
    evidenceIds: ["gwi-alpha-z", "people-alpha-slang-2024", "decoder-creator-economy-2026"],
    tags: ["language", "memes", "culture"],
    confidence: "medium"
  },
  {
    id: "offline-reset",
    title: "The countertrend is managed childhood",
    summary: "Screen limits, school phone rules, and parent anxiety may create sharper gaps between access and aspiration.",
    genAlphaRead: "The generation is AI-native, but not uniformly always-online in the same way.",
    genZContrast: "Gen Z's adolescence was shaped by smartphone ubiquity; Gen Alpha may see more active correction.",
    evidenceIds: ["common-sense-census-2025", "pew-kids-screens-2025", "common-sense-ai-guardrails-2026"],
    tags: ["wellbeing", "school", "family"],
    confidence: "medium"
  },
  {
    id: "creator-commerce",
    title: "Creators collapse media and shopping",
    summary: "Young audiences encounter products through creators, fandom, games, and live moments before traditional ads.",
    genAlphaRead: "Commerce may feel like part of the content layer rather than a separate persuasion layer.",
    genZContrast: "Gen Z helped mature influencer culture; Gen Alpha meets creator commerce as a default retail interface.",
    evidenceIds: ["decoder-creator-economy-2026", "aw360-cracking-alpha-2026", "pwc-alpha-2026"],
    tags: ["creators", "commerce", "brands"],
    confidence: "medium"
  }
];

export const seedRecords: ResearchRecord[] = [
  {
    id: "pwc-alpha-2026",
    kind: "report",
    title: "Gen Alpha survey report",
    source: "PwC",
    url: "https://www.pwc.com/us/en/industries/consumer-markets/library/gen-alpha-survey-report.html",
    summary: "Consumer-facing survey framing Gen Alpha as a rising influence on household shopping, entertainment, and brand decisions.",
    tags: ["shopping", "family", "media", "ai"],
    status: "reviewed",
    confidence: "high",
    publishedAt: "2026-01-01",
    createdAt: "2026-07-09T14:00:00.000Z"
  },
  {
    id: "common-sense-census-2025",
    kind: "report",
    title: "The 2025 Common Sense Census: Media Use by Kids Zero to Eight",
    source: "Common Sense Media",
    url: "https://www.commonsensemedia.org/research/the-2025-common-sense-census-media-use-by-kids-zero-to-eight",
    summary: "Baseline source for younger kids' screen time, device access, video behavior, and household media context.",
    tags: ["media", "screen-time", "family"],
    status: "reviewed",
    confidence: "high",
    publishedAt: "2025-01-01",
    createdAt: "2026-07-09T14:05:00.000Z"
  },
  {
    id: "pew-kids-screens-2025",
    kind: "report",
    title: "How parents manage screen time for kids",
    source: "Pew Research Center",
    url: "https://www.pewresearch.org/internet/2025/10/08/how-parents-manage-screen-time-for-kids/",
    summary: "National parent survey on children age 12 and under, including screen rules, perceived difficulty managing screen time, and children's platform use.",
    tags: ["screen-time", "parents", "rules", "media"],
    status: "reviewed",
    confidence: "high",
    publishedAt: "2025-10-08",
    createdAt: "2026-07-09T14:07:00.000Z"
  },
  {
    id: "common-sense-ai-2026",
    kind: "report",
    title: "A comprehensive report on teens, tweens, and AI",
    source: "Common Sense Media",
    url: "https://www.commonsensemedia.org/research/a-comprehensive-report-on-teens-tweens-and-ai",
    summary: "Useful for understanding AI exposure, use cases, trust, learning behavior, and risk perceptions across youth cohorts.",
    tags: ["ai", "learning", "trust"],
    status: "reviewed",
    confidence: "high",
    publishedAt: "2026-01-01",
    createdAt: "2026-07-09T14:10:00.000Z"
  },
  {
    id: "morning-consult-alpha-2026",
    kind: "report",
    title: "Gen Alpha 2026 media and entertainment trends",
    source: "Morning Consult",
    url: "https://morningconsult.com/reports/gen-alpha-2026-media-entertainment",
    summary: "Parent survey on Gen Alpha's device access, entertainment choices, family influence, and emerging AI behaviors.",
    tags: ["media", "entertainment", "ai", "shopping"],
    status: "queued",
    confidence: "high",
    publishedAt: "2026-01-01",
    createdAt: "2026-07-09T14:11:00.000Z"
  },
  {
    id: "nielsen-ai-discovery-2026",
    kind: "article",
    title: "Gen Alpha leads shift to AI-powered entertainment search, discovery and recommendations",
    source: "Nielsen",
    url: "https://www.nielsen.com/news-center/2026/gen-alpha-leads-shift-to-ai-powered-entertainment-search-discovery-and-recommendations/",
    summary: "Signals how AI chat and recommendation systems are becoming part of entertainment discovery, with Gen Alpha especially comfortable comparing chatbot and search results.",
    tags: ["ai", "search", "entertainment", "recommendations"],
    status: "queued",
    confidence: "medium",
    publishedAt: "2026-04-01",
    createdAt: "2026-07-09T14:12:00.000Z"
  },
  {
    id: "common-sense-ai-guardrails-2026",
    kind: "report",
    title: "Protecting kids online in the AI era",
    source: "Common Sense Media",
    url: "https://www.commonsensemedia.org/sites/default/files/featured-content/files/common-sense-media-protecting-kids-online-in-the-ai-era-the-path-forward.pdf",
    summary: "Policy and safety framing for AI companions, chatbot risks, privacy, and adult guardrails around children's AI use.",
    tags: ["ai", "safety", "guardrails", "parents"],
    status: "queued",
    confidence: "high",
    publishedAt: "2026-01-01",
    createdAt: "2026-07-09T14:13:00.000Z"
  },
  {
    id: "gwi-alpha-z",
    kind: "article",
    title: "Gen Z vs Gen Alpha",
    source: "GWI",
    url: "https://www.gwi.com/blog/gen-z-vs-gen-alpha",
    summary: "Comparative framing for how Gen Alpha differs from Gen Z across media, platforms, and identity formation.",
    tags: ["gen-z", "comparison", "media"],
    status: "reviewed",
    confidence: "medium",
    createdAt: "2026-07-09T14:15:00.000Z"
  },
  {
    id: "attest-alpha-2026",
    kind: "report",
    title: "The Gen Alpha Report: US edition",
    source: "Attest",
    url: "https://www.askattest.com/blog/articles/the-gen-alpha-report-us-edition",
    summary: "Brand and consumer read on older Gen Alpha as they enter adolescence, with useful cues for values, skills, and category expectations.",
    tags: ["brands", "shopping", "adolescence", "values"],
    status: "queued",
    confidence: "medium",
    publishedAt: "2026-05-01",
    createdAt: "2026-07-09T14:17:00.000Z"
  },
  {
    id: "people-alpha-slang-2024",
    kind: "article",
    title: "A guide to Gen Alpha slang, from Skibidi Toilet to rizz",
    source: "People",
    url: "https://people.com/all-about-gen-alpha-slang-8733165",
    summary: "Accessible glossary-style read on the meme language adults are using to decode Gen Alpha, useful as a conversation artifact rather than a definitive taxonomy.",
    tags: ["language", "memes", "slang", "culture"],
    status: "queued",
    confidence: "medium",
    publishedAt: "2024-10-29",
    createdAt: "2026-07-09T14:18:00.000Z"
  },
  {
    id: "ap-sports-alpha",
    kind: "article",
    title: "Sports leagues chase Gen Z and Gen Alpha fans",
    source: "Associated Press",
    url: "https://apnews.com/article/nba-mlb-nhl-genz-genalpha-62f54a8cd7748850e94470a814f8082e",
    summary: "Shows how mainstream entertainment brands are adapting to younger audiences through creators, short-form clips, and participatory culture.",
    tags: ["sports", "creators", "media"],
    status: "queued",
    confidence: "medium",
    createdAt: "2026-07-09T14:20:00.000Z"
  },
  {
    id: "decoder-creator-economy-2026",
    kind: "podcast",
    title: "Inside the big business of the creator economy, with the agents making it happen",
    source: "The Verge Decoder",
    url: "https://www.theverge.com/podcast/961603/raina-penchansky-ali-berman-dba-uta-influencer-cliff-marketing",
    summary: "Podcast conversation from Cannes Lions touching creator-led businesses, AI, personalization, live content, and Gen Alpha as a consumer-commerce cohort.",
    tags: ["podcast", "creators", "commerce", "ai"],
    status: "queued",
    confidence: "medium",
    publishedAt: "2026-07-06",
    createdAt: "2026-07-09T14:21:00.000Z"
  },
  {
    id: "aw360-cracking-alpha-2026",
    kind: "podcast",
    title: "Cracking Gen Alpha: What Brands Need to Know",
    source: "AW360 Live",
    url: "https://podcasts.apple.com/us/podcast/cracking-gen-alpha-what-brands-need-to-know/id1843969378?i=1000761860036",
    summary: "Interview with Beano Brain's Helenor Gilmour on what makes brands cool to kids, including humor, safety, authenticity, and heritage brand relevance.",
    tags: ["podcast", "brands", "cool", "youth-culture"],
    status: "queued",
    confidence: "medium",
    publishedAt: "2026-05-01",
    createdAt: "2026-07-09T14:22:00.000Z"
  },
  {
    id: "on-deadline-alpha-ai-2026",
    kind: "podcast",
    title: "Gen Alpha is on the rise in a world full of AI",
    source: "The On Deadline Podcast",
    url: "https://podcasts.apple.com/de/podcast/gen-alpha-is-on-the-rise-in-a-world-full-of-ai/id1502779270?i=1000751902936&l=en-GB",
    summary: "Short radio-style discussion on Gen Alpha, AI, chatbot marketing, and wearable AI, useful for tracking mainstream conversation language.",
    tags: ["podcast", "ai", "mainstream", "chatbots"],
    status: "queued",
    confidence: "medium",
    publishedAt: "2026-02-27",
    createdAt: "2026-07-09T14:23:00.000Z"
  },
  {
    id: "field-cousin-placeholder",
    kind: "interview",
    title: "Interview slot: cousin media diary",
    source: "Field interview",
    summary: "Reserved slot for a first family interview about daily screens, Roblox/YouTube behavior, AI use, and shopping influence.",
    tags: ["interview", "media-diary", "family"],
    status: "new",
    confidence: "medium",
    createdAt: "2026-07-09T14:25:00.000Z"
  }
];

export const sourceLinks: SourceLink[] = seedRecords
  .filter((record) => record.url)
  .map((record) => ({
    title: record.title,
    outlet: record.source,
    kind: record.kind,
    url: record.url as string,
    date: record.publishedAt ?? record.createdAt.slice(0, 10),
    tags: record.tags,
    note: record.summary
  }));

export const statusLabels: Record<ReviewStatus, string> = {
  new: "New",
  queued: "Queued",
  reviewed: "Reviewed"
};
