export const spaceCategories = [
  "Games & Participatory Worlds",
  "Video, Streaming & Live Media",
  "Social, Messaging & Private Networks",
  "Music & Audio",
  "Learning, Search & Making",
  "Offline Culture",
] as const;

export const spaceEnvironments = ["digital", "physical", "hybrid"] as const;
export const spaceAgeBands = ["3-5", "6-9", "10-12", "13-17"] as const;

export type SpaceCategory = (typeof spaceCategories)[number];
export type SpaceEnvironment = (typeof spaceEnvironments)[number];
export type SpaceAgeBand = (typeof spaceAgeBands)[number];
export type SpaceEvidenceStatus = "evidence-backed" | "watchlist";
export type SpaceTone = "acid" | "cyan" | "coral" | "violet";

export type Space = {
  id: string;
  name: string;
  category: SpaceCategory;
  environment: SpaceEnvironment;
  ageContext: string;
  ageBands: SpaceAgeBand[];
  whatItIs: string;
  whyTheyGo: string;
  whatHappens: string;
  whoIsThere: string;
  evidenceStatus: SpaceEvidenceStatus;
  evidenceSummary: string;
  sourceIds: string[];
  evidenceIds: string[];
  strategyRelevance: string;
  safetyCaveat: string;
  relatedInsightIds: string[];
  relatedCultureShaperIds: string[];
  tone: SpaceTone;
};

type EvidenceLink = Pick<Space, "evidenceStatus" | "evidenceSummary" | "sourceIds" | "evidenceIds">;
type SpaceSeed = Omit<Space, "tone" | keyof EvidenceLink> & { evidence: EvidenceLink };

const backed = (evidenceSummary: string, sourceIds: string[], evidenceIds: string[]): EvidenceLink => ({
  evidenceStatus: "evidence-backed",
  evidenceSummary,
  sourceIds,
  evidenceIds,
});

const watch = (evidenceSummary: string): EvidenceLink => ({
  evidenceStatus: "watchlist",
  evidenceSummary: `Editorial watchlist: ${evidenceSummary}`,
  sourceIds: [],
  evidenceIds: [],
});

const tones: SpaceTone[] = ["acid", "cyan", "coral", "violet"];
const allAges: SpaceAgeBand[] = ["3-5", "6-9", "10-12", "13-17"];
const schoolAge: SpaceAgeBand[] = ["6-9", "10-12", "13-17"];
const older: SpaceAgeBand[] = ["10-12", "13-17"];

const seeds: SpaceSeed[] = [
  {
    id: "roblox", name: "Roblox", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Core ages 7-14; younger use needs active adult setup.", ageBands: schoolAge,
    whatItIs: "A platform of creator-built multiplayer worlds joined through one avatar identity.", whyTheyGo: "Friends, novelty, collection, and the promise of always finding another world.", whatHappens: "Players explore, role-play, compete, build, trade attention, and follow creator-led trends.", whoIsThere: "Children, friend groups, experience developers, creators, brands, and safety moderators.",
    evidence: backed("Research directly connects ages 5-13 with making and learning in Roblox, while platform data documents search and avatar behavior.", ["walton-creation-gaming-2024", "roblox-search-style-trends-2025"], ["evidence-play-making-interface-1", "evidence-play-avatars-identity-1"]),
    strategyRelevance: "Offer a useful role, tool, or repeatable activity instead of a static branded room.", safetyCaveat: "Chat, spending, discovery, and user-made content require age-aware defaults and visible parental controls.", relatedInsightIds: ["play-making-interface", "play-avatars-identity"], relatedCultureShaperIds: ["aphmau", "kreekcraft", "itsfunneh", "lankybox"],
  },
  {
    id: "minecraft", name: "Minecraft", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Strong across ages 6-14, with play modes changing by skill.", ageBands: schoolAge,
    whatItIs: "An open-ended building, survival, exploration, and multiplayer game ecosystem.", whyTheyGo: "It gives imagination durable rules and lets friends make something they can revisit.", whatHappens: "Children gather resources, build worlds, solve problems, tell stories, and learn from tutorials.", whoIsThere: "Solo builders, sibling groups, school clubs, server communities, educators, and video creators.",
    evidence: backed("A U.S. study of ages 5-13 identifies Minecraft as a creation-gaming environment tied to creativity, problem-solving, and self-directed learning.", ["walton-creation-gaming-2024"], ["evidence-learning-creation-skills-1", "evidence-learning-multimodal-2"]),
    strategyRelevance: "Supply flexible materials or a meaningful challenge that rewards invention across many valid outcomes.", safetyCaveat: "Public servers, chat, mods, and downloads vary widely; private play and trusted sources reduce exposure.", relatedInsightIds: ["learning-creation-skills", "play-making-interface"], relatedCultureShaperIds: ["aphmau", "unspeakable", "preston"],
  },
  {
    id: "fortnite", name: "Fortnite", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Most relevant to ages 10-17; ratings and modes differ.", ageBands: older,
    whatItIs: "A competitive game, social rendezvous, creator platform, and live-event venue.", whyTheyGo: "Coordinated sessions turn competition into dependable time with friends and shared culture.", whatHappens: "Squads compete, talk, visit creator modes, collect cosmetics, and attend timed spectacles.", whoIsThere: "Friend squads, competitive players, map makers, entertainers, sports properties, and brands.",
    evidence: watch("the roster role is strategically important, but current canonical research supports social gaming generally rather than Fortnite-specific Gen Alpha behavior."),
    strategyRelevance: "Timed participation and creator-made modes fit better than passive placement or one-off spectacle.", safetyCaveat: "Voice chat, purchases, combat themes, and public matchmaking need guardian controls and age checks.", relatedInsightIds: ["play-competition-performance", "play-friendship-travels"], relatedCultureShaperIds: ["ishowspeed"],
  },
  {
    id: "nintendo-switch", name: "Nintendo Switch", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Family and child use spans ages 6-17, depending on title.", ageBands: schoolAge,
    whatItIs: "A portable and television-connected console organized around games, households, and local play.", whyTheyGo: "Its familiar characters and flexible screen modes make play easy to share at home.", whatHappens: "Players move between solo adventures, couch multiplayer, online matches, and family sessions.", whoIsThere: "Children, siblings, parents, visiting friends, game publishers, and franchise communities.",
    evidence: watch("the canonical graph has household co-play evidence, but no qualifying Switch-specific youth study."),
    strategyRelevance: "Think in household rituals, shared challenges, and recognizable properties rather than social-feed mechanics.", safetyCaveat: "Online communication and purchases still need limits even when the console feels family-oriented.", relatedInsightIds: ["play-family-coplay", "media-properties-travel"], relatedCultureShaperIds: [],
  },
  {
    id: "mario", name: "Mario", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Accessible from early childhood through family and older-player nostalgia.", ageBands: allAges,
    whatItIs: "A game and entertainment franchise built around platforming, racing, parties, and characters.", whyTheyGo: "Clear rules, expressive characters, and quick shared rounds lower the barrier to joining.", whatHappens: "Families race, cooperate, compete in mini-games, watch films, and recognize franchise cues elsewhere.", whoIsThere: "Young beginners, siblings, parents, longtime fans, speedrunners, and licensed partners.",
    evidence: watch("franchise visibility is observable, but the current source set does not measure Mario-specific Gen Alpha use."),
    strategyRelevance: "Use legible mechanics and cross-generational recognition while giving children an active part to play.", safetyCaveat: "Age suitability varies by title, while merchandise and in-game offers can intensify purchase pressure.", relatedInsightIds: ["media-properties-travel", "play-family-coplay"], relatedCultureShaperIds: [],
  },
  {
    id: "pokemon", name: "Pokemon", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Entry often begins at ages 6-9 and can persist into adolescence.", ageBands: schoolAge,
    whatItIs: "A collecting, battling, trading, television, film, card, and merchandise franchise.", whyTheyGo: "A large character system rewards mastery, preference, collecting, and conversation with peers.", whatHappens: "Fans play games, trade cards, compare teams, watch stories, and carry favorites across products.", whoIsThere: "New collectors, competitive players, families, card communities, retailers, and longtime fans.",
    evidence: watch("the ecosystem fits cross-media patterns, but no canonical source isolates Pokemon behavior among Gen Alpha."),
    strategyRelevance: "Systems of choice and accumulation can sustain participation when value is clear and not exploitative.", safetyCaveat: "Scarcity, randomized products, resale markets, and location play require spending and supervision safeguards.", relatedInsightIds: ["play-status-contribution", "media-properties-travel"], relatedCultureShaperIds: [],
  },
  {
    id: "toca-boca-world", name: "Toca Boca World", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Primarily ages 3-9, with adult support for purchases.", ageBands: ["3-5", "6-9"],
    whatItIs: "A mobile dollhouse world for open-ended character, home, and everyday-life stories.", whyTheyGo: "It offers low-pressure control over characters, places, outfits, and imagined social situations.", whatHappens: "Children arrange scenes, role-play routines, invent families, decorate spaces, and narrate outcomes.", whoIsThere: "Young solo players, siblings sharing stories, caregivers nearby, and family-content creators.",
    evidence: watch("the space is prominent in younger-child play, but the graph lacks direct Toca Boca usage evidence."),
    strategyRelevance: "Open prompts, expressive objects, and story materials are more native than fixed campaign scripts.", safetyCaveat: "In-app purchases and repeated product prompts should be transparent to both children and caregivers.", relatedInsightIds: ["play-avatars-identity", "learning-remix"], relatedCultureShaperIds: [],
  },
  {
    id: "brawl-stars", name: "Brawl Stars", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Most relevant to ages 9-14, with short-session mobile access.", ageBands: ["6-9", "10-12", "13-17"],
    whatItIs: "A mobile team-action game built around brief matches, characters, progression, and clubs.", whyTheyGo: "Fast rounds offer immediate competition, visible skill growth, and easy friend coordination.", whatHappens: "Small teams battle, unlock characters, compare builds, join clubs, and follow updates.", whoIsThere: "Peer teams, competitive grinders, club members, video strategists, and esports audiences.",
    evidence: watch("general gaming evidence is available, but no approved source verifies Brawl Stars-specific cohort behavior."),
    strategyRelevance: "Compact repeatable challenges and team contribution matter more than interruptive messaging.", safetyCaveat: "Monetized progression, chat, competitive pressure, and randomized rewards deserve careful age review.", relatedInsightIds: ["play-small-crews", "play-competition-performance"], relatedCultureShaperIds: [],
  },
  {
    id: "ea-sports-fc", name: "EA Sports FC", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Strongest among football-interested ages 10-17.", ageBands: older,
    whatItIs: "A football simulation ecosystem spanning teams, online competition, collecting, and esports.", whyTheyGo: "It extends real-world fandom into control, rivalry, squad building, and peer comparison.", whatHappens: "Players run matches, assemble teams, follow ratings, compete online, and discuss football culture.", whoIsThere: "Football fans, friend rivals, sports creators, clubs, leagues, and competitive players.",
    evidence: watch("sports-culture research is adjacent; the graph does not establish EA Sports FC-specific Gen Alpha participation."),
    strategyRelevance: "Connect digital play to authentic football knowledge, clubs, and moments without manufacturing false scarcity.", safetyCaveat: "Paid packs, market mechanics, online chat, and competitive intensity require spending and wellbeing controls.", relatedInsightIds: ["play-competition-performance", "media-properties-travel"], relatedCultureShaperIds: ["ishowspeed"],
  },
  {
    id: "nba-2k", name: "NBA 2K", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Primarily basketball-interested ages 10-17.", ageBands: older,
    whatItIs: "A basketball game ecosystem mixing simulation, avatar careers, social hubs, and collecting.", whyTheyGo: "It combines sports mastery with personal style, status, team play, and basketball aspiration.", whatHappens: "Players build avatars, run games, tune skills, collect items, and follow league culture.", whoIsThere: "Basketball fans, friend squads, sports creators, athletes, brands, and competitive communities.",
    evidence: watch("the source graph covers youth sports culture broadly, not NBA 2K-specific audience behavior."),
    strategyRelevance: "Earn relevance through basketball fluency and useful participation, not celebrity presence alone.", safetyCaveat: "Virtual currency, progression pressure, public interaction, and commercial density need explicit guardrails.", relatedInsightIds: ["play-status-contribution", "media-creators-templates"], relatedCultureShaperIds: ["jesser"],
  },
  {
    id: "the-sims", name: "The Sims", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Most relevant to creative players ages 10-17.", ageBands: older,
    whatItIs: "A life-simulation and building game centered on households, identity, design, and stories.", whyTheyGo: "It offers private experimentation with homes, relationships, aesthetics, and possible versions of self.", whatHappens: "Players design characters and spaces, stage narratives, use modifications, and share creations.", whoIsThere: "Solo storytellers, builders, mod communities, video creators, and design-minded friend groups.",
    evidence: watch("creation-game findings are conceptually adjacent, but no canonical evidence measures The Sims among this cohort."),
    strategyRelevance: "Provide expressive systems and tools that leave authorship with the player.", safetyCaveat: "Mature themes, modifications, downloads, and extensive add-on spending vary in suitability.", relatedInsightIds: ["play-avatars-identity", "learning-remix"], relatedCultureShaperIds: [],
  },
  {
    id: "rec-room", name: "Rec Room", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Relevant to ages 10-17; headset and account rules apply.", ageBands: older,
    whatItIs: "A social creation platform for multiplayer rooms, games, avatars, and optional virtual reality.", whyTheyGo: "It lets friends talk, play, perform, and make rooms inside one persistent identity.", whatHappens: "Users join games, build environments, customize avatars, meet others, and host activities.", whoIsThere: "Friend groups, room creators, VR players, public communities, moderators, and event hosts.",
    evidence: watch("the platform matches participatory-world patterns, but the graph has no Rec Room-specific youth evidence."),
    strategyRelevance: "Co-created rooms need a clear social purpose and capable moderation before branded participation.", safetyCaveat: "Voice chat, strangers, user-made rooms, and embodied VR interaction raise meaningful safeguarding needs.", relatedInsightIds: ["play-social-infrastructure", "play-safety-boundaries"], relatedCultureShaperIds: [],
  },
  {
    id: "gorilla-tag", name: "Gorilla Tag", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Mostly school-age and tween VR users with supervised setup.", ageBands: ["6-9", "10-12", "13-17"],
    whatItIs: "A movement-driven virtual-reality game organized around chasing, climbing, voice, and cosmetics.", whyTheyGo: "Simple physical rules create expressive mastery, laughter, and social presence without complex controls.", whatHappens: "Players move their bodies, chase others, talk in lobbies, learn routes, and show cosmetics.", whoIsThere: "VR-owning children, friend groups, public-lobby players, streamers, and community moderators.",
    evidence: watch("its youth visibility merits tracking, but approved sources do not quantify Gorilla Tag use or outcomes."),
    strategyRelevance: "Physical fluency and social play are the value; any activation must respect the native movement loop.", safetyCaveat: "Public voice, physical collision risk, headset comfort, and younger users demand active supervision.", relatedInsightIds: ["play-competition-performance", "time-coexistence"], relatedCultureShaperIds: [],
  },
  {
    id: "among-us", name: "Among Us", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Broadly accessible from ages 7-14 with moderated groups.", ageBands: schoolAge,
    whatItIs: "A social-deduction game where groups complete tasks while identifying hidden impostors.", whyTheyGo: "Rounds turn trust, accusation, humor, and group storytelling into a compact shared ritual.", whatHappens: "Players coordinate tasks, debate evidence, bluff, vote, and retell surprising social moments.", whoIsThere: "Friend groups, siblings, classrooms, public lobbies, streamers, and cross-platform players.",
    evidence: watch("the game remains a useful social-play signal, but no current graph source measures its Gen Alpha role."),
    strategyRelevance: "Design around conversation and shared decisions, while avoiding forced deception in sensitive contexts.", safetyCaveat: "Open chat and public rooms can expose younger players to strangers and inappropriate language.", relatedInsightIds: ["play-small-crews", "play-friendship-travels"], relatedCultureShaperIds: [],
  },
  {
    id: "geometry-dash", name: "Geometry Dash", category: "Games & Participatory Worlds", environment: "digital", ageContext: "Common among skill-seeking ages 8-14.", ageBands: ["6-9", "10-12", "13-17"],
    whatItIs: "A rhythm-platform game with demanding levels, music synchronization, and user creation.", whyTheyGo: "Visible difficulty makes persistence, mastery, and successful completion socially meaningful.", whatHappens: "Players retry levels, memorize patterns, build stages, share completions, and follow challenge creators.", whoIsThere: "Solo skill players, level makers, video audiences, friends comparing progress, and music fans.",
    evidence: watch("community visibility suggests relevance, but the approved evidence graph has no qualifying Geometry Dash research."),
    strategyRelevance: "Respect mastery culture by offering fair challenge and tools, not shortcuts that cheapen achievement.", safetyCaveat: "Frustration loops, unmoderated user levels, music rights, and extended retry sessions need consideration.", relatedInsightIds: ["play-status-contribution", "learning-remix"], relatedCultureShaperIds: [],
  },
  {
    id: "youtube", name: "YouTube", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Used across childhood; content and independence change sharply with age.", ageBands: allAges,
    whatItIs: "A video ecosystem spanning shows, Shorts, livestreams, music, tutorials, and creators.", whyTheyGo: "It can answer a question, fill time, deepen fandom, provide company, or start a new interest.", whatHappens: "Children watch, search, learn, follow personalities, replay formats, comment, and move references elsewhere.", whoIsThere: "Children, caregivers, creators, educators, media companies, advertisers, and recommendation systems.",
    evidence: backed("Young-child census data and adjacent teen research both place YouTube inside daily media routines, with explicit age and method limits.", ["common-sense-census-2025", "pew-teens-social-2024"], ["evidence-media-video-default-1", "evidence-time-youtube-rhythm-2"]),
    strategyRelevance: "A repeatable useful format with a recognizable host can travel farther than a conventional spot.", safetyCaveat: "Recommendations, comments, ads, creator disclosure, and age-inappropriate material require protective design.", relatedInsightIds: ["media-video-default", "time-youtube-rhythm"], relatedCultureShaperIds: ["mrbeast", "ms-rachel", "aphmau"],
  },
  {
    id: "youtube-kids", name: "YouTube Kids", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Designed for younger children, especially ages 3-9, with caregiver setup.", ageBands: ["3-5", "6-9"],
    whatItIs: "A child-oriented YouTube interface with restricted content pools and parental settings.", whyTheyGo: "Familiar songs, characters, learning videos, and simple discovery support independent choice.", whatHappens: "Young viewers repeat favorites, browse visual menus, sing along, learn, and request extensions.", whoIsThere: "Young children, caregivers, children's creators, licensed properties, educators, and advertisers.",
    evidence: watch("young-child video evidence is strong, but the canonical extraction does not isolate YouTube Kids from YouTube overall."),
    strategyRelevance: "Serve a clear child need and make the caregiver value exchange understandable at a glance.", safetyCaveat: "Restricted does not mean risk-free; co-viewing, time limits, and commercial transparency still matter.", relatedInsightIds: ["media-coviewing", "time-family-needs"], relatedCultureShaperIds: ["ms-rachel", "cocomelon", "ryans-world"],
  },
  {
    id: "youtube-shorts", name: "YouTube Shorts", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Growing from ages 6-17, with older users gaining more autonomy.", ageBands: schoolAge,
    whatItIs: "YouTube's vertical short-video feed built around rapid discovery and repeatable formats.", whyTheyGo: "It delivers quick novelty, familiar creators, humor, music, and answers with little setup.", whatHappens: "Viewers swipe, replay, imitate formats, follow creators, and jump into longer videos or search.", whoIsThere: "Young viewers, short-form creators, musicians, media brands, educators, and recommendation systems.",
    evidence: backed("The Common Sense census directly reports growth in short-form video and YouTube Shorts among children zero to eight, within parent-reported limits.", ["common-sense-census-2025"], ["evidence-media-short-form-shape-1", "evidence-time-youtube-rhythm-1"]),
    strategyRelevance: "Make the first beat legible and the format repeatable without reducing value to frantic pacing.", safetyCaveat: "Passive feeds can intensify exposure, advertising ambiguity, and loss of stopping cues for younger viewers.", relatedInsightIds: ["media-short-form-shape", "media-repeatable-formats"], relatedCultureShaperIds: ["alan-chikin-chow", "stokes-twins"],
  },
  {
    id: "tiktok", name: "TikTok", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Relevant mainly to older Gen Alpha ages 13-17; minimum ages apply.", ageBands: ["13-17"],
    whatItIs: "An algorithmic short-video network organized around creators, sounds, interests, and remix.", whyTheyGo: "The feed provides fast cultural orientation, niche discovery, humor, music, and social templates.", whatHappens: "Users watch, search, imitate, stitch, comment, message, and carry formats into other spaces.", whoIsThere: "Older teens, creators, artists, fandoms, brands, interest communities, and recommendation systems.",
    evidence: backed("Pew's representative survey is adjacent teen evidence: about six in ten U.S. teens ages 13-17 visited TikTok daily, including 16% almost constantly; it does not support claims about younger children or Gen Alpha as a whole.", ["pew-teens-social-2024"], ["evidence-media-short-form-shape-2"]),
    strategyRelevance: "Contribute a useful, adaptable format and disclose intent rather than disguising advertising as peer culture.", safetyCaveat: "Minimum age, recommendation risk, private messaging, data collection, and persuasive commerce are central constraints.", relatedInsightIds: ["media-short-form-shape", "media-reach-risk"], relatedCultureShaperIds: ["charli-damelio", "sabrina-carpenter"],
  },
  {
    id: "twitch", name: "Twitch", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Primarily ages 13-17 within this cohort.", ageBands: ["13-17"],
    whatItIs: "A livestreaming service where games, creators, events, and chat unfold in real time.", whyTheyGo: "Live attention makes viewers feel present for skill, humor, surprise, and community recognition.", whatHappens: "Audiences watch long sessions, chat, subscribe, clip moments, and follow recurring creator rituals.", whoIsThere: "Older teens, streamers, moderators, esports audiences, game publishers, musicians, and sponsors.",
    evidence: watch("the graph supports gaming and creator participation broadly, but not Twitch-specific Gen Alpha use."),
    strategyRelevance: "Support a creator-native live format and community utility rather than inserting a detached talking point.", safetyCaveat: "Live unpredictability, chat, donations, mature streams, and parasocial pressure require strong age boundaries.", relatedInsightIds: ["media-creators-templates", "play-competition-performance"], relatedCultureShaperIds: ["kai-cenat"],
  },
  {
    id: "netflix", name: "Netflix", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Household viewing spans all ages, with profile controls shaping access.", ageBands: allAges,
    whatItIs: "A subscription streaming service for series, films, animation, documentaries, and games.", whyTheyGo: "Familiar properties, next-episode continuity, family choice, and conversation-driving releases create return.", whatHappens: "Children browse profiles, binge series, co-view, revisit favorites, and follow properties into culture.", whoIsThere: "Children, families, global studios, animation fandoms, recommendation systems, and franchise marketers.",
    evidence: watch("video and co-viewing are evidence-backed categories, but approved extracts do not isolate Netflix usage."),
    strategyRelevance: "Think beyond placement toward property extensions, household conversation, and coherent cross-format worlds.", safetyCaveat: "Profile maturity settings, autoplay, long sessions, and indistinct promotional content need caregiver visibility.", relatedInsightIds: ["media-properties-travel", "media-coviewing"], relatedCultureShaperIds: [],
  },
  {
    id: "disney-plus", name: "Disney+", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Family and child viewing spans ages 3-17 through shared franchises.", ageBands: allAges,
    whatItIs: "A streaming home for Disney, Pixar, Marvel, Star Wars, National Geographic, and related properties.", whyTheyGo: "Trusted characters, family familiarity, serial worlds, and event releases make choice easier.", whatHappens: "Households co-view, children repeat favorites, fans follow universes, and stories extend into products.", whoIsThere: "Young children, families, franchise fandoms, studios, licensors, and recommendation systems.",
    evidence: watch("the cross-media mechanism is supported conceptually, but current evidence does not measure Disney+ specifically."),
    strategyRelevance: "Use franchise fluency to deepen participation without assuming recognition alone creates value.", safetyCaveat: "Commercial extensions, profile settings, autoplay, and age variation across franchises need clear navigation.", relatedInsightIds: ["media-properties-travel", "media-coviewing"], relatedCultureShaperIds: [],
  },
  {
    id: "prime-video", name: "Prime Video", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Household access spans ages 3-17 and depends on account setup.", ageBands: allAges,
    whatItIs: "A streaming service combining subscription titles, rentals, channels, live events, and commerce proximity.", whyTheyGo: "Household availability, familiar titles, sports, and bundled access reduce friction for viewing.", whatHappens: "Families browse, rent, subscribe to channels, watch together, and encounter purchase options.", whoIsThere: "Children, caregivers, studios, sports audiences, channel partners, retailers, and advertisers.",
    evidence: watch("household media evidence is adjacent, while no qualifying source separates Prime Video behavior."),
    strategyRelevance: "Account for the enabling adult and the unusually close relationship between entertainment and transaction.", safetyCaveat: "Rentals, add-on subscriptions, advertising, and account-level purchases must be unmistakable to families.", relatedInsightIds: ["media-household-negotiation", "media-discovery-commerce"], relatedCultureShaperIds: [],
  },
  {
    id: "max", name: "Max", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Use spans family viewing and older-audience titles, making profiles important.", ageBands: allAges,
    whatItIs: "A streaming service carrying animation, family films, franchises, documentaries, and adult programming.", whyTheyGo: "Recognizable properties and household subscriptions provide access to both comfort viewing and premieres.", whatHappens: "Viewers navigate mixed-age catalogs, co-view, follow series, and connect releases to fandom.", whoIsThere: "Families, animation fans, franchise audiences, studios, advertisers, and recommendation systems.",
    evidence: watch("the roster placement is editorial; canonical sources do not provide Max-specific child audience evidence."),
    strategyRelevance: "Any youth-facing work needs precise property and age context, not service-level audience assumptions.", safetyCaveat: "Mixed-maturity catalogs, profile controls, autoplay, and advertising require careful household configuration.", relatedInsightIds: ["media-properties-travel", "media-coviewing"], relatedCultureShaperIds: [],
  },
  {
    id: "crunchyroll", name: "Crunchyroll", category: "Video, Streaming & Live Media", environment: "digital", ageContext: "Most relevant to anime-interested ages 10-17.", ageBands: older,
    whatItIs: "An anime-focused streaming and fandom service spanning series, films, news, and merchandise.", whyTheyGo: "Deep genre choice, fast release access, identity-rich fandom, and peer recommendations drive use.", whatHappens: "Fans watch series, discuss characters, follow seasonal releases, collect merchandise, and attend events.", whoIsThere: "Tween and teen anime fans, subtitled and dubbed audiences, studios, conventions, and retailers.",
    evidence: watch("anime fandom is culturally visible, but the approved graph contains no Crunchyroll-specific cohort study."),
    strategyRelevance: "Genre literacy and respect for fan knowledge are prerequisites for credible participation.", safetyCaveat: "Title maturity varies widely, while fandom commerce and community links can move beyond the service.", relatedInsightIds: ["media-properties-travel", "play-status-contribution"], relatedCultureShaperIds: [],
  },
  {
    id: "snapchat", name: "Snapchat", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Most relevant to ages 13-17; under-thirteen use is not appropriate.", ageBands: ["13-17"],
    whatItIs: "A visual messaging network built around direct exchange, group chat, stories, and lenses.", whyTheyGo: "Frequent low-polish contact helps close friends maintain presence throughout the day.", whatHappens: "Users send photos, chat, maintain streaks, share location selectively, and use augmented lenses.", whoIsThere: "Older teens, close-friend groups, creators, publishers, advertisers, and recommendation systems.",
    evidence: watch("adjacent teen platform research exists, but current extracted evidence does not support a Snapchat-specific Gen Alpha claim."),
    strategyRelevance: "Treat it as relationship infrastructure and avoid intruding on private-friendship norms.", safetyCaveat: "Location, disappearing messages, contact from others, age rules, and commercial lenses require scrutiny.", relatedInsightIds: ["play-friendship-travels", "media-reach-risk"], relatedCultureShaperIds: [],
  },
  {
    id: "discord", name: "Discord", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Primarily ages 13-17, often connected to games and interests.", ageBands: ["13-17"],
    whatItIs: "A server-based network for text, voice, video, bots, and interest communities.", whyTheyGo: "It keeps a crew coordinated before, during, and after play or shared-interest activity.", whatHappens: "Members talk, schedule sessions, share media, follow updates, manage roles, and form subgroups.", whoIsThere: "Friend crews, game communities, fandoms, moderators, creators, developers, and automated bots.",
    evidence: backed("Ofcom qualitative work supports the movement of friendship and small-group interaction across games, messaging, and ongoing digital spaces.", ["ofcom-children-media-lives-2025"], ["evidence-play-friendship-travels-2", "evidence-play-small-crews-2"]),
    strategyRelevance: "Create useful community infrastructure only when moderation, consent, and a legitimate member purpose are strong.", safetyCaveat: "Private servers can still expose teens to strangers, scams, harmful content, and weak moderation.", relatedInsightIds: ["play-small-crews", "play-friendship-travels"], relatedCultureShaperIds: ["kai-cenat"],
  },
  {
    id: "whatsapp", name: "WhatsApp", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Age and importance vary sharply by country, school, and household.", ageBands: older,
    whatItIs: "A private messaging and calling service for family, friend, school, and community groups.", whyTheyGo: "It can be the default connective tissue for households and groups already organized there.", whatHappens: "People message, call, share media, coordinate logistics, and maintain multigenerational groups.", whoIsThere: "Family networks, classmates, teams, community groups, schools, businesses, and unknown contacts.",
    evidence: watch("global relevance is plausible, but the approved graph lacks age-specific WhatsApp evidence with adequate geography."),
    strategyRelevance: "Respect local communication norms and add practical value instead of importing broadcast behavior.", safetyCaveat: "Contact discovery, forwarding, scams, group consent, and minimum-age rules differ by market.", relatedInsightIds: ["play-friendship-travels", "media-household-negotiation"], relatedCultureShaperIds: [],
  },
  {
    id: "instagram", name: "Instagram", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Most relevant to ages 13-17 as public identity becomes more salient.", ageBands: ["13-17"],
    whatItIs: "A visual social network spanning Reels, profiles, creators, messaging, and interest discovery.", whyTheyGo: "It supports aspiration, identity curation, creator following, private sharing, and visual reference.", whatHappens: "Users browse Reels, message friends, post selectively, save ideas, and follow people or brands.", whoIsThere: "Older teens, creators, artists, athletes, brands, friends, advertisers, and recommendation systems.",
    evidence: watch("teen platform evidence is adjacent, but the canonical extraction does not isolate Instagram behavior for Gen Alpha."),
    strategyRelevance: "Provide visual utility or affiliation while keeping commercial intent obvious and age appropriate.", safetyCaveat: "Comparison pressure, messaging, recommendations, beauty claims, and targeted commerce carry meaningful risk.", relatedInsightIds: ["media-discovery-commerce", "media-reach-risk"], relatedCultureShaperIds: ["charli-damelio", "salish-matter"],
  },
  {
    id: "imessage-facetime", name: "iMessage and FaceTime", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Use grows with personal Apple-device access and family permission.", ageBands: schoolAge,
    whatItIs: "Apple's integrated text, media, group chat, voice, and video communication tools.", whyTheyGo: "The services are already attached to contacts, devices, families, and close-friend routines.", whatHappens: "Children call relatives, text friends, run group chats, share media, and coordinate plans.", whoIsThere: "Family members, classmates, close friends, team groups, and contacts connected through phone numbers.",
    evidence: watch("device-access research supports the context, but no canonical evidence isolates these services."),
    strategyRelevance: "This is private communication infrastructure, so strategy should focus on share-worthy utility outside the conversation.", safetyCaveat: "Group dynamics, unknown numbers, image sharing, device privacy, and nighttime use need household rules.", relatedInsightIds: ["time-device-access", "time-nighttime-use"], relatedCultureShaperIds: [],
  },
  {
    id: "messenger-kids", name: "Messenger Kids", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Designed for ages 6-12 with caregiver-managed contacts.", ageBands: ["6-9", "10-12"],
    whatItIs: "A child-focused messaging and video-calling app with parent-supervised contact management.", whyTheyGo: "It offers a controlled way to reach friends and relatives before independent social accounts.", whatHappens: "Children message approved contacts, make calls, use effects, and maintain distant relationships.", whoIsThere: "Children, caregivers, approved relatives, known friends, and platform safety systems.",
    evidence: watch("the product model is relevant, but the graph has no qualifying Messenger Kids usage study."),
    strategyRelevance: "Any participation must address the caregiver first and avoid exploiting a private child-contact space.", safetyCaveat: "Parent controls do not remove data, screen-time, contact-context, or platform-trust concerns.", relatedInsightIds: ["media-household-negotiation", "play-safety-boundaries"], relatedCultureShaperIds: [],
  },
  {
    id: "reddit", name: "Reddit", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "Watch primarily at the ages 13-17 edge of Gen Alpha.", ageBands: ["13-17"],
    whatItIs: "A topic-led network of communities, questions, links, debate, advice, and fandom.", whyTheyGo: "It offers candid language, niche expertise, peer comparison, and answers outside polished feeds.", whatHappens: "Users read threads, search prior answers, ask questions, vote, argue, and join interest communities.", whoIsThere: "Older teens, hobby experts, fandoms, anonymous adults, moderators, brands, and automated accounts.",
    evidence: watch("Reddit should remain a monitoring signal until direct, age-bounded evidence supports a stronger claim."),
    strategyRelevance: "Use it for language and need sensing, not covert participation or under-thirteen targeting.", safetyCaveat: "Adult users, anonymity, explicit material, misinformation, and uneven moderation make age caution essential.", relatedInsightIds: ["learning-assembled", "media-reach-risk"], relatedCultureShaperIds: [],
  },
  {
    id: "pinterest", name: "Pinterest", category: "Social, Messaging & Private Networks", environment: "digital", ageContext: "More relevant from ages 10-17 as projects and tastes become self-directed.", ageBands: older,
    whatItIs: "A visual search, saving, and planning service organized around images and interest boards.", whyTheyGo: "It helps turn vague taste into references for rooms, outfits, crafts, recipes, and events.", whatHappens: "Users search, save, organize boards, compare aesthetics, follow links, and plan projects.", whoIsThere: "Tween and teen planners, families, creators, retailers, publishers, advertisers, and search systems.",
    evidence: watch("the making and search role is editorially plausible, but no approved source measures youth Pinterest use."),
    strategyRelevance: "Offer genuinely useful visual instructions or references that remain valuable after the click.", safetyCaveat: "Beauty ideals, commercial links, data profiling, and external destinations require age-aware review.", relatedInsightIds: ["learning-remix", "media-discovery-commerce"], relatedCultureShaperIds: [],
  },
  {
    id: "spotify", name: "Spotify", category: "Music & Audio", environment: "digital", ageContext: "Use expands through ages 10-17, often through family plans.", ageBands: older,
    whatItIs: "A music, podcast, audiobook, playlist, and recommendation streaming service.", whyTheyGo: "It supports mood, identity, repetition, discovery, social sharing, and soundtrack control.", whatHappens: "Listeners build playlists, follow artists, replay songs, share recaps, and move among audio formats.", whoIsThere: "Young listeners, families, artists, podcasters, labels, advertisers, and recommendation systems.",
    evidence: watch("music use appears in broader routines, but the canonical graph does not establish Spotify-specific Gen Alpha behavior."),
    strategyRelevance: "Create repeat value through sound, sequencing, or artist context instead of treating audio as background inventory.", safetyCaveat: "Explicit content, recommendations, ads, data profiles, and parasocial podcast material need controls.", relatedInsightIds: ["media-repeatable-formats", "time-nighttime-use"], relatedCultureShaperIds: ["olivia-rodrigo", "sabrina-carpenter"],
  },
  {
    id: "apple-music", name: "Apple Music", category: "Music & Audio", environment: "digital", ageContext: "Use depends on household Apple access and grows with personal devices.", ageBands: schoolAge,
    whatItIs: "A subscription music service integrated with Apple devices, libraries, radio, and video.", whyTheyGo: "Device integration and family subscriptions make familiar music easy to request and repeat.", whatHappens: "Listeners search songs, build libraries, use playlists, watch videos, and share recommendations.", whoIsThere: "Children, families, artists, labels, radio hosts, curators, and device ecosystems.",
    evidence: watch("device and music context is available, but no source isolates Apple Music among Gen Alpha."),
    strategyRelevance: "Plan around listening rituals and household access rather than assuming independent subscriptions.", safetyCaveat: "Explicit lyrics, account sharing, recommendation profiles, and purchases need family configuration.", relatedInsightIds: ["media-household-negotiation", "time-device-access"], relatedCultureShaperIds: ["olivia-rodrigo"],
  },
  {
    id: "youtube-music", name: "YouTube Music", category: "Music & Audio", environment: "digital", ageContext: "Relevant across ages 6-17 through family and personal YouTube habits.", ageBands: schoolAge,
    whatItIs: "A music streaming service connected to YouTube's songs, videos, mixes, and discovery graph.", whyTheyGo: "It bridges official tracks, live versions, video familiarity, and algorithmic discovery.", whatHappens: "Listeners search, replay, build mixes, move between video and audio, and follow artists.", whoIsThere: "Young listeners, families, artists, labels, video creators, advertisers, and recommendation systems.",
    evidence: watch("YouTube use is well supported, but the evidence graph does not separate its music service."),
    strategyRelevance: "Design audio and video as connected expressions while preserving usefulness in each mode.", safetyCaveat: "Account history, explicit content, recommendations, advertising, and autoplay cross service boundaries.", relatedInsightIds: ["media-properties-travel", "time-youtube-rhythm"], relatedCultureShaperIds: ["sabrina-carpenter"],
  },
  {
    id: "amazon-music", name: "Amazon Music", category: "Music & Audio", environment: "digital", ageContext: "Often household-enabled across ages 3-17 through shared devices.", ageBands: allAges,
    whatItIs: "A music and podcast service integrated with Amazon subscriptions and voice devices.", whyTheyGo: "Voice requests and household access reduce friction for songs, playlists, and family listening.", whatHappens: "Children request tracks, replay favorites, use stations, share devices, and encounter recommendations.", whoIsThere: "Families, smart-speaker users, artists, labels, podcasters, advertisers, and retail accounts.",
    evidence: watch("household and voice interaction are broader signals; platform-specific child evidence is absent."),
    strategyRelevance: "Consider voice-led family moments and make commands, sponsorship, and outcomes transparent.", safetyCaveat: "Voice history, account purchases, explicit music, ads, and shared-device privacy need caregiver settings.", relatedInsightIds: ["time-family-needs", "learning-multimodal"], relatedCultureShaperIds: [],
  },
  {
    id: "podcasts-audiobooks", name: "Podcasts and audiobooks", category: "Music & Audio", environment: "digital", ageContext: "Formats span all ages; topic, length, and co-listening shape fit.", ageBands: allAges,
    whatItIs: "On-demand spoken audio ranging from stories and fandom to learning, news, and conversation.", whyTheyGo: "Audio can provide company, depth, imagination, explanation, or a shared car and bedtime ritual.", whatHappens: "Listeners follow series, hear long stories, learn by topic, discuss episodes, and multitask.", whoIsThere: "Children, families, authors, hosts, educators, celebrities, publishers, and advertisers.",
    evidence: watch("spoken audio matters editorially, but the current extracted evidence does not establish cohort-level use."),
    strategyRelevance: "Use narrative depth and recurring hosts where attention has a reason to continue beyond a clip.", safetyCaveat: "Age ratings, advertising, host authority, misinformation, and discovery outside child catalogs require review.", relatedInsightIds: ["media-creators-templates", "learning-assembled"], relatedCultureShaperIds: [],
  },
  {
    id: "google-search", name: "Google Search", category: "Learning, Search & Making", environment: "digital", ageContext: "Use grows from supported school-age search toward teen independence.", ageBands: schoolAge,
    whatItIs: "A general web search and answer gateway connecting queries to sites, media, maps, and products.", whyTheyGo: "It offers a familiar first step when a fact, definition, tutorial, place, or product is needed.", whatHappens: "Users phrase queries, scan results, compare sources, open videos, and refine questions.", whoIsThere: "Students, families, teachers, publishers, retailers, advertisers, websites, and ranking systems.",
    evidence: backed("Gen Alpha entertainment research directly compares traditional search with chatbots and reports stronger trust in search, while noting public-release limits.", ["nielsen-ai-discovery-2026"], ["evidence-learning-verification-1"]),
    strategyRelevance: "Publish clear, useful, source-visible answers that survive scrutiny beyond a paid result.", safetyCaveat: "Ads, unsafe results, tracking, weak source literacy, and AI summaries can blur evidence and promotion.", relatedInsightIds: ["learning-verification", "learning-assembled"], relatedCultureShaperIds: [],
  },
  {
    id: "chatgpt", name: "ChatGPT", category: "Learning, Search & Making", environment: "digital", ageContext: "Most relevant to ages 10-17 with school and adult guidance.", ageBands: older,
    whatItIs: "A conversational AI system that can explain, draft, brainstorm, analyze, and generate media.", whyTheyGo: "It responds in the moment, adapts to follow-up questions, and lowers the cost of a first attempt.", whatHappens: "Young users ask for explanations, homework help, ideas, summaries, role-play, and creative drafts.", whoIsThere: "Students, families, educators, developers, institutions, and an AI system trained on broad data.",
    evidence: watch("youth AI and chatbot use is directly evidenced, but approved extracts do not isolate ChatGPT sufficiently for a product-specific status."),
    strategyRelevance: "Build verification, disclosure, and productive iteration into any AI-assisted youth experience.", safetyCaveat: "Incorrect answers, privacy, overreliance, age requirements, sensitive disclosure, and academic integrity need guidance.", relatedInsightIds: ["learning-ai-homework", "learning-verification"], relatedCultureShaperIds: [],
  },
  {
    id: "capcut", name: "CapCut", category: "Learning, Search & Making", environment: "digital", ageContext: "Most relevant to creation-minded ages 10-17; account rules apply.", ageBands: older,
    whatItIs: "A mobile-first video editor built around templates, effects, captions, audio, and publishing workflows.", whyTheyGo: "It turns an idea or trend into a polished-looking clip without advanced editing knowledge.", whatHappens: "Creators cut footage, apply templates, sync sounds, add text, remix formats, and export.", whoIsThere: "Young makers, fan editors, creators, musicians, template authors, brands, and platform ecosystems.",
    evidence: watch("remix behavior is supported broadly, but the graph has no qualifying CapCut-specific youth study."),
    strategyRelevance: "Provide adaptable assets and clear permissions so young makers retain meaningful authorship.", safetyCaveat: "Account age, image privacy, copyrighted media, beauty effects, and publishing destinations need attention.", relatedInsightIds: ["learning-remix", "media-repeatable-formats"], relatedCultureShaperIds: ["salish-matter"],
  },
  {
    id: "canva", name: "Canva", category: "Learning, Search & Making", environment: "digital", ageContext: "Used from ages 8-17 in school, clubs, and personal projects.", ageBands: ["6-9", "10-12", "13-17"],
    whatItIs: "A template-based visual design tool for presentations, posts, video, print, and collaboration.", whyTheyGo: "Templates make polished expression possible before technical design skills are fully developed.", whatHappens: "Students choose layouts, combine media, collaborate, present ideas, and export work across formats.", whoIsThere: "Students, teachers, clubs, families, creators, template designers, brands, and AI tools.",
    evidence: watch("education and creative-identity research is adjacent, but Canva-specific youth evidence is not in the graph."),
    strategyRelevance: "Give young people modular materials that invite adaptation rather than pre-finished branded output.", safetyCaveat: "Shared projects, personal images, AI generation, licensing, and public templates require clear controls.", relatedInsightIds: ["learning-remix", "learning-multimodal"], relatedCultureShaperIds: ["moriah-elizabeth"],
  },
  {
    id: "scratch", name: "Scratch", category: "Learning, Search & Making", environment: "digital", ageContext: "Designed mainly for ages 8-16, with educator and family support.", ageBands: ["6-9", "10-12", "13-17"],
    whatItIs: "A block-based coding and sharing community for games, animation, stories, and interactive media.", whyTheyGo: "It makes code visible, remixable, playful, and connected to projects children actually want to make.", whatHappens: "Learners program, debug, remix projects, share feedback, follow creators, and build portfolios.", whoIsThere: "Children, educators, coding clubs, families, project creators, researchers, and community moderators.",
    evidence: watch("the graph supports creative learning generally, but no approved extraction measures Scratch directly."),
    strategyRelevance: "Offer understandable systems and remix rights that help learners see how their choices change outcomes.", safetyCaveat: "Public sharing, comments, attribution, personal information, and community moderation need age-aware teaching.", relatedInsightIds: ["learning-creation-skills", "learning-remix"], relatedCultureShaperIds: [],
  },
  {
    id: "duolingo", name: "Duolingo", category: "Learning, Search & Making", environment: "digital", ageContext: "School-age and teen use varies by reading level and motivation.", ageBands: schoolAge,
    whatItIs: "A gamified language-learning service built around brief lessons, practice loops, and progress streaks.", whyTheyGo: "Small wins, visible progression, reminders, and a playful brand make practice easy to restart.", whatHappens: "Learners complete exercises, hear speech, repeat errors, maintain streaks, and compare progress.", whoIsThere: "Students, families, classrooms, independent learners, course designers, and motivational systems.",
    evidence: watch("the education review covers digital tools broadly, not Duolingo-specific effectiveness for Gen Alpha."),
    strategyRelevance: "Use progression to support a real skill and ensure the reward loop serves learning rather than anxiety.", safetyCaveat: "Streak pressure, notifications, ads, purchases, and uneven instructional fit should remain visible.", relatedInsightIds: ["learning-assembled", "learning-enablement"], relatedCultureShaperIds: [],
  },
  {
    id: "khan-academy", name: "Khan Academy", category: "Learning, Search & Making", environment: "digital", ageContext: "Relevant across school ages when curriculum and reading level align.", ageBands: schoolAge,
    whatItIs: "A nonprofit learning platform with lessons, practice, videos, teacher tools, and AI support.", whyTheyGo: "It offers patient explanation, self-paced repetition, and another route when classroom instruction does not land.", whatHappens: "Learners watch lessons, practice skills, review mistakes, follow courses, and receive guidance.", whoIsThere: "Students, families, teachers, schools, subject experts, donors, and learning technologies.",
    evidence: watch("self-directed learning is supported, but the canonical evidence does not evaluate Khan Academy itself."),
    strategyRelevance: "Be genuinely instructional, show progress, and let learners revisit difficult steps without penalty.", safetyCaveat: "AI guidance, account data, curriculum fit, accessibility, and adult oversight still require review.", relatedInsightIds: ["learning-assembled", "learning-ai-homework"], relatedCultureShaperIds: [],
  },
  {
    id: "google-classroom", name: "Google Classroom and school learning systems", category: "Learning, Search & Making", environment: "digital", ageContext: "School-managed use spans ages 6-17 according to local systems.", ageBands: schoolAge,
    whatItIs: "A category of school platforms for assignments, resources, feedback, communication, and access.", whyTheyGo: "These systems are required gateways to teachers, deadlines, materials, grades, and classmates.", whatHappens: "Students receive work, submit files, read feedback, join video sessions, and manage school routines.", whoIsThere: "Students, teachers, caregivers, administrators, vendors, support staff, and school data systems.",
    evidence: watch("the systematic review supports blended digital learning, but no extracted result validates this named product category."),
    strategyRelevance: "Prioritize clarity, accessibility, low-friction completion, and support for both learners and enabling adults.", safetyCaveat: "Student data, surveillance, accessibility, account security, and institutional procurement demand strict governance.", relatedInsightIds: ["learning-assembled", "time-parent-context"], relatedCultureShaperIds: [],
  },
  {
    id: "school", name: "School", category: "Offline Culture", environment: "hybrid", ageContext: "A central structured environment across ages 6-17.", ageBands: schoolAge,
    whatItIs: "A physical and digital institution where learning, friendship, authority, identity, and routine meet.", whyTheyGo: "Attendance creates repeated contact with peers, adults, tasks, norms, and opportunities beyond home.", whatHappens: "Students learn, socialize, perform, negotiate status, use technology, join activities, and receive support.", whoIsThere: "Students, teachers, staff, families, coaches, counselors, vendors, and community partners.",
    evidence: backed("A systematic review of 83 studies documents varied digital and blended approaches, while cautioning against claims of one dominant Gen Alpha method.", ["generation-alpha-education-review-2024"], ["evidence-learning-assembled-1", "evidence-learning-enablement-1"]),
    strategyRelevance: "Partner around a real educational or community need and respect institutional expertise, access, and consent.", safetyCaveat: "Power differences, student data, unequal resources, accessibility, and commercial influence require formal safeguards.", relatedInsightIds: ["learning-assembled", "learning-enablement"], relatedCultureShaperIds: [],
  },
  {
    id: "after-school-sports-clubs", name: "After-school sports and clubs", category: "Offline Culture", environment: "physical", ageContext: "School-age participation varies with cost, location, ability, and family time.", ageBands: schoolAge,
    whatItIs: "Organized and informal teams, lessons, clubs, arts groups, and interest communities after school.", whyTheyGo: "Shared practice provides friendship, mentorship, mastery, identity, movement, and belonging with a schedule.", whatHappens: "Children train, rehearse, make, compete, perform, volunteer, travel, and build relationships.", whoIsThere: "Children, peers, coaches, mentors, families, schools, nonprofits, leagues, and community venues.",
    evidence: backed("National youth-sport and outdoor-participation syntheses provide directional evidence while explicitly not representing every kind of offline play or equal access.", ["project-play-state-of-play-2025", "outdoor-participation-trends-2026"], ["evidence-play-offline-rebound-1", "evidence-play-offline-rebound-2"]),
    strategyRelevance: "Support access, equipment, mentorship, or recognition so the contribution improves the activity itself.", safetyCaveat: "Cost, transport, exclusion, injury, adult conduct, image consent, and unequal access need active management.", relatedInsightIds: ["play-offline-rebound", "play-small-crews"], relatedCultureShaperIds: ["dude-perfect", "jesser"],
  },
  {
    id: "cinemas-live-entertainment", name: "Cinemas and live entertainment", category: "Offline Culture", environment: "physical", ageContext: "Family and peer attendance spans ages 3-17 by event and rating.", ageBands: allAges,
    whatItIs: "Shared physical venues for films, concerts, theatre, sports entertainment, and touring properties.", whyTheyGo: "Scale, collectivity, anticipation, and leaving home turn media into a memorable social occasion.", whatHappens: "Audiences gather, watch together, react publicly, buy concessions or merchandise, and retell moments.", whoIsThere: "Children, families, friend groups, performers, venue staff, studios, sponsors, and local communities.",
    evidence: watch("physical-experience preference is an adjacent signal, but the graph does not measure these venues directly."),
    strategyRelevance: "Create a moment worth gathering for and connect it carefully to digital participation before or after.", safetyCaveat: "Ratings, crowd safety, sensory access, pricing, transport, photography, and sponsorship disclosure all matter.", relatedInsightIds: ["time-coexistence", "media-properties-travel"], relatedCultureShaperIds: ["danny-go"],
  },
  {
    id: "home-family-routines", name: "Home and family routines", category: "Offline Culture", environment: "hybrid", ageContext: "Foundational across all ages, with autonomy increasing through adolescence.", ageBands: allAges,
    whatItIs: "The household system of meals, travel, chores, bedtime, co-viewing, devices, requests, and care.", whyTheyGo: "Home is the default setting where access, permission, comfort, conflict, and family identity are negotiated.", whatHappens: "Families share screens, set rules, buy things, talk, learn, rest, coordinate, and move between media.", whoIsThere: "Children, siblings, parents, caregivers, extended family, pets, household devices, and services.",
    evidence: backed("Common Sense and PwC evidence connects early device access, co-viewing, adult payment, and media use to real household infrastructure, with different age scopes.", ["common-sense-census-2025", "pwc-alpha-2026"], ["evidence-time-family-needs-1", "evidence-time-family-needs-2"]),
    strategyRelevance: "Design for the child and enabling adult together, with a useful place in an existing household moment.", safetyCaveat: "Households differ in time, money, language, access, rules, and privacy; avoid one-family assumptions.", relatedInsightIds: ["time-family-needs", "media-household-negotiation"], relatedCultureShaperIds: ["ms-rachel", "cocomelon"],
  },
];

export const spaces: Space[] = seeds.map(({ evidence, ...seed }, index) => ({
  ...seed,
  ...evidence,
  tone: tones[index % tones.length],
}));
