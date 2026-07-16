import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import {
  getFindingsForTopic,
  getSupportingRecords,
  type TopicLens
} from "@/lib/findings";
import { seedRecords } from "@/lib/seed-data";
import SiteHeader from "@/components/SiteHeader";

type TopicDetailProps = {
  topic: TopicLens;
};

export default function TopicDetail({ topic }: TopicDetailProps) {
  const topicFindings = getFindingsForTopic(topic);
  const support = topicFindings.flatMap((finding) => getSupportingRecords(finding, seedRecords));
  const sources = Array.from(new Map(support.map((record) => [record.id, record])).values());

  return (
    <main className={`topic-detail-page accent-${topic.id}`}>
      <SiteHeader />

      <article className="detail-article">
        <section className="topic-lead">
          <p>{topic.label}</p>
          <h1>{topic.thesis}</h1>
        </section>

        <section className="detail-section detail-know">
          <p className="detail-eyebrow">The pattern</p>
          <h2>What we know</h2>
          <ol className="anatomy-list">
            {topic.visualAnatomy.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
          <div className="finding-links">
            {topicFindings.map((finding) => (
              <Link href={`/findings/${finding.id}` as Route} key={finding.id}>
                <strong>{finding.title}</strong>
                <span>{finding.summary}</span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            ))}
          </div>
        </section>

        <section className="detail-section detail-why">
          <p className="detail-eyebrow">The strategic question</p>
          <h2>Why it matters</h2>
          <p className="detail-lede">{topic.agencyQuestion}</p>
          <aside className="gen-z-contrast">
            <span>Compared with Gen Z</span>
            <p>{topic.genZContrast}</p>
          </aside>
        </section>

        <section className="detail-section detail-evidence">
          <p className="detail-eyebrow">Go deeper</p>
          <h2>Evidence</h2>
          <div className="source-list">
            {sources.map((record) => (
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
