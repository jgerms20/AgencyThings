"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { comparisonObservations } from "@/lib/comparison-observations";
import { insights } from "@/lib/content/insights";
import {
  comparisonCohorts,
  comparisonDimensions,
  getComparisonEvidence,
  type ComparisonCohort,
  type ComparisonCohortKey,
} from "@/lib/content/comparisons";

const statusLabel = (status: ComparisonCohort["evidenceStatus"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const insightById = new Map(insights.map((insight) => [insight.id, insight]));

function Mentality({ label, cohort }: { label: string; cohort: ComparisonCohort }) {
  return (
    <article className="comparison-mentality">
      <div className="comparison-mentality-heading">
        <p className="comparison-eyebrow">{label}</p>
        <p className={`comparison-status status-${cohort.evidenceStatus.replaceAll(" ", "-")}`}>
          {statusLabel(cohort.evidenceStatus)}
        </p>
      </div>
      <p className="comparison-summary">{cohort.mentality}</p>
    </article>
  );
}

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
            <li key={record.id}>
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
  const [activeCohortKey, setActiveCohortKey] = useState<ComparisonCohortKey>("genZ");
  const activeTopic = comparisonDimensions.find((topic) => topic.id === activeTopicId) ?? comparisonDimensions[0];
  const activeCohort = comparisonCohorts.find((cohort) => cohort.id === activeCohortKey) ?? comparisonCohorts[0];
  const activeComparison = activeTopic.comparisons[activeCohort.id];

  return (
    <main className="compare-page">
      <SiteHeader />
      <section className="page-opening compare-opening">
        <p className="comparison-kicker">Compare</p>
        <h1>Gen Alpha vs. older cohorts, topic by topic.</h1>
      </section>

      <section className="comparison-workspace" aria-label="Generation comparison">
        <div className="comparison-controls">
          <label>
            <span>Topic</span>
            <select
              aria-label="Comparison topic"
              onChange={(event) => setActiveTopicId(event.target.value)}
              value={activeTopic.id}
            >
              {comparisonDimensions.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
            </select>
          </label>
          <label>
            <span>Cohort</span>
            <select
              aria-label="Comparison cohort"
              onChange={(event) => setActiveCohortKey(event.target.value as ComparisonCohortKey)}
              value={activeCohort.id}
            >
              {comparisonCohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.label}</option>)}
            </select>
          </label>
        </div>

        <section className="comparison-result" aria-label="Comparison result" aria-live="polite">
          <h2 className="comparison-result-title">{activeTopic.title}</h2>

          <div className="comparison-mentalities">
            <Mentality label="Gen Alpha" cohort={activeTopic.genAlpha} />
            <Mentality label={activeCohort.label} cohort={activeComparison.cohort} />
          </div>

          <section className="comparison-difference" aria-label="Strategic difference">
            <p>{activeComparison.realDifference}</p>
          </section>

          <details className="comparison-proof" data-testid="comparison-proof" key={`${activeTopic.id}-${activeCohort.id}`}>
            <summary><span>Evidence and methodology</span><ChevronDown aria-hidden="true" size={20} /></summary>
            <div className="comparison-proof-meta">
              <p className="comparison-eyebrow">Comparison class</p>
              <p className="comparison-class">{activeComparison.comparisonClass}</p>
            </div>
            <div className="comparison-human-read">
              <section>
                <p className="comparison-eyebrow">What that can look like</p>
                <p>{activeComparison.everydayExample}</p>
              </section>
              <section>
                <p className="comparison-eyebrow">Keep in mind</p>
                <p>{activeComparison.caveat}</p>
              </section>
            </div>
            <div className="comparison-scope-grid">
              {[{ label: "Gen Alpha", cohort: activeTopic.genAlpha }, { label: activeCohort.label, cohort: activeComparison.cohort }].map(({ label, cohort }) => (
                <section key={label}>
                  <p className="comparison-eyebrow">{label} scope</p>
                  <dl className="comparison-metadata">
                    <div><dt>Age scope</dt><dd>{cohort.ageRange}</dd></div>
                    <div><dt>Geography</dt><dd>{cohort.geography}</dd></div>
                    <div><dt>Evidence window</dt><dd>{cohort.sourceYear}</dd></div>
                  </dl>
                </section>
              ))}
            </div>
            <div className="comparison-evidence-grid">
              <EvidenceColumn label="Gen Alpha" cohort={activeTopic.genAlpha} />
              <EvidenceColumn label={activeCohort.label} cohort={activeComparison.cohort} />
            </div>
          </details>
        </section>
      </section>

      <details className="comparison-observations" data-testid="comparison-observations">
        <summary>
          <span>
            <strong>Human observations to investigate</strong>
            <small>Promising patterns that still need direct evidence</small>
          </span>
          <ChevronDown aria-hidden="true" size={24} />
        </summary>
        <div className="comparison-observation-grid">
          {comparisonObservations.map((observation) => (
            <Link href={observation.href as Route} key={observation.title}>
              <span>{observation.status.charAt(0).toUpperCase() + observation.status.slice(1)}</span>
              <h2>{observation.title}</h2>
              <p>{observation.summary}</p>
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      </details>

      <style>{`
        @media (max-width: 700px) {
          .comparison-mentalities { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
