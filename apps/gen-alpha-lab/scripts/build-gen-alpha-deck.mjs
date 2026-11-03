import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer } from "vite";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(appDir, ".codex-deck-build");
const outputDir = path.join(appDir, "deliverables");
const finalPath = path.join(outputDir, "Gen-Alpha-Intelligence-Lab-and-House-2026-11-v3.pptx");
const runtime = "/Users/joshuagerman/.cache/codex-runtimes/codex-primary-runtime/dependencies";
const skillDir = "/Users/joshuagerman/.codex/plugins/cache/openai-primary-runtime/presentations/26.1026.10807/skills/presentations";
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(runtime, "node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs")).href);
const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href);

const vite = await createServer({ root: appDir, server: { middlewareMode: true }, appType: "custom" });
const load = (name) => vite.ssrLoadModule(`/src/lib/${name}.ts`);
const [evidence, culture, spacesModule, sourcesModule, comparisons, strategy, humor, house, demographics, gender, seed] = await Promise.all([
  load("content/evidence"), load("content/culture-shapers"), load("content/spaces"), load("content/sources"),
  load("content/comparisons"), load("content/strategy"), load("content/humor"), load("house-data"),
  load("demographics"), load("gender-lens"), load("seed-data"),
]);
await vite.close();
await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const W = 1280;
const H = 720;
const C = { ink: "#0B1117", paper: "#F4F4EC", muted: "#B6C1C6", lime: "#CCF35B", cyan: "#72D6DB", coral: "#FF907C", blue: "#5073BA" };
const FONT = "Arial";
const pres = Presentation.create({ slideSize: { width: W, height: H } });
const site = "https://agencythings-gen-alpha.vercel.app";
let number = 0;

function text(slide, value, x, y, w, h, size = 24, color = C.paper, bold = false, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox", position: { left: x, top: y, width: w, height: h },
    fill: "none", line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = String(value ?? "");
  shape.text.style = { typeface: FONT, fontSize: size, color, bold, wrap: "square", autoFit: "shrinkText", insets: 0, ...opts };
  return shape;
}

function base(title, section, notes = "", accent = C.lime) {
  const slide = pres.slides.add();
  slide.background.fill = C.ink;
  number += 1;
  text(slide, section.toUpperCase(), 58, 33, 600, 20, 15, accent, true);
  text(slide, title, 58, 80, 1164, 92, 43, C.paper, true);
  text(slide, `GEN ALPHA INTELLIGENCE LAB  /  ${String(number).padStart(2, "0")}`, 58, 672, 700, 20, 12, C.muted);
  slide.speakerNotes.text = `${notes}\nLab: ${site}`.trim();
  return slide;
}

async function image(slide, relative, x, y, w, h, alt = "") {
  const filename = path.join(appDir, "public", relative.replace(/^\//, ""));
  try {
    const bytes = await fs.readFile(filename);
    slide.images.add({ blob: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), contentType: filename.endsWith(".png") ? "image/png" : "image/jpeg", alt, fit: "cover", position: { left: x, top: y, width: w, height: h } });
    return true;
  } catch {
    return false;
  }
}

function row(slide, top, heading, body, accent = C.cyan, width = 1150, size = 21) {
  text(slide, heading, 60, top, width, 35, 25, accent, true);
  text(slide, body, 60, top + 40, width, 72, size, C.paper);
}

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function clean(value) { return String(value ?? "").replace(/\s+/g, " ").trim(); }
function short(value, max = 165) {
  const out = clean(value);
  return out.length > max ? `${out.slice(0, max - 1).trimEnd()}…` : out;
}

// Presentation section: designed to stand alone in a room.
{
  const slide = pres.slides.add(); number += 1;
  slide.background.fill = C.ink;
  await image(slide, "/findings/connection.png", 644, 0, 636, 720, "Young people connecting");
  text(slide, "GEN ALPHA", 58, 70, 520, 36, 22, C.lime, true);
  text(slide, "Intelligence Lab", 58, 202, 540, 172, 66, C.paper, true);
  text(slide, "Culture, spaces, influence and the House", 58, 437, 520, 90, 28, C.paper);
  text(slide, "Research snapshot  /  November 2026", 58, 649, 520, 24, 16, C.muted);
  slide.speakerNotes.text = `This deck summarizes the Gen Alpha Intelligence Lab and both composite rooms. Full source records live at ${site}. Artwork: Lab public/findings/connection.png.`;
}
{
  const s = base("How to use this deck", "Orientation", `Site sections: ${site}/insights, /influencers, /spaces, /reach-them, /compare, /gender, /humor, /library, /house.`);
  row(s, 205, "Opening section", "A presentation-ready read of the research: the cohort, daily life, culture, participation and the two rooms.");
  row(s, 380, "Evidence appendix", "Every Lab insight, culture profile, space, strategy play, room object and library source appears in the catalog that follows.");
}
{
  const s = base("The working picture", "Executive summary", evidence.insights.slice(0, 4).map(x => `${x.title} ${x.thesis}`).join("\n"));
  row(s, 187, "Connection", "Games, chat, video and real-life friendships form a connected social routine.");
  row(s, 300, "Influence", "Creators, athletes and entertainment properties move across feeds, play and household conversation.", C.coral);
  row(s, 413, "Learning", "School, tutorials, making tools and AI now sit in the same learning stack.", C.lime);
  row(s, 526, "Agency implication", "Participation, utility and adult trust matter more than a one-way message.", C.cyan);
}
{
  const s = base("Who the Lab calls Gen Alpha", "Population", `${demographics.generationBoundaryCopy.opening}\n${demographics.demographicSynthesis.body}\nSources: ${demographics.demographicSources.map(x => x.url).join("\n")}`);
  text(s, "2010–2024", 60, 212, 540, 110, 74, C.lime, true);
  text(s, "Working birth-year definition", 60, 313, 540, 54, 24, C.paper);
  text(s, "59.7M", 60, 433, 540, 84, 65, C.cyan, true);
  text(s, "U.S. residents ages 0–14 (2024)", 60, 519, 540, 48, 22, C.paper);
  text(s, "2.01B", 660, 212, 540, 110, 74, C.coral, true);
  text(s, "Worldwide ages 0–14 (2024)", 660, 313, 540, 54, 24, C.paper);
  text(s, "These are age proxies, not official Gen Alpha counts.", 660, 450, 530, 90, 25, C.muted);
}
{
  const s = base("Geography is context", "Population", `${demographics.demographicSynthesis.body}\n${demographics.youthHistorySource}`);
  text(s, "3.24%", 60, 205, 500, 125, 82, C.lime, true);
  text(s, "North America's share of the world's 0–14 population in 2024", 60, 335, 510, 100, 26, C.paper);
  row(s, 480, "The useful comparison", "Its share was 3.49% in 2010. A 0.25-point shift does not explain a generation's culture.", C.coral, 1130, 23);
}
for (const theme of evidence.themes) {
  const list = evidence.insights.filter(x => x.themeId === theme.id);
  const s = base(theme.title, "Four research lenses", list.slice(0, 4).map(x => `${x.title} ${x.thesis}`).join("\n"));
  text(s, theme.description, 60, 174, 1110, 60, 26, C.muted);
  list.slice(0, 4).forEach((item, i) => row(s, 258 + i * 94, item.title, item.thesis, [C.lime, C.cyan, C.coral, C.paper][i], 1150, 20));
}
{
  const s = base("Where the day happens", "Spaces", `${site}/spaces`);
  await image(s, "/spaces/roblox.jpg", 60, 210, 355, 260, "Roblox experience");
  await image(s, "/spaces/youtube.jpg", 462, 210, 355, 260, "YouTube viewing");
  await image(s, "/spaces/sports.jpg", 864, 210, 355, 260, "Youth sport");
  text(s, "Roblox", 60, 496, 350, 40, 27, C.lime, true);
  text(s, "YouTube", 462, 496, 350, 40, 27, C.cyan, true);
  text(s, "Sports & clubs", 864, 496, 350, 40, 27, C.coral, true);
  text(s, "Play can also be social, learning can be entertainment, and offline routines still matter.", 60, 575, 1140, 64, 24, C.paper);
}
{
  const s = base("Screens have different jobs", "Spaces", `${site}/spaces`);
  await image(s, "/spaces/discord.jpg", 60, 202, 550, 290, "Discord interface context");
  await image(s, "/culture/minecraft-world.png", 670, 202, 550, 290, "Minecraft environment");
  text(s, "Coordination and friendship", 60, 515, 550, 45, 26, C.cyan, true);
  text(s, "Making and mastery", 670, 515, 550, 45, 26, C.lime, true);
  text(s, "A platform name alone cannot explain the activity taking place there.", 60, 593, 1130, 50, 24, C.paper);
}
{
  const s = base("Who shapes the culture", "Influence", `${site}/influencers`);
  await image(s, "/culture/mrbeast.png", 60, 210, 350, 280, "MrBeast");
  await image(s, "/culture/bluey.jpg", 465, 210, 350, 280, "Bluey");
  await image(s, "/culture/olivia-rodrigo.jpg", 870, 210, 350, 280, "Olivia Rodrigo");
  text(s, "Creators", 60, 518, 350, 42, 27, C.lime, true);
  text(s, "IP and franchises", 465, 518, 350, 42, 27, C.cyan, true);
  text(s, "Artists and athletes", 870, 518, 350, 42, 27, C.coral, true);
  text(s, "The catalog covers 87 profiles with audience and influence context.", 60, 595, 1150, 42, 24, C.paper);
}
{
  const s = base("Influence is a route, not a ranking", "Influence", `${site}/influencers`);
  row(s, 195, "Creators", "Format fluency and recurring presence can make a person familiar across feeds and games.");
  row(s, 327, "Franchises", "A property can live in episodes, clips, toys, memes and participatory worlds.", C.coral);
  row(s, 459, "Athletes and artists", "Performance and fandom travel through highlights, edits, songs and social conversation.", C.lime);
}
{
  const s = base("How to reach them", "Brand playbook", strategy.strategyPlays.map(x => `${x.title}\n${x.evidenceRationale}\n${x.sourceIds.join(', ')}`).join("\n"));
  row(s, 197, "Give them a role", "Build or shape something with a meaningful outcome. Participation should change the experience.");
  row(s, 333, "Respect the adult", "Children may want an experience while adults control access, time, spending and safety.", C.coral);
  row(s, 469, "Make the benefit visible", "A useful ritual, skill or physical activity gives an idea value beyond exposure.", C.lime);
}
{
  const s = base("Brand guardrails", "Brand playbook", `${site}/reach-them`);
  row(s, 192, "Clear value", "Let a child understand what they can do, what the limits are and when the experience ends.");
  row(s, 326, "Transparent permissions", "Explain cost, data use, public sharing, supervision and exit paths to adults.", C.coral);
  row(s, 460, "Safety by design", "Avoid pay-to-win, pressure loops, covert collection and unnecessary location or identity data.", C.lime);
}
{
  const s = base("Gender patterns need care", "Gender lens", `${gender.genderMethodology.sample}\n${gender.genderMethodology.proxy}\n${gender.genderMethodology.measurement}\n${gender.genderMethodology.interpretation}\n${site}/gender`);
  row(s, 194, "Measured differences", "Console access and gamer identity over-index among boys in the cited samples. Some media, reading and social patterns differ among girls.");
  row(s, 348, "Counter-patterns", "Both rooms include games, phones, creators, sport, learning and family rules. Overlap matters.", C.coral);
  row(s, 502, "Evidence limit", "Most teen measures are a near-age proxy. A group pattern cannot predict an individual child.", C.lime);
}
{
  const s = base("Humor travels through context", "Humor", `${humor.humorStudy.sample}\n${humor.humorStudy.caveat}\nSource: ${humor.humorStudy.sourceUrl}`);
  text(s, "82%", 60, 207, 420, 115, 83, C.lime, true);
  text(s, "say humor helps them talk about serious things", 60, 330, 460, 100, 26, C.paper);
  text(s, "75%", 670, 207, 420, 115, 83, C.coral, true);
  text(s, "say brands online can feel like older people trying to joke with them", 670, 330, 460, 125, 26, C.paper);
  text(s, "These figures cover daily social-app users ages 13–28, not all Gen Alpha children.", 60, 548, 1140, 64, 22, C.muted);
}
{
  const s = base("Comparing generations", "Compare", `${site}/compare\n${comparisons.comparisonDimensions.map(x => `${x.title}: ${x.method}`).join("\n")}`);
  row(s, 194, "Gen Alpha", "Childhood begins with connected video, creation games and conversational AI as ordinary tools.");
  row(s, 336, "Gen Z", "A smartphone and social-platform transition happened during adolescence for much of the cohort.", C.coral);
  row(s, 478, "Editorial boundary", "The Lab's culture lists are contextual hypotheses. They are not ranked surveys of taste.", C.lime);
}
{
  const s = base("The House", "Interactive research", `${site}/house\nThese are composite rooms, not representative portraits.`);
  text(s, "Two composite rooms turn research patterns into objects people can inspect.", 60, 198, 1140, 125, 39, C.paper, true);
  row(s, 378, "The object is the doorway", "Each hotspot opens a claim, confidence level, source and a route back to the Lab.");
  row(s, 515, "The boundary", "The rooms show patterns and contradictions. Neither room is a rulebook for any child.", C.coral);
}
for (const lens of house.roomLenses) {
  const s = base(lens.title, "The House", `${lens.framing}\n${site}/house\nImage: Lab ${lens.imageSrc}`);
  await image(s, lens.imageSrc, 60, 192, 770, 440, lens.imageAlt);
  text(s, lens.framing, 866, 214, 344, 145, 25, C.paper);
  text(s, `${lens.objects.length} objects`, 866, 464, 340, 50, 32, lens.id === "boys" ? C.cyan : C.coral, true);
  text(s, `${lens.objects.reduce((sum, obj) => sum + obj.insights.length, 0)} linked findings`, 866, 527, 340, 50, 27, C.muted);
}
{
  const episode = seed.seedRecords.find(x => x.id === "owned-podcast-093");
  const s = base("Listen to understand them", "Featured podcast", `${episode.title}\n${episode.summary}\n${episode.url}\n${site}/library`);
  text(s, "Eclectic Polymath", 60, 208, 1120, 58, 31, C.lime, true);
  text(s, episode.title, 60, 283, 1130, 140, 43, C.paper, true);
  text(s, episode.summary, 60, 466, 1120, 105, 26, C.muted);
  text(s, "Open the episode from the Lab library or the Spotify link in the speaker notes.", 60, 602, 1120, 42, 20, C.cyan);
}
{
  const s = base("The evidence library", "Library", `${site}/library`);
  row(s, 191, "58 distinct records", "36 evidence sources plus 22 additional editorial records, including podcasts, videos and a planned interview slot.");
  row(s, 324, "Different evidence types", "Primary research, platform data, policy, industry work and editorial synthesis carry different weight.", C.coral);
  row(s, 457, "Follow the citation", "Every key claim in the Lab links back to a source record and its limitations.", C.lime);
}
{
  const s = base("Evidence appendix", "Reference", `Catalogs begin here. Full interactive records: ${site}`);
  text(s, "40 insights", 60, 232, 540, 70, 51, C.lime, true);
  text(s, "87 culture profiles", 650, 232, 540, 70, 51, C.cyan, true);
  text(s, "54 spaces", 60, 389, 540, 70, 51, C.coral, true);
  text(s, "18 room objects", 650, 389, 540, 70, 51, C.paper, true);
  text(s, "Plus 8 strategy plays, 6 comparison topics and 58 library records.", 60, 553, 1140, 58, 23, C.muted);
}

for (const theme of evidence.themes) {
  const list = evidence.insights.filter(x => x.themeId === theme.id);
  for (const [page, items] of chunk(list, 3).entries()) {
    const sourceUrls = items.flatMap(item => evidence.evidenceItems.filter(x => item.evidenceIds.includes(x.id)).map(x => sourcesModule.sources.find(source => source.id === x.sourceId)?.url)).filter(Boolean);
    const s = base(`${theme.title} ${page + 1}/${Math.ceil(list.length / 3)}`, "Insight catalog", `Insights: ${items.map(x => `${x.title} ${x.interpretation} Nuance: ${x.nuance} ${site}/insights/${x.id}`).join("\n\n")}\nSources: ${[...new Set(sourceUrls)].join("\n")}`);
    items.forEach((item, i) => {
      const y = 191 + i * 151;
      text(s, item.title, 60, y, 1130, 49, 28, [C.lime, C.cyan, C.coral][i], true);
      text(s, item.thesis, 60, y + 54, 1130, 75, 23, C.paper);
    });
  }
}

for (const [page, items] of chunk(culture.cultureShapers, 5).entries()) {
  const s = base(`Culture profiles ${page + 1}/${Math.ceil(culture.cultureShapers.length / 5)}`, "Influence catalog", items.map(x => `${x.name}: ${x.summary}\nAudience: ${x.audience?.center}\nMechanism: ${x.influenceMechanism}\n${site}/influencers/${x.id}`).join("\n\n"));
  items.forEach((item, i) => {
    const y = 187 + i * 92;
    text(s, item.name, 60, y, 350, 38, 26, [C.lime, C.cyan, C.coral, C.paper, C.lime][i], true);
    text(s, `${item.type.toUpperCase()}  /  ${short(item.role || item.summary, 105)}`, 420, y + 2, 780, 37, 21, C.paper);
    text(s, `Audience: ${short(item.audience?.center || item.audienceSegments?.join(", "), 110)}`, 420, y + 40, 780, 32, 17, C.muted);
  });
}

for (const [page, items] of chunk(spacesModule.spaces, 4).entries()) {
  const s = base(`Spaces ${page + 1}/${Math.ceil(spacesModule.spaces.length / 4)}`, "Spaces catalog", items.map(x => `${x.name}: ${x.whatItIs} Why they go: ${x.whyTheyGo} Who is there: ${x.whoIsThere}\nEvidence: ${x.evidenceSummary}\n${site}/spaces`).join("\n\n"));
  items.forEach((item, i) => {
    const y = 183 + i * 119;
    text(s, item.name, 60, y, 390, 42, 27, [C.lime, C.cyan, C.coral, C.paper][i], true);
    text(s, short(item.whatItIs, 145), 455, y + 1, 740, 45, 20, C.paper);
    text(s, `Why: ${short(item.whyTheyGo, 160)}`, 455, y + 51, 740, 55, 18, C.muted);
  });
}

for (const play of strategy.strategyPlays) {
  const s = base(play.title.replace(/\.$/, ""), "Strategy playbook", `${play.evidenceRationale}\nSources: ${play.sourceIds.map(id => sourcesModule.sources.find(x => x.id === id)?.url).filter(Boolean).join("\n")}\n${site}/reach-them`);
  row(s, 184, "When it fits", short(play.whenAppropriate, 210), C.lime, 1150, 22);
  row(s, 314, "Value for the child", short(play.directChildValue, 210), C.cyan, 1150, 22);
  row(s, 444, "Adult context", short(play.adultDecisionContext, 210), C.coral, 1150, 22);
  text(s, `Watch for: ${short(play.failureModes[0], 155)}`, 60, 587, 1150, 44, 19, C.muted);
}

for (const dimension of comparisons.comparisonDimensions) {
  const s = base(dimension.title, "Generation comparison", `${dimension.method}\n${site}/compare`);
  text(s, "GEN ALPHA", 60, 198, 500, 31, 18, C.lime, true);
  text(s, short(dimension.genAlpha.mentality, 370), 60, 242, 540, 160, 28, C.paper);
  text(s, "GEN Z", 666, 198, 500, 31, 18, C.cyan, true);
  const genZ = dimension.comparisons?.genZ;
  text(s, short(genZ.cohort.mentality, 370), 666, 242, 540, 160, 28, C.paper);
  text(s, short(genZ.realDifference, 245), 60, 497, 1125, 95, 22, C.muted);
}

for (const lens of house.roomLenses) {
  for (const obj of lens.objects) {
    const s = base(obj.object, lens.title, `${obj.context}\n${site}/house\n${obj.insights.map(x => `${x.title}: ${x.thesis}\nConfidence: ${x.confidence}; scope: ${x.scope}; source: ${x.sourceUrl}; Lab: ${site}${x.labUrl}`).join("\n\n")}`);
    text(s, obj.title, 60, 175, 1120, 64, 31, lens.id === "boys" ? C.cyan : C.coral, true);
    text(s, short(obj.thesis, 210), 60, 246, 1130, 80, 22, C.paper);
    obj.insights.forEach((finding, i) => {
      const y = 358 + i * 85;
      text(s, finding.title, 60, y, 460, 35, 21, C.lime, true);
      text(s, short(finding.thesis, 150), 535, y, 660, 73, 19, C.paper);
    });
  }
}

for (const [page, items] of chunk(sourcesModule.sources, 4).entries()) {
  const s = base(`Sources ${page + 1}/${Math.ceil(sourcesModule.sources.length / 4)}`, "Library catalog", items.map(x => `${x.title}\n${x.organization} | ${x.publishedAt} | ${x.format}\n${x.summary}\nLimitations: ${x.limitations}\n${x.url}\n${site}/library/${x.id}`).join("\n\n"));
  items.forEach((item, i) => {
    const y = 182 + i * 118;
    text(s, short(item.title, 90), 60, y, 1120, 36, 24, [C.lime, C.cyan, C.coral, C.paper][i], true);
    text(s, `${item.organization}  /  ${item.publishedAt}  /  ${item.format}`, 60, y + 39, 1120, 30, 17, C.muted);
    text(s, short(item.summary, 170), 60, y + 69, 1120, 43, 18, C.paper);
  });
}

const primaryIds = new Set(sourcesModule.sources.map(source => source.id));
const editorialRecords = seed.seedRecords.filter(record => !primaryIds.has(record.id));
for (const [page, items] of chunk(editorialRecords, 4).entries()) {
  const s = base(`Media and editorial records ${page + 1}/${Math.ceil(editorialRecords.length / 4)}`, "Library catalog", items.map(x => `${x.title}\n${x.source} | ${x.kind}\n${x.summary}\nStatus: ${x.status}\n${x.url || "No public source yet"}`).join("\n\n"));
  items.forEach((item, i) => {
    const y = 182 + i * 118;
    text(s, short(item.title, 90), 60, y, 1120, 36, 24, [C.lime, C.cyan, C.coral, C.paper][i], true);
    text(s, `${item.source}  /  ${item.kind}${item.kind === "interview" ? "  /  planned" : ""}`, 60, y + 39, 1120, 30, 17, C.muted);
    text(s, short(item.summary, 170), 60, y + 69, 1120, 43, 18, C.paper);
  });
}

const candidatePath = path.join(buildDir, "candidate.pptx");
await (await PresentationFile.exportPptx(pres)).save(candidatePath);
console.log(`Authored ${number} slides to ${candidatePath}`);
const result = await finalizePresentation({
  workspaceDir: appDir,
  candidatePath,
  finalPath,
  pythonExecutable: path.join(runtime, "python/bin/python"),
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-heading-fit"],
  requiredNativeTableOwnerSlides: [],
  fontPolicy: { basis: "design", families: [FONT] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(buildDir, "validation-v3.json"),
});
console.log(JSON.stringify({ finalPath, slideCount: number, result }, null, 2));
