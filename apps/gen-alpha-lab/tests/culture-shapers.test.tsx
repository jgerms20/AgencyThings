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
      expect(shaper.officialUrl).toMatch(/^https:\/\//);
      expect(shaper.sourceNotes.length).toBeGreaterThan(0);
      expect(shaper.sourceIds.length).toBeGreaterThan(0);
      shaper.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      shaper.insightIds.forEach((id) => expect(insightIds.has(id)).toBe(true));
    }
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
});
