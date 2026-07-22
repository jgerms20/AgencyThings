export type SourceKind = "publication" | "community" | "study" | "podcast" | "event" | "social";
export type CulturalDomain = "sport" | "wellness" | "culture" | "technology" | "community" | "entertainment" | "behavior";
export type ConnectorState = "updated" | "stale" | "needs-credentials" | "refreshing";
export type MonthlySection = "trends" | "creative" | "culture" | "pick" | "provocation";

export interface Story {
  id: string;
  headline: string;
  dek: string;
  sourceName: string;
  sourceUrl: string;
  sourceKind: SourceKind;
  publishedAt: string;
  observedAt: string;
  domain: CulturalDomain;
  tags: string[];
  whatHappened: string;
  whyItMatters: string;
  gatoradeImplication?: string;
  imageUrl?: string;
  transcriptExcerpt?: string;
}

export interface ConnectorStatus {
  id: string;
  label: string;
  status: ConnectorState;
  message: string;
  refreshedAt?: string;
}

export interface RefreshRun {
  id: string;
  startedAt: string;
  completedAt: string;
  statuses: ConnectorStatus[];
  addedCount: number;
}

export interface SavedStory {
  storyId: string;
  savedAt: string;
  notes: string;
  storylineIds: string[];
}

export interface Storyline {
  id: string;
  title: string;
  thesis: string;
  storyIds: string[];
  createdAt: string;
}

export interface MonthlyIssue {
  month: string;
  theme: string;
  learning: string;
  sections: Record<MonthlySection, string[]>;
  prediction: string;
  confidence: number;
  whyWatching: string;
  provocation: string;
}

export interface WorkspaceState {
  version: 1;
  feedStoryIds: string[];
  saved: Record<string, SavedStory>;
  storylines: Storyline[];
  monthly: MonthlyIssue;
}
