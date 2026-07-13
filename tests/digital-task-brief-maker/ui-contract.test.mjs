import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const toolRoot = new URL("../../tools/digital-task-brief-maker/", import.meta.url);

function referencedIds(source) {
  return [
    ...new Set(
      [...source.matchAll(/qs\(\s*["']#([^"']+)["']\s*\)/g)].map(
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
});
