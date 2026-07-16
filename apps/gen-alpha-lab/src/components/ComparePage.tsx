"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { comparisonDimensions, type ComparisonCohort } from "@/lib/content/comparisons";

function EvidenceRail({ label, cohort }: { label: string; cohort: ComparisonCohort }) {
  return (
    <article className="comparison-cohort">
      <p className="comparison-eyebrow">{label}</p>
      <p className="comparison-summary">{cohort.summary}</p>
      <dl className="comparison-metadata">
        <div><dt>Age</dt><dd>{cohort.ageRange}</dd></div>
        <div><dt>Geography</dt><dd>{cohort.geography}</dd></div>
        <div><dt>Source year</dt><dd>{cohort.sourceYear}</dd></div>
      </dl>
      <p className="comparison-source-label">Sources</p>
      <ul className="comparison-source-list">
        {cohort.sourceIds.map((sourceId) => <li key={sourceId}>{sourceId.replaceAll("-", " ")}</li>)}
      </ul>
    </article>
  );
}
export default function ComparePage() {
  const [activeId, setActiveId] = useState(comparisonDimensions[0].id);
  const activeDimension = comparisonDimensions.find((dimension) => dimension.id === activeId) ?? comparisonDimensions[0];

  return (
    <main className="compare-page">
      <SiteHeader />
      <section className="page-opening compare-opening">
        <p className="comparison-kicker">Compare generations</p>
        <h1>Gen Alpha and Gen Z, compared with the evidence left intact.</h1>
        <p>These are research scopes, not personality types. Every dimension names what is measured, when, where, and what cannot be concluded from it.</p>
      </section>

      <section className="comparison-workspace" aria-label="Generation comparison">
        <fieldset className="comparison-selector">
          <legend>Choose a comparison dimension</legend>
          <div role="radiogroup" aria-label="Comparison dimensions" className="comparison-options">
            {comparisonDimensions.map((dimension) => (
              <label key={dimension.id}>
                <input checked={activeId === dimension.id} name="comparison-dimension" onChange={() => setActiveId(dimension.id)} type="radio" value={dimension.id} />
                <span>{dimension.title}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <section className="comparison-result" aria-labelledby="comparison-title">
          <header>
            <p className="comparison-eyebrow">Comparison class</p>
            <p className="comparison-class">{activeDimension.comparisonClass}</p>
            <h2 id="comparison-title">{activeDimension.title}</h2>
          </header>
          <div className="comparison-rail">
            <EvidenceRail label="Gen Alpha evidence" cohort={activeDimension.genAlpha} />
            <EvidenceRail label="Gen Z evidence" cohort={activeDimension.genZ} />
          </div>
          <aside className="comparison-caveat" aria-label="Methodology caveat">
            <p className="comparison-eyebrow">Methodology caveat</p>
            <p>{activeDimension.caveat}</p>
          </aside>
        </section>
      </section>

      <aside className="comparison-principle">
        This page does not treat age differences as proof of a generational trait. Where the canonical evidence has no matched series, the gap remains visible.
      </aside>

      <style>{`
        .compare-page { min-height: 100vh; }
        .compare-opening { min-height: 405px; padding-top: 88px; padding-bottom: 54px; }
        .comparison-kicker, .comparison-eyebrow { color: var(--acid); font-size: .72rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        .comparison-kicker { margin-bottom: 18px; }
        .comparison-workspace { display: grid; grid-template-columns: minmax(220px, .45fr) minmax(0, 1.55fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .comparison-selector { min-width: 0; margin: 0; border: 0; border-right: 1px solid var(--line); padding: 32px; }
        .comparison-selector legend { margin-bottom: 18px; font-size: .85rem; font-weight: 900; }
        .comparison-options { display: grid; gap: 6px; }
        .comparison-options label { position: relative; display: block; cursor: pointer; }
        .comparison-options input { position: absolute; inline-size: 1px; block-size: 1px; opacity: 0; }
        .comparison-options span { display: block; border: 1px solid transparent; border-left: 3px solid var(--line); padding: 11px 12px; color: var(--muted); font-size: .84rem; font-weight: 800; line-height: 1.25; }
        .comparison-options label:hover span, .comparison-options input:checked + span { border-color: var(--acid); background: var(--surface); color: var(--ink); }
        .comparison-options input:focus-visible + span { outline: 2px solid var(--acid); outline-offset: 2px; }
        .comparison-result { min-width: 0; padding: 42px 32px 48px; }
        .comparison-result header { padding-bottom: 30px; }
        .comparison-class { display: inline-block; margin-top: 8px; border: 1px solid var(--cyan); padding: 5px 8px; color: var(--cyan); font-size: .74rem; font-weight: 900; text-transform: uppercase; }
        .comparison-result h2 { max-width: 740px; margin-top: 18px; font-size: 3rem; line-height: 1; }
        .comparison-rail { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .comparison-cohort { min-width: 0; padding: 28px 24px 30px 0; }
        .comparison-cohort + .comparison-cohort { border-left: 1px solid var(--line); padding-left: 24px; }
        .comparison-summary { margin-top: 14px; font-size: 1.08rem; font-weight: 800; line-height: 1.42; }
        .comparison-metadata { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 26px 0 22px; }
        .comparison-metadata div { min-width: 0; border-top: 1px solid var(--line); padding-top: 9px; }
        .comparison-metadata dt, .comparison-source-label { color: var(--muted); font-size: .66rem; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; }
        .comparison-metadata dd { margin: 5px 0 0; font-size: .76rem; font-weight: 800; line-height: 1.35; overflow-wrap: anywhere; }
        .comparison-source-list { display: grid; gap: 5px; margin: 7px 0 0; padding: 0; list-style: none; color: var(--muted); font-size: .72rem; font-weight: 700; line-height: 1.35; }
        .comparison-source-list li { overflow-wrap: anywhere; }
        .comparison-caveat { margin-top: 0; border-bottom: 3px solid var(--coral); padding: 25px 0 22px; }
        .comparison-caveat > p:last-child { max-width: 850px; margin-top: 10px; font-size: .92rem; font-weight: 700; line-height: 1.48; }
        .comparison-principle { padding: 22px 32px 42px; color: var(--muted); font-size: .82rem; font-weight: 700; line-height: 1.45; }
        @media (max-width: 900px) { .comparison-workspace { grid-template-columns: 1fr; } .comparison-selector { border-right: 0; border-bottom: 1px solid var(--line); } .comparison-options { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 700px) { .compare-opening { min-height: 370px; padding-top: 62px; padding-bottom: 44px; } .comparison-selector, .comparison-result, .comparison-principle { padding-right: 18px; padding-left: 18px; } .comparison-result { padding-top: 34px; } .comparison-result h2 { font-size: 2.35rem; } .comparison-rail { grid-template-columns: 1fr; } .comparison-cohort { padding-right: 0; } .comparison-cohort + .comparison-cohort { border-top: 1px solid var(--line); border-left: 0; padding-top: 28px; padding-left: 0; } }
        @media (max-width: 420px) { .comparison-options { grid-template-columns: 1fr; } .comparison-metadata { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </main>
  );
}
