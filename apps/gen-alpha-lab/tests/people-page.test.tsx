import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PeoplePage from "../src/components/PeoplePage";
import { influencers } from "../src/lib/influencers";

describe("Influencers directory", () => {
  it("shows thirty culture shapers and opens internal intelligence profiles", () => {
    render(<PeoplePage />);

    expect(
      screen.getByRole("heading", {
        name: "Influence has a face, a format, and an audience."
      })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("influencer-card")).toHaveLength(30);

    for (const influencer of influencers) {
      expect(screen.getByRole("link", { name: `Explore ${influencer.name}` })).toHaveAttribute(
        "href",
        `/influencers/${influencer.id}`
      );
    }
  });
});
