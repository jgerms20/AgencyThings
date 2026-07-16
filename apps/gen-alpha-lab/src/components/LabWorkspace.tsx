import { ArrowUpRight, Headphones, Library } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import SiteHeader from "@/components/SiteHeader";
import { creators, editorialInsights } from "@/lib/editorial";
import type { ResearchRecord } from "@/lib/types";

type LabWorkspaceProps = {
  initialRecords: ResearchRecord[];
};

export default function LabWorkspace({ initialRecords }: LabWorkspaceProps) {
  const podcast = initialRecords.find((record) => record.id === "owned-podcast-093");

  return (
    <main className="overview-page">
      <SiteHeader active="overview" />

      <section className="overview-opening">
        <h1>Gen Alpha, in four truths.</h1>
        <p>
          The first childhood shaped by conversational AI, creator media, participatory games,
          and managed digital life is already here.
        </p>
        <Link className="text-link" href="/library">
          Explore the evidence <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </section>

      <section className="insight-bands" aria-label="Four Gen Alpha truths">
        {editorialInsights.map((insight) => (
          <article
            className={`insight-band insight-band-${insight.tone}`}
            data-testid="editorial-insight"
            key={insight.id}
          >
            <span>{insight.label}</span>
            <div>
              <h2>{insight.title}</h2>
              <p>{insight.interpretation}</p>
            </div>
            <Link href={insight.href as Route} aria-label={`Explore ${insight.title}`}>
              <ArrowUpRight aria-hidden="true" size={24} />
            </Link>
          </article>
        ))}
      </section>

      <section className="people-preview" aria-labelledby="people-preview-heading">
        <div className="section-line">
          <h2 id="people-preview-heading">Who shapes the culture</h2>
          <Link className="text-link" href="/people">
            See the people <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="portrait-strip">
          {creators.map((creator) => (
            <Link href="/people" key={creator.id}>
              <img src={creator.portrait} alt={creator.portraitAlt} />
              <strong>{creator.name}</strong>
              <span>{creator.role}</span>
            </Link>
          ))}
        </div>
      </section>

      {podcast ? (
        <section className="podcast-brief" aria-labelledby="podcast-brief-heading">
          <Headphones aria-hidden="true" size={28} />
          <div>
            <span>Joshua&apos;s point of view</span>
            <h2 id="podcast-brief-heading">{podcast.title}</h2>
            <p>{podcast.summary}</p>
          </div>
          <a className="text-link" href={podcast.url} target="_blank" rel="noreferrer">
            Listen on Spotify <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </section>
      ) : null}

      <section className="library-invitation">
        <Library aria-hidden="true" size={34} />
        <h2>The proof lives in one place.</h2>
        <Link className="button" href="/library" aria-label="Open the research library">
          Open the research library <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </main>
  );
}
