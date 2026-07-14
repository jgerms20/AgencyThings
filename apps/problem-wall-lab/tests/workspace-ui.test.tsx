import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("ProblemWallWorkspace", () => {
  it("renders the weekly sequence and removes the client handoff controls", () => {
    render(<ProblemWallWorkspace />);

    expect(screen.getByRole("button", { name: "Find new problems" })).toBeInTheDocument();
    for (const label of ["New this week", "Saved", "Already in the deck"]) {
      expect(screen.getByRole("tab", { name: new RegExp(label) })).toBeInTheDocument();
    }
    expect(screen.queryByText(/strategist|client fit|approve|reject|export deck/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/B\.U\.R\.S\.T|wall ready|total/i)).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Brand lens/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /Discovery edge/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Switch to light mode/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Search X/i })).toHaveAttribute("href", expect.stringContaining("x.com/search"));
  });

  it("uses the refresh route, shortlists a candidate, and exposes wrap-up actions", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(apiResult)));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText: vi.fn() } });
    render(<ProblemWallWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: /Find new problems/i }));
    await screen.findByText(/Working parents lose time/i);
    fireEvent.click(screen.getByRole("button", { name: /Save problem/i }));
    fireEvent.click(screen.getByRole("tab", { name: /Saved/i }));

    expect(screen.getByText(/worth carrying forward/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download JSON/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(/1 problem shortlisted/i).length).toBeGreaterThan(0));
  });

  it("sends the active brand lens and excludes already-seen problems on refresh", async () => {
    const fetchMock = vi.fn(async () => Response.json(apiResult));
    vi.stubGlobal("fetch", fetchMock);
    render(<ProblemWallWorkspace />);

    fireEvent.change(screen.getByRole("textbox", { name: /Brand lens/i }), { target: { value: "Gatorade" } });
    fireEvent.click(screen.getByRole("button", { name: /Find new problems/i }));
    await screen.findByText(/Working parents lose time/i);
    fireEvent.click(screen.getByRole("button", { name: /Find new problems/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const secondRequest = fetchMock.mock.calls[1]?.[1] as RequestInit;
    expect(secondRequest.body).toContain("Gatorade");
    expect(secondRequest.body).toContain("p1");
  });
});
