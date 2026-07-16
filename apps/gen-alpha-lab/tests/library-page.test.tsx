import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LibraryPage from "../src/components/LibraryPage";
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
    expect(featuredCard?.parentElement?.firstElementChild).toBe(featuredCard);
    expect(screen.getByTitle(`${featuredTitle} podcast`)).toHaveAttribute(
      "src",
      "https://open.spotify.com/embed/episode/7l1peATWasIYA07RvqKgwn"
    );
  });

  it("uses privacy-enhanced embeds for the researched video library", async () => {
    const user = userEvent.setup();
    render(<LibraryPage initialRecords={seedRecords} />);

    await user.click(screen.getByRole("button", { name: "Videos" }));

    const embeds = screen.getAllByTitle(/video$/i);
    expect(embeds).toHaveLength(8);
    expect(embeds.map((embed) => embed.getAttribute("src"))).toEqual(expect.arrayContaining([
      "https://www.youtube-nocookie.com/embed/3mnan0zpxAo",
      "https://www.youtube-nocookie.com/embed/kjv85Ucx7Ho"
    ]));
    expect(embeds.every((embed) => embed.getAttribute("loading") === "lazy")).toBe(true);
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
