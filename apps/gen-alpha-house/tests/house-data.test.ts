import { describe, expect, it } from "vitest";
import { roomLenses } from "@/lib/house-data";
import { countLinkedInsights, getRoomLens, getRoomObject } from "@/lib/house-state";

describe("Gen Alpha gender-room content model", () => {
  it("defines two distinct evidence-led room lenses with nine objects each", () => {
    expect(roomLenses.map((lens) => lens.id)).toEqual(["boys", "girls"]);
    expect(roomLenses.map((lens) => lens.label)).toEqual(["Boys’ room", "Girls’ room"]);
    expect(roomLenses[0].objects).not.toBe(roomLenses[1].objects);

    for (const lens of roomLenses) {
      expect(lens.objects).toHaveLength(9);
      expect(new Set(lens.objects.map((item) => item.id)).size).toBe(9);
      expect(lens.objects.some((item) => item.id === "influencer-poster")).toBe(true);
      expect(lens.framing).toMatch(/pattern|lens|research/i);

      for (const item of lens.objects) {
        expect(item.label.length).toBeGreaterThan(0);
        expect(item.context.length).toBeGreaterThan(40);
        expect(item.position.x).toBeGreaterThanOrEqual(0);
        expect(item.position.x).toBeLessThanOrEqual(100);
        expect(item.position.y).toBeGreaterThanOrEqual(0);
        expect(item.position.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("links every object to at least three sourced Lab findings", () => {
    for (const lens of roomLenses) {
      for (const item of lens.objects) {
        expect(item.insights.length).toBeGreaterThanOrEqual(3);
        expect(new Set(item.insights.map((insight) => insight.id)).size).toBe(item.insights.length);

        for (const insight of item.insights) {
          const labUrl = new URL(insight.labUrl);
          const sourceUrl = new URL(insight.sourceUrl);
          expect(labUrl.origin).toBe("https://agencythings-gen-alpha.vercel.app");
          expect(labUrl.pathname).toMatch(/^\/(?:insights|influencers)\/|^\/gender$/);
          expect(sourceUrl.protocol).toBe("https:");
          expect(insight.evidenceCount).toBeGreaterThanOrEqual(1);
          expect(insight.sources.length).toBeGreaterThanOrEqual(1);
          expect(["U.S.", "U.K.", "Global / multi-market", "Market not published"]).toContain(insight.market);
          expect(["established", "emerging signal", "working hunch"]).toContain(insight.evidenceStatus);
        }
      }
    }
  });

  it("connects creator discovery to parent-mediated purchase as an explicit research hunch", () => {
    for (const lens of roomLenses) {
      const serialized = JSON.stringify(lens.objects);
      expect(serialized).toMatch(/creator-to-cart/i);
      expect(serialized).toMatch(/shared cart|wish list/i);
      expect(lens.objects.flatMap((item) => item.insights).some((insight) => insight.evidenceStatus === "working hunch")).toBe(true);
    }
  });

  it("provides at least twenty-seven curated connections per room", () => {
    expect(countLinkedInsights("boys")).toBeGreaterThanOrEqual(27);
    expect(countLinkedInsights("girls")).toBeGreaterThanOrEqual(27);
  });

  it("finds lenses and objects without crossing room state", () => {
    expect(getRoomLens("girls")?.imageSrc).toBe("/gen-alpha-girls-bedroom.png");
    expect(getRoomLens("missing-lens")).toBeUndefined();
    expect(getRoomObject("boys", "game-console")?.object).toBe("Console + headset");
    expect(getRoomObject("girls", "book-shelf")?.object).toBe("Books + maker shelf");
    expect(getRoomObject("girls", "missing-object")).toBeUndefined();
  });

  it("anchors the numbered poster hotspot to visible wall art in both rooms", () => {
    const boysPoster = getRoomObject("boys", "influencer-poster");
    const girlsPoster = getRoomObject("girls", "influencer-poster");

    expect(boysPoster?.position).toEqual({ x: 92, y: 29 });
    expect(girlsPoster?.position).toEqual({ x: 18, y: 22 });
    expect(boysPoster?.title).not.toBe(girlsPoster?.title);
    expect(boysPoster?.insights.map((item) => item.title)).not.toEqual(girlsPoster?.insights.map((item) => item.title));
  });

  it("keeps the lens copy specific without claiming gender exclusivity", () => {
    const serialized = JSON.stringify(roomLenses);
    expect(serialized).toMatch(/console identity|competition|sports/i);
    expect(serialized).toMatch(/reading|music|maker|social video/i);
    expect(serialized).not.toMatch(/all boys|all girls|only boys|only girls|naturally|hardwired/i);
  });
});
