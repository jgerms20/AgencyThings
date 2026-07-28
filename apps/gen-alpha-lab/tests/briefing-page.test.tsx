import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SummaryPage from "@/components/SummaryPage";
import { summaryTakeaways } from "@/lib/summary";

describe("editable research summary", () => {
  beforeEach(() => window.localStorage.clear());

  it("presents six succinct takeaways with exact insight and source paths", () => {
    render(<SummaryPage />);

    expect(screen.getByRole("heading", { name: "The Gen Alpha summary." })).toBeInTheDocument();
    const takeaways = screen.getAllByTestId("summary-takeaway");
    expect(takeaways).toHaveLength(6);
    for (const takeaway of takeaways) {
      expect(within(takeaway).getByRole("link", { name: /Open exact insight/ })).toHaveAttribute("href", expect.stringMatching(/^\/insights\//));
      expect(within(takeaway).getAllByRole("link", { name: /Open source/ }).length).toBeGreaterThanOrEqual(1);
      expect(within(takeaway).getAllByRole("listitem")).toHaveLength(2);
    }

    expect(screen.queryByText(/talk-ready|say it this way|bike outside the window/i)).not.toBeInTheDocument();
    expect(screen.getByText("Context—not screen time alone—determines what a media day means.")).toBeInTheDocument();
  });

  it("lets the presenter edit and persist every headline and takeaway", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<SummaryPage />);

    await user.click(screen.getByRole("button", { name: "Edit summary" }));
    const headline = screen.getByRole("textbox", { name: "Headline 1" });
    const takeaway = screen.getByRole("textbox", { name: "Takeaway 1" });
    await user.clear(headline);
    await user.type(headline, "Devices feel private before life is independent.");
    await user.clear(takeaway);
    await user.type(takeaway, "A sharper synthesis for this department.");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByRole("heading", { name: "Devices feel private before life is independent." })).toBeInTheDocument();
    expect(screen.getByText("A sharper synthesis for this department.")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("gen-alpha-summary-v1") ?? "{}").items[0]).toMatchObject({
      headline: "Devices feel private before life is independent.",
      takeaway: "A sharper synthesis for this department.",
    });

    unmount();
    render(<SummaryPage />);
    expect(screen.getByRole("heading", { name: "Devices feel private before life is independent." })).toBeInTheDocument();
  });

  it("resets local edits to the versioned default synthesis", async () => {
    window.localStorage.setItem("gen-alpha-summary-v1", JSON.stringify({
      version: 1,
      items: summaryTakeaways.map((item, index) => index === 0 ? { ...item, headline: "Temporary headline" } : item),
    }));
    const user = userEvent.setup();
    render(<SummaryPage />);

    expect(screen.getByRole("heading", { name: "Temporary headline" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit summary" }));
    await user.click(screen.getByRole("button", { name: "Reset defaults" }));
    expect(screen.getByRole("heading", { name: summaryTakeaways[0].headline })).toBeInTheDocument();
    expect(window.localStorage.getItem("gen-alpha-summary-v1")).toBeNull();
  });

  it("offers a clean print action", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<SummaryPage />);
    screen.getByRole("button", { name: "Print or save summary" }).click();
    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });

  it("keeps the retired briefing route as a redirect and gives Summary full mobile measure", () => {
    const redirectRoute = readFileSync("src/app/briefing/page.tsx", "utf8");
    const stylesheet = readFileSync("src/app/globals.css", "utf8");
    const mobileRules = stylesheet.slice(stylesheet.indexOf("@media (max-width: 760px)"));

    expect(redirectRoute).toMatch(/redirect\(["']\/summary["']\)/);
    expect(mobileRules).toMatch(/\.summary-item\s*\{[^}]*grid-template-columns:\s*1fr/s);
  });
});
