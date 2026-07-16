import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LibraryPage from "../src/components/LibraryPage";
import { seedRecords } from "../src/lib/seed-data";

describe("LibraryPage", () => {
  it("opens with conclusions and keeps resources grouped by format", () => {
    render(<LibraryPage initialRecords={seedRecords} />);

    expect(
      screen.getByRole("heading", {
        name: "Start with the conclusion. Open the source when you need the proof."
      })
    ).toBeInTheDocument();
    for (const section of ["Articles", "Podcasts", "Books", "YouTube"]) {
      expect(screen.getByRole("heading", { name: section })).toBeInTheDocument();
    }
  });

  it("filters individual records exactly by Make, Think, and Learn", async () => {
    const user = userEvent.setup();
    render(<LibraryPage initialRecords={seedRecords} />);

    const make = screen.getByRole("button", { name: "Make" });
    const think = screen.getByRole("button", { name: "Think" });
    const learn = screen.getByRole("button", { name: "Learn" });

    await user.click(make);
    expect(make).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Roblox Releases New Data Decoding Search and Style Trends/i)).toBeInTheDocument();
    expect(screen.queryByText("Protecting Young Users on Social Media")).not.toBeInTheDocument();

    await user.click(think);
    expect(think).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Understanding Generation Alpha")).toBeInTheDocument();

    await user.click(learn);
    expect(learn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Protecting Young Users on Social Media")).toBeInTheDocument();
    expect(screen.queryByText(/Roblox Releases New Data Decoding Search and Style Trends/i)).not.toBeInTheDocument();
  });
});
