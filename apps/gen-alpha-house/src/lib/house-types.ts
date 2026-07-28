export type ThemeMode = "day" | "night";

export type ConfidenceLevel = "low" | "medium" | "high";

export type RoomObjectId =
  | "phone"
  | "television"
  | "homework-desk"
  | "game-console"
  | "backpack"
  | "toy-shelf"
  | "parent-door"
  | "bike-window";

export type LinkedInsight = {
  id: string;
  title: string;
  thesis: string;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  scope: string;
  sources: string[];
  labUrl: string;
};

export type RoomObject = {
  id: RoomObjectId;
  label: string;
  object: string;
  title: string;
  thesis: string;
  context: string;
  accent: string;
  position: { x: number; y: number };
  mobileFocus: { x: number; y: number };
  insights: LinkedInsight[];
};
