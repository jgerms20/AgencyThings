export type ConfidenceLevel = "low" | "medium" | "high";

export type SourceClass =
  | "primary research"
  | "peer reviewed"
  | "policy"
  | "platform data"
  | "industry research"
  | "journalism"
  | "owned synthesis"
  | "community signal";

export type SourceFormat = "report" | "article" | "book" | "video" | "podcast";

export type EvidenceType =
  | "observed"
  | "self-reported"
  | "qualitative"
  | "forecast"
  | "platform-wide metric"
  | "editorial inference";

export type EvidenceClaimKind = "metric" | "finding" | "observed claim" | "editorial inference";

export type Source = {
  id: string;
  title: string;
  organization: string;
  author?: string;
  url: string;
  format: SourceFormat;
  publishedAt: string;
  sourceClass: SourceClass;
  summary: string;
  methodology: string;
  population: string;
  ageRange: string;
  geography: string;
  sampleSize?: string;
  fieldworkPeriod: string;
  confidence: ConfidenceLevel;
  limitations: string;
  youtubeId?: string;
  podcastEmbedUrl?: string;
};

export type EvidenceItem = {
  id: string;
  sourceId: string;
  claim: string;
  claimKind: EvidenceClaimKind;
  supportRationale: string;
  locator: string;
  evidenceType: EvidenceType;
  population: string;
  ageRange: string;
  geography: string;
  period: string;
  methodology: string;
  limitations: string;
  insightIds: string[];
};

export type Theme = {
  id: "play-belonging" | "media-influence" | "time-routines" | "learning-becoming";
  title: string;
  description: string;
};

export type Insight = {
  id: string;
  themeId: Theme["id"];
  sequence: number;
  title: string;
  thesis: string;
  interpretation: string;
  evidenceIds: string[];
  ageRange: string;
  geography: string;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  nuance: string;
  genZComparison?: string;
  agencyImplication: string;
  relatedCreatorIds: string[];
  relatedSpaceIds: string[];
  tags: string[];
};

export type IndicatorKey = "reach" | "participation" | "commercialPull" | "audienceCenter";

export type IndicatorAssessment = {
  indicator: IndicatorKey;
  label: string;
  tier: 1 | 2 | 3 | 4;
  definition: string;
  rationale: string;
  sourceIds: string[];
};

export type RelatedContentEntity = {
  id: string;
  kind: "culture-shaper" | "insight" | "space";
};

export type StrategyPlay = {
  id: string;
  title: string;
  whenAppropriate: string;
  ageContext: string;
  directChildValue: string;
  adultDecisionContext: string;
  evidenceRationale: string;
  formats: string[];
  failureModes: string[];
  ethicalConstraints: string[];
  evidenceIds: string[];
  insightIds: string[];
  sourceIds: string[];
  relatedSpaceIds: string[];
  relatedCultureShaperIds: string[];
};

export type ContentEntityReference = {
  id: string;
  evidenceIds?: string[];
  insightIds?: string[];
  relatedCultureShaperIds?: string[];
  relatedEntities?: RelatedContentEntity[];
  relatedInsightIds?: string[];
  relatedSpaceIds?: string[];
  sourceIds?: string[];
  sourceNotes?: Array<{ sourceId: string; note: string }>;
  indicators?: Partial<Record<IndicatorKey, IndicatorAssessment>>;
};

export type CultureShaperReference = ContentEntityReference & {
  type: CultureShaperType;
};

export type ComparisonClass =
  | "age-matched observed evidence"
  | "current cohort snapshot"
  | "directional interpretation";

export type ComparisonEvidenceStatus =
  | "direct cohort evidence"
  | "near-age proxy"
  | "adult age-band proxy"
  | "evidence gap";

export type ComparisonCohortKey = "genZ" | "genX" | "boomers";

export type ComparisonCohort = {
  mentality: string;
  ageRange: string;
  geography: string;
  sourceYear: string;
  evidenceStatus: ComparisonEvidenceStatus;
  sourceIds: string[];
  evidenceIds: string[];
  evidenceSupport: Record<string, string>;
};

export type ComparisonOption = {
  comparisonClass: ComparisonClass;
  cohort: ComparisonCohort;
  realDifference: string;
  everydayExample: string;
  caveat: string;
};

export type ComparisonDimension = {
  id: string;
  title: string;
  genAlpha: ComparisonCohort;
  comparisons: Record<ComparisonCohortKey, ComparisonOption>;
};

export type CultureShaperType = "creator" | "artist" | "athlete" | "screen-ip" | "franchise";
export type CultureShaperDirectoryType = "all" | "creator" | "artist" | "athlete" | "ip";

export type ContentGraph = {
  sources: Source[];
  themes: Theme[];
  insights: Insight[];
  evidenceItems: EvidenceItem[];
  strategyPlays: StrategyPlay[];
  spaces: ContentEntityReference[];
  cultureShapers: CultureShaperReference[];
  comparisons?: ComparisonDimension[];
};
