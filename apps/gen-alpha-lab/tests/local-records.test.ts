import { describe, expect, it } from "vitest";
import {
  readStoredRecords,
  removeStoredRecords,
  writeStoredRecords
} from "../src/lib/local-records";
import type { ResearchRecord } from "../src/lib/types";

const record: ResearchRecord = {
  id: "local-record",
  kind: "interview",
  title: "Local record",
  source: "Browser",
  summary: "Stored locally.",
  tags: [],
  status: "new",
  confidence: "medium",
  createdAt: "2026-07-12T12:00:00.000Z"
};

describe("local record storage", () => {
  it("returns an empty collection when browser storage denies reads", () => {
    expect(readStoredRecords({ getItem: () => { throw new Error("denied"); } })).toEqual([]);
  });

  it("does not throw when browser storage denies removals or writes", () => {
    const storage = {
      getItem: () => "not-json",
      removeItem: () => { throw new Error("denied"); },
      setItem: () => { throw new Error("denied"); }
    };

    expect(() => readStoredRecords(storage)).not.toThrow();
    expect(removeStoredRecords(storage)).toBe(false);
    expect(writeStoredRecords(storage, [record])).toBe(false);
  });
});
