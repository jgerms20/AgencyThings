import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import test from "node:test";
import { tmpdir } from "node:os";
import { join } from "node:path";

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

test("date, view target, and optional storage helpers fail safely", async () => {
  const { formatCurrentDate, getStoredValue, setStoredValue, viewTargetSelector } =
    await importHubModule();
  const blockedStorage = {
    getItem() {
      throw new Error("storage blocked");
    },
    setItem() {
      throw new Error("storage blocked");
    },
  };

  assert.equal(formatCurrentDate(new Date("2026-07-12T12:00:00")), "Sunday, July 12");
  assert.equal(viewTargetSelector("home"), "#top");
  assert.equal(viewTargetSelector("all"), '[data-view="all"]');
  assert.equal(getStoredValue(blockedStorage, "key"), null);
  assert.equal(setStoredValue(blockedStorage, "key", "value"), false);
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
  assert.match(html, /data-current-date/);
  assert.equal((html.match(/data-directory-project=/g) ?? []).length, 3);

  const externalLinks = html.match(/<a[^>]+target="_blank"[^>]+rel="noreferrer"[^>]*>/g) ?? [];
  assert.equal(externalLinks.length, 6);
});

test("GitHub Pages packages the hub and Task Brief as separate destinations", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/deploy-digital-task-brief-maker.yml", import.meta.url),
    "utf8",
  );

  assert.deepEqual(
    workflow.match(/branches:\s*\n(?:\s+- .+\n)+/)?.[0].match(/- ([\w-]+)/g),
    ["- main"],
  );
  assert.match(workflow, /node scripts\/build-pages-site\.mjs _site/);
  assert.match(workflow, /AgencyThings desktop is deployed/);
});

test("Pages builder creates a runnable hub and nested Task Brief artifact", async () => {
  const { buildPagesSite } = await import("../scripts/build-pages-site.mjs");
  const destination = await mkdtemp(join(tmpdir(), "agencythings-pages-"));

  try {
    await buildPagesSite(destination, new URL("..", import.meta.url));

    await Promise.all([
      access(join(destination, "index.html")),
      access(join(destination, "assets", "hub.css")),
      access(join(destination, "assets", "hub.js")),
      access(join(destination, "tools", "digital-task-brief-maker", "index.html")),
      access(join(destination, ".nojekyll")),
    ]);

    const deployedHub = await readFile(join(destination, "index.html"), "utf8");
    assert.match(deployedHub, /Joshua(?:'|&apos;|&#39;)s AgencyThings/);
  } finally {
    await rm(destination, { recursive: true, force: true });
  }
});
