"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { genderLenses, genderMethodology, type GenderLensId } from "@/lib/gender-lens";

export default function GenderLensPage() {
  const [activeId, setActiveId] = useState<GenderLensId>("boys");
  const active = genderLenses.find((lens) => lens.id === activeId) ?? genderLenses[0];

  return (
    <main className="gender-page research-page">
      <SiteHeader active="gender" />
      <section className="research-opening gender-opening">
        <p className="research-kicker">Gender lens / evidence before assumption</p>
        <h1>Gender is a lens, not a shortcut.</h1>
        <p>Use the differences to ask sharper questions about access, identity, social context, and platform culture—not to turn children into pink and blue audience segments.</p>
      </section>

      <section className="gender-workspace" aria-label="Gender comparison workspace">
        <div className="gender-tabs" role="tablist" aria-label="Gender lenses">
          {genderLenses.map((lens) => (
            <button
              aria-controls={`gender-panel-${lens.id}`}
              aria-selected={active.id === lens.id}
              id={`gender-tab-${lens.id}`}
              key={lens.id}
              onClick={() => setActiveId(lens.id)}
              role="tab"
              type="button"
            >
              {lens.label}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`gender-tab-${active.id}`}
          className="gender-panel"
          id={`gender-panel-${active.id}`}
          role="tabpanel"
        >
          <header>
            <p>{active.label} / current evidence</p>
            <h2>{active.headline}</h2>
            <p>{active.framing}</p>
          </header>

          <div className="gender-finding-grid">
            {active.findings.map((finding) => (
              <article className="gender-finding" key={finding.title}>
                <div className="gender-finding-topline">
                  {finding.metric ? <strong>{finding.metric}</strong> : <strong className="evidence-gap">Evidence gap</strong>}
                  <span>{finding.evidenceClass}</span>
                </div>
                <h3>{finding.title}</h3>
                <p>{finding.finding}</p>
                <aside>
                  <span>Read this as</span>
                  <p>{finding.interpretation}</p>
                </aside>
                <a href={finding.sourceUrl} rel="noreferrer" target="_blank" aria-label={`Open source: ${finding.sourceTitle}`}>
                  <span>{finding.sourceOrganization}</span>
                  {finding.sourceTitle}
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </article>
            ))}
          </div>

          <aside className="gender-guardrail">
            <ShieldCheck aria-hidden="true" size={24} />
            <div><span>Use guardrail</span><p>{active.guardrail}</p></div>
          </aside>
        </div>
      </section>

      <section className="methodology-panel" role="region" aria-label="How to read this evidence">
        <header><p>Validity / what this can and cannot tell us</p><h2>How to read this evidence.</h2></header>
        <ol>
          <li><span>Sample</span><p>{genderMethodology.sample}</p></li>
          <li><span>Cohort fit</span><p>{genderMethodology.proxy}</p></li>
          <li><span>Measurement</span><p>{genderMethodology.measurement}</p></li>
          <li><span>Interpretation</span><p>{genderMethodology.interpretation}</p></li>
        </ol>
        <a href="https://www.pewresearch.org/internet/2024/12/12/teens-social-media-tech-methodology/" rel="noreferrer" target="_blank">
          Read the full Pew methodology <ArrowUpRight aria-hidden="true" size={17} />
        </a>
      </section>
    </main>
  );
}
