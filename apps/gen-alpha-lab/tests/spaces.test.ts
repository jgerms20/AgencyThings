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
  "Public libraries and maker spaces",
  "Parks, playgrounds, and pickup play",
  "Youth arts, dance, and music studios",
  "Retail, fandom, and collector spaces",
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
  it("defines the expanded approved space roster in its editorial order", () => {
    expect(spaces.map((space) => space.name)).toEqual(expectedRoster);
    expect(spaces).toHaveLength(54);
    expect(new Set(spaces.map((space) => space.id))).toHaveProperty("size", 54);
    expect([...new Set(spaces.map((space) => space.category))]).toEqual(expectedCategories);
  });

  it("adds four meaningful physical or hybrid spaces with attributed related format references", () => {
    const additions = [
      "public-libraries-maker-spaces",
      "parks-playgrounds-pickup-play",
      "youth-arts-dance-music-studios",
      "retail-fandom-collector-spaces",
    ];
    const physicalOrHybrid = spaces.filter((space) => space.environment !== "digital");

    expect(physicalOrHybrid).toHaveLength(8);
    expect(physicalOrHybrid.map((space) => space.id)).toEqual(expect.arrayContaining(additions));

    for (const id of additions) {
      const space = spaces.find((candidate) => candidate.id === id)!;
      expect(space.evidenceStatus).toBe("watchlist");
      expect(space.relatedFormatReference?.youtubeId).toMatch(/^[\w-]{11}$/);
      expect(space.relatedFormatReference?.title.length).toBeGreaterThan(12);
      expect(space.relatedFormatReference?.provenance).toMatch(/YouTube/i);
      expect(space.relatedFormatReference?.nonEvidenceCaveat).toMatch(/not evidence/i);
    }
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
      expect(new Set(spaces.map((space) => space[field])).size).toBe(54);
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

  it("grounds every evidence-backed space in its name or measured platform behavior", () => {
    const supportTermsBySpace: Record<string, string[]> = {
      "after-school-sports-clubs": ["sport", "outdoor"],
      discord: ["messag"],
      "google-search": ["search"],
      "home-family-routines": ["household", "family"],
      minecraft: ["minecraft"],
      roblox: ["roblox"],
      school: ["education"],
      tiktok: ["tiktok"],
      youtube: ["youtube"],
      "youtube-shorts": ["youtube shorts"],
    };
    const evidenceById = new Map(evidenceItems.map((item) => [item.id, item]));
    const sourceById = new Map(sources.map((source) => [source.id, source]));

    for (const space of spaces.filter((candidate) => candidate.evidenceStatus === "evidence-backed")) {
      const supportTerms = supportTermsBySpace[space.id];
      expect(supportTerms, `Missing alignment terms for ${space.name}`).toBeDefined();

      for (const evidenceId of space.evidenceIds) {
        const evidence = evidenceById.get(evidenceId)!;
        const source = sourceById.get(evidence.sourceId)!;
        expect(space.sourceIds).toContain(evidence.sourceId);

        const supportText = [evidence.claim, evidence.locator, source.title, source.summary]
          .join(" ")
          .toLowerCase();
        expect(
          supportTerms.some((term) => supportText.includes(term)),
          `${space.name} is not directly supported by ${evidence.id}`,
        ).toBe(true);
      }
    }
  });

  it("uses direct Pew TikTok usage evidence with an adjacent teen age limitation", () => {
    const tiktok = spaces.find((space) => space.id === "tiktok")!;
    const evidence = evidenceItems.find((item) => item.id === tiktok.evidenceIds[0])!;

    expect(tiktok.evidenceStatus).toBe("evidence-backed");
    expect(tiktok.sourceIds).toEqual(["pew-teens-social-2024"]);
    expect(evidence.sourceId).toBe("pew-teens-social-2024");
    expect(evidence.claim).toMatch(/TikTok/);
    expect(tiktok.evidenceSummary).toMatch(/adjacent teen evidence/i);
    expect(tiktok.evidenceSummary).toMatch(/ages 13-17/i);
  });

  it("keeps every related graph reference valid", () => {
    const insightIds = new Set(insights.map((insight) => insight.id));
    const shaperIds = new Set(cultureShapers.map((shaper) => shaper.id));

    for (const space of spaces) {
      space.relatedInsightIds.forEach((id) => expect(insightIds.has(id)).toBe(true));
      space.relatedCultureShaperIds.forEach((id) => expect(shaperIds.has(id), `${space.id}: ${id}`).toBe(true));
    }
  });
});
