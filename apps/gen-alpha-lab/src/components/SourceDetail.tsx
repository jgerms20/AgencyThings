import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { evidenceItems } from "@/lib/content/evidence";
import { themes } from "@/lib/content/insights";
import { getInsight } from "@/lib/content/selectors";
import type { Insight, Source } from "@/lib/content/types";

type SourceDetailProps = {
  source: Source;
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function SourceDetail({ source }: SourceDetailProps) {
  const evidence = evidenceItems.filter((item) => item.sourceId === source.id);
  const relatedInsights = Array.from(
    new Map(
      evidence
        .flatMap((item) => item.insightIds)
        .flatMap((id) => {
          const insight = getInsight(id);
          return insight ? [[insight.id, insight] as [string, Insight]] : [];
        })
    ).values()
  );
  const sourceThemes = Array.from(
    new Set(relatedInsights.map((insight) => insight.themeId))
  ).flatMap((themeId) => themes.find((theme) => theme.id === themeId) ?? []);

  return (
    <main className="finding-detail-page">
      <SiteHeader active="library" />

      <article className="detail-article">
        <section className="topic-lead">
          <p>{titleCase(source.format)} / {source.sourceClass}</p>
          <h1>{source.title}</h1>
          <p className="detail-lede">{source.summary}</p>
        </section>

        <section className="detail-section detail-know">
          <p className="detail-eyebrow">Research context</p>
          <h2>Population and methodology</h2>
          <ul className="observation-list">
            <li><strong>Population</strong> {source.population}; ages {source.ageRange}; {source.geography}.</li>
            <li><strong>Methodology</strong> {source.methodology}</li>
            <li><strong>Fieldwork</strong> {source.fieldworkPeriod}</li>
            {source.sampleSize ? <li><strong>Sample size</strong> {source.sampleSize}</li> : null}
          </ul>
        </section>

        <section className="detail-section detail-why">
          <p className="detail-eyebrow">How to use this source</p>
          <h2>Evidence strength</h2>
          <aside className="gen-z-contrast">
            <span>Evidence count</span>
            <p>{evidence.length} extracted evidence {evidence.length === 1 ? "item" : "items"}</p>
          </aside>
          <aside className="gen-z-contrast">
            <span>Strength</span>
            <p>{titleCase(source.confidence)}</p>
          </aside>
          <p className="detail-lede"><strong>Limitations</strong> {source.limitations}</p>
        </section>

        <section className="detail-section detail-evidence">
          <p className="detail-eyebrow">Trace the claim</p>
          <h2>Extracted evidence</h2>
          <div className="library-list">
            {evidence.map((item) => (
              <article className="library-row" key={item.id}>
                <div className="library-source">
                  <span>{item.claimKind}</span>
                  <small>{item.evidenceType}</small>
                </div>
                <div>
                  <h3>{item.claim}</h3>
                  <p><strong>Locator</strong> {item.locator}</p>
                  <p><strong>Scope</strong> {item.population}; {item.ageRange}; {item.geography}; {item.period}.</p>
                  <p><strong>Limitations</strong> {item.limitations}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="detail-section detail-know">
          <p className="detail-eyebrow">Connected conclusions</p>
          <h2>Themes</h2>
          <div className="library-meta">
            {sourceThemes.map((theme) => <strong key={theme.id}>{theme.title}</strong>)}
          </div>
          <h2>Related insights</h2>
          <div className="finding-links">
            {relatedInsights.map((insight) => (
              <Link aria-label={insight.title} href={`/insights/${insight.id}` as Route} key={insight.id}>
                <strong>{insight.title}</strong>
                <span>{insight.thesis}</span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            ))}
          </div>
        </section>

        {source.youtubeId ? (
          <section className="detail-section detail-why">
            <p className="detail-eyebrow">Source media</p>
            <h2>Watch the source</h2>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={`https://www.youtube-nocookie.com/embed/${source.youtubeId}`}
              title={`${source.title} video`}
            />
          </section>
        ) : null}

        <section className="detail-section detail-why">
          <p className="detail-eyebrow">Read the original</p>
          <h2>Direct source</h2>
          <a className="text-link" href={source.url} rel="noreferrer" target="_blank">
            View direct source <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </section>
      </article>
    </main>
  );
}
