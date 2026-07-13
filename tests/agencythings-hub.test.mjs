import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function importHubModule() {
  const source = await readFile(new URL("../assets/hub.js", import.meta.url), "utf8");
  const url = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  return import(url);
}

test("registry contains the three AgencyThings worlds", async () => {
  const { projects } = await importHubModule();

  assert.deepEqual(
    projects.map(({ id, name, type }) => ({ id, name, type })),
    [
      { id: "task-brief", name: "Digital Task Brief Maker", type: "Workflow" },
      { id: "problem-wall", name: "Problem Wall Lab", type: "Strategy Lab" },
      { id: "gen-alpha", name: "Gen Alpha Intelligence Lab", type: "Living Research" },
    ],
  );
});

test("registry preserves internal and external launch destinations", async () => {
  const { projects } = await importHubModule();

  assert.deepEqual(
    projects.map(({ id, href, external }) => ({ id, href, external })),
    [
      {
        id: "task-brief",
        href: "./tools/digital-task-brief-maker/",
        external: false,
      },
      {
        id: "problem-wall",
        href: "https://agencythings-problem-wall.vercel.app",
        external: true,
      },
      {
        id: "gen-alpha",
        href: "https://agencythings-gen-alpha.vercel.app",
        external: true,
      },
    ],
  );
});

test("filterProjects searches names, types, and purposes without case sensitivity", async () => {
  const { filterProjects } = await importHubModule();

  assert.deepEqual(filterProjects("strategy").map(({ id }) => id), ["problem-wall"]);
  assert.deepEqual(filterProjects("RESEARCH").map(({ id }) => id), ["gen-alpha"]);
  assert.deepEqual(filterProjects("media plan").map(({ id }) => id), ["task-brief"]);
  assert.equal(filterProjects("   ").length, 3);
});

test("root page is the AgencyThings desktop with accessible launch links", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /Joshua(?:'|&apos;|&#39;)s AgencyThings/);
  assert.doesNotMatch(html, /http-equiv=["']refresh/i);
  assert.doesNotMatch(html, /window\.location\.replace/);
  assert.match(html, /href=["']\.\/tools\/digital-task-brief-maker\/["']/);
  assert.match(html, /href=["']https:\/\/agencythings-problem-wall\.vercel\.app["']/);
  assert.match(html, /href=["']https:\/\/agencythings-gen-alpha\.vercel\.app["']/);
  assert.match(html, /href=["']\.\/assets\/hub\.css["']/);
  assert.match(html, /src=["']\.\/assets\/hub\.js["']/);

  const externalLinks = html.match(/<a[^>]+target="_blank"[^>]+rel="noreferrer"[^>]*>/g) ?? [];
  assert.equal(externalLinks.length, 6);
});

test("GitHub Pages packages the hub and Task Brief as separate destinations", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/deploy-digital-task-brief-maker.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /cp index\.html _site\/index\.html/);
  assert.match(workflow, /cp -R assets _site\/assets/);
  assert.match(
    workflow,
    /cp -R tools\/digital-task-brief-maker \/?_site\/tools\/digital-task-brief-maker/,
  );
  assert.doesNotMatch(workflow, /cp -R tools\/digital-task-brief-maker\/\. _site\//);
  assert.match(workflow, /AgencyThings desktop is deployed/);
});
