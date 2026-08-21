import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HumorPage from "../src/components/HumorPage";
import { humorStudy } from "../src/lib/content/humor";
import { sources } from "../src/lib/content/sources";

describe("humor study tab", () => {
  it("renders a Snap x Omnicom briefing instead of dumping the deck", () => {
    render(<HumorPage />);

    expect(screen.getByRole("heading", { name: "How Next Gen laughs." })).toBeInTheDocument();
    expect(screen.getByText(/From the Snapchat × Omnicom report/i)).toBeInTheDocument();
    expect(screen.getByText(/not the Lab’s full 0–16 Alpha portrait/i)).toBeInTheDocument();
    expect(screen.getByText(/Humor is how this generation talks about serious things/i)).toBeInTheDocument();
    expect(screen.getByText("This is how they talk about serious things")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Timing is the whole joke." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Okay they kinda ate." })).toBeInTheDocument();
    expect(screen.getByText("Unc found the meme.")).toBeInTheDocument();
    expect(screen.getByText(/Not where they find it. Where they send it./i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Snapchat for Business write-up/i })).toHaveAttribute("href", humorStudy.sourceUrl);
    expect(screen.getByRole("link", { name: /Full study PDF/i })).toHaveAttribute("href", humorStudy.pdfUrl);
    expect(screen.getByRole("link", { name: /Open the source record/i })).toHaveAttribute("href", "/library/snap-omnicom-humor-2026");
    expect(screen.queryByRole("heading", { name: "Context is the punchline" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Four moves. Not forty slides." })).not.toBeInTheDocument();
    expect(screen.queryByText(/play is social infrastructure/i)).not.toBeInTheDocument();
  });

  it("stores the study in the source graph with an honest Next Gen scope", () => {
    const source = sources.find((item) => item.id === "snap-omnicom-humor-2026");
    expect(source?.ageRange).toBe("13-28");
    expect(source?.sampleSize).toMatch(/6,028/);
    expect(source?.geography).toMatch(/India/);
    expect(source?.limitations).toMatch(/not this Lab’s full 0-16/);
  });
});
