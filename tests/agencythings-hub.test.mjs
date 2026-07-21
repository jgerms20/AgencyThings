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

test("registry contains the five AgencyThings worlds and their action modes", async () => {
  const { projects } = await importHubModule();

  assert.deepEqual(
    projects.map(({ id, name, type, mode }) => ({ id, name, type, mode })),
    [
      { id: "task-brief", name: "Digital Task Brief Maker", type: "Workflow", mode: "make" },
      { id: "problem-wall", name: "Problem Wall Lab", type: "Strategy Lab", mode: "think" },
      { id: "gen-alpha", name: "Gen Alpha Intelligence Lab", type: "Living Research", mode: "learn" },
      { id: "memento", name: "Memento", type: "Cultural Planning", mode: "think" },
      { id: "lunch-learn", name: "Lunch & Learn", type: "Programming Desk", mode: "learn" },
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
        href: "https://agencythings-task-brief.vercel.app",
        external: true,
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
      {
        id: "memento",
        href: "https://agencythings-memento.vercel.app",
        external: true,
      },
      {
        id: "lunch-learn",
        href: "./tools/lunch-learn/",
        external: false,
      },
    ],
  );
});

test("Task Brief launches through its independent Vercel destination", async () => {
  const { projects } = await importHubModule();
  const [html, vercelConfig] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../tools/digital-task-brief-maker/vercel.json", import.meta.url), "utf8"),
  ]);
  const taskBrief = projects.find(({ id }) => id === "task-brief");

  assert.deepEqual(taskBrief, {
    id: "task-brief",
    name: "Digital Task Brief Maker",
    type: "Workflow",
    mode: "make",
    purpose: "Turn media plans into clear, creative-ready task briefs.",
    href: "https://agencythings-task-brief.vercel.app",
    external: true,
  });
  assert.match(html, /href="https:\/\/agencythings-task-brief\.vercel\.app" target="_blank" rel="noreferrer" data-launch-project="task-brief"/);
  assert.deepEqual(JSON.parse(vercelConfig), {
    cleanUrls: true,
    trailingSlash: false,
    rewrites: [{ source: "/", destination: "/index.html" }],
  });
});

test("filterProjects searches names, types, and purposes without case sensitivity", async () => {
  const { filterProjects } = await importHubModule();

  assert.deepEqual(filterProjects("strategy").map(({ id }) => id), ["problem-wall"]);
  assert.deepEqual(filterProjects("RESEARCH").map(({ id }) => id), ["gen-alpha"]);
  assert.deepEqual(filterProjects("media plan").map(({ id }) => id), ["task-brief"]);
  assert.deepEqual(filterProjects("cultural").map(({ id }) => id), ["gen-alpha", "memento"]);
  assert.deepEqual(filterProjects("programming").map(({ id }) => id), ["lunch-learn"]);
  assert.equal(filterProjects("   ").length, 5);
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
  assert.equal(viewTargetSelector("make"), '[data-mode="make"]');
  assert.equal(getStoredValue(blockedStorage, "key"), null);
  assert.equal(setStoredValue(blockedStorage, "key", "value"), false);
});

test("root page is Joshua's AgencyThings workbench with accessible launch links", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../assets/hub.css", import.meta.url), "utf8");

  assert.match(html, /Joshua(?:'|&apos;|&#39;)s AgencyThings/);
  assert.match(
    html,
    /<a class="brand-lockup"[^>]*>[\s\S]*Joshua(?:'|&apos;|&#39;)s AgencyThings[\s\S]*<\/a>/,
  );
  assert.match(html, /<button[^>]+data-nav-target="home"[^>]*>Home<\/button>/);
  assert.match(html, /<button[^>]+data-nav-target="make"[^>]*>Make<\/button>/);
  assert.match(html, /<button[^>]+data-nav-target="think"[^>]*>Think<\/button>/);
  assert.match(html, /<button[^>]+data-nav-target="learn"[^>]*>Learn<\/button>/);
  assert.match(css, /translateY\(-4px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.equal((html.match(/data-recent-status/g) ?? []).length, 5);
  assert.match(html, />Recently opened</);
  assert.doesNotMatch(html, /http-equiv=["']refresh/i);
  assert.doesNotMatch(html, /window\.location\.replace/);
  assert.match(html, /href=["']https:\/\/agencythings-task-brief\.vercel\.app["']/);
  assert.match(html, /href=["']https:\/\/agencythings-problem-wall\.vercel\.app["']/);
  assert.match(html, /href=["']https:\/\/agencythings-gen-alpha\.vercel\.app["']/);
  assert.match(html, /href=["']https:\/\/agencythings-memento\.vercel\.app["']/);
  assert.match(html, /href=["']\.\/tools\/lunch-learn\/["']/);
  assert.match(html, /href=["']\.\/assets\/hub\.css["']/);
  assert.match(html, /src=["']\.\/assets\/hub\.js["']/);
  assert.match(html, /data-current-date/);
  assert.match(html, /data-theme-toggle/);
  assert.match(css, /\[data-theme=["']dark["']\]/);
  assert.equal((html.match(/data-directory-project=/g) ?? []).length, 5);

  const externalLinks = html.match(/<a[^>]+target="_blank"[^>]+rel="noreferrer"[^>]*>/g) ?? [];
  assert.equal(externalLinks.length, 8);
});

test("GitHub Pages packages the hub, Task Brief, and Lunch & Learn as separate destinations", async () => {
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
  assert.match(workflow, /tools\/lunch-learn/);
});

test("Pages builder creates a runnable hub and both nested static tools", async () => {
  const { buildPagesSite } = await import("../scripts/build-pages-site.mjs");
  const destination = await mkdtemp(join(tmpdir(), "agencythings-pages-"));

  try {
    await buildPagesSite(destination, new URL("..", import.meta.url));

    await Promise.all([
      access(join(destination, "index.html")),
      access(join(destination, "assets", "hub.css")),
      access(join(destination, "assets", "hub.js")),
      access(join(destination, "tools", "digital-task-brief-maker", "index.html")),
      access(join(destination, "tools", "lunch-learn", "index.html")),
      access(join(destination, "tools", "lunch-learn", "src", "styles.css")),
      access(join(destination, "tools", "lunch-learn", "src", "app.js")),
      access(join(destination, ".nojekyll")),
    ]);

    const deployedHub = await readFile(join(destination, "index.html"), "utf8");
    assert.match(deployedHub, /Joshua(?:'|&apos;|&#39;)s AgencyThings/);
  } finally {
    await rm(destination, { recursive: true, force: true });
  }
});
