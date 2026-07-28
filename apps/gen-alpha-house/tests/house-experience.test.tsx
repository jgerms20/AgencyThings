import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HouseExperience from "@/components/HouseExperience";

describe("HouseExperience", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("enters one Gen Alpha bedroom without a room navigator", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);

    expect(screen.getByRole("heading", { name: "Come inside." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Knock to enter" }));

    expect(screen.getByRole("region", { name: "Interactive Gen Alpha bedroom" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "House rooms" })).not.toBeInTheDocument();
    expect(screen.getByText("8 objects / 32 insight connections")).toBeInTheDocument();
  });

  it("opens several individually linked insights from one object", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);
    await user.click(screen.getByRole("button", { name: "Knock to enter" }));
    await user.click(screen.getByRole("button", { name: "Open game console insights" }));

    const dialog = screen.getByRole("dialog", { name: "The console is a friendship place" });
    const links = within(dialog).getAllByRole("link", { name: /Open .* in the Intelligence Lab/ });

    expect(links).toHaveLength(4);
    expect(new Set(links.map((link) => link.getAttribute("href"))).size).toBe(4);
    expect(links[0]).toHaveAttribute(
      "href",
      "https://agencythings-gen-alpha.vercel.app/insights/play-social-infrastructure",
    );
  });

  it("shows evidence quality and source context on each insight card", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);
    await user.click(screen.getByRole("button", { name: "Knock to enter" }));
    await user.click(screen.getByRole("button", { name: "Open homework desk insights" }));

    const dialog = screen.getByRole("dialog", { name: "AI has joined the homework routine" });
    expect(within(dialog).getAllByText("2 evidence items")).toHaveLength(4);
    expect(within(dialog).getByText("Common Sense Media · Common Sense Media")).toBeInTheDocument();
    expect(within(dialog).getAllByText(/confidence/i).length).toBeGreaterThanOrEqual(4);
  });

  it("closes with Escape and switches themes", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);
    await user.click(screen.getByRole("button", { name: "Knock to enter" }));

    await user.click(screen.getByRole("button", { name: "Switch to day mode" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "day");

    await user.click(screen.getByRole("button", { name: "Open phone insights" }));
    expect(screen.getByRole("dialog", { name: "A personal screen before personal independence" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("offers all eight objects through the mobile-friendly index", async () => {
    const user = userEvent.setup();
    render(<HouseExperience />);
    await user.click(screen.getByRole("button", { name: "Skip to the room" }));

    const index = screen.getByRole("navigation", { name: "Room object index" });
    expect(within(index).getAllByRole("button")).toHaveLength(8);
    await user.click(within(index).getByRole("button", { name: "Explore Backpack + notebook" }));
    expect(screen.getByRole("dialog", { name: "Learning crosses the bell schedule" })).toBeInTheDocument();
  });
});
