import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InsightDetail from "@/components/InsightDetail";
import InsightTabs from "@/components/InsightTabs";
import InsightsPage from "@/components/InsightsPage";
import { generateStaticParams } from "@/app/insights/[insightId]/page";
import { generateStaticParams as generateTopicStaticParams } from "@/app/topics/[topicId]/page";
import { getEvidenceForInsight, getSource } from "@/lib/content/selectors";
import { getInsight, getInsightsForTheme, insights, themes } from "@/lib/content/insights";
import { findingTopics } from "@/lib/findings";

const themeIds = [
  "play-belonging",
  "media-influence",
  "time-routines",
  "learning-becoming",
] as const;

describe("forty-insight evidence graph", () => {
  it("organizes forty unique insights into four themes of ten", () => {
    expect(themes.map((theme) => theme.id)).toEqual(themeIds);
    expect(insights).toHaveLength(40);
    expect(new Set(insights.map((insight) => insight.id))).toHaveProperty("size", 40);

    for (const themeId of themeIds) {
      const themeInsights = getInsightsForTheme(themeId);
      expect(themeInsights).toHaveLength(10);
      expect(themeInsights.map((insight) => insight.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
  });

  it("backs every insight with two distinct direct sources", () => {
    for (const insight of insights) {
      const evidence = getEvidenceForInsight(insight.id);
      const sourceIds = new Set(evidence.map((item) => item.sourceId));

      expect(evidence.length, insight.id).toBeGreaterThanOrEqual(2);
      expect(sourceIds.size, insight.id).toBeGreaterThanOrEqual(2);
      for (const sourceId of sourceIds) {
        expect(getSource(sourceId)?.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("treats AI as a cross-cutting tag instead of a theme", () => {
    expect(themes.every((theme) => !`${theme.id} ${theme.title}`.toLowerCase().includes("ai"))).toBe(true);

    const aiInsights = insights.filter((insight) => insight.title.includes("AI"));
    expect(aiInsights.length).toBeGreaterThan(0);
    expect(aiInsights.every((insight) => insight.tags.includes("ai"))).toBe(true);
  });

  it("does not generate a standalone AI topic route", () => {
    expect(findingTopics.some((topic) => topic.id === "ai")).toBe(false);
    expect(generateTopicStaticParams().some(({ topicId }) => topicId === "ai")).toBe(false);
  });

  it("generates one static detail route for every insight", () => {
    const params = generateStaticParams();

    expect(params).toHaveLength(40);
    expect(new Set(params.map(({ insightId }) => insightId))).toHaveProperty("size", 40);
    expect(params.map(({ insightId }) => insightId)).toEqual(insights.map((insight) => insight.id));
  });

  it("renders forty unique direct insight links in the directory", () => {
    render(<InsightsPage />);

    const links = screen.getAllByRole("link", { name: /^Explore / });
    expect(links).toHaveLength(40);
    expect(new Set(links.map((link) => link.getAttribute("href")))).toHaveProperty("size", 40);
    expect(links.every((link) => link.getAttribute("href")?.startsWith("/insights/"))).toBe(true);
  });

  it("keeps the overview concise with accessible theme tabs", async () => {
    const user = userEvent.setup();
    render(<InsightTabs />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    const firstPanel = screen.getByRole("tabpanel");
    expect(within(firstPanel).getByTestId("lead-evidence")).toBeInTheDocument();
    expect(within(firstPanel).getAllByTestId("supporting-insight")).toHaveLength(4);
    expect(within(firstPanel).getByText(/20 evidence items/i)).toBeInTheDocument();
    expect(within(firstPanel).getByRole("link", { name: /all 10 play (?:&|and) belonging insights/i })).toHaveAttribute(
      "href",
      "/insights#play-belonging",
    );

    await user.click(screen.getByRole("tab", { name: "Learning & Becoming" }));
    expect(screen.getByRole("tab", { name: "Learning & Becoming" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Learning & Becoming");
  });

  it("shows evidence methodology, limitations, nuance, related entities, and strategy", () => {
    const insight = getInsight("play-social-infrastructure");
    expect(insight).toBeDefined();

    render(<InsightDetail insight={insight!} />);

    expect(screen.getByRole("heading", { name: insight!.title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evidence ledger" })).toBeInTheDocument();
    expect(screen.getAllByText("Methodology")).toHaveLength(2);
    expect(screen.getAllByText("Limitations")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Nuance and counterpoint" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Related culture shapers and spaces" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Roblox" })).toHaveAttribute("href", "/spaces");

    const agencyImplication = screen.getByTestId("agency-implication");
    expect(agencyImplication).toHaveAttribute("data-upgrade-target", "reach-them");
    expect(within(agencyImplication).getByRole("heading", { name: "Agency implication" })).toBeInTheDocument();
    expect(within(agencyImplication).getByRole("link", { name: "Open the Reach Them strategy" }))
      .toHaveAttribute("href", "/reach-them");

    for (const evidence of getEvidenceForInsight(insight!.id)) {
      const source = getSource(evidence.sourceId)!;
      expect(screen.getByRole("link", { name: source.title })).toHaveAttribute("href", source.url);
    }
  });
});
