import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import SiteHeader from "../src/components/SiteHeader";

const expectedDestinations = [
  ["Overview", "/"],
  ["Insights", "/insights"],
  ["Influencers", "/influencers"],
  ["Spaces", "/spaces"],
  ["Marketing 101", "/reach-them"],
  ["Gender lens", "/gender"],
  ["Compare", "/compare"],
  ["Summary", "/summary"],
  ["Library", "/library"],
] as const;

afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("responsive primary navigation", () => {
  it("renders all nine desktop destinations in the approved order", () => {
    render(<SiteHeader active="overview" />);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const links = within(navigation).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual(expectedDestinations.map(([label]) => label));
    expect(links.map((link) => link.getAttribute("href"))).toEqual(expectedDestinations.map(([, href]) => href));
  });

  it("marks the active desktop destination", () => {
    render(<SiteHeader active="compare" />);

    expect(screen.getByRole("link", { name: "Compare" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
  });

  it("derives the active destination when a page does not pass one", async () => {
    window.history.replaceState({}, "", "/reach-them");
    render(<SiteHeader />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Marketing 101" })).toHaveAttribute("aria-current", "page");
    });
  });

  it("opens and closes the mobile navigation without removing destinations", async () => {
    const user = userEvent.setup();
    render(<SiteHeader active="spaces" />);

    const openButton = screen.getByRole("button", { name: "Open navigation" });
    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();

    await user.click(openButton);

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(screen.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    expect(within(mobileNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual(
      expectedDestinations.map(([label]) => label),
    );

    await user.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("moves focus into the menu and returns it after Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader active="overview" />);

    const openButton = screen.getByRole("button", { name: "Open navigation" });
    await user.click(openButton);

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNavigation).getByRole("link", { name: "Overview" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open navigation" })).toHaveFocus();
  });

  it("keeps mobile links in a wrapping flow instead of a horizontal scroller", () => {
    const stylesheet = readFileSync("src/app/globals.css", "utf8");

    expect(stylesheet).toContain(".mobile-nav-panel");
    expect(stylesheet).toContain(".mobile-nav-list");
    expect(stylesheet).toContain("overflow-wrap: anywhere");
    expect(stylesheet).not.toMatch(/overflow-x:\s*(?:auto|scroll)/);
  });
});
