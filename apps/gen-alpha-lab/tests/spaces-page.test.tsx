import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InfluencerDetail from "../src/components/InfluencerDetail";
import SpacesPage from "../src/components/SpacesPage";
import { cultureShapers } from "../src/lib/content/culture-shapers";

describe("Spaces page", () => {
  it("renders fifty evidence-aware profiles without the broken field label", () => {
    render(<SpacesPage />);

    expect(screen.getByRole("heading", { name: "Where time becomes culture." })).toBeInTheDocument();
    expect(screen.getAllByTestId("space-profile")).toHaveLength(50);
    for (const name of ["Roblox", "YouTube", "Discord", "Spotify", "ChatGPT", "School"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.queryByText("What it enables")).not.toBeInTheDocument();
    expect(screen.getAllByText("Why they go")).toHaveLength(50);
    expect(screen.getAllByText("What happens there")).toHaveLength(50);
    expect(screen.getAllByText("Safety and age caveat")).toHaveLength(50);
  });

  it("filters by category, environment, and age and restores all results", async () => {
    const user = userEvent.setup();
    render(<SpacesPage />);

    const directory = screen.getByRole("region", { name: "Space directory" });
    expect(directory).toHaveStyle({ maxWidth: "100%" });
    expect(screen.getByRole("status")).toHaveTextContent("50 spaces shown");

    await user.selectOptions(screen.getByRole("combobox", { name: "Category" }), "Games & Participatory Worlds");
    expect(screen.getAllByTestId("space-profile")).toHaveLength(15);
    expect(screen.getByRole("heading", { name: "Geometry Dash" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Spotify" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all space filters" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Environment" }), "physical");
    expect(screen.getAllByTestId("space-profile")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "After-school sports and clubs" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all space filters" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Audience age" }), "3-5");
    expect(screen.getByRole("heading", { name: "Toca Boca World" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "YouTube Kids" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Discord" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all space filters" }));
    expect(screen.getAllByTestId("space-profile")).toHaveLength(50);
  });

  it("provides a rendered anchor for every culture-shaper related-space href", () => {
    render(<SpacesPage />);

    for (const shaper of cultureShapers) {
      const detail = render(<InfluencerDetail influencer={shaper} />);
      const relatedLinks = [...detail.container.querySelectorAll<HTMLAnchorElement>('a[href^="/spaces#"]')];
      expect(relatedLinks).toHaveLength(shaper.relatedSpaceIds.length);

      for (const link of relatedLinks) {
        const anchorId = link.getAttribute("href")!.split("#")[1];
        const anchor = document.getElementById(anchorId);
        expect(anchor).toBeInTheDocument();
        expect(anchor).toHaveAttribute("aria-labelledby", `${anchorId}-heading`);
        expect(anchor).toHaveAttribute("tabindex", "-1");
      }
      detail.unmount();
    }
  });
});
