import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SpacesPage from "../src/components/SpacesPage";

describe("Spaces page", () => {
  it("shows where Gen Alpha spends time and what each environment enables", () => {
    render(<SpacesPage />);

    expect(screen.getByRole("heading", { name: "Where time becomes culture." })).toBeInTheDocument();
    expect(screen.getAllByTestId("space-profile")).toHaveLength(12);
    for (const name of ["Roblox", "YouTube", "Discord", "TikTok", "Minecraft", "Fortnite"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.getAllByText("What it enables")).toHaveLength(12);
  });
});
