import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FindingDetail from "../src/components/FindingDetail";
import TopicDetail from "../src/components/TopicDetail";
import { findings, findingTopics } from "../src/lib/findings";

describe("Insight-led detail pages", () => {
  it("puts the finding conclusion before analysis and evidence", () => {
    const finding = findings[0];
    render(<FindingDetail finding={finding} />);

    expect(screen.getByRole("heading", { level: 1, name: finding.title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we know" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why it matters" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evidence" })).toBeInTheDocument();
    const primaryNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(primaryNavigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Overview",
      "Insights",
      "Influencers",
      "Spaces",
      "How to reach them",
      "Compare",
      "Library",
    ]);
    expect(screen.queryByText(/Evidence confidence/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Related findings" })).not.toBeInTheDocument();
  });

  it("leads the topic page with its thesis and removes repeated taxonomy navigation", () => {
    const topic = findingTopics[0];
    render(<TopicDetail topic={topic} />);

    expect(screen.getByRole("heading", { level: 1, name: topic.thesis })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we know" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why it matters" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Evidence" })).toBeInTheDocument();
    expect(screen.queryByText("Visual anatomy")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Continue through the system" })).not.toBeInTheDocument();
  });
});
