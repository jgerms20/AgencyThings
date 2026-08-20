import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfluencerDetail from "../src/components/InfluencerDetail";
import { getCultureShaper } from "../src/lib/content/culture-shapers";
import { getHumanProfile } from "../src/lib/content/profiles";

describe("Influencer detail", () => {
  it("explains influence, key moments, and a featured video without indicator tiers", () => {
    const mrBeast = getCultureShaper("mrbeast");
    expect(mrBeast).toBeDefined();
    render(<InfluencerDetail influencer={mrBeast!} />);

    expect(screen.getByRole("heading", { name: "MrBeast" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why he matters" })).toBeInTheDocument();
    expect(screen.queryAllByTestId("influencer-indicator")).toHaveLength(0);
    expect(screen.getByTitle(/MrBeast video/i)).toHaveAttribute(
      "src",
      expect.stringContaining("youtube-nocookie.com/embed/")
    );
    expect(screen.getByRole("link", { name: "Open MrBeast video on YouTube" })).toHaveAttribute(
      "href",
      expect.stringContaining("youtube.com/watch?v="),
    );
  });

  it("renders local IP portrait imagery and its bespoke influence reasoning", () => {
    const bluey = getCultureShaper("bluey")!;
    const human = getHumanProfile("bluey");
    render(<InfluencerDetail influencer={bluey} />);

    expect(screen.getByRole("img", { name: "Bluey" })).toHaveAttribute("src", "/culture/bluey.jpg");
    expect(screen.getByText(bluey.influenceMechanism)).toBeVisible();
    for (const moment of human?.knownFor ?? bluey.definingMoments) expect(screen.getByText(moment)).toBeVisible();
  });

  it("renders official media when available and sourced local portraits for featured athletes", () => {
    const artist = getCultureShaper("taylor-swift")!;
    const athlete = getCultureShaper("angel-reese")!;
    const { unmount } = render(<InfluencerDetail influencer={artist} />);

    expect(screen.getByTitle(/Taylor Swift video/i)).toHaveAttribute(
      "src",
      expect.stringContaining("youtube-nocookie.com/embed/"),
    );
    expect(screen.queryAllByTestId("influencer-indicator")).toHaveLength(0);

    unmount();
    render(<InfluencerDetail influencer={athlete} />);
    expect(screen.getByRole("img", { name: "Angel Reese" })).toHaveAttribute("src", "/culture/angel-reese.jpg");
    expect(screen.queryByRole("note", { name: "Media note" })).not.toBeInTheDocument();
    expect(screen.getByText(athlete.influenceMechanism)).toBeVisible();
  });

  it("keeps the local portrait when every listed video is non-embeddable", () => {
    const profile = getCultureShaper("angel-reese")!;
    const originalVideos = profile.videos;
    profile.videos = [{ youtubeId: "rights-managed", title: "Official highlight", embeddable: false }];

    try {
      render(<InfluencerDetail influencer={profile} />);

      expect(screen.queryByTitle(/Official highlight/i)).not.toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Angel Reese" })).toHaveAttribute("src", "/culture/angel-reese.jpg");
    } finally {
      profile.videos = originalVideos;
    }
  });
});
