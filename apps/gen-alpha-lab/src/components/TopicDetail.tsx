import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import {
  findingTopics,
  getFindingsForTopic,
  getSupportingRecords,
  type TopicLens
} from "@/lib/findings";
import { seedRecords } from "@/lib/seed-data";
import ThemeToggle from "@/components/ThemeToggle";

type TopicDetailProps = {
  topic: TopicLens;
};

export default function TopicDetail({ topic }: TopicDetailProps) {
  const topicFindings = getFindingsForTopic(topic);
  const support = topicFindings.flatMap((finding) => getSupportingRecords(finding, seedRecords));
  const supportById = new Map(support.map((record) => [record.id, record]));
  const sources = Array.from(supportById.values());
  const siblingTopics = findingTopics.filter((item) => item.id !== topic.id).slice(0, 3);

  return (
    <main className="topic-detail-page">
      <header className="detail-header">
        <Link href="/" className="detail-brand">Gen Alpha Intelligence Lab</Link>
        <div className="detail-actions">
          <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" size={16} /> Field guide</Link>
          <ThemeToggle />
        </div>
      </header>

      <article>
        <section className="topic-hero">
          <div>
            <p>{topic.label}</p>
            <h1>{topic.pageTitle}</h1>
            <p>{topic.thesis}</p>
          </div>
          <aside>
            <span>Agency question</span>
            <strong>{topic.agencyQuestion}</strong>
          </aside>
        </section>

        <section className="topic-anatomy" aria-labelledby="topic-anatomy-heading">
          <div>
            <p className="detail-eyebrow">Visual anatomy</p>
            <h2 id="topic-anatomy-heading">What to look for</h2>
          </div>
          <div className="anatomy-grid">
            {topic.visualAnatomy.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="topic-findings-page" aria-labelledby="topic-findings-heading">
          <div>
            <p className="detail-eyebrow">Findings</p>
            <h2 id="topic-findings-heading">Editorial read</h2>
          </div>
          <div className="topic-finding-list">
            {topicFindings.map((finding) => (
              <article key={finding.id}>
                {finding.heroImage ? <img src={finding.heroImage} alt={finding.heroAlt} /> : null}
                <div>
                  <h3>{finding.title}</h3>
                  <p>{finding.summary}</p>
                  <p>{finding.interpretation}</p>
                  <Link href={`/findings/${finding.id}` as Route}>
                    Open finding <ArrowUpRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="topic-contrast" aria-labelledby="topic-contrast-heading">
          <p className="detail-eyebrow">Gen Z contrast</p>
          <h2 id="topic-contrast-heading">{topic.genZContrast}</h2>
        </section>

        <section className="topic-sources" aria-labelledby="topic-sources-heading">
          <div>
            <p className="detail-eyebrow">Supporting sources</p>
            <h2 id="topic-sources-heading">Evidence to inspect</h2>
          </div>
          <div className="topic-source-list">
            {sources.map((record) => (
              <a href={record.url} target="_blank" rel="noreferrer" key={record.id}>
                <span>{record.sourceClass}</span>
                <strong>{record.title}</strong>
                <small>{record.source}</small>
                <ExternalLink aria-hidden="true" size={17} />
              </a>
            ))}
          </div>
        </section>

        <section className="related-findings">
          <p className="detail-eyebrow">Other lenses</p>
          <h2>Continue through the system</h2>
          <div>
            {siblingTopics.map((item) => (
              <Link href={item.href as Route} key={item.id}>
                <span>{item.label}</span>
                <strong>{item.thesis}</strong>
                <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
