import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HydrationRefreshApp } from "@/components/HydrationRefreshApp";

describe("Hydration Refresh workspace", () => {
  beforeEach(() => localStorage.clear());

  it("saves a story and keeps it available in the Saved view", async () => {
    const user = userEvent.setup();
    render(<HydrationRefreshApp />);
    await user.click(screen.getAllByRole("button", { name: /save knicks win/i })[0]);
    await user.click(screen.getByRole("button", { name: "Saved" }));
    expect(screen.getByRole("heading", { name: "Knicks win, brands win" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("agencythings:hydration-refresh:v1") ?? "{}").saved["knicks-brands"]).toBeDefined();
  });

  it("creates a storyline and exposes the monthly newsletter sections", async () => {
    const user = userEvent.setup();
    render(<HydrationRefreshApp />);
    await user.click(screen.getByRole("button", { name: "Storylines" }));
    await user.type(screen.getByLabelText("Storyline title"), "Fast instincts");
    await user.click(screen.getByRole("button", { name: "Create storyline" }));
    expect(screen.getByText("Fast instincts")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Monthly" }));
    expect(screen.getByText("Trends to Watch")).toBeInTheDocument();
    expect(screen.getByText("Creative That Matters")).toBeInTheDocument();
    expect(screen.getByText("Culture Corner")).toBeInTheDocument();
    expect(screen.getByText("Monthly Pick")).toBeInTheDocument();
    expect(screen.getByText("Provocation")).toBeInTheDocument();
  });

  it("refreshes all available sources on demand", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ stories: [], run: { statuses: [], addedCount: 0 } }) }));
    const user = userEvent.setup();
    render(<HydrationRefreshApp />);
    await user.click(screen.getByRole("button", { name: "Refresh all sources" }));
    expect(fetch).toHaveBeenCalledWith("/api/refresh", { method: "POST" });
    expect(await screen.findByText("Refresh complete. No new signals this time.")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
