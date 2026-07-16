import { influencers as legacyCreators } from "../influencers";
import type { ConfidenceLevel, CultureShaperType } from "./types";
export type { CultureShaperType } from "./types";

export type CultureShaperPronouns = "he" | "she" | "they";
export type IndicatorKey = "reach" | "participation" | "commercialPull" | "audienceCenter";
export type IndicatorTier = 1 | 2 | 3 | 4;
// Task 4 can replace this alias with its canonical Space ID type without rewriting profile records.
export type CultureShaperSpaceId =
  | "roblox"
  | "youtube"
  | "discord"
  | "tiktok"
  | "minecraft"
  | "fortnite"
  | "snapchat"
  | "instagram"
  | "twitch"
  | "whatsapp"
  | "reddit"
  | "capcut";

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
  relatedSpaceIds: CultureShaperSpaceId[];
  insightIds: string[];
  sourceIds: string[];
  sourceNotes: Array<{ sourceId: string; note: string }>;
  indicators: Record<IndicatorKey, IndicatorAssessment>;
  officialUrl: string;
  portrait?: string;
  videos: CultureShaperVideo[];
  mediaFallback?: string;
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
  { topics: string[]; formats: string[]; sourceIds: string[]; insightIds: string[]; spaceIds: CultureShaperSpaceId[] }
> = {
  mrbeast: { topics: ["spectacle", "philanthropy", "commerce"], formats: ["challenge", "competition", "long-form video"], sourceIds: ["emarketer-alpha-faq-2026", "pwc-alpha-2026"], insightIds: ["media-creators-templates", "media-discovery-commerce"], spaceIds: ["youtube"] },
  ishowspeed: { topics: ["gaming", "football", "music"], formats: ["livestream", "reaction", "music video"], sourceIds: ["ap-sports-alpha-2026", "pew-teens-social-2024"], insightIds: ["play-competition-performance", "media-repeatable-formats"], spaceIds: ["youtube", "fortnite"] },
  "kai-cenat": { topics: ["gaming", "music", "comedy"], formats: ["livestream", "subathon", "ensemble comedy"], sourceIds: ["pew-teens-social-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-small-crews", "media-creators-templates"], spaceIds: ["twitch", "youtube", "discord"] },
  aphmau: { topics: ["gaming", "friendship", "fantasy"], formats: ["roleplay", "episodic video", "character story"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-making-interface", "media-properties-travel"], spaceIds: ["minecraft", "youtube", "roblox"] },
  "ms-rachel": { topics: ["learning", "language", "music"], formats: ["lesson", "song", "direct address"], sourceIds: ["common-sense-census-2025", "generation-alpha-education-review-2024"], insightIds: ["time-family-needs", "learning-assembled"], spaceIds: ["youtube"] },
  "salish-matter": { topics: ["friendship", "gymnastics", "beauty"], formats: ["challenge", "vlog", "makeover"], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], insightIds: ["media-creators-templates", "learning-remix"], spaceIds: ["youtube", "instagram", "tiktok"] },
  "ryans-world": { topics: ["toys", "science", "family"], formats: ["toy play", "experiment", "animation"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], insightIds: ["media-discovery-commerce", "media-coviewing"], spaceIds: ["youtube"] },
  "like-nastya": { topics: ["pretend play", "family", "travel"], formats: ["roleplay", "family adventure", "visual story"], sourceIds: ["common-sense-census-2025", "gwi-alpha-unfiltered"], insightIds: ["media-coviewing", "media-repeatable-formats"], spaceIds: ["youtube"] },
  "kids-diana": { topics: ["pretend play", "family", "dress-up"], formats: ["roleplay", "sibling story", "visual story"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], insightIds: ["media-coviewing", "media-properties-travel"], spaceIds: ["youtube"] },
  "vlad-and-niki": { topics: ["toys", "siblings", "family"], formats: ["challenge", "toy play", "family adventure"], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], insightIds: ["play-family-coplay", "media-discovery-commerce"], spaceIds: ["youtube"] },
  cocomelon: { topics: ["music", "routines", "early learning"], formats: ["animation", "song", "nursery rhyme"], sourceIds: ["common-sense-census-2025", "digital-wellbeing-review-2025"], insightIds: ["time-family-needs", "media-coviewing"], spaceIds: ["youtube"] },
  "alan-chikin-chow": { topics: ["school", "friendship", "comedy"], formats: ["short-form video", "serial drama", "sketch"], sourceIds: ["pew-teens-social-2024", "oxford-brain-rot-2024"], insightIds: ["media-short-form-shape", "media-repeatable-formats"], spaceIds: ["youtube", "tiktok"] },
  "stokes-twins": { topics: ["comedy", "challenges", "friendship"], formats: ["challenge", "prank", "short-form video"], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], insightIds: ["media-short-form-shape", "media-creators-templates"], spaceIds: ["youtube", "tiktok"] },
  lankybox: { topics: ["gaming", "comedy", "toys"], formats: ["gameplay", "reaction", "song"], sourceIds: ["walton-creation-gaming-2024", "pwc-alpha-2026"], insightIds: ["media-properties-travel", "media-discovery-commerce"], spaceIds: ["roblox", "youtube"] },
  "danny-go": { topics: ["music", "movement", "imagination"], formats: ["dance-along", "song", "live show"], sourceIds: ["common-sense-census-2025", "outdoor-participation-trends-2026"], insightIds: ["time-coexistence", "learning-multimodal"], spaceIds: ["youtube"] },
  "dude-perfect": { topics: ["sports", "competition", "stunts"], formats: ["trick shot", "competition", "live show"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], insightIds: ["play-competition-performance", "media-coviewing"], spaceIds: ["youtube"] },
  unspeakable: { topics: ["gaming", "Minecraft", "stunts"], formats: ["gameplay", "challenge", "build"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-making-interface", "time-coexistence"], spaceIds: ["minecraft", "youtube"] },
  kreekcraft: { topics: ["gaming", "Roblox", "platform news"], formats: ["livestream", "gameplay", "reaction"], sourceIds: ["roblox-search-style-trends-2025", "walton-creation-gaming-2024"], insightIds: ["play-status-contribution", "media-creators-templates"], spaceIds: ["roblox", "youtube"] },
  preston: { topics: ["gaming", "Minecraft", "competition"], formats: ["gameplay", "challenge", "collaboration"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], insightIds: ["play-competition-performance", "play-small-crews"], spaceIds: ["minecraft", "youtube"] },
  itsfunneh: { topics: ["gaming", "Roblox", "siblings"], formats: ["gameplay", "roleplay", "ensemble comedy"], sourceIds: ["walton-creation-gaming-2024", "roblox-search-style-trends-2025"], insightIds: ["play-small-crews", "play-avatars-identity"], spaceIds: ["roblox", "youtube"] },
  "moriah-elizabeth": { topics: ["art", "craft", "characters"], formats: ["makeover", "process video", "illustration"], sourceIds: ["gwi-alpha-unfiltered", "generation-alpha-education-review-2024"], insightIds: ["learning-remix", "learning-multimodal"], spaceIds: ["youtube"] },
  sssniperwolf: { topics: ["internet culture", "gaming", "comedy"], formats: ["reaction", "commentary", "short-form video"], sourceIds: ["pew-teens-social-2024", "arxiv-young-user-safety-2025"], insightIds: ["media-short-form-shape", "media-reach-risk"], spaceIds: ["youtube"] },
  "rebecca-zamolo": { topics: ["mystery", "family", "friendship"], formats: ["challenge", "serial story", "escape room"], sourceIds: ["gwi-alpha-unfiltered", "emarketer-alpha-faq-2026"], insightIds: ["media-repeatable-formats", "media-creators-templates"], spaceIds: ["youtube"] },
  "charli-damelio": { topics: ["dance", "fashion", "beauty"], formats: ["short-form video", "dance", "reality series"], sourceIds: ["pew-teens-social-2024", "pwc-alpha-2026"], insightIds: ["media-short-form-shape", "media-discovery-commerce"], spaceIds: ["tiktok", "instagram", "youtube"] },
  "nicole-laeno": { topics: ["dance", "school", "wellness"], formats: ["vlog", "dance", "routine video"], sourceIds: ["pew-teens-social-2024", "ofcom-children-media-lives-2025"], insightIds: ["media-creators-templates", "time-age-change"], spaceIds: ["youtube", "tiktok", "instagram"] },
  "jules-leblanc": { topics: ["music", "acting", "lifestyle"], formats: ["vlog", "song", "streaming series"], sourceIds: ["pew-teens-social-2024", "gwi-alpha-unfiltered"], insightIds: ["media-properties-travel", "media-creators-templates"], spaceIds: ["youtube", "instagram"] },
  "piper-rockelle": { topics: ["friendship", "music", "lifestyle"], formats: ["challenge", "music video", "serial story"], sourceIds: ["pew-teens-social-2024", "arxiv-young-user-safety-2025"], insightIds: ["play-small-crews", "media-reach-risk"], spaceIds: ["youtube", "instagram"] },
  "brent-rivera": { topics: ["comedy", "friendship", "school"], formats: ["sketch", "challenge", "short-form video"], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], insightIds: ["media-short-form-shape", "media-repeatable-formats"], spaceIds: ["youtube", "tiktok"] },
  "ben-azelart": { topics: ["stunts", "travel", "friendship"], formats: ["challenge", "build", "collaboration"], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], insightIds: ["media-creators-templates", "media-repeatable-formats"], spaceIds: ["youtube", "tiktok"] },
  jesser: { topics: ["basketball", "sports", "gaming"], formats: ["sports challenge", "collaboration", "competition"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], insightIds: ["play-competition-performance", "media-creators-templates"], spaceIds: ["youtube"] },
};

type CreatorEvidence = {
  sourceNotes: [string, string];
  rationales: Record<IndicatorKey, string>;
};

const creatorEvidence: Record<string, CreatorEvidence> = {
  mrbeast: {
    sourceNotes: [
      "MrBeast's challenge-and-product model matches EMARKETER's focus on participatory creator formats.",
      "MrBeast's Feastables extension connects directly to PwC's findings on child influence in household shopping.",
    ],
    rationales: {
      reach: "MrBeast made Massive endurance and elimination challenges a category standard on YouTube.",
      participation: "MrBeast turns each challenge into a premise viewers predict, debate, and reenact.",
      commercialPull: "MrBeast carries attention into Feastables and Beast Games extending the format.",
      audienceCenter: "MrBeast's YouTube pacing and broad household recognition support a 9-17 audience center.",
    },
  },
  ishowspeed: {
    sourceNotes: [
      "IShowSpeed embodies AP's account of sports culture moving through creators, clips, and personality-led access.",
      "IShowSpeed's YouTube Live audience sits within Pew's measured teen video and platform behavior.",
    ],
    rationales: {
      reach: "IShowSpeed's Football and Cristiano Ronaldo fandom travels globally through YouTube Live clips.",
      participation: "IShowSpeed makes the livestream a volatile group reaction that chat can redirect instantly.",
      commercialPull: "IShowSpeed extends football fandom into World Cup music and meme culture.",
      audienceCenter: "IShowSpeed's gaming, football, and reaction mix concentrates among 13-18 sports fans.",
    },
  },
  "kai-cenat": {
    sourceNotes: [
      "Kai Cenat's marathon Twitch programming belongs inside Pew's evidence on teen platform routines.",
      "Kai Cenat's chat-led room illustrates Ofcom's observed movement between creators, peers, and shared media rituals.",
    ],
    rationales: {
      reach: "Kai Cenat's Celebrity and musician livestream collaborations make Twitch events mainstream youth moments.",
      participation: "Kai Cenat uses the livestream and subathon to let chat pace jokes, guests, and escalation.",
      commercialPull: "Kai Cenat converts duration into subscriptions, event viewing, and AMP ensemble attention.",
      audienceCenter: "Kai Cenat's Twitch room centers 13-18 viewers with strong gaming and music overlap.",
    },
  },
  aphmau: {
    sourceNotes: [
      "Aphmau's Minecraft roleplay applies the Walton study's creation-gaming evidence to serialized storytelling.",
      "Aphmau's recurring cast reflects Ofcom's findings on children carrying game narratives across daily media life.",
    ],
    rationales: {
      reach: "Aphmau built Minecraft roleplay series into a durable category on YouTube.",
      participation: "Aphmau's roleplay gives viewers characters and plots to continue inside their own worlds.",
      commercialPull: "Aphmau moves familiar characters into Toy and merchandise extensions beyond episodes.",
      audienceCenter: "Aphmau's YouTube stories and friendship themes clearly center ages 7-14, especially girls.",
    },
  },
  "ms-rachel": {
    sourceNotes: [
      "Ms. Rachel's co-viewed lessons fit Common Sense findings on video inside young children's household routines.",
      "Ms. Rachel's speech-development approach connects to the education review's evidence on blended learning tools.",
    ],
    rationales: {
      reach: "Ms. Rachel made Songs for Littles a household-scale early-learning destination on YouTube.",
      participation: "Ms. Rachel structures each lesson around pauses, repetition, gesture, and spoken response.",
      commercialPull: "Ms. Rachel extends trusted instruction through Caregiver-facing learning guidance, books, and toys.",
      audienceCenter: "Ms. Rachel's direct address is explicitly built for ages 1-6 and their caregivers.",
    },
  },
  "salish-matter": {
    sourceNotes: [
      "Salish Matter's friendship, beauty, and gymnastics mix reflects interests documented in GWI's Gen Alpha research.",
      "Salish Matter's YouTube-to-Instagram circulation aligns with Pew's older-teen platform measures while serving younger viewers.",
    ],
    rationales: {
      reach: "Salish Matter grew Father-daughter challenges into a fast-rising YouTube identity.",
      participation: "Salish Matter uses the challenge to make gymnastics, friendship, and makeovers easy to copy.",
      commercialPull: "Salish Matter's Friendship and makeover videos connect aspiration with beauty and lifestyle choices.",
      audienceCenter: "Salish Matter's peer-scale tone most clearly centers girls ages 8-14.",
    },
  },
  "ryans-world": {
    sourceNotes: [
      "Ryan's World's toy play sits inside Common Sense evidence on co-viewed media for children zero to eight.",
      "Ryan's World's retail system makes PwC's findings on 7-14 household purchase influence operationally relevant.",
    ],
    rationales: {
      reach: "Ryan's World made Mystery egg and toy play globally recognizable on YouTube.",
      participation: "Ryan's World turns toy play into experiments and prompts children can reproduce at home.",
      commercialPull: "Ryan's World is defined commercially by a Large licensed product ecosystem.",
      audienceCenter: "Ryan's World's bright YouTube demonstrations directly center ages 3-9 and parents.",
    },
  },
  "like-nastya": {
    sourceNotes: [
      "Like Nastya's visual family stories fit Common Sense evidence on early-childhood video and caregiver mediation.",
      "Like Nastya's multilingual distribution maps to the family interests covered by GWI's international Alpha framing.",
    ],
    rationales: {
      reach: "Like Nastya scaled Pretend-play stories across languages through a global YouTube network.",
      participation: "Like Nastya uses roleplay and simple visual cues that children can restage without dialogue.",
      commercialPull: "Like Nastya carries Family travel adventures into streaming and licensing extensions.",
      audienceCenter: "Like Nastya's YouTube format is designed around ages 3-9 and family co-viewing.",
    },
  },
  "kids-diana": {
    sourceNotes: [
      "Kids Diana Show's sibling roleplay belongs within Common Sense findings on young children's video routines.",
      "Kids Diana Show's licensing path connects to PwC evidence on children's role in family purchase decisions.",
    ],
    rationales: {
      reach: "Kids Diana Show turned Dress-up roleplay into a globally legible YouTube story format.",
      participation: "Kids Diana Show makes roleplay portable through costumes, sibling roles, and simple moral plots.",
      commercialPull: "Kids Diana Show extends Diana through Love, Diana franchise extensions and licensing.",
      audienceCenter: "Kids Diana Show's visual YouTube grammar directly addresses ages 3-9 across family markets.",
    },
  },
  "vlad-and-niki": {
    sourceNotes: [
      "Vlad and Niki's sibling challenges fit Common Sense evidence on shared video use among young children.",
      "Vlad and Niki's toy ecosystem intersects PwC's measured child influence over household shopping.",
    ],
    rationales: {
      reach: "Vlad and Niki made Toy adventures globally understandable through physical YouTube comedy.",
      participation: "Vlad and Niki's challenge format turns sibling play into games families can repeat.",
      commercialPull: "Vlad and Niki carry Family travel and learning stories into licensing and retail.",
      audienceCenter: "Vlad and Niki's YouTube action and toy language clearly center ages 3-8 plus parents.",
    },
  },
  cocomelon: {
    sourceNotes: [
      "CoComelon's routine songs align with Common Sense measurement of video in zero-to-eight family life.",
      "CoComelon's repetitive animation should be read with the wellbeing review's emphasis on content and setting.",
    ],
    rationales: {
      reach: "CoComelon made Nursery-rhyme loops a global preschool fixture on YouTube.",
      participation: "CoComelon's animation and song repetition invite singing, naming, and routine rehearsal.",
      commercialPull: "CoComelon expands Bedtime and family routines through streaming, products, and live shows.",
      audienceCenter: "CoComelon's YouTube nursery rhyme design explicitly centers ages 1-5 and caregivers.",
    },
  },
  "alan-chikin-chow": {
    sourceNotes: [
      "Alan Chikin Chow's mobile serials operate within Pew's measured teen use of YouTube and short video.",
      "Alan Chikin Chow's rapid moral resolutions answer the format concerns documented by Oxford's attention discourse.",
    ],
    rationales: {
      reach: "Alan Chikin Chow scaled School-life shorts into a global YouTube Shorts audience.",
      participation: "Alan Chikin Chow uses short-form video archetypes viewers recognize, quote, and follow episodically.",
      commercialPull: "Alan Chikin Chow extends recurring characters through Alan's Universe serial storytelling.",
      audienceCenter: "Alan Chikin Chow's school plots and YouTube Shorts pacing center ages 10-17.",
    },
  },
  "stokes-twins": {
    sourceNotes: [
      "Stokes Twins' prank clips sit within Pew's evidence on teen YouTube and TikTok use.",
      "Stokes Twins' globally simple premises match EMARKETER's account of youth attention moving across video formats.",
    ],
    rationales: {
      reach: "Stokes Twins turned Twin-switch comedy into globally distributed YouTube spectacle.",
      participation: "Stokes Twins build each challenge around a reveal viewers can anticipate and retell.",
      commercialPull: "Stokes Twins use Large-scale surprise challenges to support collaborations and repeat viewing.",
      audienceCenter: "Stokes Twins' YouTube duo comedy most directly centers ages 10-17.",
    },
  },
  lankybox: {
    sourceNotes: [
      "LankyBox's Roblox gameplay connects directly to Walton's findings on creation games among ages 5-13.",
      "LankyBox's plush line meets PwC's evidence on children shaping household product requests.",
    ],
    rationales: {
      reach: "LankyBox made Roblox gameplay and mascot reactions category-leading on YouTube.",
      participation: "LankyBox blends gameplay with chants, jokes, and characters children repeat during play.",
      commercialPull: "LankyBox turns its Plush mascot and toy line into a core channel extension.",
      audienceCenter: "LankyBox's YouTube energy, Roblox focus, and toy language center ages 6-13.",
    },
  },
  "danny-go": {
    sourceNotes: [
      "Danny Go!'s movement videos answer Common Sense evidence that screen use includes varied household purposes.",
      "Danny Go!'s active prompts pair with outdoor-participation evidence rather than treating viewing as sedentary by default.",
    ],
    rationales: {
      reach: "Danny Go! made Dance-along adventures a fast-rising YouTube movement format.",
      participation: "Danny Go! uses each dance-along to turn watching into jumping, balancing, and pretend play.",
      commercialPull: "Danny Go! carries The Floor Is Lava from music streams into live shows.",
      audienceCenter: "Danny Go!'s YouTube instructions clearly target ages 2-8, families, and classrooms.",
    },
  },
  "dude-perfect": {
    sourceNotes: [
      "Dude Perfect's creator-sports blend exemplifies the league and media crossover reported by AP.",
      "Dude Perfect's family-safe competition sits alongside Project Play evidence on youth sports participation.",
    ],
    rationales: {
      reach: "Dude Perfect made Trick-shot videos household-scale sports entertainment on YouTube.",
      participation: "Dude Perfect's trick shot invites backyard imitation, friendly competition, and repeated attempts.",
      commercialPull: "Dude Perfect extends the Stereotypes series through live events and consumer products.",
      audienceCenter: "Dude Perfect's YouTube safety and sports fluency bridge ages 8-16 with parents.",
    },
  },
  unspeakable: {
    sourceNotes: [
      "Unspeakable's Minecraft builds connect to Walton's evidence on making and learning inside creation games.",
      "Unspeakable's screen-to-stunt loop reflects Ofcom observations of games traveling through children's media routines.",
    ],
    rationales: {
      reach: "Unspeakable made Minecraft builds category-leading entertainment across YouTube channels.",
      participation: "Unspeakable translates gameplay into a challenge children can imagine building or attempting.",
      commercialPull: "Unspeakable expands House and vehicle spectacles through merchandise and physical experiences.",
      audienceCenter: "Unspeakable's YouTube pacing and Minecraft vocabulary center ages 7-14.",
    },
  },
  kreekcraft: {
    sourceNotes: [
      "KreekCraft's avatar and update coverage connects to Roblox's published search and style signals.",
      "KreekCraft's player guidance complements Walton's evidence on Roblox as a creation-learning environment.",
    ],
    rationales: {
      reach: "KreekCraft made Roblox update livestreams a platform-leading YouTube Live beat.",
      participation: "KreekCraft's livestream turns each Roblox change into chat, speculation, and shared investigation.",
      commercialPull: "KreekCraft's Game lore and reaction videos sustain attention around platform events and releases.",
      audienceCenter: "KreekCraft's YouTube Live service role centers ages 8-15 and Roblox power users.",
    },
  },
  preston: {
    sourceNotes: [
      "Preston's Minecraft competitions connect to Walton's findings on social creation gaming for ages 5-13.",
      "Preston's recurring teams reflect Ofcom accounts of friendship moving through games and video.",
    ],
    rationales: {
      reach: "Preston made Minecraft competitions a durable, category-leading YouTube format.",
      participation: "Preston's gameplay gives viewers clear rules, teams, goals, and outcomes to debate.",
      commercialPull: "Preston extends PrestonPlayz challenge formats through merchandise and creator collaborations.",
      audienceCenter: "Preston's YouTube competition grammar consistently serves ages 7-15.",
    },
  },
  itsfunneh: {
    sourceNotes: [
      "ItsFunneh's Roblox ensemble fits Walton's evidence on creation games as social learning spaces.",
      "ItsFunneh's avatar-led stories connect to Roblox data on search, style, and digital identity.",
    ],
    rationales: {
      reach: "ItsFunneh built KREW multiplayer gameplay into a category-leading YouTube ensemble.",
      participation: "ItsFunneh uses gameplay and sibling banter to make viewers feel part of KREW.",
      commercialPull: "ItsFunneh moves Roblox roleplay into KREW merchandise and group extensions.",
      audienceCenter: "ItsFunneh's YouTube cast and Roblox focus center ages 8-15, including girl gamers.",
    },
  },
  "moriah-elizabeth": {
    sourceNotes: [
      "Moriah Elizabeth's art-and-character world maps to creative interests documented by GWI.",
      "Moriah Elizabeth's process videos align with the education review's emphasis on iterative, tool-supported learning.",
    ],
    rationales: {
      reach: "Moriah Elizabeth made Squishy makeovers a category-leading creative ritual on YouTube.",
      participation: "Moriah Elizabeth's makeover format invites drawing, repair, variation, and imperfect making.",
      commercialPull: "Moriah Elizabeth carries Create This Book into publishing and art products.",
      audienceCenter: "Moriah Elizabeth's calm YouTube process centers creative viewers ages 8-16, especially girls.",
    },
  },
  sssniperwolf: {
    sourceNotes: [
      "SSSniperWolf's reaction feed operates inside Pew's measured teen dependence on YouTube.",
      "SSSniperWolf's clip selection should be assessed against the young-user recommendation risks audited on arXiv.",
    ],
    rationales: {
      reach: "SSSniperWolf made Try-not-to-laugh reactions a mass-reach YouTube format.",
      participation: "SSSniperWolf's reaction invites viewers to judge, anticipate, and compare responses to clips.",
      commercialPull: "SSSniperWolf sustains Viral clip commentary through repeat viewing and channel-scale partnerships.",
      audienceCenter: "SSSniperWolf's YouTube commentary and gaming history most strongly center ages 12-18.",
    },
  },
  "rebecca-zamolo": {
    sourceNotes: [
      "Rebecca Zamolo's mystery-and-friendship mix reflects the family interests measured by GWI.",
      "Rebecca Zamolo's repeatable challenge system matches EMARKETER's guidance on creator format fluency.",
    ],
    rationales: {
      reach: "Rebecca Zamolo made Game Master Network a category-leading YouTube mystery serial.",
      participation: "Rebecca Zamolo's challenge uses clues and cliffhangers that invite prediction between episodes.",
      commercialPull: "Rebecca Zamolo carries Escape-room challenges into products and continuing family storylines.",
      audienceCenter: "Rebecca Zamolo's YouTube mysteries clearly center viewers ages 8-15.",
    },
  },
  "charli-damelio": {
    sourceNotes: [
      "Charli D'Amelio's dance circulation belongs within Pew's evidence on teen TikTok use.",
      "Charli D'Amelio's beauty partnerships intersect PwC findings on youth influence over family purchases.",
    ],
    rationales: {
      reach: "Charli D'Amelio turned Viral dance formats into global recognition on TikTok.",
      participation: "Charli D'Amelio's short-form video made choreography easy to copy, vary, and credit.",
      commercialPull: "Charli D'Amelio extends the D'Amelio family series through beauty and fashion partnerships.",
      audienceCenter: "Charli D'Amelio's TikTok dance and style content centers ages 10-18, especially girls.",
    },
  },
  "nicole-laeno": {
    sourceNotes: [
      "Nicole Laeno's routine videos sit within Pew's measured teen YouTube and social-platform use.",
      "Nicole Laeno's school-and-wellness diaries echo Ofcom observations of media woven through ordinary youth routines.",
    ],
    rationales: {
      reach: "Nicole Laeno made Week-in-my-life vlogs a fast-rising YouTube identity format.",
      participation: "Nicole Laeno's vlog gives viewers routines, habits, and milestones to compare with their own.",
      commercialPull: "Nicole Laeno connects Dance videos with wellness, fashion, and lifestyle partnerships.",
      audienceCenter: "Nicole Laeno's YouTube school perspective most directly centers girls ages 11-18.",
    },
  },
  "jules-leblanc": {
    sourceNotes: [
      "Jules LeBlanc's long online career spans the YouTube and Instagram behaviors measured by Pew.",
      "Jules LeBlanc's music-and-acting mix matches the cross-category interests documented by GWI.",
    ],
    rationales: {
      reach: "Jules LeBlanc carried Bratayley-era family content into an established YouTube identity.",
      participation: "Jules LeBlanc's vlog lets a long-term audience follow acting, music, and growing up.",
      commercialPull: "Jules LeBlanc moves Acting roles across streaming series, songs, and lifestyle work.",
      audienceCenter: "Jules LeBlanc's YouTube continuity most clearly serves girls ages 10-17.",
    },
  },
  "piper-rockelle": {
    sourceNotes: [
      "Piper Rockelle's peer-group stories operate within Pew's evidence on teen YouTube and social use.",
      "Piper Rockelle's young audience makes the recommendation and safety risks audited on arXiv directly material.",
    ],
    rationales: {
      reach: "Piper Rockelle made Squad challenges a large YouTube peer-drama format.",
      participation: "Piper Rockelle's challenge invites viewers to take sides in friendships and continuing storylines.",
      commercialPull: "Piper Rockelle carries Friendship and relationship storylines into music-video releases.",
      audienceCenter: "Piper Rockelle's YouTube squad narrative centers ages 8-15, especially girls.",
    },
  },
  "brent-rivera": {
    sourceNotes: [
      "Brent Rivera's school-and-friend sketches circulate across the YouTube and TikTok use measured by Pew.",
      "Brent Rivera's compact comedy premises fit EMARKETER's analysis of Gen Alpha digital attention.",
    ],
    rationales: {
      reach: "Brent Rivera made Friend-group challenges mass-reach comedy on YouTube.",
      participation: "Brent Rivera's sketch turns familiar social tension into a setup viewers can tag and quote.",
      commercialPull: "Brent Rivera extends Relatable social skits through Amp World collaborations.",
      audienceCenter: "Brent Rivera's YouTube school and friendship scenarios center ages 10-18.",
    },
  },
  "ben-azelart": {
    sourceNotes: [
      "Ben Azelart's stunt collaborations circulate inside Pew's measured teen YouTube behavior.",
      "Ben Azelart's large builds match EMARKETER's account of spectacle competing for Gen Alpha attention.",
    ],
    rationales: {
      reach: "Ben Azelart made Extreme physical challenges mass-reach YouTube spectacles.",
      participation: "Ben Azelart's challenge uses visible rules and peer reactions that audiences can anticipate.",
      commercialPull: "Ben Azelart carries Hidden-room and build videos into travel and creator partnerships.",
      audienceCenter: "Ben Azelart's YouTube stunt-and-friend tone most directly centers ages 10-17.",
    },
  },
  jesser: {
    sourceNotes: [
      "Jesser's NBA collaborations exemplify the creator-led sports access reported by AP.",
      "Jesser's basketball participation loop belongs beside Project Play evidence on youth sports activity.",
    ],
    rationales: {
      reach: "Jesser made Basketball challenges a sports-leading format on YouTube.",
      participation: "Jesser's sports challenge turns professional basketball into rules viewers can attempt themselves.",
      commercialPull: "Jesser extends NBA player collaborations through 2HYPE competitions and events.",
      audienceCenter: "Jesser's YouTube basketball fluency centers sports fans ages 10-18.",
    },
  },
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
  evidence: CreatorEvidence,
): CultureShaper["indicators"] {
  const reachTier = tierFromSignal(creator.indicators[0].value);
  const participationTier = tierFromSignal(creator.indicators[1].value);
  const commercialTier = tierFromSignal(creator.indicators[2].value);
  const audienceTier: IndicatorTier = creator.audience.includes("Core audience") ? 3 : 2;
  return {
    reach: assessment("reach", reachTier, evidence.rationales.reach, metadata.sourceIds),
    participation: assessment("participation", participationTier, evidence.rationales.participation, metadata.sourceIds),
    commercialPull: assessment("commercialPull", commercialTier, evidence.rationales.commercialPull, metadata.sourceIds),
    audienceCenter: assessment("audienceCenter", audienceTier, evidence.rationales.audienceCenter, metadata.sourceIds),
  };
}

const migratedCreators: CultureShaper[] = legacyCreators.map((creator) => {
  const metadata = creatorMetadata[creator.id];
  const evidence = creatorEvidence[creator.id];
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
    relatedSpaceIds: metadata.spaceIds,
    insightIds: metadata.insightIds,
    sourceIds: metadata.sourceIds,
    sourceNotes: metadata.sourceIds.map((sourceId, index) => ({ sourceId, note: evidence.sourceNotes[index] })),
    indicators: creatorAssessment(creator, metadata, evidence),
    officialUrl: creator.profileUrl,
    portrait: creator.portrait,
    videos,
    featured: creator.featured,
  };
});

type AdditionalSeed = Omit<CultureShaper, "indicators" | "relatedSpaceIds"> & {
  relatedSpaceIds?: CultureShaperSpaceId[];
  indicatorTiers: Record<IndicatorKey, IndicatorTier>;
};

const cultureShaperGraphIds: Record<string, string> = {
  minecraft: "minecraft-franchise",
  pokemon: "pokemon-franchise",
};

function additional(seed: AdditionalSeed): CultureShaper {
  const id = cultureShaperGraphIds[seed.id] ?? seed.id;
  const relatedEntities = seed.relatedEntities.map((entity) => {
    if (entity.kind !== "culture-shaper" || !cultureShaperGraphIds[entity.id]) return entity;
    const relatedId = cultureShaperGraphIds[entity.id];
    return { ...entity, id: relatedId, href: `/influencers/${relatedId}` };
  });
  const relatedSpaceIds = seed.relatedSpaceIds ?? [
    ...(seed.platforms.some((platform) => platform.includes("YouTube")) ? ["youtube" as const] : []),
    ...(seed.platforms.some((platform) => platform.includes("TikTok")) ? ["tiktok" as const] : []),
    ...(seed.platforms.some((platform) => platform.includes("Instagram")) ? ["instagram" as const] : []),
    ...(seed.platforms.some((platform) => platform.includes("Minecraft")) ? ["minecraft" as const] : []),
  ];
  const rationales: Record<IndicatorKey, string> = {
    reach: `${seed.name}'s reach is reflected in ${seed.definingMoments[0].toLowerCase()} and recognition across ${seed.platforms.join(", ")}.`,
    participation: `${seed.name} prompts participation through ${seed.formats.join(", ")}, especially around ${seed.definingMoments[1].toLowerCase()}.`,
    commercialPull: `${seed.name}'s commercial pull is visible in ${seed.definingMoments[2].toLowerCase()} and the official extensions documented for this profile.`,
    audienceCenter: `${seed.name}'s best-supported center is ${seed.audience.center}; confidence is ${seed.audience.confidence} because ${seed.audience.confidenceRationale.toLowerCase()}`,
  };
  return {
    ...seed,
    id,
    relatedEntities,
    relatedSpaceIds,
    indicators: {
      reach: assessment("reach", seed.indicatorTiers.reach, rationales.reach, seed.sourceIds),
      participation: assessment("participation", seed.indicatorTiers.participation, rationales.participation, seed.sourceIds),
      commercialPull: assessment("commercialPull", seed.indicatorTiers.commercialPull, rationales.commercialPull, seed.sourceIds),
      audienceCenter: assessment("audienceCenter", seed.indicatorTiers.audienceCenter, rationales.audienceCenter, seed.sourceIds),
    },
  };
}

const sharedMediaInsight = "media-properties-travel";

type BespokeCoverageSeed = {
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
  influenceMechanism: string;
  definingMoments: [string, string, string];
  relatedEntities: RelatedCultureEntity[];
  insightIds: string[];
  officialUrl: string;
  sourceId: string;
  sourceNote: string;
  video?: CultureShaperVideo;
  portrait?: string;
  mediaFallback?: string;
  indicatorTiers: Record<IndicatorKey, IndicatorTier>;
};

function bespokeCoverage(seed: BespokeCoverageSeed): CultureShaper {
  return additional({
    ...seed,
    audience: {
      center: "Audience not publicly segmented for Gen Alpha",
      broader: `${seed.category} audiences across markets and generations`,
      ageRange: "Not publicly segmented",
      confidence: "low",
      confidenceRationale: "Cohort-level evidence describes the surrounding culture, not a profile-specific Gen Alpha audience measurement.",
    },
    sourceIds: [seed.sourceId],
    sourceNotes: [{ sourceId: seed.sourceId, note: seed.sourceNote }],
    videos: seed.video ? [seed.video] : [],
    featured: false,
  });
}

const additionalShapers: CultureShaper[] = [
  additional({ id: "olivia-rodrigo", name: "Olivia Rodrigo", pronouns: "she", type: "artist", role: "Confessional pop reference point", category: "Music and youth identity", summary: "Songwriting about first heartbreak, anger, and self-definition gives older Gen Alpha a vivid vocabulary for emotional transition.", topics: ["music", "identity", "relationships"], formats: ["song", "music video", "arena tour"], platforms: ["Spotify", "YouTube", "TikTok"], audienceSegments: ["girls", "music fans", "older Gen Alpha"], audience: { center: "Ages 10-17, especially girls and young music fans", broader: "Families and cross-generational pop audiences", ageRange: "10-17", confidence: "medium", confidenceRationale: "music themes, social circulation, and adjacent teen audience research align, while private listener analytics are unavailable." }, influenceMechanism: "Emotionally precise songs become captions, covers, conversation prompts, and shared milestone soundtracks.", definingMoments: ["SOUR and GUTS becoming youth-pop reference albums", "drivers license moving from intimate song to participatory social format", "Tour, vinyl, merchandise, and film extensions"], relatedEntities: [{ id: "sabrina-carpenter", label: "Sabrina Carpenter", kind: "culture-shaper", href: "/influencers/sabrina-carpenter" }], relatedSpaceIds: ["youtube", "tiktok"], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], sourceNotes: [{ sourceId: "gwi-alpha-unfiltered", note: "GWI supplies youth-interest and media context; album and tour moments are checked against Rodrigo's official destination." }, { sourceId: "pew-teens-social-2024", note: "Pew provides adjacent evidence for teen platform circulation, not artist-specific audience measurement." }], officialUrl: "https://www.oliviarodrigo.com/", videos: [{ youtubeId: "ZmDBbnmKpqQ", title: "drivers license (Official Video)", embeddable: true }], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
  additional({ id: "sabrina-carpenter", name: "Sabrina Carpenter", pronouns: "she", type: "artist", role: "Repeatable pop-format maker", category: "Music, humor, and style", summary: "Compact hooks, visual wit, fashion, and performance details turn pop releases into formats that travel through clips and imitation.", topics: ["music", "fashion", "humor"], formats: ["song", "music video", "live performance"], platforms: ["Spotify", "YouTube", "TikTok"], audienceSegments: ["girls", "music fans", "older Gen Alpha"], audience: { center: "Ages 10-17, especially girls and pop audiences", broader: "Young adults and mainstream pop listeners", ageRange: "10-17", confidence: "medium", confidenceRationale: "format signals and adjacent youth-platform research support the range without first-party demographics." }, influenceMechanism: "A recognizable lyrical and visual grammar makes each release easy to quote, recreate, and carry into style culture.", definingMoments: ["Espresso becoming a cross-platform pop phrase", "Live outros changing by city and rewarding repeat viewing", "Short n' Sweet touring, physical releases, and merchandise"], relatedEntities: [{ id: "olivia-rodrigo", label: "Olivia Rodrigo", kind: "culture-shaper", href: "/influencers/olivia-rodrigo" }], relatedSpaceIds: ["youtube", "tiktok"], insightIds: ["media-repeatable-formats", "media-creators-templates"], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], sourceNotes: [{ sourceId: "gwi-alpha-unfiltered", note: "GWI frames music and youth-interest context; release details come from Carpenter's official destination." }, { sourceId: "pew-teens-social-2024", note: "Pew supports the adjacent platform context in which clips circulate, not a claim about Carpenter's exact audience." }], officialUrl: "https://www.sabrinacarpenter.com/", videos: [{ youtubeId: "eVli-tstM5E", title: "Espresso (Official Video)", embeddable: true }], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
  additional({ id: "caitlin-clark", name: "Caitlin Clark", pronouns: "she", type: "athlete", role: "Women's basketball attention catalyst", category: "Basketball and sports culture", summary: "Long-range shooting, visible competitiveness, and record-setting college-to-pro attention make women's basketball a youth-culture event.", topics: ["basketball", "competition", "women's sports"], formats: ["live game", "highlight", "sports interview"], platforms: ["WNBA", "YouTube", "Instagram"], audienceSegments: ["girls", "sports fans", "families"], audience: { center: "Ages 8-17, especially basketball players and girls in sport", broader: "Family sports audiences and mainstream basketball fans", ageRange: "8-17", confidence: "medium", confidenceRationale: "youth-sports and league reporting support the context, but athlete-specific child audience data are limited." }, influenceMechanism: "Highlights, debates, merchandise, and youth imitation turn elite performance into a repeatable participation loop.", definingMoments: ["Record-setting NCAA scoring and tournament visibility", "Long-range shooting copied in gyms and highlight culture", "WNBA attendance, jersey, sponsorship, and ticket demand"], relatedEntities: [{ id: "jesser", label: "Jesser", kind: "culture-shaper", href: "/influencers/jesser" }], insightIds: ["play-competition-performance", "media-creators-templates"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], sourceNotes: [{ sourceId: "ap-sports-alpha-2026", note: "AP documents leagues adapting to creator-led youth culture; Clark is a concrete athlete lens on that shift." }, { sourceId: "project-play-state-of-play-2025", note: "Project Play supplies youth participation context and cautions that access to organized sport remains unequal." }], officialUrl: "https://www.wnba.com/player/1642286/caitlin-clark", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 2 } }),
  additional({ id: "simone-biles", name: "Simone Biles", pronouns: "she", type: "athlete", role: "Gymnastics excellence standard", category: "Gymnastics, resilience, and performance", summary: "Named skills, competitive longevity, and public discussion of wellbeing make elite gymnastics legible as both achievement and self-advocacy.", topics: ["gymnastics", "wellbeing", "women's sports"], formats: ["live competition", "highlight", "documentary"], platforms: ["Olympics", "Netflix", "Instagram"], audienceSegments: ["girls", "sports fans", "families"], audience: { center: "Ages 7-17, especially gymnasts and girls in sport", broader: "Global Olympic and family audiences", ageRange: "7-17", confidence: "medium", confidenceRationale: "family-scale competition and youth-sports context are visible, while exact child audience concentration is not public." }, influenceMechanism: "Exceptional performance and named skills create imitation, while her wellbeing stance gives young athletes a language for boundaries.", definingMoments: ["Multiple eponymous skills in the gymnastics code", "Olympic return connecting excellence with mental-health boundaries", "Tours, documentaries, sponsorships, and gymnastics participation"], relatedEntities: [{ id: "caitlin-clark", label: "Caitlin Clark", kind: "culture-shaper", href: "/influencers/caitlin-clark" }], insightIds: ["play-competition-performance", "time-coexistence"], sourceIds: ["ap-sports-alpha-2026", "project-play-state-of-play-2025"], sourceNotes: [{ sourceId: "ap-sports-alpha-2026", note: "AP supplies the youth-sports media context; Biles's named skills and official biography anchor the profile facts." }, { sourceId: "project-play-state-of-play-2025", note: "Project Play contextualizes organized youth sport and the unequal access behind aspirational athlete culture." }], officialUrl: "https://simonebiles.com/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 3, audienceCenter: 2 } }),
  additional({ id: "cristiano-ronaldo", name: "Cristiano Ronaldo", pronouns: "he", type: "athlete", role: "Global football icon", category: "Football, training, and celebrity", summary: "Goals, celebration rituals, training mythology, and a vast social footprint connect elite football to imitation and everyday fandom.", topics: ["football", "training", "celebrity"], formats: ["live match", "highlight", "social video"], platforms: ["Football", "YouTube", "Instagram"], audienceSegments: ["sports fans", "boys", "global youth"], audience: { center: "Ages 8-17 among football-oriented youth", broader: "Global, multi-generational sports audiences", ageRange: "8-17", confidence: "medium", confidenceRationale: "global football visibility is clear, but the age center is an editorial estimate rather than first-party analytics." }, influenceMechanism: "A simple celebration, visible training discipline, and constant highlight circulation make fandom physically repeatable.", definingMoments: ["Siu celebration becoming a playground and gaming ritual", "Goals and rivalries sustaining continuous highlight circulation", "Club shirts, sponsorships, games, and CR7 product extensions"], relatedEntities: [{ id: "ishowspeed", label: "IShowSpeed", kind: "culture-shaper", href: "/influencers/ishowspeed" }], insightIds: ["play-competition-performance", "media-repeatable-formats"], sourceIds: ["ap-sports-alpha-2026", "gwi-alpha-unfiltered"], sourceNotes: [{ sourceId: "ap-sports-alpha-2026", note: "AP documents sports' creator-led youth-culture shift; Ronaldo's celebration and media system illustrate repeatability." }, { sourceId: "gwi-alpha-unfiltered", note: "GWI provides broader Gen Alpha interest context rather than athlete-specific reach analytics." }], officialUrl: "https://www.cristianoronaldo.com/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 2 } }),
  additional({ id: "bluey", name: "Bluey", pronouns: "she", type: "screen-ip", role: "Family co-play script", category: "Preschool television and family life", summary: "Short stories about imaginative play, feelings, and family negotiation give children and adults a shared language for everyday life.", topics: ["family", "imaginative play", "emotions"], formats: ["animated episode", "short", "live show"], platforms: ["Disney+", "YouTube", "ABC iview"], audienceSegments: ["families", "co-viewing households", "imaginative-play audiences"], audience: { center: "Exact Gen Alpha age and gender segmentation is not publicly available.", broader: "Older siblings, educators, and adult co-viewers", ageRange: "Not publicly segmented", confidence: "low", confidenceRationale: "Title-level Gen Alpha age and gender data are not publicly available; the editorial lens is limited to the property's child-directed design and co-viewing context." }, influenceMechanism: "Episodes model games, phrases, and emotional scripts that move directly from co-viewing into family play.", definingMoments: ["Keepy Uppy and other episode games moving into home play", "The Sign turning a family change story into a household conversation", "Books, toys, albums, games, and Bluey's Big Play"], relatedEntities: [{ id: "cocomelon", label: "CoComelon", kind: "culture-shaper", href: "/influencers/cocomelon" }], insightIds: ["play-family-coplay", "media-coviewing", sharedMediaInsight], sourceIds: ["common-sense-census-2025", "ofcom-children-media-lives-2025"], sourceNotes: [{ sourceId: "common-sense-census-2025", note: "Common Sense documents young children's video and household context, supporting Bluey's co-viewing lens without claiming title-level ratings." }, { sourceId: "ofcom-children-media-lives-2025", note: "Ofcom's qualitative family-media evidence supports the movement between screen stories and daily routines." }], officialUrl: "https://www.bluey.tv/", portrait: "/culture/bluey.jpg", videos: [], featured: true, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 1 } }),
  additional({ id: "kpop-demon-hunters", name: "KPop Demon Hunters", pronouns: "they", type: "screen-ip", role: "Music-to-fandom crossover", category: "Animated film, K-pop, and fandom", summary: "A female-led animated action-musical connects songs, character identity, choreography, fantasy, and fan participation in one portable property.", topics: ["music", "animation", "friendship"], formats: ["feature film", "song", "dance challenge"], platforms: ["Netflix", "YouTube", "Spotify"], audienceSegments: ["animation fans", "music fandoms", "family co-viewers"], audience: { center: "Exact Gen Alpha age and gender segmentation is not publicly available.", broader: "Family viewers and global pop fandoms", ageRange: "Not publicly segmented", confidence: "low", confidenceRationale: "Title-level Gen Alpha age and gender data are not publicly available; format and visible fandom indicate participation, not a demographic center." }, influenceMechanism: "Songs and choreography let viewers carry characters beyond the film through listening, dance, fan art, and social performance.", definingMoments: ["A female trio combining idol performance with action-hero roles", "Songs and choreography extending the film into covers, dance, and repeat listening", "Soundtrack, merchandise, costumes, and franchise expansion"], relatedEntities: [{ id: "olivia-rodrigo", label: "Olivia Rodrigo", kind: "culture-shaper", href: "/influencers/olivia-rodrigo" }], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["emarketer-alpha-habits-2026", "gwi-alpha-unfiltered"], sourceNotes: [{ sourceId: "emarketer-alpha-habits-2026", note: "EMARKETER supplies cross-platform media context; the film, soundtrack, and character details come from Netflix's official destination." }, { sourceId: "gwi-alpha-unfiltered", note: "GWI contextualizes Gen Alpha entertainment interests; the profile avoids treating broad cohort research as title-level audience analytics." }], officialUrl: "https://www.netflix.com/title/81498621", portrait: "/culture/kpop-demon-hunters.jpg", videos: [{ youtubeId: "AzCAwdp1uIQ", title: "KPop Demon Hunters Official Trailer", embeddable: true }], featured: true, indicatorTiers: { reach: 4, participation: 4, commercialPull: 3, audienceCenter: 1 } }),
  additional({ id: "wednesday", name: "Wednesday", pronouns: "she", type: "screen-ip", role: "Gothic identity template", category: "Streaming series, mystery, and style", summary: "Deadpan humor, mystery, dance, and gothic styling give older Gen Alpha a strong character template for performance and self-presentation.", topics: ["mystery", "fashion", "identity"], formats: ["streaming series", "dance", "short-form clip"], platforms: ["Netflix", "YouTube", "TikTok"], audienceSegments: ["mystery fans", "style imitators", "older youth and adult co-viewers"], audience: { center: "Exact Gen Alpha age and gender segmentation is not publicly available.", broader: "Young adults and family co-viewers", ageRange: "Not publicly segmented", confidence: "low", confidenceRationale: "Title-level Gen Alpha age and gender data are not publicly available; age suitability and viewing context vary by household." }, influenceMechanism: "A distinct movement and style vocabulary lets one scene become dance recreation, costume, meme, and identity signal.", definingMoments: ["Wednesday's school-dance scene becoming a recreation format", "Nevermore style and character archetypes supporting dress-up", "Streaming seasons, licensing, costumes, and games"], relatedEntities: [{ id: "kpop-demon-hunters", label: "KPop Demon Hunters", kind: "culture-shaper", href: "/influencers/kpop-demon-hunters" }], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["pew-teens-social-2024", "emarketer-alpha-habits-2026"], sourceNotes: [{ sourceId: "pew-teens-social-2024", note: "Pew supplies adjacent teen platform context for clip circulation, not title-level audience data." }, { sourceId: "emarketer-alpha-habits-2026", note: "EMARKETER supports the cross-platform interpretation while Netflix remains the source for official property information." }], officialUrl: "https://www.netflix.com/title/81231974", portrait: "/culture/wednesday.jpg", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 3, audienceCenter: 1 } }),
  additional({ id: "barbie", name: "Barbie", pronouns: "she", type: "franchise", role: "Identity-play system", category: "Dolls, film, fashion, and roleplay", summary: "A long-running doll system moves through imaginative careers, collecting, fashion, animation, cinema, and intergenerational conversation.", topics: ["fashion", "careers", "imaginative play"], formats: ["toy play", "feature film", "animation"], platforms: ["Retail", "YouTube", "Cinema"], audienceSegments: ["girls", "families", "collectors"], audience: { center: "Ages 3-12, especially girls and imaginative-play audiences", broader: "Parents, collectors, and intergenerational film audiences", ageRange: "3-12", confidence: "high", confidenceRationale: "the franchise's child-directed toy system and family extensions make the audience center comparatively clear." }, influenceMechanism: "Open-ended character and career play lets each child author a version of the property while media and products refresh the symbols.", definingMoments: ["Career dolls expanding identity rehearsal beyond one storyline", "Theatrical film renewing intergenerational conversation", "Dolls, Dreamhouses, fashion collaborations, games, and licensed worlds"], relatedEntities: [{ id: "bluey", label: "Bluey", kind: "culture-shaper", href: "/influencers/bluey" }], insightIds: ["play-avatars-identity", sharedMediaInsight], sourceIds: ["pwc-alpha-2026", "gwi-alpha-unfiltered"], sourceNotes: [{ sourceId: "pwc-alpha-2026", note: "PwC supports the child-to-household influence context; Mattel's official destination anchors current product extensions." }, { sourceId: "gwi-alpha-unfiltered", note: "GWI supplies broad interest context and does not substitute for franchise-specific child analytics." }], officialUrl: "https://shop.mattel.com/pages/barbie", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  additional({ id: "disney-princess", name: "Disney Princess", pronouns: "they", type: "franchise", role: "Character and ritual constellation", category: "Animation, music, dress-up, and parks", summary: "Distinct heroines, songs, costumes, stories, and park rituals form a flexible system for fantasy, performance, and identity play.", topics: ["music", "fantasy", "identity"], formats: ["animated film", "song", "dress-up play"], platforms: ["Disney+", "YouTube", "Disney Parks"], audienceSegments: ["family co-viewers", "music-and-dress-up participants", "intergenerational Disney fans"], audience: { center: "Exact Gen Alpha age and gender segmentation is not publicly available.", broader: "Older fans and intergenerational Disney households", ageRange: "Not publicly segmented", confidence: "low", confidenceRationale: "Title-level Gen Alpha age and gender data are not publicly available across this multi-character franchise; individual properties and household contexts vary." }, influenceMechanism: "Songs and character roles make the franchise easy to enact at home, in dress-up, in performance, and at destinations.", definingMoments: ["Character songs becoming childhood performance standards", "New heroines broadening the visual and cultural repertoire", "Costumes, dolls, books, parks, live shows, and streaming libraries"], relatedEntities: [{ id: "barbie", label: "Barbie", kind: "culture-shaper", href: "/influencers/barbie" }], insightIds: ["media-coviewing", sharedMediaInsight], sourceIds: ["common-sense-census-2025", "pwc-alpha-2026"], sourceNotes: [{ sourceId: "common-sense-census-2025", note: "Common Sense supplies young-child co-viewing context; Disney's destination anchors character and product information." }, { sourceId: "pwc-alpha-2026", note: "PwC contextualizes household influence and purchase negotiation rather than measuring this franchise alone." }], officialUrl: "https://princess.disney.com/", portrait: "/culture/disney-princess.jpg", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 1 } }),
  additional({ id: "pokemon", name: "Pokemon", pronouns: "they", type: "franchise", role: "Collecting and mastery language", category: "Games, animation, cards, and collecting", summary: "Creatures, types, collecting, battling, and trading create a durable literacy that moves between screens, cards, playgrounds, and families.", topics: ["gaming", "collecting", "friendship"], formats: ["video game", "animation", "trading card game"], platforms: ["Nintendo Switch", "YouTube", "Retail"], audienceSegments: ["gamers", "families", "collectors"], audience: { center: "Ages 6-14 across gamers and collectors", broader: "Parents and older fans with franchise history", ageRange: "6-14", confidence: "high", confidenceRationale: "the child-facing game, animation, and card systems clearly support this range while intergenerational reach is broader." }, influenceMechanism: "A learnable system of names, types, rarity, and strategy turns fandom into social fluency and exchange.", definingMoments: ["Starter choices and creature knowledge becoming peer language", "Trading cards connecting collecting with face-to-face exchange", "Games, animation, cards, toys, events, and licensed products"], relatedEntities: [{ id: "minecraft", label: "Minecraft", kind: "culture-shaper", href: "/influencers/minecraft" }], insightIds: ["play-status-contribution", sharedMediaInsight], sourceIds: ["pew-teens-video-games-2024", "pwc-alpha-2026"], sourceNotes: [{ sourceId: "pew-teens-video-games-2024", note: "Pew supplies adjacent evidence for games as social environments; Pokemon's official destination anchors franchise elements." }, { sourceId: "pwc-alpha-2026", note: "PwC supports household commerce context, not a title-level sales claim." }], officialUrl: "https://www.pokemon.com/us", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  additional({ id: "minecraft", name: "Minecraft", pronouns: "they", type: "franchise", role: "Creation-world standard", category: "Games, making, video, and education", summary: "Block-based building connects play, collaboration, tutorials, storytelling, classroom use, and creator culture through one shared visual language.", topics: ["gaming", "creation", "learning"], formats: ["video game", "gameplay video", "collaborative build"], platforms: ["Minecraft", "YouTube", "Education"], audienceSegments: ["gamers", "families", "students"], audience: { center: "Ages 6-15 across builders, gamers, and learners", broader: "Families, educators, creators, and adult players", ageRange: "6-15", confidence: "high", confidenceRationale: "direct 5-13 creation-gaming research and the franchise's education system support a clear youth center." }, influenceMechanism: "A simple construction grammar lets players make, teach, narrate, collaborate, and turn their own worlds into media.", definingMoments: ["Survival and Creative modes supporting distinct play styles", "YouTube builders and roleplayers turning worlds into stories", "Games, Education Edition, merchandise, film, and live community events"], relatedEntities: [{ id: "aphmau", label: "Aphmau", kind: "culture-shaper", href: "/influencers/aphmau" }], insightIds: ["play-making-interface", "learning-creation-skills"], sourceIds: ["walton-creation-gaming-2024", "ofcom-children-media-lives-2025"], sourceNotes: [{ sourceId: "walton-creation-gaming-2024", note: "The Walton/Bodacious study directly includes Minecraft in research with 5- to 13-year-olds about creation gaming and learning." }, { sourceId: "ofcom-children-media-lives-2025", note: "Ofcom supplies qualitative context for games moving through children's friendship and media routines." }], officialUrl: "https://www.minecraft.net/", videos: [], featured: false, indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
];

type CoverageCore = Pick<
  BespokeCoverageSeed,
  "id" | "name" | "pronouns" | "role" | "summary" | "influenceMechanism" | "definingMoments" | "officialUrl" | "sourceNote"
>;

type ArtistCoverage = CoverageCore & { video: CultureShaperVideo };
type AthleteCoverage = CoverageCore & { mediaFallback: string };

type CoverageEditorialTuple = readonly [
  category: string,
  topics: readonly [string, string, string],
  formats: readonly [string, string, string],
  platforms: readonly [string, string, string],
  audienceSegments: readonly [string, string, string],
  relatedProfile: readonly [id: string, label: string],
  insightIds: readonly [string, string],
  sourceId: string,
  indicatorTiers: readonly [IndicatorTier, IndicatorTier, IndicatorTier, IndicatorTier],
];

const artistEditorial = {
  "taylor-swift": ["Catalog pop and fan ritual", ["catalog storytelling", "fan ritual", "music ownership"], ["album era", "stadium concert", "music video"], ["Spotify", "YouTube", "stadium"], ["catalog explorers", "concert communities", "pop fandoms"], ["olivia-rodrigo", "Olivia Rodrigo"], ["media-repeatable-formats", "media-discovery-commerce"], "gwi-alpha-unfiltered", [4, 4, 4, 1]],
  "billie-eilish": ["Alternative pop and interior emotion", ["sound design", "vulnerability", "visual suspense"], ["close-miked song", "cinematic video", "arena performance"], ["YouTube", "Spotify", "cinema"], ["headphone listeners", "visual storytellers", "alternative pop fans"], ["sza", "SZA"], ["media-properties-travel", "time-age-change"], "pew-teens-social-2024", [4, 3, 4, 1]],
  "chappell-roan": ["Theatrical pop and visible experimentation", ["camp performance", "queer storytelling", "crowd choreography"], ["character performance", "festival set", "participation dance"], ["TikTok", "YouTube", "festival stage"], ["costume experimenters", "communal singers", "pop performance fans"], ["sabrina-carpenter", "Sabrina Carpenter"], ["media-creators-templates", "play-avatars-identity"], "gwi-alpha-unfiltered", [4, 4, 3, 1]],
  doechii: ["Theatrical rap and character switching", ["technical rap", "character voice", "staged comedy"], ["mixtape", "television performance", "narrative video"], ["YouTube", "Spotify", "television"], ["rap craft learners", "performance editors", "genre-fluid listeners"], ["chappell-roan", "Chappell Roan"], ["learning-remix", "media-short-form-shape"], "pew-teens-social-2024", [3, 4, 3, 1]],
  tyla: ["South African dance-pop translation", ["amapiano", "dance vocabulary", "global pop"], ["dance challenge", "music video", "award performance"], ["TikTok", "YouTube", "Spotify"], ["dance learners", "amapiano discoverers", "global pop listeners"], ["lisa", "LISA"], ["learning-multimodal", "media-properties-travel"], "gwi-alpha-unfiltered", [4, 3, 3, 1]],
  rose: ["K-pop solo confession and crossover", ["vocal identity", "bilingual pop", "diaristic songwriting"], ["solo single", "duet video", "album diary"], ["Spotify", "YouTube", "Instagram"], ["BLACKPINK followers", "songwriting listeners", "bilingual pop fans"], ["jennie", "JENNIE"], ["media-properties-travel", "media-creators-templates"], "gwi-alpha-unfiltered", [3, 3, 3, 1]],
  jennie: ["K-pop fashion and independent authorship", ["rap delivery", "luxury style", "solo authorship"], ["performance single", "fashion campaign", "album film"], ["Instagram", "YouTube", "Spotify"], ["fashion-reference seekers", "rap-performance fans", "idol solo followers"], ["lisa", "LISA"], ["media-discovery-commerce", "play-avatars-identity"], "pwc-alpha-2026", [4, 2, 4, 1]],
  lisa: ["Thai dance precision and global performance", ["precision dance", "multilingual rap", "Thai visual culture"], ["dance film", "solo video", "location performance"], ["YouTube", "TikTok", "Bangkok performance"], ["choreography learners", "Thai pop audiences", "fashion-performance fans"], ["tyla", "Tyla"], ["learning-multimodal", "media-discovery-commerce"], "gwi-alpha-unfiltered", [3, 4, 2, 1]],
  bts: ["Collective K-pop fandom and public action", ["group identity", "fan mobilization", "self-worth"], ["group single", "stadium show", "campaign message"], ["Weverse", "YouTube", "stadium"], ["ARMY communities", "dance-cover teams", "translation networks"], ["stray-kids", "Stray Kids"], ["play-small-crews", "media-creators-templates"], "gwi-alpha-unfiltered", [4, 4, 2, 1]],
  "stray-kids": ["Self-produced K-pop intensity", ["self-production", "sonic identity", "point choreography"], ["performance video", "album chapter", "stadium tour"], ["YouTube", "Spotify", "Bubble"], ["production-curious fans", "choreography crews", "high-energy listeners"], ["bts", "BTS"], ["learning-creation-skills", "media-repeatable-formats"], "pew-teens-social-2024", [3, 3, 4, 1]],
  katseye: ["Global girl-group formation culture", ["audition growth", "multinational identity", "group chemistry"], ["competition series", "debut video", "hand choreography"], ["Netflix", "TikTok", "YouTube"], ["audition-series viewers", "formation-story followers", "dance-cover communities"], ["le-sserafim", "LE SSERAFIM"], ["media-coviewing", "media-creators-templates"], "emarketer-alpha-habits-2026", [4, 2, 3, 1]],
  enhypen: ["Supernatural K-pop serial storytelling", ["vampire lore", "synchronized movement", "chaptered releases"], ["survival series", "concept film", "partner choreography"], ["YouTube", "Weverse", "Spotify"], ["lore detectives", "survival-show followers", "choreography partners"], ["stray-kids", "Stray Kids"], ["media-properties-travel", "media-repeatable-formats"], "gwi-alpha-unfiltered", [3, 2, 3, 1]],
  aespa: ["Virtual-world K-pop identity", ["digital doubles", "science fiction", "club production"], ["avatar narrative", "concept album", "point-move video"], ["YouTube", "Instagram", "Spotify"], ["virtual-world fans", "concept theorists", "dance editors"], ["kpop-demon-hunters", "KPop Demon Hunters"], ["play-avatars-identity", "media-properties-travel"], "emarketer-alpha-habits-2026", [3, 4, 4, 1]],
  ive: ["Polished confidence-pop performance", ["self-possession", "elegant styling", "hand gestures"], ["runway debut", "mirror choreography", "vocal spectacle"], ["YouTube", "TikTok", "Melon"], ["confidence-playlist listeners", "gesture learners", "style-reference fans"], ["katseye", "KATSEYE"], ["media-repeatable-formats", "play-avatars-identity"], "gwi-alpha-unfiltered", [3, 2, 2, 1]],
  babymonster: ["Rookie K-pop skill evaluation", ["vocal showcase", "multilingual rap", "training progress"], ["evaluation series", "maximal debut", "performance stage"], ["YouTube", "TikTok", "YG channels"], ["trainee-process viewers", "vocal comparison fans", "rookie-group followers"], ["aespa", "aespa"], ["learning-assembled", "media-creators-templates"], "pew-teens-social-2024", [4, 4, 4, 1]],
  "le-sserafim": ["Athletic K-pop resilience", ["training imagery", "resilience", "athletic choreography"], ["runway performance", "floorwork dance", "game collaboration"], ["YouTube", "TikTok", "Overwatch"], ["fitness-dance learners", "resilience-theme listeners", "game-collab audiences"], ["katseye", "KATSEYE"], ["time-coexistence", "media-properties-travel"], "gwi-alpha-unfiltered", [4, 3, 4, 1]],
  ado: ["Voice-first anime music crossover", ["vocal character", "illustrated identity", "anime soundtrack"], ["illustrated video", "character song", "concealed live show"], ["YouTube", "Spotify", "anime cinema"], ["anime soundtrack fans", "vocal-technique learners", "fan illustrators"], ["yoasobi", "YOASOBI"], ["media-properties-travel", "learning-remix"], "emarketer-alpha-habits-2026", [4, 4, 3, 1]],
  yoasobi: ["Fiction-to-song Japanese pop", ["short fiction", "compressed narrative", "animated storytelling"], ["story adaptation", "anime opening", "book album"], ["YouTube", "Spotify", "publishing"], ["story readers", "anime-opening listeners", "cover musicians"], ["ado", "Ado"], ["learning-remix", "media-repeatable-formats"], "gwi-alpha-unfiltered", [3, 4, 3, 1]],
  "bad-bunny": ["Puerto Rican pop world building", ["Puerto Rican identity", "genre mobility", "place-based storytelling"], ["visual album", "wrestling event", "island residency"], ["Spotify", "YouTube", "WWE"], ["Spanish-language listeners", "Puerto Rican diaspora", "genre-crossing fans"], ["karol-g", "KAROL G"], ["media-properties-travel", "media-discovery-commerce"], "gwi-alpha-unfiltered", [4, 3, 3, 1]],
  "karol-g": ["Latina arena confidence culture", ["reggaeton", "recovery narrative", "fan affirmation"], ["breakup anthem", "arena singalong", "album world"], ["YouTube", "Spotify", "stadium"], ["Latina pop communities", "breakup-playlist listeners", "arena concert fans"], ["bad-bunny", "Bad Bunny"], ["media-creators-templates", "media-properties-travel"], "gwi-alpha-unfiltered", [3, 3, 3, 1]],
  "peso-pluma": ["Corridos tumbados crossover", ["regional Mexican music", "requinto", "collaboration networks"], ["corrido single", "feature chain", "festival set"], ["Spotify", "YouTube", "Coachella"], ["regional Mexican listeners", "instrument-curious fans", "collaboration explorers"], ["fuerza-regida", "Fuerza Regida"], ["media-properties-travel", "play-small-crews"], "gwi-alpha-unfiltered", [4, 2, 4, 1]],
  "fuerza-regida": ["Southern California corrido crew culture", ["corrido instrumentation", "streetwear", "hybrid production"], ["band performance", "crew video", "named genre hybrid"], ["YouTube", "Spotify", "Instagram"], ["Southern California listeners", "streetwear-reference fans", "band-chemistry followers"], ["peso-pluma", "Peso Pluma"], ["play-small-crews", "learning-remix"], "pew-teens-social-2024", [3, 4, 2, 1]],
  "burna-boy": ["Nigerian Afrofusion at arena scale", ["Afrofusion", "Nigerian identity", "festival performance"], ["festival headline", "album thesis", "sample-led single"], ["YouTube", "Spotify", "festival circuit"], ["Afrofusion discoverers", "festival audiences", "diaspora listeners"], ["rema", "Rema"], ["media-properties-travel", "media-coviewing"], "gwi-alpha-unfiltered", [4, 4, 2, 1]],
  rema: ["Afrobeats melodic futurism", ["Afrobeats", "melodic loops", "speculative imagery"], ["breakout video", "global remix", "rough-edged album"], ["YouTube", "Spotify", "Instagram"], ["Afrobeats newcomers", "remix-route listeners", "visual-symbol fans"], ["burna-boy", "Burna Boy"], ["media-repeatable-formats", "learning-remix"], "gwi-alpha-unfiltered", [3, 3, 4, 1]],
  tems: ["Alternative R&B stillness and self-possession", ["alt-R&B", "vocal texture", "spiritual direction"], ["featured verse", "slow-burn single", "self-directed video"], ["Spotify", "YouTube", "film soundtrack"], ["intimate-listening audiences", "R&B vocal fans", "soundtrack discoverers"], ["sza", "SZA"], ["time-coexistence", "media-discovery-commerce"], "gwi-alpha-unfiltered", [4, 2, 3, 1]],
  shakira: ["Multilingual dance-pop bridge", ["Latin pop", "movement language", "sporting ritual"], ["dance lesson", "World Cup anthem", "music session"], ["YouTube", "TikTok", "football broadcast"], ["multilingual households", "dance imitators", "football-event audiences"], ["tyla", "Tyla"], ["media-repeatable-formats", "play-competition-performance"], "gwi-alpha-unfiltered", [3, 2, 3, 1]],
  sza: ["Confessional R&B interior monologue", ["ambivalence", "nonlinear melody", "cinematic self-conflict"], ["diary album", "revenge-fantasy video", "genre-spanning set"], ["Spotify", "YouTube", "TikTok"], ["caption-seeking listeners", "confessional R&B fans", "cinematic-video viewers"], ["billie-eilish", "Billie Eilish"], ["time-age-change", "media-short-form-shape"], "pew-teens-social-2024", [3, 4, 4, 1]],
  "the-weeknd": ["Serialized cinematic synth-pop", ["recurring character", "nocturnal synths", "consequence narrative"], ["linked music video", "halftime spectacle", "album character arc"], ["YouTube", "Spotify", "sports broadcast"], ["visual-universe theorists", "synth-pop listeners", "event-performance viewers"], ["taylor-swift", "Taylor Swift"], ["media-properties-travel", "media-short-form-shape"], "emarketer-alpha-habits-2026", [3, 2, 2, 1]],
} as const satisfies Record<string, CoverageEditorialTuple>;

const athleteEditorial = {
  "angel-reese": ["Basketball, fashion, and athlete entrepreneurship", ["basketball", "fashion identity", "business ambition"], ["WNBA game", "tunnel-style post", "signature-shoe story"], ["WNBA", "Instagram", "YouTube"], ["basketball learners", "athlete-style followers", "women's sports audiences"], ["caitlin-clark", "Caitlin Clark"], ["play-competition-performance", "media-discovery-commerce"], "ap-sports-alpha-2026", [4, 4, 4, 1]],
  "aja-wilson": ["Championship basketball and public advocacy", ["two-way basketball", "leadership", "women's sport advocacy"], ["WNBA game", "championship series", "signature-shoe launch"], ["WNBA", "YouTube", "Nike"], ["post-skill learners", "leadership-focused athletes", "championship followers"], ["angel-reese", "Angel Reese"], ["play-competition-performance", "media-creators-templates"], "project-play-state-of-play-2025", [4, 3, 4, 1]],
  "trinity-rodman": ["Expressive women's football and individual style", ["football", "one-on-one attack", "athlete personality"], ["NWSL match", "goal highlight", "player interview"], ["NWSL", "Instagram", "YouTube"], ["young footballers", "wing-play learners", "women's football fans"], ["coco-gauff", "Coco Gauff"], ["play-competition-performance", "media-repeatable-formats"], "ap-sports-alpha-2026", [4, 4, 3, 1]],
  "coco-gauff": ["Tennis growth under public pressure", ["tennis", "problem solving", "age-relative milestones"], ["Grand Slam match", "comeback highlight", "press reflection"], ["WTA", "YouTube", "Instagram"], ["junior tennis players", "comeback-story followers", "women's tennis audiences"], ["naomi-osaka", "Naomi Osaka"], ["time-age-change", "play-competition-performance"], "project-play-state-of-play-2025", [3, 4, 3, 1]],
  "naomi-osaka": ["Tennis excellence and athlete boundaries", ["tennis", "mental wellbeing", "professional boundaries"], ["major final", "press statement", "documentary portrait"], ["WTA", "Netflix", "Instagram"], ["tennis families", "wellbeing advocates", "athlete-care audiences"], ["simone-biles", "Simone Biles"], ["time-coexistence", "play-competition-performance"], "ap-sports-alpha-2026", [4, 3, 3, 1]],
  "rayssa-leal": ["Youth street skating and joyful competition", ["street skating", "technical progression", "competition community"], ["trick clip", "Olympic run", "street final"], ["Olympics", "Instagram", "YouTube"], ["young skaters", "trick learners", "Brazilian sports fans"], ["lamine-yamal", "Lamine Yamal"], ["learning-multimodal", "play-competition-performance"], "project-play-state-of-play-2025", [3, 3, 3, 1]],
  "lamine-yamal": ["Teen football possibility and academy progression", ["football", "creative wing play", "academy pathway"], ["La Liga match", "international highlight", "game-avatar update"], ["FC Barcelona", "YouTube", "EA Sports FC"], ["academy footballers", "wing-play imitators", "Spain supporters"], ["jude-bellingham", "Jude Bellingham"], ["time-age-change", "media-repeatable-formats"], "ap-sports-alpha-2026", [4, 2, 4, 1]],
  "jude-bellingham": ["Midfield leadership and early responsibility", ["football", "midfield craft", "visible leadership"], ["Champions League match", "celebration clip", "player profile"], ["Real Madrid", "Instagram", "YouTube"], ["developing midfielders", "leadership-focused players", "club football fans"], ["kylian-mbappe", "Kylian Mbappe"], ["play-status-contribution", "play-competition-performance"], "project-play-state-of-play-2025", [3, 4, 2, 1]],
  "kylian-mbappe": ["Explosive football and global succession", ["football", "acceleration", "international ambition"], ["World Cup match", "breakaway highlight", "club presentation"], ["Real Madrid", "YouTube", "football broadcast"], ["speed-training players", "World Cup followers", "global club audiences"], ["cristiano-ronaldo", "Cristiano Ronaldo"], ["play-competition-performance", "media-properties-travel"], "ap-sports-alpha-2026", [4, 4, 2, 1]],
  "shohei-ohtani": ["Two-way baseball and cross-market possibility", ["baseball", "dual-role performance", "Japan-US fandom"], ["MLB game", "statistical milestone", "international highlight"], ["MLB", "YouTube", "Japanese broadcast"], ["youth baseball players", "statistics explorers", "cross-market sports fans"], ["stephen-curry", "Stephen Curry"], ["learning-assembled", "play-competition-performance"], "ap-sports-alpha-2026", [3, 3, 4, 1]],
  "stephen-curry": ["Range-shifting basketball and repeatable skill", ["basketball", "shooting practice", "playful confidence"], ["NBA game", "practice drill", "Olympic finish"], ["NBA", "YouTube", "Instagram"], ["young shooters", "practice-routine learners", "basketball families"], ["jesser", "Jesser"], ["learning-multimodal", "play-competition-performance"], "project-play-state-of-play-2025", [4, 2, 3, 1]],
  "erling-haaland": ["Power-forward football and signature ritual", ["football", "physical finishing", "celebration identity"], ["Premier League match", "goal compilation", "game celebration"], ["Manchester City", "YouTube", "EA Sports FC"], ["striker-skill learners", "goal-clip viewers", "football gaming fans"], ["ishowspeed", "IShowSpeed"], ["media-repeatable-formats", "play-competition-performance"], "ap-sports-alpha-2026", [3, 2, 3, 1]],
} as const satisfies Record<string, CoverageEditorialTuple>;

function applyCoverageEditorial(seed: ArtistCoverage | AthleteCoverage, editorial: CoverageEditorialTuple): BespokeCoverageSeed {
  const [category, topics, formats, platforms, audienceSegments, [relatedId, relatedLabel], insightIds, sourceId, tiers] = editorial;
  return {
    ...seed,
    type: "video" in seed ? "artist" : "athlete",
    category,
    topics: [...topics],
    formats: [...formats],
    platforms: [...platforms],
    audienceSegments: [...audienceSegments],
    relatedEntities: [{ id: relatedId, label: relatedLabel, kind: "culture-shaper", href: `/influencers/${relatedId}` }],
    insightIds: [...insightIds],
    sourceId,
    indicatorTiers: {
      reach: tiers[0],
      participation: tiers[1],
      commercialPull: tiers[2],
      audienceCenter: tiers[3],
    },
  };
}

function artistCoverage(seed: ArtistCoverage): BespokeCoverageSeed {
  return applyCoverageEditorial(seed, artistEditorial[seed.id as keyof typeof artistEditorial]);
}

function athleteCoverage(seed: AthleteCoverage): BespokeCoverageSeed {
  return applyCoverageEditorial(seed, athleteEditorial[seed.id as keyof typeof athleteEditorial]);
}

const coverageShapers: Array<BespokeCoverageSeed | CultureShaper> = [
  artistCoverage({ id: "taylor-swift", name: "Taylor Swift", pronouns: "she", role: "Album-era world builder", summary: "Catalog storytelling turns releases into eras that fans decode, revisit, trade, and stage as personal identity markers.", influenceMechanism: "Narrative clues and ownership stories reward sustained attention while concerts convert listening into collective ritual.", definingMoments: ["The Eras Tour arranging eighteen years of songs as distinct visual chapters", "Taylor's Version re-recordings making music ownership part of fan literacy", "Friendship-bracelet trading growing from a lyric into a stadium custom"], officialUrl: "https://www.taylorswift.com/", sourceNote: "Cohort-level GWI music findings frame catalog fandom; they do not establish Taylor Swift child audience demographics.", video: { youtubeId: "b1kbLwvqugk", title: "Anti-Hero (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "billie-eilish", name: "Billie Eilish", pronouns: "she", role: "Intimate sound-design auteur", summary: "Whispered vocals, uneasy textures, and candid visual choices make interior feelings feel cinematic without sanding away discomfort.", influenceMechanism: "Close-miked confession and striking imagery give listeners a recognizable language for vulnerability, suspense, and self-styling.", definingMoments: ["bad guy pairing bedroom-scale production with a sharply colored visual world", "No Time to Die making Eilish the youngest artist to record a Bond theme", "What Was I Made For? carrying Barbie's identity question beyond the film"], officialUrl: "https://www.billieeilish.com/", sourceNote: "GWI offers cohort-level context for mood-led listening, not profile-specific evidence about Billie Eilish's youngest listeners.", video: { youtubeId: "V9PVRfjEBTI", title: "BIRDS OF A FEATHER (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "chappell-roan", name: "Chappell Roan", pronouns: "she", role: "Camp-pop character catalyst", summary: "Theatrical makeup, queer storytelling, and crowd-ready choreography turn pop performance into permission for visible experimentation.", influenceMechanism: "Named dances and heightened stage personas let audiences rehearse confidence through costume, gesture, and communal singing.", definingMoments: ["Pink Pony Club becoming a slow-building anthem for chosen belonging", "HOT TO GO! teaching crowds a letter-by-letter dance they can perform together", "The Statue of Liberty costume at Governors Ball turning a festival set into iconography"], officialUrl: "https://www.iamchappellroan.com/", sourceNote: "Cohort-level interest research helps situate participatory pop; it is not a Chappell Roan audience survey.", video: { youtubeId: "GR3Liudev18", title: "Pink Pony Club (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "doechii", name: "Doechii", pronouns: "she", role: "Genre-switching rap dramatist", summary: "Rapid character shifts, technical rapping, and theatrical staging make each performance feel like a scene with its own rules.", influenceMechanism: "Contrasting voices and precise visual blocking invite quote culture while showing that one artist can hold multiple identities at once.", definingMoments: ["Alligator Bites Never Heal presenting mixtape craft as a complete narrative statement", "DENIAL IS A RIVER translating an internal argument into staged television comedy", "Anxiety reconnecting an older recording with a new cross-platform conversation"], officialUrl: "https://www.doechii.com/", sourceNote: "GWI's cohort-level media lens contextualizes genre fluidity but does not measure Doechii's Gen Alpha reach.", video: { youtubeId: "F0cdbR5ognY", title: "DENIAL IS A RIVER (Official Video)", embeddable: true } }),
  artistCoverage({ id: "tyla", name: "Tyla", pronouns: "she", role: "Amapiano-pop dance translator", summary: "Airy vocals and South African dance vocabulary carry amapiano's log-drum pulse into concise global pop formats.", influenceMechanism: "A specific movement phrase can introduce a regional sound, sending viewers from a short clip toward songs, dancers, and origin context.", definingMoments: ["Water's Bacardi-inspired choreography becoming a widely attempted dance sequence", "Winning the inaugural Grammy for Best African Music Performance", "The self-titled debut album widening the frame beyond one breakout single"], officialUrl: "https://www.tylaworld.com/", sourceNote: "Cohort-level GWI findings support a global music-discovery frame; they are not Tyla listener demographics.", video: { youtubeId: "XoiOOiuH8iI", title: "Water (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "rose", name: "ROSE", pronouns: "she", role: "K-pop solo intimacy bridge", summary: "A distinctive vocal grain links stadium-scale idol experience with guitar-led confession and conversational pop songwriting.", influenceMechanism: "Solo candor gives an established group fandom a more personal entry point, while bilingual circulation keeps releases globally portable.", definingMoments: ["On The Ground establishing a solo voice apart from BLACKPINK's group sound", "APT. with Bruno Mars turning a Korean drinking-game chant into a pop hook", "rosie placing diaristic English-language songwriting at the center of a full album"], officialUrl: "https://www.rosesarerosie.com/", sourceNote: "GWI supplies cohort-level global fandom context, not profile-specific age data for ROSE.", video: { youtubeId: "ekr2nIex040", title: "APT. (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "jennie", name: "JENNIE", pronouns: "she", role: "Fashion-rap duality setter", summary: "Controlled rap delivery, luxury styling, and selective vulnerability connect idol precision with a self-authored solo identity.", influenceMechanism: "High-contrast looks and compact performance gestures let music, beauty, and fashion references circulate as one package.", definingMoments: ["SOLO defining an early BLACKPINK member blueprint for individual releases", "You & Me using a moonlit silhouette routine as the performance's signature", "Ruby and like JENNIE expanding her independent album authorship"], officialUrl: "https://www.jenn.ie/", sourceNote: "Cohort-level fashion and music interests contextualize JENNIE; GWI does not provide her child-specific audience profile.", video: { youtubeId: "JSFG-IE8n_c", title: "like JENNIE (Official Video)", embeddable: true } }),
  artistCoverage({ id: "lisa", name: "LISA", pronouns: "she", role: "Precision-dance globalization engine", summary: "Crisp movement, multilingual rap, and Thai visual references make choreography the primary carrier of a border-crossing solo brand.", influenceMechanism: "Performance details are built to be isolated, practiced, and reposted, connecting technical admiration with fashion aspiration.", definingMoments: ["LALISA foregrounding Thai motifs inside a maximal solo debut", "MONEY's dance performance outlasting the original promotion cycle through clips", "ROCKSTAR filming in Bangkok's Yaowarat district and centering local dancers"], officialUrl: "https://www.lalisaofficial.com/", sourceNote: "GWI's cohort-level account of cross-border discovery frames LISA's visibility without claiming profile-specific youth analytics.", video: { youtubeId: "hbcGx4MGUMg", title: "ROCKSTAR (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "bts", name: "BTS", pronouns: "they", role: "Collective fandom mobilizer", summary: "Seven distinct personalities, serialized themes, and public messages about self-worth make group belonging part of the music experience.", influenceMechanism: "Coordinated fan interpretation and action turn releases into shared projects spanning dance, translation, charity, and live gathering.", definingMoments: ["Dynamite becoming the group's first fully English-language single and a global radio breakthrough", "The Love Myself campaign joining music fandom with a UNICEF anti-violence message", "Permission to Dance performances using International Sign gestures within the choreography"], officialUrl: "https://ibighit.com/bts/eng/", sourceNote: "Cohort-level GWI fandom research gives surrounding context; it is not an age breakdown of BTS's audience.", video: { youtubeId: "gdZLi9oWNZg", title: "Dynamite (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "stray-kids", name: "Stray Kids", pronouns: "they", role: "Self-produced intensity engine", summary: "Dense electronic production, shouted hooks, and visible in-group authorship frame noise and speed as signs of creative autonomy.", influenceMechanism: "Recurring sonic tags and forceful point choreography give fans both an audible identity marker and a physical challenge.", definingMoments: ["God's Menu codifying the group's culinary metaphors and hard-edged sound", "5-STAR pairing self-production credits with a chart-leading album cycle", "The dominATE tour scaling their performance language to global stadiums"], officialUrl: "https://straykids.jype.com/", sourceNote: "GWI contributes cohort-level global music context, not profile-specific Gen Alpha measurement for Stray Kids.", video: { youtubeId: "TQTlCHxyuu8", title: "God's Menu (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "katseye", name: "KATSEYE", pronouns: "they", role: "Global trainee-system experiment", summary: "A multinational lineup applies K-pop development methods to English-language pop while making the formation process part of the story.", influenceMechanism: "Audition visibility encourages viewers to compare growth, roles, and chemistry before short choreography turns songs into participation formats.", definingMoments: ["The Dream Academy competition letting viewers follow the lineup's formation", "Debut introducing the six-member group through a concise statement track", "Touch becoming recognizable through hand-focused choreography and rapid fan covers"], officialUrl: "https://www.katseye.world/", sourceNote: "Cohort-level platform research helps read KATSEYE's formation narrative; it does not identify a child audience share.", video: { youtubeId: "l9CZykYZkOQ", title: "Touch (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "enhypen", name: "ENHYPEN", pronouns: "they", role: "Supernatural concept serialists", summary: "Vampire mythology, athletic synchronized movement, and chaptered releases give fans a story system extending beyond individual songs.", influenceMechanism: "Lore clues reward repeat viewing while paired choreography and character roles make the narrative available for reenactment.", definingMoments: ["I-LAND documenting the members' selection before debut", "Drunk-Dazed turning a surreal party into the group's early conceptual signature", "Bite Me using partner choreography to sharpen the vampire-romance frame"], officialUrl: "https://beliftlab.com/artist/profile/ENHYPEN", sourceNote: "GWI's cohort-level fan-culture evidence contextualizes serialized K-pop; it is not ENHYPEN audience research.", video: { youtubeId: "wXFLzODIdUI", title: "Bite Me (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "aespa", name: "aespa", pronouns: "they", role: "Virtual-world pop architects", summary: "Digital doubles, science-fiction vocabulary, and metallic club production make platform-native identity part of the group's core mythology.", influenceMechanism: "Distinctive coined language and camera-ready point moves give fans compact pieces of a larger speculative universe to reuse.", definingMoments: ["Black Mamba introducing avatar counterparts as active story characters", "Next Level turning a structural switch-up into a defining performance hit", "Supernova and Armageddon joining cosmic imagery across a full-album era"], officialUrl: "https://www.aespa.com/", sourceNote: "Cohort-level digital-identity findings help frame aespa's concept, not the group's profile-specific age composition.", video: { youtubeId: "phuiiNCxRMg", title: "Supernova (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "ive", name: "IVE", pronouns: "they", role: "Self-assured pop polishers", summary: "Elegant styling, direct hooks, and lyrics about self-possession package confidence as composure instead of rebellion.", influenceMechanism: "Clean silhouettes and memorable hand gestures make aspirational performance feel legible enough to practice and personalize.", definingMoments: ["ELEVEN launching the group with a tempo-bending debut", "LOVE DIVE pairing a mirror gesture with a durable self-love refrain", "I AM using an ascending vocal line to scale confidence into spectacle"], officialUrl: "https://ive-official.jp/", sourceNote: "GWI provides cohort-level confidence and fandom context; it does not measure IVE's youngest followers.", video: { youtubeId: "Y8JFxS1HlDo", title: "LOVE DIVE (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "babymonster", name: "BABYMONSTER", pronouns: "they", role: "Rookie-skill spectacle", summary: "Vocal showcases, multilingual rap, and high-difficulty choreography make technical proof central to the group's early identity.", influenceMechanism: "Behind-the-scenes evaluation footage turns improvement into narrative, then polished releases supply moments for performance comparison.", definingMoments: ["Last Evaluation exposing the pre-debut assessment process", "SHEESH emphasizing individual vocal and rap introductions inside one maximal track", "DRIP broadening the group's sound while retaining performance-first staging"], officialUrl: "https://ygfamily.com/en/artists/babymonster/profile", sourceNote: "Cohort-level GWI music discovery research frames BABYMONSTER's visibility, not a profile-specific child demographic.", video: { youtubeId: "2wA_b6YHjqQ", title: "SHEESH (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "le-sserafim", name: "LE SSERAFIM", pronouns: "they", role: "Resilience-concept performers", summary: "Training imagery, athletic movement, and songs about moving through scrutiny turn effort itself into the group's aspirational symbol.", influenceMechanism: "Visible exertion and repeatable floorwork let performance communicate persistence before listeners parse every lyric.", definingMoments: ["FEARLESS establishing a stripped-back runway walk as the debut motif", "ANTIFRAGILE converting setbacks into a reggaeton-driven point dance", "Perfect Night linking a game collaboration with softer synchronized choreography"], officialUrl: "https://www.le-sserafim.jp/", sourceNote: "GWI's cohort-level identity research offers context for resilience themes; it is not LE SSERAFIM listener analytics.", video: { youtubeId: "pyf8cbqyfPs", title: "ANTIFRAGILE (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "ado", name: "Ado", pronouns: "she", role: "Voice-first anime crossover", summary: "Extreme vocal character, an illustrated public identity, and anime ties prove that performance intensity does not require conventional celebrity visibility.", influenceMechanism: "A concealed face shifts attention toward vocal technique and fan illustration while soundtrack placements open routes across media.", definingMoments: ["Usseewa turning a confrontational vocal performance into a major Japanese debut", "New Genesis voicing Uta's musical identity in One Piece Film: Red", "Wish becoming Ado's first world tour while her illustrated persona remained intact"], officialUrl: "https://www.universal-music.co.jp/ado/", sourceNote: "Cohort-level global media findings contextualize anime-to-music movement; they do not profile Ado's child listeners.", video: { youtubeId: "1FliVTcX8bQ", title: "New Genesis (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "yoasobi", name: "YOASOBI", pronouns: "they", role: "Fiction-to-song translators", summary: "Short stories become compressed pop narratives whose speed, visual animation, and emotional turns reward reading alongside listening.", influenceMechanism: "A published source text gives fans multiple entry points through literature, lyrics, animation, covers, and adaptation culture.", definingMoments: ["Yoru ni Kakeru carrying the novel-into-music concept to a mass audience", "Idol opening Oshi no Ko with a deliberately unstable portrait of celebrity", "The Book physical releases presenting songs as bound story collections"], officialUrl: "https://www.yoasobi-music.jp/", sourceNote: "GWI contributes cohort-level cross-media context, not profile-specific Gen Alpha demographics for YOASOBI.", video: { youtubeId: "ZRtdQ81jPUQ", title: "Idol (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "bad-bunny", name: "Bad Bunny", pronouns: "he", role: "Spanish-language world builder", summary: "Puerto Rican references, genre mobility, and visual risk make regional specificity the source of global-scale pop authority.", influenceMechanism: "Local slang and place-based storytelling travel through hooks, fashion, wrestling appearances, and event-scale homecoming rituals.", definingMoments: ["Un Verano Sin Ti sustaining a beach-season world across an entire album", "The WWE Backlash match in San Juan merging music celebrity with wrestling fandom", "Debi Tirar Mas Fotos centering Puerto Rican memory before a residency on the island"], officialUrl: "https://www.badbunny.com/", sourceNote: "Cohort-level GWI listening data situates Latin music discovery; it does not establish Bad Bunny's child audience.", video: { youtubeId: "v9T_MGfzq7I", title: "DtMF (Official Visualizer)", embeddable: true } }),
  artistCoverage({ id: "karol-g", name: "KAROL G", pronouns: "she", role: "Latina arena community builder", summary: "Reggaeton confidence, vulnerable breakup songs, and bright visual codes turn personal recovery into a mass singalong identity.", influenceMechanism: "Direct slogans and emotionally sequenced albums let listeners move between self-affirmation, friendship ritual, and concert-scale catharsis.", definingMoments: ["Tusa becoming an international collaboration about public heartbreak", "BICHOTA reclaiming a term of power as a fan-facing confidence marker", "Manana Sera Bonito becoming the first Spanish-language album by a woman to top the Billboard 200"], officialUrl: "https://www.karolgmusic.com/", sourceNote: "GWI's cohort-level cultural context supports a Latin pop lens, not KAROL G profile-specific youth measurement.", video: { youtubeId: "tbneQDc2H3I", title: "Tusa (Official Video)", embeddable: true } }),
  artistCoverage({ id: "peso-pluma", name: "Peso Pluma", pronouns: "he", role: "Corridos crossover disruptor", summary: "A nasal vocal signature, requinto-led arrangements, and frequent collaborations pull regional Mexican music into global streaming conversation.", influenceMechanism: "Distinct instrumental openings and crew-based features create recognition quickly, encouraging discovery across artists and subgenres.", definingMoments: ["Ella Baila Sola becoming the first regional Mexican song to top the Billboard Hot 100", "GENESIS consolidating corridos tumbados within a full-album statement", "A Coachella main-stage set placing corrido history inside a global festival frame"], officialUrl: "https://pesopluma.com/", sourceNote: "Cohort-level GWI research frames cross-border discovery; it is not a demographic profile of Peso Pluma listeners.", video: { youtubeId: "lZiaYpD9ZrI", title: "Ella Baila Sola (Official Video)", embeddable: true } }),
  artistCoverage({ id: "fuerza-regida", name: "Fuerza Regida", pronouns: "they", role: "Streetwear-corrido crew", summary: "Band chemistry, irreverent styling, and hybrid production connect corrido instrumentation with a Southern California youth-culture stance.", influenceMechanism: "Collective persona and slang-heavy hooks make the group feel like a social unit whose sound, clothes, and humor travel together.", definingMoments: ["Del Barrio Hasta Aqui framing San Bernardino roots as the group's origin story", "Sabor Fresa sharpening a luxury-coded corrido sound", "Pero No Te Enamores introducing Jersey-corrido production as a named hybrid"], officialUrl: "https://fuerzaregida.com/", sourceNote: "GWI offers cohort-level context for genre mixing, not profile-specific audience evidence for Fuerza Regida.", video: { youtubeId: "r83dUG7YbKA", title: "Sabor Fresa (Official Video)", embeddable: true } }),
  artistCoverage({ id: "burna-boy", name: "Burna Boy", pronouns: "he", role: "Afrofusion scale setter", summary: "Nigerian rhythmic foundations, dancehall phrasing, and commanding live vocals position African pop as arena music without flattening its roots.", influenceMechanism: "A self-defined genre label gives listeners a map across influences while festival performances translate recordings into collective release.", definingMoments: ["Ye turning a misdirected search surge into wider international discovery", "African Giant naming both an album thesis and a claim for continental scale", "Last Last transforming heartbreak through a Toni Braxton sample and communal hook"], officialUrl: "https://www.onaspaceship.com/", sourceNote: "Cohort-level global music findings contextualize Afrofusion discovery; they are not Burna Boy child-audience analytics.", video: { youtubeId: "421w1j87fEM", title: "Last Last (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "rema", name: "Rema", pronouns: "he", role: "Afrobeats melodic futurist", summary: "Elastic melodies, spare rhythmic loops, and an alien-symbol visual language make Nigerian pop feel both immediate and speculative.", influenceMechanism: "Short vocal phrases cross language barriers easily, while remixes and dance clips extend a song without erasing its original identity.", definingMoments: ["Dumebi introducing Rema's melodic phrasing and masked visual motif", "Calm Down gaining a second global life through the Selena Gomez remix", "HEIS pushing toward a rougher, deliberately less polished sonic direction"], officialUrl: "https://heisrema.com/", sourceNote: "GWI's cohort-level discovery research supplies context around Afrobeats; it does not identify Rema's Gen Alpha share.", video: { youtubeId: "CQLsdm1ZYAw", title: "Calm Down (Official Music Video)", embeddable: true } }),
  artistCoverage({ id: "tems", name: "Tems", pronouns: "she", role: "Alt-R&B atmosphere shaper", summary: "A low, textured voice and patient songwriting bring stillness and self-possession into collaborations, film music, and solo R&B.", influenceMechanism: "Unhurried hooks create emotional space that works in intimate listening while high-profile features route audiences back to her catalog.", definingMoments: ["Essence carrying Tems's vocal presence into a global Wizkid crossover", "Free Mind growing from album track into a long-running international hit", "Me & U foregrounding spiritual self-direction in her first self-directed video"], officialUrl: "https://www.leadingvibe.com/", sourceNote: "Cohort-level GWI mood and music context can frame Tems's resonance, not her profile-specific child demographics.", video: { youtubeId: "1JltlSJH5bY", title: "Me & U (Official Video)", embeddable: true } }),
  artistCoverage({ id: "shakira", name: "Shakira", pronouns: "she", role: "Dance-language bridge", summary: "Distinctive vocals, hip-led choreography, and multilingual songwriting connect Latin pop, global sporting events, and family recognition.", influenceMechanism: "Movement offers a route into songs before translation, allowing performances to circulate through lessons, celebrations, and imitation.", definingMoments: ["Hips Don't Lie pairing a signature movement vocabulary with a worldwide crossover", "Waka Waka becoming the musical ritual of the 2010 FIFA World Cup", "BZRP Music Sessions #53 turning a breakup narrative into a quoted Spanish-language event"], officialUrl: "https://www.shakira.com/", sourceNote: "GWI provides cohort-level global entertainment context; it does not measure Shakira's profile-specific youth audience.", video: { youtubeId: "pRpeEdMmmQ0", title: "Waka Waka (Official 2010 FIFA World Cup Song)", embeddable: true } }),
  artistCoverage({ id: "sza", name: "SZA", pronouns: "she", role: "Interior-monologue songwriter", summary: "Nonlinear melodies and sharply specific admissions turn ambivalence, jealousy, and self-protection into language listeners can borrow.", influenceMechanism: "Emotionally messy lines function as captions and conversation starters while cinematic videos externalize competing inner voices.", definingMoments: ["Ctrl sustaining a coming-of-age conversation well beyond its release year", "Kill Bill converting revenge fantasy into a chart-leading singalong", "SOS using a vast genre range and sea imagery to stage emotional survival"], officialUrl: "https://www.szactrl.com/", sourceNote: "Cohort-level GWI findings contextualize confessional R&B, not profile-specific age data for SZA.", video: { youtubeId: "MSRcC626prw", title: "Kill Bill (Official Video)", embeddable: true } }),
  artistCoverage({ id: "the-weeknd", name: "The Weeknd", pronouns: "he", role: "Cinematic pop-universe builder", summary: "Recurring characters, nocturnal synths, and consequence-driven videos connect radio hooks to a darker serialized screen world.", influenceMechanism: "Visual continuity encourages theory-making across albums, while instantly legible production carries songs into games, sports, and short clips.", definingMoments: ["Blinding Lights reviving an eighties synth pulse through a record-setting chart run", "The After Hours red-suit character linking videos, awards appearances, and live staging", "The Super Bowl LV halftime show turning a mirror maze into a meme-ready camera sequence"], officialUrl: "https://www.theweeknd.com/", sourceNote: "GWI's cohort-level media research helps frame cross-platform circulation; it is not The Weeknd audience segmentation.", video: { youtubeId: "4NRXx6U8ABQ", title: "Blinding Lights (Official Video)", embeddable: true } }),

  athleteCoverage({ id: "angel-reese", name: "Angel Reese", pronouns: "she", role: "Basketball-fashion self-branding leader", summary: "Rebounding intensity, visible confidence, and style entrepreneurship make a young pro career legible beyond the box score.", influenceMechanism: "Competitive clips and self-authored branding let fans follow performance, fashion, and business as connected expressions of ambition.", definingMoments: ["The 2023 LSU national title run placing her celebrations at the center of sports debate", "A WNBA-record double-double streak during her Chicago rookie season", "The Reebok partnership growing from footwear endorsement into a signature-shoe pathway"], officialUrl: "https://www.wnba.com/player/1642291/angel-reese", sourceNote: "AP supplies cohort-level context on youth-facing sports media; it is not Angel Reese audience measurement.", mediaFallback: "No durable rights-cleared portrait is stored; use the official WNBA profile for current Angel Reese media." }),
  athleteCoverage({ id: "aja-wilson", name: "A'ja Wilson", pronouns: "she", role: "Two-way basketball standard bearer", summary: "Scoring craft, rim protection, and sustained leadership make excellence visible as repetition rather than a single viral highlight.", influenceMechanism: "Championship evidence and direct public advocacy connect technical mastery with a broader model of women claiming space in sport.", definingMoments: ["Leading South Carolina to the 2017 NCAA championship", "Anchoring consecutive Las Vegas Aces WNBA titles in 2022 and 2023", "Launching the A'One as Nike's first signature basketball shoe for a Black woman in decades"], officialUrl: "https://www.wnba.com/player//1628932/aja-wilson", sourceNote: "Cohort-level AP reporting frames women's-sports visibility; it does not establish A'ja Wilson child demographics.", mediaFallback: "A rights-cleared local action image is not available; the official WNBA page remains the visual reference for A'ja Wilson." }),
  athleteCoverage({ id: "trinity-rodman", name: "Trinity Rodman", pronouns: "she", role: "Expressive wing-play accelerator", summary: "Explosive one-on-one attacking and candid personality connect elite women's football with a visibly individual style of play.", influenceMechanism: "Direct runs and inventive finishes make strong highlight units, while off-field openness gives the athlete identity dimension beyond results.", definingMoments: ["Becoming the youngest player drafted into the NWSL at eighteen", "Winning the 2021 NWSL championship with the Washington Spirit", "Scoring three times during the United States' gold-medal run at the Paris Olympics"], officialUrl: "https://washingtonspirit.com/team-member/trinity-rodman/", sourceNote: "AP's cohort-level sports-culture reporting contextualizes football discovery, not Trinity Rodman's profile-specific audience.", mediaFallback: "No stable licensed portrait is bundled; Trinity Rodman's official Washington Spirit profile provides current imagery." }),
  athleteCoverage({ id: "coco-gauff", name: "Coco Gauff", pronouns: "she", role: "Next-generation tennis composure model", summary: "Early visibility, fast defense, and candid growth through pressure make elite tennis feel like an unfolding development story.", influenceMechanism: "Match turnarounds show problem-solving in public, while her age-relative milestones invite young players to imagine a nearer path to the sport.", definingMoments: ["Defeating Venus Williams at Wimbledon in 2019 as a fifteen-year-old qualifier", "Winning the 2023 US Open singles title after losing the first set", "Serving as a United States flag bearer at the Paris Olympics"], officialUrl: "https://www.cocogauff.com/", sourceNote: "Cohort-level AP material supports tennis as youth culture context; it is not Coco Gauff audience analytics.", mediaFallback: "The profile intentionally defers to Coco Gauff's official site instead of storing an unlicensed portrait." }),
  athleteCoverage({ id: "naomi-osaka", name: "Naomi Osaka", pronouns: "she", role: "Tennis-boundary conversation leader", summary: "Powerful baseline play and public boundary-setting make mental wellbeing part of how sporting professionalism is discussed.", influenceMechanism: "Major-title credibility gives her choices about press, identity, and recovery enough weight to reshape conversations around athlete care.", definingMoments: ["Winning the 2018 US Open for her first major title", "Collecting four hard-court Grand Slam singles championships by 2021", "Withdrawing from the 2021 French Open after declining press conferences for mental-health reasons"], officialUrl: "https://www.naomiosaka.com/", sourceNote: "AP gives cohort-level context for athlete-led media narratives; it does not measure Naomi Osaka's child audience.", mediaFallback: "No reusable local portrait has been licensed; Naomi Osaka's official destination is the intended media source." }),
  athleteCoverage({ id: "rayssa-leal", name: "Rayssa Leal", pronouns: "she", role: "Street-skating joy ambassador", summary: "Technical consistency and an openly joyful competition style make elite street skateboarding feel youthful without diminishing its difficulty.", influenceMechanism: "Compact trick clips travel easily, while visible camaraderie shows competition as a community rather than only a ranking system.", definingMoments: ["A fairy-costume heelflip clip introducing her globally before her professional career", "Winning Olympic street silver in Tokyo at age thirteen", "Taking street bronze in Paris before a home crowd of Brazilian supporters"], officialUrl: "https://www.redbull.com/int-en/athlete/rayssa-leal", sourceNote: "Cohort-level AP sports reporting frames highlight circulation, not profile-specific youth demographics for Rayssa Leal.", mediaFallback: "A licensed local skate image is unavailable; the official Red Bull athlete page supplies current Rayssa Leal media." }),
  athleteCoverage({ id: "lamine-yamal", name: "Lamine Yamal", pronouns: "he", role: "Teen football possibility marker", summary: "Left-footed invention and record-setting senior appearances compress the perceived distance between academy football and the world stage.", influenceMechanism: "Age-relative milestones make every assist and goal a possibility story, amplified through club, national-team, and gaming culture.", definingMoments: ["Becoming FC Barcelona's youngest first-team player in La Liga", "Scoring against France as the youngest player ever to net at a European Championship", "Winning Euro 2024 with Spain and receiving the tournament's Young Player award"], officialUrl: "https://www.fcbarcelona.com/en/football/first-team/players/129404/lamine-yamal", sourceNote: "AP provides cohort-level football-culture context; it is not Lamine Yamal profile-specific audience research.", mediaFallback: "No rights-cleared local match portrait is stored; FC Barcelona's official player page is the media reference." }),
  athleteCoverage({ id: "jude-bellingham", name: "Jude Bellingham", pronouns: "he", role: "Midfield leadership prototype", summary: "Late runs, emotional celebrations, and unusual responsibility at a young age connect tactical work with star presence.", influenceMechanism: "A complete midfield role gives developing players several skills to imitate, while visible leadership makes maturity part of the appeal.", definingMoments: ["Birmingham City retiring his number 22 shirt after his teenage breakthrough", "Captaining Borussia Dortmund while still nineteen", "Winning La Liga and the Champions League in his first Real Madrid season"], officialUrl: "https://www.realmadrid.com/en-US/football/first-team/players/jude-bellingham", sourceNote: "Cohort-level AP sports evidence contextualizes football fandom; it does not segment Jude Bellingham's child audience.", mediaFallback: "The official Real Madrid profile is used for current Jude Bellingham imagery because no licensed local portrait is held." }),
  athleteCoverage({ id: "kylian-mbappe", name: "Kylian Mbappe", pronouns: "he", role: "Explosive football succession icon", summary: "Acceleration, decisive finishing, and early international trophies position speed as both athletic spectacle and generational handoff.", influenceMechanism: "Breakaway highlights require little tactical explanation, allowing a pose, sprint, or finish to circulate across languages and platforms.", definingMoments: ["Scoring in the 2018 World Cup final as France won the tournament", "Completing a hat trick in the 2022 World Cup final", "Joining Real Madrid after seven seasons and a club scoring record at Paris Saint-Germain"], officialUrl: "https://www.realmadrid.com/en-US/football/first-team/players/kylian-mbappe", sourceNote: "AP's cohort-level football reporting frames global visibility, not a profile-specific youth measure for Kylian Mbappe.", mediaFallback: "No licensed action photograph is bundled; Real Madrid's official player destination provides current Mbappe visuals." }),
  athleteCoverage({ id: "shohei-ohtani", name: "Shohei Ohtani", pronouns: "he", role: "Two-way baseball imagination resetter", summary: "Elite pitching and power hitting in one career reopen assumptions about specialization at baseball's highest level.", influenceMechanism: "Rare dual-role performance makes statistical milestones into simple stories of possibility that cross both Japanese and American sports media.", definingMoments: ["Winning unanimous American League MVP awards as a two-way player", "Signing a record ten-year contract with the Los Angeles Dodgers", "Creating Major League Baseball's first 50-home-run, 50-stolen-base season"], officialUrl: "https://www.mlb.com/player/shohei-ohtani-660271", sourceNote: "Cohort-level AP sports context supports cross-market interpretation; it is not Shohei Ohtani audience segmentation.", mediaFallback: "MLB's official player page is the intended current image source; no reusable local Ohtani portrait is included." }),
  athleteCoverage({ id: "stephen-curry", name: "Stephen Curry", pronouns: "he", role: "Range-expanding basketball inventor", summary: "Deep shooting, constant off-ball motion, and playful confidence changed what young players attempt from ordinary courts.", influenceMechanism: "A visible, repeatable skill invites imitation more directly than size-based dominance, connecting practice routines with spectacular outcomes.", definingMoments: ["Breaking the NBA career record for made three-point shots", "Winning four championships with the Golden State Warriors", "Closing the Paris Olympic final with four late three-pointers against France"], officialUrl: "https://www.stephencurry30.com/", sourceNote: "AP supplies cohort-level basketball-media context; it does not provide Stephen Curry child-audience analytics.", mediaFallback: "The profile links to Stephen Curry's official site for current rights-managed imagery rather than storing a local portrait." }),
  athleteCoverage({ id: "erling-haaland", name: "Erling Haaland", pronouns: "he", role: "Power-forward football archetype", summary: "Direct sprinting, physical finishing, and a deliberately understated persona turn goal scoring into a highly recognizable character system.", influenceMechanism: "Repeatable celebrations and startling scoring totals make performance easy to summarize, imitate, and carry into football games.", definingMoments: ["Scoring a Premier League-record 36 goals in his first Manchester City season", "Winning the 2023 treble of league, FA Cup, and Champions League", "Making the seated meditation pose a signature celebration across pitches and game avatars"], officialUrl: "https://www.mancity.com/players/erling-haaland", sourceNote: "Cohort-level AP football context explains highlight culture; it is not Erling Haaland profile-specific audience evidence.", mediaFallback: "No licensed local match photo is stored; Manchester City's official player page supplies Haaland imagery." }),

  bespokeCoverage({ id: "paw-patrol", name: "PAW Patrol", pronouns: "they", type: "screen-ip", role: "Rescue-roleplay operating system", category: "Preschool animation, teamwork, and licensed play", summary: "Color-coded pups, vehicles, and repeatable rescue beats turn community helping into a simple assignment-based play pattern.", topics: ["teamwork", "vehicles", "pretend play"], formats: ["animated episode", "feature film", "toy play"], platforms: ["Paramount+", "YouTube", "retail"], audienceSegments: ["rescue-roleplay households", "vehicle-play fans", "teamwork storytellers"], influenceMechanism: "Each pup owns a tool and specialty, giving group play clear roles while vehicles move stories from screen into physical setups.", definingMoments: ["No job is too big becoming the verbal cue for each mission structure", "The Mighty Pups power-up widening rescue play into superhero fantasy", "Lookout towers, vehicles, live shows, and films building a connected product world"], relatedEntities: [{ id: "bluey", label: "Bluey", kind: "culture-shaper", href: "/influencers/bluey" }], insightIds: ["play-family-coplay", "media-coviewing"], officialUrl: "https://www.pawpatrol.com/", sourceId: "common-sense-census-2025", sourceNote: "Common Sense supplies cohort-level preschool media context, not a title-specific PAW Patrol audience count.", mediaFallback: "The official PAW Patrol destination is used because no reusable local key art is stored.", indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 3 } }),
  bespokeCoverage({ id: "inside-out", name: "Inside Out", pronouns: "they", type: "screen-ip", role: "Emotion-labeling story toolkit", category: "Family animation, feelings, and growing up", summary: "Personified emotions turn internal conflict into characters families can name, debate, and use when discussing change.", topics: ["emotions", "family", "identity"], formats: ["animated film", "character short", "licensed play"], platforms: ["Disney+", "YouTube", "cinema"], audienceSegments: ["family co-viewers", "emotion-language learners", "animation discussion groups"], influenceMechanism: "A color-coded emotional cast gives abstract feelings faces and jobs, making reflection easier to externalize without reducing complexity.", definingMoments: ["Joy and Sadness learning that mixed feelings can carry the same memory", "Bing Bong's disappearance giving loss a concrete imaginative form", "Anxiety arriving in Inside Out 2 as Riley enters a more socially complex stage"], relatedEntities: [{ id: "wednesday", label: "Wednesday", kind: "culture-shaper", href: "/influencers/wednesday" }], insightIds: ["time-age-change", "media-coviewing"], officialUrl: "https://movies.disney.com/inside-out", sourceId: "common-sense-census-2025", sourceNote: "Cohort-level family co-viewing research contextualizes discussion, not Inside Out child-viewer demographics.", mediaFallback: "Disney's official film page remains the rights-managed image source for Inside Out.", indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
  bespokeCoverage({ id: "sonic-the-hedgehog", name: "Sonic the Hedgehog", pronouns: "he", type: "franchise", role: "Speed-and-attitude game mascot", category: "Games, cinema, animation, and collecting", summary: "A readable silhouette, momentum-based play, and a confident comic voice keep one mascot adaptable across generations and media.", topics: ["gaming", "speed", "friendship"], formats: ["video game", "feature film", "animation"], platforms: ["console", "cinema", "YouTube"], audienceSegments: ["platform-game players", "family cinema audiences", "mascot-franchise collectors"], influenceMechanism: "Speed supplies immediate kinesthetic appeal while rings, rivals, and transformations form a vocabulary that survives each format shift.", definingMoments: ["Green Hill Zone establishing momentum and ring collecting as instant franchise grammar", "Super Sonic turning Chaos Emerald mastery into a recurring power fantasy", "The live-action films building a family-cinema ensemble around Sonic, Tails, and Knuckles"], relatedEntities: [{ id: "minecraft-franchise", label: "Minecraft", kind: "culture-shaper", href: "/influencers/minecraft-franchise" }], insightIds: ["play-status-contribution", "media-properties-travel"], officialUrl: "https://www.sonicthehedgehog.com/", sourceId: "pew-teens-video-games-2024", sourceNote: "Pew offers cohort-level gaming context; it does not report a Sonic-specific Gen Alpha audience.", mediaFallback: "SEGA's official Sonic destination provides current artwork; no local licensed key art is included.", indicatorTiers: { reach: 4, participation: 4, commercialPull: 3, audienceCenter: 3 } }),
  bespokeCoverage({ id: "lego", name: "LEGO", pronouns: "they", type: "franchise", role: "Open-ended construction language", category: "Building play, games, film, and learning", summary: "Interlocking bricks create a shared design grammar that can absorb licensed worlds without surrendering the builder's authorship.", topics: ["creation", "learning", "collecting"], formats: ["construction play", "video game", "animation"], platforms: ["retail", "YouTube", "console"], audienceSegments: ["open-ended builders", "making-centered households", "classroom creators"], influenceMechanism: "A stable physical system supports invention, instruction, display, destruction, and rebuilding across skill levels and themes.", definingMoments: ["The minifigure making characters interchangeable across home-built settings", "LEGO Ideas giving fan designs a formal route toward retail sets", "The LEGO Movie framing rule-following and improvisation as competing creative modes"], relatedEntities: [{ id: "minecraft-franchise", label: "Minecraft", kind: "culture-shaper", href: "/influencers/minecraft-franchise" }], insightIds: ["play-making-interface", "learning-creation-skills"], officialUrl: "https://www.lego.com/", sourceId: "walton-creation-gaming-2024", sourceNote: "The Walton study gives cohort-level creation context; it is not a LEGO profile-specific audience census.", mediaFallback: "LEGO's official site is the current source for protected product imagery.", indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 4 } }),
  bespokeCoverage({ id: "spider-verse", name: "Spider-Verse", pronouns: "they", type: "screen-ip", role: "Multiverse identity animation benchmark", category: "Animated film, comics, music, and style", summary: "Layered comic textures and multiple Spider identities make difference itself the visual and narrative engine of superhero belonging.", topics: ["identity", "animation", "heroism"], formats: ["animated film", "soundtrack", "fan art"], platforms: ["cinema", "YouTube", "streaming"], audienceSegments: ["animation craft fans", "superhero remixers", "identity-focused viewers"], influenceMechanism: "Every universe carries a different design system, giving viewers permission to remix the hero role through drawing, costume, music, and motion.", definingMoments: ["Miles Morales's leap of faith synchronizing character growth with a flipped city image", "Gwen Stacy's watercolor world changing color with her emotional state", "Across the Spider-Verse assembling hundreds of visual variants without treating one as default"], relatedEntities: [{ id: "inside-out", label: "Inside Out", kind: "culture-shaper", href: "/influencers/inside-out" }], insightIds: ["play-avatars-identity", "media-properties-travel"], officialUrl: "https://www.sonypictures.com/movies/spidermanacrossthespiderverse", sourceId: "gwi-alpha-unfiltered", sourceNote: "GWI contributes cohort-level superhero and entertainment context, not Spider-Verse audience measurement.", mediaFallback: "Sony Pictures' official film page is the rights-managed source for Spider-Verse key art.", indicatorTiers: { reach: 4, participation: 4, commercialPull: 4, audienceCenter: 2 } }),
];

export const cultureShapers: CultureShaper[] = [
  ...migratedCreators,
  ...additionalShapers,
  ...coverageShapers.map((shaper) => "indicators" in shaper ? shaper : bespokeCoverage(shaper)),
];

export function getCultureShaper(id: string): CultureShaper | undefined {
  return cultureShapers.find((shaper) => shaper.id === id);
}

export const featuredCultureShapers = cultureShapers.filter((shaper) => shaper.featured);
