import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfluencerDetail from "../src/components/InfluencerDetail";
import { getCultureShaper } from "../src/lib/content/culture-shapers";

describe("Influencer detail", () => {
  it("explains audience, influence, key moments, indicators, and a featured video", () => {
    const mrBeast = getCultureShaper("mrbeast");
    expect(mrBeast).toBeDefined();
    render(<InfluencerDetail influencer={mrBeast!} />);

    expect(screen.getByRole("heading", { name: "MrBeast" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Why he matters" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Who is watching" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Key formats and moments" })).toBeInTheDocument();
    expect(screen.getAllByTestId("influencer-indicator")).toHaveLength(4);
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
    render(<InfluencerDetail influencer={bluey} />);

    expect(screen.getByRole("img", { name: "Bluey" })).toHaveAttribute("src", "/culture/bluey.jpg");
    expect(screen.getByText(bluey.influenceMechanism)).toBeVisible();
    for (const moment of bluey.definingMoments) expect(screen.getByText(moment)).toBeVisible();
  });

  it("renders official media when available and an intentional media fallback otherwise", () => {
    const artist = getCultureShaper("taylor-swift")!;
    const athlete = getCultureShaper("angel-reese")!;
    const { unmount } = render(<InfluencerDetail influencer={artist} />);

    expect(screen.getByTitle(/Taylor Swift video/i)).toHaveAttribute(
      "src",
      expect.stringContaining("youtube-nocookie.com/embed/"),
    );
    expect(
      screen.getAllByText(artist.indicators.participation.rationale).some((node) => !node.hasAttribute("hidden")),
    ).toBe(true);

    unmount();
    render(<InfluencerDetail influencer={athlete} />);
    expect(screen.getByRole("note", { name: "Media note" })).toHaveTextContent(athlete.mediaFallback!);
    expect(screen.getByText(athlete.influenceMechanism)).toBeVisible();
  });

  it("renders the media fallback when every listed video is non-embeddable", () => {
    const profile = getCultureShaper("angel-reese")!;
    const originalVideos = profile.videos;
    profile.videos = [{ youtubeId: "rights-managed", title: "Official highlight", embeddable: false }];

    try {
      render(<InfluencerDetail influencer={profile} />);

      expect(screen.queryByTitle(/Official highlight/i)).not.toBeInTheDocument();
      expect(screen.getByRole("note", { name: "Media note" })).toHaveTextContent(profile.mediaFallback!);
    } finally {
      profile.videos = originalVideos;
    }
  });
});
