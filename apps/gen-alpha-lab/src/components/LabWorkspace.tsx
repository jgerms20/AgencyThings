"use client";

import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Headphones,
  Library,
  Newspaper,
  PlaySquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  findings,
  findingTopics,
  getLibrarySections,
  getSupportingRecords,
  type LibrarySection
} from "@/lib/findings";
import type { ResearchRecord } from "@/lib/types";

type LabWorkspaceProps = {
  initialRecords: ResearchRecord[];
};

type LibraryFilter = "all" | LibrarySection["title"];

const libraryIcons: Record<LibrarySection["title"], typeof Newspaper> = {
  Articles: Newspaper,
  Podcasts: Headphones,
  Books: BookOpen,
  YouTube: PlaySquare
};

export default function LabWorkspace({ initialRecords }: LabWorkspaceProps) {
  const [activeLibrary, setActiveLibrary] = useState<LibraryFilter>("all");

  const featuredFindings = useMemo(() => findings.filter((finding) => finding.featured), []);
  const librarySections = useMemo(() => getLibrarySections(initialRecords), [initialRecords]);
  const visibleLibrarySections = useMemo(
    () =>
      activeLibrary === "all"
        ? librarySections
        : librarySections.filter((section) => section.title === activeLibrary),
    [activeLibrary, librarySections]
  );
  const podcast = useMemo(
    () => initialRecords.find((record) => record.id === "owned-podcast-093"),
    [initialRecords]
  );

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Gen Alpha Intelligence Lab home">
          Gen Alpha Intelligence Lab
        </Link>
        <nav aria-label="Primary navigation">
          {findingTopics.map((topic) => (
            <Link href={topic.href as Route} key={topic.id}>
              {topic.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Understanding the first AI-native childhood.</h1>
          <p>
            Direct evidence and editorial findings reveal how Gen Alpha connects, consumes media,
            learns, plays, creates, and navigates a world shaped by AI.
          </p>
          <div className="hero-actions" aria-label="Primary paths">
            <Link className="button" href="/topics/ai">
              Explore the AI lens <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <Link className="button secondary" href="#library">
              Open the library <Library aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
        <div className="featured-grid" aria-label="Featured findings">
          {featuredFindings.map((finding) => {
            const topic = findingTopics.find((item) => item.id === finding.topicId);
            return (
              <article className="featured-finding" key={finding.id}>
                {finding.heroImage ? <img src={finding.heroImage} alt={finding.heroAlt} /> : null}
                <span>{topic?.label}</span>
                <h2>{finding.title}</h2>
                <p>{finding.summary}</p>
                <Link href={`/findings/${finding.id}` as Route} aria-label={`Read ${finding.title} in full`}>
                  Read finding <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="world-map" aria-labelledby="world-map-heading">
        <div className="section-intro">
          <h2 id="world-map-heading">How their world fits together</h2>
          <p>Seven routed lenses. One interconnected operating system for childhood.</p>
        </div>
        <div className="system-layout">
          <div className="system-brief">
            <Sparkles aria-hidden="true" size={28} />
            <h3>Seven lenses, one childhood.</h3>
            <p>
              Connection, media, influence, time, learning, creation, and AI make more sense
              as one system than as separate trend cards.
            </p>
          </div>
          <div className="map-lenses" aria-label="Gen Alpha cultural lenses">
            {findingTopics.map((topic, index) => (
              <Link href={topic.href as Route} key={topic.id}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{topic.label}</strong>
                <span>{topic.description}</span>
                <ChevronRight aria-hidden="true" size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="findings-section" aria-labelledby="findings-heading">
        <div className="section-intro findings-intro">
          <h2 id="findings-heading">Lens routes with evidence behind them.</h2>
          <p>Each top lens now opens a full topic page with visual anatomy, findings, contrast, and sources.</p>
        </div>
        <div className="topic-grid">
          {findingTopics.map((topic) => (
            <article className="topic-card" key={topic.id}>
              <div>
                <span>{topic.label}</span>
                <h3>{topic.thesis}</h3>
              </div>
              <ul>
                {topic.visualAnatomy.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={topic.href as Route}>
                Open topic page <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="finding-stack" aria-labelledby="finding-stack-heading">
        <div className="section-intro">
          <h2 id="finding-stack-heading">Editorial findings remain the proof layer.</h2>
          <p>Finding detail routes keep the photography-led reading experience and expose the supporting records.</p>
        </div>
        <div className="finding-list">
          {findings.map((finding) => {
            const support = getSupportingRecords(finding, initialRecords);
            const topic = findingTopics.find((item) => item.id === finding.topicId);
            return (
              <article className="finding-story" key={finding.id}>
                <div>
                  <span>{topic?.label}</span>
                  <h3>{finding.title}</h3>
                  <p>{finding.summary}</p>
                  <p className="interpretation">{finding.interpretation}</p>
                  <Link className="finding-detail-link" href={`/findings/${finding.id}` as Route}>
                    Open editorial finding <ArrowUpRight aria-hidden="true" size={15} />
                  </Link>
                </div>
                <div className="finding-support">
                  <span>Evidence behind this finding</span>
                  {support.map((record) => (
                    <a href={record.url} target="_blank" rel="noreferrer" key={record.id}>
                      <small>{record.sourceClass}</small>
                      <strong>{record.title}</strong>
                      <ExternalLink aria-hidden="true" size={16} />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {podcast ? (
        <section className="owned-media" aria-labelledby="owned-media-heading">
          <div>
            <Headphones aria-hidden="true" size={24} />
            <p>Featured owned media</p>
            <h2 id="owned-media-heading">{podcast.title}</h2>
            <p>{podcast.summary}</p>
            <ul className="takeaway-list">
              <li>Use it as Joshua's synthesis layer, not as independent proof.</li>
              <li>Pairs AI with gaming instead of treating them as separate trend lanes.</li>
              <li>Frames the strategic question as childhood infrastructure, not novelty tech.</li>
            </ul>
          </div>
          <div className="podcast-action">
            <span>{podcast.synthesisStatus}</span>
            <a className="button light" href={podcast.url} target="_blank" rel="noreferrer">
              Open Spotify <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </section>
      ) : null}

      <section className="library-section" id="library" aria-labelledby="library-heading">
        <div className="section-intro library-intro">
          <div>
            <h2 id="library-heading">Library</h2>
            <p>Direct external sources grouped by format so the lab feels like an editorial research hub.</p>
          </div>
          <div className="library-filters" aria-label="Filter library">
            <button
              type="button"
              aria-pressed={activeLibrary === "all"}
              className={activeLibrary === "all" ? "active" : ""}
              onClick={() => setActiveLibrary("all")}
            >
              All
            </button>
            {librarySections.map((section) => (
              <button
                type="button"
                aria-pressed={activeLibrary === section.title}
                className={activeLibrary === section.title ? "active" : ""}
                onClick={() => setActiveLibrary(section.title)}
                key={section.id}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
        <div className="library-groups">
          {visibleLibrarySections.map((section) => {
            const Icon = libraryIcons[section.title];
            return (
              <section className="library-group" aria-labelledby={`${section.id}-heading`} key={section.id}>
                <div className="library-group-heading">
                  <Icon aria-hidden="true" size={22} />
                  <div>
                    <h3 id={`${section.id}-heading`}>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                </div>
                <div className="library-list">
                  {section.records.map((record) => (
                    <article className="library-row" key={record.id}>
                      <span>{record.source}</span>
                      <div>
                        <h4>{record.title}</h4>
                        <p>{record.summary}</p>
                      </div>
                      {record.url ? (
                        <a aria-label={`Open ${record.title}`} href={record.url} target="_blank" rel="noreferrer">
                          <ExternalLink aria-hidden="true" size={18} />
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
