import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import IndicatorTooltip from "../src/components/IndicatorTooltip";
import InfluencerDetail from "../src/components/InfluencerDetail";
import PeoplePage from "../src/components/PeoplePage";
import {
  cultureShaperRubric,
  cultureShapers,
  getCultureShaper,
  type CultureShaperType,
} from "../src/lib/content/culture-shapers";
import { insights } from "../src/lib/content/insights";
import { sources } from "../src/lib/content/sources";
import { spaces } from "../src/lib/spaces";

const originalCreatorIds = [
  "mrbeast",
  "ishowspeed",
  "kai-cenat",
  "aphmau",
  "ms-rachel",
  "salish-matter",
  "ryans-world",
  "like-nastya",
  "kids-diana",
  "vlad-and-niki",
  "cocomelon",
  "alan-chikin-chow",
  "stokes-twins",
  "lankybox",
  "danny-go",
  "dude-perfect",
  "unspeakable",
  "kreekcraft",
  "preston",
  "itsfunneh",
  "moriah-elizabeth",
  "sssniperwolf",
  "rebecca-zamolo",
  "charli-damelio",
  "nicole-laeno",
  "jules-leblanc",
  "piper-rockelle",
  "brent-rivera",
  "ben-azelart",
  "jesser",
];

function repeatedFragments(entries: Array<{ id: string; text: string }>, wordCount = 6) {
  const profilesByFragment = new Map<string, Set<string>>();
  for (const entry of entries) {
    const words = entry.text.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
    for (let index = 0; index <= words.length - wordCount; index += 1) {
      const fragment = words.slice(index, index + wordCount).join(" ");
      const profileIds = profilesByFragment.get(fragment) ?? new Set<string>();
      profileIds.add(entry.id);
      profilesByFragment.set(fragment, profileIds);
    }
  }
  return [...profilesByFragment.entries()]
    .filter(([, profileIds]) => profileIds.size >= 4)
    .map(([fragment]) => fragment);
}

describe("canonical culture shapers", () => {
  it("preserves all thirty creators and expands to all five shaper types", () => {
    expect(cultureShapers.length).toBeGreaterThan(originalCreatorIds.length);
    for (const id of originalCreatorIds) expect(getCultureShaper(id)).toBeDefined();

    const types = new Set(cultureShapers.map((shaper) => shaper.type));
    expect(types).toEqual(
      new Set<CultureShaperType>(["creator", "artist", "athlete", "screen-ip", "franchise"]),
    );
    expect(getCultureShaper("bluey")?.type).toBe("screen-ip");
    expect(getCultureShaper("kpop-demon-hunters")?.type).toBe("screen-ip");
  });

  it("maintains the editorial coverage floor for artists, athletes, and IP", () => {
    const countByType = (type: CultureShaperType) => cultureShapers.filter((shaper) => shaper.type === type).length;

    expect(countByType("artist")).toBeGreaterThanOrEqual(30);
    expect(countByType("athlete")).toBeGreaterThanOrEqual(12);
    expect(countByType("screen-ip") + countByType("franchise")).toBeGreaterThanOrEqual(12);
  });

  it("includes women and girl-focused culture across relevant categories", () => {
    const representedTypes = new Set(
      cultureShapers
        .filter((shaper) => shaper.audienceSegments.includes("girls") || shaper.pronouns === "she")
        .map((shaper) => shaper.type),
    );

    expect(representedTypes).toEqual(
      expect.objectContaining({
        has: expect.any(Function),
      }),
    );
    for (const type of ["creator", "artist", "athlete", "screen-ip", "franchise"] as const) {
      expect(representedTypes.has(type)).toBe(true);
    }
  });

  it("stores profile-specific intelligence and valid graph references", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    const insightIds = new Set(insights.map((insight) => insight.id));
    const spaceIds = new Set(spaces.map((space) => space.id));

    for (const shaper of cultureShapers) {
      expect(shaper.topics.length).toBeGreaterThan(0);
      expect(shaper.formats.length).toBeGreaterThan(0);
      expect(shaper.platforms.length).toBeGreaterThan(0);
      expect(shaper.audience.center).toBeTruthy();
      expect(shaper.audience.broader).toBeTruthy();
      expect(shaper.audience.ageRange).toBeTruthy();
      expect(["low", "medium", "high"]).toContain(shaper.audience.confidence);
      expect(shaper.influenceMechanism).toBeTruthy();
      expect(shaper.definingMoments.length).toBeGreaterThanOrEqual(3);
      expect(shaper.relatedEntities.length).toBeGreaterThan(0);
      expect(shaper.relatedSpaceIds.length).toBeGreaterThan(0);
      expect(shaper.officialUrl).toMatch(/^https:\/\//);
      expect(shaper.sourceNotes.length).toBeGreaterThan(0);
      expect(shaper.sourceIds.length).toBeGreaterThan(0);
      shaper.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      shaper.insightIds.forEach((id) => expect(insightIds.has(id)).toBe(true));
      shaper.relatedSpaceIds.forEach((id) => expect(spaceIds.has(id)).toBe(true));
    }
  });

  it("grounds migrated creator evidence in profile-specific formats, platforms, and moments", () => {
    const migrated = originalCreatorIds.map((id) => getCultureShaper(id)!);
    const entries = migrated.map((shaper) => ({
      id: shaper.id,
      text: [
        ...shaper.sourceNotes.map((sourceNote) => sourceNote.note),
        ...Object.values(shaper.indicators).map((indicator) => indicator.rationale),
      ].join(" "),
    }));
    const forbiddenFiller = [
      "read beside research",
      "entity-specific editorial observation",
      "rather than creator analytics",
      "position is visible through",
      "gives audiences a repeatable action through",
      "shows how attention can extend",
      "editorial range grounded in format",
    ];

    for (const shaper of migrated) {
      const entry = entries.find((candidate) => candidate.id === shaper.id)!.text.toLowerCase();
      expect(entry).toContain(shaper.formats[0].toLowerCase());
      expect(entry).toContain(shaper.platforms[0].toLowerCase());
      expect(entry).toContain(shaper.definingMoments[0].toLowerCase());
      expect(shaper.sourceNotes.every((sourceNote) => sourceNote.note.includes(shaper.name))).toBe(true);
      expect(Object.values(shaper.indicators).every((indicator) => indicator.rationale.includes(shaper.name))).toBe(true);
      for (const phrase of forbiddenFiller) expect(entry).not.toContain(phrase);
    }

    const allNotes = migrated.flatMap((shaper) => shaper.sourceNotes.map((sourceNote) => sourceNote.note));
    const allRationales = migrated.flatMap((shaper) => Object.values(shaper.indicators).map((indicator) => indicator.rationale));
    expect(new Set(allNotes).size).toBe(allNotes.length);
    expect(new Set(allRationales).size).toBe(allRationales.length);
    expect(repeatedFragments(entries)).toEqual([]);
  });

  it("uses complete tiered assessments and profile rationale", () => {
    const tiers = new Set<number>();
    expect(Object.keys(cultureShaperRubric)).toEqual([
      "reach",
      "participation",
      "commercialPull",
      "audienceCenter",
    ]);

    for (const shaper of cultureShapers) {
      for (const assessment of Object.values(shaper.indicators)) {
        tiers.add(assessment.tier);
        expect(assessment.tier).toBeGreaterThanOrEqual(1);
        expect(assessment.tier).toBeLessThanOrEqual(4);
        expect(assessment.definition).toBe(cultureShaperRubric[assessment.indicator].tiers[assessment.tier]);
        expect(assessment.rationale).toContain(shaper.name);
        expect(assessment.sourceIds.length).toBeGreaterThan(0);
      }
    }
    expect(tiers).toEqual(new Set([1, 2, 3, 4]));
  });

  it("stores multiple privacy-enhanced videos and renders only embeddable media", () => {
    const withVideos = cultureShapers.filter((shaper) => shaper.videos.length > 0);
    expect(withVideos.length).toBeGreaterThanOrEqual(5);
    expect(withVideos.flatMap((shaper) => shaper.videos).length).toBeGreaterThanOrEqual(5);

    const profile = withVideos[0];
    render(<InfluencerDetail influencer={profile} />);
    const frames = screen.getAllByTitle(new RegExp(`${profile.name} video`, "i"));
    expect(frames).toHaveLength(profile.videos.filter((video) => video.embeddable).length);
    for (const frame of frames) {
      expect(frame).toHaveAttribute("src", expect.stringContaining("youtube-nocookie.com/embed/"));
      expect(frame).toHaveAttribute("loading", "lazy");
    }
  });
});

describe("culture shaper directory filters", () => {
  it("offers one IP filter that merges screen and franchise results", async () => {
    const user = userEvent.setup();
    render(<PeoplePage />);

    expect(screen.queryByRole("button", { name: "Screen / IP" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Franchise" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "IP" }));

    const expectedProfiles = cultureShapers.filter((shaper) => shaper.type === "screen-ip" || shaper.type === "franchise");
    expect(screen.getByRole("status")).toHaveTextContent(`${expectedProfiles.length} IP profiles shown`);
    for (const shaper of expectedProfiles) {
      expect(screen.getByRole("link", { name: `Explore ${shaper.name}` })).toBeVisible();
    }
  });

  it("filters all six dimensions, reports results, and clears without losing keyboard access", async () => {
    const user = userEvent.setup();
    render(<PeoplePage />);

    const directory = screen.getByRole("region", { name: "Culture shaper directory" });
    expect(within(directory).getByRole("link", { name: "Explore Bluey" })).toHaveAttribute(
      "href",
      "/influencers/bluey",
    );
    expect(within(directory).getByRole("link", { name: "Explore KPop Demon Hunters" })).toHaveAttribute(
      "href",
      "/influencers/kpop-demon-hunters",
    );
    for (const shaper of cultureShapers) {
      expect(within(directory).getByRole("link", { name: `Explore ${shaper.name}` })).toHaveAttribute(
        "href",
        `/influencers/${shaper.id}`,
      );
    }

    const dimensions = ["Audience age", "Topic", "Platform", "Format", "Audience segment"];
    for (const label of dimensions) expect(screen.getByRole("combobox", { name: label })).toBeEnabled();

    const artistButton = screen.getByRole("button", { name: "Artist" });
    artistButton.focus();
    expect(artistButton).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText(/artists? shown/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Audience age" }), "8-12");
    await user.selectOptions(screen.getByRole("combobox", { name: "Topic" }), "music");
    await user.selectOptions(screen.getByRole("combobox", { name: "Platform" }), "Netflix");
    await user.selectOptions(screen.getByRole("combobox", { name: "Format" }), "feature film");
    await user.selectOptions(screen.getByRole("combobox", { name: "Audience segment" }), "girls");
    expect(screen.getByRole("status")).toHaveTextContent(/shown/i);

    await user.click(screen.getByRole("button", { name: "Clear all filters" }));
    expect(screen.getByRole("button", { name: "All types" })).toHaveAttribute("aria-pressed", "true");
    for (const label of dimensions) expect(screen.getByRole("combobox", { name: label })).toHaveValue("all");
  });
});

describe("indicator explanations", () => {
  it("reveals the same profile rationale on hover and keyboard focus", () => {
    const assessment = getCultureShaper("bluey")!.indicators.participation;
    render(<IndicatorTooltip assessment={assessment} />);

    const trigger = screen.getByRole("button", { name: "Explain Participation indicator" });
    const tooltipId = trigger.getAttribute("aria-describedby")!;
    expect(document.getElementById(tooltipId)).not.toBeVisible();

    fireEvent.mouseEnter(trigger);
    expect(document.getElementById(tooltipId)).toHaveTextContent(assessment.rationale);
    expect(document.getElementById(tooltipId)).toBeVisible();

    fireEvent.mouseLeave(trigger);
    fireEvent.focus(trigger);
    expect(document.getElementById(tooltipId)).toBeVisible();

    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    expect(document.getElementById(tooltipId)).toBeVisible();
  });

  it("keeps every rubric definition and profile rationale visible on detail", () => {
    const bluey = getCultureShaper("bluey")!;
    render(<InfluencerDetail influencer={bluey} />);

    for (const assessment of Object.values(bluey.indicators)) {
      expect(screen.getByText(assessment.definition)).toBeVisible();
      expect(screen.getAllByText(assessment.rationale).some((node) => !node.hasAttribute("hidden"))).toBe(true);
    }
    expect(screen.getByRole("link", { name: /official destination/i })).toHaveAttribute(
      "href",
      bluey.officialUrl,
    );
  });

  it("renders related spaces as stable internal relations", () => {
    const aphmau = getCultureShaper("aphmau")!;
    render(<InfluencerDetail influencer={aphmau} />);

    expect(screen.getByRole("heading", { name: "Related spaces" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Minecraft" })).toHaveAttribute("href", "/spaces#minecraft");
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute("href", "/spaces#youtube");
  });
});
