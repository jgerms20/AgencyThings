import { describe, expect, it } from "vitest";
import { buildProblemFromSignal, generateWeeklyWall, scoreProblemCandidate } from "../src/lib/problem-wall";
import type { ProblemCandidate, SourceSignal } from "../src/lib/types";

const freshSignal: SourceSignal = {
  id: "fresh-study",
  title: "Parents lose six hours a week coordinating school messages",
  source: "OpenAlex",
  sourceType: "study",
  sourceClass: "research",
  url: "https://doi.org/10.1000/example",
  publishedAt: "2026-07-10",
  audience: "working parents",
  behavior: "switch between five disconnected school communication tools",
  tension: "urgent information is scattered across apps that do not share context",
  stat: "6 hours per week",
  urgency: "new district platform changes are increasing coordination load",
  whyItMatters: "missed messages create childcare, work, and learning consequences",
  tags: ["family", "learning"]
};

function candidate(overrides: Partial<ProblemCandidate> = {}): ProblemCandidate {
  return {
    id: "candidate",
    weekOf: "2026-07-13",
    problem: "Working parents lose six hours each week because school communication is split across five tools.",
    biggerReason: "Missed messages create childcare, work, and learning consequences.",
    rootCause: "Urgent information is scattered across apps that do not share context.",
    details: "A new study documents six hours of weekly coordination work.",
    audience: "working parents",
    sources: [freshSignal],
    status: "new",
    notes: "",
    ...overrides
  };
}

describe("scoreProblemCandidate", () => {
  it("returns five evidence-backed B.U.R.S.T. dimensions and caps missing evidence", () => {
    const strong = scoreProblemCandidate(candidate(), new Date("2026-07-13T12:00:00Z"));
    const unsupported = scoreProblemCandidate(candidate({ sources: [], details: "A vague frustration." }), new Date("2026-07-13T12:00:00Z"));

    expect(Object.keys(strong.breakdown)).toEqual([
      "biggerReason",
      "unexpectedness",
      "relevancy",
      "specificity",
      "targetedCause"
    ]);
    expect(Object.keys(strong.reasons)).toHaveLength(5);
    expect(strong.total).toBeGreaterThan(unsupported.total);
    expect(unsupported.grade).not.toBe("wall ready");
    expect(unsupported.evidenceCapped).toBe(true);
  });
});

describe("buildProblemFromSignal", () => {
  it("creates a generic source-preserving problem with no client or strategist fields", () => {
    const result = buildProblemFromSignal(freshSignal, "2026-07-13");

    expect(result.problem).toContain("The burden is landing on working parents");
    expect(result.biggerReason).toContain("childcare");
    expect(result.rootCause).toContain("scattered");
    expect(result.sources[0]?.url).toBe(freshSignal.url);
    expect(result.sources[0]?.publishedAt).toBe("2026-07-10");
    expect(result).not.toHaveProperty("clientName");
    expect(result).not.toHaveProperty("strategist");
  });
});

describe("generateWeeklyWall", () => {
  it("sorts fresh generic candidates and never invents candidates without signals", () => {
    const pool = generateWeeklyWall({
      weekOf: "2026-07-13",
      signals: [freshSignal, { ...freshSignal, id: "second", title: "A second weaker signal", url: "https://doi.org/10.1000/second", stat: undefined }],
      limit: 2,
      now: "2026-07-13T12:00:00Z"
    });

    expect(pool).toHaveLength(2);
    expect(pool[0]!.score.total).toBeGreaterThanOrEqual(pool[1]!.score.total);
    expect(generateWeeklyWall({ weekOf: "2026-07-13", signals: [] })).toEqual([]);
  });
});
