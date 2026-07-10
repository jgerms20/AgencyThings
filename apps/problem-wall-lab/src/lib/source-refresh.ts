import { XMLParser } from "fast-xml-parser";
import { seedSignals } from "./seed-data";
import type { SourceRefreshOptions, SourceSignal } from "./types";

const DEFAULT_FEEDS = [
  "https://news.google.com/rss/search?q=%22new+study%22+hydration",
  "https://news.google.com/rss/search?q=%22new+survey%22+small+business+AI",
  "https://news.google.com/rss/search?q=%22new+study%22+streaming+behavior"
];

export async function refreshSourceSignals(options: SourceRefreshOptions = {}): Promise<SourceSignal[]> {
  const fetcher = options.fetcher ?? fetch;
  const liveSignals: SourceSignal[] = [];

  await Promise.all(
    DEFAULT_FEEDS.map(async (url) => {
      try {
        const response = await fetcher(url, {
          headers: {
            "user-agent": "ProblemWallLab/0.1"
          }
        });
        if (!response.ok) return;
        const xml = await response.text();
        liveSignals.push(...parseRssSignals(xml, url, options.now));
      } catch {
        // Demo mode stays useful even when public feeds rate-limit or fail.
      }
    })
  );

  return [...liveSignals, ...fallbackSignals(options.now)].slice(0, 18);
}

function parseRssSignals(xml: string, feedUrl: string, now = new Date().toISOString()): SourceSignal[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: RssItem | RssItem[] } };
  };
  const items = parsed.rss?.channel?.item;
  const itemList = Array.isArray(items) ? items : items ? [items] : [];

  return itemList.slice(0, 4).map((item, index) => {
    const title = stripPublisher(item.title ?? "New signal");
    const audience = inferAudience(title);
    return {
      id: `live-${slugify(title)}-${index}`,
      title,
      source: item.source?.["#text"] ?? "Google News RSS",
      sourceType: title.toLowerCase().includes("study") ? "study" : "news",
      url: item.link,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString().slice(0, 10) : now.slice(0, 10),
      audience,
      behavior: inferBehavior(title),
      tension: "the signal is emerging faster than brands have a clear response",
      stat: title.match(/\d+%|\d+\s?in\s?\d+|double|triple/i)?.[0],
      urgency: "new reporting is pushing this into the current weekly conversation",
      whyItMatters: "fresh signals create a chance to solve the problem before it becomes category wallpaper",
      tags: ["live-source", "news"]
    };
  });
}

function fallbackSignals(now = new Date().toISOString()): SourceSignal[] {
  const today = now.slice(0, 10);
  return seedSignals.map((signal) => ({
    ...signal,
    publishedAt: signal.publishedAt || today,
    tags: Array.from(new Set([...signal.tags, "fallback"]))
  }));
}

function inferAudience(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("student") || lower.includes("college")) return "college students";
  if (lower.includes("worker") || lower.includes("construction")) return "workers";
  if (lower.includes("small business")) return "small business owners";
  if (lower.includes("stream") || lower.includes("tv")) return "streamers";
  if (lower.includes("developer") || lower.includes("ai")) return "AI builders";
  return "people closest to this behavior";
}

function inferBehavior(title: string): string {
  const clean = title.toLowerCase().replace(/new study|new survey|report says|study finds/gi, "").trim();
  return clean.length > 16 ? clean : "are showing a behavior brands have not fully understood";
}

function stripPublisher(title: string): string {
  return title.replace(/\s+-\s+[^-]+$/, "").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  source?: {
    "#text"?: string;
  };
};
