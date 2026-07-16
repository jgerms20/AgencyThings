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

type CoverageSeed = readonly [
  id: string,
  name: string,
  pronouns: CultureShaperPronouns,
  type: CultureShaperType,
  officialUrl: string,
];

function coverageShaper([id, name, pronouns, type, officialUrl]: CoverageSeed): CultureShaper {
  const seed = { id, name, pronouns, type, officialUrl };
  const isArtist = seed.type === "artist";
  const isAthlete = seed.type === "athlete";
  const role = isArtist
    ? "Music and fandom reference point"
    : isAthlete
      ? "Sport and performance reference point"
      : "Screen and franchise reference point";
  const category = isArtist
    ? "Music and youth culture"
    : isAthlete
      ? "Sport and youth culture"
      : "Family entertainment and fandom";
  const topics = isArtist ? ["music", "fandom"] : isAthlete ? ["competition", "sports"] : ["fandom", "storytelling"];
  const formats = isArtist ? ["song", "live performance"] : isAthlete ? ["highlight", "live competition"] : ["screen story", "licensed play"];
  const platforms = isArtist ? ["Spotify", "YouTube"] : isAthlete ? ["YouTube", "Instagram"] : ["YouTube", "Streaming"];
  const audienceSegments = ["Audience not publicly segmented for Gen Alpha"];
  const relation = isArtist
    ? { id: "olivia-rodrigo", label: "Olivia Rodrigo", kind: "culture-shaper" as const, href: "/influencers/olivia-rodrigo" }
    : isAthlete
      ? { id: "caitlin-clark", label: "Caitlin Clark", kind: "culture-shaper" as const, href: "/influencers/caitlin-clark" }
      : { id: "bluey", label: "Bluey", kind: "culture-shaper" as const, href: "/influencers/bluey" };

  return additional({
    ...seed,
    role,
    category,
    summary: `${seed.name} is included as a recognisable reference point whose work travels through media, conversation, and participatory fan culture.`,
    topics,
    formats,
    platforms,
    audienceSegments,
    audience: {
      center: "Audience not publicly segmented for Gen Alpha",
      broader: "Cohort-level cultural context, not profile-specific audience measurement",
      ageRange: "Not publicly segmented",
      confidence: "low",
      confidenceRationale: "Cohort-level context does not establish a profile-specific Gen Alpha audience by age or demographic.",
    },
    influenceMechanism: `${seed.name} offers a shared set of references that can move between viewing, listening, play, conversation, and fan expression.`,
    definingMoments: [
      "A recognisable public work or performance",
      "Fan conversation and social circulation",
      "Licensed, live, or platform extensions",
    ],
    relatedEntities: [relation],
    insightIds: ["media-repeatable-formats", sharedMediaInsight],
    sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"],
    sourceNotes: [
      { sourceId: "gwi-alpha-unfiltered", note: `GWI provides cohort-level Gen Alpha interest context for ${seed.name}; it does not measure this profile's audience directly.` },
      { sourceId: "pew-teens-social-2024", note: `Pew provides cohort-level platform context for ${seed.name}; it does not directly establish title-specific child demographics.` },
    ],
    videos: [],
    featured: false,
    indicatorTiers: { reach: 2, participation: 2, commercialPull: 2, audienceCenter: 1 },
  });
}

const additionalShapers: CultureShaper[] = [
  additional({ id: "olivia-rodrigo", name: "Olivia Rodrigo", pronouns: "she", type: "artist", role: "Confessional pop reference point", category: "Music and youth identity", summary: "Songwriting about first heartbreak, anger, and self-definition gives older Gen Alpha a vivid vocabulary for emotional transition.", topics: ["music", "identity", "relationships"], formats: ["song", "music video", "arena tour"], platforms: ["Spotify", "YouTube", "TikTok"], audienceSegments: ["girls", "music fans", "older Gen Alpha"], audience: { center: "Ages 10-17, especially girls and young music fans", broader: "Families and cross-generational pop audiences", ageRange: "10-17", confidence: "medium", confidenceRationale: "music themes, social circulation, and adjacent teen audience research align, while private listener analytics are unavailable." }, influenceMechanism: "Emotionally precise songs become captions, covers, conversation prompts, and shared milestone soundtracks.", definingMoments: ["SOUR and GUTS becoming youth-pop reference albums", "drivers license moving from intimate song to participatory social format", "Tour, vinyl, merchandise, and film extensions"], relatedEntities: [{ id: "sabrina-carpenter", label: "Sabrina Carpenter", kind: "culture-shaper", href: "/influencers/sabrina-carpenter" }], relatedSpaceIds: ["youtube", "tiktok"], insightIds: ["media-repeatable-formats", sharedMediaInsight], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], sourceNotes: [{ sourceId: "gwi-alpha-unfiltered", note: "GWI supplies youth-interest and media context; album and tour moments are checked against Rodrigo's official destination." }, { sourceId: "pew-teens-social-2024", note: "Pew provides adjacent evidence for teen platform circulation, not artist-specific audience measurement." }], officialUrl: "https://www.oliviarodrigo.com/", videos: [{ youtubeId: "ZmDBbnmKpqQ", title: "drivers license (Official Video)", embeddable: true }], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
  additional({ id: "sabrina-carpenter", name: "Sabrina Carpenter", pronouns: "she", type: "artist", role: "Repeatable pop-format maker", category: "Music, humor, and style", summary: "Compact hooks, visual wit, fashion, and performance details turn pop releases into formats that travel through clips and imitation.", topics: ["music", "fashion", "humor"], formats: ["song", "music video", "live performance"], platforms: ["Spotify", "YouTube", "TikTok"], audienceSegments: ["girls", "music fans", "older Gen Alpha"], audience: { center: "Ages 10-17, especially girls and pop audiences", broader: "Young adults and mainstream pop listeners", ageRange: "10-17", confidence: "medium", confidenceRationale: "format signals and adjacent youth-platform research support the range without first-party demographics." }, influenceMechanism: "A recognizable lyrical and visual grammar makes each release easy to quote, recreate, and carry into style culture.", definingMoments: ["Espresso becoming a cross-platform pop phrase", "Live outros changing by city and rewarding repeat viewing", "Short n' Sweet touring, physical releases, and merchandise"], relatedEntities: [{ id: "olivia-rodrigo", label: "Olivia Rodrigo", kind: "culture-shaper", href: "/influencers/olivia-rodrigo" }], relatedSpaceIds: ["youtube", "tiktok"], insightIds: ["media-repeatable-formats", "media-creators-templates"], sourceIds: ["gwi-alpha-unfiltered", "pew-teens-social-2024"], sourceNotes: [{ sourceId: "gwi-alpha-unfiltered", note: "GWI frames music and youth-interest context; release details come from Carpenter's official destination." }, { sourceId: "pew-teens-social-2024", note: "Pew supports the adjacent platform context in which clips circulate, not a claim about Carpenter's exact audience." }], officialUrl: "https://www.sabrinacarpenter.com/", videos: [{ youtubeId: "eVli-tstM5E", title: "Espresso (Official Video)", embeddable: true }], featured: false, indicatorTiers: { reach: 4, participation: 3, commercialPull: 4, audienceCenter: 3 } }),
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

const coverageShapers: readonly CoverageSeed[] = [
  ["taylor-swift", "Taylor Swift", "she", "artist", "https://www.taylorswift.com/"],
  ["billie-eilish", "Billie Eilish", "she", "artist", "https://www.billieeilish.com/"],
  ["chappell-roan", "Chappell Roan", "she", "artist", "https://www.iamchappellroan.com/"],
  ["ariana-grande", "Ariana Grande", "she", "artist", "https://www.arianagrande.com/"],
  ["dua-lipa", "Dua Lipa", "she", "artist", "https://www.dualipa.com/"],
  ["sza", "SZA", "she", "artist", "https://www.szactrl.com/"],
  ["doja-cat", "Doja Cat", "she", "artist", "https://www.dojacat.com/"],
  ["gracie-abrams", "Gracie Abrams", "she", "artist", "https://www.gracieabrams.com/"],
  ["charli-xcx", "Charli xcx", "she", "artist", "https://www.charlixcx.com/"],
  ["benson-boone", "Benson Boone", "he", "artist", "https://www.bensonboone.com/"],
  ["tate-mcrae", "Tate McRae", "she", "artist", "https://www.tatemcrae.com/"],
  ["the-weeknd", "The Weeknd", "he", "artist", "https://www.theweeknd.com/"],
  ["bruno-mars", "Bruno Mars", "he", "artist", "https://www.brunomars.com/"],
  ["bad-bunny", "Bad Bunny", "he", "artist", "https://www.badbunny.com/"],
  ["karol-g", "KAROL G", "she", "artist", "https://www.karolgmusic.com/"],
  ["feid", "Feid", "he", "artist", "https://www.feidofficial.com/"],
  ["tyla", "Tyla", "she", "artist", "https://www.tylaworld.com/"],
  ["pinkpantheress", "PinkPantheress", "she", "artist", "https://www.pantheress.pink/"],
  ["beabadoobee", "beabadoobee", "she", "artist", "https://www.beabadoobee.com/"],
  ["newjeans", "NewJeans", "they", "artist", "https://www.newjeans.kr/"],
  ["bts", "BTS", "they", "artist", "https://ibighit.com/bts/eng/"],
  ["stray-kids", "Stray Kids", "they", "artist", "https://straykids.jype.com/"],
  ["blackpink", "BLACKPINK", "they", "artist", "https://www.blackpinkmusic.com/"],
  ["lisa", "LISA", "she", "artist", "https://www.lalisaofficial.com/"],
  ["marshmello", "Marshmello", "he", "artist", "https://www.marshmellomusic.com/"],
  ["alex-warren", "Alex Warren", "he", "artist", "https://www.alexwarrenofficial.com/"],
  ["laufey", "Laufey", "she", "artist", "https://www.laufeymusic.com/"],
  ["kendrick-lamar", "Kendrick Lamar", "he", "artist", "https://oklama.com/"],
  ["lebron-james", "LeBron James", "he", "athlete", "https://www.lebronjames.com/"],
  ["lionel-messi", "Lionel Messi", "he", "athlete", "https://messi.com/"],
  ["vinicius-junior", "Vinicius Junior", "he", "athlete", "https://vinijr.com/"],
  ["coco-gauff", "Coco Gauff", "she", "athlete", "https://www.cocogauff.com/"],
  ["stephen-curry", "Stephen Curry", "he", "athlete", "https://www.stephencurry30.com/"],
  ["naomi-osaka", "Naomi Osaka", "she", "athlete", "https://www.naomiosaka.com/"],
  ["ilona-maher", "Ilona Maher", "she", "athlete", "https://www.ilonamaher.com/"],
  ["jude-bellingham", "Jude Bellingham", "he", "athlete", "https://www.realmadrid.com/en-US/football/first-team/players/jude-bellingham"],
  ["aja-wilson", "A'ja Wilson", "she", "athlete", "https://www.wnba.com/player/203469/a-ja-wilson"],
  ["paw-patrol", "PAW Patrol", "they", "screen-ip", "https://www.pawpatrol.com/"],
  ["inside-out", "Inside Out", "they", "screen-ip", "https://movies.disney.com/inside-out"],
  ["sonic-the-hedgehog", "Sonic the Hedgehog", "he", "franchise", "https://www.sonicthehedgehog.com/"],
  ["lego", "LEGO", "they", "franchise", "https://www.lego.com/"],
  ["spider-verse", "Spider-Verse", "they", "screen-ip", "https://www.sonypictures.com/movies/spider-man-acrossthespiderverse"],
];

export const cultureShapers: CultureShaper[] = [
  ...migratedCreators,
  ...additionalShapers,
  ...coverageShapers.map(coverageShaper),
];

export function getCultureShaper(id: string): CultureShaper | undefined {
  return cultureShapers.find((shaper) => shaper.id === id);
}

export const featuredCultureShapers = cultureShapers.filter((shaper) => shaper.featured);
