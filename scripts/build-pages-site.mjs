import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

export async function buildPagesSite(destination, rootUrl = new URL("../", import.meta.url)) {
  const root = fileURLToPath(rootUrl);
  const output = resolve(destination);

  await rm(output, { recursive: true, force: true });
  await mkdir(join(output, "tools"), { recursive: true });
  await cp(join(root, "index.html"), join(output, "index.html"));
  await cp(join(root, "assets"), join(output, "assets"), { recursive: true });
  await cp(
    join(root, "tools", "digital-task-brief-maker"),
    join(output, "tools", "digital-task-brief-maker"),
    { recursive: true },
  );
  await writeFile(join(output, ".nojekyll"), "");
  await writeFile(
    join(output, "build-info.json"),
    `${JSON.stringify({ build: "agencythings-desktop", sha: process.env.GITHUB_SHA ?? "local" })}\n`,
  );
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";

if (invokedPath === import.meta.url) {
  const destination = process.argv[2] ?? "_site";
  await buildPagesSite(destination, pathToFileURL(`${dirname(fileURLToPath(import.meta.url))}/../`));
}
