import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import ReachRoute from "../src/app/reach-them/page";
import ReachPage from "../src/components/ReachPage";
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
    }
  });

  it("groups all eight canonical plays into three scannable stages", () => {
    render(<ReachPage />);

    expect(screen.getByRole("heading", { name: "Earn participation. Don't chase attention." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Create value" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fit the context" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Apply guardrails" })).toBeInTheDocument();
    expect(screen.getAllByTestId(/^strategy-play-/)).toHaveLength(8);

    for (const [index, play] of strategyPlays.entries()) {
      const disclosure = screen.getByTestId(`strategy-play-${play.id}`);
      const summary = disclosure.querySelector("summary");

      if (index === 0) expect(disclosure).toHaveAttribute("open");
      else expect(disclosure).not.toHaveAttribute("open");
      expect(summary).not.toBeNull();
      expect(summary).toHaveTextContent(String(index + 1).padStart(2, "0"));
      expect(summary).toHaveTextContent(play.title);
      expect(summary).toHaveTextContent(play.directChildValue);
      expect(summary).toHaveTextContent(play.whenAppropriate);
      expect(summary).toHaveTextContent(play.ethicalConstraints[0]);
    }
  });

  it("keeps long supporting detail out of the visible default scan", () => {
    render(<ReachPage />);

    const closedPlay = strategyPlays[1];
    const disclosure = screen.getByTestId(`strategy-play-${closedPlay.id}`);

    expect(disclosure).not.toHaveAttribute("open");
    expect(within(disclosure).getByText(closedPlay.formats[0])).not.toBeVisible();
    expect(disclosure.querySelector(`a[href="/insights/${closedPlay.insightIds[0]}"]`)).not.toBeVisible();
    expect(within(disclosure).queryByText(closedPlay.ageContext)).not.toBeInTheDocument();
    expect(within(disclosure).queryByText(closedPlay.evidenceRationale)).not.toBeInTheDocument();
    expect(within(disclosure).queryByText(closedPlay.failureModes[0])).not.toBeInTheDocument();
  });

  it("uses native disclosures and reveals concise evidence links on expansion", async () => {
    const user = userEvent.setup();
    render(<ReachPage />);

    const play = strategyPlays[1];
    const disclosure = screen.getByTestId(`strategy-play-${play.id}`);
    const summary = disclosure.querySelector("summary");

    expect(disclosure.tagName).toBe("DETAILS");
    expect(summary?.tagName).toBe("SUMMARY");
    expect(disclosure).not.toHaveAttribute("open");

    await user.click(summary!);

    expect(disclosure).toHaveAttribute("open");
    expect(within(disclosure).getByText(play.formats[0])).toBeVisible();
    for (const insightId of play.insightIds.slice(0, 2)) {
      expect(disclosure.querySelector(`a[href="/insights/${insightId}"]`)).toBeVisible();
    }
    for (const sourceId of play.sourceIds.slice(0, 2)) {
      expect(disclosure.querySelector(`a[href="/library/${sourceId}"]`)).toBeVisible();
    }

    summary?.focus();
    expect(summary).toHaveFocus();
    await user.click(summary!);
    expect(disclosure).not.toHaveAttribute("open");
  });

  it("keeps the four safety boundaries in a compact named band", () => {
    render(<ReachPage />);

    const boundaries = screen.getByRole("region", { name: "Non-negotiable privacy and safety boundaries" });
    expect(boundaries).toHaveTextContent("No covert persuasion");
    expect(boundaries).toHaveTextContent("No behavioral targeting of children");
    expect(boundaries).toHaveTextContent("No unnecessary collection of a child's data");
    expect(boundaries).toHaveTextContent("No child-only path to purchase or public sharing");
    expect(within(boundaries).getAllByRole("listitem")).toHaveLength(4);
  });

  it("keeps every reach text grid single-column at phone width", () => {
    const stylesheet = readFileSync("src/app/globals.css", "utf8");
    const phoneStyles = stylesheet.slice(stylesheet.indexOf("@media (max-width: 700px)"));

    expect(phoneStyles).toMatch(/\.reach-stage-heading,\s*\.reach-play-summary-grid,\s*\.reach-play-detail-grid\s*\{\s*grid-template-columns:\s*1fr;/);
    expect(phoneStyles).toMatch(/\.reach-boundaries ul\s*\{\s*grid-template-columns:\s*1fr;/);
  });

  it("exposes the strategy at the reach-them route", () => {
    render(<ReachRoute />);

    expect(screen.getByRole("heading", { name: "Earn participation. Don't chase attention." })).toBeInTheDocument();
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
      expect(screen.getByTestId(`strategy-play-${play.id}`)).toBeInTheDocument();
    } finally {
      Object.assign(play, originalReferences);
    }
  });
});
