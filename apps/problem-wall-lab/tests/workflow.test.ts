import { describe, expect, it } from "vitest";
import { refreshSourceSignals } from "../src/lib/source-refresh";
import { buildWeeklyWorkflow } from "../src/lib/workflow";

describe("buildWeeklyWorkflow", () => {
  it("creates a Monday weekly refresh workflow with review and export steps", () => {
    const workflow = buildWeeklyWorkflow("2026-07-13");

    expect(workflow.cron).toBe("0 13 * * 1");
    expect(workflow.steps.map((step) => step.id)).toEqual([
      "collect-signals",
      "score-burst",
      "draft-cards",
      "human-review",
      "export-wall"
    ]);
    expect(workflow.steps[3].owner).toBe("Strategy lead");
    expect(workflow.outputs).toContain("approved-problem-wall.json");
  });
});

describe("refreshSourceSignals", () => {
  it("returns fallback signals when live source fetching is unavailable", async () => {
    const signals = await refreshSourceSignals({
      fetcher: async () => {
        throw new Error("network unavailable");
      },
      now: "2026-07-09T12:00:00.000Z"
    });

    expect(signals.length).toBeGreaterThanOrEqual(3);
    expect(signals.every((signal) => signal.source)).toBe(true);
    expect(signals.some((signal) => signal.tags.includes("fallback"))).toBe(true);
  });
});
