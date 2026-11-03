import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HouseExperience from "../src/components/HouseExperience";
import { roomLenses } from "../src/lib/house-data";
import { getCultureShaper } from "../src/lib/content/culture-shapers";
import { insights } from "../src/lib/content/insights";

describe("House inside the Intelligence Lab", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    document.documentElement.dataset.theme = "dark";
  });

  it("opens directly into a room with the Lab navigation and a room map", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);

    expect(screen.getByRole("link", { name: "House" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("button", { name: "Knock to enter" })).not.toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "House map" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Interactive boys’ room" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Boys’ room" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: "Girls’ room" }));
    expect(screen.getByRole("region", { name: "Interactive girls’ room" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Gen Alpha girls’ room/i })).toHaveAttribute("src", "/house/gen-alpha-girls-bedroom.png");
  });

  it("opens object research and stays on the same site for deeper reading", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);

    await user.click(screen.getByRole("button", { name: "Open boys’ influencer poster insights" }));
    const drawer = screen.getByRole("dialog", { name: /Influence looks like skill/i });
    expect(within(drawer).getByRole("link", { name: /Open IShowSpeed profile/i })).toHaveAttribute("href", "/influencers/ishowspeed");
    expect(within(drawer).getAllByRole("link", { name: /Read source/i })).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("keeps all object links tied to live Lab records", () => {
    expect(roomLenses).toHaveLength(2);
    for (const lens of roomLenses) {
      expect(lens.objects).toHaveLength(9);
      for (const object of lens.objects) {
        expect(object.insights).toHaveLength(3);
        for (const insight of object.insights) {
          expect(insight.labUrl).toMatch(/^\/(?:insights|influencers|gender)(?:\/|#)/);
          const [path] = insight.labUrl.split("#");
          const [, kind, id] = path.split("/");
          if (kind === "insights") expect(insights.some((item) => item.id === id), insight.labUrl).toBe(true);
          if (kind === "influencers") expect(getCultureShaper(id), insight.labUrl).toBeDefined();
        }
      }
    }
  });
});
