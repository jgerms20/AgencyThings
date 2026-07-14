export type SourceType = "news" | "report" | "community" | "reddit" | "study";
export type SourceClass = "news" | "research" | "community";
export type CandidateStatus = "new" | "shortlisted" | "passed" | "reviewed";

export type BurstDimension =
  | "biggerReason"
  | "unexpectedness"
  | "relevancy"
  | "specificity"
  | "targetedCause";

export type BurstScore = {
  breakdown: Record<BurstDimension, number>;
  reasons: Record<BurstDimension, string>;
  total: number;
  grade: "wall ready" | "promising" | "needs work";
  notes: string[];
  evidenceCapped: boolean;
};

export type SourceSignal = {
  id: string;
  title: string;
  source: string;
  sourceType: SourceType;
  sourceClass: SourceClass;
  url: string;
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
  weekOf: string;
  problem: string;
  biggerReason: string;
  rootCause: string;
  details: string;
  audience: string;
  sources: SourceSignal[];
  status: CandidateStatus;
  notes: string;
  score: BurstScore;
};

export type DeckInspiration = Pick<
  ProblemCandidate,
  "id" | "problem" | "biggerReason" | "rootCause" | "details"
>;

export type WeeklyWallInput = {
  weekOf: string;
  signals: SourceSignal[];
  limit?: number;
  now?: string;
};

export type WorkflowStep = {
  id: string;
  label: string;
  description: string;
};

export type WeeklyWorkflow = {
  id: string;
  weekOf: string;
  cron: string;
  timezone: string;
  steps: WorkflowStep[];
  outputs: string[];
};

export type SourceFailure = { source: string; message: string };

export type RefreshResult = {
  signals: SourceSignal[];
  sourcesAttempted: number;
  sourcesSucceeded: number;
  failures: SourceFailure[];
  refreshedAt: string;
};

export type SourceRefreshOptions = {
  fetcher?: (url: string, init?: RequestInit) => Promise<Response>;
  now?: string;
  maxAgeDays?: number;
  brandLens?: string;
  excludeIds?: string[];
  edge?: number;
};

export type WeeklyRefreshResult = {
  weekOf: string;
  refreshedAt: string;
  mode: "supabase" | "demo";
  persistenceErrors: string[];
  refresh: RefreshResult;
  candidates: ProblemCandidate[];
};
