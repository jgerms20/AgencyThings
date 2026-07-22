import { describe, expect, it } from "vitest";
import { createInitialWorkspace, reduceWorkspace } from "@/lib/editorial-store";

describe("editorial workspace", () => {
  it("saves stories, notes, storylines, and monthly assignments", () => {
    let state = createInitialWorkspace();
    state = reduceWorkspace(state, { type: "toggle-save", storyId: "story-1" });
    state = reduceWorkspace(state, { type: "update-notes", storyId: "story-1", notes: "Watch this." });
    state = reduceWorkspace(state, { type: "create-storyline", title: "Fast instincts" });
    const storylineId = state.storylines[0].id;
    state = reduceWorkspace(state, { type: "assign-storyline", storyId: "story-1", storylineId });
    state = reduceWorkspace(state, { type: "assign-monthly", storyId: "story-1", section: "trends" });

    expect(state.saved["story-1"].notes).toBe("Watch this.");
    expect(state.storylines[0].storyIds).toContain("story-1");
    expect(state.monthly.sections.trends).toContain("story-1");
  });

  it("never discards editorial state when feed stories change", () => {
    let state = reduceWorkspace(createInitialWorkspace(), { type: "toggle-save", storyId: "story-1" });
    state = reduceWorkspace(state, { type: "replace-feed", storyIds: ["story-2", "story-3"] });
    expect(state.saved["story-1"]).toBeDefined();
    expect(state.feedStoryIds).toEqual(["story-2", "story-3"]);
  });
});
