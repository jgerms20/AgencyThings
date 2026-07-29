import { evidenceItems } from "./evidence";
import { sources } from "./sources";
import type {
  ComparisonCohort,
  ComparisonCohortKey,
  ComparisonDimension,
  ComparisonEvidenceStatus,
  ComparisonOption,
} from "./types";

export type {
  ComparisonClass,
  ComparisonCohort,
  ComparisonCohortKey,
  ComparisonDimension,
  ComparisonEvidenceStatus,
  ComparisonOption,
} from "./types";

export type ComparisonEvidenceRecord = {
  id: string;
  sourceId: string;
  insightIds: string[];
  claim: string;
  locator: string;
  support: string;
  sourceTitle: string;
  sourceOrganization: string;
  sourceUrl: string;
};

export const comparisonCohorts: Array<{ id: ComparisonCohortKey; label: string }> = [
  { id: "genZ", label: "Gen Z" },
  { id: "genX", label: "Gen X" },
  { id: "boomers", label: "Boomers" },
];

const comparisonEvidenceSupport: Record<string, string> = {
  "evidence-media-video-default-2": "Establishes the current Gen Alpha mix of YouTube, gaming platforms, and streaming services.",
  "evidence-compare-deloitte-genz-media-1": "Quantifies the Gen Z shift toward social and user-generated media relative to the average consumer.",
  "evidence-compare-pew-adult-platforms-1": "Supplies age-band platform-use figures that remain explicitly labeled as adult proxies.",
  "evidence-play-social-infrastructure-2": "Documents children's reported social learning, creativity, and problem-solving in creation games.",
  "evidence-play-social-infrastructure-1": "Documents teens' reported friendship benefits and online friendships through games.",
  "evidence-learning-ai-discovery-2": "Supplies the reported growth and daily frequency of Gen Alpha chatbot use.",
  "evidence-learning-ai-homework-1": "Documents entertainment and homework use in a tween-and-teen sample without presenting it as a Gen Z-only result.",
  "evidence-learning-commercial-fluency-1": "Supplies the Gen Alpha independent-decision and wish-list figures used for household influence.",
  "evidence-compare-deloitte-genz-commerce-1": "Supplies measured Gen Z purchasing-influence context from social media ads and reviews.",
  "evidence-play-friendship-travels-1": "Supplies the teen friendship-through-games measure used as a near-age comparison point.",
  "evidence-play-friendship-travels-2": "Shows children's shared interests moving between games, messaging, video, and in-person friend groups.",
  "evidence-learning-remix-1": "Documents child-reported creativity and problem-solving through active building in Roblox and Minecraft.",
  "evidence-learning-remix-2": "Adds an editorial, interest-segmented example of consumption turning into self-made media.",
};

const cohort = (
  mentality: string,
  ageRange: string,
  geography: string,
  sourceYear: string,
  evidenceStatus: ComparisonEvidenceStatus,
  sourceIds: string[],
  evidenceIds: string[],
): ComparisonCohort => ({
  mentality,
  ageRange,
  geography,
  sourceYear,
  evidenceStatus,
  sourceIds,
  evidenceIds,
  evidenceSupport: Object.fromEntries(
    evidenceIds.map((evidenceId) => [evidenceId, comparisonEvidenceSupport[evidenceId]]),
  ),
});

const evidenceGap = (mentality: string): ComparisonCohort => cohort(
  mentality,
  "Generation label; no matched behavioral sample",
  "No matched geography",
  "No matched series",
  "evidence gap",
  [],
  [],
);

const option = (
  comparisonClass: ComparisonOption["comparisonClass"],
  cohortRecord: ComparisonCohort,
  realDifference: string,
  caveat: string,
): ComparisonOption => {
  let everydayExample = "Picture a real day, not two opposing stereotypes: use the Alpha evidence to understand the child in front of you, and treat the older cohort only as bounded context.";
  if (realDifference.includes("creator-led")) everydayExample = "A child opens YouTube to find a walkthrough, recognizes the creator in a game, and brings the format into play with friends. An older sibling may use the same platforms, but entered that system later.";
  if (realDifference.includes("continuity, not a generation contest")) everydayExample = "The game chat does not end when the console turns off. The same joke, build, or friendship can show up at school the next morning and return to the game that night.";
  if (realDifference.includes("forming learning habits")) everydayExample = "A homework question moves from a teacher to YouTube to a chatbot and then to a parent who asks, ‘How do we know that answer is right?’";
  if (realDifference.includes("cross-context continuity")) everydayExample = "A friend first met through a game can become part of a group chat, a playground conversation, and the next shared session.";
  if (realDifference.includes("creation tools inside core play")) everydayExample = "Instead of only watching a finished story, a child changes the avatar, builds the room, records the clip, and sends the result to a friend.";
  if (realDifference.includes("permission and payment")) everydayExample = "A child sees a product in a creator video, searches for it, adds it to a wish list, and asks an adult who still controls the final purchase.";
  return { comparisonClass, cohort: cohortRecord, realDifference, everydayExample, caveat };
};

export const comparisonDimensions: ComparisonDimension[] = [
  {
    id: "media-attention",
    title: "Media & attention",
    genAlpha: cohort(
      "Media is a participatory mix: video, games, streaming, and conversational discovery sit close together.",
      "7-14",
      "United States",
      "2026",
      "direct cohort evidence",
      ["pwc-alpha-2026"],
      ["evidence-media-video-default-2"],
    ),
    comparisons: {
      genZ: option(
        "current cohort snapshot",
        cohort(
          "Social and user-generated video take a larger share of the media day than traditional TV and movies in this current Gen Z snapshot.",
          "Gen Z, defined as 1997-2010",
          "United States",
          "2025",
          "direct cohort evidence",
          ["deloitte-digital-media-trends-2025"],
          ["evidence-compare-deloitte-genz-media-1"],
        ),
        "Gen Alpha enters a creator-led, algorithmic video mix earlier; Gen Z provides the clearest near-age precedent, not a fixed endpoint.",
        "The Gen Alpha and Gen Z figures come from different surveys, years, age scopes, and measures. They establish adjacent media environments, not a causal cohort shift.",
      ),
      genX: option(
        "current cohort snapshot",
        cohort(
          "The adult proxy spans two Pew bands: YouTube use remains broad at 92% for ages 30-49 and 85% for ages 50-64, while TikTok use is 44% and 30%.",
          "30-49 and 50-64 adult age bands; not a Gen X sample",
          "United States",
          "2025",
          "adult age-band proxy",
          ["pew-adult-social-media-2025"],
          ["evidence-compare-pew-adult-platforms-1"],
        ),
        "Plan for different discovery defaults: child-first participatory video for Alpha, with the 30-49 adult band used only as a directional media proxy.",
        "Gen X was ages 43-59 in 2025, crossing Pew's 30-49 and 50-64 bands. The figures are scoped adult proxies and cannot be read as an exact Gen X estimate.",
      ),
      boomers: option(
        "current cohort snapshot",
        cohort(
          "The 65+ adult proxy still shows broad YouTube reach but much lower TikTok use: 64% versus 12%.",
          "65+ adult age band; not a Boomer sample",
          "United States",
          "2025",
          "adult age-band proxy",
          ["pew-adult-social-media-2025"],
          ["evidence-compare-pew-adult-platforms-1"],
        ),
        "Do not force one channel plan across the household: Alpha's video discovery is participatory, while the 65+ adult proxy shows broad YouTube reach but far less TikTok use.",
        "The 65+ band excludes younger Boomers and includes adults older than the Boomer definition. It is a directional adult proxy, not a generation estimate.",
      ),
    },
  },
  {
    id: "compare-play-belonging",
    title: "Play & belonging",
    genAlpha: cohort(
      "Play is also a place to make, learn, and maintain relationships, not only a finished thing to consume.",
      "5-13",
      "United States",
      "2024",
      "direct cohort evidence",
      ["walton-creation-gaming-2024"],
      ["evidence-play-social-infrastructure-2"],
    ),
    comparisons: {
      genZ: option(
        "directional interpretation",
        cohort(
          "Teen players describe games as friendship spaces, with reported benefits to existing friendships and new online connections.",
          "13-17 teen sample; overlaps cohort boundaries",
          "United States",
          "2024",
          "near-age proxy",
          ["pew-teens-video-games-2024"],
          ["evidence-play-social-infrastructure-1"],
        ),
        "Design for continuity, not a generation contest: both cohorts use games socially, while Alpha's evidence places making and learning inside the play space earlier.",
        "The studies use different age ranges and constructs: child creation-game social learning versus teen friendship outcomes. The contrast is directional, not a score.",
      ),
      genX: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: Gen X childhood play occurred in a different media environment, but this graph has no matched behavioral measure."),
        "The useful contrast is developmental, not stereotypical: Alpha's play evidence is platformed and collaborative; no matched Gen X childhood measure is available.",
        "No canonical source measures Gen X childhood play against today's Gen Alpha construct. The gap is visible so historical intuition does not become a claim.",
      ),
      boomers: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: Boomer childhood play cannot be reconstructed from the current adult evidence in this graph."),
        "Treat Alpha's creation-game behavior as a current child snapshot; the evidence base does not support a scored comparison with Boomer childhood play.",
        "No matched Boomer childhood-play series is present. The page does not infer sociality, creativity, or independence from nostalgia about earlier play.",
      ),
    },
  },
  {
    id: "learning-ai",
    title: "Learning & AI",
    genAlpha: cohort(
      "Conversational AI is arriving while learning habits, trust, and verification routines are still being formed.",
      "Gen Alpha; exact public age band not published",
      "Countries not named in public release",
      "2026",
      "direct cohort evidence",
      ["nielsen-ai-discovery-2026"],
      ["evidence-learning-ai-discovery-2"],
    ),
    comparisons: {
      genZ: option(
        "directional interpretation",
        cohort(
          "A tween-and-teen proxy shows AI already used for entertainment and homework, but the result is not published as a Gen Z-only cut.",
          "Tweens and teens; exact public ages not published",
          "United States",
          "2026",
          "near-age proxy",
          ["common-sense-ai-2026"],
          ["evidence-learning-ai-homework-1"],
        ),
        "Alpha is forming learning habits with conversational AI present; the teen proxy shows adjacent adoption, not proof of a unique generational trait.",
        "Neither public release provides a clean matched Alpha-versus-Z sample. The result supports planning context, not a quantified generation difference.",
      ),
      genX: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: Gen X learning contexts changed across the life course, but this graph cannot isolate a Gen X learning mentality."),
        "Design verification and adult support around Alpha's current AI use; there is no matched Gen X learning measure in the canonical evidence.",
        "The graph contains no matched Gen X learning-and-AI measure. It would be misleading to turn adult technology adoption into a childhood-learning comparison.",
      ),
      boomers: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: the available evidence cannot isolate a Boomer learning mentality for comparison with children using AI today."),
        "Use Alpha's AI-learning evidence to plan safeguards now, without inventing a Boomer learning-style opposite.",
        "The graph contains no matched Boomer learning-and-AI measure. The missing comparator is a research gap, not evidence of resistance or preference.",
      ),
    },
  },
  {
    id: "friendship-connection",
    title: "Friendship & connection",
    genAlpha: cohort(
      "Friendship travels between game worlds, group messages, videos, and in-person time instead of staying inside one channel.",
      "Children in qualitative case studies; exact public age range varies",
      "United Kingdom",
      "2025",
      "direct cohort evidence",
      ["ofcom-children-media-lives-2025"],
      ["evidence-play-friendship-travels-2"],
    ),
    comparisons: {
      genZ: option(
        "directional interpretation",
        cohort(
          "Teen players report games as friendship infrastructure, including shared play and friendships that begin online.",
          "13-17 teen sample; overlaps cohort boundaries",
          "United States",
          "2024",
          "near-age proxy",
          ["pew-teens-video-games-2024"],
          ["evidence-play-friendship-travels-1"],
        ),
        "Gen Alpha's connection pattern is best read as cross-context continuity: the same friendship can move from a game to a group chat to the playground. Gen Z provides an adjacent teen snapshot, not a finished version of that pattern.",
        "The Alpha evidence is qualitative and the Gen Z evidence is a U.S. teen survey. They support a directional contrast, not a measured generation score.",
      ),
      genX: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: no matched Gen X childhood measure tracks how friendships moved across physical and digital settings."),
        "Treat Alpha's cross-context connection as a current design condition; this library does not support a quantified Gen X childhood comparison.",
        "No canonical source in this lab measures Gen X childhood friendship behavior against today's connected environments.",
      ),
      boomers: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: the current evidence cannot reconstruct Boomer childhood friendship behavior as a matched comparison."),
        "Plan for the connections children have now, rather than turning nostalgia about older childhoods into a behavioral claim.",
        "No matched Boomer childhood series is available in the research library, so the evidence gap remains visible.",
      ),
    },
  },
  {
    id: "creation-expression",
    title: "Creation & expression",
    genAlpha: cohort(
      "Making is integrated into play: children describe building worlds as a way to develop creativity and problem-solving.",
      "5-13",
      "United States",
      "2024",
      "direct cohort evidence",
      ["walton-creation-gaming-2024"],
      ["evidence-learning-remix-1"],
    ),
    comparisons: {
      genZ: option(
        "directional interpretation",
        evidenceGap("No matched Gen Z measure in this library establishes when creation tools became part of everyday play."),
        "The useful insight is developmental rather than competitive: Gen Alpha encounters creation tools inside core play environments earlier. This library does not contain a clean Gen Z comparison measure for that claim.",
        "The research library does not contain a like-for-like Gen Z creation measure, so the gap is explicit rather than filled with an assumption.",
      ),
      genX: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: there is no matched Gen X childhood evidence for creation tools embedded in everyday play."),
        "Use the current Alpha creation environment as the strategy input; a historical comparison would exceed the available evidence.",
        "No canonical source measures Gen X childhood creation behavior against today's game-making systems.",
      ),
      boomers: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: no matched Boomer childhood evidence is present for creation in digital play environments."),
        "Do not make a nostalgia claim where the research library only supports the contemporary Alpha environment.",
        "No matched Boomer childhood series is available for this comparison.",
      ),
    },
  },
  {
    id: "household-influence",
    title: "Household influence",
    genAlpha: cohort(
      "Influence often means proposing, wish-listing, and negotiating inside an adult-controlled purchase system.",
      "7-14",
      "United States",
      "2026",
      "direct cohort evidence",
      ["pwc-alpha-2026"],
      ["evidence-learning-commercial-fluency-1"],
    ),
    comparisons: {
      genZ: option(
        "directional interpretation",
        cohort(
          "Social ads and product reviews are a strong reported purchase influence for Gen Z, but this adult-oriented measure does not capture child-adult negotiation.",
          "Gen Z, defined as 1997-2010",
          "United States",
          "2025",
          "direct cohort evidence",
          ["deloitte-digital-media-trends-2025"],
          ["evidence-compare-deloitte-genz-commerce-1"],
        ),
        "Alpha's influence is still routed through adult permission and payment; Gen Z purchase influence is useful context, not a like-for-like child comparison.",
        "The Alpha source measures children's participation in household decisions; Deloitte measures reported influences on Gen Z respondents. The constructs are not interchangeable.",
      ),
      genX: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: Gen X may hold adult decision power in Alpha households, but this graph has no matched commerce measure for that role."),
        "Separate child desire from adult decision power: Alpha evidence measures household participation, while a matched Gen X commerce comparison is absent.",
        "No canonical source measures Gen X household decision behavior against the Alpha child measure. Family role is not inferred from generation alone.",
      ),
      boomers: option(
        "directional interpretation",
        evidenceGap("Directional interpretation: Boomers may participate in multi-generational households, but the graph does not measure a shared purchase role."),
        "Plan for a multi-generational decision system rather than opposing child and Boomer mentalities; the available evidence only measures Alpha's side.",
        "No canonical source measures Boomer household influence against the Alpha child measure. Household composition and decision authority vary substantially.",
      ),
    },
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const evidenceById = new Map(evidenceItems.map((item) => [item.id, item]));

for (const dimension of comparisonDimensions) {
  const cohortRecords = [dimension.genAlpha, ...Object.values(dimension.comparisons).map((comparison) => comparison.cohort)];
  for (const cohortRecord of cohortRecords) {
    for (const sourceId of cohortRecord.sourceIds) {
      if (!sourceById.has(sourceId)) throw new Error(`Unknown comparison source: ${sourceId}`);
    }
    for (const evidenceId of cohortRecord.evidenceIds) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence) throw new Error(`Unknown comparison evidence: ${evidenceId}`);
      if (!cohortRecord.sourceIds.includes(evidence.sourceId)) {
        throw new Error(`Comparison evidence ${evidenceId} uses undeclared source ${evidence.sourceId}`);
      }
      if (!cohortRecord.evidenceSupport[evidenceId]?.trim()) {
        throw new Error(`Comparison evidence ${evidenceId} has no cohort support rationale`);
      }
    }
  }
}

export const getComparisonEvidence = (cohortRecord: ComparisonCohort): ComparisonEvidenceRecord[] =>
  cohortRecord.evidenceIds.map((evidenceId) => {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) throw new Error(`Unknown comparison evidence: ${evidenceId}`);
    const source = sourceById.get(evidence.sourceId);
    if (!source) throw new Error(`Unknown comparison source: ${evidence.sourceId}`);

    return {
      id: evidence.id,
      sourceId: evidence.sourceId,
      insightIds: evidence.insightIds,
      claim: evidence.claim,
      locator: evidence.locator,
      support: cohortRecord.evidenceSupport[evidenceId],
      sourceTitle: source.title,
      sourceOrganization: source.organization,
      sourceUrl: source.url,
    };
  });

export const getComparisonDimension = (id: string) => comparisonDimensions.find((dimension) => dimension.id === id);
