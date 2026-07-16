import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LibraryPage from "../src/components/LibraryPage";
import { seedRecords } from "../src/lib/seed-data";

describe("LibraryPage", () => {
  it("filters research by media format instead of Make, Think, and Learn", async () => {
    const user = userEvent.setup();
    render(<LibraryPage initialRecords={seedRecords} />);

    for (const filter of ["All", "Reports", "Articles", "Books", "Podcasts", "Videos"]) {
      expect(screen.getByRole("button", { name: filter })).toBeInTheDocument();
    }
    for (const removed of ["Make", "Think", "Learn"]) {
      expect(screen.queryByRole("button", { name: removed })).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: "Videos" }));
    expect(screen.getByRole("heading", { name: "Videos" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Reports" })).not.toBeInTheDocument();
    expect(screen.getByTitle(/Media and Young Kids/i)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/3mnan0zpxAo"
    );

    await user.click(screen.getByRole("button", { name: "Books" }));
    expect(screen.getByRole("heading", { name: "Books" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Videos" })).not.toBeInTheDocument();
  });
});
