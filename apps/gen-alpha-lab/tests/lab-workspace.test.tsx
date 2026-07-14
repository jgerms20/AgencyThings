import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { seedRecords } from "../src/lib/seed-data";

describe("LabWorkspace", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("renders the field-guide thesis, required lens routes, library, and theme toggle", async () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
    expect(
      screen.getByRole("heading", {
        name: /understanding the first ai-native childhood/i
      })
    ).toBeInTheDocument();
    for (const lens of [
      ["How they connect", "/topics/connect"],
      ["How they consume media", "/topics/media"],
      ["How they are influenced", "/topics/influence"],
      ["How they spend time", "/topics/time"],
      ["How they learn", "/topics/learn"],
      ["How they play and create", "/topics/play-create"],
      ["How they use AI", "/topics/ai"]
    ]) {
      expect(screen.getAllByRole("link", { name: new RegExp(lens[0], "i") })[0]).toHaveAttribute(
        "href",
        lens[1]
      );
    }
    expect(screen.getByText(/How their world fits together/i)).toBeInTheDocument();
    expect(
      screen.getAllByText("#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Library")).toBeInTheDocument();
    for (const section of ["Articles", "Podcasts", "Books", "YouTube"]) {
      expect(screen.getByRole("heading", { name: section })).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
    expect(screen.queryByText("/gen-alpha-culture-map.png")).not.toBeInTheDocument();
    expect(screen.queryByAltText(/collage illustrating gen alpha culture/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /upload interview/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/interview archive/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/save interview/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/add source/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/research queue/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/demo mode/i)).not.toBeInTheDocument();
  });

  it("uses the approved finding imagery and navigates featured work to editorial routes", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(screen.getByAltText("Friends moving between chat and shared play")).toHaveAttribute(
      "src",
      "/findings/connection.png"
    );
    expect(screen.getByAltText("Kids discovering video, creators, and shared entertainment")).toHaveAttribute(
      "src",
      "/findings/creation.png"
    );
    expect(screen.getByAltText("A child learning with on-demand AI support")).toHaveAttribute(
      "src",
      "/findings/learning-ai.png"
    );
    expect(
      screen.getByRole("link", { name: "Read Friendship moves across chat, play, and shared worlds. in full" })
    ).toHaveAttribute("href", "/findings/friendship-portable");
  });

  it("switches between dark and light themes", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(screen.getByRole("button", { name: /switch to dark theme/i })).toBeInTheDocument();
  });

  it("does not hydrate visible interview records or call intake APIs", async () => {
    window.localStorage.setItem(
      "gen-alpha-lab-records",
      JSON.stringify([
        {
          id: "local-interview",
          kind: "interview",
          sourceClass: "owned",
          title: "Local interview",
          source: "Browser",
          summary: "Saved in this browser.",
          tags: ["local"],
          status: "new",
          confidence: "medium",
          createdAt: "2026-07-12T12:00:00.000Z"
        }
      ])
    );
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        records: [
          {
            id: "field-cousin-placeholder",
            kind: "interview",
            sourceClass: "owned",
            title: "Shared interview",
            source: "Supabase",
            summary: "Saved for the field guide.",
            tags: ["shared"],
            status: "reviewed",
            confidence: "high",
            createdAt: "2026-07-12T13:00:00.000Z"
          }
        ]
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(screen.getByText("Library")).toBeInTheDocument());
    expect(screen.queryByText("Local interview")).not.toBeInTheDocument();
    expect(screen.queryByText("Shared interview")).not.toBeInTheDocument();
    expect(screen.queryByText("Interview slot: cousin media diary")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("exposes library filter state to assistive technology", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    const all = screen.getByRole("button", { name: "All" });
    const podcasts = screen.getByRole("button", { name: "Podcasts" });
    expect(all).toHaveAttribute("aria-pressed", "true");
    expect(podcasts).toHaveAttribute("aria-pressed", "false");

    await user.click(podcasts);

    expect(all).toHaveAttribute("aria-pressed", "false");
    expect(podcasts).toHaveAttribute("aria-pressed", "true");
  });
});
