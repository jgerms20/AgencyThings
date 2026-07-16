"use client";

import { BookOpen, ExternalLink, FileText, Headphones, Newspaper, PlaySquare } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { evidenceItems } from "@/lib/content/evidence";
import { themes } from "@/lib/content/insights";
import { getInsight } from "@/lib/content/selectors";
import { sources } from "@/lib/content/sources";
import { libraryTakeaways } from "@/lib/editorial";
import { filterLibraryByFormat, getLibrarySections, type LibraryFormat, type LibrarySection } from "@/lib/findings";
import type { Source } from "@/lib/content/types";
import type { ResearchRecord } from "@/lib/types";

type LibraryPageProps = { initialRecords: ResearchRecord[] };

const formatTabs: { id: LibraryFormat; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reports", label: "Reports" },
  { id: "articles", label: "Articles" },
  { id: "books", label: "Books" },
  { id: "podcasts", label: "Podcasts" },
  { id: "videos", label: "Videos" }
];

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

function youtubeId(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || undefined;
    if (parsed.hostname.endsWith("youtube.com")) return parsed.searchParams.get("v") ?? undefined;
  } catch {
    return undefined;
  }
  return undefined;
}

export default function LibraryPage({ initialRecords }: LibraryPageProps) {
  const [activeFormat, setActiveFormat] = useState<LibraryFormat>("all");
  const canonicalSources = useMemo(
    () => activeFormat === "all" ? sources : sources.filter((source) => source.format === sourceFormatForLibraryFormat[activeFormat]),
    [activeFormat]
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

      <section className="library-workspace" aria-label="Research library">
        <div className="library-filters" aria-label="Filter library by format">
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
                    const videoId = section.id === "videos" ? youtubeId(record.url) : undefined;
                    return (
                      <article className={`library-row${videoId ? " library-row-video" : ""}`} key={record.id}>
                        <div className="library-source"><span>{record.source}</span><small>{record.sourceClass}</small></div>
                        <div>
                          <h3>{record.title}</h3><p>{record.summary}</p>
                          <div className="library-meta" aria-label={`Topics for ${record.title}`}>{record.tags.slice(0, 3).map((tag) => <span key={tag}>{tag.replaceAll("-", " ")}</span>)}</div>
                          {videoId ? <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`${record.title} video`} /> : null}
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
