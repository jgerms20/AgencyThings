import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProblemWallWorkspace from "../src/components/ProblemWallWorkspace";

const apiResult = {
  weekOf: "2026-07-13",
  refreshedAt: "2026-07-13T12:00:00Z",
  mode: "demo",
  persistenceErrors: [],
  refresh: { sourcesAttempted: 4, sourcesSucceeded: 3, failures: [], refreshedAt: "2026-07-13T12:00:00Z", signals: [] },
  candidates: [{
    id: "p1", weekOf: "2026-07-13", problem: "Working parents lose time because school updates are split across five tools.",
    biggerReason: "Missed updates disrupt work and childcare.", rootCause: "The tools do not share context.", details: "A current study documents six hours per week.",
    audience: "working parents", status: "new", notes: "", sources: [{ id: "s1", title: "School app study", source: "Research Journal", sourceType: "study", sourceClass: "research", url: "https://example.com/study", publishedAt: "2026-07-10", audience: "working parents", behavior: "switch tools", tension: "updates are scattered", stat: "6 hours", tags: ["learning"] }],
    score: { breakdown: { biggerReason: 4, unexpectedness: 3, relevancy: 5, specificity: 4, targetedCause: 4 }, reasons: { biggerReason: "clear consequence", unexpectedness: "documented tension", relevancy: "fresh source", specificity: "specific audience", targetedCause: "clear cause" }, total: 20, grade: "promising", notes: [], evidenceCapped: false }
  }]
};

afterEach(() => vi.unstubAllGlobals());

describe("ProblemWallWorkspace", () => {
  it("renders the weekly sequence and removes the client handoff controls", () => {
    render(<ProblemWallWorkspace />);

    expect(screen.getByRole("button", { name: "Find new problems" })).toBeInTheDocument();
    for (const label of ["New this week", "Shortlist", "Reviewed", "Deck inspiration"]) {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
    }
    expect(screen.queryByText(/strategist|client fit|approve|reject|export deck/i)).not.toBeInTheDocument();
  });

  it("uses the refresh route, shortlists a candidate, and exposes wrap-up actions", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(apiResult)));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText: vi.fn() } });
    render(<ProblemWallWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: /Find new problems/i }));
    await screen.findByText(/Working parents lose time/i);
    fireEvent.click(screen.getByRole("button", { name: /Shortlist problem/i }));
    fireEvent.click(screen.getByRole("tab", { name: /Shortlist/i }));

    expect(screen.getByText(/Wrap up the week/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download JSON/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(/1 problem shortlisted/i).length).toBeGreaterThan(0));
  });
});
