import type { WeeklyWorkflow } from "./types";

export function buildWeeklyWorkflow(weekOf: string): WeeklyWorkflow {
  return {
    id: `problem-wall-${weekOf}`,
    weekOf,
    cron: "0 13 * * 1",
    timezone: "America/Los_Angeles",
    steps: [
      { id: "discover", label: "Discover", description: "Gather current news, research, and community signals." },
      { id: "frame-and-score", label: "Frame and score", description: "Turn evidence into generic problems and apply B.U.R.S.T." },
      { id: "shortlist", label: "Shortlist", description: "Keep the problems worth deeper validation and pass on the rest." },
      { id: "wrap-up", label: "Wrap up", description: "Add notes, save the weekly readout, and mark the set reviewed." }
    ],
    outputs: ["weekly-readout.json", "shortlist-summary.txt"]
  };
}
