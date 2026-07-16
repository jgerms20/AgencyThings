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
  publishedAt?: string;
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

export type ContentGraph = {
  sources: Source[];
  themes: Theme[];
  insights: Insight[];
  evidenceItems: EvidenceItem[];
};
