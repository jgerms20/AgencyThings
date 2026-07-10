import type { WeeklyWorkflow } from "./types";

export function buildWeeklyWorkflow(weekOf: string): WeeklyWorkflow {
  return {
    id: `problem-wall-week-${weekOf}`,
    weekOf,
    cron: "0 13 * * 1",
    timezone: "America/New_York",
    steps: [
      {
        id: "collect-signals",
        label: "Collect signals",
        owner: "Automation",
        description: "Pull public RSS/news/community signals and merge them with manual strategy notes.",
        inputs: ["source-feeds.json", "manual-notes"],
        outputs: ["raw-signals.json"]
      },
      {
        id: "score-burst",
        label: "Score B.U.R.S.T.",
        owner: "Problem Wall Lab",
        description: "Grade each signal for urgency, specificity, unexpectedness, bigger reason, and solvable cause.",
        inputs: ["raw-signals.json", "client-briefs.json"],
        outputs: ["scored-candidates.json"]
      },
      {
        id: "draft-cards",
        label: "Draft cards",
        owner: "Problem Wall Lab",
        description: "Turn the strongest signal-client pairings into deck-shaped Problem Wall cards.",
        inputs: ["scored-candidates.json"],
        outputs: ["draft-problem-wall.json"]
      },
      {
        id: "human-review",
        label: "Human review",
        owner: "Strategy lead",
        description: "Approve, reject, or sharpen the language before it goes on the wall.",
        inputs: ["draft-problem-wall.json"],
        outputs: ["approved-problem-wall.json"]
      },
      {
        id: "export-wall",
        label: "Export wall",
        owner: "Strategy lead",
        description: "Copy slide-ready fields, JSON, and image prompts for the deck or weekly share-out.",
        inputs: ["approved-problem-wall.json"],
        outputs: ["deck-copy.txt", "wall-candidates.json"]
      }
    ],
    outputs: ["approved-problem-wall.json", "deck-copy.txt", "wall-candidates.json"]
  };
}
