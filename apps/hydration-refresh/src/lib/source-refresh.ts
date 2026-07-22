import { XMLParser } from "fast-xml-parser";
import { connectorSeeds, seedStories } from "./seed-data";
import type { ConnectorStatus, RefreshRun, SourceKind, Story } from "./types";

export interface SourceConnector {
  id: string;
  label: string;
  sourceKind: SourceKind;
  fetch: () => Promise<Story[]>;
}

export function canonicalUrl(value: string): string {
  try {
    const url = new URL(value);
    [...url.searchParams.keys()].forEach((key) => { if (/^utm_|^(gclid|fbclid)$/i.test(key)) url.searchParams.delete(key); });
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch { return value; }
}

export function dedupeStories<T extends { sourceUrl: string; headline: string }>(stories: T[]): T[] {
  const seenUrls = new Set<string>();
  const seenHeadlines = new Set<string>();
  return stories.filter((story) => {
    const urlKey = canonicalUrl(story.sourceUrl);
    const headlineKey = normalizeHeadline(story.headline);
    if (seenUrls.has(urlKey) || seenHeadlines.has(headlineKey)) return false;
    seenUrls.add(urlKey);
    seenHeadlines.add(headlineKey);
    return true;
  });
}

export async function refreshSources(options: { connectors?: SourceConnector[] } = {}): Promise<{ stories: Story[]; run: RefreshRun }> {
  const startedAt = new Date().toISOString();
  const connectors = options.connectors ?? defaultConnectors();
  const results = await Promise.all(connectors.map(async (connector) => {
    try {
      const stories = await connector.fetch();
      return { stories, status: { id: connector.id, label: connector.label, status: "updated", message: `${stories.length} fresh items`, refreshedAt: new Date().toISOString() } satisfies ConnectorStatus };
    } catch (error) {
      return { stories: [], status: { id: connector.id, label: connector.label, status: "stale", message: error instanceof Error ? error.message : "Refresh failed" } satisfies ConnectorStatus };
    }
  }));
  const credentialStatuses = connectorSeeds.filter(({ status }) => status === "needs-credentials");
  const stories = dedupeStories(results.flatMap(({ stories }) => stories));
  return { stories, run: { id: `refresh-${Date.now()}`, startedAt, completedAt: new Date().toISOString(), statuses: [...results.map(({ status }) => status), ...credentialStatuses], addedCount: stories.length } };
}

function defaultConnectors(): SourceConnector[] {
  return [
    { id: "news", label: "News", sourceKind: "publication", fetch: () => fetchRss("https://news.google.com/rss/search?q=culture+sport+wellness+creators+technology", "publication") },
    { id: "podcasts", label: "Podcasts", sourceKind: "podcast", fetch: () => fetchPodcastSearch() },
    { id: "studies", label: "Studies", sourceKind: "study", fetch: () => fetchCrossref() },
    { id: "events", label: "Events", sourceKind: "event", fetch: () => fetchRss("https://news.google.com/rss/search?q=festival+sport+culture+event", "event") }
  ];
}

async function fetchRss(url: string, sourceKind: SourceKind): Promise<Story[]> {
  const response = await fetch(url, { cache: "no-store", headers: { "user-agent": "HydrationRefresh/1.0" }, signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(await response.text()) as { rss?: { channel?: { item?: RssItem[] | RssItem } } };
  const raw = parsed.rss?.channel?.item;
  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return items.slice(0, 8).map((item, index) => normalizeLiveStory(item.title ?? "Untitled signal", item.link ?? url, item.source?.["#text"] ?? "Google News", sourceKind, item.pubDate, index));
}

async function fetchPodcastSearch(): Promise<Story[]> {
  const response = await fetch("https://itunes.apple.com/search?term=sport+wellness+culture&media=podcast&entity=podcastEpisode&limit=8", { cache: "no-store", signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json() as { results?: Array<{ trackName?: string; trackViewUrl?: string; collectionName?: string; releaseDate?: string }> };
  return (data.results ?? []).flatMap((item, index) => item.trackName && item.trackViewUrl ? [normalizeLiveStory(item.trackName, item.trackViewUrl, item.collectionName ?? "Apple Podcasts", "podcast", item.releaseDate, index)] : []);
}

async function fetchCrossref(): Promise<Story[]> {
  const response = await fetch("https://api.crossref.org/works?query=hydration+sport+culture+wellness&rows=8&select=DOI,title,published,publisher,URL", { cache: "no-store", signal: AbortSignal.timeout(7000), headers: { "user-agent": "HydrationRefresh/1.0 (mailto:research@example.com)" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json() as { message?: { items?: Array<{ title?: string[]; URL?: string; publisher?: string; published?: { "date-parts"?: number[][] } }> } };
  return (data.message?.items ?? []).flatMap((item, index) => item.title?.[0] && item.URL ? [normalizeLiveStory(item.title[0], item.URL, item.publisher ?? "Crossref", "study", dateParts(item.published?.["date-parts"]?.[0]), index)] : []);
}

export function normalizeLiveStory(headline: string, sourceUrl: string, sourceName: string, sourceKind: SourceKind, publishedAt: string | undefined, _index?: number): Story {
  const clean = headline.replace(/\s+-\s+[^-]+$/, "").trim();
  const stableUrl = canonicalUrl(sourceUrl);
  return { id: `live-${sourceKind}-${slug(clean)}-${hashString(stableUrl)}`, headline: clean, dek: "A fresh signal gathered from the live source refresh.", sourceName, sourceUrl: stableUrl, sourceKind, publishedAt: safeDate(publishedAt), observedAt: new Date().toISOString(), domain: inferDomain(clean), tags: [sourceKind, inferDomain(clean)], whatHappened: `${clean} was published as a fresh signal in the current monitoring window.`, whyItMatters: "It may reveal a shift in how people participate, perform, gather, recover, or express identity. Save it if the pattern deserves deeper editorial judgment." };
}

function inferDomain(value: string): Story["domain"] { const lower = value.toLowerCase(); if (/sport|athlete|game|fan/.test(lower)) return "sport"; if (/health|wellness|sleep|hydration|recovery/.test(lower)) return "wellness"; if (/tech|ai|digital|game/.test(lower)) return "technology"; if (/music|film|festival|creator/.test(lower)) return "entertainment"; return "culture"; }
function safeDate(value?: string): string { const date = value ? new Date(value) : new Date(); return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(); }
function dateParts(parts?: number[]): string | undefined { return parts?.length ? `${parts[0]}-${String(parts[1] ?? 1).padStart(2, "0")}-${String(parts[2] ?? 1).padStart(2, "0")}` : undefined; }
function slug(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
function normalizeHeadline(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function hashString(value: string): string { let hash = 2166136261; for (let index = 0; index < value.length; index += 1) { hash ^= value.charCodeAt(index); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(36); }
type RssItem = { title?: string; link?: string; pubDate?: string; source?: { "#text"?: string } };
