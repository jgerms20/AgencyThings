import { describe, expect, it } from "vitest";
import { evidenceItems } from "@/lib/content/evidence";
import { sources } from "@/lib/content/sources";
import { validateContentGraph } from "@/lib/content/validate";

describe("canonical content graph", () => {
  it("stores direct evidence with explicit scope and limitations", () => {
    expect(sources.length).toBeGreaterThanOrEqual(25);
    expect(evidenceItems.length).toBeGreaterThanOrEqual(80);

    for (const item of evidenceItems) {
      expect(item.population).toBeTruthy();
      expect(item.ageRange).toBeTruthy();
      expect(item.geography).toBeTruthy();
      expect(item.period).toBeTruthy();
      expect(item.methodology).toBeTruthy();
      expect(item.limitations).toBeTruthy();
    }
  });

  it("has no graph validation issues", () => {
    expect(validateContentGraph()).toEqual([]);
  });
});
