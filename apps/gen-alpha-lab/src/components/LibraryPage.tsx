"use client";

import {
  BookOpen,
  ExternalLink,
  Headphones,
  Newspaper,
  PlaySquare
} from "lucide-react";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { libraryTakeaways } from "@/lib/editorial";
import {
  filterLibraryRecords,
  getLibrarySections,
  type LibrarySection,
  type LibraryUseFilter
} from "@/lib/findings";
import type { ResearchRecord } from "@/lib/types";

type LibraryPageProps = {
  initialRecords: ResearchRecord[];
};

const libraryIcons: Record<LibrarySection["title"], typeof Newspaper> = {
  Articles: Newspaper,
  Podcasts: Headphones,
  Books: BookOpen,
  YouTube: PlaySquare
};

export default function LibraryPage({ initialRecords }: LibraryPageProps) {
  const [activeFilter, setActiveFilter] = useState<LibraryUseFilter>("all");
  const sections = useMemo(
    () =>
      getLibrarySections(filterLibraryRecords(initialRecords, activeFilter)).filter(
        (section) => section.records.length > 0
      ),
    [activeFilter, initialRecords]
  );

  return (
    <main className="library-page">
      <SiteHeader active="library" />

      <section className="page-opening library-opening">
        <h1>Start with the conclusion. Open the source when you need the proof.</h1>
        <div className="library-takeaways">
          {libraryTakeaways.map((takeaway, index) => (
            <p key={takeaway}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {takeaway}
            </p>
          ))}
        </div>
      </section>

      <section className="library-workspace" aria-label="Research library">
        <div className="library-filters" aria-label="Filter library">
          {(["all", "make", "think", "learn"] as const).map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={activeFilter === filter ? "active" : ""}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter === "all" ? "All resources" : filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="library-groups">
          {sections.map((section) => {
            const Icon = libraryIcons[section.title];
            return (
              <section className="library-group" aria-labelledby={`${section.id}-heading`} key={section.id}>
                <div className="library-group-heading">
                  <Icon aria-hidden="true" size={21} />
                  <div>
                    <h2 id={`${section.id}-heading`}>{section.title}</h2>
                    <p>{section.description}</p>
                  </div>
                </div>
                <div className="library-list">
                  {section.records.map((record) => (
                    <article className="library-row" key={record.id}>
                      <div className="library-source">
                        <span>{record.source}</span>
                        <small>{record.sourceClass}</small>
                      </div>
                      <div>
                        <h3>{record.title}</h3>
                        <p>{record.summary}</p>
                        <div className="library-meta" aria-label={`Topics and uses for ${record.title}`}>
                          {record.tags.slice(0, 3).map((tag) => (
                            <span key={tag}>{tag.replaceAll("-", " ")}</span>
                          ))}
                          {record.useModes?.map((mode) => <strong key={mode}>{mode}</strong>)}
                        </div>
                      </div>
                      {record.url ? (
                        <a aria-label={`Open ${record.title}`} href={record.url} target="_blank" rel="noreferrer">
                          <ExternalLink aria-hidden="true" size={17} />
                        </a>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
