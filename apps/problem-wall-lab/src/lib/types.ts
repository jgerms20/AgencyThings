export type SourceType = "news" | "report" | "community" | "reddit" | "study" | "field-note";

export type CandidateStatus = "draft" | "approved" | "rejected";

export type BurstDimension =
  | "biggerReason"
  | "unexpectedness"
  | "relevancy"
  | "specificity"
  | "targetedCause";

export type BurstScore = {
  breakdown: Record<BurstDimension, number>;
  total: number;
  grade: "wall ready" | "promising" | "needs work";
  notes: string[];
};

export type ClientBrief = {
  id: string;
  name: string;
  strategist: string;
  email: string;
  positioning: string;
  tone: string;
  objectives: string[];
  audiences: string[];
  problemTerritories: string[];
  opportunityVerbs: string[];
};

export type SourceSignal = {
  id: string;
  title: string;
  source: string;
  sourceType: SourceType;
  url?: string;
  publishedAt: string;
  audience: string;
  behavior: string;
  tension: string;
  stat?: string;
  urgency?: string;
  whyItMatters?: string;
  tags: string[];
};

export type ProblemCandidate = {
  id: string;
  weekOf?: string;
  clientId: string;
  clientName: string;
  strategist: string;
  email: string;
  problem: string;
  opportunity: string;
  details: string;
  audience: string;
  sources: SourceSignal[];
  status: CandidateStatus;
  score?: BurstScore;
  imagePrompt?: string;
};

export type WeeklyWallInput = {
  weekOf: string;
  clients: ClientBrief[];
  signals: SourceSignal[];
  limit?: number;
};

export type WorkflowStep = {
  id: string;
  label: string;
  owner: string;
  description: string;
  inputs: string[];
  outputs: string[];
};

export type WeeklyWorkflow = {
  id: string;
  weekOf: string;
  cron: string;
  timezone: string;
  steps: WorkflowStep[];
  outputs: string[];
};

export type SourceRefreshOptions = {
  fetcher?: (url: string, init?: RequestInit) => Promise<Response>;
  now?: string;
};
