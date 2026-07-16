import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ComparePage from "../src/components/ComparePage";
import { comparisonDimensions } from "../src/lib/content/comparisons";
import { evidenceItems } from "../src/lib/content/evidence";
import { sources } from "../src/lib/content/sources";

const dimensionTitles = [
  "Formative technology",
  "Primary social behavior",
  "Media discovery",
  "Play and creation",
  "Creator relationships",
  "Learning and search",
  "Commerce and household influence",
  "AI relationship",
  "Family mediation",
  "Privacy and safety environment",
];

describe("Gen Alpha and Gen Z comparison", () => {
  it("defines the ten approved dimensions with evidence-aware cohort records", () => {
    const evidenceById = new Map(evidenceItems.map((evidence) => [evidence.id, evidence]));
    const sourceById = new Map(sources.map((source) => [source.id, source]));

    expect(comparisonDimensions.map((dimension) => dimension.title)).toEqual(dimensionTitles);

    for (const dimension of comparisonDimensions) {
      expect(dimension.comparisonClass).toMatch(/age-matched observed evidence|current cohort snapshot|directional interpretation/);
      expect(dimension.genAlpha.summary).not.toHaveLength(0);
      expect(dimension.genZ.summary).not.toHaveLength(0);
      expect(dimension.genAlpha.ageRange).not.toHaveLength(0);
      expect(dimension.genZ.ageRange).not.toHaveLength(0);
      expect(dimension.genAlpha.geography).not.toHaveLength(0);
      expect(dimension.genZ.geography).not.toHaveLength(0);
      expect(dimension.genAlpha.sourceYear).toMatch(/^20\d{2}(?:-20\d{2})?$/);
      expect(dimension.genZ.sourceYear).toMatch(/^20\d{2}(?:-20\d{2})?$/);
      expect(dimension.caveat).not.toHaveLength(0);
      expect(dimension.genAlpha.sourceIds.length).toBeGreaterThan(0);
      expect(dimension.genZ.sourceIds.length).toBeGreaterThan(0);
      expect(dimension.genAlpha.evidenceIds.length).toBeGreaterThan(0);
      expect(dimension.genZ.evidenceIds.length).toBeGreaterThan(0);

      for (const cohort of [dimension.genAlpha, dimension.genZ]) {
        for (const evidenceId of cohort.evidenceIds) {
          const evidence = evidenceById.get(evidenceId);
          expect(evidence, `${dimension.id} references ${evidenceId}`).toBeDefined();
          expect(cohort.sourceIds).toContain(evidence?.sourceId);
          expect(sourceById.get(evidence?.sourceId ?? "")).toBeDefined();
          expect(cohort.evidenceSupport[evidenceId], `${evidenceId} must explain how it supports the cohort claim`).toMatch(/\S/);
        }
      }
    }
  });

  it("uses honest comparison classes and the direct AI recommendation evidence", () => {
    const primarySocial = comparisonDimensions.find((dimension) => dimension.id === "primary-social-behavior");
    const playAndCreation = comparisonDimensions.find((dimension) => dimension.id === "play-and-creation");
    const aiRelationship = comparisonDimensions.find((dimension) => dimension.id === "ai-relationship");

    expect(primarySocial?.comparisonClass).toBe("directional interpretation");
    expect(playAndCreation?.comparisonClass).toBe("directional interpretation");
    expect(primarySocial?.caveat).toMatch(/age.*construct|construct.*age/i);
    expect(playAndCreation?.caveat).toMatch(/age.*construct|construct.*age/i);
    expect(aiRelationship?.genAlpha.evidenceIds).toContain("evidence-media-ai-recommendation-1");
  });

  it("switches dimensions with an accessible selector while retaining the methodology caveat", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    expect(screen.getByRole("heading", { name: "Gen Alpha and Gen Z, compared with the evidence left intact." })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Comparison dimensions" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(10);
    expect(screen.getByText("Comparison class")).toBeInTheDocument();
    expect(screen.getByText(/This page does not treat age differences as proof/i)).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "AI relationship" }));

    expect(screen.getByRole("radio", { name: "AI relationship" })).toBeChecked();
    expect(screen.getByRole("heading", { name: "AI relationship" })).toBeInTheDocument();
    expect(screen.getByText("Gen Alpha evidence")).toBeInTheDocument();
    expect(screen.getByText("Gen Z evidence")).toBeInTheDocument();
    expect(screen.getByText("Methodology caveat")).toBeInTheDocument();

    const recommendationEvidence = evidenceItems.find((evidence) => evidence.id === "evidence-media-ai-recommendation-1");
    const recommendationSource = sources.find((source) => source.id === recommendationEvidence?.sourceId);
    expect(screen.getByText(recommendationEvidence?.claim ?? "missing recommendation claim")).toBeInTheDocument();
    expect(screen.getByText(`Located: ${recommendationEvidence?.locator}`)).toBeInTheDocument();
    const recommendationLinks = screen.getAllByRole("link", { name: new RegExp(recommendationSource?.title ?? "missing source") });
    expect(recommendationLinks.length).toBeGreaterThan(0);
    for (const link of recommendationLinks) expect(link).toHaveAttribute("href", recommendationSource?.url);
    expect(screen.queryByText("nielsen ai discovery 2026")).not.toBeInTheDocument();
  });
});
