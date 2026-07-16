import { influencers as legacyCreators } from "../influencers";
import type { ConfidenceLevel } from "./types";

export type CultureShaperType = "creator" | "artist" | "athlete" | "screen-ip" | "franchise";
export type CultureShaperPronouns = "he" | "she" | "they";
export type IndicatorKey = "reach" | "participation" | "commercialPull" | "audienceCenter";
export type IndicatorTier = 1 | 2 | 3 | 4;

export type IndicatorAssessment = {
  indicator: IndicatorKey;
  label: string;
  tier: IndicatorTier;
  definition: string;
  rationale: string;
  sourceIds: string[];
};

export type CultureShaperVideo = {
  youtubeId: string;
  title: string;
  embeddable: boolean;
};

export type RelatedCultureEntity = {
  id: string;
  label: string;
  kind: "culture-shaper" | "insight" | "space";
  href: string;
};

export type CultureShaper = {
  id: string;
  name: string;
  pronouns: CultureShaperPronouns;
  type: CultureShaperType;
  role: string;
  category: string;
  summary: string;
  topics: string[];
  formats: string[];
  platforms: string[];
  audienceSegments: string[];
  audience: {
    center: string;
    broader: string;
    ageRange: string;
    confidence: ConfidenceLevel;
    confidenceRationale: string;
  };
  influenceMechanism: string;
  definingMoments: string[];
  relatedEntities: RelatedCultureEntity[];
  insightIds: string[];
  sourceIds: string[];
  sourceNotes: Array<{ sourceId: string; note: string }>;
  indicators: Record<IndicatorKey, IndicatorAssessment>;
  officialUrl: string;
  portrait?: string;
  videos: CultureShaperVideo[];
  featured: boolean;
};

type IndicatorRubric = {
  label: string;
  generalDefinition: string;
  tiers: Record<IndicatorTier, string>;
};

export const cultureShaperRubric: Record<IndicatorKey, IndicatorRubric> = {
  reach: {
    label: "Reach",
    generalDefinition: "Public audience footprint across relevant platforms and mainstream recognition.",
    tiers: {
      1: "Emerging or niche visibility inside a specific community.",
      2: "Established visibility across one audience or platform cluster.",
      3: "Category-leading visibility across platforms or adjacent audiences.",
      4: "Mass, global, or household-scale recognition beyond the core audience.",
    },
  },
  participation: {
    label: "Participation",
    generalDefinition: "How strongly audiences react, imitate, remix, play, chat, submit, or shape the format.",
    tiers: {
      1: "Primarily watched or followed, with limited visible audience action.",
      2: "Prompts recurring reaction, conversation, or light imitation.",
      3: "Regularly invites copying, playing, sharing, or community response.",
      4: "Audience action is a defining part of the format or cultural system.",
    },
  },
  commercialPull: {
    label: "Commercial pull",
    generalDefinition: "Evidence that influence travels into products, licensing, tickets, subscriptions, spending, or household requests.",
    tiers: {
      1: "Limited or emerging evidence of influence beyond attention.",
      2: "Some extensions, partnerships, or purchase pathways are visible.",
      3: "Multiple durable product, ticket, subscription, or licensing pathways are active.",
      4: "A major cross-category commercial ecosystem is central to the property or personality.",
    },
  },
  audienceCenter: {
    label: "Audience center",
    generalDefinition: "The best-supported age and audience concentration, stated with confidence rather than treated as a live measurement.",
    tiers: {
      1: "Audience center is an editorial estimate with limited direct age evidence.",
      2: "Audience center is supported by format and platform context, but remains broad.",
      3: "Audience center is consistently indicated by content, platform, and adjacent research.",
      4: "Audience center is unusually clear through child-directed design, household use, or published audience evidence.",
    },
  },
};

const creatorMetadata: Record<
  string,
  { topics: string[]; formats: string[]; sourceIds: string[]; insightIds: string[] }
> = {
  mrbeast: { topics: ["spectacle", "philanthropy", "commerce"], formats: ["challenge", "competition", "long-form video"], sourceIds: ["emarketer-alpha-faq-2026", "pwc-alpha-2026"], insightIds: ["media-creators-templates", "media-discovery-commerce"] },
  ishowspeed: { topics: ["gaming", "football", "music"], formats: ["livestream", "reaction", "music video"], sourceIds: ["ap-sports-alpha-2026", "pew-teens-social-2024"], insightIds: ["play-competition-performance", "media-repeatable-formats"] },
  "kai-cenat": { topics: ["gaming", "music", "comedy"], formats: ["livestream", "subathon", "ensemble comedy"], sourceIds: ["pew-teens-social-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-small-crews", "media-creators-templates"] },
  aphmau: { topics: ["gaming", "friendship", "fantasy"], formats: ["roleplay", "episodic video", "character story"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-making-interface", "media-properties-travel"] },
  "ms-rachel": { topics: ["learning", "language", "music"], formats: ["lesson", "song", "direct address"], sourceIds: ["common-sense-census-2025", "generation-alpha-education-review-2024"], insightIds: ["time-family-needs", "learning-assembled"] },
  "salish-matter": { topics: ["friendship", "gymnastics", "beauty"], formats: ["challenge", "vlog", "makeover"], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], insightIds: ["media-creators-templates", "learning-remix"] },
  "ryans-world": { topics: ["toys", "science", "family"], formats: ["toy play", "experiment", "animation"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], insightIds: ["media-discovery-commerce", "media-coviewing"] },
  "like-nastya": { topics: ["pretend play", "family", "travel"], formats: ["roleplay", "family adventure", "visual story"], sourceIds: ["common-sense-census-2025", "gwi-alpha-unfiltered"], insightIds: ["media-coviewing", "media-repeatable-formats"] },
  "kids-diana": { topics: ["pretend play", "family", "dress-up"], formats: ["roleplay", "sibling story", "visual story"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], insightIds: ["media-coviewing", "media-properties-travel"] },
  "vlad-and-niki": { topics: ["toys", "siblings", "family"], formats: ["challenge", "toy play", "family adventure"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], insightIds: ["play-family-coplay", "media-discovery-commerce"] },
  cocomelon: { topics: ["music", "routines", "early learning"], formats: ["animation", "song", "nursery rhyme"], sourceIds: ["common-sense-census-2025", "digital-wellbeing-review-2025"], insightIds: ["time-family-needs", "media-coviewing"] },
  "alan-chikin-chow": { topics: ["school", "friendship", "comedy"], formats: ["short-form video", "serial drama", "sketch"], sourceIds: ["pew-teens-social-2024", "oxford-brain-rot-2024"], insightIds: ["media-short-form-shape", "media-repeatable-formats"] },
  "stokes-twins": { topics: ["comedy", "challenges", "friendship"], formats: ["challenge", "prank", "short-form video"], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], insightIds: ["media-short-form-shape", "media-creators-templates"] },
  lankybox: { topics: ["gaming", "comedy", "toys"], formats: ["gameplay", "reaction", "song"], sourceIds: ["walton-creation-gaming-2024", "pwc-alpha-2026"], insightIds: ["media-properties-travel", "media-discovery-commerce"] },
  "danny-go": { topics: ["music", "movement", "imagination"], formats: ["dance-along", "song", "live show"], sourceIds: ["common-sense-census-2025", "outdoor-participation-trends-2026"], insightIds: ["time-coexistence", "learning-multimodal"] },
  "dude-perfect": { topics: ["sports", "competition", "stunts"], formats: ["trick shot", "competition", "live show"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], insightIds: ["play-competition-performance", "media-coviewing"] },
  unspeakable: { topics: ["gaming", "Minecraft", "stunts"], formats: ["gameplay", "challenge", "build"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-making-interface", "time-coexistence"] },
  kreekcraft: { topics: ["gaming", "Roblox", "platform news"], formats: ["livestream", "gameplay", "reaction"], sourceIds: ["roblox-search-style-trends-2025", "walton-creation-gaming-2024"], insightIds: ["play-status-contribution", "media-creators-templates"] },
  preston: { topics: ["gaming", "Minecraft", "competition"], formats: ["gameplay", "challenge", "collaboration"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-competition-performance", "play-small-crews"] },
  itsfunneh: { topics: ["gaming", "Roblox", "siblings"], formats: ["gameplay", "roleplay", "ensemble comedy"], sourceIds: ["walton-creation-gaming-2024", "roblox-search-style-trends-2025"], insightIds: ["play-small-crews", "play-avatars-identity"] },
  "moriah-elizabeth": { topics: ["art", "craft", "characters"], formats: ["makeover", "process video", "illustration"], sourceIds: ["gwi-alpha-unfiltered", "generation-alpha-education-review-2024"], insightIds: ["learning-remix", "learning-multimodal"] },
  sssniperwolf: { topics: ["internet culture", "gaming", "comedy"], formats: ["reaction", "commentary", "short-form video"], sourceIds: ["pew-teens-social-2024", "arxiv-young-user-safety-2025"], insightIds: ["media-short-form-shape", "media-reach-risk"] },
  "rebecca-zamolo": { topics: ["mystery", "family", "friendship"], formats: ["challenge", "serial story", "escape room"], sourceIds: ["gwi-alpha-unfiltered", "emarketer-alpha-faq-2026"], insightIds: ["media-repeatable-formats", "media-creators-templates"] },
  "charli-damelio": { topics: ["dance", "fashion", "beauty"], formats: ["short-form video", "dance", "reality series"], sourceIds: ["pew-teens-social-2024", "pwc-alpha-2026"], insightIds: ["media-short-form-shape", "media-discovery-commerce"] },
  "nicole-laeno": { topics: ["dance", "school", "wellness"], formats: ["vlog", "dance", "routine video"], sourceIds: ["pew-teens-social-2024", "ofcom-children-media-lives-2025"], insightIds: ["media-creators-templates", "time-age-change"] },
  "jules-leblanc": { topics: ["music", "acting", "lifestyle"], formats: ["vlog", "song", "streaming series"], sourceIds: ["pew-teens-social-2024", "gwi-alpha-unfiltered"], insightIds: ["media-properties-travel", "media-creators-templates"] },
  "piper-rockelle": { topics: ["friendship", "music", "lifestyle"], formats: ["challenge", "music video", "serial story"], sourceIds: ["pew-teens-social-2024", "arxiv-young-user-safety-2025"], insightIds: ["play-small-crews", "media-reach-risk"] },
  "brent-rivera": { topics: ["comedy", "friendship", "school"], formats: ["sketch", "challenge", "short-form video"], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], insightIds: ["media-short-form-shape", "media-repeatable-formats"] },
  "ben-azelart": { topics: ["stunts", "travel", "friendship"], formats: ["challenge", "build", "collaboration"], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], insightIds: ["media-creators-templates", "media-repeatable-formats"] },
  jesser: { topics: ["basketball", "sports", "gaming"], formats: ["sports challenge", "collaboration", "competition"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], insightIds: ["play-competition-performance", "media-creators-templates"] },
};

function audienceSegments(audience: string): string[] {
  const normalized = audience.toLowerCase();
  return [
    "general",
    ...(normalized.includes("girl") ? ["girls"] : []),
    ...(normalized.includes("family") || normalized.includes("parent") || normalized.includes("caregiver") ? ["families"] : []),
    ...(normalized.includes("sport") ? ["sports fans"] : []),
    ...(normalized.includes("gaming") || normalized.includes("gamer") ? ["gamers"] : []),
  ];
}

function tierFromSignal(signal: string): IndicatorTier {
  const value = signal.toLowerCase();
  if (value.includes("very high") || value.includes("global") || value.includes("mass") || value.includes("household")) return 4;
  if (value.includes("high") || value.includes("leading") || value.includes("defining")) return 3;
  if (value.includes("medium") || value.includes("established") || value.includes("large") || value.includes("rising")) return 2;
  return 1;
}

function assessment(
  indicator: IndicatorKey,
  tier: IndicatorTier,
  rationale: string,
  sourceIds: string[],
): IndicatorAssessment {
  const rubric = cultureShaperRubric[indicator];
  return { indicator, label: rubric.label, tier, definition: rubric.tiers[tier], rationale, sourceIds };
}

function creatorAssessment(
  creator: (typeof legacyCreators)[number],
  metadata: (typeof creatorMetadata)[string],
): CultureShaper["indicators"] {
  const reachTier = tierFromSignal(creator.indicators[0].value);
  const participationTier = tierFromSignal(creator.indicators[1].value);
  const commercialTier = tierFromSignal(creator.indicators[2].value);
  const audienceTier: IndicatorTier = creator.audience.includes("Core audience") ? 3 : 2;
  return {
    reach: assessment("reach", reachTier, `${creator.name}'s ${creator.role.toLowerCase()} position is visible through ${creator.moments[0].toLowerCase()} and recognition beyond a single upload.`, metadata.sourceIds),
    participation: assessment("participation", participationTier, `${creator.name} gives audiences a repeatable action through ${creator.moments[1].toLowerCase()}, not only a personality to watch.`, metadata.sourceIds),
    commercialPull: assessment("commercialPull", commercialTier, `${creator.name}'s ${creator.moments[2].toLowerCase()} shows how attention can extend into products, events, or durable media properties.`, metadata.sourceIds),
    audienceCenter: assessment("audienceCenter", audienceTier, `${creator.name}'s best-supported center is ${creator.audience.replace("Core audience: ", "")}; this is an editorial range grounded in format and adjacent audience research.`, metadata.sourceIds),
  };
}

const migratedCreators: CultureShaper[] = legacyCreators.map((creator) => {
  const metadata = creatorMetadata[creator.id];
  const ageRange = creator.audience.match(/ages? ([0-9]+-[0-9]+)/)?.[1] ?? "varied";
  const videos: CultureShaperVideo[] = creator.featuredVideo
    ? [{ ...creator.featuredVideo, embeddable: true }]
    : [];

  return {
    id: creator.id,
    name: creator.name,
    pronouns: creator.pronouns,
    type: "creator",
    role: creator.role,
    category: creator.category,
    summary: creator.summary,
    topics: metadata.topics,
    formats: metadata.formats,
    platforms: creator.platforms,
    audienceSegments: audienceSegments(creator.audience),
    audience: {
      center: creator.audience.replace("Core audience: ", ""),
      broader: creator.audience.includes("plus") ? creator.audience.split(" plus ")[1] : "Adjacent youth and household audiences",
      ageRange,
      confidence: "medium",
      confidenceRationale: "The range is an editorial synthesis of the content format, platform context, and adjacent youth research, not live first-party analytics.",
    },
    influenceMechanism: creator.influenceReason,
    definingMoments: creator.moments,
    relatedEntities: [{ id: metadata.insightIds[0], label: metadata.topics[0], kind: "insight", href: `/insights/${metadata.insightIds[0]}` }],
    insightIds: metadata.insightIds,
    sourceIds: metadata.sourceIds,
    sourceNotes: metadata.sourceIds.map((sourceId, index) => ({
      sourceId,
      note: index === 0
        ? `${creator.name}'s ${metadata.formats[0]} work is read beside research on ${metadata.topics[0]} and youth media behavior.`
        : `${creator.moments[index + 1]} is an entity-specific editorial observation; this source supplies audience and household context rather than creator analytics.`,
    })),
    indicators: creatorAssessment(creator, metadata),
    officialUrl: creator.profileUrl,
    portrait: creator.portrait,
    videos,
    featured: creator.featured,
  };
});

type AdditionalSeed = Omit<CultureShaper, "indicators"> & {
  indicatorTiers: Record<IndicatorKey, IndicatorTier>;
};

function additional(seed: AdditionalSeed): CultureShaper {
  const rationales: Record<IndicatorKey, string> = {
    reach: `${seed.name}'s reach is reflected in ${seed.definingMoments[0].toLowerCase()} and recognition across ${seed.platforms.join(", ")}.`,
    participation: `${seed.name} prompts participation through ${seed.formats.join(", ")}, especially around ${seed.definingMoments[1].toLowerCase()}.`,
    commercialPull: `${seed.name}'s commercial pull is visible in ${seed.definingMoments[2].toLowerCase()} and the official extensions documented for this profile.`,
    audienceCenter: `${seed.name}'s best-supported center is ${seed.audience.center}; confidence is ${seed.audience.confidence} because ${seed.audience.confidenceRationale.toLowerCase()}`,
  };
  return {
    ...seed,
    indicators: {
      reach: assessment("reach", seed.indicatorTiers.reach, rationales.reach, seed.sourceIds),
      participation: assessment("participation", seed.indicatorTiers.participation, rationales.participation, seed.sourceIds),
      commercialPull: assessment("commercialPull", seed.indicatorTiers.commercialPull, rationales.commercialPull, seed.sourceIds),
      audienceCenter: assessment("audienceCenter", seed.indicatorTiers.audienceCenter, rationales.audienceCenter, seed.sourceIds),
    },
  };
}

const sharedMediaInsight = "media-properties-travel";

const additionalShapers: CultureShaper[] = [
  additional({ id: "olivia-rodrigo", name: "Olivia Rodrigo", pronouns: "she", type: "artist", role: "Confessional pop reference point", category: "Music and youth identity", summary: "Songwriting about first heartbreak, anger, and self-definition gives older Gen Alpha a vivid vocabulary for emotional transition.", topics: ["music", "identity", "relationships"], formats: ["song", "music video", "arena tour"], platforms: ["Spotify", "YouTube", "TikTok"], audienceSegments: ["girls", "music fans", "older Gen Alpha"], audience: { center: "Ages 10-17, especially girls and young music fans", broader: "Families and cross-generational pop audiences", ageRange: "10-17", confidence: "medium", confidenceRationale: "music themes, social circulation, and adjacent teen audience research align, while private listener analytics are unavailable." }, influenceMechanism: "Emotionally precise songs become captions, covers, conversation prompts, and shared milestone soundtracks.", definingMoments: ["SOUR and GUTS becoming youth-pop reference albums", "drivers license moving from intimate song to participatory social format", "Tour, vinyl, merchandise, and film extensions"], relatedEntities: [{ id: "sabrina-carpenter", label: "Sabrina Carpenter", kind: "culture-shaper", href: "/influencers/sabrina-carpenter" }], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], sourceNotes: [{ sourceId: "gwi-alpha-unfiltered", note: "GWI supplies youth-interest and media context; album and tour moments are checked against Rodrigo's official destination." }, { sourceId: "pew-teens-social-2024", note: "Pew provides adjacent evidence for teen platform circulation, not artist-specific audience measurement." }], officialUrl: "https://www.oliviarodrigo.com/", videos: [{ youtubeId: "ZmDBbnmKpqQ", title: "drivers license (Official Video)", embeddable: true }], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
  additional({ id: "sabrina-carpenter", name: "Sabrina Carpenter", pronouns: "she", type: "artist", role: "Repeatable pop-format maker", category: "Music, humor, and style", summary: "Compact hooks, visual wit, fashion, and performance details turn pop releases into formats that travel through clips and imitation.", topics: ["music", "fashion", "humor"], formats: ["song", "music video", "live performance"], platforms: ["Spotify", "YouTube", "TikTok"], audienceSegments: ["girls", "music fans", "older Gen Alpha"], audience: { center: "Ages 10-17, especially girls and pop audiences", broader: "Young adults and mainstream pop listeners", ageRange: "10-17", confidence: "medium", confidenceRationale: "format signals and adjacent youth-platform research support the range without first-party demographics." }, influenceMechanism: "A recognizable lyrical and visual grammar makes each release easy to quote, recreate, and carry into style culture.", definingMoments: ["Espresso becoming a cross-platform pop phrase", "Live outros changing by city and rewarding repeat viewing", "Short n' Sweet touring, physical releases, and merchandise"], relatedEntities: [{ id: "olivia-rodrigo", label: "Olivia Rodrigo", kind: "culture-shaper", href: "/influencers/olivia-rodrigo" }], insightIds: ["media-repeatable-formats", "media-creators-templates"], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], sourceNotes: [{ sourceId: "gwi-alpha-unfiltered", note: "GWI frames music and youth-interest context; release details come from Carpenter's official destination." }, { sourceId: "pew-teens-social-2024", note: "Pew supports the adjacent platform context in which clips circulate, not a claim about Carpenter's exact audience." }], officialUrl: "https://www.sabrinacarpenter.com/", videos: [{ youtubeId: "eVli-tstM5E", title: "Espresso (Official Video)", embeddable: true }], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
  additional({ id: "caitlin-clark", name: "Caitlin Clark", pronouns: "she", type: "athlete", role: "Women's basketball attention catalyst", category: "Basketball and sports culture", summary: "Long-range shooting, visible competitiveness, and record-setting college-to-pro attention make women's basketball a youth-culture event.", topics: ["basketball", "competition", "women's sports"], formats: ["live game", "highlight", "sports interview"], platforms: ["WNBA", "YouTube", "Instagram"], audienceSegments: ["girls", "sports fans", "families"], audience: { center: "Ages 8-17, especially basketball players and girls in sport", broader: "Family sports audiences and mainstream basketball fans", ageRange: "8-17", confidence: "medium", confidenceRationale: "youth-sports and league reporting support the context, but athlete-specific child audience data are limited." }, influenceMechanism: "Highlights, debates, merchandise, and youth imitation turn elite performance into a repeatable participation loop.", definingMoments: ["Record-setting NCAA scoring and tournament visibility", "Long-range shooting copied in gyms and highlight culture", "WNBA attendance, jersey, sponsorship, and ticket demand"], relatedEntities: [{ id: "jesser", label: "Jesser", kind: "culture-shaper", href: "/influencers/jesser" }], insightIds: ["play-competition-performance", "media-creators-templates"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], sourceNotes: [{ sourceId: "ap-sports-alpha-2026", note: "AP documents leagues adapting to creator-led youth culture; Clark is a concrete athlete lens on that shift." }, { sourceId: "project-play-state-of-play-2025", note: "Project Play supplies youth participation context and cautions that access to organized sport remains unequal." }], officialUrl: "https://www.wnba.com/player/1642286/caitlin-clark", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 2 } }),
  additional({ id: "simone-biles", name: "Simone Biles", pronouns: "she", type: "athlete", role: "Gymnastics excellence standard", category: "Gymnastics, resilience, and performance", summary: "Named skills, competitive longevity, and public discussion of wellbeing make elite gymnastics legible as both achievement and self-advocacy.", topics: ["gymnastics", "wellbeing", "women's sports"], formats: ["live competition", "highlight", "documentary"], platforms: ["Olympics", "Netflix", "Instagram"], audienceSegments: ["girls", "sports fans", "families"], audience: { center: "Ages 7-17, especially gymnasts and girls in sport", broader: "Global Olympic and family audiences", ageRange: "7-17", confidence: "medium", confidenceRationale: "family-scale competition and youth-sports context are visible, while exact child audience concentration is not public." }, influenceMechanism: "Exceptional performance and named skills create imitation, while her wellbeing stance gives young athletes a language for boundaries.", definingMoments: ["Multiple eponymous skills in the gymnastics code", "Olympic return connecting excellence with mental-health boundaries", "Tours, documentaries, sponsorships, and gymnastics participation"], relatedEntities: [{ id: "caitlin-clark", label: "Caitlin Clark", kind: "culture-shaper", href: "/influencers/caitlin-clark" }], insightIds: ["play-competition-performance", "time-coexistence"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], sourceNotes: [{ sourceId: "ap-sports-alpha-2026", note: "AP supplies the youth-sports media context; Biles's named skills and official biography anchor the profile facts." }, { sourceId: "project-play-state-of-play-2025", note: "Project Play contextualizes organized youth sport and the unequal access behind aspirational athlete culture." }], officialUrl: "https://simonebiles.com/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 3, audienceCenter: 2 } }),
  additional({ id: "cristiano-ronaldo", name: "Cristiano Ronaldo", pronouns: "he", type: "athlete", role: "Global football icon", category: "Football, training, and celebrity", summary: "Goals, celebration rituals, training mythology, and a vast social footprint connect elite football to imitation and everyday fandom.", topics: ["football", "training", "celebrity"], formats: ["live match", "highlight", "social video"], platforms: ["Football", "YouTube", "Instagram"], audienceSegments: ["sports fans", "boys", "global youth"], audience: { center: "Ages 8-17 among football-oriented youth", broader: "Global, multi-generational sports audiences", ageRange: "8-17", confidence: "medium", confidenceRationale: "global football visibility is clear, but the age center is an editorial estimate rather than first-party analytics." }, influenceMechanism: "A simple celebration, visible training discipline, and constant highlight circulation make fandom physically repeatable.", definingMoments: ["Siu celebration becoming a playground and gaming ritual", "Goals and rivalries sustaining continuous highlight circulation", "Club shirts, sponsorships, games, and CR7 product extensions"], relatedEntities: [{ id: "ishowspeed", label: "IShowSpeed", kind: "culture-shaper", href: "/influencers/ishowspeed" }], insightIds: ["play-competition-performance", "media-repeatable-formats"], sourceIds: ["ap-sports-alpha-2026", "gwi-alpha-unfiltered"], sourceNotes: [{ sourceId: "ap-sports-alpha-2026", note: "AP documents sports' creator-led youth-culture shift; Ronaldo's celebration and media system illustrate repeatability." }, { sourceId: "gwi-alpha-unfiltered", note: "GWI provides broader Gen Alpha interest context rather than athlete-specific reach analytics." }], officialUrl: "https://www.cristianoronaldo.com/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 2 } }),
  additional({ id: "bluey", name: "Bluey", pronouns: "she", type: "screen-ip", role: "Family co-play script", category: "Preschool television and family life", summary: "Short stories about imaginative play, feelings, and family negotiation give children and adults a shared language for everyday life.", topics: ["family", "imaginative play", "emotions"], formats: ["animated episode", "short", "live show"], platforms: ["Disney+", "YouTube", "ABC iview"], audienceSegments: ["girls", "families", "preschool"], audience: { center: "Ages 3-8 with parents and caregivers", broader: "Older siblings, educators, and adult co-viewers", ageRange: "3-8", confidence: "high", confidenceRationale: "the property is explicitly designed for young children and routinely structured for adult co-viewing." }, influenceMechanism: "Episodes model games, phrases, and emotional scripts that move directly from co-viewing into family play.", definingMoments: ["Keepy Uppy and other episode games moving into home play", "The Sign turning a family change story into a household conversation", "Books, toys, albums, games, and Bluey's Big Play"], relatedEntities: [{ id: "cocomelon", label: "CoComelon", kind: "culture-shaper", href: "/influencers/cocomelon" }], insightIds: ["play-family-coplay", "media-coviewing", sharedMediaInsight], sourceIds: ["common-sense-census-2025", "ofcom-children-media-lives-2025"], sourceNotes: [{ sourceId: "common-sense-census-2025", note: "Common Sense documents young children's video and household context, supporting Bluey's co-viewing lens without claiming title-level ratings." }, { sourceId: "ofcom-children-media-lives-2025", note: "Ofcom's qualitative family-media evidence supports the movement between screen stories and daily routines." }], officialUrl: "https://www.bluey.tv/", videos: [], featured: true, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  additional({ id: "kpop-demon-hunters", name: "KPop Demon Hunters", pronouns: "they", type: "screen-ip", role: "Music-to-fandom crossover", category: "Animated film, K-pop, and fandom", summary: "A female-led animated action-musical connects songs, character identity, choreography, fantasy, and fan participation in one portable property.", topics: ["music", "animation", "friendship"], formats: ["feature film", "song", "dance challenge"], platforms: ["Netflix", "YouTube", "Spotify"], audienceSegments: ["girls", "music fans", "families"], audience: { center: "Ages 8-15, especially girls, animation fans, and K-pop audiences", broader: "Family viewers and global pop fandoms", ageRange: "8-15", confidence: "medium", confidenceRationale: "the film's format and visible fandom align with adjacent youth-media evidence, but Netflix does not publish a child-only audience profile." }, influenceMechanism: "Songs and choreography let viewers carry characters beyond the film through listening, dance, fan art, and social performance.", definingMoments: ["A female trio combining idol performance with action-hero roles", "Songs and choreography extending the film into covers, dance, and repeat listening", "Soundtrack, merchandise, costumes, and franchise expansion"], relatedEntities: [{ id: "olivia-rodrigo", label: "Olivia Rodrigo", kind: "culture-shaper", href: "/influencers/olivia-rodrigo" }], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["emarketer-alpha-habits-2026", "gwi-alpha-unfiltered"], sourceNotes: [{ sourceId: "emarketer-alpha-habits-2026", note: "EMARKETER supplies cross-platform media context; the film, soundtrack, and character details come from Netflix's official destination." }, { sourceId: "gwi-alpha-unfiltered", note: "GWI contextualizes Gen Alpha entertainment interests; the profile avoids treating broad cohort research as title-level audience analytics." }], officialUrl: "https://www.netflix.com/title/81498621", videos: [{ youtubeId: "AzCAwdp1uIQ", title: "KPop Demon Hunters Official Trailer", embeddable: true }], featured: true, indicatorTiers: { reach: 4, participation: 4, commercialPull: 3, audienceCenter: 2 } }),
  additional({ id: "wednesday", name: "Wednesday", pronouns: "she", type: "screen-ip", role: "Gothic identity template", category: "Streaming series, mystery, and style", summary: "Deadpan humor, mystery, dance, and gothic styling give older Gen Alpha a strong character template for performance and self-presentation.", topics: ["mystery", "fashion", "identity"], formats: ["streaming series", "dance", "short-form clip"], platforms: ["Netflix", "YouTube", "TikTok"], audienceSegments: ["girls", "older Gen Alpha", "fantasy fans"], audience: { center: "Ages 11-17, especially girls and gothic-fantasy fans", broader: "Young adults and family co-viewers", ageRange: "11-17", confidence: "low", confidenceRationale: "age suitability varies by household and title-level youth demographics are not public." }, influenceMechanism: "A distinct movement and style vocabulary lets one scene become dance recreation, costume, meme, and identity signal.", definingMoments: ["Wednesday's school-dance scene becoming a recreation format", "Nevermore style and character archetypes supporting dress-up", "Streaming seasons, licensing, costumes, and games"], relatedEntities: [{ id: "kpop-demon-hunters", label: "KPop Demon Hunters", kind: "culture-shaper", href: "/influencers/kpop-demon-hunters" }], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], sourceNotes: [{ sourceId: "pew-teens-social-2024", note: "Pew supplies adjacent teen platform context for clip circulation, not title-level audience data." }, { sourceId: "emarketer-alpha-habits-2026", note: "EMARKETER supports the cross-platform interpretation while Netflix remains the source for official property information." }], officialUrl: "https://www.netflix.com/title/81231974", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 3, audienceCenter: 1 } }),
  additional({ id: "barbie", name: "Barbie", pronouns: "she", type: "franchise", role: "Identity-play system", category: "Dolls, film, fashion, and roleplay", summary: "A long-running doll system moves through imaginative careers, collecting, fashion, animation, cinema, and intergenerational conversation.", topics: ["fashion", "careers", "imaginative play"], formats: ["toy play", "feature film", "animation"], platforms: ["Retail", "YouTube", "Cinema"], audienceSegments: ["girls", "families", "collectors"], audience: { center: "Ages 3-12, especially girls and imaginative-play audiences", broader: "Parents, collectors, and intergenerational film audiences", ageRange: "3-12", confidence: "high", confidenceRationale: "the franchise's child-directed toy system and family extensions make the audience center comparatively clear." }, influenceMechanism: "Open-ended character and career play lets each child author a version of the property while media and products refresh the symbols.", definingMoments: ["Career dolls expanding identity rehearsal beyond one storyline", "Theatrical film renewing intergenerational conversation", "Dolls, Dreamhouses, fashion collaborations, games, and licensed worlds"], relatedEntities: [{ id: "bluey", label: "Bluey", kind: "culture-shaper", href: "/influencers/bluey" }], insightIds: ["play-avatars-identity", sharedMediaInsight], sourceIds: ["pwc-alpha-2026", "gwi-alpha-unfiltered"], sourceNotes: [{ sourceId: "pwc-alpha-2026", note: "PwC supports the child-to-household influence context; Mattel's official destination anchors current product extensions." }, { sourceId: "gwi-alpha-unfiltered", note: "GWI supplies broad interest context and does not substitute for franchise-specific child analytics." }], officialUrl: "https://shop.mattel.com/pages/barbie", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  additional({ id: "disney-princess", name: "Disney Princess", pronouns: "they", type: "franchise", role: "Character and ritual constellation", category: "Animation, music, dress-up, and parks", summary: "Distinct heroines, songs, costumes, stories, and park rituals form a flexible system for fantasy, performance, and identity play.", topics: ["music", "fantasy", "identity"], formats: ["animated film", "song", "dress-up play"], platforms: ["Disney+", "YouTube", "Disney Parks"], audienceSegments: ["girls", "families", "preschool"], audience: { center: "Ages 3-10, especially girls and family audiences", broader: "Older fans and intergenerational Disney households", ageRange: "3-10", confidence: "high", confidenceRationale: "child-directed media, retail, and park experiences consistently signal the center, while individual characters vary." }, influenceMechanism: "Songs and character roles make the franchise easy to enact at home, in dress-up, in performance, and at destinations.", definingMoments: ["Character songs becoming childhood performance standards", "New heroines broadening the visual and cultural repertoire", "Costumes, dolls, books, parks, live shows, and streaming libraries"], relatedEntities: [{ id: "barbie", label: "Barbie", kind: "culture-shaper", href: "/influencers/barbie" }], insightIds: ["media-coviewing", sharedMediaInsight], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], sourceNotes: [{ sourceId: "common-sense-census-2025", note: "Common Sense supplies young-child co-viewing context; Disney's destination anchors character and product information." }, { sourceId: "pwc-alpha-2026", note: "PwC contextualizes household influence and purchase negotiation rather than measuring this franchise alone." }], officialUrl: "https://princess.disney.com/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  additional({ id: "pokemon", name: "Pokemon", pronouns: "they", type: "franchise", role: "Collecting and mastery language", category: "Games, animation, cards, and collecting", summary: "Creatures, types, collecting, battling, and trading create a durable literacy that moves between screens, cards, playgrounds, and families.", topics: ["gaming", "collecting", "friendship"], formats: ["video game", "animation", "trading card game"], platforms: ["Nintendo Switch", "YouTube", "Retail"], audienceSegments: ["gamers", "families", "collectors"], audience: { center: "Ages 6-14 across gamers and collectors", broader: "Parents and older fans with franchise history", ageRange: "6-14", confidence: "high", confidenceRationale: "the child-facing game, animation, and card systems clearly support this range while intergenerational reach is broader." }, influenceMechanism: "A learnable system of names, types, rarity, and strategy turns fandom into social fluency and exchange.", definingMoments: ["Starter choices and creature knowledge becoming peer language", "Trading cards connecting collecting with face-to-face exchange", "Games, animation, cards, toys, events, and licensed products"], relatedEntities: [{ id: "minecraft", label: "Minecraft", kind: "culture-shaper", href: "/influencers/minecraft" }], insightIds: ["play-status-contribution", sharedMediaInsight], sourceIds: ["pew-teens-video-games-2024", "pwc-alpha-2026"], sourceNotes: [{ sourceId: "pew-teens-video-games-2024", note: "Pew supplies adjacent evidence for games as social environments; Pokemon's official destination anchors franchise elements." }, { sourceId: "pwc-alpha-2026", note: "PwC supports household commerce context, not a title-level sales claim." }], officialUrl: "https://www.pokemon.com/us", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  additional({ id: "minecraft", name: "Minecraft", pronouns: "they", type: "franchise", role: "Creation-world standard", category: "Games, making, video, and education", summary: "Block-based building connects play, collaboration, tutorials, storytelling, classroom use, and creator culture through one shared visual language.", topics: ["gaming", "creation", "learning"], formats: ["video game", "gameplay video", "collaborative build"], platforms: ["Minecraft", "YouTube", "Education"], audienceSegments: ["gamers", "families", "students"], audience: { center: "Ages 6-15 across builders, gamers, and learners", broader: "Families, educators, creators, and adult players", ageRange: "6-15", confidence: "high", confidenceRationale: "direct 5-13 creation-gaming research and the franchise's education system support a clear youth center." }, influenceMechanism: "A simple construction grammar lets players make, teach, narrate, collaborate, and turn their own worlds into media.", definingMoments: ["Survival and Creative modes supporting distinct play styles", "YouTube builders and roleplayers turning worlds into stories", "Games, Education Edition, merchandise, film, and live community events"], relatedEntities: [{ id: "aphmau", label: "Aphmau", kind: "culture-shaper", href: "/influencers/aphmau" }], insightIds: ["play-making-interface", "learning-creation-skills"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], sourceNotes: [{ sourceId: "walton-creation-gaming-2024", note: "The Walton/Bodacious study directly includes Minecraft in research with 5- to 13-year-olds about creation gaming and learning." }, { sourceId: "ofcom-children-media-lives-2025", note: "Ofcom supplies qualitative context for games moving through children's friendship and media routines." }], officialUrl: "https://www.minecraft.net/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
];

export const cultureShapers: CultureShaper[] = [...migratedCreators, ...additionalShapers];

export function getCultureShaper(id: string): CultureShaper | undefined {
  return cultureShapers.find((shaper) => shaper.id === id);
}

export const featuredCultureShapers = cultureShapers.filter((shaper) => shaper.featured);
