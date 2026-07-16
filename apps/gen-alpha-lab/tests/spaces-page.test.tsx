import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfluencerDetail from "../src/components/InfluencerDetail";
import SpacesPage from "../src/components/SpacesPage";
import { cultureShapers } from "../src/lib/content/culture-shapers";

describe("Spaces page", () => {
  it("shows where Gen Alpha spends time and what each environment enables", () => {
    render(<SpacesPage />);

    expect(screen.getByRole("heading", { name: "Where time becomes culture." })).toBeInTheDocument();
    expect(screen.getAllByTestId("space-profile")).toHaveLength(12);
    for (const name of ["Roblox", "YouTube", "Discord", "TikTok", "Minecraft", "Fortnite"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.getAllByText("What it enables")).toHaveLength(12);
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
