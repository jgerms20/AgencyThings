import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BriefingPage from "@/components/BriefingPage";

describe("presentation briefing", () => {
  it("turns the research into six presentation-ready headline insights", () => {
    render(<BriefingPage />);

    expect(screen.getByRole("heading", { name: "The room, in six briefing slides." })).toBeInTheDocument();
    const slides = screen.getAllByTestId("briefing-slide");
    expect(slides).toHaveLength(6);
    for (const slide of slides) {
      expect(within(slide).getByRole("link", { name: /Open exact insight/ })).toHaveAttribute("href", expect.stringMatching(/^\/insights\//));
      expect(slide).toHaveTextContent(/Confidence/);
      expect(slide).toHaveTextContent(/Say it this way/);
    }
  });

  it("makes the validity ladder explicit", () => {
    render(<BriefingPage />);

    const validity = screen.getByRole("region", { name: "Evidence validity ladder" });
    expect(within(validity).getAllByRole("listitem")).toHaveLength(5);
    expect(validity).toHaveTextContent("Direct child research");
    expect(validity).toHaveTextContent("Teen or adjacent-age proxy");
    expect(validity).toHaveTextContent("Editorial interpretation");
    expect(validity).toHaveTextContent(/web opinion is never treated as evidence/i);
  });

  it("offers a presentation print action", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<BriefingPage />);
    screen.getByRole("button", { name: "Print or save briefing" }).click();
    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });

  it("gives slide headlines the full mobile measure", () => {
    const stylesheet = readFileSync("src/app/globals.css", "utf8");
    const mobileRules = stylesheet.slice(stylesheet.indexOf("@media (max-width: 760px)"));
    expect(mobileRules).toMatch(/\.briefing-slide\s*\{[^}]*grid-template-columns:\s*1fr/s);
    expect(mobileRules).toMatch(/\.briefing-slide-proof\s*\{[^}]*grid-column:\s*1/s);
  });
});
