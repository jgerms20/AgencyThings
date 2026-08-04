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
    expect(screen.getAllByTestId("demographic-headline-fact")).toHaveLength(4);
    expect(screen.getByText("59.7M")).toBeInTheDocument();
    expect(screen.getByText("2.01B")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "U.S. demographic portrait" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Global snapshot" })).toBeInTheDocument();
    expect(screen.getByText(/high-school students, not the full Gen Alpha generation/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("deeper-route")).toHaveLength(4);
  });

  it("removes the old homepage previews instead of compressing them into the overview", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(screen.queryByText("Ten things to know before the deep dive.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Featured listening/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Marketing 101: three established/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Curated media shelf")).not.toBeInTheDocument();
  });

  it("keeps older-teen identity detail collapsed until the presenter asks for it", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    const section = screen.getByRole("region", { name: "Older edge identity data" });
    const disclosure = within(section).getByText("Older edge only").closest("details");
    expect(disclosure).not.toHaveAttribute("open");
    expect(within(section).queryByText("73.3%", { exact: true })).not.toBeVisible();

    await user.click(within(section).getByText("Older edge only"));

    expect(disclosure).toHaveAttribute("open");
    expect(within(section).getByText("73.3%", { exact: true })).toBeVisible();
    expect(within(section).getByText("3.3%", { exact: true })).toBeVisible();
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
