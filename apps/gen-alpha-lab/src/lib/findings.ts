import type { ConfidenceLevel, ResearchRecord } from "./types";

export type TopicLens = {
  id: "connect" | "media" | "influence" | "time" | "learn" | "play-create" | "ai";
  label: string;
  description: string;
  findingIds: string[];
};

export type Finding = {
  id: string;
  topicId: TopicLens["id"];
  title: string;
  summary: string;
  interpretation: string;
  observations: string[];
  genZJuxtaposition: string;
  supportIds: string[];
  confidence: ConfidenceLevel;
  featured?: boolean;
  heroImage?: string;
  heroAlt?: string;
};

export const findingTopics: TopicLens[] = [
  {
    id: "connect",
    label: "Connect",
    description: "Friendship, family, communities, and communication norms.",
    findingIds: ["friendship-portable"]
  },
  {
    id: "media",
    label: "Media",
    description: "Video, creators, discovery, and the shared entertainment layer.",
    findingIds: ["video-default"]
  },
  {
    id: "influence",
    label: "Influence",
    description: "Parents, peers, creators, fandoms, and brands in the decision loop.",
    findingIds: ["influence-is-networked"]
  },
  {
    id: "time",
    label: "Time",
    description: "Routines, attention, family rules, and the texture of an on-demand day.",
    findingIds: ["time-is-managed"]
  },
  {
    id: "learn",
    label: "Learn",
    description: "School, tutorials, search, games, and informal skill building.",
    findingIds: ["learning-is-assembled"]
  },
  {
    id: "play-create",
    label: "Play & Create",
    description: "Games as social spaces for making, remixing, problem solving, and identity.",
    findingIds: ["creation-gaming-is-participatory"]
  },
  {
    id: "ai",
    label: "AI",
    description: "Ambient assistants, discovery, trust, safety, and literacy.",
    findingIds: ["ai-is-a-normal-interface"]
  }
];

export const findings: Finding[] = [
  {
    id: "friendship-portable",
    topicId: "connect",
    title: "Friendship moves across chat, play, and shared worlds.",
    summary:
      "For this cohort, connection is less a single platform than a continuous social layer that travels between messages, video, and games.",
    interpretation:
      "The useful planning question is not where friendship happens, but how a relationship carries forward when the activity changes.",
    observations: [
      "Social continuity matters more than any one app or game.",
      "Shared play creates a reason for chat, then chat keeps the group together after play ends."
    ],
    genZJuxtaposition:
      "Gen Z made social platforms the primary gathering place; Gen Alpha expects friendship to move fluidly through the activity itself.",
    supportIds: ["walton-creation-gaming-2024", "common-sense-census-2025"],
    confidence: "high",
    featured: true,
    heroImage: "/findings/connection.png",
    heroAlt: "Friends moving between chat and shared play"
  },
  {
    id: "video-default",
    topicId: "media",
    title: "Video is a living room, a search engine, and a lesson plan.",
    summary:
      "Video remains an everyday layer for entertainment and explanation, while AI-assisted discovery is changing how older Gen Alpha finds what to watch.",
    interpretation:
      "Media strategy has to account for discovery, instruction, and belonging at the same time rather than treating viewing as a single behavior.",
    observations: [
      "The same video environment can entertain, answer a question, and give a group something to discuss.",
      "Discovery is increasingly conversational as AI enters the recommendation layer."
    ],
    genZJuxtaposition:
      "Gen Z trained the feed; Gen Alpha increasingly treats video as an all-purpose interface for both finding and doing.",
    supportIds: ["common-sense-census-2025", "nielsen-ai-discovery-2026"],
    confidence: "high",
    featured: true,
    heroImage: "/findings/creation.png",
    heroAlt: "Kids discovering video, creators, and shared entertainment"
  },
  {
    id: "learning-is-assembled",
    topicId: "learn",
    title: "They learn by doing, with help on demand.",
    summary:
      "Formal school sits beside tutorials, play, search, and AI tools. The evidence points to a learning environment that is assembled across contexts.",
    interpretation:
      "Make the path to participation clear: show the skill, invite a first attempt, and leave room for social learning.",
    observations: [
      "Tutorials, games, school, search, and AI coexist in one assembled learning environment.",
      "A useful first step matters more than a polished lecture when help is available on demand."
    ],
    genZJuxtaposition:
      "Gen Z learned to search for answers; Gen Alpha is growing up with tools that can coach through the next attempt in real time.",
    supportIds: ["generation-alpha-education-review-2024", "walton-creation-gaming-2024"],
    confidence: "high",
    featured: true,
    heroImage: "/findings/learning-ai.png",
    heroAlt: "A child learning with on-demand AI support"
  },
  {
    id: "influence-is-networked",
    topicId: "influence",
    title: "Influence is a household and creator network, not a straight funnel.",
    summary:
      "Kids encounter ideas through social feeds and creators, but purchases and permissions still move through family conversations and shared carts.",
    interpretation:
      "Treat young people as active interpreters while designing for the adults who enable, explain, and sometimes decline the action.",
    observations: [
      "Creators and peers introduce ideas, while families often provide the permission and purchase path.",
      "The handoff between a child's interest and an adult's decision is part of the experience."
    ],
    genZJuxtaposition:
      "Gen Z creator culture centered public influence; Gen Alpha's influence loop is more visibly negotiated inside the household.",
    supportIds: ["pwc-alpha-2026", "ap-sports-alpha-2026"],
    confidence: "high"
  },
  {
    id: "time-is-managed",
    topicId: "time",
    title: "Digital time is real life, but it is still managed childhood.",
    summary:
      "Screen access is shaped by household rules, context, and content. Research cautions against reading duration alone as the whole story.",
    interpretation:
      "Look for the routines around a screen: who is present, what the child is doing, and what the activity displaces or enables.",
    observations: [
      "Screen time is shaped by household routines, not simply individual preference.",
      "Context can turn similar durations into very different experiences."
    ],
    genZJuxtaposition:
      "Gen Z's screen-time debate centered online identity; Gen Alpha's is more often about how digital life fits around managed family routines.",
    supportIds: ["pew-kids-screens-2025", "digital-wellbeing-review-2025"],
    confidence: "high"
  },
  {
    id: "creation-gaming-is-participatory",
    topicId: "play-create",
    title: "In creation gaming, playing and making are not separate modes.",
    summary:
      "Roblox and Minecraft can be places where kids build, collaborate, solve problems, and learn alongside play, not simply consume a finished game.",
    interpretation:
      "Creative invitations beat passive placements when the audience expects to shape a world, a character, or a shared joke.",
    observations: [
      "Making and playing are intertwined in the spaces children return to with friends.",
      "Participation is part of the reward, not an advanced feature for a smaller group."
    ],
    genZJuxtaposition:
      "Gen Z popularized creator tools; Gen Alpha meets creation as a default part of the play environment.",
    supportIds: ["walton-creation-gaming-2024", "pew-teens-video-games-2024"],
    confidence: "high"
  },
  {
    id: "ai-is-a-normal-interface",
    topicId: "ai",
    title: "AI is becoming a normal interface, not a separate category.",
    summary:
      "Older Gen Alpha is already using chatbots in entertainment discovery, while family guidance and safety literacy remain part of the experience.",
    interpretation:
      "Design for useful skepticism: children need ways to ask, compare, create, and check what a system gives back.",
    observations: [
      "AI is entering the everyday discovery and homework toolset rather than arriving as a standalone novelty.",
      "Guidance and verification become part of the interface experience."
    ],
    genZJuxtaposition:
      "Gen Z adapted to algorithmic feeds; Gen Alpha is learning to navigate systems that answer back.",
    supportIds: ["nielsen-ai-discovery-2026", "common-sense-chatgpt-video"],
    confidence: "high"
  }
];

export function getSupportingRecords(
  finding: Finding,
  records: ResearchRecord[]
): ResearchRecord[] {
  const recordById = new Map(records.map((record) => [record.id, record]));
  return finding.supportIds.flatMap((id) => {
    const record = recordById.get(id);
    return record ? [record] : [];
  });
}

export function getFindingById(id: string): Finding | undefined {
  return findings.find((finding) => finding.id === id);
}

export function validateFindings(
  draftFindings: Finding[],
  records: ResearchRecord[]
): string[] {
  const recordById = new Map(records.map((record) => [record.id, record]));
  const issues: string[] = [];

  for (const finding of draftFindings) {
    if (new Set(finding.supportIds).size !== finding.supportIds.length) {
      issues.push(`${finding.id} has duplicate supporting record IDs.`);
    }
    const support = finding.supportIds.map((id) => recordById.get(id)).filter(Boolean) as ResearchRecord[];
    if (support.length < 2) {
      issues.push(`${finding.id} requires at least two valid supporting records.`);
    }
    for (const record of support) {
      if (!isDirectUrl(record.url)) {
        issues.push(`${finding.id} support ${record.id} requires a valid direct URL.`);
      }
      if (!isSupportedFindingKind(record.kind)) {
        issues.push(`${finding.id} support ${record.id} must be a report, article, or podcast.`);
      }
      if (!record.sourceClass || record.sourceClass === "community") {
        issues.push(`${finding.id} support ${record.id} requires an explicit non-community source class.`);
      }
      if (record.confidence !== "medium" && record.confidence !== "high") {
        issues.push(`${finding.id} support ${record.id} requires medium or high confidence.`);
      }
    }
  }

  return issues;
}

function isSupportedFindingKind(kind: ResearchRecord["kind"]): boolean {
  return kind === "report" || kind === "article" || kind === "podcast";
}

function isDirectUrl(value: string | undefined): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}
