import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import IndicatorTooltip from "@/components/IndicatorTooltip";
import SiteHeader from "@/components/SiteHeader";
import { getCultureShaper, type CultureShaper } from "@/lib/content/culture-shapers";
import { getSource } from "@/lib/content/selectors";
import { spaces } from "@/lib/spaces";

type InfluencerDetailProps = {
  influencer: CultureShaper | { id: string };
};

export default function InfluencerDetail({ influencer }: InfluencerDetailProps) {
  const profile = getCultureShaper(influencer.id);
  if (!profile) return null;
  const relatedSpaces = profile.relatedSpaceIds
    .map((spaceId) => spaces.find((space) => space.id === spaceId))
    .filter((space) => space !== undefined);

  return (
    <main className="influencer-detail-page">
      <SiteHeader active="influencers" />
      <article className="influencer-detail">
        <Link className="text-link influencer-back" href="/influencers">
          <ArrowLeft aria-hidden="true" size={17} /> All influencers
        </Link>

        <header className="influencer-hero">
          <div>
            <span>{profile.type.replace("screen-ip", "Screen / IP")} / {profile.category}</span>
            <h1>{profile.name}</h1>
            <p>{profile.summary}</p>
          </div>
          {profile.portrait ? <img src={profile.portrait} alt={profile.name} /> : null}
        </header>

        <section className="influencer-indicators" aria-label="Editorial influence indicators">
          {Object.values(profile.indicators).map((indicator) => (
            <div data-testid="influencer-indicator" key={indicator.indicator}>
              <span>{indicator.label} <IndicatorTooltip assessment={indicator} /></span>
              <strong>Tier {indicator.tier}</strong>
              <p>{indicator.definition}</p>
              <p>{indicator.rationale}</p>
            </div>
          ))}
        </section>

        <section className="profile-intelligence">
          <div>
            <span>Influence thesis</span>
            <h2>Why {profile.pronouns} matters</h2>
            <p>{profile.influenceMechanism}</p>
          </div>
          <div>
            <span>Audience</span>
            <h2>Who is watching</h2>
            <p>{profile.audience.center}</p>
            <p>{profile.audience.broader}</p>
            <p><strong>{profile.audience.confidence} confidence.</strong> {profile.audience.confidenceRationale}</p>
            <ul>{profile.audienceSegments.map((segment) => <li key={segment}>{segment}</li>)}</ul>
          </div>
        </section>

        <section className="profile-intelligence" aria-label="Topics, formats, and platforms">
          <div>
            <span>Topics</span>
            <h2>What it carries</h2>
            <ul>{profile.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </div>
          <div>
            <span>Formats and platforms</span>
            <h2>How it travels</h2>
            <ul>{[...profile.formats, ...profile.platforms].map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <section className="profile-moments">
          <h2>Key formats and moments</h2>
          <div>
            {profile.definingMoments.map((moment, index) => (
              <article key={moment}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{moment}</p>
              </article>
            ))}
          </div>
        </section>

        {profile.videos.filter((video) => video.embeddable).map((video) => (
          <section className="profile-video" key={video.youtubeId}>
            <div><span>See the format</span><h2>{video.title}</h2></div>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
              title={`${profile.name} video: ${video.title}`}
            />
          </section>
        ))}

        <section className="profile-intelligence" aria-label="Related intelligence and sources">
          <div>
            <span>Related intelligence</span>
            <h2>Follow the connections</h2>
            <ul>{profile.relatedEntities.map((entity) => <li key={entity.id}><Link href={entity.href as Route}>{entity.label}</Link></li>)}</ul>
            <h3>Related spaces</h3>
            <ul>{relatedSpaces.map((space) => <li key={space.id}><Link href={`/spaces#${space.id}` as Route}>{space.name}</Link></li>)}</ul>
          </div>
          <div>
            <span>Evidence notes</span>
            <h2>How to read this profile</h2>
            {profile.sourceNotes.map((sourceNote) => {
              const source = getSource(sourceNote.sourceId);
              return source ? <p key={sourceNote.sourceId}>{sourceNote.note} <a href={source.url} target="_blank" rel="noreferrer">{source.organization} <ArrowUpRight aria-hidden="true" size={15} /></a></p> : null;
            })}
          </div>
        </section>

        <a className="profile-channel-link" href={profile.officialUrl} target="_blank" rel="noreferrer">
          Open official destination <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </article>
    </main>
  );
}
