import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReachRoute from "../src/app/reach-them/page";
import ReachPage from "../src/components/ReachPage";
import { cultureShapers } from "../src/lib/content/culture-shapers";
import { insights } from "../src/lib/content/insights";
import { sources } from "../src/lib/content/sources";
import { spaces } from "../src/lib/content/spaces";
import { strategyPlays } from "../src/lib/content/strategy";

const strategyTitles = [
  "Give them something to make or shape.",
  "Build a repeatable format, not a one-off message.",
  "Design for the child and the enabling adult.",
  "Enter an existing ritual with useful value.",
  "Create a physical-digital loop.",
  "Use creators for format fluency, not borrowed fame alone.",
  "Make safety, privacy, and transparency visible product qualities.",
  "Measure participation and usefulness, not reach alone.",
];

describe("Reach Them strategy", () => {
  it("defines the eight approved, evidence-linked strategy plays", () => {
    const insightIds = new Set(insights.map((insight) => insight.id));
    const sourceIds = new Set(sources.map((source) => source.id));
    const spaceIds = new Set(spaces.map((space) => space.id));
    const cultureShaperIds = new Set(cultureShapers.map((shaper) => shaper.id));

    expect(strategyPlays.map((play) => play.title)).toEqual(strategyTitles);
    expect(new Set(strategyPlays.map((play) => play.id)).size).toBe(8);

    for (const play of strategyPlays) {
      expect(play.whenAppropriate).toMatch(/\S/);
      expect(play.ageContext).toMatch(/\S/);
      expect(play.directChildValue).toMatch(/\S/);
      expect(play.adultDecisionContext).toMatch(/\S/);
      expect(play.evidenceRationale).toMatch(/\S/);
      expect(play.formats.length).toBeGreaterThan(0);
      expect(play.failureModes.length).toBeGreaterThan(0);
      expect(play.ethicalConstraints.length).toBeGreaterThan(0);
      expect(play.insightIds.length).toBeGreaterThan(0);
      expect(play.sourceIds.length).toBeGreaterThan(0);
      expect(play.relatedSpaceIds.length).toBeGreaterThan(0);
      expect(play.relatedCultureShaperIds.length).toBeGreaterThan(0);

      for (const id of play.insightIds) expect(insightIds.has(id), `${play.id} insight ${id}`).toBe(true);
      for (const id of play.sourceIds) expect(sourceIds.has(id), `${play.id} source ${id}`).toBe(true);
      for (const id of play.relatedSpaceIds) expect(spaceIds.has(id), `${play.id} space ${id}`).toBe(true);
      for (const id of play.relatedCultureShaperIds) {
        expect(cultureShaperIds.has(id), `${play.id} culture shaper ${id}`).toBe(true);
      }
    }
  });

  it("renders practical guidance with child value, household context, and visible boundaries", () => {
    render(<ReachPage />);

    expect(screen.getByRole("heading", { name: "Reach children responsibly, with value they can use." })).toBeInTheDocument();
    expect(screen.getAllByTestId("strategy-play")).toHaveLength(8);
    expect(screen.getAllByText("Direct value for the child")).toHaveLength(8);
    expect(screen.getAllByText("Adult and household decision context")).toHaveLength(8);
    expect(screen.getAllByText("Useful formats")).toHaveLength(8);
    expect(screen.getAllByText("Failure modes")).toHaveLength(8);
    expect(screen.getAllByText("Ethical constraints")).toHaveLength(8);

    const boundaries = screen.getByRole("region", { name: "Non-negotiable privacy and safety boundaries" });
    expect(boundaries).toHaveTextContent("No covert persuasion");
    expect(boundaries).toHaveTextContent("No behavioral targeting of children");
    expect(boundaries).toHaveTextContent("No unnecessary collection of a child's data");

    for (const play of strategyPlays) {
      const section = screen.getByRole("region", { name: play.title });
      for (const insightId of play.insightIds) {
        expect(section.querySelector(`a[href="/insights/${insightId}"]`)).toBeInTheDocument();
      }
      for (const sourceId of play.sourceIds) {
        expect(section.querySelector(`a[href="/library/${sourceId}"]`)).toBeInTheDocument();
      }
      for (const spaceId of play.relatedSpaceIds) {
        expect(section.querySelector(`a[href="/spaces#${spaceId}"]`)).toBeInTheDocument();
      }
      for (const shaperId of play.relatedCultureShaperIds) {
        expect(section.querySelector(`a[href="/influencers/${shaperId}"]`)).toBeInTheDocument();
      }
    }
  });

  it("exposes the strategy at the reach-them route", () => {
    render(<ReachRoute />);

    expect(screen.getByRole("heading", { name: "Reach children responsibly, with value they can use." })).toBeInTheDocument();
  });

  it("renders safely when unresolved strategy references bypass validation", () => {
    const play = strategyPlays[0];
    const originalReferences = {
      insightIds: play.insightIds,
      sourceIds: play.sourceIds,
      relatedSpaceIds: play.relatedSpaceIds,
      relatedCultureShaperIds: play.relatedCultureShaperIds,
    };
    let view: ReturnType<typeof render> | undefined;

    Object.assign(play, {
      insightIds: ["missing-insight"],
      sourceIds: ["missing-source"],
      relatedSpaceIds: ["missing-space"],
      relatedCultureShaperIds: ["missing-culture-shaper"],
    });

    try {
      expect(() => {
        view = render(<ReachPage />);
      }).not.toThrow();
      expect(view?.container.querySelector('a[href*="missing-"]')).not.toBeInTheDocument();
      expect(screen.getByRole("region", { name: play.title })).toBeInTheDocument();
    } finally {
      Object.assign(play, originalReferences);
    }
  });
});
