import { XMLParser } from "fast-xml-parser";
import type { RefreshResult, SourceClass, SourceRefreshOptions, SourceSignal } from "./types";

const TOPICS = ["work", "learning", "health", "technology", "family", "media", "money", "accessibility", "climate"];
const PROBLEM_PATTERN = /barrier|broken|burden|challenge|conflict|cost|crisis|declin|disparit|fatigue|friction|gap|inequal|lack|loss|lose|miss|overload|risk|shortage|stress|struggl|unmet|waste/i;
const NON_ENGLISH_TITLE_PATTERN = /\b(?:dan|dengan|pada|pegawai|pengaruh|perempuan|terhadap|untuk)\b/i;

type SourceDefinition = { name: string; kind: "rss" | "openalex" | "crossref" | "reddit"; url: string };

function sourceDefinitions(brandLens = ""): SourceDefinition[] {
  const lens = brandLens.trim();
  const topics = lens ? [lens, ...TOPICS.slice(0, 5)] : TOPICS;
  return [
  ...topics.map((topic) => ({
    name: `Google News: ${topic}`,
    kind: "rss" as const,
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(`${lens ? `${lens} ` : ""}${topic} problem frustration`)}`
  })),
  {
    name: "OpenAlex",
    kind: "openalex",
    url: "https://api.openalex.org/works?search=work+learning+health+technology+family&filter=from_publication_date:2026-06-22&per-page=12"
  },
  {
    name: "Crossref",
    kind: "crossref",
    url: "https://api.crossref.org/works?query=work+family+technology+problems&filter=from-pub-date:2026-06-22&rows=12"
  },
  {
    name: "Reddit: AskReddit",
    kind: "reddit",
    url: "https://www.reddit.com/r/AskReddit/search.json?q=frustrating&restrict_sr=1&sort=new&limit=12"
  },
  {
    name: "Reddit: Parenting",
    kind: "reddit",
    url: "https://www.reddit.com/r/Parenting/new.json?limit=12"
  }
  ];
}

export async function refreshSourceSignals(options: SourceRefreshOptions = {}): Promise<RefreshResult> {
  const fetcher = options.fetcher ?? fetch;
  const now = new Date(options.now ?? Date.now());
  const failures: RefreshResult["failures"] = [];
  let sourcesSucceeded = 0;
  const sources = sourceDefinitions(options.brandLens);

  const batches = await Promise.all(sources.map(async (definition) => {
    try {
      const response = await fetcher(definition.url, {
        headers: { "user-agent": "ProblemWallLab/2.0 (+https://agencythings-problem-wall.vercel.app)" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const signals = await parseSource(definition, response, now);
      sourcesSucceeded += 1;
      return signals;
    } catch (error) {
      failures.push({ source: definition.name, message: error instanceof Error ? error.message : "Unknown source failure" });
      return [];
    }
  }));

  const maxAgeMs = (options.maxAgeDays ?? 21) * 86_400_000;
  const fresh = batches.flat().filter((signal) => {
    const published = Date.parse(signal.publishedAt);
    return /^https?:\/\//.test(signal.url) && Number.isFinite(published) && now.getTime() - published <= maxAgeMs && published <= now.getTime() + 86_400_000;
  });

  return {
    signals: dedupeSignals(fresh),
    sourcesAttempted: sources.length,
    sourcesSucceeded,
    failures,
    refreshedAt: now.toISOString()
  };
}

async function parseSource(definition: SourceDefinition, response: Response, now: Date): Promise<SourceSignal[]> {
  if (definition.kind === "rss") return parseRss(await response.text(), definition.name, now);
  const json = await response.json();
  if (definition.kind === "openalex") return parseOpenAlex(json, now);
  if (definition.kind === "crossref") return parseCrossref(json, now);
  return parseReddit(json, now);
}

function parseRss(xml: string, sourceName: string, now: Date): SourceSignal[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as { rss?: { channel?: { item?: RssItem | RssItem[] } } };
  const raw = parsed.rss?.channel?.item;
  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return items.flatMap((item, index) => {
    const title = stripPublisher(item.title ?? "");
    const url = canonicalUrl(extractDirectUrl(item.description) || item.link || "");
    if (!title || !url || !PROBLEM_PATTERN.test(title) || NON_ENGLISH_TITLE_PATTERN.test(title)) return [];
    return [makeSignal({
      id: `news-${slug(title)}-${index}`,
      title,
      source: item.source?.["#text"] ?? sourceName,
      sourceClass: "news",
      sourceType: /study|research|survey/i.test(title) ? "report" : "news",
      url,
      publishedAt: safeDate(item.pubDate, now),
      text: item.description ?? title
    })];
  });
}

function parseOpenAlex(json: unknown, now: Date): SourceSignal[] {
  const results = (json as { results?: OpenAlexWork[] }).results ?? [];
  return results.flatMap((work, index) => {
    const title = work.title?.trim();
    const url = canonicalUrl(work.doi || work.id || "");
    if (!title || !url || !PROBLEM_PATTERN.test(title) || NON_ENGLISH_TITLE_PATTERN.test(title)) return [];
    return [makeSignal({ id: `openalex-${slug(title)}-${index}`, title, source: work.primary_location?.source?.display_name ?? "OpenAlex", sourceClass: "research", sourceType: "study", url, publishedAt: safeDate(work.publication_date, now), text: title })];
  });
}

function parseCrossref(json: unknown, now: Date): SourceSignal[] {
  const items = (json as { message?: { items?: CrossrefWork[] } }).message?.items ?? [];
  return items.flatMap((work, index) => {
    const title = work.title?.[0]?.trim();
    const url = canonicalUrl(work.DOI ? `https://doi.org/${work.DOI}` : work.URL ?? "");
    if (!title || !url || !PROBLEM_PATTERN.test(title) || NON_ENGLISH_TITLE_PATTERN.test(title)) return [];
    const parts = work.published?.["date-parts"]?.[0] ?? [];
    const publishedAt = parts.length ? `${parts[0]}-${String(parts[1] ?? 1).padStart(2, "0")}-${String(parts[2] ?? 1).padStart(2, "0")}` : now.toISOString().slice(0, 10);
    return [makeSignal({ id: `crossref-${slug(title)}-${index}`, title, source: work.publisher ?? "Crossref", sourceClass: "research", sourceType: "study", url, publishedAt, text: title })];
  });
}

function parseReddit(json: unknown, now: Date): SourceSignal[] {
  const children = (json as { data?: { children?: Array<{ data?: RedditPost }> } }).data?.children ?? [];
  return children.flatMap(({ data }, index) => {
    if (!data?.title || !data.permalink) return [];
    const url = canonicalUrl(`https://www.reddit.com${data.permalink}`);
    return [makeSignal({ id: `reddit-${data.id ?? slug(data.title)}-${index}`, title: data.title, source: data.subreddit_name_prefixed ?? "Reddit", sourceClass: "community", sourceType: "reddit", url, publishedAt: data.created_utc ? new Date(data.created_utc * 1000).toISOString().slice(0, 10) : now.toISOString().slice(0, 10), text: data.selftext || data.title })];
  });
}

function makeSignal(input: { id: string; title: string; source: string; sourceClass: SourceClass; sourceType: SourceSignal["sourceType"]; url: string; publishedAt: string; text: string }): SourceSignal {
  const audience = inferAudience(`${input.title} ${input.text}`);
  const tags = [input.sourceClass, ...inferTags(input.title)];
  return {
    ...input,
    audience,
    behavior: inferBehavior(input.title),
    tension: "the friction is growing faster than the systems around it are adapting",
    stat: input.title.match(/\$?[\d,.]+%?|\d+\s?(?:hours?|days?|weeks?)/i)?.[0],
    urgency: "published within the current discovery window",
    whyItMatters: inferWhyItMatters(input.title, audience),
    tags
  };
}

function dedupeSignals(signals: SourceSignal[]): SourceSignal[] {
  const seen = new Set<string>();
  const themeCounts = new Map<string, number>();
  return signals.filter((signal) => {
    const key = `${canonicalUrl(signal.url)}|${slug(signal.title)}`;
    if (seen.has(key)) return false;
    const theme = `${signal.sourceClass}|${signal.audience}|${signal.title.toLowerCase().match(PROBLEM_PATTERN)?.[0] ?? "other"}`;
    const themeCount = themeCounts.get(theme) ?? 0;
    if (themeCount >= 2) return false;
    seen.add(key);
    themeCounts.set(theme, themeCount + 1);
    return true;
  });
}

function extractDirectUrl(description?: string): string {
  const matches = [...(description ?? "").matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map((match) => match[1]);
  return matches.find((url) => !url.includes("news.google.com")) ?? "";
}

function canonicalUrl(value: string): string {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) if (/^utm_|^(?:gclid|fbclid)$/i.test(key)) url.searchParams.delete(key);
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch { return ""; }
}

function safeDate(value: string | undefined, fallback: Date): string {
  const parsed = value ? new Date(value) : fallback;
  return Number.isNaN(parsed.getTime()) ? fallback.toISOString().slice(0, 10) : parsed.toISOString().slice(0, 10);
}

function inferAudience(text: string): string {
  const lower = text.toLowerCase();
  if (/parent|family|child/.test(lower)) return "working families";
  if (/teacher|student|school|learning/.test(lower)) return "teachers and students";
  if (/worker|employee|workplace/.test(lower)) return "workers";
  if (/small business|entrepreneur/.test(lower)) return "small business owners";
  if (/disabled|accessib|adhd|autis/.test(lower)) return "disabled and neurodivergent people";
  return "people closest to the issue";
}

function inferBehavior(title: string): string {
  const clean = title.replace(/\s+/g, " ").replace(/[.?!]$/, "").trim();
  return clean ? `are reporting that ${clean.charAt(0).toLowerCase()}${clean.slice(1)}` : "are navigating a newly documented friction";
}

function inferTags(title: string): string[] {
  const lower = title.toLowerCase();
  return TOPICS.filter((topic) => lower.includes(topic)).slice(0, 3);
}

function inferWhyItMatters(title: string, audience: string): string {
  const lower = `${title} ${audience}`.toLowerCase();
  if (/parent|family|childcare/.test(lower)) return "the burden spills into care, work schedules, and household time";
  if (/teacher|student|school|learning|education/.test(lower)) return "the friction can narrow access to learning and consume time meant for teaching";
  if (/health|patient|care|safety/.test(lower)) return "the downstream cost can become health, safety, or delayed care";
  if (/money|cost|debt|subscription|financial/.test(lower)) return "small recurring losses compound into meaningful financial pressure";
  if (/worker|employee|workplace/.test(lower)) return "the burden drains time, trust, and the ability to do good work";
  return "the friction compounds across time, access, trust, or money";
}

function stripPublisher(title: string): string { return title.replace(/\s+-\s+[^-]+$/, "").trim(); }
function slug(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54); }

type RssItem = { title?: string; link?: string; pubDate?: string; description?: string; source?: { "#text"?: string } };
type OpenAlexWork = { id?: string; title?: string; publication_date?: string; doi?: string; primary_location?: { source?: { display_name?: string } } };
type CrossrefWork = { DOI?: string; URL?: string; title?: string[]; publisher?: string; published?: { "date-parts"?: number[][] } };
type RedditPost = { id?: string; title?: string; permalink?: string; created_utc?: number; subreddit_name_prefixed?: string; selftext?: string };
