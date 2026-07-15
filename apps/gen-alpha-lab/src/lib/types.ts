export type ResearchKind =
  | "report"
  | "article"
  | "podcast"
  | "book"
  | "youtube"
  | "interview"
  | "field-note";

export type ReviewStatus = "new" | "queued" | "reviewed";

export type ConfidenceLevel = "low" | "medium" | "high";

export type LibraryUseMode = "make" | "think" | "learn";

export type SourceClass =
  | "primary research"
  | "peer reviewed"
  | "journalism"
  | "industry research"
  | "policy"
  | "preprint"
  | "video"
  | "book"
  | "podcast"
  | "youtube"
  | "community"
  | "owned";

export type ResearchRecord = {
  id: string;
  kind: ResearchKind;
  title: string;
  source: string;
  summary: string;
  tags: string[];
  status: ReviewStatus;
  confidence: ConfidenceLevel;
  createdAt: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  transcript?: string;
  fileName?: string;
  storagePath?: string;
  sourceClass?: SourceClass;
  synthesisStatus?: string;
  useModes?: LibraryUseMode[];
};

export type FilterState = {
  query?: string;
  kind?: ResearchKind | "all";
  tag?: string;
  status?: ReviewStatus | "all";
};

export type UploadRecordInput = {
  id?: string;
  title: string;
  kind: ResearchKind;
  source: string;
  tags: string | string[];
  transcript?: string;
  fileName?: string;
  sourceClass?: SourceClass;
  url?: string;
  now?: string;
};

export type LibrarySummary = {
  total: number;
  reviewed: number;
  interviews: number;
  sources: number;
  queued: number;
};
