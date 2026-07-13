import { describe, expect, it } from "vitest";
import { buildWeeklyWorkflow } from "../src/lib/workflow";

describe("buildWeeklyWorkflow", () => {
  it("describes the same Monday discovery and review loop used by manual refresh", () => {
    const workflow = buildWeeklyWorkflow("2026-07-13");

    expect(workflow.cron).toBe("0 13 * * 1");
    expect(workflow.steps.map((step) => step.id)).toEqual([
      "discover",
      "frame-and-score",
      "shortlist",
      "wrap-up"
    ]);
    expect(workflow.outputs).toContain("weekly-readout.json");
    expect(JSON.stringify(workflow)).not.toMatch(/client|strategist|deck-copy/i);
  });
});
