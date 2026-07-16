"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import {
  comparisonCohorts,
  comparisonDimensions,
  getComparisonEvidence,
  type ComparisonCohort,
  type ComparisonCohortKey,
} from "@/lib/content/comparisons";

const statusLabel = (status: ComparisonCohort["evidenceStatus"]) =>
  status.charAt(0).toUpperCase() + status.slice(1);

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
      <dl className="comparison-metadata">
        <div><dt>Age scope</dt><dd>{cohort.ageRange}</dd></div>
        <div><dt>Geography</dt><dd>{cohort.geography}</dd></div>
        <div><dt>Evidence window</dt><dd>{cohort.sourceYear}</dd></div>
      </dl>
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
              <p className="comparison-evidence-support">Why it belongs here: {record.support}</p>
              <p className="comparison-evidence-locator">Located: {record.locator}</p>
              <a href={record.sourceUrl} rel="noreferrer" target="_blank">
                <span>{record.sourceOrganization}</span>
                {record.sourceTitle}
              </a>
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
        <p className="comparison-kicker">Compare generations</p>
        <h1>Compare Gen Alpha by topic and cohort.</h1>
        <p>Use the contrast to sharpen strategy, then read the evidence class and caveat before treating any difference as measured.</p>
      </section>

      <section className="comparison-workspace" aria-label="Generation comparison">
        <div className="comparison-controls">
          <label>
            <span>Comparison cohort</span>
            <select
              aria-label="Comparison cohort"
              onChange={(event) => setActiveCohortKey(event.target.value as ComparisonCohortKey)}
              value={activeCohort.id}
            >
              {comparisonCohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.label}</option>)}
            </select>
          </label>
          <label>
            <span>Comparison topic</span>
            <select
              aria-label="Comparison topic"
              onChange={(event) => setActiveTopicId(event.target.value)}
              value={activeTopic.id}
            >
              {comparisonDimensions.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
            </select>
          </label>
        </div>

        <section className="comparison-result" aria-label="Comparison result" aria-live="polite">
          <header className="comparison-result-header">
            <div>
              <p className="comparison-eyebrow">Comparison class</p>
              <p className="comparison-class">{activeComparison.comparisonClass}</p>
            </div>
            <h2>{activeTopic.title}: Gen Alpha and {activeCohort.label}</h2>
          </header>

          <div className="comparison-mentalities">
            <Mentality label="Gen Alpha mentality" cohort={activeTopic.genAlpha} />
            <Mentality label={`${activeCohort.label} mentality`} cohort={activeComparison.cohort} />
          </div>

          <section className="comparison-difference" aria-label="Strategic difference">
            <p className="comparison-eyebrow">The real difference</p>
            <p><strong>{activeComparison.realDifference}</strong></p>
          </section>

          <div className="comparison-evidence-grid">
            <EvidenceColumn label="Gen Alpha" cohort={activeTopic.genAlpha} />
            <EvidenceColumn label={activeCohort.label} cohort={activeComparison.cohort} />
          </div>

          <aside className="comparison-caveat" aria-label="Methodology caveat">
            <p className="comparison-eyebrow">Methodology caveat</p>
            <p>{activeComparison.caveat}</p>
          </aside>
        </section>
      </section>

      <aside className="comparison-principle">
        Gen Alpha remains the anchor. Age differences are not proof of a generational trait, and missing evidence stays visible instead of being filled with a stereotype.
      </aside>

      <style>{`
        .compare-page { min-height: 100vh; }
        .compare-opening { min-height: 405px; padding-top: 88px; padding-bottom: 54px; }
        .comparison-kicker, .comparison-eyebrow { color: var(--acid); font-size: .72rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        .comparison-kicker { margin-bottom: 18px; color: #090a09; }
        .comparison-workspace { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .comparison-controls { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1px; background: var(--line); border-bottom: 1px solid var(--line); }
        .comparison-controls label { display: grid; gap: 9px; min-width: 0; padding: 24px 32px; background: var(--bg); }
        .comparison-controls label > span { color: var(--muted); font-size: .7rem; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; }
        .comparison-controls select { width: 100%; min-height: 48px; border: 1px solid var(--line); border-radius: 0; padding: 0 42px 0 13px; background: var(--surface); color: var(--ink); font: inherit; font-size: .92rem; font-weight: 900; }
        .comparison-controls select:focus-visible { outline: 3px solid var(--acid); outline-offset: 2px; }
        .comparison-result { min-width: 0; padding: 44px 32px 50px; }
        .comparison-result-header { display: grid; grid-template-columns: minmax(180px, .45fr) minmax(0, 1.55fr); gap: 30px; align-items: end; padding-bottom: 32px; }
        .comparison-class, .comparison-status { display: inline-block; margin-top: 8px; border: 1px solid var(--cyan); padding: 5px 8px; color: var(--cyan); font-size: .7rem; font-weight: 900; text-transform: uppercase; }
        .comparison-result h2 { max-width: 840px; font-size: 2.75rem; line-height: 1.04; }
        .comparison-mentalities { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .comparison-mentality { min-width: 0; padding: 28px 24px 30px 0; }
        .comparison-mentality + .comparison-mentality { border-left: 1px solid var(--line); padding-right: 0; padding-left: 24px; }
        .comparison-mentality-heading { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; justify-content: space-between; }
        .comparison-status { margin-top: 0; border-color: var(--line); color: var(--muted); }
        .comparison-status.status-evidence-gap { border-color: var(--coral); color: var(--coral); }
        .comparison-status.status-adult-age-band-proxy, .comparison-status.status-near-age-proxy { border-color: var(--violet); color: var(--violet); }
        .comparison-summary { margin-top: 16px; font-size: 1.08rem; font-weight: 800; line-height: 1.45; }
        .comparison-metadata { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 26px 0 0; }
        .comparison-metadata div { min-width: 0; border-top: 1px solid var(--line); padding-top: 9px; }
        .comparison-metadata dt, .comparison-evidence-label { color: var(--muted); font-size: .66rem; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; }
        .comparison-metadata dd { margin: 5px 0 0; font-size: .76rem; font-weight: 800; line-height: 1.35; overflow-wrap: anywhere; }
        .comparison-difference { display: grid; grid-template-columns: minmax(180px, .45fr) minmax(0, 1.55fr); gap: 30px; padding: 30px 0; border-bottom: 3px solid var(--acid); }
        .comparison-difference > p:last-child { max-width: 900px; font-size: 1.2rem; line-height: 1.45; }
        .comparison-evidence-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-bottom: 1px solid var(--line); }
        .comparison-evidence-column { min-width: 0; padding: 28px 24px 32px 0; }
        .comparison-evidence-column + .comparison-evidence-column { border-left: 1px solid var(--line); padding-right: 0; padding-left: 24px; }
        .comparison-evidence-list { display: grid; gap: 18px; margin: 10px 0 0; padding: 0; list-style: none; }
        .comparison-evidence-list li { border-top: 1px solid var(--line); padding-top: 14px; overflow-wrap: anywhere; }
        .comparison-evidence-claim { font-size: .86rem; font-weight: 800; line-height: 1.45; }
        .comparison-evidence-support, .comparison-evidence-locator, .comparison-gap { margin-top: 9px; color: var(--muted); font-size: .72rem; font-weight: 700; line-height: 1.45; }
        .comparison-evidence-list a { display: inline-flex; flex-direction: column; gap: 2px; margin-top: 11px; color: var(--cyan); font-size: .74rem; font-weight: 900; line-height: 1.35; }
        .comparison-evidence-list a span { color: var(--muted); font-size: .64rem; letter-spacing: .06em; text-transform: uppercase; }
        .comparison-evidence-list a:hover, .comparison-evidence-list a:focus-visible { color: var(--acid); outline: 2px solid var(--acid); outline-offset: 3px; }
        .comparison-caveat { padding: 26px 0 4px; }
        .comparison-caveat > p:last-child { max-width: 880px; margin-top: 10px; font-size: .92rem; font-weight: 700; line-height: 1.5; }
        .comparison-principle { padding: 22px 32px 42px; color: var(--muted); font-size: .82rem; font-weight: 700; line-height: 1.45; }
        @media (max-width: 700px) {
          .compare-opening { min-height: 370px; padding-top: 62px; padding-bottom: 44px; }
          .comparison-controls, .comparison-result-header, .comparison-difference { grid-template-columns: 1fr; }
          .comparison-controls { gap: 0; }
          .comparison-controls label + label { border-top: 1px solid var(--line); }
          .comparison-controls label, .comparison-result, .comparison-principle { padding-right: 18px; padding-left: 18px; }
          .comparison-result { padding-top: 34px; }
          .comparison-result h2 { font-size: 2.15rem; }
          .comparison-mentalities { grid-template-columns: 1fr; }
          .comparison-mentality { padding-right: 0; }
          .comparison-mentality + .comparison-mentality { border-top: 1px solid var(--line); border-left: 0; padding-left: 0; }
          .comparison-difference { gap: 12px; }
          .comparison-evidence-grid { grid-template-columns: 1fr; }
          .comparison-evidence-column { padding-right: 0; }
          .comparison-evidence-column + .comparison-evidence-column { border-top: 1px solid var(--line); border-left: 0; padding-left: 0; }
        }
        @media (max-width: 420px) { .comparison-metadata { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
