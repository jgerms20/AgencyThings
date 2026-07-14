import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { findings, findingTopics, getSupportingRecords } from "@/lib/findings";
import { seedRecords } from "@/lib/seed-data";
import type { Finding } from "@/lib/findings";
import ThemeToggle from "@/components/ThemeToggle";

type FindingDetailProps = {
  finding: Finding;
};

export default function FindingDetail({ finding }: FindingDetailProps) {
  const topic = findingTopics.find((item) => item.id === finding.topicId);
  const support = getSupportingRecords(finding, seedRecords);
  const related = findings.filter((item) => item.id !== finding.id).slice(0, 3);
  const heroImage = finding.heroImage ?? "/findings/connection.png";
  const heroAlt = finding.heroAlt ?? "Editorial photograph for a Gen Alpha finding";

  return (
    <main className="finding-detail-page">
      <header className="detail-header">
        <Link href="/" className="detail-brand">Gen Alpha Intelligence Lab</Link>
        <div className="detail-actions">
          <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" size={16} /> Field guide</Link>
          <ThemeToggle />
        </div>
      </header>

      <article>
        <section className="detail-hero">
          <div className="detail-hero-copy">
            <p>{topic?.label}</p>
            <h1>{finding.title}</h1>
            <div className="detail-meta"><span>Evidence confidence: {finding.confidence}</span><span>Editorial finding</span></div>
          </div>
          <img src={heroImage} alt={heroAlt} />
        </section>

        <section className="detail-summary">
          <p className="detail-lede">{finding.summary}</p>
          <p>{finding.interpretation}</p>
        </section>

        <section className="detail-grid" aria-label="Finding analysis">
          <div>
            <p className="detail-eyebrow">What the evidence suggests</p>
            <h2>Observations</h2>
            <ul className="observation-list">
              {finding.observations.map((observation) => <li key={observation}>{observation}</li>)}
            </ul>
          </div>
          <aside className="gen-z-contrast">
            <p className="detail-eyebrow">Gen Z juxtaposition</p>
            <p>{finding.genZJuxtaposition}</p>
          </aside>
        </section>

        <section className="detail-evidence">
          <div>
            <p className="detail-eyebrow">Library</p>
            <h2>Evidence behind this finding</h2>
          </div>
          <div className="detail-evidence-list">
            {support.map((record) => (
              <a href={record.url} target="_blank" rel="noreferrer" key={record.id}>
                <span>{record.sourceClass}</span>
                <strong>{record.title}</strong>
                <small>{record.source}</small>
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            ))}
          </div>
        </section>

        <section className="related-findings">
          <p className="detail-eyebrow">Continue exploring</p>
          <h2>Related findings</h2>
          <div>
            {related.map((item) => (
              <Link href={`/findings/${item.id}` as Route} key={item.id}>
                <span>{findingTopics.find((topicItem) => topicItem.id === item.topicId)?.label}</span>
                <strong>{item.title}</strong>
                <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
