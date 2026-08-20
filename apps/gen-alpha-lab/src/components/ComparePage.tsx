"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState, type CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import { insights } from "@/lib/content/insights";
import {
  comparisonDimensions,
  defaultSelectedGenerations,
  generationRank,
  generations,
  getComparisonEvidence,
  getGeneration,
  getGenerationCohort,
  getPairRead,
  overlappingEntryIds,
  type ComparisonCohort,
  type GenerationKey,
} from "@/lib/content/comparisons";

const insightById = new Map(insights.map((insight) => [insight.id, insight]));

const statusLabel = (status: ComparisonCohort["evidenceStatus"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

function EvidenceColumn({ label, cohort }: { label: string; cohort: ComparisonCohort }) {
  const evidenceRecords = getComparisonEvidence(cohort);

  return (
    <section className="comparison-evidence-column" aria-label={`${label} sources`}>
      <p className="comparison-evidence-label">{label} evidence</p>
      {evidenceRecords.length === 0 ? (
        <p className="comparison-gap">No matched evidence record is used for this side of the comparison.</p>
      ) : (
        <ul className="comparison-evidence-list">
          {evidenceRecords.map((record) => (
            <li key={`${label}-${record.id}`}>
              <p className="comparison-evidence-claim">{record.claim}</p>
              <p className="comparison-evidence-support">{record.support}</p>
              <p className="comparison-evidence-locator">Source locator: {record.locator}</p>
              <a href={record.sourceUrl} rel="noreferrer" target="_blank" aria-label={`Open direct source: ${record.sourceTitle}`}>
                <span>{record.sourceOrganization}</span>
                {record.sourceTitle}<ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <Link href={`/library/${record.sourceId}` as Route} aria-label={`Open source record: ${record.sourceTitle}`}>Open source record <ArrowUpRight aria-hidden="true" size={15} /></Link>
              {record.insightIds.flatMap((insightId) => {
                const insight = insightById.get(insightId);
                return insight ? [<Link href={`/insights/${insight.id}` as Route} aria-label={`Open connected insight: ${insight.title}`} key={insight.id}>{insight.title}<ArrowUpRight aria-hidden="true" size={15} /></Link>] : [];
              })}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ComparePage() {
  const [activeTopicId, setActiveTopicId] = useState(comparisonDimensions[0].id);
  const [selected, setSelected] = useState<GenerationKey[]>(defaultSelectedGenerations);
  const activeTopic = comparisonDimensions.find((topic) => topic.id === activeTopicId) ?? comparisonDimensions[0];
  const orderedSelected = useMemo(
    () => [...selected].sort((left, right) => generationRank[left] - generationRank[right]),
    [selected],
  );
  const overlaps = overlappingEntryIds(activeTopic, orderedSelected);
  const oldest = orderedSelected[0];
  const youngest = orderedSelected[orderedSelected.length - 1];
  const pairRead = oldest && youngest && oldest !== youngest ? getPairRead(activeTopic, oldest, youngest) : "";
  const cultureTopics = comparisonDimensions.filter((topic) => topic.kind !== "measured");
  const measuredTopics = comparisonDimensions.filter((topic) => topic.kind === "measured");

  const toggleGeneration = (id: GenerationKey) => {
    setSelected((current) => {
      if (current.includes(id)) {
        if (current.length === 2) return current;
        return current.filter((item) => item !== id);
      }
      return [...current, id];
    });
  };

  return (
    <main className="compare-page">
      <SiteHeader active="compare" />
      <section className="page-opening compare-opening">
        <div>
          <p className="comparison-kicker">Compare</p>
          <h1>Pick the generations. Then pick the thing you actually want to compare.</h1>
          <p>Deselect Alpha if you want Z versus Boomers. Add Millennials. The lists overlap on purpose.</p>
        </div>
      </section>

      <section className="comparison-workspace" aria-label="Generation comparison">
        <div className="comparison-board-controls">
          <fieldset className="generation-toggles">
            <legend>Generations</legend>
            {generations.map((generation) => {
              const pressed = selected.includes(generation.id);
              return (
                <button
                  aria-pressed={pressed}
                  key={generation.id}
                  onClick={() => toggleGeneration(generation.id)}
                  type="button"
                >
                  <strong>{generation.label}</strong>
                  <span>{generation.years}</span>
                </button>
              );
            })}
          </fieldset>

          <div className="comparison-topic-groups">
            <fieldset>
              <legend>Culture they grew up with</legend>
              <div>
                {cultureTopics.map((topic) => (
                  <button
                    aria-pressed={activeTopic.id === topic.id}
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    type="button"
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>What we can measure</legend>
              <div>
                {measuredTopics.map((topic) => (
                  <button
                    aria-pressed={activeTopic.id === topic.id}
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    type="button"
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <section className="comparison-result" aria-label="Comparison result" aria-live="polite">
          <p className="comparison-result-title">{activeTopic.title}</p>
          <h2 className="comparison-prompt">{activeTopic.prompt}</h2>
          <p className="comparison-method">{activeTopic.method}</p>

          {pairRead ? (
            <section className="comparison-difference" aria-label="Strategic difference">
              <p>{pairRead}</p>
            </section>
          ) : null}

          <div
            className="canon-board"
            style={{ "--canon-count": String(orderedSelected.length) } as CSSProperties}
          >
            {orderedSelected.map((key) => {
              const generation = getGeneration(key);
              const cohort = getGenerationCohort(activeTopic, key);
              if (!generation) return null;
              return (
                <article className="canon-column" key={key}>
                  <header>
                    <p className="comparison-eyebrow">{generation.label}</p>
                    <p className="canon-years">{generation.years} · {generation.agesIn2026} in 2026</p>
                    <h3>{cohort.mentality}</h3>
                  </header>
                  <ol className="canon-list">
                    {(cohort.entries ?? []).map((item) => (
                      <li className={overlaps.has(item.id) ? "canon-overlap" : undefined} key={item.id}>
                        {item.year ? <span className="canon-year">{item.year}</span> : null}
                        <div>
                          <strong>
                            {item.label}
                            {overlaps.has(item.id) ? <em> shared</em> : null}
                          </strong>
                          <p>{item.note}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>

          <details className="comparison-proof" data-testid="comparison-proof" key={`${activeTopic.id}-${orderedSelected.join("-")}`}>
            <summary><span>Evidence and methodology</span><ChevronDown aria-hidden="true" size={20} /></summary>
            <div className="comparison-human-read">
              <section>
                <p className="comparison-eyebrow">How to read this</p>
                <p>{activeTopic.method}</p>
              </section>
              <section>
                <p className="comparison-eyebrow">Keep in mind</p>
                <p>{oldest && oldest !== "genAlpha" ? activeTopic.comparisons[oldest].caveat : activeTopic.comparisons.genZ.caveat}</p>
              </section>
            </div>
            <div className="comparison-scope-grid" style={{ "--canon-count": String(orderedSelected.length) } as CSSProperties}>
              {orderedSelected.map((key) => {
                const generation = getGeneration(key);
                const cohort = getGenerationCohort(activeTopic, key);
                if (!generation) return null;
                return (
                  <section key={key}>
                    <p className="comparison-eyebrow">{generation.label} scope</p>
                    <p className={`comparison-status status-${cohort.evidenceStatus.replaceAll(" ", "-")}`}>{statusLabel(cohort.evidenceStatus)}</p>
                    <dl className="comparison-metadata">
                      <div><dt>Age scope</dt><dd>{cohort.ageRange}</dd></div>
                      <div><dt>Geography</dt><dd>{cohort.geography}</dd></div>
                      <div><dt>Evidence window</dt><dd>{cohort.sourceYear}</dd></div>
                    </dl>
                  </section>
                );
              })}
            </div>
            <div className="comparison-evidence-grid" style={{ "--canon-count": String(Math.min(orderedSelected.length, 3)) } as CSSProperties}>
              {orderedSelected.map((key) => {
                const generation = getGeneration(key);
                if (!generation) return null;
                return <EvidenceColumn key={key} label={generation.label} cohort={getGenerationCohort(activeTopic, key)} />;
              })}
            </div>
          </details>
        </section>
      </section>
    </main>
  );
}
