import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ComparePage from "../src/components/ComparePage";
import {
  comparisonDimensions,
  generations,
  getComparisonEvidence,
  getGenerationCohort,
  getPairRead,
} from "../src/lib/content/comparisons";
import type { ComparisonCohortKey } from "../src/lib/content/types";

const topicTitles = [
  "Formative moments",
  "Biggest shows",
  "Movies",
  "Music",
  "Public events",
  "Media mix",
];

const generationLabels = ["Boomers", "Gen X", "Millennials", "Gen Z", "Gen Alpha"];
const cohortKeys: ComparisonCohortKey[] = ["genZ", "millennials", "genX", "boomers"];

describe("generation comparison board", () => {
  it("defines six comparable topics across all five generations, including millennials", () => {
    expect(generations.map((generation) => generation.label)).toEqual(generationLabels);
    expect(comparisonDimensions.map((topic) => topic.title)).toEqual(topicTitles);

    for (const topic of comparisonDimensions) {
      expect(topic.genAlpha.mentality).toMatch(/\S/);
      expect((topic.genAlpha.entries ?? []).length).toBeGreaterThan(0);
      expect(getComparisonEvidence(topic.genAlpha).length).toBeGreaterThan(0);

      for (const cohortKey of cohortKeys) {
        const comparison = topic.comparisons[cohortKey];
        expect(comparison.cohort.mentality).toMatch(/\S/);
        expect(comparison.realDifference).toMatch(/\S/);
        expect(comparison.caveat).toMatch(/\S/);
        expect((comparison.cohort.entries ?? []).length).toBeGreaterThan(0);
      }

      expect(getPairRead(topic, "genZ", "boomers")).toMatch(/\S/);
      expect(getPairRead(topic, "millennials", "genAlpha")).toBe(topic.comparisons.millennials.realDifference);
    }

    expect(JSON.stringify(comparisonDimensions)).not.toMatch(/made-up|technophobe|digital native|short attention span/i);
  });

  it("keeps Love Island, Breaking Bad, and formative Z moments in the canon", () => {
    const shows = comparisonDimensions.find((topic) => topic.id === "tv-shows");
    const moments = comparisonDimensions.find((topic) => topic.id === "formative-moments");
    const music = comparisonDimensions.find((topic) => topic.id === "music");

    expect(shows?.comparisons.genZ.cohort.entries?.some((entry) => entry.id === "love-island")).toBe(true);
    expect(shows?.comparisons.millennials.cohort.entries?.some((entry) => entry.id === "breaking-bad")).toBe(true);
    expect(moments?.comparisons.genZ.cohort.entries?.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      "september-11",
      "iphone",
      "obama",
      "election-2016",
      "covid",
      "chatgpt",
      "luigi",
    ]));
    expect(music?.genAlpha.entries?.some((entry) => entry.id === "kpop")).toBe(true);
  });

  it("uses Deloitte and Pew only on the measured media-mix topic", () => {
    const media = comparisonDimensions.find((topic) => topic.id === "media-mix");
    expect(media?.comparisons.genZ.cohort.evidenceIds).toContain("evidence-compare-deloitte-genz-media-1");
    expect(media?.comparisons.genX.cohort.evidenceIds).toContain("evidence-compare-pew-adult-platforms-1");
    expect(media?.comparisons.boomers.cohort.evidenceIds).toContain("evidence-compare-pew-adult-platforms-1");
    expect(media?.comparisons.millennials.cohort.evidenceStatus).toBe("adult age-band proxy");
    expect(getGenerationCohort(media!, "genAlpha").evidenceStatus).toBe("direct cohort evidence");
  });

  it("lets someone compare Gen Z and Boomers without Gen Alpha", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    expect(screen.getByRole("heading", { name: /Two generations/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Left generation" })).toHaveValue("genZ");
    expect(screen.getByRole("combobox", { name: "Right generation" })).toHaveValue("genAlpha");
    expect(screen.getByRole("button", { name: "Formative moments" })).toHaveAttribute("aria-pressed", "true");

    await user.selectOptions(screen.getByRole("combobox", { name: "Right generation" }), "boomers");

    expect(screen.getByRole("combobox", { name: "Left generation" })).toHaveValue("genZ");
    expect(screen.getByRole("combobox", { name: "Right generation" })).toHaveValue("boomers");

    const result = screen.getByRole("region", { name: "Comparison result" });
    expect(within(result).getByText(getPairRead(comparisonDimensions[0], "genZ", "boomers"))).toBeInTheDocument();
    expect(within(result).queryByText(/Their memory starts in a phone-and-platform world/i)).not.toBeInTheDocument();
    expect(within(result).getByText(/Network television, civil rights, Vietnam/i)).toBeInTheDocument();
  });

  it("switches topics from chips and keeps evidence collapsed", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByRole("button", { name: "Biggest shows" }));
    const result = screen.getByRole("region", { name: "Comparison result" });
    expect(within(result).getByText(/What counted as “the show”/i)).toBeInTheDocument();
    expect(within(result).getByText("Love Island")).toBeInTheDocument();
    expect(within(result).getByText("Bluey")).toBeInTheDocument();

    const proof = within(result).getByTestId("comparison-proof");
    expect(proof).not.toHaveAttribute("open");
    await user.click(within(proof).getByText("Evidence and methodology"));
    expect(proof).toHaveAttribute("open");
    expect(within(proof).getAllByText(/editorial canon board/i).length).toBeGreaterThan(0);
  });

  it("marks overlapping moments when two generations share an event", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    expect(screen.getAllByText("shared").length).toBeGreaterThan(0);

    await user.selectOptions(screen.getByRole("combobox", { name: "Left generation" }), "millennials");
    expect(screen.getByText("COVID as working adults")).toBeInTheDocument();
    expect(screen.getByText("COVID school")).toBeInTheDocument();
  });

  it("keeps two different generations when the same option is chosen twice", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Left generation" }), "genAlpha");
    expect(screen.getByRole("combobox", { name: "Left generation" })).toHaveValue("genAlpha");
    expect(screen.getByRole("combobox", { name: "Right generation" })).toHaveValue("genZ");
  });

  it("opens measured media mix without pretending it is a taste ranking", async () => {
    const user = userEvent.setup();
    render(<ComparePage />);

    await user.click(screen.getByRole("button", { name: "Media mix" }));
    const result = screen.getByRole("region", { name: "Comparison result" });
    expect(within(result).getByText(/The one comparison in this set we can actually score/i)).toBeInTheDocument();
    expect(within(result).getByText(/54% more time on social\/UGC/i)).toBeInTheDocument();

    const proof = within(result).getByTestId("comparison-proof");
    await user.click(within(proof).getByText("Evidence and methodology"));
    expect(within(proof).getByRole("link", { name: "Open direct source: 2025 Digital Media Trends" })).toHaveAttribute(
      "href",
      "https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html",
    );
  });
});
