import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { cultureShapers } from "../src/lib/content/culture-shapers";
import { seedRecords } from "../src/lib/seed-data";

const culturePreview = [
  { id: "mrbeast", name: "MrBeast", image: "/culture/mrbeast.png" },
  { id: "kai-cenat", name: "Kai Cenat", image: "/creators/kai-cenat.jpg" },
  { id: "bluey", name: "Bluey", image: "/culture/bluey.jpg" },
  { id: "aphmau", name: "Aphmau", image: "/creators/aphmau.jpg" },
  { id: "kpop-demon-hunters", name: "KPop Demon Hunters", image: "/culture/kpop-demon-hunters.jpg" },
] as const;

const shelfRecords = {
  Podcast: ["owned-podcast-093", "future-report-alpha-mccrindle-2025"],
  Video: ["common-sense-media-youtube-2025", "mccrindle-inside-gen-alpha-video"],
  Article: ["generation-alpha-education-review-2024", "digital-wellbeing-review-2025"],
  Book: ["mccrindle-generation-alpha-book", "anxious-generation-book"],
  Report: ["pwc-alpha-2026", "nielsen-ai-discovery-2026"],
} as const;

describe("Gen Alpha editorial overview", () => {
  afterEach(() => window.localStorage.clear());

  it("opens with an editorial field-guide title and keeps the four insight tabs", async () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    expect(screen.getByRole("heading", { name: "A field guide to Gen Alpha now." })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Gen Alpha, in forty insights." })).not.toBeInTheDocument();
    expect(screen.getByText(/culture, spaces, media, and choices/i)).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: "Play & Belonging" })).toHaveAttribute("aria-selected", "true");

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const destination of ["Overview", "Insights", "Influencers", "Spaces", "Ways in", "Gender lens", "Compare", "Summary", "Library"]) {
      expect(navigation).toHaveTextContent(destination);
    }

    expect(screen.getByRole("link", { name: "Open the summary" })).toHaveAttribute("href", "/summary");
    expect(screen.getByRole("link", { name: "Explore the gender lens" })).toHaveAttribute("href", "/gender");
  });

  it("previews a balanced culture directory with working local IP art and all links", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    for (const shaper of culturePreview) {
      expect(screen.getByRole("link", { name: new RegExp(shaper.name) })).toHaveAttribute(
        "href",
        `/influencers/${shaper.id}`,
      );
      if ("image" in shaper) {
        const image = screen.getByRole("img", { name: shaper.name });
        expect(image).toHaveAttribute("src", shaper.image);
        expect(image).toHaveAttribute("loading", "lazy");
        expect(image).toHaveAttribute("decoding", "async");
        expect(existsSync(join(process.cwd(), "public", shaper.image))).toBe(true);
      }
    }

    expect(screen.getByRole("link", { name: `Explore all ${cultureShapers.length} culture shapers` })).toHaveAttribute(
      "href",
      "/influencers",
    );
  });

  it("previews the canonical 54 spaces with working destination links", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(screen.getByRole("link", { name: "Explore all 54 spaces" })).toHaveAttribute("href", "/spaces");
    for (const space of ["roblox", "school", "parks-playgrounds-pickup-play"]) {
      expect(document.querySelector(`a[href="/spaces#${space}"]`)).toBeInTheDocument();
    }
  });

  it("embeds the Eclectic Polymath Spotify episode with official playback controls", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    const podcast = seedRecords.find((record) => record.id === "owned-podcast-093");
    expect(podcast).toBeDefined();
    const embed = screen.getByTitle(`${podcast?.title} podcast`);
    expect(embed).toHaveAttribute("src", "https://open.spotify.com/embed/episode/7l1peATWasIYA07RvqKgwn");
    expect(embed).toHaveAttribute("allow", expect.stringContaining("encrypted-media"));
    expect(screen.getAllByTitle(/podcast|video/)).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Open the episode on Spotify" })).toHaveAttribute("href", podcast?.url);
  });

  it("offers three expandable reach principles and links each one to the full guide", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    const principles = screen.getAllByTestId("overview-reach-principle");
    expect(principles).toHaveLength(3);

    for (const title of ["Create value", "Fit the context", "Apply guardrails"]) {
      const summary = screen.getByText(title);
      const disclosure = summary.closest("details");
      expect(disclosure).not.toHaveAttribute("open");
      await user.click(summary);
      expect(disclosure).toHaveAttribute("open");
      expect(within(disclosure as HTMLElement).getByRole("link", { name: `Explore ${title}` })).toHaveAttribute(
        "href",
        "/reach-them",
      );
    }
  });

  it("changes the Alpha versus Gen Z snapshot across three topic controls", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    const comparison = screen.getByRole("region", { name: "Gen Alpha versus Gen Z snapshot" });
    const topicButtons = within(comparison).getAllByRole("button");
    expect(topicButtons).toHaveLength(3);
    expect(topicButtons.map((button) => button.textContent)).toEqual([
      "Media & attention",
      "Play & belonging",
      "Learning & AI",
    ]);
    expect(topicButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(within(comparison).getByText(/video, games, streaming, and conversational discovery/i)).toBeInTheDocument();
    expect(within(comparison).getByText(/enters a creator-led, algorithmic video mix earlier/i)).toBeInTheDocument();

    await user.click(within(comparison).getByRole("button", { name: "Play & belonging" }));

    expect(within(comparison).getByText(/place to make, learn, and maintain relationships/i)).toBeInTheDocument();
    expect(within(comparison).getByText(/design for continuity, not a generation contest/i)).toBeInTheDocument();
    expect(within(comparison).queryByText(/enters a creator-led, algorithmic video mix earlier/i)).not.toBeInTheDocument();
    expect(within(comparison).getByRole("link", { name: "Compare more topics and cohorts" })).toHaveAttribute(
      "href",
      "/compare",
    );
  });

  it("shows exactly two compact records per media format with Eclectic Polymath first", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    const shelf = screen.getByRole("region", { name: "Curated media shelf" });
    const shelfItems = within(shelf).getAllByTestId(/overview-media-/);
    expect(shelfItems).toHaveLength(10);
    expect(shelfItems[0]).toHaveTextContent("Eclectic Polymath");

    for (const [format, ids] of Object.entries(shelfRecords)) {
      const formatItems = within(shelf).getAllByTestId(`overview-media-${format.toLowerCase()}`);
      expect(formatItems).toHaveLength(2);

      ids.forEach((id, index) => {
        const record = seedRecords.find((candidate) => candidate.id === id);
        expect(record).toBeDefined();
        expect(formatItems[index]).toHaveTextContent(format);
        expect(formatItems[index]).toHaveTextContent(record?.title ?? "");
        expect(formatItems[index]).toHaveTextContent(record?.source ?? "");
        expect(within(formatItems[index]).getByRole("link")).toHaveAttribute("href", `/library/${id}`);
        expect(within(formatItems[index]).queryByText(record?.summary ?? "")).not.toBeInTheDocument();
      });
    }

    expect(within(shelf).getByRole("link", { name: "Browse the full library" })).toHaveAttribute("href", "/library");
  });

  it("switches between dark and light themes", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
