import { ExternalLink } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { spaces } from "@/lib/spaces";

export default function SpacesPage() {
  return (
    <main className="spaces-page">
      <SiteHeader active="spaces" />
      <section className="page-opening spaces-opening">
        <h1>Where time becomes culture.</h1>
        <p>These are not interchangeable channels. Each space enables a different mix of play, identity, friendship, discovery, and making.</p>
      </section>

      <section className="space-directory" aria-label="Digital spaces shaping Gen Alpha">
        {spaces.map((space, index) => (
          <article
            aria-labelledby={`${space.id}-heading`}
            className={`space-profile space-profile-${space.tone}`}
            data-testid="space-profile"
            id={space.id}
            key={space.id}
            style={{ scrollMarginTop: "6rem" }}
            tabIndex={-1}
          >
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`${space.id}-heading`}>{space.name}</h2>
                <p>{space.category}</p>
              </div>
              <strong>{space.audience}</strong>
            </header>
            <div className="space-explainer">
              <div><span>What it is</span><p>{space.whatItIs}</p></div>
              <div><span>How they use it</span><p>{space.howTheyUseIt}</p></div>
              <div><span>What it enables</span><p>{space.behavior}</p></div>
            </div>
            <footer>
              <p>{space.implication}</p>
              <div>
                {space.sources.map((source) => (
                  <a href={source.url} key={source.url} target="_blank" rel="noreferrer">
                    {source.label} <ExternalLink aria-hidden="true" size={14} />
                  </a>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
