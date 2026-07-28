import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import GenderLensPage from "@/components/GenderLensPage";
import { genderLenses } from "@/lib/gender-lens";

describe("Gender Lens", () => {
  it("defines deep, traceable, non-exclusive evidence for every lens", () => {
    expect(genderLenses.map((lens) => lens.id)).toEqual(["boys", "girls", "gender-diverse"]);

    for (const lens of genderLenses) {
      expect(lens.findings.length).toBeGreaterThanOrEqual(5);
      expect(new Set(lens.findings.map((finding) => finding.title)).size).toBe(lens.findings.length);
      for (const finding of lens.findings) {
        expect(new URL(finding.sourceUrl).protocol).toBe("https:");
        expect(finding.finding.length).toBeGreaterThan(35);
        expect(finding.interpretation.length).toBeGreaterThan(35);
        expect(finding.signal).toMatch(/difference|counter-pattern|evidence gap/);
      }
    }

    const serialized = JSON.stringify(genderLenses);
    expect(serialized).not.toMatch(/all boys|all girls|only boys|only girls|naturally|hardwired/i);
  });

  it("opens on the expanded girls lens and keeps the hero copy spatially separated", () => {
    const { container } = render(<GenderLensPage />);

    expect(screen.getByRole("heading", { name: "Gender is a lens, not a shortcut." })).toBeInTheDocument();
    expect(container.querySelector(".gender-opening-thesis")).toContainElement(screen.getByRole("heading", { name: "Gender is a lens, not a shortcut." }));
    expect(container.querySelector(".gender-opening-copy")).toHaveTextContent(/patterns are real enough to investigate/i);

    const tabs = screen.getByRole("tablist", { name: "Gender lenses" });
    expect(within(tabs).getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Boys",
      "Girls",
      "Gender-diverse youth",
    ]);
    expect(screen.getByRole("tab", { name: "Girls" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("86%")).toBeInTheDocument();
    expect(screen.getByText("59%")).toBeInTheDocument();
    expect(screen.getByText("38%")).toBeInTheDocument();
    expect(screen.getAllByText("Counter-pattern", { exact: true }).length).toBeGreaterThan(0);
  });

  it("switches to distinct boys findings including upside and risk", async () => {
    const user = userEvent.setup();
    render(<GenderLensPage />);

    await user.click(screen.getByRole("tab", { name: "Boys" }));
    expect(screen.getByText("2:38")).toBeInTheDocument();
    expect(screen.getAllByText("62%")).toHaveLength(2);
    expect(screen.getByText("48%")).toBeInTheDocument();
    expect(screen.getAllByText(/participation and exposure rise together/i)).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Open source/ }).length).toBeGreaterThanOrEqual(5);
  });

  it("keeps gender-diverse visibility, safety, and media-data gaps separate", async () => {
    const user = userEvent.setup();
    render(<GenderLensPage />);

    await user.click(screen.getByRole("tab", { name: "Gender-diverse youth" }));
    expect(screen.getByText("3.3%")).toBeInTheDocument();
    expect(screen.getByText("2.2%")).toBeInTheDocument();
    expect(screen.getAllByText("Evidence gap").length).toBeGreaterThan(0);
    expect(screen.getByText(/binary media tables cannot describe this audience/i)).toBeInTheDocument();
    expect(screen.getAllByText(/do not infer a media routine from wellbeing evidence/i).length).toBeGreaterThan(0);
  });

  it("shows the validity rules and exact proxy population", () => {
    render(<GenderLensPage />);

    const methodology = screen.getByRole("region", { name: "How to read this evidence" });
    expect(methodology).toHaveTextContent("1,391");
    expect(methodology).toHaveTextContent("ages 13–17");
    expect(methodology).toHaveTextContent("near-age proxy");
    expect(methodology).toHaveTextContent("self-report");
  });
});
