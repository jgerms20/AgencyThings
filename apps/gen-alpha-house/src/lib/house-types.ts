export type ThemeMode = "day" | "night";

export type ConfidenceLevel = "low" | "medium" | "high";
export type EvidenceStatus = "established" | "emerging signal" | "working hunch";
export type MarketLabel = "U.S." | "U.K." | "Global / multi-market" | "Market not published";
export type RoomLensId = "boys" | "girls";

export type RoomObjectId =
  | "phone"
  | "television"
  | "homework-desk"
  | "game-console"
  | "backpack"
  | "book-shelf"
  | "caregiver-door"
  | "outside-window"
  | "influencer-poster";

export type LinkedInsight = {
  id: string;
  title: string;
  thesis: string;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  evidenceStatus: EvidenceStatus;
  market: MarketLabel;
  scope: string;
  sources: string[];
  sourceUrl: string;
  labUrl: string;
  linkLabel?: string;
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

export type RoomLens = {
  id: RoomLensId;
  label: string;
  title: string;
  framing: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
  objects: RoomObject[];
};
