import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PeoplePage from "../src/components/PeoplePage";
import { influencers } from "../src/lib/influencers";

describe("Influencers directory", () => {
  it("shows thirty culture shapers and opens internal intelligence profiles", () => {
    render(<PeoplePage />);

    expect(
      screen.getByRole("heading", {
        name: "Who shapes their world."
      })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("influencer-card")).toHaveLength(30);

    for (const influencer of influencers) {
      expect(screen.getByRole("link", { name: `Explore ${influencer.name}` })).toHaveAttribute(
        "href",
        `/influencers/${influencer.id}`
      );
    }

    for (const portrait of screen.getAllByRole("img")) {
      expect(portrait).toHaveAttribute("loading", "lazy");
      expect(portrait).toHaveAttribute("decoding", "async");
    }
  });

  it("keeps platform labels concise on directory cards while preserving profile links", () => {
    render(<PeoplePage />);

    const shaper = influencers.find((entry) => entry.platforms.length > 2);
    expect(shaper).toBeDefined();

    const card = screen.getByRole("link", { name: `Explore ${shaper!.name}` }).closest("article")!;
    const platforms = within(card).getByTestId("culture-shaper-platforms");

    expect(within(platforms).getAllByTestId("culture-shaper-platform")).toHaveLength(2);
    expect(platforms).toHaveTextContent(`+${shaper!.platforms.length - 2}`);
  });
});
