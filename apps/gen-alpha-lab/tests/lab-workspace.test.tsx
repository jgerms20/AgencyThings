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

  it("renders the field-guide thesis, required lenses, and sourcebook without dashboard controls", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(
      screen.getByRole("heading", {
        name: /understanding the first ai-native childhood/i
      })
    ).toBeInTheDocument();
    for (const lens of [
      "Connect",
      "Media",
      "Influence",
      "Time",
      "Learn",
      "Play & Create",
      "AI"
    ]) {
      expect(screen.getAllByText(lens).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(/How their world fits together/i)).toBeInTheDocument();
    expect(
      screen.getAllByText("#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Sourcebook")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /upload interview/i }).length).toBeGreaterThan(0);
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

  it("adds an interview record from the lab intake form", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    await user.click(screen.getAllByRole("button", { name: /upload interview/i })[0]);
    await user.type(screen.getByLabelText(/interview title/i), "Cousin interview: AI homework");
    await user.type(screen.getByLabelText(/participant alias/i), "Joshua fieldwork");
    await user.clear(screen.getByLabelText(/relationship or context/i));
    await user.type(screen.getByLabelText(/relationship or context/i), "AI, school, family");
    expect(screen.getByLabelText(/interview file/i)).toBeInTheDocument();
    await user.type(
      screen.getByLabelText(/notes or transcript/i),
      "AI shows up as homework help, not as a futuristic tool."
    );
    await user.click(screen.getByRole("button", { name: /save interview/i }));

    await waitFor(() => {
      expect(screen.getAllByText("Cousin interview: AI homework").length).toBeGreaterThan(0);
    });
  });

  it("hydrates persisted interviews from the API alongside browser records", async () => {
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

    await waitFor(() => {
      expect(screen.getByText("Local interview")).toBeInTheDocument();
      expect(screen.getByText("Shared interview")).toBeInTheDocument();
    });
    expect(screen.queryByText("Interview slot: cousin media diary")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/lab-records");
  });

  it("exposes sourcebook filter state to assistive technology", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    const all = screen.getByRole("button", { name: "All" });
    const peerReviewed = screen.getByRole("button", { name: "peer reviewed" });
    expect(all).toHaveAttribute("aria-pressed", "true");
    expect(peerReviewed).toHaveAttribute("aria-pressed", "false");

    await user.click(peerReviewed);

    expect(all).toHaveAttribute("aria-pressed", "false");
    expect(peerReviewed).toHaveAttribute("aria-pressed", "true");
  });
});
