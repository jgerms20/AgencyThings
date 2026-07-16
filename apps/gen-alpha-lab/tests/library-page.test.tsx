import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LibraryPage from "../src/components/LibraryPage";
import MediaEmbed, { getMediaEmbedConfig } from "../src/components/MediaEmbed";
import { sources } from "../src/lib/content/sources";
import { seedRecords } from "../src/lib/seed-data";

describe("LibraryPage", () => {
  it("orders research filters by media format instead of Make, Think, and Learn", async () => {
    const user = userEvent.setup();
    render(<LibraryPage initialRecords={seedRecords} />);

    const filters = within(screen.getByLabelText("Filter library by format"));
    expect(filters.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "All", "Podcasts", "Videos", "Articles", "Reports", "Books"
    ]);
    for (const removed of ["Make", "Think", "Learn"]) {
      expect(screen.queryByRole("button", { name: removed })).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: "Videos" }));
    expect(screen.getByRole("heading", { name: "Videos" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Reports" })).not.toBeInTheDocument();
    expect(screen.getByTitle(/Media and Young Kids/i)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/3mnan0zpxAo"
    );

    await user.click(screen.getByRole("button", { name: "Books" }));
    expect(screen.getByRole("link", { name: "Open source detail for Generation Alpha" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Videos" })).not.toBeInTheDocument();
  });

  it("features the Eclectic Polymath episode before other playable podcasts", async () => {
    const user = userEvent.setup();
    render(<LibraryPage initialRecords={seedRecords} />);

    await user.click(screen.getByRole("button", { name: "Podcasts" }));

    const featuredTitle = "#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood";
    const featuredCard = screen.getByRole("heading", { name: featuredTitle }).closest("article");
    expect(featuredCard).toHaveClass("library-row-featured");
    expect(within(featuredCard!).getByText("Featured synthesis")).toHaveClass("library-featured-label");
    expect(featuredCard?.parentElement?.firstElementChild).toBe(featuredCard);
    expect(screen.getByTitle(`${featuredTitle} podcast`)).toHaveAttribute(
      "src",
      "https://open.spotify.com/embed/episode/7l1peATWasIYA07RvqKgwn"
    );
  });

  it("defines a visible outline treatment for the featured synthesis card", () => {
    const css = readFileSync("src/app/globals.css", "utf8");

    expect(css).toMatch(/\.library-row-featured\s*\{[^}]*outline:/s);
    expect(css).toMatch(/\.library-row-featured\s*\{[^}]*box-shadow:/s);
  });

  it("uses privacy-enhanced embeds for every supplied researched video", async () => {
    const user = userEvent.setup();
    render(<LibraryPage initialRecords={seedRecords} />);

    await user.click(screen.getByRole("button", { name: "Videos" }));

    const embeds = screen.getAllByTitle(/video$/i);
    const suppliedVideoIds = [
      "3mnan0zpxAo",
      "xvHFk3zSDLY",
      "JVjtMiu-Pgg",
      "kaihRBDBjxY",
      "1rjB4u1wg6Y",
      "xEyK6RiXe30",
      "EQ-09fHY67U",
      "kjv85Ucx7Ho"
    ];

    expect(embeds).toHaveLength(suppliedVideoIds.length);
    expect(embeds.map((embed) => embed.getAttribute("src"))).toEqual(
      suppliedVideoIds.map((id) => `https://www.youtube-nocookie.com/embed/${id}`)
    );
    expect(embeds.every((embed) => embed.getAttribute("loading") === "lazy")).toBe(true);
  });

  it("maps each supported provider to a responsive embed contract", () => {
    const cases = [
      [
        "Spotify",
        "https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn?si=XGKqiaAJRAKCs2F4X3wn_g",
        "https://open.spotify.com/embed/episode/7l1peATWasIYA07RvqKgwn",
        "352 / 152"
      ],
      [
        "Apple Podcasts",
        "https://podcasts.apple.com/us/podcast/id1655565898?i=1000651416408",
        "https://embed.podcasts.apple.com/us/podcast/id1655565898?i=1000651416408",
        "660 / 175"
      ],
      [
        "Apple Podcasts slug path",
        "https://podcasts.apple.com/us/podcast/why-generation-alpha-and-the-age-of-ai/id1346054199?i=1000723571640",
        "https://embed.podcasts.apple.com/us/podcast/why-generation-alpha-and-the-age-of-ai/id1346054199?i=1000723571640",
        "660 / 175"
      ],
      [
        "YouTube",
        "https://www.youtube.com/watch?v=3mnan0zpxAo",
        "https://www.youtube-nocookie.com/embed/3mnan0zpxAo",
        "16 / 9"
      ]
    ] as const;

    for (const [, url, src, aspectRatio] of cases) {
      expect(getMediaEmbedConfig(url)).toEqual({ src, aspectRatio });
    }

    render(<MediaEmbed title="Responsive video" url={cases.at(-1)![1]} />);
    expect(screen.getByTitle("Responsive video video")).toHaveClass("media-embed");
    expect(screen.getByTitle("Responsive video video")).toHaveStyle({
      aspectRatio: "16 / 9",
      width: "100%"
    });
  });

  it("falls back to external links for malformed YouTube watch and channel URLs", async () => {
    const user = userEvent.setup();
    const malformedRecords = [
      {
        ...seedRecords.find((record) => record.id === "common-sense-media-youtube-2025")!,
        id: "malformed-youtube-watch",
        title: "Malformed YouTube watch URL",
        url: "https://www.youtube.com/watch?feature=share"
      },
      {
        ...seedRecords.find((record) => record.id === "common-sense-media-youtube-2025")!,
        id: "malformed-youtube-channel",
        title: "Malformed YouTube channel URL",
        url: "https://www.youtube.com/channel/UC1234567890"
      }
    ];

    render(<LibraryPage initialRecords={[...seedRecords, ...malformedRecords]} />);
    await user.click(screen.getByRole("button", { name: "Videos" }));

    for (const record of malformedRecords) {
      expect(getMediaEmbedConfig(record.url)).toBeUndefined();
      expect(screen.queryByTitle(`${record.title} video`)).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Open ${record.title}` })).toHaveAttribute("href", record.url);
    }
  });

  it("rejects malformed Apple Podcast paths while retaining their external links", async () => {
    const user = userEvent.setup();
    const malformedRecords = [
      {
        ...seedRecords.find((record) => record.id === "in-the-demo-meet-gen-alpha")!,
        id: "malformed-apple-suffix",
        title: "Malformed Apple suffix URL",
        url: "https://podcasts.apple.com/us/podcast/meet-gen-alpha/id1655565898/trailer?i=1000651416408"
      },
      {
        ...seedRecords.find((record) => record.id === "in-the-demo-meet-gen-alpha")!,
        id: "malformed-apple-query",
        title: "Malformed Apple query URL",
        url: "https://podcasts.apple.com/us/podcast/meet-gen-alpha/id1655565898?i=1000651416408&uo=4"
      },
      {
        ...seedRecords.find((record) => record.id === "in-the-demo-meet-gen-alpha")!,
        id: "malformed-apple-show-id",
        title: "Malformed Apple show ID URL",
        url: "https://podcasts.apple.com/us/podcast/meet-gen-alpha/idshow?i=1000651416408"
      }
    ];

    render(<LibraryPage initialRecords={[...seedRecords, ...malformedRecords]} />);
    await user.click(screen.getByRole("button", { name: "Podcasts" }));

    for (const record of malformedRecords) {
      expect(getMediaEmbedConfig(record.url)).toBeUndefined();
      expect(screen.queryByTitle(`${record.title} podcast`)).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Open ${record.title}` })).toHaveAttribute("href", record.url);
    }
  });

  it("links canonical source cards to their extracted-evidence details", () => {
    const source = sources.find((item) => item.id === "pwc-alpha-2026")!;
    render(<LibraryPage initialRecords={seedRecords} />);

    expect(screen.getByRole("heading", { name: source.title })).toBeInTheDocument();
    expect(screen.getByText(source.population, { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `Open source detail for ${source.title}` })).toHaveAttribute(
      "href",
      "/library/pwc-alpha-2026"
    );
  });

  it("previews the evidence context for every canonical source card", () => {
    const source = sources.find((item) => item.id === "walton-creation-gaming-2024")!;
    render(<LibraryPage initialRecords={seedRecords} />);

    const link = screen.getByRole("link", { name: `Open source detail for ${source.title}` });
    const card = link.closest("article");

    expect(card).not.toBeNull();
    expect(within(card!).getByText(source.population, { exact: false })).toBeInTheDocument();
    expect(within(card!).getByText(source.methodology, { exact: false })).toBeInTheDocument();
    expect(card).toHaveTextContent("8 extracted evidence items");
    expect(card).toHaveTextContent("Themes: Play & Belonging, Learning & Becoming");
    expect(card).toHaveTextContent("Strength: High");
  });
});
