import type { MonthlyIssue, MonthlySection, Story, WorkspaceState } from "./types";

export type WorkspaceAction =
  | { type: "hydrate"; state: WorkspaceState }
  | { type: "toggle-save"; storyId: string }
  | { type: "update-notes"; storyId: string; notes: string }
  | { type: "create-storyline"; title: string }
  | { type: "assign-storyline"; storyId: string; storylineId: string }
  | { type: "assign-monthly"; storyId: string; section: MonthlySection }
  | { type: "replace-feed"; storyIds: string[] }
  | { type: "update-monthly-copy"; field: "theme" | "learning" | "prediction" | "whyWatching" | "provocation"; value: string }
  | { type: "update-confidence"; value: number };

export const STORAGE_KEY = "agencythings:hydration-refresh:v1";
export const STORIES_STORAGE_KEY = "agencythings:hydration-refresh:stories:v1";

export function createMonthlyIssue(): MonthlyIssue {
  return {
    month: "2026-07", theme: "", learning: "",
    sections: { trends: [], creative: [], culture: [], pick: [], provocation: [] },
    prediction: "", confidence: 3, whyWatching: "", provocation: ""
  };
}

export function createInitialWorkspace(): WorkspaceState {
  return { version: 1, feedStoryIds: [], saved: {}, storylines: [], monthly: createMonthlyIssue() };
}

export function reduceWorkspace(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  if (action.type === "hydrate") return action.state;
  if (action.type === "replace-feed") return { ...state, feedStoryIds: [...action.storyIds] };
  if (action.type === "toggle-save") {
    const saved = { ...state.saved };
    if (saved[action.storyId]) delete saved[action.storyId];
    else saved[action.storyId] = { storyId: action.storyId, savedAt: new Date().toISOString(), notes: "", storylineIds: [] };
    return { ...state, saved };
  }
  if (action.type === "update-notes") {
    const current = state.saved[action.storyId] ?? { storyId: action.storyId, savedAt: new Date().toISOString(), notes: "", storylineIds: [] };
    return { ...state, saved: { ...state.saved, [action.storyId]: { ...current, notes: action.notes } } };
  }
  if (action.type === "create-storyline") {
    const title = action.title.trim();
    if (!title) return state;
    const id = `storyline-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    return { ...state, storylines: [...state.storylines, { id, title, thesis: "", storyIds: [], createdAt: new Date().toISOString() }] };
  }
  if (action.type === "assign-storyline") {
    const storylines = state.storylines.map((line) => line.id === action.storylineId && !line.storyIds.includes(action.storyId) ? { ...line, storyIds: [...line.storyIds, action.storyId] } : line);
    const current = state.saved[action.storyId] ?? { storyId: action.storyId, savedAt: new Date().toISOString(), notes: "", storylineIds: [] };
    const storylineIds = current.storylineIds.includes(action.storylineId) ? current.storylineIds : [...current.storylineIds, action.storylineId];
    return { ...state, storylines, saved: { ...state.saved, [action.storyId]: { ...current, storylineIds } } };
  }
  if (action.type === "assign-monthly") {
    const current = state.monthly.sections[action.section];
    const next = current.includes(action.storyId) ? current : [...current, action.storyId];
    return { ...state, monthly: { ...state.monthly, sections: { ...state.monthly.sections, [action.section]: next } } };
  }
  if (action.type === "update-monthly-copy") return { ...state, monthly: { ...state.monthly, [action.field]: action.value } };
  if (action.type === "update-confidence") return { ...state, monthly: { ...state.monthly, confidence: Math.max(1, Math.min(5, action.value)) } };
  return state;
}

export function loadWorkspace(storage: Pick<Storage, "getItem"> | undefined): WorkspaceState {
  try {
    const parsed = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null") as WorkspaceState | null;
    return parsed?.version === 1 ? parsed : createInitialWorkspace();
  } catch { return createInitialWorkspace(); }
}

export function saveWorkspace(storage: Pick<Storage, "setItem"> | undefined, state: WorkspaceState): boolean {
  try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); return Boolean(storage); } catch { return false; }
}

export function loadStories(storage: Pick<Storage, "getItem"> | undefined): Story[] {
  try {
    const parsed = JSON.parse(storage?.getItem(STORIES_STORAGE_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter(isStory) : [];
  } catch { return []; }
}

export function saveStories(storage: Pick<Storage, "setItem"> | undefined, stories: Story[]): boolean {
  try { storage?.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories)); return Boolean(storage); } catch { return false; }
}

export function selectStoriesForPersistence(stories: Story[], savedIds: ReadonlySet<string>, limit = 300): Story[] {
  const unique = [...new Map(stories.map((story) => [story.id, story])).values()];
  const saved = unique.filter(({ id }) => savedIds.has(id));
  const recent = unique
    .filter(({ id }) => !savedIds.has(id))
    .sort((left, right) => Date.parse(right.observedAt) - Date.parse(left.observedAt))
    .slice(0, Math.max(0, limit - saved.length));
  return [...saved, ...recent];
}

function isStory(value: unknown): value is Story {
  if (!value || typeof value !== "object") return false;
  const story = value as Partial<Story>;
  return typeof story.id === "string" && typeof story.headline === "string" && typeof story.sourceUrl === "string";
}
