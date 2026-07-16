import { ArrowUpRight } from "lucide-react";
import { getSupportingRecords } from "@/lib/findings";
import { seedRecords } from "@/lib/seed-data";
import type { Finding } from "@/lib/findings";
import SiteHeader from "@/components/SiteHeader";

type FindingDetailProps = {
  finding: Finding;
};

export default function FindingDetail({ finding }: FindingDetailProps) {
  const support = getSupportingRecords(finding, seedRecords);

  return (
    <main className={`finding-detail-page accent-${finding.topicId}`}>
      <SiteHeader />

      <article className="detail-article">
        <section className="detail-hero">
          <div className="detail-hero-copy">
            <p>Finding</p>
            <h1>{finding.title}</h1>
          </div>
          {finding.heroImage ? <img src={finding.heroImage} alt={finding.heroAlt} /> : null}
        </section>

        <section className="detail-section detail-know">
          <p className="detail-eyebrow">The read</p>
          <h2>What we know</h2>
          <p className="detail-lede">{finding.summary}</p>
          <ul className="observation-list">
            {finding.observations.map((observation) => <li key={observation}>{observation}</li>)}
          </ul>
        </section>

        <section className="detail-section detail-why">
          <p className="detail-eyebrow">The implication</p>
          <h2>Why it matters</h2>
          <p className="detail-lede">{finding.interpretation}</p>
          <aside className="gen-z-contrast">
            <span>Compared with Gen Z</span>
            <p>{finding.genZJuxtaposition}</p>
          </aside>
        </section>

        <section className="detail-section detail-evidence">
          <p className="detail-eyebrow">Go deeper</p>
          <h2>Evidence</h2>
          <div className="source-list">
            {support.map((record) => (
              <a href={record.url} target="_blank" rel="noreferrer" key={record.id}>
                <span>{record.sourceClass}</span>
                <strong>{record.title}</strong>
                <small>{record.source}</small>
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
