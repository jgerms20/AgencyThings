import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InsightsPage from "../src/components/InsightsPage";

describe("Insights page", () => {
  it("presents all forty insights across four visibly named themes", () => {
    render(<InsightsPage />);

    expect(screen.getByRole("heading", { name: "Forty sourced insights shaping Gen Alpha now." })).toBeInTheDocument();
    expect(screen.getAllByTestId("insight-directory-item")).toHaveLength(40);
    for (const theme of ["Play & Belonging", "Media & Influence", "Time & Routines", "Learning & Becoming"]) {
      expect(screen.getByRole("heading", { name: theme })).toBeInTheDocument();
    }
    expect(screen.queryByText(/ten truths/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /ai and agency/i })).not.toBeInTheDocument();
  });
});
