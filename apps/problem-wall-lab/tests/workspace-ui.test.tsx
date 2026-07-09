import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProblemWallWorkspace from "../src/components/ProblemWallWorkspace";

describe("ProblemWallWorkspace", () => {
  it("renders the weekly wall and lets a strategist approve a candidate", () => {
    render(<ProblemWallWorkspace />);

    expect(screen.getByRole("heading", { name: /Problem Wall Lab/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate pool/i })).toBeInTheDocument();
    expect(screen.getAllByText(/B\.U\.R\.S\.T\./i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole("button", { name: /Approve/i })[0]);

    expect(screen.getByText(/Approved for wall/i)).toBeInTheDocument();
  });
});
