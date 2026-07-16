import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { seedRecords } from "../src/lib/seed-data";

describe("Gen Alpha editorial overview", () => {
  afterEach(() => window.localStorage.clear());

  it("renders four insight tabs and a five-link navigation", async () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    expect(screen.getByRole("heading", { name: "Gen Alpha, in ten truths." })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: "Play and belonging" })).toHaveAttribute("aria-selected", "true");

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(navigation).toHaveTextContent("Overview");
    expect(navigation).toHaveTextContent("Insights");
    expect(navigation).toHaveTextContent("Influencers");
    expect(navigation).toHaveTextContent("Spaces");
    expect(navigation).toHaveTextContent("Library");
    expect(navigation).not.toHaveTextContent("How they");
  });

  it("features five influencers, spaces, and owned media without moving the library home", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    for (const name of ["MrBeast", "IShowSpeed", "Kai Cenat", "Aphmau", "Ms. Rachel"]) {
      expect(screen.getByAltText(name)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "See all 30 influencers" })).toHaveAttribute("href", "/influencers");
    expect(screen.getByRole("heading", { name: "Where they spend time" })).toBeInTheDocument();
    expect(screen.getByText("Roblox")).toBeInTheDocument();
    expect(screen.getByText("#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open the research library" })).toHaveAttribute(
      "href",
      "/library"
    );

    expect(screen.queryByText("How their world fits together")).not.toBeInTheDocument();
    expect(screen.queryByText("Editorial findings remain the proof layer.")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Articles" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Make" })).not.toBeInTheDocument();
  });

  it("switches between dark and light themes", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
