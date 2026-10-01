"use client";

import { ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { genderLenses, genderMethodology, type GenderLensId } from "@/lib/gender-lens";

const signalLabel = (signal: "difference" | "counter-pattern" | "evidence gap") =>
  signal === "counter-pattern" ? "Counter-pattern" : signal === "evidence gap" ? "Evidence gap" : "Difference";

const takeaways: Record<GenderLensId, { title: string; lead: string; findingIndexes: number[] }[]> = {
  boys: [
    { title: "Access shapes the gap", lead: "Screen and console time differ, but devices and context matter.", findingIndexes: [0, 1, 2] },
    { title: "Play is social", lead: "Teen gaming is often a place to spend time with other people.", findingIndexes: [3, 4] },
    { title: "Contact needs care", lead: "The same social spaces can bring harassment.", findingIndexes: [5] },
  ],
  girls: [
    { title: "Play is already there", lead: "Gaming is common even when gamer identity is less visible.", findingIndexes: [0, 1] },
    { title: "Connection and pressure coexist", lead: "Online friendship value does not erase popularity pressure.", findingIndexes: [2, 3] },
    { title: "Platforms are context", lead: "Reported use and phone-time concerns are patterns, not preferences to assign to a person.", findingIndexes: [4, 5] },
  ],
  "gender-diverse": [
    { title: "Presence is measured", lead: "High-school identity data shows presence, not a Gen Alpha media profile.", findingIndexes: [0, 1] },
    { title: "Media data is missing", lead: "Binary cuts cannot describe gender-diverse children’s media routines.", findingIndexes: [2, 3] },
    { title: "Belonging matters", lead: "Safety and community are context, never an identity trait.", findingIndexes: [4, 5] },
  ],
};

export default function GenderLensPage() {
  const [activeId, setActiveId] = useState<GenderLensId>("girls");
  const active = genderLenses.find((lens) => lens.id === activeId) ?? genderLenses[1];

  return (
    <main className="gender-page research-page">
      <SiteHeader active="gender" />
      <section className="research-opening gender-opening">
        <div className="gender-opening-thesis">
          <p className="research-kicker">Gender lens</p>
          <h1>See the pattern. Keep the person.</h1>
        </div>
        <div className="gender-opening-copy">
          <strong>Group differences are prompts, not predictions.</strong>
          <p>Teen findings are near-age proxies, not a read of all Gen Alpha. Direct child data is labeled below.</p>
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

          <div className="gender-takeaways">
            {takeaways[active.id].map((takeaway, index) => (
              <section className="gender-takeaway" key={takeaway.title}>
                <span className="gender-takeaway-number">0{index + 1}</span>
                <h3>{takeaway.title}</h3>
                <p>{takeaway.lead}</p>
                <details className="gender-evidence">
                  <summary>Explore {takeaway.findingIndexes.length} findings <ChevronDown aria-hidden="true" size={18} /></summary>
                  <div className="gender-evidence-list">
                    {takeaway.findingIndexes.map((findingIndex) => {
                      const finding = active.findings[findingIndex];
                      return (
                        <article className={`gender-finding signal-${finding.signal.replace(" ", "-")}`} key={finding.title}>
                          <div className="gender-finding-topline">
                            {finding.metric ? <strong>{finding.metric}</strong> : <strong className="evidence-gap">Evidence gap</strong>}
                            <div className="gender-finding-tags">
                              <span className="gender-evidence-class">{finding.evidenceClass}</span>
                              <span className="gender-signal">{signalLabel(finding.signal)}</span>
                            </div>
                          </div>
                          <h4>{finding.title}</h4>
                          <p className="gender-finding-lead">{finding.finding}</p>
                          <p className="gender-finding-read">{finding.interpretation}</p>
                          <a href={finding.sourceUrl} rel="noreferrer" target="_blank" aria-label={`Open source: ${finding.sourceTitle}`}>
                            <span>{finding.sourceOrganization}</span>
                            {finding.sourceTitle}
                            <ArrowUpRight aria-hidden="true" size={17} />
                          </a>
                        </article>
                      );
                    })}
                  </div>
                </details>
              </section>
            ))}
          </div>

          <aside className="gender-guardrail">
            <ShieldCheck aria-hidden="true" size={24} />
            <div><span>Keep in view</span><p>{active.guardrail}</p></div>
          </aside>
        </div>
      </section>

      <details className="methodology-panel gender-methodology" role="region" aria-label="How to read this evidence">
        <summary>
          <div>
            <p>Evidence limits</p>
            <h2>How to read these numbers</h2>
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
