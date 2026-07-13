import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LabWorkspace from "../src/components/LabWorkspace";
import { seedRecords } from "../src/lib/seed-data";

describe("LabWorkspace", () => {
  it("renders the field-guide thesis, required lenses, and sourcebook without dashboard controls", () => {
    render(<LabWorkspace initialRecords={seedRecords} />);

    expect(
      screen.getByRole("heading", {
        name: /understanding the first ai-native childhood/i
      })
    ).toBeInTheDocument();
    for (const lens of [
      "Connect",
      "Media",
      "Influence",
      "Time",
      "Learn",
      "Play & Create",
      "AI"
    ]) {
      expect(screen.getAllByText(lens).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(/How their world fits together/i)).toBeInTheDocument();
    expect(
      screen.getAllByText("#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Sourcebook")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /upload interview/i }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/add source/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/research queue/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/demo mode/i)).not.toBeInTheDocument();
  });

  it("adds an interview record from the lab intake form", async () => {
    const user = userEvent.setup();
    render(<LabWorkspace initialRecords={seedRecords} />);

    await user.click(screen.getAllByRole("button", { name: /upload interview/i })[0]);
    await user.type(screen.getByLabelText(/interview title/i), "Cousin interview: AI homework");
    await user.type(screen.getByLabelText(/participant alias/i), "Joshua fieldwork");
    await user.clear(screen.getByLabelText(/relationship or context/i));
    await user.type(screen.getByLabelText(/relationship or context/i), "AI, school, family");
    expect(screen.getByLabelText(/interview file/i)).toBeInTheDocument();
    await user.type(
      screen.getByLabelText(/notes or transcript/i),
      "AI shows up as homework help, not as a futuristic tool."
    );
    await user.click(screen.getByRole("button", { name: /save interview/i }));

    await waitFor(() => {
      expect(screen.getAllByText("Cousin interview: AI homework").length).toBeGreaterThan(0);
    });
  });
});
