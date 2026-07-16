import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { seedRecords } from "../src/lib/seed-data";

describe("Gen Alpha editorial overview", () => {
  afterEach(() => window.localStorage.clear());

  it("renders four bold truths and a compact three-link navigation", async () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    expect(screen.getByRole("heading", { name: "Gen Alpha, in four truths." })).toBeInTheDocument();
    expect(screen.getAllByTestId("editorial-insight")).toHaveLength(4);

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(navigation).toHaveTextContent("Overview");
    expect(navigation).toHaveTextContent("People");
    expect(navigation).toHaveTextContent("Library");
    expect(navigation).not.toHaveTextContent("How they");
  });

  it("keeps creators and owned media concise while moving the full library away", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    for (const name of ["MrBeast", "IShowSpeed", "Kai Cenat", "Aphmau", "Salish Matter", "Ms. Rachel"]) {
      expect(screen.getByAltText(name)).toBeInTheDocument();
    }
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
