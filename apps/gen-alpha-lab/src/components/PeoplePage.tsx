import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { influencers } from "@/lib/influencers";

export default function PeoplePage() {
  return (
    <main className="people-page">
      <SiteHeader active="influencers" />
      <section className="page-opening influencer-opening">
        <h1>Influence has a face, a format, and an audience.</h1>
        <p>Thirty culture shapers reveal the behaviors Gen Alpha copies: the challenge, reaction, roleplay, ritual, routine, and invitation to participate.</p>
      </section>

      <section className="influencer-directory" aria-label="Influencers shaping Gen Alpha culture">
        {influencers.map((influencer, index) => (
          <article data-testid="influencer-card" key={influencer.id}>
            <Link href={`/influencers/${influencer.id}`} aria-label={`Explore ${influencer.name}`}>
              <img src={influencer.portrait} alt={influencer.name} />
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{influencer.name}</h2>
                <p>{influencer.role}</p>
                <small>{influencer.audience.replace("Core audience: ", "")}</small>
                <ArrowUpRight aria-hidden="true" size={19} />
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
