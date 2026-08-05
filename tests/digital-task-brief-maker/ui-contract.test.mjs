import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const toolRoot = new URL("../../tools/digital-task-brief-maker/", import.meta.url);

function referencedIds(source) {
  return [
    ...new Set(
      [...source.matchAll(/(?:qs|querySelector)\(\s*["']#([^"']+)["']\s*\)/g)].map(
        ([, id]) => id,
      ),
    ),
  ];
}

function idOccurrences(html, id) {
  return (html.match(new RegExp(`<[^>]+\\bid=["']${id}["']`, "g")) ?? []).length;
}

test("Task Brief keeps all application IDs unique and its workflow controls visible", async () => {
  const [html, upgradedApp] = await Promise.all([
    readFile(new URL("index.html", toolRoot), "utf8"),
    readFile(new URL("src/app-upgraded.js", toolRoot), "utf8"),
  ]);

  for (const id of referencedIds(upgradedApp)) {
    assert.equal(idOccurrences(html, id), 1, `#${id} must appear exactly once`);
  }

  for (const label of ["Upload", "Review", "Sources", "Customize", "Export"]) {
    assert.match(html, new RegExp(`>\\s*${label}\\s*<`), `${label} step must remain visible`);
  }

  for (const id of ["copy-brief", "export-json", "export-ppt", "print-brief"]) {
    assert.equal(idOccurrences(html, id), 1, `#${id} export control must remain visible`);
  }

  for (const id of ["table-workspace", "table-tabs", "add-table", "rename-table", "duplicate-table", "remove-table", "add-row", "paste-rows"]) {
    assert.equal(idOccurrences(html, id), 1, `#${id} table control must remain visible`);
  }
  for (const id of ["campaign-date", "include-timing", "include-dividers", "include-closing", "include-appendix"]) {
    assert.equal(idOccurrences(html, id), 1, `#${id} deck control must remain visible`);
  }

  assert.match(html, /Import PowerPoint template/);
  assert.match(html, /Add table/);
  assert.match(html, /Add row/);
  assert.doesNotMatch(html, /Brand look/);
  assert.doesNotMatch(html, /Download for Google Slides/);
  assert.match(upgradedApp, /No authoritative spec link is mapped yet/);
  assert.doesNotMatch(upgradedApp, /group\.matchedPlacement\?\.sourceUrls \|\| \[\]/);
  assert.match(upgradedApp, /localStorage\.getItem\('brief-maker-theme'\)/);
  assert.doesNotMatch(upgradedApp, /const official = \{ label: 'Official specs', query:/);
  assert.doesNotMatch(upgradedApp, /google\.com\/search/);
});

test("Task Brief keeps all five steps readable without a mobile overflow rail", async () => {
  const css = await readFile(new URL("src/upgrade-styles.css", toolRoot), "utf8");

  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.stepper\s*\{[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.step-button\s*\{[^}]*min-width:\s*0/);
});
