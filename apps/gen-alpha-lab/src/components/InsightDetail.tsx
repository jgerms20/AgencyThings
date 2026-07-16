import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { getEvidenceForInsight, getSource } from "@/lib/content/selectors";
import { themes } from "@/lib/content/insights";
import { getInfluencerById } from "@/lib/influencers";
import { spaces } from "@/lib/spaces";
import type { Insight } from "@/lib/content/types";

type InsightDetailProps = {
  insight: Insight;
};

export default function InsightDetail({ insight }: InsightDetailProps) {
  const theme = themes.find((item) => item.id === insight.themeId)!;
  const evidence = getEvidenceForInsight(insight.id);
  const leadEvidence = evidence[0];
  const leadSource = getSource(leadEvidence.sourceId)!;
  const relatedCreators = insight.relatedCreatorIds.flatMap((id) => {
    const creator = getInfluencerById(id);
    return creator ? [creator] : [];
  });
  const relatedSpaces = insight.relatedSpaceIds.flatMap((id) => {
    const space = spaces.find((item) => item.id === id);
    return space ? [space] : [];
  });

  return (
    <main className={`finding-detail-page accent-${insight.themeId}`}>
      <SiteHeader active="insights" />

      <article className="detail-article">
        <section className="topic-lead">
          <p>{theme.title} / Insight {String(insight.sequence).padStart(2, "0")}</p>
          <h1>{insight.title}</h1>
        </section>

        <section className="detail-section detail-know">
          <p className="detail-eyebrow">The conclusion</p>
          <h2>What the evidence supports</h2>
          <p className="detail-lede">{insight.thesis}</p>
          <ul className="observation-list">
            <li>{insight.interpretation}</li>
            <li>{insight.confidenceReason}</li>
            <li>Scope: {insight.ageRange}; {insight.geography}.</li>
          </ul>
        </section>

        <section className="detail-section detail-why">
          <p className="detail-eyebrow">Lead evidence</p>
          <h2>{leadEvidence.claim}</h2>
          <p className="detail-lede">{leadEvidence.supportRationale}</p>
          <aside className="gen-z-contrast">
            <span>{leadSource.organization}</span>
            <p>{leadEvidence.population}; {leadEvidence.ageRange}; {leadEvidence.geography}; {leadEvidence.period}.</p>
          </aside>
        </section>

        <section className="detail-section detail-evidence">
          <p className="detail-eyebrow">Trace the claim</p>
          <h2>Evidence ledger</h2>
          <div className="library-list">
            {evidence.map((item) => {
              const source = getSource(item.sourceId)!;

              return (
                <article className="library-row" key={item.id}>
                  <div className="library-source">
                    <span>{item.claimKind}</span>
                    <small>{source.organization}</small>
                  </div>
                  <div>
                    <h3>{item.claim}</h3>
                    <p><strong>Population</strong> {item.population}; {item.ageRange}; {item.geography}; {item.period}.</p>
                    <p><strong>Methodology</strong> {item.methodology}</p>
                    <p><strong>Limitations</strong> {item.limitations}</p>
                    <p><strong>Locator</strong> {item.locator}</p>
                  </div>
                  <a href={source.url} target="_blank" rel="noreferrer" aria-label={source.title}>
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="detail-section detail-why">
          <p className="detail-eyebrow">Pressure test</p>
          <h2>Nuance and counterpoint</h2>
          <p className="detail-lede">{insight.nuance}</p>
          {insight.genZComparison ? (
            <aside className="gen-z-contrast">
              <span>Compared with Gen Z</span>
              <p>{insight.genZComparison}</p>
            </aside>
          ) : null}
        </section>

        <section className="detail-section detail-know">
          <p className="detail-eyebrow">Connected context</p>
          <h2>Related culture shapers and spaces</h2>
          <div className="finding-links">
            {relatedCreators.map((creator) => (
              <Link href={`/influencers/${creator.id}` as Route} key={creator.id}>
                <strong>{creator.name}</strong>
                <span>{creator.role}</span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            ))}
            {relatedSpaces.map((space) => (
              <Link aria-label={space.name} href={`/spaces#${space.id}` as Route} key={space.id}>
                <strong>{space.name}</strong>
                <span>{space.behavior}</span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            ))}
          </div>
        </section>

        <section
          className="detail-section detail-why"
          data-testid="agency-implication"
          data-upgrade-target="reach-them"
        >
          <p className="detail-eyebrow">Responsible action</p>
          <h2>Agency implication</h2>
          <p className="detail-lede">{insight.agencyImplication}</p>
          <Link className="text-link" href="/reach-them" style={{ marginTop: "24px" }}>
            Open the Reach Them strategy
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </section>
      </article>
    </main>
  );
}
