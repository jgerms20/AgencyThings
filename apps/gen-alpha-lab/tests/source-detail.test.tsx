import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SourceDetail from "../src/components/SourceDetail";
import LabWorkspace from "../src/components/LabWorkspace";
import { sources } from "../src/lib/content/sources";
import { seedRecords } from "../src/lib/seed-data";

const source = sources.find((item) => item.id === "walton-creation-gaming-2024")!;
const zeroEvidenceSource = sources.find((item) => item.id === "mccrindle-generation-alpha-book")!;

describe("SourceDetail", () => {
  it("connects source scope, evidence, themes, and related insights", () => {
    render(<SourceDetail source={source} />);

    expect(screen.getByRole("heading", { level: 1, name: source.title })).toBeInTheDocument();
    expect(screen.getAllByText(source.population, { exact: false }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(source.methodology, { exact: false }).length).toBeGreaterThan(0);
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Play & Belonging")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /extracted evidence/i })).toBeInTheDocument();
    expect(screen.getByText(/shared activity gives friendship/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /related insights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Play is social infrastructure." })).toHaveAttribute(
      "href",
      "/insights/play-social-infrastructure"
    );
    expect(screen.getByRole("link", { name: /view direct source/i })).toHaveAttribute("href", source.url);
  });

  it("shows available author and publication-date metadata", () => {
    render(<SourceDetail source={zeroEvidenceSource} />);

    expect(screen.getByText(/^Author$/)).toBeInTheDocument();
    expect(screen.getByText(zeroEvidenceSource.author!)).toBeInTheDocument();
    expect(screen.getByText(/^Published$/)).toBeInTheDocument();
    expect(screen.getByText(zeroEvidenceSource.publishedAt!)).toHaveAttribute(
      "dateTime",
      zeroEvidenceSource.publishedAt
    );
  });

  it("uses a privacy-enhanced YouTube embed when a source includes a video ID", () => {
    render(<SourceDetail source={{ ...source, youtubeId: "3mnan0zpxAo" }} />);

    expect(screen.getByTitle(`${source.title} video`)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/3mnan0zpxAo"
    );
  });

  it("explains empty evidence, themes, and related insights", () => {
    render(<SourceDetail source={zeroEvidenceSource} />);

    expect(screen.getByText("No extracted evidence is linked yet. Use the direct source below to assess support before relying on this record.")).toBeInTheDocument();
    expect(screen.getByText("No themes are connected yet. Themes appear here when extracted evidence supports a related insight.")).toBeInTheDocument();
    expect(screen.getByText("No related insights are connected yet. This source is available for review but does not currently support a lab conclusion.")).toBeInTheDocument();
  });
});

describe("Gen Alpha editorial overview", () => {
  it("uses audience-focused podcast copy while preserving the Spotify destination", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(screen.queryByText("Joshua's point of view")).not.toBeInTheDocument();
    expect(screen.getByText("Listen to understand them more")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /listen on spotify/i })).toHaveAttribute(
      "href",
      "https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn?si=XGKqiaAJRAKCs2F4X3wn_g"
    );
  });
});
