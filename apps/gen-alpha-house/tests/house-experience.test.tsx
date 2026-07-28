import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HouseExperience from "@/components/HouseExperience";

describe("HouseExperience", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  async function enter() {
    const user = userEvent.setup();
    render(<HouseExperience />);
    await user.click(screen.getByRole("button", { name: "Knock to enter" }));
    return user;
  }

  it("keeps the share-card copy aligned with the two-room experience", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");

    expect(layout).toContain("Two rooms. Eighteen familiar objects. Fifty-four sourced connections");
    expect(layout).toContain('images: ["/gen-alpha-girls-bedroom.png"]');
  });

  it("enters the boys room and exposes a two-room lens switcher", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);

    expect(screen.getByRole("heading", { name: "Come inside." })).toBeInTheDocument();
    expect(screen.getByText(/Two rooms\. Eighteen objects\./i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Knock to enter" }));

    expect(screen.getByRole("region", { name: "Interactive boys’ room" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Boys’ room" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Girls’ room" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("9 objects / 27 insight connections")).toBeInTheDocument();
  });

  it("switches the complete artwork and object system to the girls room", async () => {
    const user = await enter();

    await user.click(screen.getByRole("tab", { name: "Girls’ room" }));

    expect(screen.getByRole("region", { name: "Interactive girls’ room" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Gen Alpha girls’ room/i })).toHaveAttribute(
      "src",
      "/gen-alpha-girls-bedroom.png",
    );
    expect(screen.getByRole("button", { name: "Open books and maker shelf insights" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open toy and story shelf insights" })).not.toBeInTheDocument();
  });

  it("numbers all nine hotspot circles in scene order", async () => {
    await enter();

    const layer = screen.getByLabelText("Interactive boys’ room objects");
    const hotspots = within(layer).getAllByRole("button");
    expect(hotspots).toHaveLength(9);
    expect(hotspots.map((hotspot) => hotspot.getAttribute("data-hotspot-number"))).toEqual([
      "01", "02", "03", "04", "05", "06", "07", "08", "09",
    ]);
    expect(within(hotspots[0]).getByText("01")).toBeInTheDocument();
    expect(within(hotspots[8]).getByText("09")).toBeInTheDocument();
  });

  it("opens a bespoke influencer poster set with both Lab and source links", async () => {
    const user = await enter();
    await user.click(screen.getByRole("button", { name: "Open boys’ influencer poster insights" }));

    const dialog = screen.getByRole("dialog", { name: "Influence looks like skill, spectacle, and repeatable formats" });
    const labLinks = within(dialog).getAllByRole("link").filter((link) =>
      link.getAttribute("href")?.startsWith("https://agencythings-gen-alpha.vercel.app/influencers/"),
    );
    expect(labLinks).toHaveLength(3);
    expect(within(dialog).getAllByRole("link", { name: /Read source/i })).toHaveLength(3);
    expect(within(dialog).getByRole("link", { name: /Open IShowSpeed profile/i })).toHaveAttribute(
      "href",
      "https://agencythings-gen-alpha.vercel.app/influencers/ishowspeed",
    );
  });

  it("closes an open drawer when the room lens changes", async () => {
    const user = await enter();
    await user.click(screen.getByRole("button", { name: "Open console insights" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Girls’ room" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes with Escape and switches themes", async () => {
    const user = await enter();

    await user.click(screen.getByRole("button", { name: "Switch to day mode" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "day");

    await user.click(screen.getByRole("button", { name: "Open phone insights" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("offers all nine active objects through the mobile-friendly index", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);
    await user.click(screen.getByRole("button", { name: "Skip to the room" }));

    const index = screen.getByRole("navigation", { name: "Boys’ room object index" });
    expect(within(index).getAllByRole("button")).toHaveLength(9);
    await user.click(within(index).getByRole("button", { name: "Explore Backpack + school notebook" }));
    expect(screen.getByRole("dialog", { name: "School moves through a screen-heavy day" })).toBeInTheDocument();
  });
});
