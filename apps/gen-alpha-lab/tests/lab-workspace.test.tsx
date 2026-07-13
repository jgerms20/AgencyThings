import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { seedRecords, signals } from "../src/lib/seed-data";

describe("LabWorkspace", () => {
  it("renders the core thesis and signal map", () => {
    render(<LabWorkspace initialRecords={seedRecords} signals={signals} />);

    expect(
      screen.getByRole("heading", {
        name: /the first ai-native youth culture is already here/i
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/AI is becoming ambient/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /add source/i }).length).toBeGreaterThan(0);
  });

  it("adds an interview record from the lab intake form", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} signals={signals} />);

    await user.click(screen.getAllByRole("button", { name: /add source/i })[0]);
    await user.clear(screen.getByLabelText(/record title/i));
    await user.type(screen.getByLabelText(/record title/i), "Cousin interview: AI homework");
    await user.selectOptions(screen.getByLabelText(/record type/i), "interview");
    await user.type(screen.getByLabelText(/source name/i), "Joshua fieldwork");
    await user.type(screen.getByLabelText(/source tags/i), "AI, school, family");
    expect(screen.getByLabelText(/interview file/i)).toBeInTheDocument();
    await user.type(
      screen.getByLabelText(/notes or transcript/i),
      "AI shows up as homework help, not as a futuristic tool."
    );
    await user.click(screen.getByRole("button", { name: /save to lab/i }));

    await waitFor(() => {
      expect(screen.getAllByText("Cousin interview: AI homework").length).toBeGreaterThan(0);
    });
  });
});
