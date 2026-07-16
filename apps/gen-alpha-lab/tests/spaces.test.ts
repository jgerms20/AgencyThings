import { describe, expect, it } from "vitest";
import { cultureShapers } from "../src/lib/content/culture-shapers";
import { evidenceItems } from "../src/lib/content/evidence";
import { insights } from "../src/lib/content/insights";
import { spaces } from "../src/lib/content/spaces";
import { sources } from "../src/lib/content/sources";

const expectedRoster = [
  "Roblox",
  "Minecraft",
  "Fortnite",
  "Nintendo Switch",
  "Mario",
  "Pokemon",
  "Toca Boca World",
  "Brawl Stars",
  "EA Sports FC",
  "NBA 2K",
  "The Sims",
  "Rec Room",
  "Gorilla Tag",
  "Among Us",
  "Geometry Dash",
  "YouTube",
  "YouTube Kids",
  "YouTube Shorts",
  "TikTok",
  "Twitch",
  "Netflix",
  "Disney+",
  "Prime Video",
  "Max",
  "Crunchyroll",
  "Snapchat",
  "Discord",
  "WhatsApp",
  "Instagram",
  "iMessage and FaceTime",
  "Messenger Kids",
  "Reddit",
  "Pinterest",
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "Amazon Music",
  "Podcasts and audiobooks",
  "Google Search",
  "ChatGPT",
  "CapCut",
  "Canva",
  "Scratch",
  "Duolingo",
  "Khan Academy",
  "Google Classroom and school learning systems",
  "School",
  "After-school sports and clubs",
  "Cinemas and live entertainment",
  "Home and family routines",
];

const expectedCategories = [
  "Games & Participatory Worlds",
  "Video, Streaming & Live Media",
  "Social, Messaging & Private Networks",
  "Music & Audio",
  "Learning, Search & Making",
  "Offline Culture",
];

describe("canonical Gen Alpha spaces", () => {
  it("defines the exact approved fifty-space roster in its editorial order", () => {
    expect(spaces.map((space) => space.name)).toEqual(expectedRoster);
    expect(spaces).toHaveLength(50);
    expect(new Set(spaces.map((space) => space.id))).toHaveProperty("size", 50);
    expect([...new Set(spaces.map((space) => space.category))]).toEqual(expectedCategories);
  });

  it("stores complete, distinct context for every space", () => {
    const fields = [
      "whyTheyGo",
      "whatHappens",
      "whoIsThere",
      "evidenceSummary",
      "strategyRelevance",
      "safetyCaveat",
    ] as const;

    for (const space of spaces) {
      expect(space.whatItIs.length).toBeGreaterThan(20);
      for (const field of fields) expect(space[field].length).toBeGreaterThan(20);
      expect(space.ageContext.length).toBeGreaterThan(10);
      expect(space.ageBands.length).toBeGreaterThan(0);
      expect(["digital", "physical", "hybrid"]).toContain(space.environment);
    }

    for (const field of fields) {
      expect(new Set(spaces.map((space) => space[field])).size).toBe(50);
    }
  });

  it("labels evidence-backed and watchlist entries honestly", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    const evidenceIds = new Set(evidenceItems.map((item) => item.id));

    for (const space of spaces) {
      expect(["evidence-backed", "watchlist"]).toContain(space.evidenceStatus);

      if (space.evidenceStatus === "evidence-backed") {
        expect(space.sourceIds.length).toBeGreaterThanOrEqual(1);
        expect(space.evidenceIds.length).toBeGreaterThanOrEqual(1);
        expect(space.evidenceSummary).not.toMatch(/^Editorial watchlist:/);
      } else {
        expect(space.sourceIds).toEqual([]);
        expect(space.evidenceIds).toEqual([]);
        expect(space.evidenceSummary).toMatch(/^Editorial watchlist:/);
      }

      space.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      space.evidenceIds.forEach((id) => expect(evidenceIds.has(id)).toBe(true));
    }
  });

  it("keeps every related graph reference valid", () => {
    const insightIds = new Set(insights.map((insight) => insight.id));
    const shaperIds = new Set(cultureShapers.map((shaper) => shaper.id));

    for (const space of spaces) {
      space.relatedInsightIds.forEach((id) => expect(insightIds.has(id)).toBe(true));
      space.relatedCultureShaperIds.forEach((id) => expect(shaperIds.has(id)).toBe(true));
    }
  });
});
