import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InsightsPage from "../src/components/InsightsPage";

describe("Insights page", () => {
  it("presents all ten findings across four visibly named themes", () => {
    render(<InsightsPage />);

    expect(screen.getByRole("heading", { name: "Ten truths shaping Gen Alpha now." })).toBeInTheDocument();
    expect(screen.getAllByTestId("insight-directory-item")).toHaveLength(10);
    for (const theme of ["Play and belonging", "Media and influence", "Time and learning", "AI and agency"]) {
      expect(screen.getByRole("heading", { name: theme })).toBeInTheDocument();
    }
  });
});
