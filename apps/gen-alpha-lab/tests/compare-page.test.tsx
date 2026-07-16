import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ComparePage from "../src/components/ComparePage";
import { comparisonDimensions, getComparisonEvidence } from "../src/lib/content/comparisons";
import type { ComparisonCohortKey, ComparisonDimension } from "../src/lib/content/types";

const topicTitles = [
  "Media & attention",
  "Play & belonging",
  "Learning & AI",
  "Friendship & connection",
  "Creation & expression",
  "Household influence",
];

const cohortLabels = {
  genZ: "Gen Z",
  genX: "Gen X",
  boomers: "Boomers",
} as const;

const strategicDifferences = {
  "media-attention": {
    genZ: "Gen Alpha enters a creator-led, algorithmic video mix earlier; Gen Z provides the clearest near-age precedent, not a fixed endpoint.",
    genX: "Plan for different discovery defaults: child-first participatory video for Alpha, with the 30-49 adult band used only as a directional media proxy.",
    boomers: "Do not force one channel plan across the household: Alpha's video discovery is participatory, while the 65+ adult proxy shows broad YouTube reach but far less TikTok use.",
  },
  "compare-play-belonging": {
    genZ: "Design for continuity, not a generation contest: both cohorts use games socially, while Alpha's evidence places making and learning inside the play space earlier.",
    genX: "The useful contrast is developmental, not stereotypical: Alpha's play evidence is platformed and collaborative; no matched Gen X childhood measure is available.",
    boomers: "Treat Alpha's creation-game behavior as a current child snapshot; the evidence base does not support a scored comparison with Boomer childhood play.",
  },
  "learning-ai": {
    genZ: "Alpha is forming learning habits with conversational AI present; the teen proxy shows adjacent adoption, not proof of a unique generational trait.",
    genX: "Design verification and adult support around Alpha's current AI use; there is no matched Gen X learning measure in the canonical evidence.",
    boomers: "Use Alpha's AI-learning evidence to plan safeguards now, without inventing a Boomer learning-style opposite.",
  },
  "friendship-connection": {
    genZ: "Gen Alpha's connection pattern is best read as cross-context continuity: the same friendship can move from a game to a group chat to the playground. Gen Z provides an adjacent teen snapshot, not a finished version of that pattern.",
    genX: "Treat Alpha's cross-context connection as a current design condition; this library does not support a quantified Gen X childhood comparison.",
    boomers: "Plan for the connections children have now, rather than turning nostalgia about older childhoods into a behavioral claim.",
  },
  "creation-expression": {
    genZ: "The useful insight is developmental rather than competitive: Gen Alpha encounters creation tools inside core play environments earlier. This library does not contain a clean Gen Z comparison measure for that claim.",
    genX: "Use the current Alpha creation environment as the strategy input; a historical comparison would exceed the available evidence.",
    boomers: "Do not make a nostalgia claim where the research library only supports the contemporary Alpha environment.",
  },
  "household-influence": {
    genZ: "Alpha's influence is still routed through adult permission and payment; Gen Z purchase influence is useful context, not a like-for-like child comparison.",
    genX: "Separate child desire from adult decision power: Alpha evidence measures household participation, while a matched Gen X commerce comparison is absent.",
    boomers: "Plan for a multi-generational decision system rather than opposing child and Boomer mentalities; the available evidence only measures Alpha's side.",
  },
} as const;

type TopicId = keyof typeof strategicDifferences;
const comparisonTopics: ComparisonDimension[] = comparisonDimensions;

describe("topic and cohort comparison", () => {
  it("defines six high-value topics and an exact strategic difference for every cohort combination", () => {
    expect(comparisonTopics.map((topic) => topic.title)).toEqual(topicTitles);

    for (const topic of comparisonTopics) {
      expect(topic.genAlpha.mentality).toMatch(/\S/);
      expect(topic.genAlpha.evidenceStatus).toBe("direct cohort evidence");
      expect(getComparisonEvidence(topic.genAlpha).length).toBeGreaterThan(0);

      expect(topic.id in strategicDifferences).toBe(true);
      for (const cohortKey of Object.keys(cohortLabels) as ComparisonCohortKey[]) {
        const comparison = topic.comparisons[cohortKey];
        expect(comparison.cohort.mentality).toMatch(/\S/);
        expect(comparison.realDifference).toBe(strategicDifferences[topic.id as TopicId][cohortKey]);
        expect(comparison.caveat).toMatch(/\S/);
        expect(comparison.comparisonClass).toMatch(/age-matched observed evidence|current cohort snapshot|directional interpretation/);
      }

      for (const cohortKey of ["genX", "boomers"] as const) {
        expect(topic.comparisons[cohortKey].cohort.evidenceStatus).toMatch(/adult age-band proxy|evidence gap/);
      }
    }

    expect(JSON.stringify(comparisonTopics)).not.toMatch(/made-up|technophobe|digital native|short attention span/i);
  });

  it("uses linked canonical evidence where available and leaves unsupported adult comparisons as gaps", () => {
    const media = comparisonTopics.find((topic) => topic.id === "media-attention");
    const learning = comparisonTopics.find((topic) => topic.id === "learning-ai");

    expect(media?.comparisons.genZ.cohort.evidenceIds).toContain("evidence-compare-deloitte-genz-media-1");
    expect(media?.comparisons.genX.cohort.evidenceIds).toContain("evidence-compare-pew-adult-platforms-1");
    expect(media?.comparisons.boomers.cohort.evidenceIds).toContain("evidence-compare-pew-adult-platforms-1");
    expect(learning?.comparisons.genX.cohort.evidenceStatus).toBe("evidence gap");
    expect(learning?.comparisons.genX.cohort.evidenceIds).toEqual([]);
    expect(learning?.comparisons.boomers.cohort.evidenceStatus).toBe("evidence gap");
    expect(learning?.comparisons.boomers.cohort.evidenceIds).toEqual([]);
  });

  it("updates one coherent result panel from keyboard-accessible cohort and topic controls", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComparePage />);

    expect(screen.getByRole("heading", { name: "Compare Gen Alpha by topic and cohort." })).toBeInTheDocument();
    const cohortControl = screen.getByRole("combobox", { name: "Comparison cohort" });
    const topicControl = screen.getByRole("combobox", { name: "Comparison topic" });
    expect(within(cohortControl).getAllByRole("option").map((option) => option.textContent)).toEqual(Object.values(cohortLabels));
    expect(within(topicControl).getAllByRole("option").map((option) => option.textContent)).toEqual(topicTitles);
    expect(screen.getAllByRole("region", { name: "Comparison result" })).toHaveLength(1);

    await user.selectOptions(cohortControl, "genX");
    await user.selectOptions(topicControl, "compare-play-belonging");

    const result = screen.getByRole("region", { name: "Comparison result" });
    expect(within(result).getByRole("heading", { name: "Play & belonging: Gen Alpha and Gen X" })).toBeInTheDocument();
    expect(within(result).getByText(strategicDifferences["compare-play-belonging"].genX)).toBeInTheDocument();
    expect(within(result).getByText("Evidence gap")).toBeInTheDocument();
    expect(within(result).queryByText(strategicDifferences["media-attention"].genZ)).not.toBeInTheDocument();
    expect(container.querySelectorAll(".comparison-result")).toHaveLength(1);
    expect(container.querySelector(".comparison-mentalities")?.children).toHaveLength(2);
  });

  it("renders a concrete statistic, source links, the comparison class, and methodology caveat", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    const result = screen.getByRole("region", { name: "Comparison result" });
    expect(within(result).getByText("Strategic interpretation")).toBeInTheDocument();
    expect(within(result).getByText("Comparison class")).toBeInTheDocument();
    expect(within(result).getByText("Methodology caveat")).toBeInTheDocument();
    expect(within(result).getByText(/54% more time.*26% less time/i)).toBeInTheDocument();
    expect(within(result).getByRole("link", { name: /2025 Digital Media Trends/i })).toHaveAttribute(
      "href",
      "https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html",
    );

    await user.selectOptions(screen.getByRole("combobox", { name: "Comparison cohort" }), "boomers");
    expect(within(result).getByText("Adult age-band proxy")).toBeInTheDocument();
    expect(within(result).getByText(/64% among ages 65\+.*TikTok use was.*12%/i)).toBeInTheDocument();
    expect(within(result).getByRole("link", { name: /Americans' Social Media Use 2025/i })).toHaveAttribute(
      "href",
      "https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/",
    );
  });

  it("uses a two-statement mobile stack rather than a four-column comparison rail", () => {
    const { container } = render(<ComparePage />);
    const styles = container.querySelector("style")?.textContent ?? "";

    expect(container.querySelector(".comparison-mentalities")?.children).toHaveLength(2);
    expect(styles).not.toMatch(/grid-template-columns:\s*repeat\(4/i);
    expect(styles).toMatch(/@media \(max-width: 700px\)[\s\S]*\.comparison-mentalities\s*\{\s*grid-template-columns:\s*1fr/);
  });
});
