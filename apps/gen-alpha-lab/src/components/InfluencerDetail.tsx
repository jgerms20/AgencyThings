import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getCultureShaper, getCultureShaperImage, getCultureShaperPublicIds, type CultureShaper } from "@/lib/content/culture-shapers";
import { getHumanProfile } from "@/lib/content/profiles";
import { getInsight } from "@/lib/content/insights";
import { getSource } from "@/lib/content/selectors";
import { spaces } from "@/lib/spaces";

function hostnameFrom(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

type InfluencerDetailProps = {
  influencer: CultureShaper | { id: string };
};

export default function InfluencerDetail({ influencer }: InfluencerDetailProps) {
  const profile = getCultureShaper(influencer.id);
  if (!profile) return null;

  const human = getHumanProfile(profile.id);
  const relatedSpaces = profile.relatedSpaceIds
    .map((spaceId) => spaces.find((space) => space.id === spaceId))
    .filter((space) => space !== undefined);
  const relatedInsights = profile.insightIds
    .map((insightId) => getInsight(insightId))
    .filter((insight) => insight !== undefined);
  const publicIds = getCultureShaperPublicIds(profile);
  const embeddableVideos = profile.videos.filter((video) => video.embeddable);
  const knownFor = human?.knownFor ?? profile.definingMoments;
  const heroSummary = human?.whoTheyAre ?? profile.summary;

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
            <p>{heroSummary}</p>
          </div>
          {getCultureShaperImage(profile) ? <img src={getCultureShaperImage(profile)} alt={profile.name} /> : null}
        </header>

        <section className="profile-human">
          <div>
            <span>Profile</span>
            <h2>Who they are</h2>
            {human ? (
              <>
                <p>{human.origin}</p>
                <p>{human.whoTheyAre}</p>
                {human.wikipediaUrl ? (
                  <a className="text-link profile-wikipedia-link" href={human.wikipediaUrl} rel="noreferrer" target="_blank">
                    Read on Wikipedia <ArrowUpRight aria-hidden="true" size={15} />
                  </a>
                ) : null}
              </>
            ) : (
              <>
                <p>{profile.summary}</p>
                <p>{profile.role}</p>
              </>
            )}
          </div>
          <div>
            <span>Audience</span>
            <h2>Who they reach</h2>
            <p>{human?.whoTheyReach ?? profile.audience.center}</p>
            {!human ? <p>{profile.audience.broader}</p> : null}
          </div>
        </section>

        <section className="profile-human">
          <div>
            <span>Content</span>
            <h2>What they make</h2>
            <p>{human?.whatTheyMake ?? `${profile.category}. ${profile.formats.join(", ")}.`}</p>
          </div>
          {human?.footprint ? (
            <div>
              <span>Footprint</span>
              <h2>Scale and presence</h2>
              <p>{human.footprint}</p>
            </div>
          ) : (
            <div>
              <span>Where they show up</span>
              <h2>Platforms</h2>
              <ul>{profile.platforms.map((platform) => <li key={platform}>{platform}</li>)}</ul>
            </div>
          )}
        </section>

        <section className="profile-moments">
          <h2>{human ? "Known for" : "Big moments"}</h2>
          <div>
            {knownFor.map((moment, index) => (
              <article key={moment}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{moment}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-human">
          <div>
            <span>Sphere of influence</span>
            <h2>What they shape</h2>
            <p>{human?.sphere ?? profile.category}</p>
          </div>
          <div>
            <span>Where you&apos;d have seen them</span>
            <h2>Everyday touchpoints</h2>
            <p>{human?.whereYouSeeThem ?? profile.platforms.join(" · ")}</p>
          </div>
        </section>

        <section className="profile-human profile-human-solo">
          <div>
            <span>Influence</span>
            <h2>Why {profile.pronouns} matters</h2>
            <p>{profile.influenceMechanism}</p>
          </div>
        </section>

        <section className="profile-destination" aria-label="Official destination and platforms">
          <div>
            <span>Official destination</span>
            <a href={profile.officialUrl} rel="noreferrer" target="_blank">
              {hostnameFrom(profile.officialUrl)} <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
          <div>
            <span>Platforms</span>
            <p>{profile.platforms.join(" · ")}</p>
          </div>
        </section>

        <aside className="profile-lab-id" aria-label="Lab identifier">
          <span>Lab ID</span>
          <strong>{profile.id}</strong>
          {publicIds.length > 1 ? <p>Also routed as {publicIds.filter((id) => id !== profile.id).map((id) => `/${id}`).join(", ")}</p> : null}
        </aside>

        <section className="profile-intelligence" aria-label="Related insights and spaces">
          <div>
            <span>Related insights</span>
            <h2>Follow the connections</h2>
            {relatedInsights.length > 0 ? (
              <ul>
                {relatedInsights.map((insight) => (
                  <li key={insight.id}><Link href={`/insights/${insight.id}` as Route}>{insight.title}</Link></li>
                ))}
              </ul>
            ) : (
              <p>No linked insight pages yet.</p>
            )}
            <h3>Related spaces</h3>
            <ul>{relatedSpaces.map((space) => <li key={space.id}><Link href={`/spaces#${space.id}` as Route}>{space.name}</Link></li>)}</ul>
            {profile.relatedEntities.length > 0 ? (
              <>
                <h3>Related profiles</h3>
                <ul>{profile.relatedEntities.map((entity) => <li key={entity.id}><Link href={entity.href as Route}>{entity.label}</Link></li>)}</ul>
              </>
            ) : null}
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

        {embeddableVideos.map((video) => (
          <section className="profile-video" key={video.youtubeId}>
            <div>
              <span>See the format</span>
              <h2>{video.title}</h2>
              <a
                aria-label={`Open ${profile.name} video on YouTube`}
                className="text-link"
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                rel="noreferrer"
                target="_blank"
              >
                Open on YouTube <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
              title={`${profile.name} video: ${video.title}`}
            />
          </section>
        ))}

        {profile.mediaFallback && embeddableVideos.length === 0 && !getCultureShaperImage(profile) ? (
          <aside className="profile-media-note" role="note" aria-label="Media note">
            <span>Media note</span>
            <p>{profile.mediaFallback}</p>
          </aside>
        ) : null}

        <a className="profile-channel-link" href={profile.officialUrl} target="_blank" rel="noreferrer">
          Open official destination <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </article>
    </main>
  );
}
