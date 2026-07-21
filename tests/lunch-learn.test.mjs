import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appModule = new URL("../tools/lunch-learn/src/app.js", import.meta.url);

test("suggestion batches omit seen partners until the pool is exhausted", async () => {
  const { nextSuggestionBatch } = await import(appModule);
  const partners = [
    { id: "a", name: "A" },
    { id: "b", name: "B" },
    { id: "c", name: "C" },
    { id: "d", name: "D" },
  ];

  const first = nextSuggestionBatch(partners, ["a"], 2);
  assert.deepEqual(first.items.map(({ id }) => id), ["b", "c"]);
  assert.deepEqual(first.seenIds, ["a", "b", "c"]);
  assert.equal(first.didReset, false);

  const second = nextSuggestionBatch(partners, first.seenIds, 2);
  assert.deepEqual(second.items.map(({ id }) => id), ["d"]);
  assert.equal(second.didReset, false);

  const reset = nextSuggestionBatch(partners, second.seenIds, 2);
  assert.deepEqual(reset.items.map(({ id }) => id), ["a", "b"]);
  assert.deepEqual(reset.seenIds, ["a", "b"]);
  assert.equal(reset.didReset, true);
});

test("preference steering reorders the full eligible pool without weakening no-repeat history", async () => {
  const { nextSuggestionBatch, rankPartnersByPreference } = await import(appModule);
  const source = [
    { id: "a", tags: ["research"] },
    { id: "b", tags: ["culture"] },
    { id: "c", tags: ["craft"] },
    { id: "d", tags: ["culture"] },
  ];

  const steered = rankPartnersByPreference(source, {
    selectedTag: "culture",
    preferredTags: [],
    lessTags: [],
  });
  assert.deepEqual(steered.map(({ id }) => id), ["b", "d", "a", "c"]);

  const first = nextSuggestionBatch(steered, [], 2);
  const returnedToAll = nextSuggestionBatch(source, first.seenIds, 2);
  assert.deepEqual(returnedToAll.items.map(({ id }) => id), ["a", "c"]);
  assert.equal(returnedToAll.didReset, false);
});

test("partner feedback produces persistent preference state for every tag", async () => {
  const { applyPartnerFeedback } = await import(appModule);
  const initial = { preferredTags: [], lessTags: [], dismissedIds: [] };
  const partner = { id: "adobe", tags: ["AI", "craft", "workflow"] };

  const more = applyPartnerFeedback(initial, partner, "more");
  assert.deepEqual(more.preferredTags, ["AI", "craft", "workflow"]);
  assert.deepEqual(applyPartnerFeedback(more, partner, "less").lessTags, ["AI", "craft", "workflow"]);
  assert.deepEqual(applyPartnerFeedback(initial, partner, "dismiss").dismissedIds, ["adobe"]);
});

test("pipeline movement works in both directions and clamps at the ends", async () => {
  const { movePipelinePartner, PIPELINE_STAGES } = await import(appModule);
  const pipeline = [{ id: "partner", stage: PIPELINE_STAGES[1] }];

  const forward = movePipelinePartner(pipeline, "partner", 1);
  assert.equal(forward[0].stage, PIPELINE_STAGES[2]);
  assert.equal(movePipelinePartner(forward, "partner", -1)[0].stage, PIPELINE_STAGES[1]);

  const atStart = [{ id: "partner", stage: PIPELINE_STAGES[0] }];
  assert.equal(movePipelinePartner(atStart, "partner", -1)[0].stage, PIPELINE_STAGES[0]);

  const atEnd = [{ id: "partner", stage: PIPELINE_STAGES.at(-1) }];
  assert.equal(movePipelinePartner(atEnd, "partner", 1)[0].stage, PIPELINE_STAGES.at(-1));
  assert.notEqual(forward, pipeline);
});

test("calendar metrics report the last and next sessions around today", async () => {
  const { calendarMetrics } = await import(appModule);
  const sessions = [
    { id: "past", date: "2026-07-10", status: "completed" },
    { id: "future", date: "2026-07-25", status: "scheduled" },
  ];

  assert.deepEqual(calendarMetrics(sessions, new Date("2026-07-20T12:00:00Z")), {
    lastSession: sessions[0],
    nextSession: sessions[1],
    daysSinceLast: 10,
    daysUntilNext: 5,
  });
});

test("calendar metrics use the browser local day near a UTC date boundary", async () => {
  const { calendarMetrics } = await import(appModule);
  const sourceSessions = [
    { id: "past", date: "2026-06-25", status: "completed" },
    { id: "future", date: "2026-08-13", status: "scheduled" },
  ];
  const localEvening = new Date(2026, 6, 20, 18, 0, 0);

  const result = calendarMetrics(sourceSessions, localEvening);
  assert.equal(result.daysSinceLast, 25);
  assert.equal(result.daysUntilNext, 24);
});

test("partner directory filtering is case-insensitive across useful fields", async () => {
  const { filterPartners } = await import(appModule);
  const partners = [
    { id: "one", name: "Adobe", category: "Creative technology", contact: "Maya Chen" },
    { id: "two", name: "Nielsen", category: "Audience research", contact: "Chris Bell" },
  ];

  assert.deepEqual(filterPartners(partners, "creative").map(({ id }) => id), ["one"]);
  assert.deepEqual(filterPartners(partners, "CHRIS").map(({ id }) => id), ["two"]);
  assert.equal(filterPartners(partners, "  ").length, 2);
});

test("Partner Desk exposes five contained workspace views", async () => {
  const html = await readFile(new URL("../tools/lunch-learn/index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../tools/lunch-learn/src/styles.css", import.meta.url), "utf8");

  for (const view of ["suggestions", "pipeline", "calendar", "templates", "directory"]) {
    assert.match(html, new RegExp(`data-view-button="${view}"`));
    assert.match(html, new RegExp(`data-view-panel="${view}"`));
  }

  assert.match(css, /height:\s*100(?:dvh|vh)/);
  assert.match(css, /overflow:\s*hidden/);
  assert.match(css, /\.workspace-main[\s\S]*overflow-y:\s*auto/);
  assert.match(css, /@media\s*\(max-width:/);
});

test("suggestions, pipeline, and directory expose the required controls", async () => {
  const html = await readFile(new URL("../tools/lunch-learn/index.html", import.meta.url), "utf8");

  assert.match(html, /data-refresh-suggestions/);
  assert.match(html, /data-preference-filter/);
  assert.match(html, /data-suggestion-list/);
  assert.match(html, /data-feedback="more"/);
  assert.match(html, /data-feedback="less"/);
  assert.match(html, /data-feedback="dismiss"/);
  assert.match(html, /data-pipeline-board/);
  assert.match(html, /data-move="previous"/);
  assert.match(html, /data-move="next"/);
  assert.match(html, /data-directory-search/);
  assert.match(html, /data-directory-list/);
  assert.match(html, /data-research-link/);
});

test("calendar includes timing metrics, month navigation, and completed view", async () => {
  const html = await readFile(new URL("../tools/lunch-learn/index.html", import.meta.url), "utf8");

  assert.match(html, /data-days-since/);
  assert.match(html, /data-days-until/);
  assert.match(html, /data-calendar-previous/);
  assert.match(html, /data-calendar-next/);
  assert.match(html, /data-calendar-view="month"/);
  assert.match(html, /data-calendar-view="completed"/);
  assert.match(html, /data-calendar-grid/);
});

test("template view renders email fields and copy-ready controls", async () => {
  const html = await readFile(new URL("../tools/lunch-learn/index.html", import.meta.url), "utf8");

  for (const template of ["first-outreach", "follow-up", "confirmation", "internal-announcement"]) {
    assert.match(html, new RegExp(`data-template-id="${template}"`));
  }

  assert.match(html, /data-template-partner/);
  assert.match(html, /data-email-to/);
  assert.match(html, /data-email-subject/);
  assert.match(html, /data-email-body/);
  assert.match(html, /data-copy-email/);
});

test("partner research links use targeted web search URLs", async () => {
  const { researchUrl } = await import(appModule);
  const url = new URL(researchUrl({ name: "Adobe", searchQuery: "Adobe MAX recent news" }));

  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.pathname, "/search");
  assert.equal(url.searchParams.get("q"), "Adobe MAX recent news");
});
