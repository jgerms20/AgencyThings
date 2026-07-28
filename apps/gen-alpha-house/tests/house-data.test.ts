import { describe, expect, it } from "vitest";
import { roomObjects } from "@/lib/house-data";
import { countLinkedInsights, getRoomObject } from "@/lib/house-state";

describe("Gen Alpha bedroom content model", () => {
  it("defines eight meaningful room objects with unique IDs and positions", () => {
    expect(roomObjects).toHaveLength(8);
    expect(new Set(roomObjects.map((item) => item.id)).size).toBe(8);

    for (const item of roomObjects) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.context.length).toBeGreaterThan(40);
      expect(item.position.x).toBeGreaterThanOrEqual(0);
      expect(item.position.x).toBeLessThanOrEqual(100);
      expect(item.position.y).toBeGreaterThanOrEqual(0);
      expect(item.position.y).toBeLessThanOrEqual(100);
    }
  });

  it("links every object to at least three distinct Intelligence Lab insights", () => {
    for (const item of roomObjects) {
      expect(item.insights.length).toBeGreaterThanOrEqual(3);
      expect(new Set(item.insights.map((insight) => insight.id)).size).toBe(item.insights.length);

      for (const insight of item.insights) {
        const url = new URL(insight.labUrl);
        expect(url.origin).toBe("https://agencythings-gen-alpha.vercel.app");
        expect(url.pathname).toBe(`/insights/${insight.id}`);
        expect(insight.evidenceCount).toBeGreaterThanOrEqual(2);
        expect(insight.sources.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("provides at least twenty-four curated object-to-insight connections", () => {
    expect(countLinkedInsights()).toBeGreaterThanOrEqual(24);
  });

  it("finds an object by ID", () => {
    expect(getRoomObject("game-console")?.object).toBe("Game console + headset");
    expect(getRoomObject("missing-object")).toBeUndefined();
  });

  it("anchors every hotspot to the matching object in the generated bedroom art", () => {
    expect(Object.fromEntries(roomObjects.map((object) => [object.id, object.position]))).toEqual({
      phone: { x: 10, y: 67 },
      television: { x: 73, y: 43 },
      "homework-desk": { x: 61, y: 49 },
      "game-console": { x: 80, y: 69 },
      backpack: { x: 35, y: 86 },
      "toy-shelf": { x: 67, y: 29 },
      "parent-door": { x: 91, y: 38 },
      "bike-window": { x: 40, y: 34 },
    });
  });
});
