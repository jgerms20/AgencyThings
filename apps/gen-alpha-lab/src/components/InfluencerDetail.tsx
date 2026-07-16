import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import type { InfluencerProfile } from "@/lib/influencers";

type InfluencerDetailProps = {
  influencer: InfluencerProfile;
};

export default function InfluencerDetail({ influencer }: InfluencerDetailProps) {
  return (
    <main className="influencer-detail-page">
      <SiteHeader active="influencers" />
      <article className="influencer-detail">
        <Link className="text-link influencer-back" href="/influencers">
          <ArrowLeft aria-hidden="true" size={17} /> All influencers
        </Link>

        <header className="influencer-hero">
          <div>
            <span>{influencer.category}</span>
            <h1>{influencer.name}</h1>
            <p>{influencer.summary}</p>
          </div>
          <img src={influencer.portrait} alt={influencer.name} />
        </header>

        <section className="influencer-indicators" aria-label="Editorial influence indicators">
          {influencer.indicators.map((indicator) => (
            <div data-testid="influencer-indicator" key={indicator.label}>
              <span>{indicator.label}</span>
              <strong>{indicator.value}</strong>
            </div>
          ))}
        </section>

        <section className="profile-intelligence">
          <div>
            <span>Influence thesis</span>
            <h2>Why {influencer.pronouns} matters</h2>
            <p>{influencer.influenceReason}</p>
          </div>
          <div>
            <span>Audience</span>
            <h2>Who is watching</h2>
            <p>{influencer.audience}</p>
            <ul>{influencer.platforms.map((platform) => <li key={platform}>{platform}</li>)}</ul>
          </div>
        </section>

        <section className="profile-moments">
          <h2>Key formats and moments</h2>
          <div>
            {influencer.moments.map((moment, index) => (
              <article key={moment}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{moment}</p>
              </article>
            ))}
          </div>
        </section>

        {influencer.featuredVideo ? (
          <section className="profile-video">
            <div>
              <span>See the format</span>
              <h2>{influencer.featuredVideo.title}</h2>
            </div>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              src={`https://www.youtube-nocookie.com/embed/${influencer.featuredVideo.youtubeId}`}
              title={`${influencer.name} video: ${influencer.featuredVideo.title}`}
            />
          </section>
        ) : null}

        <a className="profile-channel-link" href={influencer.profileUrl} target="_blank" rel="noreferrer">
          Open official channel <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </article>
    </main>
  );
}
