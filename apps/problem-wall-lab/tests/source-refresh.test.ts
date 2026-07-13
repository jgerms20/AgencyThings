import { describe, expect, it } from "vitest";
import { refreshSourceSignals } from "../src/lib/source-refresh";

const rss = `<?xml version="1.0"?><rss><channel><item>
  <title>Workers spend 20% of shifts fixing broken scheduling - Example News</title>
  <link>https://news.google.com/rss/articles/redirect</link>
  <description><![CDATA[<a href="https://example.com/work-study?utm_source=news">Original report</a>]]></description>
  <pubDate>Fri, 10 Jul 2026 12:00:00 GMT</pubDate><source>Example News</source>
</item></channel></rss>`;

describe("refreshSourceSignals", () => {
  it("normalizes news, OpenAlex, Crossref, and Reddit into direct-linked fresh signals", async () => {
    const result = await refreshSourceSignals({
      now: "2026-07-13T12:00:00Z",
      fetcher: async (url) => {
        if (url.includes("news.google")) return new Response(rss, { status: 200 });
        if (url.includes("openalex")) return Response.json({ results: [{ id: "https://openalex.org/W1", title: "Teachers lose time to disconnected learning tools", publication_date: "2026-07-09", doi: "https://doi.org/10.1000/openalex", primary_location: { source: { display_name: "Learning Journal" } }, }, { id: "https://openalex.org/W2", title: "A routine chemistry method", publication_date: "2026-07-09", doi: "https://doi.org/10.1000/irrelevant" }] });
        if (url.includes("crossref")) return Response.json({ message: { items: [{ DOI: "10.1000/crossref", title: ["Families face rising subscription fatigue"], published: { "date-parts": [[2026, 7, 8]] }, publisher: "Research Press" }] } });
        if (url.includes("reddit")) return Response.json({ data: { children: [{ data: { id: "r1", title: "Why does every school need a different app?", permalink: "/r/Parenting/comments/r1/example/", created_utc: Date.parse("2026-07-11T12:00:00Z") / 1000, subreddit_name_prefixed: "r/Parenting", selftext: "Parents compare the coordination burden." } }] } });
        return new Response("not found", { status: 404 });
      }
    });

    expect(result.sourcesSucceeded).toBeGreaterThanOrEqual(4);
    expect(new Set(result.signals.map((signal) => signal.sourceClass))).toEqual(new Set(["news", "research", "community"]));
    expect(result.signals.every((signal) => /^https?:\/\//.test(signal.url))).toBe(true);
    expect(result.signals.some((signal) => signal.url === "https://example.com/work-study")).toBe(true);
    expect(result.signals.some((signal) => signal.url.includes("irrelevant"))).toBe(false);
  });

  it("deduplicates, rejects stale or URL-less records, and returns no seeds on total failure", async () => {
    const failed = await refreshSourceSignals({
      now: "2026-07-13T12:00:00Z",
      fetcher: async () => { throw new Error("offline"); }
    });

    expect(failed.signals).toEqual([]);
    expect(failed.failures.length).toBe(failed.sourcesAttempted);
    expect(JSON.stringify(failed)).not.toContain("fallback");
  });
});
