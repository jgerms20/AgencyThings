import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ThemeToggle from "../src/components/ThemeToggle";
import { youthPopulationHistory } from "../src/lib/demographics";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  document.documentElement.dataset.theme = "dark";
});

describe("presentation regressions", () => {
  it("keeps a saved light preference and persists a subsequent toggle", async () => {
    window.localStorage.setItem("gen-alpha-lab-theme", "light");
    render(<ThemeToggle />);
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("gen-alpha-lab-theme")).toBe("dark");
  });

  it("can still toggle when browser storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("calculates historical shares consistently from fixed-age population counts", () => {
    const shares = youthPopulationHistory.map(({ northAmerica, world }) => northAmerica / world * 100);
    expect(shares.map((value) => value.toFixed(2))).toEqual(["5.25", "3.59", "3.48", "3.49", "3.24"]);
    expect((shares[3] - shares[4]).toFixed(2)).toBe("0.25");
    expect(youthPopulationHistory.map(({ year }) => year)).toEqual([1965, 1980, 1995, 2010, 2024]);
  });
});
