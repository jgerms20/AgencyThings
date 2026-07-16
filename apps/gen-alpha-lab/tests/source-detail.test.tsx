import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SourceDetail from "../src/components/SourceDetail";
import LabWorkspace from "../src/components/LabWorkspace";
import { sources } from "../src/lib/content/sources";
import { seedRecords } from "../src/lib/seed-data";

const source = sources.find((item) => item.id === "walton-creation-gaming-2024")!;

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

  it("uses a privacy-enhanced YouTube embed when a source includes a video ID", () => {
    render(<SourceDetail source={{ ...source, youtubeId: "3mnan0zpxAo" }} />);

    expect(screen.getByTitle(`${source.title} video`)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/3mnan0zpxAo"
    );
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
