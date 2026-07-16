import { evidenceItems } from "./evidence";
import { sources } from "./sources";

export type ComparisonClass =
  | "age-matched observed evidence"
  | "current cohort snapshot"
  | "directional interpretation";

export type ComparisonCohort = {
  summary: string;
  ageRange: string;
  geography: string;
  sourceYear: string;
  sourceIds: string[];
  evidenceIds: string[];
  evidenceSupport: Record<string, string>;
};

export type ComparisonDimension = {
  id: string;
  title: string;
  comparisonClass: ComparisonClass;
  genAlpha: ComparisonCohort;
  genZ: ComparisonCohort;
  caveat: string;
};

export type ComparisonEvidenceRecord = {
  id: string;
  claim: string;
  locator: string;
  support: string;
  sourceTitle: string;
  sourceOrganization: string;
  sourceUrl: string;
};

const comparisonEvidenceSupport: Record<string, string> = {
  "evidence-time-device-access-1": "Directly supplies the early tablet and cellphone access figures in the Gen Alpha summary.",
  "evidence-time-private-day-1": "Directly supplies the teen smartphone access and almost-constant internet-use figures used as Gen Z context.",
  "evidence-play-social-infrastructure-2": "Documents children's reported social learning, creativity, and problem-solving in creation games.",
  "evidence-play-social-infrastructure-1": "Documents teens' reported friendship benefits and online friendships through games.",
  "evidence-media-video-default-2": "Directly supplies the Gen Alpha YouTube, gaming-platform, and streaming-service use figures.",
  "evidence-time-youtube-rhythm-2": "Directly supplies the teen daily and almost-constant YouTube-use figures.",
  "evidence-play-making-interface-1": "Directly supplies the child interest in learning coding, art, and design inside creation games.",
  "evidence-play-friendship-travels-1": "Directly supplies the teen multiplayer and game-based friendship figures.",
  "evidence-media-creators-templates-1": "Documents youth-native creator partnerships as a format for cultural participation.",
  "evidence-media-creators-templates-2": "Directly supplies the Gen Alpha social-media purchase-prompt figure.",
  "evidence-learning-assembled-2": "Documents children seeking explanations across video, social, and game environments.",
  "evidence-learning-commercial-fluency-1": "Directly supplies the Gen Alpha independent-decision and wish-list figures.",
  "evidence-learning-ai-discovery-2": "Directly supplies the reported growth and daily frequency of Gen Alpha chatbot use.",
  "evidence-learning-ai-homework-1": "Documents entertainment and homework use in the Common Sense tween-and-teen sample.",
  "evidence-media-ai-recommendation-1": "Directly supplies the Gen Alpha TV and movie recommendation preference stated in the summary.",
  "evidence-time-parent-context-1": "Directly supplies the reported gap in parent or guardian conversations about AI safety.",
  "evidence-time-family-needs-1": "Documents young children's device access and daily media use inside household routines.",
  "evidence-play-safety-boundaries-2": "Directly supplies the current COPPA consent and data-retention protections.",
};

const cohort = (
  summary: string,
  ageRange: string,
  geography: string,
  sourceYear: string,
  sourceIds: string[],
  evidenceIds: string[],
): ComparisonCohort => ({
  summary,
  ageRange,
  geography,
  sourceYear,
  sourceIds,
  evidenceIds,
  evidenceSupport: Object.fromEntries(evidenceIds.map((evidenceId) => [evidenceId, comparisonEvidenceSupport[evidenceId]])),
});

export const comparisonDimensions: ComparisonDimension[] = [
  {
    id: "formative-technology",
    title: "Formative technology",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("Personal access begins early: 40% had a tablet by age two and nearly one in four had a personal cellphone by age eight.", "0-8", "United States", "2025", ["common-sense-census-2025"], ["evidence-time-device-access-1"]),
    genZ: cohort("Today's teens report near-universal smartphone access, describing a more private and portable media environment.", "13-17", "United States", "2024", ["pew-teens-social-2024"], ["evidence-time-private-day-1"]),
    caveat: "These are different life stages measured in different studies. Early access and teen access describe a developmental sequence, not a settled generational difference.",
  },
  {
    id: "primary-social-behavior",
    title: "Primary social behavior",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("Creation-game research among children finds Roblox and Minecraft supporting team-based social learning, creativity, and problem-solving.", "5-13", "United States", "2024", ["walton-creation-gaming-2024"], ["evidence-play-social-infrastructure-2"]),
    genZ: cohort("Teen gamers describe games as a friendship space: 47% said gaming helped friendships and 47% had made an online friend through a game.", "13-17", "United States", "2024", ["pew-teens-video-games-2024"], ["evidence-play-social-infrastructure-1"]),
    caveat: "The age ranges overlap only at age 13, and the constructs differ: child creation-game social learning versus teen friendship outcomes. Treat the shared social role of games as directional context, not a point-for-point cohort score.",
  },
  {
    id: "media-discovery",
    title: "Media discovery",
    comparisonClass: "current cohort snapshot",
    genAlpha: cohort("YouTube is a leading regular-use surface for children ages seven to fourteen, alongside gaming platforms and streaming services.", "7-14", "United States", "2026", ["pwc-alpha-2026"], ["evidence-media-video-default-2"]),
    genZ: cohort("U.S. teens visit YouTube daily at high rates, with a minority reporting almost constant use.", "13-17", "United States", "2024", ["pew-teens-social-2024"], ["evidence-time-youtube-rhythm-2"]),
    caveat: "Both snapshots establish YouTube's importance, but the samples, field years, and measures are not a common time series. They do not establish whether one cohort is more platform-dependent.",
  },
  {
    id: "play-and-creation",
    title: "Play and creation",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("At least seven in ten children wanted subjects such as coding, art, or design taught in Roblox or Minecraft.", "5-13", "United States", "2024", ["walton-creation-gaming-2024"], ["evidence-play-making-interface-1"]),
    genZ: cohort("Teen players commonly game with other people, and 40% of all U.S. teens had made an online friend through a shared game.", "13-17", "United States", "2024", ["pew-teens-video-games-2024"], ["evidence-play-friendship-travels-1"]),
    caveat: "The age ranges overlap only at age 13, and the constructs differ: child interest in creation-based learning versus teen social play and friendship. This supports directional context, not a causal generation claim.",
  },
  {
    id: "creator-relationships",
    title: "Creator relationships",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("Social media is reported as a purchase prompt by 61% of Gen Alpha respondents, while youth-native creator formats translate culture into participation.", "7-14", "United States", "2026", ["pwc-alpha-2026", "ap-sports-alpha-2026"], ["evidence-media-creators-templates-1", "evidence-media-creators-templates-2"]),
    genZ: cohort("Pew's teen research establishes high use of major video and social platforms, but the canonical evidence does not contain a directly comparable measure of creator influence on purchasing.", "13-17", "United States", "2024", ["pew-teens-social-2024"], ["evidence-time-youtube-rhythm-2"]),
    caveat: "The Gen Z comparator is platform-use context, not a creator-relationship metric. The directional label prevents Gen Alpha's purchase-prompt measure from becoming an unsupported cohort ranking.",
  },
  {
    id: "learning-and-search",
    title: "Learning and search",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("Children report seeking explanations across YouTube, TikTok, and Minecraft when school instruction leaves gaps.", "5-13", "United States", "2024", ["walton-creation-gaming-2024"], ["evidence-learning-assembled-2"]),
    genZ: cohort("Teen media research records high daily YouTube use, but it does not measure learning or search behavior in the same way as the child creation-gaming study.", "13-17", "United States", "2024", ["pew-teens-social-2024"], ["evidence-time-youtube-rhythm-2"]),
    caveat: "The canonical source set has no matched learning-and-search series. This is an evidence-gap flag, not a claim that one generation learns more independently.",
  },
  {
    id: "commerce-and-household-influence",
    title: "Commerce and household influence",
    comparisonClass: "current cohort snapshot",
    genAlpha: cohort("Children report practical purchasing influence: 97% make decisions independently at least sometimes and 61% use wish lists to plan requests.", "7-14", "United States", "2026", ["pwc-alpha-2026"], ["evidence-learning-commercial-fluency-1"]),
    genZ: cohort("The canonical Pew teen source measures platform access and frequency rather than household commerce, so it supplies age and geography context but no like-for-like purchase measure.", "13-17", "United States", "2024", ["pew-teens-social-2024"], ["evidence-time-private-day-1"]),
    caveat: "There is no comparable Gen Z commerce measure in the canonical evidence. The page keeps that missing comparator visible instead of inferring an intergenerational shift from one cohort's snapshot.",
  },
  {
    id: "ai-relationship",
    title: "AI relationship",
    comparisonClass: "current cohort snapshot",
    genAlpha: cohort("Gen Alpha respondents report rapidly expanding chatbot use for entertainment, homework, discovery, and recommendations.", "Gen Alpha; exact band not published", "Countries not named in public release", "2026", ["nielsen-ai-discovery-2026", "common-sense-ai-2026"], ["evidence-learning-ai-discovery-2", "evidence-learning-ai-homework-1", "evidence-media-ai-recommendation-1"]),
    genZ: cohort("Common Sense's tween-and-teen study reports AI users turning to it for entertainment and homework help, but it does not publish a Gen Z-only result.", "Tweens and teens; exact bands not published", "United States", "2026", ["common-sense-ai-2026"], ["evidence-learning-ai-homework-1"]),
    caveat: "The public Gen Alpha AI release does not name respondent countries or an exact age band, and the tween-and-teen study does not publish a Gen Z-only split. Do not read this as a quantified cohort difference.",
  },
  {
    id: "family-mediation",
    title: "Family mediation",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("Young children use media inside household routines, and more than four in ten surveyed children said no parent or guardian had discussed AI safety with them.", "0-8 and tweens/teens", "United States", "2025-2026", ["common-sense-census-2025", "common-sense-ai-2026"], ["evidence-time-parent-context-1", "evidence-time-family-needs-1"]),
    genZ: cohort("Common Sense's tween-and-teen study finds a substantial share of children reporting no parent or guardian conversation about AI safety, but it does not split out Gen Z.", "Tweens and teens; exact bands not published", "United States", "2026", ["common-sense-ai-2026"], ["evidence-time-parent-context-1"]),
    caveat: "Family roles naturally shift with age, and the tween-and-teen evidence does not separate Gen Z. The comparison shows where adult context remains relevant, not whether one generation has better or worse parenting.",
  },
  {
    id: "privacy-and-safety-environment",
    title: "Privacy and safety environment",
    comparisonClass: "directional interpretation",
    genAlpha: cohort("Current child protections require parental opt-in for covered services to disclose children's data for targeted advertising and limit unnecessary collection.", "Under 13 under COPPA", "United States", "2025", ["ftc-coppa-2025"], ["evidence-play-safety-boundaries-2"]),
    genZ: cohort("Teen platform research and current rules provide adolescent context, but the canonical evidence does not contain a matched experience-of-privacy measure.", "13-17", "United States", "2024-2026", ["pew-teens-social-2024", "pew-platform-experiences-2026"], ["evidence-time-private-day-1"]),
    caveat: "Policy protections, platform exposure, and reported experience are different kinds of evidence. This dimension maps the changing environment; it does not score either cohort's safety.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const evidenceById = new Map(evidenceItems.map((item) => [item.id, item]));

for (const dimension of comparisonDimensions) {
  for (const cohortEvidence of [dimension.genAlpha, dimension.genZ]) {
    for (const sourceId of cohortEvidence.sourceIds) {
      if (!sourceById.has(sourceId)) throw new Error(`Unknown comparison source: ${sourceId}`);
    }
    for (const evidenceId of cohortEvidence.evidenceIds) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence) throw new Error(`Unknown comparison evidence: ${evidenceId}`);
      if (!cohortEvidence.sourceIds.includes(evidence.sourceId)) {
        throw new Error(`Comparison evidence ${evidenceId} uses undeclared source ${evidence.sourceId}`);
      }
      if (!cohortEvidence.evidenceSupport[evidenceId]?.trim()) {
        throw new Error(`Comparison evidence ${evidenceId} has no cohort support rationale`);
      }
    }
  }
}

export const getComparisonEvidence = (cohortEvidence: ComparisonCohort): ComparisonEvidenceRecord[] =>
  cohortEvidence.evidenceIds.map((evidenceId) => {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) throw new Error(`Unknown comparison evidence: ${evidenceId}`);
    const source = sourceById.get(evidence.sourceId);
    if (!source) throw new Error(`Unknown comparison source: ${evidence.sourceId}`);

    return {
      id: evidence.id,
      claim: evidence.claim,
      locator: evidence.locator,
      support: cohortEvidence.evidenceSupport[evidenceId],
      sourceTitle: source.title,
      sourceOrganization: source.organization,
      sourceUrl: source.url,
    };
  });

export const getComparisonDimension = (id: string) => comparisonDimensions.find((dimension) => dimension.id === id);
