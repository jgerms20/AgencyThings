import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import GenderLensPage from "@/components/GenderLensPage";

describe("Gender Lens", () => {
  it("opens with an anti-stereotype frame and traceable boys evidence", () => {
    render(<GenderLensPage />);

    expect(screen.getByRole("heading", { name: "Gender is a lens, not a shortcut." })).toBeInTheDocument();
    const tabs = screen.getByRole("tablist", { name: "Gender lenses" });
    expect(within(tabs).getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Boys",
      "Girls",
      "Gender-diverse youth",
    ]);
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Open source/ }).length).toBeGreaterThan(0);
  });

  it("switches to girls findings without turning differences into fixed traits", async () => {
    const user = userEvent.setup();
    render(<GenderLensPage />);

    await user.click(screen.getByRole("tab", { name: "Girls" }));
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("66%")).toBeInTheDocument();
    expect(screen.getByText(/describes a reported pattern, not an innate preference/i)).toBeInTheDocument();
  });

  it("keeps gender-diverse evidence gaps visible", async () => {
    const user = userEvent.setup();
    render(<GenderLensPage />);

    await user.click(screen.getByRole("tab", { name: "Gender-diverse youth" }));
    expect(screen.getAllByText("Evidence gap").length).toBeGreaterThan(0);
    expect(screen.getByText(/most large youth media surveys still publish binary cuts/i)).toBeInTheDocument();
    expect(screen.getByText(/do not infer a Gen Alpha behavior split/i)).toBeInTheDocument();
  });

  it("shows the validity rules and exact proxy population", () => {
    render(<GenderLensPage />);

    const methodology = screen.getByRole("region", { name: "How to read this evidence" });
    expect(methodology).toHaveTextContent("1,391");
    expect(methodology).toHaveTextContent("ages 13–17");
    expect(methodology).toHaveTextContent("near-age proxy");
    expect(methodology).toHaveTextContent("self-report");
  });
});
