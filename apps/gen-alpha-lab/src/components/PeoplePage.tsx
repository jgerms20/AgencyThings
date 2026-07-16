import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { creators } from "@/lib/editorial";

const implications = [
  "Participation beats passive viewing.",
  "Personality carries across formats.",
  "Household permission still matters."
];

export default function PeoplePage() {
  return (
    <main className="people-page">
      <SiteHeader active="people" />

      <section className="page-opening people-opening">
        <h1>Creators are not just media. They are formats for behavior.</h1>
        <p>
          Gen Alpha does not only watch people. They copy the challenge, reaction, roleplay,
          tutorial, ritual, and way of inviting an audience in.
        </p>
      </section>

      <section className="creator-profiles" aria-label="Creators shaping Gen Alpha culture">
        {creators.map((creator, index) => (
          <article className="creator-profile" key={creator.id}>
            <img src={creator.portrait} alt={creator.portraitAlt} />
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{creator.name}</h2>
              <h3>{creator.role}</h3>
              <p>{creator.insight}</p>
              <a
                className="text-link"
                href={creator.profileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${creator.name}'s channel`}
              >
                Open channel <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="people-synthesis" aria-labelledby="people-synthesis-heading">
        <h2 id="people-synthesis-heading">What this adds up to</h2>
        <div>
          {implications.map((implication, index) => (
            <p key={implication}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {implication}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
