import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfluencerDetail from "../src/components/InfluencerDetail";
import { influencers } from "../src/lib/influencers";

describe("Influencer detail", () => {
  it("explains audience, influence, key moments, indicators, and a featured video", () => {
    const mrBeast = influencers.find((influencer) => influencer.id === "mrbeast");
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
  });
});
