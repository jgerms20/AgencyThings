import { sources } from "./sources";
import type { EvidenceClaimKind, EvidenceItem, EvidenceType, Insight, Theme } from "./types";

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
  { id: "time-youtube-rhythm", themeId: "time-routines", sequence: 3, title: "YouTube is embedded in the daily household rhythm.", thesis: "Video is a recurring part of young children's media environments.", tags: ["youtube", "routines"], sourceIds: ["common-sense-census-2025", "pew-teens-social-2024"] },
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
  fact("play-social-infrastructure", 1, "pew-teens-video-games-2024", "Forty-seven percent of teen video-game players said gaming helped their friendships, and 47% had made an online friend through a game.", "Socializing over video games section, findings paragraphs.", "self-reported"),
  fact("play-social-infrastructure", 2, "walton-creation-gaming-2024", "Children said Roblox and Minecraft help them practice creativity and problem-solving, while expert interviews emphasized team-based social learning.", "Key Findings section, cognitive development finding and expert interview paragraph.", "self-reported"),
  fact("play-making-interface", 1, "walton-creation-gaming-2024", "At least seven in ten children wanted to learn subjects such as coding, art, or design inside Roblox or Minecraft.", "Key Findings section, formal education finding.", "self-reported"),
  fact("play-making-interface", 2, "roblox-search-style-trends-2025", "Roblox's first-party trend data linked what users searched for with the avatar styles they adopted inside experiences, making discovery part of creation and play.", "Search and style trends section, platform findings.", "editorial inference"),
  fact("play-friendship-travels", 1, "pew-teens-video-games-2024", "Most teen players gamed with other people, and 40% of all U.S. teens had made an online friend through a shared game.", "Socializing over video games section, findings paragraphs.", "self-reported"),
  fact("play-friendship-travels", 2, "ofcom-children-media-lives-2025", "Ofcom's case studies observed children carrying shared interests between games, messaging, video, and in-person friend groups.", "Summary report, friendships and communication findings section.", "qualitative"),
  fact("play-avatars-identity", 1, "roblox-search-style-trends-2025", "Platform search and style patterns showed avatar appearance moving with named aesthetics and cultural trends inside Roblox experiences.", "Avatar style trends section, platform findings.", "platform-wide metric"),
  fact("play-avatars-identity", 2, "razorfish-alpha-industries", "Eighty percent of Alpha girls had used a filter or retouching app, while 63% wanted more inclusive representation in media.", "Industry findings section, beauty and representation paragraph.", "self-reported"),
  fact("play-small-crews", 1, "pew-teens-video-games-2024", "Ninety-eight percent of self-identified teen gamers played with others, and 68% had made a friend online through a game.", "Socializing over video games section, gamer comparison paragraph.", "self-reported"),
  fact("play-small-crews", 2, "ofcom-children-media-lives-2025", "Ofcom's longitudinal cases showed small friend groups using games and private messages as recurring places to coordinate and stay connected.", "Summary report, friend-group routines findings section.", "qualitative"),
  fact("play-competition-performance", 1, "pew-teens-video-games-2024", "About four in ten U.S. teens played video games daily, including 23% who played several times a day.", "Who plays video games section, frequency paragraph.", "self-reported"),
  fact("play-competition-performance", 2, "ap-sports-alpha-2026", "The NBA and NHL partnered directly with young creators to reach younger fans, and the NBA used AI to identify potential partners.", "Article opening paragraphs on league creator partnerships.", "observed"),
  fact("play-status-contribution", 1, "roblox-search-style-trends-2025", "Roblox's platform findings treated avatar style and search fluency as visible participation patterns inside user-created experiences.", "Search and avatar style findings section.", "editorial inference"),
  fact("play-status-contribution", 2, "walton-creation-gaming-2024", "Players named creativity and problem-solving among the skills they actively learn while building in Roblox and Minecraft.", "Key Findings section, cognitive development paragraph.", "self-reported"),
  fact("play-family-coplay", 1, "common-sense-census-2025", "Forty percent of children had a tablet by age two and nearly one in four had a personal cellphone by age eight, showing that early access is household-enabled.", "Key findings paragraph, device ownership metrics.", "self-reported"),
  fact("play-family-coplay", 2, "pwc-alpha-2026", "Sixty percent of children said an adult pays when they buy something, even as children exercise growing choice over digital and physical purchases.", "Following the money section, payment-method findings.", "self-reported"),
  fact("play-offline-rebound", 1, "razorfish-alpha-industries", "Two in three Alpha respondents would pay more for something usable only in the real world, compared with 33% for something solely online.", "Industry findings section, in-person experiences paragraph.", "self-reported"),
  fact("play-offline-rebound", 2, "anxious-generation-book", "Haidt argues that phone-based childhood displaced independent play; this contested synthesis is evidence of the counter-movement toward restoring offline play.", "Book argument summary chapter and publisher description.", "editorial inference"),
  fact("play-safety-boundaries", 1, "unicef-online-gaming", "UNICEF concludes that child safety, privacy, and rights protections must be built into online-game design rather than left only to parental monitoring.", "Report recommendations section on safety by design.", "qualitative"),
  fact("play-safety-boundaries", 2, "ftc-coppa-2025", "The revised COPPA rule requires separate parental opt-in before children's data can be disclosed for targeted advertising and limits indefinite data retention.", "FTC release, final-rule changes paragraphs.", "observed"),
  fact("media-video-default", 1, "common-sense-census-2025", "Children zero to eight averaged about 2.5 hours of screen media a day while short-form services including YouTube Shorts grew.", "Key findings paragraph, daily time and short-form video findings.", "self-reported"),
  fact("media-video-default", 2, "pwc-alpha-2026", "Sixty-eight percent of children ages seven to fourteen said they use YouTube regularly, ahead of gaming platforms at 54% and streaming services at 49%.", "Digital influence section, platform-use findings paragraph.", "self-reported"),
  fact("media-short-form-shape", 1, "common-sense-census-2025", "Total daily screen time held near 2.5 hours while traditional TV declined and TikTok and YouTube Shorts rose, indicating a format shift within stable time.", "Key findings paragraph, changing media mix.", "self-reported"),
  fact("media-short-form-shape", 2, "oxford-brain-rot-2024", "Oxford selected 'brain rot' as its 2024 word of the year after use of the term rose sharply in public discourse about low-value online content.", "Announcement definition and usage-trend paragraphs.", "observed"),
  fact("media-creators-templates", 1, "ap-sports-alpha-2026", "Major leagues partnered with young creators to translate sports into the formats and language younger audiences already follow.", "Article opening paragraphs on NBA and NHL creator partnerships.", "observed"),
  fact("media-creators-templates", 2, "pwc-alpha-2026", "Sixty-one percent of Gen Alpha respondents said social media makes them want to buy something, exceeding reported peer influence at 56%.", "Digital influence section, purchase-motivation findings.", "self-reported"),
  fact("media-household-negotiation", 1, "pwc-alpha-2026", "Children reported more independent ordering than parents recognized: 25% cited food-delivery apps versus 14% of parents, an 11-point gap.", "Independence gap section, child-parent comparison paragraph.", "self-reported"),
  fact("media-household-negotiation", 2, "razorfish-alpha-industries", "Sixty-one percent of parents said their child strongly influences family food choices, and 61% said children have final say on the family car.", "Industry findings section, household influence paragraph.", "self-reported"),
  fact("media-discovery-commerce", 1, "pwc-alpha-2026", "Sixty-one percent of children pointed to social media as a purchase trigger, while 68% used YouTube regularly and 54% used gaming platforms.", "Digital influence section, discovery and platform findings.", "self-reported"),
  fact("media-discovery-commerce", 2, "razorfish-alpha-industries", "Seventy-five percent were interested in beauty content on social media and 38% already made their own content.", "Industry findings section, social beauty paragraph.", "self-reported"),
  fact("media-repeatable-formats", 1, "ap-sports-alpha-2026", "Sports leagues used recurring creator partnerships, AI-assisted partner discovery, and youth-native meme formats to maintain relevance.", "Article body section on league youth-engagement formats.", "observed"),
  fact("media-repeatable-formats", 2, "razorfish-alpha-industries", "Thirty-eight percent of Alphas interested in beauty content said they already create content themselves, showing formats travel through imitation and making.", "Industry findings section, social beauty paragraph.", "self-reported"),
  fact("media-properties-travel", 1, "ap-sports-alpha-2026", "The NBA and NHL extended league culture through creators and social formats rather than relying only on live games and broadcasts.", "Article opening and league examples section.", "observed"),
  fact("media-properties-travel", 2, "pwc-alpha-2026", "Regular use crossed YouTube (68%), gaming platforms (54%), and streaming services (49%), giving entertainment properties multiple routes into children's attention.", "Digital influence section, platform-use findings.", "editorial inference"),
  fact("media-coviewing", 1, "pwc-alpha-2026", "Fifty-two percent of children added products to shared online carts for parental review before checkout.", "Independence gap section, shared-cart finding.", "self-reported"),
  fact("media-coviewing", 2, "common-sense-census-2025", "Young children's daily media time stayed near 2.5 hours as parents navigated a mix shifting toward games and short-form video.", "Key findings and family-guidance paragraphs.", "editorial inference"),
  fact("media-ai-recommendation", 1, "nielsen-ai-discovery-2026", "Forty-nine percent of Gen Alpha respondents chose AI chatbots as the best source for TV and movie recommendations, versus 41% for service guides and 11% for search results.", "News release, entertainment recommendation findings paragraph.", "self-reported"),
  fact("media-ai-recommendation", 2, "razorfish-alpha-ai", "Twenty-two percent of Alphas used AI daily and 12% used it several times a day, with fun and hobbies among the leading uses.", "AI day-to-day tool findings paragraph.", "self-reported"),
  fact("media-reach-risk", 1, "arxiv-young-user-safety-2025", "Fifteen percent of YouTube recommendations to age-13 accounts were rated harmful versus 8.17% for adult accounts, appearing after an average 3:06 of passive scrolling.", "Abstract, harmful recommendation findings.", "observed"),
  fact("media-reach-risk", 2, "ftc-coppa-2025", "The FTC barred covered services from conditioning participation on unnecessary data collection and required opt-in consent for targeted-advertising disclosures.", "FTC release, final-rule protections paragraphs.", "observed"),
  fact("time-screen-purpose", 1, "common-sense-census-2025", "Screen time remained near 2.5 hours daily while gaming rose 65% in four years, traditional TV declined, and short-form video grew.", "Key findings paragraph, time-use changes.", "self-reported"),
  fact("time-screen-purpose", 2, "screen-socioemotional-review-2025", "Longitudinal effects ran both ways and were small overall; the authors recommended emphasizing content quality and social interaction, not minutes alone.", "Abstract, bidirectional results and guidance conclusion.", "observed"),
  fact("time-device-access", 1, "common-sense-census-2025", "Forty percent of children had a tablet by age two, and nearly one in four had a personal cellphone by age eight.", "Key findings paragraph, device-access metrics.", "self-reported"),
  fact("time-device-access", 2, "pwc-alpha-2026", "Seventy percent owned a tablet and 72% used smartphones regularly; smartphone ownership rose from 46% at ages seven to nine to 89% at ages thirteen to fourteen.", "Digital world section, device ownership findings.", "self-reported"),
  fact("time-youtube-rhythm", 1, "common-sense-census-2025", "Children averaged about 2.5 hours of screen media every day as YouTube Shorts and other short-form video became a growing part of that routine.", "Key findings paragraph, daily media time and YouTube Shorts trend.", "self-reported"),
  fact("time-youtube-rhythm", 2, "pew-teens-social-2024", "Seventy-three percent of U.S. teens visited YouTube daily, including 15% who said their use was almost constant.", "How often teens visit platforms section, YouTube frequency paragraph.", "self-reported"),
  fact("time-parent-context", 1, "common-sense-ai-2026", "More than four in ten children said no parent or guardian had ever discussed AI safety with them.", "Opening findings paragraph, parent-guidance metric.", "self-reported"),
  fact("time-parent-context", 2, "ftc-coppa-2025", "COPPA's revised rule requires parents to opt in before covered services disclose children's data for targeted advertising.", "FTC release, parental consent paragraph.", "observed"),
  fact("time-family-needs", 1, "common-sense-census-2025", "Tablet access reached 40% by age two while average daily media use held near 2.5 hours, showing screens are integrated into early household routines.", "Key findings paragraph, device and daily-use metrics.", "editorial inference"),
  fact("time-family-needs", 2, "pwc-alpha-2026", "Sixty percent of children said an adult pays when they make purchases, illustrating that growing digital independence still relies on family infrastructure.", "Following the money section, payment findings.", "editorial inference"),
  fact("time-age-change", 1, "common-sense-census-2025", "Tablet ownership reached 40% by age two, while nearly one in four children had a personal cellphone by age eight.", "Key findings paragraph, age-based access metrics.", "self-reported"),
  fact("time-age-change", 2, "pwc-alpha-2026", "Smartphone ownership increased from 46% among seven- to nine-year-olds to 89% among thirteen- to fourteen-year-olds.", "Digital world section, age comparison paragraph.", "self-reported"),
  fact("time-nighttime-use", 1, "pew-teens-video-games-2024", "Forty-one percent of teen players said gaming hurt their sleep; among those who felt they played too much, two-thirds reported sleep loss.", "Views about video games' impact section, sleep findings.", "self-reported"),
  fact("time-nighttime-use", 2, "pew-teens-social-2024", "Forty-six percent of teens said they were online almost constantly, and 96% used the internet every day.", "Internet frequency section, constant-use findings.", "self-reported"),
  fact("time-coexistence", 1, "screen-socioemotional-review-2025", "The meta-analysis found small reciprocal associations between screen use and socioemotional problems and urged attention to content and social context.", "Abstract, bidirectional results and conclusion.", "observed"),
  fact("time-coexistence", 2, "razorfish-alpha-industries", "Sixty-six percent would pay more for something usable only in real life, twice the share preferring something solely online.", "Industry findings section, real-world experience paragraph.", "self-reported"),
  fact("time-private-day", 1, "pew-teens-social-2024", "Ninety-five percent of teens had smartphone access and 46% described being online almost constantly.", "Device access and internet frequency sections.", "self-reported"),
  fact("time-private-day", 2, "pwc-alpha-2026", "Seventy-two percent used smartphones regularly, and smartphone ownership reached 89% among thirteen- to fourteen-year-olds.", "Digital world section, device findings.", "self-reported"),
  fact("time-household-context", 1, "pew-teens-video-games-2024", "Daily gaming varied by household income: 53% below $30,000, 42% from $30,000 to $74,999, and 39% at $75,000 or more.", "Who plays video games section, household-income paragraph.", "self-reported"),
  fact("time-household-context", 2, "pwc-alpha-2026", "Adults paid for children's purchases in 60% of cases, while access and ownership rose sharply with age.", "Following the money and digital world sections.", "editorial inference"),
  fact("learning-assembled", 1, "generation-alpha-education-review-2024", "Across 83 studies, no digital educational tool or online strategy emerged as dominant, despite many approaches being tested.", "Abstract, synthesis findings paragraph.", "observed"),
  fact("learning-assembled", 2, "walton-creation-gaming-2024", "Expert interviews observed children seeking explanations across YouTube, TikTok, and Minecraft when school instruction left gaps.", "Report analysis section, expert interview paragraph on self-directed learning.", "qualitative"),
  fact("learning-creation-skills", 1, "walton-creation-gaming-2024", "Children identified creativity and problem-solving as skills learned through Roblox and Minecraft, and at least seven in ten wanted curriculum subjects taught there.", "Key Findings section, skills and formal education findings.", "self-reported"),
  fact("learning-creation-skills", 2, "razorfish-alpha-industries", "Thirty-eight percent of Alphas interested in beauty content said they already create their own content.", "Industry findings section, social beauty paragraph.", "self-reported"),
  fact("learning-ai-homework", 1, "common-sense-ai-2026", "More than eight in ten AI users used it for entertainment and homework help; over half of children struggling to focus used AI for schoolwork weekly.", "Opening findings and key findings section, schoolwork paragraphs.", "self-reported"),
  fact("learning-ai-homework", 2, "razorfish-alpha-ai", "Homework was the leading reported AI use at 53%, followed by fun or hobbies at 43% and use at school at 36%.", "AI day-to-day tool findings paragraph.", "self-reported"),
  fact("learning-ai-discovery", 1, "razorfish-alpha-ai", "Twenty-two percent used AI daily, with homework, hobbies, and school spanning instrumental and creative use.", "AI day-to-day tool findings paragraph.", "self-reported"),
  fact("learning-ai-discovery", 2, "nielsen-ai-discovery-2026", "Eighty percent of Gen Alpha respondents increased chatbot use in the prior 12 to 18 months, and more than half used chatbots daily.", "News release, chatbot adoption findings paragraph.", "self-reported"),
  fact("learning-safety-guidance", 1, "common-sense-ai-2026", "More than four in ten had never discussed AI safety with a parent, and only just over half had been taught safe AI use at school.", "Opening findings and key findings section, safety-guidance paragraphs.", "self-reported"),
  fact("learning-safety-guidance", 2, "razorfish-alpha-ai", "Parents' leading AI concerns included age-inappropriate content at 57%, reduced critical thinking at 56%, and misinformation at 53%.", "Parents and AI findings paragraph.", "self-reported"),
  fact("learning-verification", 1, "nielsen-ai-discovery-2026", "Three in four respondents verified chatbot answers, while traditional search led AI on trustworthiness by 50% to 27%.", "News release, trust and verification findings paragraphs.", "self-reported"),
  fact("learning-verification", 2, "common-sense-ai-2026", "Only one-third of children knew that AI cannot reliably distinguish fact from fiction.", "Key findings section, AI capability literacy paragraph.", "self-reported"),
  fact("learning-enablement", 1, "generation-alpha-education-review-2024", "The systematic review found many digital tools and online strategies under development, but no dominant approach and little evidence of true cohort differences.", "Abstract, synthesis findings and limitations paragraph.", "observed"),
  fact("learning-enablement", 2, "walton-creation-gaming-2024", "At least seven in ten children wanted to learn coding, art, or design through Roblox or Minecraft, tying value to enabled activity rather than hardware.", "Key Findings section, formal education finding.", "editorial inference"),
  fact("learning-remix", 1, "walton-creation-gaming-2024", "Children said building in Roblox and Minecraft develops creativity and problem-solving through active making.", "Key Findings section, cognitive development paragraph.", "self-reported"),
  fact("learning-remix", 2, "razorfish-alpha-industries", "Thirty-eight percent of Alphas interested in beauty media made content themselves, turning consumption into iterative self-presentation.", "Industry findings section, social beauty paragraph.", "editorial inference"),
  fact("learning-commercial-fluency", 1, "pwc-alpha-2026", "Ninety-seven percent said they make purchase decisions independently at least sometimes, and 61% used wish lists to plan requests.", "Opening findings and pint-sized negotiators section.", "self-reported"),
  fact("learning-commercial-fluency", 2, "razorfish-alpha-industries", "Children influenced household categories from food to cars, while two in three valued physical-only experiences over digital-only ones.", "Industry findings section, household influence and in-person experience paragraphs.", "self-reported"),
  fact("learning-multimodal", 1, "pwc-alpha-2026", "Children moved among touch, typing, and voice: 58% tapped or swiped, 50% typed, and 48% used voice commands.", "Digital world section, interaction-mode findings.", "self-reported"),
  fact("learning-multimodal", 2, "walton-creation-gaming-2024", "Children sought knowledge through YouTube, TikTok, and Minecraft and reported learning creativity and problem-solving through creation games.", "Report analysis section, expert interview and key findings paragraphs.", "qualitative"),
];

const claimKindByEvidenceType: Record<EvidenceType, EvidenceClaimKind> = {
  observed: "observed claim",
  "self-reported": "finding",
  qualitative: "finding",
  forecast: "finding",
  "platform-wide metric": "metric",
  "editorial inference": "editorial inference",
};

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
    const insight = insightSeeds.find((candidate) => candidate.id === item.insightId);
    if (!source) {
      throw new Error(`Unknown source ${item.sourceId} in ${item.insightId}`);
    }
    if (!insight) {
      throw new Error(`Unknown insight ${item.insightId}`);
    }

    return {
      id: `evidence-${item.insightId}-${item.slot}`,
      sourceId: item.sourceId,
      claim: item.claim,
      claimKind: claimKindByEvidenceType[item.evidenceType],
      supportRationale: `Directly substantiates "${insight.title}" by supporting its thesis: ${insight.thesis}`,
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
