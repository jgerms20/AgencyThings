import { describe, expect, it } from "vitest";
import {
  buildProblemFromSignal,
  formatProblemSlideText,
  generateWeeklyWall,
  scoreProblemCandidate
} from "../src/lib/problem-wall";
import type { ClientBrief, SourceSignal } from "../src/lib/types";

const gatorade: ClientBrief = {
  id: "gatorade",
  name: "Gatorade",
  strategist: "Stephanie Berenson",
  email: "Stephanie.berenson@omc.com",
  positioning: "The leader in hydration science for every/body",
  tone: "Fearless, knowledgeable, spirited, inspiring",
  objectives: ["Make dehydration feel urgent", "Expand beyond elite athletes"],
  audiences: ["everyday hydration seekers", "neurodivergent people", "workers in heat"],
  problemTerritories: ["hydration friction", "body signal gaps", "science fatigue"],
  opportunityVerbs: ["help", "prove", "normalize"]
};

const hydrationSignal: SourceSignal = {
  id: "nd-hydration-signal",
  title: "Weak thirst signals lead to dehydration for neurodivergent adults",
  source: "Community thread plus hydration study",
  sourceType: "community",
  url: "https://example.com/nd-hydration",
  publishedAt: "2026-07-06",
  audience: "neurodivergent adults",
  behavior: "miss thirst signals until symptoms become disruptive",
  tension: "most reminders become extra executive-function work",
  stat: "64% say body-signal reminders are easier to ignore than environmental cues",
  urgency: "summer heat is increasing daily dehydration risk",
  whyItMatters: "poor hydration can impair focus, mood, and physical safety",
  tags: ["hydration", "neurodivergence", "summer"]
};

describe("scoreProblemCandidate", () => {
  it("scores a specific, urgent, solvable candidate higher than a vague candidate", () => {
    const strong = scoreProblemCandidate({
      id: "strong",
      clientId: "gatorade",
      clientName: "Gatorade",
      strategist: "Stephanie Berenson",
      email: "Stephanie.berenson@omc.com",
      problem:
        "Neurodivergent people are getting dehydrated because thirst reminders feel like more executive-function work.",
      opportunity:
        "HOW COULD GATORADE TURN HYDRATION INTO AN ENVIRONMENTAL CUE THAT DOESN'T FEEL LIKE ANOTHER TASK?",
      details:
        "A new community signal found 64% say body-signal reminders are easier to ignore than environmental cues, while summer heat is increasing risk.",
      audience: "neurodivergent adults",
      sources: [hydrationSignal],
      status: "draft"
    });

    const vague = scoreProblemCandidate({
      id: "vague",
      clientId: "gatorade",
      clientName: "Gatorade",
      strategist: "Stephanie Berenson",
      email: "Stephanie.berenson@omc.com",
      problem: "People should hydrate more.",
      opportunity: "HOW COULD GATORADE HELP?",
      details: "Hydration is important.",
      audience: "people",
      sources: [],
      status: "draft"
    });

    expect(strong.total).toBeGreaterThanOrEqual(20);
    expect(strong.total).toBeGreaterThan(vague.total);
    expect(strong.breakdown.specificity).toBe(5);
    expect(vague.grade).toBe("needs work");
  });
});

describe("buildProblemFromSignal", () => {
  it("turns a source signal and client brief into a deck-shaped candidate", () => {
    const candidate = buildProblemFromSignal(hydrationSignal, gatorade, "2026-07-13");

    expect(candidate.problem).toContain("NEURODIVERGENT ADULTS");
    expect(candidate.problem).toContain("DEHYDRATED");
    expect(candidate.opportunity).toMatch(/^HOW COULD GATORADE /);
    expect(candidate.details).toContain("64%");
    expect(candidate.strategist).toBe("Stephanie Berenson");
    expect(candidate.weekOf).toBe("2026-07-13");
  });
});

describe("generateWeeklyWall", () => {
  it("generates a sorted weekly pool without repeating source-client pairings", () => {
    const pool = generateWeeklyWall({
      weekOf: "2026-07-13",
      clients: [gatorade],
      signals: [
        hydrationSignal,
        {
          ...hydrationSignal,
          id: "construction-heat",
          audience: "construction workers",
          behavior: "lose productivity on high-heat job sites",
          stat: "heat stress causes 29% to 41% productivity losses",
          urgency: "new OSHA heat-rule debates are putting worker safety in focus"
        }
      ],
      limit: 2
    });

    expect(pool).toHaveLength(2);
    expect(pool[0]!.score!.total).toBeGreaterThanOrEqual(pool[1]!.score!.total);
    expect(new Set(pool.map((candidate) => candidate.id)).size).toBe(2);
  });
});

describe("formatProblemSlideText", () => {
  it("exports the exact fields needed to build a Problem Wall slide", () => {
    const candidate = buildProblemFromSignal(hydrationSignal, gatorade, "2026-07-13");
    const slideText = formatProblemSlideText(candidate);

    expect(slideText).toContain("DETAILS");
    expect(slideText).toContain("STRATEGIST TO REACH OUT TO");
    expect(slideText).toContain("PROBLEM");
    expect(slideText).toContain("OPPORTUNITY");
    expect(slideText).toContain("Stephanie.berenson@omc.com");
  });
});
