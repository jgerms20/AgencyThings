import { ArrowUpRight, Headphones, Library } from "lucide-react";
import Link from "next/link";
import InsightTabs from "@/components/InsightTabs";
import SiteHeader from "@/components/SiteHeader";
import { featuredInfluencers } from "@/lib/influencers";
import { spaces } from "@/lib/spaces";
import type { ResearchRecord } from "@/lib/types";

type LabWorkspaceProps = { initialRecords: ResearchRecord[] };

export default function LabWorkspace({ initialRecords }: LabWorkspaceProps) {
  const podcast = initialRecords.find((record) => record.id === "owned-podcast-093");

  return (
    <main className="overview-page">
      <SiteHeader active="overview" />
      <section className="overview-opening">
        <h1>Gen Alpha, in forty insights.</h1>
        <p>Forty evidence-backed insights connect play, media, routines, and learning. AI cuts across them as a condition, never a theme of its own.</p>
        <Link className="text-link" href="/insights">Explore all 40 insights <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </section>

      <InsightTabs />

      <section className="people-preview" aria-labelledby="people-preview-heading">
        <div className="section-line"><h2 id="people-preview-heading">Who shapes the culture</h2><Link className="text-link" href="/influencers">See all 42 culture shapers <ArrowUpRight aria-hidden="true" size={17} /></Link></div>
        <div className="portrait-strip portrait-strip-five">
          {featuredInfluencers.map((influencer) => (
            <Link href={`/influencers/${influencer.id}`} key={influencer.id}>
              <img src={influencer.portrait} alt={influencer.name} />
              <strong>{influencer.name}</strong><span>{influencer.role}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="spaces-preview" aria-labelledby="spaces-preview-heading">
        <div className="section-line"><h2 id="spaces-preview-heading">Where they spend time</h2><Link className="text-link" href="/spaces">Explore all 50 spaces <ArrowUpRight aria-hidden="true" size={17} /></Link></div>
        <div className="space-preview-list">
          {spaces.slice(0, 3).map((space) => (
            <Link href={`/spaces#${space.id}`} key={space.id}><span>{space.audience}</span><h3>{space.name}</h3><p>{space.whatHappens}</p><ArrowUpRight aria-hidden="true" size={18} /></Link>
          ))}
        </div>
      </section>

      {podcast ? <section className="podcast-brief" aria-labelledby="podcast-brief-heading"><Headphones aria-hidden="true" size={28} /><div><span>Listen to understand them more</span><h2 id="podcast-brief-heading">{podcast.title}</h2><p>{podcast.summary}</p></div><a className="text-link" href={podcast.url} target="_blank" rel="noreferrer">Listen on Spotify <ArrowUpRight aria-hidden="true" size={18} /></a></section> : null}

      <section className="library-invitation"><Library aria-hidden="true" size={34} /><h2>The proof lives in one place.</h2><Link className="button" href="/library" aria-label="Open the research library">Open the research library <ArrowUpRight aria-hidden="true" size={18} /></Link></section>
    </main>
  );
}
