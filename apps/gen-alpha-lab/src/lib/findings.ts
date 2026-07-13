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
  supportIds: string[];
  confidence: ConfidenceLevel;
  featured?: boolean;
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
    supportIds: ["walton-creation-gaming-2024", "common-sense-census-2025"],
    confidence: "high",
    featured: true
  },
  {
    id: "video-default",
    topicId: "media",
    title: "Video is a living room, a search engine, and a lesson plan.",
    summary:
      "Video remains an everyday layer for entertainment and explanation, while AI-assisted discovery is changing how older Gen Alpha finds what to watch.",
    interpretation:
      "Media strategy has to account for discovery, instruction, and belonging at the same time rather than treating viewing as a single behavior.",
    supportIds: ["common-sense-census-2025", "nielsen-ai-discovery-2026"],
    confidence: "high",
    featured: true
  },
  {
    id: "learning-is-assembled",
    topicId: "learn",
    title: "They learn by doing, with help on demand.",
    summary:
      "Formal school sits beside tutorials, play, search, and AI tools. The evidence points to a learning environment that is assembled across contexts.",
    interpretation:
      "Make the path to participation clear: show the skill, invite a first attempt, and leave room for social learning.",
    supportIds: ["generation-alpha-education-review-2024", "walton-creation-gaming-2024"],
    confidence: "high",
    featured: true
  },
  {
    id: "influence-is-networked",
    topicId: "influence",
    title: "Influence is a household and creator network, not a straight funnel.",
    summary:
      "Kids encounter ideas through social feeds and creators, but purchases and permissions still move through family conversations and shared carts.",
    interpretation:
      "Treat young people as active interpreters while designing for the adults who enable, explain, and sometimes decline the action.",
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

export function validateFindings(
  draftFindings: Finding[],
  records: ResearchRecord[]
): string[] {
  const recordById = new Map(records.map((record) => [record.id, record]));
  const issues: string[] = [];

  for (const finding of draftFindings) {
    const support = finding.supportIds.map((id) => recordById.get(id)).filter(Boolean) as ResearchRecord[];
    if (support.length < 2) {
      issues.push(`${finding.id} requires at least two valid supporting records.`);
    }
    if (
      !support.some(
        (record) =>
          record.sourceClass !== "community" &&
          (record.confidence === "medium" || record.confidence === "high")
      )
    ) {
      issues.push(`${finding.id} requires medium/high confidence non-community support.`);
    }
  }

  return issues;
}
