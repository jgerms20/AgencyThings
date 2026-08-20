import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { seedRecords } from "../src/lib/seed-data";

describe("Gen Alpha demographic overview", () => {
  afterEach(() => window.localStorage.clear());

  it("opens with four demographic facts and separates the U.S. from the world", async () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    expect(screen.getByRole("heading", { name: "Who is Gen Alpha?" })).toBeInTheDocument();
    expect(screen.getByText("Generation boundaries are conventions")).toBeInTheDocument();
    expect(screen.getAllByTestId("demographic-headline-fact")).toHaveLength(4);
    expect(screen.getByText("59.7M")).toBeInTheDocument();
    expect(screen.getByText("2.01B")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "U.S. demographic portrait" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Global snapshot" })).toBeInTheDocument();
    expect(screen.getByText(/North America is only 3\.2%/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "From who they are to how they live." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How they live" })).toBeInTheDocument();
    expect(screen.getAllByTestId("deeper-route")).toHaveLength(4);
  });

  it("removes the old homepage previews instead of compressing them into the overview", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(screen.queryByText("Ten things to know before the deep dive.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Featured listening/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marketing 101: three established/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Curated media shelf")).not.toBeInTheDocument();
  });

  it("does not surface older-teen identity data on the overview page", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(screen.queryByRole("region", { name: "Older edge identity data" })).not.toBeInTheDocument();
    expect(screen.queryByText(/high-school students, not the full Gen Alpha generation/i)).not.toBeInTheDocument();
  });

  it("routes deeper analysis without previewing the whole Lab", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    const routes = screen.getByRole("region", { name: "Continue into the Lab" });
    expect(within(routes).getByRole("link", { name: /Explore insights/i })).toHaveAttribute("href", "/insights");
    expect(within(routes).getByRole("link", { name: /Compare generations/i })).toHaveAttribute("href", "/compare");
    expect(within(routes).getByRole("link", { name: /Browse influencers/i })).toHaveAttribute("href", "/influencers");
    expect(within(routes).getByRole("link", { name: /Open Sources/i })).toHaveAttribute("href", "/library");
  });

  it("switches between dark and light themes", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-theme", "dark"));
    await user.click(screen.getByRole("button", { name: /switch to light theme/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
