import { sources } from "./sources";
import type { EvidenceItem, EvidenceType, Insight, Theme } from "./types";

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

type ExtractedFact = {
  insightId: string;
  slot: 1 | 2;
  sourceId: string;
  claim: string;
  locator: string;
  evidenceType: EvidenceType;
};

const fact = (
  insightId: string,
  slot: 1 | 2,
  sourceId: string,
  claim: string,
  locator: string,
  evidenceType: EvidenceType,
): ExtractedFact => ({ insightId, slot, sourceId, claim, locator, evidenceType });

const extractedFacts: ExtractedFact[] = [
  fact("play-social-infrastructure", 1, "walton-creation-gaming-2024", "The report frames Roblox and Minecraft creation gaming as settings where children make, collaborate, and socialize rather than only consume games.", "Report title and opening paragraph, creation-gaming framing.", "self-reported"),
  fact("play-social-infrastructure", 2, "ofcom-children-media-lives-2025", "The panel follows how children use games, video, chat, and friend groups together in their everyday media routines.", "Summary report, opening paragraph on panel media lives.", "qualitative"),
  fact("play-making-interface", 1, "walton-creation-gaming-2024", "The study explicitly examines creation gaming for learning and development among children who use Roblox and Minecraft.", "Report title and methodology summary.", "self-reported"),
  fact("play-making-interface", 2, "roblox-search-style-trends-2025", "Roblox's release links user search behavior with avatar style trends inside digital experiences.", "News release headline and opening paragraph.", "platform-wide metric"),
  fact("play-friendship-travels", 1, "ofcom-children-media-lives-2025", "Ofcom's qualitative design records children's movement among games, video, chat, family rules, and friend groups.", "Summary report, methodology paragraph on diaries and interviews.", "qualitative"),
  fact("play-friendship-travels", 2, "pew-teens-video-games-2024", "Pew's teen study treats video games as a social setting as well as a recreational activity.", "Report title and introductory section on teens and video games.", "self-reported"),
  fact("play-avatars-identity", 1, "roblox-search-style-trends-2025", "The release identifies avatar style trends as a measurable part of how users navigate Roblox experiences.", "News release headline, search and style trends finding.", "platform-wide metric"),
  fact("play-avatars-identity", 2, "ofcom-children-media-lives-2025", "The panel research includes young people's accounts of games, friend groups, and the media choices made around them.", "Summary report, media-lives findings section introduction.", "qualitative"),
  fact("play-small-crews", 1, "ofcom-children-media-lives-2025", "Ofcom's design centers repeated, in-context accounts from a small panel, making friend-group routines visible rather than measuring follower totals.", "Summary report, methodology section on longitudinal panel research.", "qualitative"),
  fact("play-small-crews", 2, "pew-teens-video-games-2024", "Pew's report examines teen gaming in relation to social experience, providing comparator evidence for peer-oriented play.", "Report overview section, social experience framing.", "self-reported"),
  fact("play-competition-performance", 1, "pew-teens-video-games-2024", "The Pew study connects teen video game participation with civic and social contexts, not just time spent playing.", "Report title and overview section.", "self-reported"),
  fact("play-competition-performance", 2, "ap-sports-alpha-2026", "Associated Press reports sports leagues adapting youth engagement through creator-led and participatory formats.", "Article opening paragraphs on league youth strategies.", "qualitative"),
  fact("play-status-contribution", 1, "roblox-search-style-trends-2025", "Roblox's first-party release makes avatar style a named trend category within its digital experiences.", "News release, avatar-style trend section.", "platform-wide metric"),
  fact("play-status-contribution", 2, "walton-creation-gaming-2024", "The Walton report treats making inside Roblox and Minecraft as part of children's creation-gaming participation.", "Report opening paragraph, Roblox and Minecraft focus.", "self-reported"),
  fact("play-family-coplay", 1, "common-sense-census-2025", "The Common Sense Census measures young children's media use alongside device access and household context.", "Census overview, study scope section.", "self-reported"),
  fact("play-family-coplay", 2, "ofcom-children-media-lives-2025", "Ofcom's child panel research includes family rules in the same everyday accounts as gaming, video, and chat.", "Summary report, opening paragraph on topics covered.", "qualitative"),
  fact("play-offline-rebound", 1, "anxious-generation-book", "Haidt's book argues that smartphone childhood displaced independent play, a contested framing that keeps offline play in view.", "Book description, argument summary paragraph.", "editorial inference"),
  fact("play-offline-rebound", 2, "digital-wellbeing-review-2025", "The meta-analysis evaluates young children's digital technology use in relation to psychosocial wellbeing rather than treating all screen use as one exposure.", "Article abstract, review aim.", "observed"),
  fact("play-safety-boundaries", 1, "unicef-online-gaming", "UNICEF's report sets out child-rights opportunities, design responsibilities, and safety risks for online gaming.", "Report overview, child-rights framework section.", "qualitative"),
  fact("play-safety-boundaries", 2, "ftc-coppa-2025", "The FTC's final rule announcement limits the collection, retention, and monetization of children's data by covered services.", "FTC press release headline and first paragraph.", "observed"),
  fact("media-video-default", 1, "common-sense-census-2025", "The Census establishes a national baseline for video and media use among U.S. children ages zero to eight.", "Census title and study scope section.", "self-reported"),
  fact("media-video-default", 2, "ofcom-children-media-lives-2025", "Ofcom follows video alongside games and chat as part of children's lived media routines.", "Summary report, opening paragraph on panel media activities.", "qualitative"),
  fact("media-short-form-shape", 1, "pew-teens-social-2024", "Pew's representative teen survey reports platform use, frequency, device access, and demographic differences.", "Report overview, methodology and topics section.", "self-reported"),
  fact("media-short-form-shape", 2, "oxford-brain-rot-2024", "Oxford documents 'brain rot' as a 2024 cultural term for concern about low-value online media.", "Announcement headline and definition paragraph.", "qualitative"),
  fact("media-creators-templates", 1, "ap-sports-alpha-2026", "AP's reporting describes leagues pursuing Gen Z and Gen Alpha through creator-led and participatory youth-culture examples.", "Article headline and opening paragraphs.", "qualitative"),
  fact("media-creators-templates", 2, "emarketer-alpha-faq-2026", "EMARKETER's Gen Alpha FAQ explicitly includes creator partnerships among its marketing topics.", "FAQ overview paragraph listing creator partnerships.", "editorial inference"),
  fact("media-household-negotiation", 1, "pwc-alpha-2026", "PwC's U.S. survey covers technology, household shopping, and influence among children ages seven to fourteen.", "Survey report title and opening scope paragraph.", "self-reported"),
  fact("media-household-negotiation", 2, "gwi-alpha-unfiltered", "GWI's report covers Gen Alpha family influence and brand expectations alongside media behavior.", "Report overview, topic list.", "self-reported"),
  fact("media-discovery-commerce", 1, "pwc-alpha-2026", "PwC includes household shopping and children's influence in its Generation Alpha survey scope.", "Survey report opening scope paragraph.", "self-reported"),
  fact("media-discovery-commerce", 2, "emarketer-alpha-faq-2026", "EMARKETER connects Gen Alpha marketing with household influence, creators, gaming, privacy, and participation.", "FAQ overview section, topic list.", "editorial inference"),
  fact("media-repeatable-formats", 1, "ap-sports-alpha-2026", "AP documents sports organizations experimenting with participatory youth-culture formats rather than relying only on traditional fan outreach.", "Article opening paragraphs on league adaptations.", "qualitative"),
  fact("media-repeatable-formats", 2, "ofcom-children-media-lives-2025", "Ofcom's accounts span games, video, and chat, showing that children's media practices cross format boundaries.", "Summary report, panel activity overview.", "qualitative"),
  fact("media-properties-travel", 1, "ap-sports-alpha-2026", "The AP article uses sports as an example of youth culture moving through participation, creators, and entertainment.", "Article body section, examples of league youth engagement.", "qualitative"),
  fact("media-properties-travel", 2, "emarketer-alpha-habits-2026", "EMARKETER's forecast-led analysis combines Gen Alpha media use, gaming, platform adoption, and digital attention.", "Report overview, topic list.", "forecast"),
  fact("media-coviewing", 1, "common-sense-census-2025", "The Census pairs children's media-use measures with family and household context.", "Census overview, household context description.", "self-reported"),
  fact("media-coviewing", 2, "pwc-alpha-2026", "PwC's scope places children's technology use and household shopping in the same U.S. survey.", "Survey report opening scope paragraph.", "self-reported"),
  fact("media-ai-recommendation", 1, "nielsen-ai-discovery-2026", "Nielsen and Gracenote describe Gen Alpha as leading a shift toward AI-powered entertainment search, discovery, and recommendations.", "News release headline and opening paragraph.", "self-reported"),
  fact("media-ai-recommendation", 2, "razorfish-alpha-ai", "Razorfish's study announcement says it examines how Gen Alpha understands and imagines AI across school, creativity, relationships, and brands.", "Study announcement opening paragraph.", "self-reported"),
  fact("media-reach-risk", 1, "arxiv-young-user-safety-2025", "The preprint audits moderation and harmful recommendations across 3,000 videos served to younger-account video environments.", "Abstract, experimental audit description.", "observed"),
  fact("media-reach-risk", 2, "ftc-coppa-2025", "The COPPA rule update establishes data-handling obligations for services directed to children under thirteen.", "FTC press release, rule scope paragraph.", "observed"),
  fact("time-screen-purpose", 1, "digital-wellbeing-review-2025", "The review synthesizes evidence on digital technology use and psychosocial wellbeing in young children ages four to six.", "Article abstract, population and aim.", "observed"),
  fact("time-screen-purpose", 2, "common-sense-census-2025", "The Census covers media use, device access, video, and household context together for U.S. children zero to eight.", "Census overview, study scope section.", "self-reported"),
  fact("time-device-access", 1, "common-sense-census-2025", "The Common Sense Census includes device access in its national baseline of young children's media environments.", "Census overview, device-access scope.", "self-reported"),
  fact("time-device-access", 2, "pew-teens-social-2024", "Pew measures both device access and platform frequency among U.S. teens as comparator context.", "Report overview, survey topics section.", "self-reported"),
  fact("time-youtube-rhythm", 1, "common-sense-census-2025", "The Census is a national media-use baseline that includes video for children ages zero to eight.", "Census title and overview section.", "self-reported"),
  fact("time-youtube-rhythm", 2, "ofcom-children-media-lives-2025", "Ofcom's longitudinal panel includes video in the routines it traces with children and young people.", "Summary report, activity overview paragraph.", "qualitative"),
  fact("time-parent-context", 1, "common-sense-census-2025", "Common Sense includes family context with young children's media use and device access.", "Census overview, household context statement.", "self-reported"),
  fact("time-parent-context", 2, "unicef-online-gaming", "UNICEF frames online-gaming safety as a design and rights responsibility, not only a question of children's minutes online.", "Report overview, design responsibilities section.", "qualitative"),
  fact("time-family-needs", 1, "common-sense-census-2025", "The Census uses a household-based approach to describe young children's media use.", "Census overview, study population description.", "self-reported"),
  fact("time-family-needs", 2, "aecf-generation-alpha", "The Annie E. Casey Foundation overview places technology exposure inside Gen Alpha's family and developmental context.", "Article opening sections on family context and technology.", "editorial inference"),
  fact("time-age-change", 1, "common-sense-census-2025", "Common Sense reports a defined 0-8 population, keeping early-childhood media patterns age-specific.", "Census title and study population section.", "self-reported"),
  fact("time-age-change", 2, "pew-teens-social-2024", "Pew's comparison sample is explicitly ages 13-17, showing why teen findings need separate treatment.", "Report methodology, sample age section.", "self-reported"),
  fact("time-nighttime-use", 1, "ofcom-children-media-lives-2025", "Ofcom's longitudinal diaries and interviews capture routines rather than a single point-in-time media total.", "Summary report, methodology section.", "qualitative"),
  fact("time-nighttime-use", 2, "pew-platform-experiences-2026", "Pew's teen-and-parent survey examines time, messaging, friendship, connection, and wellbeing on major social platforms.", "Report overview, survey topics section.", "self-reported"),
  fact("time-coexistence", 1, "screen-socioemotional-review-2025", "The longitudinal review cautions against a one-directional account of screens and children's socioemotional outcomes.", "Article abstract, conclusion statement.", "observed"),
  fact("time-coexistence", 2, "ofcom-children-media-lives-2025", "Ofcom records media practices alongside family rules and friend groups rather than isolating online activity from daily life.", "Summary report, panel topic overview.", "qualitative"),
  fact("time-private-day", 1, "pew-teens-social-2024", "Pew's U.S. teen survey includes personal device access alongside platform frequency.", "Report overview, device access topic.", "self-reported"),
  fact("time-private-day", 2, "common-sense-census-2025", "Common Sense measures device access within young children's household media environment.", "Census overview, device-access scope.", "self-reported"),
  fact("time-household-context", 1, "aecf-generation-alpha", "The Annie E. Casey Foundation's overview links Gen Alpha demographics with family context, technology exposure, and development.", "Article overview, demographic and family-context sections.", "editorial inference"),
  fact("time-household-context", 2, "common-sense-census-2025", "Common Sense's census is a U.S. household-based baseline, making its national and age boundaries explicit.", "Census overview, population and geography section.", "self-reported"),
  fact("learning-assembled", 1, "generation-alpha-education-review-2024", "The PRISMA review synthesizes 83 studies on Generation Alpha education, teaching, tools, and blended learning.", "Article abstract, results summary.", "observed"),
  fact("learning-assembled", 2, "ofcom-children-media-lives-2025", "Ofcom follows games, video, chat, and family rules as interconnected elements of young people's media lives.", "Summary report, opening paragraph.", "qualitative"),
  fact("learning-creation-skills", 1, "walton-creation-gaming-2024", "The Walton study explicitly investigates creation gaming for learning and development in Roblox and Minecraft.", "Report title and opening paragraph.", "self-reported"),
  fact("learning-creation-skills", 2, "generation-alpha-education-review-2024", "The education review covers learning tools and blended learning across the studies it synthesizes.", "Article abstract, scope section.", "observed"),
  fact("learning-ai-homework", 1, "common-sense-ai-2026", "Common Sense's national youth AI study covers use, trust, disclosure, and adult guidance among tweens and teens.", "News release opening paragraph.", "self-reported"),
  fact("learning-ai-homework", 2, "common-sense-chatgpt-video", "Common Sense's family explainer describes what ChatGPT does and how children can use it responsibly.", "Video title and opening description.", "editorial inference"),
  fact("learning-ai-discovery", 1, "razorfish-alpha-ai", "Razorfish's announcement spans Gen Alpha AI use across school, creativity, relationships, and brands.", "Study announcement opening paragraph.", "self-reported"),
  fact("learning-ai-discovery", 2, "nielsen-ai-discovery-2026", "Nielsen and Gracenote focus on Gen Alpha's AI-powered entertainment search, discovery, recommendation, chatbot use, and trust.", "News release headline and opening paragraph.", "self-reported"),
  fact("learning-safety-guidance", 1, "common-sense-ai-2026", "The Common Sense study includes adult guidance and disclosure in its youth AI research scope.", "News release opening paragraph, study topics.", "self-reported"),
  fact("learning-safety-guidance", 2, "ftc-coppa-2025", "The FTC rule update limits covered companies' ability to collect, retain, and monetize children's data.", "FTC press release headline and first paragraph.", "observed"),
  fact("learning-verification", 1, "nielsen-ai-discovery-2026", "Nielsen's study scope includes trust alongside Gen Alpha entertainment search and chatbot use.", "News release opening paragraph, study topics.", "self-reported"),
  fact("learning-verification", 2, "common-sense-chatgpt-video", "The family-facing ChatGPT explainer centers responsible use rather than presenting the tool as an unqualified authority.", "Video description, responsible-use guidance.", "editorial inference"),
  fact("learning-enablement", 1, "generation-alpha-education-review-2024", "The systematic review covers teaching, tools, and blended learning rather than treating devices as a standalone educational outcome.", "Article abstract, review scope.", "observed"),
  fact("learning-enablement", 2, "digital-wellbeing-review-2025", "The wellbeing review evaluates digital technology use in young children with attention to varied psychosocial outcomes.", "Article abstract, review aim.", "observed"),
  fact("learning-remix", 1, "walton-creation-gaming-2024", "Walton's research defines Roblox and Minecraft as creation-gaming environments for children ages five to thirteen.", "Report opening paragraph, study population.", "self-reported"),
  fact("learning-remix", 2, "roblox-search-style-trends-2025", "Roblox's release names search and avatar-style trends as activity inside its digital experiences.", "News release headline and opening paragraph.", "platform-wide metric"),
  fact("learning-commercial-fluency", 1, "pwc-alpha-2026", "PwC surveys children ages seven to fourteen about technology, household shopping, and influence.", "Survey report title and opening scope paragraph.", "self-reported"),
  fact("learning-commercial-fluency", 2, "razorfish-alpha-industries", "Razorfish studies Gen Alpha perceptions of technology, retail, finance, travel, and health industries.", "Study announcement headline and opening paragraph.", "self-reported"),
  fact("learning-multimodal", 1, "generation-alpha-education-review-2024", "The 83-study review brings together multiple education settings, tools, and blended-learning approaches for Generation Alpha.", "Article abstract, results summary.", "observed"),
  fact("learning-multimodal", 2, "walton-creation-gaming-2024", "Walton combines a child survey with qualitative interviews to study creation gaming for learning and development.", "Report methodology summary.", "self-reported"),
];

const factsForInsight = (insightId: string) => extractedFacts.filter((item) => item.insightId === insightId);

export const insights: Insight[] = insightSeeds.map((seed) => ({
  ...seed,
  evidenceIds: factsForInsight(seed.id).map((item) => `evidence-${item.insightId}-${item.slot}`),
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

export const evidenceItems: EvidenceItem[] = extractedFacts.map((item) => {
    const source = sourceById.get(item.sourceId);
    if (!source) {
      throw new Error(`Unknown source ${item.sourceId} in ${item.insightId}`);
    }

    return {
      id: `evidence-${item.insightId}-${item.slot}`,
      sourceId: item.sourceId,
      claim: item.claim,
      locator: item.locator,
      evidenceType: item.evidenceType,
      population: source.population,
      ageRange: source.ageRange,
      geography: source.geography,
      period: source.fieldworkPeriod,
      methodology: source.methodology,
      limitations: source.limitations,
      insightIds: [item.insightId],
    };
  });
