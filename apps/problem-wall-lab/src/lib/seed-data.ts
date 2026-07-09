import type { ClientBrief, SourceSignal } from "./types";

export const clientBriefs: ClientBrief[] = [
  {
    id: "directv",
    name: "DIRECTV",
    strategist: "Patrick Cooper",
    email: "Patrick.Cooper@omc.com",
    positioning: "The ultimate entertainment hub",
    tone: "Humorous, light-hearted, witty",
    objectives: [
      "Grow awareness that DIRECTV streams without satellite",
      "Get credit for solving content fragmentation",
      "Make genre packs feel like a smarter TV bundle"
    ],
    audiences: ["streamers", "sports fans", "families", "young TV viewers"],
    problemTerritories: ["fragmented viewing", "sports access", "streaming fatigue", "family screen time"],
    opportunityVerbs: ["help", "turn", "prove"]
  },
  {
    id: "gatorade",
    name: "Gatorade",
    strategist: "Stephanie Berenson",
    email: "Stephanie.berenson@omc.com",
    positioning: "The leader in hydration science for every/body",
    tone: "Fearless, knowledgeable, spirited, inspiring",
    objectives: [
      "Make dehydration feel urgent",
      "Expand beyond elite athletes",
      "Make hydration science more accessible"
    ],
    audiences: ["everyday hydration seekers", "neurodivergent people", "workers in heat", "women"],
    problemTerritories: ["hydration friction", "body signal gaps", "heat safety", "science fatigue"],
    opportunityVerbs: ["help", "prove", "normalize"]
  },
  {
    id: "ghirardelli",
    name: "Ghirardelli",
    strategist: "Katie Acosta",
    email: "Katie.Acosta@omc.com",
    positioning: "Everything tastes better with Ghirardelli",
    tone: "Down-to-earth, quietly confident, naturally charming",
    objectives: [
      "Own real chocolate quality",
      "Defend premium seasonal leadership",
      "Give the brand sharper cultural cachet"
    ],
    audiences: ["home bakers", "holiday hosts", "premium chocolate shoppers"],
    problemTerritories: ["real chocolate", "treat culture", "holiday pressure", "premium quality"],
    opportunityVerbs: ["authenticate", "save", "celebrate"]
  },
  {
    id: "constant-contact",
    name: "Constant Contact",
    strategist: "Amy Wu",
    email: "Amy.Wu@omc.com",
    positioning: "The AI partner for small business growth",
    tone: "Human, optimistic, visionary, charming",
    objectives: [
      "Reposition beyond email marketing",
      "Champion small businesses using AI",
      "Win younger and social-native entrepreneurs"
    ],
    audiences: ["small business owners", "side hustlers", "solo entrepreneurs"],
    problemTerritories: ["AI backlash", "time poverty", "social commerce", "marketing overwhelm"],
    opportunityVerbs: ["protect", "fill in", "teach"]
  },
  {
    id: "jack-in-the-box",
    name: "Jack in the Box",
    strategist: "Cassidy Wilber",
    email: "Cassidy.Wilber@omc.com",
    positioning: "A challenger QSR with permission to be weird and useful",
    tone: "Playful, irreverent, opportunistic",
    objectives: [
      "Make store visits feel culturally current",
      "Use menu assets in ownable ways",
      "Show up for high-density regional communities"
    ],
    audiences: ["late-night diners", "Hispanic consumers", "QSR loyalists", "franchisees"],
    problemTerritories: ["menu distinctiveness", "restaurant operations", "community trust", "store revitalization"],
    opportunityVerbs: ["unlock", "protect", "remix"]
  },
  {
    id: "amd",
    name: "AMD",
    strategist: "Kirk Vaclavik",
    email: "Kirk.Vaclavik@omc.com",
    positioning: "Together we advance",
    tone: "Elevated, substantive, collaborative leader",
    objectives: [
      "Reappraise AMD as a leader",
      "Compete with Nvidia's AI dominance",
      "Make open ecosystem strength more visible"
    ],
    audiences: ["enterprise buyers", "developers", "AI builders", "hardware partners"],
    problemTerritories: ["AI infrastructure", "developer preference", "open ecosystems", "trust in chips"],
    opportunityVerbs: ["advance", "prove", "open"]
  },
  {
    id: "synopsys",
    name: "Synopsys",
    strategist: "Patrick Cooper",
    email: "Patrick.Cooper@omc.com",
    positioning: "Push what's possible",
    tone: "Action-oriented, urgent, energetic, empowering",
    objectives: [
      "Make invisible engineering impact visible",
      "Explain the Ansys merger",
      "Find more cultural proof of simulation and chip design"
    ],
    audiences: ["engineers", "AI hardware teams", "students", "innovation leaders"],
    problemTerritories: ["simulation", "engineering complexity", "AI chips", "university preference"],
    opportunityVerbs: ["accelerate", "simulate", "prove"]
  }
];

export const seedSignals: SourceSignal[] = [
  {
    id: "nd-hydration-signals",
    title: "Neurodivergent adults describe missing thirst cues until symptoms become disruptive",
    source: "Community hydration scan",
    sourceType: "community",
    publishedAt: "2026-07-06",
    audience: "neurodivergent adults",
    behavior: "miss thirst signals until symptoms become disruptive",
    tension: "most reminders feel like extra executive-function work",
    stat: "64% say body-signal reminders are easier to ignore than environmental cues",
    urgency: "summer heat is increasing daily dehydration risk",
    whyItMatters: "poor hydration can impair focus, mood, and physical safety",
    tags: ["hydration", "neurodivergence", "summer", "fallback"]
  },
  {
    id: "construction-heat-productivity",
    title: "Heat stress is hitting construction productivity and worker safety",
    source: "New study scan",
    sourceType: "study",
    publishedAt: "2026-07-04",
    audience: "construction workers",
    behavior: "lose productivity and safety margin on high-heat job sites",
    tension: "rest, shade, and water rules are uneven while heat waves intensify",
    stat: "heat stress is responsible for 29% to 41% productivity losses on job sites",
    urgency: "OSHA heat-rule debates are putting employer responsibility in focus",
    whyItMatters: "the cost of inaction can become injury or death, not just lost output",
    tags: ["hydration", "heat", "workers", "fallback"]
  },
  {
    id: "post-series-depression",
    title: "Streamers report post-series depression after finishing beloved shows",
    source: "Entertainment behavior scan",
    sourceType: "report",
    publishedAt: "2026-07-02",
    audience: "streamers",
    behavior: "spiral after a favorite show ends",
    tension: "recommendation engines solve what to watch, not the emotional comedown",
    stat: "post-series depression is now appearing in medical and behavioral research",
    urgency: "prestige TV finales keep creating collective cultural comedowns",
    whyItMatters: "the end of a show can make viewers feel directionless instead of satisfied",
    tags: ["streaming", "television", "mental-health", "fallback"]
  },
  {
    id: "real-chocolatey-switch",
    title: "Chocolatey coatings are replacing real chocolate while shoppers barely notice",
    source: "Retail ingredient scan",
    sourceType: "news",
    publishedAt: "2026-07-05",
    audience: "premium chocolate shoppers",
    behavior: "buy chocolatey products that sound like real chocolate",
    tension: "labels meet legal standards while hiding a quality downgrade in plain sight",
    stat: "brands can swap cocoa butter for vegetable oil by changing chocolate to chocolatey",
    urgency: "high cocoa prices are increasing pressure to cheapen ingredients",
    whyItMatters: "shoppers are paying premium prices while losing the ingredient they came for",
    tags: ["real-chocolate", "ingredients", "retail", "fallback"]
  },
  {
    id: "sbo-ai-backlash",
    title: "Small business owners need AI help but fear sounding synthetic",
    source: "Small business social scan",
    sourceType: "community",
    publishedAt: "2026-07-07",
    audience: "small business owners",
    behavior: "use AI marketing tools while worrying customers will judge the output",
    tension: "solo operators cannot afford not to use AI, but backlash hits their personal reputation",
    stat: "SBOs are among the fastest adopters of AI content tools",
    urgency: "AI-native competitors are making daily content expectations harder to meet",
    whyItMatters: "the people most helped by AI are also the most exposed when it feels inhuman",
    tags: ["small-business", "ai-backlash", "marketing", "fallback"]
  },
  {
    id: "open-ai-chip-trust",
    title: "Developers want open AI infrastructure but default to the most familiar stack",
    source: "Developer forum scan",
    sourceType: "reddit",
    publishedAt: "2026-07-03",
    audience: "AI developers",
    behavior: "choose familiar GPU ecosystems even when open alternatives fit the job",
    tension: "hardware trust is built in forums and docs long before enterprise buyers show up",
    stat: "developer preference often starts with the first stack that makes a prototype work",
    urgency: "AI infrastructure decisions are locking in now for the next product cycle",
    whyItMatters: "open ecosystems lose if developers never feel the first moment of ease",
    tags: ["ai", "developers", "chips", "open-ecosystem", "fallback"]
  },
  {
    id: "simulation-culture-gap",
    title: "Simulation shapes culture, but most people never see the software behind it",
    source: "Engineering culture scan",
    sourceType: "report",
    publishedAt: "2026-07-01",
    audience: "innovation leaders",
    behavior: "celebrate breakthrough products without knowing what made them possible",
    tension: "simulation is everywhere in sports, space, fashion, and health but remains invisible",
    stat: "advanced simulation is used to test aerodynamic clothing, vehicles, robotics, and chips",
    urgency: "AI hardware and physical product timelines are accelerating together",
    whyItMatters: "the ingredient brand behind breakthroughs misses credit for making bold ideas real",
    tags: ["simulation", "engineering", "culture", "fallback"]
  }
];
