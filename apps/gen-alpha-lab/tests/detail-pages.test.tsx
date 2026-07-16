import { render, screen } from "@testing-library/react";
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
    expect(screen.getAllByRole("navigation", { name: "Primary navigation" })).toHaveLength(1);
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
