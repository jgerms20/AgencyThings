import type { ConfidenceLevel, EvidenceStatus, LinkedInsight, MarketLabel, RoomLens, RoomObject } from "./house-types";

const lab = "https://agencythings-gen-alpha.vercel.app";
const pewGaming = "https://www.pewresearch.org/internet/2024/05/09/teens-and-video-games-today/";
const pewSocial = "https://www.pewresearch.org/internet/2024/12/12/teens-social-media-and-technology-2024/";
const pewScreen = "https://www.pewresearch.org/internet/2024/03/11/how-teens-and-parents-approach-screen-time/";
const commonSense = "https://www.commonsensemedia.org/research/the-2025-common-sense-census-media-use-by-kids-zero-to-eight";
const ofcom = "https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/2026-children-and-parents-report/children-and-parents-media-use-and-attitudes-report-2025-6.pdf?v=418231";
const ofcomLives = "https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/childrens-media-lives-2025/childrens-media-lives-2025-summary-report.pdf?v=396299";
const ofcomNation = "https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025";
const pwc = "https://www.pwc.com/us/en/industries/consumer-markets/library/gen-alpha-survey-report.html";

function marketFromScope(scope: string): MarketLabel {
  const hasUS = /U\.S\./i.test(scope);
  const hasUK = /U\.K\./i.test(scope);
  if ((hasUS && hasUK) || /multi-study|multi-market|international/i.test(scope)) return "Global / multi-market";
  if (hasUS) return "U.S.";
  if (hasUK) return "U.K.";
  return "Market not published";
}

function finding(
  id: string,
  title: string,
  thesis: string,
  confidence: ConfidenceLevel,
  scope: string,
  sources: string[],
  sourceUrl: string,
  labPath: string,
  linkLabel?: string,
  evidenceStatus?: EvidenceStatus,
): LinkedInsight {
  return {
    id,
    title,
    thesis,
    confidence,
    evidenceCount: sources.length,
    evidenceStatus: evidenceStatus ?? (confidence === "high" ? "established" : confidence === "medium" ? "emerging signal" : "working hunch"),
    market: marketFromScope(scope),
    scope,
    sources,
    sourceUrl,
    labUrl: `${lab}${labPath}`,
    linkLabel,
  };
}

const boysObjects: RoomObject[] = [
  {
    id: "phone",
    label: "Open phone insights",
    object: "Phone + charger",
    title: "The phone feeds a video-first day",
    thesis: "For boys in current teen samples, YouTube is especially prominent while the phone still sits inside household rules, friendship, and self-regulation.",
    context: "The phone is not coded as a generic private screen here. It links the boys lens to video discovery, always-on contact, and the gap between personal access and personal independence.",
    accent: "#ff6b92",
    position: { x: 7, y: 69 },
    mobileFocus: { x: 9, y: 66 },
    insights: [
      finding("boys-youtube-frequency", "YouTube is especially habitual", "Teen boys report almost-constant YouTube use more often than girls: 19% versus 11%.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewSocial, "/gender#boys"),
      finding("boys-phone-self-check", "Heavy phone use is not a girls-only concern", "One-third of teen boys say they spend too much time on their smartphone, keeping self-regulation relevant in this room too.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewScreen, "/gender#boys"),
      finding("boys-creator-to-cart", "Creator-to-cart is a journey to investigate", "A creator mention may become a search, wish list, or shared cart before an adult decides whether to buy. The path is plausible; we still need to observe it directly.", "medium", "U.S. children 7–14; commerce hypothesis", ["PwC"], pwc, "/insights/learning-commercial-fluency", undefined, "working hunch"),
    ],
  },
  {
    id: "television",
    label: "Open television insights",
    object: "Television + video feed",
    title: "Video, sport, and walkthroughs share one screen",
    thesis: "Boys’ video culture often moves between creator spectacle, gaming walkthroughs, sports commentary, music, and shared household viewing.",
    context: "The television makes influence bigger than a single social app: the same creator, athlete, game, or challenge format can move from a phone to the biggest screen in the home.",
    accent: "#ff806b",
    position: { x: 73, y: 43 },
    mobileFocus: { x: 73, y: 43 },
    insights: [
      finding("boys-sport-video", "Sport and commentary are visible viewing routes", "Ofcom’s longitudinal sample found boys across ages enjoying sports content and commentary.", "medium", "U.K. children 8–18; qualitative sample", ["Ofcom Children’s Media Lives"], ofcomLives, "/gender#boys"),
      finding("boys-game-walkthroughs", "Walkthroughs turn play into watchable expertise", "Younger boys in Ofcom’s qualitative work particularly enjoyed game walkthrough content.", "medium", "U.K. children 8–18; qualitative sample", ["Ofcom Children’s Media Lives"], ofcomLives, "/gender#boys"),
      finding("media-video-default", "The TV is an everything screen", "Creator video, games, music, sport, search, and family ritual now overlap on the same display.", "high", "Children 0–17; multi-study", ["Common Sense Media", "Ofcom"], ofcom, "/insights/media-video-default"),
    ],
  },
  {
    id: "homework-desk",
    label: "Open homework desk insights",
    object: "Laptop + homework desk",
    title: "Skill culture moves from walkthrough to homework",
    thesis: "The desk connects a familiar learn-by-watching pattern to AI explanations, school platforms, search, and verification.",
    context: "There is no defensible boys-only AI behavior claim in the current evidence. The bespoke point is the route: expertise already modeled through walkthroughs and commentary can carry into a broader learning stack.",
    accent: "#6ef2ff",
    position: { x: 61, y: 49 },
    mobileFocus: { x: 61, y: 49 },
    insights: [
      finding("learning-ai-homework", "AI is already part of homework", "Conversational AI now sits beside search, video, teachers, and family help.", "medium", "Children 8–17; current U.S. and U.K. studies", ["Ofcom", "Common Sense Media"], ofcom, "/insights/learning-ai-homework"),
      finding("learning-verification", "Fluency is not the same as truth", "Children need visible prompts to verify confident AI answers and distinguish paid or generated content.", "high", "Children 8–17; U.K.", ["Ofcom"], ofcom, "/insights/learning-verification"),
      finding("learning-assembled", "Learning is assembled on demand", "A school question can move through a teacher, a tutorial, a chatbot, a game, and another person.", "medium", "School-age children; multi-study", ["Ofcom", "Systematic education review"], ofcom, "/insights/learning-assembled"),
    ],
  },
  {
    id: "game-console",
    label: "Open console insights",
    object: "Console + headset",
    title: "Console identity is unusually strong here",
    thesis: "Boys report more console access, daily play, competition, gamer identity, and gaming-based friendship—alongside more direct harassment.",
    context: "The headset is both social infrastructure and a safety cue. This is the room’s sharpest measured difference, but it still describes group patterns rather than an assumption about any individual boy.",
    accent: "#a78bfa",
    position: { x: 80, y: 69 },
    mobileFocus: { x: 80, y: 64 },
    insights: [
      finding("boys-console-access", "Console access is a material gender gap", "62% of U.K. boys ages 3–17 use consoles for gaming versus 38% of girls; Pew also finds a U.S. teen access gap.", "high", "U.K. children 3–17 and U.S. teens 13–17", ["Ofcom", "Pew Research Center"], ofcom, "/gender#boys"),
      finding("boys-gamer-identity", "Playing becomes a public identity", "62% of teen boys who play call themselves gamers, compared with 17% of girl players.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewGaming, "/gender#boys"),
      finding("play-social-infrastructure", "The console is a recurring friendship place", "94% of teen boy players play with others in person or online.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewGaming, "/insights/play-social-infrastructure"),
    ],
  },
  {
    id: "backpack",
    label: "Open backpack insights",
    object: "Backpack + school notebook",
    title: "School moves through a screen-heavy day",
    thesis: "Boys ages 0–8 average more total screen time, while reading happens less often than it does for girls in the same national sample.",
    context: "The backpack grounds the gender gap in a real developmental routine: schoolwork, reading, games, videos, friendship, and family expectations all move through the same day.",
    accent: "#9be15d",
    position: { x: 31, y: 86 },
    mobileFocus: { x: 31, y: 78 },
    insights: [
      finding("boys-screen-day", "Screen time is longer in early childhood", "Boys ages 0–8 average 2:38 of daily screen media versus 2:07 for girls.", "high", "U.S. children 0–8; parent report", ["Common Sense Media"], commonSense, "/gender#boys"),
      finding("boys-reading-gap", "Daily reading is less common", "50% of boys ages 0–8 read or are read to daily, compared with 59% of girls.", "high", "U.S. children 0–8; parent report", ["Common Sense Media"], commonSense, "/gender#boys"),
      finding("learning-enablement", "The activity matters more than the hardware", "The useful question is what a device enables and who helps a child use it well.", "high", "School-age children; evidence synthesis", ["Systematic education review"], commonSense, "/insights/learning-enablement"),
    ],
  },
  {
    id: "book-shelf",
    label: "Open toy and story shelf insights",
    object: "Figures + story shelf",
    title: "Building, collecting, and fandom rehearse identity",
    thesis: "Figures, lore, building games, sport stories, and avatar style are connected ways to practice mastery and signal affiliation.",
    context: "The shelf keeps the boys lens from collapsing into screens. Physical objects, collections, books, and digital worlds can reinforce the same interests and social identity.",
    accent: "#ffd27a",
    position: { x: 68, y: 25 },
    mobileFocus: { x: 68, y: 31 },
    insights: [
      finding("boys-building-games", "Creative and building games lead the category", "54% of U.K. children who game name creative and building games among the most popular types.", "high", "U.K. children 3–17", ["Ofcom"], ofcom, "/gender#boys"),
      finding("play-avatars-identity", "Avatar style carries affiliation", "Digital appearance lets children rehearse aesthetics, roles, teams, and group belonging.", "medium", "Children and young people; platform and industry studies", ["Roblox", "Razorfish"], ofcom, "/insights/play-avatars-identity"),
      finding("media-properties-travel", "Stories travel between shelf and screen", "A world can enter through a figure, a clip, a game, a creator, a book, or a stream.", "medium", "Young audiences; multi-market", ["Ofcom", "PwC"], ofcomLives, "/insights/media-properties-travel"),
    ],
  },
  {
    id: "caregiver-door",
    label: "Open caregiver and safety insights",
    object: "Open caregiver door",
    title: "More gaming contact also means more safety work",
    thesis: "Boys report more name-calling and physical threats in games, making household conversation and platform controls part of the social-play experience.",
    context: "The door represents trust and support rather than surveillance: adults help set contact, payment, privacy, reporting, and bedtime rules around an increasingly social room.",
    accent: "#fff0bd",
    position: { x: 92, y: 58 },
    mobileFocus: { x: 90, y: 56 },
    insights: [
      finding("boys-gaming-name-calling", "Harassment rises with participation", "48% of teen boy players report being called an offensive name in a game versus 32% of girl players.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewGaming, "/gender#boys"),
      finding("play-safety-boundaries", "Safety belongs inside the play design", "Privacy, consent, reporting, contact controls, and escalation should be visible before a problem occurs.", "high", "Children in online games; policy context", ["Ofcom", "UNICEF"], ofcom, "/insights/play-safety-boundaries"),
      finding("time-parent-context", "Adults manage context, not only minutes", "Permission, content, payment, bedtime, and conversation shape what the device means.", "high", "Children and families", ["Common Sense Media", "Ofcom"], commonSense, "/insights/time-parent-context"),
    ],
  },
  {
    id: "outside-window",
    label: "Open sport and outside insights",
    object: "Window + bike + ball",
    title: "Sport is part of the same identity system",
    thesis: "Boys are more likely to nominate sports as a favorite activity, and athletes, games, clips, and neighborhood play often reinforce one another.",
    context: "The window connects movement, local friendship, and sports fandom to the screen-based room. It is not an online-versus-offline choice; it is one social map.",
    accent: "#c7ff75",
    position: { x: 39, y: 38 },
    mobileFocus: { x: 39, y: 39 },
    insights: [
      finding("boys-sport-choice", "Sports are a more common favorite", "34% of U.K. boys ages 8–17 select sports among their top three free-time activities versus 12% of girls.", "high", "U.K. children 8–17", ["Ofcom"], ofcom, "/gender#boys"),
      finding("play-friendship-travels", "Friendship travels between settings", "The same group can move from game chat to school, a court, a bike ride, and back.", "high", "Children and teens 8–17", ["Ofcom", "Pew Research Center"], ofcom, "/insights/play-friendship-travels"),
      finding("play-offline-rebound", "Physical play remains real infrastructure", "Sport and outdoor participation belong in the same day-level analysis as screen use.", "medium", "U.S. youth 6–17", ["Aspen Institute Project Play"], ofcom, "/insights/play-offline-rebound"),
    ],
  },
  {
    id: "influencer-poster",
    label: "Open boys’ influencer poster insights",
    object: "Creator + athlete poster",
    title: "Influence looks like skill, spectacle, and repeatable formats",
    thesis: "The poster opens the people layer: creators and athletes turn mastery, competition, humor, and challenge formats into identities children can follow and replay.",
    context: "These are visible culture shapers, not a universal boys list. The useful question is what role each person plays—expert, entertainer, athlete, host, or template-maker.",
    accent: "#54e7ff",
    position: { x: 92, y: 29 },
    mobileFocus: { x: 89, y: 31 },
    insights: [
      finding("poster-ishowspeed", "IShowSpeed turns intensity into a format", "High-energy live reaction, football fandom, and clip-ready spectacle make the persona travel across platforms.", "medium", "Creator profile; cultural signal", ["IShowSpeed official channel"], "https://www.youtube.com/@IShowSpeed", "/influencers/ishowspeed", "Open IShowSpeed profile"),
      finding("poster-dude-perfect", "Dude Perfect packages skill as repeatable challenge", "Trick shots, teams, and friendly competition create a format children can imitate together.", "medium", "Creator profile; cultural signal", ["Dude Perfect official channel"], "https://www.youtube.com/@dudeperfect", "/influencers/dude-perfect", "Open Dude Perfect profile"),
      finding("poster-mrbeast", "MrBeast makes scale itself part of the story", "Simple stakes, visible rules, and escalating spectacle create instantly legible participation templates.", "medium", "Creator profile; cultural signal", ["MrBeast official channel"], "https://www.youtube.com/@MrBeast", "/influencers/mrbeast", "Open MrBeast profile"),
    ],
  },
];

const girlsObjects: RoomObject[] = [
  {
    id: "phone",
    label: "Open phone insights",
    object: "Phone + charger",
    title: "Connection and pressure occupy the same device",
    thesis: "Girls report more TikTok and Instagram use, more friendship benefit online, and more pressure to be popular—three parts of one social system.",
    context: "The phone holds the contradiction rather than a stereotype: it can maintain closeness, support discovery, and make social evaluation feel continuously present.",
    accent: "#ff7ab8",
    position: { x: 7, y: 69 },
    mobileFocus: { x: 9, y: 67 },
    insights: [
      finding("girls-social-platforms", "TikTok and Instagram are more common", "66% of U.S. teen girls use each platform, compared with 59% and 56% of boys respectively.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewSocial, "/gender#girls"),
      finding("girls-friendship-benefit", "Online contact is more often credited with closeness", "71% of U.K. girls ages 13–17 say being online helps build and maintain friendships versus 60% of boys.", "high", "U.K. teens 13–17; near-age proxy", ["Ofcom"], ofcomNation, "/gender#girls"),
      finding("girls-creator-to-cart", "Creator-to-cart is a journey to investigate", "A creator or family video may become a search, comparison, wish list, or shared cart before a caregiver decides. We have the pieces, not yet the full journey.", "medium", "U.S. children 7–14; commerce hypothesis", ["PwC"], pwc, "/insights/learning-commercial-fluency", undefined, "working hunch"),
    ],
  },
  {
    id: "television",
    label: "Open television insights",
    object: "Television + video feed",
    title: "Video folds together lifestyle, music, fandom, and story",
    thesis: "Girls’ viewing in current qualitative work more visibly includes lifestyle formats, while music, social video, streaming, gaming, and family viewing remain entangled.",
    context: "The television resists the idea that influence lives only in a phone feed. A creator format, artist, story world, or women’s sports moment can travel across screens and into conversation.",
    accent: "#ff8a73",
    position: { x: 94, y: 49 },
    mobileFocus: { x: 91, y: 49 },
    insights: [
      finding("girls-lifestyle-video", "Lifestyle formats are a visible route", "Ofcom’s longitudinal qualitative sample found lifestyle content popular with girls across ages.", "medium", "U.K. children 8–18; qualitative sample", ["Ofcom Children’s Media Lives"], ofcomLives, "/gender#girls"),
      finding("girls-music-audio", "Music and audio rank higher in free time", "24% of U.K. girls ages 8–17 select music, radio, or podcasts among their top three activities versus 15% of boys.", "high", "U.K. children 8–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("media-video-default", "The screen is a route, not a channel", "Video can be entertainment, search, fandom, music, sport, and a shared household ritual at once.", "high", "Children 0–17; multi-study", ["Common Sense Media", "Ofcom"], ofcom, "/insights/media-video-default"),
    ],
  },
  {
    id: "homework-desk",
    label: "Open homework desk insights",
    object: "Laptop + maker desk",
    title: "Learning, AI, and making share one work surface",
    thesis: "The girls lens connects a stronger early reading signal to AI explanations, school platforms, tutorials, drawing, and hands-on making.",
    context: "This is not a claim that girls use AI differently. It shows a broader learning ecology where text, conversation, video, craft, and digital tools can support the same question.",
    accent: "#78f0e5",
    position: { x: 40, y: 53 },
    mobileFocus: { x: 40, y: 53 },
    insights: [
      finding("girls-reading-routine", "Daily reading is more common", "59% of girls ages 0–8 read or are read to daily, compared with 50% of boys.", "high", "U.S. children 0–8; parent report", ["Common Sense Media"], commonSense, "/gender#girls"),
      finding("learning-ai-homework", "AI joins an existing learning stack", "Children use AI for learning, creativity, and everyday tasks while still needing verification and adult support.", "medium", "Children 8–17; current U.S. and U.K. studies", ["Ofcom", "Common Sense Media"], ofcom, "/insights/learning-ai-homework"),
      finding("learning-remix", "Making connects consumption to authorship", "Drawing, craft, digital creation, avatars, and stories give children a meaningful role inside culture.", "medium", "Children and young people; multi-study", ["Walton Family Foundation", "Ofcom"], ofcom, "/insights/learning-remix"),
    ],
  },
  {
    id: "game-console",
    label: "Open console insights",
    object: "Console + controllers",
    title: "Girls game; the genre and device mix is different",
    thesis: "The real finding is not absence: 86% of U.K. girls ages 3–17 game, with puzzles, quizzes, fitness, dance, and makeover play more prominent.",
    context: "The console challenges the stereotype embedded in the boys room. Girls’ gaming is widespread even when console ownership, daily frequency, and gamer identity are lower.",
    accent: "#b99aff",
    position: { x: 88, y: 71 },
    mobileFocus: { x: 86, y: 67 },
    insights: [
      finding("girls-game-reach", "Gaming is close to universal, not niche", "86% of U.K. girls ages 3–17 play games on some kind of device, compared with 91% of boys.", "high", "U.K. children 3–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("girls-game-genres", "Genre differences change what ‘gaming’ looks like", "Girls are more likely than boys to play puzzles, quizzes, fitness, dance, and makeover games.", "high", "U.K. children 3–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("girls-social-play", "Most girl players still play with others", "82% of U.S. teen girl players play with other people in person or online.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewGaming, "/insights/play-social-infrastructure"),
    ],
  },
  {
    id: "backpack",
    label: "Open backpack insights",
    object: "Backpack + school notebook",
    title: "School, reading, music, and friends travel together",
    thesis: "Girls’ daily routine shows stronger reported reading, family, and audio signals without making school or media a single-track identity.",
    context: "The backpack is a bridge across contexts: print, school platforms, a group chat, a playlist, sport, and a half-finished creative project can all travel through one day.",
    accent: "#a9e66f",
    position: { x: 33, y: 84 },
    mobileFocus: { x: 33, y: 78 },
    insights: [
      finding("girls-family-time", "Family is more often named as a favorite", "30% of U.K. girls ages 8–17 select being with family among their top three free-time activities versus 23% of boys.", "high", "U.K. children 8–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("girls-daily-reading", "Print remains a meaningful routine", "Girls ages 0–8 are more likely to read or be read to daily: 59% versus 50% of boys.", "high", "U.S. children 0–8; parent report", ["Common Sense Media"], commonSense, "/gender#girls"),
      finding("learning-assembled", "Learning crosses the bell schedule", "School, video, books, search, a chatbot, and another person can combine around one need.", "medium", "School-age children; multi-study", ["Ofcom", "Systematic education review"], ofcom, "/insights/learning-assembled"),
    ],
  },
  {
    id: "book-shelf",
    label: "Open books and maker shelf insights",
    object: "Books + maker shelf",
    title: "Reading and making are identity work too",
    thesis: "Books, drawing, collectibles, craft, music, and avatar styling are not separate hobbies; they are ways to rehearse taste and make culture tangible.",
    context: "The shelf gives the girls room a physical center of gravity. It shows an active child who reads, remixes, builds, collects, and makes—not a passive social-feed audience.",
    accent: "#ffd27a",
    position: { x: 68, y: 35 },
    mobileFocus: { x: 68, y: 37 },
    insights: [
      finding("girls-reading-shelf", "Reading has a measurable early-childhood edge", "Daily reading is nine points higher among girls ages 0–8 in the 2025 Common Sense Census.", "high", "U.S. children 0–8; parent report", ["Common Sense Media"], commonSense, "/gender#girls"),
      finding("girls-maker-role", "Creation gives the child a role", "Making art, stories, avatars, and objects turns influence into participation and authorship.", "medium", "Children and young people; evidence synthesis", ["Ofcom", "Walton Family Foundation"], ofcom, "/insights/learning-remix"),
      finding("media-properties-travel", "Fandom crosses physical and digital objects", "A story or creator can enter through a book, collectible, clip, game, stream, or handmade object.", "medium", "Young audiences; multi-market", ["Ofcom", "PwC"], ofcomLives, "/insights/media-properties-travel"),
    ],
  },
  {
    id: "caregiver-door",
    label: "Open caregiver and safety insights",
    object: "Open caregiver door",
    title: "Popularity pressure changes the safety conversation",
    thesis: "Girls more often report social popularity pressure and excessive phone time, so adult support must include social context—not only minutes and app bans.",
    context: "The open door represents a child who can bring a problem to someone without losing every connection. Privacy, trust, reporting, and a non-punitive exit route belong together.",
    accent: "#fff0bd",
    position: { x: 84, y: 47 },
    mobileFocus: { x: 83, y: 49 },
    insights: [
      finding("girls-too-much-phone", "Phone time is more often judged as excessive", "44% of U.S. teen girls say they spend too much time on their smartphone versus 33% of boys.", "high", "U.S. teens 13–17; near-age proxy", ["Pew Research Center"], pewScreen, "/gender#girls"),
      finding("girls-popularity-safety", "Social pressure is part of online safety", "Girls report more pressure to be popular on social and messaging services, especially at ages 13–15.", "high", "U.K. children 8–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("time-parent-context", "Adults manage relationships and context", "The useful boundary covers privacy, contact, purchases, sleep, reporting, and conversation—not only screen minutes.", "high", "Children and families", ["Common Sense Media", "Ofcom"], commonSense, "/insights/time-parent-context"),
    ],
  },
  {
    id: "outside-window",
    label: "Open sport and outside insights",
    object: "Window + bike + basketball",
    title: "Sport culture is expanding the visible girls’ room",
    thesis: "Girls nominate sport less often than boys, but women athletes, dance and fitness play, school teams, and outdoor friendship create an important counter-pattern.",
    context: "The window deliberately refuses a social-video-only room. It holds movement, local friendship, and the growing influence of women’s sport beside the digital culture inside.",
    accent: "#c7ff75",
    position: { x: 49, y: 38 },
    mobileFocus: { x: 49, y: 39 },
    insights: [
      finding("girls-sport-gap", "The reported sport gap is real but not destiny", "12% of U.K. girls ages 8–17 name sports among their top three activities versus 34% of boys.", "high", "U.K. children 8–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("girls-fitness-play", "Fitness and dance also appear inside games", "Girls are more likely than boys to play fitness and dance game genres, linking screen play and movement.", "high", "U.K. children 3–17", ["Ofcom"], ofcom, "/gender#girls"),
      finding("play-friendship-travels", "Friendship crosses screens and physical places", "The same relationships move through group chats, games, school, sport, and hanging out.", "high", "Children and teens 8–17", ["Ofcom", "Pew Research Center"], ofcomNation, "/insights/play-friendship-travels"),
    ],
  },
  {
    id: "influencer-poster",
    label: "Open girls’ influencer poster insights",
    object: "Creator + athlete poster",
    title: "Influence spans making, storytelling, and athletic visibility",
    thesis: "The girls’ poster opens a different people layer: creators and athletes model craft, narrative, competition, confidence, and formats children can adapt themselves.",
    context: "These profiles are not a universal girls list. Together they show why influence should be mapped by the role a person plays, not reduced to follower count or a single platform.",
    accent: "#ff8fd4",
    position: { x: 18, y: 22 },
    mobileFocus: { x: 20, y: 25 },
    insights: [
      finding("poster-aphmau", "Aphmau turns play into serialized friendship stories", "Role-play, recurring characters, and game worlds make the channel feel closer to an ongoing series than a one-off clip.", "medium", "Creator profile; cultural signal", ["Aphmau official channel"], "https://www.youtube.com/@Aphmau", "/influencers/aphmau", "Open Aphmau profile"),
      finding("poster-moriah-elizabeth", "Moriah Elizabeth makes craft visibly iterative", "The appeal is not only the finished object; process, repair, humor, and a repeatable making format are part of the influence.", "medium", "Creator profile; cultural signal", ["Moriah Elizabeth official channel"], "https://www.youtube.com/@MoriahElizabeth", "/influencers/moriah-elizabeth", "Open Moriah Elizabeth profile"),
      finding("poster-salish-matter", "Salish Matter packages growing up as participatory story", "Challenges, family context, sport, and milestone narratives create an accessible near-peer format.", "medium", "Creator profile; cultural signal", ["Salish Matter official channel"], "https://www.youtube.com/@salishmatter", "/influencers/salish-matter", "Open Salish Matter profile"),
    ],
  },
];

export const roomLenses: RoomLens[] = [
  {
    id: "boys",
    label: "Boys’ room",
    title: "The boys’ room",
    framing: "A research lens on patterns that currently over-index among boys—never a prediction about an individual child.",
    imageSrc: "/gen-alpha-bedroom.jpg",
    imageAlt: "Gen Alpha boys’ room with a phone, television, homework desk, console, backpack, figures, influencer poster, open caregiver door, and a window onto a bike",
    accent: "#6ef2ff",
    objects: boysObjects,
  },
  {
    id: "girls",
    label: "Girls’ room",
    title: "The girls’ room",
    framing: "A research lens on patterns that currently over-index among girls, including the contradictions that broad audience labels usually miss.",
    imageSrc: "/gen-alpha-girls-bedroom.png",
    imageAlt: "Gen Alpha girls’ room with a phone, television, maker desk, console, backpack, books, influencer poster, open caregiver door, and a window onto a bicycle and basketball",
    accent: "#ff8fd4",
    objects: girlsObjects,
  },
];

export const roomObjects = roomLenses[0].objects;
