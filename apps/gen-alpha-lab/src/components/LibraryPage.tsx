"use client";

import { BookOpen, ChevronDown, ExternalLink, FileText, Headphones, Newspaper, PlaySquare } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import MediaEmbed from "@/components/MediaEmbed";
import SiteHeader from "@/components/SiteHeader";
import { evidenceItems } from "@/lib/content/evidence";
import { themes } from "@/lib/content/insights";
import { getInsight } from "@/lib/content/selectors";
import { sources } from "@/lib/content/sources";
import { libraryTakeaways } from "@/lib/editorial";
import { validityLadder } from "@/lib/evidence-weight";
import { filterLibraryByFormat, getLibrarySections, type LibraryFormat, type LibrarySection } from "@/lib/findings";
import type { Source } from "@/lib/content/types";
import type { ResearchRecord } from "@/lib/types";

type LibraryPageProps = { initialRecords: ResearchRecord[] };
type MarketFilter = "us" | "uk" | "global" | "all";

const formatTabs: { id: LibraryFormat; label: string }[] = [
  { id: "all", label: "All" },
  { id: "podcasts", label: "Podcasts" },
  { id: "videos", label: "Videos" },
  { id: "articles", label: "Articles" },
  { id: "reports", label: "Reports" },
  { id: "books", label: "Books" }
];

const marketTabs: { id: MarketFilter; label: string }[] = [
  { id: "us", label: "U.S." },
  { id: "uk", label: "U.K." },
  { id: "global", label: "Global / multi-market" },
  { id: "all", label: "All markets" },
];

const sourceMarket = (geography: string): Exclude<MarketFilter, "all"> => {
  const normalized = geography.toLowerCase();
  if (normalized.includes("united states") || normalized.includes("u.s.")) return "us";
  if (normalized.includes("united kingdom") || normalized.includes("u.k.")) return "uk";
  return "global";
};

const sourceMarketLabel = (source: Source) => {
  const market = sourceMarket(source.geography);
  if (market === "us") return "U.S. evidence";
  if (market === "uk") return "U.K. evidence";
  return "Global / multi-market evidence";
};

const libraryIcons: Record<LibrarySection["title"], typeof Newspaper> = {
  Reports: FileText,
  Articles: Newspaper,
  Books: BookOpen,
  Podcasts: Headphones,
  Videos: PlaySquare
};

const sourceFormatForLibraryFormat: Partial<Record<LibraryFormat, Source["format"]>> = {
  reports: "report",
  articles: "article",
  books: "book",
  videos: "video"
};

const browsableSources = sources.filter((source) => source.id !== "common-sense-chatgpt-video");

const sourcePreviews = new Map(sources.map((source) => {
  const sourceEvidence = evidenceItems.filter((item) => item.sourceId === source.id);
  const themeIds = new Set(
    sourceEvidence.flatMap((item) => item.insightIds).flatMap((insightId) => {
      const insight = getInsight(insightId);
      return insight ? [insight.themeId] : [];
    })
  );

  return [source.id, {
    evidenceCount: sourceEvidence.length,
    themeTitles: themes.filter((theme) => themeIds.has(theme.id)).map((theme) => theme.title)
  }] as const;
}));

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function LibraryPage({ initialRecords }: LibraryPageProps) {
  const [activeFormat, setActiveFormat] = useState<LibraryFormat>("all");
  const [activeMarket, setActiveMarket] = useState<MarketFilter>("us");
  const canonicalSources = useMemo(
    () => browsableSources.filter((source) => {
      const matchesFormat = activeFormat === "all" || source.format === sourceFormatForLibraryFormat[activeFormat];
      const matchesMarket = activeMarket === "all" || sourceMarket(source.geography) === activeMarket;
      return matchesFormat && matchesMarket;
    }),
    [activeFormat, activeMarket]
  );
  const sections = useMemo(
    () => getLibrarySections(filterLibraryByFormat(initialRecords.filter((record) => !sources.some((source) => source.id === record.id)), activeFormat)).filter((section) => section.records.length > 0),
    [activeFormat, initialRecords]
  );

  return (
    <main className="library-page">
      <SiteHeader active="library" />
      <section className="page-opening library-opening">
        <h1>Start with the conclusion. Open the source when you need the proof.</h1>
        <div className="library-takeaways">
          {libraryTakeaways.map((takeaway, index) => <p key={takeaway}><span>{String(index + 1).padStart(2, "0")}</span>{takeaway}</p>)}
        </div>
      </section>

      <details className="library-validity" data-testid="evidence-validity-guide">
        <summary>
          <div>
            <p>Source discipline / validity versus opinion</p>
            <h2>Not every source gets the same weight.</h2>
            <span>See how claims earn their language and place in the Lab.</span>
          </div>
          <ChevronDown aria-hidden="true" size={28} />
        </summary>
        <div className="library-validity-body">
          <p>Web opinion may surface a question, but a claim enters the Lab only when its population, method, scope, and limitations can be shown.</p>
          <ol>
            {validityLadder.map((level) => (
              <li key={level.level}><span>{level.level}</span><strong>{level.name}</strong><p>{level.use}</p></li>
            ))}
          </ol>
          <p><strong>Language rule:</strong> “shows” for direct evidence, “suggests” for bounded proxies, “signals” for industry data, and “we interpret” for synthesis.</p>
        </div>
      </details>

      <section className="library-workspace" aria-label="Research sources">
        <div className="library-market-control">
          <div>
            <p className="research-kicker">Market lens</p>
            <h2>Keep U.S. evidence separate from useful global context.</h2>
            <p>U.S. is the working default. Switch markets to compare; do not blend a U.K. finding into a U.S. claim.</p>
          </div>
          <div className="library-filters library-market-filters" aria-label="Filter sources by market">
            {marketTabs.map((market) => (
              <button aria-pressed={activeMarket === market.id} className={activeMarket === market.id ? "active" : ""} key={market.id} onClick={() => setActiveMarket(market.id)} type="button">
                {market.label}
              </button>
            ))}
          </div>
        </div>
        <div className="library-filters" aria-label="Filter sources by format">
          {formatTabs.map((format) => (
            <button aria-pressed={activeFormat === format.id} className={activeFormat === format.id ? "active" : ""} key={format.id} onClick={() => setActiveFormat(format.id)} type="button">
              {format.label}
            </button>
          ))}
        </div>

        <div className="library-groups">
          {canonicalSources.length > 0 ? (
            <section className="library-group" aria-labelledby="canonical-sources-heading">
              <div className="library-group-heading"><FileText aria-hidden="true" size={21} /><div><h2 id="canonical-sources-heading">Source records</h2><p>Directly linked source records with extracted evidence, scope, strength, and related conclusions.</p></div></div>
              <div className="library-list">
                {canonicalSources.map((source) => {
                  const preview = sourcePreviews.get(source.id)!;

                  return (
                    <article className="library-row" key={source.id}>
                      <div className="library-source"><span>{source.organization}</span><small>{source.sourceClass}</small></div>
                      <div>
                        <h3>{source.title}</h3><p>{source.summary}</p>
                        <p><strong>Population</strong> {source.population}; ages {source.ageRange}; {source.geography}.</p>
                        <p><strong>Methodology</strong> {source.methodology}</p>
                        <div className="library-meta">
                          <strong>{sourceMarketLabel(source)}</strong>
                          <strong>{source.format}</strong>
                          <span>{preview.evidenceCount} extracted evidence {preview.evidenceCount === 1 ? "item" : "items"}</span>
                          <span>Themes: {preview.themeTitles.length > 0 ? preview.themeTitles.join(", ") : "None connected yet"}</span>
                          <span>Strength: {titleCase(source.confidence)}</span>
                        </div>
                      </div>
                      <Link aria-label={`Open source detail for ${source.title}`} href={`/library/${source.id}` as Route}><ExternalLink aria-hidden="true" size={17} /></Link>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
          {sections.map((section) => {
            const Icon = libraryIcons[section.title];
            return (
              <section className="library-group" aria-labelledby={`${section.id}-heading`} key={section.id}>
                <div className="library-group-heading"><Icon aria-hidden="true" size={21} /><div><h2 id={`${section.id}-heading`}>{section.title}</h2><p>{section.description}</p></div></div>
                <div className="library-list">
                  {section.records.map((record) => {
                    const isPlayable = section.id === "podcasts" || section.id === "videos";
                    const isFeatured = record.id === "owned-podcast-093";
                    return (
                      <article
                        className={`library-row${isPlayable ? " library-row-media" : ""}${isFeatured ? " library-row-featured" : ""}`}
                        key={record.id}
                      >
                        <div className="library-source"><span>{record.source}</span><small>{record.sourceClass}</small></div>
                        <div>
                          {isFeatured && record.synthesisStatus ? <p className="library-featured-label">{record.synthesisStatus}</p> : null}
                          <h3>{record.title}</h3><p>{record.summary}</p>
                          <div className="library-meta" aria-label={`Topics for ${record.title}`}>{record.tags.slice(0, 3).map((tag) => <span key={tag}>{tag.replaceAll("-", " ")}</span>)}</div>
                          {isPlayable ? <MediaEmbed title={record.title} url={record.url} /> : null}
                        </div>
                        {record.url ? <a aria-label={`Open ${record.title}`} href={record.url} target="_blank" rel="noreferrer"><ExternalLink aria-hidden="true" size={17} /></a> : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
