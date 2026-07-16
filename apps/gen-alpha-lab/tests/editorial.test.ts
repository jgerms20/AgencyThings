import { describe, expect, it } from "vitest";
import { editorialInsights, insightTabs, libraryTakeaways } from "../src/lib/editorial";
import { influencers } from "../src/lib/influencers";

describe("Gen Alpha editorial model", () => {
  it("organizes ten insights into four themes without leading with AI", () => {
    expect(insightTabs.map((tab) => tab.id)).toEqual([
      "play-belonging",
      "media-influence",
      "time-learning",
      "ai-agency"
    ]);
    expect(editorialInsights).toHaveLength(10);
    expect(editorialInsights[0].tabId).toBe("play-belonging");
    expect(editorialInsights.at(-1)?.tabId).toBe("ai-agency");

    for (const tab of insightTabs) {
      expect(editorialInsights.filter((insight) => insight.tabId === tab.id).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("defines thirty diverse influencer profiles and five featured entries", () => {
    expect(influencers).toHaveLength(30);
    expect(new Set(influencers.map((influencer) => influencer.id))).toHaveProperty("size", 30);
    expect(influencers.filter((influencer) => influencer.featured)).toHaveLength(5);
    expect(influencers.filter((influencer) => influencer.pronouns === "she").length).toBeGreaterThanOrEqual(12);

    for (const influencer of influencers) {
      expect(influencer.portrait).toMatch(/^\/creators\/.+\.jpg$/);
      expect(influencer.profileUrl).toMatch(/^https:\/\/www\.youtube\.com\/@/);
      expect(influencer.audience).toMatch(/ages/i);
      expect(influencer.moments).toHaveLength(3);
      expect(influencer.indicators).toHaveLength(4);
    }
  });

  it("keeps library takeaways short and conclusion-led", () => {
    expect(libraryTakeaways).toHaveLength(3);
    expect(libraryTakeaways.every((takeaway) => takeaway.length < 90)).toBe(true);
  });
});
