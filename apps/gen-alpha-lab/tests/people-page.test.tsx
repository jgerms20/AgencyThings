import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PeoplePage from "../src/components/PeoplePage";

describe("PeoplePage", () => {
  it("turns the creator roster into a concise insight-led page", () => {
    render(<PeoplePage />);

    expect(
      screen.getByRole("heading", {
        name: "Creators are not just media. They are formats for behavior."
      })
    ).toBeInTheDocument();

    for (const name of ["MrBeast", "IShowSpeed", "Kai Cenat", "Aphmau", "Salish Matter", "Ms. Rachel"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
      expect(screen.getByAltText(name)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Open ${name}'s channel` })).toHaveAttribute(
        "href",
        expect.stringMatching(/^https:\/\//)
      );
    }

    expect(screen.getByText("Participation beats passive viewing.")).toBeInTheDocument();
    expect(screen.getByText("Personality carries across formats.")).toBeInTheDocument();
    expect(screen.getByText("Household permission still matters.")).toBeInTheDocument();
  });
});
