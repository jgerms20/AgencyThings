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
  const [html, app, upgradedApp] = await Promise.all([
    readFile(new URL("index.html", toolRoot), "utf8"),
    readFile(new URL("src/app.js", toolRoot), "utf8"),
    readFile(new URL("src/app-upgraded.js", toolRoot), "utf8"),
  ]);

  for (const id of referencedIds(`${app}\n${upgradedApp}`)) {
    assert.equal(idOccurrences(html, id), 1, `#${id} must appear exactly once`);
  }

  for (const label of ["Upload", "Review", "Sources", "Customize", "Export"]) {
    assert.match(html, new RegExp(`>\\s*${label}\\s*<`), `${label} step must remain visible`);
  }

  for (const id of ["copy-brief", "export-json", "export-ppt", "export-google", "print-brief"]) {
    assert.equal(idOccurrences(html, id), 1, `#${id} export control must remain visible`);
  }

  assert.match(html, /Import PowerPoint brand template/);
  assert.match(html, /Download for Google Slides/);
  assert.match(upgradedApp, /item\.type === 'source'/);
  assert.match(upgradedApp, /localStorage\.getItem\('brief-maker-theme'\)/);
  assert.doesNotMatch(upgradedApp, /const official = \{ label: 'Official specs', query:/);
});

test("Task Brief keeps all five steps readable without a mobile overflow rail", async () => {
  const css = await readFile(new URL("src/upgrade-styles.css", toolRoot), "utf8");

  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.stepper\s*\{[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.step-button\s*\{[^}]*min-width:\s*0/);
});
