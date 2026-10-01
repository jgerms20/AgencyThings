"use client";

import { ExternalLink, PlaySquare, RotateCcw, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  spaceAgeBands,
  spaceCategories,
  spaceEnvironments,
  type SpaceProfile,
} from "@/lib/spaces";

type SpaceFiltersProps = { spaces: SpaceProfile[] };

function RelatedFormatReference({
  activeFormatReferenceSpaceId,
  setActiveFormatReferenceSpaceId,
  space,
}: {
  activeFormatReferenceSpaceId: string | null;
  setActiveFormatReferenceSpaceId: (id: string | null) => void;
  space: SpaceProfile;
}) {
  if (!space.relatedFormatReference) return null;

  const formatReferenceIsActive = activeFormatReferenceSpaceId === space.id;

  return (
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
  );
}

function SpaceDetails({
  activeFormatReferenceSpaceId,
  setActiveFormatReferenceSpaceId,
  space,
}: {
  activeFormatReferenceSpaceId: string | null;
  setActiveFormatReferenceSpaceId: (id: string | null) => void;
  space: SpaceProfile;
}) {
  return (
    <details className="space-card__details" data-testid="space-detail">
      <summary>Evidence and context</summary>
      <div className="space-card__detail-content">
        <div>
          <span>Why they go</span>
          <p>{space.whyTheyGo}</p>
        </div>
        <div>
          <span>Evidence</span>
          <p>{space.evidenceSummary}</p>
        </div>
        <div>
          <span>Strategy implication</span>
          <p>{space.implication}</p>
        </div>
        <div>
          <span>Safety and age context</span>
          <p>{space.safetyCaveat}</p>
        </div>
        {space.culturalEvidenceUrl && space.culturalEvidenceLabel ? (
          <a
            className="space-profile-evidence-link"
            href={space.culturalEvidenceUrl}
            rel="noreferrer"
            target="_blank"
          >
            {space.culturalEvidenceLabel} <ExternalLink aria-hidden="true" size={14} />
          </a>
        ) : null}
        <RelatedFormatReference
          activeFormatReferenceSpaceId={activeFormatReferenceSpaceId}
          setActiveFormatReferenceSpaceId={setActiveFormatReferenceSpaceId}
          space={space}
        />
      </div>
    </details>
  );
}

function FeaturedSpaceCard({
  activeFormatReferenceSpaceId,
  setActiveFormatReferenceSpaceId,
  space,
}: {
  activeFormatReferenceSpaceId: string | null;
  setActiveFormatReferenceSpaceId: (id: string | null) => void;
  space: SpaceProfile;
}) {
  return (
    <article
      aria-labelledby={`${space.id}-heading`}
      className={`space-profile space-profile-${space.tone}`}
      data-testid="space-profile"
      id={space.id}
      style={{ scrollMarginTop: "6rem", maxWidth: "100%", minWidth: 0 }}
      tabIndex={-1}
    >
      {space.image ? (
        <div className="space-profile-media">
          <Image
            alt=""
            className="space-profile-image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={space.image}
          />
        </div>
      ) : null}
      <div className="space-profile-body">
        <p className="space-profile-category">{space.category}</p>
        <h2 id={`${space.id}-heading`}>{space.name}</h2>
        <p className="space-profile-what">{space.whatItIs}</p>
        <SpaceDetails
          activeFormatReferenceSpaceId={activeFormatReferenceSpaceId}
          setActiveFormatReferenceSpaceId={setActiveFormatReferenceSpaceId}
          space={space}
        />
      </div>
    </article>
  );
}

function CompactSpaceCard({
  activeFormatReferenceSpaceId,
  setActiveFormatReferenceSpaceId,
  space,
}: {
  activeFormatReferenceSpaceId: string | null;
  setActiveFormatReferenceSpaceId: (id: string | null) => void;
  space: SpaceProfile;
}) {
  return (
    <article
      aria-labelledby={`${space.id}-heading`}
      className={`space-profile-compact space-profile-${space.tone}`}
      data-testid="space-profile-compact"
      id={space.id}
      style={{ scrollMarginTop: "6rem", maxWidth: "100%", minWidth: 0 }}
      tabIndex={-1}
    >
      <header className="space-profile-compact-header">
        <h2 id={`${space.id}-heading`}>{space.name}</h2>
        <p>{space.category}</p>
      </header>
      <p className="space-profile-compact-summary">{space.whatItIs}</p>
      <SpaceDetails
        activeFormatReferenceSpaceId={activeFormatReferenceSpaceId}
        setActiveFormatReferenceSpaceId={setActiveFormatReferenceSpaceId}
        space={space}
      />
    </article>
  );
}

export default function SpaceFilters({ spaces }: SpaceFiltersProps) {
  const [category, setCategory] = useState("all");
  const [environment, setEnvironment] = useState("all");
  const [age, setAge] = useState("all");
  const [search, setSearch] = useState("");
  const [activeFormatReferenceSpaceId, setActiveFormatReferenceSpaceId] = useState<string | null>(null);

  const filtersActive = category !== "all" || environment !== "all" || age !== "all" || search.trim() !== "";

  const filtered = useMemo(
    () => spaces.filter((space) =>
      (category === "all" || space.category === category)
      && (environment === "all" || space.environment === environment)
      && (age === "all" || space.ageBands.includes(age as (typeof spaceAgeBands)[number]))
      && [space.name, space.category, space.environment, space.whatItIs, space.whyTheyGo]
        .some((value) => value.toLowerCase().includes(search.trim().toLowerCase()))),
    [age, category, environment, search, spaces],
  );

  const featuredSpaces = useMemo(() => filtered.filter((space) => space.featured), [filtered]);
  const compactSpaces = useMemo(() => filtered.filter((space) => !space.featured), [filtered]);

  const statusText = filtersActive
    ? `${filtered.length} ${filtered.length === 1 ? "space" : "spaces"} shown`
    : `${featuredSpaces.length} featured spaces`;

  const clear = () => {
    setCategory("all");
    setEnvironment("all");
    setAge("all");
    setSearch("");
  };

  return (
    <section
      aria-label="Space directory"
      className="space-directory"
      style={{ maxWidth: "100%", minWidth: 0, overflow: "clip" }}
    >
      <div className="space-filter-controls directory-filters">
        <label className="space-filter-search">
          Search
          <span>
            <Search aria-hidden="true" size={16} />
            <input
              aria-label="Search spaces"
              placeholder="Search spaces"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </span>
        </label>
        <label>
          Category
          <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {spaceCategories.map((option) => <option value={option} key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Environment
          <select aria-label="Environment" value={environment} onChange={(event) => setEnvironment(event.target.value)}>
            <option value="all">All environments</option>
            {spaceEnvironments.map((option) => <option value={option} key={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}
          </select>
        </label>
        <label>
          Audience age
          <select aria-label="Audience age" value={age} onChange={(event) => setAge(event.target.value)}>
            <option value="all">All ages</option>
            {spaceAgeBands.map((option) => <option value={option} key={option}>Ages {option}</option>)}
          </select>
        </label>
        <div className="space-filter-summary">
          <p aria-live="polite" role="status">{statusText}</p>
          <button type="button" onClick={clear} aria-label="Clear all space filters">
            <RotateCcw aria-hidden="true" size={16} /> Clear all
          </button>
        </div>
      </div>

      {filtered.length === 0 ? <p role="note" style={{ padding: "2rem" }}>No spaces match these filters.</p> : null}

      {featuredSpaces.length > 0 ? (
        <div className="spaces-featured-grid">
          {featuredSpaces.map((space) => (
            <FeaturedSpaceCard
              activeFormatReferenceSpaceId={activeFormatReferenceSpaceId}
              key={space.id}
              setActiveFormatReferenceSpaceId={setActiveFormatReferenceSpaceId}
              space={space}
            />
          ))}
        </div>
      ) : null}

      {compactSpaces.length > 0 ? (
        <section aria-label={filtersActive ? "Matching spaces" : "More spaces"} className="spaces-compact-section">
          {!filtersActive ? <h2 className="spaces-compact-heading">More spaces</h2> : null}
          <div className="spaces-compact-list">
            {compactSpaces.map((space) => (
              <CompactSpaceCard
                activeFormatReferenceSpaceId={activeFormatReferenceSpaceId}
                key={space.id}
                setActiveFormatReferenceSpaceId={setActiveFormatReferenceSpaceId}
                space={space}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
