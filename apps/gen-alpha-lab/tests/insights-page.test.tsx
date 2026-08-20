import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InsightsPage from "../src/components/InsightsPage";
import { getFeaturedInsightsForTheme } from "../src/lib/content/insights";

describe("Insights page", () => {
  it("presents twenty featured insights across four visibly named themes", () => {
    render(<InsightsPage />);

    expect(screen.getByRole("heading", { name: "Four ways their days actually work." })).toBeInTheDocument();
    expect(screen.getAllByTestId("insight-directory-item")).toHaveLength(20);
    for (const theme of ["Play & Belonging", "Media & Influence", "Time & Routines", "Learning & Becoming"]) {
      expect(screen.getByRole("heading", { name: theme })).toBeInTheDocument();
    }
    for (const item of screen.getAllByTestId("insight-directory-item")) {
      const trigger = within(item).getByRole("button");
      const panelId = trigger.getAttribute("aria-controls");

      expect(panelId).not.toBeNull();
      expect(document.getElementById(panelId!)).toHaveAttribute("hidden");
    }
    expect(screen.queryByText(/ten truths/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /ai and agency/i })).not.toBeInTheDocument();
  });

  it("expands a quick hit by keyboard with its interpretation and detail route", async () => {
    const user = userEvent.setup();
    const insight = getFeaturedInsightsForTheme("play-belonging")[0];

    render(<InsightsPage />);

    const trigger = screen.getByRole("button", { name: new RegExp(insight.title) });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const panelId = trigger.getAttribute("aria-controls");
    expect(panelId).not.toBeNull();
    expect(document.getElementById(panelId!)).toHaveAttribute("hidden");

    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: insight.title });
    expect(within(panel).getByText(insight.interpretation)).toBeInTheDocument();
    expect(within(panel).queryByText(/confidence:/i)).not.toBeInTheDocument();
    expect(within(panel).queryByText(/nuance:/i)).not.toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: `Explore full detail: ${insight.title}` }))
      .toHaveAttribute("href", `/insights/${insight.id}`);
  });

  it("keeps multiple quick hits open in the same theme", async () => {
    const user = userEvent.setup();
    const [first, second] = getFeaturedInsightsForTheme("play-belonging");

    render(<InsightsPage />);

    const firstTrigger = screen.getByRole("button", { name: new RegExp(first.title) });
    const secondTrigger = screen.getByRole("button", { name: new RegExp(second.title) });

    await user.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    await user.click(secondTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(firstTrigger.getAttribute("aria-controls")!)).not.toHaveAttribute("hidden");
    expect(document.getElementById(secondTrigger.getAttribute("aria-controls")!)).not.toHaveAttribute("hidden");
  });

  it("keeps separate themes open independently while allowing multiple open quick hits per theme", async () => {
    const user = userEvent.setup();
    const [first, second] = getFeaturedInsightsForTheme("play-belonging");
    const [otherThemeInsight] = getFeaturedInsightsForTheme("media-influence");

    render(<InsightsPage />);

    const firstTrigger = screen.getByRole("button", { name: new RegExp(first.title) });
    const secondTrigger = screen.getByRole("button", { name: new RegExp(second.title) });
    const otherThemeTrigger = screen.getByRole("button", { name: new RegExp(otherThemeInsight.title) });

    await user.click(firstTrigger);
    await user.click(otherThemeTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    expect(otherThemeTrigger).toHaveAttribute("aria-expanded", "true");

    await user.click(secondTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
    expect(otherThemeTrigger).toHaveAttribute("aria-expanded", "true");
  });
});
