import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InsightsPage from "../src/components/InsightsPage";
import { getInsightsForTheme } from "../src/lib/content/insights";

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

  it("expands a quick hit by keyboard with its interpretation, nuance, confidence, and detail route", async () => {
    const user = userEvent.setup();
    const insight = getInsightsForTheme("play-belonging")[0];

    render(<InsightsPage />);

    const trigger = screen.getByRole("button", { name: new RegExp(insight.title) });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(insight.nuance)).not.toBeInTheDocument();

    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: insight.title });
    expect(within(panel).getByText(insight.interpretation)).toBeInTheDocument();
    expect(within(panel).getByText(insight.nuance)).toBeInTheDocument();
    expect(within(panel).getByText((_, element) => element?.textContent === `Confidence: ${insight.confidence}`)).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: `Explore full detail: ${insight.title}` }))
      .toHaveAttribute("href", `/insights/${insight.id}`);
  });

  it("keeps one quick hit open per theme", async () => {
    const user = userEvent.setup();
    const [first, second] = getInsightsForTheme("play-belonging");

    render(<InsightsPage />);

    const firstTrigger = screen.getByRole("button", { name: new RegExp(first.title) });
    const secondTrigger = screen.getByRole("button", { name: new RegExp(second.title) });

    await user.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    await user.click(secondTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText(first.nuance)).not.toBeInTheDocument();
    expect(screen.getByText(second.nuance)).toBeInTheDocument();
  });
});
