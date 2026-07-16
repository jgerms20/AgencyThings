import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ComparePage from "../src/components/ComparePage";
import { comparisonDimensions } from "../src/lib/content/comparisons";

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
    }
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
  });
});
