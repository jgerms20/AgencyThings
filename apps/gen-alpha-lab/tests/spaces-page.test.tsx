import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InfluencerDetail from "../src/components/InfluencerDetail";
import SpacesPage from "../src/components/SpacesPage";
import { cultureShapers } from "../src/lib/content/culture-shapers";

describe("Spaces page", () => {
  it("renders the expanded evidence-aware profiles without the broken field label", () => {
    render(<SpacesPage />);

    expect(screen.getByRole("heading", { name: "Where time becomes culture." })).toBeInTheDocument();
    expect(screen.getAllByTestId("space-profile")).toHaveLength(54);
    for (const name of ["Roblox", "YouTube", "Discord", "Spotify", "ChatGPT", "School"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.queryByText("What it enables")).not.toBeInTheDocument();
    expect(screen.getAllByText("Why they go")).toHaveLength(54);
    expect(screen.getAllByText("What happens there")).toHaveLength(54);
    expect(screen.getAllByText("Safety and age caveat")).toHaveLength(54);
  });

  it("filters by category, environment, and age and restores all results", async () => {
    const user = userEvent.setup();
    render(<SpacesPage />);

    const directory = screen.getByRole("region", { name: "Space directory" });
    expect(directory).toHaveStyle({ maxWidth: "100%" });
    expect(screen.getByRole("status")).toHaveTextContent("54 spaces shown");

    await user.selectOptions(screen.getByRole("combobox", { name: "Category" }), "Games & Participatory Worlds");
    expect(screen.getAllByTestId("space-profile")).toHaveLength(15);
    expect(screen.getByRole("heading", { name: "Geometry Dash" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Spotify" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all space filters" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Environment" }), "physical");
    expect(screen.getAllByTestId("space-profile")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "After-school sports and clubs" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all space filters" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Audience age" }), "3-5");
    expect(screen.getByRole("heading", { name: "Toca Boca World" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "YouTube Kids" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Discord" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all space filters" }));
    expect(screen.getAllByTestId("space-profile")).toHaveLength(54);
  });

  it("reveals one related format reference at a time with an always-mounted accessible panel", async () => {
    const user = userEvent.setup();
    const spacesPage = render(<SpacesPage />);

    const libraryButton = screen.getByRole("button", { name: "Show related format reference for Public libraries and maker spaces" });
    const artsButton = screen.getByRole("button", { name: "Show related format reference for Youth arts, dance, and music studios" });
    const libraryPanelId = libraryButton.getAttribute("aria-controls");

    for (const trigger of screen.getAllByRole("button", { name: /related format reference/i })) {
      const panelId = trigger.getAttribute("aria-controls");
      expect(panelId).not.toBeNull();
      expect(spacesPage.container.querySelector(`#${panelId}`)).toHaveAttribute("hidden");
    }
    expect(libraryButton).toHaveAttribute("aria-expanded", "false");
    expect(libraryPanelId).not.toBeNull();
    expect(spacesPage.container.querySelector(`#${libraryPanelId}`)).toHaveAttribute("hidden");

    await user.click(libraryButton);
    const libraryPanel = spacesPage.container.querySelector<HTMLElement>(`#${libraryPanelId}`)!;
    const libraryFrame = within(libraryPanel).getByTitle("Public libraries and maker spaces related format reference");
    expect(libraryButton).toHaveAttribute("aria-expanded", "true");
    expect(libraryPanel).not.toHaveAttribute("hidden");
    expect(within(libraryPanel).getByText("Related format reference")).toBeInTheDocument();
    expect(within(libraryPanel).getByText("Not evidence of usage")).toBeInTheDocument();
    expect(within(libraryPanel).getByText("Provenance")).toBeInTheDocument();
    expect(libraryFrame).toHaveAttribute("loading", "lazy");
    expect(libraryFrame).toHaveClass("space-related-format-reference-embed");
    expect(libraryFrame).toHaveAttribute("src", expect.stringContaining("https://www.youtube-nocookie.com/embed/"));
    expect(within(libraryPanel).getByRole("link", { name: "Watch Public libraries and maker spaces related format reference on YouTube" })).toHaveAttribute("target", "_blank");

    await user.click(artsButton);
    expect(libraryPanel).toHaveAttribute("hidden");
    expect(screen.getByTitle("Youth arts, dance, and music studios related format reference")).toBeInTheDocument();
  });

  it("provides a rendered anchor for every culture-shaper related-space href", () => {
    const spacesPage = render(<SpacesPage />);

    for (const shaper of cultureShapers) {
      const detail = render(<InfluencerDetail influencer={shaper} />);
      const relatedLinks = [...detail.container.querySelectorAll<HTMLAnchorElement>('a[href^="/spaces#"]')];
      expect(relatedLinks).toHaveLength(shaper.relatedSpaceIds.length);

      for (const link of relatedLinks) {
        const anchorId = link.getAttribute("href")!.split("#")[1];
        const anchor = spacesPage.container.querySelector<HTMLElement>(`#${anchorId}`);
        expect(anchor).toBeInTheDocument();
        expect(anchor).toHaveAttribute("aria-labelledby", `${anchorId}-heading`);
        expect(anchor).toHaveAttribute("tabindex", "-1");
      }
      detail.unmount();
    }
  });
});
