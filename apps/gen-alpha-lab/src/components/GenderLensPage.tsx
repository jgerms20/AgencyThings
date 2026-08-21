"use client";

import { ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { genderLenses, genderMethodology, type GenderLensId } from "@/lib/gender-lens";

const signalLabel = (signal: "difference" | "counter-pattern" | "evidence gap") =>
  signal === "counter-pattern" ? "Counter-pattern" : signal === "evidence gap" ? "Evidence gap" : "Difference";

export default function GenderLensPage() {
  const [activeId, setActiveId] = useState<GenderLensId>("girls");
  const active = genderLenses.find((lens) => lens.id === activeId) ?? genderLenses[1];

  return (
    <main className="gender-page research-page">
      <SiteHeader active="gender" />
      <section className="research-opening gender-opening">
        <div className="gender-opening-thesis">
          <p className="research-kicker">Gender lens</p>
          <h1>Gender is a lens, not a shortcut.</h1>
        </div>
        <div className="gender-opening-copy">
          <strong>Patterns are real enough to investigate and too incomplete to predict a child.</strong>
          <p>Use the gaps to ask sharper questions. Keep the person bigger than the segment.</p>
        </div>
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
          <header className="gender-panel-header">
            <h2>{active.headline}</h2>
            <p>{active.framing}</p>
          </header>

          <div className="gender-finding-grid">
            {active.findings.map((finding) => (
              <article className={`gender-finding signal-${finding.signal.replace(" ", "-")}`} key={finding.title} tabIndex={0}>
                <div className="gender-finding-topline">
                  {finding.metric ? <strong>{finding.metric}</strong> : <strong className="evidence-gap">Evidence gap</strong>}
                  <div className="gender-finding-tags">
                    <span className="gender-evidence-class">{finding.evidenceClass}</span>
                    <span className="gender-signal">{signalLabel(finding.signal)}</span>
                  </div>
                </div>
                <h3>{finding.title}</h3>
                <div className="gender-finding-detail">
                  <p className="gender-finding-lead">{finding.finding}</p>
                  <p className="gender-finding-read">{finding.interpretation}</p>
                </div>
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

      <details className="methodology-panel gender-methodology" role="region" aria-label="How to read this evidence">
        <summary>
          <div>
            <p>Validity / what this can and cannot tell us</p>
            <h2>How to read this evidence.</h2>
          </div>
          <ChevronDown aria-hidden="true" size={24} />
        </summary>
        <div className="gender-methodology-body">
          <ol>
            <li><span>Sample</span><p>{genderMethodology.sample}</p></li>
            <li><span>Cohort fit</span><p>{genderMethodology.proxy}</p></li>
            <li><span>Measurement</span><p>{genderMethodology.measurement}</p></li>
            <li><span>Interpretation</span><p>{genderMethodology.interpretation}</p></li>
          </ol>
          <a href="https://www.pewresearch.org/internet/2024/12/12/teens-social-media-tech-methodology/" rel="noreferrer" target="_blank">
            Read the full Pew methodology <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </div>
      </details>
    </main>
  );
}
