"use client";

import { ExternalLink, PlaySquare, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  spaceAgeBands,
  spaceCategories,
  spaceEnvironments,
  type SpaceProfile,
} from "@/lib/spaces";

type SpaceFiltersProps = { spaces: SpaceProfile[] };

const selectStyle = { minWidth: 0, width: "100%", maxWidth: "100%" } as const;

export default function SpaceFilters({ spaces }: SpaceFiltersProps) {
  const [category, setCategory] = useState("all");
  const [environment, setEnvironment] = useState("all");
  const [age, setAge] = useState("all");
  const [activeFormatReferenceSpaceId, setActiveFormatReferenceSpaceId] = useState<string | null>(null);

  const filtered = useMemo(
    () => spaces.filter((space) =>
      (category === "all" || space.category === category)
      && (environment === "all" || space.environment === environment)
      && (age === "all" || space.ageBands.includes(age as (typeof spaceAgeBands)[number]))),
    [age, category, environment, spaces],
  );

  const clear = () => {
    setCategory("all");
    setEnvironment("all");
    setAge("all");
  };

  return (
    <section
      aria-label="Space directory"
      className="space-directory"
      style={{ maxWidth: "100%", minWidth: 0, overflow: "clip" }}
    >
      <div
        className="space-filter-controls"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",
          gap: "1rem",
          maxWidth: "100%",
          minWidth: 0,
          padding: "1rem",
        }}
      >
        <label>
          Category
          <select aria-label="Category" style={selectStyle} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {spaceCategories.map((option) => <option value={option} key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Environment
          <select aria-label="Environment" style={selectStyle} value={environment} onChange={(event) => setEnvironment(event.target.value)}>
            <option value="all">All environments</option>
            {spaceEnvironments.map((option) => <option value={option} key={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}
          </select>
        </label>
        <label>
          Audience age
          <select aria-label="Audience age" style={selectStyle} value={age} onChange={(event) => setAge(event.target.value)}>
            <option value="all">All ages</option>
            {spaceAgeBands.map((option) => <option value={option} key={option}>Ages {option}</option>)}
          </select>
        </label>
        <div style={{ alignSelf: "end", minWidth: 0 }}>
          <p aria-live="polite" role="status">{filtered.length} {filtered.length === 1 ? "space" : "spaces"} shown</p>
          <button type="button" onClick={clear} aria-label="Clear all space filters">
            <RotateCcw aria-hidden="true" size={16} /> Clear all
          </button>
        </div>
      </div>

      {filtered.length === 0 ? <p role="note" style={{ padding: "2rem" }}>No spaces match these filters.</p> : null}
      {filtered.map((space) => {
        const index = spaces.findIndex((candidate) => candidate.id === space.id);
        const formatReferenceIsActive = activeFormatReferenceSpaceId === space.id;
        return (
          <article
            aria-labelledby={`${space.id}-heading`}
            className={`space-profile space-profile-${space.tone}`}
            data-testid="space-profile"
            id={space.id}
            key={space.id}
            style={{ scrollMarginTop: "6rem", maxWidth: "100%", minWidth: 0 }}
            tabIndex={-1}
          >
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`${space.id}-heading`}>{space.name}</h2>
                <p>{space.category} / {space.environment}</p>
              </div>
              <strong>{space.ageContext} {space.evidenceStatus === "evidence-backed" ? "Evidence-backed" : "Editorial watchlist"}</strong>
            </header>
            <div className="space-explainer">
              <div><span>What it is</span><p>{space.whatItIs}</p></div>
              <div><span>Why they go</span><p>{space.whyTheyGo}</p></div>
              <div><span>What happens there</span><p>{space.whatHappens}</p></div>
            </div>
            <div className="space-explainer">
              <div><span>Who is there</span><p>{space.whoIsThere}</p></div>
              <div><span>{space.evidenceStatus === "evidence-backed" ? "What the evidence says" : "Evidence status"}</span><p>{space.evidenceSummary}</p></div>
              <div><span>Safety and age caveat</span><p>{space.safetyCaveat}</p></div>
            </div>
            <footer>
              <p><span>Why it matters for strategy</span><br />{space.strategyRelevance}</p>
              <div>
                {space.sources.map((source) => (
                  <a href={source.url} key={source.id} target="_blank" rel="noreferrer">
                    {source.label} <ExternalLink aria-hidden="true" size={14} />
                  </a>
                ))}
                {space.evidenceStatus === "watchlist" ? <span>Watchlist: no qualifying source attached</span> : null}
              </div>
            </footer>
            {space.relatedFormatReference ? (
              <section className="space-related-format-reference" aria-label={`${space.name} related format reference`}>
                <button
                  aria-controls={`${space.id}-related-format-reference`}
                  aria-expanded={formatReferenceIsActive}
                  className="space-related-format-reference-trigger"
                  id={`${space.id}-related-format-reference-trigger`}
                  onClick={() => setActiveFormatReferenceSpaceId(formatReferenceIsActive ? null : space.id)}
                  type="button"
                >
                  <PlaySquare aria-hidden="true" size={16} /> {formatReferenceIsActive ? "Hide" : "Show"} related format reference for {space.name}
                </button>
                <div
                  aria-labelledby={`${space.id}-related-format-reference-trigger`}
                  className="space-related-format-reference-panel"
                  hidden={!formatReferenceIsActive}
                  id={`${space.id}-related-format-reference`}
                  role="region"
                >
                  {formatReferenceIsActive ? (
                    <>
                      <div className="space-related-format-reference-copy">
                        <p><span>Related format reference</span><br />{space.relatedFormatReference.title}</p>
                        <p>{space.relatedFormatReference.description}</p>
                        <p><strong>Not evidence of usage</strong><br />{space.relatedFormatReference.nonEvidenceCaveat}</p>
                        <p><span>Provenance</span><br />{space.relatedFormatReference.provenance}</p>
                        <a
                          aria-label={`Watch ${space.name} related format reference on YouTube`}
                          href={`https://www.youtube.com/watch?v=${space.relatedFormatReference.youtubeId}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Watch on YouTube <ExternalLink aria-hidden="true" size={14} />
                        </a>
                      </div>
                      <iframe
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="space-related-format-reference-embed"
                        loading="lazy"
                        src={`https://www.youtube-nocookie.com/embed/${space.relatedFormatReference.youtubeId}`}
                        title={`${space.name} related format reference`}
                      />
                    </>
                  ) : null}
                </div>
              </section>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
